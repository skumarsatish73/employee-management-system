const $ = (id) => document.getElementById(id);
const today = new Date();
const dateLabel = today.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
$('todayPill').textContent = dateLabel;
$('attendanceDate').textContent = dateLabel;

let employees = [
 {id:'EMP001',name:'Aarav Sharma',department:'Administration',designation:'Office Clerk',mobile:'9876543210',email:'aarav@example.com',joining:'2024-04-15'},
 {id:'EMP002',name:'Priya Verma',department:'Accounts',designation:'Account Assistant',mobile:'9876543211',email:'priya@example.com',joining:'2023-08-10'},
 {id:'EMP003',name:'Rohan Singh',department:'IT Support',designation:'IT Executive',mobile:'9876543212',email:'rohan@example.com',joining:'2024-01-22'},
 {id:'EMP004',name:'Neha Gupta',department:'Human Resources',designation:'HR Assistant',mobile:'9876543213',email:'neha@example.com',joining:'2022-11-03'},
 {id:'EMP005',name:'Vikram Yadav',department:'Operations',designation:'Supervisor',mobile:'9876543214',email:'vikram@example.com',joining:'2021-06-18'},
 {id:'EMP006',name:'Ananya Mishra',department:'Sales',designation:'Sales Coordinator',mobile:'9876543215',email:'ananya@example.com',joining:'2025-02-12'},
 {id:'EMP007',name:'Karan Patel',department:'Accounts',designation:'Accounts Clerk',mobile:'9876543216',email:'karan@example.com',joining:'2024-07-01'},
 {id:'EMP008',name:'Pooja Das',department:'Administration',designation:'Receptionist',mobile:'9876543217',email:'pooja@example.com',joining:'2025-01-08'}
];
let attendance = Object.fromEntries(employees.map((e,i)=>[e.id, i===2?'Absent':i===5?'Leave':'Present']));
let salaries = Object.fromEntries(employees.map((e,i)=>[e.id,{basic:[22000,26000,30000,24000,32000,21000,23000,20000][i],allowance:3000,deduction:1000,paid:i%3!==1}]));
let leaves = [
 {id:1,emp:'EMP002',type:'Casual leave',from:'20 Oct 2026',to:'21 Oct 2026',reason:'Family function',status:'Pending'},
 {id:2,emp:'EMP005',type:'Sick leave',from:'14 Oct 2026',to:'14 Oct 2026',reason:'Not feeling well',status:'Approved'},
 {id:3,emp:'EMP006',type:'Personal leave',from:'22 Oct 2026',to:'22 Oct 2026',reason:'Personal work',status:'Pending'}
];
let nextId = 9;
const initials = name => name.split(/\s+/).map(s=>s[0]).slice(0,2).join('').toUpperCase();
const esc = value => String(value ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function personCell(e){return `<div class="person"><span class="person-avatar">${esc(initials(e.name))}</span><div><b>${esc(e.name)}</b><small>${esc(e.email||'No email added')}</small></div></div>`}
function badge(status){return `<span class="badge ${status.toLowerCase()}">${esc(status)}</span>`}
function toast(message){const el=$('toast');el.textContent=message;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),2600)}
function updateStats(){
 const present=Object.values(attendance).filter(s=>s==='Present').length;
 const absent=Object.values(attendance).filter(s=>s==='Absent').length;
 const onLeave=Object.values(attendance).filter(s=>s==='Leave').length;
 const total=employees.length;
 $('statEmployees').textContent=total;
 $('statPresent').textContent=present;
 $('statAbsent').textContent=absent;
 $('statLeaves').textContent=leaves.filter(l=>l.status==='Pending').length;
 $('legendPresent').textContent=present;
 $('legendAbsent').textContent=absent;
 $('attendancePercent').textContent=(total?Math.round(present/total*100):0)+'%';
 const green=total?present/total*100:0, orange=total?absent/total*100:0;
 document.querySelector('.donut').style.background=`conic-gradient(var(--green) 0 ${green}%, #f1b25c ${green}% ${green+orange}%, #6b9ce5 ${green+orange}% 100%)`;
}
function renderRecent(){
 $('recentEmployees').innerHTML=employees.slice(-5).reverse().map(e=>`<tr><td>${personCell(e)}</td><td>${esc(e.department)}</td><td>${badge(attendance[e.id]||'Present')}</td></tr>`).join('');
}
function renderEmployees(){
 const q=$('employeeSearch').value.trim().toLowerCase();
 const list=employees.filter(e=>[e.id,e.name,e.department,e.designation,e.mobile].some(v=>String(v).toLowerCase().includes(q)));
 $('employeeCount').textContent=`${list.length} record${list.length===1?'':'s'}`;
 $('employeeRows').innerHTML=list.length?list.map(e=>`<tr><td>${personCell(e)}</td><td><b>${esc(e.id)}</b></td><td>${esc(e.department)}</td><td>${esc(e.designation)}</td><td>${esc(e.mobile||'—')}</td><td><div class="action-group"><button class="mini-btn" data-edit="${e.id}">Edit</button><button class="mini-btn delete" data-delete="${e.id}">Delete</button></div></td></tr>`).join(''):'<tr><td colspan="6" class="empty">No employees found.</td></tr>';
}
function renderAttendance(){
 const q=$('attendanceSearch').value.trim().toLowerCase();
 const list=employees.filter(e=>[e.name,e.id,e.department].some(v=>v.toLowerCase().includes(q)));
 $('attendanceRows').innerHTML=list.map(e=>`<tr><td>${personCell(e)}</td><td>${esc(e.department)}</td><td><select class="status-select" data-attendance="${e.id}"><option ${attendance[e.id]==='Present'?'selected':''}>Present</option><option ${attendance[e.id]==='Absent'?'selected':''}>Absent</option><option ${attendance[e.id]==='Leave'?'selected':''}>Leave</option></select></td></tr>`).join('')||'<tr><td colspan="3" class="empty">No employees found.</td></tr>';
}
function renderSalary(){
 const q=$('salarySearch').value.trim().toLowerCase();
 const list=employees.filter(e=>[e.name,e.id].some(v=>v.toLowerCase().includes(q)));
 $('salaryRows').innerHTML=list.map(e=>{const s=salaries[e.id]||{basic:20000,allowance:2000,deduction:500,paid:false};return `<tr><td>${personCell(e)}</td><td>₹${s.basic.toLocaleString('en-IN')}</td><td>₹${s.allowance.toLocaleString('en-IN')}</td><td>₹${s.deduction.toLocaleString('en-IN')}</td><td><b>₹${(s.basic+s.allowance-s.deduction).toLocaleString('en-IN')}</b></td><td>${badge(s.paid?'Paid':'Pending')}</td></tr>`}).join('')||'<tr><td colspan="6" class="empty">No employees found.</td></tr>';
}
function renderLeaves(){
 $('leaveRows').innerHTML=leaves.map(l=>{const e=employees.find(x=>x.id===l.emp)||{name:'Removed employee',email:'',id:l.emp};return `<tr><td>${personCell(e)}</td><td>${esc(l.type)}</td><td>${esc(l.from)}${l.to!==l.from?' – '+esc(l.to):''}</td><td>${esc(l.reason)}</td><td>${l.status==='Pending'?`<div class="action-group"><button class="mini-btn" data-leave="${l.id}" data-status="Approved">Approve</button><button class="mini-btn delete" data-leave="${l.id}" data-status="Rejected">Reject</button></div>`:badge(l.status)}</td></tr>`}).join('')||'<tr><td colspan="5" class="empty">No leave requests.</td></tr>';
}
function renderAll(){updateStats();renderRecent();renderEmployees();renderAttendance();renderSalary();renderLeaves()}
function showPage(page){
 document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active-page',p.id===`page-${page}`));
 document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
 const names={dashboard:'Dashboard',employees:'Employees',attendance:'Attendance',salary:'Salary',leaves:'Leave Requests'};
 $('crumb').textContent=names[page]||'Dashboard';$('sidebar').classList.remove('open');window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('.nav-item').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.page)));
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.go)));
$('menuBtn').addEventListener('click',()=>$('sidebar').classList.toggle('open'));
$('logoutBtn').addEventListener('click',()=>toast('Demo mode: real login is not connected.'));
function openModal(employee){
 $('employeeForm').reset();$('editId').value=employee?.id||'';
 $('modalTitle').textContent=employee?'Edit employee':'Add employee';
 if(employee){$('fullName').value=employee.name;$('department').value=employee.department;$('designation').value=employee.designation;$('mobile').value=employee.mobile;$('email').value=employee.email;$('joiningDate').value=employee.joining||''}
 $('employeeModal').classList.add('open');$('employeeModal').setAttribute('aria-hidden','false');$('fullName').focus();
}
function closeModal(){$('employeeModal').classList.remove('open');$('employeeModal').setAttribute('aria-hidden','true')}
$('addEmployeeBtn').addEventListener('click',()=>openModal());
$('quickAdd').addEventListener('click',()=>{showPage('employees');openModal()});
$('closeModal').addEventListener('click',closeModal);$('cancelModal').addEventListener('click',closeModal);
$('employeeModal').addEventListener('click',e=>{if(e.target===$('employeeModal'))closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
$('employeeForm').addEventListener('submit',e=>{
 e.preventDefault();
 const editId=$('editId').value;
 const data={name:$('fullName').value.trim(),department:$('department').value,designation:$('designation').value.trim(),mobile:$('mobile').value.trim(),email:$('email').value.trim(),joining:$('joiningDate').value};
 if(editId){employees=employees.map(emp=>emp.id===editId?{...emp,...data}:emp);toast('Employee record updated.')}
 else{const id='EMP'+String(nextId++).padStart(3,'0');employees.push({id,...data});attendance[id]='Present';salaries[id]={basic:20000,allowance:2000,deduction:500,paid:false};toast('Employee added successfully.')}
 closeModal();renderAll();
});
$('employeeRows').addEventListener('click',e=>{
 const edit=e.target.closest('[data-edit]'),del=e.target.closest('[data-delete]');
 if(edit){const emp=employees.find(x=>x.id===edit.dataset.edit);if(emp)openModal(emp)}
 if(del){const emp=employees.find(x=>x.id===del.dataset.delete);if(emp&&confirm(`Delete ${emp.name}'s demo record?`)){employees=employees.filter(x=>x.id!==emp.id);delete attendance[emp.id];delete salaries[emp.id];renderAll();toast('Employee record deleted.')}}});
$('employeeSearch').addEventListener('input',renderEmployees);
$('attendanceSearch').addEventListener('input',renderAttendance);
$('salarySearch').addEventListener('input',renderSalary);
$('attendanceRows').addEventListener('change',e=>{const id=e.target.dataset.attendance;if(id){attendance[id]=e.target.value;renderAll();toast('Attendance updated.')}});
$('markAllPresent').addEventListener('click',()=>{employees.forEach(e=>attendance[e.id]='Present');renderAll();toast('All employees marked present in demo.')});
$('leaveRows').addEventListener('click',e=>{const btn=e.target.closest('[data-leave]');if(!btn)return;const leave=leaves.find(l=>l.id===Number(btn.dataset.leave));if(leave){leave.status=btn.dataset.status;renderAll();toast(`Leave request ${leave.status.toLowerCase()}.`)}});
renderAll();
