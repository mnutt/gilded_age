var startRetina = function() {
	/* This code is executed on the document ready event */

	var left	= 0,
		top		= 0,
		sizes	= { retina: { width:190, height:190 }, photo:{ width:1080, height:1440 } },
		photo	= $('#photoZoom'),
		offset	= { left: photo.offset().left, top: photo.offset().top };

	var retina	= $('#retina');

	if(navigator.userAgent.indexOf('Chrome')!=-1)
	{
		/*	Applying a special chrome curosor,
			as it fails to render completely blank curosrs. */

		retina.addClass('chrome');
	}

	photo.mousemove(function(e){

		left = (e.pageX-offset.left);
		top = (e.pageY-offset.top);
    console.log([left, top]);

		if(retina.is(':not(:animated):hidden')){
			/* Fixes a bug where the retina div is not shown */
			photo.trigger('mouseenter');
		}

		if(left<0 || top<0 || left > giltPhotoWidth || top > giltPhotoHeight)
		{
			/*	If we are out of the bondaries of the
				photo screenshot, hide the retina div */

			if(!retina.is(':animated')){
				photo.trigger('mouseleave');
			}
			return false;
		}

		/*	Moving the retina div with the mouse
			(and scrolling the background) */

		retina.css({
			left				: left - sizes.retina.width/2,
			top					: top - sizes.retina.height/2,
			backgroundPosition	: '-'+(1.6*left - sizes.retina.width/2) +'px -'+(1.35*top - sizes.retina.height/2) +'px'
		});

	}).mouseleave(function(){
		retina.stop(true,true).fadeOut('fast');
	}).mouseenter(function(){
		retina.stop(true,true).fadeIn('fast');
	});
}

var addRetina = function() {
  $("#photoZoom").append("<div id='retina'></div>");
  $("#retina").css({background: "url(" + $("#photo").attr('src') + ") no-repeat center center white", zIndex: 10000});
};

addRetina();
startRetina();