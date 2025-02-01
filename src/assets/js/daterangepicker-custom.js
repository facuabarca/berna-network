$(document).ready(function () {
  // Rangos requeridos por Luciano.
  var predefinedRanges = {
    Diario: [moment(), moment()],
    Mensual: [moment().startOf("month"), moment().endOf("month")],
    Trimestral: [moment().startOf("quarter"), moment().endOf("quarter")],
    Semestral: [
      moment().startOf("year"),
      moment().startOf("year").add(5, "months").endOf("month"),
    ],
    Anual: [moment().startOf("year"), moment().endOf("year")],
    "Ver Todo": [moment().subtract(100, "years"), moment()],
  };

  let currentRangeKey = null;
  let currentStartDate = null;
  let currentEndDate = null;


  // Esta función se encarga de mostrar el rango seleccionado en el UI
  function getRangeLabel() {
    if (!currentRangeKey) {
      return "Seleccione un rango";
    }

    if (currentRangeKey === "Ver Todo") {
      return `${currentStartDate.format("YYYY")} - ∞`;
    } else if (currentRangeKey === "Personalizado") {
      return `${currentStartDate.format(
        "DD/MM/YYYY"
      )} - ${currentEndDate.format("DD/MM/YYYY")}`;
    } else if (currentRangeKey === "Diario") {
      return currentStartDate.format("DD/MM/YYYY");
    } else if (currentRangeKey === "Mensual") {
      return currentStartDate.format("MMMM YYYY");
    } else if (currentRangeKey === "Trimestral") {
      const quarter = Math.ceil((currentStartDate.month() + 1) / 3);
      return `T${quarter} - ${currentStartDate.format("YYYY")}`;
    } else if (currentRangeKey === "Semestral") {
      const semester = currentStartDate.month() < 6 ? "S1" : "S2";
      return `${semester} - ${currentStartDate.format("YYYY")}`;
    } else if (currentRangeKey === "Anual") {
      return currentStartDate.format("YYYY");
    }
  }

  function updateUI() {
    $("#report-range-ui span").text(
      currentRangeKey ? getRangeLabel() : "Seleccione un rango"
    );

    if (currentRangeKey) {
      $("#report-range-ui").addClass("active");
    } else {
      $("#report-range-ui").removeClass("active");
    }
    if (
      currentRangeKey === "Personalizado" ||
      currentRangeKey === "Ver Todo" ||
      !currentRangeKey
    ) {
      $("#report-range-ui .prev, #report-range-ui .next").hide();
    } else {
      $("#report-range-ui .prev, #report-range-ui .next").show();
    }
  }

  $("#reportrange").daterangepicker(
    {
      autoUpdateInput: false,
      autoUpdateInput: false,
      opens: "right",
      drops: "auto",
      ranges: predefinedRanges,
      locale: {
        format: "DD/MM/YYYY",
        separator: " - ",
        applyLabel: "Aplicar",
        cancelLabel: "Cancelar",
        customRangeLabel: "Personalizado",
        daysOfWeek: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
        monthNames: [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ],
        firstDay: 1,
      },
    },
    function (start, end, label) {
      currentStartDate = start;
      currentEndDate = end;

      let selectedRange = $(".ranges li.active").attr("data-range-key");
      if (selectedRange) {
        currentRangeKey = selectedRange;
      } else if (label) {
        currentRangeKey = label;
      }
      updateUI();
    }
  );

  updateUI();

  $("#reportrange").on("apply.daterangepicker", function (ev, picker) {
    currentStartDate = picker.startDate;
    currentEndDate = picker.endDate;

    if (picker.chosenLabel) {
      currentRangeKey = picker.chosenLabel;
    } else {
      let selectedRange = $(".ranges li.active").text().trim();
      if (selectedRange) {
        currentRangeKey = selectedRange;
        getSelectedRange();
      }
    }
    getSelectedRange();
    updateUI();
  });

  // Encabezado CUSTOM.
  $("#reportrange").on("show.daterangepicker", function (ev, picker) {
    const container = picker.container;

    // Ojo aca, esto sincroniza el calendario al abrirlo con la navegación de fechas.
    if (currentStartDate && currentEndDate) {
      picker.setStartDate(currentStartDate);
      picker.setEndDate(currentEndDate);
      picker.updateCalendars(); // refresh nativo de daterangepicker
    }

    container.find(".ranges li").each(function () {
      const rangeKey = $(this).text().trim();
      if (rangeKey === currentRangeKey) {
        $(".ranges li").removeClass("active");
        $(this).addClass("active");
      }
    });

    // Actualiza los custom selects.
    container.find(".drp-calendar").each(function (index, calendar) {
      const calendarSide = index === 0 ? "startDate" : "endDate";
      const currentMonth = picker[calendarSide].month();
      const currentYear = picker[calendarSide].year();

      $(calendar).find(".month-select").val(currentMonth);
      $(calendar).find(".year-select").val(currentYear);
    });

    if (container.find(".drp-calendar").is(":visible")) {
      if (!container.find(".custom-header").length) {
        const customHeader = `
                  <div class="custom-header" style="display: flex; padding: 16px; justify-content: space-between; align-items: center; border-bottom: 1px solid #F6F6F6;">
                      <h5 style="color: #1E2938; font-family: Helvetica; font-size: 18px;">Selecciona un rango</h5>
                      <button type="button" class="btn-close" style="background: none; border: none; height: 24px; width: 24px;">
                          <i class="bx bx-x" style="font-size: 24px;"></i>
                      </button>
                  </div>
              `;
        container.prepend(customHeader);

        container.find(".btn-close").on("click", function () {
          picker.hide();
        });
      }
    } else {
      container.find(".custom-header").remove();
    }

    container.find(".drp-calendar").each(function (index, calendar) {
      const calendarSide = index === 0 ? "startDate" : "endDate";
      $(calendar).find(".month-year-select").remove();

      const currentMonth = picker[calendarSide].month();
      const currentYear = picker[calendarSide].year();

      const monthSelect = $(
        '<select class="month-select form-select"></select>'
      );
      const yearSelect = $('<select class="year-select form-select"></select>');

      picker.locale.monthNames.forEach((month, idx) => {
        monthSelect.append(
          `<option value="${idx}" ${
            idx === currentMonth ? "selected" : ""
          }>${month}</option>`
        );
      });

      const yearRange = 10;
      for (let y = currentYear - yearRange; y <= currentYear + yearRange; y++) {
        yearSelect.append(
          `<option value="${y}" ${
            y === currentYear ? "selected" : ""
          }>${y}</option>`
        );
      }

      // Selects de mes y año customs. En vuestro daterangepicker actual esta la logica para modificar fecha por selección
      // No se realizo para no replicar lógica y tiempo innecesario.
      // Deberiais traerla y implementarla en este js (#reportrange)
      const selectors = `
              <div class="month-year-select" style="display: flex; justify-content: space-between; padding: 7px;">
                  <div style="flex: 1; margin-right: 5px;">${monthSelect.prop(
                    "outerHTML"
                  )}</div>
                  <div style="flex: 1; margin-left: 5px;">${yearSelect.prop(
                    "outerHTML"
                  )}</div>
              </div>
          `;
      $(calendar).prepend(selectors);
    });

    container.find(".table-condensed th.month").css("opacity", "0");

    // Se utiliza un MutationObserver ya que daterangepicker regenera el dom dinamicamente.
    // Se observa el nodo que contiene los meses y se oculta para mostrar los selects customs de mes y año.
    const observer = new MutationObserver(() => {
      container.find(".table-condensed th.month").css("opacity", "0");
    });

    const observerTarget = container.find(".drp-calendar")[0];
    if (observerTarget) {
      observer.observe(observerTarget, { childList: true, subtree: true });
    }

    container
      .off("click", ".prev, .next")
      .on("click", ".prev, .next", function () {
        setTimeout(() => {
          container.find(".table-condensed th.month").css("opacity", "0");
        }, 50);
      });
  });

  $("#report-range-ui").on("click", function (event) {
    if (
      !$(event.target).hasClass("prev") &&
      !$(event.target).hasClass("next")
    ) {
      openCalendar(event);
    }
  });

  function navigateRange(direction) {
    if (currentRangeKey === "Diario") {
      currentStartDate = currentStartDate
        .clone()
        [direction](1, "day")
        .startOf("day");
      currentEndDate = currentStartDate.clone().endOf("day");
    } else if (currentRangeKey === "Mensual") {
      currentStartDate = currentStartDate
        .clone()
        [direction](1, "month")
        .startOf("month");
      currentEndDate = currentStartDate.clone().endOf("month");
    } else if (currentRangeKey === "Trimestral") {
      currentStartDate = currentStartDate
        .clone()
        [direction](3, "months")
        .startOf("quarter");
      currentEndDate = currentStartDate.clone().endOf("quarter");
    } else if (currentRangeKey === "Semestral") {
      currentStartDate = currentStartDate
        .clone()
        [direction](6, "months")
        .startOf("month");
      currentEndDate = currentStartDate.clone().add(5, "months").endOf("month");
    } else if (currentRangeKey === "Anual") {
      currentStartDate = currentStartDate
        .clone()
        [direction](1, "year")
        .startOf("year");
      currentEndDate = currentStartDate.clone().endOf("year");
    }
    updateUI();
  }

  $("#report-range-ui").on("click", ".prev", function () {
    navigateRange("subtract");
    getSelectedRange();
  });

  $("#report-range-ui").on("click", ".next", function () {
    navigateRange("add");
    getSelectedRange();
  });

  function openCalendar(event) {
    $("#reportrange").trigger("click");
  }

  updateUI();

  $("#reportrange").on("show.daterangepicker", function () {
    const container = $(".ranges ul");

    const icons = {
      Diario: '<i class="fa fa-calendar"></i>',
      Mensual: '<i class="fa fa-calendar-alt"></i>',
      Trimestral: '<i class="fa fa-calendar-check"></i>',
      Semestral: '<i class="fa fa-calendar-week"></i>',
      Anual: '<i class="fa fa-calendar-day"></i>',
      Personalizado: '<i class="fa fa-edit"></i>',
      "Ver Todo": '<i class="fa fa-eye"></i>',
    };

    container.find("li").each(function () {
      const rangeKey = $(this).text().trim();
      if (icons[rangeKey] && !$(this).find("i").length) {
        $(this).prepend(icons[rangeKey] + " ");
      }
    });
  });

  // Dejo esta función para que veais que los rangos se recuperan correctamente. Si se elimina, no pasa nada (borrar implementaciones).
  function getSelectedRange() {
    console.log("Rango actual:", currentRangeKey);
    console.log(
      "Fecha de inicio:",
      currentStartDate ? currentStartDate.format("DD/MM/YYYY") : "N/A"
    );
    console.log(
      "Fecha de fin:",
      currentEndDate ? currentEndDate.format("DD/MM/YYYY") : "N/A"
    );
  }
});
