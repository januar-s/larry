<?php
// Include database configuration file
require 'config.php';

try {
    // Create a new PDO instance
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);

    // SQL query to get the most recent sensor data entry
    $sql = "SELECT temperature, humidity, ratio, air_quality, timestamp FROM sensordata ORDER BY timestamp DESC LIMIT 1";

    // Prepare and execute the statement
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    // Fetch the latest entry as an associative array
    $latestEntry = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($latestEntry) {
        // Send the latest entry as JSON
        header('Content-Type: application/json');
        echo json_encode(['latestEntry' => $latestEntry]);
    } else {
        echo json_encode(['message' => 'No data found']);
    }

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
