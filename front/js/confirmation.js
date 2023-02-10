//___________________________________________________ Affichage du numéro de commande ______________________________________________________
/**
 * Récupération du numéro de commande depuis l'url
 */
const str = window.location.href;
const url = new URL(str);
const orderId = url.searchParams.get("orderId");

/**
 * Affichage du numéro dans le DOM
 */
document.getElementById("orderId").innerText = orderId;