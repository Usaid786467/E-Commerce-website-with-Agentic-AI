import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { nanoid } from 'nanoid'

const SALT_ROUNDS = 12

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Generate a verification token
 */
export function generateVerificationToken(): string {
  return nanoid(32)
}

/**
 * Create a new user with email and password
 */
export async function createUser(data: {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}) {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (existingUser) {
    throw new Error('User with this email already exists')
  }

  if (data.phone) {
    const existingPhone = await prisma.user.findUnique({
      where: { phone: data.phone },
    })

    if (existingPhone) {
      throw new Error('User with this phone number already exists')
    }
  }

  const passwordHash = await hashPassword(data.password)

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      provider: 'email',
    },
  })

  // Create verification token
  const token = generateVerificationToken()
  const expires = new Date()
  expires.setHours(expires.getHours() + 24) // 24 hours expiry

  await prisma.verificationToken.create({
    data: {
      identifier: user.email,
      token,
      expires,
    },
  })

  // Create audit log
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: 'create',
      entityType: 'user',
      entityId: user.id,
      newValues: {
        email: user.email,
        provider: 'email',
      },
    },
  })

  return { user, verificationToken: token }
}

/**
 * Verify email address
 */
export async function verifyEmail(token: string): Promise<boolean> {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  })

  if (!verificationToken) {
    return false
  }

  if (verificationToken.expires < new Date()) {
    await prisma.verificationToken.delete({
      where: { token },
    })
    return false
  }

  await prisma.user.update({
    where: { email: verificationToken.identifier },
    data: { emailVerified: new Date() },
  })

  await prisma.verificationToken.delete({
    where: { token },
  })

  return true
}

/**
 * Send password reset token
 */
export async function createPasswordResetToken(
  email: string
): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return null
  }

  const token = generateVerificationToken()
  const expires = new Date()
  expires.setHours(expires.getHours() + 1) // 1 hour expiry

  await prisma.verificationToken.create({
    data: {
      identifier: `reset:${email}`,
      token,
      expires,
    },
  })

  return token
}

/**
 * Reset password
 */
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<boolean> {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  })

  if (!verificationToken) {
    return false
  }

  if (verificationToken.expires < new Date()) {
    await prisma.verificationToken.delete({
      where: { token },
    })
    return false
  }

  const email = verificationToken.identifier.replace('reset:', '')
  const passwordHash = await hashPassword(newPassword)

  await prisma.user.update({
    where: { email },
    data: { passwordHash },
  })

  await prisma.verificationToken.delete({
    where: { token },
  })

  return true
}

/**
 * Check if user has required role
 */
export function hasRole(userRole: string, requiredRole: string): boolean {
  const roles = ['customer', 'support', 'manager', 'admin', 'super_admin']
  const userRoleIndex = roles.indexOf(userRole)
  const requiredRoleIndex = roles.indexOf(requiredRole)

  if (userRoleIndex === -1 || requiredRoleIndex === -1) {
    return false
  }

  return userRoleIndex >= requiredRoleIndex
}
