/* vim: set expandtab tabstop=4 shiftwidth=4: */
// +--------------------------------------------------------+
// | Internet Explorer 5.5 & Firefox 1.0                    |
// +--------------------------------------------------------+
// | Copyright (c) 2007 Song Hyo-Jin                        |
// +--------------------------------------------------------+
// | This source file is BSD license.                       |
// +--------------------------------------------------------+
// | Author : Song Hyo-Jin <shj at xenosi.de>               |
// +--------------------------------------------------------+
//
// $Id: showid.js, v 0.0.2 2007/05/17 17:40:00 crosser Exp $
//
// image button libraries


/*     
불러오기 :     <script language="javascript" src='js/showid.js'></script>
마우스롤오버 : <a href="#" onMouseOver="show_over(this);" onMouseOut="show_out(this);"><img src="이미지"><img src="이미지" style="display:none;"></a>

투뎁스메뉴바 : <a href="#" onmouseover="show_over(this);" onMouseOut="show_out(this); show_layer('layers_1');"><img src="이미지"><img src="이미지" style="display:none;"></a>
               <!--투뎁스1--> 
               <div id="layers_1" style="display:none;">
               <a href="#" onmouseover="show_over(this);" onMouseOut="show_out(this);"><img src="이미지"><img src="이미지" style="display:none;"></a>
               </div>
*/

function show_over(atag, disptype, tagName)
{
	if(!disptype) {
		disptype = 'inline';
	}
	if(!tagName) {
		tagName = 'IMG';
	}
	var subs = atag.getElementsByTagName(tagName);
	if(subs.length < 2) {
		return;
	}
	if(atag.name) {
		hidden_name(atag.name, disptype, tagName);
	}
	subs[0].style.display = 'none';
	subs[1].style.display = disptype;
}

function hidden_name(atag_name, disptype, tagName)
{
	if(!disptype) {
		disptype = 'inline';
	}
	if(!tagName) {
		tagName = 'IMG';
	}
	var i, rsubs, hdn = document.getElementsByName(atag_name);
	for(i = 0; i < hdn.length; i ++) {
		rsubs = hdn[i].getElementsByTagName(tagName);
		if(rsubs.length < 2) {
			continue;
		}
		rsubs[0].style.display = disptype;
		rsubs[1].style.display = 'none';
	}
}

function show_out(atag, disptype, tagName)
{
	if(!disptype) {
		disptype = 'inline';
	}
	if(!tagName) {
		tagName = 'IMG';
	}
	var subs = atag.getElementsByTagName(tagName);
	if(subs.length < 2) {
		return;
	}
	subs[0].style.display = disptype;
	subs[1].style.display = 'none';
}

function show_toggle(atag, disptype, tagName)
{
	if(!disptype) {
		disptype = 'inline';
	}
	if(atag.tagName != 'A') {
		if(atag.style.display == 'none') {
			atag.style.display = disptype;
		} else {
			atag.style.display = 'none';
		}
		return;
	}
	if(!tagName) {
		tagName = 'IMG';
	}
	if(!disptype) {
		disptype = 'inline';
	}
	var subs = atag.getElementsByTagName(tagName);
	if(subs.length < 2) {
		return;
	}
	if(subs[0].style.display == 'none') {
		subs[0].style.display = disptype;
		subs[1].style.display = 'none';
	} else {
		subs[0].style.display = 'none';
		subs[1].style.display = disptype;
	}
}

function show_layer(tgt, disptype)
{
	if(!disptype) {
		disptype = 'inline';
	}
	var vsb = document.getElementById(tgt);
	var pattern = /^([A-Za-z_]+)[0-9]*$/;
	pattern.test(tgt);
	var hdn, i = 1;
	while((hdn = document.getElementById(RegExp.$1 + i)) != null) {
		hdn.style.display = 'none';
		i ++;
	}
	if(vsb != null) {
		vsb.style.display = disptype;
	}
}

function show_class(tgt, orig, targ)
{
	var vsb = document.getElementById(tgt);
	var pattern = /^([A-Za-z_]+)[0-9]*$/;
	pattern.test(tgt);
	var hdn, i = 1;
	while((hdn = document.getElementById(RegExp.$1 + i)) != null) {
		hdn.className = orig;
		i ++;
	}
	if(vsb != null) {
		vsb.className = targ;
	}
}

//두개의 레이어를 동시에 온오프하기위한 자바스크립트

function layer_onoff_1(){ 
document.getElementById("Layer_bg").style.display='block'; 
document.getElementById("layers_1").style.display='block';
}

//만약 현재사이트상태에서 기존회원입장을 먼저 띄워야 할 경우 하단내용추가후 호출한다.
//즉 현재는 두개의 레이어(Layer_bg제외)로 구동 하지만 숫자가 늘어날 경우 레이어온오프가 더 추가되야 한다.
function layer_onoff_2(){ 
document.getElementById("Layer_bg").style.display='block'; 
document.getElementById("layers_2").style.display='block';
}

//html 상에서 불러들이기 <a href="#"><img src="이미지.gif" onClick="layer_onoff_1()"></a>

