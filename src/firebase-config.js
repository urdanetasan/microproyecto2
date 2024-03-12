import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAsgDtuqfi7vfLe51vHBh6ZVvrMmpDB4vw",
  authDomain: "microproyecto2urdaneta.firebaseapp.com",
  projectId: "microproyecto2urdaneta",
  storageBucket: "microproyecto2urdaneta.appspot.com",
  messagingSenderId: "833049401584",
  appId: "1:833049401584:web:cbd5119bc6422b0c398a35"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { app, firestore, auth };