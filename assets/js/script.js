let articles
const addedToBasket = []


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
                    <p class="price mx-auto">${price}&nbsp;€</p>
                    <a class="add-to-basket btn btn-primary mx-auto">Ajouter au panier</a>
                </div>
            </div>
        </div>
    `

    return col
}

function createTableRow(image, type, id, title, price) {

    const row = document.createElement("tr")
    row.className = "w-100"

    row.innerHTML = `
        <td><img width="50px" height="50px" src="${image}"></td>
        <td>${title}</td>
        <td>${price}</td>
        <td data-quantity="fefe">1</td>
        <td><button type="button"><i class="bi bi-trash"></i></button></td>
    `

    const currentArticleInBasket = {
        type: type,
        id: id,
        quantity: 1,
        ref: row.querySelector("[data-quantity]")
    }

    row.getElementsByTagName("button")[0].onclick = function () {
        row.parentElement.removeChild(row)
        const index = addedToBasket.indexOf(currentArticleInBasket)
        const articleToRemove = addedToBasket[index]
        addedToBasket.splice(index, 1)

        const myBasket = document.getElementById("myBasket")
        const myBasketValue = +myBasket.innerHTML

        myBasket.innerHTML = myBasketValue - articleToRemove.quantity
    }

    addedToBasket.push(currentArticleInBasket)

    console.log(addedToBasket)

    return row
}

function onAddToButtonClick(entry, dataCard, itemsImages) {

    // on incrémente le score du panier
    modifyBasket()

    const modal = document.getElementsByClassName("basket")[0]

    let isOnlyOneExist = false

    addedToBasket.forEach(article => {
        // women                    // 0
        if (article.type == entry && article.id == dataCard.id) {
            article.quantity++
            article.ref.innerHTML = article.quantity
            isOnlyOneExist = true
        }
    })

    if (isOnlyOneExist == false) {
        const tableRow = createTableRow(itemsImages[0], entry, dataCard.id, dataCard.title, dataCard.price)
        modal.getElementsByTagName("tbody")[0].append(tableRow)
    }
}

fetch("./assets/json/clothes.json").then(response => response.json()).then(data => {

    // 
    articles = data

    // retourne un tableau [["women", {items...}], ["men", {items...}], ["child", {items...}]]
    const entries = Object.entries(data)

    // on loop sur nos "entrées": entry = "women", value = [{items...}, {items...}]
    for (const [entry, value] of entries) {
        // on loops sur chacun des articles
        value.forEach(dataCard => {

            let letter = ""

            switch (entry) {
                case "women": letter = "F"; break;
                case "men": letter = "H"; break;
                case "child": letter = "E"; break;
            }

            const itemsImages = []

            for (let i = 0; i < 3; i++) {
                itemsImages.push(`./assets/img/${letter}${dataCard.id}-${i}.webp`)
            }

            console.log(itemsImages)

            const card = createCard(itemsImages[0], dataCard.id, dataCard.title, dataCard.price)
            document.getElementsByClassName(`${entry}_container`)[0].children[0].append(card)

            // au clic sur l'image
            card.getElementsByTagName("img")[0].onclick = function () {
                // référence vers notre modale
                const modal = document.getElementsByClassName("modalDescriptionArticle")[0]

                // modification du titre
                console.log(modal)
                modal.getElementsByClassName("titreModal")[0].innerHTML = dataCard.title

                // modification du carrousel
                const carouselItemChildren = modal.getElementsByClassName("carousel-item")[0].children
                for (let i = 0; i < 3; i++) {
                    modal.getElementsByTagName("img")[i].src = itemsImages[i]
                }

                // modification du prix
                modal.getElementsByClassName("descriprix")[0].children[0].innerHTML = dataCard.title
                modal.getElementsByClassName("descriprix")[1].children[0].innerHTML = dataCard.price

                // modification du clique sur ajouter au panier de la modale
                modal.getElementsByClassName("btn")[0].onclick = onAddToButtonClick.bind(null, entry, dataCard, itemsImages)
            }
            // au click sur le bouton "ajout au panier"
            card.getElementsByClassName("add-to-basket")[0].onclick = onAddToButtonClick.bind(null, entry, dataCard, itemsImages)

        })

    }
})

//Fonction permettant de faire évoluer le chiffre du volume d'article à coté du panier

let addBasket = 0

function modifyBasket() {
    addBasket++
    myBasket.innerHTML = addBasket
    if (addBasket == 0) {
        document.getElementById("myBasket").className = "item-count2"
    } else
        document.getElementById("myBasket").className = "item-count"
}