// récupération du panier

const cart = localStorage.getItem("cart");
JSON.parse(cart);
console.log(cart);
let x = 1;
console.log(cart[x]._id);
let productId;


// affichage des éléments contenus dans le panier

for(let i in cart) {
    productId = cart[i]._id;
    console.log(cart[i]._id);

fetch(`http://localhost:3000/api/products/${productId}`)
    .then( data => data.json())
    .then( document.getElementById("cart__items").innerHTML += `<article class="cart__item" data-id=cart.id data-color=cart.color>
                                                                <div class="cart__item__img">
                                                                <img src="${product.imageUrl}" alt="${product.altTxt}">
                                                                </div>
                                                                <div class="cart__item__content">
                                                                <div class="cart__item__content__description">
                                                                    <h2>${product.name}</h2>
                                                                    <p>Vert</p>
                                                                    <p>42,00 €</p>
                                                                </div>
                                                                <div class="cart__item__content__settings">
                                                                    <div class="cart__item__content__settings__quantity">
                                                                    <p>Qté : </p>
                                                                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
                                                                    </div>
                                                                    <div class="cart__item__content__settings__delete">
                                                                    <p class="deleteItem">Supprimer</p>
                                                                    </div>
                                                                </div>
                                                                </div>
                                                            </article>`
    )};