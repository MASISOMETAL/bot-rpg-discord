import { elements } from "../data/elements.js";
import { monsters } from "../data/monsters.js";

export function seleccionarMonstruoAleatorio(nivelUsuario) {
  if (!nivelUsuario) {
    return monsters[Math.floor(Math.random() * monsters.length)]; // 🔹 Nivel aleatorio si el usuario no tiene personaje
  }

  const nivelesPosibles = [nivelUsuario - 1, nivelUsuario, nivelUsuario + 1]
    .filter(n => n >= 1); // 🔹 Asegurar que el nivel mínimo sea 1

  const monstruosFiltrados = monsters.filter(m => nivelesPosibles.includes(m.nivel));

  const monster = monstruosFiltrados[Math.floor(Math.random() * monstruosFiltrados.length)];

  const randomElement = elements[Math.floor(Math.random() * elements.length)];  

  return {monster, randomElement}
}

