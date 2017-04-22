var bamazon = require("./bamazon.js");
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
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ]).then(function (answers) {
        
        switch (answers.action) {
            case "View Products for Sale": viewProducts(); break;
            case "View Low Inventory": lowInventory(); break;
            case "Add to Inventory": addInventory(); break;
            case "Add New Product": insertProduct(); break;
            default: viewProducts();
        }
    });

    function viewProducts() {
     
        connection.connect(function (err) {
            if (err) {
                console.log(err)
            }
        });

        connection.query("SELECT * FROM products", function (err, res) {
            $.each(res, function (i, val) {
                console.log("SKU: " + val.item_id + ", Product Name: " + val.product_name + ", Price: " + val.price);
            });
        });
        bamazon.startProgram();
    }

    function lowInventory() {

        connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
            $.each(res, function (i, val) {
                console.log("SKU: " + val.item_id + ", Product Name: " + val.product_name + ", Price: " + val.price);
            });
        });
        bamazon.startProgram();
    }

    function addInventory() {
        inquirer.prompt([
            {
                type: "input",
                message: "Which ID would you like to add more quantity to?",
                name: "id"
            },
            {
                type: "input",
                message: "How many units would you like to add?",
                name: "unitsAdd"
            }
        ]).then(function (answers) {
            connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: answers.unitsAdd }, { item_id: answers.id }], function (req, res) {
                console.log("Quantity Updated for ID " + answers.id);
            });
        });
        bamazon.startProgram();
    }

    function insertProduct(){
        var prompt = function (Type, Message, Name, Choices) {
            this.type = Type;
            this.message = Message;
            this.name = Name;
            this.choices = Choices;
        }
        var departmentArray = [];
        connection.query("SELECT * FROM departments", function (err, res) {
            $.each(res, function (i, val) {
                departmentArray.push(val.department_name);  
            });
        });
        inquirer.prompt([
            new prompt("input", "What is the title of the item?", "title", null),
            new prompt("list", "Which department should it be categorized in", "department", departmentArray),
            new prompt("input", "What is the selling price?", "price", null),
            new prompt("input", "How many units are available for sale", "units", null),
        ]).then(function (answers) {
            var userInput = { product_name: answers.title, department_name: answers.department, price: answers.price, stock_quantity: answers.units};
            connection.query("INSERT INTO products SET ?", userInput, function (err, res) {
                if (err) throw err;
                console.log("Product Added!")
                bamazon.startProgram();
            });
        });
    }
});

