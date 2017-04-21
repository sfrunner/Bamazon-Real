var inquirer = require("inquirer");
var mysql = require("mysql");
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
            case "View Product Sales by Department": viewProducts(); break;
            case "Create New Department": lowInventory(); break;
            default: viewProducts();
        }
    });