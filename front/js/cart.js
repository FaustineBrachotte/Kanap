// récupération du panier depuis le localstorage
let cart = getCart();
console.log(cart);
emptyCartMsg(cart);
getItems();

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
function getItems() {
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
        totalQuantity();
        totalPrice();
        updateQuantity();
        deleteItem();
  })
}};



// requête l'API pour connaître le prix du canapé dont la quantité a été modifiée
async function getPrice(itemID) {
  const response = await fetch(`http://localhost:3000/api/products/${itemID}`);
  const data = await response.json();
  return data;
}

// calcul de la quantité totale
function totalQuantity() {  
  let totalQuantity = 0;  
  const itemQuantity = document.querySelectorAll('.itemQuantity');
  itemQuantity.forEach((itemQuantity) => {
    const item = itemQuantity.closest('article');
    if (item.style.display != 'none') {
    totalQuantity += Number(itemQuantity.value);
    document.getElementById("totalQuantity").innerText = totalQuantity;
    }
  })
}


// calcul du prix total
function totalPrice() {  
  let totalPrice = 0;
  const itemQ = document.querySelectorAll('.itemQuantity');
  itemQ.forEach(async function(itemQ){
    const item = itemQ.closest('article');
    const itemID = item.dataset.id;
    if (item.style.display != 'none') {
    getPrice(itemID).then(value => {
      totalPrice += value.price * itemQ.value;
      document.getElementById("totalPrice").innerText = totalPrice;
    });
  }
  });
}


// mise à jour de la quantité du canapé
function updateQuantity() {
  const inputQuantity = document.querySelectorAll('.itemQuantity');
  inputQuantity.forEach((inputQuantity) => {
    inputQuantity.addEventListener('change', function() {
      const item = inputQuantity.closest('article');
      const foundCart = cart.find(element => element.id == item.dataset.id && element.color == item.dataset.color);
      if (inputQuantity.value <= 0) {
        cart = cart.filter(p => !(p.id == item.dataset.id && p.color == item.dataset.color));
        totalQuantity();
        item.style.display = 'none';
      } else {
        foundCart.quantity = inputQuantity.value;
      }
      totalQuantity();
      totalPrice();
      saveCart(cart); 
      }
)})};

// suppression du canapé
function deleteItem() {
  const deleteButton = document.querySelectorAll('.deleteItem');
  deleteButton.forEach((deleteButton) => {
    deleteButton.addEventListener('click', function() {
    const item = deleteButton.closest('article');
    cart = cart.filter(p => !(p.id == item.dataset.id && p.color == item.dataset.color));
    item.style.display = 'none';
    totalQuantity();
    totalPrice();
    saveCart(cart);
})})};

// sauvegarde du panier dans le localstorage
function saveCart(cart) {
  localStorage.setItem("cart",JSON.stringify(cart)); 
}


//___________________________________________________ envoi de la commande ____________________________________________________________

const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const address = document.getElementById('address');
const city = document.getElementById('city');
const email = document.getElementById('email');

let contact;
let cartProductIDs = [];
let isFirstNameOK = false;
let isLastNameOK = false;
let isAddressOK = false;
let isCityOK = false;
let isEmailOK = false;
class Contact {
  constructor(firstName, lastName, address, city, email) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.address = address;
      this.city = city;
      this.email = email;
  }
}

order();
resetFields();
checkInputs();
test();


function order() {

  document.getElementById('order').addEventListener('click', function(event) {
    event.preventDefault(); // empêche le rechargement de la page
 
    if(isFirstNameOK && isLastNameOK && isAddressOK && isCityOK && isEmailOK) {
      
      contact = new Contact(firstName.value, lastName.value, address.value, city.value, email.value)
      productIDs();

      if(checkFormat()) {
        const orderBody = {
          contact: contact,
          products: cartProductIDs,
        };
        console.log(orderBody);
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(orderBody)
        }
          fetch('http://localhost:3000/api/products/order', options)

          .then((response) => response.json())
              .then((data) => {           
                  document.location.href = `confirmation.html?orderId=${data.orderId}`;
              })
              .catch((err) => {
                  console.log("fetch error", err);
                  alert("Un problème a été rencontré lors de l'envoi du formulaire.");
              });
              //localStorage.clear();
      }
    } else {
      alert("Veuillez compléter les champs du formulaire.");
    }
  }  
  )}

// Vide les champs du formulaire au chargement de la page
function resetFields() {
  firstName.value = "";
  lastName.value = "";
  address.value = "";
  city.value = "";
  email.value = "";
}  

// Le tableau des produits envoyé au back-end doit être un array de strings product-ID. 
function productIDs() {
  for (let element of cart) {
    cartProductIDs.push(element.id);
  }
}

// vérifie le type des champs et leur présence avant envoi
function checkFormat() {
 if(cartProductIDs !== null && cartProductIDs !== "" && contact !== null & contact !== "" && Array.isArray(cartProductIDs) && typeof contact === "object") {  
      return true
  }
}

// check des champs du formulaire

function checkInputs() {
  checkFirstName();
  checkLastName();
  checkAddress();
  checkCity();
  checkEmail();
}

function checkFirstName() {
  document.getElementById('firstName').addEventListener('change', function() {
  let mask = /^[a-zàáâäçèéêëìíîïñòóôöùúûü]+[ \-']?[[a-zàáâäçèéêëìíîïñòóôöùúûü]+[ \-']?]*[a-zàáâäçèéêëìíîïñòóôöùúûü]+$/;
  if(mask.test(firstName.value)) {
    document.getElementById('firstNameErrorMsg').innerText = "";
    isFirstNameOK = true;
  } else {
    document.getElementById('firstNameErrorMsg').innerText = "Veuillez renseigner un prénom valide";
    isFirstNameOK = false;
  }
}) 
}

function checkLastName() {
  document.getElementById('lastName').addEventListener('change', function() {
    let mask = /^[a-zàáâäçèéêëìíîïñòóôöùúûü]+[ \-']?[[a-zàáâäçèéêëìíîïñòóôöùúûü]+[ \-']?]*[a-zàáâäçèéêëìíîïñòóôöùúûü]+$/;
    if(mask.test(lastName.value)) {
      document.getElementById('lastNameErrorMsg').innerText = "";
      isLastNameOK = true;
    } else {
      document.getElementById('lastNameErrorMsg').innerText = "Veuillez renseigner un nom valide";
      isLastNameOK = false;
    }
}) 
}

function checkAddress() {
  document.getElementById('address').addEventListener('change', function() {
    let mask = /^[a-zàáâäçèéêëìíîïñòóôöùúûü]+[ \-']?[[a-zàáâäçèéêëìíîïñòóôöùúûü]+[ \-']?]*[a-zàáâäçèéêëìíîïñòóôöùúûü]+$/;
    if(mask.test(address.value)) {
      document.getElementById('addressErrorMsg').innerText = "";
      isAddressOK = true;
    } else {
      document.getElementById('addressErrorMsg').innerText = "Veuillez renseigner une adresse valide";
      isAddressOK = false;
    }
}) 
}

function checkCity() {
  document.getElementById('city').addEventListener('change', function() {
    let mask = /^[a-zàáâäçèéêëìíîïñòóôöùúûü]+[ \-']?[[a-zàáâäçèéêëìíîïñòóôöùúûü]+[ \-']?]*[a-zàáâäçèéêëìíîïñòóôöùúûü]+$/;
    if(mask.test(city.value)) {
      document.getElementById('cityErrorMsg').innerText = "";
      isCityOK = true;
    } else {
      document.getElementById('cityErrorMsg').innerText = "Veuillez renseigner une ville valide";
      isCityOK = false;
    }
}) 
}

function test() {

  document.getElementById('city').addEventListener('change', function() {
    let mask = /^[a-zA-Z0-9\s,'-]*$/;
    if(mask.test(city.value)) {
      document.getElementById('cityErrorMsg').innerText = "";
    } else {
      document.getElementById('cityErrorMsg').innerText = "Veuillez renseigner une ville valide";
    }
  }
) }

function checkEmail() {
  document.getElementById('email').addEventListener('change', function() {
    let mask = /^[\w\.=-]+@[\w\.-]+\.[\w]{2,3}$/;
    if(mask.test(email.value)) {
      document.getElementById('emailErrorMsg').innerText = "";
      isEmailOK = true;
    } else {
      document.getElementById('emailErrorMsg').innerText = "Veuillez renseigner une adresse email valide";
      isEmailOK = false;
    }
  } ) 
}        