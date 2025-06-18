import httpStatus from "http-status";
import setupTestDB from "../../utils/setupTestDb";
import { describe, test, expect } from "@jest/globals";
import { server } from "../init";
import { omit } from "lodash";
import prisma from "../../../config/prisma";

setupTestDB();

describe("PATCH /v1/campaigns/{campaignId}", () => {
  test("should update campaign", async () => {


    const campaign = await prisma.campaign.create({
      data: {
        title: "Autumn special 2025",
        landingPageUrl: "https://summer.com/festive2025",
        isRunning: true
      },
    });

    const res = await server
      .patch(`/v1/campaigns/${campaign.id}`)
      .send({ isRunning: false });
    expect(res.status).toEqual(httpStatus.OK);
    expect(
      omit(res.body, ["createdAt", "updatedAt", "id"])
    ).toMatchObject({
        title: "Autumn special 2025",
        landingPageUrl: "https://summer.com/festive2025",
        isRunning: false
    });
  });

});
