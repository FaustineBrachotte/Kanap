 // récupération de l'id produit depuis l'url

var str = window.location.href;
var url = new URL(str);
var productId = url.searchParams.get("id");
console.log(productId);