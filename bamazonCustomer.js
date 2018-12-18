// node module dependencies for this CLI
//https://www.npmjs.com/package/inquirer
//https://www.npmjs.com/package/cli-table
//https://www.npmjs.com/package/mysql

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

//--starts to run bamazon

function runBamazon() {};

//Displays all items available in store's product inventory
function fetchInventory() {
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;

        console.log('Ndogogio Stores your Home Store!!!');

        for (i = 0; i < res.length; i++) {
            console.log('Item ID:' + res[i].item_id + ' Product Name: ' + res[i].product_name + 'Department_name: ' + res[i].department_name + ' Price: ' + '$' + res[i].price + 'Stock Quantity:' + res[i].stock_quantity)
        }

        customerPrompt();
    })
}

//Prompts the user to select item ID 
function customerPrompt() {
    inquirer.prompt([{
        name: 'selectId',
        message: 'Please enter the ID of the product you wish to purchase'
            //Prompts the user to select quantity to buy
    }, {
        name: 'specify_quantity',
        message: 'What would be the quantity of your order?'

    }]).then(function(customer) {
        connection.query('SELECT * FROM products WHERE id = ?', [customer.selectId], function(err, res) {
            if (customer.specify_quantity > res[0].stock_quantity) {
                console.log('Insufficient quantity! Consider a different item or quantity');

                doPurchase();
            } else {
                amountToPay = res[0].Price * customer.specify_quantity;
                thisDepartment = res[0].department_name;
                console.log('Thanks for your order');
                console.log('\nYour Total today was=' + amountToPay);

                //update  stock quantity in the products table
                connection.query('UPDATE products SET ? Where ?', [{
                    StockQuantity: res[0].stock_quantity - customer.specify_quantity
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
    connection.query('SELECT * FROM departments WHERE department_name = ?', [thisDepartment], function(err, res) {
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
//Call the inventoty function

fetchInventory();
