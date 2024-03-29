-- Insert multiple produce items --

INSERT INTO departments (id, name) VALUES
    (1, 'Engineering'),
    (2, 'Human Resources'),
    (3, 'Marketing'),
    (4, 'Sales'),
    (5, 'Customer Service');

INSERT INTO roles (id, title, salary, department_id) VALUES
    (1, 'Software Engineer', 80000, 1),
    (2, 'Senior Software Engineer', 120000, 1),
    (3, 'HR Manager', 70000, 2),
    (4, 'Recruiter', 50000, 2),
    (5, 'Marketing Coordinator', 45000, 3),
    (6, 'Marketing Manager', 90000, 3),
    (7, 'Sales Representative', 55000, 4),
    (8, 'Senior Sales Executive', 65000, 4),
    (9, 'Product Manager', 110000, 1),
    (10, 'Customer Service Specialist', 40000, 5);

INSERT INTO employees (id, first_name, last_name, role_id, manager_id) VALUES
    ( 1, "Sadie", "Rose", 1, 1),
    ( 2, "Bo", "Axel", 1, 2),
    ( 3, "Summer", "Lily", 4, 3),
    (4, "Max", "Ella", 2, 4),
    (5, "Charlie", "Olivia", 3, 3),    
    (6, "Daisy", "Milo", 5, 3),
    (7, "Lucas", "Amelia", 2, 3),
    (8, "Ruby", "Oscar", 3, 3),
    (9, "Finn", "Ivy", 5, 2),
    (10, "Eva", "Jake", 3, 1),
    (11, "Theo", "Sophia", 2, 2),
    (12, "Mia", "Leo", 1, 3), 
    (13, "Zoe", "Nathan", 4, 3);

    
