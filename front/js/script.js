// Récupération des produits de l'api

const urlApi = "http://localhost:3000/api/products"

fetch(urlApi)
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(tableauProduits) {
    afficherProduits(tableauProduits);
  })
  .catch(function(err) {
    document.querySelector(".titles").innerHTML = "<h1>Erreur 404</h1>";
    console.log(err);
})


// Affichage des produits de l'api

function afficherProduits(element) {
    const zoneArticle = document.querySelector("#items");
    for (const article of element) {
      zoneArticle.innerHTML += `<a href="./product.html?id=${article._id}">
      <article>
        <img src="${article.imageUrl}" alt="${article.altTxt}">
        <h3 class="productName">${article.name}</h3>
        <p class="productDescription">${article.description}</p>
      </article>
    </a>`;
    }
}