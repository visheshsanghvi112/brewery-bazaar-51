# Brewery Bazaar 51

Brewery Bazaar 51 is a full-stack e-commerce website built using **React** and **TypeScript (TSX)**, with a robust backend integrated. The platform allows users to browse and purchase various brewery products, while also providing an **admin panel** for managing the store, all connected with **Firebase** for authentication.

## Features

### User Features:
- **Browse Breweries**: Users can explore a wide variety of breweries, view product details, and make purchases.
- **Add to Cart**: Easy-to-use cart functionality to add and remove products.
- **Responsive UI**: A mobile-friendly, responsive interface for smooth browsing on any device.

### Admin Features:
- **Admin Authentication**: Secure admin login via **Firebase Authentication**.
- **Manage Products**: Admins can add, update, or remove products from the store.
- **Order Management**: Admins can view, manage, and track orders placed by customers.

## Project Setup

### Prerequisites

Ensure that you have **Node.js** and **npm** installed. You can download and install them from the official website:

- [Node.js](https://nodejs.org/)

You will also need a **Firebase** account for the admin authentication.

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/visheshsanghvi112/brewery-bazaar-51.git

Navigate to the project folder:

bash
Copy
Edit
cd brewery-bazaar-51
Install dependencies:

bash
Copy
Edit
npm install
Set up Firebase:

Create a Firebase project on the Firebase Console.

Set up Firebase Authentication for email/password sign-in.

Follow the instructions in Firebase to get your Firebase config and replace it in your project.

Update Firebase Configuration:

In the project, go to the src/firebaseConfig.ts file.

Replace the placeholders with your actual Firebase credentials.

Running the Project
Development Mode: To run the project locally in development mode (with hot-reloading):

bash
Copy
Edit
npm run dev
Build for Production: To create an optimized production build:

bash
Copy
Edit
npm run build
Firebase Admin Authentication
The admin panel uses Firebase Authentication to securely log in the admin users.

After setting up Firebase, make sure you add your admin credentials (e.g., email/password) in the Firebase console.

Deployment
Once you've set up everything, you can deploy the website on any hosting platform. You can host the front-end on platforms like Vercel, Netlify, or any static hosting, and the backend can be deployed separately using Firebase Functions or another back-end server solution.

Technologies Used
React - For building the front-end.

TypeScript (TSX) - For adding type safety and better code quality.

Firebase Authentication - For handling admin authentication securely.

Firebase Firestore/Realtime Database - For managing the product and order data.

CSS/SCSS - For styling the app and ensuring responsiveness.

Node.js & Express - For handling back-end logic (if applicable).


