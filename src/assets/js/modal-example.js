  // Abrir modal
  document.querySelector('.open-modal').addEventListener('click', () => {
    const modal = document.getElementById('detalleModal');
    modal.classList.add('show');
    });

    // Cerrar modal al hacer clic fuera
    document.querySelector('.modal-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        const modal = document.getElementById('detalleModal');
        modal.classList.remove('show');
    }
    });