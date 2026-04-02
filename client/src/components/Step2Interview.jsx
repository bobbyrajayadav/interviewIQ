import React, { useEffect, useRef, useState } from 'react'
import maleVideo from "../assets/Videos/male-ai.mp4"
import femaleVideo from "../assets/Videos/female-ai.mp4"
import Timer from './Timer'
import { motion } from "motion/react"
import {FaMicrophone, FaMicrophoneSlash} from "react-icons/fa"
import axios from "axios"
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'
import { ServerUrl } from '../App'

function Step2Interview({interviewData, onFinish}) {
  const {interviewId, questions, userName} = interviewData
  const [isIntroPhase, setIsIntroPhase] = useState(true)
  
  const [isMicOn, setIsMicOn] = useState(true)
  const recongnitionRef = useRef(null)
  const [isAIPlaying, setIsAIPlaying] = useState(false)
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState("")
  const [feedback, setFeedback] = useState("")
  const [timeLeft, setTimeLeft] = useState(
    questions[0]?.timeLimit || 60
  )

  const [selectedVoice, setSelectedVoice] = useState(null)
  const [isSubmiting, setIsSubmiting] = useState(false)
  const [voiceGender, setIsVoiceGender] = useState("female")
  const [subtitle, setSubtitle] = useState("")

  const videoRef = useRef(null)

  const voices = speechSynthesis.getVoices()

  const currentQuestion = questions[currentIndex]
  
  useEffect(()=>{
    const loadVoices = () => {
      const voice = window.speechSynthesis.getVoices();
      if(!voice.length) return;

      //try known female voice first 
      const femaleVoice = 
      voice.find(v => 
        v.name.toLocaleLowerCase().includes("zira") ||
        v.name.toLocaleLowerCase().includes("samantha") ||
        v.name.toLocaleLowerCase().includes("female") 
      );

      if(femaleVoice) {
        setSelectedVoice(femaleVoice)
        setIsVoiceGender("female")
        return
      }

      //try known male voice first 
      const maleVoice = 
      voice.find(v => 
        v.name.toLocaleLowerCase().includes("david") ||
        v.name.toLocaleLowerCase().includes("mark") ||
        v.name.toLocaleLowerCase().includes("male") 
      );

      if(maleVoice) {
        setSelectedVoice(maleVoice)
        setIsVoiceGender("male")
        return
      }

      //fallback: first voice(assume female)
      setSelectedVoice(voices[0])
      setIsVoiceGender("female")
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
  },[])

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo

  /**  ---------Speak Function */

  const speakText = (text) => {
    return new Promise((resolve)=>{
      if(!window.speechSynthesis || !selectedVoice){
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      //add natural pauses commas and periods
      const humanText = text
      .replace(/,/g, ", ...")
      .replace(/\./g, ". ")
      
      const utterance = new SpeechSynthesisUtterance(humanText)
      
      utterance.voice = selectedVoice

      //human like pitching
      utterance.rate = 0.92 //slower than normal
      utterance.pitch = 1.05 //slightly warmth
      utterance.volume = 1

      utterance.onstart = () => {
        setIsAIPlaying(true)
        stopMic()
        videoRef.current?.play();
      }

      utterance.onend = () => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }

        setIsAIPlaying(false);

        if(isMicOn){
          startMic();
        }

        setTimeout(() => {
          setSubtitle("");
          resolve();
        }, 300);
      };

      utterance.onerror = () => {
        if (videoRef.current) {
          videoRef.current.pause();
        }
        setIsAIPlaying(false);
        resolve();
      };

      setSubtitle(text);

      window.speechSynthesis.speak(utterance);
  });
}



  useEffect(()=>{
    if(!selectedVoice){
      return;
    }
    const runIntro = async () => {
      if(isIntroPhase){
        await speakText(
          `Hello ${userName}, it's great to meet you today. I hope you are feeling 
          confident and ready. ` 
        );

        await speakText(
          "I'll ask you a few questions. Just answer naturally, and take your time. Let's begin."
        );

        setIsIntroPhase(false)
      }else if(currentQuestion){
        await new Promise(r => setTimeout(r, 800));

        //if last question (Hard level)
        if(currentIndex === questions.length - 1){
          await speakText(
            `Alright, this one might be a bit more challenging.  `
          );
        }

        await speakText(currentQuestion.question);

        if(isMicOn){
          startMic();
        }

      }
    }

    runIntro();
    
  },[selectedVoice, isIntroPhase, currentIndex])

  useEffect(()=>{
    if(isIntroPhase) return;
    if(!currentQuestion) return;
    const timer = setInterval(() => {
      setTimeLeft((prev)=>{
        if(prev <= 1){
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      })
    }, 1000);

    return ()=> clearInterval(timer)

  },[isIntroPhase, currentIndex])

  useEffect(()=>{
    if(!isIntroPhase && currentQuestion){
      setTimeLeft(currentQuestion.timeLimit || 60)
    }
  },[currentIndex])

  useEffect(()=>{
    if(!("webkitSpeechRecognition" in window))return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US"
    recognition.continuous = true
    recognition.interimResults = false

    recognition.onresult = (event) => {
      const transcript = 
      event.results[event.results.length - 1][0].transcript;

      setAnswer((prev) => prev + " " + transcript);
    };

    recongnitionRef.current = recognition;

  },[])

  const startMic = () => {
    if(recongnitionRef.current && !isAIPlaying) {
      try {
        recongnitionRef.current.start();
      } catch (error) {
        
      }
    }
  }


  const stopMic = () => {
    if(recongnitionRef.current) {
      recongnitionRef.current.stop();
    }
  }

  const toggleMic = () => {
    if(isMicOn) {
      stopMic();
    }else {
      startMic();
    }
    setIsMicOn(!isMicOn)
  };

  const submitAnswer = async () => {
    if(isSubmiting)return;
    stopMic()
    setIsSubmiting(true)

    try {
      const result = await axios.post(ServerUrl + "/api/interview/submit-answer",
      {
        interviewId,
        questionIndex: currentIndex,
        answer,
        timeTaken:
          currentQuestion.timeLimit - timeLeft,
        },{withCredentials:true})

        setFeedback(result.data.feedback)
        speakText(result.data.feedback)
        setIsSubmiting(false)
    } catch (error) {
      console.log(error)
      setIsSubmiting(false)
    }
  }

  const handleNext = async () => {
    setAnswer("");
    setFeedback("");

    if(currentIndex + 1 >= questions.length){
      finishInterview()
      return;
    }
    await speakText("Alright, Let's move to the next question.")
    setCurrentIndex(currentIndex + 1)
    setTimeout(()=>{
      if (isMicOn) startMic();
    }, 500)
  }

  const finishInterview = async () => {
    stopMic();
    setIsMicOn(false)
    try {
      const result = await axios.post(ServerUrl + "/api/interview/finish" , {
        interviewId
      },{withCredentials:true})

      console.log(result.data)
      onFinish(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    if(isIntroPhase) return; 
    if(!currentQuestion) return;

    if(timeLeft === 0 && !isSubmiting && !feedback){
      submitAnswer(); // Yt- handleSubmit(); 
    }
  },[timeLeft])

  useEffect(()=>{
    return () => {
      if(recongnitionRef.current){
        recongnitionRef.current.stop();
        recongnitionRef.current.abort();
      }
      window.speechSynthesis.cancel();
    };
  },[]);
  
  

  return (
    <div className='min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-100 flex items-center justify-center p-4 sm:p-6'>
      <div className='w-full max-w-350 min-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-hidden'>
      {/* video section  */}
      <div className='w-full lg:w-[35%] bg-white flex flex-col items-center p-5 space-y-6 border-r border-gray-200'>
        <div className='w-full max-w-md rounded-2xl overflow-hidden shadow-xl'>
          <video 
          className='w-full h-auto object-cover'
          src={videoSource}
          key={videoSource}
          ref={videoRef}
          muted
          playsInline
          preload='auto'
          />
        </div>
        {/* subtitle  */}

        {subtitle && (
          <div className='w-full max-w-md bg-gray-50 border border-gray-200 rounded-xl shadow-md p-4'>
            <p className=' text-gray-700 text-sm sm:text-base font-medium text-center leading-relaxed'>{subtitle}</p>
          </div>
        )}

        {/* timer area */}
        <div className='w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-5'>
          <div className='flex justify-between items-center'>
            <span className='text-sm text-gray-600'>
              Interview Status
            </span>
            {isAIPlaying && <span className='text-sm font-semibold text-emerald-600'>
              {isAIPlaying ? "AI Speaking" : ""}
            </span>}
          </div>

          <div className='h-px bg-gray-200'></div>

          <div className='flex justify-center'>
            <Timer timeLeft={timeLeft} timeTotal={currentQuestion?.timeLimit} />
          </div>

          <div className='h-px bg-gray-200'></div>

          <div className='grid grid-cols-2 gap-2 text-center'>
          <div>
            <span className='text-2xl font-bold text-emerald-600'>{currentIndex + 1}</span>
            <span className='text-sm text-gray-400'>Current Question</span>
          </div>

          <div>
            <span className='text-2xl font-bold text-emerald-600'>{questions?.length}</span>
            <span className='text-sm text-gray-400'>Total Question</span>
          </div>
          </div>
          
        </div>
        
      </div>

      {/* text section */}
      <div className='flex flex-1 flex-col p-4 sm:p-6 md:p-8 relative'>
        <h2 className='text-xl sm:text-2xl font-bold text-emerald-800 mb-6'>
          AI Smart Interview
        </h2>

        {!isIntroPhase && (<div className='relative mb-6 bg-gray-50 p-4 sm:-6 rounded-2xl border border-gray-200 shadow-sm'>
          <p className='text-xs sm:text-sm text-gray-400 mb-2'>
            Question {currentIndex + 1} of {questions?.length}
          </p>

          <div className='text-base sm:text-lg font-semibold leading-relaxed'>
            {currentQuestion?.question}</div>
        </div>)}



          <textarea placeholder='Type your name here...' 
          onChange={(e)=>setAnswer(e.target.value)}
          value={answer}
          className='flex-1 bg-gray-100 p-4 sm:p-6 rounded-2xl resize-none outline-none border border-gray-200 focus:ring-2 focus:ring-emerald-500 transition text-gray-800'/>

          {!feedback ? (<div className='flex items-center gap-4 mt-6'>
            <motion.button 
            onClick={toggleMic}
            whileTap={{scale:0.9}}
            className='w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-black text-white shadow-lg'>
              <FaMicrophone size={20}/>
            </motion.button>

            <motion.button
            onClick={submitAnswer}
            disabled={isSubmiting}
            whileTap={{scale:0.95}}
            className='flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 hover:bg-emerald-700 text-white py-3 sm:py-4 rounded-2xl font-semibold hover:opacity-90 transition shadow-lg disabled:bg-gray-500'>
              {isSubmiting ? "Submitting..." : "Submit Answer"}
            </motion.button>
          </div>) : (
            <motion.div 
            initial={{opacity:0}}
            animate={{opacity:1}}
            className='mt-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-sm' >
              <p className='text-emerald-700 font-medium mb-4'>{feedback}</p>
              <button 
              onClick={handleNext}
              className='w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 rounded-xl shadow-md hover:opacity-90 transition flex items-center justify-center gap-1'>Next Question <BsArrowRight size={16}/></button>
            </motion.div>
          )}
        
      </div>
      </div>

    </div>
  )
}

export default Step2Interview