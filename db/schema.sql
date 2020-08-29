
drop database if exists employeeTracker;

create database employeeTracker;

use employeeTracker;

create table employee
(
 id INT NOT NULL AUTO_INCREMENT,
 first_name VARCHAR (30) NOT NULL,
 last_name VARCHAR (30) NOT NULL,
 role_id INT not null,
 manager_id INT,
 PRIMARY KEY(id)
);

create table role
(
    id INTEGER NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY(id)
);


create table department 
(
 id INT NOT NULL AUTO_INCREMENT,
 name VARCHAR(30) NOT NULL,
 PRIMARY KEY (id)
);