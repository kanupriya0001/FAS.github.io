const API_URL = 'http://localhost:5000/api';

const api = {
    studentLogin: async (name,email)=>{
        const res = await fetch(`${API_URL}/student/login`, {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ student_name:name, student_email:email })
        });
        return res.json();
    },

    getFaculties: async ()=>{
        const res = await fetch(`${API_URL}/faculties`);
        return res.json();
    },

    getSlots: async (facultyId)=>{
        const res = await fetch(`${API_URL}/slots/${facultyId}`);
        return res.json();
    },

    bookSlot: async (data)=>{
        const res = await fetch(`${API_URL}/student/book`, {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify(data)
        });
        return res.json();
    },

    facultyLogin: async (id,email)=>{
        const res = await fetch(`${API_URL}/faculty/login`, {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ faculty_id:id,email })
        });
        return res.json();
    },

    getRequests: async (facultyId)=>{
        const res = await fetch(`${API_URL}/faculty/requests/${facultyId}`);
        return res.json();
    },

    acceptBooking: async (id)=>{
        const res = await fetch(`${API_URL}/faculty/booking/${id}/accept`, { method:'POST' });
        return res.json();
    },

    rejectBooking: async (id)=>{
        const res = await fetch(`${API_URL}/faculty/booking/${id}/reject`, { method:'POST' });
        return res.json();
    },

    toggleSlot: async (id,status)=>{
        const res = await fetch(`${API_URL}/faculty/slot/${id}/toggle`, {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ status })
        });
        return res.json();
    }
};
