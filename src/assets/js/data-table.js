$("#datatable").DataTable({
  columnDefs: [
    { orderable: false, targets: 0,  },
  ],
  dom: "<'row'<'col-sm-12'tr>>" + "<'row mt-3'<'col-sm-6'l><'col-sm-6'p>>",
  language: {
    lengthMenu: "Mostrando _MENU_",
    paginate: {
      first: "Primero",
      last: "Último",
      next: "Siguiente",
      previous: "Anterior",
    },
  },
  info: true,
  searching: false,
  initComplete: function () {
    const totalEntries = this.api().data().length;
    $(".dataTables_length label").append(` de ${totalEntries} entradas`);
  },
});