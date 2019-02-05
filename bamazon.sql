
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Keroka96';
CREATE DATABASE if not exists bamazon;

USE bamazon;


CREATE TABLE if not exists products(
   item_id INT NOT NULL ,
   product_name VARCHAR(100) NOT NULL,
   department_name VARCHAR(40) NOT NULL,
   price DECIMAL(20,4),
   stock_quantity INTEGER NULL,
   PRIMARY KEY (item_id)
); 
INSERT INTO products ( product_name, department_name, price, stock_quantity)
VALUES 
("sugar", "baking", 29.99, 1400),
("sugr", "baking", 22.99, 1300),
("sgar", "bring", 26.99, 15100),
("sugr", "baking", 23.99, 15040),
("sugaer", "baking", 27.99, 15400),
("sugklar", "baking", 19.99, 1600),
("sugkar", "baking", 79.99, 1500),
("pugar", "baking", 99.99, 15500),
("gar", "baking", 239.99, 19500),
("jim beam", "liquor", 32.00, 200);


SELECT * FROM products;