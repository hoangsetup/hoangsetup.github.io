/**
 * Created by hoangdv on 1/6/2017.
 */
var $ = jQuery = require('jquery');
require('../css/bootstrap/css/bootstrap.min.css');
require('../css/style.css');
var res = require("./res");
var slots = [];
var commond = require('./common');
var drawingInterval = null;
var lstLucky = '';
$(document).ready(function() {
	var r = $('.results');
	$('.trigger-show-results').on('click', function(event) {
		event.preventDefault();
		event.stopPropagation();
		if (r.is(':visible')) {
			r.slideUp();
		} else {
			r.slideDown();
		}
	});
	$('.main-part, .trigger-close').on('click', function(event) {
		event.preventDefault();
		r.slideUp();
	});

	slots = $('ul.slots li');
	prepareSlot();

	$('#btnStartStop').on('click', function(e) {
		e.preventDefault();
		var msg = 'Nhấn nút Quay số để bắt đầu';
		var txtButtom = 'Quay số';
		if (!drawingInterval) {
			drawingSlots();
			txtButtom = 'Chốt';
			msg = 'Đang tìm kiếm người may mắn...';
		} else {
			var luckyNumber = getLuckyNumber();
			drawingResult(luckyNumber);
			$('#tblResult').find('tbody tr td').append('<span>' + luckyNumber + '</span>');
			lstLucky += '|' + luckyNumber;
		}
		$(this).html(txtButtom);
		$('#txtMessage').html(msg);
	});

	document.getElementById('auBackgroud').volume = 0.5;
});

function prepareSlot() {
	$.map(slots, function(slot) {
		$(slot).html('<img src="src/images/diamond-prize.svg">');
	});
}

function drawingSlots() {
	document.getElementById('auBackgroud').play();
	drawingInterval = setInterval(function() {
		$.map(slots, function(slot) {
			$(slot).addClass('blur').html(commond.getRandomSingleNumber(9));
			$(commond.getRandomItem(slots)).removeClass('blur');
		});
	}, 100);
}

function drawingResult(lucky) {
	//document.getElementById('auBackgroud').pause();
	var deley = config.delayShowSlot;
	clearInterval(drawingInterval);
	drawingInterval = null;
	$.map(slots, function(slot) {
		$(slot).removeClass('blur').html('<img src="src/images/diamond-prize.svg">');
	});
	var sub = slots.length - lucky.length;
	for (var i = sub; i < slots.length; i++) {
		(function(num) {
			setTimeout(function() {
				document.getElementById('auDing').pause();
				document.getElementById('auDing').play();
				$(slots[num]).html(lucky[num - sub]);
			}, deley * num);
		})(i);
	}
	$('#btnStartStop').hide();
	$('#txtMessage').hide();
	setTimeout(function() {
		$('#btnStartStop').fadeIn();
		$('#txtMessage').fadeIn();
	}, deley * lucky.length + 1500);
}

function getLuckyNumber() {
	console.log('adsf');
	var arr = [];
	$.map(res.MB, function(item) {
		if (lstLucky.indexOf(item) != -1) return;
		arr.push(item);
	});
	$.map(res[config.subArray], function(item) {
		if (lstLucky.indexOf(item) != -1) return;
		arr.push(item);
	});
	// arr.push.apply(arr, res[config.subArray]);
	// cheat
	if (config.hackme && config.hackme.length > 0) {
		var cheat = config.hackme.pop();
		var temp = [];
		$.map(arr, function(item) {
			if (item.indexOf(cheat) != -1) {
				temp.push(item);
			}
		});
		if (temp.length > 0) {
			arr = temp;
		}
	}
	return commond.getRandomItem(arr) + '';
}
