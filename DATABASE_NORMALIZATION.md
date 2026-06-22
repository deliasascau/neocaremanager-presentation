# Normalizare si constrangeri - Neocare Manager

## Scop

Modelul de date este gandit pentru o aplicatie de management neonatal: utilizatori pe roluri, medici, asistenti, mame, pacienti nou-nascuti, incubatoare, internari si alerte medicale.

## Entitati principale

- `User`: contul de autentificare si rolul de acces.
- `Doctor`, `Assistant`, `Mother`: extensii de profil pentru roluri, legate 1:1 de `User`.
- `Patient`: nou-nascutul, legat optional de mama si medic.
- `Ward`: sectia/zona in care sunt amplasate incubatoarele.
- `Incubator`: echipamentul medical, legat de o singura sectie.
- `Admission`: episodul de internare al unui pacient intr-un incubator.
- `Alert`: alerta medicala sau operationala asociata unui incubator.

## Forma normala 1 (FN1)

Fiecare tabel are cheie primara, iar atributele sunt atomice pentru scopul aplicatiei:

- numele pacientului este separat in `firstName` si `lastName`;
- datele medicale simple (`gender`, `bloodType`, `birthWeight`) sunt stocate in coloane separate;
- valorile multiple nu sunt puse intr-o singura coloana, ci in tabele separate prin relatii 1:N (`Patient` -> `Admission`, `Incubator` -> `Alert`);
- `Mother.address` este tratata ca linie de contact libera; daca prezentarea cere interogari dupa oras/strada, poate fi separata ulterior in `addressLine` si `city`.

## Forma normala 2 (FN2)

Toate tabelele folosesc chei primare simple (`id`). Atributele ne-cheie depind de intreaga cheie:

- datele medicului depind de `Doctor.id`, nu partial de alta coloana;
- datele incubatorului depind de `Incubator.id`;
- datele unei internari (`admittedAt`, `dischargedAt`, `notes`) depind de `Admission.id`;
- relatiile many-to-one sunt reprezentate prin chei straine (`motherId`, `doctorId`, `wardId`, `patientId`, `incubatorId`).

## Forma normala 3 (FN3)

Atributele ne-cheie nu depind tranzitiv de alte atribute ne-cheie:

- zona medicala a incubatorului este mutata in tabel separat `Ward`, iar `Incubator` pastreaza doar `wardId`;
- datele specifice rolurilor nu sunt inghesuite in `User`, ci separate in `Doctor`, `Assistant`, `Mother`;
- `Admission` tine doar datele episodului de internare; detaliile pacientului si ale incubatorului raman in tabelele lor;
- `Alert` tine doar informatii despre alerta si referinta la incubator.

## Constrangeri implementate

Chei si unicitate:

- chei primare pe toate entitatile;
- `User.email` unic;
- `Doctor.userId`, `Assistant.userId`, `Mother.userId` unice pentru relatii 1:1 cu `User`;
- `Doctor.licenseNumber` unic;
- `Incubator.code` unic;
- `Ward.name` unic.

Integritate referentiala:

- `Doctor`, `Assistant`, `Mother` refera `User`;
- `Patient` refera optional `Mother` si `Doctor`;
- `Incubator` refera `Ward`;
- `Admission` refera `Patient` si `Incubator`;
- `Alert` refera `Incubator`.

Reguli de business:

- un pacient poate avea o singura internare activa;
- un incubator poate avea o singura internare activa;
- `dischargedAt` nu poate fi inainte de `admittedAt`;
- `gender` este limitat la `Male` sau `Female`;
- `bloodType` este limitat la grupele sanguine standard;
- `birthWeight` trebuie sa fie intre 0.5 kg si 6 kg;
- valorile de incubator sunt in intervale medicale rezonabile: temperatura 30-40, umiditate 0-100, oxigen 0-100;
- `Alert.type` si `Alert.priority` sunt limitate la valorile acceptate de aplicatie.

## Relatii pentru diagrama ER

- `User` 1:0..1 `Doctor`
- `User` 1:0..1 `Assistant`
- `User` 1:0..1 `Mother`
- `Doctor` 1:N `Assistant`
- `Doctor` 1:N `Patient`
- `Mother` 1:N `Patient`
- `Ward` 1:N `Incubator`
- `Patient` 1:N `Admission`
- `Incubator` 1:N `Admission`
- `Incubator` 1:N `Alert`
