const API_URL = "https://pokeapi.co/api/v2";

const typeMap = {
  normal: "Normal",
  fire: "Fogo",
  water: "Água",
  electric: "Elétrico",
  grass: "Planta",
  ice: "Gelo",
  fighting: "Lutador",
  poison: "Veneno",
  ground: "Terra",
  flying: "Voador",
  psychic: "Psiquico",
  bug: "Inseto",
  rock: "Pedra",
  ghost: "Fantasma",
  dragon: "Dragão",
  dark: "Sombrio",
  steel: "Metal",
  fairy: "Fada"
};

const typeClassMap = {
  normal: "normal",
  fire: "fire",
  water: "water",
  electric: "electric",
  grass: "grass",
  psychic: "psychic",
  dragon: "dragon",
  steel: "metal"
};

function titleCase(value) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function sanitizeCollections(collections = [], pokemonName = "") {
  return [...new Set(
    (Array.isArray(collections) ? collections : [])
      .map((item) => String(item).trim())
      .filter(Boolean)
      .filter((item) => !/^\d+$/.test(item))
      .filter((item) => item !== pokemonName)
      .filter((item) => !/^Pok(?:é|e)dex\s+Oficial$/i.test(item))
      .filter((item) => item !== "Pokémon TCG")
  )];
}

function getCollectionsForPokemon(pokemonId, pokemonName, primaryType) {
  const specialCollections = {
    6: [
      "Base Set", "Jungle", "Fossil", "Team Rocket", "Gym Heroes", "Gym Challenge",
      "Wizards Black Star Promos", "EX Ruby & Sapphire", "EX Sandstorm",
      "EX Dragon Frontiers", "EX Team Magma vs Team Aqua", "EX Hidden Legends",
      "EX FireRed & LeafGreen", "Diamond & Pearl", "Mysterious Treasures",
      "Secret Wonders", "Platinum", "Legendary Collection", "Black & White",
      "Emerging Powers", "Nimbasa City", "XY", "BREAKthrough", "Sun & Moon",
      "Ultra Prism", "Celestial Storm", "Sword & Shield", "Rebel Clash",
      "Darkness Ablaze", "Vivid Voltage", "Astral Radiance", "Lost Origin",
      "Scarlet & Violet", "Paldean Foes", "Obsidian Flames"
    ],
    25: [
      "Base Set", "Jungle", "Team Rocket", "Gym Heroes", "EX Unseen Forces",
      "Legendary Collection", "Pokémon GO", "Black & White", "Sun & Moon",
      "Scarlet & Violet", "Paldean Foes", "Obsidian Flames"
    ],
    94: [
      "Base Set", "Team Rocket", "EX Ruby & Sapphire", "HeartGold & SoulSilver",
      "Platinum", "Black & White", "Sword & Shield", "Astral Radiance", "Lost Origin"
    ],
    150: [
      "Base Set", "Team Rocket", "EX Dragon Frontiers", "Legendary Collection",
      "Black & White", "Dark Explorers", "Rebel Clash", "Scarlet & Violet"
    ],
    151: [
      "Base Set", "Jungle", "Team Rocket", "Legendary Collection", "Sun & Moon",
      "Scarlet & Violet", "Paldean Foes", "Obsidian Flames"
    ],
    386: [
      "EX Ruby & Sapphire", "EX Dragon Frontiers", "Diamond & Pearl",
      "Mysterious Treasures", "Black & White", "Emerging Powers",
      "Scarlet & Violet", "Paldean Foes", "Obsidian Flames"
    ],
    493: [
      "Diamond & Pearl", "Platinum", "Legends Awakened", "Black & White",
      "Sun & Moon", "Scarlet & Violet", "Temporal Forces", "Paldean Foes"
    ],
    494: [
      "Black & White", "Dark Explorers", "Victini", "Fogo Branco", "Nimbasa City",
      "Emerging Powers", "Double Crisis"
    ],
    721: [
      "Black & White", "Nimbasa City", "XY", "Sun & Moon", "Ultra Prism",
      "Sword & Shield", "Scarlet & Violet", "Paldean Foes"
    ],
    800: [
      "Sun & Moon", "Ultra Prism", "Celestial Storm", "Sword & Shield",
      "Astral Radiance", "Lost Origin", "Scarlet & Violet"
    ],
    898: [
      "Sword & Shield", "Rebel Clash", "Darkness Ablaze", "Vivid Voltage",
      "Astral Radiance", "Lost Origin", "Scarlet & Violet", "Paldean Foes"
    ],
    1008: [
      "Scarlet & Violet", "Paldean Foes", "Obsidian Flames", "Temporal Forces",
      "Twilight Masquerade", "Shrouded Fable", "Stellar Crown"
    ],
    1025: [
      "Scarlet & Violet", "Paldean Foes", "Obsidian Flames", "Temporal Forces",
      "Twilight Masquerade", "Shrouded Fable", "Stellar Crown", "Prismatic Evolutions"
    ]
  };

  const generationMap = [
    [1, 151, [
      "Base Set", "Jungle", "Fossil", "Team Rocket", "Gym Heroes", "Gym Challenge",
      "Wizards Black Star Promos", "Legendary Collection", "EX Ruby & Sapphire",
      "EX Sandstorm", "EX Dragon Frontiers", "EX Team Magma vs Team Aqua",
      "EX Hidden Legends", "EX FireRed & LeafGreen", "Diamond & Pearl"
    ]],
    [152, 251, [
      "Neo Genesis", "Neo Discovery", "Neo Revelation", "Neo Destiny",
      "Crystal Guardians", "Power Keepers", "Legendary Collection",
      "EX Ruby & Sapphire", "EX Emerald", "Black & White"
    ]],
    [252, 386, [
      "EX Ruby & Sapphire", "EX Sandstorm", "EX Dragon Frontiers",
      "EX Team Magma vs Team Aqua", "EX Emerald", "EX Hidden Legends",
      "EX FireRed & LeafGreen", "Diamond & Pearl", "Mysterious Treasures",
      "Secret Wonders", "Platinum", "Legends Awakened"
    ]],
    [387, 493, [
      "Diamond & Pearl", "Mysterious Treasures", "Secret Wonders",
      "Great Encounters", "Platinum", "Legends Awakened", "Black & White",
      "Emerging Powers", "Nimbasa City", "Dark Explorers"
    ]],
    [494, 649, [
      "Black & White", "Emerging Powers", "Nimbasa City", "XY", "Furious Fists",
      "Dark Explorers", "Boundaries Crossed", "Double Crisis", "Roaring Skies",
      "Ancient Origins", "Sun & Moon", "Ultra Prism"
    ]],
    [650, 721, [
      "XY", "BREAKthrough", "BREAKpoint", "Sun & Moon", "Ultra Prism",
      "Celestial Storm", "Dragon Majesty", "Crimson Invasion", "Forbidden Light",
      "Sword & Shield", "Rebel Clash", "Darkness Ablaze"
    ]],
    [722, 809, [
      "Sun & Moon", "Ultra Prism", "Celestial Storm", "Dragon Majesty",
      "Crimson Invasion", "Forbidden Light", "Sword & Shield", "Rebel Clash",
      "Darkness Ablaze", "Vivid Voltage", "Astral Radiance"
    ]],
    [810, 905, [
      "Sword & Shield", "Rebel Clash", "Darkness Ablaze", "Vivid Voltage",
      "Astral Radiance", "Lost Origin", "Silver Tempest", "Crown Zenith",
      "Scarlet & Violet", "Paldean Foes", "Obsidian Flames"
    ]],
    [906, 1025, [
      "Scarlet & Violet", "Paldean Foes", "Obsidian Flames", "Temporal Forces",
      "Twilight Masquerade", "Shrouded Fable", "Stellar Crown", "Prismatic Evolutions"
    ]]
  ];

  const normalizedPokemonId = Number(pokemonId);

  if (specialCollections[normalizedPokemonId]) {
    return sanitizeCollections(specialCollections[normalizedPokemonId], pokemonName);
  }

  for (const [start, end, sets] of generationMap) {
    if (normalizedPokemonId >= start && normalizedPokemonId <= end) {
      return sanitizeCollections(sets, pokemonName);
    }
  }

  return sanitizeCollections([
    "Base Set",
    "Jungle",
    "Fossil",
    "Team Rocket",
    "Scarlet & Violet",
    "Paldean Foes",
    "Obsidian Flames",
    "Temporal Forces"
  ], pokemonName);
}

function getTypeClass(typeKey) {
  return typeClassMap[typeKey] || "normal";
}

async function loadPokemonData() {
  const listResponse = await fetch(`${API_URL}/pokemon?limit=1025`);
  const listData = await listResponse.json();

  const details = await Promise.all(
    listData.results.map(async (pokemon) => {
      const detailResponse = await fetch(pokemon.url);
      const detail = await detailResponse.json();

      const primaryType = detail.types?.[0]?.type?.name || "normal";
      const primaryTypeLabel = typeMap[primaryType] || titleCase(primaryType);

      const collections = getCollectionsForPokemon(detail.id, titleCase(detail.name), primaryType);

      return {
        id: detail.id,
        name: titleCase(detail.name),
        type: primaryTypeLabel,
        typeKey: primaryType,
        region: "Pokédex Oficial",
        favorite: false,
        captured: detail.id % 2 === 0,
        description: `Pokémon oficial da Pokédex com tipo ${primaryTypeLabel}.`,
        collections,
        hp: detail.stats?.[0]?.base_stat || 50,
        attack: detail.stats?.[1]?.base_stat || 50,
        defense: detail.stats?.[2]?.base_stat || 50,
        image: detail.sprites?.other?.["official-artwork"]?.front_default || detail.sprites?.front_default || ""
      };
    })
  );

  return details;
}

const grid = document.getElementById("pokemon-grid");
const detailPanel = document.getElementById("pokemon-detail");
const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll(".filter-btn");
const statMap = {
  total: document.getElementById("total-count"),
  captured: document.getElementById("captured-count"),
  favorite: document.getElementById("favorite-count"),
  types: document.getElementById("types-count")
};

let currentFilter = "Todos";
let currentSearch = "";
let pokemonData = [];
let selectedPokemon = null;

function getVisiblePokemon() {
  return pokemonData.filter((pokemon) => {
    const matchesType = currentFilter === "Todos" || pokemon.type === currentFilter;
    const matchesSearch = pokemon.name.toLowerCase().includes(currentSearch.toLowerCase());
    return matchesType && matchesSearch;
  });
}

function renderStats() {
  if (!pokemonData.length) {
    return;
  }

  const captured = pokemonData.filter((pokemon) => pokemon.captured).length;
  const favorite = pokemonData.filter((pokemon) => pokemon.favorite).length;
  const types = [...new Set(pokemonData.map((pokemon) => pokemon.type))].length;

  statMap.total.textContent = pokemonData.length;
  statMap.captured.textContent = captured;
  statMap.favorite.textContent = favorite;
  statMap.types.textContent = types;
}

function renderCards() {
  const visible = getVisiblePokemon();

  if (!visible.length) {
    grid.innerHTML = '<div class="pokemon-card" style="grid-column: 1 / -1; padding: 32px; text-align:center; color: var(--muted);">Nenhum Pokémon encontrado.</div>';
    return;
  }

  grid.innerHTML = visible
    .map((pokemon) => {
      const isActive = selectedPokemon && selectedPokemon.id === pokemon.id;
      const typeClass = getTypeClass(pokemon.typeKey);

      return `
        <article class="pokemon-card ${isActive ? "active" : ""}" data-id="${pokemon.id}">
          <div class="card-header">
            <span class="card-id">#${String(pokemon.id).padStart(3, "0")}</span>
            <span class="badge ${typeClass}">${pokemon.type}</span>
          </div>

          <div class="sprite-box">
            <img src="${pokemon.image}" alt="${pokemon.name}" />
          </div>

          <div class="card-meta">
            <h3>${pokemon.name}</h3>
            <p>${pokemon.region}</p>
          </div>

          <div class="card-footer">
            <span>${pokemon.captured ? "Capturado" : "Na lista"}</span>
            <span class="favorite-icon">${pokemon.favorite ? "⭐" : "☆"}</span>
          </div>
        </article>
      `;
    })
    .join("");

  grid.querySelectorAll(".pokemon-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = Number(card.dataset.id);
      const pokemon = pokemonData.find((item) => item.id === id);
      if (pokemon) {
        selectedPokemon = pokemon;
        renderCards();
        renderDetail();
      }
    });
  });
}

function renderDetail() {
  if (!selectedPokemon) {
    detailPanel.innerHTML = "<p>Selecione um Pokémon para ver mais detalhes.</p>";
    return;
  }

  const { name, type, typeKey, id, region, description, collections = [], hp, attack, defense, image, favorite, captured } = selectedPokemon;
  const typeClass = getTypeClass(typeKey);
  const collectionList = Array.isArray(collections) && collections.length
    ? collections
    : getCollectionsForPokemon(id, name, typeKey);

  const safeCollections = sanitizeCollections(collectionList, name);

  detailPanel.innerHTML = `
    <div class="detail-top">
      <div>
        <span class="card-id">#${String(id).padStart(3, "0")}</span>
        <h3>${name}</h3>
      </div>
      <span class="favorite-icon">${favorite ? "⭐" : "☆"}</span>
    </div>

    <div class="detail-photo">
      <img src="${image}" alt="${name}" />
    </div>

    <div class="detail-meta">
      <span class="badge ${typeClass}">${type}</span>
      <span class="badge" style="background: rgba(255,255,255,0.04); color: #dfe7ff;">${region}</span>
      <span class="badge" style="background: ${captured ? 'rgba(78, 205, 196, 0.2)' : 'rgba(255, 107, 107, 0.18)'}; color: ${captured ? '#7feae3' : '#ff8a8a'};">${captured ? 'Capturado' : 'Disponível'}</span>
    </div>

    <p class="detail-para">${description}</p>

    <div class="collections-box">
      <h4>Coleções</h4>
      <ul>
        ${safeCollections.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    </div>

    <div class="stats">
      <div class="stat-row">
        <span>HP</span>
        <div class="bar"><div class="fill" style="width: ${Math.min(hp, 180)}%"></div></div>
        <strong>${hp}</strong>
      </div>
      <div class="stat-row">
        <span>ATK</span>
        <div class="bar"><div class="fill" style="width: ${Math.min(attack, 180)}%"></div></div>
        <strong>${attack}</strong>
      </div>
      <div class="stat-row">
        <span>DEF</span>
        <div class="bar"><div class="fill" style="width: ${Math.min(defense, 180)}%"></div></div>
        <strong>${defense}</strong>
      </div>
    </div>
  `;
}

searchInput.addEventListener("input", (event) => {
  currentSearch = event.target.value.trim();
  renderCards();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.type;

    filterButtons.forEach((btn) => btn.classList.toggle("active", btn === button));
    renderCards();
  });
});

function focusSearch() {
  searchInput.focus();
  searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
}

async function init() {
  grid.innerHTML = '<div class="pokemon-card" style="grid-column: 1 / -1; padding: 32px; text-align:center; color: var(--muted);">Carregando 1.025 Pokémon...</div>';

  pokemonData = await loadPokemonData();
  selectedPokemon = pokemonData[0];

  renderStats();
  renderCards();
  renderDetail();
}

init();
