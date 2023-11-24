var win_game = null;
var win_game_opts = 'width=1072,height=660,location=no,status=no,scrollbars=no';
var ERROR_LOGIN = 100;
var ERROR_UNREAD_LETTER = 400;

function ajaxSend(s_url, s_data, f_callback, f_err_callback, f_complete_callback) {
	let loadingOpened = false;
	if (
		s_url.endsWith("/info.json") ||
		s_url.endsWith("/req.json") ||
		s_url.endsWith("/list.json")
	) {
		loading.open();
		loadingOpened = true;
	}
	$.ajax({
		url: s_url,
		type: 'POST',
		data: s_data,
		success: function (jData) {
			if (jData.success == false) {
				if (jData.retCode == ERROR_LOGIN) {
					if (!s_url.endsWith('top_stats.json')) {
						showLoginForm();
						return;
					}
				} else if (jData.retCode == ERROR_UNREAD_LETTER) {
					showLetterAlarm();
					return;
				}
			}
			
			if (f_callback) f_callback(jData);
		},
		error: function (xhr, textStatus, errorThrown) {
			// if (xhr.status == 429) {
			// 	toastr("429 Error - " + xhr.responseText, "error");
			// 	return;
			// }
			if (xhr.status == 410) {
				closePopupGame();
				location.reload();
				return;
			}
			if (xhr.status == 403) {
				toastr("403 Error - " + xhr.responseText, "error");
				return;
			}
			if (xhr.status == 401) {
				closePopupGame();
				location.href = "";
			}
			if (f_err_callback) f_err_callback(jData);
		},
		complete: function (xhr) {
			if (loadingOpened) {
				loading.close();
			}
			if (f_complete_callback) {
				f_complete_callback(xhr.responseJSON || xhr.responseText, xhr);
			}
		}
	});
}

function ajaxGetSend(s_url, s_data, f_callback, f_err_callback) {
	$.ajax({
		url: s_url,
		type: 'Get',
		data: s_data,
		success: function (jData) {
			if (jData.success == false) {
				if (jData.retCode == ERROR_LOGIN) {
					showLoginForm();
					return;
				}
				if (jData.retCode == ERROR_UNREAD_LETTER) {
					showLetterAlarm();
					return;
				}
			}
			if (f_callback) f_callback(jData);
		},
		error: function (xhr, textStatus, errorThrown) {
			if (f_err_callback) f_err_callback(xhr);
			else if (xhr.status == 401) {
				showLoginForm();
			} else if (xhr.status == 410) {
				closePopupGame();
				location.reload();
				return;
			} else if (xhr.status == 403) {
				toastr("403 Error - " + xhr.responseText, "error");
				return;
			} else if (xhr.status == 429) {
				// toastr("429 Error - " + xhr.responseText, "error");
			}
		} 
	});
}

function ajaxFormSend(form, s_url, s_data, f_callback, f_err_callback) {
	if (!checkFormValidate(form)) return;
	loading.open();

	let $form = $(`form[name='${form}']`);
	const data = $form.serializeObject();
	
	$form.find('input[data-type=comma]').each(function() {
		data[this.name] = $(this).attr('data-raw-value');
	});
	if (typeof s_data == "function") {
		s_data(data);
	} else {
		$.extend(data, s_data);
	}

	$.ajax({
		url: s_url,
		type: 'POST',
		data: data,
		success: function(jData) {
			loading.close();
			if (jData.success == false) {
				if (jData.retCode == ERROR_LOGIN) {
					showLoginForm();
					return;
				}
				if (jData.retCode == ERROR_UNREAD_LETTER) {
					showLetterAlarm();
					return;
				}
			}
			if (f_callback) f_callback(jData);
		},
		error: function (xhr, textStatus, errorThrown) {
			loading.close();
			// if (xhr.status == 429) {
			// 	toastr("429 Error - " + xhr.responseText, "error");
			// 	return;
			// }
			if (xhr.status == 410) {
				closePopupGame();
				location.reload();
				return;
			}
			if (xhr.status == 403) {
				toastr("403 Error - " + xhr.responseText, "error");
				return;
			}
			if (xhr.status == 408) {
				toastr("408 Error - 요청시간 초과", "error");
				return;
			}
			if (f_err_callback)
				f_err_callback(xhr);
			else if (xhr.status == 200)
				confirmMsgOnly(
					`AJAX ERROR - ${xhr.responseText}\n해당 오류가 지속되면 관리자에게 문의하시기 바랍니다.`
				);
			else
				confirmMsgOnly(
					`${xhr.status} ERROR - ${xhr.responseText || textStatus}\n해당 오류가 지속되면 관리자에게 문의하시기 바랍니다.`
				);
			return;
		}
	});	
}

function checkFormValidate(form) {
	let result = true;
	return result;
	$("form[name='"+form+"'] input, form[name='"+form+"'] textarea").each(function(){
		let title = this.title;
		let value = this.value;
		let required =$(this).attr('required');
		if (required == "required" && value == "") {
			showMsg('"' + title + '" 항목을 입력해주세요.', 'warning');
			$(this).focus();
			result = false; return false;
		} 
	});
	return result;
}

function getLocalStorage(key, defVal) {
	return localStorage.getItem(key) || defVal;
}
function setLocalStorage(key, val) {
	return localStorage.setItem(key, val);
}

function getSessionStorage(key, defVal) {
	return sessionStorage.getItem(key) || defVal;
}
function setSessionStorage(key, val) {
	return sessionStorage.setItem(key, val);
}

function formatComma(num) {
	num = num || 0;
	let strNum = num.toString();

	let precishn = '';
	if (strNum.indexOf('.') >= 0) { 
		let tokens = strNum.split('.');
		precishn = tokens[1] || '';
		strNum = tokens[0] || '0';
	}

	strNum = strNum.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
	if (precishn.length > 0) {
		precishn = '.' + precishn;
	}
	
	return strNum + precishn;
}

function formatHangul(num) {
	if (num <= 0) return 0;
	
	let units = ["", "만", "억", "조"];
	let unit = 0;
	
	let res = "";
	while (num) {
		let mod = num % 10000;
		if (mod > 0 && res.length > 0) {
			res = ' ' + res;
		}
		res = ((num, unit) => {
			let res = '';
			if (num >= 1000) {
				res += (num / 1000 | 0) + '천';
			}
			num %= 1000;
			if (num > 0) {
				res += num;
			}
			if (res.length > 0) {
				res += unit;
			}
			return res;
		}) (mod, units[unit]) + res;
		unit++;
		num = (num / 10000) | 0;
	}
	return res;
}

function removeDomainFromImgUrl(str) {
	return (str || '').replaceAll(/src="http:\/\/[\w\-]+\.com\//g, 'src="/');
}

function convertImgUrlToBase64(url, callback) {
	if (!this.buffImg) {
		this.buffImg = new Image();
		this.buffImg.crossOrigin = "Anonymous";
		this.buffImg.onload = function () {
			let canvas = document.createElement("canvas");
			let context = canvas.getContext("2d");
			canvas.height = this.naturalHeight;
			canvas.width = this.naturalWidth;
			context.drawImage(this, 0, 0);
			let dataURL = canvas.toDataURL("image/png");
			if (callback) callback(dataURL);
			canvas = null;
		};
	}
	this.buffImg.src = url;
}

function isMobile() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function parseCommaInteger(str) {
	if (!str) return 0;
	return parseInt(str.toString().replace(/,/g, ""));
}

// message, toastr 통보처리
function toastr(content, icon) {
	Swal.fire({
		icon:icon,
		text: content,
		toast: true,
		timer: 3500,
		showConfirmButton: false,
		position: 'top-right'
	});
}

function showLetterAlarm() {
	// closePopupGame();
	showAlarmMsg("쪽지가 도착했습니다.", "item-letter", "modal");
}
function showQnaAlarm() {
	// closePopupGame();
	showAlarmMsg("질문&답변 확인", "item-qna");
}
function showAlarmMsg(content, category, isModalToastr) {
	let params = {
		icon: 'info',
		text: content,
		toast: true,
		position: 'top',
		// timer: 5000,
		background: '#c7e3f6',
		showConfirmButton: false
	};
	if (isModalToastr) {
		params.allowOutsideClick = false;
		params.customClass = {
			container: 'swal2-modal-toastr'
		};
	}
	Swal.fire(params).then(function() {
		$('#main_pop').popup('show');
		ajaxGetSend('/front/mypage/main', {
			category: category
		}, function(data){
			$('#main_pop').find('.pop_loading').addClass('hide');
			$('#main_pop .popupbox>.pop_content').html(data);
		});
	});
}

function showMsg(content, icon) {
	Swal.fire({
		icon:icon,
		text: content,
		toast: true,
		timer: 1500,
		showConfirmButton: false
	});
}

function showLoginForm() {
	closePopupGame();
	$('#main_pop').popup('hide');
	// $('body').css({overflow:'visible'});
	$('#login_pop').popup('show');
}

function chkSignedIn() {
	let isSignIn = $("#is_sign_in").val() | 0;
	if (!isSignIn) {
		console.trace();
		if (typeof showLoginForm == "function") {
			showLoginForm();
		} else if (typeof showMsg == "function") {
			showMsg("로그인이 필요합니다.", "error");
		}
		return false;
	}
	return true;
}

function doLogout() {
	confirmMsgYn("로그아웃 하시겠습니까?", function () {
		closePopupGame();
		window.location.href = "/front/logout";
	});
}

function openPopupGameText(content) {
	win_game = window.open("", "win_game", win_game_opts);
	if (!win_game.document.getElementById("win_content")) {
		win_game.document.write("<style>body{background:#000;color:#e8ce9e;position:absolute;text-align:center;top:40%;left:50%;font-size:20px;transform:translate(-50%, -50%);}</style>");
		win_game.document.write("<div id='win_content'></div>");
	}
	win_game.document.getElementById("win_content").innerHTML = content || "예상치 않은 오류가 발생하였습니다. 관리자에게 문의해주세요.";
}

function openPopupGameUrl(url) {
	win_game = window.open(url, "win_game", win_game_opts);
}

function createPopupWin(pageURL, pageTitle, popupWinWidth, popupWinHeight, bGameWin = true) {
	if (popupWinWidth > screen.width) {
		popupWinWidth = screen.width;
		popupWinHeight = screen.height;
	}

	var left = (screen.width - popupWinWidth) / 2;
	var top = (screen.height - popupWinHeight) / 4;

	if (bGameWin) {
		pageTitle = "win_game";
	}

	let win = window.open(pageURL, pageTitle, `resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,addressbar=no,location=no,directories=no, status=no, width=${popupWinWidth}, height=${popupWinHeight}, top=${top}, left=${left}`);
	if (bGameWin) {
		win_game = win;
	}
}

function closePopupGame() {
	if (win_game) win_game.close();
}

function confirmMsgOnly(content, callback) {
	Swal.fire({
		text: content,
		allowOutsideClick: false,
		confirmButtonColor: '#3085d6',
		confirmButtonText: '확인',
	}).then((result) => {
		if (callback) callback();
	});
}

function confirmMsgYn(content, callback) {
	Swal.fire({
		title:'',
		text: content,
		allowOutsideClick: true,
		showCancelButton: true,
		focusCancel:true,
		confirmButtonColor: '#3085d6',
		confirmButtonText: '확인',
		cancelButtonText: '취소'
	}).then((result) => {
		if (result.value) {
			callback();
		}
	});
}

////////////////////////////////////////////////////////////////////////
function ch2pattern(ch) {
	const offset = 44032; /* '가'의 코드 */
	// 한국어 음절
	if (/[가-힣]/.test(ch)) {
		const chCode = ch.charCodeAt(0) - offset;
		// 종성이 있으면 문자 그대로를 찾는다.
		if (chCode % 28 > 0) {
			return ch;
		}
		const begin = Math.floor(chCode / 28) * 28 + offset;
		const end = begin + 27;
		return `[\\u${begin.toString(16)}-\\u${end.toString(16)}]`;
	}
	// 한글 자음
	if (/[ㄱ-ㅎ]/.test(ch)) {
		const con2syl = {
			'ㄱ': '가'.charCodeAt(0),
			'ㄲ': '까'.charCodeAt(0),
			'ㄴ': '나'.charCodeAt(0),
			'ㄷ': '다'.charCodeAt(0),
			'ㄸ': '따'.charCodeAt(0),
			'ㄹ': '라'.charCodeAt(0),
			'ㅁ': '마'.charCodeAt(0),
			'ㅂ': '바'.charCodeAt(0),
			'ㅃ': '빠'.charCodeAt(0),
			'ㅅ': '사'.charCodeAt(0),
		};
		const begin = con2syl[ch] || ( ( ch.charCodeAt(0) - 12613 /* 'ㅅ'의 코드 */ ) * 588 + con2syl['ㅅ'] );
		const end = begin + 587;
		return `[${ch}\\u${begin.toString(16)}-\\u${end.toString(16)}]`;
	}
	// 그 외엔 그대로 내보냄
	// escapeRegExp는 lodash에서 가져옴
	return escapeRegExp(ch);
}
	
function escapeRegExp(ch){
	return ch.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
}

function createFuzzyMatcher(input) {
	const pattern = input.split('').map(ch2pattern).join('.*?');
	return new RegExp(pattern);
}

function isAlphaOrParen(str) {
	return /^[a-zA-Z()]+$/.test(str);
}



const loading = {
	open : function(text, interval) {
		let $html = layerPopHtml();
		$('body').append(layerPopHtml());
		$('body').addClass('scrollLock');

		setTimeout(function() {
			$('#ladingPop').addClass('on');
		}, 10)

		if (interval) {
			setTimeout(function() {
				loading.close();
			}, interval);
		}

		function layerPopHtml(target) {
			let $layout = '<div id="ladingPop" class="layerPopWrap loadingWrap">';
			$layout += '<div class="bg"></div>';
			$layout += '<div class="loadingBox">';
			$layout += '<div class="loading"><i></i><i></i><i></i><i></i></div>';
			if (text) {
				$layout += '<div class="text">' + text + '</div>';
			}
			$layout += '</div></div>';
			return $layout;
		};
	},
	close : function() {
		$('#ladingPop').removeClass('on');
		$('body').removeClass('scrollLock');

		setTimeout(function() {
			$('#ladingPop').remove();
		}, 300);
	}
};

var g_audioLinks = {
	pUserIn: "/common/static/audio/user_charge.wav",
	pUserOut: "/common/static/audio/user_excharge.wav",
	pUserQna: "/common/static/audio/user_qna.mp3",
	selfIn: "/common/static/audio/partner_charge.wav",
	selfOut: "/common/static/audio/partner_excharge.wav",
	selfCompx: "/common/static/audio/rolling_exchange.mp3",
	selfLetter: "/common/static/audio/partner_letter.wav",
	selfReply: "/common/static/audio/partner_qna.mp3",
};
function playAudio(audio, type) {
	if (!audio) return;

	let url = g_audioLinks[type];
	if (!url) return;
	
	console.log("play audio url ", url);
	audio.src = url;

	if (typeof audio.loop == 'boolean') {
		audio.loop = true;
	} else {
		audio.addEventListener('ended', function() {
			this.currentTime = 0;
			this.play();
		}, false);
	}
	audio.play();
	audio.loop = false;
}

function stopAudio(audio) {
	// console.log('Stop Audio');
	if (audio) {
		audio.pause();
	}
}


function initInputComma() {
	// inputbox comma formmating
	if (typeof $.fn.commaTextbox != 'function') {
		$.fn.commaTextbox = function() {
			var applyFormatting = function(that) {
				var caretPosition = that.selectionStart
				var origVal = $(that).val();
				$('#origVal').text(origVal); // Temporary
				var justNumbers = origVal.replace(/[^\-1234567890\.]/g, "");
				$(that).attr('data-raw-value', justNumbers);
				$('#justNumbers').text(justNumbers); // Temporary
				if (justNumbers.length == 0) {
					$(that).val('');
	
					betCash = 0;
					hitCash = 0;
	
					$('.info-box').find("input[name=betCash]").val("");
					$('.info-box').find("td[name=hitCash]").html(0);
	
					return;
				}
				
				// Get rid of the decimal place and capture separately
				var decimalRegex = /(-?\d*)(\.(\d*)?)?/g
				var decimalPartMatches = decimalRegex.exec(justNumbers);
				var decimalPart = "";
				if (decimalPartMatches[2]) {
					decimalPart = decimalPartMatches[2];
				}
				$('#decimalPart').text(decimalPart); // Temporary
				var withoutDecimal = decimalPartMatches[1];
				$('#withoutDecimal').text(withoutDecimal); // Temporary
				
				// Assemble the final formatted value and put it in
				var final = '';
				final += withoutDecimal.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
				final += decimalPart;
				$(that).val(final);
				$('#final').text(final); // Temporary
					
				// Figure out new caret position and restore it
				var origSelOffset = origVal.length - justNumbers.length;
				var selPosInNumber = caretPosition - origSelOffset;
				var newSelOffset = final.length - justNumbers.length;
				var newSelPos = selPosInNumber + newSelOffset;
				that.setSelectionRange(newSelPos, newSelPos);
				
				if (typeof allocVal != 'undefined') {
					betCash = parseInt(justNumbers);
					hitCash = parseInt(betCash * allocVal);
					$('.info-box').find("input[name=betCash]").val(formatComma(betCash));
					$('.info-box').find("td[name=hitCash]").html(formatComma(hitCash));
				}
			};
			
			this.each(function() {
				applyFormatting(this);
			});
			
			$(this).off('input.commaTextbox').on('input.commaTextbox', function(event) {
				applyFormatting(this);
			});
			
			return this;
		};
	}
	if (typeof $.fn.commaVal != 'function') {
		$.fn.commaVal = function (val) {
			if (val == undefined) {
				let $el = this.eq(0);
				return parseCommaInteger($el.attr('data-raw-value') || $el.val())
					|| 0;
			}
			let strVal = formatComma(val);
			this.each(function () {
				$(this).val(strVal).trigger('input');
			});
			return this;
		};
	}

	$('input[data-type="comma"]').commaTextbox();
}