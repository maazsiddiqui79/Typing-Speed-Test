# ⌨️ Typing Speed Test

A full-stack **Typing Speed Test web application** that measures typing speed and accuracy in real time, stores user results, and provides a personal performance dashboard.

Built as a **solo personal project** to explore web development, UI/UX design, real-time interaction, authentication, data persistence, and AI-assisted development workflows.

---

## 📑 Table of Contents

* [📖 Overview](#-overview)
* [✨ Key Features](#-key-features)

  * [⌨️ Typing Test](#️-typing-test)
  * [🔐 Authentication](#-authentication)
  * [📊 Performance Dashboard](#-performance-dashboard)
* [🛠 Technology Stack](#-technology-stack)
* [🏗 Project Structure](#-project-structure)
* [🧠 How It Works](#-how-it-works)
* [🖥️ Project Screenshots](#️-project-screenshots)
* [⚙️ Installation & Setup](#️-installation--setup)
* [🎯 Project Purpose](#-project-purpose)
* [🚀 Future Improvements](#-future-improvements)
* [👨‍💻 Author](#-author)
* [📄 License](#-license)

---

## 📖 Overview

Typing Speed Test allows users to practice typing and track their performance through:

* ⚡ Real-time **Words Per Minute (WPM)** calculation
* 🎯 **Accuracy and mistake** tracking
* ⏱️ Multiple test durations
* 📝 Multiple typing modes
* ⌨️ Interactive on-screen keyboard
* 🔐 User registration and login
* 📊 Personal performance dashboard
* 📈 WPM and accuracy charts
* 💾 Persistent typing history
* 🗑️ Option to clear personal typing data
* 🌙 Light and dark interface

The application is designed with a clean, responsive interface and focuses on practical user experience.

---

## ✨ Key Features

### ⌨️ Typing Test

* Real-time WPM calculation
* Accuracy monitoring
* Mistake tracking
* Restart test functionality
* Multiple test durations
* Words, sentences, numbers, and punctuation modes
* Interactive virtual keyboard
* Result summary after completing a test

### 🔐 Authentication

* User registration
* Secure password hashing
* Login and logout
* Protected dashboard
* Individual user typing history

### 📊 Performance Dashboard

* Average WPM
* Best WPM
* Total tests taken
* Weekly performance trend
* Consistency score
* Highest accuracy
* Performance history chart
* Mode comparison chart
* Personal result history
* Option to clear personal typing data

---

## 🛠 Technology Stack

| Layer              | Technology            |
| ------------------ | --------------------- |
| Backend            | Python, Flask         |
| Frontend           | HTML, CSS, JavaScript |
| Database           | SQLite                |
| ORM                | Flask-SQLAlchemy      |
| Authentication     | Flask-Login           |
| Password Security  | Werkzeug              |
| Charts             | Chart.js              |
| Package Management | pip                   |

---

## 🏗 Project Structure

```text
Typing-Speed-Test/
│
├── instance/
│   └── smart_type.db
│
├── static/
│   ├── css/
│   └── js/
│
├── templates/
│   ├── about.html
│   ├── base.html
│   ├── dashboard.html
│   ├── index.html
│   ├── login.html
│   └── signup.html
│
├── Project Screenshots/
│   ├── about page.png
│   ├── dashboard page.png
│   ├── dashboard page2.png
│   ├── login page.png
│   ├── result display.png
│   ├── sign up page.png
│   ├── typing page.png
│   └── typing page2.png
│
├── app.py
├── auth.py
├── extensions.py
├── main.py
├── models.py
├── requirements.txt
└── README.md
```

The project separates authentication, application routes, database models, and Flask extensions into dedicated modules.

---

## 🧠 How It Works

```text
User
  ↓
Typing Test
  ↓
WPM + Accuracy + Mistakes
  ↓
Result Generated
  ↓
Authenticated User?
  ↓
Save Result
  ↓
Dashboard
  ↓
Performance Analytics
```

Typing results store information such as WPM, accuracy, mistakes, total characters, mode, duration, and creation date.

---

## 🖥️ Project Screenshots

<table>
<tr>
<td width="50%">

### 🏠 About Developer

<img src="Project%20Screenshots/about%20page.png" width="100%">

</td>
<td width="50%">

### 🔐 Login

<img src="Project%20Screenshots/login%20page.png" width="100%">

</td>
</tr>

<tr>
<td width="50%">

### 📝 Sign Up

<img src="Project%20Screenshots/sign%20up%20page.png" width="100%">

</td>
<td width="50%">

### ⌨️ Typing Test — Dark Mode

<img src="Project%20Screenshots/typing%20page.png" width="100%">

</td>
</tr>

<tr>
<td width="50%">

### 🌙 Typing Test — Light Mode

<img src="Project%20Screenshots/typing%20page2.png" width="100%">

</td>
<td width="50%">

### 🏆 Test Result

<img src="Project%20Screenshots/result%20display.png" width="100%">

</td>
</tr>

<tr>
<td width="50%">

### 📊 Dashboard

<img src="Project%20Screenshots/dashboard%20page.png" width="100%">

</td>
<td width="50%">

### 📈 Dashboard Analytics

<img src="Project%20Screenshots/dashboard%20page2.png" width="100%">

</td>
</tr>
</table>

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/maazsiddiqui79/Typing-Speed-Test.git
cd Typing-Speed-Test
```

### 2. Create a Virtual Environment

```bash
python -m venv .venv
```

### 3. Activate the Virtual Environment

**Windows**

```bash
.venv\Scripts\activate
```

**macOS / Linux**

```bash
source .venv/bin/activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Run the Application

```bash
python app.py
```

### 6. Open in Browser

```text
http://127.0.0.1:81/
```

---

## 🎯 Project Purpose

This project was developed as a **personal solo project** to:

* Practice full-stack web development
* Build a real-world interactive application
* Work with Flask and SQL databases
* Implement authentication and protected routes
* Explore data visualization
* Improve UI/UX design skills
* Experiment with AI-assisted development workflows

---

## 🚀 Future Improvements

* 🏆 Global leaderboard
* 📊 More detailed typing statistics
* 👤 Extended user profiles
* 🎨 Further UI improvements
* ⚙️ More customization options
* 📱 Additional mobile optimizations

---

## 👨‍💻 Author

### Maaz Siddiqui

**Computer Engineering Student | Full-Stack Developer**

**Technical Focus:** Python • Flask • Django • SQL • Web Development

* GitHub: [@maazsiddiqui79](https://github.com/maazsiddiqui79)
* Portfolio: [themaaz.online](https://www.themaaz.online/)
* LinkedIn: [Maaz Siddiqui](https://www.linkedin.com/in/siddiqui-maazzz/)

This project was **designed, developed, and maintained independently by Maaz Siddiqui** as a personal project.

---

## 📄 License

This project is licensed under the **MIT License**.

See the [`LICENSE`](LICENSE) file for the complete license terms.

---

⭐ If you find this project useful, consider giving the repository a star.
