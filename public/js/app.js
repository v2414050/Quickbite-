// jss/app.js

// IMPORTANT: Ensure your folder in htdocs is named 'quickbite'
const API_BASE_URL = 'http://localhost/quickbite/backend/api';

// --- API Functions ---
async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'login', email: email, password: password })
        });
        return await response.json();
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Network error.' };
    }
}

async function registerUser(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return await response.json();
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, message: 'Network error.' };
    }
}

async function getCafeteriaMenu(cafeteriaId) {
    try {
        const response = await fetch(`${API_BASE_URL}/cafeterias.php?id=${cafeteriaId}`);
        const data = await response.json();
        return data.menu_items || [];
    } catch (error) {
        console.error('Menu load error:', error);
        return [];
    }
}

async function createOrder(studentId, cafeteriaId, totalAmount, pickupTime, items) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'create',
                student_id: studentId,
                cafeteria_id: cafeteriaId,
                total_amount: totalAmount,
                pickup_time: pickupTime,
                items: items
            })
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: 'Network error.' };
    }
}

// --- Main Logic ---
document.addEventListener("DOMContentLoaded", () => {
    const menuGrid = document.querySelector(".menu-grid");
    const orderItemsList = document.getElementById("order-items-list");
    const orderTotalPrice = document.getElementById("order-total-price");
    const placeOrderButton = document.querySelector(".order-summary .btn-primary");
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const authModal = document.getElementById('authModal');

    let order = [];
    let total = 0;
    let currentCafeteriaId = null;

    // 1. Render Cart
    function renderOrder() {
        if (!orderItemsList) return;
        orderItemsList.innerHTML = "";
        if (order.length === 0) {
            orderItemsList.innerHTML = '<li id="empty-cart-message">Your cart is empty.</li>';
            orderTotalPrice.textContent = "₹0";
            return;
        }
        order.forEach((item, index) => {
            const li = document.createElement("li");
            li.innerHTML = `${item.name} - ₹${item.price} <button class="remove-btn" data-index="${index}" style="border:none; background:none; cursor:pointer;">❌</button>`;
            orderItemsList.appendChild(li);
        });
        orderTotalPrice.textContent = "₹" + total;
    }

    // 2. Load Menu Dynamically
    async function loadMenu(cafeteriaId) {
        if (!menuGrid) return;
        const menuItems = await getCafeteriaMenu(cafeteriaId);
        menuGrid.innerHTML = ''; // Clear existing content

        if (menuItems.length === 0) {
            menuGrid.innerHTML = '<p style="text-align:center; width:100%;">Loading menu from database...</p>';
            // If still empty after fetch, show error
            setTimeout(() => {
                if (menuGrid.innerHTML.includes('Loading')) menuGrid.innerHTML = '<p style="text-align:center; width:100%;">No items found in database for this ID.</p>';
            }, 2000);
            return;
        }

        menuItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'menu-item-card';
            // Use the image_url from DB. If it doesn't start with 'image/', assume it's external or relative.
            const imgPath = item.image_url;

            card.innerHTML = `
                <img src="${imgPath}" alt="${item.name}" class="menu-img">
                <div class="menu-card-footer translucent-card">
                    <h3 class="menu-item-title">${item.name}</h3>
                    <span class="price">₹${item.price}
                    <button class="btn btn-primary add-to-order-btn" 
                        data-name="${item.name}" 
                        data-price="${item.price}" 
                        data-menu-item-id="${item.id}">Add</button></span>
                </div>`;
            menuGrid.appendChild(card);
        });
    }

    // 3. Initialize Page
    function initializeMenuPage() {
        const header = document.getElementById("cafe-name-header");
        if (!header) return;

        const cafeName = header.textContent.trim();
        // MAP NAMES TO DATABASE IDs
        const cafeIdMap = {
            "Urban Menu": 1,
            "Amul Menu": 2,
            "Brio Menu": 3,
            "Nescafé Menu": 4,   
            "CHE Menu": 5,      
            "Samocha Menu": 6,  
            "Cafe2004 Menu": 7  
        };

        currentCafeteriaId = cafeIdMap[cafeName];
        if (currentCafeteriaId) {
            loadMenu(currentCafeteriaId);
        } else {
            console.error("Unknown Cafe Name:", cafeName);
        }
    }

    // --- Event Listeners ---

    // Login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const isVendor = document.getElementById('vendorTab').classList.contains('active');
            const emailSelector = isVendor ? '#vendorLoginFields input[type="email"]' : '#customerLoginFields input[type="email"]';
            const email = loginForm.querySelector(emailSelector).value;
            const password = loginForm.querySelector('input[placeholder="Password"]').value;

            const result = await loginUser(email, password);
            if (result.success) {
                alert(`Welcome back, ${result.user.name}!`);
                localStorage.setItem('currentUser', JSON.stringify(result.user));
                if (authModal) authModal.style.display = 'none';
            } else {
                alert(`Login failed: ${result.message}`);
            }
        });
    }

    // Register
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = registerForm.querySelector('input[placeholder="Password"]').value;
            const confirm = registerForm.querySelector('input[placeholder="Confirm Password"]').value;

            if (password !== confirm) { alert("Passwords don't match"); return; }

            const isVendor = document.getElementById('vendorTab').classList.contains('active');
            let userData = { action: 'register', password: password };

            if (isVendor) {
                userData.user_type = 'vendor';
                userData.name = registerForm.querySelector('#vendorRegisterFields input:nth-child(1)').value;
                userData.email = registerForm.querySelector('#vendorRegisterFields input[type="email"]').value;
                userData.phone = registerForm.querySelector('#vendorRegisterFields input[type="tel"]').value;
            } else {
                userData.user_type = 'student';
                userData.name = registerForm.querySelector('#customerRegisterFields input:nth-child(1)').value;
                userData.email = registerForm.querySelector('#customerRegisterFields input[type="email"]').value;
                userData.student_id = registerForm.querySelector('#customerRegisterFields input:nth-child(3)').value;
            }

            const result = await registerUser(userData);
            if (result.success) {
                alert("Registered! Please login.");
                registerForm.classList.add('hidden');
                loginForm.classList.remove('hidden');
            } else {
                alert("Error: " + result.message);
            }
        });
    }

    // Cart Interactions (Add/Remove)
    document.body.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-to-order-btn")) {
            order.push({
                name: e.target.dataset.name,
                price: parseInt(e.target.dataset.price),
                menu_item_id: parseInt(e.target.dataset.menuItemId)
            });
            total += parseInt(e.target.dataset.price);
            renderOrder();
        }
        if (e.target.classList.contains("remove-btn")) {
            const index = e.target.dataset.index;
            total -= order[index].price;
            order.splice(index, 1);
            renderOrder();
        }
    });

    // Place Order
    if (placeOrderButton) {
        placeOrderButton.addEventListener("click", async () => {
            const storedUser = localStorage.getItem('currentUser');
            if (!storedUser) { alert("Please Login First"); if (authModal) authModal.style.display = 'flex'; return; }
            if (order.length === 0) { alert("Cart is empty"); return; }

            const user = JSON.parse(storedUser);
            const items = order.map(i => ({ menu_item_id: i.menu_item_id, quantity: 1, price: i.price }));
            const pickupTime = new Date(Date.now() + 20 * 60000).toISOString().slice(0, 19).replace('T', ' ');

            const res = await createOrder(user.id, currentCafeteriaId, total, pickupTime, items);
            if (res.success) {
                alert(`Order Placed! ID: ${res.order_id}`);
                order = []; total = 0; renderOrder();
            } else {
                alert("Order Failed: " + res.message);
            }
        });
    }

    initializeMenuPage();
});
async function loadVendorOrders(vendorId) {
    const listContainer = document.getElementById('vendor-orders-list');
    if (!listContainer) return;

    try {
        const response = await fetch(`${API_BASE_URL}/orders.php?vendor_id=${vendorId}`);
        const data = await response.json();

        if (data.success && data.orders.length > 0) {
            listContainer.innerHTML = ''; // Clear loading message

            data.orders.forEach(order => {
                const orderDiv = document.createElement('div');
                orderDiv.className = 'order-card';

                // Format the DB time for the input value (YYYY-MM-DDTHH:MM)
                const jsDate = new Date(order.pickup_time);
                // Adjust for timezone offset to display correctly in input
                jsDate.setMinutes(jsDate.getMinutes() - jsDate.getTimezoneOffset());
                const formattedTime = jsDate.toISOString().slice(0, 16);

                orderDiv.innerHTML = `
                    <div class="order-info">
                        <h3>Order #${order.id}</h3>
                        <p><strong>Student:</strong> ${order.student_name}</p>
                        <p><strong>Total:</strong> ₹${order.total_amount}</p>
                        <p><strong>Current Pickup:</strong> ${order.pickup_time}</p>
                    </div>
                    <div class="order-actions">
                        <label>New Time:</label>
                        <input type="datetime-local" class="time-input" id="time-${order.id}" value="${formattedTime}">
                        <button class="btn btn-primary" onclick="updateOrderTime(${order.id})">Update</button>
                    </div>
                `;
                listContainer.appendChild(orderDiv);
            });
        } else {
            listContainer.innerHTML = '<p>No orders found.</p>';
        }
    } catch (error) {
        console.error("Error loading orders:", error);
    }
}

// 2. Update the Time
async function updateOrderTime(orderId) {
    const newTimeInput = document.getElementById(`time-${orderId}`).value;

    // Format for MySQL (replace 'T' with ' ')
    const mysqlTime = newTimeInput.replace('T', ' ') + ':00';

    try {
        const response = await fetch(`${API_BASE_URL}/orders.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'update_time',
                order_id: orderId,
                new_time: mysqlTime
            })
        });
        const result = await response.json();

        if (result.success) {
            alert("Pickup time updated!");
            // Reload the list to show changes
            const user = JSON.parse(localStorage.getItem('currentUser'));
            loadVendorOrders(user.id);
        } else {
            alert("Update failed: " + result.message);
        }
    } catch (error) {
        console.error("Error updating time:", error);
    }
}