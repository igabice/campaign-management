import prisma from "../config/prisma";
import mailService from "./mail.service";
import telegramService from "./telegram.service";
import whatsappService from "./whatsapp.service";

class NotificationService {
  // Send approval request notifications
  async sendPostApprovalRequest(
    postId: string,
    approverId: string
  ): Promise<void> {
    try {
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
          creator: { select: { id: true, name: true, email: true } },
          team: { select: { id: true, title: true } },
          approver: { select: { id: true, name: true, email: true } },
        },
      });

      if (!post || !post.approver) return;

      // Send email notification
      await mailService.sendPostApprovalRequestEmail(post, post.approver);

      // Send Telegram notification if enabled
      const approverPrefs = await prisma.userPreference.findUnique({
        where: { userId: approverId },
        select: {
          telegramEnabled: true,
          telegramChatId: true,
          whatsappEnabled: true,
          whatsappNumber: true,
        },
      });
      const message = `📝 New post approval request\n\nTeam: ${post.team.title}\nPost: ${post.title || "Untitled Post"}\nCreated by: ${post.creator.name || post.creator.email}\n\nPlease review and approve/reject the post.`;

      if (approverPrefs?.telegramEnabled && approverPrefs.telegramChatId) {
        await telegramService.sendMessage(
          approverPrefs.telegramChatId,
          message
        );
      }
      if (approverPrefs?.whatsappEnabled && approverPrefs.whatsappNumber) {
        await whatsappService.sendTemplateMessage(
          approverPrefs.whatsappNumber,
          message
        );
      }

      // Create in-app notification
      await prisma.notification.create({
        data: {
          userId: approverId,
          objectId: postId,
          objectType: "post",
          description: `New post approval request: "${post.title || "Untitled Post"}" from ${post.creator.name || post.creator.email}`,
        },
      });
    } catch (error) {
      console.error(
        "Failed to send post approval request notifications:",
        error
      );
    }
  }

  async sendPlanApprovalRequest(
    planId: string,
    approverId: string
  ): Promise<void> {
    try {
      const plan = await prisma.plan.findUnique({
        where: { id: planId },
        include: {
          creator: { select: { id: true, name: true, email: true } },
          team: { select: { id: true, title: true } },
          approver: { select: { id: true, name: true, email: true } },
        },
      });

      if (!plan || !plan.approver) return;

      // Send email notification
      await mailService.sendPlanApprovalRequestEmail(plan, plan.approver);

      // Send Telegram notification if enabled
      const approverPrefs = await prisma.userPreference.findUnique({
        where: { userId: approverId },
        select: {
          telegramEnabled: true,
          telegramChatId: true,
          whatsappNumber: true,
          whatsappEnabled: true,
        },
      });
      const message = `📋 New content plan approval request\n\nTeam: ${plan.team.title}\nPlan: ${plan.title}\nCreated by: ${plan.creator.name || plan.creator.email}\n\nPlease review and approve/reject the plan.`;
      if (approverPrefs?.telegramEnabled && approverPrefs.telegramChatId) {
        await telegramService.sendMessage(
          approverPrefs.telegramChatId,
          message
        );
      }

      if (approverPrefs?.whatsappEnabled && approverPrefs.whatsappNumber) {
        await whatsappService.sendTemplateMessage(
          approverPrefs.whatsappNumber,
          message
        );
      }

      // Create in-app notification
      await prisma.notification.create({
        data: {
          userId: approverId,
          objectId: planId,
          objectType: "plan",
          description: `New content plan approval request: "${plan.title}" from ${plan.creator.name || plan.creator.email}`,
        },
      });
    } catch (error) {
      console.error(
        "Failed to send plan approval request notifications:",
        error
      );
    }
  }

  // Send approval result notifications
  async sendPostApprovalResult(
    postId: string,
    creatorId: string
  ): Promise<void> {
    try {
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
          creator: { select: { id: true, name: true, email: true } },
          approver: { select: { id: true, name: true } },
        },
      });

      if (!post) return;

      // Send email notification
      await mailService.sendPostApprovalResultEmail(post, post.creator);

      // Send Telegram notification if enabled
      const creatorPrefs = await prisma.userPreference.findUnique({
        where: { userId: creatorId },
        select: {
          telegramEnabled: true,
          telegramChatId: true,
          whatsappEnabled: true,
          whatsappNumber: true,
        },
      });
      const status =
        post.approvalStatus === "approved" ? "✅ Approved" : "❌ Rejected";
      const message = `📝 Post ${status}\n\nPost: ${post.title || "Untitled Post"}\nStatus: ${status}\nApproved by: ${post.approver?.name || "Approver"}${post.approvalNotes ? `\n\nNotes: ${post.approvalNotes}` : ""}`;

      if (creatorPrefs?.telegramEnabled && creatorPrefs.telegramChatId) {
        await telegramService.sendMessage(creatorPrefs.telegramChatId, message);
      }

      if (creatorPrefs?.whatsappEnabled && creatorPrefs.whatsappNumber) {
        await whatsappService.sendTemplateMessage(
          creatorPrefs.whatsappNumber,
          message
        );
      }

      // Create in-app notification
      await prisma.notification.create({
        data: {
          userId: creatorId,
          objectId: postId,
          objectType: "post",
          description: `Your post "${post.title || "Untitled Post"}" has been ${post.approvalStatus} by ${post.approver?.name || "the approver"}`,
        },
      });
    } catch (error) {
      console.error(
        "Failed to send post approval result notifications:",
        error
      );
    }
  }

  async sendPlanApprovalResult(
    planId: string,
    creatorId: string
  ): Promise<void> {
    try {
      const plan = await prisma.plan.findUnique({
        where: { id: planId },
        include: {
          creator: { select: { id: true, name: true, email: true } },
          approver: { select: { id: true, name: true } },
        },
      });

      if (!plan) return;

      // Send email notification
      await mailService.sendPlanApprovalResultEmail(plan, plan.creator);

      // Send Telegram notification if enabled
      const creatorPrefs = await prisma.userPreference.findUnique({
        where: { userId: creatorId },
        select: {
          telegramEnabled: true,
          telegramChatId: true,
          whatsappEnabled: true,
          whatsappNumber: true,
        },
      });
      const status =
        plan.approvalStatus === "approved" ? "✅ Approved" : "❌ Rejected";
      const message = `📋 Content Plan ${status}\n\nPlan: ${plan.title}\nStatus: ${status}\nApproved by: ${plan.approver?.name || "Approver"}${plan.approvalNotes ? `\n\nNotes: ${plan.approvalNotes}` : ""}`;

      if (creatorPrefs?.telegramEnabled && creatorPrefs.telegramChatId) {
        await telegramService.sendMessage(creatorPrefs.telegramChatId, message);
      }

      if (creatorPrefs?.whatsappEnabled && creatorPrefs.whatsappNumber) {
        await whatsappService.sendTemplateMessage(
          creatorPrefs.whatsappNumber,
          message
        );
      }

      // Create in-app notification
      await prisma.notification.create({
        data: {
          userId: creatorId,
          objectId: planId,
          objectType: "plan",
          description: `Your content plan "${plan.title}" has been ${plan.approvalStatus} by ${plan.approver?.name || "the approver"}`,
        },
      });
    } catch (error) {
      console.error(
        "Failed to send plan approval result notifications:",
        error
      );
    }
  }
}

const notificationService = new NotificationService();
export default notificationService;
