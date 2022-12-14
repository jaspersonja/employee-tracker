const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer')
const app = express();
const cTable = require('console.table');
// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//.env
require('dotenv').config();

//Database connection:

const connection = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: process.env.MYSQLPASS,
      database: 'employee_db'
    },
    console.log(`Connected to database: employee_db`)
    
  );
connection.connect(err => {
  if (err) throw err;
  completedConnection();
})

completedConnection = () => {
console.log('-----EMPLOYEE MANAGER-----')
promptUser();
}

  const promptUser = () =>{
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'choices', 
                message: 'What would you like to do?',
                choices: ['View all departments', 
                          'View all roles', 
                          'View all employees', 
                          'Add a department', 
                          'Add a role', 
                          'Add an employee', 
                          'Update an employee role',
                          'No Action']
              }
            ])
    
            .then((answers) => {
                const { choices } = answers; 
          
                if (choices === "View all departments") {
                  showDepartments();
                }
          
                if (choices === "View all roles") {
                  showRoles();
                }
          
                if (choices === "View all employees") {
                  showEmployees();
                }
          
                if (choices === "Add a department") {
                  addDepartment();
                }
          
                if (choices === "Add a role") {
                  addRole();
                }
          
                if (choices === "Add an employee") {
                  addEmployee();
                }
          
                if (choices === "Update an employee role") {
                  updateEmployee();
                }
    
                if (choices === "No Action") {
                  connection.end()
              };
            });
          };
    
    //SHOW DEPARTMENTS
    showDepartments = () => {
      console.log('Showing departments.');
      const sql = `SELECT department.id AS id, department.name AS department FROM department`;
    
      connection.promise().query(sql, (err, rows) =>{
        if(err) throw err;
        console.table(rows);
        promptUser();
      })
    }
    //SHOW ROLES
    showRoles = () => {
      console.log('Showing Roles.');
      const sql = `SELECT role.id, role.title, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id`;
    
      connection.promise().query(sql, (err, rows) => {
        if (err) throw err; 
        console.table(rows); 
        promptUser();
      })
    }
    //SHOW EMPLOYEES
    showEmployees = () => {
      console.log('Showing employees.'); 
      const sql = `SELECT employee.id, 
                          employee.first_name, 
                          employee.last_name, 
                          role.title, 
                          department.name AS department,
                          role.salary, 
                          CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee
                          LEFT JOIN role ON employee.role_id = role.id
                          LEFT JOIN department ON role.department_id = department.id
                          LEFT JOIN employee manager ON employee.manager_id = manager.id`;
    
      connection.promise().query(sql, (err, rows) => {
        if (err) throw err; 
        console.table(rows);
        promptUser();
      });
    };
    
    //ADD DEPARTMENT
    addDepartment = () => {
      inquirer.prompt([
        {
          type: 'input', 
          name: 'addDept',
          message: "What department do you want to add?",
          validate: addDept => {
            if (addDept) {
                return true;
            } else {
                console.log('Please enter a department');
                return false;
            }
          }
        }
      ])
        .then(answer => {
          const sql = `INSERT INTO department (name) VALUES (?)`;
          connection.query(sql, answer.addDept, (err, result) => {
            if (err) throw err;
            console.log('Added ' + answer.addDept + " to departments!"); 
    
            showDepartments();
        });
      });
    };
    
    // ADD ROLE
    //FIRST NEED INQUIRER FOR ROLE TYPE/SALARY
    addRole = () => {
      inquirer.prompt([
        {
          type: 'input', 
          name: 'role',
          message: "What role do you want to add?",
          validate: addRole => {
            if (addRole) {
                return true;
            } else {
                console.log('Please enter a role');
                return false;
            }
          }
        },
        {
          type: 'input', 
          name: 'salary',
          message: "What is the salary of this role?",
          validate: addSalary => {
            if (isNAN(addSalary)) {
                return true;
            } else {
                console.log('Please enter a salary');
                return false;
            }
          }
        }
      ])
      //.then SELECT DEPARTMENT .then PUSH TO DEPT, CREATE ROLE
      .then(answer => {
        const params = [answer.role, answer.salary];
    
        const roleSql = `SELECT name, id FROM department`; 
    
        connection.promise().query(roleSql, (err, data) => {
          if (err) throw err; 
      
          const dept = data.map(({ name, id }) => ({ name: name, value: id }));
    
          inquirer.prompt([
          {
            type: 'list', 
            name: 'dept',
            message: "What department is this role in?",
            choices: dept
          }
          ])
            .then(deptChoice => {
              const dept = deptChoice.dept;
              params.push(dept);
    
              const sql = `INSERT INTO role (title, salary, department_id)
                          VALUES (?, ?, ?)`;
    
              connection.query(sql, params, (err, result) => {
                if (err) throw err;
                console.log('Added' + answer.role + " to roles!"); 
    
                showRoles();
         });
       });
     });
    });
    };
    
    //ADD EMPLOYEE
    addEmployee = () => {
      inquirer.prompt([
        {
          type: 'input',
          name: 'fistName',
          message: "What is the employee's first name?",
          validate: addFirst => {
            if (addFirst) {
                return true;
            } else {
                console.log('Please enter a first name');
                return false;
            }
          }
        },
        {
          type: 'input',
          name: 'lastName',
          message: "What is the employee's last name?",
          validate: addLast => {
            if (addLast) {
                return true;
            } else {
                console.log('Please enter a last name');
                return false;
            }
          }
        }
      ])
        .then(answer => {
        const params = [answer.fistName, answer.lastName]
    
        const roleSql = `SELECT role.id, role.title FROM role`;
      
        connection.promise().query(roleSql, (err, data) => {
          if (err) throw err; 
          
          const roles = data.map(({ id, title }) => ({ name: title, value: id }));
    
          inquirer.prompt([
                {
                  type: 'list',
                  name: 'role',
                  message: "What is the employee's role?",
                  choices: roles
                }
              ])
                .then(roleChoice => {
                  const role = roleChoice.role;
                  params.push(role);
    
                  const managerSql = `SELECT * FROM employee`;
    
                  connection.promise().query(managerSql, (err, data) => {
                    if (err) throw err;
    
                    const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
    
                    inquirer.prompt([
                      {
                        type: 'list',
                        name: 'manager',
                        message: "Who is the employee's manager?",
                        choices: managers
                      }
                    ])
                      .then(managerChoice => {
                        const manager = managerChoice.manager;
                        params.push(manager);
    
                        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                        VALUES (?, ?, ?, ?)`;
    
                        connection.query(sql, params, (err, result) => {
                        if (err) throw err;
                        console.log("Employee has been added!")
    
                        showEmployees();
                  });
                });
              });
            });
         });
      });
    };
    
    //UPDATE EMPLOYEE
    updateEmployee = () => {
      const employeeSql = `SELECT * FROM employee`;
    
      connection.promise().query(employeeSql, (err, data) => {
        if (err) throw err; 
    
      const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
    
        inquirer.prompt([
          {
            type: 'list',
            name: 'name',
            message: "Which employee would you like to update?",
            choices: employees
          }
        ])
          .then(empChoice => {
            const employee = empChoice.name;
            const params = []; 
            params.push(employee);
    
            const roleSql = `SELECT * FROM role`;
    
            connection.promise().query(roleSql, (err, data) => {
              if (err) throw err; 
    
              const roles = data.map(({ id, title }) => ({ name: title, value: id }));
              
                inquirer.prompt([
                  {
                    type: 'list',
                    name: 'role',
                    message: "What is the employee's new role?",
                    choices: roles
                  }
                ])
                    .then(roleChoice => {
                    const role = roleChoice.role;
                    params.push(role); 
                    
                    let employee = params[0]
                    params[0] = role
                    params[1] = employee 
                    
    
                    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
    
                    connection.query(sql, params, (err, result) => {
                      if (err) throw err;
                    console.log("Employee has been updated!");
                  
                    showEmployees();
              });
            });
          });
        });
      });
    };
