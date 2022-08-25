// Récupération de l'url

const stringUrl = window.location.href
const url = new URL(stringUrl)


// Récupération de l'id depuis l'url

const id = url.searchParams.get("id")


// Dénomination des différents éléments du html qui seront modifiés

const image = document.querySelector(".item__img")
const nom = document.querySelector("#title")
const prix = document.querySelector("#price")
const description = document.querySelector("#description")
const couleurs = document.querySelector("#colors")


// Récupération des produits de l'api et sélection d'un produit
const urlApi = "http://localhost:3000/api/products"

fetch(urlApi)
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(tableauProduits) {
    choisirProduit(tableauProduits);
    console.log(objetProduitChoisi);
    afficherProduit();
  })
  .catch(function(err) {
    document.querySelector(".item").innerHTML = "<h1>Erreur 404</h1>";
    console.log(err + " Erreur 404, la ressource demandée n'a pas été trouvée.");
})


// Récupérer le produit qui a l'id de l'url

let objetProduitChoisi = {}
function choisirProduit(element) {
    for (let objetProduit of element) {
    if (objetProduit._id === id) {
        objetProduitChoisi = objetProduit;
        break;
        }
    }
}


// Modifier dynamiquement product.html afin d'afficher le produit choisi

function afficherProduit() {
    image.innerHTML += `<img src="${objetProduitChoisi.imageUrl}" alt="${objetProduitChoisi.altTxt}">`;
    nom.innerHTML += `${objetProduitChoisi.name}`;
    prix.innerHTML += `${objetProduitChoisi.price}`;
    description.innerHTML += `${objetProduitChoisi.description}`;
    for (let color of objetProduitChoisi.colors) {
        couleurs.innerHTML += `<option value="${color}">${color}</option>`;
    }
}


// Récupération dynamique de la couleur

const couleurEl = document.querySelector("#colors")

couleurEl.addEventListener("input", (c) => {
  article.couleur = String(c.target.value);
  console.log(article);
})

// Récupération dynamique de la quantité

const quantiteEl = document.querySelector("#quantity")

quantiteEl.addEventListener("input", (q) => {
  article.quantite = Number(q.target.value);
  console.log(article);
})

// Création de l'objet panier et des variables de l'article du client qui le rempliront

const panier = []
const article = {
  id : id,
  couleur : "",
  quantite : 0,
}


// Ajout et gestion du panier dans le localstorage


const boutonAjouter = document.querySelector("#addToCart")

boutonAjouter.addEventListener("click", () => {
  panier.push(article);
  localStorage.setItem("panier", JSON.stringify(panier));
  console.log(localStorage);
})
