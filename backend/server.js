require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8000; 

app.use(express.json()); 
app.use(cors());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

const createBannerTable = `
    CREATE TABLE IF NOT EXISTS banner (
        id INT AUTO_INCREMENT PRIMARY KEY,
        description VARCHAR(255),
        timer INT,
        link VARCHAR(255)
    )
`;

db.query(createBannerTable, (err, results) => {
    if (err) {
        console.error('Error creating table:', err);
    } else {
        console.log('Banner table is ready');
    }
});

app.get('/banner', (req, res) => {
    db.query('SELECT * FROM banner WHERE id = 1', (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching banner data');
        }
        res.json(results[0]);
    });
});

app.put('/banner', (req, res) => {
    const { description, timer, link } = req.body;
    db.query('SELECT * FROM banner WHERE id = 1', (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching banner data');
        }

        const currentBanner = results[0];

        const updatedDescription = description || currentBanner.description;
        const updatedTimer = timer !== undefined ? timer : currentBanner.timer;
        const updatedLink = link || currentBanner.link;

        const updateBanner = `
            UPDATE banner 
            SET description = ?, timer = ?, link = ? 
            WHERE id = 1
        `;

        db.query(updateBanner, [updatedDescription, updatedTimer, updatedLink], (err, results) => {
            if (err) {
                return res.status(500).send('Error updating banner data');
            }
            res.send('Banner updated successfully');
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
