{

function resetLogin() {
	$('.log-in-text').val('');
	$('#register').hide();
}

function checkValue(input, text) {
	if ($(input).val() == '') {
		showErrorBox('** ' + text + ' cannot be blank');
		return false;
	} else {
		return true;
	}
}

function checkEmailPassword() {
	let valid = checkValue('#log-in-email', 'Email');
	if (valid == true) {
		valid = checkValue('#log-in-password', 'Password')
	}
	return valid;
}

function checkNames() {
	let valid = checkValue('#log-in-fname', 'First Name');
	if (valid == true) {
		valid = checkValue('#log-in-lname', 'Last Name')
	}
	return valid;
}


// Listeners
$('#user').click(function(e) {
	if (!firebase.auth().currentUser) {
		$('#log-in').show();
		$('#log-in-email').focus();
	} else {
		firebase.auth().signOut().then(function() {
			showErrorBox('User logged out')
		});
		showPage('#home');
	}
});

$('#log-in-form').submit(function(e) {
	e.preventDefault()
	if (checkEmailPassword()) {
		firebase.auth().signInWithEmailAndPassword($('#log-in-email').val(), $('#log-in-password').val())
			.then(function(e) {
				console.log('Login successful');
				$('#log-in').hide();
				$('#log-in-form').trigger('reset');
				$('#register-form').trigger('reset');
			})
			.catch(function(e) {
				showErrorBox(e.message);
			});
	}
});

$('#log-in-new-user').click(function(e) {
	$('#register-form').show();
}); 
	
$('#register-form').submit(function(e) {
	e.preventDefault();
	if (checkEmailPassword() && checkNames()) {
		firebase.auth().createUserWithEmailAndPassword($('#log-in-email').val(), $('#log-in-password').val())
			.then(function(e) {
				return userRef.doc(e.user.uid).set({lname: $('#log-in-lname').val(), fname: $('#log-in-fname').val()})	
			})
			.then(function () {
				$('#user').text($('#log-in-fname').val());
				console.log('User created successfully');
				$('form').trigger('reset');
				$('#log-in').hide();
			})
			.catch(function(e) {
				showErrorBox(e.message);
			});
	}
});
	
$('#log-in-forgot').click(function(e) {
	if ($('#log-in-email').val() == '') {
		showErrorBox("** Please enter an email address");
	} else {
		firebase.auth().sendPasswordResetEmail($('#log-in-email').val()).then(function() {
			showErrorBox('A password reset email has been sent to ' + $('#log-in-email').val());
		}).catch(function(e) {
			showErrorBox(e.message);
		});
	}
});

}