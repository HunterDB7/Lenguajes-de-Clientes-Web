/**
 * Capa de abstracción para el manejo de datos (Catálogo oficial + Materias Manuales).
 */
const GestorDatos = {
    obtenerMateriasCatalogo() {
        return typeof MATERIAS !== 'undefined' ? MATERIAS : [];
    },
    obtenerBloques() {
        return typeof BLOQUES !== 'undefined' ? BLOQUES : [];
    }
};