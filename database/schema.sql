CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullname VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  message text NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);