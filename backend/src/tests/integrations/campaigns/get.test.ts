import httpStatus from "http-status";
import setupTestDB from "../../utils/setupTestDb";
import { describe, test, expect, beforeEach } from "@jest/globals";
import { server } from "../init";
import { Prisma } from "@prisma/client";
import prisma from "../../../config/prisma";
import { omit } from "lodash";


setupTestDB();

describe("GET /v1/campaigns", () => {
  const testCampaigns = [
    {
        title: "Autumn special",
        landingPageUrl: "https://autumn.com/festive2023",
        isRunning: true
    },
    {
        title: "Summer special",
        landingPageUrl: "https://summer.com/festive2024",
        isRunning: true
    },
    {
        title: "Winter special",
        landingPageUrl: "https://winter.com/festive2025",
        isRunning: false
    }
  ] as Prisma.CampaignCreateManyInput[];

    beforeEach(async () => {
    await prisma.campaign.createMany({
      data: testCampaigns,
    });
  });

  test("should filter campaigns by title", async () => {
    const result = await server.get("/v1/campaigns").query({
      searchTerm: "wint",
    });
    expect(result.status).toEqual(httpStatus.OK);
    expect(result.body.result.length).toEqual(1);
        expect(
          omit(result.body.result[0], ["createdAt", "updatedAt", "id"])
        ).toEqual({
        title: 'Winter special',
        landingPageUrl: 'https://winter.com/festive2025',
          isRunning: false,
        payouts: []
        });
  });

  test("should filter campaigns by landingPageUrl", async () => {
    const result = await server.get("/v1/campaigns").query({
      searchTerm: "2024",
    });
    expect(result.status).toEqual(httpStatus.OK);
    expect(result.body.result.length).toEqual(1);
        expect(
          omit(result.body.result[0], ["createdAt", "updatedAt", "id"])
        ).toEqual({
        title: "Summer special",
        landingPageUrl: "https://summer.com/festive2024",
          isRunning: true,
        payouts: []
        });
  });

  test("should filter campaigns by isRunning", async () => {
    const result = await server.get("/v1/campaigns").query({
      isRunning: true,
    });
    expect(result.status).toEqual(httpStatus.OK);
    expect(result.body.result.length).toEqual(2);
  });

});

describe("GET /v1/campaigns/{campaignId}/payouts", () => { 

    test("should get all payouts for a campaign", async () => {

      const campaign = await prisma.campaign.create({
        data: {
          title: "Autumn special 2025",
          landingPageUrl: "https://summer.com/festive2025",
          isRunning: true,
        },
      });

      await prisma.payout.create({
        data: {
          campaignId: campaign.id,
          country: "Estonia",
          amount: '1.25'
        },
      });

      const res = await server
        .get(`/v1/campaigns/${campaign.id}/payouts`);
      expect(res.status).toEqual(httpStatus.OK);
      expect(
        omit(res.body.result[0], ["createdAt", "updatedAt", "id"])
      ).toMatchObject({
          campaignId: campaign.id,
          country: "Estonia",
          amount: '1.25'
      });
    });
});
