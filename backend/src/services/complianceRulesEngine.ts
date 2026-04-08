import { PrismaClient, ComplianceModuleType } from '@prisma/client';

export type RulesContext = {
  profileType: string;
  hasCTE: boolean;
  isElectric: boolean;
  isNewlyRegistered: boolean;
  coverageYear: number;
  registrationYear?: number;
};

type Expression =
  | { op: 'and'; args: Expression[] }
  | { op: 'or'; args: Expression[] }
  | { op: 'not'; arg: Expression }
  | { op: 'eq'; field: string; value: any }
  | { op: 'in'; field: string; values: any[] }
  | { op: 'exists'; field: string }
  | { op: 'gte'; field: string; value: number }
  | { op: 'lte'; field: string; value: number };

const getField = (context: Record<string, any>, path: string) => {
  return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), context);
};

export const evaluateExpression = (expr: Expression, context: Record<string, any>): boolean => {
  switch (expr.op) {
    case 'and':
      return expr.args.every((arg) => evaluateExpression(arg, context));
    case 'or':
      return expr.args.some((arg) => evaluateExpression(arg, context));
    case 'not':
      return !evaluateExpression(expr.arg, context);
    case 'eq':
      return getField(context, expr.field) === expr.value;
    case 'in':
      return expr.values.includes(getField(context, expr.field));
    case 'exists':
      return getField(context, expr.field) !== undefined && getField(context, expr.field) !== null;
    case 'gte':
      return getField(context, expr.field) >= expr.value;
    case 'lte':
      return getField(context, expr.field) <= expr.value;
    default:
      return false;
  }
};

export const selectRequiredModules = async (
  prisma: PrismaClient,
  context: RulesContext
): Promise<{ moduleType: ComplianceModuleType; isRequired: boolean }[]> => {
  const profiles = await prisma.complianceRequirementProfile.findMany({
    where: { isActive: true },
    include: { modules: true },
  });

  const baseModules = new Map<ComplianceModuleType, boolean>();
  baseModules.set('CAPR', true);

  profiles.forEach((profile) => {
    const profileMatch = evaluateExpression(profile.expression as Expression, context);
    if (!profileMatch) return;

    profile.modules.forEach((module) => {
      const condition = module.condition as Expression | null;
      const isApplicable = condition ? evaluateExpression(condition, context) : true;
      if (!isApplicable) return;
      baseModules.set(module.moduleType, module.isRequired);
    });
  });

  return Array.from(baseModules.entries()).map(([moduleType, isRequired]) => ({
    moduleType,
    isRequired,
  }));
};
