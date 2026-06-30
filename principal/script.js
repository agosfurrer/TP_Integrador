document.addEventListener("DOMContentLoaded", () => {
    configurarBotonesCierre();
    hacerTodasLasVentanasArrastrables();
    configurarModoOscuroRetro();
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
 * FUNCIÓN 2: Arrastre de Ventanas 
 */
function hacerTodasLasVentanasArrastrables() {
    // SELECCIÓN EXACTA: Buscamos tanto la barra de la principal como la de los asides 
    const cabeceras = document.querySelectorAll(".barra-titulo, .barra-titulo-mini");

    cabeceras.forEach(cabecera => {
        cabecera.style.cursor = "move";

        cabecera.addEventListener("mousedown", (e) => {
            // No arrastrar si el usuario hace clic justo arriba de la X
            if (e.target.tagName === "BUTTON" || e.target.classList.contains("btn-win-mini")) return;
            
            e.preventDefault();

            // Detectamos el contenedor correcto según la estructura del HTML
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

                // Aplicamos el movimiento visual sin alterar las propiedades de CSS
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
                
                // ventana.style.zIndex = "50"; // Devolvemos la ventana a su capa visual normal
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
    
    // Control de seguridad: Si no encuentra el ID, no ejecuta para no romper el script
    if (!botonRetro) return;

    // PERSISTENCIA: Verifica si el usuario ya lo había activado antes
    if (localStorage.getItem("modo-retro") === "oscuro") {
        document.body.classList.add("dark-mode");
        botonRetro.textContent = "Modo Claro";
    }

    // ESCUCHADOR DE EVENTOS: Separación absoluta de HTML y JS
    botonRetro.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        // Cambiamos el texto del botón y guardamos el estado en el navegador
        if (document.body.classList.contains("dark-mode")) {
            botonRetro.textContent = "Modo Claro";
            localStorage.setItem("modo-retro", "oscuro");
            console.log("Modo oscuro retro aplicado.");
        } else {
            botonRetro.textContent = "Modo Oscuro";
            localStorage.setItem("modo-retro", "claro");
            console.log("Modo claro retro aplicado.");
        }
    });
}