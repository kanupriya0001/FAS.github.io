const API_URL = 'http://localhost:5000/api';

// -------------------- Student --------------------
function studentLogin() {
    const name = document.getElementById('student_name').value;
    const email = document.getElementById('student_email').value;
    if(!name || !email) return alert('Name and Email required');

    fetch(`${API_URL}/student/login`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({student_name:name, student_email:email})
    }).then(res=>res.json()).then(data=>{
        if(data.success){
            document.getElementById('loginForm').style.display='none';
            document.getElementById('dashboard').style.display='block';
            loadFaculties();
            loadStudentBookings(); // Notifications
        } else alert(data.error);
    });
}

function loadFaculties(){
    fetch(`${API_URL}/faculties`).then(res=>res.json()).then(data=>{
        if(data.success){
            const select = document.getElementById('facultySelect');
            select.innerHTML=`<option value="">Select Faculty</option>`;
            data.data.forEach(f=>{
                const opt = document.createElement('option');
                opt.value=f.id;
                opt.textContent=f.name;
                select.appendChild(opt);
            });
        }
    });
}

function loadFacultySlots(){
    const facultyId = document.getElementById('facultySelect').value;
    const date = document.getElementById('selectedDate').value;
    if(!facultyId || !date) return;

    fetch(`${API_URL}/slots/${facultyId}`).then(res=>res.json()).then(data=>{
        if(data.success){
            const container = document.getElementById('slotsContainer');
            container.innerHTML='';
            const dayName = new Date(date).toLocaleDateString('en-US',{weekday:'long'});
            const slots = data.data.filter(s => s.day_of_week===dayName);

            slots.forEach(s=>{
                const btn = document.createElement('button');
                btn.textContent=`${s.slot_time} - ${s.status}`;
                btn.disabled = s.status!=='available';
                btn.onclick = ()=>bookSlot(facultyId,s,date);
                container.appendChild(btn);
            });
        }
    });
}

function bookSlot(facultyId, slot, date){
    const motive = prompt("Enter your motive for the appointment:");
    if(!motive) return alert('Motive required');

    const name = document.getElementById('student_name').value;
    const email = document.getElementById('student_email').value;

    fetch(`${API_URL}/student/book`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
            faculty_id: facultyId,
            student_name: name,
            student_email: email,
            date: date,
            slot_time: slot.slot_time,
            motive: motive
        })
    }).then(res=>res.json()).then(data=>{
        if(data.success){
            alert('Booking request sent!');
            loadFacultySlots();
            loadStudentBookings();
        } else alert(data.error);
    });
}

// -------------------- Student Notifications --------------------
function loadStudentBookings(){
    const name = document.getElementById('student_name').value;
    const email = document.getElementById('student_email').value;

    fetch(`${API_URL}/student/bookings?student_name=${encodeURIComponent(name)}&student_email=${encodeURIComponent(email)}`)
    .then(res=>res.json())
    .then(data=>{
        if(data.success){
            const container = document.getElementById('notifications');
            container.innerHTML='';
            data.data.forEach(b=>{
                if(b.status==='confirmed'){
                    const div = document.createElement('div');
                    div.textContent = `✅ Your request with ${b.faculty_name} on ${b.date} at ${b.start_time}-${b.end_time} is ACCEPTED.`;
                    container.appendChild(div);
                } else if(b.status==='cancelled'){
                    const div = document.createElement('div');
                    div.textContent = `❌ Your request with ${b.faculty_name} on ${b.date} at ${b.start_time}-${b.end_time} is REJECTED.`;
                    container.appendChild(div);
                }
            });
        }
    });
}

// -------------------- Faculty --------------------
function facultyLogin(){
    const id = document.getElementById('faculty_id').value;
    const email = document.getElementById('faculty_email').value;
    if(!id||!email) return alert('ID and Email required');

    fetch(`${API_URL}/faculty/login`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({faculty_id:id,email:email})
    }).then(res=>res.json()).then(data=>{
        if(data.success){
            document.getElementById('loginForm').style.display='none';
            document.getElementById('dashboard').style.display='block';
            loadFacultySlotsFaculty(id);
            loadBookingRequests(id);
        } else alert(data.error);
    });
}

function loadFacultySlotsFaculty(facultyId){
    fetch(`${API_URL}/slots/${facultyId}`).then(res=>res.json()).then(data=>{
        if(data.success){
            const container = document.getElementById('facultySlots');
            container.innerHTML='';
            const days = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
            days.forEach(day=>{
                const daySlots = data.data.filter(s => s.day_of_week===day);
                const div = document.createElement('div');
                div.innerHTML=`<h3>${day}</h3>`;
                daySlots.forEach(s=>{
                    const btn = document.createElement('button');
                    btn.textContent=`${s.slot_time} - ${s.status}`;
                    btn.onclick = ()=>toggleSlot(s.id,s.status==='available'?'occupied':'available',facultyId);
                    div.appendChild(btn);
                });
                container.appendChild(div);
            });
        }
    });
}

function toggleSlot(slotId,newStatus,facultyId){
    fetch(`${API_URL}/faculty/slot/${slotId}/toggle`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({status:newStatus})
    }).then(res=>res.json()).then(data=>{
        if(data.success) loadFacultySlotsFaculty(facultyId);
        else alert(data.error);
    });
}

function loadBookingRequests(facultyId){
    fetch(`${API_URL}/faculty/requests/${facultyId}`).then(res=>res.json()).then(data=>{
        if(data.success){
            const container = document.getElementById('bookingRequests');
            container.innerHTML='';
            data.data.forEach(b=>{
                const div = document.createElement('div');
                div.innerHTML = `<strong>${b.student_name}</strong> (${b.student_email}) wants ${b.date} ${b.start_time}-${b.end_time}: ${b.motive}
                <button onclick="decideBooking(${b.id},true,${facultyId})">Accept</button>
                <button onclick="decideBooking(${b.id},false,${facultyId})">Reject</button>`;
                container.appendChild(div);
            });
        }
    });
}

function decideBooking(id,accept,facultyId){
    fetch(`${API_URL}/faculty/booking/${id}/${accept?'accept':'reject'}`,{method:'POST'})
    .then(res=>res.json()).then(data=>{
        if(data.success) loadBookingRequests(facultyId);
        else alert(data.error);
    });
}

