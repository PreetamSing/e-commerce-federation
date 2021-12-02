import axios from 'axios'

const Context = async ({ req }) => {
  const token = req.headers.authorization
  if (!token) {
    return {}
  }

  const authUrl = process.env.AUTH_URL
  const result = await axios.get(authUrl, {
    params: {
      query: '{authorizer { _id, email, mobile, role, isFirstLogin }}',
    },
    headers: {
      authorization: token,
    },
  })
  const user = result.data.data.authorizer
  return { user }
}

export default Context
