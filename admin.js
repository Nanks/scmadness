{

// ************************************
//
// Update Status
//
// ************************************
$('#admin-menu-status').click(function(e) {
	statusRef.get().then(function(s) {
		$('#admin-status-status').text(s.data().status);
		showPage('#admin-status');
	})
});

$('#admin-status-minus').click(function() {
	updateStatus(-1);
});

$('#admin-status-plus').click(function() {
	updateStatus(1);
});

function updateStatus(s) {
	$('#loader').show()
	let status = (Number($('#admin-status-status').text()) + s);
	statusRef.update({ status: status })
		.then(function () {
			$('#admin-status-status').text(status);
			loadResults();
			$('#loader').hide();
		})
		.catch(function (e) {
			showErrorBox(e.message);
			$('#loader').hide();
		});
};


// ************************************
//
// Show entries with user names
//
// ************************************
$('#admin-menu-entries').click(function(e) {
	renderAdminEntries().then(function() {
		showPage('#admin-user-names');
		;
	});  
});

function renderAdminEntries() {
	console.log('admin entries');
	$('#loader').show();
	$('#admin-user-details').empty();
	return entryRef.get().then(function(entries) {
		entries.forEach(function(entry) {
			userRef.doc(entry.data().userKey).get().then(function(user) {
				$('#admin-user-details').append('<div>' + entry.data().entryName + ' - ' + user.data().fname + ' ' +user.data().lname + '</div>');
			})
		});
		$('#loader').hide()
	});
}

// ************************************
//
// Show teams for update
//
// ************************************
$('#admin-menu-teams').click(function(e) {
	$('#loader').show();
	renderAdminTeams().then(function() {
		showPage('#admin-teams');
		$('#loader').hide();
	});    
});

function renderAdminTeams() {
	$('#admin-teams-yes').empty();
	$('#admin-teams-no').empty();
	return teamRef.orderBy('name').get().then(function(teams) {
		teams.forEach(function(team) {
			let t = team.data();
			let temp = '<div class="large contain flex-between">';
			temp += '<div class="width-60">' + t.name + '</div>';
			temp += '<div><span class="admin-team-elim pointer" data-key="' + team.id + '">' + t.elim + '</span></div>';
			temp += '<div class="flex-between width-20">';
			temp += '<div class="admin-team-minus pointer" data-key="' + team.id + '"><i class="fas fa-minus-square"></i></div>';
			temp += '<div id="admin-team-mult-' + team.id + '">' + t.round + '</div>';
			temp += '<div class="admin-team-plus pointer" data-key="' + team.id + '"><i class="fas fa-plus-square"></i></div>';
			temp += '</div></div>'
			if (t.elim == 'N') {
				$('#admin-teams-no').append(temp);
			} else {
				$('#admin-teams-yes').append(temp);
			}
		})

		$('.admin-team-elim').click(function (e) {
			console.log(e.currentTarget.dataset.key)
			$('#loader').show();
			teamRef.doc(e.currentTarget.dataset.key).get().then(function (elim) {
				let e = 'N';
				if (elim.data().elim == 'N') {
					e = 'Y';
				}
				teamRef.doc(e.currentTarget.dataset.key).update({ elim: e })
					.then(function () {
						renderAdminTeams().then(function() {
							$('#loader').hide();
						});
					});
			});
		});

		$('.admin-team-minus').click(function (e) {
			console.log(e.currentTarget.dataset.key)
			$('#loader').show();
			teamRef.doc(e.currentTarget.dataset.key).get().then(function (team) {
				let r = 0
				if (team.data().round > 1) {
					r = team.data().round / 2
				}
				let t = 0;
				for (var i = 1; i <= r; i = i * 2) {
					t += i * team.data().seed;
				}
				teamRef.doc(e.currentTarget.dataset.key).update({ round: r, total: t })
				.then(function() {
					renderAdminTeams().then(function() {
						$('#loader').hide();
					})
				});
			})
		});

		$('.admin-team-plus').click(function (e) {
			console.log(e.currentTarget.dataset.key)
			$('#loader').show();
			teamRef.doc(e.currentTarget.dataset.key).get().then(function(team) {
				let r = 1
				if (team.data().round > 0) {
					r = team.data().round * 2
				}
				let t = 0;
				for (var i = 1; i <= r; i = i * 2) {
					t += i * team.data().seed;
				}
				teamRef.doc(e.currentTarget.dataset.key).update({ round: r, total: t })
				.then(function () {
					renderAdminTeams().then(function () {
						$('#loader').hide();
					})
				});
			});
		});
	});
}



}