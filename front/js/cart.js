// Récupérer le panier du localStorage
let panierLS = JSON.parse(localStorage.getItem("panier"))

// Création d'une variable id qui servira dans la fonction qui complètera le panierLS
let id = ""

// Création de la variable qui cible le tag qui correspond au panier
const articlesDuPanier = document.querySelector("#cart__items");


// Fonction async fetch api
async function appelApi() {
    const res = await fetch("http://localhost:3000/api/products");

    const retourApi = await res.json();

    return retourApi;
}

/* ******************* FONCTION PRINCIPALE ******************* */

// Fonction qui se lance au chargement de la page en async/ await apres avoir récupéré les produits api
document.addEventListener("DOMContentLoaded", async() => {
    let produitsApi = [];

    // Si aucun produit n'a été ajouté au panier
    if (panierLS === null || panierLS === undefined) {
        afficherPanierVide();
    }

    else if (panierLS.length === 0) {
        afficherPanierVide();
    }

    // Si des produits ont été ajoutés au panier
    else {
        // Récupérer les produits de l'api
        try {
            produitsApi = await appelApi();
        }
        catch (e) {
            console.log(e);
        }

        // // Compléter le panierLS
        remplirPanierLS(produitsApi);

        // Tri du panier pour regrouper les canapés de même ID les uns après les autres
        trierPanierParId(panierLS);

        // Ajout des éléments à afficher au localStorage
        localStorage.setItem("panier", JSON.stringify(panierLS));

        // Afficher le panier final
        afficherPanierFinal(panierLS);

        // Calculs Quantité et Prix Total
        calculQuantiteTotal(panierLS);
        calculPrixTotal(panierLS);

        // Afficher le QP Total
        afficherQPTotal();

        // Récupérer quantité maj dynamiquement
        majQuantite(produitsApi);

        // Supprimer article dynamiquement
        supprimerArticle();

        // Création du panier final qui permettra de supprimer les éléments non souhaités dans le local storage (pour ne garder que l'id, la couleur et la quantité dans le LS)
        remplirPanierLSFinal();

        // Suppression des éléments non souhaités dans le local storage, puis rajout de tous les éléments du panierLS afin de permettre le bon affichage des produits
        suppressionPriceLS();
        remplirPanierLS(produitsApi);
    }
})

// Fonction pour compléter le panierLS
function remplirPanierLS(produitsApi) {
    for (let i = 0; i < panierLS.length; i++) {
        let produitPanierId = panierLS[i].id;
        for (const p of produitsApi) {
            if (p._id === produitPanierId) {
                panierLS[i].imageUrl = p.imageUrl;
                panierLS[i].altTxt = p.altTxt;
                panierLS[i].name = p.name;
                panierLS[i].price = p.price;
            }
        }
    }
}


// Création d'une fonction qui va trier le panier final par id afin d'avoir les canapés du même id les uns à la suite des autres
function trierPanierParId(p) {
    p.sort((a, b) => {
        let fa = a.id.toLowerCase(),
            fb = b.id.toLowerCase();
        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
    });
}

/* ******************* AFFICHAGE DU PANIER ******************* */

// Création de la fonction qui va changer le innerHTML afin d'afficher le panier final

function afficherPanierFinal(panier) {
    articlesDuPanier.innerHTML=""
    for (const article of panier) {
        articlesDuPanier.innerHTML += `<article class="cart__item" data-id="${article.id}" data-color="${article.couleur}">
        <div class="cart__item__img">
        <img src=${article.imageUrl} alt=${article.altTxt}>
        </div>
        <div class="cart__item__content">
        <div class="cart__item__content__description">
            <h2>${article.name}</h2>
            <p>Couleur: ${article.couleur}</p>
            <p>Prix: ${article.price},00 €</p>
        </div>
        <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article.quantite}">
            </div>
            <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
            </div>
        </div>
        </div>
        </article>`
    }
}

/* ******************* MODIFICATION DU PANIER DEPUIS LA PAGE PANIER ******************* */

// Fonction qui permet la maj dynamique de la quantité des produits
function majQuantite(produitsApi) {

    const produitMaj = document.querySelectorAll(".cart__item");

    // Ajout d'un évènement sur toute modification de l'input quantité d'article
    produitMaj.forEach((produitMaj) => {
        produitMaj.addEventListener("change", (q) => {
            let quantiteMaj = Number(q.target.value);

            // Ajout d'une fenêtre pop up si le client essaye de mettre une quantité de 0 au lieu de supprimer l'article
            if (quantiteMaj < 1 || quantiteMaj > 100) {
                alert(
                  `Merci de saisir un chiffre compris entre 1 et 100, ou de cliquer sur "Supprimer" si vous souhaitez supprimer l'article du panier. -Notez que la quantité de l'article concerné a été réinitialisée-`
                );
                // Dans ce cas, la quantité sera ajustée à 1 après que le client ferme la fenêtre pop up
                quantiteMaj = 1;
                window.location.href = "cart.html";
            }
            // Modification dynamique de la quantité du produit du panier affichée et de la quantité stockée dans le localstorage
            for (const article of panierLS){
                if (article.id === produitMaj.dataset.id && article.couleur === produitMaj.dataset.color) {
                article.quantite = quantiteMaj;

                localStorage.setItem("panier", JSON.stringify(panierLS));
                }
            }
            // Maj dynamique du total du panier affiché
            calculQuantiteTotalMaj(panierLS);
            calculPrixTotalMaj(panierLS);
            afficherQPTotalMaj();

            // Suppression des éléments non souhaités dans le localstorage
            suppressionPriceLS();

            // On remplit de nouveau les informations du panierLS pour permettre le bon affichage du pnaier et prévoir toute autre modification
            remplirPanierLS(produitsApi);
        });
    });
}

// Création des variables et des fonctions qui vont changer le innerHTML afin d'afficher la quantité totale d'articles + le prix total

let quantiteFinale = 0;
let prixFinal = 0;

function calculQuantiteTotal(panier) {
    for (const article of panier) {
        quantiteFinale += article.quantite;
    }
}

function calculPrixTotal(panier) {
    for (const article of panier) {
        prixFinal += article.price * article.quantite;
    }
}

const quantiteTotal = document.querySelector("#totalQuantity");
const prixTotal = document.querySelector("#totalPrice");

function afficherQPTotal() {
    quantiteTotal.innerHTML = `${quantiteFinale}`;
    prixTotal.innerHTML = `${prixFinal},00`;
}


// Fonction qui permet de supprimer dynamiquement un article du panier
function supprimerArticle() {
    const supprimerBtn = document.querySelectorAll(".deleteItem");

    for (const btn of supprimerBtn) {
        // Ajout d'un évènement sur clique sur le bouton supprimer en dessous des articles
        btn.addEventListener("click", () =>{
            // On récupère la partie du html à supprimer lorsqu'on clique sur supprimer
            const articleASupprimer = btn.closest('article');
            
            // On compare la partie html concernée par le clique sur le bouton supprimé avec les éléments du panier à afficher, lorsqu'on a notre article on le supprime du panier et on maj le localstorage
            for (const article of panierLS){
                if (articleASupprimer.dataset.id === article.id && articleASupprimer.dataset.color === article.couleur) {
                    panierLS = panierLS.filter((el) => el !== article)
                    localStorage.setItem("panier", JSON.stringify(panierLS));
                    panierLS = JSON.parse(localStorage.getItem("panier"));
                }
            }

            // On ouvre une fenêtre pop up qui indique que le produit a bien été supprimé du panier et on recharge la page
            alert("Ce produit a été supprimé du panier");
            window.location.href = "cart.html";

            // S'il reste au moins un article dans le panier: on affiche le nouveau panier et le nouveau total
            if (panierLS.length > 0) {
                afficherPanierFinal(panierLS);

                calculQuantiteTotalMaj(panierLS);
                calculPrixTotalMaj(panierLS);
                afficherQPTotalMaj();
            }
            // S'il ne reste plus d'article dans le panier: on affiche le panier vide et le total de 0
            else {
                afficherPanierVide();

                calculQuantiteTotalMaj(panierLS);
                calculPrixTotalMaj(panierLS);
                afficherQPTotalMaj();
            }
        })
    }
}

// Création des variables et des fonctions qui vont changer le innerHTML afin d'afficher la quantité totale d'articles + le prix total - En cas de suppression d'un article
let quantiteFinaleMaj = 0;
let prixFinalMaj = 0;

function calculQuantiteTotalMaj(panier) {
    quantiteFinaleMaj = 0;
    for (const article of panier) {
        quantiteFinaleMaj += article.quantite;
    }
};

function calculPrixTotalMaj(panier) {
    prixFinalMaj = 0;
    for (const article of panier) {
        prixFinalMaj += article.price * article.quantite;
    }
};

function afficherQPTotalMaj() {
    quantiteTotal.innerHTML = `${quantiteFinaleMaj}`;
    prixTotal.innerHTML = `${prixFinalMaj},00`;
}

// Fonction qui permet de supprimer un article du panierLS
function suprrimerArticleDuLS(panier, a) {
    panier.filter( el => el !== a)
}

// Fonction qui permet d'afficher un panier vide si le panier est vide
function afficherPanierVide(){
    articlesDuPanier.innerHTML = "Le panier est vide...";

    // Afficher le QPTotal de 0
    afficherQPTotal();
}

/* ******************* MAJ DU LOCALSTORAGE ******************* */

// Création du second panier qui servira lors de la maj le localStorage
let panierLSFinal = []

// Fonction qui remplit le nouveau panier avec les articles du panierLS
function remplirPanierLSFinal() {
    panierLSFinal = panierLS;
}

// Fonction qui supprime les éléments non désirés du localStorage
function suppressionPriceLS() {
    for (let i = 0; i < panierLSFinal.length; i++) {
        // Pour chaque article du nouveau panier final: on supprime les éléments de prix, de nom et d'image
        delete panierLSFinal[i].price;
        delete panierLSFinal[i].imageUrl;
        delete panierLSFinal[i].altTxt;
        delete panierLSFinal[i].name;

        // On met à jour le localstorage avec ce nouveau panier final afin de ne garder que les données d'id, de couleur et de quantité
        localStorage.setItem("panier", JSON.stringify(panierLSFinal));
        let panierFinal = JSON.parse(localStorage.getItem("panier"));
    };
}


// // Gérer le formulaire

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

const allErrorMsgEl = document.querySelectorAll(".cart__order__form__question > p");
const allErrorMsgArray = Array.from(allErrorMsgEl);

const btnCommander = document.querySelector("#order");

// On crée les RegEx (prenom, nom, ville + adresse + email) et les messages d'erreur qui seront indiqués au client
const regexNom = /^(?:[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœA-Z]+[ '-]?)*$/i;
const erreurMsgNom = `des lettres, et/ ou les caractères suivants " ' - ". Exemple: Jean-Louis, O'Brian, Marc, ...`

const regexAdresse = /^(?:[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœA-Z0-9 ]+[,'-]?)*$/;
const erreurMsgAdresse = `des chiffres, des lettres, et/ ou les caractères suivants ", ' -". Exemple: 1 rue Jean-Louis, 2 rue O'Brian, 3 rue Marc, ...`

const regexEmail = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœA-Z0-9.!#$%&'’*+/=?^_`{|}~-]+@(?:[a-zA-Z0-9]+[-]?)+[.]{1}[a-zA-Z0-9-]{1,5}$/;
const erreurMsgEmail = "des chiffres, des lettres, et/ ou certains caractères spéciaux, au format email. Exemple: Jean-&Louis@email.fr, $O'Brian@email.com, Marc#@email.dz"

// Fonctions qui permettent, pour chaque input du formulaire, d'analyser ce que le client entre dans le formulaire et de désactiver le bouton Commander si les regex ne sont pas respectées

function analyseInput(input, value, regex, erreurInput, erreurMessage) {
    allErrorMsgArray[0].innerHTML = "";
    // On récupère l'input du prenomEl/ nomEl/ villeEl et on écoute le changement de l'input
    input.addEventListener("input", (c) => {
        // On récupère le texte renseigné dans le champ de l'élément input
        value = String(c.target.value);   
        // Si le texte renseigné ne match pas avec la regex, on désactive le bouton commander   
        if (regex.test(value) === false) {
            btnCommander.disabled = true;
            // On indique un message d'erreur
            erreurInput.innerHTML = `Le champ de saisie ne peut contenir que ${erreurMessage}`;
            // On s'assure qu'il n'y a plus d'erreur avant de réactiver le bouton commander, sinon on le garde désactivé
            for (i = 0; i < allErrorMsgArray.length; i++) {
                if (allErrorMsgArray[i].innerHTML === undefined || allErrorMsgArray[i].innerHTML === "") {
                    btnCommander.disabled = false;
                }
                else {
                    btnCommander.disabled = true;
                    break;
                }
            }
        }
        // Sinon on (ré)active le bouton commander 
        else if (regex.test(value) === true) {
            btnCommander.disabled = false;
            erreurInput.innerHTML = "";
            // On s'assure qu'il n'y a plus d'erreur avant de réactiver le bouton commander, sinon on le garde désactivé
            for (i = 0; i < allErrorMsgArray.length; i++) {
                if (allErrorMsgArray[i].innerHTML === undefined || allErrorMsgArray[i].innerHTML === "") {
                    btnCommander.disabled = false;
                }
                else {
                    btnCommander.disabled = true;
                    break;
                }
            }
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

// // Pour la préparation de la commande

// Création du tableau des produits
let produitsId = [];
// Fonction qui remplit le tableau des produits
function produitsCommande() {
    if (panierLS === null || panierLS === undefined) {
        alert("Merci de remplir votre panier afin de pouvoir passer commande");
    }
    else if (panierLS.length === 0) {
        alert("Merci de remplir votre panier afin de pouvoir passer commande");
    }
    else {
        for (let i = 0; i < panierLS.length; i++) {
            produitsId[i] = panierLS[i].id;
        }
    }
}

// Création de l'objet contact
let contactFiche = {
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    email: ""
}
// Fonction qui remplit l'objet contact
function ficheContact(p, n, a, v, e) {
    contactFiche.firstName = p.value;
    contactFiche.lastName = n.value;
    contactFiche.address = a.value;
    contactFiche.city = v.value;
    contactFiche.email = e.value;
}

// Création de l'objet qui servira pour la requête POST
let objetRequetePost;

function packRequeteFetch() {
    // Création de l'objet objetRequetePost
    objetRequetePost = {
        contact: {
            firstName: contactFiche.firstName,
            lastName: contactFiche.lastName,
            address: contactFiche.address,
            city: contactFiche.city,
            email: contactFiche.email,
        },
        products: produitsId,
    };
}

// Fonctions qui vérifient que toutes les valeurs qui seront envoyées à l'api sont bien de type 'string'
function validationTypesId() {
    for (let i = 0; i < produitsId.length; i++) {
        // Pour tester la fonction si un élément n'est pas de type 'string'
        // produitsId[3] = 15;
        // Number(produitsId[3]);
        if (typeof produitsId[i] === "string") {
        }
        else {
            return false;
        }
    }
    return true;
}

function validationTypesContact() {
    const tableauValeursContact = Object.values(contactFiche);
    // Pour tester la fonction si un élément n'est pas de type 'string'
    // tableauValeursContact[3] = 15;
    // Number(tableauValeursContact[3]);
    for (let i = 0; i < tableauValeursContact.length; i++) {
        if (typeof tableauValeursContact[i] === "string") {
        }
        else {
            return false;
        }
    }
    return true;
}

// Fonctions qui permettent de récupérer l'orderId
async function appelApiPost() {
    objetRequetePost = {
        contact: contactFiche,
        products: produitsId
    };
    const resPostJson = await fetch("http://localhost:3000/api/products/order", {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(objetRequetePost)
    });

    const resPost = await resPostJson.json();

    return resPost;
}

async function recupererOrderId() {
    try{
        retourOrderApi = await appelApiPost();
    }
    catch (e) {
        console.log(e);
    }
    commandeId = retourOrderApi.orderId;
    redirectionVersConfirmation();
}

// Création de la variable qui recevra le retour de la requête POST et celle qui recevra l'orderId
let retourOrderApi;
let commandeId;

// Fonction qui envoie les infos de commande à l'API
function commandeApi() {
    if (validationTypesId() === true && validationTypesContact() === true) {
        packRequeteFetch();
        recupererOrderId();
    }
    else {
        alert("Les données que vous souhaitez communiquer ne sont pas valables");
    }
}

// Fonction qui se lance lorsque le client clique sur le bouton Commander
btnCommander.addEventListener("click", (f) => {
    f.preventDefault();
    let validiteFormulaire = document.querySelector(".cart__order__form").checkValidity();
    if(!validiteFormulaire) {
        document.querySelector(".cart__order__form").reportValidity();
    } else {
        if (panierLS === null || panierLS === undefined) {
            alert("Merci de remplir votre panier afin de pouvoir passer commande");
        }
        else if (panierLS.length === 0) {
            alert("Merci de remplir votre panier afin de pouvoir passer commande");
        }
        else {
            ficheContact(prenomEl, nomEl, adresseEl, villeEl, emailEl);
            produitsCommande();
            commandeApi();
        }
    }
})

// Fonction qui permet d'envoyer le client vers la page de confirmation de commande
function redirectionVersConfirmation() {
    document.location.href = "./confirmation.html?orderId=" + commandeId;
}