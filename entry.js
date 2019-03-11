// ************************************
//
//  Entry Class
//
// ************************************
function Entry(key) {
    this.entryName = '';
    this.userKey = key;
    this.teams = [];
    this.left = 90;
    this.total = 0;
    this.docKey = '';
  }
  
    Entry.prototype.updateEntry = function(key) {
      if (this.teams.indexOf(key) < 0) {
        this.teams.push(key);
      } else {
        this.teams.splice(this.teams.indexOf(key), 1)
      }
      this.validateEntry();
    }

    Entry.prototype.validateEntry = function() {
      $('#make-picks-name').text(this.entryName);
      let total = 90;
      $('.pick-team').removeClass('green');
      this.teams.forEach(function(t) {
        $('.pick-team[data-key="' + t + '"]').addClass('green');
        total -= $('.pick-team[data-key="' + t + '"]').data('val');
      })

      this.left = total;
      this.total = total;

      $('#make-picks-teams').text(this.teams.length);
      $('#make-picks-left').text(this.left);

      $('#make-picks-teams').removeClass('red');
      if (this.teams.length > 14) $('#make-picks-teams').addClass('red');

      $('#make-picks-left').removeClass('red');
      if (this.left < 0) $('#make-picks-left').addClass('red');

    }

    

// ************************************
//
// Entry Functions
//
// ************************************
function createEntry(name) {
  currentEntry = new Entry(firebase.auth().currentUser.uid);
  currentEntry.entryName = name;
  currentEntry.teams = [];
  currentEntry.validateEntry();
}

function submitEntry(key) {
  let entry = {
    entryName: currentEntry.entryName,
    teams: currentEntry.teams,
    userKey: currentEntry.userKey,
    left: currentEntry.left,
    total: currentEntry.total
  }
  if (key) {
    entryRef.doc(key).update(entry).then(function(e){
      console.log('Entry updated');
      showPage('#picks');
    }).catch(function(error) {
      showErrorBox(error.message);
    });
  } else {
    entryRef.add(entry).then(function(e) {
      console.log('Entry submitted');
      showPage('#picks');
    }).catch(function(error) {
      showErrorBox(error.message);
    });
  } 
  currentEntry = undefined;
  loadMyEntries();
}

function editEntry(key) {
  entryRef.doc(key).get().then(function (entry) {
    currentEntry = new Entry(entry.data().userKey);
    currentEntry.entryName = entry.data().entryName;
    currentEntry.teams = entry.data().teams;
    currentEntry.docKey = key;
    loadTeams(1).then(function (m) {
      currentEntry.validateEntry();
      showPage('#make-picks');
      $('#teams').show();
    })
  });
}

function deleteEntry(key) {
  dialog('Are you sure you want to delete this entry?',
    key,
    function (key) {
      entryRef.doc(key).delete().then(function(e) {
        console.log('Entry deleted');
        loadMyEntries();
      }).catch(function (e) {
        console.log('Error deleting entry' + e.message)
      });
    },
    function () {
      console.log('Cancel clicked');
    }
  );
}


// ************************************
//
// DOM Events
//
// ************************************
$(document).ready(function () {
  $('#add-entry').click(function(e) {
    if (firebase.auth().currentUser) {
      $('#entry-name').show();
      $('#entry-name-text').focus();
    } else {
      dialog(
        "You must be logged in to submit an entry",
        'no key',
        function(e) {
          $('#log-in').show();
        },
        function() {
          console.log('Cancel clicked'); 
        }
      ); 
    }
  });
  
  $('#entry-name-ok').click(function(e) {
    let name = $('#entry-name-text');
    if (name.val()) {
      $('#entry-name').hide();
      createEntry(name.val());
      loadTeams(1).then(function(m) {
        showPage('#make-picks');
        $('#teams').show();
      });
    } else {
      $('#entry-name-error').text('** Entry name cannot be blank.');
      $('#entry-name-error').show();
      name.focus();
    }
  });

  $('#make-picks-cancel').click(function(e) {
    currentEntry = undefined;
    showPage('#picks');
  });

  $('#make-picks-submit').click(function(e) {
    if (currentEntry.left < 0) {
      showErrorBox('** Salary cap exceeded');
    } else if (currentEntry.teams.length == 0) {
      showErrorBox('** No teams selected');
    } else if (currentEntry.teams.length > 14) {
      showErrorBox('** Maximum number of teams exceeded');
    } else {
      submitEntry(currentEntry.docKey);
    }
  });
  
});
    
    