// import { firebase } from '@firebase/app'
// import '@firebase/auth'
// import 'firebase/storage';

// const conf = {
//   apiKey: "AIzaSyDqhe6bZ3I96sWmFepRUV99HUzBcA2qCq0",
//   authDomain: "chambitas2-254c1.firebaseapp.com",
//   projectId: "chambitas2-254c1",
//   storageBucket: "chambitas2-254c1.appspot.com",
//   messagingSenderId: "757541128419",
//   appId: "1:757541128419:web:4b120d6a3fd66150731dd6",
//   measurementId: "G-RXH5WCQPZR"
// };

// firebase.initializeApp(conf);

// const storage = firebase.storage()

// export{
//     storage
// }

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

//import { firebase } from 'firebase/app'
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
/*
const firebaseConfig = {
  apiKey: "AIzaSyDqhe6bZ3I96sWmFepRUV99HUzBcA2qCq0",
  authDomain: "chambitas2-254c1.firebaseapp.com",
  projectId: "chambitas2-254c1",
  storageBucket: "chambitas2-254c1.appspot.com",
  messagingSenderId: "757541128419",
  appId: "1:757541128419:web:4b120d6a3fd66150731dd6",
  measurementId: "G-RXH5WCQPZR"
};
*/
const firebaseConfig = {
  apiKey: "AIzaSyAqYBBcDR8uv6Hqfeh91az23eEp1KkcBfI",
  authDomain: "workshop-aa29f.firebaseapp.com",
  projectId: "workshop-aa29f",
  storageBucket: "workshop-aa29f.appspot.com",
  messagingSenderId: "844325976551",
  appId: "1:844325976551:web:1f8f29209489901d6c6542",
  measurementId: "G-JE9YVTXNGK"
};


// Initialize Firebase
initializeApp(firebaseConfig);

//firebase.initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

let storage = getStorage()
// const storage = {
//     storage: ""
// } 
//export default storage
export {storage}

