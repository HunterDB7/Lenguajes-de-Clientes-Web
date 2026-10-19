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

        materias.forEach(materia => {
            const esSeleccionada = SeleccionState.estaSeleccionada(materia.codigo);
            const card = document.createElement('div');
            card.className = `materia-card ${materia.esManual ? 'materia-manual' : ''}`;

            card.innerHTML = `
                <div class="materia-header">
                    <span class="materia-codigo">${materia.codigo}</span>
                    <span class="materia-badge">Trimestre ${materia.trimestre}</span>
                    ${materia.esManual ? '<span class="badge-manual">Manual</span>' : ''}
                </div>
                <h4 class="materia-titulo">${materia.nombre}</h4>
                <div class="materia-info">
                    <span>UC: <strong>${materia.uc}</strong></span> | 
                    <span>Secciones: <strong>${materia.secciones.length}</strong></span>
                </div>
                <div class="materia-acciones">
                    <button class="btn btn-sm ${esSeleccionada ? 'secondary' : 'primary'} btn-toggle-seleccion" data-codigo="${materia.codigo}">
                        ${esSeleccionada ? 'Quitar' : 'Seleccionar'}
                    </button>
                    <button class="btn btn-sm secondary btn-toggle-detalle" data-codigo="${materia.codigo}">
                        Ver Secciones
                    </button>
                </div>
                <div id="detalle-${materia.codigo}" class="materia-detalle oculto">
                    ${this.generarHTMLSecciones(materia.secciones)}
                </div>
            `;

            // Eventos de botones dentro de la tarjeta
            card.querySelector('.btn-toggle-seleccion').addEventListener('click', (e) => {
                const codigo = e.target.dataset.codigo;
                if (SeleccionState.estaSeleccionada(codigo)) {
                    SeleccionState.quitarMateria(codigo);
                } else {
                    SeleccionState.agregarMateria(materia);
                }
            });

            card.querySelector('.btn-toggle-detalle').addEventListener('click', (e) => {
                const detalleDiv = card.querySelector(`#detalle-${materia.codigo}`);
                detalleDiv.classList.toggle('oculto');
                e.target.textContent = detalleDiv.classList.contains('oculto') ? 'Ver Secciones' : 'Ocultar Secciones';
            });

            this.contenedorLista.appendChild(card);
        });
    }
};