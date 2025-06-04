@faroukjjingo ➜ /workspaces/GrimCare/hospital-management-system (main) $ npx prisma migrate dev
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": SQLite database "dev.db" at "file:./dev.db"


Error: Prisma schema validation - (validate wasm)
Error code: P1012
error: Error parsing attribute "@relation": The relation field `prescriptions` on Model `Patient` must not specify the `fields` or `references` argument in the @relation attribute. You must only specify it on the opposite field `patient` on model `Prescription`.
  -->  prisma/schema.prisma:73
   | 
72 |   appointments          Appointment[]     @relation("PatientAppointments")
73 |   prescriptions         Prescription[]    @relation(fields: [prescribedToId], references: [id])
74 |   prescribedToId        Int?
   | 
error: Error parsing attribute "@relation": The relation field `prescriptions` on Model `Doctor` must not specify the `fields` or `references` argument in the @relation attribute. You must only specify it on the opposite field `doctor` on model `Prescription`.
  -->  prisma/schema.prisma:50
   | 
49 |   availability      DoctorAvailability[]
50 |   prescriptions     Prescription[]        @relation(fields: [prescriberId], references: [id])
51 |   prescriberId      Int?
   | 
error: Error parsing attribute "@relation": The relation field `dispensingRecords` on Model `User` must not specify the `fields` or `references` argument in the @relation attribute. You must only specify it on the opposite field `dispensedBy` on model `DispensingRecord`.
  -->  prisma/schema.prisma:26
   | 
25 |   appointments      Appointment[]      @relation("BookedBy")
26 |   dispensingRecords DispensingRecord[] @relation(fields: [dispensedById], references: [id])
27 |   dispensedById     Int?
   | 
error: Error parsing attribute "@relation": The relation field `invoices` on Model `Transaction` must not specify the `fields` or `references` argument in the @relation attribute. You must only specify it on the opposite field `transaction` on model `Invoice`.
  -->  prisma/schema.prisma:197
   | 
196 |   updatedAt     DateTime      @updatedAt
197 |   invoices      Invoice[]     @relation(fields: [transactionId], references: [id])
198 |   transactionId Int?
   | 
error: Error parsing attribute "@relation": The relation field `refunds` on Model `User` must not specify the `fields` or `references` argument in the @relation attribute. You must only specify it on the opposite field `processedBy` on model `Refund`.
  -->  prisma/schema.prisma:28
   | 
27 |   dispensedById     Int?
28 |   refunds           Refund[]           @relation(fields: [processedById], references: [id])
29 |   processedById     Int?
   | 
error: Error parsing attribute "@relation": The relation field `stockAdjustments` on Model `User` must not specify the `fields` or `references` argument in the @relation attribute. You must only specify it on the opposite field `adjustedBy` on model `StockAdjustment`.
  -->  prisma/schema.prisma:30
   | 
29 |   processedById     Int?
30 |   stockAdjustments  StockAdjustment[]  @relation(fields: [adjustedById], references: [id])
31 |   adjustedById      Int?
   | 

Validation Error Count: 6
[Context: validate]

Prisma CLI Version : 5.22.0
@faroukjjingo ➜ /workspaces/GrimCare/hospital-management-system (main) $ 