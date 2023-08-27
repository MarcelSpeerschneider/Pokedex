let pokemonNames = [
    'bulbasaur', 'ivysaur', 'caterpie', 'charmander', 'charmeleon',
    'wartortle', 'pikachu', 'charizard', 'blastoise', 'squirtle',
    'metapod', 'butterfree', 'weedle', 'absol', 'beedrill',
    'pidgey', 'pidgeot', 'pidgeotto', 'rattata', 'raticate',
    'eevee', 'jolteon', 'vaporeon', 'flareon', 'espeon',
    'umbreon', 'leafeon', 'glaceon', 'sylveon', 'eelektrik'
];

let baseStats = [];
let narrowBars = [];
let totalStat = 0;
let currentPokemon;

async function init() {
    loadPokemonNames();
    renderSearchBar();
    await renderPokedex();
}

function savePokemonNames() {
    localStorage.setItem('pokemons', JSON.stringify(pokemonNames));
}

function loadPokemonNames() {
    if (localStorage.getItem('pokemons')) {
        pokemonNames = JSON.parse(localStorage.getItem('pokemons'));
    }
}

function renderSearchBar() {
    let searchBar = document.querySelector('.searchBarContainer');
    searchBar.innerHTML = /*html*/ `
    <form onsubmit="addPokemon(); return false;">
    <input id="input" placeholder="Add more Pokémon"><button>Add</button>
    </form>`;

}

async function loadPokemon(name) {
    let currentPokemon;
    try {
        let url = `https://pokeapi.co/api/v2/pokemon/${name}`;
        let response = await fetch(url);
        if (!response.ok) {
            console.error(`Failed to fetch Pokemon data for ${name}`);
            return null;
        }
        currentPokemon = await response.json();
    }
    catch (error) {
        console.error('This error occurred:', error);
    }
    return currentPokemon;
}

async function renderPokedex() {
    document.querySelector('.searchBarContainer').classList.remove('hide');
    let pokedexItems = document.querySelector('.pokedex-container');
    pokedexItems.innerHTML = '';
    for (let i = 0; i < pokemonNames.length; i++) {
        const name = pokemonNames[i];
        currentPokemon = await loadPokemon(name);
        let types = currentPokemon.types[0]['type']['name'];
        let pokemonImg = await currentPokemon.sprites.other['official-artwork'].front_default;
        pokedexItems.innerHTML += /*html*/ `
        <div class="pokedex-card ${types}" id="${name}"><div class="types">${types}</div>
            <img class="pokemon-img" src="${pokemonImg}" onclick="renderPokedexInfo('${name}')">
            ${capitalizeFirstLetter(name)}
        </div>`;
    }
}


async function renderPokedexInfo(name) {
    document.querySelector('.searchBarContainer').classList.add('hide');
    currentPokemon = await loadPokemon(name);
    renderPokedexInfoHtml();
    renderPokemonInfo();
    renderPokemonImg();
    renderAbilities();
    renderAboutHTML();
}

function renderPokemonInfo() {
    let pokemonName = currentPokemon.name;
    pokemonName = capitalizeFirstLetter(pokemonName);
    document.getElementById('pokemonName').innerHTML = `${pokemonName}`;
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function lowerFirstLetter(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}

function renderPokemonImg() {
    let pokemonImg = currentPokemon.sprites.other['official-artwork'].front_default;
    document.getElementById('pokemon-img').src = pokemonImg;
}

function renderAbilities() {
    for (let i = 0; i < currentPokemon.abilities.length; i++) {
        const ability = currentPokemon.abilities[i].ability.name;
        document.querySelector('.abilities').innerHTML += `<div class="ability">${ability}</div>`;
    }
}

function renderBaseStats() {
    renderBaseStatsHTML();
    renderStatNumbers();
    renderTotal();
    renderBars();
    checkFilledBarWidth();
    filledBarBackgroundColor()
}

function renderStatNumbers() {
    baseStats = [];
    let statNumbers = document.querySelectorAll(['.stat-number']);
    for (let index in statNumbers) {
        if (currentPokemon.stats[index]) {
            let baseStat = currentPokemon.stats[index]['base_stat'];
            statNumbers[index].innerHTML = baseStat;
            baseStats.push(baseStat);
        }
    }
}

function renderTotal() {
    totalStat = 0;
    for (let i = 0; i < 5; i++) {
        totalStat += baseStats[i];
    }
    document.getElementById('total').innerHTML = totalStat;
}

function renderBars() {
    let barNumbers = document.querySelectorAll(['.bar']);
    for (let index in barNumbers) {
        if (currentPokemon.stats[index]) {
            let baseStat = currentPokemon.stats[index]['base_stat'];
            let baseStatPercentage = baseStat / 150 * 100;
            barNumbers[index].innerHTML = /*html*/ `
        <div class="bar-container">
            <div class="bar-fill" style="width:${baseStatPercentage}%"></div>
        </div>
        `;
        }
    }
    renderBarTotal();
}

function renderBarTotal() {
    let barNumbers = document.querySelectorAll(['.bar']);
    let barTotal = barNumbers[barNumbers.length - 1];
    let totalStatPercentage = totalStat / 500 * 100;
    barTotal.innerHTML =  /*html*/ `
    <div class="bar-container">
        <div class="bar-fill" style="width:${totalStatPercentage}%"></div>
    </div>
    `;
}

function checkFilledBarWidth() {
    // Alle Elemente mit der Klasse 'bar' in der Tabelle selektieren
    const bars = document.querySelectorAll('.bar-fill');

    // Durchlaufen Sie jedes Element und überprüfen Sie dessen berechnete Breite
    narrowBars = Array.from(bars).filter(bar => {
        // Die berechnete Breite des Elements und des Elternelements in Pixeln erhalten
        const barWidthInPixels = parseFloat(window.getComputedStyle(bar).width);
        const parentWidthInPixels = parseFloat(window.getComputedStyle(bar.parentElement).width);

        // Den prozentualen Wert der Bar berechnen
        const widthPercentage = (barWidthInPixels / parentWidthInPixels) * 100;

        // Überprüfen, ob die berechnete Breite weniger als oder gleich 50% ist
        return widthPercentage <= 50;
    });

    // Jetzt enthält `narrowBars` alle Elemente mit einer Breite von maximal 50%

}

function filledBarBackgroundColor() {
    for (let bar of narrowBars) {
        bar.style.backgroundColor = 'red';
    }
}

function renderPokedexInfoHtml() {
    let pokedex = document.querySelector('.pokedex-container');
    let types = currentPokemon.types[0]['type']['name'];
    pokedex.innerHTML += /*html*/`
    <div class="pokedex-container-overlay">
        <div class="pokedex ${types}-info" id="pokedex">
            <div class="x-container">
            <img src="./img/x.svg" class="x" onclick="renderPokedex()">
            </div>
            <h1 id="pokemonName" class="pokemon-name"></h1>
            <div class="abilities"></div>

            <div class="info-container">
                <div class="img-container"><img id="pokemon-img" class="pokemon-img"></div>
                <nav>
                    <div class="links">
                        <a class="link" onclick="renderAboutHTML()">About</a><a class="link" onclick="renderBaseStats()">Base Stats</a>
                        <a class="link" onclick="setupMovesTable()">Moves</a>
                    </div>
                </nav>
                <div class="content" id="content"></div>
            </div>
        </div>
    </div>
    `;
}

function renderAboutHTML() {
    let container = document.getElementById('content');
    container.innerHTML = /*html*/`
    <div class="about">
    <table class=>
            <tr>
                <td class="padding-right">Sepcies</td>
                <td class="stat-number">${currentPokemon.name}</td>
            </tr>
            <tr>
                <td class="padding-right">Height</td>
                <td class="stat-number">${currentPokemon.height}</td>
            </tr>
            <tr>
                <td class="padding-right">Weight</td>
                <td class="stat-number">${currentPokemon.weight}</td>
            </tr>
            <tr>
                <td class="padding-right">Abilities</td>
                <td class="stat-number">${currentPokemon.abilities[0].ability.name}, ${existSecondAbility()}</td>
               </tr>
        </table>
    </div>
    `;
}

function existSecondAbility() {
    if (currentPokemon && currentPokemon.abilities && currentPokemon.abilities[1] && currentPokemon.abilities[1].ability) {
        return currentPokemon.abilities[1].ability.name;
    }
    return ' ';
}

function renderBaseStatsHTML() {
    let container = document.querySelector('.content');
    container.innerHTML =  /*html*/`
    <div class="stat-table-container">
    <div class="stat-table">
                    <table>
                        <tr>
                            <td class="stat-name">HP</td>
                            <td class="stat-number" id="hp"></td>
                            <td class="bar"></td>
                        </tr>
                        <tr>
                            <td class="stat-name">Attack</td>
                            <td class="stat-number" id="attack"></td>
                            <td class="bar"></td>
                        </tr>
                        <tr>
                            <td class="stat-name">Defence</td>
                            <td class="stat-number" id="defence"></td>
                            <td class="bar"></td>
                        </tr>
                        <tr>
                            <td class="stat-name">Sp. Atk</td>
                            <td class="stat-number" id="sp-atk"></td>
                            <td class="bar"></td>
                        </tr>
                        <tr>
                            <td class="stat-name">Sp. Def</td>
                            <td class="stat-number" id="sp-def"></td>
                            <td class="bar"></td>
                        </tr>
                        <tr>
                            <td class="stat-name">Speed</td>
                            <td class="stat-number" id="speed"></td>
                            <td class="bar"></td>
                        </tr>
                        <tr>
                            <td class="stat-name">Total</td>
                            <td class="stat-number" id="total"></td>
                            <td class="bar"></td>
                        </tr>
                    </table>
                </div>
    </div>
    `
}

function setupMovesTable() {
    let container = document.getElementById('content');
    container.innerHTML = /*html*/`
            <div class="moves-table-container">
                <table id="moves-table">
                </table>
            </div>
      `;
    renderMovesRows();
}

function renderMovesRows() {
    let movesTable = document.getElementById('moves-table');
    for (let i = 0; i < currentPokemon['moves'].length; i++) {
        const move = currentPokemon['moves'][i].move['name'];
        movesTable.innerHTML += /*html*/ `
            <tr>
                <td>${move}</td>
            </tr>
          `;
    }
}

async function addPokemon() {
    let inputValue = document.getElementById('input').value;
    if (inputValue) {
        inputValue = lowerFirstLetter(inputValue);
        let apiResponse = await loadPokemon(inputValue);
        if (apiResponse && !pokemonNames.includes(inputValue)) {
            pokemonNames.push(inputValue);
            inputValue = 'Success';
        }
        else if (pokemonNames.includes(inputValue)) {
            alert('Pokemon bereits vorhanden.');
        }
        else {
            alert('Bitte gib ein gültiges Pokemon ein.');
        }
        savePokemonNames();
        init();
    }
    else {
        alert('Bitte Pokemon eingeben');
    }
}

document.addEventListener('click', function (event) {
    let pokedex = document.getElementById('pokedex');
    if (!pokedex) return;
    if (pokedex.contains(event.target)) return;
    renderPokedex();
});