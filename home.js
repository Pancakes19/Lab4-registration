const KEY = "students";

// Load saved students and ensure each has an ID
let savedStudents = JSON.parse(localStorage.getItem(KEY)) || [];
savedStudents = savedStudents.map(s => {
  if (!s.id) s.id = `CU-${Math.floor(1000 + Math.random() * 9000)}`;
  return s;
});
localStorage.setItem(KEY, JSON.stringify(savedStudents));

// Map saved students to card format
let state = savedStudents.map(s => ({
  id: s.id,
  name: `${s.firstname} ${s.lastname}`,
  course: s.programme,
  year: `Year ${s.year}`,
  status: 'Active',
  img: s.photo && s.photo !== "No photo"
       ? s.photo
       : 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=600&auto=format&fit=crop'
}));

const grid = document.getElementById('grid');
const empty = document.getElementById('empty');
const search = document.getElementById('search');
const sort = document.getElementById('sort');
const toastEl = document.getElementById('toast');
const tbody = document.getElementById("studentTableBody");
const addBtn = document.getElementById('add');
const fileInput = document.getElementById('photoUpload');

// Toast helper
function toast(msg){
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  setTimeout(()=>toastEl.classList.remove('show'), 1600);
}

// Status badge
function statusBadge(s){
  const cls = s === 'Active' ? 'badge success' : s === 'Probation' ? 'badge warn' : 'badge';
  return `<span class="${cls}">${s}</span>`;
}

// Card template
function cardTemplate(item){
  return `
<article class="card" data-name="${item.name.toLowerCase()}" data-course="${item.course.toLowerCase()}" data-id="${item.id.toLowerCase()}" data-status="${item.status.toLowerCase()}">
  <div class="avatar"><img src="${item.img}" alt="${item.name} photo" loading="lazy"></div>
  <div class="content">
    <div class="row">
      <div style="min-width:0">
        <div class="name">${item.name}</div>
        <div class="meta">${item.id} · ${item.year}</div>
      </div>
      <div class="badges">${statusBadge(item.status)}</div>
    </div>
    <div class="meta">Course: <strong style="color:var(--text)">${item.course}</strong></div>
    <div class="actions">
      <button class="btn" onclick="viewProfile('${item.id}')">View</button>
      <button class="btn primary" onclick="editProfile('${item.id}')">Edit</button>
      <button class="btn danger" onclick="deleteProfile('${item.id}')">Delete</button>
    </div>
  </div>
</article>`;
}

// Render cards
function renderCards(list){
  grid.innerHTML = list.map(cardTemplate).join('');
  empty.hidden = list.length !== 0;
}

// Render table
function renderTable(){
  let students = JSON.parse(localStorage.getItem(KEY)) || [];
  if (students.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7">No students registered yet.</td></tr>`;
  } else {
    tbody.innerHTML = students.map(s => `
      <tr>
        <td>${s.firstname}</td>
        <td>${s.lastname}</td>
        <td>${s.email}</td>
        <td>${s.programme}</td>
        <td>${s.year}</td>
        <td>${s.interests}</td>
        <td>
          ${s.photo && s.photo !== "No photo"
            ? `<img src="${s.photo}" alt="Student photo" style="width:40px;height:40px;border-radius:50%">`
            : 'No photo'}
        </td>
      </tr>
    `).join("");
  }
}

// File to Base64 converter
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Add new student
addBtn.addEventListener('click', async ()=>{
  const firstname = prompt('First Name?');
  const lastname = prompt('Last Name?');
  const email = prompt('Email?');
  const year = parseInt(prompt('Year?'));
  if(!firstname || !lastname || isNaN(year) || year <=0) {
    alert('Bro, fix the year or name!');
    return;
  }
  const course = prompt('Course?', 'BSc Computer Science') || 'BSc Computer Science';
  const interests = prompt('Interests?', '') || '';

  let photo = "No photo";
  if (fileInput.files.length > 0) {
    photo = await toBase64(fileInput.files[0]);
  }

  const id = `CU-${Math.floor(1000 + Math.random() * 9000)}`;
  const studentCard = { 
    id, 
    name: `${firstname} ${lastname}`, 
    course, 
    year: `Year ${year}`, 
    status: 'Active', 
    img: photo !== "No photo" ? photo : 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=600&auto=format&fit=crop'
  };
  const studentTable = { id, firstname, lastname, email, programme: course, year, interests, photo };

  // Add to state & localStorage
  state.unshift(studentCard);
  let savedStudents = JSON.parse(localStorage.getItem(KEY)) || [];
  savedStudents.push(studentTable);
  localStorage.setItem(KEY, JSON.stringify(savedStudents));

  toast('Profile added');
  applyFilters();
  renderTable();
  fileInput.value = "";
});

// Delete student
function deleteProfile(id){
  if(!confirm('Delete this profile?')) return;

  state = state.filter(x => x.id !== id);

  let savedStudents = JSON.parse(localStorage.getItem(KEY)) || [];
  savedStudents = savedStudents.filter(s => s.id !== id);
  localStorage.setItem(KEY, JSON.stringify(savedStudents));

  toast('Profile deleted');
  applyFilters();
  renderTable();
}

// View & edit
function viewProfile(id){
  const u = state.find(x=>x.id===id);
  alert(`${u.name}\n${u.id}\n${u.course} – ${u.year}\nStatus: ${u.status}`);
}

function editProfile(id){
  const u = state.find(x=>x.id===id);
  const newStatus = prompt(`Update status for ${u.name} (Active / Probation):`, u.status);
  if(!newStatus) return;
  u.status = newStatus.trim();
  toast('Status updated');
  applyFilters();
}

// Filter & sort
function applyFilters(){
  const q = search.value.trim().toLowerCase();
  let filtered = state.filter(x => (
    x.name.toLowerCase().includes(q) ||
    x.course.toLowerCase().includes(q) ||
    x.id.toLowerCase().includes(q) ||
    x.status.toLowerCase().includes(q)
  ));

  const sortBy = sort.value;
  filtered.sort((a,b)=>{
    if(sortBy==='status'){ return a.status.localeCompare(b.status); }
    if(sortBy==='course'){ return a.course.localeCompare(b.course); }
    return a.name.localeCompare(b.name);
  });

  renderCards(filtered);
}

// Events
search.addEventListener('input', applyFilters);
sort.addEventListener('change', applyFilters);

// Initial render
renderCards(state);
renderTable();
