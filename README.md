# CronosURU: Optimizador y Armador de Horarios Académicos

## 1. Descripción General del Proyecto
CronosURU es una página web diseñada para facilitar la creación de horarios de clases en la universidad.
Su objetivo principal es permitir que el estudiante elija las materias que va a cursar y, de forma automática, 
calcule todas las combinaciones posibles de horarios sin que se crucen las horas de clase. Cuenta con un diseño 
visual ordenado, permite navegar fácilmente entre las diferentes opciones de horario y ofrece herramientas para calcular estadísticas de tiempo libre.

---

## 2. Autoría y División del Trabajo
* Autor / Desarrollador: Neil Togandi
* Distribución de Tareas: Al no conseguir pareja, todo el proyecto fue realizado por mi persona. Esto incluye la creación de la  estructura del código,
*  la programación del sistema que detecta los choques de horario, el diseño visual de la interfaz y la integración de las funciones de cálculo y estadísticas.

---

## 3. Guía de Ejecución e Instalación
El proyecto está construido con tecnologías web estándar (HTML, CSS y JavaScript) que funcionan directamente en cualquier navegador,
sin necesidad de instalar programas complicados ni herramientas adicionales.

1. Descarga del código: Descarga o clona la carpeta del proyecto en tu computadora.
2. Archivos necesarios: Mantén todos los archivos organizados en sus respectivas carpetas (`/js`, `/css` y la raíz).
3. Ejecución: Haz doble clic en el archivo “index.htm” para abrirlo directamente en tu navegador favorito (Chrome, Edge, Firefox, etc.).
   Recomendación: Si usas Visual Studio Code, puedes abrir la carpeta y usar la extensión “Live Server” para una mejor experiencia.

---

## 4. Criterios de Ordenamiento, Filtrado y Métricas Analíticas
Para ayudar al estudiante a elegir la opción de horario más cómoda, la aplicación calcula y muestra automáticamente datos clave por cada combinación:

* Días de clase activos: Muestra cuántos días a la semana tendrás que ir presencialmente a la universidad.
* Horas muertas: Calcula el tiempo libre que queda entre una clase y otra el mismo día, sumando esos espacios vacíos para que puedas evaluar qué horario es menos pesado.
* Búsqueda y filtros: Permite buscar materias rápidamente por su nombre o código, filtrarlas por trimestre y también agregar materias de forma
*  manual en caso de que alguna no aparezca en el sistema oficial.

---

## 5. Decisiones de Diseño y Arquitectura UI/UX

### Paleta de Colores
Se eligió una gama de colores limpia y profesional (tonos grises oscuros y azulados, como el `#1e293b` para los encabezados) para evitar el cansancio visual.
Además, cada materia recibe un color único de forma automática para que sea fácil reconocerla en el calendario sin importar qué opción de horario estés viendo.

### Tipografía y Jerarquía Visual
Se utilizaron letras sencillas y limpias que permiten leer con total claridad los códigos, las secciones y las aulas, incluso cuando hay mucha
información reunida en la pantalla.

### Criterio de Maquetación
La interfaz está organizada como un panel de control ordenado. Utiliza una cuadrícula precisa donde cada fila equivale a un bloque de 15 minuto 
logrando que las horas de la columna izquierda coincidan perfectamente con la duración de las clases. Además, el panel de selección de materias 
se mantiene fijo a un lado de la pantalla para que no tengas que buscarlo al moverte por la página.

### Referencias de Inspiración
El diseño está inspirado en paneles de control modernos y herramientas de organización pensadas para ser prácticas, limpias y eficientes en el día a día del estudiante.
