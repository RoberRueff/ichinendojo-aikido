/**
 * Datos de contenido del sitio. Ver ai/taxonomy.md (sección B) para el esquema.
 * `origen` es un metadato interno (no se muestra en el HTML) — ver ai/guardrails.md G1.
 */

const DOJO = {
  telefonoLocal: "11 5939-7079",
  telefonoIntl: "5491159397079",
  email: "info@ichinendojo.com.ar",
};

const BENEFICIOS = [
  {
    id: "flexibilidad",
    titulo: "Flexibilidad y Movilidad",
    texto:
      "El entrenamiento constante de Aikido trabaja el rango de movimiento de articulaciones y músculos, mejorando la flexibilidad general del cuerpo con ejercicios progresivos y seguros.",
    foto: "assets/img/gallery-2.jpg",
    origen: "redactada",
  },
  {
    id: "fuerza",
    titulo: "Fuerza y Coordinación",
    texto:
      "Las técnicas de Aikido requieren coordinar todo el cuerpo en cada movimiento, desarrollando fuerza funcional y una mejor conexión entre mente y cuerpo.",
    foto: "assets/img/gallery-1.jpg",
    origen: "redactada",
  },
  {
    id: "concentracion",
    titulo: "Concentración",
    texto:
      "Cada técnica exige atención plena al compañero y al propio cuerpo, entrenando la capacidad de concentrarse y estar presente en el momento.",
    foto: "assets/img/gallery-3.jpg",
    origen: "redactada",
  },
  {
    id: "estres",
    titulo: "Manejo del Estrés",
    texto:
      "La práctica regular ayuda a liberar tensiones acumuladas y a desarrollar herramientas para mantener la calma frente a situaciones de presión, dentro y fuera del tatami.",
    foto: "assets/img/gallery-5.jpg",
    origen: "redactada",
  },
  {
    id: "disciplina",
    titulo: "Disciplina y Crecimiento Personal",
    texto:
      "El camino del Aikido (Aikido significa justamente \"camino\") fomenta la constancia, el respeto y la superación personal a través de la práctica sostenida en el tiempo.",
    foto: "assets/img/gallery-6.jpg",
    origen: "redactada",
  },
];

const INSTRUCTORES = [
  {
    nombre: "Carlos Kostoff",
    grado: "2do. Dan",
    dia: "Lunes",
    horario: "19.30 – 20.30 hs",
    foto: "assets/img/carlos-kostoff.jpg",
  },
  {
    nombre: "Rober Rueff",
    grado: "4to. Dan",
    dia: "Miércoles",
    horario: "19.30 – 20.30 hs",
    foto: "assets/img/logo.png",
  },
  {
    nombre: "Nestor Pace",
    grado: "1er. Dan",
    dia: "Viernes",
    horario: "19.30 – 20.30 hs",
    foto: null,
  },
];

const SEDES = [
  {
    id: "central",
    nombre: "Ichinen Dojo Central",
    direccion: "Navarro 2544, 2do. piso, Agronomía, CABA",
    clases: [
      { dia: "Lunes", horario: "19.30 a 20.30 hs." },
      { dia: "Miércoles", horario: "19.30 a 20.30 hs." },
      { dia: "Viernes", horario: "19.30 a 20.30 hs." },
    ],
  },
  {
    id: "la-emiliana",
    nombre: "Ichinen Dojo La Emiliana",
    direccion: "Terrada 4243, 1er. piso, Villa Pueyrredón, CABA",
    clases: [
      { dia: "Lunes", horario: "19 a 20.30 hs." },
      { dia: "Viernes", horario: "19 a 20.30 hs." },
    ],
  },
];

const FAQ = [
  {
    pregunta: "¿Necesito experiencia?",
    respuesta: "No. No necesitás conocimientos previos para empezar.",
    origen: "real",
  },
  {
    pregunta: "¿Me puedo lastimar?",
    respuesta:
      "El Aikido se practica de forma progresiva y controlada, priorizando siempre la seguridad de ambos compañeros. Como en cualquier actividad física puede haber algún golpe menor, pero se entrena con cuidado y supervisión constante del instructor.",
    origen: "redactada",
  },
  {
    pregunta: "¿Puedo empezar siendo adulto?",
    respuesta:
      "Sí. La mayoría de quienes arrancan lo hacen en la adultez. No hay límite de edad para empezar ni se necesita una condición física especial.",
    origen: "redactada",
  },
  {
    pregunta: "¿Qué edad necesito tener?",
    respuesta:
      "Las clases están pensadas para adolescentes y adultos. Si consultás por clases para chicos más pequeños, escribinos por WhatsApp y te contamos las opciones.",
    origen: "redactada",
  },
  {
    pregunta: "¿Cuánto dura una clase?",
    respuesta: "Cada clase dura una hora.",
    origen: "redactada",
  },
  {
    pregunta: "¿Qué tengo que llevar?",
    respuesta:
      "Para la primera clase alcanza con ropa cómoda (tipo joggineta) y ganas de moverte. Si seguís practicando, más adelante vas a necesitar un aikidogi (el uniforme tradicional).",
    origen: "redactada",
  },
  {
    pregunta: "¿Puedo probar primero?",
    respuesta:
      "Sí. Podés probar una clase gratis y sin compromiso antes de decidir si te sumás.",
    origen: "redactada",
  },
];

const TESTIMONIOS = [
  {
    nombre: "Carlos Kostoff",
    foto: "assets/img/carlos-kostoff.jpg",
    estrellas: 5,
    texto:
      "Excelente lugar para empezar desde cero. El Sensei tiene muchísima paciencia y los compañeros son súper generosos al explicar las técnicas. El ambiente de la escuela es muy respetuoso y limpio. ¡Súper recomendado para los que buscan un arte marcial no competitivo en Capital!",
    origen: "real",
  },
  {
    nombre: "Cynthia Mizyrycki",
    foto: "assets/img/cynthia-mizyrycki.jpg",
    estrellas: 5,
    texto:
      "Empecé sin saber nada y hoy es una de mis actividades favoritas de la semana. Los profes tienen mucha paciencia y el grupo es muy cálido.",
    origen: "ejemplo",
  },
  {
    nombre: "Daniel Brgazzi",
    foto: "assets/img/daniel-brgazzi.jpg",
    estrellas: 5,
    texto:
      "Un arte marcial distinto: no hay competencia, se aprende a moverse con el cuerpo y a soltar tensiones. Lo recomiendo a cualquier edad.",
    origen: "ejemplo",
  },
  {
    nombre: "Nestor Fojo",
    foto: "assets/img/nestor-fojo.jpg",
    estrellas: 5,
    texto:
      "Llevo un tiempo entrenando en Ichinen Dojo y lo que más valoro es el respeto y la buena onda entre todos los alumnos.",
    origen: "ejemplo",
  },
  {
    nombre: "Gabriel Acevedo",
    foto: "assets/img/gabriel-acevedo.jpg",
    estrellas: 5,
    texto:
      "Buenísimo para trabajar el equilibrio y bajar el estrés después de la oficina. El ambiente del dojo es muy tranquilo.",
    origen: "ejemplo",
  },
  {
    nombre: "Ian Rueff",
    foto: "assets/img/ian-rueff.jpg",
    estrellas: 5,
    texto:
      "Arranqué de casualidad y ya no puedo faltar a una clase. Se aprende mucho y siempre con buena onda.",
    origen: "ejemplo",
  },
  {
    nombre: "Lucía Ivorra",
    foto: "assets/img/lucia-ivorra.jpg",
    estrellas: 5,
    texto:
      "Me encantó desde la primera clase de prueba. Se nota el cuidado en cómo enseñan cada técnica, paso a paso.",
    origen: "ejemplo",
  },
];

const GALERIA = [
  "assets/img/gallery-1.jpg",
  "assets/img/gallery-2.jpg",
  "assets/img/gallery-3.jpg",
  "assets/img/gallery-4.jpg",
  "assets/img/gallery-5.jpg",
  "assets/img/gallery-6.jpg",
];
