/**
 * Proyecto Integrador - Programación III
 * Alumna: Furrer Agostina
 * Funcionalidad: Control de Ventanas (Arrastre Universal por Clases Exactas del HTML)
 */

document.addEventListener("DOMContentLoaded", () => {
    configurarBotonesCierre();
    hacerTodasLasVentanasArrastrables();
});

/**
 * FUNCIÓN 1: Configurar Botones de Cierre (✕)
 */
function configurarBotonesCierre() {
    const botonesX = document.querySelectorAll(".btn-win-mini, .close");

    botonesX.forEach(boton => {
        boton.style.cursor = "pointer";
        
        boton.addEventListener("click", (evento) => {
            evento.stopPropagation(); // Evita que se active el arrastre al hacer clic en la X

            const ventanaContenedora = evento.target.closest(".mini-ventana") || evento.target.closest(".ventana-principal");
            if (ventanaContenedora) {
                ventanaContenedora.style.display = "none";
                console.log("Ventana cerrada.");
            }
        });
    });
}

/**
 * FUNCIÓN 2: Arrastre de Ventanas (Compatible con .barra-titulo y .barra-titulo-mini)
 */
function hacerTodasLasVentanasArrastrables() {
    // SELECCIÓN EXACTA: Buscamos tanto la barra de la principal como la de tus asides (.barra-titulo-mini)
    const cabeceras = document.querySelectorAll(".barra-titulo, .barra-titulo-mini");

    cabeceras.forEach(cabecera => {
        cabecera.style.cursor = "move";

        cabecera.addEventListener("mousedown", (e) => {
            // No arrastrar si el usuario hace clic justo arriba de la X
            if (e.target.tagName === "BUTTON" || e.target.classList.contains("btn-win-mini")) return;
            
            e.preventDefault();

            // Detectamos el contenedor correcto según la estructura de tu HTML
            const ventana = cabecera.closest(".mini-ventana") || cabecera.closest(".ventana-principal");
            if (!ventana) return;

            // Traer la ventana al frente de todo en la pantalla mientras se arrastra
            ventana.style.zIndex = "1000";

            // Si es la primera vez que movemos esta ventana, inicializamos sus coordenadas en 0
            if (!ventana.dataset.movimientoX) {
                ventana.dataset.movimientoX = "0";
                ventana.dataset.movimientoY = "0";
            }

            // Guardamos la posición inicial exacta del cursor del mouse
            let mouseXInicio = e.clientX;
            let mouseYInicio = e.clientY;

            // Cargamos el historial de desplazamiento de esa ventana en particular
            let xAcumulada = parseFloat(ventana.dataset.movimientoX);
            let yAcumulada = parseFloat(ventana.dataset.movimientoY);

            function arrastrarMouse(eventoMove) {
                // Calculamos cuántos píxeles se movió el mouse desde el clic inicial
                let deltaX = eventoMove.clientX - mouseXInicio;
                let deltaY = eventoMove.clientY - mouseYInicio;

                let posX = xAcumulada + deltaX;
                let posY = yAcumulada + deltaY;

                // Aplicamos el movimiento visual sin alterar las propiedades físicas fijos de CSS
                ventana.style.transform = `translate(${posX}px, ${posY}px)`;

                // Guardamos de forma temporal los datos de este movimiento
                ventana.dataset.tempX = posX;
                ventana.dataset.tempY = posY;
            }

            function soltarMouse() {
                document.removeEventListener("mousemove", arrastrarMouse);
                document.removeEventListener("mouseup", soltarMouse);
                
                // Consolidamos la posición final para el próximo arrastre
                ventana.dataset.movimientoX = ventana.dataset.tempX || ventana.dataset.movimientoX;
                ventana.dataset.movimientoY = ventana.dataset.tempY || ventana.dataset.movimientoY;
                
                ventana.style.zIndex = "50"; // Devolvemos la ventana a su capa visual normal
            }

            document.addEventListener("mousemove", arrastrarMouse);
            document.addEventListener("mouseup", soltarMouse);
        });
    });
}
