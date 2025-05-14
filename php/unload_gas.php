<?php
require 'config.php';

try {
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);

    $sql = "
        SELECT 
            CONCAT(
                DATE(timestamp), ' ',
                LPAD(HOUR(timestamp), 2, '0'), ':',
                LPAD(FLOOR(MINUTE(timestamp) / 30) * 30, 2, '0')
            ) AS time_block,
            ROUND(AVG(temperature), 2) AS avg_temp,
            ROUND(AVG(humidity), 2) AS avg_humidity,
            ROUND(AVG(ratio), 4) AS avg_ratio
        FROM sensordata
        WHERE DATE(timestamp) = CURDATE()
        GROUP BY time_block
        ORDER BY time_block
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode(['averages' => $results]);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
