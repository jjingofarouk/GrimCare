hospital-management-system git:(main) ✗ node prisma/seed.js
Database cleared successfully
Error seeding database: PrismaClientValidationError: 
Invalid `prisma.patient.create()` invocation in
/project/workspace/hospital-management-system/prisma/seed.js:137:24

  134 
  135 const createdPatients = await Promise.all(
  136   patients.map(patient =>
→ 137     prisma.patient.create({
            data: {
              userId: 33,
              dateOfBirth: new Date("1979-07-26T00:00:00.000Z"),
              gender: "Female",
              phone: "256-708127551",
              address: "Jinja",
              emergencyContact: "256-707239711",
              insuranceProvider: "UAP",
              insurancePolicy: "SAN10800",
              patientId: "LMX465382",
              ~~~~~~~~~
          ?   id?: Int,
          ?   createdAt?: DateTime,
          ?   updatedAt?: DateTime,
          ?   admissions?: AdmissionUncheckedCreateNestedManyWithoutPatientInput
            }
          })

Unknown argument `patientId`. Available options are marked with ?.
    at wn (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:29:1363)
    at $n.handleRequestError (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:121:6958)
    at $n.handleAndLogRequestError (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:121:6623)
    at $n.request (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:121:6307)
    at async l (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:130:9633)
    at async Promise.all (index 0)
    at async seedDatabase (/project/workspace/hospital-management-system/prisma/seed.js:135:29)
    at async main (/project/workspace/hospital-management-system/prisma/seed.js:314:5) {
  clientVersion: '5.22.0'
}
Error in main: PrismaClientValidationError: 
Invalid `prisma.patient.create()` invocation in
/project/workspace/hospital-management-system/prisma/seed.js:137:24

  134 
  135 const createdPatients = await Promise.all(
  136   patients.map(patient =>
→ 137     prisma.patient.create({
            data: {
              userId: 33,
              dateOfBirth: new Date("1979-07-26T00:00:00.000Z"),
              gender: "Female",
              phone: "256-708127551",
              address: "Jinja",
              emergencyContact: "256-707239711",
              insuranceProvider: "UAP",
              insurancePolicy: "SAN10800",
              patientId: "LMX465382",
              ~~~~~~~~~
          ?   id?: Int,
          ?   createdAt?: DateTime,
          ?   updatedAt?: DateTime,
          ?   admissions?: AdmissionUncheckedCreateNestedManyWithoutPatientInput
            }
          })

Unknown argument `patientId`. Available options are marked with ?.
    at wn (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:29:1363)
    at $n.handleRequestError (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:121:6958)
    at $n.handleAndLogRequestError (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:121:6623)
    at $n.request (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:121:6307)
    at async l (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:130:9633)
    at async Promise.all (index 0)
    at async seedDatabase (/project/workspace/hospital-management-system/prisma/seed.js:135:29)
    at async main (/project/workspace/hospital-management-system/prisma/seed.js:314:5) {
  clientVersion: '5.22.0'
}
➜  hospital-management-system git:(main) ✗ 