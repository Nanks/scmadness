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
const userRef = fs.collection('users');
// var entryRef = fs.collection('entries19');
const entryRef = fs.collection('test');
const teamRef = fs.collection('teams19');
const statusRef = fs.collection('status').doc('2019');
const admins = ['8OpPRiDdchTdY4XuA6rUWmdrmsH2','3Lnd7YgXcbbUCtXh9wUg0bPxDgS2']

statusRef.onSnapshot(function(status) {
  $('#results').empty();
  $('#picks-nav').show();
  $('#results-nav').hide();
  showPage('#home');
  if (status.data().status > 1) {
    $('#picks-nav').hide();
    $('#results-nav').show();
    loadResults();
    showPage('#results');
  }
});

// entryRef.onSnapshot(function() {
//   console.log('entry change');
  
//   statusRef.get().then(function(s) {
//     loadEntries(s.data().status);
//   });
// });

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    if (admins.indexOf(user.uid) >= 0) {
      console.log('admin');
      loadAdmin();
    }
    
    if (firebase.auth().currentUser.displayName) {
      $('#user').text(firebase.auth().currentUser.displayName.split(',')[1]);
    } else {
      $('#user').text('User');
      checkUserDoc();
    }
    appInit();
  } else {
    $('#user').text('Log In');
    resetLogin();
    $('#user-picks').empty();
    showPage('#home');
    $('#loader').hide();
  }
});

function checkUserDoc() {
  userRef.doc(firebase.auth().currentUser.uid).get().then(function(user) {
    if (user.exists) {
      firebase.auth().currentUser.updateProfile({ displayName: user.data().lname + "," + user.data().fname }).then(function () {
        $('#user').text(firebase.auth().currentUser.displayName.split(',')[1]);
      });
    }
  });
}