INSERT INTO department (id, name)
VALUES (1, "Sales"),
        (2, "Management"),
        (3, "Driver")


INSERT INTO role (id, title, salary, department_id)
VALUES (1, "Driver", 50000.00, 3),
        (2, "Manager", 76000.00, 2),
        (3, "Salesman", 45000.00, 1),
        

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "Joey", "Josephs", 1, 2),
        (2, "Harald", "Hardrada", 3, 2),
        (2, "Harold", "Godwinson", 3, 2),
        (2, "William", "Conqueror", 2, 2),