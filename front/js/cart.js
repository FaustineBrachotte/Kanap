// récupération du panier depuis le localstorage
let cart = getCart();
console.log(cart);
let totalPrice = 0;
let totalQuantity = 0;

function getCart() {
    const cartStr = localStorage.getItem("cart");
    if (cartStr == null) {
        emptyCartMsg();
        return [];
    } else if (Array.isArray(JSON.parse(cartStr))) {
        return JSON.parse(cartStr);
    } else {
        console.log("error: cart is not an array");
    }
}

// affichage d'un message si le panier est vide
function emptyCartMsg() {
    const cartDiv = document.getElementById("cart__items");
    const cartMsg = document.createElement("p");
    cartMsg.innerText = "Aucun article n'a été ajouté au panier";
    cartDiv.appendChild(cartMsg);
}

// affichage des informations des produits contenus dans le panier
for(const couch of cart){
fetch(`http://localhost:3000/api/products/${couch.id}`)
    .catch(error => console.log("fetch error", error))
    .then(function(res) {
        if (res.ok) {
            return  res.json();
        }
    })
    .then(function(value) {
        document.getElementById("cart__items").innerHTML += `<article class="cart__item" data-id="${couch.id}" data-color="${couch.color}">
                                                              <div class="cart__item__img">
                                                                <img src="${value.imageUrl}" alt="${value.altTxl}">
                                                              </div>
                                                              <div class="cart__item__content">
                                                                <div class="cart__item__content__description">
                                                                  <h2>${value.name}</h2>
                                                                  <p>${couch.color}</p>
                                                                  <p>${value.price} €</p>
                                                                </div>
                                                                <div class="cart__item__content__settings">
                                                                  <div class="cart__item__content__settings__quantity">
                                                                    <p>Qté : </p>
                                                                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${couch.quantity}">
                                                                  </div>
                                                                  <div class="cart__item__content__settings__delete">
                                                                    <p class="deleteItem">Supprimer</p>
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </article>`;
        // calcul de la quantité et du prix total                                                      
        totalPrice += value.price * couch.quantity;
        document.getElementById("totalPrice").innerText = totalPrice; 
        totalQuantity += Number(couch.quantity); 
        document.getElementById("totalQuantity").innerText = totalQuantity; 

        updateQuantity(cart,couch);
        deleteItem(cart,couch);      
})
};


// mise à jour de la quantité du canapé
function updateQuantity(cart) {
  const currentQuantity = document.querySelectorAll('.itemQuantity');
  currentQuantity.forEach((currentQuantity) => {
  currentQuantity.addEventListener('change', function() {
    const item = currentQuantity.closest('article');
    const found = cart.find(element => element.id == item.dataset.id && element.color == item.dataset.color);
    if (currentQuantity.value <= 0) {
      cart = cart.filter(p => !(p.id == item.dataset.id && p.color == item.dataset.color));
    } else {
      found.quantity = currentQuantity.value;
    }
    localStorage.setItem("cart",JSON.stringify(cart)); 
    location.reload();
    }
)})};

// suppression du canapé
function deleteItem(cart) {
  const deleteButton = document.querySelectorAll('.deleteItem');
  deleteButton.forEach((deleteButton) => {
  deleteButton.addEventListener('click', function() {
  const item = deleteButton.closest('article');
  cart = cart.filter(p => !(p.id == item.dataset.id && p.color == item.dataset.color));
  localStorage.setItem("cart",JSON.stringify(cart)); 
  location.reload();
})})};