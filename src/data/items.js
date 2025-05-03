export const itemList = [
  {
    category: "Helms",
    items: [
      {
        id: 1,
        type: "Helm",
        name: "Casco de Cuero",
        description: "Descripcion",
        nivel: 1,
        stats: {
          hp: 0, mana: 0, atkFisico: 0, defFisica: 2,
          atkMagico: 0, defMagica: 0, presicion: 0, evasion: 0
        },
        selleable: true,
        coste: 100,
        usableBy: ["Guerrero", "Mago", "Arquero"]
      },
      {
        id: 2,
        type: "Helm",
        name: "Casco de Lata",
        description: "Descripcion",
        nivel: 2,
        stats: {
          hp: 0, mana: 0, atkFisico: 0, defFisica: 3,
          atkMagico: 0, defMagica: 1, presicion: 0, evasion: 0
        },
        selleable: true,
        coste: 110,
        usableBy: ["Guerrero", "Mago", "Arquero"]
      },
      {
        id: 3,
        type: "Helm",
        name: "Casco de Cadenas",
        description: "Descripcion",
        nivel: 2,
        stats: {
          hp: 0, mana: 0, atkFisico: 0, defFisica: 2,
          atkMagico: 0, defMagica: 2, presicion: 0, evasion: 0
        },
        selleable: true,
        coste: 120,
        usableBy: ["Guerrero", "Arquero"]
      },
      {
        id: 4,
        type: "Helm",
        name: "Casco de Hierro",
        description: "Descripcion",
        nivel: 3,
        stats: {
          hp: 0, mana: 0, atkFisico: 0, defFisica: 3,
          atkMagico: 0, defMagica: 1, presicion: 0, evasion: 1
        },
        selleable: true,
        coste: 130,
        usableBy: ["Guerrero", "Arquero"]
      },
      {
        id: 5,
        type: "Helm",
        name: "Casco de Acero",
        description: "Descripcion",
        nivel: 4,
        stats: {
          hp: 0, mana: 0, atkFisico: 0, defFisica: 4,
          atkMagico: 0, defMagica: 2, presicion: 0, evasion: -1
        },
        selleable: true,
        coste: 150,
        usableBy: ["Guerrero"]
      },
      {
        id: 6,
        type: "Helm",
        name: "Casco de Cristal",
        description: "Descripcion",
        nivel: 4,
        stats: {
          hp: 0, mana: 50, atkFisico: 0, defFisica: 1,
          atkMagico: 3, defMagica: 4, presicion: 0, evasion: 1
        },
        selleable: true,
        coste: 180,
        usableBy: ["Mago"]
      },
      {
        id: 7,
        type: "Helm",
        name: "Casco de Dragón",
        description: "Descripcion",
        nivel: 6,
        stats: {
          hp: 50, mana: 20, atkFisico: 2, defFisica: 5,
          atkMagico: 2, defMagica: 3, presicion: 1, evasion: -1
        },
        selleable: true,
        coste: 250,
        usableBy: ["Guerrero", "Mago"]
      },
      {
        id: 8,
        type: "Helm",
        name: "Casco de Sombras",
        description: "Descripcion",
        nivel: 6,
        stats: {
          hp: 10, mana: 40, atkFisico: 0, defFisica: 2,
          atkMagico: 5, defMagica: 6, presicion: 2, evasion: 3
        },
        selleable: true,
        coste: 220,
        usableBy: ["Mago"]
      },
      {
        id: 9,
        type: "Helm",
        name: "Casco de Centinela",
        description: "Descripcion",
        nivel: 7,
        stats: {
          hp: 20, mana: 10, atkFisico: 1, defFisica: 4,
          atkMagico: 0, defMagica: 2, presicion: 2, evasion: 2
        },
        selleable: true,
        coste: 200,
        usableBy: ["Guerrero", "Arquero"]
      },
      {
        id: 10,
        type: "Helm",
        name: "Casco del Destino",
        description: "Descripcion",
        nivel: 9,
        stats: {
          hp: 100, mana: 50, atkFisico: 5, defFisica: 8,
          atkMagico: 5, defMagica: 5, presicion: 3, evasion: -2
        },
        selleable: true,
        coste: 400,
        usableBy: ["Guerrero", "Mago", "Arquero"]
      },
      // Nivel 14
      {
        id: 11,
        type: "Helm",
        name: "Casco del Ancestro",
        description: "Un casco resistente con grabados antiguos.",
        nivel: 14,
        stats: {
          hp: 30, mana: 15, atkFisico: 3, defFisica: 12,
          atkMagico: 2, defMagica: 7, presicion: 2, evasion: 1
        },
        selleable: true,
        coste: 500,
        usableBy: ["Guerrero"]
      },
      {
        id: 12,
        type: "Helm",
        name: "Casco de Centella",
        description: "Un casco ligero que mejora la agilidad.",
        nivel: 14,
        stats: {
          hp: 20, mana: 30, atkFisico: 0, defFisica: 8,
          atkMagico: 6, defMagica: 12, presicion: 3, evasion: 4
        },
        selleable: true,
        coste: 520,
        usableBy: ["Mago"]
      },
      {
        id: 13,
        type: "Helm",
        name: "Casco del Vigilante",
        description: "Un casco con visión mística.",
        nivel: 14,
        stats: {
          hp: 25, mana: 10, atkFisico: 2, defFisica: 10,
          atkMagico: 3, defMagica: 6, presicion: 4, evasion: 2
        },
        selleable: true,
        coste: 540,
        usableBy: ["Guerrero", "Arquero"]
      },

      // Nivel 15
      {
        id: 14,
        type: "Helm",
        name: "Casco de Dragón Espectral",
        description: "Un casco ornamentado con esencia mágica.",
        nivel: 15,
        stats: {
          hp: 40, mana: 20, atkFisico: 4, defFisica: 14,
          atkMagico: 6, defMagica: 10, presicion: 3, evasion: -1
        },
        selleable: true,
        coste: 600,
        usableBy: ["Guerrero"]
      },
      {
        id: 15,
        type: "Helm",
        name: "Casco de Cristal Eterno",
        description: "Su superficie refleja la luz y mejora la concentración.",
        nivel: 15,
        stats: {
          hp: 30, mana: 50, atkFisico: 0, defFisica: 8,
          atkMagico: 10, defMagica: 15, presicion: 4, evasion: 3
        },
        selleable: true,
        coste: 620,
        usableBy: ["Mago"]
      },
      {
        id: 16,
        type: "Helm",
        name: "Casco del Arquero Supremo",
        description: "Diseñado para una visión impecable.",
        nivel: 15,
        stats: {
          hp: 35, mana: 15, atkFisico: 3, defFisica: 12,
          atkMagico: 5, defMagica: 8, presicion: 5, evasion: 2
        },
        selleable: true,
        coste: 640,
        usableBy: ["Arquero"]
      },

      // Nivel 16
      {
        id: 17,
        type: "Helm",
        name: "Casco del Titán de Hierro",
        description: "Un casco robusto con resistencia extrema.",
        nivel: 16,
        stats: {
          hp: 50, mana: 30, atkFisico: 6, defFisica: 16,
          atkMagico: 8, defMagica: 12, presicion: 3, evasion: -2
        },
        selleable: true,
        coste: 700,
        usableBy: ["Guerrero"]
      },
      {
        id: 18,
        type: "Helm",
        name: "Casco Arcano Celestial",
        description: "Su interior brilla con energía mágica.",
        nivel: 16,
        stats: {
          hp: 40, mana: 60, atkFisico: 0, defFisica: 10,
          atkMagico: 12, defMagica: 18, presicion: 5, evasion: 3
        },
        selleable: true,
        coste: 720,
        usableBy: ["Mago"]
      },
      {
        id: 19,
        type: "Helm",
        name: "Casco del Guardián de las Sombras",
        description: "Un casco que mejora la percepción en la oscuridad.",
        nivel: 16,
        stats: {
          hp: 45, mana: 20, atkFisico: 4, defFisica: 14,
          atkMagico: 6, defMagica: 10, presicion: 6, evasion: 2
        },
        selleable: true,
        coste: 740,
        usableBy: ["Guerrero", "Arquero"]
      },

      // Nivel 17 - 20 (siguiendo la misma lógica)      
    ]
  },
  {
    category: "Armors",
    items: [
      {
        id: 1,
        type: "Armor",
        name: "Armadura de Cuero",
        description: "Descripcion",
        nivel: 1,
        stats: {
          hp: 0, mana: 0, atkFisico: 0, defFisica: 4,
          atkMagico: 0, defMagica: 1, presicion: 0, evasion: 0
        },
        selleable: true,
        coste: 150,
        usableBy: ["Guerrero", "Mago", "Arquero"]
      },
      {
        id: 2,
        type: "Armor",
        name: "Armadura de Hierro",
        description: "Descripcion",
        nivel: 2,
        stats: {
          hp: 20, mana: 0, atkFisico: 1, defFisica: 6,
          atkMagico: 0, defMagica: 2, presicion: 0, evasion: -1
        },
        selleable: true,
        coste: 200,
        usableBy: ["Guerrero"]
      },
      {
        id: 3,
        type: "Armor",
        name: "Armadura de Acero",
        description: "Descripcion",
        nivel: 3,
        stats: {
          hp: 30, mana: 0, atkFisico: 2, defFisica: 8,
          atkMagico: 0, defMagica: 3, presicion: 0, evasion: -2
        },
        selleable: true,
        coste: 250,
        usableBy: ["Guerrero"]
      },
      {
        id: 4,
        type: "Armor",
        name: "Túnica Arcana",
        description: "Descripcion",
        nivel: 4,
        stats: {
          hp: 10, mana: 50, atkFisico: 0, defFisica: 3,
          atkMagico: 5, defMagica: 7, presicion: 1, evasion: 2
        },
        selleable: true,
        coste: 280,
        usableBy: ["Mago"]
      },
      {
        id: 5,
        type: "Armor",
        name: "Armadura de Dragón",
        description: "Descripcion",
        nivel: 6,
        stats: {
          hp: 50, mana: 30, atkFisico: 4, defFisica: 10,
          atkMagico: 3, defMagica: 5, presicion: 2, evasion: -1
        },
        selleable: true,
        coste: 400,
        usableBy: ["Guerrero", "Mago"]
      },
      {
        id: 6,
        type: "Armor",
        name: "Túnica de Sombras",
        description: "Descripcion",
        nivel: 6,
        stats: {
          hp: 15, mana: 40, atkFisico: 0, defFisica: 4,
          atkMagico: 8, defMagica: 9, presicion: 3, evasion: 4
        },
        selleable: true,
        coste: 350,
        usableBy: ["Mago"]
      },
      {
        id: 7,
        type: "Armor",
        name: "Armadura de Centinela",
        description: "Descripcion",
        nivel: 7,
        stats: {
          hp: 25, mana: 15, atkFisico: 3, defFisica: 7,
          atkMagico: 0, defMagica: 4, presicion: 2, evasion: 2
        },
        selleable: true,
        coste: 300,
        usableBy: ["Guerrero", "Arquero"]
      },
      {
        id: 8,
        type: "Armor",
        name: "Túnica del Sabio",
        description: "Descripcion",
        nivel: 8,
        stats: {
          hp: 30, mana: 50, atkFisico: 0, defFisica: 5,
          atkMagico: 6, defMagica: 10, presicion: 3, evasion: 5
        },
        selleable: true,
        coste: 380,
        usableBy: ["Mago"]
      },
      {
        id: 9,
        type: "Armor",
        name: "Armadura del Guardián",
        description: "Descripcion",
        nivel: 9,
        stats: {
          hp: 40, mana: 20, atkFisico: 5, defFisica: 12,
          atkMagico: 2, defMagica: 6, presicion: 3, evasion: -1
        },
        selleable: true,
        coste: 420,
        usableBy: ["Guerrero"]
      },
      {
        id: 10,
        type: "Armor",
        name: "Armadura del Destino",
        description: "Descripcion",
        nivel: 12,
        stats: {
          hp: 80, mana: 40, atkFisico: 7, defFisica: 15,
          atkMagico: 5, defMagica: 8, presicion: 4, evasion: -2
        },
        selleable: true,
        coste: 500,
        usableBy: ["Guerrero", "Mago", "Arquero"]
      },
      // Nivel 14
      {
        id: 11,
        type: "Armor",
        name: "Armadura del Ancestro",
        description: "Forjada con materiales de una era antigua, otorga gran resistencia.",
        nivel: 14,
        stats: {
          hp: 100, mana: 30, atkFisico: 5, defFisica: 16,
          atkMagico: 4, defMagica: 10, presicion: 3, evasion: -1
        },
        selleable: true,
        coste: 800,
        usableBy: ["Guerrero"]
      },
      {
        id: 12,
        type: "Armor",
        name: "Túnica de Luz Arcana",
        description: "Infundida con poder místico, mejora la magia del portador.",
        nivel: 14,
        stats: {
          hp: 50, mana: 80, atkFisico: 0, defFisica: 10,
          atkMagico: 10, defMagica: 18, presicion: 4, evasion: 3
        },
        selleable: true,
        coste: 820,
        usableBy: ["Mago"]
      },
      {
        id: 13,
        type: "Armor",
        name: "Armadura de Cazador Nocturno",
        description: "Un diseño ligero que otorga velocidad y precisión.",
        nivel: 14,
        stats: {
          hp: 80, mana: 40, atkFisico: 3, defFisica: 14,
          atkMagico: 5, defMagica: 8, presicion: 5, evasion: 4
        },
        selleable: true,
        coste: 840,
        usableBy: ["Arquero"]
      },

      // Nivel 15
      {
        id: 14,
        type: "Armor",
        name: "Armadura de Acero Celestial",
        description: "Resistente como la piedra, su brillo impone respeto.",
        nivel: 15,
        stats: {
          hp: 120, mana: 40, atkFisico: 6, defFisica: 18,
          atkMagico: 5, defMagica: 12, presicion: 3, evasion: -2
        },
        selleable: true,
        coste: 900,
        usableBy: ["Guerrero"]
      },
      {
        id: 15,
        type: "Armor",
        name: "Túnica de las Estrellas",
        description: "Tejida con energía cósmica, fortalece la magia.",
        nivel: 15,
        stats: {
          hp: 60, mana: 100, atkFisico: 0, defFisica: 12,
          atkMagico: 12, defMagica: 20, presicion: 5, evasion: 3
        },
        selleable: true,
        coste: 920,
        usableBy: ["Mago"]
      },
      {
        id: 16,
        type: "Armor",
        name: "Armadura del Guardián Sombrío",
        description: "Diseñada para una defensa total en combate cuerpo a cuerpo.",
        nivel: 15,
        stats: {
          hp: 100, mana: 50, atkFisico: 4, defFisica: 16,
          atkMagico: 6, defMagica: 10, presicion: 5, evasion: 2
        },
        selleable: true,
        coste: 940,
        usableBy: ["Guerrero", "Arquero"]
      },

      // Nivel 16
      {
        id: 17,
        type: "Armor",
        name: "Armadura del Titán de Guerra",
        description: "Una defensa impenetrable que domina el campo de batalla.",
        nivel: 16,
        stats: {
          hp: 140, mana: 60, atkFisico: 7, defFisica: 20,
          atkMagico: 6, defMagica: 15, presicion: 3, evasion: -2
        },
        selleable: true,
        coste: 1000,
        usableBy: ["Guerrero"]
      },
      {
        id: 18,
        type: "Armor",
        name: "Túnica de Energía Radiante",
        description: "Canaliza una inmensa cantidad de maná para hechizos devastadores.",
        nivel: 16,
        stats: {
          hp: 70, mana: 120, atkFisico: 0, defFisica: 14,
          atkMagico: 15, defMagica: 24, presicion: 6, evasion: 3
        },
        selleable: true,
        coste: 1020,
        usableBy: ["Mago"]
      },
      {
        id: 19,
        type: "Armor",
        name: "Armadura del Centinela de la Tormenta",
        description: "Protege al usuario de impactos y mejora la movilidad.",
        nivel: 16,
        stats: {
          hp: 120, mana: 60, atkFisico: 5, defFisica: 18,
          atkMagico: 7, defMagica: 12, presicion: 6, evasion: 2
        },
        selleable: true,
        coste: 1040,
        usableBy: ["Guerrero", "Arquero"]
      },

      // Nivel 17 - 20 (siguiendo la misma lógica)
    ]
  },
  {
    category: "Pants",
    items: [
      {
        id: 1,
        type: "Pants",
        name: "Pantalones de Cuero",
        description: "Descripcion",
        nivel: 1,
        stats: {
          hp: 0, mana: 0, atkFisico: 0, defFisica: 2,
          atkMagico: 0, defMagica: 1, presicion: 0, evasion: 0
        },
        selleable: true,
        coste: 110,
        usableBy: ["Guerrero", "Mago", "Arquero"]
      },
      {
        id: 2,
        type: "Pants",
        name: "Pantalones de Lino",
        description: "Descripcion",
        nivel: 2,
        stats: {
          hp: 5, mana: 10, atkFisico: 0, defFisica: 2,
          atkMagico: 1, defMagica: 3, presicion: 0, evasion: 1
        },
        selleable: true,
        coste: 130,
        usableBy: ["Mago", "Arquero"]
      },
      {
        id: 3,
        type: "Pants",
        name: "Pantalones Reforzados",
        description: "Descripcion",
        nivel: 2,
        stats: {
          hp: 10, mana: 0, atkFisico: 1, defFisica: 4,
          atkMagico: 0, defMagica: 2, presicion: 0, evasion: -1
        },
        selleable: true,
        coste: 150,
        usableBy: ["Guerrero"]
      },
      {
        id: 4,
        type: "Pants",
        name: "Pantalones Encantados",
        description: "Descripcion",
        nivel: 3,
        stats: {
          hp: 5, mana: 20, atkFisico: 0, defFisica: 3,
          atkMagico: 3, defMagica: 5, presicion: 0, evasion: 2
        },
        selleable: true,
        coste: 180,
        usableBy: ["Mago"]
      },
      {
        id: 5,
        type: "Pants",
        name: "Grebas de Acero",
        description: "Descripcion",
        nivel: 4,
        stats: {
          hp: 20, mana: 0, atkFisico: 2, defFisica: 6,
          atkMagico: 0, defMagica: 2, presicion: 1, evasion: -2
        },
        selleable: true,
        coste: 210,
        usableBy: ["Guerrero"]
      },
      {
        id: 6,
        type: "Pants",
        name: "Pantalones de Sombras",
        description: "Descripcion",
        nivel: 4,
        stats: {
          hp: 15, mana: 30, atkFisico: 0, defFisica: 3,
          atkMagico: 6, defMagica: 7, presicion: 1, evasion: 3
        },
        selleable: true,
        coste: 230,
        usableBy: ["Mago"]
      },
      {
        id: 7,
        type: "Pants",
        name: "Grebas de Titán",
        description: "Descripcion",
        nivel: 6,
        stats: {
          hp: 30, mana: 10, atkFisico: 3, defFisica: 8,
          atkMagico: 0, defMagica: 3, presicion: 2, evasion: -1
        },
        selleable: true,
        coste: 250,
        usableBy: ["Guerrero"]
      },
      {
        id: 8,
        type: "Pants",
        name: "Pantalones Místicos",
        description: "Descripcion",
        nivel: 6,
        stats: {
          hp: 20, mana: 40, atkFisico: 0, defFisica: 4,
          atkMagico: 5, defMagica: 9, presicion: 3, evasion: 4
        },
        selleable: true,
        coste: 270,
        usableBy: ["Mago"]
      },
      {
        id: 9,
        type: "Pants",
        name: "Pantalones del Guardián",
        description: "Descripcion",
        nivel: 8,
        stats: {
          hp: 35, mana: 20, atkFisico: 4, defFisica: 10,
          atkMagico: 2, defMagica: 4, presicion: 2, evasion: -1
        },
        selleable: true,
        coste: 300,
        usableBy: ["Guerrero"]
      },
      {
        id: 10,
        type: "Pants",
        name: "Pantalones del Destino",
        description: "Descripcion",
        nivel: 10,
        stats: {
          hp: 50, mana: 30, atkFisico: 5, defFisica: 12,
          atkMagico: 5, defMagica: 6, presicion: 4, evasion: -2
        },
        selleable: true,
        coste: 350,
        usableBy: ["Guerrero", "Mago", "Arquero"]
      },
      // Nivel 14
      {
        "id": 11,
        "type": "Pants",
        "name": "Grebas del Ancestro",
        "description": "Protegen con la fuerza de la tradición antigua.",
        "nivel": 14,
        "stats": {
          "hp": 80, "mana": 30, "atkFisico": 4, "defFisica": 14,
          "atkMagico": 3, "defMagica": 9, "presicion": 2, "evasion": 0
        },
        "selleable": true,
        "coste": 800,
        "usableBy": ["Guerrero"]
      },
      {
        "id": 12,
        "type": "Pants",
        "name": "Pantalones de Cristal Arcano",
        "description": "Conectan el flujo del maná con el usuario.",
        "nivel": 14,
        "stats": {
          "hp": 40, "mana": 70, "atkFisico": 0, "defFisica": 10,
          "atkMagico": 8, "defMagica": 15, "presicion": 3, "evasion": 3
        },
        "selleable": true,
        "coste": 820,
        "usableBy": ["Mago"]
      },
      {
        "id": 13,
        "type": "Pants",
        "name": "Grebas de Cazador Nocturno",
        "description": "Diseñadas para velocidad y precisión.",
        "nivel": 14,
        "stats": {
          "hp": 60, "mana": 40, "atkFisico": 3, "defFisica": 12,
          "atkMagico": 5, "defMagica": 8, "presicion": 4, "evasion": 4
        },
        "selleable": true,
        "coste": 840,
        "usableBy": ["Arquero"]
      },

      // Nivel 15
      {
        "id": 14,
        "type": "Pants",
        "name": "Grebas del Guardián de Hierro",
        "description": "Forjadas con materiales indestructibles.",
        "nivel": 15,
        "stats": {
          "hp": 100, "mana": 40, "atkFisico": 6, "defFisica": 16,
          "atkMagico": 5, "defMagica": 12, "presicion": 3, "evasion": -1
        },
        "selleable": true,
        "coste": 900,
        "usableBy": ["Guerrero"]
      },
      {
        "id": 15,
        "type": "Pants",
        "name": "Pantalones de las Estrellas",
        "description": "Tejidos con energía cósmica.",
        "nivel": 15,
        "stats": {
          "hp": 50, "mana": 90, "atkFisico": 0, "defFisica": 12,
          "atkMagico": 10, "defMagica": 18, "presicion": 5, "evasion": 3
        },
        "selleable": true,
        "coste": 920,
        "usableBy": ["Mago"]
      },
      {
        "id": 16,
        "type": "Pants",
        "name": "Grebas del Explorador Sombrío",
        "description": "Diseñadas para una rápida movilidad.",
        "nivel": 15,
        "stats": {
          "hp": 80, "mana": 50, "atkFisico": 4, "defFisica": 14,
          "atkMagico": 6, "defMagica": 10, "presicion": 5, "evasion": 3
        },
        "selleable": true,
        "coste": 940,
        "usableBy": ["Guerrero", "Arquero"]
      },

      // Nivel 16
      {
        "id": 17,
        "type": "Pants",
        "name": "Grebas del Titán de Guerra",
        "description": "Un blindaje impenetrable en combate.",
        "nivel": 16,
        "stats": {
          "hp": 120, "mana": 60, "atkFisico": 7, "defFisica": 18,
          "atkMagico": 6, "defMagica": 13, "presicion": 3, "evasion": -2
        },
        "selleable": true,
        "coste": 1000,
        "usableBy": ["Guerrero"]
      },
      {
        "id": 18,
        "type": "Pants",
        "name": "Pantalones de Energía Radiante",
        "description": "Brillan con el poder puro del maná.",
        "nivel": 16,
        "stats": {
          "hp": 60, "mana": 110, "atkFisico": 0, "defFisica": 14,
          "atkMagico": 12, "defMagica": 20, "presicion": 6, "evasion": 4
        },
        "selleable": true,
        "coste": 1020,
        "usableBy": ["Mago"]
      },
      {
        "id": 19,
        "type": "Pants",
        "name": "Grebas del Centinela de la Tormenta",
        "description": "Protegen de impactos devastadores.",
        "nivel": 16,
        "stats": {
          "hp": 90, "mana": 60, "atkFisico": 5, "defFisica": 16,
          "atkMagico": 7, "defMagica": 12, "presicion": 6, "evasion": 3
        },
        "selleable": true,
        "coste": 1040,
        "usableBy": ["Guerrero", "Arquero"]
      },

      // Nivel 17 - 20 (siguiendo la misma lógica)
    ]
  },
  {
    category: "Gloves",
    items: [
      {
        id: 1,
        type: "Gloves",
        name: "Guantes de Cuero",
        description: "Descripcion",
        nivel: 1,
        stats: {
          hp: 0, mana: 0, atkFisico: 0, defFisica: 1,
          atkMagico: 0, defMagica: 2, presicion: 0, evasion: 0
        },
        selleable: true,
        coste: 70,
        usableBy: ["Guerrero", "Mago", "Arquero"]
      },
      {
        id: 2,
        type: "Gloves",
        name: "Guantes Reforzados",
        description: "Descripcion",
        nivel: 2,
        stats: {
          hp: 5, mana: 0, atkFisico: 1, defFisica: 2,
          atkMagico: 0, defMagica: 2, presicion: 0, evasion: 1
        },
        selleable: true,
        coste: 90,
        usableBy: ["Guerrero"]
      },
      {
        id: 3,
        type: "Gloves",
        name: "Guantes Encantados",
        description: "Descripcion",
        nivel: 3,
        stats: {
          hp: 0, mana: 20, atkFisico: 0, defFisica: 1,
          atkMagico: 3, defMagica: 4, presicion: 1, evasion: 2
        },
        selleable: true,
        coste: 120,
        usableBy: ["Mago"]
      },
      {
        id: 4,
        type: "Gloves",
        name: "Guantes de Acero",
        description: "Descripcion",
        nivel: 3,
        stats: {
          hp: 10, mana: 0, atkFisico: 2, defFisica: 3,
          atkMagico: 0, defMagica: 2, presicion: 1, evasion: -1
        },
        selleable: true,
        coste: 140,
        usableBy: ["Guerrero"]
      },
      {
        id: 5,
        type: "Gloves",
        name: "Guantes de Batalla",
        description: "Descripcion",
        nivel: 4,
        stats: {
          hp: 15, mana: 10, atkFisico: 3, defFisica: 4,
          atkMagico: 1, defMagica: 3, presicion: 2, evasion: 0
        },
        selleable: true,
        coste: 160,
        usableBy: ["Guerrero"]
      },
      {
        id: 6,
        type: "Gloves",
        name: "Guantes de Sombras",
        description: "Descripcion",
        nivel: 4,
        stats: {
          hp: 10, mana: 30, atkFisico: 0, defFisica: 2,
          atkMagico: 5, defMagica: 6, presicion: 2, evasion: 3
        },
        selleable: true,
        coste: 180,
        usableBy: ["Mago"]
      },
      {
        id: 7,
        type: "Gloves",
        name: "Guantes de Titán",
        description: "Descripcion",
        nivel: 6,
        stats: {
          hp: 20, mana: 5, atkFisico: 4, defFisica: 5,
          atkMagico: 0, defMagica: 3, presicion: 3, evasion: -2
        },
        selleable: true,
        coste: 200,
        usableBy: ["Guerrero"]
      },
      {
        id: 8,
        type: "Gloves",
        name: "Guantes Místicos",
        description: "Descripcion",
        nivel: 6,
        stats: {
          hp: 25, mana: 40, atkFisico: 0, defFisica: 3,
          atkMagico: 6, defMagica: 8, presicion: 3, evasion: 4
        },
        selleable: true,
        coste: 220,
        usableBy: ["Mago"]
      },
      {
        id: 9,
        type: "Gloves",
        name: "Guantes del Guardián",
        description: "Descripcion",
        nivel: 8,
        stats: {
          hp: 35, mana: 15, atkFisico: 5, defFisica: 6,
          atkMagico: 2, defMagica: 4, presicion: 3, evasion: -1
        },
        selleable: true,
        coste: 250,
        usableBy: ["Guerrero"]
      },
      {
        id: 10,
        type: "Gloves",
        name: "Guantes del Destino",
        description: "Descripcion",
        nivel: 10,
        stats: {
          hp: 50, mana: 30, atkFisico: 6, defFisica: 8,
          atkMagico: 5, defMagica: 6, presicion: 4, evasion: -2
        },
        selleable: true,
        coste: 300,
        usableBy: ["Guerrero", "Mago", "Arquero"]
      }
    ]
  },
  {
    category: "Boots",
    items: [
      {
        id: 1,
        type: "Boots",
        name: "Botas de Cuero",
        description: "Descripcion",
        nivel: 1,
        stats: {
          hp: 0, mana: 0, atkFisico: 0, defFisica: 1,
          atkMagico: 0, defMagica: 2, presicion: 0, evasion: 0
        },
        selleable: true,
        coste: 70,
        usableBy: ["Guerrero", "Mago", "Arquero"]
      },
      {
        id: 2,
        type: "Boots",
        name: "Botas Reforzadas",
        description: "Descripcion",
        nivel: 2,
        stats: {
          hp: 5, mana: 0, atkFisico: 1, defFisica: 2,
          atkMagico: 0, defMagica: 2, presicion: 0, evasion: 1
        },
        selleable: true,
        coste: 90,
        usableBy: ["Guerrero", "Arquero"]
      },
      {
        id: 3,
        type: "Boots",
        name: "Botas Encantadas",
        description: "Descripcion",
        nivel: 3,
        stats: {
          hp: 0, mana: 20, atkFisico: 0, defFisica: 1,
          atkMagico: 3, defMagica: 4, presicion: 1, evasion: 2
        },
        selleable: true,
        coste: 120,
        usableBy: ["Mago"]
      },
      {
        id: 4,
        type: "Boots",
        name: "Botas de Acero",
        description: "Descripcion",
        nivel: 3,
        stats: {
          hp: 10, mana: 0, atkFisico: 2, defFisica: 3,
          atkMagico: 0, defMagica: 2, presicion: 1, evasion: -1
        },
        selleable: true,
        coste: 140,
        usableBy: ["Guerrero"]
      },
      {
        id: 5,
        type: "Boots",
        name: "Botas de Batalla",
        description: "Descripcion",
        nivel: 4,
        stats: {
          hp: 15, mana: 10, atkFisico: 3, defFisica: 4,
          atkMagico: 1, defMagica: 3, presicion: 2, evasion: 0
        },
        selleable: true,
        coste: 160,
        usableBy: ["Guerrero"]
      },
      {
        id: 6,
        type: "Boots",
        name: "Botas de Sombras",
        description: "Descripcion",
        nivel: 4,
        stats: {
          hp: 10, mana: 30, atkFisico: 0, defFisica: 2,
          atkMagico: 5, defMagica: 6, presicion: 2, evasion: 3
        },
        selleable: true,
        coste: 180,
        usableBy: ["Mago"]
      },
      {
        id: 7,
        type: "Boots",
        name: "Botas de Titán",
        description: "Descripcion",
        nivel: 6,
        stats: {
          hp: 20, mana: 5, atkFisico: 4, defFisica: 5,
          atkMagico: 0, defMagica: 3, presicion: 3, evasion: -2
        },
        selleable: true,
        coste: 200,
        usableBy: ["Guerrero"]
      },
      {
        id: 8,
        type: "Boots",
        name: "Botas Místicas",
        description: "Descripcion",
        nivel: 6,
        stats: {
          hp: 25, mana: 40, atkFisico: 0, defFisica: 3,
          atkMagico: 6, defMagica: 8, presicion: 3, evasion: 4
        },
        selleable: true,
        coste: 220,
        usableBy: ["Mago"]
      },
      {
        id: 9,
        type: "Boots",
        name: "Botas del Guardián",
        description: "Descripcion",
        nivel: 8,
        stats: {
          hp: 35, mana: 15, atkFisico: 5, defFisica: 6,
          atkMagico: 2, defMagica: 4, presicion: 3, evasion: -1
        },
        selleable: true,
        coste: 250,
        usableBy: ["Guerrero"]
      },
      {
        id: 10,
        type: "Boots",
        name: "Botas del Destino",
        description: "Descripcion",
        nivel: 10,
        stats: {
          hp: 50, mana: 30, atkFisico: 6, defFisica: 8,
          atkMagico: 5, defMagica: 6, presicion: 4, evasion: -2
        },
        selleable: true,
        coste: 300,
        usableBy: ["Guerrero", "Mago", "Arquero"]
      },
      // Nivel 14
      {
        "id": 11,
        "type": "Gloves",
        "name": "Guantes del Ancestro",
        "description": "Protegen las manos con el legado de los antiguos guerreros.",
        "nivel": 14,
        "stats": {
          "hp": 30, "mana": 20, "atkFisico": 3, "defFisica": 9,
          "atkMagico": 2, "defMagica": 5, "presicion": 2, "evasion": 1
        },
        "selleable": true,
        "coste": 550,
        "usableBy": ["Guerrero"]
      },
      {
        "id": 12,
        "type": "Gloves",
        "name": "Guantes de Cristal Arcano",
        "description": "Canalizan el flujo de la magia a través de sus finos tejidos.",
        "nivel": 14,
        "stats": {
          "hp": 15, "mana": 50, "atkFisico": 0, "defFisica": 6,
          "atkMagico": 8, "defMagica": 12, "presicion": 3, "evasion": 2
        },
        "selleable": true,
        "coste": 570,
        "usableBy": ["Mago"]
      },
      {
        "id": 13,
        "type": "Gloves",
        "name": "Guantes del Cazador Nocturno",
        "description": "Mejoran la precisión y la velocidad de los ataques rápidos.",
        "nivel": 14,
        "stats": {
          "hp": 25, "mana": 30, "atkFisico": 2, "defFisica": 7,
          "atkMagico": 3, "defMagica": 6, "presicion": 4, "evasion": 3
        },
        "selleable": true,
        "coste": 590,
        "usableBy": ["Arquero"]
      },

      // Nivel 15
      {
        "id": 14,
        "type": "Gloves",
        "name": "Guantes del Guardián de Hierro",
        "description": "Fortifican los puños para golpes devastadores.",
        "nivel": 15,
        "stats": {
          "hp": 40, "mana": 25, "atkFisico": 5, "defFisica": 11,
          "atkMagico": 3, "defMagica": 7, "presicion": 3, "evasion": 0
        },
        "selleable": true,
        "coste": 650,
        "usableBy": ["Guerrero"]
      },
      {
        "id": 15,
        "type": "Gloves",
        "name": "Guantes de la Conjuración Estelar",
        "description": "Tejidos con energía cósmica para potenciar la magia.",
        "nivel": 15,
        "stats": {
          "hp": 20, "mana": 70, "atkFisico": 0, "defFisica": 7,
          "atkMagico": 10, "defMagica": 14, "presicion": 4, "evasion": 3
        },
        "selleable": true,
        "coste": 670,
        "usableBy": ["Mago"]
      },
      {
        "id": 16,
        "type": "Gloves",
        "name": "Guantes del Arquero Sombrío",
        "description": "Permiten una manipulación precisa del arco y los proyectiles.",
        "nivel": 15,
        "stats": {
          "hp": 30, "mana": 40, "atkFisico": 3, "defFisica": 9,
          "atkMagico": 5, "defMagica": 8, "presicion": 5, "evasion": 2
        },
        "selleable": true,
        "coste": 690,
        "usableBy": ["Arquero"]
      },

      // Nivel 16
      {
        "id": 17,
        "type": "Gloves",
        "name": "Guantes del Titán de Guerra",
        "description": "Revestidos de poder para desatar golpes masivos.",
        "nivel": 16,
        "stats": {
          "hp": 50, "mana": 30, "atkFisico": 6, "defFisica": 12,
          "atkMagico": 4, "defMagica": 9, "presicion": 3, "evasion": -1
        },
        "selleable": true,
        "coste": 750,
        "usableBy": ["Guerrero"]
      },
      {
        "id": 18,
        "type": "Gloves",
        "name": "Guantes de Energía Radiante",
        "description": "Canalizan grandes cantidades de maná para lanzar hechizos.",
        "nivel": 16,
        "stats": {
          "hp": 30, "mana": 90, "atkFisico": 0, "defFisica": 9,
          "atkMagico": 12, "defMagica": 18, "presicion": 5, "evasion": 4
        },
        "selleable": true,
        "coste": 770,
        "usableBy": ["Mago"]
      },
      {
        "id": 19,
        "type": "Gloves",
        "name": "Guantes del Centinela de la Tormenta",
        "description": "Brindan protección contra impactos y aumentan la velocidad de reacción.",
        "nivel": 16,
        "stats": {
          "hp": 45, "mana": 50, "atkFisico": 4, "defFisica": 10,
          "atkMagico": 6, "defMagica": 10, "presicion": 5, "evasion": 3
        },
        "selleable": true,
        "coste": 790,
        "usableBy": ["Guerrero", "Arquero"]
      }
    ]
  },
  {
    category: "Weapons",
    items: [
      // Espadas
      {
        "id": 1,
        "type": "Sword",
        "name": "Espada Corta",
        "description": "Una espada ligera y fácil de manejar, perfecta para principiantes.",
        "nivel": 1,
        "stats": {
          "hp": 0, "mana": 0, "atkFisico": 3, "defFisica": 0,
          "atkMagico": 0, "defMagica": 0, "presicion": 1, "evasion": 0
        },
        "selleable": true,
        "coste": 70,
        "usableBy": ["Guerrero", "Arquero"],
        "onehand": true
      },
      {
        "id": 2,
        "type": "Sword",
        "name": "Espada de Hierro",
        "description": "Más resistente que la espada corta, ideal para guerreros en entrenamiento.",
        "nivel": 2,
        "stats": {
          "hp": 0, "mana": 0, "atkFisico": 5, "defFisica": 1,
          "atkMagico": 0, "defMagica": 0, "presicion": 2, "evasion": 0
        },
        "selleable": true,
        "coste": 120,
        "usableBy": ["Guerrero", "Arquero"],
        "onehand": true
      },
      {
        "id": 3,
        "type": "Sword",
        "name": "Espada de Acero",
        "description": "Un arma pesada y letal, diseñada para batallas más intensas.",
        "nivel": 4,
        "stats": {
          "hp": 15, "mana": 0, "atkFisico": 10, "defFisica": 3,
          "atkMagico": 0, "defMagica": 0, "presicion": 3, "evasion": -1
        },
        "selleable": true,
        "coste": 180,
        "usableBy": ["Guerrero"],
        "onehand": false
      },

      // Arcos
      {
        "id": 4,
        "type": "Bow",
        "name": "Arco Corto",
        "description": "Un arco básico, ideal para arqueros en entrenamiento.",
        "nivel": 1,
        "stats": {
          "hp": 0, "mana": 0, "atkFisico": 3, "defFisica": 0,
          "atkMagico": 0, "defMagica": 0, "presicion": 1, "evasion": 0
        },
        "selleable": true,
        "coste": 70,
        "usableBy": ["Arquero"],
        "onehand": false
      },
      {
        "id": 5,
        "type": "Bow",
        "name": "Arco Largo",
        "description": "Un arco de mayor alcance y precisión, perfecto para batallas a distancia.",
        "nivel": 3,
        "stats": {
          "hp": 0, "mana": 0, "atkFisico": 6, "defFisica": 0,
          "atkMagico": 0, "defMagica": 0, "presicion": 2, "evasion": 1
        },
        "selleable": true,
        "coste": 120,
        "usableBy": ["Arquero"],
        "onehand": false
      },
      {
        "id": 6,
        "type": "Bow",
        "name": "Arco de Cazador",
        "description": "Una herramienta letal para cazadores experimentados, con gran precisión.",
        "nivel": 5,
        "stats": {
          "hp": 10, "mana": 0, "atkFisico": 9, "defFisica": 1,
          "atkMagico": 0, "defMagica": 0, "presicion": 3, "evasion": 2
        },
        "selleable": true,
        "coste": 180,
        "usableBy": ["Arquero"],
        "onehand": false
      },

      // Bastones
      {
        "id": 7,
        "type": "Staff",
        "name": "Bastón Corto",
        "description": "Un bastón simple que canaliza energía mágica básica.",
        "nivel": 1,
        "stats": {
          "hp": 0, "mana": 0, "atkFisico": 0, "defFisica": 0,
          "atkMagico": 3, "defMagica": 0, "presicion": 1, "evasion": 0
        },
        "selleable": true,
        "coste": 70,
        "usableBy": ["Mago"],
        "onehand": true
      },
      {
        "id": 8,
        "type": "Staff",
        "name": "Bastón Arcano",
        "description": "Un bastón imbuido con energía mágica, mejora la resistencia del usuario.",
        "nivel": 3,
        "stats": {
          "hp": 5, "mana": 20, "atkFisico": 0, "defFisica": 1,
          "atkMagico": 6, "defMagica": 3, "presicion": 2, "evasion": 1
        },
        "selleable": true,
        "coste": 150,
        "usableBy": ["Mago"],
        "onehand": true
      },
      {
        "id": 9,
        "type": "Staff",
        "name": "Bastón del Sabio",
        "description": "Una herramienta poderosa utilizada por magos experimentados.",
        "nivel": 6,
        "stats": {
          "hp": 10, "mana": 40, "atkFisico": 0, "defFisica": 2,
          "atkMagico": 12, "defMagica": 5, "presicion": 3, "evasion": 2
        },
        "selleable": true,
        "coste": 220,
        "usableBy": ["Mago"],
        "onehand": true
      },

      // Hachas
      {
        "id": 10,
        "type": "Axe",
        "name": "Hacha Ligera",
        "description": "Un hacha rápida y manejable, ideal para luchadores ágiles.",
        "nivel": 2,
        "stats": {
          "hp": 0, "mana": 0, "atkFisico": 5, "defFisica": 1,
          "atkMagico": 0, "defMagica": 0, "presicion": 1, "evasion": -1
        },
        "selleable": true,
        "coste": 90,
        "usableBy": ["Guerrero", "Arquero"],
        "onehand": true
      },
      {
        "id": 11,
        "type": "Axe",
        "name": "Hacha de Guerra",
        "description": "Un arma brutal con gran fuerza de impacto, usada por guerreros experimentados.",
        "nivel": 4,
        "stats": {
          "hp": 15, "mana": 0, "atkFisico": 10, "defFisica": 3,
          "atkMagico": 0, "defMagica": 0, "presicion": 2, "evasion": -2
        },
        "selleable": true,
        "coste": 150,
        "usableBy": ["Guerrero"],
        "onehand": false
      },
      {
        "id": 12,
        "type": "Axe",
        "name": "Hacha del Titán",
        "description": "Un arma colosal capaz de partir enemigos con un solo golpe.",
        "nivel": 7,
        "stats": {
          "hp": 25, "mana": 0, "atkFisico": 16, "defFisica": 4,
          "atkMagico": 0, "defMagica": 0, "presicion": 3, "evasion": -3
        },
        "selleable": true,
        "coste": 220,
        "usableBy": ["Guerrero"],
        "onehand": false
      },

      // Cetros
      {
        id: 13,
        type: "Scepter",
        name: "Cetro Real",
        description: "Descripcion",
        nivel: 1,
        stats: {
          hp: 0, mana: 15, atkFisico: 0, defFisica: 0,
          atkMagico: 7, defMagica: 4, presicion: 2, evasion: 1
        },
        selleable: true,
        coste: 180,
        usableBy: ["Mago"],
        onehand: true
      },

      // Ballestas
      {
        id: 14,
        type: "Crossbow",
        name: "Ballesta de Cazador",
        description: "Descripcion",
        nivel: 1,
        stats: {
          hp: 0, mana: 0, atkFisico: 6, defFisica: 1,
          atkMagico: 0, defMagica: 0, presicion: 3, evasion: 2
        },
        selleable: true,
        coste: 200,
        usableBy: ["Arquero"],
        onehand: false
      },
      {
        "id": 15,
        "type": "Sword",
        "name": "Espada del Ancestro",
        "description": "Forjada con técnicas ancestrales, su filo es impecable.",
        "nivel": 14,
        "stats": {
          "hp": 20, "mana": 0, "atkFisico": 22, "defFisica": 5,
          "atkMagico": 0, "defMagica": 2, "presicion": 5, "evasion": -1
        },
        "selleable": true,
        "coste": 850,
        "usableBy": ["Guerrero"],
        "onehand": false
      },
      {
        "id": 16,
        "type": "Sword",
        "name": "Espada del Guardián",
        "description": "Una espada robusta diseñada para la defensa y ataque.",
        "nivel": 15,
        "stats": {
          "hp": 30, "mana": 0, "atkFisico": 26, "defFisica": 6,
          "atkMagico": 0, "defMagica": 3, "presicion": 6, "evasion": -2
        },
        "selleable": true,
        "coste": 900,
        "usableBy": ["Guerrero"],
        "onehand": false
      },

      // Arcos
      {
        "id": 17,
        "type": "Bow",
        "name": "Arco del Centinela",
        "description": "Un arco fino y preciso, ideal para ataques certeros.",
        "nivel": 14,
        "stats": {
          "hp": 10, "mana": 0, "atkFisico": 21, "defFisica": 3,
          "atkMagico": 0, "defMagica": 0, "presicion": 6, "evasion": 2
        },
        "selleable": true,
        "coste": 800,
        "usableBy": ["Arquero"],
        "onehand": false
      },
      {
        "id": 18,
        "type": "Bow",
        "name": "Arco de la Tormenta",
        "description": "Diseñado para la velocidad y precisión extrema.",
        "nivel": 15,
        "stats": {
          "hp": 15, "mana": 0, "atkFisico": 24, "defFisica": 4,
          "atkMagico": 0, "defMagica": 0, "presicion": 7, "evasion": 3
        },
        "selleable": true,
        "coste": 850,
        "usableBy": ["Arquero"],
        "onehand": false
      },

      // Bastones
      {
        "id": 19,
        "type": "Staff",
        "name": "Bastón Celestial",
        "description": "Imbuido con la esencia de la magia pura.",
        "nivel": 14,
        "stats": {
          "hp": 10, "mana": 50, "atkFisico": 0, "defFisica": 2,
          "atkMagico": 22, "defMagica": 6, "presicion": 4, "evasion": 2
        },
        "selleable": true,
        "coste": 900,
        "usableBy": ["Mago"],
        "onehand": true
      },
      {
        "id": 20,
        "type": "Staff",
        "name": "Bastón de la Sabiduría",
        "description": "Potencia el conocimiento y el poder mágico del usuario.",
        "nivel": 15,
        "stats": {
          "hp": 15, "mana": 60, "atkFisico": 0, "defFisica": 3,
          "atkMagico": 25, "defMagica": 8, "presicion": 5, "evasion": 3
        },
        "selleable": true,
        "coste": 950,
        "usableBy": ["Mago"],
        "onehand": true
      },

      // Hachas
      {
        "id": 21,
        "type": "Axe",
        "name": "Hacha del Guerrero",
        "description": "Un arma robusta con un filo letal.",
        "nivel": 14,
        "stats": {
          "hp": 25, "mana": 0, "atkFisico": 23, "defFisica": 6,
          "atkMagico": 0, "defMagica": 2, "presicion": 5, "evasion": -2
        },
        "selleable": true,
        "coste": 880,
        "usableBy": ["Guerrero"],
        "onehand": false
      },
      {
        "id": 22,
        "type": "Axe",
        "name": "Hacha del Coloso",
        "description": "Un arma brutal utilizada por los guerreros más experimentados.",
        "nivel": 15,
        "stats": {
          "hp": 35, "mana": 0, "atkFisico": 28, "defFisica": 8,
          "atkMagico": 0, "defMagica": 2, "presicion": 6, "evasion": -3
        },
        "selleable": true,
        "coste": 950,
        "usableBy": ["Guerrero"],
        "onehand": false
      },

      // Cetros
      {
        "id": 23,
        "type": "Scepter",
        "name": "Cetro del Poder Arcano",
        "description": "Potencia las habilidades mágicas del usuario.",
        "nivel": 14,
        "stats": {
          "hp": 5, "mana": 40, "atkFisico": 0, "defFisica": 3,
          "atkMagico": 18, "defMagica": 8, "presicion": 4, "evasion": 2
        },
        "selleable": true,
        "coste": 920,
        "usableBy": ["Mago"],
        "onehand": true
      },

      // Ballestas
      {
        "id": 24,
        "type": "Crossbow",
        "name": "Ballesta del Centinela",
        "description": "Diseñada para disparos precisos y letales.",
        "nivel": 14,
        "stats": {
          "hp": 10, "mana": 0, "atkFisico": 20, "defFisica": 3,
          "atkMagico": 0, "defMagica": 0, "presicion": 6, "evasion": 3
        },
        "selleable": true,
        "coste": 880,
        "usableBy": ["Arquero"],
        "onehand": false
      }
    ]
  },
  {
    category: "Consumibles",
    items: [
      {
        id: 1,
        type: "Consumible",
        name: "Poción Pequeña de Vida",
        nivel: 1,
        stats: { hp: 50, mana: 0, atkFisico: 0, defFisica: 0, atkMagico: 0, defMagica: 0, presicion: 0, evasion: 0 },
        selleable: true,
        coste: 50,
        usableBy: ["Todos"],
        description: "Una pequeña poción roja que restaura **50 puntos de HP**. Su sabor recuerda a frutas silvestres."
      },
      {
        id: 2,
        type: "Consumible",
        name: "Poción Mediana de Vida",
        nivel: 1,
        stats: { hp: 250, mana: 0, atkFisico: 0, defFisica: 0, atkMagico: 0, defMagica: 0, presicion: 0, evasion: 0 },
        selleable: true,
        coste: 200,
        usableBy: ["Todos"],
        description: "Una poción de color escarlata que **restaura 100 puntos de HP**. Su esencia vibra con energía sanadora."
      },
      {
        id: 3,
        type: "Consumible",
        name: "Poción Grande de Vida",
        nivel: 1,
        stats: { hp: 600, mana: 0, atkFisico: 0, defFisica: 0, atkMagico: 0, defMagica: 0, presicion: 0, evasion: 0 },
        selleable: true,
        coste: 500,
        usableBy: ["Todos"],
        description: "Un frasco lleno de luz líquida que **restaura 150 puntos de HP**. Solo los alquimistas más expertos pueden crearla."
      },
      {
        id: 4,
        type: "Consumible",
        name: "Poción Pequeña de Mana",
        nivel: 1,
        stats: { hp: 0, mana: 50, atkFisico: 0, defFisica: 0, atkMagico: 0, defMagica: 0, presicion: 0, evasion: 0 },
        selleable: true,
        coste: 50,
        usableBy: ["Todos"],
        description: "Una poción azul brillante que **restaura 50 puntos de Mana**. Su sabor es refrescante y ligeramente cítrico."
      },
      {
        id: 5,
        type: "Consumible",
        name: "Poción Mediana de Mana",
        nivel: 1,
        stats: { hp: 0, mana: 250, atkFisico: 0, defFisica: 0, atkMagico: 0, defMagica: 0, presicion: 0, evasion: 0 },
        selleable: true,
        coste: 200,
        usableBy: ["Todos"],
        description: "Una poción azul intenso que **restaura 100 puntos de Mana**. Su energía envuelve al usuario con una sensación de claridad mental."
      },
      {
        id: 6,
        type: "Consumible",
        name: "Poción Grande de Mana",
        nivel: 1,
        stats: { hp: 0, mana: 600, atkFisico: 0, defFisica: 0, atkMagico: 0, defMagica: 0, presicion: 0, evasion: 0 },
        selleable: true,
        coste: 500,
        usableBy: ["Todos"],
        description: "Un elixir de esencia arcana que **restaura 150 puntos de Mana**. Se dice que fue creado por magos antiguos en templos ocultos."
      }
    ]
  }
]


