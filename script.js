let pokemonNames = ['bulbasaur', 'ivysaur', 'charizard', 'squirtle', 'charmander'];
let currentPokemon;
let baseStats = [];
let narrowBars = [];
let totalStat = 0;

async function init() {
    await loadPokemon();
    renderPokemonInfo();
    renderPokemonImg();
    renderAbilities();
}

async function loadPokemon() {
    try {
        let url = 'https://pokeapi.co/api/v2/pokemon/ivysaur';
        let response = await fetch(url);
        currentPokemon = await response.json();
    }
    catch (error) {
        console.error('This error occured by:', error);
    }
}

function renderPokemonInfo() {
    let pokemonName = currentPokemon.name;
    pokemonName = capitalizeFirstLetter(pokemonName);
    document.getElementById('pokemonName').innerHTML = `${pokemonName}`;
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
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
    let statsTotal = 0;
    for (let i = 0; i < 5; i++) {
        statsTotal += baseStats[i];
    }
    totalStat = statsTotal;
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
    console.log(totalStatPercentage);
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
                <td class="stat-number">${currentPokemon.abilities[0].ability.name}, ${currentPokemon.abilities[1].ability.name}</td>
               </tr>
        </table>
    </div>
    `;
}


function renderBaseStatsHTML() {
    let container = document.getElementById('content');
    container.innerHTML =  /*html*/`
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
    `
}