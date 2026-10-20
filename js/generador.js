/**
 * Módulo para generar combinaciones de horarios con descarte temprano (Backtracking).
 */
const GeneradorHorarios = {
    /**
     * Genera todas las combinaciones válidas de secciones sin choques.
     * @param {Array<Object>} materiasSeleccionadas - Materias elegidas.
     * @param {Object} fijadas - { codigoMateria: idSeccion }
     * @param {Object} excluidas - { codigoMateria: [idSeccion1, ...] }
     * @returns {Array<Array<Object>>} Lista de combinaciones válidas.
     */
    generar(materiasSeleccionadas, fijadas = {}, excluidas = {}) {
        if (!materiasSeleccionadas || materiasSeleccionadas.length === 0) {
            return [];
        }

        // Filtrar secciones según reglas de fijar/excluir
        const materiasFiltradas = materiasSeleccionadas.map(materia => {
            let seccionesValidas = materia.secciones;

            if (fijadas[materia.codigo]) {
                seccionesValidas = seccionesValidas.filter(s => s.id === fijadas[materia.codigo]);
            } else if (excluidas[materia.codigo]) {
                seccionesValidas = seccionesValidas.filter(s => !excluidas[materia.codigo].includes(s.id));
            }

            return {
                codigo: materia.codigo,
                nombre: materia.nombre,
                uc: materia.uc,
                secciones: seccionesValidas
            };
        });

        // Si alguna materia se quedó sin secciones válidas, no hay solución
        if (materiasFiltradas.some(m => m.secciones.length === 0)) {
            return [];
        }

        const resultados = [];
        this._backtrack(materiasFiltradas, 0, [], resultados);
        return resultados;
    },

    /**
     * Algoritmo recursivo con descarte temprano.
     */
    _backtrack(materias, index, combinacionActual, resultados) {
        // Caso base: se asignó una sección para cada materia sin choques
        if (index === materias.length) {
            resultados.push([...combinacionActual]);
            return;
        }

        const materiaActual = materias[index];

        for (const seccion of materiaActual.secciones) {
            // Evaluamos choque con las secciones ya elegidas en esta rama
            let choca = false;
            for (const item of combinacionActual) {
                if (DetectorChoques.chocanSecciones(item.seccion, seccion)) {
                    choca = true;
                    break; // Descarte temprano: se interrumpe la evaluación de esta rama
                }
            }

            // Si no chocó, avanzamos recursivamente a la siguiente materia
            if (!choca) {
                combinacionActual.push({
                    materiaCodigo: materiaActual.codigo,
                    materiaNombre: materiaActual.nombre,
                    uc: materiaActual.uc,
                    seccion: seccion
                });

                this._backtrack(materias, index + 1, combinacionActual, resultados);

                combinacionActual.pop(); // Backtrack
            }
        }
    }
};