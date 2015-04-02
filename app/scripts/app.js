'use strict';

// Version B

var isMobile = {

	Default: function() {
		return navigator.userAgent.match(/Mobi/);
	},

	Android: function() {
		return navigator.userAgent.match(/Android/i);
	},

	BlackBerry: function() {
		return navigator.userAgent.match(/BlackBerry/i);
	},

	iOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},

	Opera: function() {
		return navigator.userAgent.match(/Opera Mini/i);
	},

	Windows: function() {
		return navigator.userAgent.match(/IEMobile/i);
	},

	any: function() {
		return (
			isMobile.Default()		||
			isMobile.Android()		||
			isMobile.BlackBerry()	||
			isMobile.iOS()			||
			isMobile.Opera() 		||
			isMobile.Windows()
		);
	}
};

/** create main animations */
var	animation = {

	FadeIn: function(element, time) {
		$(element).velocity('transition.fadeIn', {
			duration: time
		});
	},

	FadeOut: function(element, time) {
		$(element).velocity('transition.fadeOut', {
			duration: time
		});
	},

	ScrollFast: function(element, time){
		$(element).velocity('scroll', {
			duration: time
		});
	},

	ScrollTo: function(element, time, target){
		$(element).velocity('scroll', {
			duration: time, 
			easing: 'easeInOutQuart',
			offset: target
		});
	},

	SlideLeftIn: function(element, time) {
		$(element).velocity('transition.slideLeftIn', {
			duration: time
		});
	},

	SlideRightIn: function(element, time) {
		$(element).velocity('transition.slideRightIn', {
			duration: time
		});
	},

	SlideUpIn: function(element, time) {
		$(element).velocity('transition.slideUpIn', {
			duration: time
		});
	},

	SlideDownIn: function(element, time) {
		$(element).velocity('transition.slideDownIn', {
			duration: time
		});
	}

};




/**
 * Main module of the application: App
 * @constructor
 */
var App = (function($, window, document, undefined) {
	var debouncer = function( func , timeout ) {
		   var timeoutID , slice = Array.prototype.slice , timeout = timeout || 200;
		   return function () {
		      var scope = this , args = arguments;
		      clearTimeout( timeoutID );
		      timeoutID = setTimeout( function () {
		          func.apply( scope , slice.call( args ) );
		      } , timeout );
		   }
		};
		/** Hacky refresh >_< should be moved elsewhere */
		var refresh = function() {
			if (!isMobile.any()) {
				$(window).resize(debouncer(function() {
					location.reload();
				}));
			}
		};

	return {
		debouncer: debouncer,
		refresh: refresh
	}

})(jQuery, window, document);



/**
 * Navigation module of the application: App
 * @constructor
 */
var Navigation = (function(App) {
	var element = {
		navigation: $('#navigation'),
		list: $('#navigation_list'),
		closeListButton: $('#close_list_button'),
		openListButton: $('#open_list_button'),
		listItems: $('#navigation_list').find('ul li'),
		anchor: $('#navigation').find('.anchor-button'),
		headline: $('#headline')
	};

	App.initNavigation = function() {
		animateScroll();
		//-> isMobile.any() && for production
		if (Modernizr.mq('only all and (max-width: 640px)')) {
			mobileMenu();
		}
	};

	var mobileMenu = function() {
		var openMenu = [
			{elements: $(element.list), properties:{right: 0}, options:{duration: 800, easing:'easeInOutQuart'}}
		],
		closeMenu = [
			{elements: $(element.list), properties:{right: '-100%'}, options:{duration: 800, easing:'easeInOutQuart'}}
		];

		$(element.closeListButton).on('click', function() {
			$.Velocity.RunSequence(closeMenu);
			return false;
		});
		$(element.openListButton).on('click', function() {
			$.Velocity.RunSequence(openMenu);
			return false;
		});
		$(window).on('scroll', App.debouncer(function() {
			$.Velocity.RunSequence(closeMenu);
		}));
		
	};

	var animateScroll = function() {
		$(document).on('click', 'a[href^="#"]', function() {
			var $this = $(this),
				section = $this.attr('href');
			if (section === '#') {
			} else {
				$(element.listItems).removeClass('active');
				$this.parent().addClass('active');
				animation.ScrollTo(section, 1000);
			}

			return false;
		});
		$(element.anchor).each(function() {
			var that = $(this),
				refElement = $(that).attr('href'),
				refElHeight = $(refElement).height();

			$(refElement).waypoint(function( direction ) {
				if (direction === 'down') {
					$(element.listItems).removeClass('active');
					$(that).parent().addClass('active');
				}
			}, {offset: 100});

			$(refElement).waypoint(function( direction ) {
				if (direction === 'up') {
					$(element.listItems).removeClass('active');
					$(that).parent().addClass('active');
				}
			}, {offset: -refElHeight});
		});
		$(element.headline).waypoint(function( direction ) {
			if (direction === 'down') {
				if (!isMobile.any() && Modernizr.mq('only all and (min-width: 1024px)')) {
					if (!$(element.navigation).hasClass('opaque')) {
						$(element.navigation).addClass('opaque');
					}
				}
			} else {
				if (!isMobile.any() && Modernizr.mq('only all and (min-width: 1024px)')) {
					if($(element.navigation).hasClass('opaque')) {
						$(element.navigation).removeClass('opaque');
					}
				}
				if ($(element.listItems).hasClass('active')) {
					$(element.listItems).removeClass('active');
				}
			}
		}, {offset: 100});
	}

	return App;

})(App || {});



/**
 * Slider module of the application: App
 * @constructor
 */
var Slider = (function(App) {
	var element = {
		slider1: $('#slider1'),
		slider2: $('#slider2'),
		slider2Buttons: $('#slider2 .prev, #slider2 .next')
	};

	App.initSlider = function() {
		$(element.slider1).flexslider({
			animation: 'slide',
			easing: 'swing',
			touch: true,
			slideshow: true,
			directionNav: false,
			controlNav: true,
			animationSpeed: 800
		});
		$(element.slider2).flexslider({
			animation: 'fade',
			easing: 'swing',
			touch: true,
			slideshow: true,
			directionNav: false,
			controlNav: false,
			animationSpeed: 800
		});
		$(element.slider2Buttons).on('click', function() {
			var href = $(this).attr('href');
			$(element.slider2).flexslider(href);
			return false;
		});
	};

	return App;

})(App || {});



/**
 * Form module of the application: App
 * @constructor
 */
var FormBuilder = (function(App) {

	var element = {
		formSelector: $('#form')
	};

	App.processForm = function() {
		$(element.formSelector).submit(function(e) {
			e.preventDefault();
			$('.form-group').removeClass('has-error');
			$('.help-block').remove();

			var formData = {
				'name': $('input[name=name').val(),
				'email': $('input[name=email').val(),
				'message': $('textarea').val()
			};

			$.ajax({
				type: 'POST',
				url: 'process.php',
				data: formData,
				dataType: 'json',
				encode: true
			})
			.done(function(data) {
				if(!data.success) {
					if(data.errors.name){
						$('#name_group').addClass('has-error');
						$('#name_group').append('<div class="help-block"><p>' + data.errors.name + '</p></div>');
					}
					if (data.errors.email) {
						$('#email_group').addClass('has-error');
						$('#email_group').append('<div class="help-block"><p>' + data.errors.email + '</p></div>');
					}
					if (data.errors.message) {
						$('#message_group').addClass('has-error');
						$('#message_group').append('<div class="help-block"><p>' + data.errors.message + '</p></div>');
					}
				} else {
					$(formSelector).append('<div class="alert alert-success"><p class="text-center">' + data.message + '</p></div>');
					$('input.form-control, textarea').val('');
				}
			});
		});
	};

	return App;

})(App || {});



/**
 * Map module of the application: App
 * @constructor
 */
var Map = (function(App) {

	App.initMap = function() {
		createMap();
	};

	var createMap = function() {
		var styles = [
				{
					featureType:'road',
					elementType:'geometry',
					stylers:[
						{visibility:'simplified'},
						{color:'#FAFAFA'}
					]
				},
				{
					featureType:'landscape',
					elementType:'geometry',
					stylers:[
						{visibility:'simplified'},
						{color:'#CCC'}
						
					]
				},
				{
					featureType:'road',
					elementType:'labels',
					stylers:[
						{visibility:'off'}
					]
				},
				{
					featureType:'poi',
					stylers:[
						{visibility:'off'}
					]
				},
				{
					featureType:'transit',
					stylers:[
						{visibility:'off'}
					]
				},
				{
					featureType:'administrative',
					stylers:[
						{visibility:'off'}
					]
				},
				{
					featureType:'water',
					stylers:[
						{visibility:'simplified'},
						{color:'#bababa'}
					]
				}
			];

			var styledMap = new google.maps.StyledMapType(styles,{name:'map'});
			var mapOptions = {
				center: new google.maps.LatLng(38.702264,-9.180573),
				zoom:15,
				scrollwheel:false,
				draggable: false,
				disableDefaultUI:true,
				mapTypeControlOptions:{
					mapTypeIds:[google.maps.MapTypeId.ROADMAP,'map_style']
				}
			};
			var map = new google.maps.Map(document.getElementById('map1'),mapOptions);
			map.mapTypes.set('map_style',styledMap);
			map.setMapTypeId('map_style');
			var image = '../images/icons/marker-64x64.png';
			var marker = new google.maps.Marker({
				position: map.getCenter(),
				map: map,
				title: 'Ver no Google Maps',
				icon:image
				//animation: google.maps.Animation.DROP
			});
			setTimeout(function(){
				marker.setAnimation(google.maps.Animation.BOUNCE);
				setTimeout(function() {
			        marker.setAnimation(null)
			    }, 500);
		    }, 2000);
		    google.maps.event.addDomListener(window, 'resize', function() {
		        var newCenter = map.getCenter();
		        google.maps.event.trigger(map, 'resize');
		        map.setCenter(newCenter);
		    });
			google.maps.event.addListener(marker,'click',function(){
				window.open('https://www.google.pt/maps/preview?ie=UTF-8&q=Museu+da+Carris&fb=1&gl=pt&hq=Museu+da+Carris+-+Alc%C3%A2ntara+1300-472+Lisboa,+Portugal+google+maps&cid=3214046092565777094&ei=czNMU73NB-HK0QWE8oGgCA&ved=0CIMBEPwSMAc');
			});
	};

	return App;

})(App || {});



/**
 * Work module of the application: App
 * @constructor
 */
var Work = (function(App) {

	var el = {
		winHeight: $(window).height(),
		section: $('#more_work'),
		sectionHeight: $('#more_work').height(),
		endSection: $('#testemunhos'),
		workSections: $('#work_desc, .work-chapters'),
		workDesc: $('#work_desc'),
		portfolioDestaque: $('.work-chapters'),
		portfolio: $('.portfolio')
	};

	App.initWork = function() {
		$(el.workSections).css({height: el.winHeight});

		$(window).on('scroll', function(e) {

			var endSection = $(el.endSection).offset().top - el.winHeight;
			var section =  $(el.section).offset().top + 65;
	        var scrollTop = $(this).scrollTop();

	        window.clearTimeout(window.timeout);

	        window.timeout = setTimeout(function() {
	        	if (scrollTop > section && endSection > scrollTop) {
	            	$(el.workDesc).removeClass('abso');
	            	$(el.workDesc).addClass('stuck');
	            } 
	            if (scrollTop > endSection) {
	                $(el.workDesc).removeClass('stuck');
	                $(el.workDesc).addClass('abso');
	            }
	            if (scrollTop < section ) {
	            	$(el.workDesc).removeClass('stuck');
	            	$(el.workDesc).removeClass('abso');
	            } 
	        });
	    });
	    initPortfolio(); 
	};

	var initPortfolio = function() {
		var buttonOpen = $(el.portfolioDestaque).find('a[href^="#"]');
		var buttonClose = $(el.portfolio).find('.portfolio-header a[href^="#"]');

		$(buttonOpen).on('click', function() {
			var $that = $(this),
				section = $that.attr('href');
			if (section !== '#') {
				$('body').addClass('hidden');
				animation.FadeIn(section, 800);
			}
			return false;
		});
		$(buttonClose).on('click', function() {
			var $that = $(this),
				section = $that.attr('href');
			if (section !== '#') {
				$('body').removeClass('hidden');
				animation.FadeOut(section, 500);
			}
			return false;
		});
	};

	return App;

})(App || {});

App.initNavigation();
App.initSlider();
App.initWork();
App.initMap();
App.processForm();
App.refresh();