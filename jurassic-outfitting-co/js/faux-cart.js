/* i used chatGPT so that it could find elements through all the different hml elements dynamically */

const shopID = 'Jurassic Outfitting Corporation';
const cartTotalID = 'cartTotal';
const cartItemCountID = 'cartItemCount';

if (localStorage.getItem(shopID) === null) {
    localStorage.setItem(shopID, JSON.stringify({ cart: [] }));
}

let shop = JSON.parse(localStorage.getItem(shopID));

class Product {
    constructor(name, desc, price, imgSrc, qty = 1) {
        this.name = name;
        this.desc = desc;
        this.price = price;
        this.imgSrc = imgSrc;
        this.qty = qty;
    }
}

function addToCart(e) {
    e.preventDefault();
    let productContainer = e.target.closest('.product');
    if (!productContainer) {
        console.log("Error: Product container not found");
        return;
    }

    let attributes = {
        name: findTextContent(productContainer, 'prodName'),
        desc: findTextContent(productContainer, 'prodDesc'),
        price: parseFloat(findTextContent(productContainer, 'prodPrice')),
        imgSrc: findImageSrc(productContainer, 'prodImage'),
    };

    if (Object.values(attributes).includes(undefined)) {
        console.log("Error: One or more attributes are undefined, check your class names");
        return;
    }

    for (let item of shop.cart) {
        if (item.name === attributes.name) {
            item.qty++;
            localStorage.setItem(shopID, JSON.stringify(shop));
            console.log("Item already in cart, increased quantity by 1");
            updateCartTotals();
            return;
        }
    }

    shop.cart.push(new Product(...Object.values(attributes)));
    localStorage.setItem(shopID, JSON.stringify(shop));
    updateCartTotals();
}

function findTextContent(container, className) {
    let element = container.querySelector(`.${className}`);
    return element ? element.textContent.trim() : undefined;
}

function findImageSrc(container, className) {
    let element = container.querySelector(`.${className}`);
    return element ? element.src : undefined;
}

function cartTotal() {
    let total = 0;
    let itemCount = 0;

    if (shop.cart.length === 0) return [total, itemCount];

    for (let item of shop.cart) {
        total += item.price * item.qty;
        itemCount += item.qty;
    }

    return [total, itemCount];
}

function updateCartTotals() {
    let total = cartTotal();

    if (document.getElementById(cartTotalID) !== null) {
        document.getElementById(cartTotalID).innerHTML = `${total[0].toFixed(2)}`;
    }

    if (document.getElementById(cartItemCountID) !== null) {
        document.getElementById(cartItemCountID).innerHTML = `${total[1]}`;
    }
}

function updateCart() {
    let cart = document.getElementById('cart');
    let total = 0;

    if (shop.cart.length === 0) {
        cart.innerHTML = '<h3>Your cart is empty</h3>';
        return;
    }

    for (let [index, item] of shop.cart.entries()) {
        total += item.price * item.qty;
        cart.innerHTML += `
        <div class="cartItem">
            <img src="${item.imgSrc}" alt="${item.name}">
            <div class="cartItemInfo" >
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <div class="cartItemPricing">
                    <p>Price: $${item.price.toFixed(2)}</p>
                    <p>Quantity: ${item.qty}</p>
                    <p>Subtotal: $${(item.price * item.qty).toFixed(2)}</p>
                    <a id="${index}" href="#" class="removeBtn">Remove</a>
                </div>
            </div>
        </div>
        `;
    }

    cart.innerHTML += `
    <div class="cartTotal">
        <h3>Total: $${total.toFixed(2)}</h3>
        <a href="#" id="emptyCart">Empty Cart</a>
    </div>
    `;

    document.querySelectorAll('.removeBtn').forEach(button => button.addEventListener('click', removeItem));
    document.getElementById('emptyCart').addEventListener('click', emptyCart);
}

function removeItem(e) {
    e.preventDefault();
    let index = e.target.id;
    shop.cart.splice(index, 1);
    localStorage.setItem(shopID, JSON.stringify(shop));
    location.reload();
}

function emptyCart() {
    shop.cart = [];
    localStorage.setItem(shopID, JSON.stringify(shop));
    location.reload();
}

document.addEventListener("DOMContentLoaded", function () {
    if (document.querySelectorAll('.addToCart') !== null) {
        let cartButtons = document.querySelectorAll('.addToCart');
        cartButtons.forEach(button => button.addEventListener('click', addToCart))
    }

    if (document.getElementById('cart') !== null) {
        updateCart();
    }

    if (shop.cart.length >= 0) {
        updateCartTotals();
    }

    console.log("Ready", shop.cart);
});