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
    console.log("---------Chargement du produit cliqué depuis la page Accueil : Affichage du Kanapé---------")
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
  console.log("Modification de la couleur:");
  console.log(article);
})

// Récupération dynamique de la quantité
const quantiteEl = document.querySelector("#quantity")

quantiteEl.addEventListener("input", (q) => {
  article.quantite = Number(q.target.value);
  console.log("Modification de la quantité:");
  console.log(article);
})

// Mise en place de l'ajout de l'article dans le panier du localstorage en cliquant sur le bouton ajouter

// 1-Création de l'objet article du client
const article = {
  id : id,
  couleur : "",
  quantite : 0,
}

// 2-Ajout de la dynamique du bouton ajouter
const boutonAjouter = document.querySelector("#addToCart")

boutonAjouter.addEventListener("click", () => {
  // Si le client essaye d'ajouter un article au panier sans avoir précisé de couleur, ou de quantité
  if (article.couleur === "" && article.quantite === 0) {
    console.log("Aucune couleur, ni aucune quantité n'a été définie.");
    alert("Merci de définir une couleur et une quantité, aucun article n'a été ajouté au panier.");
  }

  // Si le client essaye d'ajouter un article au panier sans avoir précisé de couleur
  else if (article.couleur === "") {
    console.log("Aucune couleur n'a été définie.");
    alert("Merci de définir une couleur, aucun article n'a été ajouté au panier.");
  }

  // Si le client essaye d'ajouter un article au panier sans avoir précisé de quantité
  else if (article.quantite === 0) {
      console.log("Aucune quantité n'a été définie.");
      alert("Merci de définir une quantité, aucun article n'a été ajouté au panier.");
  }

  // Si le client ajoute correctement un article
  else {
    ajouterArticlerAuPanier();
  }
})

// 3-Création de la fonction qui permet d'ajouter chaque objet article au tableau panierLS qui sera associé à la clé panier du localstorage
function ajouterArticlerAuPanier() {
  let panierLS = JSON.parse(localStorage.getItem("panier"))

// Si le panier comporte déjà un article ou plus
  if (panierLS) {

      // Si un article du panier a le même id et la même couleur que l'article que le client souhaite ajouter ==> additionner les quantités
      for (let i = 0; i < panierLS.length; i++){
        if (panierLS[i].id === article.id & panierLS[i].couleur === article.couleur) {
          panierLS[i].quantite += article.quantite;
          localStorage.setItem("panier", JSON.stringify(panierLS));

          console.log("Mise à jour de l'article");
          console.log(panierLS);
          alert("Article ajouté au panier");
          return;
        }
      }
      
      // Sinon ajouter l'article au panier
      panierLS.push(article);
      localStorage.setItem("panier", JSON.stringify(panierLS));

      console.log("Ajout d'un nouvel article");
    }
  
  // Si le panier est vide
    else {
      panierLS = [];
      panierLS.push(article);
      localStorage.setItem("panier", JSON.stringify(panierLS));
      console.log("Ajout du premier article")
    }

    console.log(panierLS);
    alert("Article ajouté au panier");
}