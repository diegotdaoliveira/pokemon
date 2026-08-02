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

const worldCollections = [
  "Base Set",
  "Jungle",
  "Fossil",
  "Team Rocket",
  "Gym Heroes",
  "Gym Challenge",
  "Wizards Black Star Promos",
  "Neo Genesis",
  "Neo Discovery",
  "Neo Revelation",
  "Neo Destiny",
  "Crystal Guardians",
  "Power Keepers",
  "EX Ruby & Sapphire",
  "EX Sandstorm",
  "EX Dragon Frontiers",
  "EX Team Magma vs Team Aqua",
  "EX Hidden Legends",
  "EX FireRed & LeafGreen",
  "EX Emerald",
  "EX Unseen Forces",
  "Diamond & Pearl",
  "Mysterious Treasures",
  "Secret Wonders",
  "Great Encounters",
  "Legends Awakened",
  "Platinum",
  "Rising Rivals",
  "Supreme Victors",
  "Arceus",
  "Black & White",
  "Emerging Powers",
  "Nimbasa City",
  "Dragon Vault",
  "Boundaries Crossed",
  "Plasma Storm",
  "Plasma Freeze",
  "Plasma Blast",
  "Legendary Treasures",
  "XY",
  "Kalos Starter Set",
  "BREAKthrough",
  "BREAKpoint",
  "Fates Collide",
  "Steam Siege",
  "Guardians Rising",
  "Burning Shadows",
  "Crimson Invasion",
  "Ultra Prism",
  "Celestial Storm",
  "Dragon Majesty",
  "Forbidden Light",
  "Sun & Moon",
  "Unbroken Bonds",
  "Team Up",
  "Lost Thunder",
  "Mysterious Mountains",
  "Sword & Shield",
  "Rebel Clash",
  "Darkness Ablaze",
  "Vivid Voltage",
  "Astral Radiance",
  "Lost Origin",
  "Silver Tempest",
  "Crown Zenith",
  "Scarlet & Violet",
  "Paldean Foes",
  "Obsidian Flames",
  "Temporal Forces",
  "Twilight Masquerade",
  "Shrouded Fable",
  "Stellar Crown",
  "Prismatic Evolutions",
  "Pokemon GO",
  "Celebrations",
  "Pokemon Center Promo",
  "Southern Islands",
  "Raging Surf",
  "Detective Pikachu",
  "Hidden Fates",
  "Evolving Skies"
];

function titleCase(value) {
  return String(value)
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function sanitizeCollections(collections = [], pokemonName = "") {
  const blockList = new Set([
    "Pokémon TCG",
    "Pokédex Oficial",
    "Kanto",
    "Johto",
    "Hoenn",
    "Sinnoh",
    "Unova",
    "Kalos",
    "Alola",
    "Galar",
    "Paldea"
  ]);

  return [...new Set(
    (Array.isArray(collections) ? collections : [])
      .map((item) => String(item).trim())
      .filter(Boolean)
      .filter((item) => !/^\d+$/.test(item))
      .filter((item) => item !== pokemonName)
      .filter((item) => !/^Pok(?:é|e)dex\s+Oficial$/i.test(item))
      .filter((item) => !blockList.has(item))
  )];
}

function getCollectionsForPokemon(pokemonId, pokemonName) {
  const specialCollections = {
    6: ["Base Set", "Jungle", "Fossil", "Team Rocket", "Gym Heroes", "Gym Challenge", "Wizards Black Star Promos", "EX Ruby & Sapphire", "EX Sandstorm", "EX Dragon Frontiers", "EX Team Magma vs Team Aqua", "EX Hidden Legends", "EX FireRed & LeafGreen", "Diamond & Pearl", "Mysterious Treasures", "Secret Wonders", "Platinum", "Legendary Collection", "Black & White", "Emerging Powers", "Nimbasa City", "XY", "BREAKthrough", "Sun & Moon", "Ultra Prism", "Celestial Storm", "Sword & Shield", "Rebel Clash", "Darkness Ablaze", "Vivid Voltage", "Astral Radiance", "Lost Origin", "Scarlet & Violet", "Paldean Foes", "Obsidian Flames"],
    25: ["Base Set", "Jungle", "Team Rocket", "Gym Heroes", "EX Unseen Forces", "Legendary Collection", "Pokémon GO", "Black & White", "Sun & Moon", "Scarlet & Violet", "Paldean Foes", "Obsidian Flames"],
    94: ["Base Set", "Team Rocket", "EX Ruby & Sapphire", "HeartGold & SoulSilver", "Platinum", "Black & White", "Sword & Shield", "Astral Radiance", "Lost Origin"],
    150: ["Base Set", "Team Rocket", "EX Dragon Frontiers", "Legendary Collection", "Black & White", "Dark Explorers", "Rebel Clash", "Scarlet & Violet"],
    151: ["Base Set", "Jungle", "Team Rocket", "Legendary Collection", "Sun & Moon", "Scarlet & Violet", "Paldean Foes", "Obsidian Flames"],
    386: ["EX Ruby & Sapphire", "EX Dragon Frontiers", "Diamond & Pearl", "Mysterious Treasures", "Black & White", "Emerging Powers", "Scarlet & Violet", "Paldean Foes", "Obsidian Flames"],
    493: ["Diamond & Pearl", "Platinum", "Legends Awakened", "Black & White", "Sun & Moon", "Scarlet & Violet", "Temporal Forces", "Paldean Foes"],
    494: ["Black & White", "Dark Explorers", "Victini", "Fogo Branco", "Nimbasa City", "Emerging Powers", "Double Crisis"],
    721: ["Black & White", "Nimbasa City", "XY", "Sun & Moon", "Ultra Prism", "Sword & Shield", "Scarlet & Violet", "Paldean Foes"],
    800: ["Sun & Moon", "Ultra Prism", "Celestial Storm", "Sword & Shield", "Astral Radiance", "Lost Origin", "Scarlet & Violet"],
    898: ["Sword & Shield", "Rebel Clash", "Darkness Ablaze", "Vivid Voltage", "Astral Radiance", "Lost Origin", "Scarlet & Violet", "Paldean Foes"],
    1008: ["Scarlet & Violet", "Paldean Foes", "Obsidian Flames", "Temporal Forces", "Twilight Masquerade", "Shrouded Fable", "Stellar Crown"],
    1025: ["Scarlet & Violet", "Paldean Foes", "Obsidian Flames", "Temporal Forces", "Twilight Masquerade", "Shrouded Fable", "Stellar Crown", "Prismatic Evolutions"]
  };

  const generationMap = [
    [1, 151, ["Base Set", "Jungle", "Fossil", "Team Rocket", "Gym Heroes", "Gym Challenge", "Wizards Black Star Promos", "Legendary Collection", "EX Ruby & Sapphire", "EX Sandstorm", "EX Dragon Frontiers", "EX Team Magma vs Team Aqua", "EX Hidden Legends", "EX FireRed & LeafGreen", "Diamond & Pearl"]],
    [152, 251, ["Neo Genesis", "Neo Discovery", "Neo Revelation", "Neo Destiny", "Crystal Guardians", "Power Keepers", "Legendary Collection", "EX Ruby & Sapphire", "EX Emerald", "Black & White"]],
    [252, 386, ["EX Ruby & Sapphire", "EX Sandstorm", "EX Dragon Frontiers", "EX Team Magma vs Team Aqua", "EX Emerald", "EX Hidden Legends", "EX FireRed & LeafGreen", "Diamond & Pearl", "Mysterious Treasures", "Secret Wonders", "Platinum", "Legends Awakened"]],
    [387, 493, ["Diamond & Pearl", "Mysterious Treasures", "Secret Wonders", "Great Encounters", "Platinum", "Legends Awakened", "Black & White", "Emerging Powers", "Nimbasa City", "Dark Explorers"]],
    [494, 649, ["Black & White", "Emerging Powers", "Nimbasa City", "XY", "Furious Fists", "Dark Explorers", "Boundaries Crossed", "Double Crisis", "Roaring Skies", "Ancient Origins", "Sun & Moon", "Ultra Prism"]],
    [650, 721, ["XY", "BREAKthrough", "BREAKpoint", "Sun & Moon", "Ultra Prism", "Celestial Storm", "Dragon Majesty", "Crimson Invasion", "Forbidden Light", "Sword & Shield", "Rebel Clash", "Darkness Ablaze"]],
    [722, 809, ["Sun & Moon", "Ultra Prism", "Celestial Storm", "Dragon Majesty", "Crimson Invasion", "Forbidden Light", "Sword & Shield", "Rebel Clash", "Darkness Ablaze", "Vivid Voltage", "Astral Radiance"]],
    [810, 905, ["Sword & Shield", "Rebel Clash", "Darkness Ablaze", "Vivid Voltage", "Astral Radiance", "Lost Origin", "Silver Tempest", "Crown Zenith", "Scarlet & Violet", "Paldean Foes", "Obsidian Flames"]],
    [906, 1025, ["Scarlet & Violet", "Paldean Foes", "Obsidian Flames", "Temporal Forces", "Twilight Masquerade", "Shrouded Fable", "Stellar Crown", "Prismatic Evolutions"]]
  ];

  const id = Number(pokemonId);
  const name = String(pokemonName || "").trim();

  if (specialCollections[id]) {
    return sanitizeCollections(specialCollections[id], name);
  }

  for (const [start, end, sets] of generationMap) {
    if (id >= start && id <= end) {
      return sanitizeCollections(sets, name);
    }
  }

  return sanitizeCollections(["Base Set", "Jungle", "Fossil", "Team Rocket", "Scarlet & Violet", "Paldean Foes", "Obsidian Flames", "Temporal Forces"], name);
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
      const typeLabel = typeMap[primaryType] || titleCase(primaryType);
      const collections = getCollectionsForPokemon(detail.id, titleCase(detail.name));

      return {
        id: detail.id,
        name: titleCase(detail.name),
        type: typeLabel,
        typeKey: primaryType,
        region: "Pokédex Oficial",
        favorite: false,
        captured: detail.id % 2 === 0,
        description: `Pokémon oficial da Pokédex com tipo ${typeLabel}.`,
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
const libraryList = document.querySelector(".library-list");
const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll(".filter-btn");
const tabButtons = document.querySelectorAll(".tab-btn");
const statMap = {
  total: document.getElementById("total-count"),
  captured: document.getElementById("captured-count"),
  favorite: document.getElementById("favorite-count"),
  types: document.getElementById("types-count")
};

const state = {
  currentTab: "all",
  currentFilter: "Todos",
  currentSearch: "",
  pokemonData: [],
  selectedPokemon: null,
  selectedCollection: null,
  selectedCollectionCard: null
};

function getSetCardTotal(setName) {
  const knownTotals = {
    "Base Set": 102,
    "Jungle": 64,
    "Fossil": 62,
    "Team Rocket": 82,
    "Gym Heroes": 33,
    "Gym Challenge": 32,
    "Wizards Black Star Promos": 53,
    "Neo Genesis": 111,
    "Neo Discovery": 75,
    "Neo Revelation": 72,
    "Neo Destiny": 113,
    "Crystal Guardians": 100,
    "Power Keepers": 108,
    "EX Ruby & Sapphire": 109,
    "EX Sandstorm": 100,
    "EX Dragon Frontiers": 101,
    "EX Team Magma vs Team Aqua": 95,
    "EX Hidden Legends": 101,
    "EX FireRed & LeafGreen": 112,
    "EX Emerald": 106,
    "EX Unseen Forces": 145,
    "Diamond & Pearl": 130,
    "Mysterious Treasures": 123,
    "Secret Wonders": 132,
    "Great Encounters": 106,
    "Legends Awakened": 146,
    "Platinum": 127,
    "Rising Rivals": 90,
    "Supreme Victors": 147,
    "Arceus": 99,
    "Black & White": 114,
    "Emerging Powers": 98,
    "Nimbasa City": 106,
    "Dragon Vault": 110,
    "Boundaries Crossed": 149,
    "Plasma Storm": 135,
    "Plasma Freeze": 119,
    "Plasma Blast": 101,
    "Legendary Treasures": 113,
    "XY": 146,
    "Kalos Starter Set": 39,
    "BREAKthrough": 162,
    "BREAKpoint": 122,
    "Fates Collide": 124,
    "Steam Siege": 116,
    "Guardians Rising": 145,
    "Burning Shadows": 147,
    "Crimson Invasion": 111,
    "Ultra Prism": 156,
    "Celestial Storm": 168,
    "Dragon Majesty": 89,
    "Forbidden Light": 123,
    "Sun & Moon": 149,
    "Unbroken Bonds": 214,
    "Team Up": 181,
    "Lost Thunder": 123,
    "Mysterious Mountains": 94,
    "Sword & Shield": 202,
    "Rebel Clash": 192,
    "Darkness Ablaze": 189,
    "Vivid Voltage": 203,
    "Astral Radiance": 189,
    "Lost Origin": 195,
    "Silver Tempest": 195,
    "Crown Zenith": 159,
    "Scarlet & Violet": 198,
    "Paldean Foes": 182,
    "Obsidian Flames": 180,
    "Temporal Forces": 191,
    "Twilight Masquerade": 245,
    "Shrouded Fable": 197,
    "Stellar Crown": 250,
    "Prismatic Evolutions": 100,
    "Pokémon GO": 83,
    "Celebrations": 98,
    "Pokemon Center Promo": 45,
    "Southern Islands": 18,
    "Raging Surf": 35,
    "Detective Pikachu": 18,
    "Hidden Fates": 68,
    "Evolving Skies": 183
  };

  return knownTotals[setName] || 102;
}

function buildSetCards(setName, totalCards = null) {
  const actualTotal = totalCards ?? getSetCardTotal(setName);

  if (setName === "Base Set") {
    const pokemonNames = [
      "Bulbasaur","Ivysaur","Venusaur","Charmander","Charmeleon","Charizard","Squirtle","Wartortle","Blastoise","Caterpie","Metapod","Butterfree","Weedle","Kakuna","Beedrill","Pidgey","Pidgeotto","Pidgeot","Rattata","Raticate","Spearow","Fearow","Ekans","Arbok","Pikachu","Raichu","Sandshrew","Sandslash","Nidoran♀","Nidorina","Nidoqueen","Nidoran♂","Nidorino","Nidoking","Clefairy","Clefable","Vulpix","Ninetales","Jigglypuff","Wigglytuff","Zubat","Golbat","Oddish","Gloom","Vileplume","Paras","Parasect","Venonat","Venomoth","Diglett","Dugtrio","Meowth","Persian","Psyduck","Golduck","Mankey","Primeape","Growlithe","Arcanine","Poliwag","Poliwhirl","Poliwrath","Abra","Kadabra","Alakazam","Machop","Machoke","Machamp" 
    ];

    const trainerNames = [
      "Professor Oak","Bill","Misty","Lt. Surge","Erika","Brock","Sabrina","Blaine","Giovanni","Impostor Professor Oak","Computer Search","Item Finder","Lure","Potion","Switch","Super Potion","Defender","Energy Retrieval","Full Heal","Revive","Potion","Energy Removal","Gust of Wind","Pokémon Breeder"
    ];

    const energyNames = [
      "Grass Energy","Fire Energy","Water Energy","Lightning Energy","Psychic Energy","Fighting Energy","Double Colorless Energy","Nightmare Energy"
    ];

    const totalPokemon = 69;
    const totalTrainer = 25;
    const totalEnergy = 8;

    return Array.from({ length: actualTotal }, (_, index) => {
      const numberValue = index + 1;
      const number = `${String(numberValue).padStart(3, "0")}/${String(actualTotal).padStart(3, "0")}`;

      let name = "";
      let supertype = "Pokémon";
      let rarity = "Common";
      let art = "Carta Pokémon";

      if (numberValue <= totalPokemon) {
        name = pokemonNames[numberValue - 1];
        rarity = ["Common", "Uncommon", "Rare", "Holo Rare"][numberValue % 4] || "Common";
      } else if (numberValue <= totalPokemon + totalTrainer) {
        name = trainerNames[numberValue - totalPokemon - 1];
        supertype = "Trainer";
        rarity = "Uncommon";
        art = "Carta de Treinador";
      } else {
        name = energyNames[numberValue - totalPokemon - totalTrainer - 1];
        supertype = "Energy";
        rarity = "Common";
        art = "Carta de Energia";
      }

      const image = `https://images.pokemontcg.io/base1/${numberValue}.png`;

      return {
        id: `${setName}-${numberValue}`,
        number,
        name,
        rarity,
        art,
        set: setName,
        foil: rarity.toLowerCase().includes("rare") ? "Prismático" : "Normal",
        image,
        supertype,
        total: actualTotal
      };
    });
  }

  const baseNames = [
    "Pikachu",
    "Charizard",
    "Bulbasaur",
    "Squirtle",
    "Mew",
    "Snorlax",
    "Gyarados",
    "Venasaur",
    "Raichu",
    "Lapras",
    "Jolteon",
    "Flareon",
    "Dragonite",
    "Articuno",
    "Zapdos",
    "Moltres",
    "Meowth",
    "Abra",
    "Alakazam",
    "Machamp",
    "Gengar",
    "Psyduck",
    "Tauros",
    "Ditto",
    "Pidgeot",
    "Nidoking"
  ];

  const rarities = ["Common", "Uncommon", "Holo Rare", "Reverse Holo", "Ultra Rare", "Secret Rare"];

  return Array.from({ length: actualTotal }, (_, index) => {
    const numberValue = index + 1;
    const number = `${String(numberValue).padStart(3, "0")}/${String(actualTotal).padStart(3, "0")}`;
    const pokemonName = baseNames[index % baseNames.length];
    const rarity = rarities[index % rarities.length];
    const isSecret = rarity === "Secret Rare" || index % 11 === 0 || index === actualTotal - 1;

    return {
      id: `${setName}-${numberValue}`,
      number,
      name: pokemonName,
      rarity: isSecret ? "Secret Rare" : rarity,
      art: isSecret ? "Arte secreta" : "Arte normal",
      set: setName,
      foil: isSecret ? "Prismático" : "Normal",
      image: "",
      supertype: "Pokémon",
      total: actualTotal
    };
  });
}

const collectionIds = {
  "Base Set": "base1",
  "Jungle": "base2",
  "Fossil": "base3",
  "Team Rocket": "base4",
  "Gym Heroes": "gym1",
  "Gym Challenge": "gym2",
  "Wizards Black Star Promos": "base5",
  "EX Ruby & Sapphire": "ex3",
  "EX Sandstorm": "ex4",
  "EX Dragon Frontiers": "ex5",
  "EX Team Magma vs Team Aqua": "ex6",
  "EX Hidden Legends": "ex8",
  "EX FireRed & LeafGreen": "ex9",
  "EX Emerald": "ex10",
  "EX Unseen Forces": "ex11",
  "Diamond & Pearl": "dp1",
  "Mysterious Treasures": "dp2",
  "Secret Wonders": "dp3",
  "Great Encounters": "dp4",
  "Legends Awakened": "dp5",
  "Platinum": "pl1",
  "Rising Rivals": "pl2",
  "Supreme Victors": "pl3",
  "Arceus": "pl4",
  "Black & White": "bw1",
  "Emerging Powers": "bw2",
  "Nimbasa City": "bw3",
  "Dragon Vault": "bw4",
  "Boundaries Crossed": "bw5",
  "Plasma Storm": "bw6",
  "Plasma Freeze": "bw7",
  "Plasma Blast": "bw8",
  "Legendary Treasures": "bw9",
  "XY": "xy1",
  "Kalos Starter Set": "xy0",
  "BREAKthrough": "xy2",
  "BREAKpoint": "xy3",
  "Fates Collide": "xy4",
  "Steam Siege": "xy5",
  "Guardians Rising": "xy6",
  "Burning Shadows": "xy7",
  "Crimson Invasion": "xy8",
  "Ultra Prism": "sm1",
  "Celestial Storm": "sm2",
  "Dragon Majesty": "sm3",
  "Forbidden Light": "sm4",
  "Sun & Moon": "sm5",
  "Unbroken Bonds": "sm6",
  "Team Up": "sm7",
  "Lost Thunder": "sm8",
  "Mysterious Mountains": "sm9",
  "Sword & Shield": "swsh1",
  "Rebel Clash": "swsh2",
  "Darkness Ablaze": "swsh3",
  "Vivid Voltage": "swsh4",
  "Astral Radiance": "swsh5",
  "Lost Origin": "swsh6",
  "Silver Tempest": "swsh7",
  "Crown Zenith": "swsh8",
  "Scarlet & Violet": "sv1",
  "Paldean Foes": "sv2",
  "Obsidian Flames": "sv3",
  "Temporal Forces": "sv4",
  "Twilight Masquerade": "sv5",
  "Shrouded Fable": "sv6",
  "Stellar Crown": "sv7",
  "Prismatic Evolutions": "sv8",
  "Pokemon GO": "pgo",
  "Celebrations": "cel25",
  "Hidden Fates": "swsh10",
  "Evolving Skies": "swsh12"
};

const collectionCatalog = {};

async function fetchSetCards(setName) {
  if (collectionCatalog[setName]) {
    return collectionCatalog[setName];
  }

  const setId = collectionIds[setName];
  if (!setId) {
    const fallbackCards = buildSetCards(setName, getSetCardTotal(setName));
    collectionCatalog[setName] = fallbackCards;
    return fallbackCards;
  }

  try {
    if (setName === "Base Set") {
      const cards = buildSetCards(setName, 102);
      collectionCatalog[setName] = cards;
      return cards;
    }

    const response = await fetch(`https://api.pokemontcg.io/v2/cards?q=set.id:${setId}&pageSize=200`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const payload = await response.json();
    const cards = (payload.data || []).map((card) => {
      const total = Number(card.set?.total) || Number(card.number?.split('/')[1]) || 102;
      const rawNumber = String(card.number || '1');
      const formattedNumber = rawNumber.includes('/') ? rawNumber : `${rawNumber}/${total}`;
      const supertype = card.supertype || 'Pokémon';

      return {
        id: card.id,
        number: formattedNumber,
        name: card.name,
        rarity: card.rarity || 'Common',
        art: supertype === 'Pokémon'
          ? 'Carta Pokémon'
          : supertype === 'Trainer'
            ? 'Carta de Treinador'
            : 'Carta de Energia',
        set: setName,
        foil: card.rarity && String(card.rarity).toLowerCase().includes('rare') ? 'Prismático' : 'Normal',
        image: card.images?.small || '',
        supertype,
        total
      };
    });

    collectionCatalog[setName] = cards;
    return cards;
  } catch (error) {
    const fallbackCards = buildSetCards(setName, getSetCardTotal(setName));
    collectionCatalog[setName] = fallbackCards;
    return fallbackCards;
  }
}

function getVisiblePokemon() {
  const source = state.currentTab === "library"
    ? state.pokemonData.filter((pokemon) => pokemon.favorite)
    : state.pokemonData;

  return source.filter((pokemon) => {
    const matchesType = state.currentFilter === "Todos" || pokemon.type === state.currentFilter;
    const matchesSearch = pokemon.name.toLowerCase().includes(state.currentSearch.toLowerCase());
    return matchesType && matchesSearch;
  });
}

function getVisibleCollections() {
  return worldCollections.filter((collection) =>
    collection.toLowerCase().includes(state.currentSearch.toLowerCase())
  );
}

function renderStats() {
  const captured = state.pokemonData.filter((pokemon) => pokemon.captured).length;
  const favorite = state.pokemonData.filter((pokemon) => pokemon.favorite).length;
  const types = [...new Set(state.pokemonData.map((pokemon) => pokemon.type))].length;

  statMap.total.textContent = state.pokemonData.length;
  statMap.captured.textContent = captured;
  statMap.favorite.textContent = favorite;
  statMap.types.textContent = types;
}

function toggleFavoritePokemon(pokemonId) {
  const pokemon = state.pokemonData.find((item) => item.id === pokemonId);
  if (!pokemon) return;

  pokemon.favorite = !pokemon.favorite;
  pokemon.captured = pokemon.favorite || pokemon.captured;

  if (state.selectedPokemon && state.selectedPokemon.id === pokemonId) {
    state.selectedPokemon = pokemon;
  }

  renderStats();
  renderCards();
  renderDetail();
}

function renderCards() {
  if (state.currentTab === "sets") {
    if (state.selectedCollection) {
      const cards = collectionCatalog[state.selectedCollection] || [];

      grid.innerHTML = `
        <div class="set-detail-header" style="grid-column: 1 / -1; margin-bottom: 8px;">
          <button class="secondary-btn" data-action="back-to-sets">← Voltar</button>
          <div>
            <p class="tag" style="margin: 0 0 8px;">Coleção selecionada</p>
            <h3 style="margin: 0; font-size: clamp(1.5rem, 2vw, 2.3rem);">${state.selectedCollection}</h3>
          </div>
        </div>
        ${cards.map((card) => `
          <article class="pokemon-card set-card-detail" data-card-id="${card.id}">
            <div class="card-header">
              <span class="card-id">#${card.number}</span>
              <span class="badge normal">${card.rarity}</span>
            </div>

            <div class="sprite-box set-box">
              ${card.image ? `<img src="${card.image}" alt="${card.name}" />` : '<span class="set-icon">✨</span>'}
            </div>

            <div class="card-meta">
              <h3>${card.name}</h3>
              <p>${card.art}</p>
            </div>

            <div class="card-footer">
              <span>${card.foil}</span>
            </div>
          </article>
        `).join("")}
      `;

      const backButton = grid.querySelector('[data-action="back-to-sets"]');
      if (backButton) {
        backButton.addEventListener("click", () => {
          state.selectedCollection = null;
          state.selectedCollectionCard = null;
          renderCards();
          renderDetail();
        });
      }

      renderDetail();
      return;
    }

    const visibleSets = getVisibleCollections();

    if (!visibleSets.length) {
      grid.innerHTML = '<div class="pokemon-card" style="grid-column: 1 / -1; padding: 32px; text-align:center; color: var(--muted);">Nenhuma coleção encontrada.</div>';
      state.selectedPokemon = null;
      renderDetail();
      return;
    }

    grid.innerHTML = visibleSets.map((setName, index) => {
      const isActive = state.selectedPokemon && state.selectedPokemon.name === setName;

      return `
        <article class="pokemon-card set-card ${isActive ? "active" : ""}" data-set-name="${setName}">
          <div class="card-header">
            <span class="card-id">#${String(index + 1).padStart(3, "0")}</span>
            <span class="badge normal">TCG</span>
          </div>

          <div class="sprite-box set-box">
            <span class="set-icon">🃏</span>
          </div>

          <div class="card-meta">
            <h3>${setName}</h3>
            <p>Coleção mundial de cartas Pokémon</p>
          </div>

          <div class="card-footer">
            <span>Catalogada</span>
          </div>
        </article>
      `;
    }).join("");

    grid.querySelectorAll(".pokemon-card").forEach((card) => {
      card.addEventListener("click", async () => {
        const setName = card.dataset.setName;
        if (!setName) return;

        state.selectedCollection = setName;
        state.selectedCollectionCard = null;
        state.selectedPokemon = {
          id: worldCollections.indexOf(setName) + 1,
          name: setName,
          type: "Coleção",
          typeKey: "normal",
          region: "Mundo",
          description: `Coleção oficial de cartas Pokémon do universo TCG com destaque em ${setName}.`,
          favorite: false,
          captured: false,
          hp: 100,
          attack: 100,
          defense: 100,
          image: ""
        };

        await fetchSetCards(setName);
        renderCards();
        renderDetail();
      });
    });

    renderDetail();
    return;
  }

  const visible = getVisiblePokemon();

  if (state.selectedPokemon && !visible.some((pokemon) => pokemon.id === state.selectedPokemon.id)) {
    state.selectedPokemon = visible[0] || null;
  }

  if (!visible.length) {
    grid.innerHTML = '<div class="pokemon-card" style="grid-column: 1 / -1; padding: 32px; text-align:center; color: var(--muted);">Nenhum Pokémon encontrado.</div>';
    renderDetail();
    return;
  }

  grid.innerHTML = visible.map((pokemon) => {
    const isActive = state.selectedPokemon && state.selectedPokemon.id === pokemon.id;
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
          <button class="star-button ${pokemon.favorite ? "active" : ""}" data-star-id="${pokemon.id}" aria-label="Adicionar à minha biblioteca">
            ${pokemon.favorite ? "⭐" : "☆"}
          </button>
        </div>
      </article>
    `;
  }).join("");

  grid.querySelectorAll(".pokemon-card").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest(".star-button")) return;

      const id = Number(card.dataset.id);
      const pokemon = state.pokemonData.find((item) => item.id === id);
      if (pokemon) {
        state.selectedPokemon = pokemon;
        renderCards();
        renderDetail();
      }
    });
  });

  grid.querySelectorAll(".star-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleFavoritePokemon(Number(button.dataset.starId));
    });
  });
}

function renderCollectionsLibrary() {
  if (state.currentTab === "sets") {
    if (state.selectedCollection) {
      const selectedCards = collectionCatalog[state.selectedCollection] || [];

      libraryList.className = "library-list";
      libraryList.innerHTML = `
        <div class="library-title-row">
          <strong>${state.selectedCollection}</strong>
          <span>${selectedCards.length} cartas</span>
        </div>
        <ul>
          ${selectedCards.map((card) => `<li>${card.number} · ${card.name} · ${card.rarity}</li>`).join("")}
        </ul>
      `;
      return;
    }

    const selectedSet = state.selectedPokemon?.name || "";
    const visibleSets = getVisibleCollections();

    libraryList.className = "library-list";
    libraryList.innerHTML = `
      <div class="library-title-row">
        <strong>Catálogo mundial</strong>
        <span>${visibleSets.length} coleções</span>
      </div>
      <ul>
        ${visibleSets.map((item) => `<li ${item === selectedSet ? 'style="background: rgba(78, 205, 196, 0.12); border-color: rgba(78, 205, 196, 0.45); color: #baf7f1;"' : ""}>${item}</li>`).join("")}
      </ul>
    `;
    return;
  }

  if (!state.selectedPokemon) {
    libraryList.className = "library-list empty";
    libraryList.innerHTML = "<p>Selecione um Pokémon para carregar a lista de coleções.</p>";
    return;
  }

  const { name, id, collections = [] } = state.selectedPokemon;
  const collectionList = Array.isArray(collections) && collections.length
    ? collections
    : getCollectionsForPokemon(id, name);

  const safeCollections = sanitizeCollections(collectionList, name);

  libraryList.className = "library-list";
  libraryList.innerHTML = `
    <div class="library-title-row">
      <strong>${name}</strong>
      <span>${safeCollections.length} coleções</span>
    </div>
    <ul>
      ${safeCollections.map((item) => `<li>${item}</li>`).join("")}
    </ul>
  `;
}

function renderDetail() {
  if (state.currentTab === "sets") {
    if (!state.selectedPokemon) {
      detailPanel.innerHTML = "<p>Selecione uma coleção para ver detalhes.</p>";
      renderCollectionsLibrary();
      return;
    }

    const { name, description, region } = state.selectedPokemon;
    const cards = collectionCatalog[name] || [];
    const totalCards = cards.length;
    const secretCards = cards.filter((card) => card.rarity.includes("Secret")).length;

    detailPanel.innerHTML = `
      <div class="detail-top">
        <div>
          <span class="card-id">#${String(state.selectedPokemon.id).padStart(3, "0")}</span>
          <h3>${name}</h3>
        </div>
      </div>

      <div class="detail-photo">
        <span class="set-icon" style="font-size: 5rem; line-height: 1;">🃏</span>
      </div>

      <div class="detail-meta">
        <span class="badge normal">Coleção</span>
        <span class="badge" style="background: rgba(255,255,255,0.04); color: #dfe7ff;">${region}</span>
      </div>

      <p class="detail-para">${description}</p>

      <div class="stats">
        <div class="stat-row">
          <span>Cartas</span>
          <div class="bar"><div class="fill" style="width: 100%"></div></div>
          <strong>${totalCards}</strong>
        </div>
        <div class="stat-row">
          <span>Secretas</span>
          <div class="bar"><div class="fill" style="width: ${Math.min((secretCards / totalCards) * 100, 100)}%"></div></div>
          <strong>${secretCards}</strong>
        </div>
      </div>
    `;

    renderCollectionsLibrary();
    return;
  }

  if (!state.selectedPokemon) {
    detailPanel.innerHTML = "<p>Selecione um Pokémon para ver mais detalhes.</p>";
    renderCollectionsLibrary();
    return;
  }

  const { name, type, typeKey, id, region, description, hp, attack, defense, image, favorite, captured } = state.selectedPokemon;
  const typeClass = getTypeClass(typeKey);

  detailPanel.innerHTML = `
    <div class="detail-top">
      <div>
        <span class="card-id">#${String(id).padStart(3, "0")}</span>
        <h3>${name}</h3>
      </div>
      <button class="star-button detail-star ${favorite ? "active" : ""}" data-star-id="${id}" aria-label="Adicionar à minha biblioteca">
        ${favorite ? "⭐" : "☆"}
      </button>
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

  renderCollectionsLibrary();

  detailPanel.querySelector(".detail-star")?.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleFavoritePokemon(Number(event.currentTarget.dataset.starId));
  });
}

searchInput.addEventListener("input", (event) => {
  state.currentSearch = event.target.value.trim();
  renderCards();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.currentFilter = button.dataset.type;
    filterButtons.forEach((btn) => btn.classList.toggle("active", btn === button));
    renderCards();
  });
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.currentTab = button.dataset.tab;
    tabButtons.forEach((btn) => btn.classList.toggle("active", btn === button));

    state.currentSearch = "";
    searchInput.value = "";

    if (state.currentTab === "sets") {
      searchInput.placeholder = "Buscar coleção...";
      state.selectedCollection = null;
      state.selectedPokemon = {
        id: 1,
        name: worldCollections[0],
        type: "Coleção",
        typeKey: "normal",
        region: "Mundo",
        description: `Coleção oficial de cartas Pokémon do universo TCG com destaque em ${worldCollections[0]}.`,
        favorite: false,
        captured: false,
        hp: 100,
        attack: 100,
        defense: 100,
        image: ""
      };
    } else {
      searchInput.placeholder = state.currentTab === "library" ? "Buscar na minha biblioteca..." : "Buscar Pokémon...";
    }

    renderCards();
    renderDetail();
  });
});

function focusSearch() {
  searchInput.focus();
  searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
}

async function init() {
  grid.innerHTML = '<div class="pokemon-card" style="grid-column: 1 / -1; padding: 32px; text-align:center; color: var(--muted);">Carregando 1.025 Pokémon...</div>';

  state.currentSearch = "";
  searchInput.value = "";
  searchInput.placeholder = "Buscar Pokémon...";

  state.pokemonData = await loadPokemonData();
  state.selectedPokemon = state.pokemonData[0];
  await fetchSetCards("Base Set");

  renderStats();
  renderCards();
  renderDetail();
}

init();
