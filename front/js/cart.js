// récupération du panier
let cart = getCart();

function getCart() {
    let cartStr = localStorage.getItem("cart");
    if (cartStr == null) {
        return [];
    } else if (Array.isArray(JSON.parse(cartStr))) {
        return JSON.parse(cartStr);
    } else {
        console.log("error: cart is not an array");
    }
}

let i = 0;

console.log(cart);

for(cart[i] of cart){
    fetch(`http://localhost:3000/api/products/${cart[i].id}`)
        .catch(error => console.log("fetch error", error))
        .then(function(res) {
            if (res.ok) {
            return res.json();
            }
        })
        .then(function(value) {
            document.getElementById("cart__items").innerHTML += `<article class="cart__item" data-id=cart.id data-color=cart.color>
                                                                    <div class="cart__item__img">
                                                                    <img src="${value.imageUrl}" alt="${value.altTxt}">
                                                                    </div>
                                                                    <div class="cart__item__content">
                                                                    <div class="cart__item__content__description">
                                                                        <h2>${value.name}</h2>`
        })
        document.getElementById("cart__items").innerHTML += `<p>${cart[i].color}</p>
                                                                <p>${cart[i].quantity}</p>
                                                            </div>
                                                            <div class="cart__item__content__settings">
                                                                <div class="cart__item__content__settings__quantity">
                                                                <p>Qté : </p>
                                                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cart[i].quantity}">
                                                                </div>
                                                                <div class="cart__item__content__settings__delete">
                                                                <p class="deleteItem">Supprimer</p>
                                                                </div>
                                                            </div>
                                                            </div>
                                                        </article>`
    
};