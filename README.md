# CareerPilot AI 🚀

An AI-powered career assistant that analyzes resumes, identifies skill gaps, recommends relevant jobs, generates personalized cover letters, and prepares interview questions—all within minutes.

## 🌐 Live Demo

https://career-path-pilot-05.lovable.app/

## 📂 GitHub Repository

https://github.com/RIDERSCC/career-path-pilot-05

---

# Problem Statement

Job seekers spend hours tailoring resumes, identifying suitable job roles, preparing cover letters, and researching interview questions.

This manual process is repetitive, time-consuming, and often overwhelming.

CareerPilot AI reduces this effort from **2–5 hours to under 2 minutes** by automating the entire workflow using AI.

---

# Solution

CareerPilot AI allows users to upload their resume in PDF format.

The application automatically:

* Extracts resume text
* Performs AI-powered resume analysis
* Identifies strengths and weaknesses
* Suggests matching job roles
* Detects missing skills
* Generates personalized cover letters
* Creates interview preparation questions

---

# Features

* 📄 Resume PDF Upload
* 🤖 AI Resume Analysis
* 💼 Job Recommendations
* 🎯 Skill Gap Analysis
* ✉️ AI Cover Letter Generation
* 🎤 Interview Question Generator
* ⚡ Fast End-to-End Processing
* 📱 Responsive UI

---

# AI Workflow

1. User uploads resume PDF.
2. PDF text is extracted.
3. Resume content is sent to an n8n workflow.
4. AI analyzes the resume.
5. Structured JSON is returned.
6. The application displays:

   * Resume Insights
   * Recommended Jobs
   * Skill Gap Analysis
   * Cover Letter
   * Interview Questions

---

# Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Lovable

### AI & Automation

* n8n
* OpenAI API

### Deployment

* Lovable
* Railway (n8n)

---

# Project Architecture

Resume PDF

↓

PDF Text Extraction

↓

n8n Workflow

↓

OpenAI

↓

Structured JSON Response

↓

CareerPilot Dashboard

---

# Impact

Traditional Process

* Resume Review
* Job Search
* Skill Analysis
* Cover Letter
* Interview Preparation

Time Required:

2–5 Hours

CareerPilot AI

Time Required:

Under 2 Minutes

---

# Future Enhancements

* LinkedIn Profile Analysis
* ATS Resume Score
* Salary Prediction
* Portfolio Review
* Learning Roadmaps
* One-click Resume Optimization

---

# Author

Dhaval Shah

Built for the **Be10X AI Generalist Hackathon 2026**.
