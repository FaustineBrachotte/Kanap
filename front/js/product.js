 //___________________________________________ affichage des informations produit ____________________________________________________
 
 // récupération de l'id produit depuis l'url
let str = window.location.href;
let url = new URL(str);
let productId = url.searchParams.get("id");


// affichage des informations pour le produit sélectionné
fetch(`http://localhost:3000/api/products/${productId}`)
    .catch(error => console.log("fetch error", error))
    .then(data => data.json())
    .then(value => {
        document.querySelector(".item__img").innerHTML += `<img src="${value.imageUrl}" alt="${value.altTxt}">`;
        document.getElementById("title").innerText = value.name;
        document.getElementById("price").innerText = value.price;
        document.getElementById("description").innerText = value.description;

        const colorList = value.colors;
        const selectColors = document.getElementById("colors");
        let color;
        for (let i of colorList) {
            color = document.createElement("option");
            color.setAttribute("value", i);
            color.innerText = i;
            selectColors.appendChild(color);
        }
    });


//_____________________________________________________ ajout au panier ____________________________________________________________
class Couch {
    constructor(id, color, quantity) {
        this.id = id;
        this.color = color;
        this.quantity = quantity;
    }
}

// appelle la fonction addToCart() au clic sur le bouton "Ajouter au panier"
document.getElementById("addToCart").addEventListener('click', function () {
    addToCart();
});

// ajout du canapé dans le panier
function addToCart() {
    const color = document.getElementById("colors").value;
    const quantity = document.getElementById("quantity").value;
    if (checkInputs(color, quantity)) {
        let newCouch = new Couch(productId, color, quantity);
        let cart = getCart();
        if (!compareCart(cart, newCouch)) {
            addCouch(cart, newCouch);
        }
        saveCart(cart);
        alert("Le produit a bien été ajouté");
    };
}

// vérifie si les inputs de l'utilisateurs sont corrects
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

// retourne le panier existant sous forme de tableau
function getCart() {
    let cartStr = localStorage.getItem("cart");
    if (cartStr != null && Array.isArray(JSON.parse(cartStr))) {
        return JSON.parse(cartStr);
    } else {
        return [];
    }
}

// incrémente la quantité si le canapé existe déjà dans le panier    
function compareCart(cart, newCouch) {
    let i = 0;
    while (i < cart.length) {
        if (cart[i].id == newCouch.id && cart[i].color == newCouch.color) {
            cart[i].quantity = Number(cart[i].quantity) + Number(newCouch.quantity);
            return true;
        }
        i++
    }
    return false
}

// ajoute le canapé au panier
function addCouch(cart, newCouch) {
    cart.push(newCouch);
}

// sauvegarde le nouveau panier dans le localstorage
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}