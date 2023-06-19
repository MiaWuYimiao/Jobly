const { BadRequestError } = require("../expressError");

/** Convert partial update data into form of {setCols, values}
 *  The return form can be easily used to fill up the sql query
 * 
 *  This function works for both user and company model by 
 *  passing in different jsToSql
 * 
 *  For company model
 *  jsToSql: {numEmployees: "num_employees", logoUrl: "logo_url"}
 *  For user model
 *  jsToSql: {firstName: "first_name", lastName: "last_name", isAdmin: "is_admin"}
 *
 *  
 *
 *  Partial company data example:
 *  dataToUpdate: {name: "newCompany", numEmployees: 10, logoUrl: "newLogo_url"}
 *  jsToSql: {numEmployees: "num_employees", logoUrl: "logo_url",}
 *
 *  Returns {setCols: ['"name"=$1', '"num_employees"=$2', '"logo_url"=$3'],
 *           values: ["newCompany", 10, "newLogo_url"]}
 *
 * 
 *  Partial user data example:
 *  dataToUpdate: {firstName: "testUser", email: "test@e.com", isAdmin: false}
 *  jsToSql: {firstName: "first_name", lastName: "last_name", isAdmin: "is_admin"}
 *
 *  Returns {setCols: ['"first_name"=$1', '"email"=$2', '"is_admin"=$3'],
 *           values: ["testUser", test@e.com, false]}
 * 
 * 
 *  Partial job data example:
 *  dataToUpdate: {title: "newJob", salary: 100000, equity: 0}
 *  jsToSql: {}
 * 
 *  Returns {setCols: ['"title"=$1', '"salary"=$2', '"equity"=$3'],
 *            values: ["newJob", 100000, 0]}
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
