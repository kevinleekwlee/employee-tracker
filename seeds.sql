-- Seed values for the department table.

INSERT INTO department (name)
VALUES ("Sales"),
       ("Accounting"),
       ("Administration"),
       ("Quality Assurance"),
       ("Management");

-- Seed values for the roles table.

INSERT INTO roles (title, salary, department_id)
VALUES ("Manager", 75000, 5),
       ("Sales Representative", 65000, 1),
       ("Head of Accounting", 60000, 2),
       ("Accountant", 55000, 2),
       ("Receptionist", 40000, 3),
       ("QA Analyst", 45000, 4),
       ("Customer Representative", 50000, 1);

-- Seed values for the employee table.

INSERT INTO employee (first_name, last_name, role_name, manager_id)
VALUES ("Michael", "Scott", "Manager", null),
       ("Dwight", "Schrute", "Sales Representative", 1),
       ("Jim", "Halpert", "Sales Representative", 1),
       ("Angela", "Martin", "Head of Accounting", 1),
       ("Kevin", "Malone", "Accountant", 1),
       ("Oscar", "Martinez", "Accountant", 1),
       ("Pam", "Beesly", "Receptionist", 1),
       ("Creed", "Bratton", "QA Analyst", 1),
       ("Kelly", "Kapoor", "Customer Representative", 1);