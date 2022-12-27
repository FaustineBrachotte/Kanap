 // récupération de l'id produit depuis l'url

var str = window.location.href;
var url = new URL(str);
var productId = url.searchParams.get("id");


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

        let colorList = value.colors;
        let selectColors = document.getElementById("colors");
        let color;
            for(let i of colorList){
                color = document.createElement("option");
                color.setAttribute("value", i);
                color.innerText = i;
                selectColors.appendChild(color);
            }

        // add to cart

        let addToCartBtn = document.getElementById("addToCart");    
        addToCartBtn.addEventListener('click', function() {     
              
            let objJson = {
                id : value._id,
                color : document.getElementById("colors").value,
                quantity : document.getElementById("quantity").value
            }        
            localStorage.setItem("obj",JSON.stringify(objJson));            
        });
            
        });