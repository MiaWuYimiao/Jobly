const { sqlForPartialUpdate } = require("./sql");

describe("Test sqlForPartialUpdate", function () {
  test("works: company example", function () {
    const dataToUpdate = {name: "newCompany", 
                          numEmployees: 10, 
                          logoUrl: "newLogo_url"}
    const jsToSql = {numEmployees: "num_employees", logoUrl: "logo_url",}

    const result = {setCols: '"name"=$1, "num_employees"=$2, "logo_url"=$3',
                    values: ["newCompany", 10, "newLogo_url"]};
    const partialData = sqlForPartialUpdate(dataToUpdate, jsToSql);
    expect(partialData).toEqual(result);
  });

  test("works: user example ", function () {
    const dataToUpdate = {firstName: "testUser", 
                          email: "test@e.com", 
                          isAdmin: false}
    const jsToSql = {firstName: "first_name", lastName: "last_name", isAdmin: "is_admin"};
    const result = {setCols: '"first_name"=$1, "email"=$2, "is_admin"=$3',
                    values: ["testUser", "test@e.com", false]};
    const partialData = sqlForPartialUpdate(dataToUpdate, jsToSql);
    expect(partialData).toEqual(result);
  });

});
