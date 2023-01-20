//_____________________________________________________ gestion du panier ____________________________________________________________

// récupération du panier depuis le localstorage
let cart = getCart();

function getCart() {
  let cartStr = localStorage.getItem("cart");
  if (cartStr != null && Array.isArray(JSON.parse(cartStr))) {
    return JSON.parse(cartStr);
  } else {
    return [];
  }
}

// affichage d'un message et d'une quantité et prix total à 0 si le panier est vide 
emptyCart();

function emptyCart() {
  if (cart.length < 1) {
    document.querySelector("#cartAndFormContainer > h1").innerText = "Votre panier est vide";
    document.getElementById("totalQuantity").innerText = 0;
    document.getElementById("totalPrice").innerText = 0;

  }
}

// affichage des informations des produits contenus dans le panier
getItems();

function getItems() {
  for (let item of cart) {
    fetch(`http://localhost:3000/api/products/${item.id}`)
      .catch(error => console.log("fetch error", error))
      .then(data => data.json())
      .then(value => {
        document.getElementById("cart__items").innerHTML += `<article class="cart__item" data-id="${item.id}" data-color="${item.color}">
                                                              <div class="cart__item__img">
                                                                <img src="${value.imageUrl}" alt="${value.altTxl}">
                                                              </div>
                                                              <div class="cart__item__content">
                                                                <div class="cart__item__content__description">
                                                                  <h2>${value.name}</h2>
                                                                  <p>${item.color}</p>
                                                                  <p>${value.price} €</p>
                                                                </div>
                                                                <div class="cart__item__content__settings">
                                                                  <div class="cart__item__content__settings__quantity">
                                                                    <p>Qté : </p>
                                                                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
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
  }
};

// calcul de la quantité totale
function totalQuantity() {
  let totalQuantity = 0;
  document.getElementById("totalQuantity").innerText = totalQuantity; // permet de mettre la quantité à 0 si tout est supprimé du panier 
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
  document.getElementById("totalPrice").innerText = totalPrice; // permet de mettre le prix à 0 si tout est supprimé du panier 
  const itemQuantity = document.querySelectorAll('.itemQuantity');
  itemQuantity.forEach(async (itemQuantity) => {
    const item = itemQuantity.closest('article');
    const itemID = item.dataset.id;
    if (item.style.display != 'none') {
      getPrice(itemID).then(value => {
        totalPrice += value.price * itemQuantity.value;
        document.getElementById("totalPrice").innerText = totalPrice;
      });
    }
  });
}

// requête l'API pour connaître le prix du canapé dont la quantité a été modifiée
async function getPrice(itemID) {
  const response = await fetch(`http://localhost:3000/api/products/${itemID}`);
  const data = await response.json();
  return data;
}

// mise à jour de la quantité du canapé
function updateQuantity() {
  const inputQuantity = document.querySelectorAll('.itemQuantity');
  inputQuantity.forEach((inputQuantity) => {
    inputQuantity.addEventListener('change', function () {
      const item = inputQuantity.closest('article');
      const foundCart = cart.find(element => element.id == item.dataset.id && element.color == item.dataset.color);
      if (inputQuantity.value < 100) {
        if (inputQuantity.value <= 0) {
          cart = cart.filter(p => !(p.id == item.dataset.id && p.color == item.dataset.color));
          item.style.display = 'none';
        } else {
          foundCart.quantity = inputQuantity.value;
        }
        totalQuantity();
        totalPrice();
        saveCart();
      } else {
        alert("Veuillez choisir une quantité entre 1 et 100");
      }
    }
    )
  })
};

// suppression du canapé
function deleteItem() {
  const deleteButton = document.querySelectorAll('.deleteItem');
  deleteButton.forEach((deleteButton) => {
    deleteButton.addEventListener('click', function () {
      const item = deleteButton.closest('article');
      cart = cart.filter(p => !(p.id == item.dataset.id && p.color == item.dataset.color));
      item.style.display = 'none';
      totalQuantity();
      totalPrice();
      saveCart();
    })
  })
};

// sauvegarde du panier dans le localstorage
function saveCart() {
  localStorage.setItem("cart",JSON.stringify(cart)); 
}


//___________________________________________________ envoi de la commande ____________________________________________________________

const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const address = document.getElementById('address');
const city = document.getElementById('city');
const email = document.getElementById('email');

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

// Vide les champs du formulaire au chargement de la page
resetFields();

function resetFields() {
  firstName.value = "";
  lastName.value = "";
  address.value = "";
  city.value = "";
  email.value = "";
}

// check des champs du formulaire
checkInputs();

function checkInputs() {
  checkFirstName();
  checkLastName();
  checkAddress();
  checkCity();
  checkEmail();
}

function checkFirstName() {
  firstName.addEventListener('change', function () {
    let mask = /^[a-zàáâäçèéêëìíîïñòóôöùúûüA-ZÂÊÎÔÛÄËÏÖÜÀÇÉÈÙ]+[ \-']?[[a-zàáâäçèéêëìíîïñòóôöùúûüA-ZÂÊÎÔÛÄËÏÖÜÀÇÉÈÙ]+$/;
    if (mask.test(firstName.value)) {
      document.getElementById('firstNameErrorMsg').innerText = "";
      isFirstNameOK = true;
    } else {
      document.getElementById('firstNameErrorMsg').innerText = "Veuillez renseigner un prénom valide";
      isFirstNameOK = false;
    }
  })
}

function checkLastName() {
  lastName.addEventListener('change', function () {
    let mask = /^[a-zàáâäçèéêëìíîïñòóôöùúûüA-ZÂÊÎÔÛÄËÏÖÜÀÇÉÈÙ]+[ \-']?[[a-zàáâäçèéêëìíîïñòóôöùúûüA-ZÂÊÎÔÛÄËÏÖÜÀÇÉÈÙ]+$/;
    if (mask.test(lastName.value)) {
      document.getElementById('lastNameErrorMsg').innerText = "";
      isLastNameOK = true;
    } else {
      document.getElementById('lastNameErrorMsg').innerText = "Veuillez renseigner un nom valide";
      isLastNameOK = false;
    }
  })
}

function checkAddress() {
  address.addEventListener('change', function () {
    let mask = /^([0-9a-z'àâéèêôùûçÀÂÉÈÔÙÛÇ\s-]{5,50})$/;
    if (mask.test(address.value)) {
      document.getElementById('addressErrorMsg').innerText = "";
      isAddressOK = true;
    } else {
      document.getElementById('addressErrorMsg').innerText = "Veuillez renseigner une adresse valide";
      isAddressOK = false;
    }
  })
}

function checkCity() {
  city.addEventListener('change', function () {
    let mask = /^([A-Za-z'àâéèêôùûçÀÂÉÈÔÙÛÇ\s-]{2,50})$/;
    if (mask.test(city.value)) {
      document.getElementById('cityErrorMsg').innerText = "";
      isCityOK = true;
    } else {
      document.getElementById('cityErrorMsg').innerText = "Veuillez renseigner une ville valide";
      isCityOK = false;
    }
  })
}

function checkEmail() {
  email.addEventListener('change', function () {
    let mask = /^[\w\.=-]+@[\w\.-]+\.[\w]{2,3}$/;
    if (mask.test(email.value)) {
      document.getElementById('emailErrorMsg').innerText = "";
      isEmailOK = true;
    } else {
      document.getElementById('emailErrorMsg').innerText = "Veuillez renseigner une adresse email valide";
      isEmailOK = false;
    }
  })
}        

// lance la fonction order() au clic sur le bouton "Commander"
document.getElementById('order').addEventListener('click', function (event) {
  order();
})

// envoi la commande au back-end
function order() {

  event.preventDefault(); // empêche le rechargement de la page

  if (cart.length < 1) {
    alert("Votre panier est vide")
  } else {

    // vérifie si tous les champs sont complétés correctement
    if (isFirstNameOK && isLastNameOK && isAddressOK && isCityOK && isEmailOK) {

      // créé l'object contact
      let contact = new Contact(firstName.value, lastName.value, address.value, city.value, email.value);
      productIDs();

      if (checkFormat(contact)) {
        const orderBody = {
          contact: contact,
          products: cartProductIDs,
        };
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
        localStorage.clear();
      }
    } else {
      alert("Veuillez vérifier les champs du formulaire.");
    }
  }
}  
  

// créé le tableau de produits à envoyer au back-end (doit être un array de strings product-ID) 
function productIDs() {
  for (let element of cart) {
    cartProductIDs.push(element.id);
  }
}

// vérifie le type des champs et leur présence avant envoi
function checkFormat(contact) {
  if (cartProductIDs !== null && cartProductIDs !== "" && contact !== null & contact !== "" && Array.isArray(cartProductIDs) && typeof contact === "object") {
    return true
  }
}