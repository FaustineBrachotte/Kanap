//__________________________________________ Affichage des informations du produit sélectionné _____________________________________________
/**
 * Récupération de l'id produit depuis l'url
 */
const str = window.location.href;
const url = new URL(str);
const productId = url.searchParams.get("id");

/**
 * Insère les informations reçues de l'API dans le DOM pour le produit sélectionné
 * @param {String} productId
 */
fetch(`http://localhost:3000/api/products/${productId}`)
    .catch(error => console.log("fetch error", error))
    .then(data => data.json())
    .then(value => {
        document.querySelector(".item__img").innerHTML += `<img src="${value.imageUrl}" alt="${value.altTxt}">`;
        document.getElementById("title").innerText = value.name;
        document.getElementById("price").innerText = value.price;
        document.getElementById("description").innerText = value.description;
        const colorList = value.colors;
        const displayedColors = document.getElementById("colors");
        let color;
        for (let i of colorList) {
            color = document.createElement("option");
            color.setAttribute("value", i);
            color.innerText = i;
            displayedColors.appendChild(color);
        }
    });


//____________________________________________________ Ajout du produit au panier __________________________________________________________
/**
 * @class
 * @classdesc Crée un nouveau canapé pour ajout au panier avec les propriétés sélectionnées par l'utilisateur
 */
class Couch {
    constructor(id, color, quantity) {
        this.id = id;
        this.color = color;
        this.quantity = quantity;
    }
}

/**
 * Appel de la fonction addToCart() au clic sur le bouton "Ajouter au panier"
 */
document.getElementById("addToCart").addEventListener('click', () => {
    addToCart();
});

/**
 * Ajoute un canapé dans le panier
 */
function addToCart() {
    const color = document.getElementById("colors").value;
    const quantity = document.getElementById("quantity").value;
    if (checkInputs(color, quantity)) {
        let newCouch = new Couch(productId, color, quantity);
        let cart = getCart();
        if (!isInCart(cart, newCouch)) {
            addCouch(cart, newCouch);
            saveCart(cart);
            alert("Le produit a bien été ajouté");
        }
    }
}

/**
 * Vérifie si les inputs de l'utilisateur sont corrects (non vides et avec une quantité comprise entre 1 et 100)
 * @param {String} color 
 * @param {Integer} quantity 
 * @returns {Boolean}
 */
function checkInputs(color, quantity) {
    if (color == "") {
        alert("Veuillez choisir une couleur");
        return false;
    } else if (quantity <= 0 || quantity > 100) {
        alert("Veuillez choisir un nombre d'articles entre 1 et 100");
        return false;
    }
    return true;
}

/**
 * Récupère le contenu du localstorage
 * @returns {Array} Un tableau vide ou un tableau d'objets
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
 * Compare le nouveau canapé avec le contenu du panier et incrémente la quantité si le canapé existe déjà
 * @param {Array} cart 
 * @param {Object} newCouch 
 * @returns {Boolean}
 */
function isInCart(cart, newCouch) {
    let i = 0;
    while (i < cart.length) {
        if (cart[i].id == newCouch.id && cart[i].color == newCouch.color) {
            if (Number(cart[i].quantity) + Number(newCouch.quantity) > 100) {
                alert("Le produit ne peut pas être ajouté car la quantité totale contenue dans le panier doit être inférieure ou égale à 100.");
                return true;
            } else {
                cart[i].quantity = Number(cart[i].quantity) + Number(newCouch.quantity);
                saveCart(cart);
                alert("Le produit a bien été ajouté");
                return true;
            }
        }
        i++;
    }
    return false;
}

/**
 * Ajoute un canapé dans le panier
 * @param {Array} cart 
 * @param {Object} newCouch 
 */
function addCouch(cart, newCouch) {
    cart.push(newCouch);
}

/**
 * Sauvegarde le panier dans le localstorage
 * @param {Array} cart 
 */
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}