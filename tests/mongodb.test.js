const config = require("config");

describe("MongoDB related test", () => {
  let connstr;
  const mongoConnStr =
    "mongodb://localhost:27017/?readPreference=primary&ssl=false";
  beforeAll(() => {
    connstr = config.get("Shipping.MongoDB.connstr");
  });
  it("should load connect string correctly", () => {
    //const connstr = config.get("Shipping.MongoDB.connstr");
    expect(connstr).toBe(mongoConnStr);
  });
});
