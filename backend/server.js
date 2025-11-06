const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root', 
    database: 'faculty_scheduler'
});

db.connect(err=>{
    if(err) console.log('DB connection failed:',err);
    else console.log('DB connected!');
});

// ----------------- Student Login -----------------
app.post('/api/student/login',(req,res)=>{
    const {student_name, student_email} = req.body;
    if(!student_name||!student_email) return res.json({success:false,error:'Name and email required'});
    res.json({success:true});
});

// ----------------- Get Faculties -----------------
app.get('/api/faculties',(req,res)=>{
    db.query(`SELECT id,name FROM faculty`,(err,result)=>{
        if(err) return res.json({success:false,error:err});
        res.json({success:true,data:result});
    });
});

// ----------------- Get Slots -----------------
app.get('/api/slots/:facultyId',(req,res)=>{
    const {facultyId} = req.params;
    db.query(
        `SELECT * FROM faculty_slots WHERE faculty_id=? ORDER BY FIELD(day_of_week,'Monday','Tuesday','Wednesday','Thursday','Friday'), id ASC`,
        [facultyId],
        (err,result)=>{
            if(err) return res.json({success:false,error:err});
            res.json({success:true,data:result});
        }
    );
});

// ----------------- Book Slot -----------------
app.post('/api/student/book',(req,res)=>{
    const {faculty_id, student_name, student_email, date, slot_time, motive} = req.body;
    if(!faculty_id||!student_name||!date||!slot_time) return res.json({success:false,error:'Missing data'});

    const parts = slot_time.split(' to ');
    if(parts.length!==2) return res.json({success:false,error:'Invalid slot_time format'});

    function parseTime(t){
        const [h,m] = t.match(/\d+/g);
        const isPM = t.toLowerCase().includes('pm');
        let hour = parseInt(h);
        if(hour===12&&!isPM) hour=0;
        if(hour!==12&&isPM) hour+=12;
        return `${hour.toString().padStart(2,'0')}:${m.padStart(2,'0')}:00`;
    }

    const start_time = parseTime(parts[0]);
    const end_time = parseTime(parts[1]);

    db.query(
        `SELECT * FROM bookings WHERE faculty_id=? AND date=? AND start_time=? AND status='confirmed'`,
        [faculty_id,date,start_time],
        (err,result)=>{
            if(err) return res.json({success:false,error:err});
            if(result.length>0) return res.json({success:false,error:'Slot already booked'});

            db.query(
                `INSERT INTO bookings (faculty_id,student_name,student_email,motive,date,start_time,end_time)
                VALUES (?,?,?,?,?,?,?)`,
                [faculty_id,student_name,student_email,motive,date,start_time,end_time],
                (err2,result2)=>{
                    if(err2) return res.json({success:false,error:err2});
                    res.json({success:true});
                }
            );
        }
    );
});

// ----------------- Faculty Login -----------------
app.post('/api/faculty/login',(req,res)=>{
    const {faculty_id,email} = req.body;
    if(!faculty_id||!email) return res.json({success:false,error:'Missing data'});
    db.query(`SELECT * FROM faculty WHERE id=? AND email=?`, [faculty_id,email], (err,result)=>{
        if(err) return res.json({success:false,error:err});
        if(result.length===0) return res.json({success:false,error:'Invalid credentials'});
        res.json({success:true});
    });
});

// ----------------- Faculty Requests -----------------
app.get('/api/faculty/requests/:facultyId',(req,res)=>{
    const {facultyId} = req.params;
    db.query(`SELECT * FROM bookings WHERE faculty_id=? AND status='pending' ORDER BY created_at`,[facultyId],
    (err,result)=>{
        if(err) return res.json({success:false,error:err});
        res.json({success:true,data:result});
    });
});

// ----------------- Faculty Accept/Reject -----------------
app.post('/api/faculty/booking/:id/accept',(req,res)=>{
    const {id} = req.params;

    // Step 1: Get the booking
    db.query(`SELECT * FROM bookings WHERE id=?`, [id], (err,result)=>{
        if(err) return res.json({success:false,error:err});
        if(result.length===0) return res.json({success:false,error:'Booking not found'});

        const booking = result[0];

        // Step 2: Confirm this booking
        db.query(`UPDATE bookings SET status='confirmed' WHERE id=?`, [id], (err2,result2)=>{
            if(err2) return res.json({success:false,error:err2});

            // Step 3: Cancel all other pending requests for same faculty, same slot
            db.query(
                `UPDATE bookings SET status='cancelled' 
                 WHERE faculty_id=? AND date=? AND start_time=? AND id!=? AND status='pending'`,
                [booking.faculty_id, booking.date, booking.start_time, id],
                (err3,result3)=>{
                    if(err3) return res.json({success:false,error:err3});
                    res.json({success:true});
                }
            );
        });
    });
});

app.post('/api/faculty/booking/:id/reject',(req,res)=>{
    const {id} = req.params;
    db.query(`UPDATE bookings SET status='cancelled' WHERE id=?`,[id],(err,result)=>{
        if(err) return res.json({success:false,error:err});
        res.json({success:true});
    });
});

// ----------------- Faculty Toggle Slot -----------------
app.post('/api/faculty/slot/:id/toggle',(req,res)=>{
    const {id} = req.params;
    const {status} = req.body;
    db.query(`UPDATE faculty_slots SET status=? WHERE id=?`,[status,id],(err,result)=>{
        if(err) return res.json({success:false,error:err});
        res.json({success:true});
    });
});

// ----------------- Student Bookings (Notifications) -----------------
app.get('/api/student/bookings',(req,res)=>{
    const {student_name, student_email} = req.query;
    db.query(
        `SELECT b.*, f.name AS faculty_name 
         FROM bookings b
         JOIN faculty f ON b.faculty_id=f.id
         WHERE b.student_name=? AND b.student_email=? ORDER BY created_at DESC`,
        [student_name,student_email],
        (err,result)=>{
            if(err) return res.json({success:false,error:err});
            res.json({success:true,data:result});
        }
    );
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on http://192.168.138.182");
});

