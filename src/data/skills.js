export const skillsByRace = {
  Guerrero: [
    { id: 1, name: "Golpe Poderoso", unlockLevel: 1, type: "physical", damage: 100, manaCost: 0, effect: null, effectChance: 0 },
    { id: 2, name: "Tormenta de Espadas", unlockLevel: 5, type: "physical", damage: 130, manaCost: 20, effect: null, effectChance: 0 },
    { id: 3, name: "Furia del Guerrero", unlockLevel: 8, type: "physical", damage: 150, manaCost: 30, effect: "Sangrado", effectChance: 35 },
    { id: 4, name: "Embate Colosal", unlockLevel: 12, type: "physical", damage: 220, manaCost: 50, effect: "Aturdir", effectChance: 25 }
  ],
  Mago: [
    { id: 1, name: "Rayo Arcano", unlockLevel: 1, type: "magical", damage: 90, manaCost: 0, effect: null, effectChance: 0 },
    { id: 2, name: "Bola de Fuego", unlockLevel: 3, type: "magical", damage: 110, manaCost: 60, effect: "Quemadura", effectChance: 40 },
    { id: 3, name: "Explosión Arcana", unlockLevel: 7, type: "magical", damage: 160, manaCost: 120, effect: "Aturdir", effectChance: 30 },
    { id: 4, name: "Lluvia de Meteoros", unlockLevel: 12, type: "magical", damage: 250, manaCost: 200, effect: "Quemadura", effectChance: 50 }
  ],
  Arquero: [
    { id: 1, name: "Disparo Rápido", unlockLevel: 1, type: "physical", damage: 80, manaCost: 0, effect: null, effectChance: 0 },
    { id: 2, name: "Disparo Preciso", unlockLevel: 4, type: "physical", damage: 150, manaCost: 15, effect: null, effectChance: 0 },
    { id: 3, name: "Ráfaga de Flechas", unlockLevel: 7, type: "physical", damage: 180, manaCost: 30, effect: "Veneno", effectChance: 35 },
    { id: 4, name: "Tiro Fantasma", unlockLevel: 12, type: "physical", damage: 240, manaCost: 60, effect: "Aturdir", effectChance: 20 }
  ]
};
