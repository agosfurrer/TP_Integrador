document.addEventListener("DOMContentLoaded", () => {
    
    // Elementos del Modo Oscuro
    const botonOscuro = document.getElementById("btn-modo-oscuro-form");
    
    // 1. COMPROBACIÓN INICIAL: Lee la memoria al cargar la página
    if (localStorage.getItem("modo-retro") === "oscuro") {
        document.body.classList.add("dark-mode");
        if (botonOscuro) botonOscuro.textContent = "Modo Claro";
    }

    // 2. EVENTO CLIC: Alterna el modo oscuro
    if (botonOscuro) {
        botonOscuro.addEventListener("click", (e) => {
            e.preventDefault(); // Evita cualquier comportamiento extraño del botón
            document.body.classList.toggle("dark-mode");
            
            if (document.body.classList.contains("dark-mode")) {
                botonOscuro.textContent = "Modo Claro";
                localStorage.setItem("modo-retro", "oscuro");
            } else {
                botonOscuro.textContent = "Modo Oscuro";
                localStorage.setItem("modo-retro", "claro");
            }
        });
    }

    // Elementos principales del formulario
    const formulario = document.querySelector("form");
    const cajaAlerta = document.getElementById("mensaje-alerta");

    // Validar que los elementos existan en la página actual antes de continuar
    if (!formulario || !cajaAlerta) return;

    // EVENTO 1: Captura el envío del formulario (submit)
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault(); 
        procesarFormulario();
    });

    // EVENTO 2: Monitorea cuando el usuario escribe en el celular (input)
    const inputCelular = document.getElementById("celular");
    if (inputCelular) {
        inputCelular.addEventListener("input", () => {
            inputCelular.value = inputCelular.value.replace(/[^0-9]/g, '');
        });
    }

    // EVENTO 3: Limpia los mensajes cuando el usuario presiona "Limpiar" (reset)
    formulario.addEventListener("reset", () => {
        cajaAlerta.style.display = "none";
        cajaAlerta.className = "alerta-retro";
        cajaAlerta.textContent = "";
    });

    function procesarFormulario() {
        try {
            validarCamposObligatorios();
            mostrarMensaje("¡Formulario procesado con éxito! Gracias por tu opinión.", "exito");
        } catch (error) {
            mostrarMensaje(error.message, "error");
        }
    }

    function validarCamposObligatorios() {
        const nombre = document.getElementById("nombre").value.trim();
        const celular = document.getElementById("celular").value.trim();
        const email = document.getElementById("email").value.trim();
        const valoraciones = document.getElementsByName("valoracion");

        if (nombre === "") {
            throw new Error("Error de validación: El campo 'Nombre' es obligatorio.");
        }
        if (celular === "") {
            throw new Error("Error de validación: El campo 'Celular' es obligatorio.");
        }
        if (celular.length < 8) {
            throw new Error("Error de validación: Ingrese un número de celular válido (mínimo 8 dígitos).");
        }
        if (email === "") {
            throw new Error("Error de validación: El campo 'Email' es obligatorio.");
        }

        let seleccionoValoracion = false;
        for (let i = 0; i < valoraciones.length; i++) {
            if (valoraciones[i].checked) {
                seleccionoValoracion = true;
                break;
            }
        }
        if (!seleccionoValoracion) {
            throw new Error("Error de validación: Por favor, seleccione si le gustó la página.");
        }
    }

    function mostrarMensaje(texto, tipo) {
        cajaAlerta.style.display = "block";
        cajaAlerta.textContent = texto;
        cajaAlerta.className = `alerta-retro ${tipo}`;
    }
});