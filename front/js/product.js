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

            if (cart.length == 0) {
                addCouch(cart,newCouch)
            } else {
                compareCart(cart,newCouch);
            }
            saveCart(cart);

        }

        // retourne le panier sous forme de tableau
        function getCart() {
            cart = localStorage.getItem("cart");
            console.log(cart);
            if(cart == null) {
                return [];
            }else{
                return JSON.parse(cart);
            }
        }

        function compareCart(cart,newCouch) {
            let i = 0;
            let cartCouch = cart[i];
            console.log("cart.length " + cart.length);
            console.log(cartCouch);
            console.log("isEqual(cartCouch,newCouch) " + isEqual(cartCouch,newCouch));
            let couchesAreDifferent = true;

            for (cartCouch of cart) {
                console.log("Dans boucle + " + cartCouch);
                console.log("cart.length + " + cart.length);
                if(isEqual(cartCouch,newCouch)) {
                    console.log("égal");
                    cartCouch.quantity = Number(cartCouch.quantity) + Number(newCouch.quantity);
                    console.log("cartCouch.quantity = " + cartCouch.quantity);
                    couchesAreDifferent = false;
                }}

            if (couchesAreDifferent) {
                addCouch(cart,newCouch);
            }
        }

        function isEqual(cartCouch,newCouch) {
            console.log("dans isequal");
            console.log("cartCouch.id = " + cartCouch.id + " newCouch.id = " +  newCouch.id + " Et cartCouch.color  = " + cartCouch.color + " newCouch.color = " + newCouch.color);
            console.log(newCouch);
            if(cartCouch.id == newCouch.id && cartCouch.color == newCouch.color) {
                return true;
            }else{
                return false;
            }
        }

        function addCouch(cart,newCouch) {
            cart.push(newCouch);   
        }

        function saveCart(cart) {
            localStorage.setItem("cart",JSON.stringify(cart)); 
        }

    });