/**
 * Estado y lógica de la Selección Actual de Materias.
 */
const SeleccionState = {
    materiasSeleccionadas: [], // Lista de materias elegidas
    topeUC: 28,                 // Límite por defecto de UC
    seccionesFijadas: {},      // { codigoMateria: idSeccion }
    seccionesExcluidas: {},    // { codigoMateria: [idSeccion1, idSeccion2] }

    init() {
        this.contenedorLista = document.getElementById('lista-seleccionadas');
        this.contadorMaterias = document.getElementById('contador-materias');
        this.contadorUC = document.getElementById('contador-uc');
        this.btnGenerar = document.getElementById('btn-generar');

        this.renderizar();
    },

    estaSeleccionada(codigo) {
        return this.materiasSeleccionadas.some(m => m.codigo === codigo);
    },

    calcularTotalUC() {
        return this.materiasSeleccionadas.reduce((sum, m) => sum + m.uc, 0);
    },

    agregarMateria(materia) {
        if (this.estaSeleccionada(materia.codigo)) return;

        const ucProyectadas = this.calcularTotalUC() + materia.uc;
        if (ucProyectadas > this.topeUC) {
            alert(`No se puede agregar ${materia.nombre}. Excedería el tope de ${this.topeUC} UC por ${ucProyectadas - this.topeUC} UC.`);
            return;
        }

        this.materiasSeleccionadas.push(materia);
        this.actualizarUI();
    },

    quitarMateria(codigo) {
        this.materiasSeleccionadas = this.materiasSeleccionadas.filter(m => m.codigo !== codigo);
        delete this.seccionesFijadas[codigo];
        delete this.seccionesExcluidas[codigo];
        this.actualizarUI();
    },

    actualizarUI() {
        this.renderizar();
        CatalogoUI.renderizar(); // Actualizar botones del catálogo
    },

    renderizar() {
        const totalMaterias = this.materiasSeleccionadas.length;
        const totalUC = this.calcularTotalUC();

        this.contadorMaterias.textContent = totalMaterias;
        this.contadorUC.textContent = totalUC;
        this.btnGenerar.disabled = totalMaterias === 0;

        if (totalMaterias === 0) {
            this.contenedorLista.innerHTML = `<p class="text-muted">No has seleccionado ninguna materia.</p>`;
            return;
        }

        this.contenedorLista.innerHTML = "";

        this.materiasSeleccionadas.forEach(materia => {
            const item = document.createElement('div');
            item.className = 'item-seleccionado';
            item.innerHTML = `
                <div class="item-seleccionado-header">
                    <div>
                        <strong>${materia.codigo}</strong> - ${materia.nombre}
                        <span class="materia-uc">(${materia.uc} UC)</span>
                    </div>
                    <button class="btn-eliminar-seleccion" data-codigo="${materia.codigo}">&times;</button>
                </div>
            `;

            item.querySelector('.btn-eliminar-seleccion').addEventListener('click', () => {
                this.quitarMateria(materia.codigo);
            });

            this.contenedorLista.appendChild(item);
        });
    }
};