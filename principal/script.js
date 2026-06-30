// 1. VARIABLE GLOBAL: El array debe estar afuera para que el buscador lo pueda leer
const baseConsejos = [
    { titulo: "Postura Correcta", texto: "Mantené la espalda recta apoyada en el respaldo y los pies firmes en el suelo.", palabraClave: "postura" },
    { titulo: "Altura del Monitor", texto: "El borde superior de la pantalla debe quedar alineado a los ojos.", palabraClave: "monitor" },
    { titulo: "Descanso Visual", texto: "Mirá un objeto a 6 metros por 20 segundos cada 20 minutos de código.", palabraClave: "vista" },
    { titulo: "Atajos de Teclado", texto: "Usá Ctrl + F5 para limpiar la caché del navegador al probar tus CSS.", palabraClave: "teclado" },
    { titulo: "Ergonomía de Manos", texto: "Las muñecas deben estar rectas al usar el teclado para evitar el túnel carpiano.", palabraClave: "manos" },
    { titulo: "Orden en el Código", texto: "Indentá bien tu HTML y CSS para que la Prof. Irina te ponga un 10.", palabraClave: "codigo" }
];

document.addEventListener("DOMContentLoaded", () => {
    configurarBotonesCierre();
    hacerTodasLasVentanasArrastrables();
    configurarModoOscuroRetro();

    // Elementos del DOM
    const inputBuscador = document.getElementById("input-buscador");
    const listaResultados = document.getElementById("lista-resultados-tips");

    // Verificar que los elementos existan antes de correr
    if (!inputBuscador || !listaResultados) return;

    // Inicialización automática: Muestra todos los tips apenas abre la página
    filtrarYMostrarTips("", listaResultados);

    // EVENTO: Monitorea en tiempo real la búsqueda
    inputBuscador.addEventListener("keyup", () => {
        const textoBusqueda = inputBuscador.value.toLowerCase().trim();
        filtrarYMostrarTips(textoBusqueda, listaResultados);
    });
});

/**
 * FUNCIÓN 1: Configurar Botones de Cierre (✕)
 */
function configurarBotonesCierre() {
    const botonesX = document.querySelectorAll(".btn-win-mini, .close");
    botonesX.forEach(boton => {
        boton.style.cursor = "pointer";
        
        boton.addEventListener("click", (evento) => {
            evento.stopPropagation(); 

            // Corregido para incluir el contenedor central de la ventana principal
            const ventanaContenedora = evento.target.closest(".mini-ventana") || evento.target.closest(".contenedor-central");
            if (ventanaContenedora) {
                ventanaContenedora.style.display = "none";
                console.log("Ventana cerrada.");
            }
        });
    });
}

/**
 * FUNCIÓN 2: Arrastre de Ventanas
 */
// 1. Declaramos un contador global de capas para las mini-ventanas (fuera de la función)
let capasMiniVentanas = 100; 

function hacerTodasLasVentanasArrastrables() {
    const cabeceras = document.querySelectorAll(".barra-titulo, .barra-titulo-mini");
    cabeceras.forEach(cabecera => {
        cabecera.style.cursor = "move";

        cabecera.addEventListener("mousedown", (e) => {
            if (e.target.tagName === "BUTTON" || e.target.classList.contains("btn-win-mini")) return;
            
            e.preventDefault();

            const ventana = cabecera.closest(".mini-ventana") || cabecera.closest(".contenedor-central");
            if (!ventana) return;

            // 2. CORRECCIÓN MILIMÉTRICA AQUÍ: 
            // Si es una mini-ventana común, aumentamos el contador y se lo asignamos.
            // Esto hace que quede al frente de las demás y SE QUEDE AHÍ incluso al soltar.
            if (ventana.classList.contains("mini-ventana")) {
                capasMiniVentanas++;
                ventana.style.zIndex = capasMiniVentanas.toString();
            } else {
                // Si es la ventana central, mantiene su z-index del CSS para no tapar el nav/footer
                ventana.style.zIndex = "100";
            }

            if (!ventana.dataset.movimientoX) {
                ventana.dataset.movimientoX = "0";
                ventana.dataset.movimientoY = "0";
            }

            let mouseXInicio = e.clientX;
            let mouseYInicio = e.clientY;

            let xAcumulada = parseFloat(ventana.dataset.movimientoX);
            let yAcumulada = parseFloat(ventana.dataset.movimientoY);

            function arrastrarMouse(eventoMove) {
                let deltaX = eventoMove.clientX - mouseXInicio;
                let deltaY = eventoMove.clientY - mouseYInicio;

                let posX = xAcumulada + deltaX;
                let posY = yAcumulada + deltaY;

                if (ventana.classList.contains("contenedor-central")) {
                    ventana.style.transform = `translate(calc(-50% + ${posX}px), ${posY}px)`;
                } else {
                    ventana.style.transform = `translate(${posX}px, ${posY}px)`;
                }

                ventana.dataset.tempX = posX;
                ventana.dataset.tempY = posY;
            }

            function soltarMouse() {
                document.removeEventListener("mousemove", arrastrarMouse);
                document.removeEventListener("mouseup", soltarMouse);
                
                ventana.dataset.movimientoX = ventana.dataset.tempX || ventana.dataset.movimientoX;
                ventana.dataset.movimientoY = ventana.dataset.tempY || ventana.dataset.movimientoY;
                
                // 3. CORRECCIÓN AQUÍ: Eliminamos la línea que reseteaba el zIndex a "2" o "50".
                // Al no tocar el zIndex en el soltar, la ventana conserva el número alto que adquirió en el mousedown.
            }

            document.addEventListener("mousemove", arrastrarMouse);
            document.addEventListener("mouseup", soltarMouse);
        });
    });
}

/**
 * FUNCIÓN 3: Control del Modo Oscuro Retro
 */
function configurarModoOscuroRetro() {
    const botonRetro = document.getElementById("btn-modo-oscuro");
    if (!botonRetro) return;

    if (localStorage.getItem("modo-retro") === "oscuro") {
        document.body.classList.add("dark-mode");
        botonRetro.textContent = "Modo Claro";
    }

    botonRetro.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        if (document.body.classList.contains("dark-mode")) {
            botonRetro.textContent = "Modo Claro";
            localStorage.setItem("modo-retro", "oscuro");
        } else {
            botonRetro.textContent = "Modo Oscuro";
            localStorage.setItem("modo-retro", "claro");
        }
    });
}

/**
 * FUNCIÓN 4: Filtrar y mostrar los Tips en el DOM
 */
function filtrarYMostrarTips(criterio, listaResultados) {
    listaResultados.innerHTML = "";

    // Filtramos buscando coincidencias en título, texto o palabras clave
    const tipsFiltrados = baseConsejos.filter(tip => 
        tip.titulo.toLowerCase().includes(criterio) ||
        tip.texto.toLowerCase().includes(criterio) ||
        tip.palabraClave.toLowerCase().includes(criterio)
    );

    if (tipsFiltrados.length === 0) {
        const itemVacio = document.createElement("p");
        itemVacio.style.fontStyle = "italic";
        itemVacio.style.color = "var(--win-somb)";
        itemVacio.textContent = "No se encontraron consejos.";
        listaResultados.appendChild(itemVacio);
        return;
    }

    tipsFiltrados.forEach(tip => {
        const contenedorTip = document.createElement("div");
        contenedorTip.style.marginBottom = "8px";
        contenedorTip.style.borderBottom = "1px dotted var(--win-somb)";
        contenedorTip.style.paddingBottom = "4px";

        const tituloTip = document.createElement("strong");
        tituloTip.style.color = "var(--win-azul)";
        tituloTip.style.display = "block";
        tituloTip.textContent = tip.titulo;

        const descripcionTip = document.createElement("span");
        descripcionTip.textContent = tip.texto;

        contenedorTip.appendChild(tituloTip);
        contenedorTip.appendChild(descripcionTip);
        listaResultados.appendChild(contenedorTip);
    });
}