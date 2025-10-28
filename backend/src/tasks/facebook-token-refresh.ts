import prisma from '../config/prisma';
import logger from '../config/logger';
import socialMediaService from '../services/socialMedia.service';
import mailService from '../services/mail.service';

/**
 * Refresh Facebook tokens for all active Facebook social media accounts
 * This runs daily to ensure tokens don't expire
 */
export const refreshFacebookTokens = async (): Promise<void> => {
  try {
    logger.info('Starting Facebook token refresh task');

    // Get all active Facebook social media accounts that need token refresh
    const facebookAccounts = await prisma.socialMedia.findMany({
      where: {
        platform: 'facebook',
        status: 'active',
        OR: [
          { tokenExpiry: null },
          { tokenExpiry: { lt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } }, // Expires within 7 days
        ],
      },
      include: {
        team: {
          include: {
            user: true,
          },
        },
      },
    });

    logger.info(`Found ${facebookAccounts.length} Facebook accounts to check`);

    let successCount = 0;
    let failureCount = 0;
    const failedAccounts: string[] = [];

    for (const account of facebookAccounts) {
      try {
        // Check if token is still valid
        const isValid = await socialMediaService.refreshFacebookTokens(account.id);
        if (isValid) {
          successCount++;
          logger.info(`Successfully refreshed tokens for Facebook account: ${account.accountName}`);
        }
      } catch (error) {
        failureCount++;
        failedAccounts.push(account.accountName);
        logger.error(`Failed to refresh tokens for Facebook account ${account.accountName}:`, error);

        // Mark account as inactive
        await prisma.socialMedia.update({
          where: { id: account.id },
          data: { status: 'inactive' },
        });

        // Notify user about token expiration
        if (account.team.user?.email) {
          try {
            await mailService.sendFacebookTokenExpiredEmail({
              name: account.team.user.name || 'User',
              email: account.team.user.email,
              accountName: account.accountName,
            });
          } catch (emailError) {
            logger.error('Failed to send token expiration email:', emailError);
          }
        }
      }
    }

    logger.info(`Facebook token refresh completed: ${successCount} successful, ${failureCount} failed`);

    if (failedAccounts.length > 0) {
      logger.warn(`Failed accounts: ${failedAccounts.join(', ')}`);
    }

  } catch (error) {
    logger.error('Error in Facebook token refresh task:', error);
    throw error;
  }
};