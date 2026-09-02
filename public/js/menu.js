document.addEventListener("DOMContentLoaded", () => {
    const addToOrderButtons = document.querySelectorAll(".add-to-order-btn");
    const orderItemsList = document.getElementById("order-items-list");
    const orderTotalPrice = document.getElementById("order-total-price");

    let order = []; // store items
    let total = 0;

    // Function to render order
    function renderOrder() {
        orderItemsList.innerHTML = ""; // clear list

        if (order.length === 0) {
            orderItemsList.innerHTML = '<li id="empty-cart-message">Your cart is empty.</li>';
            orderTotalPrice.textContent = "₹0";
            return;
        }

        order.forEach((item, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${item.name} - ₹${item.price}
                <button class="remove-btn" data-index="${index}">❌</button>
            `;
            orderItemsList.appendChild(li);
        });

        orderTotalPrice.textContent = "₹" + total;
    }

    // Add to order
    addToOrderButtons.forEach(button => {
        button.addEventListener("click", () => {
            const itemName = button.getAttribute("data-name");
            const itemPrice = parseInt(button.getAttribute("data-price"));

            order.push({ name: itemName, price: itemPrice });
            total += itemPrice;

            renderOrder();
        });
    });

    // Delegate remove click
    orderItemsList.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-btn")) {
            const index = e.target.getAttribute("data-index");
            total -= order[index].price;
            order.splice(index, 1);
            renderOrder();
        }
    });
});
