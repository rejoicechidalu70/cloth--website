const menuBtn = document.querySelector("#menu-btn");
const navLinks = document.querySelector("#nav-links");
// target the icon inside the menu button specifically (avoid selecting the cart icon)
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", (e) => {
    navLinks.classList.toggle("open");

    const isOpen = navLinks.classList.contains("open");
    menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");

});


navLinks.addEventListener("click", (e) => {
    navLinks.classList.remove("open");
    menuBtnIcon.setAttribute("class", "ri-menu-line");

});


const scrollRevealOption = {
    origin:"bottom",
    distance:"50px",
    duration: 1000,
};

const scrollRevealInstance = typeof window.scrollReveal === "function"
    ? window.scrollReveal()
    : (typeof window.ScrollReveal === "function" ? window.ScrollReveal() : null);

function revealElement(selector, options = {}) {
    if (!scrollRevealInstance) return;
    scrollRevealInstance.reveal(selector, options);
}

revealElement(".header__image img", {
    ...scrollRevealOption,
    origin:"right",
});
revealElement(".header__content h1", {
    ...scrollRevealOption,
    delay:500,
});
revealElement(".header__content p", {
    ...scrollRevealOption,
    delay:1000,
});
revealElement(".header__btns", {
    ...scrollRevealOption,
    delay:1500,
});

const banner = document.querySelector(".banner__container");

const bannerContent = Array.from(banner.children);

bannerContent.forEach(item => {
    const duplicateNode = item.cloneNode(true);
    duplicateNode.setAttribute("aria-hidden", true)
    banner.appendChild(duplicateNode);
});

revealElement(".arrival__card", {
    ...scrollRevealOption,
    interval:500,
});

revealElement(".sale__image img", {
    ...scrollRevealOption,
    origin:"left",
});
revealElement(".sale__content h2", {
    ...scrollRevealOption,
    delay:500,
});
revealElement(".sale__content p", {
    ...scrollRevealOption,
    delay:1000,
});
revealElement(".sale__content h4", {
    ...scrollRevealOption,
    delay:1000,
});
revealElement(".sale__btn", {
    ...scrollRevealOption,
    delay:1500,
});

revealElement(".favourite__card", {
    ...scrollRevealOption,
    interval:500,
});

// ===== CART FUNCTIONALITY =====

let cart = [];

// Cart DOM Elements
const cartBtn = document.getElementById("cart-btn");
const cartSidebar = document.getElementById("cart-sidebar");
const cartOverlay = document.getElementById("cart-overlay");
const closeCartBtn = document.getElementById("close-cart");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");
const cartCountElement = document.querySelector(".cart__count");
const shopHereBtn = document.getElementById("shop-here-btn");
const whatsappLink = document.getElementById("whatsapp-float");
const whatsappNumber = "09131811222";

function openWhatsApp(productName, price, size, color) {
    if (!whatsappLink) return;

    const message = `Hello! I’m interested in ${productName} in size ${size} and ${color}. The price is ₦${price.toLocaleString("en-NG")}. Please send me more details.`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    whatsappLink.setAttribute("href", url);
    window.open(url, "_blank", "noopener,noreferrer");
}

if (shopHereBtn) {
    shopHereBtn.addEventListener("click", () => {
        document.getElementById("catalogue")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
}

// Track selected size and color for each product card
const productCards = document.querySelectorAll(".arrival__card, .favourite__card");

productCards.forEach(card => {
    let selectedSize = null;
    let selectedColor = null;

    const sizeButtons = card.querySelectorAll(".size-btn");
    const colorButtons = card.querySelectorAll(".color-btn");
    const addBtn = card.querySelector(".add-to-cart-btn");

    if (!addBtn) return;

    if (sizeButtons.length) {
        selectedSize = sizeButtons[0].dataset.size;
        sizeButtons[0].classList.add("selected");
    }

    if (colorButtons.length) {
        selectedColor = colorButtons[0].dataset.color;
        colorButtons[0].classList.add("selected");
    }

    sizeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            sizeButtons.forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            selectedSize = btn.dataset.size;
        });
    });

    colorButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            colorButtons.forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            selectedColor = btn.dataset.color;
        });
    });

    addBtn.addEventListener("click", () => {
        if (!selectedSize) {
            selectedSize = sizeButtons[0]?.dataset.size || "M";
        }
        if (!selectedColor) {
            selectedColor = colorButtons[0]?.dataset.color || "#000000";
        }

        const productName = addBtn.dataset.product;
        const productPrice = parseFloat(addBtn.dataset.price);

        const cartItem = {
            id: Date.now(),
            name: productName,
            price: productPrice,
            size: selectedSize,
            color: selectedColor,
        };

        cart.push(cartItem);
        updateCart();
        openCart();
        openWhatsApp(productName, productPrice, selectedSize, selectedColor);
        showNotification(`${productName} added to cart!`);
    });
});

function openCart() {
    if (!cartSidebar || !cartOverlay) return;
    cartSidebar.classList.add("open");
    cartOverlay.classList.add("open");
}

function closeCart() {
    if (!cartSidebar || !cartOverlay) return;
    cartSidebar.classList.remove("open");
    cartOverlay.classList.remove("open");
}

// Open/Close Cart
if (cartBtn) {
    cartBtn.addEventListener("click", openCart);
}

if (closeCartBtn) {
    closeCartBtn.addEventListener("click", closeCart);
}

if (cartOverlay) {
    cartOverlay.addEventListener("click", closeCart);
}

// Update Cart Display
function updateCart() {
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
    
    if (!cartItemsContainer || !cartTotalElement) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotalElement.textContent = "$0.00";
        return;
    }

    let total = 0;
    cartItemsContainer.innerHTML = "";

    cart.forEach(item => {
        total += item.price;
        const cartItemHTML = `
            <div class="cart__item">
                <div class="cart__item-info">
                    <div class="cart__item-name">${item.name}</div>
                    <div class="cart__item-details">
                        Size: ${item.size} | Color: <span style="display: inline-block; width: 12px; height: 12px; background-color: ${item.color}; border-radius: 50%; border: 1px solid #ccc;"></span>
                    </div>
                    <div class="cart__item-price">$${item.price.toFixed(2)}</div>
                </div>
                <button class="remove-from-cart-btn" data-item-id="${item.id}">Remove</button>
            </div>
        `;
        cartItemsContainer.insertAdjacentHTML("beforeend", cartItemHTML);
    });

    // Add remove functionality
    const removeButtons = cartItemsContainer.querySelectorAll(".remove-from-cart-btn");
    removeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const itemId = parseInt(btn.dataset.itemId);
            cart = cart.filter(item => item.id !== itemId);
            updateCart();
        });
    });

    cartTotalElement.textContent = `$${total.toFixed(2)}`;
}

// Show notification
function showNotification(message) {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    const style = document.createElement("style");
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;

    if (!document.querySelector("style[data-notification]")) {
        style.setAttribute("data-notification", "true");
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = "slideOut 0.3s ease";
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

// ===== CHECKOUT FUNCTIONALITY =====

const checkoutBtn = document.querySelector(".checkout-btn");
const checkoutModal = document.getElementById("checkout-modal");
const checkoutOverlay = document.getElementById("checkout-overlay");
const closeCheckoutBtn = document.getElementById("close-checkout");
const backToCartBtn = document.getElementById("back-to-cart-btn");
const checkoutForm = document.getElementById("checkout-form");
const orderSummary = document.getElementById("order-summary");
const checkoutTotal = document.getElementById("checkout-total");

// Open Checkout
if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Your cart is empty. Please add items before checking out.");
            return;
        }
        
        populateOrderSummary();
        if (checkoutModal) checkoutModal.classList.add("open");
        if (checkoutOverlay) checkoutOverlay.classList.add("open");
        if (cartSidebar) cartSidebar.classList.remove("open");
        if (cartOverlay) cartOverlay.classList.remove("open");
    });
}

// Close Checkout
if (closeCheckoutBtn) {
    closeCheckoutBtn.addEventListener("click", () => {
        if (checkoutModal) checkoutModal.classList.remove("open");
        if (checkoutOverlay) checkoutOverlay.classList.remove("open");
    });
}

if (checkoutOverlay) {
    checkoutOverlay.addEventListener("click", () => {
        if (checkoutModal) checkoutModal.classList.remove("open");
        checkoutOverlay.classList.remove("open");
    });
}

if (backToCartBtn) {
    backToCartBtn.addEventListener("click", () => {
        if (checkoutModal) checkoutModal.classList.remove("open");
        if (checkoutOverlay) checkoutOverlay.classList.remove("open");
        if (cartSidebar) cartSidebar.classList.add("open");
        if (cartOverlay) cartOverlay.classList.add("open");
    });
}

// Populate Order Summary in Checkout
function populateOrderSummary() {
    if (!orderSummary || !checkoutTotal) return;
    orderSummary.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        total += item.price;
        const summaryItem = document.createElement("div");
        summaryItem.className = "summary__item";
        summaryItem.innerHTML = `
            <span>${item.name} (${item.size})</span>
            <span>$${item.price.toFixed(2)}</span>
        `;
        orderSummary.appendChild(summaryItem);
    });

    checkoutTotal.textContent = `$${total.toFixed(2)}`;
}

// Handle Form Submission
if (checkoutForm) {
    checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form values
    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const state = document.getElementById("state").value;
    const zipcode = document.getElementById("zipcode").value;
    const cardname = document.getElementById("cardname").value;
    const cardnumber = document.getElementById("cardnumber").value;
    const expiry = document.getElementById("expiry").value;
    const cvv = document.getElementById("cvv").value;

    // Validate card number (simple validation)
    if (!/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/.test(cardnumber.replace(/\s/g, ""))) {
        alert("Please enter a valid card number");
        return;
    }

    // Validate expiry date
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        alert("Please enter expiry date in MM/YY format");
        return;
    }

    // Validate CVV
    if (!/^\d{3,4}$/.test(cvv)) {
        alert("Please enter a valid CVV");
        return;
    }

    const orderData = {
        customer: {
            name: fullname,
            email: email,
            phone: phone,
            address: address,
            city: city,
            state: state,
            zipcode: zipcode,
        },
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price, 0),
    };

    try {
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        });
        const result = await response.json();
        if (!response.ok) {
            alert(result.message || 'Checkout failed.');
            return;
        }
        processOrder(result.order);
    } catch (error) {
        console.error(error);
        alert('Unable to complete checkout. Please try again later.');
    }
    });
}

// Process Order
function processOrder(orderData) {
    // Close checkout modal
    checkoutModal.classList.remove("open");
    checkoutOverlay.classList.remove("open");

    // Show success message
    const successMessage = document.createElement("div");
    successMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #4CAF50;
        color: white;
        padding: 2rem;
        border-radius: 1rem;
        text-align: center;
        z-index: 1000;
        min-width: 300px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    `;
    
    successMessage.innerHTML = `
        <h2 style="margin-bottom: 1rem;">✓ Order Confirmed!</h2>
        <p style="margin-bottom: 0.5rem;"><strong>Order Number:</strong> ${orderData.orderNumber}</p>
        <p style="margin-bottom: 0.5rem;"><strong>Total Amount:</strong> $${orderData.total.toFixed(2)}</p>
        <p style="margin-bottom: 1rem;">A confirmation email has been sent to ${orderData.customer.email}</p>
        <p style="font-size: 0.9rem; color: rgba(255,255,255,0.9);">Thank you for your purchase!</p>
    `;

    document.body.appendChild(successMessage);

    // Clear cart
    cart = [];
    updateCart();
    checkoutForm.reset();

    // Remove success message after 3 seconds
    setTimeout(() => {
        successMessage.style.opacity = "0";
        successMessage.style.transition = "opacity 0.3s ease";
        setTimeout(() => {
            successMessage.remove();
        }, 300);
    }, 3000);

    // Log order data (in real app, this would be sent to server)
    console.log("Order Data:", orderData);
}

// Format card number input
// Format card number input
const cardNumberInput = document.getElementById("cardnumber");
if (cardNumberInput) {
    cardNumberInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\s/g, "");
        let formattedValue = value.replace(/(\d{4})/g, "$1 ").trim();
        e.target.value = formattedValue;
    });
}

// Format expiry date input
const expiryInput = document.getElementById("expiry");
if (expiryInput) {
    expiryInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length >= 2) {
            value = value.substring(0, 2) + "/" + value.substring(2, 4);
        }
        e.target.value = value;
    });
}

// Format CVV input (numbers only)
const cvvInput = document.getElementById("cvv");
if (cvvInput) {
    cvvInput.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/\D/g, "").substring(0, 4);
    });
}

// Format phone number
const phoneInput = document.getElementById("phone");
if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length <= 10) {
            e.target.value = value;
        }
    });
}

