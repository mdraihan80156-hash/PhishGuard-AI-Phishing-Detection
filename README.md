🛡️ PhishGuard – AI-Based Phishing URL Detection System

📌 Project Overview

PhishGuard is a web-based phishing URL detection application designed to identify potentially malicious URLs and help users stay safe from online threats.

Users can enter a URL into the application, and the system analyzes its features to classify it as Safe or Potentially Phishing.

🎯 Objectives

- Detect suspicious and phishing URLs.
- Analyze URL characteristics.
- Display prediction results and confidence scores.
- Help users understand potential online threats.

✨ Key Features

- URL input and validation
- Phishing URL detection
- Safe and suspicious classification
- Confidence score display
- Previous scan results
- Simple and user-friendly interface

🛠️ Technologies Used

- Python
- Flask
- HTML
- CSS
- JavaScript
- Machine Learning

📂 Project Structure

PhishGuard/
│
├── backend/
│   ├── app.py
│   ├── feature_extraction.py
│   ├── model.pkl
│   └── train_model.py
│
├── frontend/
│   └── index.html
│
└── dataset/

⚙️ How to Run the Project

1. Clone the repository

git clone YOUR_GITHUB_REPOSITORY_URL

2. Open the project folder

cd PhishGuard-AI-Phishing-Detection/backend

3. Install dependencies

pip install flask flask-cors

Install any additional dependencies required by the project.

4. Run the application

python app.py

5. Open the frontend

Open "frontend/index.html" in your web browser.

🔍 How It Works

1. User enters a URL.
2. The application validates the URL.
3. URL features are extracted.
4. The trained model analyzes the features.
5. The application displays the prediction result.

🎓 Learning Outcomes

- Practical experience with Python and Flask.
- Understanding of phishing detection concepts.
- Frontend and backend integration.
- Basic machine learning implementation.
- Building a cybersecurity web application.

👨‍💻 Author

Developed as a hands-on learning project to explore Python development, machine learning, and cybersecurity.

⚠️ Disclaimer

This project is intended for educational purposes. Predictions should not be treated as a guarantee that a website is safe or malicious.
