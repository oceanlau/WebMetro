$(document).ready(function() {
	var legacy = $.browser.msie  && parseInt($.browser.version, 10) < 10;
	if (legacy) {
		$('#killie').show();
	}
	$('.j-textfill').textfill({
		maxFontPixels: 100,
		gap: -8,
		gapTrigger: 'j-tfGap',
		innerTag: 'span'
	});
	if (legacy) {
		return
	} else {
        		$(".metro").metro();
        	}
});