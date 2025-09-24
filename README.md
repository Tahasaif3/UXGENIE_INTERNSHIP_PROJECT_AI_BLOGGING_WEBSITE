# UXGENIE Internship Project – AI Blogging Website

**Author:** *Taha Saif*
\**Project 1 – Portfolio Booster (Easy)*

---

## 📝 Project Overview

This project is an **AI-powered blogging website** built as part of the **UXGENIE Internship**. It extends a traditional blog by integrating **AI helpers** for content creators. The platform combines **Next.js, Sanity CMS, Tailwind CSS, and OpenAI API** to provide a modern, intelligent blogging experience.

---

## 🎯 Concept

Take a basic blog site and enhance it with **AI-driven features**:

* Automatic **summarization** of blog posts.
* **SEO tag generation** and keyword suggestions.
* **Title optimization** for better click-through rates.

This project is beginner-friendly, portfolio-ready, and demonstrates **Next.js + CMS + AI API** integration.

---

## ✨ Features

### 📝 Blog Content Management

* Manage posts easily with **Sanity CMS** (structured content + editor UI).
* Core pages:

  * **Home Page** – lists all blog posts.
  * **Single Post Page** – detailed blog with AI tools.
  * **About Page** – project/author info.

### 🤖 AI Blog Assistant (Powered by OpenAI API)

* **Summarizer** → Generates a concise **TL;DR** for posts.
* **Tag Generator** → Suggests **SEO-friendly tags**.
* **Title Optimizer** → Rewrites titles for better performance.

### 📖 Reader Side

* Post details with **author, tags, and reading time**.
* Toggle between **full post** and **AI summary**.

### 🚀 Deployment

* Hosted on **Vercel** for speed, scalability, and free hosting.

---

## 🛠 Tech Stack

* **Frontend:** Next.js (SSR + routing)
* **Styling:** Tailwind CSS
* **CMS:** Sanity CMS (content storage & editing)
* **AI Integration:** OpenAI API (summarization, tags, SEO titles)
* **Deployment:** Vercel

---

## 🎨 Theme & Styling

A **professional blog look** with light/dark mode support.

* **Primary Blue:** `#2563EB` → trust, readability
* **Secondary Green:** `#10B981` → fresh, modern
* **Background:** `#FFFFFF` / Light Gray `#F9FAFB`
* **Dark Mode:** Background `#111827`, Text `#E5E7EB`

---

## 📌 Build Plan

### Phase 1 – Blog Foundation

* Setup Next.js + Tailwind.
* Connect Sanity CMS → fetch & display posts.
* Build pages (Home, Single Post, About).

### Phase 2 – AI Assistant

* Add summarizer button → call AI API → display **TL;DR**.
* Auto-generate tags → save in Sanity.
* Add SEO title suggestions inside the editor dashboard.

### Phase 3 – Polish & Deploy

* Add **dark/light mode toggle**.
* Deploy final project on **Vercel**.
* Share as a **portfolio-ready AI blog project**.

---

## 🚀 Why This Project Shines

✔ Starts with a familiar blog structure → **easy to code**.
✔ Adds **AI-powered features** → looks **innovative**.
✔ Demonstrates **full-stack skills**: Next.js, CMS, AI APIs, Deployment.
✔ Beginner-friendly but **portfolio-worthy**.

---

## 📂 Folder Structure (Simplified)

```
UXGENIE_INTERNSHIP_PROJECT_AI_BLOGGING_WEBSITE/
│── sanity/                # Sanity CMS schema & setup
│── app/                   # Next.js App Router directory
│   │── layout.tsx         # Root layout (header/footer/theme)
│   │── page.tsx           # Home page (list of blog posts)
│   │── about/             # About page
│   │   └── page.tsx
│   │── blog/              # Blog post routes
│   │   └── [slug]/        # Dynamic route for single post
│   │       └── page.tsx
│   │── api/               # API routes (server functions)
│   │   └── ai/            # AI endpoints (summarizer, tags, SEO)
│   │       └── route.ts
│
│── components/            # Reusable UI components (Navbar, Footer, PostCard, etc.)
│── styles/                # Global styles (Tailwind config, globals.css)
│── utils/                 # AI helper functions (summarizer, tag generator, SEO optimizer)
│── public/                # Static assets (images, icons, logos)
│── .env.local             # Environment variables (API keys, Sanity config)
│── package.json           # Dependencies & scripts
│── tailwind.config.js     # Tailwind setup
│── tsconfig.json          # TypeScript config
```

---

## 🔗 Deployment

👉 Live Project: *\[Will be deployed on Vercel]*
