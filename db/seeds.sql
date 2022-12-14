INSERT INTO department (name)
VALUES ("Sales"),
        ("Management"),
        ("Driver");


INSERT INTO role (title, salary, department_id)
VALUES ("Driver", 50000, 3),
        ("Manager", 76000, 2),
        ("Salesman", 45000, 1);
        

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Joey", "Josephs", 1, 2),
        ("Harald", "Hardrada", 3, 2),
        ("Harold", "Godwinson", 3, 2),
        ("William", "Conqueror", 2, 2);