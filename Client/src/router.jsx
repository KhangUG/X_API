import { createBrowserRouter } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Chat from './chat'
import VerifyEmail from './VerifyEmail'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login/oauth',
    element: <Login />
  },
  {
    path: '/chat',
    element: <Chat />
  },
  {
    path: '/email-verifications',
    element: <VerifyEmail />
  }
])

export default router