import httpStatus from "http-status";
import setupTestDB from "../../utils/setupTestDb";
import { describe, test, expect } from "@jest/globals";
import { server } from "../init";
import { omit } from "lodash";

setupTestDB();

describe("POST /v1/campaigns", () => {
  
  test("should create campaign", async () => {
    const res = await server
      .post("/v1/campaigns")
      .send({
        title: "Autumn special 2025",
        landingPageUrl: "https://summer.com/festive2025",
        isRunning: true,
        payouts: [{country: 'EE', amount: 2.1 }]
      });
    expect(res.status).toEqual(httpStatus.CREATED);
    expect(
      omit(res.body, ["createdAt", "updatedAt", "id", "payouts"])
    ).toMatchObject({
        title: "Autumn special 2025",
        landingPageUrl: "https://summer.com/festive2025",
      isRunning: true,
    });
        expect(
      omit(res.body.payouts[0], ["createdAt", "updatedAt", "id"])
        ).toMatchObject({
          country: 'EE', amount: "2.1"
    });
  });

    test("should fail if payout is empty", async () => {
    const res = await server
      .post("/v1/campaigns")
      .send({
        title: "Autumn special 2025",
        landingPageUrl: "https://summer.com/festive2025",
        isRunning: true,
        payouts: []
      });
    expect(res.body).toMatchObject({ code: 400, message: '"payouts" must contain at least 1 items' });
  });

  test("should fail if title or landingPageUrl is missing", async () => {
    const res = await server
      .post("/v1/campaigns")
      .send({
        isRunning: true
      });

    expect(res.body).toMatchObject({
      code: 400,
      message: '"title" is required, "landingPageUrl" is required',
    });
  });

});
