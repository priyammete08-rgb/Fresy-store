
fetch("products.json")
.then(res => res.json())
.then(data => {

  let container = document.querySelector(".products");
  if(!container) return;

  data.forEach(product => {

    // 🔥 শুধু vegetable দেখাবে
    if(product.category !== "vegetable") return;

    container.innerHTML += `
      <div class="card">

        <img src="${product.image}">
        <h4>${product.name}</h4>

        <p>
          ${product.oldPrice ? 
            `<span class="old-price">₹${product.oldPrice}</span>` 
            : ""}

          ₹${product.price} / ${product.unit}
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


function changeQty(id, change){
  let input = document.getElementById("qty-" + id);
  let value = parseInt(input.value) || 1;
  value += change;
  if(value < 1) value = 1;
  input.value = value;
}

function addToCart(name, price, id){

  let qty = parseInt(document.getElementById("qty-" + id).value) || 1;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let item = cart.find(i => i.name === name);

  item ? item.qty += qty : cart.push({name, price, qty});

  localStorage.setItem("cart", JSON.stringify(cart));

  alert(name + " Added ✅");

  document.getElementById("qty-" + id).value = 1;
}