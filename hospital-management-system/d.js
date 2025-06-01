hospital-management-system git:(main) ✗ node prisma/seed.js
Database cleared successfully
Error seeding database: PrismaClientValidationError: 
Invalid `prisma.user.create()` invocation in
/project/workspace/hospital-management-system/prisma/seed.js:51:21

  48 
  49 const createdUsers = await prisma.$transaction(
  50   users.map(user =>
→ 51     prisma.user.create({
           data: {
             email: "patient1@example.com",
             name: "Patient 1",
             role: "PATIENT",
             password: "$2a$10$MCnHYD3.BUAQbxy4rviJ3e89DiyCaYXo2KmjdocxHENonYL0RX2oG",
             ~~~~~~~~
         ?   createdAt?: DateTime,
         ?   updatedAt?: DateTime,
         ?   doctor?: DoctorCreateNestedOneWithoutUserInput,
         ?   patient?: PatientCreateNestedOneWithoutUserInput,
         ?   payrolls?: PayrollCreateNestedManyWithoutUserInput,
         ?   cssdLogs?: CSSDLogCreateNestedManyWithoutUserInput,
         ?   cssdRequisitions?: CSSDRequisitionCreateNestedManyWithoutUserInput
           }
         })

Unknown argument `password`. Available options are marked with ?.
    at wn (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:29:1363)
    at $n.handleRequestError (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:121:6958)
    at $n.handleAndLogRequestError (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:121:6623)
    at $n.request (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:121:6307)
    at async l (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:130:9633) {
  clientVersion: '5.22.0'
}
Error in main: PrismaClientValidationError: 
Invalid `prisma.user.create()` invocation in
/project/workspace/hospital-management-system/prisma/seed.js:51:21

  48 
  49 const createdUsers = await prisma.$transaction(
  50   users.map(user =>
→ 51     prisma.user.create({
           data: {
             email: "patient1@example.com",
             name: "Patient 1",
             role: "PATIENT",
             password: "$2a$10$MCnHYD3.BUAQbxy4rviJ3e89DiyCaYXo2KmjdocxHENonYL0RX2oG",
             ~~~~~~~~
         ?   createdAt?: DateTime,
         ?   updatedAt?: DateTime,
         ?   doctor?: DoctorCreateNestedOneWithoutUserInput,
         ?   patient?: PatientCreateNestedOneWithoutUserInput,
         ?   payrolls?: PayrollCreateNestedManyWithoutUserInput,
         ?   cssdLogs?: CSSDLogCreateNestedManyWithoutUserInput,
         ?   cssdRequisitions?: CSSDRequisitionCreateNestedManyWithoutUserInput
           }
         })

Unknown argument `password`. Available options are marked with ?.
    at wn (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:29:1363)
    at $n.handleRequestError (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:121:6958)
    at $n.handleAndLogRequestError (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:121:6623)
    at $n.request (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:121:6307)
    at async l (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:130:9633) {
  clientVersion: '5.22.0'
}
➜  hospital-management-system git:(main) ✗ 