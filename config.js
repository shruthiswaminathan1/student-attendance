import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyC6sw1veFbmgulOmnrXOjMDd8929ydOTz0",
  authDomain: "studentattendance-47c3d.firebaseapp.com",
  databaseURL: "https://studentattendance-47c3d-default-rtdb.firebaseio.com",
  projectId: "studentattendance-47c3d",
  storageBucket: "studentattendance-47c3d.appspot.com",
  messagingSenderId: "93180714070",
  appId: "1:93180714070:web:a125be70b52e494d5eaff7",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.database();
