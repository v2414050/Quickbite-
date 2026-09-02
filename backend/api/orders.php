<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

include_once __DIR__ . '/../config/db.php';

$data = json_decode(file_get_contents("php://input"));

// 1. CREATE ORDER (Existing Logic)
if (isset($data->action) && $data->action == 'create') {
    $student_id = $data->student_id;
    $cafeteria_id = $data->cafeteria_id;
    $total_amount = $data->total_amount;
    $pickup_time = $data->pickup_time;
    $items = $data->items;

    try {
        $conn->beginTransaction();
        $sql = "INSERT INTO orders (student_id, cafeteria_id, total_amount, pickup_time, status) VALUES (?, ?, ?, ?, 'pending')";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$student_id, $cafeteria_id, $total_amount, $pickup_time]);
        $order_id = $conn->lastInsertId();

        $sql_item = "INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)";
        $stmt_item = $conn->prepare($sql_item);

        foreach ($items as $item) {
            $stmt_item->execute([$order_id, $item->menu_item_id, $item->quantity, $item->price]);
        }
        $conn->commit();
        echo json_encode(["success" => true, "message" => "Order placed", "order_id" => $order_id]);
    } catch (PDOException $e) {
        $conn->rollBack();
        echo json_encode(["success" => false, "message" => "Order failed: " . $e->getMessage()]);
    }
}

// 2. GET VENDOR ORDERS (New Logic)
elseif (isset($_GET['vendor_id'])) {
    $vendor_id = $_GET['vendor_id'];
    try {
        // Complex Query: Find orders belonging to the cafeteria owned by this vendor
        $sql = "SELECT o.id, o.total_amount, o.pickup_time, o.status, u.name as student_name 
                FROM orders o 
                JOIN cafeterias c ON o.cafeteria_id = c.id
                JOIN users u ON o.student_id = u.id
                WHERE c.vendor_id = ? 
                ORDER BY o.created_at DESC";

        $stmt = $conn->prepare($sql);
        $stmt->execute([$vendor_id]);
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(["success" => true, "orders" => $orders]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}

// 3. UPDATE PICKUP TIME (New Logic)
elseif (isset($data->action) && $data->action == 'update_time') {
    $order_id = $data->order_id;
    $new_time = $data->new_time;

    try {
        $sql = "UPDATE orders SET pickup_time = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$new_time, $order_id]);

        echo json_encode(["success" => true, "message" => "Pickup time updated successfully"]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Update failed: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
}
