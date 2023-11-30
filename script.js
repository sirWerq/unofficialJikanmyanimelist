const listAnime = document.querySelector("#animeList")
const input = document.querySelector('.inputUser')
const btn = document.querySelector('.buttonInput')

getTampilan()

async function getTampilan() {
    try {
        const api = await fetch ("https://api.jikan.moe/v4/top/anime?limit=18")
        const jsonAnime = await api.json()
        const anime = jsonAnime.data
        let listCard = ''
        anime.forEach(e => listCard += data(e))
        listAnime.innerHTML = listCard
    }
    catch (err) {
        alert(err)
    }
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