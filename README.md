# 🧠 SignLang AI — Real-Time Indian Sign Language Recognition System

### 👋 *“Speak with your hands. Hear with your eyes.”*

---

## 📘 Overview

**SignLang AI** is a real-time **Indian Sign Language (ISL)** recognition system that uses AI and computer vision to interpret hand gestures into **text and speech**.  
It aims to empower **deaf and mute individuals** by enabling communication through technology.  

The system leverages **MediaPipe** for real-time hand tracking, **TensorFlow** or **scikit-learn** for gesture classification, and **Streamlit** for an intuitive user interface.  
It also includes a **gesture learning module**, allowing users to visualize and practice gestures.

---

## 🚀 Key Features

- ✅ **Real-Time Hand Tracking:** Detects and tracks 21 key points on hands using MediaPipe.  
- ✅ **Gesture Recognition:** Classifies hand gestures based on trained models of Indian Sign Language.  
- ✅ **Text & Speech Output:** Converts gestures into text and generates corresponding voice output.  
- ✅ **Gesture Learning Mode:** Displays gesture images or animations for education and practice.  
- ✅ **Streamlit UI:** Simple, responsive, and easy-to-use interface.  
- ✅ **Modular Design:** Easily extendable with new gestures or models.  

---

## 🏗️ System Architecture
| Stage | Description |
|--------|-------------|
| 1. Camera Input | Captures live video using OpenCV. |
| 2. Hand Landmark Extraction | MediaPipe extracts 21 key hand points. |
| 3. Preprocessing | Normalizes coordinates and flattens data for model input. |
| 4. Gesture Recognition Model | Predicts gesture class using trained ML/DL model. |
| 5. Output Display | Shows recognized text on the Streamlit interface. |
| 6. Speech Synthesis | Converts text to voice output. |
| 7. Learning Mode | Displays reference gesture image/animation for learning. |


---

## 🧰 Tech Stack

| Category | Tools / Libraries |
|-----------|-------------------|
| **Programming Language** | Python 3.10+ |
| **Hand Tracking** | MediaPipe |
| **Computer Vision** | OpenCV |
| **Model Training** | TensorFlow / scikit-learn |
| **Data Handling** | NumPy, Pandas |
| **UI Framework** | Streamlit |
| **Speech Output** | gTTS / pyttsx3 |


📂 PROJECT FILE STRUCTURE

| File / Folder | Purpose |
|----------------|----------|
| `data/` | Contains gesture datasets (CSV/JSON). |
| `models/` | Stores trained models (.h5 or .pkl). |
| `app.py` | Main Streamlit UI app integrating all components. |
| `train_model.py` | Script to train and save the gesture recognition model. |
| `utils.py` | Helper functions for preprocessing, prediction, etc. |
| `requirements.txt` | Lists all Python dependencies. |
| `README.md` | Project documentation. |

📦DEPENDENCIES (requirements.txt)
| Library | Purpose |
|----------|----------|
| opencv-python | Capture webcam input and process frames. |
| mediapipe | Hand tracking and landmark extraction. |
| numpy | Mathematical and matrix operations. |
| pandas | Data handling and CSV manipulation. |
| tensorflow | Deep learning model training and inference. |
| scikit-learn | For quick ML-based gesture classification. |
| streamlit | For the interactive web app interface. |
| gtts | Text-to-speech generation. |
| pyttsx3 | Offline alternative for speech output. |

🧱 MODEL WORKFLOW
| Step | Input | Process | Output |
|------|--------|----------|---------|
| 1 | Webcam Feed | Capture frames via OpenCV. | Image Frame |
| 2 | Frame | Detect hands and extract 21 landmarks via MediaPipe. | Landmark Coordinates |
| 3 | Landmark Data | Normalize, scale, and flatten. | Preprocessed Vector |
| 4 | Preprocessed Vector | Predict gesture class using trained model. | Gesture Label |
| 5 | Gesture Label | Display and convert to speech. | Text + Audio |



---


# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/12FBSq7rCDRIZMORn6bTYupZv7LTWF1vz

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
