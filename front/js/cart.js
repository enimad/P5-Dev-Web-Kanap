// Compléter les infos du panierLS depuis l'api

// Récupérer le panier du localStorage
let panierLS = JSON.parse(localStorage.getItem("panier"))

// Simplification du console.log
function log(p){
    console.log(p);
}

// Création d'une variable id qui servira dans la fonction qui complètera le panierLS
let id = ""

// Création de la variable qui cible le tag qui correspond au panier
const articlesDuPanier = document.querySelector("#cart__items");

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

// FONCTION ASYNC FETCH API
async function appelApi() {
    const res = await fetch("http://localhost:3000/api/products");

    const retourApi = await res.json();

    return retourApi;
}

// FONCTION QUI SE LANCE AU CHARGEMENT DE LA PAGE EN ASYNC/ AWAIT APRES AVOIR RECUPERE LES PRODUITS API
document.addEventListener("DOMContentLoaded", async() => {
    let produitsApi = [];

    try {
        produitsApi = await appelApi();
    }
    catch (e) {
        log("Erreur!");
        log(e);
    }
    log(produitsApi);

    if (panierLS) {
        for (let i = 0; i < panierLS.length; i++) {
            const produitPanierId = panierLS[i].id;
            const produitPanier = panierLS[i];
            for (const p of produitsApi) {
                if (p._id === produitPanierId) {
                    log(`Produit ${[i+1]} du panier - ID: ` + produitPanierId)
                    log(`Produit de l'api - ID: ` + p._id);
                    produitPanier.imageUrl = p.imageUrl;
                    produitPanier.altTxt = p.altTxt;
                    produitPanier.name = p.name;
                    produitPanier.price = p.price;
                }
            }
        }

        trierPanierParId(panierLS);

        log("Panier final trié par ID:");
        log(panierLS);

        afficherPanierFinal(panierLS);
    }
    else {
        articlesDuPanier.innerHTML = "Le panier est vide...";
        log("Le panier est vide");
    }
});


// Affichage du panier

// 1- Création de la fonction qui va changer le innerHTML afin d'afficher le panier final

function afficherPanierFinal(panier) {
    if (panier) {
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
}


// 2- Création de la fonction qui va changer le innerHTML afin d'afficher la quantité totale d'articles

// function afficherQuantiteTotal() {
    // <p>Total (<span id="totalQuantity"><!-- 2 --></span> articles) : <span id="totalPrice"><!-- 84,00 --></span> €</p>
// }


// 3- Création de la fonction qui va changer le innerHTML afin d'afficher le prix total

// function afficherPrixTotal() {
    // <p>Total (<span id="totalQuantity"><!-- 2 --></span> articles) : <span id="totalPrice"><!-- 84,00 --></span> €</p>
// }



// Gérer le formulaire

// <div class="cart__order__form__question">
//     <label for="firstName">Prénom: </label>
//     <input type="text" name="firstName" id="firstName" required>
//     <p id="firstNameErrorMsg"><!-- ci est un message d'erreur --></p>
// </div>