 // récupération de l'id produit depuis l'url

let str = window.location.href;
let url = new URL(str);
let productId = url.searchParams.get("id");


// affichage des données produit

fetch(`http://localhost:3000/api/products/${productId}`)
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
            for(let i of colorList){
                color = document.createElement("option");
                color.setAttribute("value", i);
                color.innerText = i;
                selectColors.appendChild(color);
            }


        // ajout du canapé sélectionné au panier

        class Couch {
            constructor(id, color, quantity) {
                this.id = id;
                this.color = color;
                this.quantity = quantity;
            }
        }

        const addToCartBtn = document.getElementById("addToCart");    
        addToCartBtn.addEventListener('click', function() {     
            addToCart();
        });
            
        function addToCart() {
            const newCouch = new Couch(value._id, document.getElementById("colors").value, document.getElementById("quantity").value);
            let cart = getCart();
            console.log(cart);
            let isInCart = compareCart(cart,newCouch);
            if (!isInCart) { 
                addCouch(cart,newCouch);
            }
            saveCart(cart);
        }

        // retourne le panier sous forme de tableau
        function getCart() {
            cart = localStorage.getItem("cart");
            if(cart == null) {
                return [];
            }else{
                return JSON.parse(cart);
            }
        }

        // vérifie si le canapé existe dans le panier
        function isEqual(cartCouch,newCouch) {
            if(cartCouch.id == newCouch.id && cartCouch.color == newCouch.color) {
                return true;
            }else{
                return false;
            }
        }

        // incrémente la quantité si le canapé existe déjà dans le panier    
        function compareCart(cart,newCouch) {
            let i = 0;
            let cartCouch = cart[i];

            while (i < cart.length) {
                if(isEqual(cartCouch,newCouch)) {
                    cartCouch.quantity = Number(cartCouch.quantity) + Number(newCouch.quantity);
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

    });