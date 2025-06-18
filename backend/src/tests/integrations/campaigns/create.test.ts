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
        isRunning: true
      });
    expect(res.status).toEqual(httpStatus.CREATED);
    expect(
      omit(res.body, ["createdAt", "updatedAt", "id"])
    ).toMatchObject({
        title: "Autumn special 2025",
        landingPageUrl: "https://summer.com/festive2025",
        isRunning: true
    });
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
