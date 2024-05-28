// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection ,doc} from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDt0EnVkNplNCvJdzjszOp-d8VF2vWthf0",
  authDomain: "blog-test-1-fda6c.firebaseapp.com",
  projectId: "blog-test-1-fda6c",
  storageBucket: "blog-test-1-fda6c.appspot.com",
  messagingSenderId: "348302819148",
  appId: "1:348302819148:web:6f81cb1d0fe5f2d9d199e9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)

export const provider = new GoogleAuthProvider()

export const db = getFirestore(app)

export const createNewPostRef = collection(db, 'createNewPost')
export const newRef = collection(db ,"test2")
export const followingRef = collection(db, "follow #2")
