function addToCartUniversal(name, price, type) {

    let qtyInput = document.getElementById("qty-" + name);
    let unitSelect = document.getElementById("unit-" + name);

    if (!qtyInput) {
        alert("Quantity input not found!");
        return;
    }

    let qty = parseFloat(qtyInput.value);
    let unit = unitSelect ? unitSelect.value : "pc";

    if (isNaN(qty) || qty <= 0) {
        alert("Enter valid quantity");
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.push({
        name: name,
        price: price,
        qty: qty,
        unit: unit,
        type: type
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(name + " Added ✅");
}