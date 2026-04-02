import React, { useState } from 'react'
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { motion } from "motion/react"
import axios from "axios"
import { ServerUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function Pricing() {

  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState("Free");
  const [loadingPlan, setLoadingPlan] = useState(null)
  const dispatch = useDispatch()
  
  
  const plans = [
    {
      id: "Free",
      name: "Free",
      price: "₹0",
      credits: 100,
      description: "Perfect for begginers starting interview preparation",
      features: [
        "100 AI Interview Credits",
        "Basic Performance Reports",
        "Voice Interview Access",
        "Limited History Tracking"
      ],
      default:true,
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: "₹100",
      credits: 150,
      description: "Great for focused practice and skills improvement.",
      features: [
        "150 AI Interview Credits",
        "Detailed Feedback",
        "Performance Analytics",
        "Full Interview History"
      ],
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "₹500",
      credits: 650,
      description: "Best for serious job preparation.",
      features: [
        "650 AI Interview Credits",
        "Advanced AI Analytics",
        "Skilled Trend Analysis",
        "Priority AI Processing"
      ],
      badge:"Best Value",
    }
  ]

  const handlePayment = async (plan) => {
    
    try {
      setLoadingPlan(plan.id)

      const amount = 
      plan.id == "basic" ? 100 : 
      plan.id == "pro" ? 500 : 0 ; 

      const result = await axios.post(ServerUrl + "/api/payment/order", {
        planId: plan.id,
        amount: amount,
        credits: plan.credits
      },{withCredentials: true})

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.data.amount,
        currency: "INR",
        name: "InterviewIQ.AI",
        description: `${plan.name} - ${plan.credits} credits`,
        order_id: result.data.id,
        
        handler:async function(response){
          const verifyPay = await axios.post(ServerUrl + "/api/payment/verify", response,{withCredentials: true})
          dispatch(setUserData(verifyPay.data.user))

          alert("Payment Successful Credits Added! ")
          navigate("/")
        },
        theme:{
          color: "#10b981",
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

      setLoadingPlan(null)
      // handler: async function (response){
        //   const verifyPay = await axios.post(ServerUrl + "/api/payment/verify")
        // }
        
      } catch (error) {
        console.log(error)
        setLoadingPlan(null)
    }

  }
  
  return (
    <div className='min-h-screen bg-gradient-to-br from bg-gray-50 to-emerald-50 py-16 px-6'>
      <div className='max-w-6xl mx-auto mb-14 flex items-start gap-4'>

        <button
        onClick={()=>{navigate("/")}}
         className='mt-2 p-3 rounded-full bg-white shadow hover:shadow-md transition cursor-pointer'>
          <FaArrowLeft className='text-gray-600'/>
        </button>

        <div className='text-center w-full'>
          <h1 className='text-4xl font-bold text-gray-800'>Choose Your Plan</h1>
          <p className='text-gray-500 text-lg mt-3'>Flexible pricing to match your interview preparation goals.</p>
        </div>
        
      </div>

      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto'>

        {plans.map((plan)=>{
          const isSelected = selectedPlan === plan.id;
          
          return (
          <motion.div 
          key={plan.id}
          whileHover={!plan.default && {scale:1.03}}
          onClick={()=>!plan.default && setSelectedPlan(plan.id)}
          className={`relative rounded-3xl p-8 transition-all duration-300 
          border
          ${
            isSelected
            ? "border-emerald-600 bg-white shadow-2xl"
            : "border-gray-200 bg-white shadow-md"
          } 
          ${plan.default ? "cursor-default" : "cursor-pointer"}
          `}
          >

            {/* badge */}
            {plan.badge && (
              <div className='absolute top-6 right-6 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow'>
                {plan.badge}
              </div>
            )}

            {/* default tag */}
            {plan.default && (
              <div className='absolute top-6 right-6 bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow'>
                Default
              </div>
            )}

            {/* plan name */}
            <h3 className='text-xl font-semibold text-emerald-600 '>{plan.price}</h3>

            {/* price */}
            <div className='mt-4'>
              <span className='text-4xl font-bold text-gray-800'>{plan.credits}</span>
              <span><p className='text-gray-500 mt-1'>credits</p></span>
            </div>

            {/* description */}
            <p className='text-gray-600 mt-4 text-sm leading-relaxed'>{plan.description}</p>

            {/* features */}
            <div className='mt-6 space-y-3 text-left'>
              {plan.features.map((feature, index)=>(
                <div key={index} className='flex items-center gap-3'>
                    <FaCheckCircle className='text-emerald-500 text-sm'/>
                  <span className='text-gray-700 text-sm'>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {!plan.default && (
              <button 
              disabled={loadingPlan === plan.id}
              onClick={(e)=>{
                if(!isSelected){
                  setSelectedPlan(plan.id)
                }else{
                  handlePayment(plan)
                }
              }} className={`mt-8 w-full py-3 rounded-xl font-semibold transition-all 
              ${isSelected 
                ? "bg-emerald-600 text-white hover:opacity-90" 
                : "bg-gray-100 text-gray-700 hover:bg-emerald-100 "}
              `}>
                {loadingPlan === plan.id 
                ? "Processing...." 
                : isSelected ? "Proceed to Pay" 
                : "Select Plan"}
              </button>
            )}
            
          </motion.div>)
        })}
      </div>
        
    </div>
  )
}

export default Pricing