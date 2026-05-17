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

    let products = [];

    let currentPage = 1;

    const cardsPerPage = 10;

    // FETCH PRODUCTS

    async function fetchProducts(){

      try{

        const response = await fetch(apiURL);

        products = await response.json();

        renderProducts();

        renderPagination();

      }

      catch(error){

        console.log("Error:", error);

      }

    }

    // RENDER PRODUCTS

    function renderProducts(){

      productsContainer.innerHTML = "";

      let sortedProducts = [...products];

      // SORTING

      if(sortSelect.value === "low-high"){

        sortedProducts.sort((a,b)=>a.price-b.price);

      }

      else if(sortSelect.value === "high-low"){

        sortedProducts.sort((a,b)=>b.price-a.price);

      }

      const start = (currentPage - 1) * cardsPerPage;

      const end = start + cardsPerPage;

      const paginatedProducts =
      sortedProducts.slice(start,end);

      productCount.innerHTML =
      `Showing ${start+1}-${Math.min(end,products.length)} of ${products.length} products`;

      // DISPLAY CARDS

      paginatedProducts.forEach(product=>{

        productsContainer.innerHTML += `

          <div class="card">

            <img
              src="${product.image}"
              alt="${product.name}"
            >

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

                <button class="btn">
                  Add
                </button>

              </div>

            </div>

          </div>

        `;

      });

    }

    // PAGINATION

    function renderPagination(){

      pagination.innerHTML = "";

      const totalPages =
      Math.ceil(products.length / cardsPerPage);

      // PREVIOUS BUTTON

      const prevBtn =
      document.createElement("button");

      prevBtn.innerText = "Previous";

      prevBtn.classList.add("page-btn");

      prevBtn.disabled = currentPage === 1;

      prevBtn.addEventListener("click",()=>{

        if(currentPage > 1){

          currentPage--;

          renderProducts();

          renderPagination();

        }

      });

      pagination.appendChild(prevBtn);

      // PAGE NUMBERS

      for(let i=1; i<=totalPages; i++){

        const pageBtn =
        document.createElement("button");

        pageBtn.innerText = i;

        pageBtn.classList.add("page-btn");

        if(i === currentPage){

          pageBtn.classList.add("active");

        }

        pageBtn.addEventListener("click",()=>{

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

      nextBtn.addEventListener("click",()=>{

        if(currentPage < totalPages){

          currentPage++;

          renderProducts();

          renderPagination();

        }

      });

      pagination.appendChild(nextBtn);

    }

    // SORT EVENT

    sortSelect.addEventListener("change",()=>{

      renderProducts();

    });

    // INITIAL FETCH

    fetchProducts();