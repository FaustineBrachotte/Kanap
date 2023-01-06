 // récupération de l'id produit depuis l'url

let str = window.location.href;
let url = new URL(str);
let productId = url.searchParams.get("id");


// affichage des données produit

fetch(`http://localhost:3000/api/products/${productId}`)
    .catch(error => console.log("fetch error", error))
    .then(function(res) {
        if (res.ok) {
          return res.json();
        }
      })
    .then(function(value) {
        document.querySelector(".item__img").innerHTML += `<img src="${value.imageUrl}" alt="${value.altTxt}">`;
        document.getElementById("title").innerText = value.name;
        document.getElementById("price").innerText = value.price;
        document.getElementById("description").innerText = value.description;

        const colorList = value.colors;
        const selectColors = document.getElementById("colors");
        let color;
            for(const i of colorList){
                color = document.createElement("option");
                color.setAttribute("value", i);
                color.innerText = i;
                selectColors.appendChild(color);
            }     
});


// ajout du canapé sélectionné au panier
class Couch {
    constructor(id, color, quantity) {
        this.id = id;
        this.color = color;
        this.quantity = quantity;
    }
}

  
    // appelle la fonction addToCart au clic sur le bouton "Ajouter au panier"
    document.getElementById("addToCart").addEventListener('click', function() {     
        addToCart();
    });

        
    function addToCart() {
        const color = document.getElementById("colors").value;
        const quantity = document.getElementById("quantity").value;

        if (color == "") {
            alert ("Veuillez choisir une couleur");
        }

        if (quantity <= 0 || quantity > 100) {
            alert ("Veuillez choisir un nombre d'articles entre 1 et 100");
        }

        let newCouch = new Couch(productId, color, quantity);
        let cart = getCart();
        let isInCart = compareCart(cart,newCouch);
        if (!isInCart) { 
            addCouch(cart,newCouch);
        }
        saveCart(cart);
    }

    // retourne le panier sous forme de tableau
    function getCart() {
        cart = localStorage.getItem("cart");
        if (cart == null) {
            return [];
        } else if (Array.isArray(JSON.parse(cart))) {
            return JSON.parse(cart);
        } else {
            console.log("error: cart is not an array");
        }
    }

    // incrémente la quantité si le canapé existe déjà dans le panier    
    function compareCart(cart,newCouch) {
        let i = 0;
        while (i < cart.length) {
            if(cart[i].id == newCouch.id && cart[i].color == newCouch.color) {
                cart[i].quantity = Number(cart[i].quantity) + Number(newCouch.quantity);
                return true;
            }
        i++
        }
        return false
    }

    // ajoute le canapé au panier
    function addCouch(cart,newCouch) {
        cart.push(newCouch);   
    }

    // sauvegarde le nouveau panier dans le localstorage
    function saveCart(cart) {
        localStorage.setItem("cart",JSON.stringify(cart)); 
    }