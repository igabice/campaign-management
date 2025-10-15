import prisma from '../config/prisma';
import { CreateUserPreferenceInput, UpdateUserPreferenceInput, UpdateTopicsInput } from '../validations/userPreference.validation';

export const getUserPreference = async (userId: string) => {
  return prisma.userPreference.findUnique({
    where: { userId },
    include: {
      topics: true,
    },
  });
};

export const createUserPreference = async (userId: string, data: CreateUserPreferenceInput) => {
  const { topics, ...preferenceData } = data;

  return prisma.userPreference.upsert({
    where: { userId },
    update: {
      ...preferenceData,
      topics: topics ? {
        deleteMany: {},
        create: topics.map(topic => ({
          topic: topic.topic,
          weight: topic.weight || 1,
        })),
      } : undefined,
    },
    create: {
      userId,
      ...preferenceData,
      topics: topics ? {
        create: topics.map(topic => ({
          topic: topic.topic,
          weight: topic.weight || 1,
        })),
      } : undefined,
    },
    include: {
      topics: true,
    },
  });
};

export const updateUserPreference = async (userId: string, data: UpdateUserPreferenceInput) => {
  const { topics, ...preferenceData } = data;

  // First update the main preferences
  const updatedPreference = await prisma.userPreference.update({
    where: { userId },
    data: preferenceData,
  });

  // If topics are provided, replace all existing topics
  if (topics !== undefined) {
    // Delete existing topics
    await prisma.topicPreference.deleteMany({
      where: { userPreferenceId: updatedPreference.id },
    });

    // Create new topics
    if (topics.length > 0) {
      await prisma.topicPreference.createMany({
        data: topics.map(topic => ({
          userPreferenceId: updatedPreference.id,
          topic: topic.topic,
          weight: topic.weight || 1,
        })),
      });
    }
  }

  // Return the updated preference with topics
  return prisma.userPreference.findUnique({
    where: { userId },
    include: {
      topics: true,
    },
  });
};

export const updateTopics = async (userId: string, data: UpdateTopicsInput) => {
  const preference = await prisma.userPreference.findUnique({
    where: { userId },
  });

  if (!preference) {
    throw new Error('User preferences not found');
  }

  // Delete existing topics
  await prisma.topicPreference.deleteMany({
    where: { userPreferenceId: preference.id },
  });

  // Create new topics
  if (data.topics.length > 0) {
    await prisma.topicPreference.createMany({
      data: data.topics.map(topic => ({
        userPreferenceId: preference.id,
        topic: topic.topic,
        weight: topic.weight || 1,
      })),
    });
  }

  // Return the updated preference with topics
  return prisma.userPreference.findUnique({
    where: { userId },
    include: {
      topics: true,
    },
  });
};

export const deleteUserPreference = async (userId: string) => {
  return prisma.userPreference.delete({
    where: { userId },
  });
};