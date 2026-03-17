# 👑 Royal Fashion Hub - Website

A modern, responsive clothing shop website built with HTML, CSS, Vanilla JavaScript, and Firebase.

---

## 📁 Project Structure

```
/royal-fashion-hub
│
├── index.html          → Home Page
├── shop.html           → Shop Page (Dynamic Products)
├── about.html          → About Us Page
├── contact.html        → Contact Page
├── login.html          → Admin Login Page
├── admin.html          → Admin Dashboard (Protected)
│
├── /css
│   └── style.css       → Main Stylesheet
│
├── /js
│   ├── firebase-config.js  → Firebase Configuration & Initialization
│   ├── auth.js              → Authentication Module
│   ├── products.js          → Product Fetching & Display
│   └── admin.js             → Admin CRUD Operations
│
├── firebase.json       → Firebase Hosting Configuration
├── firestore.rules     → Firestore Security Rules
└── README.md           → This File
```

---

## 🚀 Setup Instructions

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add Project"**
3. Give it a name (e.g., `royal-fashion-hub`)
4. Follow the setup wizard

### Step 2: Add Web App

1. In Firebase Console, click the **Web icon** (</>) 
2. Register your app
3. Copy the Firebase config object

### Step 3: Update Firebase Config

1. Open `js/firebase-config.js`
2. Replace the placeholder values with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 4: Enable Authentication

1. In Firebase Console → **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Go to **Users** tab
4. Click **"Add User"**
5. Add your admin email & password

### Step 5: Create Firestore Database

1. In Firebase Console → **Firestore Database**
2. Click **"Create Database"**
3. Start in **production mode**
4. Choose your region

### Step 6: Set Security Rules

1. Go to **Firestore Database** → **Rules** tab
2. Copy the rules from `firestore.rules`
3. Click **Publish**

### Step 7: Deploy (Optional)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (select Hosting + Firestore)
firebase init

# Deploy
firebase deploy
```

---

## 📋 Firestore Collection Structure

### Collection: `products`

| Field       | Type      | Description                    |
|-------------|-----------|--------------------------------|
| id          | auto      | Auto-generated document ID     |
| name        | string    | Product name                   |
| price       | number    | Price in INR (₹)               |
| category    | string    | "Men", "Women", or "Kids"      |
| imageURL    | string    | URL of product image           |
| description | string    | Product description             |
| createdAt   | timestamp | Server-generated timestamp     |

---

## 🔐 Security Rules Summary

- ✅ **Public Read**: Anyone can view products
- 🔒 **Write/Update/Delete**: Only authenticated admin users

---

## ✨ Features

- 🏠 Beautiful home page with hero section
- 🛍️ Dynamic product display from Firestore
- 🏷️ Category filtering (Men, Women, Kids)
- 📱 Fully responsive (Mobile, Tablet, Desktop)
- 🔐 Admin login with Firebase Authentication
- 📊 Admin dashboard with product CRUD
- 🗑️ Delete confirmation modal
- 💫 Scroll animations
- ⏳ Loading spinners
- 🔔 Toast notifications
- 🎨 Soft pastel color scheme
- 📄 SEO meta tags

---

## 🎨 Color Palette

| Color             | Hex       | Usage            |
|-------------------|-----------|------------------|
| Deep Rose         | `#c2185b` | Primary          |
| Light Pink        | `#f48fb1` | Primary Light    |
| Soft Purple       | `#7c4dff` | Secondary        |
| Coral             | `#ff6f61` | Accent           |
| Warm Cream        | `#fdf6f0` | Background       |
| Lavender Blush    | `#fff0f5` | Secondary BG     |
| Dark Navy         | `#1a1a2e` | Dark Mode/Footer |

---

## 📞 Support

For any questions or issues, please contact:
- 📧 Email: info@royalfashionhub.com
- 📞 Phone: +91 98765 43210

---

Made with ❤️ for Royal Fashion Hub
