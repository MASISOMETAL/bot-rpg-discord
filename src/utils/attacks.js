import { DivisorDMGBase } from "../../configs.js";

const multiplicadorSTAB = {
  "Fuego": { "Fuego": 1, "Viento": 1.3, "Oscuridad": 1.6, "Tierra": 0.7, "Agua": 0.4 },
  "Viento": { "Viento": 1, "Oscuridad": 1.3, "Agua": 1.6, "Fuego": 0.7, "Tierra": 0.4 },
  "Oscuridad": { "Oscuridad": 1, "Tierra": 1.3, "Fuego": 1.6, "Viento": 0.7, "Agua": 0.4 },
  "Tierra": { "Tierra": 1, "Agua": 1.3, "Viento": 1.6, "Oscuridad": 0.7, "Fuego": 0.4 },
  "Agua": { "Agua": 1, "Fuego": 1.3, "Tierra": 1.6, "Oscuridad": 0.7, "Viento": 0.4 }
};

export function calcularDaño(atacante, defensor, habilidad) {
  const esFisico = habilidad.type === "physical";
  const ataque = esFisico ? atacante.atkFisico : atacante.atkMagico;
  const defensa = esFisico ? defensor.defFisica : defensor.defMagica;

  // 🔹 Precisión y evasión
  const presicion = atacante.presicion - defensor.evasion;  
  const probabilidadBase = 0.75;
  const ajuste = presicion / (Math.abs(presicion) + 18);
  const probabilidadFinal = Math.max(0.5, Math.min(0.95, probabilidadBase + ajuste)); // Máximo 95%, mínimo 15%
  const isAttack = Math.random() < probabilidadFinal
  if (!isAttack) {
    return { daño: 0, mensaje: "❌ ¡El ataque falló!" };
  }

  // 🔹 Base de daño
  let dañoBase = ((2 * atacante.nivel / 5 + 2) * habilidad.damage * (ataque / (defensa / 1.5))) / DivisorDMGBase + 2;

  // 🔹 Crítico (10% de probabilidad, daño x1.5)
  const critico = calcularCritico(atacante.presicion, defensor.evasion)
  
  dañoBase *= critico

  // 🔹 Modificador de elemento
  const multiplicadorElemento = multiplicadorSTAB[atacante.element]?.[defensor.element] || 1;
  dañoBase *= multiplicadorElemento;

  // 🔹 Variación aleatoria (±10%)
  const variacion = Math.random() * 0.2 + 0.9;
  dañoBase *= variacion;

  return {
    daño: Math.round(dañoBase), // sacar el +500
    mensaje: ` ${critico !== 1 ? "¡Golpe Crítico! " : ""} causaste **${Math.round(dañoBase)}** de daño.`
  };
}

const calcularCritico = (presicion, evasion) => {
  const diferencia = presicion - evasion;
  const probabilidadCritico = Math.max(0.05, Math.min(0.3, diferencia / (Math.abs(diferencia) + 10)));
  const esCritico = Math.random() < probabilidadCritico;
  return esCritico ? (Math.random() < 0.5 ? 1.3 : 1.6) : 1;
};