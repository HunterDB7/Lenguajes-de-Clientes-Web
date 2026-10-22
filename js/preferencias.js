/**
 * Módulo para el filtrado de preferencias y ordenamiento de horarios generados.
 */
const PreferenciasState = {
    filtros: {
        diasLibres: [],      // ['LUN', 'SAB']
        horaEntradaMin: null, // "07:00"
        horaSalidaMax: null   // "18:00"
    },
    criterioOrden: 'defecto', // 'defecto', 'dias', 'horas_muertas', 'salida_temprana'

    /**
     * Aplica los filtros de preferencia a una lista de combinaciones.
     * @param {Array<Array<Object>>} combinaciones 
     * @returns {Array<Array<Object>>} Combinaciones filtradas
     */
    filtrar(combinaciones) {
        return combinaciones.filter(opcion => {
            for (const item of opcion) {
                for (const sesion of item.seccion.horario) {
                    // Filtro de días libres
                    if (this.filtros.diasLibres.includes(sesion.dia)) {
                        return false;
                    }

                    const horas = DetectorChoques.obtenerHorasSesion(sesion.bloques);

                    // Filtro de hora mínima de entrada
                    if (this.filtros.horaEntradaMin) {
                        if (horaAMinutos(horas.inicio) < horaAMinutos(this.filtros.horaEntradaMin)) {
                            return false;
                        }
                    }

                    // Filtro de hora máxima de salida
                    if (this.filtros.horaSalidaMax) {
                        if (horaAMinutos(horas.fin) > horaAMinutos(this.filtros.horaSalidaMax)) {
                            return false;
                        }
                    }
                }
            }
            return true;
        });
    },

    /**
     * Ordena las combinaciones según el criterio activo.
     * @param {Array<Array<Object>>} combinaciones 
     * @returns {Array<Array<Object>>} Combinaciones ordenadas
     */
    ordenar(combinaciones) {
        const copias = [...combinaciones];

        if (this.criterioOrden === 'dias') {
            return copias.sort((a, b) => this._contarDiasAsistencia(a) - this._contarDiasAsistencia(b));
        } else if (this.criterioOrden === 'horas_muertas') {
            return copias.sort((a, b) => this._calcularHorasMuertasTotales(a) - this._calcularHorasMuertasTotales(b));
        } else if (this.criterioOrden === 'salida_temprana') {
            return copias.sort((a, b) => this._calcularPromedioHoraSalida(a) - this._calcularPromedioHoraSalida(b));
        }

        return copias;
    },

    _contarDiasAsistencia(combinacion) {
        const dias = new Set();
        combinacion.forEach(item => {
            item.seccion.horario.forEach(s => dias.add(s.dia));
        });
        return dias.size;
    },

    _calcularHorasMuertasTotales(combinacion) {
        let totalMin = 0;
        const dias = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];

        dias.forEach(dia => {
            let sesionesDia = [];
            combinacion.forEach(item => {
                item.seccion.horario.forEach(s => {
                    if (s.dia === dia) {
                        const h = DetectorChoques.obtenerHorasSesion(s.bloques);
                        sesionesDia.push({ inicio: horaAMinutos(h.inicio), fin: horaAMinutos(h.fin) });
                    }
                });
            });

            if (sesionesDia.length > 1) {
                sesionesDia.sort((a, b) => a.inicio - b.inicio);
                for (let i = 0; i < sesionesDia.length - 1; i++) {
                    const brecha = sesionesDia[i + 1].inicio - sesionesDia[i].fin;
                    if (brecha > 0) totalMin += brecha;
                }
            }
        });

        return totalMin;
    },

    _calcularPromedioHoraSalida(combinacion) {
        const salidas = [];
        const dias = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];

        dias.forEach(dia => {
            let maxFin = 0;
            combinacion.forEach(item => {
                item.seccion.horario.forEach(s => {
                    if (s.dia === dia) {
                        const h = DetectorChoques.obtenerHorasSesion(s.bloques);
                        const finMin = horaAMinutos(h.fin);
                        if (finMin > maxFin) maxFin = finMin;
                    }
                });
            });
            if (maxFin > 0) salidas.push(maxFin);
        });

        if (salidas.length === 0) return 0;
        return salidas.reduce((a, b) => a + b, 0) / salidas.length;
    }
};