// variable qui sera égale au résultat du fetch du JSON 
let articles
// état du score du badge du panier
let addBasket = 0

const promoCode = "ANOUSONEP6"
let isPromoCodeValid = false

document.getElementById("promoCode").addEventListener("keypress", function(e) {
    if(e.key == "Enter" && this.value == "ANOUSONEP6") {
        this.value = ""
        isPromoCodeValid = true
        handlePromoCode()
    }
})

// état de notre panier
const baksetState = []

// on regarde si ce que l'on push dans le state basketState est bien une instance de type Article
baksetState.push = function(articleInstance) {
    if(articleInstance.constructor != Article) throw new Error("L'item à ajouter doit être une instance de Article")
    return Array.prototype.push.call(this, articleInstance)
}

/**
 * classe Article utilisable en tant qu'item de `basketState`
 * @param {string} type women | men | children
 * @param {string} id index de l'article
 * @param {string} price prix de l'article
 * @param {number} quantity quantité de l'article
 * @param {number} randomStock quantité aléatoire
 * @param {HTMLElement} ref référence vers la quantité de l'article dans le panier
 */
function Article(type, id, price, quantity, randomStock, ref) {
    this.type = type
    this.id = id
    this.price = price
    this.quantity = quantity
    this.randomStock = randomStock
    this.ref = ref
}

/**
 * on crée une carte et on la retourne
 * @param {string} image lien vers l'image de l'article
 * @param {number} id index de l'article dans 
 * @param {string} title titre de l'article
 * @param {string} price prix de l'article
 * @returns {HTMLDivElement} élément avec la classe "col-6 col-lg-3"
 */
function createHTMLCard(image, id, title, price) {

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

/**
 * supprime l'article du DOM et de l'état de notre panier et le renvoi
 * @param {HTMLElement} HTMLArticle HtmlElment que l'on veut supprimer
 * @param {object} basketStateItem item de basketState
 * @returns {object} item de basketState
 */
function removeArticle(HTMLArticle, basketStateItem) {

    // suppression de l'article dans l'array
    const index = baksetState.indexOf(basketStateItem)

    // on supprime l'élément html article
    HTMLArticle.parentElement.removeChild(HTMLArticle)

    // retourne l'item de l'array basketSate que l'on a enlevé
    return baksetState.splice(index, 1)[0]
}

/**
 * re-définition de l'innerHTML de l'élement ciblé avec une valeur choisie
 * @param {HTMLElement} htmlElement
 * @param {number} value 
 */
function setElementInnerHTMLToValue(htmlElement, value) {
    htmlElement.innerHTML = value
}

/**
 * met à jour la valeur du badge et le prix total du panier
 * @param {number} badgeIncreaseValue valeur à augementer positive ou négative
 * @param {HTMLElement} basketBadge référence vers le badge du panier
 * @param {boolean} isDecreasing si on diminue la valeur du badge (pour cacher le badge à 0)
 * @param {boolean} doUpdatePrice si on veut une mise à jour du prix total du panier
 */
function updateBasket(badgeIncreaseValue, basketBadge, isDecreasing = true, doUpdatePrice = true) {

    addBasket += badgeIncreaseValue
    setElementInnerHTMLToValue(basketBadge, addBasket)
    if(isDecreasing) hideScoreIfZeroArticle(basketBadge)
    if(doUpdatePrice) updateTotalPrice()
}

/**
 * on met à jour la quantité de l'article et on actualise sa référence HTML
 * @param {number} amount 1 ou - 1
 * @param {object} currentArticle instance de la classe Article
 */
function updateBasketStateQuantity(amount, currentArticle) {
    currentArticle.quantity += amount
    currentArticle.ref.innerHTML = currentArticle.quantity
}

/**
 * crée un élément de type ligne de tableau
 * @param {string} image ressource vers l'image
 * @param {string} type women | men | children
 * @param {number} id identifiant lié au type
 * @param {string} title titre de l'article
 * @param {string} price prix de l'article
 * @returns {HTMLTableRowElement}
 */
function createTableRow(image, type, id, title, price) {

    const row = document.createElement("tr")
    row.className = "w-100"

    // on utilise la "Méthode Gianni" pour avoir un nombre aléatoire
    let Stock = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    let randomStock = Stock[Math.floor(Math.random() * Stock.length)]

    row.innerHTML = `
        <td><img width="120rem" src="${image}"></td>
        <td>${title}</td>
        <td>${price}</td>
        <td data-quantity><div><button type="button" class="btn">-</button><span>1</span><button type="button" class="btn">+</button></div></td>
        <td>${randomStock}</td>
        <td><button type="button" class="btn"><i class="bi bi-trash"></i></button></td>
    `

    // notre "classe" Article à utiliser pour l'ajouter à notre variable de type liste "articles"
    const currentArticle = new Article(type, id, price, 1, randomStock, row.querySelector("[data-quantity]").getElementsByTagName("span")[0])

    // on cherche la référence vers les boutons de notre article (➖, ➕, 🗑️) et le badge du panier
    const rowButons = row.getElementsByTagName("button")
    const basketBadge = document.getElementById("badge")

    // enlever une quantité au clic sur ➖
    rowButons[0].onclick = function () {

        // si la quantité est plus grande que 0 on augemente sa quantité dans l'état du panier (basketState)
        if (currentArticle.quantity > 1) {
            updateBasketStateQuantity(-1, currentArticle)
        }
        // si la quantité est égale à 0 on supprime l'article
        else {
            // le retour de la fonction n'est pas utilisé car nous avons juste besoin d'enlever -1 pas la quantité de l'article
            removeArticle(row, currentArticle)
        }

        updateBasket(-1, basketBadge)
    }

    // ajouter une quantité au clic sur ➕
    rowButons[1].onclick = function () {

        // on ajoute un article si la quantité de l'article ne dépasse pas le stock
        if (!isInStock(currentArticle)) {
            updateBasketStateQuantity(1, currentArticle)
            
            updateBasket(1, basketBadge, false)
        }
    }

    // supprimer l'article au clic sur 🗑️
    rowButons[2].onclick = function () {

        const articleRemoved = removeArticle(row, currentArticle)

        updateBasket(-articleRemoved.quantity, basketBadge)
    }

    // on ajoute met à jour notre state basketState avec un nouvel article
    baksetState.push(currentArticle)

    return row
}

/**
 * si le score du badge tombe à zéro le cacher sinon l'afficher
 * @param {HTMLElement} basketBadge référence vers le badge du panier
 */
function hideScoreIfZeroArticle(basketBadge) {
    if (addBasket == 0) {
        basketBadge.className = "badge-hide"
    } else
        basketBadge.className = "badge-show"
}

/**
 * regarde si la quantité de l'article ne dépasse pas le stock maximal
 * @param {object} article instance de la classe Article
 * @returns {boolean}
 */
function isInStock(article) {
    return article.quantity >= article.randomStock
}

/**
 * on met à jour le prix total
 */
function updateTotalPrice() {

    // le prix total est remit à zéro puis on ajoute les quantitées de chaque articles
    let totalPriceAmount = 0
    baksetState.forEach(article => {
        totalPriceAmount += article.price * article.quantity
    })

    // on met à jour le prix total en fixant la partie décimale au 100ème
    const totalPrice = document.querySelector("[data-total-price]")
    totalPrice.children[0].innerHTML = (totalPriceAmount).toFixed(2)

    // gestion de l'information "Votre panier est vide"

    // on cible la table et le message "Votre panier est vide"
    const table = document.getElementsByClassName("table-basket")[0]
    const emptyBasket = document.getElementsByClassName("empty-basket")[0]

    // si le prix total est égal à zéro on montre la table et cache le message

    if (totalPriceAmount == 0) {
        table.classList.add("unactive")
        emptyBasket.classList.remove("unactive")

        handlePromoCode()
    }
    else {
        table.classList.remove("unactive")
        emptyBasket.classList.add("unactive")

        handlePromoCode()
    }
}

function handlePromoCode() {
    const totalPrice = document.querySelector("[data-total-price]")
    const promoCodeElement =  totalPrice.nextElementSibling

    if(baksetState.length > 0 && isPromoCodeValid) {
        totalPrice.style.textDecoration = "line-through"
        promoCodeElement.innerHTML = (+totalPrice.children[0].innerHTML * .9).toFixed(2)
        promoCodeElement.style.display = "inline"
    } else {
        totalPrice.style.textDecoration = "unset"
        promoCodeElement.style.display = "none"
    }
}

function addPromoCode() {
    isPromoCodeValid = true
}

/**
 * listener des boutons "ajouter au panier" de la carte de l'article et de sa modale
 * @param {string} type women | men | children
 * @param {object} dataCard données de l'article
 * @param {array} itemsImages tableau contenant toutes les images
 * @param {HTMLElement} basketBadge référence vers le badge du panier
 */
function onAddToButtonClick(type, dataCard, itemsImages, basketBadge, basketTable) {

    // variable qui permet de savoir s'il n'y a pas déjà article dans le basketState
    let isOnlyOneArticle = false

    baksetState.forEach(article => {
        // women                    // 0
        if (article.type == type && article.id == dataCard.id) {

            isOnlyOneArticle = true
            
            if (isInStock(article)) {
                window.alert("ya plus rien en boutique!!!")
            } else {
                updateBasketStateQuantity(1, article)

                updateBasket(1, basketBadge, true, false)
            }
            
        }

    })

    // s'il n'y a pas l'article dans l'array basketState
    if (isOnlyOneArticle == false) {
        
        const tableRow = createTableRow(itemsImages[0], type, dataCard.id, dataCard.title, dataCard.price)
        basketTable.append(tableRow)

        updateBasket(1, basketBadge, true, false)
    }

    updateTotalPrice()
}

function createCard(entry, articleData, basketTable) {
    
    // on prépare la lettre qui correspond à la variable `entry` pour retrouver les images associées

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

    // on prépare l'array qui contiendra les 3 liens vers les images
    // et on loop sur 3 images

    const itemsImages = []

    for (let i = 0; i < 3; i++) {
        itemsImages.push(`./assets/img/${letter}${articleData.id}-${i}.webp`)
    }

    // on crée une carte et on l'ajoute dans le container lié à son type
    const card = createHTMLCard(itemsImages[0], articleData.id, articleData.title, articleData.price)
    document.getElementsByClassName(`${entry}_container`)[0].children[0].append(card)

    // au clic sur l'image
    card.getElementsByTagName("img")[0].onclick = function () {
        // référence vers notre modale
        const cardModal = document.getElementsByClassName("modalDescriptionArticle")[0]

        // modification des images du carrousel
        const carouselItemChildren = cardModal.getElementsByClassName("carousel-item")
        for (let i = 0; i < carouselItemChildren.length; i++) {
            cardModal.getElementsByTagName("img")[i].src = itemsImages[i]
        }

        // modification du titre
        cardModal.getElementsByClassName("descriprix")[0].children[0].innerHTML = articleData.title
        // modification du prix
        cardModal.getElementsByClassName("descriprix")[1].children[0].innerHTML = articleData.price

        // modification du clique sur ajouter au panier de la modale
        cardModal.getElementsByClassName("btn")[0].onclick = onAddToButtonClick.bind(null, entry, articleData, itemsImages, badge, basketTable)
    }
    // au click sur le bouton "ajout au panier"
    card.getElementsByClassName("add-to-basket")[0].onclick = onAddToButtonClick.bind(null, entry, articleData, itemsImages, badge, basketTable)
}

fetch("./assets/json/clothes.json").then(response => response.json()).then(data => {

    // on assigne à la variable articles la valeur du JSON transformé en objet
    articles = data

    // retourne un tableau [["women", {items...}], ["men", {items...}], ["child", {items...}]]
    const entries = Object.entries(data)

    // on cible la modale panier et son panier
    const basketModal = document.getElementsByClassName("basket")[0]
    const basketTable = basketModal.getElementsByTagName("tbody")[0]

    // on loop sur nos "entrées": entry = "women", value = [{items...}, {items...}]
    for (const [entry, value] of entries) {

        // on fait une boucle sur chacun des articles
        value.forEach(articleData => createCard(entry, articleData, basketTable))

    }
})