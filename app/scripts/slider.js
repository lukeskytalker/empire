'use strict';

jQuery(document).ready(function ($) {

	var winWidth = $(window).width();
  	$('#slider ul li').css({width: winWidth});
  
	var slideCount = $('#slider ul li').length;
	var slideHeight = $('#slider ul li .slide').height();
	var slideWidth = winWidth;
	var sliderUlWidth = slideCount * slideWidth;
	
	$('#slider').css({ width: slideWidth, height: slideHeight });
	
	$('#slider ul').css({ width: sliderUlWidth, marginLeft: - slideWidth });
	
    $('#slider ul li:last-child').prependTo('#slider ul');

    function moveLeft() {
    	$('#slider ul').velocity({
        	left: + slideWidth
        }, {
        	duration: 1000,
        	complete: function() {
        		$('#slider ul li:last-child').prependTo('#slider ul');
            	$('#slider ul').css('left', '');
        	}
        });
    };

    function moveRight() {
        $('#slider ul').velocity({
        	left: - slideWidth
        }, {
        	duration: 1000,
        	complete: function() {
        		$('#slider ul li:first-child').appendTo('#slider ul');
            	$('#slider ul').css('left', '');
        	}
        });
    };

    $('a.control_prev').click(function () {
        moveLeft();
        return false;
    });

    $('a.control_next').click(function () {
        moveRight();
        return false;
    });

    /** automatic **/
    /*
    setInterval(function () {
        moveRight();
    }, 5000);
	//*/
});