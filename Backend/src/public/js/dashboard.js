// --------------------------------------
// UTILIDADES BÁSICAS
// --------------------------------------

function openModal(url) {
  const modal = document.getElementById("modal");
  const iframe = document.getElementById("modal-frame");
  iframe.src = url;
  modal.classList.remove("hidden");
}

function closeModal() {
  const modal = document.getElementById("modal");
  const iframe = document.getElementById("modal-frame");
  iframe.src = "";
  modal.classList.add("hidden");
}

// --------------------------------------
// CONFIRMACIONES Y ACCIONES CRUD
// --------------------------------------

// --- PROYECTOS ---
function confirmDeleteProject(projectId, nombre) {
  if (!confirm(`¿Seguro que deseas eliminar el proyecto "${nombre}" junto a sus tareas?`)) return;
  window.location.href = `/project/${projectId}/delete`; // ruta que hace el delete en backend
}

function openNewProject() {
  openModal("/project/view/create"); // vista Pug con el formulario de nuevo proyecto
}

function openEditProject(projectId) {
  openModal(`/project/view/edit/${projectId}`); // vista Pug con el form para editar
}

// --- TAREAS ---
function openNewTask(projectId) {
  openModal(`/task/view/create?projectId=${projectId}`); // vista Pug con form de tarea nueva
}

function openEditTask(taskId) {
  openModal(`/task/view/edit/${taskId}`); // vista Pug con form de edición
}

function confirmDeleteTask(taskId, desc) {
  if (!confirm(`¿Eliminar la tarea "${desc}"?`)) return;
  window.location.href = `/task/${taskId}/delete`; // ruta delete backend
}

// --- EMPLEADOS ---
function openNewEmployee() {
  openModal(`/employee/view/create`);
}

function openEditEmployee(id) {
  openModal(`/employee/view/edit/${id}`);
}

function confirmDeleteEmployee(id, nombre) {
  if (!confirm(`¿Eliminar empleado "${nombre}"?`)) return;
  window.location.href = `/employee/${id}/delete`;
}

// --------------------------------------
// ACTUALIZACIÓN DE ESTADO DE TAREA / PROYECTO
// (solo visible si se renderiza un <form> con select en servidor)
// --------------------------------------

function autoSubmit(formElem) {
  formElem.submit(); // se usa cuando el select de estado cambia
}

// --------------------------------------
// PEQUEÑO HELP VISUAL
// --------------------------------------

function highlightActiveProject(projectId) {
  document.querySelectorAll(".project-item").forEach(el => {
    el.classList.toggle("active", el.dataset.id === projectId);
  });
}

function showToast(msg) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// --------------------------------------
// ESCAPAR HTML (seguridad básica)
// --------------------------------------

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
  }[c]));
}
