var previousUrl;
var nextUrl;

function getInfo(url, isNeededToCreateElement) { fetch(url).then(function (response) { return response.json(); }).then(function (myJson) { crearElemento(myJson, isNeededToCreateElement); }); }

function crearElemento(myJson, isNeededToCreateElement) {
    previousUrl = myJson.previous;
    nextUrl = myJson.next;
    var results = myJson.results;
    for (var i = 0; i < results.length; i++) {
        var pokemon = results[i];
        fetch(pokemon.url).then(function (response) { return response.json(); }).then(function (pokemonData) {
            console.log(pokemonData);
            if (isNeededToCreateElement) {
                var div = document.createElement('div');
                var span = document.createElement('span');
                span.innerText = pokemonData.name
                div.appendChild(span);
                document.querySelector("[data-function='pokemonsContainer']").appendChild(div);
            } else {
                var pokemonSpans = document.querySelectorAll("[data-function='pokemonsContainer'] span");
                console.log(pokemonSpans);
                pokemonSpans[i].innerText = pokemonData.name;
            }
        });
    }
}

function previousData() { getInfo(previousUrl, false); }

function nextData() { getInfo(nextUrl, false); }

window.onload = function () {
    getInfo('https://pokeapi.co/api/v2/pokemon?offset=0&limit=4', true);
    document.querySelector("[data-function='nextData']").addEventListener("click", nextData);
    document.querySelector("[data-function='previousData']").addEventListener("click", previousData);
}
