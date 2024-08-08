document.addEventListener('DOMContentLoaded', refreshPgOrder);

function refreshPgOrder() {
    const cartData = loadFromLocalStorage("cartData");
    if (cartData) {
        populateCartItems(cartData);
        updateOrderTotal(cartData);
    }

    function loadFromLocalStorage(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    function populateCartItems(cartData) {
        const cartItemsContainer = document.getElementById("cart-items");
        cartData.forEach(item => {
            const row = createCartItemRow(item);
            cartItemsContainer.appendChild(row);
        });
    }

    function createCartItemRow(item) {
        const row = document.createElement('tr');
        row.classList.add('cart-item');

        row.innerHTML = `
            <td><img src="${item.productImage}" alt="" class="cart-img"></td>
            <td class="cart-product-title">${item.productName}</td>
            <td class="cart-product-price-unit">${item.productPricePerUnit}</td>
            <td class="cart-quantity">${item.productQuantity}</td>
            <td class="cart-price">${item.productPrice}</td>
        `;

        return row;
    }

    // Function to update the total price
    function updateOrderTotal() {
        const cartData = loadFromLocalStorage('cartData');
        let subtotal = 0;

        for (let i = 0; i < cartData.length; i++) {
            let item = cartData[i];
            let price = item.productPrice.replace('Rs', '').replace(',', '');
            subtotal += parseFloat(price);
        }

        document.querySelector('.subtotal-price').textContent = 'Rs ' + subtotal.toFixed(2);

        let deliveryFee = parseFloat(document.querySelector('.delivery-price').textContent.replace('Rs', '').replace(',', ''));
        let taxes = parseFloat(document.querySelector('.taxes-price').textContent.replace('Rs', '').replace(',', ''));
        let total = subtotal + deliveryFee + taxes;

        document.querySelector('.order-price').textContent = 'Rs ' + total.toFixed(2);
    }

    const payNowButton = document.querySelector(".pay-now-btn");

    // Add the event listener to the pay now button
    payNowButton.addEventListener("click", displayDeliveryDate);

    // Function to display the delivery date
    function displayDeliveryDate() {
        const title = document.getElementById("Title").value;
        const firstName = document.getElementById("textbox01").value;
        const nic = document.getElementById("textbox03").value;
        const address = document.getElementById("address1").value;
        const phone = document.getElementById("phone").value;
        const paymentMethod = document.querySelector('input[name="payment"]:checked');

        // Custom validation
        if (title === "Title" || firstName === "" || nic === "" || address === "" || phone === "") {
            alert("Please fill in all the required fields.");
            return;
        }

        // Validate phone number pattern
        const phonePattern = /^07[0-9]{8}$/;
        if (!phonePattern.test(phone)) {
            alert("Please enter a valid phone number in the format 07********.");
            return;
        }

        // Validate payment method
        if (!paymentMethod) {
            alert("Please select a payment method.");
            return;
        }

        // If all fields are filled and valid, proceed to display the thank you message
        let today = new Date();
        let deliveryDate = new Date(today.setDate(today.getDate() + 2)).toDateString();

        alert(`Thank you ${title} ${firstName} for your purchase! Your order will be delivered on ${deliveryDate}.`);

        // Clear the cart data from local storage
        localStorage.removeItem('cartData');
    }
}


