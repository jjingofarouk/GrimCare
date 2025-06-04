/*
  Warnings:

  - You are about to drop the column `prescriberId` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `prescribedToId` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `Transaction` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Pharmacist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pharmacistId" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "phone" TEXT,
    "specialty" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DispensingRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "prescriptionId" INTEGER NOT NULL,
    "medicationId" INTEGER NOT NULL,
    "patientType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "dispensedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dispensedById" INTEGER NOT NULL,
    "pharmacistId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "invoiceId" INTEGER,
    CONSTRAINT "DispensingRecord_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DispensingRecord_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DispensingRecord_dispensedById_fkey" FOREIGN KEY ("dispensedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DispensingRecord_pharmacistId_fkey" FOREIGN KEY ("pharmacistId") REFERENCES "Pharmacist" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "DispensingRecord_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_DispensingRecord" ("createdAt", "dispensedById", "dispensedDate", "id", "invoiceId", "medicationId", "patientType", "prescriptionId", "quantity", "updatedAt") SELECT "createdAt", "dispensedById", "dispensedDate", "id", "invoiceId", "medicationId", "patientType", "prescriptionId", "quantity", "updatedAt" FROM "DispensingRecord";
DROP TABLE "DispensingRecord";
ALTER TABLE "new_DispensingRecord" RENAME TO "DispensingRecord";
CREATE TABLE "new_Doctor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "doctorId" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "phone" TEXT,
    "office" TEXT,
    "departmentId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Doctor_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Doctor" ("createdAt", "departmentId", "doctorId", "id", "licenseNumber", "office", "phone", "specialty", "updatedAt") SELECT "createdAt", "departmentId", "doctorId", "id", "licenseNumber", "office", "phone", "specialty", "updatedAt" FROM "Doctor";
DROP TABLE "Doctor";
ALTER TABLE "new_Doctor" RENAME TO "Doctor";
CREATE UNIQUE INDEX "Doctor_doctorId_key" ON "Doctor"("doctorId");
CREATE UNIQUE INDEX "Doctor_licenseNumber_key" ON "Doctor"("licenseNumber");
CREATE TABLE "new_Patient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patientId" TEXT NOT NULL,
    "dateOfBirth" DATETIME,
    "gender" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "emergencyContact" TEXT,
    "emergencyContactPhone" TEXT,
    "insuranceProvider" TEXT,
    "insurancePolicy" TEXT,
    "bloodType" TEXT,
    "allergies" TEXT,
    "medicalHistory" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Patient" ("address", "allergies", "bloodType", "createdAt", "dateOfBirth", "emergencyContact", "emergencyContactPhone", "gender", "id", "insurancePolicy", "insuranceProvider", "medicalHistory", "patientId", "phone", "updatedAt") SELECT "address", "allergies", "bloodType", "createdAt", "dateOfBirth", "emergencyContact", "emergencyContactPhone", "gender", "id", "insurancePolicy", "insuranceProvider", "medicalHistory", "patientId", "phone", "updatedAt" FROM "Patient";
DROP TABLE "Patient";
ALTER TABLE "new_Patient" RENAME TO "Patient";
CREATE UNIQUE INDEX "Patient_patientId_key" ON "Patient"("patientId");
CREATE TABLE "new_Prescription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patientId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "pharmacistId" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "prescriptionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Prescription_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Prescription_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Prescription_pharmacistId_fkey" FOREIGN KEY ("pharmacistId") REFERENCES "Pharmacist" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Prescription" ("createdAt", "doctorId", "id", "notes", "patientId", "prescriptionDate", "status", "updatedAt") SELECT "createdAt", "doctorId", "id", "notes", "patientId", "prescriptionDate", "status", "updatedAt" FROM "Prescription";
DROP TABLE "Prescription";
ALTER TABLE "new_Prescription" RENAME TO "Prescription";
CREATE TABLE "new_Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "costCenterId" INTEGER,
    "patientId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Transaction_costCenterId_fkey" FOREIGN KEY ("costCenterId") REFERENCES "CostCenter" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Transaction_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("amount", "category", "costCenterId", "createdAt", "date", "description", "id", "patientId", "status", "type", "updatedAt") SELECT "amount", "category", "costCenterId", "createdAt", "date", "description", "id", "patientId", "status", "type", "updatedAt" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'PATIENT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "doctorId" INTEGER,
    "patientId" INTEGER,
    "pharmacistId" INTEGER,
    "dispensedById" INTEGER,
    "processedById" INTEGER,
    "adjustedById" INTEGER,
    CONSTRAINT "User_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_pharmacistId_fkey" FOREIGN KEY ("pharmacistId") REFERENCES "Pharmacist" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("adjustedById", "createdAt", "dispensedById", "doctorId", "email", "id", "name", "password", "patientId", "processedById", "role", "updatedAt") SELECT "adjustedById", "createdAt", "dispensedById", "doctorId", "email", "id", "name", "password", "patientId", "processedById", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_doctorId_key" ON "User"("doctorId");
CREATE UNIQUE INDEX "User_patientId_key" ON "User"("patientId");
CREATE UNIQUE INDEX "User_pharmacistId_key" ON "User"("pharmacistId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Pharmacist_pharmacistId_key" ON "Pharmacist"("pharmacistId");

-- CreateIndex
CREATE UNIQUE INDEX "Pharmacist_licenseNumber_key" ON "Pharmacist"("licenseNumber");
