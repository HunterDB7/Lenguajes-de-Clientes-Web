/**
 * Módulo de gestión y renderizado del Catálogo de Materias.
 */
const CatalogoUI = { // Objeto que encapsula la lógica del catálogo de materias
    init() { // Inicializa referencias a elementos del DOM y eventos
        this.inputBuscador = document.getElementById('buscador-materias');
        this.selectTrimestre = document.getElementById('filtro-trimestre');
        this.contenedorLista = document.getElementById('lista-catalogo');

        this.registrarEventos();
        this.renderizar();
    },

    registrarEventos() { // Registra eventos de búsqueda y filtrado
        if (this.inputBuscador) {
            this.inputBuscador.addEventListener('input', () => this.renderizar());
        }
        if (this.selectTrimestre) {
            this.selectTrimestre.addEventListener('change', () => this.renderizar());
        }
    },

    obtenerMateriasFiltradas() { // Retorna las materias filtradas según el texto de búsqueda y el trimestre seleccionado
        const texto = this.inputBuscador ? this.inputBuscador.value.toLowerCase().trim() : '';
        const trimestre = this.selectTrimestre ? this.selectTrimestre.value : '';

        return GestorDatos.obtenerMateriasCatalogo().filter(materia => {
            const coincideTexto = materia.nombre.toLowerCase().includes(texto) ||
                                   materia.codigo.toLowerCase().includes(texto);
            const coincideTrimestre = trimestre === "" || materia.trimestre === Number(trimestre);

            return coincideTexto && coincideTrimestre;
        });
    },

    generarHTMLSecciones(secciones) { // Genera el HTML para mostrar las secciones de una materia
        if (!secciones || secciones.length === 0) return '<p>No hay secciones disponibles.</p>';

        return secciones.map(sec => { // Para cada sección, generamos un bloque con su información y horario
            const horarioStr = sec.horario.map(h => {
                const horas = DetectorChoques.obtenerHorasSesion(h.bloques);
                return `${h.dia}: ${horas.inicio} - ${horas.fin} (Aula: ${h.aula})`;
            }).join('<br>');

            return `
                <div class="seccion-item" style="margin-top: 0.5rem; font-size: 0.85rem; background: #f8fafc; padding: 6px; border-radius: 4px;">
                    <strong>Sección ${sec.id}</strong> - ${sec.profesor}<br>
                    <small>${horarioStr}</small>
                </div>
            `;
        }).join('');
    },

    renderizar() { // Renderiza la lista de materias filtradas en el contenedor del catálogo
        if (!this.contenedorLista) return;
        const materias = this.obtenerMateriasFiltradas();
        this.contenedorLista.innerHTML = "";

        if (materias.length === 0) {
            this.contenedorLista.innerHTML = `<p class="text-muted">No se encontraron materias que coincidan con los criterios de búsqueda.</p>`;
            return;
        }

        materias.forEach(materia => { // Para cada materia, creamos una tarjeta con su información y botones de acción
            const esSeleccionada = typeof SeleccionState !== 'undefined' && SeleccionState.estaSeleccionada(materia.codigo);
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
                <div id="detalle-${materia.codigo}" class="materia-detalle oculto" style="margin-top: 0.75rem;">
                    ${this.generarHTMLSecciones(materia.secciones)}
                </div>
            `;

            const btnSel = card.querySelector('.btn-toggle-seleccion'); // Botón para seleccionar o quitar la materia del estado de selección
            if (btnSel) {
                btnSel.addEventListener('click', (e) => {
                    const codigo = e.target.dataset.codigo;
                    if (typeof SeleccionState !== 'undefined') {
                        if (SeleccionState.estaSeleccionada(codigo)) {
                            SeleccionState.quitarMateria(codigo);
                        } else {
                            const mat = GestorDatos.obtenerMateriasCatalogo().find(m => m.codigo === codigo);
                            if (mat) SeleccionState.agregarMateria(mat);
                        }
                    }
                });
            }

            const btnDet = card.querySelector('.btn-toggle-detalle'); // Botón para mostrar u ocultar el detalle de secciones de la materia
            if (btnDet) {
                btnDet.addEventListener('click', (e) => {
                    const detalleDiv = card.querySelector(`#detalle-${materia.codigo}`);
                    if (detalleDiv) {
                        detalleDiv.classList.toggle('oculto');
                        e.target.textContent = detalleDiv.classList.contains('oculto') ? 'Ver Secciones' : 'Ocultar Secciones';
                    }
                });
            }

            this.contenedorLista.appendChild(card);
        });
    }
};