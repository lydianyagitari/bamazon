CREATE DATABASE if not exists bamazon;

USE bamazon;

CREATE TABLE products(
   item_id INT NOT NULL AUTO_INCREMENT,
   product_name VARCHAR(100) NOT NULL,
   department_name VARCHAR(40) NOT NULL,
   price DECIMAL(20,4),
   stock_quantity INTEGER NULL,
   PRIMARY KEY (item_id)
); 
INSERT INTO products ( product_name, department_name, price, stock_quantity)
VALUES 
("sugar", "baking", 29.99, 1500),
("jim beam", "liquor", 32.00, 200);


SELECT * FROM products;