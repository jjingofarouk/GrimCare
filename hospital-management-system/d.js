hospital-management-system git:(main) ✗ node prisma/seed.js
Error seeding database: PrismaClientValidationError: 
Invalid `prisma.doctor.create()` invocation in
/project/workspace/hospital-management-system/prisma/seed.js:78:23

  75 
  76 const createdDoctors = await Promise.all(
  77   doctors.map(doctor =>
→ 78     prisma.doctor.create({
           data: {
             userId: 17,
             ~~~~~~
             specialty: "Cardiology",
             licenseNumber: "LIC10001",
         ?   createdAt?: DateTime,
         ?   updatedAt?: DateTime,
         ?   user?: UserCreateNestedOneWithoutDoctorInput,
         ?   admissions?: AdmissionCreateNestedManyWithoutDoctorInput
           }
         })

Unknown argument `userId`. Did you mean `user`? Available options are marked with ?.
    at wn (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:29:1363)
    at $n.handleRequestError (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:121:6958)
    at $n.handleAndLogRequestError (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:121:6623)
    at $n.request (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:121:6307)
    at async l (/project/workspace/hospital-management-system/node_modules/@prisma/client/runtime/library.js:130:9633)
    at async Promise.all (index 0)
    at async main (/project/workspace/hospital-management-system/prisma/seed.js:76:28) {
  clientVersion: '5.22.0'
}
➜  hospital-management-system git:(main) ✗ 