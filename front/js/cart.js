// récupération du panier
let cart = getCart();

function getCart() {
    let cartStr = localStorage.getItem("cart");
    if (cartStr == null) {
        emptyCartMsg();
        return [];
    } else if (Array.isArray(JSON.parse(cartStr))) {
        return JSON.parse(cartStr);
    } else {
        console.log("error: cart is not an array");
    }
}

function emptyCartMsg() {
    let cartDiv = document.getElementById("cart__items");
    let cartMsg = document.createElement("p");
    cartMsg.innerText = "Aucun article n'a été ajouté au panier";
    cartDiv.appendChild(cartMsg);
}

let i = 0;

for(cart[i] of cart){

    let id = cart[i].id;
    let color = cart[i].color;
    let quantity = cart[i].quantity;

fetch(`http://localhost:3000/api/products/${id}`)
    .catch(error => console.log("fetch error", error))
    .then(function(res) {
        if (res.ok) {
            return  res.json();
        }
    })
    .then(function(value) {
        document.getElementById("cart__items").innerHTML += `<article class="cart__item" data-id="${id}" data-color="${color}">
                                                              <div class="cart__item__img">
                                                                <img src="${value.imageUrl}" alt="${value.altTxl}">
                                                              </div>
                                                              <div class="cart__item__content">
                                                                <div class="cart__item__content__description">
                                                                  <h2>${value.name}</h2>
                                                                  <p>${color}</p>
                                                                  <p>${value.price} €</p>
                                                                </div>
                                                                <div class="cart__item__content__settings">
                                                                  <div class="cart__item__content__settings__quantity">
                                                                    <p>Qté : </p>
                                                                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">
                                                                  </div>
                                                                  <div class="cart__item__content__settings__delete">
                                                                    <p class="deleteItem">Supprimer</p>
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </article>`
             
})
};