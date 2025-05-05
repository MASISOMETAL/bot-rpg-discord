import { DivisorDMGBase } from "../../configs.js";

const multiplicadorSTAB = {
  "Fuego": { "Fuego": 1, "Viento": 1.4, "Oscuridad": 1.7, "Tierra": 0.7, "Agua": 0.4 },
  "Viento": { "Viento": 1, "Oscuridad": 1.4, "Agua": 1.7, "Fuego": 0.7, "Tierra": 0.4 },
  "Oscuridad": { "Oscuridad": 1, "Tierra": 1.4, "Fuego": 1.7, "Viento": 0.7, "Agua": 0.4 },
  "Tierra": { "Tierra": 1, "Agua": 1.4, "Viento": 1.7, "Oscuridad": 0.7, "Fuego": 0.4 },
  "Agua": { "Agua": 1, "Fuego": 1.4, "Tierra": 1.7, "Oscuridad": 0.7, "Viento": 0.4 }
};

export function calcularDaño(atacante, defensor, habilidad) {
  const esFisico = habilidad.type === "physical";
  const ataque = esFisico ? atacante.atkfisico : atacante.atkmagico;
  const defensa = esFisico ? defensor.deffisica : defensor.defmagica;

  // 🔹 Precisión y evasión
  const precision = atacante.precision - defensor.evasion;  
  const probabilidadBase = 0.75;
  const ajuste = precision / (Math.abs(precision) + 18);
  const probabilidadFinal = Math.max(0.5, Math.min(0.95, probabilidadBase + ajuste)); // Máximo 95%, mínimo 15%
  const isAttack = Math.random() < probabilidadFinal
  if (!isAttack) {
    return { daño: 0, mensaje: "❌ ¡El ataque falló!" };
  }

  // 🔹 Base de daño
  let dañoBase = ((2 * atacante.nivel / 5 + 2) * habilidad.damage * (ataque / (defensa / 1.5))) / DivisorDMGBase + 2;

  // 🔹 Crítico (10% de probabilidad, daño x1.5)
  const critico = calcularCritico(atacante.precision, defensor.evasion)
  
  dañoBase *= critico

  // 🔹 Modificador de elemento
  const multiplicadorElemento = multiplicadorSTAB[atacante.element]?.[defensor.element] || 1;
  dañoBase *= multiplicadorElemento;

  // 🔹 Variación aleatoria (±10%)
  const variacion = Math.random() * 0.2 + 0.9;
  dañoBase *= variacion;

  return {
    daño: Math.round(dañoBase), // sacar el +500
    mensaje: ` ${critico !== 1 ? "¡Golpe Crítico! " : ""} ${atacante.ataca === "Personaje" ? "causaste" : "causó"} **${Math.round(dañoBase)}** de daño.`
  };
}

const calcularCritico = (precision, evasion) => {
  const diferencia = precision - evasion;
  const probabilidadCritico = Math.max(0.05, Math.min(0.3, diferencia / (Math.abs(diferencia) + 10)));
  const esCritico = Math.random() < probabilidadCritico;
  return esCritico ? (Math.random() < 0.5 ? 1.3 : 1.6) : 1;
};