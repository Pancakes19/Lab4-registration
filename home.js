const data = [
{ id: 'CU-1001', name: 'Milo Whiskers', course: 'BSc Computer Science', year: 'Year 2', status: 'Active', img: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=600&auto=format&fit=crop' },
{ id: 'CU-1002', name: 'Luna Paws', course: 'BA Design & Media', year: 'Year 1', status: 'Probation', img: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?q=80&w=600&auto=format&fit=crop' },
{ id: 'CU-1003', name: 'Oliver Meow', course: 'BCom Marketing', year: 'Year 3', status: 'Active', img: 'https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?q=80&w=600&auto=format&fit=crop' },
{ id: 'CU-1004', name: 'Nala Claws', course: 'BEng Mechanical', year: 'Year 4', status: 'Active', img: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=600&auto=format&fit=crop' },
{ id: 'CU-1005', name: 'Simba Stripe', course: 'BSc Data Science', year: 'Year 2', status: 'Active', img: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?q=80&w=600&auto=format&fit=crop' },
];
let state = [...data];


const grid = document.getElementById('grid');
const empty = document.getElementById('empty');
const search = document.getElementById('search');
const sort = document.getElementById('sort');
const toastEl = document.getElementById('toast');


function toast(msg){
toastEl.textContent = msg;
toastEl.classList.add('show');
setTimeout(()=>toastEl.classList.remove('show'), 1600);
}
function statusBadge(s){
const cls = s === 'Active' ? 'badge success' : s === 'Probation' ? 'badge warn' : 'badge';
return `<span class="${cls}">${s}</span>`;
}


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
</article>`
}


function render(list){
grid.innerHTML = list.map(cardTemplate).join('');
empty.hidden = list.length !== 0;
}

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


render(filtered);
}

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


function deleteProfile(id){
if(!confirm('Delete this profile?')) return;
state = state.filter(x=>x.id!==id);
toast('Profile deleted');
applyFilters();
}

document.getElementById('add').addEventListener('click', ()=>{
const name = prompt('Name?');
if(!name) return;
const id = `CU-${Math.floor(1000+Math.random()*9000)}`;
const course = prompt('Course?', 'BSc Computer Science') || 'BSc Computer Science';
const year = prompt('Year?', 'Year 1') || 'Year 1';
const status = 'Active';
const img = 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=600&auto=format&fit=crop';
state.unshift({id,name,course,year,status,img});
toast('Profile added');
applyFilters();
});


search.addEventListener('input', applyFilters);
sort.addEventListener('change', applyFilters);


// initial render


const KEY = "students";
let students = JSON.parse(localStorage.getItem(KEY)) || [];
let tbody = document.getElementById("studentTableBody");

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
      <td>${s.photo}</td>
    </tr>
  `).join("");
}
applyFilters();