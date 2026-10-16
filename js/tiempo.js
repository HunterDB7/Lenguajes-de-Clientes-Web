/**
 * Módulo de utilidades para conversión y comparación de tiempo.
 * Es fundamental para la validación de choques horarios.
 */

/**
 * Convierte una cadena de hora "HH:MM" a minutos totales desde las 00:00.
 * @param {string} horaStr - Hora en formato "HH:MM"
 * @returns {number} Minutos totales
 */
function horaAMinutos(horaStr) {
    if (!horaStr || typeof horaStr !== 'string') return 0;
    const [horas, minutos] = horaStr.split(':').map(Number);
    return (horas * 60) + minutos;
}

/**
 * Convierte minutos totales a una cadena de hora "HH:MM".
 * @param {number} totalMinutos - Minutos totales desde las 00:00
 * @returns {string} Hora en formato "HH:MM"
 */
function minutosAHoras(totalMinutos) {
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;
    const hStr = String(horas).padStart(2, '0');
    const mStr = String(minutos).padStart(2, '0');
    return `${hStr}:${mStr}`;
}

/**
 * Verifica si dos intervalos de tiempo chocan (se solapan).
 * Regla: Una sesión que termina exactamente a la hora en que comienza otra 
 * NO constituye un choque.
 * 
 * @param {string} inicio1 - Hora de inicio de la sesión 1 ("HH:MM")
 * @param {string} fin1 - Hora de fin de la sesión 1 ("HH:MM")
 * @param {string} inicio2 - Hora de inicio de la sesión 2 ("HH:MM")
 * @param {string} fin2 - Hora de fin de la sesión 2 ("HH:MM")
 * @returns {boolean} True si hay choque, false en caso contrario.
 */
function hayChoqueHorario(inicio1, fin1, inicio2, fin2) {
    const minInicio1 = horaAMinutos(inicio1);
    const minFin1 = horaAMinutos(fin1);
    const minInicio2 = horaAMinutos(inicio2);
    const minFin2 = horaAMinutos(fin2);

    // Hay solape si el inicio de una es menor que el fin de la otra
    // y el fin de la una es mayor que el inicio de la otra.
    return Math.max(minInicio1, minInicio2) < Math.min(minFin1, minFin2);
}