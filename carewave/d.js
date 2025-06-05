prisma git:(main) ✗ npx prisma validate
Environment variables loaded from ../.env
Prisma schema loaded from schema.prisma

Error: Prisma schema validation - (validate wasm)
Error code: P1012
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:10
   | 
 9 | 
10 | include "modules/dashboard.prisma"
11 | include "modules/patients.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:11
   | 
10 | include "modules/dashboard.prisma"
11 | include "modules/patients.prisma"
12 | include "modules/doctor.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:12
   | 
11 | include "modules/patients.prisma"
12 | include "modules/doctor.prisma"
13 | include "modules/appointments.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:13
   | 
12 | include "modules/doctor.prisma"
13 | include "modules/appointments.prisma"
14 | include "modules/adt.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:14
   | 
13 | include "modules/appointments.prisma"
14 | include "modules/adt.prisma"
15 | include "modules/emergency.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:15
   | 
14 | include "modules/adt.prisma"
15 | include "modules/emergency.prisma"
16 | include "modules/queue-mgmt.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:16
   | 
15 | include "modules/emergency.prisma"
16 | include "modules/queue-mgmt.prisma"
17 | include "modules/clinical.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:17
   | 
16 | include "modules/queue-mgmt.prisma"
17 | include "modules/clinical.prisma"
18 | include "modules/laboratory.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:18
   | 
17 | include "modules/clinical.prisma"
18 | include "modules/laboratory.prisma"
19 | include "modules/radiology.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:19
   | 
18 | include "modules/laboratory.prisma"
19 | include "modules/radiology.prisma"
20 | include "modules/operation-theatre.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:20
   | 
19 | include "modules/radiology.prisma"
20 | include "modules/operation-theatre.prisma"
21 | include "modules/clinical-settings.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:21
   | 
20 | include "modules/operation-theatre.prisma"
21 | include "modules/clinical-settings.prisma"
22 | include "modules/cssd.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:22
   | 
21 | include "modules/clinical-settings.prisma"
22 | include "modules/cssd.prisma"
23 | include "modules/nursing.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:23
   | 
22 | include "modules/cssd.prisma"
23 | include "modules/nursing.prisma"
24 | include "modules/maternity.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:24
   | 
23 | include "modules/nursing.prisma"
24 | include "modules/maternity.prisma"
25 | include "modules/vaccination.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:25
   | 
24 | include "modules/maternity.prisma"
25 | include "modules/vaccination.prisma"
26 | include "modules/pharmacy.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:26
   | 
25 | include "modules/vaccination.prisma"
26 | include "modules/pharmacy.prisma"
27 | include "modules/dispensary.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:27
   | 
26 | include "modules/pharmacy.prisma"
27 | include "modules/dispensary.prisma"
28 | include "modules/billing.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:28
   | 
27 | include "modules/dispensary.prisma"
28 | include "modules/billing.prisma"
29 | include "modules/accounting.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:29
   | 
28 | include "modules/billing.prisma"
29 | include "modules/accounting.prisma"
30 | include "modules/claim-mgmt.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:30
   | 
29 | include "modules/accounting.prisma"
30 | include "modules/claim-mgmt.prisma"
31 | include "modules/nhif.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:31
   | 
30 | include "modules/claim-mgmt.prisma"
31 | include "modules/nhif.prisma"
32 | include "modules/incentive.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:32
   | 
31 | include "modules/nhif.prisma"
32 | include "modules/incentive.prisma"
33 | include "modules/inventory.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:33
   | 
32 | include "modules/incentive.prisma"
33 | include "modules/inventory.prisma"
34 | include "modules/procurement.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:34
   | 
33 | include "modules/inventory.prisma"
34 | include "modules/procurement.prisma"
35 | include "modules/substore.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:35
   | 
34 | include "modules/procurement.prisma"
35 | include "modules/substore.prisma"
36 | include "modules/fixed-assets.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:36
   | 
35 | include "modules/substore.prisma"
36 | include "modules/fixed-assets.prisma"
37 | include "modules/reports.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:37
   | 
36 | include "modules/fixed-assets.prisma"
37 | include "modules/reports.prisma"
38 | include "modules/dynamic-report.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:38
   | 
37 | include "modules/reports.prisma"
38 | include "modules/dynamic-report.prisma"
39 | include "modules/medical-records.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:39
   | 
38 | include "modules/dynamic-report.prisma"
39 | include "modules/medical-records.prisma"
40 | include "modules/helpdesk.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:40
   | 
39 | include "modules/medical-records.prisma"
40 | include "modules/helpdesk.prisma"
41 | include "modules/mkt-referral.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:41
   | 
40 | include "modules/helpdesk.prisma"
41 | include "modules/mkt-referral.prisma"
42 | include "modules/social-service.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:42
   | 
41 | include "modules/mkt-referral.prisma"
42 | include "modules/social-service.prisma"
43 | include "modules/settings.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:43
   | 
42 | include "modules/social-service.prisma"
43 | include "modules/settings.prisma"
44 | include "modules/system-admin.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:44
   | 
43 | include "modules/settings.prisma"
44 | include "modules/system-admin.prisma"
45 | include "modules/utilities.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:45
   | 
44 | include "modules/system-admin.prisma"
45 | include "modules/utilities.prisma"
46 | include "modules/verification.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:46
   | 
45 | include "modules/utilities.prisma"
46 | include "modules/verification.prisma"
47 | include "modules/home.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:47
   | 
46 | include "modules/verification.prisma"
47 | include "modules/home.prisma"
48 | include "modules/login.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:48
   | 
47 | include "modules/home.prisma"
48 | include "modules/login.prisma"
49 | include "modules/register.prisma"
   | 
error: Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
  -->  schema.prisma:49
   | 
48 | include "modules/login.prisma"
49 | include "modules/register.prisma"
   | 

Validation Error Count: 40
[Context: validate]

Prisma CLI Version : 5.22.0
➜  prisma git:(main) ✗ 