//dependencies

const mysql = require('mysql');
const cTable = require('console.table');
const inquirer = require('inquirer');

const connection = mysql.createConnection(
{
    host: "localhost",
    port: 3306,
    user: "root",
    password: "12345",
    database: "employeeTracker"
});

connection.connect(function(err)
{
    if (err) 
    {
        console.error("error connection");
    }
   
});

//starts application
trackerStart();

//functions allowing user to:
//Add departments, roles, employees
//View departments, roles, employees
//Update employee role

//options when first starting program
function trackerStart()
{
    inquirer.prompt(
    {
        name: 'start',
        type: 'list',
        message: 'Please choose an option:',
        choices: ['View','Add','Update Role','Quit'],
    }
    ).then(function ({start})
    {
        switch (start)
        {
            case 'View':
                view();
                break ;
            case 'Add':
                add();
                break;
            case 'Update Role':
                updateRole();
                break;
            case 'Quit':
                connection.end() 
                return;

        }
    })
}

//view the employees, roles, or departments
function view()
{
    inquirer.prompt(
        {
            name: "table",
            message: 'What would you like to view:',
            type: 'list',
            choices: ['Employees','Roles', 'Departments'],
        }
    ).then(function ({table}) 
    {

        switch (table)
        {
            case 'Employees':
                connection.query(`SELECT employee.first_name, employee.last_name, role.title, role.salary,department.name as department
                FROM (( employeetracker.employee
                join role ON employee.role_id=role.id) 
                join department on role.department_id=department.id)`, function (err, data) 
                {
                    if (err) throw err;
                    console.table(data)
                    trackerStart();
                })
                break ;

            case 'Roles':
                connection.query(`SELECT  role.title,department.name as department FROM employeetracker.role join department on role.department_id=department.id`, function (err, data) 
                {
                    if (err) throw err;
                    console.table(data)
                    trackerStart();
                })
                break ;

            case 'Departments':
                connection.query(`SELECT name as Departments FROM employeetracker.department`, function (err, data) 
                {
                    if (err) throw err;
                    console.table(data)
                    trackerStart();
                })
                break ;   
          }
    })
}

//cases for when the user wants to add to the database
function add()
{
    inquirer.prompt(
        {
            name:"resultsbase",
            message: "What would you like to add?",
            type: 'list',
            choices: ['Department','Role','Employee']
        }
    ).then(function ({ resultsbase })
    {
        switch(resultsbase)
        {
            case "Department":
                addDepartment();
                break;
            case "Role":
                addRole()
                break;
            case "Employee":
                addEmployee();
                break;
        }
    })
}

//adding a department
function addDepartment()
{
    inquirer.prompt(
        {
            name:'name',
            message: "Department's name?",
            type: 'input'
        }
    ).then(function ({name})
    {
        connection.query(`INSERT into department (name) VALUES ('${name}')`, function(err, results)
        {
            if (err) throw err;
            console.log(`Department added`)
            trackerStart();
        })
    })
}

//adding a role
function addRole()
{
    //array to select the department the role goes in
    let allDepartments = []

    connection.query(`SELECT * from department`, function (err, results) 
    {
        if (err) throw err;

        //adds department names to array to create list to select from
        for (let x = 0; x < results.length; x++)
         {
           allDepartments.push(results[x].name)
         }

        inquirer.prompt([
        {
            name: 'title',
            message: "Name of Role:",
            type: 'input'
        },
        {
            name: 'salary',
            message: 'Salary:',
            type: 'input'
        },
        {
            name: 'department_id',
            message: 'Department:',
            type: 'list',
            choices: allDepartments
        }
        ]).then(function ({ title, salary, department_id }) 
        {   
            //variable to set to first item in department array
            let deplist = allDepartments.indexOf(department_id)

            console.log("deplist: ",deplist);

            connection.query(`INSERT INTO role (title, salary, department_id) VALUES ('${title}', '${salary}', ${deplist}+1)`, function (err, results) 
            {
                if (err) throw err;
                console.log("Role added")
                //return to main menu
                trackerStart();
            })
        })
    })
}

//adding an employee
function addEmployee()
{
    //variables to get employee names for the manager and all roles to set to new employee
    let allEmployees = [];
    let allRoles = [];

    connection.query(`SELECT * from role`, function (err, results) 
    {
        if (err) throw err;

        //array of role titles to make a list to select from
        for (let x=0; x<results.length; x++) 
        {
            allRoles.push(results[x].title);
        }

        connection.query(`SELECT * from employee`, function (err, results) 
        {
            if (err) throw err;

            //array of employees to select the manager
            for (let x=0; x<results.length; x++) 
            {
                allEmployees.push(results[x].first_name);
            }

            inquirer.prompt([
                    {
                        name: 'first_name',
                        message: "Employee's First Name",
                        type: 'input'
                    },
                    {
                        name: 'last_name',
                        message: 'Last Name:',
                        type: 'input',
                    },
                    {
                        name: 'role_id',
                        message: 'Role:',
                        type: 'list',
                        choices: allRoles,
                    },
                    {
                        name: 'manager_id',
                        message: "Manager:",
                        type: 'list',
                        choices:  ['none'].concat(allEmployees)
                    }
                ]).then(function ({ first_name, last_name, role_id, manager_id }) {

                    //variable for the sql query depending on if no manager selected
                    let sqlQuery = `INSERT INTO employee (first_name, last_name, role_id`;
                    
                    //if a manager is selected 
                    if (manager_id != 'none') 
                    {
                        sqlQuery += `, manager_id) VALUES ('${first_name}', '${last_name}', ${allRoles.indexOf(role_id)}, ${allEmployees.indexOf(manager_id) + 1})`
                    } 
                    //if no manager is selected
                    else 
                    {
                        sqlQuery += `) VALUES ('${first_name}', '${last_name}', ${allRoles.indexOf(role_id) + 1})`
                    }
               
                    connection.query(sqlQuery, function (err, data) {
                        if (err) throw err;
                        console.log("Role added")
                        //return to main menu
                        trackerStart();
                    })                
        })
     })
  })
}


//updating the role of an employee
function updateRole()
{
    connection.query(`SELECT * from employee`, function (err, results) 
    {
    if (err) throw err;

    //arrays to create lists of employees and roles to select from
    let allEmployees = [];
    let allRoles = [];

    for (let x = 0; x < results.length; x++) 
    {
        allEmployees.push(results[x].first_name)
    }

    connection.query(`SELECT * from role`, function (err, results) 
    {
        if (err) throw err;

        for (let x = 0; x < results.length;x++) 
        {
            allRoles.push(results[x].title)
        }

        inquirer.prompt([
        {
            name: 'employee_id',
            message: "Employee to update Role:",
            type: 'list',
            choices: allEmployees
        },
        {
            name: 'role_id',
            message: "New Role:",
            type: 'list',
            choices: allRoles
        }
        ]).then(function ({ employee_id, role_id }) 
        {
            connection.query(`UPDATE employee set role_id = ${allRoles.indexOf(role_id) + 1} where id = ${allEmployees.indexOf(employee_id) + 1}`, function (err, results) 
                {
                    if (err) throw err;
                    trackerStart();
                })
        })
    })
  })
}


