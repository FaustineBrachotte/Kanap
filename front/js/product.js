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

            const couch = new Couch(value._id, document.getElementById("colors").value, document.getElementById("quantity").value);

            let cart = getCart();
            console.log(cart);
            console.log(couch);

            compareCart(cart,couch);
            //addCouch(cart,couch)
            console.log(cart);
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

        function compareCart(cart,couch) {
            for (let i = 0; i < cart.length; i++) {
                if(cart[i].id == couch.id && cart[i].color == couch.color) {
                    console.log("yes!");
                    cart[i].quantity = Number(cart[i].quantity) + Number(couch.quantity);
                    break;
                }else{
                    console.log("no");
                    addCouch(cart,couch);
                    break;
                }
            }
        }

        function addCouch(cart,couch) {
            cart.push(couch);
        }

        function saveCart(cart) {
            localStorage.setItem("cart",JSON.stringify(cart)); 
        }

    });