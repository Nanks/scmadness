function dialog(message, key, yesCallback, noCallback) {
	console.log('msgbox');
	$('#loader').hide();
	$('#msg-box-text').html(message);
	$('#msg-box').show();

	$('#msg-box-ok').one('click', function () {
		$('#msg-box').hide();
		yesCallback(key);
	});

	$('#msg-box-can').one('click', function () {
		$('#msg-box').hide();
		noCallback();
	});   
}

function showErrorBox(text) {
	$('#loader').hide();
	$('#error-box-text').html(text);
	$('#error-box').show();

	$('#error-box-ok').one('click', function () {
		$('#error-box').hide();
	});
}

$('.modal').click(function(e) {
	if (e.target.classList.contains('modal')) {
		$('.modal').hide();
	}
});