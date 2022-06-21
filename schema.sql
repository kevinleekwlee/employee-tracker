-- Create the database and drop if necessary to avoid duplification.

DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

-- Use the newly created table.

USE employee_db;

-- Create the department table.

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL
);

-- Create the roles table.

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary INT,
    department_id INT
);

-- Create the employee table. 

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_name VARCHAR(30),
    manager_id INT
);