//dependencies

const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection(
    {
        host:"localhost",
        port: 3306,
        user:"root",
        password:"12345",
        database: "employeeTracker"



});

connection.connect(function(err)
{
    if (err) 
    {
        console.error("error connection");
    }
    console.log("connected to employeeTracker database");
});

//Build a command-line application that at a minimum allows the user to:

//* Add departments, roles, employees

//* View departments, roles, employees

//* Update employee roles// 

function trackerStart(){}

function add(){}

function addDepartment(){}

function addRole(){}

function addEmployee(){}

function view(){}

function updateRoles(){}


