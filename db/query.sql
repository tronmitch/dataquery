SELECT *
FROM role
JOIN department ON role.role_id = department.id;

SELECT *
FROM role
JOIN employee ON role.role_id = employee.role_id;