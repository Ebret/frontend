import { Request, Response } from 'express';
import { PrismaClient, ComplianceFilingStatus, ComplianceModuleStatus } from '@prisma/client';
import { createComplianceFiling, updateFilingStatus, computeDeficiencyDeadline, computeLatePenalty } from '../services/complianceService';
import { selectRequiredModules } from '../services/complianceRulesEngine';

const prisma = new PrismaClient();

export const createFiling = async (req: Request, res: Response) => {
  try {
    const { cooperativeId, context, filing } = req.body;
    const result = await createComplianceFiling(prisma, Number(cooperativeId), context, filing);
    if ('errors' in result) {
      return res.status(400).json({ status: 'error', errors: result.errors });
    }
    return res.status(201).json({ status: 'success', data: result.filing });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Failed to create filing' });
  }
};

export const getFiling = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const filing = await prisma.complianceFiling.findUnique({
    where: { id },
    include: { modules: true, deficiencies: true, penalties: true },
  });
  if (!filing) return res.status(404).json({ status: 'error', message: 'Not found' });
  return res.status(200).json({ status: 'success', data: filing });
};

export const listRequirements = async (req: Request, res: Response) => {
  const context = req.body?.context;
  const modules = await selectRequiredModules(prisma, context);
  return res.status(200).json({ status: 'success', data: modules });
};

export const completeModule = async (req: Request, res: Response) => {
  const filingId = Number(req.params.id);
  const { moduleType, evidenceUrl } = req.body;
  const updated = await prisma.complianceFilingModule.updateMany({
    where: { filingId, moduleType },
    data: { status: ComplianceModuleStatus.COMPLETE, evidenceUrl },
  });
  const modules = await prisma.complianceFilingModule.findMany({ where: { filingId } });
  const required = modules.filter((m) => m.isRequired);
  const complete = required.filter((m) => m.status === ComplianceModuleStatus.COMPLETE);
  const completeness = {
    requiredTotal: required.length,
    requiredComplete: complete.length,
    overall: complete.length === required.length ? 'COMPLETE' : 'INCOMPLETE',
  };
  await prisma.complianceFiling.update({
    where: { id: filingId },
    data: { completeness },
  });
  return res.status(200).json({ status: 'success', data: updated });
};

export const setStatus = async (req: Request, res: Response) => {
  const filingId = Number(req.params.id);
  const { status } = req.body;
  const result = await updateFilingStatus(prisma, filingId, status as ComplianceFilingStatus);
  if ('error' in result) return res.status(400).json({ status: 'error', message: result.error });
  return res.status(200).json({ status: 'success', data: result.filing });
};

export const createDeficiency = async (req: Request, res: Response) => {
  const filingId = Number(req.params.id);
  const { noticeDate, details } = req.body;
  const deadlineDate = computeDeficiencyDeadline(new Date(noticeDate));
  const deficiency = await prisma.complianceDeficiency.create({
    data: { filingId, noticeDate: new Date(noticeDate), deadlineDate, details },
  });
  await prisma.complianceFiling.update({
    where: { id: filingId },
    data: { filingStatus: ComplianceFilingStatus.DEFICIENCY_NOTED },
  });
  return res.status(201).json({ status: 'success', data: deficiency });
};

export const assessLatePenalty = async (req: Request, res: Response) => {
  const filingId = Number(req.params.id);
  const { dueDate, submittedAt } = req.body;
  const penalty = computeLatePenalty(new Date(dueDate), new Date(submittedAt));
  const record = await prisma.compliancePenalty.create({
    data: { filingId, daysLate: penalty.daysLate, amount: penalty.amount },
  });
  return res.status(201).json({ status: 'success', data: record });
};
