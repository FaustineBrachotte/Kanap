//___________________________________________________ Affichage du numéro de commande ______________________________________________________
/**
 * Récupération du numéro de commande depuis l'url
 */
let str = window.location.href;
let url = new URL(str);
let orderId = url.searchParams.get("orderId");

/**
 * Affichage du numéro dans le DOM
 */
document.getElementById("orderId").innerText = orderId;