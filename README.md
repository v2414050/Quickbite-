# QuickBite PHP Backend

This is a simple PHP backend for the QuickBite campus food ordering system. It provides REST API endpoints for user authentication, cafeteria management, and order processing.

## Directory Structure

```
backend/
├── api/              # API endpoints
├── config/           # Database configuration and schema
├── controllers/      # Business logic controllers
├── models/           # Data models
├── utils/            # Utility functions
└── index.php         # Main entry point
```

## Setup Instructions

### 1. Database Setup

1. Create a MySQL database named `quickbite`:
   ```sql
   CREATE DATABASE quickbite;
   ```

2. Import the schema:
   ```bash
   mysql -u username -p quickbite < config/schema.sql
   ```

### 2. Configuration

Update the database connection settings in `config/database.php`:
```php
private $host = "localhost";      // Your database host
private $db_name = "quickbite";   // Your database name
private $username = "root";       // Your database username
private $password = "";           // Your database password
```

### 3. Web Server Configuration

Make sure your web server (Apache/Nginx) is configured to serve PHP files and that the backend directory is accessible.

## API Endpoints

### Authentication (`api/auth.php`)

- **POST** `/api/auth.php`
  - Login: `{ "action": "login", "email": "user@example.com", "password": "password" }`
  - Register: `{ "action": "register", "name": "User Name", "email": "user@example.com", "password": "password", "user_type": "student" }`

### Cafeterias (`api/cafeterias.php`)

- **GET** `/api/cafeterias.php` - Get all cafeterias
- **GET** `/api/cafeterias.php?id=1` - Get specific cafeteria and its menu

### Orders (`api/orders.php`)

- **GET** `/api/orders.php?id=1` - Get order details
- **POST** `/api/orders.php` - Create new order or update order status

## Integration with Frontend

To integrate with your existing HTML pages:

1. Include the JavaScript integration code in your menu pages:
   ```html
   <script src="backend/frontend_integration_example.js"></script>
   ```

2. Update your HTML to include menu item IDs:
   ```html
   <button class="btn btn-primary add-to-order-btn" 
           data-name="Classic Coffee" 
           data-price="20" 
           data-menu-item-id="1">
       Add to Order
   </button>
   ```

3. Ensure your web server can serve both frontend HTML files and backend PHP files.

## Security Notes

1. The default schema uses placeholder passwords. In production, always use strong passwords.
2. The schema includes basic password hashing using PHP's `password_hash()` function.
3. CORS headers are set for development. Adjust these for production environments.
4. Validate all inputs in a production environment.

## Database Schema

The database includes tables for:
- Users (students and vendors)
- Cafeterias
- Menu items
- Orders
- Order items

Refer to `config/schema.sql` for the complete schema and sample data.
