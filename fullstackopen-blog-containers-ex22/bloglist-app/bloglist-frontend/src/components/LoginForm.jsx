import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TextField,
  Button,
  Box,
  Typography
} from '@mui/material'


const LoginForm = ({ login }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const handleLogin = async event => {
    event.preventDefault()

    const success = await login(
      username,
      password
    )

    if (success) {
      navigate('/')
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400
      }}
    >
      <Typography variant="h5">
        Log in to application
      </Typography>

      <TextField
        label="Username"
        value={username}
        onChange={({ target }) => setUsername(target.value)}
      />

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={({ target }) => setPassword(target.value)}
      />

      <Button
        type="submit"
        variant="contained"
      >
        Login
      </Button>
    </Box>
  )

}

export default LoginForm
