import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Role } from '@prisma/client';
import { prisma } from '../../config/db';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { AppError } from '../../utils/AppError';

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function getRefreshExpiry() {
  const days = 7;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

export async function register(email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError('Email already registered', 409);

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash, role: Role.USER },
    select: { id: true, email: true, role: true },
  });

  const payload = { userId: user.id, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(refreshToken),
      userId: user.id,
      expiresAt: getRefreshExpiry(),
    },
  });

  return { accessToken, refreshToken, user };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError('Invalid credentials', 401);

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new AppError('Invalid credentials', 401);

  const payload = { userId: user.id, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(refreshToken),
      userId: user.id,
      expiresAt: getRefreshExpiry(),
    },
  });

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, role: user.role },
  };
}

export async function refresh(refreshToken: string) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError('Invalid refresh token', 401);
  }

  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash: hashToken(refreshToken) },
  });

  if (!stored || stored.expiresAt < new Date()) {
    throw new AppError('Refresh token expired', 401);
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) throw new AppError('User not found', 401);

  await prisma.refreshToken.delete({ where: { id: stored.id } });

  const newPayload = { userId: user.id, role: user.role };
  const accessToken = signAccessToken(newPayload);
  const newRefreshToken = signRefreshToken(newPayload);

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(newRefreshToken),
      userId: user.id,
      expiresAt: getRefreshExpiry(),
    },
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
    user: { id: user.id, email: user.email, role: user.role },
  };
}

export async function logout(refreshToken: string) {
  await prisma.refreshToken.deleteMany({
    where: { tokenHash: hashToken(refreshToken) },
  });
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true },
  });
  if (!user) throw new AppError('User not found', 404);
  return user;
}
