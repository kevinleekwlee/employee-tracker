// Call dependencies.
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

// Create connection to SQL database.
const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mysql",
    database: "employee_db"
});

// Connect and confirm connection to SQL database.
db.connect(function(err){
    if (err) throw err;
    console.log("SQL database connected");
    start();
});

// Start of the application.
function start(){
    inquirer
        .prompt([
            {
                type: "list",
                name: "start",
                message: "What action would you like to take?",
                choices: ["View","Add","Update","Exit"]
            }
        ]).then(function(res){
            switch(res.start){
                case "View":
                    view();
                    break;
                case "Add":
                    add();
                    break;
                case "Update":
                    updateEmployee();
                    break;
                case "Exit":
                    console.log("-------------------------------")
                    console.log("You have exited the application")
                    console.log("-------------------------------")
                    break;
            }
        });
}

// Prompt route for VIEW.  

function view(){
    inquirer
        .prompt([
            {
                type:"list",
                name:"view",
                message:"How do you want to view?",
                choices: ["All Employees","By Department","By Role","Exit"]
            }
        ]).then(function(res){
            switch(res.view){
                case "All Employees":
                    viewAllEmployees();
                    break;
                case "By Department":
                    viewByDepartment();
                    break;
                case "By Role":
                    viewByRole();
                    break;
                case "Exit":
                    console.log("-------------------------------")
                    console.log("You have exited the application")
                    console.log("-------------------------------")
                    break;
            }
        });
}

function viewAllEmployees(){
    db.query("SELECT e.id AS ID, e.first_name AS FirstName, e.last_name AS LastName, e.role_name AS Role, roles.salary AS Salary, m.first_name AS Manager, department.name AS department FROM employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN roles ON e.role_name = roles.title LEFT JOIN department ON roles.department_id = department.id ORDER BY roles.salary DESC", function(err, results){
        if(err) throw err;
        console.table(results);
        start();
    });
}

function viewByDepartment(){
    db.query("SELECT * FROM department", function(err, results){
        if(err) throw err;
        inquirer
            .prompt([
                {
                    type:"list",
                    name:"choice",
                    message:"Which department would you like to view?",
                    choices: function(){
                        let choiceArr = [];
                        for(i = 0; i < results.length; i++){
                            choiceArr.push(results[i].name);
                        }
                        return choiceArr;
                    }
                }
            ]).then(function(answer){
                db.query("SELECT e.id AS ID, e.first_name AS FirstName, e.last_name AS LastName, e.role_name AS Role, roles.salary AS Salary, m.first_name AS Manager, department.name AS department FROM employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN roles ON e.role_name = roles.title LEFT JOIN department ON roles.department_id = department.id WHERE department.name = ? ORDER BY roles.salary DESC", [answer.choice], function(err, results){
                    if(err) throw err;
                    console.table(results);
                    start();
                });
            })
    })
}

function viewByRole(){
    db.query("SELECT title FROM roles", function(err, results){
        if(err) throw err;
        inquirer
            .prompt([
                {
                    type:"list",
                    name:"choice",
                    message:"Which role would you like to view?",
                    choices: function(){
                        let choiceArr = [];
                        for(i = 0; i < results.length; i++){
                            choiceArr.push(results[i].title);
                        }
                        return choiceArr;
                    }
                }
            ]).then(function(answer){
                db.query("SELECT e.id AS ID, e.first_name AS FirstName, e.last_name AS LastName, e.role_name AS Role, roles.salary AS Salary, m.first_name AS Manager, department.name AS department FROM employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN roles ON e.role_name = roles.title LEFT JOIN department ON roles.department_id = department.id WHERE e.role_name = ? ORDER BY roles.salary DESC", [answer.choice], function(err, results){
                    if(err) throw err;
                    console.table(results);
                    start();
                });
            })
    })
}

// Prompt route for ADD.

function add(){
    inquirer
        .prompt([
            {
                type:"list",
                name:"add",
                message:"What do you want to add?",
                choices: ["Department","Role","Employee","Exit"]
            }
        ]).then(function(res){
            switch(res.add){
                case "Department":
                    addDepartment();
                    break;
                case "Role":
                    addRole();
                    break;
                case "Employee":
                    addEmployee();
                    break;
                case "Exit":
                    console.log("-------------------------------")
                    console.log("You have exited the application")
                    console.log("-------------------------------")
                    break;
            }
        });
}

function addDepartment(){
    inquirer
        .prompt([
            {
                type:"input",
                name:"department",
                message:"What is the new department you want to add?"
            }
            ]).then(function(answer){
                db.query("INSERT INTO department VALUES (DEFAULT, ?)", [answer.department], function(err, results){
                    if(err) throw err;
                    console.log("-------------------------------")
                    console.log("You have added a new department: " + answer.department)
                    console.log("-------------------------------")
                    start();
                });
            })
}

function addRole(){
    inquirer
        .prompt([
            {
                type:"input",
                name:"title",
                message:"What is the new role title?"
            },
            {
                type:"input",
                name:"salary",
                message:"What will the salary be?",
                validate: function(value){
                    if(isNaN(value) === false){
                        return true;
                    }
                    console.log(" (Must input a number. Try again.)")
                    return false;
                }
            },
            {
                type:"input",
                name:"department_id",
                message:"What department id will they belong to?",
                validate: function(value){
                    if(isNaN(value) === false){
                        return true;
                    }
                    console.log(" (Must input a number. Try again.)")
                    return false;
                }
            }
        ]).then(function(answer){
            db.query("INSERT INTO roles SET ?",
            {
                title: answer.title,
                salary: answer.salary,
                department_id: answer.department_id
            },
            function(err){
                if(err) throw err;
                console.log("-------------------------------")
                console.log("You have added a new role: " + answer.title)
                console.log("-------------------------------")
                start();

            }
            )
        })
}

function addEmployee(){
    db.query("SELECT * FROM roles", function(err, results){
        if(err) throw err;
        inquirer
            .prompt([
                {
                    type:"input",
                    name:"firstName",
                    message:"What is the new employee first name?"
                },
                {
                    type:"input",
                    name:"lastName",
                    message:"What is the new employee last name?"
                },
                {
                    type:"list",
                    name:"role",
                    message:"What is the role?",
                    choices: function(){
                        let choiceArr = [];
                        for(i = 0; i < results.length; i++){
                            choiceArr.push(results[i].title);
                        }
                        return choiceArr;
                    }
                },
                {
                    type:"input",
                    name:"manager",
                    message:"What manager id will they have?",
                    default:"1",
                    validate: function(value){
                        if(isNaN(value) === false){
                            return true;
                        }
                        console.log(" (Must input a number. Try again.)")
                        return false;
                    }
                }
            ]).then(function(answer){
                db.query("INSERT INTO employee SET ?",
                {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    role_name: answer.role,
                    manager_id: answer.manager
                },
                function(err){
                    if(err) throw err;
                    console.log("-------------------------------")
                    console.log("You have added a new employee: " + answer.firstName + " " + answer.lastName)
                    console.log("-------------------------------")
                    start();
                }
                )
            })
    })
}

// Prompt route for UPDATE.

function updateEmployee(){
    db.query("SELECT * FROM employee", function(err, results){
        if(err) throw err;
        inquirer
            .prompt([
                {
                    type:"list",
                    name:"choice",
                    message:"Which employee do you want to update?",
                    choices: function(){
                        let choiceArr = [];
                        for(i = 0; i < results.length; i++){
                            choiceArr.push(results[i].last_name);
                        }
                        return choiceArr;
                    }
                }
            ]).then(function(answer){
                const saveName = answer.choice;

                db.query("SELECT * FROM employee", function(err, results){
                    if(err) throw err;
                    inquirer
                        .prompt([
                            {
                                type:"list",
                                name:"role",
                                message:"What is the updated title?",
                                choices: function(){
                                    let choiceArr = [];
                                    for(i = 0; i < results.length; i++){
                                        choiceArr.push(results[i].role_name);
                                    }
                                    return choiceArr;
                                }
                            },
                            {
                                type:"input",
                                name:"manager",
                                message:"What is the updated manager id?",
                                default:"1",
                                validate: function(value){
                                    if(isNaN(value) === false){
                                        return true;
                                    }
                                    console.log(" (Must input a number. Try again.)")
                                    return false;
                                }
                            }
                        ]).then(function(answer){
                            db.query("UPDATE employee SET ? WHERE last_name = ?",
                            [{
                                role_name: answer.role,
                                manager_id: answer.manager
                            }, saveName],
                            function(err){
                                if(err) throw err;
                                console.log("-------------------------------")
                                console.log("The update has been made.")
                                console.log("-------------------------------")
                                start();
                            }
                            )
                        })
                })
            })
    })
}