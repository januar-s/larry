<?php
require 'config.php';

try {
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);

    // Fetch the last 7 days of entries where light < 2000
    $sql = "SELECT * FROM lichtbewegung 
            WHERE timestamp >= NOW() - INTERVAL 7 DAY 
            ORDER BY timestamp ASC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Group entries by date
    $grouped = [];
    foreach ($data as $entry) {
        $date = substr($entry['timestamp'], 0, 10);
        if ($entry['light'] < 2200) {
            $grouped[$date][] = $entry;
        }
    }

    $minSequenceLength = 90; // ~15 minutes at ~10s intervals
    $results = [];

    foreach ($grouped as $date => $entries) {
        $count = 0;
        $sequenceLength = 0;

        for ($i = 0; $i < count($entries); $i++) {
            $current = strtotime($entries[$i]['timestamp']);
            $prev = $i > 0 ? strtotime($entries[$i - 1]['timestamp']) : null;

            // Check if this entry is ~10s after the previous one
            if ($i === 0 || ($current - $prev <= 15)) {
                $sequenceLength++;
            } else {
                if ($sequenceLength >= $minSequenceLength) {
                    $count++;
                }
                $sequenceLength = 1;
            }
        }

        // Final check at end
        if ($sequenceLength >= $minSequenceLength) {
            $count++;
        }

        $results[$date] = $count;
    }

    header('Content-Type: application/json');
    echo json_encode($results);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
