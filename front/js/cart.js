// // Simplification du console.log
// function log(p){
//     console.log(p);
// }

// // Récupérer le panier du localStorage
// let panierLS = JSON.parse(localStorage.getItem("panier"))

// // Création d'une variable id qui servira dans la fonction qui complètera le panierLS
// let id = ""

// // Création de la variable qui cible le tag qui correspond au panier
// const articlesDuPanier = document.querySelector("#cart__items");


// // Fonction async fetch api
// async function appelApi() {
//     const res = await fetch("http://localhost:3000/api/products");

//     const retourApi = await res.json();

//     return retourApi;
// }

// /* ******************* FONCTION PRINCIPALE ******************* */

// // Fonction qui se lance au chargement de la page en async/ await apres avoir récupéré les produits api
// document.addEventListener("DOMContentLoaded", async() => {
//     log("---------Arrivée sur la page du panier : chargement du panier---------")
//     log(panierLS);

//     let produitsApi = [];

//     // Si aucun produit n'a été ajouté au panier
//     if (panierLS === null || panierLS === undefined) {
//         log("-Le panier est vide-");
//         log(panierLS);
//         afficherPanierVide();
//     }

//     else if (panierLS.length === 0) {
//         log("-Le panier est vide-");
//         log(panierLS);
//         afficherPanierVide();
//     }

//     // Si des produits ont été ajoutés au panier
//     else {
//         log("-Le panier contient des produits-");
//         // Récupérer les produits de l'api
//         try {
//             produitsApi = await appelApi();
//         }
//         catch (e) {
//             log("Erreur!");
//             log(e);
//         }
//         log("Produits de l'api chargés:")
//         log(produitsApi);


//         // Compléter le panierLS
//         remplirPanierLS(produitsApi);

//         // Tri du panier pour regrouper les canapés de même ID les uns après les autres
//         trierPanierParId(panierLS);

//         // Ajout des éléments à afficher au localStorage
//         localStorage.setItem("panier", JSON.stringify(panierLS));

//         // Afficher le panier final
//         afficherPanierFinal(panierLS);

//         // Calculs Quantité et Prix Total
//         calculQuantiteTotal(panierLS);
//         log("La quantité totale d'articles: " + quantiteFinale);
//         calculPrixTotal(panierLS);
//         log("Le prix total: " + prixFinal);

//         // Afficher le QP Total
//         afficherQPTotal();

//         // Récupérer quantité maj dynamiquement
//         majQuantite(produitsApi);

//         // Supprimer article dynamiquement
//         supprimerArticle();

//         // Création du panier final qui permettra de supprimer les éléments non souhaités dans le local storage (pour ne garder que l'id, la couleur et la quantité dans le LS)
//         remplirPanierLSFinal();

//         // Suppression des éléments non souhaités dans le local storage, puis rajout de tous les éléments du panierLS afin de permettre le bon affichage des produits
//         log("******************* Suppression *******************")
//         suppressionPriceLS();
//         remplirPanierLS(produitsApi);

//         // Ajout de logs dans la console permettant de voir le bilan des paniers
//         log("******************* BILAN *******************")
//         log("panierLS:")
//         log(panierLS);
//         log("panierLSFinal:");
//         log(panierLSFinal);
//         log("localstorage:")
//         log(JSON.parse(localStorage.getItem("panier")));
//     }
// })

// // Fonction pour compléter le panierLS
// function remplirPanierLS(produitsApi) {
//     for (let i = 0; i < panierLS.length; i++) {
//         let produitPanierId = panierLS[i].id;
//         for (const p of produitsApi) {
//             if (p._id === produitPanierId) {
//                 log("////Comparaison: Produit du panier - Produit de l'api////")
//                 log(`Produit ${[i+1]} du panier - ID: ` + produitPanierId)
//                 log(`Produit de l'api - ID: ` + p._id);
//                 panierLS[i].imageUrl = p.imageUrl;
//                 panierLS[i].altTxt = p.altTxt;
//                 panierLS[i].name = p.name;
//                 panierLS[i].price = p.price;
//             }
//         }
//     }
// }


// // Création d'une fonction qui va trier le panier final par id afin d'avoir les canapés du même id les uns à la suite des autres
// function trierPanierParId(p) {
//     p.sort((a, b) => {
//         let fa = a.id.toLowerCase(),
//             fb = b.id.toLowerCase();
//         if (fa < fb) {
//             return -1;
//         }
//         if (fa > fb) {
//             return 1;
//         }
//         return 0;
//     });
// }

// /* ******************* AFFICHAGE DU PANIER ******************* */

// // Création de la fonction qui va changer le innerHTML afin d'afficher le panier final

// function afficherPanierFinal(panier) {
//     articlesDuPanier.innerHTML=""
//     for (const article of panier) {
//         articlesDuPanier.innerHTML += `<article class="cart__item" data-id="${article.id}" data-color="${article.couleur}">
//         <div class="cart__item__img">
//         <img src=${article.imageUrl} alt=${article.altTxt}>
//         </div>
//         <div class="cart__item__content">
//         <div class="cart__item__content__description">
//             <h2>${article.name}</h2>
//             <p>Couleur: ${article.couleur}</p>
//             <p>Prix: ${article.price},00 €</p>
//         </div>
//         <div class="cart__item__content__settings">
//             <div class="cart__item__content__settings__quantity">
//             <p>Qté : </p>
//             <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article.quantite}">
//             </div>
//             <div class="cart__item__content__settings__delete">
//             <p class="deleteItem">Supprimer</p>
//             </div>
//         </div>
//         </div>
//         </article>`
//     }
// }

// /* ******************* MODIFICATION DU PANIER DEPUIS LA PAGE PANIER ******************* */

// // Fonction qui permet la maj dynamique de la quantité des produits
// function majQuantite(produitsApi) {

//     const produitMaj = document.querySelectorAll(".cart__item");

//     // Ajout d'un évènement sur toute modification de l'input quantité d'article
//     produitMaj.forEach((produitMaj) => {
//         produitMaj.addEventListener("change", (q) => {

//             log("---------Changement de la quantité d'un article du panier: MAJ du panier---------")

//             let quantiteMaj = Number(q.target.value);

//             // Ajout d'une fenêtre pop up si le client essaye de mettre une quantité de 0 au lieu de supprimer l'article
//             if (quantiteMaj == 0) {
//                 alert(
//                   `Merci de saisir un chiffre compris entre 1 et 100, ou de cliquer sur "Supprimer" si vous souhaitez supprimer l'article du panier. -Notez que la quantité de l'article concerné a été réinitialisée-`
//                 );
//                 // Dans ce cas, la quantité sera ajustée à 1 après que le client ferme la fenêtre pop up
//                 quantiteMaj = 1;
//                 window.location.href = "cart.html";
//             }

//             log("-Caractéristiques de l'article maj-")

//             log(`Id: ${produitMaj.dataset.id} - Couleur: ${produitMaj.dataset.color} - Quantité maj: ${quantiteMaj}`);


//             // Modification dynamique de la quantité du produit du panier affichée et de la quantité stockée dans le localstorage
//             for (const article of panierLS){
//                 if (article.id === produitMaj.dataset.id && article.couleur === produitMaj.dataset.color) {
//                 article.quantite = quantiteMaj;

//                 localStorage.setItem("panier", JSON.stringify(panierLS));
//                 }
//             }

//             // Maj dynamique du total du panier affiché
//             calculQuantiteTotalMaj(panierLS);
//             calculPrixTotalMaj(panierLS);
//             afficherQPTotalMaj();

//             // Suppression des éléments non souhaités dans le localstorage
//             suppressionPriceLS();

//             // On remplit de nouveau les informations du panierLS pour permettre le bon affichage du pnaier et prévoir toute autre modification
//             remplirPanierLS(produitsApi);
//         });
//     });
// }

// // Création des variables et des fonctions qui vont changer le innerHTML afin d'afficher la quantité totale d'articles + le prix total

// let quantiteFinale = 0;
// let prixFinal = 0;

// function calculQuantiteTotal(panier) {
//     for (const article of panier) {
//         quantiteFinale += article.quantite;
//     }
// }

// function calculPrixTotal(panier) {
//     for (const article of panier) {
//         prixFinal += article.price * article.quantite;
//     }
// }

// const quantiteTotal = document.querySelector("#totalQuantity");
// const prixTotal = document.querySelector("#totalPrice");

// function afficherQPTotal() {
//     quantiteTotal.innerHTML = `${quantiteFinale}`;
//     prixTotal.innerHTML = `${prixFinal},00`;
// }


// // Fonction qui permet de supprimer dynamiquement un article du panier
// function supprimerArticle() {
//     const supprimerBtn = document.querySelectorAll(".deleteItem");

//     for (const btn of supprimerBtn) {
//         // Ajout d'un évènement sur clique sur le bouton supprimer en dessous des articles
//         btn.addEventListener("click", () =>{

//             // On récupère la partie du html à supprimer lorsqu'on clique sur supprimer
//             const articleASupprimer = btn.closest('article');
            
//             // On compare la partie html concernée par le clique sur le bouton supprimé avec les éléments du panier à afficher, lorsqu'on a notre article on le supprime du panier et on maj le localstorage, enfin on log dans la console l'article qui a été supprimé et le panier maj
//             for (const article of panierLS){
//                 if (articleASupprimer.dataset.id === article.id && articleASupprimer.dataset.color === article.couleur) {
//                     panierLS = panierLS.filter((el) => el !== article)
//                     localStorage.setItem("panier", JSON.stringify(panierLS));
//                     panierLS = JSON.parse(localStorage.getItem("panier"));
//                     log("Article Supprimé");
//                     log(`Id de l'article: ${articleASupprimer.dataset.id} - Couleur de l'article: ${articleASupprimer.dataset.color}`);
//                     log("Panier MAJ après suppression de l'article:");
//                     log(panierLS);
//                 }
//             }

//             // On ouvre une fenêtre pop up qui indique que le produit a bien été supprimé du panier et on recharge la page
//             alert("Ce produit a été supprimé du panier");
//             window.location.href = "cart.html";

//             // S'il reste au moins un article dans le panier: on affiche le nouveau panier et le nouveau total
//             if (panierLS.length > 0) {
//                 afficherPanierFinal(panierLS);

//                 calculQuantiteTotalMaj(panierLS);
//                 calculPrixTotalMaj(panierLS);
//                 afficherQPTotalMaj();
//             }
//             // S'il ne reste plus d'article dans le panier: on affiche le panier vide et le total de 0
//             else {
//                 afficherPanierVide();

//                 calculQuantiteTotalMaj(panierLS);
//                 calculPrixTotalMaj(panierLS);
//                 afficherQPTotalMaj();
//             }
//         })
//     }
// }

// // Création des variables et des fonctions qui vont changer le innerHTML afin d'afficher la quantité totale d'articles + le prix total - En cas de suppression d'un article
// let quantiteFinaleMaj = 0;
// let prixFinalMaj = 0;

// function calculQuantiteTotalMaj(panier) {
//     quantiteFinaleMaj = 0;
//     for (const article of panier) {
//         quantiteFinaleMaj += article.quantite;
//     }
//     log("Quantité finale maj: " + quantiteFinaleMaj);
// };

// function calculPrixTotalMaj(panier) {
//     prixFinalMaj = 0;
//     for (const article of panier) {
//         prixFinalMaj += article.price * article.quantite;
//     }
//     log("Prix final maj: " + prixFinalMaj);
// };

// function afficherQPTotalMaj() {
//     quantiteTotal.innerHTML = `${quantiteFinaleMaj}`;
//     prixTotal.innerHTML = `${prixFinalMaj},00`;
//     log("Affichage du QPTotalMaj");
// }

// // Fonction qui permet de supprimer un article du panierLS
// function suprrimerArticleDuLS(panier, a) {
//     panier.filter( el => el !== a)
// }

// // Fonction qui permet d'afficher un panier vide si le panier est vide
// function afficherPanierVide(){
//     articlesDuPanier.innerHTML = "Le panier est vide...";
//     log("Le panier est vide");

//     // Afficher le QPTotal de 0
//     afficherQPTotal();
// }

// /* ******************* MAJ DU LOCALSTORAGE ******************* */

// // Création du second panier qui servira lors de la maj le localStorage
// let panierLSFinal = []

// // Fonction qui remplit le nouveau panier avec les articles du panierLS
// function remplirPanierLSFinal() {
//     panierLSFinal = panierLS;
//     log("Voila le panierLSFinal rempli:");
//     log(panierLSFinal);
// }

// // Fonction qui supprime les éléments non désirés du localStorage
// function suppressionPriceLS() {
//     log("Voila le PLSF après suppression:");
//     for (let i = 0; i < panierLSFinal.length; i++) {
//         // Pour chaque article du nouveau panier final: on supprime les éléments de prix, de nom et d'image
//         delete panierLSFinal[i].price;
//         delete panierLSFinal[i].imageUrl;
//         delete panierLSFinal[i].altTxt;
//         delete panierLSFinal[i].name;
//         log("PLSF maj:");
//         log(panierLSFinal[i]);

//         // On met à jour le localstorage avec ce nouveau panier final afin de ne garder que les données d'id, de couleur et de quantité
//         localStorage.setItem("panier", JSON.stringify(panierLSFinal));
//         let panierFinal = JSON.parse(localStorage.getItem("panier"));
//         // Enfin on log le local storage final 
//         log("LocalStorage:")
//         log(panierFinal);
//     };
// }


// // Gérer le formulaire

/* $$$$$$$$$$$$$$$$$$$$ Les inputs des utilisateurs doivent être analysés et validés pour vérifier le format et le type
de données avant l’envoi à l’API. Il ne serait par exemple pas recevable d’accepter un
prénom contenant des chiffres, ou une adresse e-mail ne contenant pas de symbole “@”. En
cas de problème de saisie, un message d’erreur devra être affiché en dessous du champ
correspondant. $$$$$$$$$$$$$$$$$$$$ */

// On récupère les éléments html que l'on souhaite analyser et modifier

const prenomEl = document.querySelector("#firstName");
let prenomClient = "";
const prenomErreurEl = document.querySelector("#firstNameErrorMsg");

const nomEl = document.querySelector("#lastName");
let nomClient = "";
const nomErreurEl = document.querySelector("#lastNameErrorMsg");

const adresseEl = document.querySelector("#address");
let adresseClient = "";
const adresseErreurEl = document.querySelector("#addressErrorMsg");

const villeEl = document.querySelector("#city");
let villeClient = "";
const villeErreurEl = document.querySelector("#cityErrorMsg");

const emailEl = document.querySelector("#email");
let emailClient = "";
const emailErreurEl = document.querySelector("#emailErrorMsg");

const btnCommander = document.querySelector("#order");

// On crée les RegEx (prenom, nom, ville + adresse + email) et les messages d'erreur qui seront indiqués au client
const regexNom = /^[a-zA-Z ,.'-]*$/i;
const erreurMsgNom = `des lettres, et/ ou les caractères suivants ", ' -". Exemple: Jean-Louis, O'Brian, Marc, ...`

const regexAdresse = /^[a-zA-Z0-9\s,'-]*$/;
const erreurMsgAdresse = `des chiffres, des lettres, et/ ou les caractères suivants ", ' -". Exemple: 1 rue Jean-Louis, 2 rue O'Brian, 3 rue Marc, ...`

const regexEmail = /^[a-zA-Z0-9.!#$%&'’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const erreurMsgEmail = "des chiffres, des lettres, et/ ou certains caractères spéciaux, au format email. Exemple: Jean-&Louis@email.fr, $O'Brian@email.com, Marc#@email.dz"

// Fonctions qui permettent, pour chaque input du formulaire, d'analyser ce que le client entre dans le formulaire et de désactiver le bouton Commander si les regex ne sont pas respectées
function analyseInput(input, value, regex, erreurInput, erreurMessage) {
    // On récupère l'input du prenomEl/ nomEl/ villeEl et on écoute le changement de l'input
    input.addEventListener("input", (c) => {
        // On récupère le texte renseigné dans le champ de l'élément input
        value = String(c.target.value);   
        // Si le texte renseigné ne match pas avec la regex, on désactive le bouton commander   
        if (regex.test(value) === false) {
            btnCommander.disabled = true;
            console.log("Le bouton Commander est désactivé");
            // On indique un message d'erreur
            erreurInput.innerHTML = `Le champ de saisie ne peut contenir que ${erreurMessage}`;
        }
        // Sinon on (ré)active le bouton commander 
        else {
            btnCommander.disabled = false;
            console.log("Le bouton Commander est actif");
            erreurInput.innerHTML = "";
        }
    })
}

function analyseFormulaire() {
    analyseInput(prenomEl, prenomClient, regexNom, prenomErreurEl, erreurMsgNom);
    analyseInput(nomEl, nomClient, regexNom, nomErreurEl, erreurMsgNom);
    analyseInput(adresseEl, adresseClient, regexAdresse, adresseErreurEl, erreurMsgAdresse);
    analyseInput(villeEl, villeClient, regexNom, villeErreurEl, erreurMsgNom);
    analyseInput(emailEl, emailClient, regexEmail, emailErreurEl, erreurMsgEmail);
}

analyseFormulaire();


// // <div class="cart__order__form__question">
// //     <label for="firstName">Prénom: </label>
// //     <input type="text" name="firstName" id="firstName" required>
// //     <p id="firstNameErrorMsg"><!-- ci est un message d'erreur --></p>
// // </div>