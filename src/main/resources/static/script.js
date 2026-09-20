// ================= PRODUCTS =================

function loadProducts() {

    fetch("/products")
        .then(response => response.json())
        .then(products => {

            let productList = document.getElementById("productList");

            if (!productList) {
                return;
            }

            productList.innerHTML = "";

            products.forEach(product => {

                let card = document.createElement("div");

                card.className = "product-card";

                card.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">

                    <div class="product-info">

                        <h3>${product.name}</h3>

                        <p>${product.description}</p>

                        <div class="product-price">
                            ₹${product.price.toLocaleString("en-IN")}
                        </div>

                        <div class="product-stock">
                            ${
                                product.stock > 0
                                ? "In Stock: " + product.stock
                                : "Out of Stock"
                            }
                        </div>

                        <div class="product-actions">

                            <button
                                class="view-btn"
                                onclick="viewProduct(${product.id})">
                                View Details
                            </button>

                            <button
                                class="add-btn"
                                onclick="addToCart(${product.id})"
                                ${product.stock === 0 ? "disabled" : ""}>
                                Add to Cart
                            </button>

                        </div>

                    </div>
                `;

                productList.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error loading products:", error);
        });
}


// ================= VIEW PRODUCT =================

function viewProduct(id) {

    window.location.href = "product-details.html?id=" + id;
}


// ================= PRODUCT DETAILS =================

function loadProductDetails() {

    let params = new URLSearchParams(window.location.search);

    let id = params.get("id");

    let productDetails = document.getElementById("productDetails");

    if (!id || !productDetails) {
        return;
    }

    fetch("/products/" + id)
        .then(response => response.json())
        .then(product => {

            if (!product) {
                productDetails.innerHTML = "<p>Product not found.</p>";
                return;
            }

            productDetails.innerHTML = `

                <div class="product-detail-card">

                    <img
                        src="${product.image}"
                        alt="${product.name}">

                    <div class="product-detail-info">

                        <h1>${product.name}</h1>

                        <p>${product.description}</p>

                        <h2>
                            ₹${product.price.toLocaleString("en-IN")}
                        </h2>

                        <p>
                            ${
                                product.stock > 0
                                ? "Available Stock: " + product.stock
                                : "Out of Stock"
                            }
                        </p>

                        <button
                            class="add-btn"
                            onclick="addToCart(${product.id})"
                            ${product.stock === 0 ? "disabled" : ""}>
                            Add to Cart
                        </button>

                    </div>

                </div>
            `;
        })
        .catch(error => {
            console.error("Error loading product:", error);
            productDetails.innerHTML =
                "<p>Unable to load product.</p>";
        });
}


// ================= ADD TO CART =================

function addToCart(id) {

    fetch("/products/" + id)
        .then(response => response.json())
        .then(product => {

            if (!product) {
                alert("Product not found.");
                return;
            }

            if (product.stock <= 0) {
                alert("Product is out of stock.");
                return;
            }

            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            let existingItem = cart.find(item => item.id === product.id);

            if (existingItem) {

                if (existingItem.quantity < product.stock) {
                    existingItem.quantity++;
                } else {
                    alert("Maximum available stock reached.");
                    return;
                }

            } else {

                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }

            localStorage.setItem("cart", JSON.stringify(cart));

            alert(product.name + " added to cart.");
        })
        .catch(error => {
            console.error("Error adding product:", error);
            alert("Unable to add product to cart.");
        });
}


// ================= LOAD CART =================

function loadCart() {

    let cartItems = document.getElementById("cartItems");

    if (!cartItems) {
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add some products to continue shopping.</p>
            </div>
        `;

        updateCartTotal(0);

        return;
    }

    let total = 0;

    cart.forEach((item, index) => {

        let itemTotal = item.price * item.quantity;

        total += itemTotal;

        cartItems.innerHTML += `

            <div class="cart-item">

                <img
                    src="${item.image}"
                    alt="${item.name}">

                <div>

                    <h3>${item.name}</h3>

                    <p>
                        ₹${item.price.toLocaleString("en-IN")}
                    </p>

                    <div>

                        <button
                            onclick="decreaseQuantity(${index})">
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            onclick="increaseQuantity(${index})">
                            +
                        </button>

                    </div>

                    <p>
                        Total:
                        ₹${itemTotal.toLocaleString("en-IN")}
                    </p>

                    <button
                        onclick="removeFromCart(${index})">
                        Remove
                    </button>

                </div>

            </div>
        `;
    });

    updateCartTotal(total);
}


// ================= CART TOTAL =================

function updateCartTotal(total) {

    let subtotal = document.getElementById("cartSubtotal");
    let cartTotal = document.getElementById("cartTotal");

    if (subtotal) {
        subtotal.innerText =
            "₹" + total.toLocaleString("en-IN");
    }

    if (cartTotal) {
        cartTotal.innerText =
            "₹" + total.toLocaleString("en-IN");
    }
}


// ================= INCREASE QUANTITY =================

function increaseQuantity(index) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (index < 0 || index >= cart.length) {
        return;
    }

    fetch("/products/" + cart[index].id)
        .then(response => response.json())
        .then(product => {

            if (cart[index].quantity < product.stock) {

                cart[index].quantity++;

                localStorage.setItem(
                    "cart",
                    JSON.stringify(cart)
                );

                loadCart();

            } else {

                alert("Maximum available stock reached.");
            }
        });
}


// ================= DECREASE QUANTITY =================

function decreaseQuantity(index) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (index < 0 || index >= cart.length) {
        return;
    }

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);
    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    loadCart();
}


// ================= REMOVE FROM CART =================

function removeFromCart(index) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (index < 0 || index >= cart.length) {
        return;
    }

    cart.splice(index, 1);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    loadCart();
}


// ================= REGISTER =================

function register() {

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let message = document.getElementById("registerMessage");

    let user = {
        name: name,
        email: email,
        password: password
    };

    fetch("/register", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(user)

    })
    .then(response => {

        if (!response.ok) {
            throw new Error("Registration failed");
        }

        return response.json();
    })
    .then(data => {

        message.innerText =
            "Registration successful!";

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);
    })
    .catch(error => {

        console.error(error);

        message.innerText =
            "Registration failed. Email may already exist.";
    });
}


// ================= LOGIN =================

function login() {

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let message = document.getElementById("loginMessage");

    let loginData = {
        email: email,
        password: password
    };

    fetch("/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(loginData)

    })
    .then(response => {

        if (!response.ok) {
            throw new Error("Invalid login");
        }

        return response.json();
    })
    .then(user => {

        localStorage.setItem(
            "loggedUser",
            JSON.stringify(user)
        );

        message.innerText =
            "Login successful!";

        setTimeout(() => {
            window.location.href = "index.html";
        }, 700);
    })
    .catch(error => {

        console.error(error);

        message.innerText =
            "Invalid email or password.";
    });
}


// ================= LOGOUT =================

function logout() {

    localStorage.removeItem("loggedUser");

    alert("Logged out successfully.");

    window.location.href = "index.html";
}


// ================= NAVIGATION =================

function updateNavigation() {

    let loggedUser =
        JSON.parse(localStorage.getItem("loggedUser"));

    let navLinks =
        document.querySelectorAll("nav a");

    navLinks.forEach(link => {

        if (link.innerText.trim() === "Login") {

            if (loggedUser) {

                link.innerText = "Logout";

                link.href = "#";

                link.onclick = function(event) {

                    event.preventDefault();

                    logout();
                };
            }
        }

        if (link.innerText.trim() === "Register") {

            if (loggedUser) {
                link.style.display = "none";
            }
        }
    });
}


// ================= CHECKOUT =================

function checkout() {

    let loggedUser =
        JSON.parse(localStorage.getItem("loggedUser"));

    if (!loggedUser) {

        alert("Please login before checkout.");

        window.location.href = "login.html";

        return;
    }

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;
    }

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
    });

    // Check latest stock before creating order

    Promise.all(

        cart.map(item =>
            fetch("/products/" + item.id)
                .then(response => response.json())
        )

    )
    .then(products => {

        for (let i = 0; i < cart.length; i++) {

            if (!products[i]) {

                throw new Error(
                    "Product not found."
                );
            }

            if (
                cart[i].quantity >
                products[i].stock
            ) {

                throw new Error(
                    products[i].name +
                    " does not have enough stock."
                );
            }
        }

        let order = {

            customerEmail: loggedUser.email,

            totalAmount: total,

            orderDate: new Date().toLocaleString()
        };

        return fetch("/orders", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(order)

        });
    })
    .then(response => {

        if (!response.ok) {
            throw new Error("Order creation failed.");
        }

        return response.json();
    })
    .then(savedOrder => {

        return Promise.all(

            cart.map(item => {

                let orderItem = {

                    orderId: savedOrder.id,

                    productId: item.id,

                    productName: item.name,

                    quantity: item.quantity,

                    price: item.price
                };

                return fetch("/order-items", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(orderItem)
                });
            })
        );
    })
    .then(() => {

        localStorage.removeItem("cart");

        alert(
            "Order placed successfully!"
        );

        window.location.href = "orders.html";
    })
    .catch(error => {

        console.error(error);

        alert(
            error.message ||
            "Something went wrong during checkout."
        );
    });
}


// ================= LOAD ORDERS =================

function loadOrders() {

    let ordersContainer =
        document.getElementById("orders");

    if (!ordersContainer) {
        return;
    }

    let loggedUser =
        JSON.parse(localStorage.getItem("loggedUser"));

    if (!loggedUser) {

        ordersContainer.innerHTML = `
            <p>Please login to view your orders.</p>
        `;

        return;
    }

    fetch(
        "/orders/" +
        encodeURIComponent(loggedUser.email)
    )
    .then(response => response.json())
    .then(orders => {

        if (!orders || orders.length === 0) {

            ordersContainer.innerHTML = `
                <p>You have no orders yet.</p>
            `;

            return;
        }

        ordersContainer.innerHTML = "";

        orders.forEach(order => {

            let orderCard =
                document.createElement("div");

            orderCard.className = "order-card";

            orderCard.innerHTML = `

                <div class="order-info">

                    <h2>
                        Order #${order.id}
                    </h2>

                    <p>
                        Date:
                        ${order.orderDate}
                    </p>

                    <p>
                        Total:
                        ₹${order.totalAmount.toLocaleString("en-IN")}
                    </p>

                </div>

                <div class="order-products">

                    <h3>Ordered Products</h3>

                    <p>Loading products...</p>

                </div>
            `;

            ordersContainer.appendChild(orderCard);

            fetch("/order-items/" + order.id)
                .then(response => response.json())
                .then(items => {

                    let productsContainer =
                        orderCard.querySelector(
                            ".order-products"
                        );

                    productsContainer.innerHTML = `
                        <h3>Ordered Products</h3>
                    `;

                    items.forEach(item => {

                        let productDiv =
                            document.createElement("div");

                        productDiv.className =
                            "order-product";

                        productDiv.innerHTML = `

                            <img
                                src=""
                                alt="${item.productName}">

                            <div>

                                <h4>
                                    ${item.productName}
                                </h4>

                                <p>
                                    Quantity:
                                    ${item.quantity}
                                </p>

                                <p>
                                    Price:
                                    ₹${item.price.toLocaleString("en-IN")}
                                </p>

                            </div>
                        `;

                        productsContainer.appendChild(
                            productDiv
                        );

                        fetch(
                            "/products/" +
                            item.productId
                        )
                        .then(response =>
                            response.json()
                        )
                        .then(product => {

                            let image =
                                productDiv.querySelector(
                                    "img"
                                );

                            if (image && product) {
                                image.src =
                                    product.image;
                            }
                        });
                    });
                });
        });
    })
    .catch(error => {

        console.error(error);

        ordersContainer.innerHTML = `
            <p>Unable to load orders.</p>
        `;
    });
}


// ================= PAGE LOAD =================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateNavigation();

    }
);
