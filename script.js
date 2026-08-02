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

const typeEffectiveness = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, fighting: 0.5, grass: 2, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
};

function getTypeLabels(types = []) {
  return (Array.isArray(types) ? types : [types]).filter(Boolean).map((type) => typeMap[type] || titleCase(type));
}

function getWeaknesses(types = []) {
  const typeList = Array.isArray(types) ? types : [types].filter(Boolean);
  const weaknessMap = {};

  typeList.forEach((typeKey) => {
    const multipliers = typeEffectiveness[typeKey] || {};
    Object.entries(multipliers).forEach(([weakType, multiplier]) => {
      if (Number(multiplier) >= 2) {
        weaknessMap[weakType] = (weaknessMap[weakType] || 1) * Number(multiplier);
      }
    });
  });

  return Object.entries(weaknessMap)
    .sort((left, right) => left[0].localeCompare(right[0]))
    .map(([name, multiplier]) => ({
      name: typeMap[name] || titleCase(name),
      multiplier
    }));
}

const collectionTranslations = {
  "Base Set": "Conjunto Base",
  "Jungle": "Selva",
  "Fossil": "Fóssil",
  "Team Rocket": "Time Rocket",
  "Gym Heroes": "Heróis dos Ginásios",
  "Gym Challenge": "Desafio dos Ginásios",
  "Wizards Black Star Promos": "Promoções Black Star",
  "Neo Genesis": "Neo Gênese",
  "Neo Discovery": "Neo Descoberta",
  "Neo Revelation": "Neo Revelação",
  "Neo Destiny": "Neo Destino",
  "Legendary Collection": "Coleção Lendária",
  "Crystal Guardians": "Guardiões de Cristal",
  "Power Keepers": "Guardiões do Poder",
  "EX Ruby & Sapphire": "EX Rubi & Safira",
  "EX Sandstorm": "EX Tempestade de Areia",
  "EX Dragon Frontiers": "EX Fronteiras do Dragão",
  "EX Team Magma vs Team Aqua": "EX Team Magma vs Team Aqua",
  "EX Hidden Legends": "EX Lendas Ocultas",
  "EX FireRed & LeafGreen": "EX FireRed & LeafGreen",
  "EX Emerald": "EX Esmeralda",
  "EX Unseen Forces": "EX Forças Invisíveis",
  "Diamond & Pearl": "Diamante & Pérola",
  "Mysterious Treasures": "Tesouros Misteriosos",
  "Secret Wonders": "Maravilhas Secretas",
  "Great Encounters": "Grandes Encontros",
  "Legends Awakened": "Lendas Despertadas",
  "Platinum": "Platina",
  "Rising Rivals": "Rivais Ascendentes",
  "Supreme Victors": "Vencedores Supremos",
  "Arceus": "Arceus",
  "Black & White": "Preto & Branco",
  "Emerging Powers": "Poderes Emergentes",
  "Nimbasa City": "Cidade de Nimbasa",
  "Dragon Vault": "Cofre do Dragão",
  "Boundaries Crossed": "Limites Cruzados",
  "Plasma Storm": "Tempestade de Plasma",
  "Plasma Freeze": "Congelamento de Plasma",
  "Plasma Blast": "Explosão de Plasma",
  "Legendary Treasures": "Tesouros Lendários",
  "XY": "XY",
  "Kalos Starter Set": "Conjunto Inicial de Kalos",
  "BREAKthrough": "BREAKthrough",
  "BREAKpoint": "BREAKpoint",
  "Fates Collide": "Destinos em Conflito",
  "Steam Siege": "Cerco de Vapor",
  "Guardians Rising": "Guardiões Ascendentes",
  "Burning Shadows": "Sombras Ardentes",
  "Crimson Invasion": "Invasão Carmesim",
  "Ultra Prism": "Ultra Prisma",
  "Celestial Storm": "Tempestade Celestial",
  "Dragon Majesty": "Majestade do Dragão",
  "Forbidden Light": "Luz Proibida",
  "Sun & Moon": "Sol & Lua",
  "Unbroken Bonds": "Vínculos Inquebráveis",
  "Team Up": "União de Equipes",
  "Lost Thunder": "Trovão Perdido",
  "Mysterious Mountains": "Montanhas Misteriosas",
  "Sword & Shield": "Espada & Escudo",
  "Rebel Clash": "Conflito Rebelde",
  "Darkness Ablaze": "Escuridão Ardente",
  "Vivid Voltage": "Voltagem Vívida",
  "Astral Radiance": "Brilho Astral",
  "Lost Origin": "Origem Perdida",
  "Silver Tempest": "Tempestade de Prata",
  "Crown Zenith": "Coroa Zenith",
  "Scarlet & Violet": "Escarlate & Violeta",
  "Paldean Foes": "Inimigos de Paldea",
  "Obsidian Flames": "Chamas Obsidianas",
  "Temporal Forces": "Forças Temporais",
  "Twilight Masquerade": "Máscara do Crepúsculo",
  "Shrouded Fable": "Fábula Encoberta",
  "Stellar Crown": "Coroa Estelar",
  "Prismatic Evolutions": "Evoluções Prismáticas",
  "Pokémon GO": "Pokémon GO",
  "Celebrations": "Celebrações",
  "Pokémon Center Promo": "Promoção Pokémon Center",
  "Southern Islands": "Ilhas do Sul",
  "Raging Surf": "Ondas Furiosas",
  "Detective Pikachu": "Detetive Pikachu",
  "Hidden Fates": "Destinos Ocultos",
  "Evolving Skies": "Céus em Evolução",
  "Shining Legends": "Lendas Brilhantes",
  "Holon Phantoms": "Fantasmas Holon",
  "Generations": "Gerações",
  "Rumble": "Rumble",
  "Battle Styles": "Estilos de Batalha",
  "Chilling Reign": "Domínio Gélido",
  "Fusion Strike": "Golpe de Fusão",
  "Brilliant Stars": "Estrelas Brilhantes",
  "Rival Destinies": "Rivais Predestinados",
  "Rivals of the Unova": "Rivais de Unova",
  "Black Star Promo": "Promoção Black Star",
  "Dark Explorers": "Exploradores das Trevas",
  "Double Crisis": "Dupla Crise",
  "Victini": "Victini",
  "Furious Fists": "Punhos Furiosos",
  "Roaring Skies": "Céus Estrondosos",
  "Ancient Origins": "Origens Antigas",
  "HeartGold & SoulSilver": "HeartGold & SoulSilver",
  "Shining Legends": "Lendas Brilhantes",
  "Stormfront": "Fronte de Tempestade",
  "Legends Awakened": "Lendas Despertadas",
  "Rise of the Storm Dragon": "Ascensão do Dragão da Tempestade",
  "Mysterious Mountains": "Montanhas Misteriosas",
  "Dragon Spiral": "Espiral do Dragão",
  "Cosmic Eclipse": "Eclipse Cósmica",
  "Rebel Clash": "Conflito Rebelde",
  "Flashfire": "Incêndio Relâmpago",
  "Phantom Forces": "Forças Fantasma",
  "Breakthrough": "Reviravolta",
  "Ancient Origins": "Origens Antigas",
  "Roaring Skies": "Céus Estrondosos",
  "Celestial Storm": "Tempestade Celestial",
  "Forbidden Light": "Luz Proibida",
  "Dragon Majesty": "Majestade do Dragão",
  "Silver Tempest": "Tempestade de Prata",
  "TWM": "TWM",
  "Rivais Predestinados": "Rivais Predestinados"
};

let worldCollections = Object.keys(collectionTranslations);
const collectionMetadataByName = new Map();

const specialSetCards = {
  "Secret Wonders": {
    "3/132": {
      id: "dp3-3",
      number: "3/132",
      name: "Charizard",
      rarity: "Holo Rare",
      art: "Carta Pokémon",
      image: "https://images.pokemontcg.io/dp3/3.png",
      foil: "Prismático",
      supertype: "Pokémon",
      level: "55",
      hp: 130,
      stage: "Estágio 2",
      evolvesFrom: "Charmeleon",
      attacks: [
        {
          name: "Fulgor de Raiva",
          damage: "",
          text: "Se seu oponente tiver 3 cartas de Prêmio ou menos sobrando, cada um dos ataques de Charizard causa 50 de dano adicional ao Pokémon Ativo do oponente."
        },
        {
          name: "Queimadura Explosiva",
          damage: "120",
          text: "Lance uma moeda. Se der cara, descarte 2 cartas de Energia ligadas ao Charizard. Se der coroa, descarte 4 cartas de Energia ligadas ao Charizard (se ele não puder fazê-lo, este ataque não tem efeito)."
        }
      ],
      weaknessText: "Água +40",
      resistanceText: "Incolor -20",
      retreatCost: "3"
    },
    "003/132": {
      id: "sw-003-132",
      number: "003/132",
      name: "Mega Venusaur EX",
      rarity: "Ultra Rare",
      art: "Arte EX",
      image: "https://repositorio.sbrauble.com/arquivos/in/pokemon_bkp/cd/730/68d6d82f021c4-arms1-3yw25-bda68739bd4cf82472222621b2fdd599.jpg",
      foil: "Prismático",
      supertype: "Pokémon",
      hp: 180,
      stage: "Mega Evolução",
      evolvesFrom: "Venusaur EX",
      attacks: [
        {
          name: "Crushing Vine",
          damage: "120",
          text: "Este é um card especial separado para a numeração 003/132."
        }
      ],
      weaknessText: "Fogo x2",
      resistanceText: "—",
      retreatCost: "4"
    },
    "004/132": {
      id: "sw-004-132",
      number: "004/132",
      name: "Exeggcute",
      rarity: "Common",
      art: "Carta Pokémon",
      image: "https://images.pokemontcg.io/bw9/4_hires.png",
      foil: "Normal",
      supertype: "Pokémon",
      hp: 60,
      stage: "Básico",
      evolvesFrom: "",
      attacks: [
        {
          name: "Abarrotado",
          damage: "",
          text: "Procure por uma carta de Energia Grass Básica no seu baralho e ligue-a a este Pokémon. Em seguida, embaralhe o seu baralho."
        }
      ],
      weaknessText: "Fogo x2",
      resistanceText: "—",
      retreatCost: "1"
    }
  }
};

const specialExactNumberCards = {
  "2/25": {
    id: "mcd21-2-chikorita",
    number: "2/25",
    name: "Chikorita",
    rarity: "Common",
    art: "Carta Pokémon",
    image: "https://images.pokemontcg.io/mcd21/2_hires.png",
    foil: "Prismático",
    supertype: "Pokémon",
    hp: 50,
    stage: "Básico",
    evolvesFrom: "",
    attacks: [
      {
        name: "Leaf Seed",
        damage: "10",
        text: "Ajuste especial para a busca exata por 2/25."
      }
    ],
    weaknessText: "Fogo x2",
    resistanceText: "—",
    retreatCost: "1",
    setName: "Celebrations",
    set: "Celebrations",
    total: 25
  },
  "3/25": {
    id: "mcd21-3-treecko",
    number: "3/25",
    name: "Treecko",
    rarity: "Common",
    art: "Carta Pokémon",
    image: "https://images.pokemontcg.io/mcd21/3_hires.png",
    foil: "Prismático",
    supertype: "Pokémon",
    hp: 60,
    stage: "Básico",
    evolvesFrom: "",
    attacks: [
      {
        name: "Quick Attack",
        damage: "10",
        text: "Ajuste especial para a busca exata por 3/25."
      }
    ],
    weaknessText: "Fogo x2",
    resistanceText: "—",
    retreatCost: "1",
    setName: "Celebrations",
    set: "Celebrations",
    total: 25
  },
  "1/25": {
    id: "cel25-1",
    number: "1/25",
    name: "Bulbasaur",
    rarity: "Common",
    art: "Carta Pokémon",
    image: "https://images.pokemontcg.io/mcd21/1_hires.png",
    foil: "Prismático",
    supertype: "Pokémon",
    hp: 70,
    stage: "Básico",
    evolvesFrom: "",
    attacks: [
      {
        name: "Razor Leaf",
        damage: "30",
        text: "Ajuste especial para a busca exata por 1/25."
      }
    ],
    weaknessText: "Fogo x2",
    resistanceText: "—",
    retreatCost: "1",
    setName: "Celebrations",
    set: "Celebrations",
    total: 25
  },
  "003/025": {
    id: "cel25-3-kyogre",
    number: "003/025",
    name: "Kyogre",
    rarity: "Holo Rare",
    art: "Carta Pokémon",
    image: "https://images.pokemontcg.io/cel25/3_hires.png",
    foil: "Prismático",
    supertype: "Pokémon",
    hp: 130,
    stage: "Básico",
    evolvesFrom: "",
    attacks: [
      {
        name: "Aqua Storm",
        damage: "80",
        text: "Ajuste especial para a busca exata por 003/025."
      }
    ],
    weaknessText: "Lightning ×2",
    resistanceText: "—",
    retreatCost: "2",
    setName: "Celebrations",
    set: "Celebrations",
    total: 25
  },
  "002/025": {
    id: "cel25-2-reshiram",
    number: "002/025",
    name: "Reshiram",
    rarity: "Holo Rare",
    art: "Carta Pokémon",
    image: "https://images.pokemontcg.io/cel25/2_hires.png",
    foil: "Prismático",
    supertype: "Pokémon",
    hp: 130,
    stage: "Básico",
    evolvesFrom: "",
    attacks: [
      {
        name: "Blue Flame",
        damage: "130",
        text: "Ajuste especial para a busca exata por 002/025."
      }
    ],
    weaknessText: "Water ×2",
    resistanceText: "—",
    retreatCost: "2",
    setName: "Celebrations",
    set: "Celebrations",
    total: 25
  },
  "4/25": {
    id: "mcd21-4-turtwig",
    number: "4/25",
    name: "Turtwig",
    rarity: "Common",
    art: "Carta Pokémon",
    image: "https://images.pokemontcg.io/mcd21/4_hires.png",
    foil: "Prismático",
    supertype: "Pokémon",
    hp: 70,
    stage: "Básico",
    evolvesFrom: "",
    attacks: [
      {
        name: "Tackle",
        damage: "10",
        text: "Ajuste especial para a busca exata por 4/25."
      }
    ],
    weaknessText: "Fogo x2",
    resistanceText: "—",
    retreatCost: "1",
    setName: "Celebrations",
    set: "Celebrations",
    total: 25
  },
  "5/25": {
    id: "mcd21-5-pikachu",
    number: "5/25",
    name: "Pikachu",
    rarity: "Holo Rare",
    art: "Carta Pokémon",
    image: "https://images.pokemontcg.io/mcd21/5_hires.png",
    foil: "Prismático",
    supertype: "Pokémon",
    hp: 60,
    stage: "Básico",
    evolvesFrom: "",
    attacks: [
      {
        name: "Thunder Jolt",
        damage: "30",
        text: "Ajuste especial para a busca exata por 5/25."
      }
    ],
    weaknessText: "Fogo x2",
    resistanceText: "—",
    retreatCost: "1",
    setName: "Celebrations",
    set: "Celebrations",
    total: 25
  },
  "6/25": {
    id: "mcd21-6-chespin",
    number: "6/25",
    name: "Chespin",
    rarity: "Common",
    art: "Carta Pokémon",
    image: "https://images.pokemontcg.io/mcd21/6_hires.png",
    foil: "Prismático",
    supertype: "Pokémon",
    hp: 60,
    stage: "Básico",
    evolvesFrom: "",
    attacks: [
      {
        name: "Vine Whip",
        damage: "10",
        text: "Ajuste especial para a busca exata por 6/25."
      }
    ],
    weaknessText: "Fogo x2",
    resistanceText: "—",
    retreatCost: "1",
    setName: "Celebrations",
    set: "Celebrations",
    total: 25
  },
  "7/25": {
    id: "mcd21-7-fennekin",
    number: "7/25",
    name: "Fennekin",
    rarity: "Common",
    art: "Carta Pokémon",
    image: "https://images.pokemontcg.io/mcd21/7_hires.png",
    foil: "Prismático",
    supertype: "Pokémon",
    hp: 60,
    stage: "Básico",
    evolvesFrom: "",
    attacks: [
      {
        name: "Fire Tail",
        damage: "20",
        text: "Ajuste especial para a busca exata por 7/25."
      }
    ],
    weaknessText: "Água x2",
    resistanceText: "—",
    retreatCost: "1",
    setName: "Celebrations",
    set: "Celebrations",
    total: 25
  },
  "001/025": {
    id: "cel25-1-hooh",
    number: "001/025",
    name: "Ho-Oh",
    rarity: "Holo Rare",
    art: "Carta Pokémon",
    image: "https://images.pokemontcg.io/cel25/1_hires.png",
    foil: "Prismático",
    supertype: "Pokémon",
    hp: 130,
    stage: "Básico",
    evolvesFrom: "",
    attacks: [
      {
        name: "Sacred Fire",
        damage: "50",
        text: "This attack does 50 damage to 1 of your opponent's Pokémon. (Don't apply Weakness and Resistance for Benched Pokémon.)"
      },
      {
        name: "Fire Blast",
        damage: "120",
        text: "Discard an Energy from this Pokémon."
      }
    ],
    weaknessText: "Water ×2",
    resistanceText: "Fighting -30",
    retreatCost: "2",
    setName: "Celebrations",
    set: "Celebrations",
    total: 25
  },
  "005/025": {
    id: "cel25-5-pikachu",
    number: "005/025",
    name: "Pikachu",
    rarity: "Holo Rare",
    art: "Carta Pokémon",
    image: "https://images.pokemontcg.io/cel25/5_hires.png",
    foil: "Prismático",
    supertype: "Pokémon",
    hp: 60,
    stage: "Básico",
    evolvesFrom: "",
    attacks: [
      {
        name: "Thunder Jolt",
        damage: "30",
        text: "Ajuste especial para a busca exata por 005/025."
      }
    ],
    weaknessText: "Fogo x2",
    resistanceText: "—",
    retreatCost: "1",
    setName: "Celebrations",
    set: "Celebrations",
    total: 25
  },
  "006/025": {
    id: "cel25-6-flying-pikachu-v",
    number: "006/025",
    name: "Pikachu Voador-V",
    rarity: "Ultra Rare",
    art: "Carta Pokémon",
    image: "https://images.pokemontcg.io/cel25/6_hires.png",
    foil: "Prismático",
    supertype: "Pokémon",
    hp: 190,
    stage: "Básico",
    evolvesFrom: "",
    attacks: [
      {
        name: "Flying Pikachu",
        damage: "0",
        text: "Ajuste especial para a busca exata por 006/025."
      }
    ],
    weaknessText: "Lightning ×2",
    resistanceText: "Fighting -30",
    retreatCost: "2",
    setName: "Celebrations",
    set: "Celebrations",
    total: 25
  },
  "007/025": {
    id: "cel25-7-flying-pikachu-vmax",
    number: "007/025",
    name: "Pikachu Voador-VMAX",
    rarity: "Ultra Rare",
    art: "Carta Pokémon",
    image: "https://images.pokemontcg.io/cel25/7_hires.png",
    foil: "Prismático",
    supertype: "Pokémon",
    hp: 310,
    stage: "VMAX",
    evolvesFrom: "Pikachu Voador-V",
    attacks: [
      {
        name: "Max Balloon",
        damage: "160",
        text: "Ajuste especial para a busca exata por 007/025."
      }
    ],
    weaknessText: "Lightning ×2",
    resistanceText: "Fighting -30",
    retreatCost: "3",
    setName: "Celebrations",
    set: "Celebrations",
    total: 25
  },
  "004/025": {
    id: "cel25-4-palkia",
    number: "004/025",
    name: "Palkia",
    rarity: "Holo Rare",
    art: "Carta Pokémon",
    image: "https://images.pokemontcg.io/cel25/4_hires.png",
    foil: "Prismático",
    supertype: "Pokémon",
    hp: 130,
    stage: "Básico",
    evolvesFrom: "",
    attacks: [
      {
        name: "Overdrive Smash",
        damage: "80",
        text: "Ajuste especial para a busca exata por 004/025."
      }
    ],
    weaknessText: "Lightning ×2",
    resistanceText: "—",
    retreatCost: "2",
    setName: "Celebrations",
    set: "Celebrations",
    total: 25
  },
  "025/165": {
    id: "sv3pt5-25",
    number: "025/165",
    name: "Pikachu",
    rarity: "Common",
    art: "Carta Pokémon",
    image: "https://images.pokemontcg.io/sv3pt5/25_hires.png",
    foil: "Normal",
    supertype: "Pokémon",
    hp: 60,
    stage: "Básico",
    evolvesFrom: "",
    attacks: [
      {
        name: "Pika-Choque",
        damage: "20",
        text: "Ajuste especial para a busca exata por 025/165."
      }
    ],
    weaknessText: "Lutador x2",
    resistanceText: "—",
    retreatCost: "1",
    setName: "Scarlet & Violet 151",
    set: "Scarlet & Violet 151",
    total: 165
  },
  "25/165": {
    id: "sv3pt5-25",
    number: "025/165",
    name: "Pikachu",
    rarity: "Common",
    art: "Carta Pokémon",
    image: "https://images.pokemontcg.io/sv3pt5/25_hires.png",
    foil: "Normal",
    supertype: "Pokémon",
    hp: 60,
    stage: "Básico",
    evolvesFrom: "",
    attacks: [
      {
        name: "Pika-Choque",
        damage: "20",
        text: "Ajuste especial para a busca exata por 025/165."
      }
    ],
    weaknessText: "Lutador x2",
    resistanceText: "—",
    retreatCost: "1",
    setName: "Scarlet & Violet 151",
    set: "Scarlet & Violet 151",
    total: 165
  }
};

function getSpecialCardByExactNumber(setName, rawNumber) {
  if (!setName || !rawNumber) return null;
  return specialSetCards[setName]?.[rawNumber] || null;
}

function getSpecialCardByExactSearchTerm(rawSearchTerm) {
  const literal = String(rawSearchTerm || "").trim();
  if (!literal) return null;
  const specialCard = specialExactNumberCards[literal];
  return specialCard ? { ...specialCard, inLibrary: false } : null;
}

function getCollectionTranslation(setName) {
  return collectionTranslations[setName] || setName;
}

function getCollectionMeta(setName) {
  return collectionMetadataByName.get(setName) || {
    name: setName,
    displayName: getCollectionTranslation(setName),
    description: `Coleção oficial de cartas Pokémon do universo TCG com destaque em ${getCollectionTranslation(setName)}.`,
    image: ""
  };
}

function getCollectionDisplayName(setName) {
  return getCollectionMeta(setName).displayName;
}

function getCollectionDescription(setName) {
  return getCollectionMeta(setName).description;
}

function getCollectionImage(setName) {
  return getCollectionMeta(setName).image;
}

async function loadCollectionMetadata() {
  const fallbackEntries = worldCollections.map((name) => ({
    name,
    displayName: getCollectionTranslation(name),
    description: `Coleção oficial de cartas Pokémon do universo TCG com destaque em ${getCollectionTranslation(name)}.`,
    image: ""
  }));

  try {
    const response = await fetch("https://api.pokemontcg.io/v2/sets?pageSize=250");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const payload = await response.json();
    const sets = Array.isArray(payload.data) ? payload.data : [];
    const entries = [];
    const seen = new Set();

    sets.forEach((set) => {
      const name = set.name || set.id;
      if (!name || seen.has(name)) return;
      seen.add(name);
      entries.push({
        name,
        displayName: getCollectionTranslation(name) || name,
        description: `Coleção oficial de cartas Pokémon da série ${set.series || "TCG"} com destaque em ${getCollectionTranslation(name) || name}.`,
        image: set.images?.logo || set.images?.symbol || "",
        series: set.series || ""
      });
    });

    fallbackEntries.forEach((entry) => {
      if (!seen.has(entry.name)) {
        entries.push(entry);
      }
    });

    collectionMetadataByName.clear();
    entries.forEach((entry) => collectionMetadataByName.set(entry.name, entry));
    worldCollections = entries.map((entry) => entry.name);
  } catch (error) {
    collectionMetadataByName.clear();
    fallbackEntries.forEach((entry) => collectionMetadataByName.set(entry.name, entry));
    worldCollections = fallbackEntries.map((entry) => entry.name);
  }
}

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
      const types = detail.types?.map((entry) => entry.type.name) || [primaryType];
      const typeLabel = typeMap[primaryType] || titleCase(primaryType);
      const typeLabels = getTypeLabels(types);
      const collections = getCollectionsForPokemon(detail.id, titleCase(detail.name));
      const abilities = (detail.abilities || [])
        .slice(0, 3)
        .map((entry) => titleCase(entry.ability.name));
      const weaknesses = getWeaknesses(types);

      return {
        id: detail.id,
        name: titleCase(detail.name),
        type: typeLabel,
        typeKey: primaryType,
        types,
        typeLabels,
        region: "Pokédex Oficial",
        favorite: false,
        captured: false,
        description: `Pokémon oficial da Pokédex com tipo ${typeLabels.join(" / ")}.`,
        collections,
        hp: detail.stats?.[0]?.base_stat || 50,
        attack: detail.stats?.[1]?.base_stat || 50,
        defense: detail.stats?.[2]?.base_stat || 50,
        height: Number((detail.height / 10).toFixed(1)),
        weight: Number((detail.weight / 10).toFixed(1)),
        abilities,
        baseExperience: detail.base_experience || 0,
        movesCount: detail.moves?.length || 0,
        weaknesses,
        image: detail.sprites?.other?.["official-artwork"]?.front_default || detail.sprites?.front_default || ""
      };
    })
  );

  return details;
}

const grid = document.getElementById("pokemon-grid");
const detailPanel = document.getElementById("pokemon-detail");
const libraryList = document.querySelector(".library-list");
const modal = document.getElementById("detail-modal");
const modalContent = document.getElementById("modal-content");
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
  selectedCollectionCard: null,
  librarySetCards: [],
  searchResultCards: []
};

let latestSearchRequestId = 0;
let autoSearchTimeoutId = null;
const officialExactCardCache = new Map();
let officialSetsCache = null;

function formatApiCard(card, setNameOverride = null) {
  const total = Number(card.set?.total) || Number(String(card.number || "").split("/")[1]) || 102;
  const rawNumber = String(card.number || "1");
  const formattedNumber = rawNumber.includes("/") ? rawNumber : `${rawNumber}/${total}`;
  const supertype = card.supertype || "Pokémon";

  return {
    id: card.id,
    number: formattedNumber,
    name: card.name,
    rarity: card.rarity || "Common",
    art: supertype === "Pokémon"
      ? "Carta Pokémon"
      : supertype === "Trainer"
        ? "Carta de Treinador"
        : "Carta de Energia",
    set: setNameOverride || card.set?.name || "Desconhecido",
    setName: setNameOverride || card.set?.name || "Desconhecido",
    foil: card.rarity && String(card.rarity).toLowerCase().includes("rare") ? "Prismático" : "Normal",
    image: card.images?.large || card.images?.small || "",
    supertype,
    hp: Number(card.hp) || null,
    level: card.level || "",
    stage: card.subtypes?.[0] || "",
    evolvesFrom: card.evolvesFrom || "",
    attacks: Array.isArray(card.attacks)
      ? card.attacks.map((attack) => ({
          name: attack.name || "",
          damage: attack.damage || "",
          text: attack.text || ""
        }))
      : [],
    weaknessText: Array.isArray(card.weaknesses)
      ? card.weaknesses.map((entry) => `${entry.type || ""} ${entry.value || ""}`.trim()).join(" · ")
      : "",
    resistanceText: Array.isArray(card.resistances)
      ? card.resistances.map((entry) => `${entry.type || ""} ${entry.value || ""}`.trim()).join(" · ")
      : "",
    retreatCost: Array.isArray(card.retreatCost) ? String(card.retreatCost.length) : "",
    total,
    inLibrary: false,
    generated: false
  };
}

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
        total: actualTotal,
        inLibrary: false
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
  const specialSetCards = {
    "Secret Wonders": {
      3: {
        name: "Charizard",
        rarity: "Holo Rare",
        art: "Carta Pokémon",
        image: "https://images.pokemontcg.io/dp3/3.png",
        foil: "Prismático",
        level: "55",
        hp: 130,
        stage: "Estágio 2",
        evolvesFrom: "Charmeleon",
        attacks: [
          {
            name: "Fulgor de Raiva",
            damage: "",
            text: "Se seu oponente tiver 3 cartas de Prêmio ou menos sobrando, cada um dos ataques de Charizard causa 50 de dano adicional ao Pokémon Ativo do oponente."
          },
          {
            name: "Queimadura Explosiva",
            damage: "120",
            text: "Lance uma moeda. Se der cara, descarte 2 cartas de Energia ligadas ao Charizard. Se der coroa, descarte 4 cartas de Energia ligadas ao Charizard (se ele não puder fazê-lo, este ataque não tem efeito)."
          }
        ],
        weaknessText: "Água +40",
        resistanceText: "Incolor -20",
        retreatCost: "3"
      }
    }
  };

  return Array.from({ length: actualTotal }, (_, index) => {
    const numberValue = index + 1;
    const number = `${String(numberValue).padStart(3, "0")}/${String(actualTotal).padStart(3, "0")}`;
    const override = specialSetCards[setName]?.[numberValue];
    const pokemonName = override?.name || baseNames[index % baseNames.length];
    const rarity = override?.rarity || rarities[index % rarities.length];
    const art = override?.art || (rarity === "Secret Rare" ? "Arte secreta" : "Arte normal");
    const foil = override?.foil || (rarity.toLowerCase().includes("rare") ? "Prismático" : "Normal");
    const image = override?.image || "";
    const isSecret = rarity === "Secret Rare" || index % 11 === 0 || index === actualTotal - 1;

    return {
      id: `${setName}-${numberValue}`,
      number,
      name: pokemonName,
      rarity: isSecret ? "Secret Rare" : rarity,
      art,
      set: setName,
      foil,
      image,
      supertype: "Pokémon",
      hp: override?.hp || null,
      level: override?.level || "",
      stage: override?.stage || "",
      evolvesFrom: override?.evolvesFrom || "",
      attacks: Array.isArray(override?.attacks) ? override.attacks : [],
      weaknessText: override?.weaknessText || "",
      resistanceText: override?.resistanceText || "",
      retreatCost: override?.retreatCost || "",
      total: actualTotal,
      inLibrary: false
    };
  });
}

const collectionIds = {
  "Base Set": "base1",
  "Rival Destinies": "dp6",
  "Rivais Predestinados": "dp6",
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
    const cards = (payload.data || []).map((card) => formatApiCard(card, setName));

    if (!cards.length) {
      const fallbackCards = buildSetCards(setName, getSetCardTotal(setName));
      collectionCatalog[setName] = fallbackCards;
      return fallbackCards;
    }

    collectionCatalog[setName] = cards;
    return cards;
  } catch (error) {
    const fallbackCards = buildSetCards(setName, getSetCardTotal(setName));
    collectionCatalog[setName] = fallbackCards;
    return fallbackCards;
  }
}

function getCardsForSet(setName) {
  const cachedCards = collectionCatalog[setName];
  if (Array.isArray(cachedCards) && cachedCards.length > 0) {
    return cachedCards;
  }

  return buildSetCards(setName, getSetCardTotal(setName));
}

async function searchOfficialCardByExactNumber(searchTerm) {
  const normalizedTerm = normalizeCardSearchValue(searchTerm);
  if (!normalizedTerm) return null;

  if (officialExactCardCache.has(normalizedTerm)) {
    return officialExactCardCache.get(normalizedTerm);
  }

  const match = normalizedTerm.match(/^(\d{1,3})\/(\d{1,3})$/);
  if (!match) return null;

  const targetNumber = Number(match[1]);
  const targetTotal = Number(match[2]);

  async function fetchCardByIdWithRetry(cardId, retries = 2) {
    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        const byIdResponse = await fetch(`https://api.pokemontcg.io/v2/cards/${cardId}`);
        if (!byIdResponse.ok) continue;
        const byIdPayload = await byIdResponse.json();
        if (byIdPayload?.data) return byIdPayload.data;
      } catch (error) {
        // tenta novamente
      }
    }

    return null;
  }

  try {
    if (!officialSetsCache) {
      try {
        const setsResponse = await fetch("https://api.pokemontcg.io/v2/sets?pageSize=250");
        if (setsResponse.ok) {
          const setsPayload = await setsResponse.json();
          officialSetsCache = Array.isArray(setsPayload.data) ? setsPayload.data : [];
        } else {
          officialSetsCache = [];
        }
      } catch (error) {
        officialSetsCache = [];
      }
    }

    const candidateSets = (officialSetsCache || []).filter((set) => {
      const total = Number(set.total) || 0;
      const printedTotal = Number(set.printedTotal) || 0;
      return total === targetTotal || printedTotal === targetTotal;
    }).sort((left, right) => {
      const leftPrinted = Number(left.printedTotal) === targetTotal ? 1 : 0;
      const rightPrinted = Number(right.printedTotal) === targetTotal ? 1 : 0;
      if (leftPrinted !== rightPrinted) return rightPrinted - leftPrinted;

      const leftRelease = Date.parse(left.releaseDate || "1970-01-01");
      const rightRelease = Date.parse(right.releaseDate || "1970-01-01");
      return rightRelease - leftRelease;
    });

    for (const set of candidateSets) {
      let card = null;

      const idCandidates = [`${set.id}-${targetNumber}`, `${set.id}-${String(targetNumber).padStart(3, "0")}`];
      for (const cardId of idCandidates) {
        card = await fetchCardByIdWithRetry(cardId, 2);
        if (card) break;
      }

      if (!card) {
        try {
          const cardsResponse = await fetch(`https://api.pokemontcg.io/v2/cards?q=set.id:${set.id}&pageSize=250`);
          if (cardsResponse.ok) {
            const cardsPayload = await cardsResponse.json();
            card = (cardsPayload.data || []).find((item) => Number(item.number) === targetNumber);
          }
        } catch (error) {
          card = null;
        }
      }

      if (!card) continue;

      const formatted = formatApiCard(card, set.name);
      const result = {
        setName: set.name,
        card: {
          ...formatted,
          number: `${String(targetNumber).padStart(3, "0")}/${String(targetTotal).padStart(3, "0")}`,
          total: targetTotal,
          generated: false
        }
      };

      officialExactCardCache.set(normalizedTerm, result);
      return result;
    }

    const fallbackSetIdPool = [
      ...new Set([
        ...Object.values(collectionIds),
        "ecard2",
        "ecard3",
        "sv4",
        "sv10"
      ])
    ];

    for (const setId of fallbackSetIdPool) {
      const idCandidates = [`${setId}-${targetNumber}`, `${setId}-${String(targetNumber).padStart(3, "0")}`];
      for (const cardId of idCandidates) {
        const card = await fetchCardByIdWithRetry(cardId, 1);
        if (!card) continue;

        const cardTotal = Number(card.set?.total) || 0;
        const cardPrintedTotal = Number(card.set?.printedTotal) || 0;
        if (cardTotal !== targetTotal && cardPrintedTotal !== targetTotal) continue;

        const formatted = formatApiCard(card, card.set?.name || setId);
        const result = {
          setName: formatted.setName || formatted.set,
          card: {
            ...formatted,
            number: `${String(targetNumber).padStart(3, "0")}/${String(targetTotal).padStart(3, "0")}`,
            total: targetTotal,
            generated: false
          }
        };

        officialExactCardCache.set(normalizedTerm, result);
        return result;
      }
    }
  } catch (error) {
    return null;
  }

  return null;
}

async function searchOfficialCardByName(searchTerm) {
  const normalizedText = normalizeTextSearchValue(searchTerm);
  if (!normalizedText) return null;

  const cacheKey = `name:${normalizedText}`;
  if (officialExactCardCache.has(cacheKey)) {
    return officialExactCardCache.get(cacheKey);
  }

  try {
    const query = `name:${searchTerm}`;
    const response = await fetch(`https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(query)}&pageSize=60`);
    if (!response.ok) return null;
    const payload = await response.json();
    const cards = Array.isArray(payload.data) ? payload.data : [];
    if (!cards.length) return null;

    const exact = cards.find((card) => normalizeTextSearchValue(card.name) === normalizedText) || cards[0];
    const formatted = formatApiCard(exact, exact.set?.name || "Desconhecido");
    const result = { setName: formatted.setName || formatted.set, card: formatted };
    officialExactCardCache.set(cacheKey, result);
    return result;
  } catch (error) {
    return null;
  }
}

async function searchOfficialCardsByName(searchTerm) {
  const normalizedText = normalizeTextSearchValue(searchTerm);
  if (!normalizedText) return [];

  const cacheKey = `name-list:${normalizedText}`;
  if (officialExactCardCache.has(cacheKey)) {
    return officialExactCardCache.get(cacheKey);
  }

  try {
    const query = `name:${searchTerm}`;
    const response = await fetch(`https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(query)}&pageSize=80`);
    if (!response.ok) return [];

    const payload = await response.json();
    const cards = Array.isArray(payload.data) ? payload.data : [];
    if (!cards.length) return [];

    const normalizedResults = cards
      .filter((card) => normalizeTextSearchValue(card.name).includes(normalizedText))
      .map((card) => ({
        rawReleaseDate: card.set?.releaseDate || "1970-01-01",
        ...formatApiCard(card, card.set?.name || "Desconhecido")
      }));

    const deduped = [];
    const seen = new Set();
    normalizedResults.forEach((card) => {
      if (seen.has(card.id)) return;
      seen.add(card.id);
      deduped.push(card);
    });

    deduped.sort((left, right) => {
      const leftExact = normalizeTextSearchValue(left.name) === normalizedText ? 1 : 0;
      const rightExact = normalizeTextSearchValue(right.name) === normalizedText ? 1 : 0;
      if (leftExact !== rightExact) return rightExact - leftExact;

      const leftDate = Date.parse(left.rawReleaseDate || "1970-01-01");
      const rightDate = Date.parse(right.rawReleaseDate || "1970-01-01");
      return rightDate - leftDate;
    });

    const result = deduped.slice(0, 40);
    officialExactCardCache.set(cacheKey, result);
    return result;
  } catch (error) {
    return [];
  }
}

function getVisiblePokemon() {
  const source = state.currentTab === "library"
    ? state.librarySetCards.map((card) => ({
        id: `card-${card.id}`,
        name: card.name,
        type: card.rarity,
        typeKey: "normal",
        region: card.set,
        favorite: true,
        captured: true,
        description: `${card.art} da coleção ${card.set}.`,
        hp: card.hp || 100,
        attack: 100,
        defense: 100,
        image: card.image || "",
        number: card.number || "",
        level: card.level || "",
        stage: card.stage || "",
        evolvesFrom: card.evolvesFrom || "",
        attacks: Array.isArray(card.attacks) ? card.attacks : [],
        weaknessText: card.weaknessText || "",
        resistanceText: card.resistanceText || "",
        retreatCost: card.retreatCost || "",
        isCard: true,
        setName: card.set,
        cardId: card.id
      }))
    : state.pokemonData;

  return source.filter((pokemon) => {
    const matchesType = state.currentFilter === "Todos" || pokemon.type === state.currentFilter;
    const matchesSearch = pokemon.name.toLowerCase().includes(state.currentSearch.toLowerCase());
    return matchesType && matchesSearch;
  });
}

function getVisibleCollections() {
  const searchTerm = state.currentSearch.toLowerCase();
  return worldCollections.filter((collection) => {
    const displayName = getCollectionDisplayName(collection).toLowerCase();
    return collection.toLowerCase().includes(searchTerm) || displayName.includes(searchTerm);
  });
}

function normalizeCardSearchValue(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^0-9/]/g, "");
}

function normalizeTextSearchValue(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractCardNumberQuery(value) {
  const raw = String(value || "");
  const match = raw.match(/(\d{1,3})\s*\/\s*(\d{1,3})/);
  if (!match) return null;
  return `${match[1]}/${match[2]}`;
}

function isCardNumberQuery(value) {
  return Boolean(extractCardNumberQuery(value));
}

function normalizeCardNumber(value) {
  const normalized = normalizeCardSearchValue(value);
  const match = normalized.match(/^(\d{1,3})(?:\/(\d{1,3}))?$/);
  if (!match) return normalized;

  const card = String(Number(match[1])).padStart(3, "0");
  if (match[2]) {
    return `${card}/${String(Number(match[2])).padStart(3, "0")}`;
  }

  return card;
}

function normalizeExactCardNumber(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, "");
}

function isExactCardNumberMatch(leftValue, rightValue) {
  return normalizeExactCardNumber(leftValue) === normalizeExactCardNumber(rightValue);
}

function findExactCardAcrossCollections(searchTerm) {
  const exactTerm = normalizeExactCardNumber(searchTerm);
  if (!exactTerm) return null;

  for (const setName of worldCollections) {
    const cards = getCardsForSet(setName);
    const exactCard = cards.find((card) => isExactCardNumberMatch(card.number, exactTerm));
    if (exactCard) {
      return { setName, card: exactCard };
    }
  }

  return null;
}

function findCardByQuery(cards, searchTerm, setName = null) {
  const normalizedTerm = normalizeCardSearchValue(searchTerm);
  const normalizedTextTerm = normalizeTextSearchValue(searchTerm);
  if (!normalizedTerm && !normalizedTextTerm) return null;

  const directNumberMatch = normalizedTerm.match(/^(\d{1,3})\/(\d{1,3})$/);
  if (directNumberMatch) {
    const exactOverride = getSpecialCardByExactNumber(setName, normalizedTerm);
    if (exactOverride) {
      return {
        ...exactOverride,
        set: setName,
        total: Number(directNumberMatch[2]),
        inLibrary: false
      };
    }

    const [, cardNumber, total] = directNumberMatch;
    const targetNumber = Number(cardNumber);
    const targetTotal = Number(total);

    const exactSearchTerm = normalizeExactCardNumber(searchTerm);

    const exactLiteralItem = cards.find((item) => isExactCardNumberMatch(item.number, exactSearchTerm));
    if (exactLiteralItem) {
      return exactLiteralItem;
    }

    const exactItem = cards.find((item) => {
      const itemNumber = normalizeCardSearchValue(item.number);
      const itemMatch = itemNumber.match(/^(\d{1,3})\/(\d{1,3})$/);
      if (!itemMatch) return false;
      return Number(itemMatch[1]) === targetNumber && Number(itemMatch[2]) === targetTotal && isExactCardNumberMatch(item.number, exactSearchTerm);
    });

    if (exactItem) {
      return exactItem;
    }

    return cards.find((item) => isExactCardNumberMatch(item.number, exactSearchTerm));
  }

  return cards.find((item) => {
    const numberValue = normalizeCardSearchValue(item.number);
    const nameValue = normalizeTextSearchValue(item.name);
    const rarityValue = normalizeTextSearchValue(item.rarity);

    return (normalizedTerm && numberValue.includes(normalizedTerm))
      || (normalizedTextTerm && (nameValue.includes(normalizedTextTerm) || rarityValue.includes(normalizedTextTerm)));
  });
}

function getCardSearchMatch(searchTerm) {
  const normalizedTerm = normalizeCardSearchValue(searchTerm);
  if (!normalizedTerm) return null;

  const directNumberMatch = normalizedTerm.match(/^(\d{1,3})\/(\d{1,3})$/);
  if (directNumberMatch) {
    const exactOverride = getSpecialCardByExactNumber(null, normalizedTerm);
    if (exactOverride) {
      return {
        setName: exactOverride.setName || exactOverride.set || null,
        card: exactOverride
      };
    }

    return findExactCardAcrossCollections(searchTerm);
  }

  for (const setName of worldCollections) {
    const cards = getCardsForSet(setName);
    const card = findCardByQuery(cards, normalizedTerm, setName);

    if (card) {
      return { setName, card };
    }
  }

  return null;
}

function buildFallbackCardFromNumber(searchTerm) {
  const normalizedTerm = normalizeCardSearchValue(searchTerm);
  const [cardNumber, setTotal] = normalizedTerm.split('/');
  return {
    id: `search-${normalizedTerm}`,
    name: `Carta ${cardNumber} / ${setTotal}`,
    type: "Carta",
    rarity: "Desconhecida",
    art: "Carta TCG",
    set: `Set ${setTotal}`,
    setName: `Set ${setTotal}`,
    foil: "Normal",
    image: "",
    number: `${String(cardNumber).padStart(3, "0")}/${String(setTotal).padStart(3, "0")}`,
    inLibrary: false
  };
}

function getLocalCardSearchMatches(searchTerm, limit = 40) {
  const normalizedText = normalizeTextSearchValue(searchTerm);
  const normalizedNumber = normalizeCardSearchValue(searchTerm);
  if (!normalizedText && !normalizedNumber) return [];

  const results = [];
  const seen = new Set();

  for (const setName of worldCollections) {
    const cards = getCardsForSet(setName);
    for (const card of cards) {
      const nameValue = normalizeTextSearchValue(card.name);
      const numberValue = normalizeCardSearchValue(card.number);
      const rarityValue = normalizeTextSearchValue(card.rarity);

      const matches = (normalizedText && (nameValue.includes(normalizedText) || rarityValue.includes(normalizedText)))
        || (normalizedNumber && numberValue.includes(normalizedNumber));

      if (!matches) continue;
      if (seen.has(card.id)) continue;

      seen.add(card.id);
      results.push({
        ...card,
        setName: card.setName || card.set || setName,
        set: card.set || setName
      });

      if (results.length >= limit) return results;
    }
  }

  return results;
}

async function searchTcgCardByExactNumber(searchTerm) {
  try {
    const normalizedTerm = normalizeCardSearchValue(searchTerm);
    if (!normalizedTerm) return null;
    const query = `number:${normalizedTerm}`;
    const response = await fetch(`https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(query)}&pageSize=1`);
    if (!response.ok) return null;
    const payload = await response.json();
    const card = payload.data?.[0];
    if (!card) return null;

    return formatApiCard(card, card.set?.name || "Desconhecido");
  } catch (error) {
    return null;
  }
}

function renderStats() {
  const libraryItems = state.librarySetCards.length;
  const favorite = state.pokemonData.filter((pokemon) => pokemon.favorite).length;
  const types = [...new Set(state.pokemonData.map((pokemon) => pokemon.type))].length;

  statMap.total.textContent = state.pokemonData.length;
  statMap.captured.textContent = libraryItems;
  statMap.favorite.textContent = favorite;
  statMap.types.textContent = types;
}

function toggleLibraryCard(setName, cardId, cardPayload = null) {
  const cards = collectionCatalog[setName] || [];
  let card = cards.find((item) => item.id === cardId);

  if (!card && cardPayload) {
    card = { ...cardPayload, id: cardId, set: setName };
    card.inLibrary = Boolean(card.inLibrary);
    collectionCatalog[setName] = [...cards, card];
  }

  if (!card) return;

  card.inLibrary = !card.inLibrary;

  if (card.inLibrary) {
    if (!state.librarySetCards.some((item) => item.id === cardId)) {
      state.librarySetCards = [...state.librarySetCards, { ...card, set: setName }];
    }

    state.currentTab = "library";
    tabButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.tab === "library"));
    searchInput.placeholder = "Buscar na minha biblioteca...";
    searchInput.value = "";
    state.currentSearch = "";

    state.selectedPokemon = {
      id: `card-${cardId}`,
      name: card.name,
      type: card.rarity,
      typeKey: "normal",
      region: setName,
      description: `${card.art} da coleção ${setName}.`,
      hp: card.hp || 100,
      attack: 100,
      defense: 100,
      image: card.image || "",
      number: card.number || "",
      level: card.level || "",
      stage: card.stage || "",
      evolvesFrom: card.evolvesFrom || "",
      attacks: Array.isArray(card.attacks) ? card.attacks : [],
      weaknessText: card.weaknessText || "",
      resistanceText: card.resistanceText || "",
      retreatCost: card.retreatCost || "",
      favorite: true,
      captured: true,
      isCard: true,
      setName,
      cardId
    };
  } else {
    state.librarySetCards = state.librarySetCards.filter((item) => item.id !== cardId);
  }

  renderStats();
  renderCards();
  renderCollectionsLibrary();
  renderDetail();
}

function toggleFavoritePokemon(pokemonId) {
  const pokemon = state.pokemonData.find((item) => item.id === pokemonId);
  if (!pokemon) return;

  pokemon.favorite = !pokemon.favorite;
  pokemon.captured = pokemon.favorite;

  if (state.selectedPokemon && state.selectedPokemon.id === pokemonId) {
    state.selectedPokemon = pokemon;
  }

  renderStats();
  renderCards();
  renderDetail();
}

function openModal(item) {
  if (!item) return;

  const isCard = Boolean(item.isCard);
  const image = item.image || "";
  const typeLabel = isCard ? item.type : item.type;
  const typeLabels = Array.isArray(item.typeLabels) && item.typeLabels.length ? item.typeLabels : [item.type].filter(Boolean);
  const collectionLabel = isCard ? getCollectionDisplayName(item.setName || item.region || "") : getCollectionDisplayName(item.region || "");
  const abilities = Array.isArray(item.abilities) && item.abilities.length ? item.abilities : [];
  const weaknesses = Array.isArray(item.weaknesses) && item.weaknesses.length ? item.weaknesses : [];
  const collections = Array.isArray(item.collections) && item.collections.length ? item.collections : [];

  modalContent.innerHTML = `
    <div class="modal-body modal-body--enhanced">
      <div class="modal-hero">
        <div>
          <span class="card-id">${isCard ? "📚 Carta" : `#${String(item.id).padStart(3, "0")}`}</span>
          <h3 id="modal-title">${item.name}</h3>
          <p class="modal-subtitle">${isCard ? "Carta Pokémon em destaque para a sua biblioteca" : `${typeLabels.join(" / ")} • ${item.region || "Pokédex Oficial"}`}</p>
        </div>
        <div class="modal-badges">
          ${typeLabels.map((entry) => `<span class="badge ${getTypeClass(item.typeKey || "normal")}">${entry}</span>`).join("")}
        </div>
      </div>

      <div class="modal-image">
        ${image ? `<img src="${image}" alt="${item.name}" />` : '<span class="set-icon" style="font-size: 4.5rem;">🃏</span>'}
      </div>

      ${!isCard ? `
        <div class="modal-meta-grid">
          <div class="modal-meta-card">
            <span>Altura</span>
            <strong>${item.height ? `${item.height} m` : "—"}</strong>
          </div>
          <div class="modal-meta-card">
            <span>Peso</span>
            <strong>${item.weight ? `${item.weight} kg` : "—"}</strong>
          </div>
          <div class="modal-meta-card">
            <span>HP</span>
            <strong>${item.hp || 0}</strong>
          </div>
          <div class="modal-meta-card">
            <span>Ataque</span>
            <strong>${item.attack || 0}</strong>
          </div>
        </div>
      ` : `
        <div class="modal-meta-grid">
          <div class="modal-meta-card">
            <span>Número</span>
            <strong>${item.number || "—"}</strong>
          </div>
          <div class="modal-meta-card">
            <span>HP</span>
            <strong>${item.hp || "—"}</strong>
          </div>
          <div class="modal-meta-card">
            <span>Estágio</span>
            <strong>${item.stage || "—"}</strong>
          </div>
          <div class="modal-meta-card">
            <span>Evolui de</span>
            <strong>${item.evolvesFrom || "—"}</strong>
          </div>
        </div>
      `}

      <div class="modal-section">
        <h4>${isCard ? "Descrição" : "Descrição geral"}</h4>
        <p class="modal-description">${item.description || "Detalhes adicionais desta entrada aparecerão aqui."}</p>
      </div>

      ${isCard ? `
        <div class="modal-section">
          <h4>Ataques</h4>
          <div class="modal-tags">
            ${Array.isArray(item.attacks) && item.attacks.length
              ? item.attacks.map((attack) => `<span>${attack.name}${attack.damage ? ` (${attack.damage})` : ""}</span>`).join("")
              : "<span>Sem ataques registrados</span>"}
          </div>
          ${Array.isArray(item.attacks) && item.attacks.length
            ? `<p class="modal-description">${item.attacks.map((attack) => `${attack.name}${attack.damage ? ` (${attack.damage})` : ""}: ${attack.text || ""}`).join(" | ")}</p>`
            : ""}
        </div>

        <div class="modal-section">
          <h4>Dados de batalha</h4>
          <div class="modal-tags">
            <span>Fraqueza: ${item.weaknessText || "—"}</span>
            <span>Resistência: ${item.resistanceText || "—"}</span>
            <span>Custo para recuar: ${item.retreatCost || "—"}</span>
          </div>
        </div>
      ` : ""}

      ${!isCard ? `
        <div class="modal-section">
          <h4>Habilidades</h4>
          <div class="modal-tags">
            ${abilities.length ? abilities.map((ability) => `<span>${ability}</span>`).join("") : '<span>Sem habilidades listadas</span>'}
          </div>
        </div>

        <div class="modal-section">
          <h4>Fraquezas</h4>
          <div class="modal-tags">
            ${weaknesses.length ? weaknesses.map((itemWeakness) => `<span>${itemWeakness.name} ×${itemWeakness.multiplier}</span>`).join("") : '<span>Sem fraquezas registradas</span>'}
          </div>
        </div>
      ` : ""}

      <div class="modal-section">
        <h4>${isCard ? "Coleções" : "Coleções oficiais"}</h4>
        <div class="modal-tags">
          ${collections.length ? collections.map((collection) => `<span>${getCollectionDisplayName(collection)}</span>`).join("") : `<span>${collectionLabel || item.region || "Sem coleção registrada"}</span>`}
        </div>
      </div>

      <div class="modal-actions">
        <button class="secondary-btn" type="button" data-modal-action="library">
          ${isCard ? (item.captured ? "Remover da biblioteca" : "Adicionar à biblioteca") : (item.favorite ? "Remover da biblioteca" : "Adicionar à biblioteca")}
        </button>
        ${image ? `<a class="secondary-btn" href="${image}" download="${item.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png" target="_blank" rel="noreferrer">Download da imagem</a>` : ""}
      </div>
    </div>
  `;

  const libraryButton = modalContent.querySelector('[data-modal-action="library"]');
  if (libraryButton) {
    libraryButton.addEventListener("click", (event) => {
      event.stopPropagation();
      if (isCard && item.setName && item.cardId) {
        toggleLibraryCard(item.setName, item.cardId, item);
        openModal({ ...item, captured: !item.captured, favorite: !item.captured });
      } else {
        toggleFavoritePokemon(Number(item.id));
        openModal({ ...item, favorite: !item.favorite, captured: !item.favorite });
      }
    });
  }

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

function renderCards() {
  if (state.currentTab === "sets") {
    if (state.selectedCollection) {
      const cards = (collectionCatalog[state.selectedCollection] || []).filter((card) => {
        const searchTerm = normalizeCardSearchValue(state.currentSearch);
        if (!searchTerm) return true;
        const cardNumber = normalizeCardSearchValue(card.number);
        const cardName = normalizeCardSearchValue(card.name);
        const cardRarity = normalizeCardSearchValue(card.rarity);
        const cardText = `${cardNumber}${cardName}${cardRarity}`;
        return cardText.includes(searchTerm);
      });

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
              <p>${card.art} · ${card.number}</p>
            </div>

            <div class="card-footer">
              <span>${card.foil}</span>
              <button class="star-button ${card.inLibrary ? "active" : ""}" data-star-card-id="${card.id}" data-star-set-name="${state.selectedCollection}" aria-label="Adicionar esta carta à minha biblioteca">
                ${card.inLibrary ? "⭐" : "☆"}
              </button>
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

      grid.querySelectorAll(".star-button").forEach((button) => {
        button.addEventListener("click", (event) => {
          event.stopPropagation();
          toggleLibraryCard(button.dataset.starSetName, button.dataset.starCardId);
        });
      });

      grid.querySelectorAll(".set-card-detail").forEach((cardElement) => {
        cardElement.addEventListener("click", (event) => {
          if (event.target.closest(".star-button")) return;
          const cardId = cardElement.dataset.cardId;
          if (cardId && state.selectedCollection) {
            const card = (collectionCatalog[state.selectedCollection] || []).find((item) => item.id === cardId);
            if (card) {
              state.selectedPokemon = {
                id: card.id,
                name: card.name,
                type: card.rarity,
                typeKey: "normal",
                region: state.selectedCollection,
                description: `${card.art} · ${card.foil} · ${card.number}`,
                image: card.image || "",
                hp: card.hp || 100,
                attack: 100,
                defense: 100,
                number: card.number || "",
                level: card.level || "",
                stage: card.stage || "",
                evolvesFrom: card.evolvesFrom || "",
                attacks: Array.isArray(card.attacks) ? card.attacks : [],
                weaknessText: card.weaknessText || "",
                resistanceText: card.resistanceText || "",
                retreatCost: card.retreatCost || "",
                captured: card.inLibrary || false,
                favorite: card.inLibrary || false,
                isCard: true,
                setName: state.selectedCollection,
                cardId: card.id
              };
              openModal(state.selectedPokemon);
            }
          }
        });
      });

      renderDetail();
      return;
    }

    if (state.searchResultCards.length) {
      const searchResults = state.searchResultCards.filter((card) => {
        const searchTerm = normalizeTextSearchValue(state.currentSearch);
        if (!searchTerm) return true;
        const byName = normalizeTextSearchValue(card.name).includes(searchTerm);
        const byNumber = normalizeCardSearchValue(card.number).includes(normalizeCardSearchValue(state.currentSearch));
        return byName || byNumber;
      });

      if (!searchResults.length) {
        grid.innerHTML = '<div class="pokemon-card" style="grid-column: 1 / -1; padding: 32px; text-align:center; color: var(--muted);">Nenhuma carta encontrada para essa busca.</div>';
        state.selectedPokemon = null;
        renderDetail();
        return;
      }

      grid.innerHTML = `
        <div class="set-detail-header" style="grid-column: 1 / -1; margin-bottom: 8px;">
          <button class="secondary-btn" data-action="clear-search-results">← Voltar</button>
          <div>
            <p class="tag" style="margin: 0 0 8px;">Resultados da busca</p>
            <h3 style="margin: 0; font-size: clamp(1.5rem, 2vw, 2.3rem);">${searchResults.length} cartas para "${state.currentSearch}"</h3>
          </div>
        </div>
        ${searchResults.map((card) => `
          <article class="pokemon-card set-card-detail" data-card-id="${card.id}" data-set-name="${card.setName || card.set}">
            <div class="card-header">
              <span class="card-id">#${card.number}</span>
              <span class="badge normal">${card.rarity}</span>
            </div>

            <div class="sprite-box set-box">
              ${card.image ? `<img src="${card.image}" alt="${card.name}" />` : '<span class="set-icon">✨</span>'}
            </div>

            <div class="card-meta">
              <h3>${card.name}</h3>
              <p>${getCollectionDisplayName(card.setName || card.set)} · ${card.number}</p>
            </div>

            <div class="card-footer">
              <span>${card.foil || "Normal"}</span>
              <button class="star-button ${card.inLibrary ? "active" : ""}" data-star-card-id="${card.id}" data-star-set-name="${card.setName || card.set}" aria-label="Adicionar esta carta à minha biblioteca">
                ${card.inLibrary ? "⭐" : "☆"}
              </button>
            </div>
          </article>
        `).join("")}
      `;

      const clearButton = grid.querySelector('[data-action="clear-search-results"]');
      if (clearButton) {
        clearButton.addEventListener("click", () => {
          state.searchResultCards = [];
          state.currentSearch = "";
          searchInput.value = "";
          renderCards();
          renderDetail();
        });
      }

      grid.querySelectorAll(".star-button").forEach((button) => {
        button.addEventListener("click", (event) => {
          event.stopPropagation();
          const setName = button.dataset.starSetName;
          const cardId = button.dataset.starCardId;
          const cardPayload = searchResults.find((card) => card.id === cardId);
          toggleLibraryCard(setName, cardId, cardPayload || null);

          state.searchResultCards = state.searchResultCards.map((card) => {
            if (card.id !== cardId) return card;
            return { ...card, inLibrary: !card.inLibrary };
          });
        });
      });

      grid.querySelectorAll(".set-card-detail").forEach((cardElement) => {
        cardElement.addEventListener("click", (event) => {
          if (event.target.closest(".star-button")) return;
          const cardId = cardElement.dataset.cardId;
          const card = searchResults.find((item) => item.id === cardId);
          if (!card) return;

          state.selectedPokemon = {
            id: card.id,
            name: card.name,
            type: card.rarity,
            typeKey: "normal",
            region: card.setName || card.set,
            description: `${card.art} · ${card.foil} · ${card.number}`,
            image: card.image || "",
            hp: card.hp || 100,
            attack: 100,
            defense: 100,
            number: card.number || "",
            level: card.level || "",
            stage: card.stage || "",
            evolvesFrom: card.evolvesFrom || "",
            attacks: Array.isArray(card.attacks) ? card.attacks : [],
            weaknessText: card.weaknessText || "",
            resistanceText: card.resistanceText || "",
            retreatCost: card.retreatCost || "",
            captured: card.inLibrary || false,
            favorite: card.inLibrary || false,
            isCard: true,
            setName: card.setName || card.set,
            cardId: card.id
          };
          openModal(state.selectedPokemon);
        });
      });

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
      const collectionMeta = getCollectionMeta(setName);
      const imageMarkup = collectionMeta.image
        ? `<img class="set-image" src="${collectionMeta.image}" alt="${collectionMeta.displayName}" />`
        : `<span class="set-icon">🃏</span>`;

      return `
        <article class="pokemon-card set-card ${isActive ? "active" : ""}" data-set-name="${setName}">
          <div class="card-header">
            <span class="card-id">#${String(index + 1).padStart(3, "0")}</span>
            <span class="badge normal">TCG</span>
          </div>

          <div class="sprite-box set-box">
            ${imageMarkup}
          </div>

          <div class="card-meta">
            <h3>${collectionMeta.displayName}</h3>
            <p>${collectionMeta.description}</p>
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
        state.selectedPokemon = null;

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
    grid.innerHTML = '<div class="pokemon-card" style="grid-column: 1 / -1; padding: 32px; text-align:center; color: var(--muted);">Nenhum item na biblioteca.</div>';
    renderDetail();
    return;
  }

  grid.innerHTML = visible.map((pokemon) => {
    const isActive = state.selectedPokemon && state.selectedPokemon.id === pokemon.id;
    const typeClass = getTypeClass(pokemon.typeKey);
    const isCardItem = Boolean(pokemon.isCard);

    return `
      <article class="pokemon-card ${isActive ? "active" : ""}" data-id="${pokemon.id}">
        <div class="card-header">
          <span class="card-id">${isCardItem ? "📚" : `#${String(pokemon.id).padStart(3, "0")}`}</span>
          <span class="badge ${isCardItem ? "normal" : typeClass}">${isCardItem ? "Carta" : pokemon.type}</span>
        </div>

        <div class="sprite-box ${isCardItem ? "set-box" : ""}">
          ${pokemon.image
            ? `<img src="${pokemon.image}" alt="${pokemon.name}" />`
            : (isCardItem ? '<span class="set-icon">🃏</span>' : '<img src="" alt="${pokemon.name}" />')}
        </div>

        <div class="card-meta">
          <h3>${pokemon.name}</h3>
          <p>${isCardItem ? `${pokemon.region} · ${pokemon.type}` : pokemon.region}</p>
        </div>

        <div class="card-footer">
          <span>${isCardItem ? "Capturado" : (pokemon.captured ? "Capturado" : "Na lista")}</span>
          <button class="star-button ${pokemon.favorite ? "active" : ""}" data-star-id="${pokemon.id}" data-card-id="${isCardItem ? pokemon.cardId : ""}" data-set-name="${isCardItem ? pokemon.setName : ""}" aria-label="${isCardItem ? "Remover da minha biblioteca" : "Adicionar à minha biblioteca"}">
            ${pokemon.favorite ? "⭐" : "☆"}
          </button>
        </div>
      </article>
    `;
  }).join("");

  grid.querySelectorAll(".pokemon-card").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest(".star-button")) return;

      const id = card.dataset.id;
      const pokemon = visible.find((item) => String(item.id) === String(id));
      if (pokemon) {
        state.selectedPokemon = pokemon;
        renderDetail();
        openModal(pokemon);
      }
    });
  });

  grid.querySelectorAll(".star-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      if (button.dataset.cardId) {
        toggleLibraryCard(button.dataset.setName, button.dataset.cardId);
      } else {
        toggleFavoritePokemon(Number(button.dataset.starId));
      }
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
          ${selectedCards.map((card) => `<li ${card.inLibrary ? 'style="background: rgba(255, 203, 5, 0.16); border-color: rgba(255, 203, 5, 0.45); color: #fce7a6;"' : ""}>${card.number} · ${card.name} · ${card.rarity}${card.inLibrary ? " ★" : ""}</li>`).join("")}
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
    const collectionMeta = getCollectionMeta(name);
    const cards = collectionCatalog[name] || [];
    const totalCards = cards.length;
    const secretCards = cards.filter((card) => card.rarity.includes("Secret")).length;

    detailPanel.innerHTML = `
      <div class="detail-top">
        <div>
          <span class="card-id">#${String(state.selectedPokemon.id).padStart(3, "0")}</span>
          <h3>${collectionMeta.displayName}</h3>
        </div>
      </div>

      <div class="detail-photo">
        ${collectionMeta.image
          ? `<img class="set-image" src="${collectionMeta.image}" alt="${collectionMeta.displayName}" />`
          : '<span class="set-icon" style="font-size: 5rem; line-height: 1;">🃏</span>'}
      </div>

      <div class="detail-meta">
        <span class="badge normal">Coleção</span>
        <span class="badge" style="background: rgba(255,255,255,0.04); color: #dfe7ff;">${collectionMeta.displayName}</span>
      </div>

      <p class="detail-para">${collectionMeta.description}</p>

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

function switchToSetsForSearch() {
  if (state.currentTab === "sets") return;

  state.currentTab = "sets";
  tabButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.tab === "sets"));
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
}

async function searchCardAndOpenModal() {
  const requestId = ++latestSearchRequestId;
  const searchTerm = state.currentSearch;
  if (!searchTerm) {
    state.searchResultCards = [];
    renderCards();
    return;
  }

  switchToSetsForSearch();

  const extractedNumberSearch = extractCardNumberQuery(searchTerm);
  const numberSearchTerm = extractedNumberSearch || searchTerm;
  const isNumberSearch = Boolean(extractedNumberSearch);
  let matchedCard = null;

  if (isNumberSearch) {
    const exactSpecialCard = getSpecialCardByExactSearchTerm(numberSearchTerm);
    if (exactSpecialCard) {
      matchedCard = exactSpecialCard;
      state.selectedCollection = exactSpecialCard.setName || exactSpecialCard.set || null;
    }

    if (!matchedCard) {
      const exactMatch = findExactCardAcrossCollections(numberSearchTerm);
      if (exactMatch?.card) {
        state.selectedCollection = exactMatch.setName;
        matchedCard = exactMatch.card;
      }
    }

    if (!matchedCard) {
      matchedCard = buildFallbackCardFromNumber(numberSearchTerm);
    }

    state.searchResultCards = [];
  }

  if (!isNumberSearch) {
    const officialNameMatches = await searchOfficialCardsByName(searchTerm);
    if (requestId !== latestSearchRequestId) return;

    const fallbackLocalMatches = officialNameMatches.length ? [] : getLocalCardSearchMatches(searchTerm, 40);
    const combinedMatches = officialNameMatches.length ? officialNameMatches : fallbackLocalMatches;

    if (combinedMatches.length) {
      const libraryIds = new Set(state.librarySetCards.map((card) => card.id));
      state.searchResultCards = combinedMatches.map((card) => ({
        ...card,
        inLibrary: libraryIds.has(card.id)
      }));
      state.selectedCollection = null;
      state.selectedCollectionCard = null;
      state.selectedPokemon = null;
      renderCards();
      renderDetail();
      return;
    }

    const officialNameMatch = await searchOfficialCardByName(searchTerm);
    if (requestId !== latestSearchRequestId) return;
    if (officialNameMatch?.card) {
      state.selectedCollection = officialNameMatch.setName;
      matchedCard = officialNameMatch.card;
    }
  }

  const cardMatch = matchedCard ? null : getCardSearchMatch(numberSearchTerm);

  if (cardMatch?.setName) {
    state.selectedCollection = cardMatch.setName;
    state.selectedCollectionCard = null;
    try {
      await fetchSetCards(cardMatch.setName);
    } catch (error) {
      // Se a API falhar, seguimos com o card encontrado localmente.
    }

    if (requestId !== latestSearchRequestId) return;

    if (cardMatch.card) {
      const setCards = getCardsForSet(cardMatch.setName);
      const catalogCard = setCards.find((item) => {
        return item.id === cardMatch.card.id || normalizeCardSearchValue(item.number) === normalizeCardSearchValue(cardMatch.card.number);
      });
      matchedCard = catalogCard ? { ...catalogCard, ...cardMatch.card } : cardMatch.card;
    }
  }

  if (!matchedCard && isNumberSearch) {
    matchedCard = buildFallbackCardFromNumber(numberSearchTerm);
  }

  if (matchedCard) {
    if (requestId !== latestSearchRequestId) return;

    const cardItem = {
      id: matchedCard.id,
      name: matchedCard.name,
      type: matchedCard.rarity,
      typeKey: "normal",
      region: matchedCard.setName || matchedCard.set || "Coleção",
      description: `${matchedCard.art || "Carta Pokémon"} · ${matchedCard.number || searchTerm}`,
      image: matchedCard.image || "",
      hp: matchedCard.hp || 100,
      attack: 100,
      defense: 100,
      number: matchedCard.number || "",
      stage: matchedCard.stage || "",
      level: matchedCard.level || "",
      evolvesFrom: matchedCard.evolvesFrom || "",
      attacks: Array.isArray(matchedCard.attacks) ? matchedCard.attacks : [],
      weaknessText: matchedCard.weaknessText || "",
      resistanceText: matchedCard.resistanceText || "",
      retreatCost: matchedCard.retreatCost || "",
      captured: matchedCard.inLibrary || false,
      favorite: matchedCard.inLibrary || false,
      isCard: true,
      setName: matchedCard.setName || matchedCard.set,
      cardId: matchedCard.id
    };
    state.selectedPokemon = cardItem;
    openModal(cardItem);
  }

  renderCards();
}

searchInput.addEventListener("input", (event) => {
  latestSearchRequestId += 1;
  state.currentSearch = event.target.value.trim();
  state.searchResultCards = [];

  if (autoSearchTimeoutId) {
    clearTimeout(autoSearchTimeoutId);
    autoSearchTimeoutId = null;
  }

  if (isCardNumberQuery(state.currentSearch)) {
    autoSearchTimeoutId = setTimeout(async () => {
      if (searchInput.value.trim() !== state.currentSearch) return;
      await searchCardAndOpenModal();
    }, 350);
  }

  if (state.currentTab === "sets") {
    renderCards();
  }
});

searchInput.addEventListener("keydown", async (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  if (autoSearchTimeoutId) {
    clearTimeout(autoSearchTimeoutId);
    autoSearchTimeoutId = null;
  }
  state.currentSearch = searchInput.value.trim();
  await searchCardAndOpenModal();
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
      state.searchResultCards = [];
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
      state.searchResultCards = [];
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
  grid.innerHTML = '<div class="pokemon-card" style="grid-column: 1 / -1; padding: 32px; text-align:center; color: var(--muted);">Carregando Pokémon e coleções oficiais...</div>';

  state.currentSearch = "";
  searchInput.value = "";
  searchInput.placeholder = "Buscar Pokémon...";

  await loadCollectionMetadata();
  state.pokemonData = await loadPokemonData();
  state.selectedPokemon = state.pokemonData[0];
  await fetchSetCards("Base Set");

  renderStats();
  renderCards();
  renderDetail();
}

document.querySelectorAll("[data-close-modal]").forEach((element) => {
  element.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

init();
