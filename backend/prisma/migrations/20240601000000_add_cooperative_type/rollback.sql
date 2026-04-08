-- Drop the SystemConfig table
DROP TABLE IF EXISTS "SystemConfig";

-- Remove the type column from Cooperative
ALTER TABLE "Cooperative" DROP COLUMN IF EXISTS "type";

-- Drop the CooperativeType enum
DROP TYPE IF EXISTS "CooperativeType";
