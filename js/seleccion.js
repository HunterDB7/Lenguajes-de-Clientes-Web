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