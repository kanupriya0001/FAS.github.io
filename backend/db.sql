-- Create the database
CREATE DATABASE IF NOT EXISTS faculty_scheduler;
USE faculty_scheduler;

-- Table: faculty (stores faculty info)
CREATE TABLE IF NOT EXISTS faculty (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE
);

-- Table: availability (faculty availability slots)
CREATE TABLE IF NOT EXISTS availability (
  id INT AUTO_INCREMENT PRIMARY KEY,
  faculty_id INT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_duration_minutes INT DEFAULT 30,
  FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE
);

-- Table: bookings (student bookings)
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  faculty_id INT NOT NULL,
  student_name VARCHAR(150) NOT NULL,
  student_email VARCHAR(150),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE
);

-- Insert sample faculty data
INSERT INTO faculty (name, email) VALUES
('Dr. Priyanka Vijayvargiya', 'priyanka@ips.edu'),
('Prof. Raj Sharma', 'raj@ips.edu');

-- Insert sample availability (faculty 1 available tomorrow 10:00–12:00)
INSERT INTO availability (faculty_id, date, start_time, end_time, slot_duration_minutes)
VALUES (1, CURDATE() + INTERVAL 1 DAY, '10:00:00', '12:00:00', 20);
