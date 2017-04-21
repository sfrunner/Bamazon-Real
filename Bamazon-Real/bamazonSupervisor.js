var inquirer = require("inquirer");
var mysql = require("mysql");
var table = require("cli-table");
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
            message: "Please select option (Manager View)",
            name: "action",
            choices: ["View Products Sales by Department", "Create New Department"]
        }
    ]).then(function (answers) {

        switch (answers.action) {
            case "View Product Sales by Department": viewDepartments(); break;
            //case "Create New Department": lowInventory(); break;
            default: viewDepartments();
        }
    });

    function viewDepartments() {

        // instantiate 
        var Table = new table({
            head: ["department+id","department_name","over_head_costs","product_sales","total_profit"]
            , colWidths: [100, 100,100,100,100]
        });

        // table is an Array, so you can `push`, `unshift`, `splice` and friends 
        Table.push(
            ['First value', 'Second value']
            , ['First value', 'Second value']
        );

        console.log(Table.toString());
    }

});