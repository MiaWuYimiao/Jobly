"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newJob = {
    title: "New",
    salary: 100000,
    equity: "1",
    companyHandle: "c1",
  };

  test("works", async function () {
    let job = await Job.create(newJob);
    expect(job).toEqual({
        id: expect.any(Number),
        ...newJob,
    });
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let jobs = await Job.findAll({});
    expect(jobs).toEqual([
      {
        id: testJobIds[0],
        title: "j1",
        salary: 10000,
        equity: "0",
        companyHandle: "c1",
      },
      {
        id: testJobIds[1],
        title: "j2",
        salary: 20000,
        equity: "0",
        companyHandle: "c2",
      },
      {
        id: testJobIds[2],
        title: "j3",
        salary: 30000,
        equity: "0.2",
        companyHandle: "c3",
      },
      {
        id: testJobIds[3],
        title: "j4",
        salary: 40000,
        equity: "0.4",
        companyHandle: "c4",
      },
    ]);
  });

  test("works: by min salary", async function () {
    const searchFilter = {
      minSalary: 40000,
    }
    let jobs = await Job.findAll(searchFilter);
    expect(jobs).toEqual([
        {
            id: testJobIds[3],
            title: "j4",
            salary: 40000,
            equity: "0.4",
            companyHandle: "c4",
        },
    ]);
  });

  test("works: by equity", async function () {
    const searchFilter = {
      hasEquity: true,
    }
    let jobs = await Job.findAll(searchFilter);
    expect(jobs).toEqual([
        {
            id: testJobIds[2],
            title: "j3",
            salary: 30000,
            equity: "0.2",
            companyHandle: "c3",
        },
        {
            id: testJobIds[3],
            title: "j4",
            salary: 40000,
            equity: "0.4",
            companyHandle: "c4",
        },
    ]);
  });


  test("works: by name", async function () {
    const searchFilter = {
        titleLike: '4',
    }
    let jobs = await Job.findAll(searchFilter);
    expect(jobs).toEqual([
        {
            id: testJobIds[3],
            title: "j4",
            salary: 40000,
            equity: "0.4",
            companyHandle: "c4",
        },
    ]);
  });

  test("works: by min salar and equity", async function () {
    const searchFilter = {
      minSalary: 40000,
      equity: true
    }
    let jobs = await Job.findAll(searchFilter);
    expect(jobs).toEqual([
        {
            id: testJobIds[3],
            title: "j4",
            salary: 40000,
            equity: "0.4",
            companyHandle: "c4",
        },
    ]);
  });


});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let job = await Job.get(testJobIds[0]);
    expect(job).toEqual({
        id: testJobIds[0],
        title: "j1",
        salary: 10000,
        equity: "0",
        companyHandle: "c1",
    });
  });

  test("not found if no such job", async function () {
    try {
      await Job.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    title: "New",
    salary: 50000,
    equity: "0.5",
  };

  test("works", async function () {
    let job = await Job.update(testJobIds[0], updateData);
    expect(job).toEqual({
      id: testJobIds[0],
      ...updateData,
      companyHandle: "c1",
    });
  });

  test("works: null fields", async function () {
    const updateDataSetNulls = {
        title: "New",
        salary: null,
        equity: null,
    };

    let job = await Job.update(testJobIds[0], updateDataSetNulls);
    expect(job).toEqual({
      id: testJobIds[0],
      ...updateDataSetNulls,
      companyHandle: "c1",
    });
  });

  test("not found if no such job", async function () {
    try {
      await Job.update(0, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Job.update(testJobIds[0], {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Job.remove(testJobIds[0]);
    const res = await db.query(
        "SELECT id FROM jobs WHERE id=$1", [testJobIds[0]]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such company", async function () {
    try {
      await Job.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
