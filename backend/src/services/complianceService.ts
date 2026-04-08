import { PrismaClient, ComplianceFilingStatus, ComplianceModuleStatus } from '@prisma/client';
import { selectRequiredModules, RulesContext } from './complianceRulesEngine';
import { deriveAssetSizeClass, validateFilingInput, FilingInput } from './complianceValidation';

export const computeAnnualDueDate = (coverageYear: number) => {
  const endOfYear = new Date(`${coverageYear}-12-31T00:00:00.000Z`);
  const due = new Date(endOfYear);
  due.setUTCDate(due.getUTCDate() + 120);
  return due;
};

export const computeDeficiencyDeadline = (noticeDate: Date) => {
  const deadline = new Date(noticeDate);
  deadline.setDate(deadline.getDate() + 15);
  return deadline;
};

export const computeLatePenalty = (dueDate: Date, submittedAt: Date, ratePerDay = 100) => {
  const diff = Math.max(0, submittedAt.getTime() - dueDate.getTime());
  const daysLate = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return { daysLate, amount: daysLate * ratePerDay };
};

export const createComplianceFiling = async (
  prisma: PrismaClient,
  cooperativeId: number,
  context: RulesContext,
  input: FilingInput
) => {
  const validationErrors = validateFilingInput(input);
  if (validationErrors.length) {
    return { errors: validationErrors };
  }

  const assetSizeClass = deriveAssetSizeClass(input.financialSummary?.totalAssets);

  const authorizedRep = await prisma.complianceAuthorizedRep.create({
    data: {
      cooperativeId,
      fullName: input.authorizedRep.fullName,
      position: input.authorizedRep.position,
      governmentIdType: input.authorizedRep.governmentIdType,
      governmentIdNo: input.authorizedRep.governmentIdNo,
      mobile: input.authorizedRep.mobile,
      email: input.authorizedRep.email,
    },
  });

  const filing = await prisma.complianceFiling.create({
    data: {
      cooperativeId,
      coverageYear: input.coverageYear,
      registrationNo: input.registrationNo,
      auditorCeaNo: input.auditorCeaNo || null,
      profileType: context.profileType as any,
      hasCTE: context.hasCTE,
      membershipTotal: input.membershipTotal,
      membershipRegular: input.membershipRegular,
      membershipAssociate: input.membershipAssociate,
      assetSizeClass,
      authorizedRepId: authorizedRep.id,
      completeness: { overall: 'INCOMPLETE' },
    },
  });

  if (assetSizeClass) {
    await prisma.cooperative.update({
      where: { id: cooperativeId },
      data: { assetSizeClass },
    });
  }

  const requiredModules = await selectRequiredModules(prisma, context);

  await prisma.complianceFilingModule.createMany({
    data: requiredModules.map((mod) => ({
      filingId: filing.id,
      moduleType: mod.moduleType,
      isRequired: mod.isRequired,
      status: ComplianceModuleStatus.NOT_STARTED,
    })),
  });

  return { filing };
};

export const canSubmitFiling = async (prisma: PrismaClient, filingId: number) => {
  const modules = await prisma.complianceFilingModule.findMany({
    where: { filingId, isRequired: true },
  });
  return modules.every((m) => m.status === ComplianceModuleStatus.COMPLETE);
};

export const updateFilingStatus = async (
  prisma: PrismaClient,
  filingId: number,
  status: ComplianceFilingStatus
) => {
  if (status === ComplianceFilingStatus.SUBMITTED) {
    const ok = await canSubmitFiling(prisma, filingId);
    if (!ok) {
      return { error: 'Cannot submit: required modules incomplete' };
    }
  }
  const updated = await prisma.complianceFiling.update({
    where: { id: filingId },
    data: { filingStatus: status },
  });
  return { filing: updated };
};
