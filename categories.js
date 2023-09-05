///extract categories from https://us.openfoodfacts.org/categories.json
// and insert each category data into database

const url = 'https://us.openfoodfacts.org/categories.json';
const dbConnection = require('./database.js')

fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    var off_categories = data['tags']
    console.log('first category:', off_categories[0]);
    //iterate through all the OFF categories
    categoryLoop: for (const item of off_categories) {
        //extract required data
        var off_name = item['id']; //remove en:
        var generic_name = item['name'];
        console.log(generic_name)

        //cleaning up data
        if (typeof generic_name === 'number' || //if it's a number
            !off_name.startsWith("en:") //if not english
            )
        {continue categoryLoop} //skip 
        
        else if (generic_name.includes("-")) //for example, name is dark-chocolate-chips
            {generic_name = generic_name.replace(/-/g, " ")} //becomes dark chocolate chips
        
        //and insert into the database
        console.log('inserting ', generic_name)
        new_category = [off_name, generic_name]

        var sqlinsert = `
        insert into categories (off_name, generic_name)
        values(?, ?);`;
        
        dbConnection.query(sqlinsert, new_category, (err, results, _) => {
            if (err) {
              throw err;
            }
            console.log("successful insert")
            console.log(results.affectedRows == 1);})
        }})
  .catch(error => {
    console.error('Error:', error);
  });
