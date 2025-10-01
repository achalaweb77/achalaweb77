
async function InitializationShopping() {
    const myListItem = document.getElementById("Mylist-items"); 
    const asideContainer = document.getElementById("aside-container"); 
    const cartIcon = document.getElementById("cart-icon");
    const hideAsideContainer = document.getElementById("hide-aside-container");
    const emptyCart = document.querySelector(".cart-empty"); 
    const displayCart = document.querySelector(".cart-display"); 
    const cartCount = document.querySelector(".count");
    const cartList = document.querySelector(".cart-list");  
    const cartTotalAmount = document.querySelector(".total-amount");

    let cart = []; 


    try {
        const response = await fetch("../data/app.json");
        const data = await response.json();

       // Reset the itemlist 
        myListItem.innerHTML = "";
        
        // Add data-id to each product
        const products = data.Menu.map(items => {
            return `
            <li class="list-product" data-id="${items.id}">
                <img src="${items.image}" alt="${items.Name}">
                <h3>${items.Name}</h3>
                <p>₦${items.price}</p>
                <button class="btn">Add to Cart</button>
            </li>
            `;
        }).join("");

        myListItem.innerHTML = products;

       // Add to Cart button functionality

       const addToCartButtons = document.querySelectorAll(".btn");

       addToCartButtons.forEach(button => {
           button.addEventListener("click", (event) => {
              const productId = event.target.closest("li").dataset.id;
                addToCart(productId)
           });
       });

        function saveCart(){
           localStorage.setItem("myCart", JSON.stringify(cart));
            
       } 

     function addToCart(productId) {
     const productDetails = data.Menu.find(productItem=> productItem.id == productId);
     const productIndex = cart.findIndex(item => item.id == productId);

    if (productIndex < 0) {
        cart.push({ ...productDetails, quantity: 1 });
    } else {
        cart[productIndex].quantity += 1;
    }

    saveCart();
    renderCart();
}


      function renderCart() {
    cartList.innerHTML = "";

    let itemCount = 0;
    let totalAmount = 0;

    if (cart.length === 0) {
        displayCart.classList.add("hidden");
        emptyCart.style.display = "flex";
        cartCount.textContent = 0;
        cartTotalAmount.textContent = "₦0.00";
        return;
    }

    displayCart.classList.remove("hidden");
    emptyCart.style.display = "none";

    cart.forEach(cartItem => {
    itemCount += cartItem.quantity;
    totalAmount += cartItem.quantity * cartItem.price;

    const newProduct = document.createElement("li");
    newProduct.className = "cart-item";
    newProduct.setAttribute("data-id", cartItem.id);

    newProduct.innerHTML = `
        <img src="${cartItem.image}" alt="${cartItem.Name}">
        <div class="item-detail">
            <h3>${cartItem.Name}</h3>
            <article>
                <p>@₦${cartItem.price}</p>
                <p class="item-price">₦${cartItem.price * cartItem.quantity}</p>
            </article>
        </div>
        <div class="item-quantity">
            <span class="decrease-quantity"><</span>
            <span class="cartitem-quantity">${cartItem.quantity}</span>
            <span class="increase-quantity">></span>
        </div>
        <span class="remove-cartitem hidden">X</span>
    `;


        const decreaseBtn = newProduct.querySelector(".decrease-quantity");
        const increaseBtn = newProduct.querySelector(".increase-quantity");

        decreaseBtn.addEventListener("click", () => {
            if (cartItem.quantity > 1) {
                cartItem.quantity -= 1;
            } else {
                cart = cart.filter(item => item.id !== cartItem.id);

            }
            saveCart();
            renderCart();
        });

        increaseBtn.addEventListener("click", () => {
            cartItem.quantity += 1;
            saveCart();
            renderCart();
        });

        cartList.appendChild(newProduct);
    });

    cartCount.textContent = itemCount;
    cartTotalAmount.textContent = `₦${totalAmount}`;
}
     
        // asideContainer Toggle
        cartIcon.addEventListener("click", () => {
            asideContainer.classList.toggle("active");
        });

        hideAsideContainer.addEventListener("click", () => {
            asideContainer.classList.remove("active");
        });

    } catch (error) {
        myListItem.textContent = "Sorry an error occurred while fetching the data.";
    }

    if (localStorage.getItem("myCart")) {
    cart = JSON.parse(localStorage.getItem("myCart"));
    renderCart();  
}

}

InitializationShopping();
