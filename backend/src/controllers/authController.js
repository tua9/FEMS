import { StatusCodes } from 'http-status-codes'
import ms from 'ms'
import { authService } from '../services/authService.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

export const signUp = asyncHandler(async (req, res) => {
  console.log('sign up') // Sign up
  const result = await authService.signUp(req.body)
  res.status(StatusCodes.CREATED).json(result)
})

export const signOut = asyncHandler(async (req, res) => {
  console.log('Call: ⛳authController.js -> signOut()')
  const refreshToken = req.cookies?.refreshToken
  await authService.signOut(refreshToken)

  res.clearCookie('refreshToken')
  res.clearCookie('accessToken')
  res.status(StatusCodes.OK).json({ message: 'Sign out successful' })
})

export const signIn = asyncHandler(async (req, res) => {
  const result = await authService.signIn(req.body)
  const { userInfo, accessToken, refreshToken, displayName } = result.data

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ms('14 days'),
  })

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ms('14 days'),
  })

  res.status(StatusCodes.OK).json({
    message: `Sign in successful: User[${displayName}]`,
    ...result // Wrap data as status: success
  })
})

export const refreshToken = asyncHandler(async (req, res) => {
  console.log('>> Refresh Token called')
  const refreshToken = req.cookies?.refreshToken
  const { accessToken } = await authService.refreshToken(refreshToken)

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ms('14 days'),
  })

  res.status(StatusCodes.OK).json({
    accessToken,
  })
})

export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body)
  res.status(StatusCodes.OK).json(result)
})

export const verifyResetToken = asyncHandler(async (req, res) => {
  const result = await authService.verifyResetToken(req.body)
  res.status(StatusCodes.OK).json(result)
})

export const resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword(req.body)
  res.status(StatusCodes.OK).json(result)
})

export const changePassword = asyncHandler(async (req, res) => {
  const result = await authService.changePassword(req.user._id, req.body)
  res.status(StatusCodes.OK).json(result)
})

export const googleSignIn = asyncHandler(async (req, res) => {
  const result = await authService.signInWithGoogle(req.body)
  const { userInfo, accessToken, refreshToken, displayName } = result.data

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ms('14 days'),
  })

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ms('14 days'),
  })

  res.status(StatusCodes.OK).json({
    message: `Sign in successful: User[${displayName}]`,
    ...result
  })
})
