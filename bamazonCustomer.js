// node module dependencies for this CLI

var inquirer = require('inquirer');
var mysql = require("mysql");
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",

    //Your port; if not 3306
    port: 3306,

    //Your username
    user: "root",

    //Your password
    password: "Keroka77",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id" + connection.threadId);
    runBamazon();
});

//--Beginning of the Inquirer

function runBamazon() {};

//Displays all items available in store and then calls the place order function
function fetchInventory() {
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;

        console.log('Ndogogio Stores your Home Store!!!');

        for (i = 0; i < res.length; i++) {
            console.log('Item ID:' + res[i].item_id + ' Product Name: ' + res[i].product_name + 'Department_name: ' + res[i].department_name + ' Price: ' + '$' + res[i].price + ')')
        }

        customerPrompt();
    })
}

//Prompts the user to place an order, fulfills the order, and then calls the new order function
function customerPrompt() {
    inquirer.prompt([{
        name: 'selectId',
        message: 'Please enter the ID of the product you wish to purchase'

    }, {
        name: 'specifyQuantity',
        message: 'What would be the quantity of your order?'

    }]).then(function(customer) {
        connection.query('SELECT * FROM products WHERE id = ?', [customer.selectId], function(err, res) {
            if (customer.specifyQuantity > res[0].stock_quantity) {
                console.log('Insufficient quantity! Consider a different item or quantity');

                doPurchase();
            } else {
                amountToPay = res[0].Price * customer.specifyQuantity;
                thisDepartment = res[0].department_name;
                console.log('Thanks for your order');
                console.log('\nYour Total today was=' + amountToPay);

                //update products table
                connection.query('UPDATE products SET ? Where ?', [{
                    StockQuantity: res[0].stock_quantity - customer.specifyQuantity
                }, {
                    id: customer.selectId
                }], function(err, res) {});
                //update departments table
                tellDepartment();
                doPurchase();
            }
        })

    }, function(err, res) {})
};

//Allows the user to place a new order or end the connection
function doPurchase() {
    inquirer.prompt([{
        type: 'confirm',
        name: 'choice',
        message: 'Would you like to place another order?'
    }]).then(function(customer) {
        if (customer.choice) {
            doPurchase();
        } else {
            console.log('Thank you for shopping at Ndogogio Bamazon!');
            connection.end();
        }
    })
};

//functions to push the sales to the executive table
function tellDepartment() {
    connection.query('SELECT * FROM departments WHERE DepartmentName = ?', [thisDepartment], function(err, res) {
        update_sales = res[0].TotalSales + amountToPay;
        updateDeptTable();
    })
};

function updateDeptTable() {
    connection.query('UPDATE departments SET ? WHERE ?', [{
        TotalSales: update_sales
    }, {
        DepartmentName: thisDepartment
    }], function(err, res) {});
};
//Call the original function (all other functions are called within this function)

fetchInventory();
