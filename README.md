# Dinner Party
A web service that helps users find and save food products based on what allergens they do not contain or other dietary restrictions

## Why Build Dinner Party? 
- Build a web service from end-to-end: I have designed user experiences and written specs throughout my career, but have always stopped short of building the solution. This project allowed me to wear all hats, from thinking through the user journey, to writing the specs, and designing a software architecture that was elegant and efficient.  
- I've lived the user problem: I have many dietary restrictions, and often find myself standing in the middle of a grocery store aisle, reading the ingredients of every product on the shelf until I find one that satisfies all my needs. There is currently no product on the market that allows individuals with dietary restrictions to search for products based on what ingredients they do not contain.

## Value Prop
For hosts of dinner parties with guests having various dietary restrictions, the Dinner Party app allows hosts to create a 'party' that keeps track of all the dietary restrictions present and search for items that meet everyone's dietary restrictions.  

## Software Architecture
This web service includes several key components: 
- Web server: Node.js and Express framework
- Data storage: Amazon RDS (Relational Database Service)
- Hosting: Amazon EC2 (Elastic Compute) Elastic Beanstalk
- Open Food Facts API: Open Food Facts is a free and open source database containing food product information. This is the source of information for GET request in Product Search. [see API documentation](https://openfoodfacts.github.io/api-documentation/#1GeneralInformation)

### [Give it a try here!](http://dinner-party-0923-env.eba-pszrm7uw.us-east-2.elasticbeanstalk.com/) 

Features: 
- Real-time auto-suggestions based on user-entered input for product category
- Product search on 1000s of products from [Open Food Facts API](https://world.openfoodfacts.org/data)
- Adding items to personal shopping cart, organized by "party"
- Display shopping cart and filter based the "party" selected
- User sessions

## User Stories
- As a user, I want to collect the dietary restrictions of my dinner guests so that everyone's preferences are met.
- As a user, I want to add items to my shopping list for a unique party so that I can organize the menu and plan for what ingredients to buy. 
- As a user,  I want to search for food items based on my dietary restrictions so that I don't need to read through / check all the ingredients of every product. 

