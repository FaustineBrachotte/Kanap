 // récupération de l'order id depuis l'url
 let str = window.location.href;
 let url = new URL(str);
 let orderId = url.searchParams.get("orderId");

 // affichage du numéro de commande dans la page
 document.getElementById("orderId").innerText = orderId;
