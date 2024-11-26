# Návrh datové struktury

### 1. Správa uživatelů
- **Data:**
  - Uživatelské jméno
  - Nickname
  - Email
  - Heslo 
  - Datum registrace
  - Atd.
  - Uložené herní stavy (odkaz na herní stavy)
- **Ukládání:** Databáze

---

### 2. Postavy a jejich vlastnosti
- **Data:**
  - Jméno postavy
  - Typ postavy (např. Válečník, Kouzelník, Zloděj)
  - Statistiky (síla, vůle, životy, osud)
  - Zvláštní schopnosti
  - Počáteční pole (odkaz na pole)
- **Ukládání:**
  - Databáze
  - Možnost rozšiřitelnosti

---

### 3. Herní stav
- **Data:**
  - ID hráče
  - Postava (odkaz na vybranou postavu)
  - Statistiky (aktuální přidané staty: síla, vůle, životy, zlato, osud)
  - Poloha na mapě (odkaz na pole)
  - Obsah inventáře (odkaz na inventář)
  - Aktivní karty (události, cizinci, nepřátelé, kletby v případě zprovoznění kouzel atd.)
- **Ukládání:** Databáze popř. local storage - lehčí ale není možnost načíst z jiného PC

---

### 4. Pásy a pole
- **Data:**
  - ID Pásu
  - ID Pole
  - TTyp pole - musíš si líznout / hod kostkou , atd.
  - Obsah pole (odkaz na karty setkání
- **Ukládání:** V databázi

---

### 5. Inventář
- **Data:**
  - ID hráče
  - Předměty v inventáři (typ, bonusy, omezení)
  - Počet obsazených polí (?/8)
- **Ukládání:** Databáze popř. local storage - lehčí ale není možnost načíst z jiného PC

---

### 6. Karty setkání
- **Data:**
  - Typ karty (událost, nepřítel, předmět, cizinec, místo)
  - Text karty (popis efektu)
  - Počet síly / vůle karty v případě nepřítele
  - Speciální vlastnosti
- **Ukládání:** Lokálně (JSON soubory).

---

### 7. Boj
- **Data:**
  - ID hráče
  - Karta události
  - Výsledek boje
- **Ukládání:** Local storage - ukládáme pouze následky - např ztráta života

---

### 8. Speciální aktivity a logika
- **Data:**
  - ID hráče
  - Aktuální aktivita
- **Ukládání:** Local storage - ukládáme pouze následky - např zisk života

---
