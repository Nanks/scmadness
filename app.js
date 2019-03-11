let currentEntry;

{

function appInit() {
  console.log('app init');
  loadMyEntries();
};

function loadAdmin() {
  console.log('load admin');
  
}

// ************************************
//
// Teams List Functions
//
// ************************************
function calcRound(round) {
  if (round > 0)
  return '<div>' + round + '</div>';
}

function loadTeams(status) {
  return new Promise(function(resolve, reject) {
    $('#loader').show();

    $('#teams-e').empty();
    $('#teams-w').empty();
    $('#teams-s').empty();
    $('#teams-m').empty();

    teamRef.get().then(function (teams) {
      // order by seed to match bracket
      const ord = [1, 16, 8, 9, 5, 12, 4, 13, 6, 11, 3, 14, 7, 10, 2, 15];

      var regions = {
        'E': [],
        'W': [],
        'S': [],
        'M': []
      };
      teams.forEach(function (team) {
        var temp = '';
        var val = 17 - team.data().seed;
        temp += '<div data-key="' + team.id + '" data-val="' + val + '" class="pick-team pointer">';
        temp += '<div class="flex-between">'
        temp += '<div>' + team.data().seed + '</div>';
        temp += '<div class="center flex-one">' + team.data().name + '</div>';
        temp += '<div>$' + val + '</div>';
        temp += '</div>'

        // team update section
        if (status > 2) {
          temp += '<div class="team-update flex-between pad-4 small">';
          var isElim = (team.data().elim == 'N') ? ' bg-green' : ' bg-red'
          temp += '<div class="team-update-elim' + isElim + ' white sm-btn">' + team.data().elim + '</div>';
          temp += '<div data-type="minus" class="team-update-round bg-green white sm-btn">-</div>';
          var round = calcRound(team.data().round);
          temp += '<div>' + round + '</div>';
          temp += '<div data-type="plus" class="team-update-round bg-green white sm-btn">+</div>';
          temp += '</div>'
        }

        temp += '</div>';
        var s = ord.indexOf(team.data().seed);
        regions[team.data().region][s] = temp;
      });
      regions['E'].forEach(function (t) {
        $('#teams-e').append(t);
      });
      regions['W'].forEach(function (t) {
        $('#teams-w').append(t);
      });
      regions['S'].forEach(function (t) {
        $('#teams-s').append(t);
      });
      regions['M'].forEach(function (t) {
        $('#teams-m').append(t);
      });

      if (status < 3) {
        $('.pick-team').click(function (e) {
          currentEntry.updateEntry(e.currentTarget.dataset.key);
        });
      }
      resolve('loadTeams completed');
      $('#loader').hide();
    }).catch(function(e) {
      console.log('loadTeams failed:', e.message);
      reject(e.message);
    });
  });
  
}





// ************************************
//
// ENTRY LIST FUNCTIONS
//
// ************************************
function renderEntry(entry, type) {
  return new Promise(function(resolve, reject) {
    teamRef.get().then(function(teams) {
      var tms = {};
      teams.forEach(function (team) {
        tms[team.id] = team.data();
      });
      var temp = '';
      temp += '<div class="dark rounded pad-4 margin-10">';
      temp += '<div class="logo margin flex-between pad-4">';
      temp += '<div>' + entry.data().entryName + '</div>';
      temp += '<div>' + entry.data().total + '</div>';
      temp += '</div>';
      temp += '<div class="pad-4">'
      temp += '<div class="pad-4 light rounded wrap">';
      entry.data().teams.forEach(function (team) {
        var t = tms[team];
        var elim = (t.elim == 'N') ? ' bg-green' : ' bg-light';
        temp += '<div class="team smaller' + elim + '">' + t.seed + ' - ' + t.name + ' - ' + t.total + '</div>';
      });
      temp += '</div>';
      if (type == 'my') {
        temp += '<div class="entry-edit-buttons flex-end">';
        var id = "'" + entry.id + "'";
        temp += '<div class="btn bg-red white" onclick="deleteEntry(' + id + ')">Delete</div>';
        temp += '<div class="btn bg-green white" onclick="editEntry(' + id + ')">Edit</div>';
        temp += '</div>';
      }
      temp += '</div>';
      temp += '</div>';
      resolve(temp);
    });
  });
}

function loadMyEntries() {
  $('#loader').show();
  $('#add-entry').hide();
  $('#user-picks').empty();
  entryRef.where('userKey', '==', firebase.auth().currentUser.uid).orderBy('total', 'desc').get().then(function(entries) {
    entries.forEach(function(entry) {
      var temp = renderEntry(entry, 'my');
      temp.then(function(entry) {
        $('#user-picks').append(entry);
      });
    });
    if (entries.size < 3) {
      $('#add-entry').show();
    };
    $('#loader').hide();
  });
}

function loadResults() {
  entryRef.orderBy('total', 'desc').get().then(function(results) {
    results.forEach(function(result) {
      var temp = renderEntry(result);
      temp.then(function(result) {
        $('#results').append(result);
      })
    })
  })
}


// old
// fb.ref('Teams').orderByChild('name').on('value', function(teams) {
//   var text = "";
//   var etext = "";
//   teams.forEach(function(team) {
//     if (team.val().elim == 'N') {
//       text += addTeams(team);
//     } else {
//       etext += addTeams(team);
//     }

//   });
//   document.getElementById('teams-yes').innerHTML = text;
//   document.getElementById('teams-no').innerHTML = etext;
// });

// function addTeams(t) {
//   var text = "";
//   text += '<div id="' + t.key + '" class="container';
//   if (t.val().elim == "N") { text += ' grn' }
//   text += '">'
//   text += '<div><div>' + t.val().seed + ' - ' + t.val().name + ' - ' + t.val().total + '</div>';
//   text += '<div>';

//   if (t.val().elim == "N") {
//     text += '<div class="rounds" onclick="updateRound(1,' + "'" + t.key + "'" + ')">-</div>'
//   }

//   text += '<div class="rounds'
//   if (t.val().round > 0) { text += ' yep' }
//   text += '">1</div>';

//   text += '<div class="rounds'
//   if (t.val().round > 1) { text += ' yep' }
//   text += '">2</div>';

//   text += '<div class="rounds'
//   if (t.val().round > 2) { text += ' yep' }
//   text += '">4</div>';

//   text += '<div class="rounds'
//   if (t.val().round > 4) { text += ' yep' }
//   text += '">8</div>';

//   text += '<div class="rounds'
//   if (t.val().round > 8) { text += ' yep' }
//   text += '">16</div>';

//   text += '<div class="rounds'
//   if (t.val().round > 16) { text += ' yep' }
//   text += '">32</div>';

//   if (t.val().elim == "N") {
//     text += '<div class="rounds" onclick="updateRound(0,'+ "'" + t.key + "'" + ')">+</div>'
//   }

//   text += '</div></div>'
//   text += '<div class="elim" onclick="updateElim(' + "'" + t.key + "'" + ')">' + t.val().elim + '</div></div>';
//   return text;
// }

// function updateElim(t) {
//   fb.ref('Teams').child(t).once('value', function(elim) {
//     if (elim.val().elim == "N") {
//       fb.ref('Teams').child(t).update({elim : 'Y'});
//     } else {
//       fb.ref('Teams').child(t).update({elim : 'N'});
//     }
//   });
// }

// function updateRound(r, t) {
//   var rounds = [0,1,2,4,8,16,32];
//   fb.ref('Teams').child(t).once('value', function(rnd) {
//     if (r === 0  && rnd.val().round < 33) {
//       var newRound = rounds.indexOf(rnd.val().round) + 1;
//       var newTotal = 0
//       for (i = 1; i <= newRound; i++) {
//         newTotal += rounds[i] * rnd.val().seed;
//       }
//       fb.ref('Teams').child(t).update({round: rounds[newRound], total: newTotal});
//     } else if (r === 1  && rnd.val().round > 0) {
//       var newRound = rounds.indexOf(rnd.val().round) - 1;
//       var newTotal = 0
//       for (i = 1; i <= newRound; i++) {
//         newTotal += rounds[i] * rnd.val().seed;
//       }
//     }
//     fb.ref('Teams').child(t).update({round: rounds[newRound], total: newTotal}).then(function (){
//       fb.ref('Picks').once('value', function(p) {
//         p.forEach(function(q) {
//           var tot = q.val().left;
//           q.val().tms.forEach(function(r) {
//             tot += teams.val()[r].total
//           });
//           fb.ref('Picks').child(q.key).update({total : tot, sort : -tot});
//         });
//       });
//     });
//   });
// }

// function showUsers() {
//   var text = "";
//   var pickNum = 0;
//   fb.ref('Users').orderByChild('fname').once('value', function(users) {
//     users.forEach(function(user) {
//       fb.ref('Picks').orderByChild('uid').equalTo(user.key).once('value', function(picks) {
//         if (picks.numChildren() > 0) {
//           text += '<div>' + user.val().fname + ' ' + user.val().lname + '</div>';
//           picks.forEach(function(pick) {
//             text += '<div style="font-size: 80%; padding-left: 20px;"> -' + pick.val().name + '</div>';
//             pickNum++;
//           });
//         } else {
//           console.log('Delete - ', user.key);
//         }
//       });
//     });
//     document.getElementById('user-num').innerHTML = 'Number of Picks - ' + pickNum;
//     document.getElementById('user-details').innerHTML = text;
//   });
// }

// fb.ref('Picks').orderByChild('sort').on('value', function(picks) {
//   var text = "";
//   picks.forEach(function(pick) {
//     text += '<div class="user-pick';
//     text += '">';
//       text += '<div>';
//         text += '<div class="user-pick-name'
//         // if (pick.val().uid == uid) {
//         //   text += ' mine';
//         // }
//         text += '">' + pick.val().name + '</div>';
//         if (st == 1) {
//           text += '<div class="user-pick-teams">';
//           pick.val().tms.forEach(function(team) {
//             text += '<div class="user-pick-name'
//             if (teams.val()[team].name) {
//               if (teams.val()[team].elim == "N") {
//                 text += ' yep';
//               } else {
//                 text += ' nope';
//               }
//               text += '">' + teams.val()[team].name + "-" + teams.val()[team].total + "</div>";
//             }
//           });
//           text += '</div>';
//         text += '</div>';
//         text += '<div class="user-pick-total">' + pick.val().total + '</div>';
//         }
//         text += '</div>';
//         text += '</div>';
//   });
//   document.getElementById('results').innerHTML = text;
// });


// function showPicks() {
//   current = [];
//   var text = "";
//   document.getElementById('current-entries').classList.remove('hide');
//   document.getElementById('teams').innerHTML = '';
//   document.getElementById('teams').classList.add('hide');
//   document.getElementById('make-picks').classList.add('hide');
//   document.getElementById('current').classList.add('hide');
//   if (uid != "") {
//     fb.ref('Picks').orderByChild('uid').equalTo(uid).once('value', function(picks) {
//       if (picks.numChildren() > 0) {
//         picks.forEach(function(pick) {
//           tot = 0;
//           text += '<div class="user-pick">';
//             text += '<div>';
//               text += '<div>' + pick.val().name;
//               if (st == 0) {
//                 text += '<div class="btn" onclick="editEntry(' + "'" + pick.key + "'" + ')" style="margin: 0 4px;">Edit</div>';
//                 text += '<div class="btn" onclick="deleteEntry(' + "'" + pick.key + "'" + ')" style="margin: 0 4px;">Delete</div>';
//               }
//               text += '</div>';
//               text += '<div class="user-pick-teams">';
//               pick.val().tms.forEach(function(team) {
//                 text += '<div class="user-pick-name'
//                 if (teams.val()[team].name) {
//                   if (teams.val()[team].elim == "N") {
//                     text += ' yep';
//                   } else {
//                     text += ' nope';
//                   }
//                   text += '">' + teams.val()[team].name + "-" + teams.val()[team].total + "</div>";
//                 }
//               });
//               text += '</div>';
//             text += '</div>';
//             text += '<div class="user-pick-total">' + pick.val().total + '</div>';
//           text += '</div>';
//         });
//         if (picks.numChildren() > 2 || st == 1) {
//           document.getElementById('add-pick').classList.add('hide');
//         } else {
//           document.getElementById('add-pick').classList.remove('hide');
//         }
//       } else {
//         if (st == 1) {
//           document.getElementById('add-pick').classList.add('hide');
//         } else {
//           document.getElementById('add-pick').classList.remove('hide');
//         }
//         console.log('no picks');
//       }
//       document.getElementById('user-picks').innerHTML = text;
//     });
//   } else {
//     console.log('no user');
//   }
// }

// function makePick() {
//   if (uid === "") {
//     document.getElementById('logInError').innerHTML = 'You must be signed in to make picks.<br>Please sign in or register.';
//     document.getElementById('logInError').classList.remove('hide');
//     document.getElementById('log-in').classList.remove('hide');
//     showPage('menu');
//   } else {
//     document.getElementById('current-picks').innerHTML = '';
//     document.getElementById('current-entries').classList.add('hide');
//     document.getElementById('entry-teams').innerHTML = 0;
//     document.getElementById('entry-left').innerHTML = 90;
//     document.getElementById('make-picks').classList.remove('hide');
//     document.getElementById('current').classList.remove('hide');
//     document.getElementById('txtEntryName').focus();
//   }
// }

// function addTeam() {
//   var text = "";
//   document.getElementById('current').classList.add('hide');
//   document.getElementById('teams').classList.remove('hide');
//   teams.forEach(function(team) {
//     if (current.indexOf(team.key) > -1) {
//       // console.log('do not include ' + team.val().name);
//     } else {
//       var sal = 17 - team.val().seed
//       text += '<div class="team">';
//         text += '<div>';
//           text += '<div>' + team.val().name + ' - $' + sal + '</div>';
//           text += '<div class="team-next">First Opponent: ';
//           var opp = team.val().region + sal;
//           text += teams.val()[opp].name + '</div>';
//         text += '</div>';
//         text += '<div style="margin: auto 0;">';
//           if (sal <= moneyLeft) {
//             text += '<i class="fas fa-plus-circle sm-green" onclick="pickTeam(' + "'" + team.key + "'" + ')"></i>';
//           } else {
//             text += '<i class="fas fa-times-circle sm-red"></i>';
//           }
//         text += '</div>';
//       text += '</div>';
//     }
//   });
//   document.getElementById('teams').innerHTML = text;
// }

// function pickTeam(t) {
//   current.push(t);
//   showTeams(current);
//   document.getElementById('current').classList.remove('hide');
//   document.getElementById('teams').classList.add('hide');
// }

// function removeTeam(t) {
//   var i = current.indexOf(t);
//   current.splice(i, 1);
//   showTeams(current);
// }

// function showTeams(curr) {
//   moneyLeft = 90;
//   var text = "";
//   curr.forEach(function(c) {
//     var sal = 17 - teams.val()[c].seed
//     text += '<div class="team">';
//       text += '<div>';
//         text += '<div>' + teams.val()[c].name + ' - $' + sal + '</div>';
//         text += '<div class="team-next">First Opponent: ';
//         var opp = teams.val()[c].region + sal;
//         text += teams.val()[opp].name + '</div>';
//       text += '</div>';
//       text += '<div style="margin: auto 0;">';
//         text += '<i class="fas fa-times-circle sm-red" onclick="removeTeam('+ "'" + c + "'" + ')"></i>'
//       text += '</div>';
//     text += '</div>';
//     moneyLeft = moneyLeft - (17 - teams.val()[c].seed);
//   });
//   document.getElementById('current-picks').innerHTML = text;
//   if (curr.length > 13 || moneyLeft == 0) {
//     document.getElementById('add-team').classList.add('hide');
//   } else {
//     document.getElementById('add-team').classList.remove('hide');
//   }
//   document.getElementById('entry-teams').innerHTML = curr.length;
//   document.getElementById('entry-left').innerHTML = moneyLeft;
// }


}