//________________________________________________________ Gestion du panier _______________________________________________________________

let cart = getCart();

/**
 * Récupère le contenu du localstorage
 * @returns {Array} An empty array or an array of objects
 */
 function getCart() {
  let cartStr = localStorage.getItem("cart");
  if (cartStr != null && Array.isArray(JSON.parse(cartStr))) {
    return JSON.parse(cartStr);
  } else {
    return [];
  }
}

/**
 * Vérifie si le panier est vide
 */
if (cart.length < 1) {
  emptyCart();
} else {
  getItems();
}

/**
 * Modifie le titre du panier et affiche une quantité et un prix total à 0
 */
function emptyCart() {
    document.querySelector("#cartAndFormContainer > h1").innerText = "Votre panier est vide";
    document.getElementById("totalQuantity").innerText = 0;
    document.getElementById("totalPrice").innerText = 0;
  }

/**
 * Insère les informations reçues de l'API dans le DOM pour les produits présents dans le panier
 * @param {String} item.id
 */
function getItems() {
  for (let item of cart) {
    fetch(`http://localhost:3000/api/products/${item.id}`)
      .catch(error => console.log("fetch error", error))
      .then(data => data.json())
      .then(value => {
        document.getElementById("cart__items").innerHTML += `<article class="cart__item" data-id="${item.id}" data-color="${item.color}">
                                                              <div class="cart__item__img">
                                                                <img src="${value.imageUrl}" alt="${value.altTxt}">
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

/**
 * Calcule la quantité totale des articles présents dans le panier
 */
function totalQuantity() {
  let totalQuantity = 0;
  document.getElementById("totalQuantity").innerText = totalQuantity; // permet de mettre la quantité à 0 si tout est supprimé du panier 
  const itemQuantity = document.querySelectorAll('.itemQuantity');
  itemQuantity.forEach((itemQuantity) => {
    const item = itemQuantity.closest('article');
    if (item.style.display !== 'none') {
      totalQuantity += Number(itemQuantity.value);
      document.getElementById("totalQuantity").innerText = totalQuantity;
    }
  })
}

/**
 * Calcule le prix total des articles présents dans le panier
 */
function totalPrice() {
  let totalPrice = 0;
  document.getElementById("totalPrice").innerText = totalPrice; // permet de mettre le prix à 0 si tout est supprimé du panier 
  const itemQuantity = document.querySelectorAll('.itemQuantity');
  itemQuantity.forEach(async (itemQuantity) => {
    const item = itemQuantity.closest('article');
    const itemID = item.dataset.id;
    if (item.style.display !== 'none') {
      getPrice(itemID).then(value => {
        totalPrice += value.price * itemQuantity.value;
        document.getElementById("totalPrice").innerText = totalPrice;
      });
    }
  });
}

/**
 * Requête l'API pour connaître le prix du canapé dont la quantité a été modifiée
 * @async
 * @param {String} itemID
 * @return {Promise<Object>}
 */
async function getPrice(itemID) {
  const response = await fetch(`http://localhost:3000/api/products/${itemID}`);
  const data = await response.json();
  return data;
}

/**
 * Mets à jour la quantité totale des articles présents dans le panier
 */
function updateQuantity() {
  const inputQuantity = document.querySelectorAll('.itemQuantity');
  inputQuantity.forEach((inputQuantity) => {
    inputQuantity.addEventListener('change', function () {
      const item = inputQuantity.closest('article');
      const foundCart = cart.find(element => element.id == item.dataset.id && element.color == item.dataset.color);
      if (inputQuantity.value > 0 && inputQuantity.value <= 100) {
        foundCart.quantity = inputQuantity.value;
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

/**
 * Supprime un article du panier
 */
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

/**
 * Sauvegarde le panier dans le localstorage
 */
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}


//_______________________________________________________ Envoi de la commande _____________________________________________________________

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

/**
 * @class
 * @classdesc Créée un objet contact avec les informations saisies par l'utilisateur
 */
class Contact {
  constructor(firstName, lastName, address, city, email) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.city = city;
    this.email = email;
  }
}

resetFields();

/**
 * Vide les champs du formulaire au chargement de la page
 */
function resetFields() {
  firstName.value = "";
  lastName.value = "";
  address.value = "";
  city.value = "";
  email.value = "";
}

checkInputs();

/**
 * Vérifie si les informations saisies dans les différents champs du formulaire sont valides
 */
function checkInputs() {
  checkFirstName();
  checkLastName();
  checkAddress();
  checkCity();
  checkEmail();
}

/**
 * Vérifie si les informations saisies dans le champ "Prénom" sont correctes
 * * @returns {Boolean}
 */
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

/**
 * Vérifie si les informations saisies dans le champ "Nom" sont correctes
 * * @returns {Boolean}
 */
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

/**
 * Vérifie si les informations saisies dans le champ "Adresse" sont correctes
 * * @returns {Boolean}
 */
function checkAddress() {
  address.addEventListener('change', function () {
    if (address.value !== "") {
      document.getElementById('addressErrorMsg').innerText = "";
      isAddressOK = true;
    } else {
      document.getElementById('addressErrorMsg').innerText = "Veuillez renseigner une adresse valide";
      isAddressOK = false;
    }
  })
}

/**
 * Vérifie si les informations saisies dans le champ "Ville" sont correctes
 * * @returns {Boolean}
 */
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

/**
 * Vérifie si les informations saisies dans le champ "Email" sont correctes
 * * @returns {Boolean}
 */
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

/**
 * Appel de la fonction order() au clic sur le bouton "Commander"
 */
document.getElementById('order').addEventListener('click', () => {
  order();
})

/**
 * Envoie la commande au back-end
 */
function order() {

  event.preventDefault(); // empêche le rechargement de la page

  // vérifie si le panier est vide
  if (cart.length < 1) {
    alert("Votre panier est vide !")
  } else {

    // vérifie si tous les champs sont complétés correctement
    if (isFirstNameOK && isLastNameOK && isAddressOK && isCityOK && isEmailOK) {

      let contact = new Contact(firstName.value, lastName.value, address.value, city.value, email.value);
      productIDs();

      if (checkFormat(cartProductIDs, contact)) {
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

/**
 * Créée le tableau de produits à envoyer au back-end (doit être un array de strings product-ID)
 */
function productIDs() {
  for (let element of cart) {
    cartProductIDs.push(element.id);
  }
}

/**
 * Vérifie le type des champs et leur présence avant envoi
 * @returns {Boolean}
 */
function checkFormat(cartProductIDs, contact) {
  if (cartProductIDs != null && cartProductIDs !== "" && contact != null & contact !== "" && Array.isArray(cartProductIDs) && typeof contact === "object") {
    return true
  }
}