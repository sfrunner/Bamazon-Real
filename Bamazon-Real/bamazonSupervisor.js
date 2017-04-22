var inquirer = require("inquirer");
var mysql = require("mysql");
var table = require("cli-table");
var bamazon = require("./bamazon.js");
exports.supervisor = function(){
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",
    password: "bcb0727.",
    database: "bamazon"
});
connection.connect(function (err) {
    if (err) {
        console.log(err)
    }
});
require("jsdom").env("", function (err, window) {
    if (err) {
        console.error(err);
        return;
    }

    var $ = require("jquery")(window);
    inquirer.prompt([
        {
            type: "list",
            message: "Please select option (Supervisor View)",
            name: "action",
            choices: ["View Products Sales by Department", "Create New Department"]
        }
    ]).then(function (answers) {

        switch (answers.action) {
            case "View Product Sales by Department": viewDepartments(); break;
            case "Create New Department": insertDepartment(); break;
            default: viewDepartments();
        }
    });

    function viewDepartments() {
        connection.query("SELECT * FROM departments", function(err, res){
            console.log(res);
            if(err) throw err;
             // instantiate 
        var Table = new table({
            head: ["department_id","department_name","over_head_costs","total_sales","total_profit"]
        });
        $.each(res, function(i,val){
            var totalProfit = val.total_sales-val.over_head_costs; 
            Table.push([val.department_id, val.department_name, val.over_head_costs, val.total_sales, totalProfit]);  
        });
        // table is an Array, so you can `push`, `unshift`, `splice` and friends 
        console.log(Table.toString());
        bamazon.startProgram();
        });
    }

    function insertDepartment(){
        var prompt = function (Type, Message, Name, Choices) {
            this.type = Type;
            this.message = Message;
            this.name = Name;
            this.choices = Choices;
        }
        inquirer.prompt([
            new prompt("input", "What is the name of the department?", "departmentName", null),
            new prompt("input", "What are the overhead costs?", "overHead", null),
        ]).then(function (answers) {
            var userInput = { department_name: answers.departmentName, over_head_costs: answers.overHead};
            connection.query("INSERT INTO departments SET ?", userInput, function (err, res) {
                if (err) throw err;
                console.log("Department Added!")
                bamazon.startProgram();
            });
        });
    }
});
}