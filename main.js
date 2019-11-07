class App {
    constructor(numberToShow) {
        this.numberToShow = numberToShow;
    }

    init() {
        const blockElement = document.querySelector("[data-function='blockPokemons']");
        const containerElement = blockElement.querySelector("[data-function='pokemonContainer']");
        const previousArrowElement = blockElement.querySelector("[data-function='previousPokemons']");
        const nextArrowElement = blockElement.querySelector("[data-function='nextPokemons']");
        const sliderClass = new Slider('https://pokeapi.co/api/v2/pokemon?offset=0&limit=' + this.numberToShow, blockElement, containerElement, previousArrowElement, nextArrowElement);

        sliderClass.init(sliderClass.url, true);
    }
}


class Slider {
    constructor(url, blockElement, containerElement, previousArrowElement, nextArrowElement) {
        this.url = url;
        this.previousUrl = '';
        this.nextUrl = '';
        this.blockElement = blockElement;
        this.containerElement = containerElement;
        this.previousArrowElement = previousArrowElement;
        this.nextArrowElement = nextArrowElement;
    }

    init(url, isFirstTime) {
        this.initSlider(url, isFirstTime);
        this.catchClickEvents();
    }

    initSlider(url, isFirstTime) {
        // agregar efecto de cargando
        this.blockElement.classList.add('b-slider--loading');

        fetch(url).then((response) => { return response.json(); }).then((res) => {
            this.previousUrl = res.previous;
            this.nextUrl = res.next;
            const pokemonsData = res.results;

            const urlsToFetch = [];

            for (let i = 0; i < pokemonsData.length; i++) {
                const pokemonData = pokemonsData[i];
                urlsToFetch.push(pokemonData.url);
            }

            this.getAllPokemonData(urlsToFetch, isFirstTime);
        });
    }


    getAllPokemonData(urlsToFetch, isFirstTime) {
        Promise.all(urlsToFetch.map(url => fetch(url)))
            .then(resp => Promise.all(resp.map(r => r.json())))
            .then(allPokemonsData => {
                this.createPokemons(allPokemonsData, isFirstTime);
            });
    }

    createPokemons(allPokemonsData, isFirstTime) {
        for (let i = 0; i < allPokemonsData.length; i++) {
            let allPokemonData = allPokemonsData[i];

            const myPokemon = new Pokemon(allPokemonData.name, allPokemonData.height, allPokemonData.weight, allPokemonData.sprites.front_default);

            this.renderPokemon(myPokemon, i, isFirstTime)
        }

        this.blockElement.classList.remove('b-slider--loading');
    }

    renderPokemon(myPokemon, index, isFirstTime) {
        if (isFirstTime) {
            const containerDivElement = document.createElement('div');
            const imgElement = document.createElement('img');
            const h4Element = document.createElement('h4');

            containerDivElement.classList.add('b-slider__pokemon-container');

            h4Element.innerText = myPokemon.name;
            imgElement.src = myPokemon.spriteFront;

            containerDivElement.appendChild(imgElement);
            containerDivElement.appendChild(h4Element);

            this.containerElement.appendChild(containerDivElement);
        } else {
            this.containerElement.querySelectorAll('h4')[index].innerText = myPokemon.name;
            this.containerElement.querySelectorAll('img')[index].src = myPokemon.spriteFront;
        }
    }

    catchClickEvents() {
        this.previousArrowElement.addEventListener("click", () => {
            this.initSlider(this.previousUrl, false);
        });

        this.nextArrowElement.addEventListener("click", () => {
            this.initSlider(this.nextUrl, false);
        });
    }
}

class Pokemon {
    constructor(name, height, weight, spriteFront) {
        this.name = name;
        this.height = height;
        this.weight = weight;
        this.spriteFront = spriteFront;
    }
}

window.onload = function () {
    const appClass = new App(4);
    appClass.init();
};
