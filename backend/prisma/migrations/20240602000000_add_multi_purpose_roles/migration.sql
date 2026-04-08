-- Add Multi-Purpose Cooperative specific roles to the Role enum
ALTER TYPE "Role" ADD VALUE 'INVENTORY_MANAGER';
ALTER TYPE "Role" ADD VALUE 'STORE_MANAGER';
ALTER TYPE "Role" ADD VALUE 'CASHIER';
ALTER TYPE "Role" ADD VALUE 'PURCHASING_OFFICER';
ALTER TYPE "Role" ADD VALUE 'SALES_ASSOCIATE';

-- Add Multi-Purpose Cooperative specific permissions
INSERT INTO "Permission" (name, description, "createdAt", "updatedAt")
VALUES
  -- Inventory permissions
  ('VIEW_INVENTORY', 'Permission to view inventory items and levels', NOW(), NOW()),
  ('MANAGE_INVENTORY', 'Permission to add, edit, and delete inventory items', NOW(), NOW()),
  ('ADJUST_INVENTORY', 'Permission to make inventory adjustments', NOW(), NOW()),
  ('APPROVE_INVENTORY_ADJUSTMENTS', 'Permission to approve inventory adjustments', NOW(), NOW()),
  
  -- Product permissions
  ('VIEW_PRODUCTS', 'Permission to view product catalog', NOW(), NOW()),
  ('MANAGE_PRODUCTS', 'Permission to add, edit, and delete products', NOW(), NOW()),
  ('SET_PRODUCT_PRICES', 'Permission to set and update product prices', NOW(), NOW()),
  
  -- Supplier permissions
  ('VIEW_SUPPLIERS', 'Permission to view supplier information', NOW(), NOW()),
  ('MANAGE_SUPPLIERS', 'Permission to add, edit, and delete suppliers', NOW(), NOW()),
  ('APPROVE_SUPPLIERS', 'Permission to approve new suppliers', NOW(), NOW()),
  
  -- Purchase permissions
  ('CREATE_PURCHASE_ORDER', 'Permission to create purchase orders', NOW(), NOW()),
  ('APPROVE_PURCHASE_ORDER', 'Permission to approve purchase orders', NOW(), NOW()),
  ('RECEIVE_INVENTORY', 'Permission to receive inventory from suppliers', NOW(), NOW()),
  
  -- Sales permissions
  ('ACCESS_POS', 'Permission to access the point of sale system', NOW(), NOW()),
  ('PROCESS_SALES', 'Permission to process sales transactions', NOW(), NOW()),
  ('APPLY_DISCOUNTS', 'Permission to apply discounts to sales', NOW(), NOW()),
  ('VOID_SALES', 'Permission to void sales transactions', NOW(), NOW()),
  ('MANAGE_CASH_DRAWER', 'Permission to manage the cash drawer', NOW(), NOW()),
  
  -- Sales reporting permissions
  ('VIEW_SALES_REPORTS', 'Permission to view sales reports', NOW(), NOW()),
  ('VIEW_INVENTORY_REPORTS', 'Permission to view inventory reports', NOW(), NOW());

-- Assign permissions to Admin role
INSERT INTO "RolePermission" ("roleId", "permissionId", "createdAt", "updatedAt")
SELECT 
  (SELECT id FROM "Role" WHERE name = 'ADMIN'),
  id,
  NOW(),
  NOW()
FROM "Permission"
WHERE name IN (
  'VIEW_INVENTORY',
  'MANAGE_INVENTORY',
  'ADJUST_INVENTORY',
  'APPROVE_INVENTORY_ADJUSTMENTS',
  'VIEW_PRODUCTS',
  'MANAGE_PRODUCTS',
  'SET_PRODUCT_PRICES',
  'VIEW_SUPPLIERS',
  'MANAGE_SUPPLIERS',
  'APPROVE_SUPPLIERS',
  'CREATE_PURCHASE_ORDER',
  'APPROVE_PURCHASE_ORDER',
  'RECEIVE_INVENTORY',
  'ACCESS_POS',
  'PROCESS_SALES',
  'APPLY_DISCOUNTS',
  'VOID_SALES',
  'MANAGE_CASH_DRAWER',
  'VIEW_SALES_REPORTS',
  'VIEW_INVENTORY_REPORTS'
);

-- Assign permissions to General Manager role
INSERT INTO "RolePermission" ("roleId", "permissionId", "createdAt", "updatedAt")
SELECT 
  (SELECT id FROM "Role" WHERE name = 'GENERAL_MANAGER'),
  id,
  NOW(),
  NOW()
FROM "Permission"
WHERE name IN (
  'VIEW_INVENTORY',
  'VIEW_PRODUCTS',
  'VIEW_SUPPLIERS',
  'APPROVE_INVENTORY_ADJUSTMENTS',
  'APPROVE_PURCHASE_ORDER',
  'APPROVE_SUPPLIERS',
  'SET_PRODUCT_PRICES',
  'VIEW_SALES_REPORTS',
  'VIEW_INVENTORY_REPORTS'
);

-- Assign permissions to Inventory Manager role
INSERT INTO "Role" (name, description, "createdAt", "updatedAt")
VALUES ('INVENTORY_MANAGER', 'Manages inventory levels, product catalog, and stock adjustments', NOW(), NOW());

INSERT INTO "RolePermission" ("roleId", "permissionId", "createdAt", "updatedAt")
SELECT 
  (SELECT id FROM "Role" WHERE name = 'INVENTORY_MANAGER'),
  id,
  NOW(),
  NOW()
FROM "Permission"
WHERE name IN (
  'VIEW_DASHBOARD',
  'VIEW_INVENTORY',
  'MANAGE_INVENTORY',
  'ADJUST_INVENTORY',
  'VIEW_PRODUCTS',
  'MANAGE_PRODUCTS',
  'VIEW_SUPPLIERS',
  'RECEIVE_INVENTORY',
  'VIEW_INVENTORY_REPORTS'
);

-- Assign permissions to Store Manager role
INSERT INTO "Role" (name, description, "createdAt", "updatedAt")
VALUES ('STORE_MANAGER', 'Oversees retail operations, pricing, and store performance', NOW(), NOW());

INSERT INTO "RolePermission" ("roleId", "permissionId", "createdAt", "updatedAt")
SELECT 
  (SELECT id FROM "Role" WHERE name = 'STORE_MANAGER'),
  id,
  NOW(),
  NOW()
FROM "Permission"
WHERE name IN (
  'VIEW_DASHBOARD',
  'VIEW_INVENTORY',
  'VIEW_PRODUCTS',
  'MANAGE_PRODUCTS',
  'SET_PRODUCT_PRICES',
  'VIEW_SUPPLIERS',
  'MANAGE_SUPPLIERS',
  'CREATE_PURCHASE_ORDER',
  'ACCESS_POS',
  'PROCESS_SALES',
  'APPLY_DISCOUNTS',
  'VOID_SALES',
  'MANAGE_CASH_DRAWER',
  'VIEW_SALES_REPORTS',
  'VIEW_INVENTORY_REPORTS'
);

-- Assign permissions to Cashier role
INSERT INTO "Role" (name, description, "createdAt", "updatedAt")
VALUES ('CASHIER', 'Operates point of sale system and handles cash transactions', NOW(), NOW());

INSERT INTO "RolePermission" ("roleId", "permissionId", "createdAt", "updatedAt")
SELECT 
  (SELECT id FROM "Role" WHERE name = 'CASHIER'),
  id,
  NOW(),
  NOW()
FROM "Permission"
WHERE name IN (
  'VIEW_DASHBOARD',
  'ACCESS_POS',
  'PROCESS_SALES',
  'MANAGE_CASH_DRAWER',
  'VIEW_PRODUCTS'
);

-- Assign permissions to Purchasing Officer role
INSERT INTO "Role" (name, description, "createdAt", "updatedAt")
VALUES ('PURCHASING_OFFICER', 'Manages supplier relationships and procurement processes', NOW(), NOW());

INSERT INTO "RolePermission" ("roleId", "permissionId", "createdAt", "updatedAt")
SELECT 
  (SELECT id FROM "Role" WHERE name = 'PURCHASING_OFFICER'),
  id,
  NOW(),
  NOW()
FROM "Permission"
WHERE name IN (
  'VIEW_DASHBOARD',
  'VIEW_INVENTORY',
  'VIEW_PRODUCTS',
  'VIEW_SUPPLIERS',
  'MANAGE_SUPPLIERS',
  'CREATE_PURCHASE_ORDER',
  'RECEIVE_INVENTORY'
);

-- Assign permissions to Sales Associate role
INSERT INTO "Role" (name, description, "createdAt", "updatedAt")
VALUES ('SALES_ASSOCIATE', 'Assists members with purchases and provides product information', NOW(), NOW());

INSERT INTO "RolePermission" ("roleId", "permissionId", "createdAt", "updatedAt")
SELECT 
  (SELECT id FROM "Role" WHERE name = 'SALES_ASSOCIATE'),
  id,
  NOW(),
  NOW()
FROM "Permission"
WHERE name IN (
  'VIEW_DASHBOARD',
  'ACCESS_POS',
  'PROCESS_SALES',
  'VIEW_PRODUCTS'
);
