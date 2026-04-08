require('ts-node/register');

const { selectRequiredModules, evaluateExpression } = require('../../src/services/complianceRulesEngine');

describe('Compliance rules engine', () => {
  test('evaluates expressions correctly', () => {
    const context = { profileType: 'NEWLY_REGISTERED', hasCTE: false };
    const expr = { op: 'eq', field: 'profileType', value: 'NEWLY_REGISTERED' };
    expect(evaluateExpression(expr, context)).toBe(true);
  });

  test('selects required modules based on profiles', async () => {
    const prisma = {
      complianceRequirementProfile: {
        findMany: async () => [
          {
            expression: { op: 'exists', field: 'profileType' },
            modules: [{ moduleType: 'OFFICERS_TRAINING', isRequired: true }],
          },
          {
            expression: { op: 'eq', field: 'hasCTE', value: true },
            modules: [{ moduleType: 'ATIR', isRequired: true }],
          },
        ],
      },
    };

    const context = { profileType: 'PRIMARY', hasCTE: true };
    const modules = await selectRequiredModules(prisma, context);
    const types = modules.map((m) => m.moduleType);
    expect(types).toContain('CAPR');
    expect(types).toContain('OFFICERS_TRAINING');
    expect(types).toContain('ATIR');
  });
});
