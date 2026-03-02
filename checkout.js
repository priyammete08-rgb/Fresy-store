let cart = JSON.parse(localStorage.getItem("cart")) || [];

let appliedDiscount = 0;
let appliedCoupon = "";

/* ================= APPLY COUPON ================= */

function applyCoupon(){

    let code = document.getElementById("couponCode").value.trim().toUpperCase();
    let message = document.getElementById("couponMessage");

    appliedDiscount = 0;
    appliedCoupon = "";

    if(code === "FRESY50"){
        appliedDiscount = 50;
        appliedCoupon = code;
        message.innerText = "₹50 Discount Applied ✅";
        message.style.color = "green";
    }
    else if(code === "SAVE10"){
        appliedCoupon = code;
        message.innerText = "10% Discount Applied ✅";
        message.style.color = "green";
    }
    else if(code === "FREEDEL"){
        appliedCoupon = code;
        message.innerText = "Free Delivery Applied 🚚";
        message.style.color = "green";
    }
    else{
        message.innerText = "Invalid Coupon ❌";
        message.style.color = "red";
    }

    loadSummary();
}


/* ================= SHOW SUMMARY ================= */

function loadSummary(){

    const summary = document.getElementById("order-summary");
    if(!summary) return;

    if(cart.length === 0){
        summary.innerHTML = "<p>Your cart is empty 🛒</p>";
        return;
    }

    let subtotalTotal = 0;
    let html = "<h3>Order Summary:</h3><hr>";

    cart.forEach((item,index)=>{

        let price = Number(item.price);
        let qty = Number(item.qty);
        let subtotal = price * qty;

        subtotalTotal += subtotal;

        html += `
            <p>
            ${index+1}. ${item.name}
            ${item.company ? "(" + item.company + ")" : ""}
            <br>
            ₹${price} × ${qty} = ₹${subtotal.toFixed(2)}
            </p>
        `;
    });

    let deliveryCharge = subtotalTotal >= 500 ? 0 : 40;

    if(appliedCoupon === "FREEDEL"){
        deliveryCharge = 0;
    }

    if(appliedCoupon === "SAVE10"){
        appliedDiscount = subtotalTotal * 0.10;
    }

    let handlingFee = 1;

    let finalTotal = subtotalTotal + deliveryCharge - appliedDiscount + handlingFee;

    html += "<hr>";
    html += `<p>Subtotal: ₹${subtotalTotal.toFixed(2)}</p>`;
    html += `<p>Delivery: ₹${deliveryCharge}</p>`;
    html += `<p>Handling Fee: ₹${handlingFee}</p>`;

    if(appliedDiscount > 0){
        html += `<p>Discount: -₹${appliedDiscount.toFixed(2)}</p>`;
    }

    html += `<h3>Total Payable: ₹${finalTotal.toFixed(2)}</h3>`;

    summary.innerHTML = html;
}

loadSummary();

/* ================= UPI SHOW / HIDE ================= */

document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener("change", function(){
        const upiSection = document.getElementById("upiSection");
        if(!upiSection) return;

        if(this.value === "Online"){
            upiSection.style.display = "block";
        } else {
            upiSection.style.display = "none";
        }
    });
});


/* ================= ORDER SUBMIT ================= */

document.getElementById("orderForm").addEventListener("submit", function(e){

    e.preventDefault();

    if(cart.length === 0){
        alert("Your cart is empty 🛒");
        return;
    }

    const name = this.name.value.trim();
    const mobile = this.mobile.value.trim();
    const address = this.address.value.trim();
    const payment = document.querySelector('input[name="payment"]:checked').value;

    if(!name || !mobile || !address){
        alert("Please fill all details!");
        return;
    }

    if(!/^[6-9]\d{9}$/.test(mobile)){
        alert("Enter valid 10 digit mobile number");
        return;
    }

    if(address.length < 10){
        alert("Enter full address (minimum 10 characters)");
        return;
    }

    if(!confirm("Are you sure you want to place this order?")){
        return;
    }

    /* ===== TIME & ORDER ID ===== */

    let now = new Date();
    let year = now.getFullYear();
    let month = String(now.getMonth()+1).padStart(2,'0');
    let day = String(now.getDate()).padStart(2,'0');
    let hours = String(now.getHours()).padStart(2,'0');
    let minutes = String(now.getMinutes()).padStart(2,'0');
    let seconds = String(now.getSeconds()).padStart(2,'0');

    let orderId = `FRESY-${year}${month}${day}-${hours}${minutes}${seconds}`;

    /* ===== DELIVERY OTP ===== */

    let deliveryCode = Math.floor(1000 + Math.random() * 9000);

    /* ===== TOTAL CALCULATION ===== */

    let subtotalTotal = 0;

    cart.forEach(item=>{
        subtotalTotal += Number(item.price) * Number(item.qty);
    });

    let deliveryCharge = subtotalTotal >= 500 ? 0 : 40;

    if(appliedCoupon === "FREEDEL"){
        deliveryCharge = 0;
    }

    if(appliedCoupon === "SAVE10"){
        appliedDiscount = subtotalTotal * 0.10;
    }

    let handlingFee = 1;

    let finalTotal = subtotalTotal + deliveryCharge - appliedDiscount + handlingFee;

    /* ===== WHATSAPP MESSAGE ===== */

    let message =
`🛒 *New Order - Fresy*
🆔 Order ID: ${orderId}
📅 Date: ${day}/${month}/${year}
⏰ Time: ${hours}:${minutes}:${seconds}
-------------------------
`;

    cart.forEach((item,index)=>{
        message += `${index+1}. ${item.name}${item.company ? " ("+item.company+")":""} - ₹${item.price} x ${item.qty}
`;
    });

    message += `-------------------------
Subtotal: ₹${subtotalTotal.toFixed(2)}
Delivery: ₹${deliveryCharge}
Handling Fee: ₹${handlingFee}
`;

    if(appliedDiscount > 0){
        message += `Discount: -₹${appliedDiscount.toFixed(2)}
`;
    }

    message += `💰 Total Payable: ₹${finalTotal.toFixed(2)}
💳 Payment Mode: ${payment}

(Delivery OTP available with customer)

👤 Name: ${name}
📱 Mobile: ${mobile}
📍 Address: ${address}
`;

    const phoneNumber = "916294737698";
    const whatsappURL =
    "https://wa.me/" + phoneNumber + "?text=" + encodeURIComponent(message);

    /* ===== SAVE OTP LOCALLY ===== */
    localStorage.setItem("lastOrderOTP", deliveryCode);
    localStorage.setItem("lastOrderId", orderId);

    /* ===== SEND TO OLD ORDER SHEET ===== */
    fetch("https://script.google.com/macros/s/AKfycbzOX_ZwFKeBeQZfx_8z6q6I6xa_esuy7fHqJC0PtJzm4hIgcAWtKloJ-4mczVghdnJLgA/exec", {
        method: "POST",
        body: JSON.stringify({
            orderId: orderId,
            date: `${day}/${month}/${year}`,
            time: `${hours}:${minutes}:${seconds}`,
            name: name,
            mobile: mobile,
            address: address,
            payment: payment,
            total: finalTotal.toFixed(2)
        })
    }).catch(err => console.log("Order Sheet Error:", err));

    /* ===== SEND TO DELIVERY VERIFY SHEET ===== */
    fetch("https://script.google.com/macros/s/AKfycbza8Ebkg2Q1RFnU1Kis90COj4EeRDuiUl_Z0_T7Wb4A3bnCbB_yzkmHVIuzJ4O2kNeA/exec", {
        method: "POST",
        body: JSON.stringify({
            orderId: orderId,
            name: name,
            mobile: mobile,
            total: finalTotal,
            deliveryCode: deliveryCode,
            status: "Pending"
        })
    }).catch(err => console.log("Delivery Sheet Error:", err));

    /* ===== OPEN WHATSAPP ===== */
    window.open(whatsappURL, "_blank");

    /* ===== CLEAR CART ===== */
    localStorage.removeItem("cart");

    /* ===== REDIRECT ===== */
    setTimeout(function(){
        window.location.href =
"success.html?orderId=" + encodeURIComponent(orderId) +
"&date=" + encodeURIComponent(day + "/" + month + "/" + year) +
"&time=" + encodeURIComponent(hours + ":" + minutes + ":" + seconds);
    }, 1500);

});