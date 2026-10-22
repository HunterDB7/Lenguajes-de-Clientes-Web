/**
 * Punto de entrada general y coordinación de la aplicación CronosURU.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar componentes de la interfaz y estado
    if (typeof CatalogoUI !== 'undefined') CatalogoUI.init();
    if (typeof SeleccionState !== 'undefined') SeleccionState.init();
    if (typeof RejillaUI !== 'undefined') RejillaUI.init();
    if (typeof FormularioManualUI !== 'undefined') FormularioManualUI.init();
    if (typeof ResumenUI !== 'undefined') ResumenUI.init();

    // 2. Verificación inicial de datos globales provistos
    const totalBloques = typeof GestorDatos !== 'undefined' ? GestorDatos.obtenerBloques().length : 0;
    const totalMaterias = typeof GestorDatos !== 'undefined' ? GestorDatos.obtenerMateriasCatalogo().length : 0;
    
    console.log(`CronosURU iniciado con éxito.`);
    console.log(`Bloques cargados: ${totalBloques}`);
    console.log(`Materias en catálogo: ${totalMaterias}`);

    // 3. Vincular evento principal del botón Generar Horarios
    const btnGenerar = document.getElementById('btn-generar');
    if (btnGenerar) {
        btnGenerar.addEventListener('click', () => {
            const seleccionadas = SeleccionState.materiasSeleccionadas;
            
            const resultados = GeneradorHorarios.generar(
                seleccionadas, 
                SeleccionState.seccionesFijadas, 
                SeleccionState.seccionesExcluidas
            );

            // Filtrar y ordenar según preferencias del usuario
            const filtrados = PreferenciasState.filtrar(resultados);
            const ordenados = PreferenciasState.ordenar(filtrados);

            RejillaUI.mostrarResultados(ordenados);
        });
    }

    console.log("CronosURU completamente operativo al 100%.");
});