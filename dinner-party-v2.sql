---CREATE DATABASE dinnerparty;



USE dinnerparty;

--each party has a shopping list of multiple food items that the user can add
USE dinnerparty;
DROP TABLE IF EXISTS shoppinglist; 
--one user can have multiple parties
USE dinnerparty;
DROP TABLE IF EXISTS parties;
--this is for the user creating the party/menu
DROP TABLE IF EXISTS hosts;
--DROP TABLE IF EXISTS categories; 

/*
USE dinnerparty;
CREATE TABLE categories
(
    categoryid int not null AUTO_INCREMENT,
    off_name varchar(128) not null,
    generic_name varchar(64) not null,  
    PRIMARY KEY (categoryid),
    UNIQUE (off_name)
);

ALTER TABLE categories AUTO_INCREMENT = 1001;
*/

USE dinnerparty;
CREATE TABLE hosts
(
    hostid int not null AUTO_INCREMENT,
    email varchar(128) not null,
    username varchar(64) not null,
    pw varchar(128) not null,   
    PRIMARY KEY (hostid),
    UNIQUE (email)
);

ALTER TABLE hosts AUTO_INCREMENT = 80001;


USE dinnerparty;
CREATE TABLE parties
(
    partyid int not null AUTO_INCREMENT,
    partyname varchar(64) not null,  
    milk boolean,
    egg boolean,
    fish boolean,
    peanut boolean,
    treenut boolean,
    soybean boolean,
    gluten boolean,
    sesame boolean,
    vegan boolean,
    vegetarian boolean,
    kosher boolean,
    halal boolean,
    organic boolean,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    hostid int not null,
    PRIMARY KEY (partyid),
    FOREIGN KEY (hostid) REFERENCES hosts(hostid),
    UNIQUE (partyname, hostid)
);

ALTER TABLE parties AUTO_INCREMENT = 5001; -- starting value

use dinnerparty;
CREATE TABLE shoppinglist
(
    entryid int not null AUTO_INCREMENT,
    productid varchar(64) not null,
    category varchar(64) not null,  
    productname varchar(64) not null,
    ingredients varchar(255),
    allergens varchar(255),
    traces varchar(255),
    labels varchar(255),
    timeadded datetime DEFAULT CURRENT_TIMESTAMP,
    partyid int,
    PRIMARY KEY (entryid),
    FOREIGN KEY (partyid) REFERENCES parties(partyid)
);

ALTER TABLE shoppinglist AUTO_INCREMENT = 1001; -- starting value

---manually creating sessions table using Admin privileges so the app doesn't have to. 
---reference: https://www.npmjs.com/package/express-mysql-session?activeTab=code
---source: https://github.com/chill117/express-mysql-session/blob/master/schema.sql
use dinnerparty;
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` mediumtext COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
)

/*
--controlling db access

DROP USER IF EXISTS 'ee-read-write';
CREATE USER 'ee-read-write' IDENTIFIED BY 'per92020!!';
GRANT SELECT, SHOW VIEW, INSERT, UPDATE, DELETE ON dinnerparty.*
TO 'ee-read-write';
FLUSH PRIVILEGES;

USE dinnerparty;
SELECT generic_name FROM categories WHERE generic_name LIKE "breakfast_cereals";
select  count(*) from categories;
*/


select * from parties;

DELETE FROM parties WHERE partyname = 'joonsday party';

use dinnerparty;
select s.*, h.username, p.partyname from shoppinglist s
left join parties p 
on s.partyid = p.partyid
left join hosts h
on h.hostid = p.hostid
where h.username = 'peyman220'
order by timeadded desc;

use dinnerparty;
select count(*) from parties where hostid=80010 and partyname = 'brunch with bae';




use dinnerparty;
select * from parties;

use dinnerparty;
insert into parties (partyname, peanut, hostid)
values('testparty2', 1,80002);

insert into parties (partyname, peanut, hostid)
values('firstparty', 1,80001);

use dinnerparty;
select * from parties where hostid=80002;



