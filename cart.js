// localStorage theke cart load
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function loadCart() {

    const container = document.getElementById("cart-items");
    container.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty 🛒</p>";
        document.getElementById("total").innerText = 0;
        return;
    }

    cart.forEach((item, index) => {

        total += item.price * item.qty;

        container.innerHTML += `
            <div class="cart-item">
                <h3>${item.name}</h3>
                <p>Price: ₹${item.price}</p>
                <p>Quantity: ${item.qty}</p>
                <p>Company: ${item.company}</p>
                <p>Subtotal: ₹${item.price * item.qty}</p>
                <button onclick="removeItem(${index})">Remove</button>
            </div>
        `;
    });

    document.getElementById("total").innerText = total;
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

function clearCart() {
    localStorage.removeItem("cart");
    cart = [];
    loadCart();
}
loadcart();
