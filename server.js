// Call dependencies.
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

// Create connection to SQL database.
const db = mysql.createConnection({
    host:"localhost",
    port:3001,
    user:"root",
    password:"mysql",
    database:"employee_db"
});

// Connect and confirm connection to SQL database.
db.connect(function(err){
    if(err) throw err;
    console.log("SQL database connected");
    start();
});

// Start of the application.
function start(){
    inquirer
        .prompt([
            {
                type:"list",
                name:"start",
                message:"What would you like to do?",
                choices: ["View","Add","Update","Exit"]
            }
        ])
};