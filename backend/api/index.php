<?php
// Main entry point for the QuickBite backend API
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

echo json_encode([
    "message" => "QuickBite API Server",
    "version" => "1.0",
    "endpoints" => [
        "auth" => "/api/auth.php",
        "cafeterias" => "/api/cafeterias.php",
        "orders" => "/api/orders.php"
    ]
]);
?>