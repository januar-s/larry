# larry

Wir haben einen Arduino Microcontroller programmiert und im Microcontrollerboard mit den nötigen Sensoren ausgestattet, dass er die Luftqualität misst und an eine WebApp schickt. Das selbe haben wir auch noch mit einem Licht- sowie Bewegungssensor gemacht. Die Steckpläne folgen in der Anleitung. Auf der WebApp können die aktuellen Daten angeschaut werden. Zudem können Push-Benachrichtigungen aktiviert werden um eine Erinnerung zum Lüften bzw. Licht ausschalten zu erhalten.

# Flussdiagram

![Flussdiagram](icons/Flussdiagram.jpeg)


# Projektübersicht

| Bereich         | Technologie                    |
| --------------- | ------------------------------ |
| Microcontroller | Arduino (ESP32/ESP)        |
| Sensoren        | DHT11, MQ135, PIR, Lichtsensor |
| Backend         | PHP, JSON                      |
| Frontend        | HTML, CSS, JavaScript          |
| Hosting         | Infomaniak (o. ä.)             |

Verfügbare Technik bei diesem Projekt
![alt text](icons/Technik.jpg)

# Steckpläne




# 🛠️ Projektanleitung: „larry“ Schritt für Schritt
Diese Anleitung zeigt dir, wie du das Projekt **„larry“** ausschließlich anhand der Git-Commits und des Mikrocontroller-Codes nachbauen kannst.



## 1. 🟢 Initialer Hardware-Upload: Mikrocontroller-Code

**Dateien:**  
- `luftquality_upload.ino`  
- `licht_upload.ino`

**Bauen der Micocontrollerboards**

Luftqualitäts-Sensor:
![alt text](icons/gassensor.jpeg)

Lichtsensor:
![alt text](icons/lichtsensor.jpeg)

**Code:**

- Programmierung von zwei Mikrocontroller-Skripten zur Umweltüberwachung.
- `luftquality_upload.ino`: DHT11 (Temp. + Feuchte), MQ135 (Luftqualität), Kalibrierungsknopf, HTTP POST an PHP-Server.
- `licht_upload.ino`: Lichtmessung und Bewegungserkennung, ebenfalls POST an Server.
- Speicherung von Kalibrierungswerten mit `Preferences`.

✅ Damit wurde die physische Messinfrastruktur vollständig umgesetzt.

---

## 2. 🟡 Aufbau der Weboberfläche (Frontend)

**Dateien:**  
- `index.html`  
- `style.css`  
- `script.js`

**Code:**

- Grundgerüst der Weboberfläche: Platzhalter für Messdaten, responsives CSS-Layout.
- JavaScript-Logik zum Abrufen von Sensordaten über `fetch`.

✅ Erste Sichtbarkeit der Sensordaten über den Browser.

---

## 3. 🔵 Serverintegration (Backend)

**Dateien:**  
- `config.php`
- `load_gas.php`  
- `load_light.php`  

**Code:**

- PHP-Skripte zum Empfangen der POST-Daten von Mikrocontrollern.
- Rückgabe der Daten im JSON-Format an das Frontend.

✅ Verbindung zwischen Hardware und Webinterface hergestellt.

---

## 4. 🟣 Visualisierung der Umweltdaten

**Dateien:**  
- Erweiterung von `script.js`  
- Chart.js

**Codeänderungen**

- Darstellung von Temperatur-, Feuchte- und Luftqualitätsverläufen als Text bzw. Diagramme.
- Leichtere Interpretation der Daten.

✅ Benutzerfreundliche grafische Oberfläche.

---

## 5. 🟤 Optimierung der Sensorlogik

**Codeänderungen**

- Anpassung der Kalibrierung (z.B. mehr Samples, genauere Berechnung).
- Neue Schwellwerte für Lichtsensor.
- Verbesserte Fehlerbehandlung (z.B. `isnan` bei DHT11).

✅ Genaue und robuste Messlogik.

---

## 6. ⚫ Code Cleanup und kleinere Fehlerbehebungen

**Codeänderungen**

- Debug-Ausgaben entfernt, Kommentare verbessert.
- Dateistruktur aufgeräumt.

✅ Projekt ist wartbarer und übersichtlicher.


