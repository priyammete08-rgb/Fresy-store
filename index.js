window.onload = function() {

    const searchInput = document.getElementById("searchInput");
    const noResult = document.getElementById("noResult");

    if (!searchInput) {
        console.log("Search input not found!");
        return;
    }

    searchInput.addEventListener("input", function() {

        const value = searchInput.value.toLowerCase().trim();
        const cards = document.querySelectorAll(".products .card");

        let visibleCount = 0;

        cards.forEach(function(card) {

            const name = card.querySelector("h3")
                             .textContent
                             .toLowerCase();

            if (name.includes(value)) {
                card.style.display = "";
                visibleCount++;
            } else {
                card.style.display = "none";
            }

        });

        if (noResult) {
            noResult.style.display = visibleCount === 0 ? "block" : "none";
        }

    });

};


fetch("products.json")
.then(res => res.json())
.then(data => {

  let container = document.querySelector(".products");
  if(!container) return;

  data.forEach(product => {

    let discountHTML = "";
    let oldPriceHTML = "";

    if(product.oldPrice){

      let discountPercent =
        Math.round((product.oldPrice - product.price) 
        / product.oldPrice * 100);

      oldPriceHTML =
        `<span class="old-price">₹${product.oldPrice}</span>`;

      discountHTML =
        `<span class="discount">${discountPercent}% OFF</span>`;
    }

    container.innerHTML += `
      <div class="card">

        <img src="${product.image}">
        <h4>${product.name}</h4>

        <p>
          ${oldPriceHTML}
          ₹${product.price} / ${product.unit}
          ${discountHTML}
        </p>

        <div class="qty-control">
          <button onclick="changeQty(${product.id},-1)">−</button>
          <input type="number" id="qty-${product.id}" value="1">
          <button onclick="changeQty(${product.id},1)">+</button>
        </div>

        <button class="add-btn"
          onclick="addToCart('${product.name}',${product.price},${product.id})">
          Add to Cart
        </button>

      </div>
    `;

  });

});


/* Quantity Change */
function changeQty(id, change){
  let input = document.getElementById("qty-" + id);
  let value = parseInt(input.value) || 1;
  value += change;
  if(value < 1) value = 1;
  input.value = value;
}


/* Add to Cart */
function addToCart(name, price, id){

  let qtyInput = document.getElementById("qty-" + id);

  if(!qtyInput){
    console.error("Quantity input not found for id:", id);
    alert("System error. Please refresh page.");
    return;
  }

  let qty = parseInt(qtyInput.value) || 1;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let item = cart.find(i => i.id === id);

  if(item){
      item.qty += qty;
  } else {
      cart.push({id, name, price, qty});
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  alert(name + " Added to Cart ✅");

  qtyInput.value = 1;
}