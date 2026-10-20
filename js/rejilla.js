/**
 * Módulo para el renderizado de la Rejilla Semanal con CSS Grid.
 */
const RejillaUI = {
    dias: ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'],
    coloresMaterias: {},

    init() {
        this.contenedorRejilla = document.getElementById('rejilla-semanal');
        this.contenedorMetricas = document.getElementById('metricas-horario');
        this.indicadorPaginacion = document.getElementById('indicador-paginacion');
        this.btnAnterior = document.getElementById('btn-prev-horario');
        this.btnSiguiente = document.getElementById('btn-next-horario');

        this.resultadosActuales = [];
        this.indiceActual = 0;

        this.registrarEventos();
    },

    registrarEventos() {
        if (this.btnAnterior && this.btnSiguiente) {
            this.btnAnterior.addEventListener('click', () => this.cambiarPagina(-1));
            this.btnSiguiente.addEventListener('click', () => this.cambiarPagina(1));
        }
    },

    /**
     * Asigna un color consistente a cada materia de la selección.
     */
    generarPaletaColores(materias) {
        const paleta = [
            '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', 
            '#ec4899', '#06b6d4', '#84cc16', '#d97706'
        ];
        this.coloresMaterias = {};
        materias.forEach((m, idx) => {
            this.coloresMaterias[m.materiaCodigo] = paleta[idx % paleta.length];
        });
    },

    /**
     * Carga una lista de combinaciones válidas y renderiza la primera opción.
     */
    mostrarResultados(combinaciones) {
        this.resultadosActuales = combinaciones;
        this.indiceActual = 0;

        if (combinaciones.length === 0) {
            this.renderizarVacio();
            return;
        }

        this.generarPaletaColores(combinaciones[0]);
        this.renderizarOpcionActual();
    },

    cambiarPagina(delta) {
        const nuevoIndice = this.indiceActual + delta;
        if (nuevoIndice >= 0 && nuevoIndice < this.resultadosActuales.length) {
            this.indiceActual = nuevoIndice;
            this.renderizarOpcionActual();
        }
    },

    renderizarOpcionActual() {
        const opcion = this.resultadosActuales[this.indiceActual];
        this.indicadorPaginacion.textContent = `Opción ${this.indiceActual + 1} de ${this.resultadosActuales.length}`;

        this.btnAnterior.disabled = this.indiceActual === 0;
        this.btnSiguiente.disabled = this.indiceActual === this.resultadosActuales.length - 1;

        this.dibujarGrid(opcion);
        this.calcularYMostrarMetricas(opcion);
    },

    dibujarGrid(combinacion) {
        if (!this.contenedorRejilla) return;
        this.contenedorRejilla.innerHTML = "";

        // Encabezados de días
        this.dias.forEach(dia => {
            const header = document.createElement('div');
            header.className = 'grid-header-dia';
            header.textContent = dia;
            this.contenedorRejilla.appendChild(header);
        });

        // Minutos de referencia (07:00 = 420 min, 18:15 = 1095 min)
        const minInicioBase = 420; 

        combinacion.forEach(item => {
            const color = this.coloresMaterias[item.materiaCodigo] || '#3b82f6';

            item.seccion.horario.forEach(sesion => {
                const colIndex = this.dias.indexOf(sesion.dia) + 1;
                if (colIndex === 0) return;

                const horas = DetectorChoques.obtenerHorasSesion(sesion.bloques);
                const minInicio = horaAMinutos(horas.inicio) - minInicioBase;
                const minFin = horaAMinutos(horas.fin) - minInicioBase;

                // Fila de inicio y fin en el Grid (escalado de 15 minutos por fila)
                const startRow = Math.floor(minInicio / 15) + 1;
                const endRow = Math.floor(minFin / 15) + 1;

                const bloqueEl = document.createElement('div');
                bloqueEl.className = 'grid-bloque-clase';
                bloqueEl.style.gridColumn = colIndex;
                bloqueEl.style.gridRow = `${startRow} / ${endRow}`;
                bloqueEl.style.backgroundColor = color;

                bloqueEl.innerHTML = `
                    <strong>${item.materiaCodigo}</strong>
                    <span>Sec. ${item.seccion.id}</span>
                    <small>Aula: ${sesion.aula}</small>
                `;

                bloqueEl.title = `${item.materiaNombre}\nProf: ${item.seccion.profesor}\nHorario: ${horas.inicio} - ${horas.fin}`;

                this.contenedorRejilla.appendChild(bloqueEl);
            });
        });
    },

    calcularYMostrarMetricas(combinacion) {
        if (!this.contenedorMetricas) return;

        let diasAsistencia = new Set();
        let totalHorasMuertasMin = 0;

        this.dias.forEach(dia => {
            let sesionesDia = [];
            combinacion.forEach(item => {
                item.seccion.horario.forEach(s => {
                    if (s.dia === dia) {
                        const h = DetectorChoques.obtenerHorasSesion(s.bloques);
                        sesionesDia.push({
                            inicio: horaAMinutos(h.inicio),
                            fin: horaAMinutos(h.fin)
                        });
                    }
                });
            });

            if (sesionesDia.length > 0) {
                diasAsistencia.add(dia);
                sesionesDia.sort((a, b) => a.inicio - b.inicio);

                for (let i = 0; i < sesionesDia.length - 1; i++) {
                    const brecha = sesionesDia[i + 1].inicio - sesionesDia[i].fin;
                    if (brecha > 0) totalHorasMuertasMin += brecha;
                }
            }
        });

        const horasMuertasStr = (totalHorasMuertasMin / 60).toFixed(1);

        this.contenedorMetricas.innerHTML = `
            <span>Días de clase: <strong>${diasAsistencia.size} días</strong></span> | 
            <span>Horas muertas: <strong>${horasMuertasStr} hrs</strong></span>
        `;
    },

    renderizarVacio() {
        if (this.contenedorRejilla) {
            this.contenedorRejilla.innerHTML = `<p class="text-muted grid-vacio">No hay combinaciones para mostrar.</p>`;
        }
        if (this.indicadorPaginacion) this.indicadorPaginacion.textContent = "Opción 0 de 0";
    }
};