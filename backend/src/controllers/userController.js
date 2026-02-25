export const getUserProfile = async (req, res) => {
  console.log('Call: userController.js -> getUserProfile()')
  const user = req.user
  try {
    return res.status(200).json({ user })
  } catch (error) {
    console.error('Error during authentication: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
