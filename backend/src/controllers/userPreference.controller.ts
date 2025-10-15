import httpStatus from 'http-status';
import asyncHandler from 'express-async-handler';
import {
  getUserPreference,
  createUserPreference,
  updateUserPreference,
  updateTopics,
  deleteUserPreference,
} from '../services/userPreference.service';
import { auth } from '../config/auth';

export const getUserPreferenceController = asyncHandler(async (req, res) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    res.status(httpStatus.UNAUTHORIZED).json({ message: 'User not authenticated' });
    return;
  }

  const preference = await getUserPreference(session.user.id);

  if (!preference) {
    res.status(httpStatus.NOT_FOUND).json({ message: 'User preferences not found' });
    return;
  }

  res.status(httpStatus.OK).json({
    preference,
  });
});

export const createUserPreferenceController = asyncHandler(async (req, res) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    res.status(httpStatus.UNAUTHORIZED).json({ message: 'User not authenticated' });
    return;
  }

  const preference = await createUserPreference(session.user.id, req.body);

  res.status(httpStatus.CREATED).json({
    preference,
  });
});

export const updateUserPreferenceController = asyncHandler(async (req, res) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    res.status(httpStatus.UNAUTHORIZED).json({ message: 'User not authenticated' });
    return;
  }

  const preference = await updateUserPreference(session.user.id, req.body);

  res.status(httpStatus.OK).json({
    preference,
  });
});

export const updateTopicsController = asyncHandler(async (req, res) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    res.status(httpStatus.UNAUTHORIZED).json({ message: 'User not authenticated' });
    return;
  }

  const preference = await updateTopics(session.user.id, req.body);

  res.status(httpStatus.OK).json({
    preference,
  });
});

export const deleteUserPreferenceController = asyncHandler(async (req, res) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    res.status(httpStatus.UNAUTHORIZED).json({ message: 'User not authenticated' });
    return;
  }

  await deleteUserPreference(session.user.id);

  res.status(httpStatus.OK).json({
    message: 'User preferences deleted successfully',
  });
});