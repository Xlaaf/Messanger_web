import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAo6AvqXXF1Lg4nVymUh5sbhwW0ZSbIt-0",
  authDomain: "paainapple-chats.firebaseapp.com",
  databaseURL: "https://paainapple-chats.firebaseio.com",
  projectId: "paainapple-chats",
  storageBucket: "paainapple-chats.appspot.com",
  messagingSenderId: "703461476426",
  appId: "1:703461476426:web:3ac2e1faa6c5f9b2513eb3",
  measurementId: "G-EV7KFPQT24",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
