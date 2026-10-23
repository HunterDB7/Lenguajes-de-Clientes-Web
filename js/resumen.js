/**
 * Módulo para la vista final de Horario Definitivo e Impresión.
 */
const ResumenUI = { // Objeto que encapsula la lógica de la vista de resumen del horario definitivo
    init() {
        this.vistaResumen = document.getElementById('vista-resumen');
        this.btnImprimir = document.getElementById('btn-imprimir-resumen');
        this.btnElegirDefinitivo = document.getElementById('btn-elegir-definitivo');

        this.registrarEventos();
    },

    registrarEventos() { // Registra eventos de botones para mostrar el resumen y la impresión
        if (this.btnElegirDefinitivo) {
            this.btnElegirDefinitivo.addEventListener('click', () => this.mostrarHorarioDefinitivo());
        }
        if (this.btnImprimir) {
            this.btnImprimir.addEventListener('click', () => window.print());
        }
    },

    mostrarHorarioDefinitivo() { // Muestra la vista de resumen del horario definitivo seleccionado
        const opcion = RejillaUI.resultadosActuales[RejillaUI.indiceActual];
        if (!opcion) return;

        this.vistaResumen.classList.remove('oculto');
        this.renderizarTablaResumen(opcion);
        this.vistaResumen.scrollIntoView({ behavior: 'smooth' });
    },

    renderizarTablaResumen(combinacion) { // Renderiza la tabla de resumen con los detalles de la combinación seleccionada
        const tbody = document.getElementById('body-tabla-resumen');
        if (!tbody) return;

        tbody.innerHTML = "";

        combinacion.forEach(item => { // Para cada materia en la combinación, creamos una fila con sus detalles
            const tr = document.createElement('tr');
            
            const resumenHorario = item.seccion.horario.map(s => { // Formateamos el horario de cada sesión
                const h = DetectorChoques.obtenerHorasSesion(s.bloques);
                return `${s.dia} ${h.inicio}-${h.fin} (${s.aula})`;
            }).join(', ');

            tr.innerHTML = `
                <td><strong>${item.materiaCodigo}</strong></td>
                <td>${item.materiaNombre}</td>
                <td>Sec. ${item.seccion.id}</td>
                <td>${item.seccion.profesor}</td>
                <td>${resumenHorario}</td>
                <td>${item.uc} UC</td>
            `;

            tbody.appendChild(tr);
        });
    }
};