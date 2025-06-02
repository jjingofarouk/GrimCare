hospital-management-system git:(main) ✗ node prisma/seed.js
Database cleared successfully
Error seeding database: PrismaClientValidationError: 
Invalid `prisma.patient.create()` invocation in
/project/workspace/hospital-management-system/prisma/seed.js:143:24

  140 
  141 const createdPatients = await prisma.$transaction(
  142   patients.map(patient =>
→ 143     prisma.patient.create({
            data: {
              userId: 1,
              ~~~~~~
              patientId: "P100000",
              dateOfBirth: new Date("2008-07-12T00:00:00.000Z"),
              gender: "Female",
              phone: "+256721579300",
              address: "Kampala",
              emergencyContact: "Contact 1",
              emergencyContactPhone: "+256749908784",
              insuranceProvider: "UAP",
              insurancePolicy: "POL10000",
              bloodType: "B+",
              allergies: null,
              medicalHistory: null,
          ?   createdAt?: DateTime,
          ?   updatedAt?: DateTime,
          ?   user?: UserCreateNestedOneWithoutPatientInput,
          ?   admissions?: AdmissionCreateNestedManyWithoutPatientInput,
          ?   discharges?: DischargeCreateNestedManyWithoutPatientInput,
          ?   transactions?: TransactionCreateNestedManyWithoutPatientInput
            }
          })

Unknown argument `userId`. Did you mean `user`? Available options are marked with ?.
    at wn (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:29:1363)
    at $n.handleRequestError (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:121:6958)
    at $n.handleAndLogRequestError (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:121:6623)
    at $n.request (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:121:6307)
    at async l (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:130:9633) {
  clientVersion: '5.22.0'
}
Error in main: PrismaClientValidationError: 
Invalid `prisma.patient.create()` invocation in
/project/workspace/hospital-management-system/prisma/seed.js:143:24

  140 
  141 const createdPatients = await prisma.$transaction(
  142   patients.map(patient =>
→ 143     prisma.patient.create({
            data: {
              userId: 1,
              ~~~~~~
              patientId: "P100000",
              dateOfBirth: new Date("2008-07-12T00:00:00.000Z"),
              gender: "Female",
              phone: "+256721579300",
              address: "Kampala",
              emergencyContact: "Contact 1",
              emergencyContactPhone: "+256749908784",
              insuranceProvider: "UAP",
              insurancePolicy: "POL10000",
              bloodType: "B+",
              allergies: null,
              medicalHistory: null,
          ?   createdAt?: DateTime,
          ?   updatedAt?: DateTime,
          ?   user?: UserCreateNestedOneWithoutPatientInput,
          ?   admissions?: AdmissionCreateNestedManyWithoutPatientInput,
          ?   discharges?: DischargeCreateNestedManyWithoutPatientInput,
          ?   transactions?: TransactionCreateNestedManyWithoutPatientInput
            }
          })

Unknown argument `userId`. Did you mean `user`? Available options are marked with ?.
    at wn (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:29:1363)
    at $n.handleRequestError (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:121:6958)
    at $n.handleAndLogRequestError (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:121:6623)
    at $n.request (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:121:6307)
    at async l (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:130:9633) {
  clientVersion: '5.22.0'
}
➜  hospital-management-system git:(main) ✗ 