DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE inventory_db;

CREATE TABLE employee(
    id INT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL
);
CREATE TABLE role(
    id INT NOT NULL,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT
);
CREATE TABLE department(
    id INT NOT NULL,
    name VARCHAR(50)
);

SELECT DATABASE();
