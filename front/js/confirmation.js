/* Définition des variables */

// On récupère l'url
const url = new URL(window.location.href);
const urlConfirmation = url.toString();

// On récupère l'orderId depuis l'url
const commandeId = url.searchParams.get("orderId");

// On récupère le tag html dont on souhaite changer le texte pour faire afficher le numéro de commande
const orderIdEl = document.querySelector("#orderId");


// Fonction qui permet d'afficher le numéro de commande et de vider le localstorage (et par conséquent le panier)
function affichageCommandeId() {
    // On s'assure que le client a été redirigé ici en cliquant sur le bouton Commander en vérifiant qu'il y a bien un orderId
    if (commandeId) {
        // On affiche le numéro de commande et on vide le LS
        console.log("Confirmation de commande !")
        orderIdEl.innerHTML = commandeId;
        localStorage.clear();
    }
    // Si le client est arrivé ici sans avoir cliqué sur le bouton btnCommander, on l'avertit qu'ill faut passer par la page panier où il devra logiquement appuyer sur le bouton Commander + on le redirige vers la page d'accueil
    else {
        alert("Merci de remplir votre panier afin de pouvoir passer commande");
        document.location.href = "./index.html";
    }
}

// On lance la fonction
affichageCommandeId();