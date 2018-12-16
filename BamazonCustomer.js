// the required dependencies

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

connection.connect(function(err){
    if(err) throw err;
    console.log("connected as id" + connection.threadId);
  runBamazon();
});


//--Beginning of the Inquirer

function runBamazon() {}



//Displays all items available in store and then calls the place order function
function displayInventory(){
	connection.query('SELECT * FROM products', function(err, res){
		if (err) throw err;
		
		console.log('Ndogogio Stores your Home Store!!!');
		

		for(i=0;i<res.length;i++){
			console.log('Item ID:' + res[i].id + ' Product Name: ' + res[i].ProductName + ' Price: ' + '$' + res[i].Price + '(Quantity left: ' + res[i].StockQuantity + ')')
		}
		
		userExperience();
		})
}

//Prompts the user to place an order, fulfills the order, and then calls the new order function
function userExperience(){
	inquirer.prompt([{
		name: 'selectId',
		message: 'Please enter the ID of the product you wish to purchase',
		validate: function(value){
			var valid = value.match(/^[0-9]+$/)
			if(valid){
				return true
			}
				return 'Please enter a valid Product ID'
		}
	},{
		name:'selectQuantity',
		message: 'How many of this product would you like to order?',
		validate: function(value){
			var valid = value.match(/^[0-9]+$/)
			if(valid){
				return true
			}
				return 'Please enter a numerical value'
		}
	}]).then(function(answer){
	connection.query('SELECT * FROM products WHERE id = ?', [answer.selectId], function(err, res){
		if(answer.selectQuantity > res[0].StockQuantity){
			console.log('Insufficient Stock');
			console.log('Try another product');
			
			makePurchase();
		}
		else{
			amountOwed = res[0].Price * answer.selectQuantity;
			currentDepartment = res[0].DepartmentName;
			console.log('Thanks for your order');
			console.log('Your Total today was=' + amountOwed);
			
			//update products table
			connection.query('UPDATE products SET ? Where ?', [{
				StockQuantity: res[0].StockQuantity - answer.selectQuantity
			},{
				id: answer.selectId
			}], function(err, res){});
			//update departments table
			logSaleToDepartment();
			makePurchase();
		}
	})

}, function(err, res){})
};

//Allows the user to place a new order or end the connection
function makePurchase(){
	inquirer.prompt([{
		type: 'confirm',
		name: 'choice',
		message: 'Would you like to place another order?'
	}]).then(function(answer){
		if(answer.choice){
			userExperience();
		}
		else{
			console.log('Thank you for shopping at Bamazon!');
			connection.end();
		}
	})
};


//functions to push the sales to the executive table
function logSaleToDepartment(){
	connection.query('SELECT * FROM departments WHERE DepartmentName = ?', [currentDepartment], function(err, res){
		updateSales = res[0].TotalSales + amountOwed;
		updateDepartmentTable();
	})
};

function updateDepartmentTable(){
		connection.query('UPDATE departments SET ? WHERE ?', [{
		TotalSales: updateSales
	},{
		DepartmentName: currentDepartment
	}], function(err, res){});
};
//Call the original function (all other functions are called within this function)

displayInventory();
