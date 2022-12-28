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

        let addToCartBtn = document.getElementById("addToCart");    
        addToCartBtn.addEventListener('click', function() {     
            addToCart();
        });
            
        
        function addToCart() {
            const couch = {
                id : value._id,
                color : document.getElementById("colors").value,
                quantity : document.getElementById("quantity").value,
            };
            let cart = getCart();
            console.log(cart);
            console.log(couch);

            compareCart(cart,couch);
            //saveCart(couch);

        }

        // retourne le panier sous forme de tableau
        function getCart() {
            cart = localStorage.getItem("cart");
            console.log(cart);
            if(cart == null) {
                return [];
            }else{
                return [JSON.parse(cart)];
            }
        }

        function compareCart(cart,couch) {

            for (let i = 0; i < cart.length; i++) {
                if(cart[i].id == couch.id && cart[i].color == couch.color) {
                    window.alert("yes!");
                }else{
                    window.alert("no");
                }
           }
           console.log(couch.id);
        }

        function saveCart(couch) {
            localStorage.setItem("cart",JSON.stringify(couch)); 
        }

    });