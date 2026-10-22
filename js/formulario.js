/**
 * Módulo para el formulario de registro y validación de materias manuales.
 */
const FormularioManualUI = {
    init() {
        this.modal = document.getElementById('modal-materia-manual');
        this.form = document.getElementById('form-materia-manual');
        this.btnAbrir = document.getElementById('btn-abrir-manual');
        this.btnCerrar = document.getElementById('btn-cerrar-manual');

        this.registrarEventos();
    },

    registrarEventos() {
        if (this.btnAbrir) {
            this.btnAbrir.addEventListener('click', () => this.abrirModal());
        }
        if (this.btnCerrar) {
            this.btnCerrar.addEventListener('click', () => this.cerrarModal());
        }
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.guardarMateria(e));
        }
    },

    abrirModal() {
        if (this.modal) this.modal.classList.remove('oculto');
    },

    cerrarModal() {
        if (this.modal) {
            this.modal.classList.add('oculto');
            this.form.reset();
        }
    },

    validarCampos(datos) {
        const errores = [];

        if (!datos.codigo.trim()) errores.push("El código de la materia es requerido.");
        if (!datos.nombre.trim()) errores.push("El nombre de la materia es requerido.");
        if (isNaN(datos.uc) || datos.uc < 1 || datos.uc > 5) {
            errores.push("Las Unidades de Crédito deben estar entre 1 y 5.");
        }

        // Verificar código único
        const catalogo = GestorDatos.obtenerMateriasCatalogo();
        if (catalogo.some(m => m.codigo.toUpperCase() === datos.codigo.toUpperCase())) {
            errores.push("El código ingresado ya existe en el catálogo.");
        }

        return errores;
    },

    guardarMateria(e) {
        e.preventDefault();

        const datos = {
            codigo: document.getElementById('manual-codigo').value.trim().toUpperCase(),
            nombre: document.getElementById('manual-nombre').value.trim(),
            trimestre: Number(document.getElementById('manual-trimestre').value),
            uc: Number(document.getElementById('manual-uc').value),
            esManual: true,
            secciones: [
                {
                    id: "001",
                    profesor: "Prof. Asignado (Manual)",
                    horario: [
                        { dia: "LUN", bloques: ["B01", "B02"], aula: "M-01" }
                    ]
                }
            ]
        };

        const errores = this.validarCampos(datos);

        if (errores.length > 0) {
            alert(errores.join("\n"));
            return;
        }

        GestorDatos.obtenerMateriasCatalogo().push(datos);
        CatalogoUI.renderizar();
        this.cerrarModal();
        alert(`Materia manual "${datos.nombre}" registrada con éxito.`);
    }
};