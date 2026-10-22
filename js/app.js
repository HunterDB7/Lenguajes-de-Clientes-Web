/**
 * Punto de entrada general de la aplicación.
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log("CronosURU iniciado con éxito.");
    console.log(`Bloques cargados: ${GestorDatos.obtenerBloques().length}`);
    console.log(`Materias en catálogo: ${GestorDatos.obtenerMateriasCatalogo().length}`);
});

document.addEventListener('DOMContentLoaded', () => {
    CatalogoUI.init();
    SeleccionState.init();
    console.log("CronosURU iniciado con catálogo y selección listos.");
});

document.addEventListener('DOMContentLoaded', () => {
    CatalogoUI.init();
    SeleccionState.init();
    RejillaUI.init();
    FormularioManualUI.init();
    ResumenUI.init();

    // Evento del botón Generar
    const btnGenerar = document.getElementById('btn-generar');
    if (btnGenerar) {
        btnGenerar.addEventListener('click', () => {
            const seleccionadas = SeleccionState.materiasSeleccionadas;
            const resultados = GeneradorHorarios.generar(
                seleccionadas, 
                SeleccionState.seccionesFijadas, 
                SeleccionState.seccionesExcluidas
            );

            // Filtrar y ordenar según preferencias
            const filtrados = PreferenciasState.filtrar(resultados);
            const ordenados = PreferenciasState.ordenar(filtrados);

            RejillaUI.mostrarResultados(ordenados);
        });
    }

    console.log("CronosURU iniciado completamente con el 100% de sus funciones.");
});