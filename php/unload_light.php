<?php
require 'config.php';

try {
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);

    // Fetch the last 7 days of entries where light < 2200
    $sql = "SELECT * FROM lichtbewegung 
            WHERE timestamp >= NOW() - INTERVAL 7 DAY 
            AND light < 2200 
            ORDER BY timestamp ASC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Group entries by date
    $grouped = [];
    foreach ($data as $entry) {
        $date = substr($entry['timestamp'], 0, 10);
        $grouped[$date][] = $entry;
    }

    $minSequenceLength = 60; // 10 minutes (~10s interval)
    $noMovementThreshold = 60; // 10 minutes without movement (~60 entries)
    $results = [];

    foreach ($grouped as $date => $entries) {
        $sequences = [];
        $currentSequence = [];

        for ($i = 0; $i < count($entries); $i++) {
            $current = strtotime($entries[$i]['timestamp']);
            $prev = $i > 0 ? strtotime($entries[$i - 1]['timestamp']) : null;

            if ($i === 0 || ($current - $prev <= 15)) {
                $currentSequence[] = $entries[$i];
            } else {
                if (count($currentSequence) >= $minSequenceLength) {
                    $sequences[] = $currentSequence;
                }
                $currentSequence = [$entries[$i]];
            }
        }

        // Final check for the last sequence
        if (count($currentSequence) >= $minSequenceLength) {
            $sequences[] = $currentSequence;
        }

        $withMovement = 0;
        $withoutMovement = 0;

foreach ($sequences as $sequence) {
    $len = count($sequence);
    $smoothed = [];

    // Step 1: Smooth the movement data to ignore isolated spikes
    for ($i = 0; $i < $len; $i++) {
        $prev = $i > 0 ? $sequence[$i - 1]['bewegung'] : 0;
        $curr = $sequence[$i]['bewegung'];
        $next = $i < $len - 1 ? $sequence[$i + 1]['bewegung'] : 0;

        // If current is 1 but surrounded by 0s, treat it as 0
        if ($curr == 1 && $prev == 0 && $next == 0) {
            $smoothed[] = 0;
        } else {
            $smoothed[] = $curr;
        }
    }

    // Step 2: Count long periods without movement
    $noMovementCount = 0;
    $hasLongNoMovement = false;

    for ($i = 0; $i < $len; $i++) {
        if ($smoothed[$i] == 0) {
            $noMovementCount++;
            if ($noMovementCount >= $noMovementThreshold) {
                $hasLongNoMovement = true;
                break;
            }
        } else {
            $noMovementCount = 0;
        }
    }

    if ($hasLongNoMovement) {
        $withoutMovement++;
    } else {
        $withMovement++;
    }
}


        $results[$date] = [
            'with_movement' => $withMovement,
            'without_movement' => $withoutMovement
        ];
    }

    header('Content-Type: application/json');
    echo json_encode($results);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
