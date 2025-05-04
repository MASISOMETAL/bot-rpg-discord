export const characters = [
  {
    id: 1,
    name: "Guerrero",
    race: "Guerrero",
    nivel: 1,
    xp: 0,
    stats: {
      hp: 1200, mana: 100, atkfisico: 110, deffisica: 90,
      atkmagico: 30, defmagica: 50, precision: 85, evasion: 75
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
      hp: 850, mana: 500, atkfisico: 40, deffisica: 50,
      atkmagico: 120, defmagica: 100, precision: 90, evasion: 80
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
      hp: 1000, mana: 200, atkfisico: 100, deffisica: 70,
      atkmagico: 50, defmagica: 60, precision: 95, evasion: 90
    },
    gold: 300,
    elemento: null,
    img: "https://i.ibb.co/7JyXjd38/arquero.png"
  }
];

export const statMultipliers = {
  Guerrero: { hp: 15, mana: 5, atkfisico: 3, deffisica: 3, atkmagico: 1, defmagica: 1, precision: 1, evasion: 1 },
  Mago: { hp: 7, mana: 15, atkfisico: 1, deffisica: 1, atkmagico: 3, defmagica: 3, precision: 1, evasion: 1 },
  Arquero: { hp: 10, mana: 7, atkfisico: 2, deffisica: 2, atkmagico: 2, defmagica: 2, precision: 2, evasion: 2 }
};
