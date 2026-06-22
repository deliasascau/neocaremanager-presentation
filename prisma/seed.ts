import { PrismaClient, Role, IncubatorStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { encrypt } from "../lib/encryption";

const prisma = new PrismaClient();

// ─── Helpers ─────────────────────────────────────────
function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
function randInt(min: number, max: number) {
  return Math.floor(rand(min, max + 1));
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(randInt(0, 23), randInt(0, 59));
  return d;
}

async function main() {
  console.log("🌱 Seeding large hospital dataset...\n");

  // ─── Clean ─────────────────────────────────────────
  console.log("🧹 Cleaning existing data...");
  await prisma.alert.deleteMany();
  await prisma.admission.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.incubator.deleteMany();
  await prisma.ward.deleteMany();
  await prisma.assistant.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.mother.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Database cleaned\n");

  const hash = (pw: string) => bcrypt.hash(pw, 10);

  // ═══════════════════════════════════════════════════
  // ADMIN
  // ═══════════════════════════════════════════════════
  await prisma.user.create({
    data: {
      name: "Administrator",
      email: "admin@neocare.ro",
      password: await hash("admin123"),
      role: Role.ADMIN,
    },
  });
  console.log("👑 Admin: admin@neocare.ro / admin123");

  // ═══════════════════════════════════════════════════
  // DOCTORS (10)
  // ═══════════════════════════════════════════════════
  const doctorDefs = [
    { name: "Dr. Maria Popescu", email: "maria.popescu@neocare.ro", specialty: "Neonatology", license: "MED-001" },
    { name: "Dr. Andrei Ionescu", email: "andrei.ionescu@neocare.ro", specialty: "Pediatrics", license: "MED-002" },
    { name: "Dr. Cristina Vasilescu", email: "cristina.vasilescu@neocare.ro", specialty: "Neonatology", license: "MED-003" },
    { name: "Dr. Mihai Dumitru", email: "mihai.dumitru@neocare.ro", specialty: "Pediatric Cardiology", license: "MED-004" },
    { name: "Dr. Elena Constantinescu", email: "elena.constantinescu@neocare.ro", specialty: "Neonatology", license: "MED-005" },
    { name: "Dr. Radu Georgescu", email: "radu.georgescu@neocare.ro", specialty: "Pediatric Pulmonology", license: "MED-006" },
    { name: "Dr. Ana-Maria Stan", email: "ana.stan@neocare.ro", specialty: "Neonatology", license: "MED-007" },
    { name: "Dr. Bogdan Munteanu", email: "bogdan.munteanu@neocare.ro", specialty: "Pediatrics", license: "MED-008" },
    { name: "Dr. Irina Florea", email: "irina.florea@neocare.ro", specialty: "Neonatal Neurology", license: "MED-009" },
    { name: "Dr. Alexandru Toma", email: "alexandru.toma@neocare.ro", specialty: "Pediatric Surgery", license: "MED-010" },
  ];

  const doctorPass = await hash("doctor123");
  const doctors: { id: string; userId: string }[] = [];

  for (const d of doctorDefs) {
    const user = await prisma.user.create({
      data: { name: d.name, email: d.email, password: doctorPass, role: Role.DOCTOR },
    });
    const doc = await prisma.doctor.create({
      data: { userId: user.id, specialty: d.specialty, licenseNumber: d.license },
    });
    doctors.push({ id: doc.id, userId: user.id });
  }
  console.log(`🩺 ${doctors.length} doctors created`);

  // ═══════════════════════════════════════════════════
  // ASSISTANTS (15)
  // ═══════════════════════════════════════════════════
  const assistantNames = [
    "Elena Dumitrescu", "Ioana Stan", "Gabriela Marin", "Daniela Rusu",
    "Monica Tănase", "Alina Preda", "Roxana Iliescu", "Carmen Diaconu",
    "Simona Badea", "Laura Neagu", "Diana Costache", "Oana Pavel",
    "Nicoleta Barbu", "Adriana Soare", "Corina Luca",
  ];

  const assistantPass = await hash("assistant123");
  const assistants: { id: string; userId: string }[] = [];

  for (let i = 0; i < assistantNames.length; i++) {
    const email = assistantNames[i].toLowerCase().replace(/\s/g, ".") + "@neocare.ro";
    const user = await prisma.user.create({
      data: { name: assistantNames[i], email, password: assistantPass, role: Role.ASSISTANT },
    });
    const asst = await prisma.assistant.create({
      data: { userId: user.id, doctorId: doctors[i % doctors.length].id },
    });
    assistants.push({ id: asst.id, userId: user.id });
  }
  console.log(`👩‍⚕️ ${assistants.length} assistants created`);

  // ═══════════════════════════════════════════════════
  // MOTHERS (25)
  // ═══════════════════════════════════════════════════
  const motherData = [
    { name: "Ana Lucas", email: "ana.lucas@email.com", phone: "0721000001", address: "Str. Speranței nr. 10, București" },
    { name: "Maria Smith", email: "maria.smith@email.com", phone: "0721000002", address: "Str. Lalelelor nr. 5, Cluj-Napoca" },
    { name: "Elena Johnson", email: "elena.johnson@email.com", phone: "0721000003", address: "Str. Mărțișor nr. 22, Timișoara" },
    { name: "Ioana Davis", email: "ioana.davis@email.com", phone: "0721000004", address: "Str. Crinilor nr. 8, Iași" },
    { name: "Andreea Brown", email: "andreea.brown@email.com", phone: "0721000005", address: "Str. Viitorului nr. 15, Brașov" },
    { name: "Cristina Williams", email: "cristina.williams@email.com", phone: "0721000006", address: "Str. Păcii nr. 3, Constanța" },
    { name: "Gabriela Miller", email: "gabriela.miller@email.com", phone: "0721000007", address: "Str. Florilor nr. 12, Sibiu" },
    { name: "Daniela Wilson", email: "daniela.wilson@email.com", phone: "0721000008", address: "Str. Unirii nr. 7, Oradea" },
    { name: "Monica Taylor", email: "monica.taylor@email.com", phone: "0721000009", address: "Str. Libertății nr. 19, Arad" },
    { name: "Alina Anderson", email: "alina.anderson@email.com", phone: "0721000010", address: "Str. Primăverii nr. 4, Bacău" },
    { name: "Roxana Thomas", email: "roxana.thomas@email.com", phone: "0721000011", address: "Str. Soarelui nr. 11, Galați" },
    { name: "Carmen Jackson", email: "carmen.jackson@email.com", phone: "0721000012", address: "Str. Nucilor nr. 6, Ploiești" },
    { name: "Simona White", email: "simona.white@email.com", phone: "0721000013", address: "Str. Teilor nr. 9, Brăila" },
    { name: "Laura Harris", email: "laura.harris@email.com", phone: "0721000014", address: "Str. Castanilor nr. 14, Pitești" },
    { name: "Diana Martin", email: "diana.martin@email.com", phone: "0721000015", address: "Str. Mesteacănului nr. 2, Buzău" },
    { name: "Oana Thompson", email: "oana.thompson@email.com", phone: "0721000016", address: "Str. Plopilor nr. 18, Târgu Mureș" },
    { name: "Nicoleta Garcia", email: "nicoleta.garcia@email.com", phone: "0721000017", address: "Str. Salcâmilor nr. 5, Baia Mare" },
    { name: "Adriana Martinez", email: "adriana.martinez@email.com", phone: "0721000018", address: "Str. Magnoliei nr. 8, Suceava" },
    { name: "Corina Robinson", email: "corina.robinson@email.com", phone: "0721000019", address: "Str. Bujorilor nr. 13, Botoșani" },
    { name: "Mihaela Clark", email: "mihaela.clark@email.com", phone: "0721000020", address: "Str. Trandafirilor nr. 1, Satu Mare" },
    { name: "Raluca Lewis", email: "raluca.lewis@email.com", phone: "0721000021", address: "Str. Zambilelor nr. 16, Deva" },
    { name: "Bianca Lee", email: "bianca.lee@email.com", phone: "0721000022", address: "Str. Lămâiței nr. 3, Alba Iulia" },
    { name: "Teodora Walker", email: "teodora.walker@email.com", phone: "0721000023", address: "Str. Gutuilor nr. 20, Zalău" },
    { name: "Larisa Hall", email: "larisa.hall@email.com", phone: "0721000024", address: "Str. Cireșilor nr. 7, Târgoviște" },
    { name: "Denisa Allen", email: "denisa.allen@email.com", phone: "0721000025", address: "Str. Merilor nr. 11, Focșani" },
  ];

  const motherPass = await hash("mother123");
  const mothers: { id: string; userId: string }[] = [];

  for (const m of motherData) {
    const user = await prisma.user.create({
      data: { name: m.name, email: m.email, password: motherPass, role: Role.MOTHER },
    });
    const mother = await prisma.mother.create({
      data: { userId: user.id, phone: m.phone, address: m.address },
    });
    mothers.push({ id: mother.id, userId: user.id });
  }
  console.log(`🤰 ${mothers.length} mothers created`);

  // ═══════════════════════════════════════════════════
  // INCUBATORS (20)
  // ═══════════════════════════════════════════════════
  const incubatorDefs = [
    { code: "INC-001", ward: "NICU Zone A" },
    { code: "INC-002", ward: "NICU Zone A" },
    { code: "INC-003", ward: "NICU Zone A" },
    { code: "INC-004", ward: "NICU Zone A" },
    { code: "INC-005", ward: "NICU Zone A" },
    { code: "INC-006", ward: "NICU Zone B" },
    { code: "INC-007", ward: "NICU Zone B" },
    { code: "INC-008", ward: "NICU Zone B" },
    { code: "INC-009", ward: "NICU Zone B" },
    { code: "INC-010", ward: "NICU Zone B" },
    { code: "INC-011", ward: "Intermediate Care" },
    { code: "INC-012", ward: "Intermediate Care" },
    { code: "INC-013", ward: "Intermediate Care" },
    { code: "INC-014", ward: "Intermediate Care" },
    { code: "INC-015", ward: "Intermediate Care" },
    { code: "INC-016", ward: "Step-Down Unit" },
    { code: "INC-017", ward: "Step-Down Unit" },
    { code: "INC-018", ward: "Step-Down Unit" },
    { code: "INC-019", ward: "Isolation Room" },
    { code: "INC-020", ward: "Isolation Room" },
    { code: "INC-021", ward: "NICU Zone A" },
    { code: "INC-022", ward: "NICU Zone A" },
    { code: "INC-023", ward: "NICU Zone B" },
    { code: "INC-024", ward: "NICU Zone B" },
    { code: "INC-025", ward: "Intermediate Care" },
    { code: "INC-026", ward: "Intermediate Care" },
    { code: "INC-027", ward: "Step-Down Unit" },
    { code: "INC-028", ward: "Step-Down Unit" },
    { code: "INC-029", ward: "Isolation Room" },
    { code: "INC-030", ward: "Isolation Room" },
  ];

  const wards = new Map<string, string>();
  for (const name of Array.from(new Set(incubatorDefs.map((inc) => inc.ward)))) {
    const ward = await prisma.ward.create({ data: { name } });
    wards.set(name, ward.id);
  }
  console.log(`🏥 ${wards.size} wards created`);

  const incubators: { id: string; code: string; wardId: string }[] = [];

  for (const inc of incubatorDefs) {
    const wardId = wards.get(inc.ward);
    if (!wardId) throw new Error(`Missing ward for ${inc.code}`);

    const created = await prisma.incubator.create({
      data: {
        code: inc.code,
        wardId,
        status: IncubatorStatus.AVAILABLE,
        temperature: parseFloat(rand(36.2, 37.0).toFixed(1)),
        humidity: parseFloat(rand(55, 70).toFixed(1)),
        oxygenLevel: parseFloat(rand(93, 99).toFixed(1)),
      },
    });
    incubators.push(created);
  }
  console.log(`🏥 ${incubators.length} incubators created`);

  // ═══════════════════════════════════════════════════
  // PATIENTS (30 newborns)
  // ═══════════════════════════════════════════════════
  const babyFirstNames = [
    "Sophia", "Liam", "Olivia", "Noah", "Emma",
    "Lucas", "Aria", "Ethan", "Mia", "Matei",
    "Amelia", "David", "Isabella", "Gabriel", "Charlotte",
    "Vlad", "Aurora", "Ștefan", "Evelyn", "Tudor",
    "Victoria", "Alexandru", "Scarlett", "Radu", "Luna",
    "Darius", "Elena", "Filip", "Iris", "Andrei",
  ];
  const babyLastNames = [
    "Lucas", "Smith", "Johnson", "Davis", "Brown",
    "Williams", "Miller", "Wilson", "Taylor", "Anderson",
    "Thomas", "Jackson", "White", "Harris", "Martin",
    "Thompson", "Garcia", "Martinez", "Robinson", "Clark",
    "Lewis", "Lee", "Walker", "Hall", "Allen",
    "Popescu", "Ionescu", "Dumitrescu", "Stanciu", "Munteanu",
  ];
  const genders = ["Male", "Female"];
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const patients: { id: string; firstName: string; lastName: string }[] = [];

  for (let i = 0; i < 30; i++) {
    const fn = babyFirstNames[i];
    const ln = babyLastNames[i];
    const gender = pick(genders);
    const p = await prisma.patient.create({
      data: {
        firstName: encrypt(fn),
        lastName: encrypt(ln),
        birthDate: daysAgo(randInt(0, 90)),
        gender,
        bloodType: pick(bloodTypes),
        birthWeight: parseFloat(rand(1.2, 4.5).toFixed(2)),
        motherId: mothers[i % mothers.length].id,
        doctorId: doctors[i % doctors.length].id,
      },
    });
    patients.push({ id: p.id, firstName: fn, lastName: ln });
  }
  console.log(`👶 ${patients.length} patients created`);

  // ═══════════════════════════════════════════════════
  // ADMISSIONS (spread over 90 days)
  // ═══════════════════════════════════════════════════
  const admissionNotes = [
    "Premature birth, 32 weeks. Requires oxygen and temperature monitoring.",
    "Respiratory distress syndrome. CPAP support initiated.",
    "Low birth weight (1.4 kg). Nutritional support and incubator care.",
    "Neonatal jaundice. Phototherapy treatment ongoing.",
    "Suspected sepsis. Antibiotics started, cultures pending.",
    "Transient tachypnea. Monitoring SpO2 and respiratory rate.",
    "Hypoglycemia. IV glucose and frequent monitoring.",
    "Meconium aspiration. Suction and oxygen therapy.",
    "Congenital heart defect suspected. Echo scheduled.",
    "Apnea of prematurity. Caffeine citrate started.",
    "Feeding intolerance. NG tube placed, slow feeds.",
    "Temperature instability. Incubator humidity adjusted.",
    "Mild respiratory distress. Nasal cannula at 1L/min.",
    "Routine observation post C-section. Stable vitals.",
    "Hyperbilirubinemia. Double phototherapy.",
    "Patent ductus arteriosus. Monitoring for closure.",
    "Intrauterine growth restriction. Nutritional plan initiated.",
    "Perinatal asphyxia. Therapeutic hypothermia protocol.",
    "Pneumothorax resolved. Chest tube removed, observation.",
    "Necrotizing enterocolitis ruled out. NPO, antibiotics.",
    "Bronchopulmonary dysplasia risk. Steroid course.",
    "Retinopathy of prematurity screening scheduled.",
    "Anemia of prematurity. Iron supplementation.",
    "Gastroesophageal reflux. Positioning and thickened feeds.",
    "Seizure activity observed. Phenobarbital loaded.",
    "Metabolic acidosis. Bicarbonate correction.",
    "Thrombocytopenia. Platelet transfusion given.",
    "Persistent pulmonary hypertension. iNO therapy.",
    "Renal impairment. Fluid restriction, monitoring output.",
    "Post-surgical observation. Vitals stable, pain managed.",
  ];

  const activeAdmissionCount = 18;

  for (let i = 0; i < 30; i++) {
    const isActive = i < activeAdmissionCount;
    const admittedAt = daysAgo(randInt(0, 90));
    const dischargedAt = isActive ? null : new Date(admittedAt.getTime() + randInt(3, 30) * 86400000);

    await prisma.admission.create({
      data: {
        patientId: patients[i].id,
        incubatorId: incubators[i % incubators.length].id,
        admittedAt,
        dischargedAt,
        notes: admissionNotes[i % admissionNotes.length],
      },
    });
  }

  // Update incubator statuses for active admissions
  for (let i = 0; i < activeAdmissionCount; i++) {
    await prisma.incubator.update({
      where: { id: incubators[i % incubators.length].id },
      data: { status: IncubatorStatus.OCCUPIED },
    });
  }

  console.log(`🏨 30 admissions (${activeAdmissionCount} active, ${30 - activeAdmissionCount} discharged)`);

  // ═══════════════════════════════════════════════════
  // ALERTS (20 — mix of resolved and active)
  // ═══════════════════════════════════════════════════
  const alertDefs = [
    { message: "SpO2 drop below 88% detected — immediate intervention", type: "Oxygen", priority: "Critical" },
    { message: "Apnea episode >20 seconds — stimulation required", type: "Respiration", priority: "Critical" },
    { message: "Bradycardia <80 bpm for >10 seconds", type: "Cardiac", priority: "Critical" },
    { message: "Temperature >38.0°C — possible infection", type: "Temperature", priority: "High" },
    { message: "Temperature <36.0°C — hypothermia risk", type: "Temperature", priority: "High" },
    { message: "Heart rate variability outside safety bounds", type: "Cardiac", priority: "High" },
    { message: "Oxygen saturation fluctuation ±5% in last hour", type: "Oxygen", priority: "Medium" },
    { message: "Humidity below 55% — skin integrity risk", type: "System", priority: "Medium" },
    { message: "Power disruption warning — backup battery active", type: "System", priority: "Medium" },
    { message: "Feeding tube occlusion detected", type: "System", priority: "Low" },
    { message: "Phototherapy lamp intensity below threshold", type: "System", priority: "Medium" },
    { message: "Respiratory rate >80/min — tachypnea alert", type: "Respiration", priority: "High" },
    { message: "Blood pressure drop >15% from baseline", type: "Cardiac", priority: "Critical" },
    { message: "CO2 retention detected — ventilation check needed", type: "Respiration", priority: "High" },
    { message: "Incubator door open >30 seconds", type: "System", priority: "Low" },
    { message: "Weight loss >10% since birth — nutrition review", type: "System", priority: "Medium" },
    { message: "Seizure-like activity on EEG monitor", type: "Cardiac", priority: "Critical" },
    { message: "Oxygen flow rate deviation from prescription", type: "Oxygen", priority: "High" },
    { message: "Skin probe detachment — temperature unreadable", type: "System", priority: "Low" },
    { message: "Bilirubin levels rising — repeat phototherapy", type: "System", priority: "Medium" },
  ];

  for (let i = 0; i < 20; i++) {
    const resolved = i >= 12;
    await prisma.alert.create({
      data: {
        incubatorId: incubators[i % incubators.length].id,
        message: alertDefs[i].message,
        type: alertDefs[i].type,
        priority: alertDefs[i].priority,
        resolved,
        createdAt: daysAgo(resolved ? randInt(5, 30) : randInt(0, 4)),
      },
    });
  }
  console.log("🚨 20 alerts (12 active, 8 resolved)");

  // ═══════════════════════════════════════════════════
  // SUMMARY
  // ═══════════════════════════════════════════════════
  console.log("\n═══════════════════════════════════════");
  console.log("🎉 Seeding complete! Hospital overview:");
  console.log("═══════════════════════════════════════");
  console.log("   👑 1 Admin");
  console.log(`   🩺 ${doctors.length} Doctors`);
  console.log(`   👩‍⚕️ ${assistants.length} Assistants`);
  console.log(`   🤰 ${mothers.length} Mothers`);
  console.log(`   👶 ${patients.length} Patients`);
  console.log(`   🏥 ${incubators.length} Incubators (${activeAdmissionCount} occupied, ${incubators.length - activeAdmissionCount} available)`);
  console.log(`   🏨 30 Admissions (${activeAdmissionCount} active, ${30 - activeAdmissionCount} discharged)`);
  console.log("   🚨 20 Alerts (12 active, 8 resolved)");
  console.log("\n📋 Login credentials:");
  console.log("   Admin:    admin@neocare.ro / admin123");
  console.log("   Doctor:   maria.popescu@neocare.ro / doctor123");
  console.log("   Asistent: elena.dumitrescu@neocare.ro / assistant123");
  console.log("   Mama:     ana.lucas@email.com / mother123");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
