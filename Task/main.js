const POKEAPI_BASE = 'https://pokeapi.co/api/v2/pokemon';
const POKEMON_LIMIT = 493;
let allPokemonData = []; // Store full details here

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    const loadingOverlay = document.getElementById('loading-overlay');
    try {
        // 1. Fetch List of 151
        const listResponse = await fetch(`${POKEAPI_BASE}?limit=${POKEMON_LIMIT}`);
        if (!listResponse.ok) throw new Error('Network response was not ok');
        const listData = await listResponse.json();
        const urls = listData.results.map(p => p.url);

        // 2. Fetch Details for ALL 151 in parallel
        // Note: Promise.all might fail if one fails, but for 151 items it's usually stable enough for a demo.
        const detailPromises = urls.map(url => fetch(url).then(res => res.json()));
        allPokemonData = await Promise.all(detailPromises);

        // 3. Initial Render (Sorted by ID by default)
        renderPokemonList(allPokemonData);

        // 4. Setup Sorting
        document.getElementById('sort-select').addEventListener('change', (e) => {
            sortPokemonList(e.target.value);
        });

        loadingOverlay.style.opacity = '0';
        setTimeout(() => loadingOverlay.remove(), 500);

    } catch (error) {
        console.error('Failed to initialize app', error);
        loadingOverlay.innerHTML = '<p>Error loading data. Please refresh.</p>';
    }
}

function getStatValue(pokemon, statName) {
    if (statName === 'id') return pokemon.id;
    const statObj = pokemon.stats.find(s => s.stat.name === statName);
    return statObj ? statObj.base_stat : 0;
}

function sortPokemonList(criteria) {
    const listElement = document.getElementById('pokemon-list');
    listElement.innerHTML = ''; // Clear current list

    // Sort in place
    allPokemonData.sort((a, b) => {
        const valA = getStatValue(a, criteria);
        const valB = getStatValue(b, criteria);

        // ID is ascending, Stats are descending (highest first)
        if (criteria === 'id') {
            return valA - valB;
        } else {
            return valB - valA;
        }
    });

    renderPokemonList(allPokemonData);
}

function renderPokemonList(pokemonList) {
    const listElement = document.getElementById('pokemon-list');
    listElement.innerHTML = ''; // Clear for re-render

    // Create a DocumentFragment for performance
    const fragment = document.createDocumentFragment();

    pokemonList.forEach((pokemon) => {
        const id = pokemon.id;
        const paddedId = String(id).padStart(3, '0');

        const li = document.createElement('li');
        li.className = 'pokemon-item';
        // We already have the full object, so we pass it directly or use ID to find it
        li.dataset.id = id;

        // Maybe show the stat value in the list if sorted by stat?
        // keeping it simple for now matching design
        li.innerHTML = `
            <span class="pokemon-name">${pokemon.name}</span>
            <span class="pokemon-id">#${paddedId}</span>
        `;

        li.addEventListener('click', () => handlePokemonClick(li, pokemon));
        fragment.appendChild(li);
    });

    listElement.appendChild(fragment);
}

function handlePokemonClick(element, data) {
    // UI Updates
    document.querySelectorAll('.pokemon-item').forEach(el => el.classList.remove('active'));
    element.classList.add('active');

    renderPokemonDetails(data);
}

function renderPokemonDetails(data) {
    const content = document.getElementById('details-content');
    const initialMsg = document.getElementById('initial-message');

    if (initialMsg) initialMsg.style.display = 'none';
    content.classList.remove('hidden');

    // Update Name and Image
    document.getElementById('pokemon-name').textContent = data.name;
    const imageUrl = data.sprites.other['official-artwork'].front_default || data.sprites.front_default;
    document.getElementById('pokemon-img').src = imageUrl;
    document.getElementById('pokemon-img').alt = data.name;

    // Render Stats
    const statsChart = document.getElementById('stats-chart');
    statsChart.innerHTML = ''; // Clear previous

    data.stats.forEach(stat => {
        const statName = stat.stat.name.replace('-', ' ');
        const statValue = stat.base_stat;
        const maxStat = 200;
        const percentage = Math.min((statValue / maxStat) * 100, 100);

        const row = document.createElement('div');
        row.className = 'stat-row';
        row.innerHTML = `
            <div class="stat-label">${statName}</div>
            <div class="stat-bar-bg">
                <div class="stat-bar-fill" style="width: 0%"></div>
            </div>
            <div class="stat-value">${statValue}</div>
        `;

        statsChart.appendChild(row);

        // Trigger animation after append
        setTimeout(() => {
            row.querySelector('.stat-bar-fill').style.width = `${percentage}%`;
        }, 50);
    });
}
