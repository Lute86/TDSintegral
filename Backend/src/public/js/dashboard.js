// -------- helper fetch with JSON
async function fetchJSON(url, opts) {
  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Error');
  }
  return await res.json();
}

// -------- seleccionar proyecto (click en item)
document.addEventListener('click', async (e) => {
  const p = e.target.closest('.project-item');
  if (!p) return;
  const projectId = p.dataset.id;
  const projectNombre = p.dataset.nombre || 'Proyecto';
  selectProject(projectId, projectNombre);
});

async function selectProject(projectId, projectNombre){
  const label = document.getElementById('selectedProjectLabel') || document.querySelector('#tasksCard .dash-card-body p');
  if (label) label.textContent = `Tareas de: ${projectNombre}`;

  const taskList = document.getElementById('taskList');
  if (taskList) taskList.innerHTML = '<li>Cargando tareas...</li>';

  try {
    // endpoint que devuelve tareas por proyecto (debes exponerlo en backend)
    const tareas = await fetchJSON(`/task/project/${projectId}`);
    renderTasks(tareas);
  } catch (err) {
    if (taskList) taskList.innerHTML = `<li>Error al cargar tareas</li>`;
    console.error(err);
  }
}

function renderTasks(tareas){
  const ul = document.getElementById('taskList');
  ul.innerHTML = '';
  if (!tareas || tareas.length === 0) {
    ul.innerHTML = '<li>No hay tareas para este proyecto.</li>';
    return;
  }
  tareas.forEach(t => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = t._id;
    li.innerHTML = `
      <div>
        <div style="font-weight:600">${escapeHtml(t.descripcion || 'Sin descripción')}</div>
        <div style="color:var(--text-muted);font-size:.9em">Prioridad: <span class="prioridad ${t.prioridad}">${t.prioridad}</span></div>
      </div>
      <div>
        ${renderTaskControls(t)}
      </div>
    `;
    ul.appendChild(li);
  });
}

function renderTaskControls(t){
  // si admin => botones editar/eliminar; si empleado => select para estado
  const isAdmin = window.__USER_ROLE === 'administrador';
  if (isAdmin) {
    return `
      <a class="btn-edit" href="/tasks/${t._id}/edit">✏️</a>
      <button class="btn-delete" onclick="deleteTask('${t._id}')">🗑️</button>
    `;
  } else {
    // empleado puede cambiar estado
    const opt = (s, label) => `<option value="${s}" ${t.estado===s? 'selected' : ''}>${label}</option>`;
    return `
      <form onsubmit="return false;">
        <select onchange="changeTaskStatus('${t._id}', this.value)">
          ${opt('pendiente','Pendiente')}
          ${opt('en proceso','En proceso')}
          ${opt('finalizada','Finalizada')}
        </select>
      </form>
    `;
  }
}

// -------- cambiar estado tarea (empleado)
async function changeTaskStatus(taskId, nuevoEstado){
  try {
    await fetchJSON(`/task/${taskId}`, {
      method: 'PATCH',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ estado: nuevoEstado })
    });
    // opcional: mostrar notificación
  } catch (err) {
    alert('No se pudo actualizar el estado');
    console.error(err);
  }
}

// -------- actualizar status proyecto (admin)
async function updateProjectStatus(selectElem){
  const id = selectElem.dataset.id;
  const nuevo = selectElem.value;
  try {
    await fetchJSON(`/project/${id}`, {
      method: 'PUT',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ estado: nuevo })
    });
    // opcional: toast
  } catch (err) {
    alert('Error actualizando proyecto');
  }
}

// -------- delete actions (admin)
async function deleteProject(id){
  if (!confirm('Eliminar proyecto?')) return;
  try {
    await fetchJSON(`/project/${id}`, { method: 'DELETE' });
    // quitar del DOM
    document.querySelector(`.project-item[data-id="${id}"]`)?.remove();
  } catch (err) {
    alert('No se pudo eliminar');
  }
}
async function deleteTask(id){
  if (!confirm('Eliminar tarea?')) return;
  try {
    await fetchJSON(`/task/${id}`, { method: 'DELETE' });
    document.querySelector(`.task-item[data-id="${id}"]`)?.remove();
  } catch (err) {
    alert('No se pudo eliminar tarea');
  }
}
async function deleteEmployee(id){
  if (!confirm('Eliminar empleado?')) return;
  try {
    await fetchJSON(`/employee/${id}`, { method: 'DELETE' });
    document.querySelector(`.employee-item[data-id="${id}"]`)?.remove();
  } catch (err) {
    alert('No se pudo eliminar empleado');
  }
}

/* small helper to avoid XSS */
function escapeHtml(s){ return String(s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

// expose role from server (render in layout Pug script block)
