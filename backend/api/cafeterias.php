<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

include_once __DIR__ . '/../config/db.php';

if (isset($_GET['id'])) {
    $cafe_id = $_GET['id'];

    try {
        $sql = "SELECT * FROM menu_items WHERE cafeteria_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$cafe_id]);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["menu_items" => $items]);
    } catch (PDOException $e) {
        echo json_encode(["menu_items" => []]);
    }
} else {
    echo json_encode(["menu_items" => []]);
}
