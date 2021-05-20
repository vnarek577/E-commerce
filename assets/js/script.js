// on crée une carte et on la retourne
function createCard(image, id, title, price) {

    const col = document.createElement("div")
    col.className = "col-6 col-lg-3"

    col.innerHTML = `
        <div class="card border-0 h-100 text-center">
            <img src="${image}" class="card-img-top" alt="vetement1" type="button"
                data-bs-toggle="modal" data-bs-target="#exampleModal">
            <div class="card-body d-flex flex-column">
                <p class="articleTitle card-title">${title}</p>
                <div class="d-flex mt-auto">
                    <p class="price mx-auto">${price} €</p>
                    <a class="add-to-basket btn btn-primary mx-auto">Ajouter au panier</a>
                </div>
            </div>
        </div>
    `

    return col
}

fetch("./assets/json/clothes.json").then(response => response.json()).then(data => {
    // retourne un tableau [["women", {items...}], ["men", {items...}], ["child", {items...}]]
    const entries = Object.entries(data)

    // on loop sur nos "entrées": entry = "wome", value = {items...}
    for (const [entry, value] of entries) {
        // on loops sur chacun des articles
        value.forEach(dataCard => {

            let letter = ""

            switch (entry) {
                case "women": letter = "F"; break;
                case "men": letter = "H"; break;
                case "child": letter = "E"; break;
            }

            const itemImage = `./assets/img/${letter}${dataCard.id}-0.webp`

            const card = createCard(itemImage, dataCard.id, dataCard.title, dataCard.price)
            document.getElementsByClassName(`${entry}_container`)[0].children[0].append(card)

            // au clic sur ajouter au panier
            card.getElementsByClassName("add-to-basket")[0].onclick = function () {
                // on incrémente le score du panier
                incrementBasketCount()

                // référence vers notre modale
                const modal = document.getElementsByClassName("modal")[0]

                // modification du titre

                // modification de l'image
                modal.getElementsByTagName("img")[0].src = itemImage

                // modification du carrousel

                // modification du prix

                // modification du clique sur ajouter au panier de la modale
                modal.getElementsByTagName("btn")[0].onclick = function () {

                }
            }

        })

    }
})

//Fonction permettant de faire évoluer le chiffre du volume d'article à coté du panier

let addBasket = 0

function modifyBasket(){
    addBasket++
    myBasket.innerHTML = addBasket
     if (addBasket == 0) {
            document.getElementById("myBasket").className = "item-count2"
        } else
        document.getElementById("myBasket").className = "item-count"}