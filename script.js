const listAnime = document.querySelector("#animeList")
const input = document.querySelector('.inputUser')
const btn = document.querySelector('.buttonInput')
const paginationButton = document.querySelector('#pagination')


getTampilan()

async function getTampilan() {
    try {
        page = getParams()
        const anime = await getData(page)
        let listCard = ''
        if(Array.isArray(anime)) {
            anime.forEach(e => listCard += data(e))
        } else {
            listCard += anime
        }
        listAnime.innerHTML = listCard
        let pageButton = await buttonPage()
        paginationButton.innerHTML = pageButton
    }
    catch (err) {
        alert(err)
    }
}

async function getData(page = 1, target = "data") {
    const api = await fetch(`https://api.jikan.moe/v4/top/anime?limit=18&page=${page}`)
    const dataAnime = await api.json()
    const dataTarget = dataAnime[`${target}`]
    if (dataTarget.length == 0) {
        return '<h1 class="text-center">DATA NOT FOUND</h1>'
    }
    return dataTarget
}

function getParams(parameter = "page") {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get(parameter) ? urlParams.get(parameter) : 1
    return parseInt(page)
}

async function buttonPage() {
    let url = getParams()
    const pagination = await getData(url, "pagination")
    if (url > pagination.last_visible_page) {
        url = 1;
    }
    const buttonPrevious = url == 1 ? `<ul class="pagination justify-content-center">
    <li class="page-item disabled">
    <a class="page-link">Previous</a>
    </li>` : `
    <ul class="pagination justify-content-center">
    <li class="page-item">
    <a class="page-link" href="?page=${url - 1}">Previous</a>
    </li>
    `
    const pageNumber = dataPage(url, pagination.last_visible_page)
    const buttonNext = pagination.has_next_page ? `<li class="page-item">
    <a class="page-link" href="?page=${url + 1}">Next</a>
    </li>` : `<li class="page-item disabled">
    <a class="page-link">Next</a>
    </li>`
    
    return buttonPrevious + pageNumber + buttonNext
    
}

function dataPage(currPage, lastpage) {
    const basePage = Math.floor(currPage / 4) * 4
    const currPosition = currPage % 4
    let text = ''
    if (currPage < 4) {
        for (let i = 1; i < 5; i++) {
            if (i == currPosition) {
                text += `<li class="page-item disabled"><a class="page-link" href="?page=${basePage + i}">${basePage + i}</a></li>`
            } else {
                text += `<li class="page-item"><a class="page-link" href="?page=${basePage + i}">${basePage + i}</a></li>`
            }
        }
        text += `
        <li class="page-item disabled"><a class="page-link" href="#">...</a></li>
        <li class="page-item"><a class="page-link" href="?page=${lastpage}">${lastpage}</a></li>
        `

    } else if (currPage > lastpage - 4) {
        text += `<li class="page-item"><a class="page-link" href="?page=1">1</a></li>
        <li class="page-item disabled"><a class="page-link" href="#">...</a></li>`
        for (let i = 4; i >= 0; i--) {
            if (lastpage - i == currPage) {
                text += `<li class="page-item disabled"><a class="page-link" href="?page=${lastpage - i}">${lastpage - i}</a></li>`
            } else {
                text += `<li class="page-item"><a class="page-link" href="?page=${lastpage - i}">${lastpage - i}</a></li>`
            }
        }
    } else {
        text += `<li class="page-item"><a class="page-link" href="?page=1">1</a></li>
        <li class="page-item disabled"><a class="page-link" href="#">...</a></li>`
        for (let i = -1; i < 5; i++) {
            if (i == currPosition) {
                text += `<li class="page-item disabled"><a class="page-link" href="?page=${basePage + i}">${basePage + i}</a></li>`
            } else {
                text += `<li class="page-item"><a class="page-link" href="?page=${basePage + i}">${basePage + i}</a></li>`
            }
        }
        text += `<li class="page-item disabled"><a class="page-link" href="#">...</a></li>
        <li class="page-item"><a class="page-link" href="?page=${lastpage}">${lastpage}</a></li>`

    }
    return text
}


btn.addEventListener('click', async function () {
    try {
        const api = await fetch(`https://api.jikan.moe/v4/anime?q=${input.value}&limit=18`)
        const jsonAnime = await api.json()
        if (jsonAnime.data.length == 0) {
            throw new Error('data not found')
        }
        const anime = jsonAnime.data
        if (input.value.trim() !== '') {
            let listCard = ''
            anime.forEach(e => listCard += data(e))
            listAnime.innerHTML = listCard
        }
    }
    catch (err) {
        alert(err)
    }
})



function data(value) {
    return `        
    <div class="col-md-2">
        <div class="card my-3">
            <img src="${value.images.webp.large_image_url}" classvalue="card-img-top">
            <div class="card-body">
                <h6 class="card-subtitle mb-2 text-body-secondary">rank: ${value.rank}</h6>
                <h5 class="card-title">${value.title}</h5>
                <h6 class="card-subtitle mb-2 text-body-secondary">episodes: ${value.episodes}</h6>
                <h6 class="card-subtitle mb-2 text-body-secondary">release: ${value.year}</h6>
                <h6 class="card-subtitle mb-2 text-body-secondary">score: ${value.score}</h6>
                <a href="#" class="btn btn-primary" id="detailsButton" data-bs-toggle="modal" data-bs-target="#buttonDetails${value.mal_id}">Details</a>
            </div>
        </div>
    </div>
    
        <div class="modal fade" id="buttonDetails${value.mal_id}" tabindex="-1" aria-labelledby="buttonDetailsLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
        <div class="modal-header">
            <h1 class="modal-title fs-5" id="buttonDetailsLabel">Details Anime</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="container-fluid">
            <div class="row">
                <div class="col-md">
                <ul class="list-group">
                    <li class="list-group-item"><h5>${value.title}</h5></li>
                    <li class="list-group-item"><strong>Synopsis: </strong>${value.synopsis}</li>
                    <li class="list-group-item"><strong>author: </strong>${value.producers.map(e => e.name)}</li>
                    <li class="list-group-item"><strong>genres: </strong>${value.genres.map(e => e.name)}</li>
                    <li class="list-group-item"><strong>status: </strong>${value.status}</li>
                    <li class="list-group-item"><strong>type: </strong>${value.type}</li>
                    <li class="list-group-item"><strong>episodes: </strong>${value.episodes}</li>
                    <li class="list-group-item"><strong>score: </strong>${value.score}</li>
                    <li class="list-group-item"><strong>rank: </strong>${value.rank}</li>
                    <li class="list-group-item"><strong>popularity: </strong>${value.popularity}</li>
                    <li class="list-group-item"><strong>members: </strong>${value.members}</li>
                </ul>
                </div>
            </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
        </div>
    </div>
    </div>
    `
}   