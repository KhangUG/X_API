import { RouterProvider } from 'react-router-dom'
import './App.css'
import routes from './router'
import { useEffect } from 'react'

import axios from 'axios'

function App() {
  useEffect(() => {
    const controller = new AbortController()
    axios
      .get('/users/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        },
        baseURL: import.meta.env.VITE_API_URL,
        signal: controller.signal
      })
      .then((res) => {
        localStorage.setItem('profile', JSON.stringify(res.data.result))
      })
    return () => {
      controller.abort()
    }
  }, [])
  return <RouterProvider router={routes} />
}

export default App
