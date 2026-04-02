# 🧠 InterviewIQ

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React_19-cyan?style=for-the-badge&logo=react&logoColor=white)
![NodeJS](https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=node.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**InterviewIQ** is an advanced AI-powered mock interview platform designed to help candidates prepare for their dream jobs. By analyzing a candidate's resume, the application generates highly customized, contextual questions and conducts a live, interactive, voice-based interview simulation.

---

## ✨ Key Features

- 📄 **Resume Parser:** Upload your resume (PDF). The platform extracts your skills and experiences to tailor the interview to your specific profile.
- 🤖 **AI-Generated Questions:** Uses advanced LLMs (via OpenRouter) to ask relevant, dynamic, and challenging questions based on modern industry standards.
- 🎙️ **Live Voice Interaction:** Experience a real interview environment with text-to-speech AI voices and a microphone integration for your answers.
- ⏱️ **Timer & Pacing:** Configurable time limits per question to simulate the pressure of a real interview.
- 📊 **Detailed Performance Analytics:** Instantly visualize your performance metrics using interactive charts and graphs after the interview.
- 📥 **Downloadable Reports:** Export a comprehensive PDF summary containing scores, feedback, and areas of improvement.
- 🔐 **Secure Authentication:** Robust user authentication system powered by JWT and Firebase.

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework:** React 19 with Vite
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Charts:** Recharts
- **PDF Generation:** jsPDF & jsPDF-AutoTable
- **Auth Integrations:** Firebase

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose
- **File Uploads:** Multer
- **PDF Extraction:** PDF.js (pdfjs-dist)
- **AI Integration:** OpenRouter API
- **Security:** JSON Web Tokens (JWT) & bcryptjs

## 📂 Project Structure

```text
interviewIQ/
├── client/          # React frontend application
├── server/          # Node.js + Express backend API
└── README.md        # Project documentation
```

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB (Local instance or MongoDB Atlas cluster)
- API Keys: 
  - OpenRouter API Key (for the LLM integrations)
  - Firebase Configuration (if using Firebase Auth)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/interviewIQ.git
   cd interviewIQ
   ```

2. **Setup the Backend Server:**
   ```bash
   cd server
   npm install
   ```

3. **Setup the Frontend Client:**
   ```bash
   cd ../client
   npm install
   ```

### Environment Variables

You need to set up your `.env` files for both the client and server.

**Server (`server/.env`):**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

**Client (`client/.env`):**
*(If using Firebase and specific API URLs)*
```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
```

### Running the Application

1. **Start the backend server:**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the frontend client:**
   ```bash
   cd client
   npm run dev
   ```

The client will typically run at `http://localhost:5173/` and the server at `http://localhost:5000/`.

## 🤝 Contributing

Contributions are always welcome! Whether it's reporting a bug, discussing improvements, or submitting a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👤 Author

**Bobby Yadav**

---

*Good luck with your interviews to whoever uses this!* 🎉

-------------------------------------------HAND NOTES ---------------------------------------------

Steps:  pehle hum database ko connect karne ke liye ek file banayenge jiska naam hoga ".env" aur uske andar ham apne database ka url likhenge. is file ko ham server folder ke andar banayenge

    then ham config folder ke andar ek file banayenge jiska naam hoga "connectDb.js" aur uske andar ham mongodb ko connect karne ke liye code likhenge.

    itna karne ke baad hamara database connect ho jayega aur ham apne server ko start kar sakte hain.

Steps: Ab hume Authentication banana hai 
           toh hum ab sabse pehle user ka modal banayge user.modal.js 





step 1:- 
        create two pages InterviewPage.jsx and InterviewReport.jsx

        pdf read package : pdfjs-dist

step 2:-    workflow :
            mount 
            
            load voice 

            Intro speak 

            Question speak 

            mic on

            tiimer running 

            feedback speak 

            next Question

            Repeat 

            Finish 

        

    step 3:- 
            graphs:- recharts : npm i recharts

            for Download pdf two packages are: npm i jspdf jspdf-autotable 

payment : npm i razorpay // install razorpay 
          npm i crypto // cheks payment hue hai ya nahi 


Deploy : first we have to upload the files on github or you can publish the project on github  
      then:
        Now we start deploying our project on render 
        so first we have to deploy server on web services on render 
        and after deploying server hame server url ko client ke .env file me dalna hai   || App.jsx file me jake serverUrl ko update kar dege and commit changes kar dege 
        and the client on static site on render 




