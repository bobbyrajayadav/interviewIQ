import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from './redux/userSlice'
import InterviewPage from './pages/InterviewPage'
import InterviewReport from './pages/InterviewReport'
import InterviewHistory from './pages/InterviewHistory'
import Pricing from './pages/Pricing'

export const ServerUrl = "https://interviewiq-bqre.onrender.com"

function App() {

  const dispatch = useDispatch()
  
  useEffect(() =>{
    const getUser = async () => {
      try {
        const result = await axios.get(ServerUrl + "/api/user/current-user",
          {withCredentials:true})
          dispatch(setUserData(result.data))
      } catch (error) {
        if (error.response && [400, 404, 500].includes(error.response.status)) {
            console.log("User not logged in.", error.response.data.message)
        } else {
            console.error("Error fetching user:", error)
        }
        dispatch(setUserData(null))
      }
    }
    getUser()
  },[dispatch])
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/interview" element={<InterviewPage/>} />
      <Route path="/history" element={<InterviewHistory/>} />
      <Route path="/pricing" element={<Pricing/>} />
      <Route path="/report/:id" element={<InterviewReport/>} />
    </Routes>
  )
}

export default App
