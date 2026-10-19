/**
 * Módulo de gestión y renderizado del Catálogo de Materias.
 */
const CatalogoUI = {
    init() {
        this.inputBuscador = document.getElementById('buscador-materias');
        this.selectTrimestre = document.getElementById('filtro-trimestre');
        this.contenedorLista = document.getElementById('lista-catalogo');

        this.registrarEventos();
        this.renderizar();
    },

    registrarEventos() {
        this.inputBuscador.addEventListener('input', () => this.renderizar());
        this.selectTrimestre.addEventListener('change', () => this.renderizar());
    },

    /**
     * Obtiene las materias filtradas según los controles de la interfaz.
     */
    obtenerMateriasFiltradas() {
        const texto = this.inputBuscador.value.toLowerCase().trim();
        const trimestre = this.selectTrimestre.value;

        return GestorDatos.obtenerMateriasCatalogo().filter(materia => {
            const coincideTexto = materia.nombre.toLowerCase().includes(texto) ||
                                 materia.codigo.toLowerCase().includes(texto);
            const coincideTrimestre = trimestre === "" || materia.trimestre === Number(trimestre);

            return coincideTexto && coincideTrimestre;
        });
    },

    /**
     * Convierte los IDs de bloque de una sesión en un horario formateado "HH:MM - HH:MM".
     */
    formatearHorarioSesion(bloquesIds) {
        const bloquesCatalogo = GestorDatos.obtenerBloques();
        const bloquesCoincidentes = bloquesCatalogo.filter(b => bloquesIds.includes(b.id));

        if (bloquesCoincidentes.length === 0) return "Horario no disponible";

        // Ordenar por hora de inicio
        bloquesCoincidentes.sort((a, b) => horaAMinutos(a.inicio) - horaAMinutos(b.inicio));

        const horaInicio = bloquesCoincidentes[0].inicio;
        const horaFin = bloquesCoincidentes[bloquesCoincidentes.length - 1].fin;

        return `${horaInicio} - ${horaFin}`;
    },

    /**
     * Dibuja la lista de materias en el DOM.
     */
    renderizar() {
        const materias = this.obtenerMateriasFiltradas();
        this.contenedorLista.innerHTML = "";

        if (materias.length === 0) {
            this.contenedorLista.innerHTML = `<p class="text-muted">No se encontraron materias que coincidan con los criterios de búsqueda.</p>`;
            return;
        }