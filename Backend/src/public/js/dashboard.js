// === DASHBOARD.JS ===
// Maneja el modal de empleados y operaciones CRUD dinámicas.

document.addEventListener("DOMContentLoaded", () => {
  console.log(" Dashboard JS cargado");

  const modal = document.getElementById("dashboardModal");
  const overlay = document.getElementById("modalOverlay");
  const iframe = document.getElementById("modal-frame");

  //  Abrir modal
  window.openModal = function (url) {
    if (!url) return console.error(" No se proporcionó URL al abrir modal");

    overlay.classList.remove("hidden");
    modal.classList.remove("hidden");

    // Espera un frame para permitir transición CSS
    requestAnimationFrame(() => {
      overlay.classList.add("show");
      modal.classList.add("show");
    });

    iframe.src = url;
  };

  //  Cerrar modal
  window.closeModal = function () {
    overlay.classList.remove("show");
    modal.classList.remove("show");

    setTimeout(() => {
      overlay.classList.add("hidden");
      modal.classList.add("hidden");
      iframe.src = "";
    }, 200);
  };

  //  Click en botones con data-open-modal
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-open-modal]");
    if (!btn) return;

    const url = btn.dataset.url;
    openModal(url);
  });

  //  Recargar lista cuando el iframe avisa “employee-updated”
window.addEventListener("message", (event) => {
  if (event.data?.type === "employee-updated") {
    console.log("[Modal] Empleado actualizado, cerrando y recargando lista...");
    closeModal();

    // Esperar a que el iframe se descargue del DOM antes de recargar
    setTimeout(() => {
      loadEmployees(true);
    }, 600);
  }
});


  //  Eliminar empleado
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-delete-url]");
    if (!btn) return;

    const url = btn.dataset.deleteUrl;
    const confirmMsg = btn.dataset.confirm || "¿Eliminar?";
    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar empleado");
      console.log("[Empleado] Eliminado correctamente");
      loadEmployees();
    } catch (err) {
      alert("Error al eliminar empleado");
      console.error(err);
    }
  });

  //  Recargar lista sin recargar página
 async function loadEmployees(noCache = false) {
  try {
    const url = noCache
      ? `/employee/list?_=${Date.now()}` // evita caché del navegador
      : `/employee/list`;

    const res = await fetch(url, {
      headers: { "X-Requested-With": "XMLHttpRequest" },
    });

    if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

    const html = await res.text();

    const container = document.querySelector("#employeeTableBody");
    if (container) {
      container.innerHTML = html;
      console.log(" Lista de empleados actualizada");
    } else {
      console.warn(" No se encontró #employeeTableBody para actualizar");
    }
  } catch (err) {
    console.error(" Error al cargar empleados:", err);
  }
}
  //  Cerrar modal si se hace clic fuera
  overlay.addEventListener("click", () => closeModal());
});
