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
                <div class="mt-auto col-sm-12">
                    <p class="price mx-auto"><b>${price}&nbsp;€</b></p>
                    <button class="add-to-basket btn btn-dark mx-auto">Ajouter au panier</button>
                </div>
            </div>
        </div>
    `

    return col
}

function removeArticle(row, currentArticleInBasket) {
    // suppression de l'article dans l'array
    const index = addedToBasket.indexOf(currentArticleInBasket)

    // on supprime l'élément html article
    row.parentElement.removeChild(row)

    return addedToBasket.splice(index, 1)[0]
}

// mise a jour du score du panier avec la nouvelle valeur
function updateBasketValueWith(newValue) {
    const myBasket = document.getElementById("myBasket")
    const myBasketValue = +myBasket.innerHTML
    myBasket.innerHTML = myBasketValue + newValue
}

function createTableRow(image, type, id, title, price) {

    const row = document.createElement("tr")
    row.className = "w-100"

    let Stock = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    let randomStock = Stock[Math.floor(Math.random() * Stock.length)]

    row.innerHTML = `
        <td><img width="50px" height="50px" src="${image}"></td>
        <td>${title}</td>
        <td>${price}</td>
        <td data-quantity><button type="button" class="btn">-</button><span>1</span><button type="button" class="btn">+</button></td>
        <td>${randomStock}</td>
        <td><button type="button" class="btn"><i class="bi bi-trash"></i></button></td>
    `

    const currentArticleInBasket = {
        type: type,
        id: id,
        price: price,
        quantity: 1,
        randomStock: randomStock,
        ref: row.querySelector("[data-quantity]").getElementsByTagName("span")[0]
    }

    const rowButons = row.getElementsByTagName("button")

    // enlever une quantité article
    rowButons[0].onclick = function () {
        if (currentArticleInBasket.quantity > 1) {
            currentArticleInBasket.quantity--
            currentArticleInBasket.ref.innerHTML = currentArticleInBasket.quantity
        }
        else {
            removeArticle(row, currentArticleInBasket)
        }
        addBasket--
        updateBasketValueWith(-1)

        hideScoreIfZeroArticle()

        updateTotalPrice()
    }

    // ajouter une quantité d'article
    rowButons[1].onclick = function () {
        if (!isInStock(currentArticleInBasket)) {
            currentArticleInBasket.quantity++
            addBasket++
            currentArticleInBasket.ref.innerHTML = currentArticleInBasket.quantity
            updateBasketValueWith(1)

            updateTotalPrice()
        }
    }

    rowButons[2].onclick = function () {
        const articleRemoved = removeArticle(row, currentArticleInBasket)
        addBasket -= articleRemoved.quantity

        updateBasketValueWith(-articleRemoved.quantity)

        hideScoreIfZeroArticle()

        updateTotalPrice()
    }

    addedToBasket.push(currentArticleInBasket)

    // console.log(addedToBasket)

    return row
}

function hideScoreIfZeroArticle() {
    if (addBasket == 0) {
        document.getElementById("myBasket").className = "item-count2"
    } else
        document.getElementById("myBasket").className = "item-count"
}

function isInStock(article) {
    return article.quantity >= article.randomStock
}

function updateTotalPrice() {
    let totalPriceAmount = 0
    addedToBasket.forEach(article => {
        totalPriceAmount += article.price * article.quantity
    })
    document.querySelector("[data-total-price]").children[0].innerHTML = (totalPriceAmount).toFixed(2)

    const table = document.getElementsByClassName("table-basket")[0]
    const emptyBasket = document.getElementsByClassName("empty-basket")[0]
    if (totalPriceAmount == 0) {
        table.classList.add("unactive")
        emptyBasket.classList.remove("unactive")
    }
    else {
        table.classList.remove("unactive")
        emptyBasket.classList.add("unactive")
    }
}

function onAddToButtonClick(entry, dataCard, itemsImages) {

    // on incrémente le score du panier

    const modal = document.getElementsByClassName("basket")[0]
    const totalPrice_el = document.querySelector("[data-total-price]")


    let isOnlyOneExist = false

    addedToBasket.forEach(article => {
        // women                    // 0
        if (article.type == entry && article.id == dataCard.id) {
            isOnlyOneExist = true
            if (isInStock(article)) {
                window.alert("ya plus rien en boutique!!!")
            } else {
                article.quantity++
                article.ref.innerHTML = article.quantity
                addBasket++
                myBasket.innerHTML = addBasket
                hideScoreIfZeroArticle()
            }
        }

    })

    if (isOnlyOneExist == false) {
        const tableRow = createTableRow(itemsImages[0], entry, dataCard.id, dataCard.title, dataCard.price)
        modal.getElementsByTagName("tbody")[0].append(tableRow)

        addBasket++
        myBasket.innerHTML = addBasket
        hideScoreIfZeroArticle()

    }

    updateTotalPrice()
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
                case "women":
                    letter = "F";
                    break;
                case "men":
                    letter = "H";
                    break;
                case "child":
                    letter = "E";
                    break;
            }

            const itemsImages = []

            for (let i = 0; i < 3; i++) {
                itemsImages.push(`./assets/img/${letter}${dataCard.id}-${i}.webp`)
            }

            // console.log(itemsImages)


            const card = createCard(itemsImages[0], dataCard.id, dataCard.title, dataCard.price)
            document.getElementsByClassName(`${entry}_container`)[0].children[0].append(card)

            // console.log(randomStock)

            // au clic sur l'image
            card.getElementsByTagName("img")[0].onclick = function () {
                // référence vers notre modale
                const modal = document.getElementsByClassName("modalDescriptionArticle")[0]

                // modification du carrousel
                const carouselItemChildren = modal.getElementsByClassName("carousel-item")[0].children
                for (let i = 0; i < 3; i++) {
                    modal.getElementsByTagName("img")[i].src = itemsImages[i]
                }

                // modification du titre
                modal.getElementsByClassName("descriprix")[0].children[0].innerHTML = dataCard.title
                // modification du prix
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