/**
 * Módulo para la detección de choques de horario e incompatibilidades.
 */
const DetectorChoques = {
    /**
     * Obtiene el rango de tiempo real "HH:MM" de inicio y fin para una sesión.
     * @param {Array<string>} bloquesIds - Lista de IDs de bloques que ocupa la sesión.
     * @returns {Object} { inicio: "HH:MM", fin: "HH:MM" }
     */
    obtenerHorasSesion(bloquesIds) {
        const bloquesCatalogo = GestorDatos.obtenerBloques();
        const bloquesSesion = bloquesCatalogo.filter(b => bloquesIds.includes(b.id));

        if (bloquesSesion.length === 0) return { inicio: "00:00", fin: "00:00" };

        bloquesSesion.sort((a, b) => horaAMinutos(a.inicio) - horaAMinutos(b.inicio));

        return {
            inicio: bloquesSesion[0].inicio,
            fin: bloquesSesion[bloquesSesion.length - 1].fin
        };
    },

    /**
     * Verifica si dos sesiones chocan (mismo día y solape de horas).
     * @param {Object} sesion1 - { dia: "LUN", bloques: [...] }
     * @param {Object} sesion2 - { dia: "LUN", bloques: [...] }
     * @returns {boolean} True si chocan.
     */
    chocanSesiones(sesion1, sesion2) {
        if (sesion1.dia !== sesion2.dia) return false;

        const horas1 = this.obtenerHorasSesion(sesion1.bloques);
        const horas2 = this.obtenerHorasSesion(sesion2.bloques);

        return hayChoqueHorario(horas1.inicio, horas1.fin, horas2.inicio, horas2.fin);
    },

    /**
     * Verifica si dos secciones completas chocan en alguna de sus sesiones.
     * @param {Object} seccion1 
     * @param {Object} seccion2 
     * @returns {boolean} True si hay choque entre las secciones.
     */
    chocanSecciones(seccion1, seccion2) {
        for (const s1 of seccion1.horario) {
            for (const s2 of seccion2.horario) {
                if (this.chocanSesiones(s1, s2)) {
                    return true;
                }
            }
        }
        return false;
    },

    /**
     * Detecta si un grupo de materias tiene pares incompatibles
     * (cuando TODAS las secciones de una chocan con TODAS las de otra).
     * @param {Array<Object>} materias 
     * @returns {Array<Object>} Lista de pares incompatibles [{ materia1, materia2 }]
     */
    detectarIncompatibilidades(materias) {
        const incompatibles = [];

        for (let i = 0; i < materias.length; i++) {
            for (let j = i + 1; j < materias.length; j++) {
                const m1 = materias[i];
                const m2 = materias[j];

                let todasChocan = true;

                for (const sec1 of m1.secciones) {
                    for (const sec2 of m2.secciones) {
                        if (!this.chocanSecciones(sec1, sec2)) {
                            todasChocan = false;
                            break;
                        }
                    }
                    if (!todasChocan) break;
                }

                if (todasChocan) {
                    incompatibles.push({ materia1: m1, materia2: m2 });
                }
            }
        }

        return incompatibles;
    }
};