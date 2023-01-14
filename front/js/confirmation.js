 // récupération du numéro de commande depuis l'url
 let str = window.location.href;
 let url = new URL(str);
 let orderId = url.searchParams.get("orderId");

 // affichage du numéro de commande
 document.getElementById("orderId").innerText = orderId;