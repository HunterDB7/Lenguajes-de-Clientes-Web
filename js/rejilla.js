/**
 * Módulo para el renderizado de la Rejilla Semanal con CSS Grid.
 */
const RejillaUI = {
    dias: ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'],
    horas: [
        '07:00', '07:45', '08:30', '09:15', '10:00', '10:45', 
        '11:30', '12:15', '13:00', '13:45', '14:30', '15:15', 
        '16:00', '16:45', '17:30', '18:15'
    ],
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

        // 1. Celda esquina superior izquierda vacía
        const esquina = document.createElement('div');
        esquina.className = 'grid-esquina';
        this.contenedorRejilla.appendChild(esquina);

        // 2. Encabezados de días (Columnas 2 a 7)
        this.dias.forEach(dia => {
            const header = document.createElement('div');
            header.className = 'grid-header-dia';
            header.textContent = dia;
            this.contenedorRejilla.appendChild(header);
        });

        // 3. Generar filas de horas y etiquetas de hora a la izquierda
        this.horas.forEach((hora, index) => {
            const filaIndex = (index * 3) + 2; // Multiplicamos por 3 (cada hora/intervalo son 3 filas de 15 min) + 2 por el encabezado

            const etiquetaHora = document.createElement('div');
            etiquetaHora.className = 'grid-etiqueta-hora';
            etiquetaHora.style.gridRow = filaIndex;
            etiquetaHora.style.gridColumn = 1;
            etiquetaHora.textContent = hora;
            this.contenedorRejilla.appendChild(etiquetaHora);
        });
        
        // Minutos de referencia (07:00 = 420 min)
        const minInicioBase = 420; 

        // 4. Dibujar bloques de clases
        combinacion.forEach(item => {
            const color = this.coloresMaterias[item.materiaCodigo] || '#3b82f6';

            item.seccion.horario.forEach(sesion => {
                const colIndex = this.dias.indexOf(sesion.dia) + 2; // +2 por la columna de horas
                if (colIndex < 2) return;

                const horasSesion = DetectorChoques.obtenerHorasSesion(sesion.bloques);
                const minInicio = horaAMinutos(horasSesion.inicio) - minInicioBase;
                const minFin = horaAMinutos(horasSesion.fin) - minInicioBase;

                // Cada bloque de 15 minutos equivale a 1 fila en el grid (comenzando desde la fila 2)
                const startRow = Math.floor(minInicio / 15) + 2;
                const endRow = Math.floor(minFin / 15) + 2;

                const bloqueEl = document.createElement('div');
                bloqueEl.className = 'grid-bloque-clase';
                bloqueEl.style.gridColumn = colIndex;
                bloqueEl.style.gridRow = `${startRow} / ${endRow}`;
                bloqueEl.style.backgroundColor = color;

                bloqueEl.innerHTML = `
                    <strong>${item.materiaCodigo}</strong><br>
                    <span>Sec. ${item.seccion.id}</span> | <small>${sesion.aula}</small>
                `;

                bloqueEl.title = `${item.materiaNombre}\nProf: ${item.seccion.profesor}\nHorario: ${horasSesion.inicio} - ${horasSesion.fin}`;

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
            this.contenedorRejilla.innerHTML = `<p class="text-muted grid-vacio" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">No hay combinaciones para mostrar.</p>`;
        }
        if (this.indicadorPaginacion) this.indicadorPaginacion.textContent = "Opción 0 de 0";
        if (this.contenedorMetricas) this.contenedorMetricas.innerHTML = "";
    }
};