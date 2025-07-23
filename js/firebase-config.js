const firebaseConfig = {
  apiKey: "AIzaSyBn5pWh0pmWXJ1qSEbG_c00EIubr86a-TU",
  authDomain: "licoforice-98586.firebaseapp.com",
  projectId: "licoforice-98586",
  storageBucket: "licoforice-98586.firebasestorage.app",
  messagingSenderId: "478236357284",
  appId: "1:478236357284:web:4ebb76246730ca91082c31"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
