var mysql = require("mysql");
var inquirer = require("inquirer");
var fs = require("fs");
require("jsdom").env("", function (err, window) {
    if (err) {
        console.error(err);
        return;
    }

    var $ = require("jquery")(window);
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
startProgram()
exports.startProgram = startProgram;

function startProgram(){    
inquirer.prompt([
    {
        type: "input",
        message: "Are you a customer, manager, or supervisor?",
        name: "role"
    }
]).then(function(answers){
if(answers.role.toLowerCase() === "customer"){
    bamazonCustomer();
}

else if(answers.role.toLowerCase() === "manager"){
    var manager = require("./bamazonManager.js");
}

else if(answers.role.toLowerCase() === "supervisor"){
    var supervisor = require("./bamazonSupervisor.js")
}
else{
    console.log("You do not belong here! Exiting...");
    startProgram();
}
});
}
function bamazonCustomer(){
    connection.query("SELECT * FROM products", function (err, res) {
        $.each(res, function (i, val) {
            console.log("SKU: " + val.item_id + ", Product Name: " + val.product_name + ", Price: " + val.price);
        });
    });

    prompt = function(Type, Message, Name, Choices) {
        this.type = Type;
        this.message = Message;
        this.name = Name;
        this.choices = Choices;
    }

    setTimeout(function () {
        inquirer.prompt([
            new prompt("input", "Please type in Item_ID of the product you would like to buy", "itemid", null)
        ]).then(function (answers1) {
            inquirer.prompt([

                new prompt("input", "How many unit of " + answers1.itemid + " would you like to purchase?", "units", null)
            ]).then(function (answers2) {
                connection.query("SELECT * FROM products where item_id = " + answers1.itemid, function (err, res1) {
                    if (err) throw err;
                    var departmentName = res1[0].department_name;
                    var unitsAvailable = res1[0].stock_quantity;
                    var totalSales = res1[0].product_sales;
                    var totalDepartmentSales = 0;
                    if (answers2.units > unitsAvailable) {
                        console.log("Insufficient Quantity");
                        connection.end();
                    }
                    else if (answers2.units <= unitsAvailable) {
                        unitsAvailable -= answers2.units
                        totalSales += (res1[0].price * answers2.units);
                        console.log("Order Placed!");
                        connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: unitsAvailable, product_sales: totalSales }, { item_id: answers1.itemid, item_id: answers1.itemid  }], function (err, res2) {
                            if (err) throw err;
                            console.log("Order Total Due Today: $" + (res1[0].price * answers2.units));
                        });
                        connection.query("SELECT * FROM products WHERE ? ", {department_name: departmentName}, function(err,res3){
                            if(err) throw err;
                            $.each(res3, function(i,val){
                                console.log(val.product_sales);
                                totalDepartmentSales += val.product_sales;
                                console.log(totalDepartmentSales);
                                connection.query("UPDATE departments SET ? WHERE ?", [{total_sales: totalDepartmentSales}, {department_name: departmentName}], function(err, res4){
                                    console.log(departmentName);
                                    if(err) throw err;
                                });
                            });
                        });     
                    }
                });
            });
        });
    }, 1500);
}
});