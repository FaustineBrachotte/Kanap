// récupération du panier depuis le localstorage
let cart = getCart();
console.log(cart);
emptyCartMsg(cart);
let prices = [];

class CartPrices {
  constructor(id, color, quantity, price) {
    this.id = id;
    this.color = color;
    this.quantity = quantity;
    this.price = price;
}
}

function getCart() {
  let cartStr = localStorage.getItem("cart");
  if (cartStr != null && Array.isArray(JSON.parse(cartStr))) {
      return JSON.parse(cartStr);
  } else {
      return [];        
  }
}

// affichage d'un message si le panier est vide
function emptyCartMsg(cart) {
    if (cart.length < 1) {
      document.querySelector("#cartAndFormContainer > h1").innerText = "Votre panier est vide";
    }
}

// affichage des informations des produits contenus dans le panier
for(let couch of cart){
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
        
        prices.push(new CartPrices(couch.id, couch.color, couch.quantity, value.price));

        totalQuantity();
        totalPrice();
        updateQuantity();
        deleteItem();
})
};


// calcul de la quantité totale
function totalQuantity() { 
  let totalQ = 0;
  for(let i of prices){
    totalQ += Number(i.quantity);
    document.getElementById("totalQuantity").innerText = totalQ;
  }
} 

// calcul du prix total
function totalPrice() {  
  let totalP = 0;
  for(let i of prices){
    totalP += Number(i.quantity) * i.price;
    document.getElementById("totalPrice").innerText = totalP;
}}

// mise à jour de la quantité du canapé
function updateQuantity() {
  const inputQuantity = document.querySelectorAll('.itemQuantity');
  inputQuantity.forEach((inputQuantity) => {
    inputQuantity.addEventListener('change', function() {
      const item = inputQuantity.closest('article');
      const foundPrices = prices.find(element => element.id == item.dataset.id && element.color == item.dataset.color);
      const foundCart = cart.find(element => element.id == item.dataset.id && element.color == item.dataset.color);
      if (inputQuantity.value <= 0) {
        prices = prices.filter(p => !(p.id == item.dataset.id && p.color == item.dataset.color));
        cart = cart.filter(p => !(p.id == item.dataset.id && p.color == item.dataset.color));
      } else {
        foundPrices.quantity = inputQuantity.value;
        foundCart.quantity = inputQuantity.value;
      }
      totalQuantity();
      totalPrice();
      console.log(cart);
      saveCart(cart); 
      }
)})};

// suppression du canapé
function deleteItem() {
  const deleteButton = document.querySelectorAll('.deleteItem');
  deleteButton.forEach((deleteButton) => {
    deleteButton.addEventListener('click', function() {
    const item = deleteButton.closest('article');
    prices = prices.filter(p => !(p.id == item.dataset.id && p.color == item.dataset.color));
    cart = cart.filter(p => !(p.id == item.dataset.id && p.color == item.dataset.color));
    totalQuantity();
    totalPrice();
    saveCart(cart); 
    location.reload();
})})};

function saveCart(cart) {
  localStorage.setItem("cart",JSON.stringify(cart)); 
}



// envoi de la commande
class Contact {
  constructor(firstName, lastName, address, city, email) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.address = address;
      this.city = city;
      this.email = email;
  }
}

const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const address = document.getElementById('address');
const city = document.getElementById('city');
const email = document.getElementById('email');

function order() {
  checkFirstName();
  checkLastName();
  checkEmail();

  document.getElementById('order').addEventListener('clik', function() {
    checkInputs(firstName, lastName, address, city, email);
    let contact = new Contact(firstName.value, lastName.value, address.value, city.value, email.value)
    console.log(contact);
  })
}

// check des champs du formulaire

function checkInputs(fistName, lastName, address, city, email) {
  checkFirstName();
  checkLastName();
  checkAddress();
  checkCity();
  checkEmail();
}

function checkFirstName() {
  firstName.addEventListener('change', function() {
    let mask = /\d/;
    if(mask.test(firstName.value)) {
      document.getElementById('firstNameErrorMsg').innerText = "Veuillez renseigner un prénom valide";
    } else {
      document.getElementById('firstNameErrorMsg').innerText = "";
    }
  })
}

function checkLastName() {
  lastName.addEventListener('change', function() {
    let mask = /^[a-zàáâäçèéêëìíîïñòóôöùúûü]+[ \-']?[[a-zàáâäçèéêëìíîïñòóôöùúûü]+[ \-']?]*[a-zàáâäçèéêëìíîïñòóôöùúûü]+$/;
    if(mask.test(lastName.value)) {
      document.getElementById('lastNameErrorMsg').innerText = "";
    } else {
      document.getElementById('lastNameErrorMsg').innerText = "Veuillez renseigner un nom valide";
    }
  })
}

function checkEmail() {
  email.addEventListener('change', function() {
    let mask = /^[\w\.=-]+@[\w\.-]+\.[\w]{2,3}$/;
    if(mask.test(email.value)) {
      document.getElementById('emailErrorMsg').innerText = "";
    } else {
      document.getElementById('emailErrorMsg').innerText = "Veuillez renseigner une adresse email valide";
    }
  })
}





// mise à jour de la quantité du canapé
// function updateQuantity(cart) {
//   const inputQuantity = document.querySelectorAll('.itemQuantity');
//   inputQuantity.forEach((inputQuantity) => {
//     inputQuantity.addEventListener('change', function() {
//       const item = inputQuantity.closest('article');
//       a ++;
//       console.log("a " + a);
//       const found = cart.find(element => element.id == item.dataset.id && element.color == item.dataset.color);
//       if (inputQuantity.value <= 0) {
//         cart = cart.filter(p => !(p.id == item.dataset.id && p.color == item.dataset.color));
//       } else {
//         found.quantity = inputQuantity.value;
//       }
//       saveCart(cart); 
//       updateTotalQuantity();
//       }
// )})};                 