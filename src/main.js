import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './assets/main.css'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcq1QWeLFcmvr4t5LDTCb8WwgbxfL8fOs",  
  authDomain: "fit5037-assignment3.firebaseapp.com",
  projectId: "fit5037-assignment3",
  storageBucket: "fit5037-assignment3.firebasestorage.app",
  messagingSenderId: "964707248959",
  appId: "1:964707248959:web:18dbc21b61742a6320c18a"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
console.log("Firebase initialized successfully!")
console.log("Firebase config:", firebaseConfig)
console.log("Firebase app:", firebaseApp)

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app') 