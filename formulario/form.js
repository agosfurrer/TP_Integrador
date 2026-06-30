// Esperar a que el DOM esté completamente cargado antes de mapear los elementos
document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.querySelector("form");
    const cajaAlerta = document.getElementById("mensaje-alerta");

    // Validar que los elementos existan en la página actual
    if (!formulario || !cajaAlerta) return;

    // EVENTO 1: Captura el envío del formulario (submit)
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault(); // Detiene el envío real para poder validar primero
        procesarFormulario();
    });

   // EVENTO 2: Monitorea cuando el usuario escribe en el celular (input)
    const inputCelular = document.getElementById("celular");
    if (inputCelular) {
        inputCelular.addEventListener("input", () => {
            // Elimina inmediatamente cualquier caracter que no sea un número en tiempo real
            inputCelular.value = inputCelular.value.replace(/[^0-9]/g, '');
        });
    }

    // EVENTO 3: Limpia los mensajes cuando el usuario presiona "Limpiar" (reset)
    formulario.addEventListener("reset", () => {
        cajaAlerta.style.display = "none";
        cajaAlerta.className = "alerta-retro";
        cajaAlerta.textContent = "";
    });

   // FUNCIÓN 1: Responsabilidad principal de control y manejo de excepciones
    function procesarFormulario() {
        try {
            // Ejecutamos las validaciones obligatorias
            validarCamposObligatorios();

            // Si pasa la validación sin lanzar errores, muestra éxito
            mostrarMensaje("¡Formulario procesado con éxito! Gracias por tu opinión.", "exito");
            
            // Opcional: Aquí podrías limpiar el formulario después de un envío exitoso
            // formulario.reset();

        } catch (error) {
            // El bloque catch captura el error lanzado por la validación y lo muestra en pantalla
            mostrarMensaje(error.message, "error");
        }
    }

    // FUNCIÓN 2: Responsabilidad de chequeo lógico de datos cargados
    function validarCamposObligatorios() {
        const nombre = document.getElementById("nombre").value.trim();
        const celular = document.getElementById("celular").value.trim();
        const email = document.getElementById("email").value.trim();
        const valoraciones = document.getElementsByName("valoracion");

        // 1. Validar campo Nombre vacío
        if (nombre === "") {
            throw new Error("Error de validación: El campo 'Nombre' es obligatorio.");
        }

        // 2. Validar campo Celular vacío o incompleto (mínimo de dígitos lógico)
        if (celular === "") {
            throw new Error("Error de validación: El campo 'Celular' es obligatorio.");
        }
        if (celular.length < 8) {
            throw new Error("Error de validación: Ingrese un número de celular válido (mínimo 8 dígitos).");
        }

        // 3. Validar campo Email vacío
        if (email === "") {
            throw new Error("Error de validación: El campo 'Email' es obligatorio.");
        }

        // 4. Validar que al menos haya seleccionado una opción de la valoración de la página
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

   
    // FUNCIÓN 3: Responsabilidad de manipulación del DOM y renderizado de texto
    function mostrarMensaje(texto, tipo) {
        cajaAlerta.style.display = "block";
        cajaAlerta.textContent = texto;               // Modifica el texto dinámicamente
        cajaAlerta.className = `alerta-retro ${tipo}`; // Cambia estilos agregando clases
    }
});