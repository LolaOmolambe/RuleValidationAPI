const request = require("supertest");
const app = require("../app");

describe("Validation Endpoints", () => {
  it("should return author information", async () => {
    const res = await request(app).get("/");
    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual("success");
    expect(res.body).toHaveProperty("data");
  });

  it("should fail without the rule object key in payload", async () => {
    const res = await request(app).post("/validate-rule").send({
      data: "AnyData",
    });
    expect(res.status).toEqual(400);
    expect(res.body.status).toEqual("error");
    expect(res.body.message).toEqual("rule is required.");
    expect(res.body.data).toEqual(null);
  });

  it("should fail without the data key in payload", async () => {
    const res = await request(app)
      .post("/validate-rule")
      .send({
        rule: {
          field: "missions",
          condition: "eq",
          condition_value: 30,
        },
      });
    expect(res.status).toEqual(400);
    expect(res.body.status).toEqual("error");
    expect(res.body.message).toEqual("data is required.");
    expect(res.body.data).toEqual(null);
  });

  it("should fail without the rule field key in payload", async () => {
    const res = await request(app)
      .post("/validate-rule")
      .send({
        rule: {
          condition: "eq",
          condition_value: "a",
        },
      });
    expect(res.status).toEqual(400);
    expect(res.body.status).toEqual("error");
    expect(res.body.message).toEqual("field is required.");
    expect(res.body.data).toEqual(null);
  });

  it("should fail without the rule condition key in payload", async () => {
    const res = await request(app)
      .post("/validate-rule")
      .send({
        rule: {
          field: "missions",
          condition_value: 45,
        },
        data: {
          name: "James Holden",
          crew: "Rocinante",
          age: 34,
          position: "Captain",
          missions: 30,
        },
      });
    expect(res.status).toEqual(400);
    expect(res.body.status).toEqual("error");
    expect(res.body.message).toEqual("condition is required.");
    expect(res.body.data).toEqual(null);
  });

  it("should fail without the rule condition_value key in payload", async () => {
    const res = await request(app)
      .post("/validate-rule")
      .send({
        rule: {
          field: "missions",
          condition: "neq",
        },
        data: {
          name: "James Holden",
          crew: "Rocinante",
          age: 34,
          position: "Captain",
          missions: 45,
        },
      });
    expect(res.status).toEqual(400);
    expect(res.body.status).toEqual("error");
    expect(res.body.message).toEqual("condition_value is required.");
    expect(res.body.data).toEqual(null);
  });

  it("should fail with an invalid data field type in payload", async () => {
    const res = await request(app)
      .post("/validate-rule")
      .send({
        rule: {
          field: "missions",
          condition: "neq",
          condition_value: 30,
        },
        data: 20,
      });
    expect(res.status).toEqual(400);
    expect(res.body.status).toEqual("error");
    //expect(res.body.message).toEqual("data should be a string,array,object.");
    expect(res.body.message).toEqual("Invalid JSON payload passed.");
    expect(res.body.data).toEqual(null);
  });

  it("should fail using an invalid rule type in payload", async () => {
    const res = await request(app).post("/validate-rule").send({
      rule: 4,
      data: 20,
    });
    expect(res.status).toEqual(400);
    expect(res.body.status).toEqual("error");
    expect(res.body.message).toEqual("rule should be an object.");
    expect(res.body.data).toEqual(null);
  });

  it("should fail using an unaccepted rule condition value in payload", async () => {
    const res = await request(app)
      .post("/validate-rule")
      .send({
        rule: {
          field: "missions.count",
          condition: "ne",
          condition_value: 30,
        },
        data: {
          name: "James Holden",
          crew: "Rocinante",
          age: 34,
          position: "Captain",
          missions: {
            count: 45,
            successful: 44,
            failed: 1,
          },
        },
      });
    expect(res.status).toEqual(400);
    expect(res.body.status).toEqual("error");
    expect(res.body.message).toEqual("Invalid JSON payload passed.");
    expect(res.body.data).toEqual(null);
  });

  it("should fail using a rule field value with nesting of more than two levels", async () => {
    const res = await request(app)
      .post("/validate-rule")
      .send({
        rule: {
          field: "missions.count.age",
          condition: "ne",
          condition_value: 30,
        },
        data: {
          name: "James Holden",
          crew: "Rocinante",
          age: 34,
          position: "Captain",
          missions: {
            count: {
              age: 45,
            },
            successful: 44,
            failed: 1,
          },
        },
      });
    expect(res.status).toEqual(400);
    expect(res.body.status).toEqual("error");
    expect(res.body.message).toEqual("Invalid JSON payload passed.");
    expect(res.body.data).toEqual(null);
  });

  it("should fail if the field specified in the rule object is missing from the data field in the payload", async () => {
    const res = await request(app)
      .post("/validate-rule")
      .send({
        rule: {
          field: "missions.count",
          condition: "neq",
          condition_value: 30,
        },
        data: {
          name: "James Holden",
          crew: "Rocinante",
          age: 34,
          position: "Captain",
          missions: {
            successful: 44,
            failed: 1,
          },
        },
      });
    expect(res.status).toEqual(400);
    expect(res.body.status).toEqual("error");
    expect(res.body.message).toEqual(
      "field missions.count is missing from data."
    );
    expect(res.body.data).toEqual(null);
  });

  it("should validate successfully", async () => {
    const res = await request(app)
      .post("/validate-rule")
      .send({
        rule: {
          field: "missions.count",
          condition: "neq",
          condition_value: 30,
        },
        data: {
          name: "James Holden",
          crew: "Rocinante",
          age: 34,
          position: "Captain",
          missions: {
            count: 43,
            successful: 44,
            failed: 1,
          },
        },
      });
    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.message).toEqual(
      "field missions.count successfully validated."
    );
    expect(res.body.data).toHaveProperty("validation");
    expect(res.body.data.validation.error).toEqual(false);
  });

  it("should fail rule validation", async () => {
    const res = await request(app)
      .post("/validate-rule")
      .send({
        rule: {
          field: "missions.count",
          condition: "eq",
          condition_value: 30,
        },
        data: {
          name: "James Holden",
          crew: "Rocinante",
          age: 34,
          position: "Captain",
          missions: {
            count: 43,
            successful: 44,
            failed: 1,
          },
        },
      });
    expect(res.status).toEqual(400);
    expect(res.body.status).toEqual("error");
    expect(res.body.message).toEqual("field missions.count failed validation.");
    expect(res.body.data).toHaveProperty("validation");
    expect(res.body.data.validation.error).toEqual(true);
  });
});
