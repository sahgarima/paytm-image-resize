import firebase from "firebase/app";
import "firebase/storage";

// Your web app's Firebase configuration
 var firebaseConfig = {
  apiKey: "AIzaSyC_VfFZpPxaMpIdPCsWxr4VOem62MW9Aig",
  authDomain: "spaceproject-93b70.firebaseapp.com",
  databaseURL: "https://spaceproject-93b70.firebaseio.com",
  projectId: "spaceproject-93b70",
  storageBucket: "spaceproject-93b70.appspot.com",
  messagingSenderId: "869801616027",
  appId: "1:869801616027:web:cac4c3c20c521b2d81dc3e",
  measurementId: "G-3JXM9D71D1"
};

// Initialize Firebase

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { firebase, storage as default }; 
 
 
 