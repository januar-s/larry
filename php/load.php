<?php
 /*************************************************************
 * Kap. 13: Microcontroller -> DB 
 * load.php
 * Daten als JSON-String vom vom MC serverseitig empfangen und in die Datenbank einfügen
 * Datenbank-Verbindung
 * Ersetze $db_host, $db_name, $db_user, $db_pass durch deine eigenen Daten. 
 * Lade diese Datei NICHT auf GitHub
 * Beispiel: https://fiessling.ch/im4/13_MC2DB/load.php 
 * GitHub: https://github.com/Interaktive-Medien/im_physical_computing/blob/main/13_MC2DB/load.php
 *************************************************************/

require_once("config.php");
echo "This script receives HTTP POST messages and pushes their content into the database.";


###################################### connect to db
try{
    $pdo = new PDO($dsn, $db_user, $db_pass, $options); 
    echo "</br> DB Verbindung ist erfolgreich";
}
catch(PDOException $e){
    error_log("DB Error: " . $e->getMessage());
    echo json_encode(["status" => "error", "message" => "DB connection failed"]);
}




###################################### Empfangen der JSON-Daten

$inputJSON = file_get_contents('php://input'); // JSON-Daten aus dem Body der Anfrage
$input = json_decode($inputJSON, true); // Dekodieren der JSON-Daten in ein Array



###################################### Prüfen, ob die JSON-Daten erfolgreich dekodiert wurden
### folgender Block nicht zwingend notwendig, nur für Troubleshooting: Die rohen JSON-Daten in die Tabelle receiveddata einfügen

if (json_last_error() === JSON_ERROR_NONE && !empty($input)) {
    $sql = "INSERT INTO receiveddata (msg) VALUES (?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$inputJSON]);
}

echo "</br></br> Zeig die letzten 5 empfangenen HTTP Requests";
$sql = "SELECT * FROM receiveddata ORDER BY id DESC LIMIT 5";
$stmt = $pdo->prepare($sql);
$stmt->execute();
$receiveddata = $stmt->fetchAll();

echo "<ul>";
foreach ($receiveddata as $data) {
    echo "<li>" . $data['msg'] . "</li>";
}
echo "</ul>";


###################################### receiving a post request from a HTML form, later from ESP32 C6

if ($input && json_last_error() === JSON_ERROR_NONE) {
    $Temp = $input["Temp"];
    $Hum = $input["Hum"];
    $Ratio = $input["Ratio"];
    $AirQuality = $input["AirQuality"];

    if ($Temp !== null && $Hum !== null && $Ratio !== null && $AirQuality !== null) {
        $sql = "INSERT INTO sensordata (temperature, humidity, ratio, air_quality) VALUES (?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$Temp, $Hum, $Ratio, $AirQuality]);
        echo "</br> Daten erfolgreich in die Datenbank eingefügt";
    } else {
        error_log("Missing one or more required fields in input JSON.");
    }
}

?>