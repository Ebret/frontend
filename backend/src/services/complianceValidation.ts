import { AssetSizeClass } from '@prisma/client';

export type FilingInput = {
  coverageYear: number;
  registrationNo: string;
  auditorCeaNo?: string | null;
  membershipTotal: number;
  membershipRegular: number;
  membershipAssociate: number;
  authorizedRep: {
    fullName: string;
    position: string;
    governmentIdType: string;
    governmentIdNo: string;
    mobile: string;
    email: string;
  };
  financialSummary?: {
    totalAssets?: number;
    totalLiabilities?: number;
    totalIncome?: number;
  };
};

export const deriveAssetSizeClass = (totalAssets?: number): AssetSizeClass | null => {
  if (totalAssets === undefined || totalAssets === null) return null;
  if (totalAssets <= 3_000_000) return 'MICRO';
  if (totalAssets <= 15_000_000) return 'SMALL';
  if (totalAssets <= 100_000_000) return 'MEDIUM';
  return 'LARGE';
};

export const validateFilingInput = (input: FilingInput) => {
  const errors: string[] = [];

  if (!input.coverageYear) errors.push('coverageYear is required');
  if (!input.registrationNo) errors.push('registrationNo is required');

  if (!input.authorizedRep?.fullName) errors.push('authorizedRep.fullName is required');
  if (!input.authorizedRep?.position) errors.push('authorizedRep.position is required');
  if (!input.authorizedRep?.governmentIdType) errors.push('authorizedRep.governmentIdType is required');
  if (!input.authorizedRep?.governmentIdNo) errors.push('authorizedRep.governmentIdNo is required');
  if (!input.authorizedRep?.mobile) errors.push('authorizedRep.mobile is required');
  if (!input.authorizedRep?.email) errors.push('authorizedRep.email is required');

  if (input.membershipTotal !== input.membershipRegular + input.membershipAssociate) {
    errors.push('membership subtotals must reconcile to total');
  }

  return errors;
};
