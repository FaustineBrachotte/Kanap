// récupération du panier

let cart = JSON.parse(localStorage.getItem("cart"));
let i = 0;
let cartCouch = cart[i];
console.log(cart);
console.log(cartCouch);

for(cartCouch of cart){
    console.log(cartCouch.id);
    console.log(cartCouch.color);
    fetch(`http://localhost:3000/api/products/${cartCouch.id}`)
        .then(function(res) {
            if (res.ok) {
            return res.json();
            }
        })
        .then(function(value) {
            console.log(cartCouch.color);
            document.getElementById("cart__items").innerHTML += `<article class="cart__item" data-id=cart.id data-color=cart.color>
                                                                    <div class="cart__item__img">
                                                                    <img src="${value.imageUrl}" alt="${value.altTxt}">
                                                                    </div>
                                                                    <div class="cart__item__content">
                                                                    <div class="cart__item__content__description">
                                                                        <h2>${value.name}</h2>
                                                                        <p>${cartCouch.color}</p>
                                                                        <p>${cartCouch.quantity}</p>
                                                                    </div>
                                                                    <div class="cart__item__content__settings">
                                                                        <div class="cart__item__content__settings__quantity">
                                                                        <p>Qté : </p>
                                                                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartCouch.quantity}">
                                                                        </div>
                                                                        <div class="cart__item__content__settings__delete">
                                                                        <p class="deleteItem">Supprimer</p>
                                                                        </div>
                                                                    </div>
                                                                    </div>
                                                                </article>`
    });
};