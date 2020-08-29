USE employeeTracker;

INSERT into department (name) VALUES ('Marketing');
INSERT into department (name) VALUES ('Development');

INSERT into role (title, salary, department_id) VALUES ('Graphic Designer', 55000, 1);
INSERT into role (title, salary, department_id) VALUES ('Head of Development', 200000, 2);

INSERT into employee (first_name, last_name, role_id) VALUES ('Mary', 'Jones', 1);
INSERT into employee (first_name, last_name, role_id) VALUES ('Pat', 'Simmons', 2);
