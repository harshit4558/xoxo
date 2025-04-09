# 🧠 Talent Agent – Chrome Extension

**Talent Agent** is a Chrome extension designed to enhance personal soft skills through intelligent AI assistance. It securely manages user data and provides real-time communication feedback while interacting on platforms like LinkedIn and Gmail.

---

## 🚀 Current Features

### 🔐 LinkedIn Credential Storage
- Securely stores LinkedIn username and password using the **AIPOLabs Secret Manager**.
- Ensures user credentials are kept safe and encrypted through a backend agent connection.

### 📧 Email Writing Support (Gmail)
- When the user starts composing an email on Gmail, the extension icon becomes active (blue ✎ badge).
- The extension offers **suggestions to improve communication skills** based on the content being typed (basic placeholder or AI logic here).

---

## 🎯 Planned Features (In Progress)

### 🧾 Soft Skill Extraction via LinkedIn
- Automatically access and parse user's LinkedIn profile data (with permission).
- Use a Large Language Model (LLM) to analyze career data and extract insights into:
  - Communication
  - Leadership
  - Teamwork
  - Critical Thinking
  - Other transferable soft skills
- Provide a dashboard or popup summary with personalized skill statistics and suggestions.

---

## 🔧 Tech Stack

- **Chrome Extensions API**
- **JavaScript (Manifest v3)**
- **Python Backend (FastAPI)**
- **AIPOLabs MCP Platform** for tool-calling and secure storage (work-in-progress)
- **OpenRouter / LLM APIs** for communication analysis (planned)

---

## 🛠️ Installation (Dev Mode)

1. Clone or download this repository.
2. Go to `chrome://extensions/` in your Chrome browser.
3. Enable **Developer mode** (top right).
4. Click **Load Unpacked** and select the root folder of this project.
5. The extension will appear in your browser toolbar.

---

## 📦 Project Structure
```
vibe-agent/
├── manifest.json                  
├── background.js                  
├── contentScript.js              
├── popup.html                     
├── popup.js                       
├── styles.css                    
├── icons/                        
├── server                               
└── README.md                      
```
---

## 🧪 Status

> ⚠️ This is a **work-in-progress prototype**.

---

## ✨ Future Ideas

- Allow users to connect Gmail and LinkedIn with OAuth
- Visual dashboard of skill progression
- Weekly email summaries or coaching tips
- Integration with job boards or resume platforms
