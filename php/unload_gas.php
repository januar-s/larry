<?php
require 'config.php';

try {
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);

    // Query for time-block averages
    $avgSql = "
        SELECT 
            CONCAT(
                DATE(timestamp), ' ',
                LPAD(HOUR(timestamp), 2, '0'), ':',
                LPAD(FLOOR(MINUTE(timestamp) / 30) * 30, 2, '0')
            ) AS time_block,
            ROUND(AVG(ratio), 4) AS avg_ratio
        FROM sensordata
        WHERE DATE(timestamp) = CURDATE()
        GROUP BY time_block
        ORDER BY time_block
    ";
    $avgStmt = $pdo->prepare($avgSql);
    $avgStmt->execute();
    $averages = $avgStmt->fetchAll(PDO::FETCH_ASSOC);

    // Query for the most recent entry (with air_quality instead of ratio)
    $latestSql = "
        SELECT 
            timestamp,
            ROUND(temperature, 2) AS temperature,
            ROUND(humidity, 2) AS humidity,
            air_quality
        FROM sensordata
        ORDER BY timestamp DESC
        LIMIT 1
    ";
    $latestStmt = $pdo->prepare($latestSql);
    $latestStmt->execute();
    $latest = $latestStmt->fetch(PDO::FETCH_ASSOC);

    // Output both results
    header('Content-Type: application/json');
    echo json_encode([
        'averages' => $averages,
        'latest' => $latest
    ]);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
