import { ExerciseSeed } from '../models/exercise.model';

/**
 * Catálogo de ejercicios predefinido (RF05).
 *
 * Se siembra en la tabla `exercises` la primera vez que arranca la app.
 * Para ampliar el catálogo, agrega más entradas aquí; las nuevas se insertan
 * solo si la tabla está vacía (ver ExerciseRepository.seedCatalog).
 */
export const EXERCISE_CATALOG: ExerciseSeed[] = [
  {
    name: 'Sentadillas',
    description: 'Ejercicio compuesto para piernas y glúteos.',
    instructions:
      'De pie, pies al ancho de hombros. Baja flexionando rodillas y caderas como si te sentaras, mantén la espalda recta y sube controladamente.',
    category: 'Piernas',
  },
  {
    name: 'Press de banca',
    description: 'Trabaja pecho, hombros y tríceps.',
    instructions:
      'Acostado en banca, baja la barra al pecho con los codos a ~45°, luego empuja hacia arriba hasta extender los brazos.',
    category: 'Pecho',
  },
  {
    name: 'Peso muerto',
    description: 'Ejercicio compuesto para espalda baja, glúteos e isquios.',
    instructions:
      'Con la barra en el suelo, agárrala con la espalda recta, levanta extendiendo caderas y rodillas a la vez, manteniendo la barra cerca del cuerpo.',
    category: 'Espalda',
  },
  {
    name: 'Dominadas',
    description: 'Trabaja espalda y bíceps usando el peso corporal.',
    instructions:
      'Cuélgate de la barra con agarre prono. Tira hacia arriba hasta pasar la barbilla la barra y baja controlando el movimiento.',
    category: 'Espalda',
  },
  {
    name: 'Flexiones',
    description: 'Ejercicio de empuje para pecho, hombros y tríceps.',
    instructions:
      'En posición de plancha, baja el cuerpo flexionando los codos hasta casi tocar el suelo y empuja de vuelta. Mantén el core firme.',
    category: 'Pecho',
  },
  {
    name: 'Zancadas',
    description: 'Trabaja piernas y glúteos de forma unilateral.',
    instructions:
      'Da un paso al frente y baja hasta que ambas rodillas formen 90°. Vuelve a la posición inicial y alterna piernas.',
    category: 'Piernas',
  },
  {
    name: 'Plancha',
    description: 'Ejercicio isométrico para el core.',
    instructions:
      'Apóyate sobre antebrazos y puntas de los pies, cuerpo recto de cabeza a talones. Mantén la posición sin hundir la cadera.',
    category: 'Core',
  },
  {
    name: 'Press militar',
    description: 'Trabaja hombros y tríceps.',
    instructions:
      'De pie, empuja la barra o mancuernas desde los hombros hacia arriba hasta extender los brazos, luego baja controladamente.',
    category: 'Hombros',
  },
  {
    name: 'Curl de bíceps',
    description: 'Ejercicio de aislamiento para bíceps.',
    instructions:
      'Con mancuernas a los costados, flexiona los codos llevando el peso hacia los hombros sin balancear el cuerpo, y baja despacio.',
    category: 'Brazos',
  },
  {
    name: 'Burpees',
    description: 'Ejercicio de cuerpo completo y cardio.',
    instructions:
      'Desde de pie, baja a cuclillas, lleva los pies atrás a plancha, haz una flexión, regresa y salta con los brazos arriba.',
    category: 'Cardio',
  },
];
