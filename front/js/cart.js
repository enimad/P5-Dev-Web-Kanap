// Compléter les infos du panierLS depuis l'api

// 1- Récupérer le panier du localStorage
let panierLS = JSON.parse(localStorage.getItem("panier"))

// 2- Simplification du console.log
function log(p){
    console.log(p);
}

// 3- Création d'une variable id qui servira dans la fonction panierFinal
let id = ""

// 4- Création d'une fonction qui va trier le panier final par id afin d'avoir des canapés d'un même id aux couleurs différentes les uns à la suite des autres
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

// 5- Création de la fonction qui permet d'avoir le panier final, càd de compléter le panierLS depuis l'api grace à l'id du produit
function panierFinal(panier) {
    for (let i = 0; i < panier.length; i++) {
        const produitPanierId = panier[i].id;
        const produitPanier = panier[i];
        log("Produit du panier - ID: " + panier[i].id)
        fetch("http://localhost:3000/api/products")
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then (function(retourApi) {
            for (const p of retourApi) {
                if (p._id === produitPanierId) {
                    log("Produit de l'api - ID: " + p._id);
                    produitPanier.imageUrl = p.imageUrl;
                    produitPanier.altTxt = p.altTxt;
                    produitPanier.name = p.name;
                    produitPanier.price = p.price;
                }
            }
            log("Boucle terminée");
        })
        .catch(function(err) {
            document.querySelector(".cart").innerHTML = "<h1>Erreur 404</h1>";
            console.log(err + " Erreur 404, la ressource demandée n'a pas été trouvée.");
        })
    }
    trierPanierParId(panier);

    log("Le panier final contient les produits suivants:");
    log(panier);
}

// 6- Lancement de la fonction sur la panierLS afin de le compléter dynamiquement
panierFinal(panierLS)


// Affichage du panier

// 1- Création de la fonction qui va changer le innerHTML afin d'afficher le panier final

// function afficherPanier(panier) {
//     const articlesDuPanier = document.querySelector("#cart__items");
//     for (const article of panier) {
//         articlesDuPanier.innerHTML = `<article class="cart__item" data-id="${article.id}" data-color="${article.couleur}">
//         <div class="cart__item__img">
//         <img src=${api.imageUrl} alt=${api.altTxt}>
//         </div>
//         <div class="cart__item__content">
//         <div class="cart__item__content__description">
//             <h2>${api.name}</h2>
//             <p>${article.quantite}</p>
//             <p>${api.price}</p>
//         </div>
//         <div class="cart__item__content__settings">
//             <div class="cart__item__content__settings__quantity">
//             <p>Qté : </p>
//             <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
//             </div>
//             <div class="cart__item__content__settings__delete">
//             <p class="deleteItem">Supprimer</p>
//             </div>
//         </div>
//         </div>
//         </article>`
//     }
// }


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