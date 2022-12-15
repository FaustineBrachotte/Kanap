class Product { 
    constructor(jsonProduct) {
        jsonProduct && Object.assign(this, jsonProduct);
    }
}

fetch("http://localhost:3000/api/products")
    .then( data => data.json())
    .then( jsonProductList => {
        for(let jsonProduct of jsonProductList) {
            let product = new Product(jsonProduct);
            document.querySelector(".items").innerHTML += `<a href="./product.html?id=42">
                                                                <article>
                                                                <img src="${product.imageUrl}" alt="${product.altTxt}">
                                                                <h3 class="productName">${product.name}</h3>
                                                                <p class="productDescription">${product.description}</p>
                                                                </article>
                                                            </a>`

        }
    });