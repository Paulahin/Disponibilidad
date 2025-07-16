document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const nextButton = document.getElementById('next');
    const contenedorSub = document.getElementById('ContenedorSub');
    const sidebarEvents = document.getElementById('sidebarEvents');
    const calendarBody = document.getElementById('table-body');
    const monthName = document.getElementById("month-name");
    const todayDayName = document.getElementById("todayDayName");
    const eventDayName = document.getElementById("eventDayName");
    const sidebarToggle = document.getElementById("sidebarToggle");
    const sidebar = document.getElementById("sidebar");

    let currentYear, currentMonth, area, site;

    // Función para copiar al portapapeles
    window.copyToClipboard = function(text) {
        navigator.clipboard.writeText(text).then(function() {
            alert('Contacto copiado al portapapeles');
        }, function(err) {
            console.error('Error al copiar: ', err);
        });
    };

    // Toggle sidebar en móvil
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function(e) {
            e.preventDefault();
            sidebar.classList.toggle('active');
        });
    }

    function renderCalendar(eventDates = []) {
        const now = new Date();
        currentYear = now.getFullYear();
        currentMonth = now.getMonth();

        const today = now.getDate();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();

        const monthNames = [
            "Enero", "Febrero", "Marzo", "Abril",
            "Mayo", "Junio", "Julio", "Agosto",
            "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        monthName.textContent = monthNames[currentMonth];
        todayDayName.textContent = `Hoy es ${now.toLocaleDateString('es-CO', {
            weekday: 'long', day: 'numeric', month: 'long'
        })}`;

        if (eventDayName) {
            eventDayName.textContent = now.toLocaleDateString('es-CO', {
                weekday: 'long', day: 'numeric', month: 'long'
            });
        }

        calendarBody.innerHTML = "";

        // Agregar días vacíos al inicio
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement("div");
            emptyCell.className = "calendar-day";
            calendarBody.appendChild(emptyCell);
        }

        // Agregar días del mes
        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement("div");
            cell.className = "calendar-day";
            cell.textContent = day;

            const fullDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            if (day === today) cell.classList.add("today");
            if (eventDates.includes(fullDate)) cell.classList.add("has-event");

            calendarBody.appendChild(cell);
        }
    }

    loginForm.addEventListener('input', function () {
        const areaInput = loginForm.area.value.trim();
        const siteInput = loginForm.site.value.trim();
        nextButton.disabled = !(areaInput && siteInput);
    });

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        area = loginForm.area.value.trim();
        site = loginForm.site.value.trim();

        if (area && site) {
            // Simular datos para demostración
            const mockData = [
                { nombre: 'Héctor Josué Dávila Rodríguez', contactos: '01001 57 300 6351830' },
                { nombre: 'María González López', contactos: '01001 57 300 1234567' },
                { nombre: 'Carlos Ruiz Mendoza', contactos: '01001 57 300 9876543' }
            ];

            console.log('Contact information saved:', mockData);

            document.getElementById('Contenedor').style.display = 'none';
            contenedorSub.classList.remove('hidden');

            if (sidebarEvents && mockData.length > 0) {
                sidebarEvents.innerHTML = mockData.map(a => `
                    <div class="disponibility-card">
                        <h4>${a.nombre || 'Analista'}</h4>
                        <p>${a.contactos}</p>
                        <button class="copy-contact" onclick="copyToClipboard('${a.contactos}')">Copiar</button>
                    </div>
                `).join('');
            } else if (sidebarEvents) {
                sidebarEvents.innerHTML = '<p>No hay analistas disponibles para esta área y site.</p>';
            }

            // Simular fechas con eventos
            const mockEventDates = [
                '2025-07-10', '2025-07-15', '2025-07-22'
            ];
            renderCalendar(mockEventDates);

            console.log("Sidebar va a mostrar:", mockData);
        }
    });

    // Inicializar calendario
    renderCalendar();

  document.getElementById("uploadExcel").addEventListener("click", () => {
  const file = document.getElementById("excelInput").files[0];
  if (!file) return alert("Selecciona un archivo Excel");

  const reader = new FileReader();
  reader.onload = function (e) {
    const workbook = XLSX.read(new Uint8Array(e.target.result), { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    const datos = rows.map(row => ({
      nombre: row.Nombre?.trim(),
      fecha: row.Fecha?.trim()
    })).filter(d => d.nombre && d.fecha);

    fetch("http://localhost:3000/api/disponibilidades/cargarExcel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ datos })
    })
    .then(res => res.json())
    .then(result => {
      alert(`Actualizados: ${result.actualizados} disponibilidades`);
    })
    .catch(err => {
      console.error("Error al subir:", err);
      alert("Error al procesar el archivo");
    });
  };
  reader.readAsArrayBuffer(file);
});

});


