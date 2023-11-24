// sk_tab 2020년02월


// 카지노, 슬롯
function sk_tab_title_00(obj) {
	var tab = obj.closest(".popup_tab > li");  //ysk li 클래스명
	tab.siblings().removeClass("sk_tab_active_00");
	tab.addClass("sk_tab_active_00");

	var target = $(tab.attr("data-target")+".sk_tab_con_00");
	$(".sk_tab_con_00").addClass("sk_tab_hidden_00");
	target.removeClass("sk_tab_hidden_00");
}


// 입금신청, 출금신청, 머니이동, 쿠폰신청, 콤프신청, 이벤트, 공지사항
function sk_tab_title_01(obj) {
	var tab = obj.closest(".popup_tab > li");  //ysk li 클래스명
	tab.siblings().removeClass("sk_tab_active_01");
	tab.addClass("sk_tab_active_01");

	var target = $(tab.attr("data-target")+".sk_tab_con_01");
	$(".sk_tab_con_01").addClass("sk_tab_hidden_01");
	target.removeClass("sk_tab_hidden_01");
}


// 마이페이지, 정보수정, 입금/출금내역, 지인친구목록, 출석/체크목록, 쪽지함
function sk_tab_title_02(obj) {
	var tab = obj.closest(".popup_tab > li");  //ysk li 클래스명
	tab.siblings().removeClass("sk_tab_active_02");
	tab.addClass("sk_tab_active_02");

	var target = $(tab.attr("data-target")+".sk_tab_con_02");
	$(".sk_tab_con_02").addClass("sk_tab_hidden_02");
	target.removeClass("sk_tab_hidden_02");
}


// 준비중
function sk_tab_title_03(obj) {
	var tab = obj.closest(".popup_tab > li");  //ysk li 클래스명
	tab.siblings().removeClass("sk_tab_active_03");
	tab.addClass("sk_tab_active_03");

	var target = $(tab.attr("data-target")+".sk_tab_con_03");
	$(".sk_tab_con_03").addClass("sk_tab_hidden_03");
	target.removeClass("sk_tab_hidden_03");
}


// 게임이용방법
function sk_tab_title_04(obj) {
	var tab = obj.closest(".popup_tab > li");  //ysk li 클래스명
	tab.siblings().removeClass("sk_tab_active_04");
	tab.addClass("sk_tab_active_04");

	var target = $(tab.attr("data-target")+".sk_tab_con_04");
	$(".sk_tab_con_04").addClass("sk_tab_hidden_04");
	target.removeClass("sk_tab_hidden_04");
}


// 메인에 탭이 구성된 디자인 상황일때 (라이브카지노, 호텔카지노, 슬롯게임이 리스트로 뿌려진 형태의 구조)
function sk_tab_title_10(obj) {
	var tab = obj.closest(".main_popup_tab > li");  //ysk li 클래스명
	tab.siblings().removeClass("active");
	tab.addClass("active");

	var target = $(tab.attr("data-target")+".sk_tab_con_10");
	$(".sk_tab_con_10").addClass("sk_tab_hidden_10");
	target.removeClass("sk_tab_hidden_10");
}

$(function(){
    window.$body = $('body'); /*!消息组件实例*/


});










