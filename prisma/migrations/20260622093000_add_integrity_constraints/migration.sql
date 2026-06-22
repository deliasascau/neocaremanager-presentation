-- Normalize incubator wards into their own relation.
CREATE TABLE "Ward" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ward_pkey" PRIMARY KEY ("id")
);

INSERT INTO "Ward" ("id", "name", "createdAt", "updatedAt")
SELECT 'ward_' || md5("ward"), "ward", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM (SELECT DISTINCT "ward" FROM "Incubator") AS existing_wards;

ALTER TABLE "Incubator" ADD COLUMN "wardId" TEXT;

UPDATE "Incubator" AS i
SET "wardId" = w."id"
FROM "Ward" AS w
WHERE i."ward" = w."name";

ALTER TABLE "Incubator" ALTER COLUMN "wardId" SET NOT NULL;
ALTER TABLE "Incubator" DROP COLUMN "ward";

CREATE UNIQUE INDEX "Ward_name_key" ON "Ward"("name");
CREATE INDEX "Incubator_wardId_idx" ON "Incubator"("wardId");
ALTER TABLE "Incubator" ADD CONSTRAINT "Incubator_wardId_fkey"
    FOREIGN KEY ("wardId") REFERENCES "Ward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Entity and relationship integrity.
CREATE UNIQUE INDEX "Doctor_licenseNumber_key" ON "Doctor"("licenseNumber");
CREATE INDEX "Admission_patientId_idx" ON "Admission"("patientId");
CREATE INDEX "Admission_incubatorId_idx" ON "Admission"("incubatorId");
CREATE INDEX "Alert_incubatorId_idx" ON "Alert"("incubatorId");

-- Business rules: a patient/incubator can have only one active admission.
CREATE UNIQUE INDEX "Admission_patient_active_key"
    ON "Admission"("patientId")
    WHERE "dischargedAt" IS NULL;

CREATE UNIQUE INDEX "Admission_incubator_active_key"
    ON "Admission"("incubatorId")
    WHERE "dischargedAt" IS NULL;

-- Domain constraints used by the application and presentation dataset.
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_gender_check"
    CHECK ("gender" IS NULL OR "gender" IN ('Male', 'Female'));

ALTER TABLE "Patient" ADD CONSTRAINT "Patient_bloodType_check"
    CHECK ("bloodType" IS NULL OR "bloodType" IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'));

ALTER TABLE "Patient" ADD CONSTRAINT "Patient_birthWeight_check"
    CHECK ("birthWeight" IS NULL OR ("birthWeight" >= 0.5 AND "birthWeight" <= 6.0));

ALTER TABLE "Incubator" ADD CONSTRAINT "Incubator_temperature_check"
    CHECK ("temperature" IS NULL OR ("temperature" >= 30.0 AND "temperature" <= 40.0));

ALTER TABLE "Incubator" ADD CONSTRAINT "Incubator_humidity_check"
    CHECK ("humidity" IS NULL OR ("humidity" >= 0.0 AND "humidity" <= 100.0));

ALTER TABLE "Incubator" ADD CONSTRAINT "Incubator_oxygenLevel_check"
    CHECK ("oxygenLevel" IS NULL OR ("oxygenLevel" >= 0.0 AND "oxygenLevel" <= 100.0));

ALTER TABLE "Admission" ADD CONSTRAINT "Admission_dates_check"
    CHECK ("dischargedAt" IS NULL OR "dischargedAt" >= "admittedAt");

ALTER TABLE "Alert" ADD CONSTRAINT "Alert_type_check"
    CHECK ("type" IN ('Oxygen', 'Temperature', 'Respiration', 'System', 'Cardiac'));

ALTER TABLE "Alert" ADD CONSTRAINT "Alert_priority_check"
    CHECK ("priority" IN ('Low', 'Medium', 'High', 'Critical'));
