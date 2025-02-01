
// Maneja el cambio dinámico al escribir
function handleInputChange() {
    const input = document.getElementById("searchInput");
    const clearButton = document.getElementById("clearButton");

    // Muestra la cruz si hay texto, la oculta si está vacío
    if (input.value.trim() !== "") {
        clearButton.style.display = "block"; // Muestra el ícono de la cruz
        clearButton.classList.remove("locked"); // Asegura que tenga el color al escribir
    } else {
        clearButton.style.display = "none"; // Oculta el ícono de la cruz
    }
}

// Maneja el evento "Enter" para bloquear el input
function handleEnterKey(event) {
    if (event.key === "Enter") {
        const input = event.target;
        const clearButton = document.getElementById("clearButton");

        input.classList.add("locked"); // Aplica estilos de bloqueo
        input.disabled = true; // Desactiva el input

        // Cambia el color del ícono al bloquear
        clearButton.classList.add("locked"); // Aplica el color #FECF00
    }
}

// Limpia el input y lo regresa a su estado inicial
function clearInput() {
    const input = document.getElementById("searchInput");
    const clearButton = document.getElementById("clearButton");

    input.value = ""; // Limpia el contenido
    input.classList.remove("locked"); // Quita los estilos de bloqueo
    input.disabled = false; // Reactiva el input
    input.style.backgroundColor = ""; // Restaura fondo inicial (opcional)

    // Regresa el ícono a su estado inicial
    clearButton.classList.remove("locked");
    handleInputChange(); // Actualiza el estado de la cruz
}

// Maneja el clic en el ícono de filtro
function handleFilterClick() {
    const iconFilterNotActive = document.getElementById("icon-filter-not-active");
    const iconFilterActive = document.getElementById("icon-filter-active");
    iconFilterNotActive.classList.add("d-none");
    iconFilterActive.classList.remove("d-none");

    const secondColumn = document.getElementById("second-column-filters");
    if (secondColumn.classList.contains("d-none")) {
        secondColumn.classList.remove("d-none");
        iconFilterNotActive.classList.add("d-none");
        iconFilterActive.classList.remove("d-none");
    } else {
        secondColumn.classList.add("d-none");
        iconFilterNotActive.classList.remove("d-none");
        iconFilterActive.classList.add("d-none");
    }
}
