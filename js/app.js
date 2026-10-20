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