 
        const apiURL =
    "https://cdn.jsdelivr.net/gh/adarshahelvar/NovaCart/products.json";

const productsContainer =
    document.getElementById("productsContainer");

const pagination =
    document.getElementById("pagination");

const sortSelect =
    document.getElementById("sortSelect");

const productCount =
    document.getElementById("productCount");

const categorySelect =
    document.getElementById("categorySelect");

// ================= PRODUCTS =================

let products = [];
let allProducts = [];

let currentPage = 1;

const cardsPerPage = 10;

// ================= CART =================

let cart =
    JSON.parse(localStorage.getItem("novaCart")) || [];

// ================= FETCH PRODUCTS =================

async function fetchProducts() {

    try {

        const response = await fetch(apiURL);

        products = await response.json();

        allProducts = [...products];

        renderProducts();

        renderPagination();

    }

    catch (error) {

        console.log("Error:", error);

    }

}

// ================= RENDER PRODUCTS =================

function renderProducts() {

    productsContainer.innerHTML = "";

    let sortedProducts = [...products];

    // SORTING
    if (sortSelect.value === "low-high") {

        sortedProducts.sort((a, b) =>
            a.price - b.price
        );

    }

    else if (sortSelect.value === "high-low") {

        sortedProducts.sort((a, b) =>
            b.price - a.price
        );

    }

    const start =
        (currentPage - 1) * cardsPerPage;

    const end =
        start + cardsPerPage;

    const paginatedProducts =
        sortedProducts.slice(start, end);

    // NO RESULTS
    if (paginatedProducts.length === 0) {

        productsContainer.innerHTML = `
            <div style="
                text-align:center;
                width:100%;
                padding:40px;
                font-size:20px;
                color:gray;
            ">
                No results found
            </div>
        `;

        productCount.innerHTML =
            `0 products found`;

        return;

    }

    productCount.innerHTML =
        `Showing ${start + 1}-${Math.min(end, products.length)} of ${products.length} products`;

    paginatedProducts.forEach(product => {

        productsContainer.innerHTML += `

            <div class="card">

                <img src="${product.image}" alt="${product.name}">

                <div class="content">

                    <div class="category-rating">
                        <span class="category">
                            ${product.category}
                        </span>

                        <span class="rating">
                            ⭐ ${product.rating}
                        </span>
                    </div>

                    <h3 class="title">
                        ${product.name}
                    </h3>

                    <p class="desc">
                        ${product.description}
                    </p>

                    <div class="bottom">

                        <h2 class="price">
                            $${product.price}
                        </h2>

                        <button class="btn add_btn">
                            Add
                        </button>

                    </div>

                </div>

            </div>

        `;

    });

}

// ================= PAGINATION =================

function renderPagination() {

    pagination.innerHTML = "";

    const totalPages =
        Math.ceil(products.length / cardsPerPage);

    // PREVIOUS BUTTON

    const prevBtn =
        document.createElement("button");

    prevBtn.innerText = "Previous";

    prevBtn.classList.add("page-btn");

    prevBtn.disabled =
        currentPage === 1;

    prevBtn.addEventListener("click", () => {

        if (currentPage > 1) {

            currentPage--;

            renderProducts();

            renderPagination();

        }

    });

    pagination.appendChild(prevBtn);

    // PAGE NUMBERS

    for (let i = 1; i <= totalPages; i++) {

        const pageBtn =
            document.createElement("button");

        pageBtn.innerText = i;

        pageBtn.classList.add("page-btn");

        if (i === currentPage) {

            pageBtn.classList.add("active");

        }

        pageBtn.addEventListener("click", () => {

            currentPage = i;

            renderProducts();

            renderPagination();

        });

        pagination.appendChild(pageBtn);

    }

    // NEXT BUTTON

    const nextBtn =
        document.createElement("button");

    nextBtn.innerText = "Next";

    nextBtn.classList.add("page-btn");

    nextBtn.disabled =
        currentPage === totalPages;

    nextBtn.addEventListener("click", () => {

        if (currentPage < totalPages) {

            currentPage++;

            renderProducts();

            renderPagination();

        }

    });

    pagination.appendChild(nextBtn);

}

// ================= SORT =================

sortSelect.addEventListener("change", () => {

    renderProducts();

});

// ================= LIVE SEARCH FILTER =================

const searchInput =
    document.querySelector(".searchInput");

searchInput.addEventListener("input", () => {

    const searchValue =
        searchInput.value
        .toLowerCase()
        .trim();

    // IF INPUT EMPTY → SHOW NORMAL PAGINATION
    if (searchValue === "") {

        products = [...allProducts];

        currentPage = 1;

        renderProducts();

        renderPagination();

        return;

    }

    // FILTER USING STARTING LETTERS OF TITLE
    products = allProducts.filter(product =>

        product.name
            .toLowerCase()
            .startsWith(searchValue)

    );

    // RESET PAGE
    currentPage = 1;

    // SHOW FILTERED PRODUCTS
    renderProducts();

    // REMOVE PAGINATION DURING SEARCH
    pagination.innerHTML = "";

});

// ================= CATEGORY FILTER =================

categorySelect.addEventListener("change", () => {

    const selectedCategory =
        categorySelect.value;

    currentPage = 1;

    if (selectedCategory === "all") {

        products = [...allProducts];

    }

    else {

        products = allProducts.filter(product =>
            product.category === selectedCategory
        );

    }

    renderProducts();

    renderPagination();

});

// =====================================================
// ================= CART SECTION ======================
// =====================================================

const cartBtn =
    document.getElementById("cartBtn");

const cartSidebar =
    document.getElementById("cartSidebar");

const closeCart =
    document.getElementById("closeCart");

const cartOverlay =
    document.getElementById("cartOverlay");

const cartItems =
    document.getElementById("cartItems");

const subtotal =
    document.getElementById("subtotal");

const total =
    document.getElementById("total");

const cartItemCount =
    document.getElementById("cartItemCount");

const clearCart =
    document.getElementById("clearCart");

// ================= SAVE CART =================

function saveCart() {

    localStorage.setItem(
        "novaCart",
        JSON.stringify(cart)
    );

}

// ================= TOAST =================

function showToast(message) {

    const toast =
        document.createElement("div");

    toast.className =
        "toast_message";

    toast.innerText =
        message;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("show");

    }, 100);

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 2000);

}

// ================= OPEN CART =================

cartBtn.addEventListener("click", () => {

    cartSidebar.classList.add("active");

    cartOverlay.classList.add("active");

});

// ================= CLOSE CART =================

function closeCartSidebar() {

    cartSidebar.classList.remove("active");

    cartOverlay.classList.remove("active");

}

closeCart.addEventListener(
    "click",
    closeCartSidebar
);

cartOverlay.addEventListener(
    "click",
    closeCartSidebar
);

// ================= ADD TO CART =================

document.addEventListener("click", (e) => {

    if (e.target.closest(".add_btn")) {

        const card =
            e.target.closest(".card");

        const name =
            card.querySelector(".title").innerText;

        const price =
            parseFloat(
                card.querySelector(".price")
                .innerText.replace("$", "")
            );

        const image =
            card.querySelector("img").src;

        const existing =
            cart.find(item =>
                item.name === name
            );

        if (existing) {

            existing.quantity++;

        }

        else {

            cart.push({
                name,
                price,
                image,
                quantity: 1
            });

        }

        saveCart();

        renderCart();

        showToast("Added to cart");

    }

});

// ================= RENDER CART =================

function renderCart() {

    cartItems.innerHTML = "";

    let subtotalPrice = 0;

    let totalItems = 0;

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty_cart">
                Cart is empty
            </div>
        `;

    }

    cart.forEach((item, index) => {

        const itemTotal =
            item.price * item.quantity;

        subtotalPrice += itemTotal;

        totalItems += item.quantity;

        cartItems.innerHTML += `

            <div class="cart_item">

                <div class="cart_item_img">
                    <img src="${item.image}">
                </div>

                <div class="cart_item_details">

                    <h3 class="cart_item_name">
                        ${item.name}
                    </h3>

                    <p class="cart_item_price">
                        $${item.price.toFixed(2)} each
                    </p>

                    <div class="quantity_box">

                        <button class="quantity_btn minus_btn"
                            data-index="${index}">
                            -
                        </button>

                        <div class="quantity_value">
                            ${item.quantity}
                        </div>

                        <button class="quantity_btn plus_btn"
                            data-index="${index}">
                            +
                        </button>

                    </div>

                </div>

                <div class="cart_item_right">

                    <button class="delete_btn"
                        data-index="${index}">
                        <i class="bi bi-trash"></i>
                    </button>

                    <div class="cart_item_total">
                        $${itemTotal.toFixed(2)}
                    </div>

                </div>

            </div>

        `;

    });

    subtotal.innerText =
        `$${subtotalPrice.toFixed(2)}`;

    total.innerText =
        `$${(subtotalPrice + 8.50).toFixed(2)}`;

    cartItemCount.innerText =
        `${totalItems} items`;

    saveCart();

}

// ================= PLUS / MINUS / DELETE =================

document.addEventListener("click", (e) => {

    // PLUS
    if (e.target.classList.contains("plus_btn")) {

        const index =
            e.target.dataset.index;

        cart[index].quantity++;

        renderCart();

    }

    // MINUS
    if (e.target.classList.contains("minus_btn")) {

        const index =
            e.target.dataset.index;

        if (cart[index].quantity > 1) {

            cart[index].quantity--;

        }

        else {

            cart.splice(index, 1);

        }

        renderCart();

    }

    // DELETE
    if (e.target.closest(".delete_btn")) {

        const index =
            e.target.closest(".delete_btn")
            .dataset.index;

        cart.splice(index, 1);

        renderCart();

    }

});

// ================= CLEAR CART =================

clearCart.addEventListener("click", () => {

    cart = [];

    renderCart();

});

// ================= INITIAL =================

fetchProducts();

renderCart();
