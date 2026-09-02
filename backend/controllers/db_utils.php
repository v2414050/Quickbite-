<?php
// Utility functions for database operations
require_once __DIR__ . '/../config/db.php';
class DBUtils {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    // Get all cafeterias
    public function getAllCafeterias() {
        $query = "SELECT * FROM cafeterias";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get cafeteria by ID
    public function getCafeteriaById($id) {
        $query = "SELECT * FROM cafeterias WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Get menu items by cafeteria ID
    public function getMenuItemsByCafeteria($cafeteria_id) {
        $query = "SELECT * FROM menu_items WHERE cafeteria_id = :cafeteria_id AND is_available = 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':cafeteria_id', $cafeteria_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get user by email
    public function getUserByEmail($email) {
        $query = "SELECT * FROM users WHERE email = :email";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Create new user
    public function createUser($name, $email, $password, $user_type, $student_id = null, $phone = null) {
        $query = "INSERT INTO users (name, email, password, user_type, student_id, phone) 
                  VALUES (:name, :email, :password, :user_type, :student_id, :phone)";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $password);
        $stmt->bindParam(':user_type', $user_type);
        $stmt->bindParam(':student_id', $student_id);
        $stmt->bindParam(':phone', $phone);
        
        if($stmt->execute()) {
            return $this->db->lastInsertId();
        }
        return false;
    }

    // Create new order
    public function createOrder($student_id, $cafeteria_id, $total_amount, $pickup_time) {
        $query = "INSERT INTO orders (student_id, cafeteria_id, total_amount, pickup_time) 
                  VALUES (:student_id, :cafeteria_id, :total_amount, :pickup_time)";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':student_id', $student_id);
        $stmt->bindParam(':cafeteria_id', $cafeteria_id);
        $stmt->bindParam(':total_amount', $total_amount);
        $stmt->bindParam(':pickup_time', $pickup_time);
        
        if($stmt->execute()) {
            return $this->db->lastInsertId();
        }
        return false;
    }

    // Add items to order
    public function addOrderItems($order_id, $items) {
        $query = "INSERT INTO order_items (order_id, menu_item_id, quantity, price) 
                  VALUES (:order_id, :menu_item_id, :quantity, :price)";
        $stmt = $this->db->prepare($query);
        
        foreach($items as $item) {
            $stmt->bindParam(':order_id', $order_id);
            $stmt->bindParam(':menu_item_id', $item['menu_item_id']);
            $stmt->bindParam(':quantity', $item['quantity']);
            $stmt->bindParam(':price', $item['price']);
            $stmt->execute();
        }
        return true;
    }

    // Get order by ID
    public function getOrderById($id) {
        $query = "SELECT * FROM orders WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Get order items by order ID
    public function getOrderItemsByOrderId($order_id) {
        $query = "SELECT oi.*, mi.name as item_name FROM order_items oi 
                  JOIN menu_items mi ON oi.menu_item_id = mi.id 
                  WHERE oi.order_id = :order_id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':order_id', $order_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Update order status
    public function updateOrderStatus($order_id, $status) {
        $query = "UPDATE orders SET status = :status WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':id', $order_id);
        return $stmt->execute();
    }
}
?>