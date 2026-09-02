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

if (!isset($data->action)) {
    echo json_encode(["success" => false, "message" => "No action specified"]);
    exit;
}

// --- REGISTER ---
if ($data->action == 'register') {
    $name = $data->name;
    $email = $data->email;
    $password = password_hash($data->password, PASSWORD_DEFAULT);
    $user_type = $data->user_type;
    $student_id = isset($data->student_id) ? $data->student_id : null;
    $phone = isset($data->phone) ? $data->phone : null;

    try {
        // Start Transaction
        $conn->beginTransaction();

        // 1. Create the User
        $sql = "INSERT INTO users (name, email, password, user_type, student_id, phone) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$name, $email, $password, $user_type, $student_id, $phone]);

        // Get the ID of the new user
        $new_user_id = $conn->lastInsertId();

        // 2. IF VENDOR: Create their Cafeteria automatically
        if ($user_type === 'vendor') {
            // We use the vendor's name as the cafeteria name
            $sql_cafe = "INSERT INTO cafeterias (name, description, vendor_id) VALUES (?, 'New Vendor Cafeteria', ?)";
            $stmt_cafe = $conn->prepare($sql_cafe);
            $stmt_cafe->execute([$name, $new_user_id]);
        }

        $conn->commit();
        echo json_encode(["success" => true, "message" => "User registered successfully"]);
    } catch (PDOException $e) {
        $conn->rollBack();
        if ($e->getCode() == 23000) {
            echo json_encode(["success" => false, "message" => "Email already exists"]);
        } else {
            echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
        }
    }
}

// --- LOGIN ---
elseif ($data->action == 'login') {
    $email = $data->email;
    $password = $data->password;

    $sql = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        unset($user['password']);
        echo json_encode(["success" => true, "message" => "Login successful", "user" => $user]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid email or password"]);
    }
}
