const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer')
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Database connection:

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'whatsurname',
      database: 'employee_db'
    },
    console.log(`Connected to database: employee_db`)
  );

  app.post('/api/department', ({ body }, res) => {
    const sql = `INSERT INTO movies (movie_name)
      VALUES (?)`;
    const params = [body.movie_name];
    
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: body
      });
    });
  });