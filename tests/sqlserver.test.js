const config = require("config");
const sql = require("mssql");

describe("Sql Server Related test", () => {
  let connstr;
  let db;
  const sqlConnStr =
    "server=MYPC3;database=StockData;user id=sa;password=saREKETE2018;Driver=msnodesqlv8;";
  beforeAll(async () => {
    connstr = config.get("Shipping.SqlServer.connstr");
    const sqlConfig = config.get("Shipping.SqlServer");
    db = await sql.connect(sqlConfig);
  });
  it("should load connection string correctly", () => {
    //const connstr = config.get("Shipping.SqlServer.connstr");
    expect(connstr).toBe(sqlConnStr);
  });
  it("should load records correctly", async () => {
    const result = await db
      .request()
      .input("input_parameter", sql.Int, 1)
      .query(
        "select * from FINREPORT_ITEMS " +
          " WHERE REPORT_ID= @input_parameter " +
          " ORDER BY PARENT_ITEM_ID, ITEM_SEQ, ITEM_ID"
      );
    expect(result.recordsets).not.toBe(null);
    expect(result.recordsets[0].length).toBeGreaterThan(0);
    expect(result.rowsAffected[0]).toBe(result.recordsets[0].length);
  });
  afterAll(async () => {
    await db.close();
  });
});
