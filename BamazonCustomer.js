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
    password: "keroka77",
    database: "bamazon"  
});

connection.connect(function(err){
    if(err) throw err;
    console.log("connected as id" + connection.threadId);
  runBamazon();
});


//--Beginning of the Inquirer

function runBamazon() {}