document.addEventListener("DOMContentLoaded", refreshPgCart);

function refreshPgCart() {
    // Grocery Cart
    let cartIcon = document.getElementById("cart-icon");
    let groceryCart = document.querySelector(".cart-container");
    let closeCart = document.querySelector("#close-cart");


    if (cartIcon && groceryCart && closeCart) {
        // Function to show the cart
        function showCart() {
            groceryCart.classList.add("active");
        }
        // Function to hide the cart
        function hideCart() {
            groceryCart.classList.remove("active");
        }
        // Add event listeners to show/hide cart
        cartIcon.addEventListener("click", showCart);
        closeCart.addEventListener("click", hideCart);
    } else {
        console.error("Cart icon or close button not found in the DOM.");
    }





    // Function to show the cart
    function showCart() {
        groceryCart.classList.add("active");
    }

    // Function to hide the cart
    function hideCart() {
        groceryCart.classList.remove("active");
    }

    // Add event listeners to show/hide cart
    cartIcon.addEventListener("click", showCart);
    closeCart.addEventListener("click", hideCart);

    // Remove products from the cart
    var removeCartButtons = document.getElementsByClassName("cart-remove");
    for (var i = 0; i < removeCartButtons.length; i++) {
        var button = removeCartButtons[i];
        button.addEventListener("click", removeCartItem);
    }

    // Check when the customer changes the quantity input
    let quantityInputs = document.querySelectorAll(".quantity-value");

    for (let i = 0; i < quantityInputs.length; i++) {
        let input = quantityInputs[i];
        input.addEventListener("change", addProductFromInput);
    }

    // Function to add the product to the cart when the quantity is changed by the customer
    function addProductFromInput(event) {
        let input = event.target;
        let productItem = input.closest(".product-item");
        if (!productItem) {
            console.error("Product item not found.");
            return;
        }
        let title = productItem.querySelector(".product-title");
        let pricePerUnit = productItem.querySelector(".price-per-unit");
        let quantity = parseFloat(input.value);
        let productImg = productItem.querySelector(".product-img");

        if (!title || !pricePerUnit || !productImg) {
            console.error("Required product information is missing.");
            return;
        }

        title = title.innerText;
        pricePerUnit = parseFloat(pricePerUnit.innerText.replace("Rs ", "").replace(",", "").replace("/kg", ""));
        productImg = productImg.src;

        if (quantity > 0) {
            addProductToCart(title, pricePerUnit, quantity, productImg);
        }
        updateTotal();
    }

    // Function to add the product to the cart table
    function addProductToCart(title, pricePerUnit, quantity, productImg) {
        let cartItems = document.querySelector("#cart-items");

        let cartRows = cartItems.getElementsByTagName("tr");

        for (let i = 0; i < cartRows.length; i++) {
            let cartRow = cartRows[i];
            let productTitle = cartRow.querySelector(".cart-product-title h3").innerText;
            if (productTitle === title) {
                alert("You have already added this product to your grocery cart");
                return;
            }
        }

        let cartProductRow = document.createElement("tr");
        let price = pricePerUnit * quantity;
        cartProductRow.innerHTML = `
            <td><img src="${productImg}" alt="${title}" class="cart-img"></td>
            <td><div class="cart-product-title"><h3>${title}</h3></div></td>
            <td><div class="cart-price-unit">${formatPrice(pricePerUnit)}</div></td>
            <td><input type="number" value="${quantity}" min="0" step="0.1" class="cart-quantity"></td>
            <td><i class="fa-solid fa-trash-can cart-remove"></i></td>
            <td><div class="cart-price">${formatPrice(price)}</div></td>
        `;

        cartItems.append(cartProductRow);

        cartProductRow.querySelector(".cart-remove").addEventListener("click", removeCartItem);
        cartProductRow.querySelector(".cart-quantity").addEventListener("change", quantityChanged);
        updateTotal(); 
    }

    // Function to remove product from the cart
    function removeCartItem(event) {
        let buttonClicked = event.target;
        buttonClicked.closest("tr").remove();
        updateTotal();
    }

    // Function to handle quantity changes
    function quantityChanged(event) {
        let input = event.target;

        if (isNaN(input.value) || input.value <= 0) {
            input.value = 1;
        }

        updateTotal();
    }

    

    // Add event listener for Buy Now button outside of updateTotal function
    const buyButton = document.querySelector(".btn-buy a");
    buyButton.addEventListener("click", saveCartItems);

    function saveCartItems(event) {
        event.preventDefault();

        const cartItems = document.querySelectorAll("#cart-items tr");

        if (cartItems.length === 0) {
            alert("Your cart is empty. Add items to the cart before proceeding.");
            return;
        }

        const cartData = [];
        for (let i = 0; i < cartItems.length; i++) {
            const item = cartItems[i];
            cartData.push({
                productImage: item.querySelector(".cart-img").src,
                productName: item.querySelector(".cart-product-title h3").innerText,
                productPricePerUnit: item.querySelector(".cart-price-unit").innerText,
                productQuantity: item.querySelector(".cart-quantity").value,
                productPrice: item.querySelector(".cart-price").innerText
            });
        }

        saveToLocalStorage("cartData", cartData);
        redirectToOrderPage();
    }

    function saveToLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    function redirectToOrderPage() {
        window.location.href = "order.html";
    }
}

// Add to Favorites Button functionality
document.querySelector(".add-fav-btn").addEventListener("click", saveFavorites);

function saveFavorites() {
    const cartItems = document.querySelectorAll("#cart-items tr");

    // Check if cart is empty
    if (cartItems.length === 0) {
        alert("Your cart is empty. Add items to the cart before proceeding.");
        return;
    }

    const favoritesData = [];

    // Collect Cart Items and Create Favorites Data
    for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        favoritesData.push({
            productImage: item.querySelector(".cart-img").src,
            productName: item.querySelector(".cart-product-title h3").innerText,
            productPricePerUnit: item.querySelector(".cart-price-unit").innerText,
            productQuantity: item.querySelector(".cart-quantity").value,
            productPrice: item.querySelector(".cart-price").innerText
        });
    }

    // Save to Local Storage
    localStorage.setItem("favorites", JSON.stringify(favoritesData));

    // Display Confirmation
    alert("Favorites saved!");
}

// Apply Favorites Button functionality
document.querySelector(".add-fav-btn").addEventListener("click", saveFavorites);

function applyFavorites() {
    const favoritesData = JSON.parse(localStorage.getItem("favorites"));
    if (favoritesData && favoritesData.length > 0) {
        favoritesData.forEach(item => {
            addFavoriteProductToCart(
                item.productName,
                parseFloat(item.productPricePerUnit.replace(",", "")),
                parseFloat(item.productQuantity),
                item.productImage
            );
        });
        updateTotal();
        alert("Favorites applied!");
    } else {
        alert("No favorites found!");
    }
}

document.querySelector(".apply-fav-btn").addEventListener("click", applyFavorites);
// Function to add favorite product to the cart
function addFavoriteProductToCart(title, pricePerUnit, quantity, productImg) {
    let cartItems = document.querySelector("#cart-items");

    let cartRows = cartItems.getElementsByTagName("tr");

    for (let i = 0; i < cartRows.length; i++) {
        let cartRow = cartRows[i];
        let productTitle = cartRow.querySelector(".cart-product-title h3").innerText;
        if (productTitle === title) {
           return; // Exit function after updating existing item
            
        }
    }

    // Add new row if item is not in the cart
    let cartProductRow = document.createElement("tr");
    let price = pricePerUnit * quantity;
    cartProductRow.innerHTML = `
        <td><img src="${productImg}" alt="${title}" class="cart-img"></td>
        <td><div class="cart-product-title"><h3>${title}</h3></div></td>
        <td><div class="cart-price-unit">${formatPrice(pricePerUnit)}</div></td>
        <td><input type="number" value="${quantity}" min="0" step="0.1" class="cart-quantity"></td>
        <td><i class="fa-solid fa-trash-can cart-remove"></i></td>
        <td><div class="cart-price">${formatPrice(price)}</div></td>
    `;

    cartItems.append(cartProductRow);

    cartProductRow.querySelector(".cart-remove").addEventListener("click", removeCartItem);
    cartProductRow.querySelector(".cart-quantity").addEventListener("change", quantityChanged);
}

// Function to format price with thousands separator and two decimal places

function formatPrice(price) {
    return price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}


// Function to update the total and calculate it based on the number of items in the cart
function updateTotal() {
    let cartContent = document.querySelector("#cart-items");
    let cartRows = cartContent.getElementsByTagName("tr");
    let total = 0;
    for (let i = 0; i < cartRows.length; i++) {
        let cartRow = cartRows[i];
        let priceElement = cartRow.querySelector(".cart-price-unit");
        let quantityElement = cartRow.querySelector(".cart-quantity");
        let priceElementCalculated = cartRow.querySelector(".cart-price");

        if (priceElement && quantityElement) {
            let price = parseFloat(priceElement.innerText.replace(",", ""));
            let quantity = quantityElement.value;
            let totalPrice = price * quantity;
            total += totalPrice;
            priceElementCalculated.innerText = formatPrice(totalPrice);
        }
    }
    total = Math.round(total * 100) / 100;
    document.querySelector(".total-price").innerText = "Rs " + formatPrice(total);
}
