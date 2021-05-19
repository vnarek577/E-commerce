function createCard(type, id, title, price) {
    const containerFluid = document.createElement("div")
    containerFluid.class = "container-fluid"

    const itemImage = `./assets/img/${type}${id}-0.webp`
    containerFluid.innerHTML = `
        <div class="container-fluid">
            <div class="row d-flex justify-content-center">
                <div class="col-6 col-lg-3">
                    <div class="card border-0 text-center">
                        <img src="${itemImage}" class="card-img-top" alt="vetement1" type="button"
                            data-bs-toggle="modal" data-bs-target="#exampleModal">
                        <div class="card-body">
                            <h5 class="card-title">${title}</h5>
                            <div class="d-flex ">
                                <p class="price mx-auto">${price}</p>
                                <a class="btn btn-primary mx-auto">Ajouter au panier</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `

    return containerFluid
}

fetch("./assets/json/clothes.json").then(response => response.json()).then(data => {
    data.women.forEach(womenData => {
        const card = createCard("F", womenData.id, womenData.title, womenData.price)
        console.log(card)
        document.getElementsByClassName("women_fragId")[0].append(card)
    });
})