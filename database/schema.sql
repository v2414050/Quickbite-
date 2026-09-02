-- QuickBite Database Schema

-- 1. Create and Select Database
CREATE DATABASE
IF NOT EXISTS quickbite_db;
USE quickbite_db;

-- 2. Users table
CREATE TABLE users
(
    id INT
    AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR
    (100) NOT NULL,
    email VARCHAR
    (100) UNIQUE NOT NULL,
    password VARCHAR
    (255) NOT NULL,
    user_type ENUM
    ('student', 'vendor') NOT NULL,
    student_id VARCHAR
    (50) NULL,
    phone VARCHAR
    (20) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

    -- 3. Cafeterias table
    CREATE TABLE cafeterias
    (
        id INT
        AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR
        (100) NOT NULL,
    description TEXT,
    vendor_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY
        (vendor_id) REFERENCES users
        (id) ON
        DELETE CASCADE
);

        -- 4. Menu items table
        CREATE TABLE menu_items
        (
            id INT
            AUTO_INCREMENT PRIMARY KEY,
    cafeteria_id INT NOT NULL,
    name VARCHAR
            (100) NOT NULL,
    description TEXT,
    price DECIMAL
            (10, 2) NOT NULL,
    image_url VARCHAR
            (255),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY
            (cafeteria_id) REFERENCES cafeterias
            (id) ON
            DELETE CASCADE
);

            -- 5. Orders table
            CREATE TABLE orders
            (
                id INT
                AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    cafeteria_id INT NOT NULL,
    total_amount DECIMAL
                (10, 2) NOT NULL,
    status ENUM
                ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled') DEFAULT 'pending',
    pickup_time DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON
                UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY
                (student_id) REFERENCES users
                (id) ON
                DELETE CASCADE,
    FOREIGN KEY (cafeteria_id)
                REFERENCES cafeterias
                (id) ON
                DELETE CASCADE
);

                -- 6. Order items table
                CREATE TABLE order_items
                (
                    id INT
                    AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT DEFAULT 1,
    price DECIMAL
                    (10, 2) NOT NULL,
    FOREIGN KEY
                    (order_id) REFERENCES orders
                    (id) ON
                    DELETE CASCADE,
    FOREIGN KEY (menu_item_id)
                    REFERENCES menu_items
                    (id) ON
                    DELETE CASCADE
);

                    -- --- SAMPLE DATA ---

                    -- Insert Users (Password is 'password123' hashed)
                    INSERT INTO users
                        (name, email, password, user_type, student_id)
                    VALUES
                        ('John Student', 'john@student.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'STU001'),
                        ('Urban Cafe', 'urban@vendor.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'vendor', NULL),
                        ('Amul Cafe', 'amul@vendor.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'vendor', NULL),
                        ('Brio Cafe', 'brio@vendor.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'vendor', NULL);

                    -- Insert Cafeterias
                    INSERT INTO cafeterias
                        (name, description, vendor_id)
                    VALUES
                        ('Urban Cafe', 'Modern cafe with a variety of beverages and snacks', 2),
                        ('Amul Cafe', 'Dairy-based snacks and beverages', 3),
                        ('Brio Cafe', 'Italian cuisine and coffee', 4);

                    -- Insert Menu Items
                    -- FIXED: Removed leading slash '/' so images work in subfolders
                    INSERT INTO menu_items
                        (cafeteria_id, name, description, price, image_url)
                    VALUES
                        (1, 'Classic Coffee', 'Rich and aromatic coffee', 20.00, 'https://tse2.mm.bing.net/th/id/OIP.EEtR2uXpYpH6SHp0irI_TgHaHa?rs=1&pid=ImgDetMain'),
                        (1, 'Cappuccino', 'Espresso with steamed milk', 35.00, 'image/capachino.jpg'),
                        (1, 'Cafe Latte', 'Smooth coffee with milk', 40.00, 'image/cafelatte.jpg'),
                        (1, 'Hot Chocolate', 'Rich chocolate beverage', 30.00, 'image/hotchocolate.jpg'),
                        (1, 'Iced Frappe', 'Chilled coffee frappe', 45.00, 'image/frappe.jpg'),
                        (2, 'Cold Coffee', 'Refreshing cold coffee drink', 25.00, 'image/cold coffee.jpg'),
                        (2, 'Hot Mocha', 'Chocolate coffee blend', 35.00, 'image/HOTMocha.jpg'),
                        (2, 'Ice Lemon Tea', 'Chilled lemon tea', 20.00, 'image/ice lemon tea.jpg'),
                        (3, 'Sandwich', 'Freshly made sandwich', 50.00, 'image/sandwitch.jpg'),
                        (3, 'Corn Maggi', 'Maggi with corn', 40.00, 'image/corn maggi.jpg'),
                        (3, 'Peri Peri Maggi', 'Spicy peri peri maggi', 45.00, 'image/peri peri maggi.jpg');