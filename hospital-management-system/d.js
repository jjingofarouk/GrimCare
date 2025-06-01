hospital-management-system git:(main) ✗ npx prisma migrate dev --name cssd
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": SQLite database "dev.db" at "file:./dev.db"


Error: Prisma schema validation - (validate wasm)
Error code: P1012
error: Error validating field `user` in model `CSSDRequisition`: The relation field `user` on model `CSSDRequisition` is missing an opposite relation field on the model `User`. Either run `prisma format` or add it manually.
  -->  prisma/schema.prisma:172
   | 
171 |   requestedBy     Int
172 |   user            User      @relation(fields: [requestedBy], references: [id])
173 |   quantity        Int
   | 

Validation Error Count: 1
[Context: validate]

Prisma CLI Version : 5.22.0
➜  hospital-management-system git:(main) ✗ 