-- Establishing aliases.

SELECT
    e.id AS ID,
    e.first_name AS FirstName,
    e.last_name AS LastName,
    e.role_name AS Role,
    roles.salary AS Salary,
    m.last_name AS Manager,
    department.name AS department

-- Joining the employee table to itself for the manager value. 

FROM employee e
LEFT JOIN employee m
    ON e.manager_id = m.id

-- Joining the roles table to the employee table. 

LEFT JOIN roles
    ON e.role_name = roles.title

-- Joining the department table to the roles table.

LEFT JOIN department
    ON roles.department_id = department.id

-- Sort all employees according to salary in descending order.

ORDER BY roles.salary DESC;