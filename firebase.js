// Initialize Firebase
var config = {
  apiKey: "AIzaSyAR9B6XzLKreRvLTMNjsE3E8O1C1FCP68o",
  authDomain: "sc-madness.firebaseapp.com",
  databaseURL: "https://sc-madness.firebaseio.com",
  projectId: "sc-madness"
};
firebase.initializeApp(config);

const fb = firebase.database();
const fs = firebase.firestore();
const fn = firebase.functions();
const userRef = fs.collection('users');
const entryRef = fs.collection('entries19');
// const entryRef = fs.collection('test');
const teamRef = fs.collection('teams19');
const statusRef = fs.collection('status').doc('2019');

teamRef.onSnapshot(function() {
  updateEntries();
});


firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    user.getIdTokenResult().then(function(idTokenResult) {
      user.admin = idTokenResult.claims.admin;
      setupUI(user);
    });
    statusRef.get().then(function (s) {
      if (s.data().status < 2) {
        console.log('authRef');
        loadResults(); 
      }
    });
  } else {
    setupUI();
  }
});
