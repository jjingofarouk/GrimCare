/*
  Warnings:

  - You are about to drop the `Pharmacist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `pharmacistId` on the `DispensingRecord` table. All the data in the column will be lost.
  - You are about to drop the column `pharmacistId` on the `Prescription` table. All the data in the column will be lost.
  - You are about to drop the column `pharmacistId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Pharmacist_licenseNumber_key";

-- DropIndex
DROP INDEX "Pharmacist_pharmacistId_key";

-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN "prescriberId" INTEGER;

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN "prescribedToId" INTEGER;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN "transactionId" INTEGER;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Pharmacist";
PRAGMA foreign_keys=on;

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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "invoiceId" INTEGER,
    CONSTRAINT "DispensingRecord_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DispensingRecord_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DispensingRecord_dispensedById_fkey" FOREIGN KEY ("dispensedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DispensingRecord_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_DispensingRecord" ("createdAt", "dispensedById", "dispensedDate", "id", "invoiceId", "medicationId", "patientType", "prescriptionId", "quantity", "updatedAt") SELECT "createdAt", "dispensedById", "dispensedDate", "id", "invoiceId", "medicationId", "patientType", "prescriptionId", "quantity", "updatedAt" FROM "DispensingRecord";
DROP TABLE "DispensingRecord";
ALTER TABLE "new_DispensingRecord" RENAME TO "DispensingRecord";
CREATE TABLE "new_Prescription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patientId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "prescriptionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Prescription_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Prescription_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Prescription" ("createdAt", "doctorId", "id", "notes", "patientId", "prescriptionDate", "status", "updatedAt") SELECT "createdAt", "doctorId", "id", "notes", "patientId", "prescriptionDate", "status", "updatedAt" FROM "Prescription";
DROP TABLE "Prescription";
ALTER TABLE "new_Prescription" RENAME TO "Prescription";
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
    "dispensedById" INTEGER,
    "processedById" INTEGER,
    "adjustedById" INTEGER,
    CONSTRAINT "User_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("adjustedById", "createdAt", "dispensedById", "doctorId", "email", "id", "name", "password", "patientId", "processedById", "role", "updatedAt") SELECT "adjustedById", "createdAt", "dispensedById", "doctorId", "email", "id", "name", "password", "patientId", "processedById", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_doctorId_key" ON "User"("doctorId");
CREATE UNIQUE INDEX "User_patientId_key" ON "User"("patientId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
