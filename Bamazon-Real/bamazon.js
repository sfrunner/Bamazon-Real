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

    connection.query("SELECT * FROM products", function (err, res) {
        $.each(res, function (i, val) {
            console.log("SKU: " + val.item_id + ", Product Name: " + val.product_name + ", Price: " + val.price);
        });
    });

    function prompt(Type, Message, Name, Choices) {
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
                    var unitsAvailable = res1[0].stock_quantity;
                    if (answers2.units > unitsAvailable) {
                        console.log("Insufficient Quantity");
                        connection.end();
                    }
                    else if (answers2.units <= unitsAvailable) {
                        unitsAvailable -= answers2.units
                        console.log("Order Placed!");
                        connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: unitsAvailable }, { item_id: answers1.itemid }], function (err, res2) {
                            if (err) throw err;
                            console.log("Order Total Due Today: $" + (res1[0].price * answers2.units));
                        });
                    }
                });
            });
        });
    }, 1500);
});