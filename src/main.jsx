import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Signup from './Signup.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Signup />
  </StrictMode>,
)
