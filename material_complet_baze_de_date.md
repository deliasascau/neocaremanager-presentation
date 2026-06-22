# Material complet de învățat — Baze de Date

Acest material este construit pe baza tuturor documentelor încărcate: cursurile 1–12, Curs 8 Structurare logică, fișierul explicativ despre constrângeri, subiectele de examen și indicațiile pentru prezentarea PPT.

## Cum trebuie înțeleasă materia

Ideea centrală a disciplinei este trecerea de la date brute la o bază de date relațională corect proiectată:

```text
Date brute → Organizare → Model conceptual → Model logic → Model fizic → SQL/SGBD → Integritate → Interogări → Aplicație funcțională
```

Pentru proiect, trebuie să poți demonstra următoarea logică:

```text
Problemă reală
→ entități, atribute, relații
→ diagramă Entitate-Relație
→ tabele relaționale
→ chei primare și externe
→ normalizare
→ constrângeri
→ query-uri/API/backend
→ rezultate utile
```

---

# 1. Date, informații și baze de date

## Date

Datele sunt fapte brute culese din lumea reală. Ele pot proveni din măsurători, observații, formulare, tranzacții sau documente. Singure, datele nu au întotdeauna o semnificație clară.

Exemplu:

```text
10, Popescu, Matematică, 19.06.2026
```

Acestea sunt doar valori. Nu știm exact ce reprezintă până nu le punem într-un context.

## Informație

Informația apare atunci când datele sunt puse într-un context și primesc semnificație.

Exemplu:

```text
Studentul Popescu a luat nota 10 la Matematică în data de 19.06.2026.
```

Ideea importantă din curs:

```text
Datele = ceea ce se înmagazinează.
Informația = ceea ce se extrage.
```

## Bază de date

O bază de date este o colecție integrată și structurată de date operaționale, memorate pe un suport de stocare, astfel încât informația dorită să poată fi extrasă rapid, corect și coerent.

Răspuns scurt de examen:

> O bază de date este o colecție organizată de date aflate în relație, stocată pe un mediu de memorare, cu scopul de a permite extragerea informațiilor necesare.

## Colecție de date

O colecție de date este un ansamblu de date organizat după anumite criterii. În baza de date, colecțiile sunt organizate în tabele, relații și structuri logice.

## Entitate

O entitate este un obiect sau concept distinct din lumea reală care trebuie reprezentat în baza de date.

Exemple:

```text
Student
Profesor
Client
Comandă
Produs
Pacient
Programare
```

## Atribut

Un atribut este o proprietate care descrie o entitate.

Exemplu:

```text
Student(id_student, nume, prenume, email, grupa)
```

Aici, `id_student`, `nume`, `prenume`, `email` și `grupa` sunt atribute.

---

# 2. Evoluția organizării datelor

Organizarea datelor a evoluat în mai multe niveluri:

```text
Nivelul I   → organizarea datelor în fișiere clasice
Nivelul II  → organizarea mixtă în fișiere
Nivelul III → organizarea datelor în baze de date clasice
Nivelul IV  → organizarea datelor în baze de date relaționale
Nivelul V   → organizarea datelor în baze de date distribuite
```

## Etapa I — fișiere pe benzi magnetice

Caracteristici:

- structura logică coincide cu structura fizică;
- programatorul trebuie să cunoască modul fizic de stocare;
- prelucrarea se face pe loturi;
- există dependență mare între aplicații și date;
- există redundanță mare;
- fiecare aplicație are propriile date;
- legăturile dintre fișiere trebuie programate manual.

## Etapa II — fișiere pe disc magnetic

Caracteristici:

- structura logică nu mai coincide complet cu cea fizică;
- apar fișiere secvențial-indexate și fișiere cu acces direct;
- prelucrarea se poate face online sau în timp real;
- redundanța se menține;
- accesul se face la nivel de înregistrare, nu la nivel de câmp;
- controlul concurenței este limitat;
- legăturile dintre fișiere sunt încă programate în aplicație.

## Etapa III — apariția bazelor de date

Caracteristici:

- organizarea fizică devine independentă de aplicații;
- aceleași date pot fi folosite de mai multe aplicații;
- redundanța scade;
- accesul se poate face la nivel de câmp;
- apar mecanisme pentru integritate, securitate și concurență;
- datele sunt gestionate printr-o componentă software specializată.

## Etapa IV — baze de date relaționale

Caracteristici:

- apare independența logică și fizică a datelor;
- datele sunt descrise la nivel logic global;
- redundanța este redusă la minimum;
- apar vederi diferite pentru utilizatori;
- constrângerile cresc calitatea datelor;
- gestiunea datelor este centralizată în catalog.

---

# 3. Organizarea fișierelor

Datele nu pot fi păstrate toate în memoria RAM, deoarece memoria este scumpă și volatilă. De aceea, sistemele păstrează:

```text
datele curente → RAM
datele persistente → stocare secundară
datele de siguranță → backup/stocare terțiară
```

## Organizare heap

Înregistrările pot fi plasate oriunde există spațiu liber. Nu există ordine impusă.

Avantaj:

- inserare simplă.

Dezavantaj:

- căutare mai lentă dacă nu există index.

## Organizare secvențială

Înregistrările sunt stocate într-o ordine stabilită după o cheie de căutare.

Avantaj:

- bună pentru prelucrări în ordine.

Dezavantaj:

- inserările și ștergerile pot necesita reorganizare.

## Organizare hash

Se folosește o funcție hash care indică blocul în care trebuie să se afle o înregistrare.

Avantaj:

- acces rapid pentru căutări exacte.

Dezavantaj:

- mai slabă pentru căutări pe intervale.

## Organizare în grupuri

Înregistrări din tabele diferite, dar asociate logic, pot fi păstrate în același bloc.

Avantaj:

- eficientă pentru anumite join-uri.

Dezavantaj:

- poate scădea performanța pentru alte tipuri de interogări.

---

# 4. Limitele sistemelor bazate pe fișiere

Sistemele bazate pe fișiere au următoarele probleme:

## 1. Separarea și izolarea datelor

Datele sunt în fișiere separate și trebuie combinate manual de aplicații.

## 2. Dublarea datelor

Aceleași date apar în mai multe fișiere.

Probleme cauzate:

- consum inutil de spațiu;
- inconsistență;
- imposibilitatea aplicării standardelor;
- securitate slabă;
- integritate dificil de menținut.

## 3. Dependența datelor

Structura fizică a datelor este scrisă în codul aplicației. Dacă se schimbă structura fișierului, trebuie modificată aplicația.

## 4. Incompatibilitatea fișierelor

Fișierele pot fi create de programe diferite, în formate diferite.

## 5. Interogări statice

Dacă apare o întrebare nouă, trebuie rescris programul.

Răspuns scurt:

> Sistemele bazate pe fișiere sunt rigide, produc redundanță, inconsistență și dependență aplicație-date. SGBD-urile rezolvă aceste probleme prin centralizarea și controlul datelor.

---

# 5. SGBD — Sistem de Gestiune a Bazelor de Date

Un SGBD este un sistem de programe care permite:

- definirea bazei de date;
- crearea bazei de date;
- întreținerea bazei de date;
- accesul controlat la date;
- manipularea datelor;
- securitatea datelor;
- controlul concurenței;
- backup și recovery.

Răspuns scurt:

> Un SGBD este software-ul care gestionează baza de date și permite definirea, manipularea, securizarea și întreținerea acesteia.

---

# 6. Avantajele SGBD-urilor

| Avantaj | Explicație |
|---|---|
| Controlul redundanței | Datele nu se repetă inutil. |
| Coerența datelor | Valorile rămân consistente. |
| Mai multe informații din aceleași date | Datele integrate permit rapoarte mai bune. |
| Partajarea datelor | Mai mulți utilizatori pot folosi aceleași date. |
| Integritate crescută | Datele respectă reguli. |
| Securitate crescută | Acces controlat prin conturi și permisiuni. |
| Aplicarea standardelor | Formate și reguli comune. |
| Reducerea costurilor | Administrare centralizată. |
| Rezolvarea conflictelor | DBA poate decide reguli comune. |
| Accesibilitate | SQL permite interogări flexibile. |
| Productivitate | Aplicațiile se dezvoltă mai rapid. |
| Independența datelor | Datele sunt separate de aplicații. |
| Controlul concurenței | Acces simultan fără coruperea datelor. |
| Backup și recovery | Recuperare după defecțiuni. |

---

# 7. Dezavantajele SGBD-urilor

| Dezavantaj | Explicație |
|---|---|
| Complexitate | Necesită proiectare atentă. |
| Dimensiune | SGBD-ul ocupă spațiu. |
| Cost | Licențe, hardware, mentenanță, personal. |
| Performanță uneori mai slabă | Pentru aplicații foarte simple, un fișier poate fi mai rapid. |
| Impact mare la defecțiune | O problemă centrală poate afecta toți utilizatorii. |

Răspuns scurt:

> Dezavantajele SGBD-urilor sunt complexitatea, costul, dimensiunea, necesitatea personalului specializat și efectul mai mare al defecțiunilor.

---

# 8. Componentele unui SGBD

Un sistem de baze de date are cinci componente mari:

## 1. Hardware

Calculator, server, rețea, discuri, echipamente de stocare.

## 2. Software

Include:

- SGBD-ul;
- aplicațiile;
- sistemul de operare;
- programele de rețea.

## 3. Date

Baza conține:

- date operaționale;
- metadate.

Metadatele sunt date despre date: nume de tabele, coloane, tipuri, chei, constrângeri.

## 4. Proceduri

Reguli pentru:

- pornirea sistemului;
- oprirea sistemului;
- backup;
- restore;
- arhivare;
- modificări de structură;
- administrare.

## 5. Resurse umane

Roluri:

| Rol | Responsabilități |
|---|---|
| Administrator de date | Proiectare conceptuală și logică. |
| DBA | Implementare fizică, securitate, backup, performanță. |
| Proiectant BD logică | Entități, atribute, relații, constrângeri. |
| Proiectant BD fizică | Tabele, indexuri, stocare. |
| Programator aplicații | Scrie aplicația care folosește baza. |
| Utilizator final | Folosește aplicația. |

---

# 9. Module interne ale unui SGBD

| Modul | Rol |
|---|---|
| Administrator de fișiere | Gestionează spațiul pe disc. |
| Administrator BD | Primește interogări și cere datele necesare. |
| Procesor de interogare | Transformă interogările în instrucțiuni executabile. |
| Preprocesor DML | Convertește DML din programe aplicație. |
| Compilator DDL | Transformă DDL în metadate. |
| Administrator catalog | Gestionează catalogul sistemului. |
| Administrator tranzacții | Controlează atomicitatea și concurența. |
| Administrator buffer | Transferă date între RAM și stocare. |
| Administrator recovery | Reface baza după erori. |
| Control autorizare | Verifică permisiunile utilizatorilor. |

---

# 10. Modele de date

Un model de date este o colecție de concepte folosite pentru descrierea datelor, relațiilor dintre date și constrângerilor.

Elemente de bază:

```text
entități
atribute
relații
```

## Funcțiile modelelor

Un model:

- reprezintă obiecte și evenimente;
- reprezintă asocierile dintre ele;
- ignoră aspectele neesențiale;
- ajută proiectanții și utilizatorii să comunice fără ambiguități.

## Componentele unui model de date

| Componentă | Rol |
|---|---|
| Structurală | Reguli de organizare a datelor. |
| Manipulare | Operații de regăsire, actualizare, modificare structură. |
| Integritate | Reguli care garantează corectitudinea datelor. |

## Cele trei niveluri/modelări

| Model | Rol |
|---|---|
| Extern | Vederea fiecărui utilizator. |
| Conceptual | Vederea logică globală, independentă de SGBD. |
| Intern | Modul fizic de implementare. |

## Intensie și extensie

| Termen | Explicație |
|---|---|
| Intensie | Schema, structura permanentă. |
| Extensie | Datele efective la un moment dat. |

Exemplu:

```text
Intensie:
Student(id_student, nume, email)

Extensie:
1 | Ana | ana@email.com
2 | Ion | ion@email.com
```

---

# 11. Modelul ierarhic

Modelul ierarhic organizează datele sub formă de arbore.

```text
Rădăcină
 ├── Părinte
 │    ├── Copil
 │    └── Copil
 └── Părinte
```

Caracteristici:

- relație părinte–copil;
- un copil are un singur părinte;
- accesul pornește de la rădăcină;
- legăturile sunt explicite;
- integritatea referențială este impusă de structură.

Avantaje:

- acces rapid;
- structură simplă pentru date ierarhice;
- relațiile părinte–copil sunt clare.

Dezavantaje:

- structură rigidă;
- nu suportă bine relații M:N;
- poate produce redundanță;
- utilizatorul trebuie să cunoască structura arborelui.

## Intensie

Arborele de definiție.

## Extensie

Înregistrările concrete din tabele.

Răspuns scurt:

> Modelul ierarhic organizează datele ca un arbore părinte–copil. Este rapid, dar rigid și nepotrivit pentru relații complexe.

---

# 12. Modelul rețea

Modelul rețea folosește noduri și seturi.

| Concept | Explicație |
|---|---|
| Nod | Colecție de înregistrări. |
| Set | Relație între noduri. |
| Proprietar | Nodul principal. |
| Membru | Nodul dependent. |

Avantaje:

- mai flexibil decât modelul ierarhic;
- permite relații mai complexe;
- accesul poate porni din mai multe noduri;
- performant pentru regăsirea seturilor de înregistrări asociate.

Dezavantaje:

- depinde de pointeri;
- utilizatorul trebuie să cunoască structura internă;
- modificările structurale afectează aplicațiile;
- tranzacțiile devin complexe.

## Intensie

Graf cu arce numerotate.

## Extensie

Tabele cu înregistrări, posibil duplicate și ordonate.

Răspuns scurt:

> Modelul rețea reprezintă datele prin noduri și seturi. Este mai flexibil decât modelul ierarhic, dar mai complex și dependent de pointeri.

---

# 13. Modelul relațional

Modelul relațional este cel mai folosit model de baze de date. A fost dezvoltat de E. F. Codd și se bazează pe teoria mulțimilor.

Datele sunt reprezentate în tabele bidimensionale.

| Termen relațional | Termen uzual |
|---|---|
| Relație | Tabel |
| Tuplu | Rând |
| Atribut | Coloană |
| Domeniu | Mulțimea valorilor posibile |
| Cheie | Identificator |

Exemplu:

```text
Student(id_student, nume, email)
Disciplina(id_disciplina, denumire)
Nota(id_nota, id_student, id_disciplina, valoare)
```

Avantaje:

- este simplu;
- are suport matematic solid;
- folosește tabele;
- nu necesită pointeri expliciți;
- permite SQL;
- permite independență logică și fizică;
- permite constrângeri de integritate;
- este ușor de interogat.

## Intensie

Schema relațională:

```text
Student(id_student, nume, email)
```

## Extensie

Datele efective:

```text
1 | Ana | ana@email.com
2 | Ion | ion@email.com
```

Răspuns scurt:

> Modelul relațional organizează datele în tabele, iar relațiile dintre tabele se realizează prin chei. Este cel mai utilizat model datorită simplității, suportului teoretic și folosirii SQL.

---

# 14. Modele logice orientate pe obiecte

Aceste modele descriu datele la nivel conceptual și extern, cu flexibilitate ridicată.

Concepte:

```text
entitate
atribut
relație
```

Din această categorie fac parte:

- modelul entitate-relație;
- modelul orientat pe obiecte;
- modelul obiectual-relațional;
- modelul binar;
- modelul semantic;
- modelul infologic;
- modelul funcțional.

## Modelul Entitate-Relație

Se bazează pe perceperea lumii reale ca un set de entități și relații între ele.

Include:

- entități;
- atribute;
- relații;
- cardinalități.

Este folosit în proiectarea conceptuală.

## Modelul orientat pe obiecte

Folosește:

- obiecte;
- clase;
- metode;
- încapsulare;
- identificatori unici de obiect.

Diferență față de relațional:

- datele și operațiile sunt integrate în obiecte;
- separarea dintre date și aplicație este mai slabă.

## Modelul obiectual-relațional

Extinde modelul relațional cu elemente obiectuale:

- clase;
- moștenire;
- încapsulare;
- tipuri complexe.

Este util pentru:

- imagini;
- audio;
- video;
- proiectare asistată;
- date complexe.

---

# 15. Arhitecturi de baze de date

## Model mainframe

Baza de date și aplicațiile sunt pe un calculator central puternic. Utilizatorii folosesc terminale.

Avantaje:

- performant;
- sigur;
- centralizat.

Dezavantaje:

- scump;
- rigid;
- greu de extins.

## Model integrat

Baza de date și interfața sunt pe același calculator.

Exemple:

```text
dBase
MS Access local
```

Bun pentru:

- aplicații mici;
- un singur utilizator;
- prototipuri.

## Model file-server

Serverul pune la dispoziție fișiere. Aplicația rulează pe client.

Caracteristici:

- serverul nu înțelege cereri SQL/logice;
- transferă fișiere;
- prelucrarea se face pe client.

Dezavantaje:

- trafic mare în rețea;
- fiabilitate scăzută;
- risc de corupere a fișierelor;
- slab pentru aplicații mari multiuser.

## Model client-server

Serverul procesează cereri SQL și returnează rezultate.

```text
Client → Server BD → Bază de date
```

Avantaje:

- trafic redus;
- serverul procesează query-urile;
- backup mai bun;
- tranzacții sigure;
- recuperare după erori;
- securitate crescută;
- potrivit pentru aplicații mari.

## Arhitectură cu backend/API

În aplicațiile moderne:

```text
Frontend → Backend/API → SGBD → Bază de date
```

Backend-ul:

- primește cereri de la frontend;
- validează datele;
- trimite query-uri către SGBD;
- primește rezultate;
- le returnează către frontend.

## Baze de date distribuite

Datele sunt răspândite în mai multe locații, dar sistemul funcționează ca o singură bază logică.

Caracteristici:

- transparența localizării;
- autonomie locală;
- replicare;
- tranzacții distribuite;
- funcționare neîntreruptă.

---

# 16. Scheme și instanțe

## Instanță

Datele existente într-o bază de date la un anumit moment.

## Schemă

Descrierea generală a structurii bazei de date.

Tipuri de scheme:

| Schemă | Rol |
|---|---|
| Externă | Vederea utilizatorului/aplicației. |
| Conceptuală | Structura logică globală. |
| Internă | Modul de stocare fizică. |

Răspuns scurt:

> Schema este structura bazei de date, iar instanța este conținutul bazei la un moment dat.

---

# 17. Independența datelor

Independența datelor înseamnă că modificările de la nivelurile inferioare nu afectează nivelurile superioare.

## Independență logică

Schemele externe nu sunt afectate de modificări în schema conceptuală.

Exemplu:

```text
Se adaugă o coloană nouă în tabelul Student.
Aplicațiile care nu folosesc coloana nouă nu trebuie modificate.
```

## Independență fizică

Schema conceptuală nu este afectată de modificări ale schemei interne.

Exemplu:

```text
Se adaugă un index pentru performanță.
Tabelele și aplicația rămân neschimbate.
```

Răspuns scurt:

> Independența logică protejează aplicațiile față de modificări logice ale bazei, iar independența fizică protejează modelul logic față de modificări de stocare.

---

# 18. Limbajele bazelor de date

SQL are două părți principale:

```text
DDL → definirea structurii
DML → manipularea datelor
```

## DDL — Data Definition Language

Comenzi:

```sql
CREATE TABLE
ALTER TABLE
DROP TABLE
CREATE INDEX
CREATE VIEW
```

Exemplu:

```sql
CREATE TABLE Student (
    id_student INT PRIMARY KEY,
    nume VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE
);
```

## DML — Data Manipulation Language

Comenzi:

```sql
SELECT
INSERT
UPDATE
DELETE
```

Exemplu:

```sql
INSERT INTO Student (id_student, nume, email)
VALUES (1, 'Popescu Ion', 'ion@email.com');
```

## DML procedural vs neprocedural

| Tip | Explicație |
|---|---|
| Procedural | Spui ce date vrei și cum să fie găsite. Specific modelelor rețea/ierarhic. |
| Neprocedural | Spui ce date vrei, fără să spui cum se găsesc. Specific SQL/relațional. |

---

# 19. SQL — interogări importante

## SELECT simplu

```sql
SELECT *
FROM Student;
```

## SELECT cu WHERE

```sql
SELECT *
FROM Student
WHERE grupa = 'AIA';
```

## LIKE

```sql
SELECT *
FROM Student
WHERE nume LIKE 'Pop%';
```

## BETWEEN

```sql
SELECT *
FROM Nota
WHERE valoare BETWEEN 5 AND 10;
```

## ORDER BY

```sql
SELECT *
FROM Student
ORDER BY nume ASC;
```

## DISTINCT

```sql
SELECT DISTINCT grupa
FROM Student;
```

## Funcții agregat

```sql
COUNT()
SUM()
AVG()
MIN()
MAX()
```

Exemplu:

```sql
SELECT AVG(valoare) AS media
FROM Nota
WHERE id_student = 1;
```

## GROUP BY

```sql
SELECT id_student, AVG(valoare) AS media
FROM Nota
GROUP BY id_student;
```

## HAVING

```sql
SELECT id_student, AVG(valoare) AS media
FROM Nota
GROUP BY id_student
HAVING AVG(valoare) >= 8;
```

Diferență:

```text
WHERE filtrează rânduri înainte de grupare.
HAVING filtrează grupuri după grupare.
```

## JOIN

```sql
SELECT s.nume, d.denumire, n.valoare
FROM Nota n
JOIN Student s ON n.id_student = s.id_student
JOIN Disciplina d ON n.id_disciplina = d.id_disciplina;
```

Tipuri de JOIN:

| JOIN | Rol |
|---|---|
| INNER JOIN | Doar potrivirile. |
| LEFT JOIN | Toate rândurile din stânga + potriviri. |
| RIGHT JOIN | Toate rândurile din dreapta + potriviri. |
| FULL JOIN | Tot din ambele tabele. |
| CROSS JOIN | Produs cartezian. |

## Subinterogare

```sql
SELECT *
FROM Student
WHERE id_student IN (
    SELECT id_student
    FROM Nota
    WHERE valoare = 10
);
```

## NULL

NULL înseamnă valoare lipsă/necunoscută. Nu este zero și nu este șir gol.

Corect:

```sql
WHERE telefon IS NULL
```

Greșit:

```sql
WHERE telefon = NULL
```

---

# 20. Vederi — Views

O vedere este un tabel virtual definit printr-o interogare.

```sql
CREATE VIEW V_MediiStudenti AS
SELECT s.id_student, s.nume, AVG(n.valoare) AS media
FROM Student s
JOIN Nota n ON s.id_student = n.id_student
GROUP BY s.id_student, s.nume;
```

Utilizări:

- rapoarte;
- statistici;
- securitate;
- simplificarea query-urilor;
- ascunderea unor coloane.

Răspuns scurt:

> O vedere este un tabel virtual rezultat dintr-o interogare SQL. Ea nu stochează neapărat datele, ci definiția interogării.

---

# 21. Chei

O cheie este un atribut sau grup de atribute care identifică unic un rând.

| Tip de cheie | Explicație |
|---|---|
| Supercheie | Determină toate atributele relației. |
| Cheie candidat | Supercheie minimală. |
| Cheie primară | Cheia candidat aleasă oficial. |
| Cheie alternativă | Cheie candidat nealeasă. |
| Cheie externă | Atribut care referă cheia primară din alt tabel. |

## Cheia primară trebuie să fie

```text
unică
nenulă
stabilă
minimală
definitivă
accesibilă
centrată pe date
```

Exemplu:

```sql
id_student INT PRIMARY KEY
```

## Cheie externă

```sql
id_student INT,
FOREIGN KEY (id_student) REFERENCES Student(id_student)
```

Răspuns scurt:

> Cheia primară identifică unic fiecare înregistrare. Cheia externă stabilește legătura dintre două tabele și asigură integritatea referențială.

---

# 22. Constrângeri de integritate

Constrângerile de integritate sunt reguli care asigură corectitudinea, consistența și validitatea datelor.

Ele împiedică introducerea datelor greșite, incomplete sau contradictorii.

| Constrângere | Rol |
|---|---|
| NOT NULL | Nu permite valori goale. |
| UNIQUE | Nu permite duplicate. |
| PRIMARY KEY | Identifică unic fiecare rând. |
| FOREIGN KEY | Menține relația corectă între tabele. |
| CHECK | Verifică o condiție logică. |
| DEFAULT | Setează valoare implicită. |

## NOT NULL

```sql
CREATE TABLE Studenti (
    ID INT PRIMARY KEY,
    Nume VARCHAR(50) NOT NULL
);
```

Nu se poate introduce student fără nume.

## UNIQUE

```sql
CREATE TABLE Utilizatori (
    ID INT PRIMARY KEY,
    Email VARCHAR(100) UNIQUE
);
```

Două persoane nu pot avea același email.

## PRIMARY KEY

```sql
CREATE TABLE Produse (
    CodProdus INT PRIMARY KEY,
    Denumire VARCHAR(100)
);
```

Fiecare produs are cod unic.

## FOREIGN KEY

```sql
CREATE TABLE Departamente (
    ID_Dep INT PRIMARY KEY,
    NumeDep VARCHAR(50)
);

CREATE TABLE Angajati (
    ID_Ang INT PRIMARY KEY,
    Nume VARCHAR(50),
    ID_Dep INT,
    FOREIGN KEY (ID_Dep) REFERENCES Departamente(ID_Dep)
);
```

Nu poți introduce un angajat într-un departament inexistent.

## CHECK

```sql
CREATE TABLE Angajati (
    ID INT PRIMARY KEY,
    Varsta INT CHECK (Varsta >= 18)
);
```

Nu poți introduce angajați minori.

## Integritatea entității

Cheia primară trebuie să fie:

- unică;
- nenulă.

## Integritatea referențială

Orice cheie externă trebuie să aibă corespondent în tabelul părinte.

Exemplu:

```text
Nu poți avea Nota.id_student = 99 dacă Student.id_student = 99 nu există.
```

Opțiuni referențiale:

| Opțiune | Rol |
|---|---|
| CASCADE | Șterge/modifică automat copiii. |
| SET NULL | Setează cheia externă la NULL. |
| SET DEFAULT | Setează valoarea implicită. |
| NO ACTION | Blochează operația. |

Răspuns scurt:

> Constrângerile de integritate sunt reguli definite în baza de date pentru a preveni datele invalide. Cele mai importante sunt PRIMARY KEY pentru integritatea entității și FOREIGN KEY pentru integritatea referențială.

---

# 23. Model conceptual, logic și fizic

## Model conceptual

Descrie realitatea prin:

```text
entități
atribute
relații
cardinalități
```

Instrument principal:

```text
Diagrama Entitate-Relație
```

Pași:

1. identificarea entităților;
2. eliminarea entităților duplicate;
3. identificarea relațiilor;
4. stabilirea atributelor;
5. stabilirea domeniilor atributelor;
6. stabilirea cheilor;
7. generalizare/specializare, dacă este cazul;
8. construirea diagramei ER;
9. eliminarea relațiilor duplicate;
10. validarea cu beneficiarul.

## Model logic

Transformă modelul conceptual într-un model relațional.

Pași:

1. eliminarea relațiilor N:M;
2. stabilirea relațiilor;
3. implementarea relațiilor în tabele;
4. validarea prin normalizare;
5. validarea tranzacțiilor;
6. stabilirea constrângerilor.

Reguli:

| Relație | Transformare |
|---|---|
| 1:N | Cheia din partea 1 devine FK în partea N. |
| 1:1 | Cheia uneia devine FK în cealaltă. |
| N:M | Se creează tabel intermediar. |
| Relație cu atribut | Atributul se pune în tabelul intermediar. |

Exemplu N:M:

```text
Student — Curs
```

Devine:

```text
Student(id_student, nume)
Curs(id_curs, denumire)
Inscriere(id_student, id_curs)
```

Dacă relația are atribut `nota`:

```text
Inscriere(id_student, id_curs, nota)
```

## Model fizic

Stabilește implementarea reală:

- SGBD;
- tipuri SQL;
- indexuri;
- constrângeri;
- stocare;
- performanță;
- nume tabele și coloane.

Tipuri SQL importante:

| Tip | Rol |
|---|---|
| CHAR(n) | Text fix. |
| VARCHAR(n) | Text variabil. |
| INTEGER | Număr întreg. |
| SMALLINT | Întreg mic. |
| NUMERIC(p,d) | Număr exact. |
| REAL | Număr real. |
| FLOAT(n) | Real cu precizie. |
| DATE | Dată. |
| TIME | Oră. |

---

# 24. Diagrama Entitate-Relație

O diagramă ER reprezintă grafic:

- entități;
- atribute;
- relații;
- cardinalități.

## Cardinalități

| Cardinalitate | Exemplu |
|---|---|
| 1:1 | Persoană — CarteIdentitate |
| 1:N | Profesor — Curs |
| N:M | Student — Disciplină |

## Transformarea N:M

Relația N:M nu se implementează direct. Se creează tabel intermediar.

Exemplu:

```text
Student(id_student, nume)
Disciplina(id_disciplina, denumire)
Student_Disciplina(id_student, id_disciplina)
```

Dacă relația are atribut:

```text
Student_Disciplina(id_student, id_disciplina, nota)
```

---

# 25. Normalizarea

Normalizarea este procesul de reducere a redundanței, eliminare a anomaliilor și stabilizare a structurii bazei de date.

Se face prin descompunerea tabelelor.

Scopuri:

- eliminarea datelor redundante;
- eliminarea anomaliilor de modificare;
- reprezentarea corectă a relațiilor;
- menținerea integrității;
- păstrarea datelor într-o structură clară.

---

# 26. Probleme cauzate de redundanță

Redundanța înseamnă stocarea repetată a aceleiași informații.

Probleme:

- consum inutil de spațiu;
- inconsistență;
- scăderea performanței;
- imposibilitatea reprezentării corecte;
- anomalii.

## Anomalie de inserare

Nu poți introduce o informație fără alta.

Exemplu:

```text
Nu poți introduce profesor fără student asociat.
```

## Anomalie de ștergere

Ștergi un rând și pierzi informații importante.

Exemplu:

```text
Ștergi ultimul student și pierzi și profesorul/cursul.
```

## Anomalie de actualizare

Aceeași informație trebuie modificată în mai multe rânduri.

Exemplu:

```text
Numele profesorului apare în 50 de rânduri și trebuie modificat peste tot.
```

---

# 27. Descompunerea relațiilor

Descompunerea înseamnă împărțirea unei relații mari în relații mai mici.

O descompunere este corectă dacă:

```text
nu pierde informații;
păstrează dependențele;
elimină redundanțele.
```

Condiție conceptuală:

```text
Tabelul inițial trebuie să poată fi reconstruit prin JOIN din tabelele rezultate.
```

Exemplu greșit:

```text
Student(id_student, nume, id_facultate, nume_facultate)
```

Descompunere corectă:

```text
Student(id_student, nume, id_facultate)
Facultate(id_facultate, nume_facultate)
```

---

# 28. Dependențe funcționale

O dependență funcțională are forma:

```text
B → A
```

și înseamnă:

```text
B determină A
```

Unde:

```text
B = determinant
A = dependent
```

Exemplu:

```text
CNP → nume
```

Pentru un CNP există un singur nume.

Dar:

```text
nume ↛ CNP
```

Pentru că mai multe persoane pot avea același nume.

## Rolurile dependențelor funcționale

Se folosesc pentru:

- verificarea corectitudinii relațiilor;
- eliminarea redundanței;
- identificarea cheilor;
- validarea modelului ER;
- normalizare.

## Tipuri

### Dependență completă

Atributul depinde de întreaga cheie.

```text
(id_student, id_curs) → nota
```

### Dependență parțială

Atributul depinde doar de o parte din cheia compusă.

Greșit:

```text
(id_student, id_curs) → nume_student
```

De fapt:

```text
id_student → nume_student
```

Încalcă FN2.

### Dependență tranzitivă

```text
id_student → id_facultate
id_facultate → nume_facultate
```

Rezultă:

```text
id_student → nume_facultate
```

Încalcă FN3.

---

# 29. Axiomele lui Armstrong

Axiomele lui Armstrong sunt reguli folosite pentru deducerea dependențelor funcționale.

| Axiomă | Formă | Explicație |
|---|---|---|
| Reflexivitate | dacă β ⊆ α, atunci α → β | Un set determină submulțimile sale. |
| Augmentare | dacă α → β, atunci γα → γβ | Poți adăuga același atribut în ambele părți. |
| Tranzitivitate | dacă α → β și β → γ, atunci α → γ | Determinarea se transmite. |

Reguli suplimentare:

- reuniune;
- descompunere;
- pseudotranzitivitate.

Răspuns scurt:

> Axiomele lui Armstrong permit deducerea dependențelor funcționale și sunt folosite la identificarea cheilor și la normalizare.

---

# 30. Dependențe multivalorice

Notare:

```text
A ->-> B
```

Înseamnă că A determină o mulțime de valori pentru B independent de restul atributelor.

Exemplu:

```text
Student ->-> limbă_străină
Student ->-> hobby
```

Dacă limbile și hobby-urile sunt independente, nu trebuie ținute în același tabel.

---

# 31. Forme normale

Formele normale sunt proprietăți/constrângeri aplicate unei scheme relaționale pentru reducerea redundanței.

Forme normale:

```text
FN1
FN2
FN3
FNBC / BCNF
FN4
FN5
```

Fiecare formă este mai restrictivă decât precedenta.

## FN1 — Prima formă normală

O tabelă este în FN1 dacă toate atributele sunt atomice și nu există grupuri repetitive.

Greșit:

```text
Student(id_student, nume, telefoane)
1 | Ion | 0711, 0722
```

Corect:

```text
Student(id_student, nume)
Telefon(id_telefon, id_student, numar)
```

Răspuns:

> FN1 cere valori atomice și eliminarea grupurilor repetitive.

## FN2 — A doua formă normală

O tabelă este în FN2 dacă:

```text
este în FN1;
fiecare atribut non-cheie depinde de întreaga cheie.
```

Apare la chei compuse.

Greșit:

```text
Inscriere(id_student, id_curs, nume_student, denumire_curs, nota)
```

Cheia este:

```text
(id_student, id_curs)
```

Dar:

```text
nume_student depinde doar de id_student;
denumire_curs depinde doar de id_curs;
nota depinde de ambele.
```

Corect:

```text
Student(id_student, nume_student)
Curs(id_curs, denumire_curs)
Inscriere(id_student, id_curs, nota)
```

Răspuns:

> FN2 elimină dependențele parțiale față de o cheie compusă.

## FN3 — A treia formă normală

O tabelă este în FN3 dacă:

```text
este în FN2;
nu are dependențe tranzitive.
```

Greșit:

```text
Student(id_student, nume, id_facultate, nume_facultate)
```

Pentru că:

```text
id_student → id_facultate
id_facultate → nume_facultate
```

Corect:

```text
Student(id_student, nume, id_facultate)
Facultate(id_facultate, nume_facultate)
```

Răspuns:

> FN3 elimină dependențele tranzitive, astfel încât atributele non-cheie să depindă doar de cheie.

## FNBC / BCNF

Regulă:

```text
Pentru orice dependență X → Y, X trebuie să fie cheie candidat.
```

Formulare foarte bună:

> Fiecare atribut trebuie să depindă de cheie, de întreaga cheie și de nimic altceva.

## FN4

Elimină dependențele multivalorice.

Greșit:

```text
Student(id_student, limba_straina, hobby)
```

Corect:

```text
Student_Limba(id_student, limba)
Student_Hobby(id_student, hobby)
```

## FN5

Elimină problemele de descompunere care pot genera tupluri false la reunire.

Răspuns:

> FN5 se bazează pe dependențe de cuplare și cere ca o relație să nu mai poată fi descompusă fără pierdere de informație sau fără generarea unor înregistrări false.

---

# 32. Regulile lui Codd

Edgar F. Codd a formulat regulile pentru un sistem relațional ideal.

## Cele 12 reguli

| Nr. | Regulă | Idee |
|---|---|---|
| 1 | Regula informației | Toate datele sunt reprezentate logic în tabele. |
| 2 | Garantarea accesului | Orice valoare este accesibilă prin tabel, cheie primară și coloană. |
| 3 | Tratarea valorilor NULL | NULL reprezintă informație lipsă și trebuie tratat sistematic. |
| 4 | Catalog relațional | Metadatele sunt stocate tot în tabele. |
| 5 | Sublimbaj relațional complet | Sistemul trebuie să aibă un limbaj complet, de obicei SQL. |
| 6 | Actualizarea vederilor | Vederile actualizabile teoretic trebuie actualizate. |
| 7 | Inserare, actualizare, ștergere pe seturi | Operațiile trebuie să funcționeze pe seturi. |
| 8 | Independență fizică | Modificările fizice nu afectează aplicațiile. |
| 9 | Independență logică | Modificările logice nu afectează aplicațiile neimplicate. |
| 10 | Independența integrității | Constrângerile sunt în baza de date, nu în aplicație. |
| 11 | Independență de distribuire | Utilizatorul nu trebuie să știe dacă datele sunt distribuite. |
| 12 | Non-subversiune | Limbajele de nivel scăzut nu pot ocoli regulile relaționale. |

## Detaliere reguli 1–5

### Regula 1 — informației

Toate informațiile sunt reprezentate logic prin valori în tabele.

### Regula 2 — garantarea accesului

Orice valoare se accesează prin:

```text
numele tabelului;
valoarea cheii primare;
numele coloanei.
```

### Regula 3 — NULL

NULL este valoare lipsă sau necunoscută, diferită de zero și de șir gol.

### Regula 4 — catalog relațional

Catalogul bazei de date conține metadate și trebuie să fie accesibil prin același limbaj relațional.

### Regula 5 — sublimbaj complet

SGBD-ul trebuie să suporte un limbaj complet pentru:

- definirea datelor;
- manipularea datelor;
- vederi;
- securitate;
- integritate;
- tranzacții.

---

# 33. Cele cinci reguli ale lui Connolly

O altă modalitate de definire a unei baze de date relaționale este gruparea regulilor lui Codd în cinci categorii.

| Regulă Connolly | Idee |
|---|---|
| Fundamentale | Sistemul nu permite ocolirea regulilor relaționale. |
| Structurale | Datele și vederile sunt reprezentate relațional. |
| Integritate | NULL și constrângerile sunt tratate corect. |
| Manipulare | Datele și metadatele se accesează relațional. |
| Independență | Independență fizică, logică și de distribuire. |

Răspuns scurt:

> Connolly grupează regulile relaționale în reguli fundamentale, structurale, de integritate, de manipulare și de independență a datelor.

---

# 34. Ciclul de viață al unei baze de date

Ciclul de viață reprezintă pașii, tehnicile și instrumentele folosite pentru transpunerea modelului de date într-un model fizic.

Pași principali:

```text
1. Colectarea și analiza cerințelor
2. Definirea sistemului
3. Proiectarea conceptuală
4. Proiectarea logică
5. Proiectarea fizică
6. Alegerea SGBD-ului
7. Proiectarea aplicației
8. Prototipul
9. Implementarea
10. Testarea
11. Mentenanța
```

---

# 35. Colectarea și analiza cerințelor

Această etapă implică:

- examinarea domeniului;
- intervievarea beneficiarului;
- analiza sistemelor asemănătoare;
- analiza dezvoltărilor viitoare;
- înțelegerea întregului domeniu.

Este importantă pentru:

```text
înțelegerea sistemului care trebuie creat;
înțelegerea domeniului modelat;
construirea unui sistem nou;
reevaluarea proceselor existente;
instruirea utilizatorilor și managerilor;
comunicarea modului de funcționare;
evaluarea controlului.
```

Răspuns scurt:

> Colectarea cerințelor este esențială deoarece stabilește ce date trebuie stocate, ce reguli de domeniu există, ce utilizatori folosesc sistemul și ce tranzacții trebuie suportate.

---

# 36. Definirea sistemului

Definirea sistemului înseamnă stabilirea scopului și limitelor bazei de date.

Trebuie stabilite:

- utilizatorii finali;
- tipul de interfață;
- vederile utilizatorilor;
- resursele folosite;
- metodele de backup și arhivare;
- securitatea;
- permisiunile.

---

# 37. Proiectarea bazei de date

Proiectarea urmărește:

```text
consistența datelor;
integritatea datelor;
precizia datelor;
structură corectă;
redundanță minimă;
interogări eficiente;
extensibilitate.
```

Etape:

```text
proiectare conceptuală;
proiectare logică;
proiectare fizică.
```

---

# 38. Proiectarea conceptuală

Este independentă de SGBD și de stocarea fizică.

Definește:

- tipuri de informații;
- categorii de informații;
- reguli de domeniu;
- constrângeri;
- rapoarte;
- scopul informațiilor;
- securitate;
- dezvoltări viitoare.

Rezultat:

```text
Model conceptual + diagramă ER
```

---

# 39. Proiectarea logică

Transformă modelul conceptual într-un model de date, de obicei relațional.

Pași:

1. definirea tabelelor;
2. determinarea relațiilor;
3. determinarea coloanelor;
4. normalizarea cel puțin până la FN3;
5. determinarea cheilor primare;
6. determinarea valorilor specifice fiecărei coloane.

---

# 40. Proiectarea fizică

Descrie implementarea pe mediile de stocare.

Include:

- tipuri SQL;
- indexuri;
- spațiu necesar;
- performanță;
- denormalizare, dacă e necesară;
- structuri de stocare;
- metode de acces.

O bază relațională are două părți:

```text
dicționarul de date;
fișierele fizice de date.
```

---

# 41. Strategii de proiectare

| Strategie | Explicație |
|---|---|
| De sus în jos | Pornești de la concepte generale și le rafinezi. |
| De jos în sus | Pornești de la atribute și le grupezi în entități. |
| Din interior spre exterior | Pornești de la un nucleu central și extinzi. |
| Mixtă | Combini strategiile. |

Răspuns scurt:

> Strategiile de proiectare sunt top-down, bottom-up, inside-out și mixtă. Strategia mixtă este practică deoarece combină avantajele celorlalte.

---

# 42. Alegerea SGBD-ului

Alegerea SGBD-ului se face în funcție de cerințele actuale și viitoare.

Costuri analizate:

- costul software-ului;
- costul mentenanței;
- costul hardware;
- costul de creare sau conversie a bazei;
- costul personalului;
- costul instruirii;
- costul operării.

Alți factori:

- modelul de date;
- structura datelor;
- familiaritatea cu sistemul;
- suportul producătorului;
- instrumente de proiectare și monitorizare.

Răspuns pentru proiect:

> Am ales acest SGBD deoarece suportă modelul relațional, chei primare și externe, constrângeri de integritate, interogări SQL, vederi și integrare cu backend-ul aplicației.

---

# 43. Proiectarea aplicației

Trebuie proiectate:

## Tranzacții

Tipuri:

- tranzacții de extragere;
- tranzacții de actualizare;
- tranzacții mixte.

Exemple:

```text
adăugare student;
ștergere curs;
modificare notă;
afișare medie;
generare raport.
```

## Formulare și rapoarte

Aplicația trebuie să permită:

- introducerea datelor;
- afișarea datelor;
- filtrarea datelor;
- generarea rapoartelor.

---

# 44. Prototipul

Un prototip este o variantă preliminară funcțională a bazei de date/aplicației.

Este folosit pentru:

- clarificarea cerințelor;
- verificarea fezabilității;
- identificarea problemelor;
- îmbunătățirea proiectului;
- validarea cu utilizatorii.

Strategii:

| Strategie | Explicație |
|---|---|
| Prototip al cerințelor | Creat pentru validarea cerințelor. |
| Prototip evolutiv | Este îmbunătățit treptat și poate deveni produs final. |

Răspuns scurt:

> Prototipul este un model funcțional preliminar folosit pentru validarea cerințelor și descoperirea problemelor înainte de implementarea finală.

---

# 45. Implementarea

Implementarea înseamnă realizarea fizică a bazei de date și a aplicațiilor.

Include:

- creare bază de date;
- creare tabele;
- definire chei;
- definire constrângeri;
- inserare date;
- creare interogări;
- creare vederi;
- conectare aplicație-backend-bază de date.

Exemplu:

```sql
CREATE TABLE Nota (
    id_nota INT PRIMARY KEY,
    id_student INT NOT NULL,
    id_disciplina INT NOT NULL,
    valoare INT CHECK (valoare BETWEEN 1 AND 10),
    FOREIGN KEY (id_student) REFERENCES Student(id_student),
    FOREIGN KEY (id_disciplina) REFERENCES Disciplina(id_disciplina)
);
```

---

# 46. Testarea

Testarea verifică dacă baza de date și aplicația funcționează corect.

Scop:

- descoperirea erorilor;
- verificarea constrângerilor;
- verificarea query-urilor;
- verificarea tranzacțiilor;
- verificarea performanței.

Se face cu:

- date valide;
- date invalide;
- scenarii reale;
- operații de inserare, modificare, ștergere și interogare.

Exemple:

```sql
-- valid
INSERT INTO Student VALUES (1, 'Popescu Ion', 'ion@email.com');

-- invalid pentru UNIQUE
INSERT INTO Student VALUES (2, 'Popescu Ana', 'ion@email.com');

-- invalid pentru FOREIGN KEY
INSERT INTO Nota VALUES (1, 999, 1, 10);
```

Răspuns scurt:

> Testarea verifică dacă baza de date blochează datele invalide, execută corect tranzacțiile și produce rezultate corecte la interogări.

---

# 47. Mentenanța

După implementare, baza trebuie întreținută.

Include:

- backup;
- restore;
- monitorizare performanță;
- adăugare tabele/coloane;
- modificare rapoarte;
- arhivare;
- optimizare indexuri;
- securitate.

---

# 48. Măsurători de performanță

Măsurători posibile:

- timpul de răspuns la interogare;
- numărul de tranzacții pe secundă;
- timpul de generare a rapoartelor;
- timpul de achiziție/introducere a datelor;
- utilizarea CPU;
- utilizarea operațiilor I/O;
- interogări pe minut;
- timpul mediu al unei tranzacții.

Răspuns scurt:

> Performanța unei baze de date se măsoară prin timpul de răspuns, numărul de tranzacții pe secundă, timpul de raportare și utilizarea resurselor sistemului.

---

# 49. Ce trebuie să apară în proiect

Proiectul trebuie să arate clar:

```text
1. Tema și scopul bazei de date
2. SGBD-ul folosit
3. Cerințele sistemului
4. Modelul conceptual
5. Diagrama Entitate-Relație
6. Modelul logic relațional
7. Tabelele
8. Cheile primare și externe
9. Normalizarea
10. Constrângerile
11. Query-urile importante
12. Comunicarea Backend–BD
13. Testarea
14. Concluziile
```

---

# 50. Structura recomandată pentru prezentarea PPT

## Slide 1 — Titlu

```text
Titlul proiectului
Autori
AIA
```

## Slide 2 — Cuprins

```text
1. Tema proiectului
2. SGBD folosit
3. Diagrama ER
4. Model relațional
5. Normalizare
6. Backend–BD
7. Constrângeri și query-uri
8. Concluzii
```

## Slide 3 — Tema + SGBD

Spui:

```text
Am ales tema ...
Am folosit SGBD-ul ...
L-am ales deoarece suportă tabele relaționale, chei, constrângeri și SQL.
```

## Slide 4 — Diagrama ER

Trebuie să apară:

- entități;
- atribute;
- relații;
- cardinalități.

## Slide 5 — Model relațional

Exemplu:

```text
Student(id_student PK, nume, email)
Disciplina(id_disciplina PK, denumire)
Nota(id_nota PK, id_student FK, id_disciplina FK, valoare)
```

## Slide 6 — Normalizare

Spui:

```text
Tabelele sunt în FN1 deoarece atributele sunt atomice.
Tabelele sunt în FN2 deoarece atributele non-cheie depind de întreaga cheie.
Tabelele sunt în FN3 deoarece nu există dependențe tranzitive.
```

## Slide 7 — Backend–BD + constrângeri

Arăți:

```text
Frontend → Backend/API → SGBD → Bază de date
```

Și exemple de constrângeri:

```sql
PRIMARY KEY
FOREIGN KEY
NOT NULL
UNIQUE
CHECK
```

## Slide 8 — Concluzii

Spui:

```text
Baza respectă modelul relațional.
Datele sunt normalizate.
Relațiile sunt implementate prin chei.
Constrângerile asigură integritatea.
Interogările extrag informațiile necesare.
```

---

# 51. Fraza completă pentru prezentare

> În proiect am pornit de la analiza cerințelor domeniului și am identificat entitățile, atributele și relațiile. Pe baza acestora am construit diagrama Entitate-Relație. Apoi am transformat modelul conceptual într-un model logic relațional, format din tabele, chei primare și chei externe. Am eliminat relațiile N:M prin tabele intermediare și am aplicat normalizarea până cel puțin la forma normală trei. În modelul fizic am ales SGBD-ul, tipurile de date SQL și constrângerile de integritate. Aplicația comunică cu baza de date prin backend/API, iar query-urile SQL permit inserarea, actualizarea, ștergerea și extragerea informațiilor.

---

# 52. Cele mai bune 4 subiecte pentru examen

Pentru tine apar 4 subiecte. Cele mai sigure sunt:

```text
A4 — SGBD. Bază de date, colecție de date, entitate, atribut
B9 — Modelul relațional
C15 — Forme normale
D16 — Constrângeri de integritate
```

Motiv:

> Acestea se leagă direct de proiect: baza este implementată într-un SGBD relațional, tabelele sunt legate prin chei, structura este normalizată, iar integritatea este asigurată prin constrângeri.

---

# 53. Răspunsuri scurte pentru întrebări probabile

## Ce este o bază de date?

O bază de date este o colecție organizată și structurată de date aflate în relație, stocată pentru a permite extragerea rapidă și corectă a informației.

## Ce este un SGBD?

SGBD-ul este sistemul software care permite definirea, crearea, întreținerea și accesul controlat la baza de date.

## Ce este o entitate?

O entitate este un obiect sau concept distinct din lumea reală care trebuie reprezentat în baza de date.

## Ce este un atribut?

Un atribut este o proprietate care descrie o entitate.

## Ce este o cheie primară?

Cheia primară identifică unic fiecare rând dintr-un tabel și nu poate avea valori NULL.

## Ce este o cheie externă?

Cheia externă este un atribut care face referire la cheia primară din alt tabel.

## Ce este integritatea referențială?

Integritatea referențială cere ca fiecare valoare a unei chei externe să existe în tabelul părinte.

## Ce este normalizarea?

Normalizarea este procesul de organizare a tabelelor pentru reducerea redundanței și eliminarea anomaliilor.

## Ce este FN1?

FN1 cere ca toate atributele să fie atomice și să nu existe grupuri repetitive.

## Ce este FN2?

FN2 cere ca tabela să fie în FN1 și fiecare atribut non-cheie să depindă de întreaga cheie.

## Ce este FN3?

FN3 cere ca tabela să fie în FN2 și să nu existe dependențe tranzitive.

## Ce este FNBC?

FNBC cere ca pentru orice dependență X → Y, X să fie cheie candidat.

## Ce este DDL?

DDL este limbajul de definire a datelor: CREATE, ALTER, DROP.

## Ce este DML?

DML este limbajul de manipulare a datelor: SELECT, INSERT, UPDATE, DELETE.

## Ce este o vedere?

O vedere este un tabel virtual definit printr-o interogare SQL.

## Ce este modelul ER?

Modelul Entitate-Relație descrie entitățile, atributele, relațiile și cardinalitățile dintr-un domeniu.

## Ce este modelul client-server?

Modelul client-server presupune că un client trimite cereri, iar serverul de baze de date procesează cererile și returnează rezultatele.

---

# 54. Mini-glosar

| Termen | Explicație scurtă |
|---|---|
| Date | Valori brute stocate. |
| Informație | Date interpretate în context. |
| Bază de date | Colecție structurată de date. |
| SGBD | Software de gestiune a bazei. |
| Entitate | Obiect real modelat. |
| Atribut | Proprietate a entității. |
| Relație | Asociere între entități. |
| Tuplu | Rând într-un tabel. |
| Relație | Tabel în modelul relațional. |
| Cheie primară | Identificator unic. |
| Cheie externă | Legătură între tabele. |
| Integritate | Corectitudinea datelor. |
| Normalizare | Reducere redundanță. |
| FN1 | Atribute atomice. |
| FN2 | Fără dependențe parțiale. |
| FN3 | Fără dependențe tranzitive. |
| View | Tabel virtual. |
| DDL | Definirea structurii. |
| DML | Manipularea datelor. |
| JOIN | Combinarea tabelelor. |
| NULL | Valoare lipsă/necunoscută. |
| Catalog | Metadatele sistemului. |
| Backend | Strat aplicație care comunică cu BD. |

