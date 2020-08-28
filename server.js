//dependencies

const mysql = require('mysql');
const cTable = require('console.table');
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

//functions allowing user to:
//Add departments, roles, employees
//View departments, roles, employees
//Update employee roles

function trackerStart()
{
    inquirer.prompt(
        {
            name: 'start',
            type: 'list',
            message: 'Please choose an option',
            choices: ['Add','View','Update Role','Quit'],
        }
    ).then(function ({start})
    {
        switch (start)
        {
            case 'Add':
                add();
                break;
            case 'View':
                view();
                break ;
            case 'Update Role':
                updateRole();
                break;
            case 'Quit':
                connection.end() 
                return;

        }
    })
}

function add()
{
    inquirer.prompt(
        {
            name:"database",
            message: "What would you like to add?",
            type: 'list',
            choices: ['Department','Role','Employee']
        }
    ).then(function ({ database })
    {
        switch(database)
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

function addDepartment()
{
    inquirer.prompt
    (
        {
            name:'name',
            message: "Department's name?",
            type: 'input'
        }
    ).then(function ({name})
    {
        connection.query(`INSERT INTO department (name) VALUES ('${name}')`, function(err, data)
        {
            if (err) throw err;
            console.log(`Department added`)
            trackerStart();
        })
    })
}

function addRole()
{
    let allDepartments = [];

    connection.query(`SELECT * from department`, function(err, results)
    {
        if (err) throw err;

        for (let x=0;x<results.lenght;x++)
        {
            allDepartments.push(results[x].name)
        }
    inquirer.prompt
    ([
        {
            name:'title',
            message:"Name of the Role?",
            type:'input'
        },
        {
            name:'salary',
            message:"Salary amount?",
            type:'input'
        },
        {
            name:'department_id',
            message:"Which department?",
            type:'list',
            choices: allDepartments
        }
    ]).then(function({title,salary,department_id})
    {
        let list = allDepartments.indexOf(department_id)

        connection.query(`INTERT into role(title, salary, department_id) values ('${title}','${salary}',${index})`,function(err, data)
        { if (err) throw err;
            console.log('Role added')
            startTracker();
        })
    })
})

}

function addEmployee()
{
    let allRoles = [];
    let allEmployees = [];

    connection.query(`SELECT * from role`, function(err, results)
    {
        if (err) throw err;

        for (let x=0;x<results.lenght;x++)
        {
            allRoles.push(results[x].title)
        }

        connection.query(`SELECT * from employee`, function(err, results)
        {
            if (err) throw err;
    
            for (let x=0;x<results.lenght;x++)
            {
                employees.push(results[x].fist_name)
            }


    inquirer.prompt
    ([
        {
            name:'first_name',
            message:"Employee's First Name:",
            type:'input'
        },
        {
            name:'last_name',
            message:"Employee's Last Name:",
            type:'input'
        },
        {
            name:'role_id',
            message:"Role:",
            type:'list',
            choices: allRoles,
        },
        {
            name:'manager_id',
            message:"Manager:",
            choices: employees
        }
    ]).then(function({first_name,last_name, role_id,manager_id})
    {
        connection.query(`INSTERT into employee (first_name, last_name, role_id,manager_id)
 values ('${first_name}','${last_name}',${roles.indexOF(role_id)}, ${employees.indexOf(manager_id)+1})`,function(err, data)
        { if (err) throw err;
            console.log('Employee added')
            startTracker();
           })
        })
    })
  })
}

function view()
{
    inquirer.prompt(
        {
            name:"table",
            message:"What would you like to view?",
            type:'list',
            choices:['employee','role','department'],
        }
    ).then(function ({database})
    {
        connection.query(`SELECT * FROM ${table}`, function (err, results)
        {
            if (err) throw err;
            console.table(results)
            startTracker();
        })
    })
}

function updateRole()
{
    connection.query(`SELECT * from employee`, function (err, results)
    {
        if (err) throw err;

        let allRoles = [];
        let employees = [];

        for (let x=0;x<results.lenght;x++)
            {
                employees.push(results[x].first_name)
            }

        connection.query(`select * from role`, function (err, results)
        {
            if (err) throw err;

            for (let x=0;x<results.lenght;x++)
            {
                allRoles.push(results[x].title)
            }
        
        inquirer.prompt([
            {
                name:'employee_id',
                message:"Employee for role update:",
                type:'list',
                choices: employees
            },
            {
                name:'role_id',
                message:"New role:",
                choices: allRoles
            }
        ]).then(function ({employee_id,role_id})
        {
            connection.query(`UPDATE employee set role_id = ${allRoles.indexOf(role_id)+1} where id = ${employees.indexOf(employee_id)+1}`,function (err,results)
            {
                if (err) throw err;
                startTracker();
            })
        })
    })
  })
}


