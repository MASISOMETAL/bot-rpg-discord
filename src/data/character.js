export const characters = [
  {
    id: 1,
    name: "Guerrero",
    race: "Guerrero",
    nivel: 1,
    xp: 0,
    stats: {
      hp: 1500, mana: 100, atkFisico: 110, defFisica: 90,
      atkMagico: 30, defMagica: 50, presicion: 85, evasion: 75
    },
    gold: 300,
    elemento: null,
    img: "https://i.ibb.co/k6P1kWM9/guerrero.png"
  },
  {
    id: 2,
    name: "Mago",
    race: "Mago",
    nivel: 1,
    xp: 0,
    stats: {
      hp: 1000, mana: 500, atkFisico: 40, defFisica: 50,
      atkMagico: 120, defMagica: 100, presicion: 90, evasion: 80
    },
    gold: 300,
    elemento: null,
    img: "https://i.ibb.co/cS7MP1PR/mago.png"
  },
  {
    id: 3,
    name: "Arquero",
    race: "Arquero",
    nivel: 1,
    xp: 0,
    stats: {
      hp: 1200, mana: 200, atkFisico: 100, defFisica: 70,
      atkMagico: 50, defMagica: 60, presicion: 95, evasion: 90
    },
    gold: 300,
    elemento: null,
    img: "https://i.ibb.co/7JyXjd38/arquero.png"
  }
];

export const statMultipliers = {
  Guerrero: { hp: 15, mana: 5, atkFisico: 3, defFisica: 3, atkMagico: 1, defMagica: 1, presicion: 1, evasion: 1 },
  Mago: { hp: 7, mana: 15, atkFisico: 1, defFisica: 1, atkMagico: 3, defMagica: 3, presicion: 1, evasion: 1 },
  Arquero: { hp: 10, mana: 7, atkFisico: 2, defFisica: 2, atkMagico: 2, defMagica: 2, presicion: 2, evasion: 2 }
};
