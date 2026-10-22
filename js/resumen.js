/**
 * Módulo para la vista final de Horario Definitivo e Impresión.
 */
const ResumenUI = {
    init() {
        this.vistaResumen = document.getElementById('vista-resumen');
        this.btnImprimir = document.getElementById('btn-imprimir-resumen');
        this.btnElegirDefinitivo = document.getElementById('btn-elegir-definitivo');

        this.registrarEventos();
    },

    registrarEventos() {
        if (this.btnElegirDefinitivo) {
            this.btnElegirDefinitivo.addEventListener('click', () => this.mostrarHorarioDefinitivo());
        }
        if (this.btnImprimir) {
            this.btnImprimir.addEventListener('click', () => window.print());
        }
    },

    mostrarHorarioDefinitivo() {
        const opcion = RejillaUI.resultadosActuales[RejillaUI.indiceActual];
        if (!opcion) return;

        this.vistaResumen.classList.remove('oculto');
        this.renderizarTablaResumen(opcion);
        this.vistaResumen.scrollIntoView({ behavior: 'smooth' });
    },

    renderizarTablaResumen(combinacion) {
        const tbody = document.getElementById('body-tabla-resumen');
        if (!tbody) return;

        tbody.innerHTML = "";

        combinacion.forEach(item => {
            const tr = document.createElement('tr');
            
            const resumenHorario = item.seccion.horario.map(s => {
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