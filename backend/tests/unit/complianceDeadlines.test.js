require('ts-node/register');

const { computeAnnualDueDate, computeDeficiencyDeadline, computeLatePenalty } = require('../../src/services/complianceService');

describe('Compliance deadlines', () => {
  test('computes annual due date 120 days after year end', () => {
    const due = computeAnnualDueDate(2024);
    expect(due.toISOString().slice(0, 10)).toBe('2025-04-30');
  });

  test('computes deficiency deadline 15 days from notice', () => {
    const notice = new Date('2025-05-01T00:00:00Z');
    const deadline = computeDeficiencyDeadline(notice);
    expect(deadline.toISOString().slice(0, 10)).toBe('2025-05-16');
  });

  test('computes late penalty at 100 per day', () => {
    const due = new Date('2025-01-01T00:00:00Z');
    const submitted = new Date('2025-01-05T00:00:00Z');
    const result = computeLatePenalty(due, submitted);
    expect(result.daysLate).toBe(4);
    expect(result.amount).toBe(400);
  });
});
