/*
 *
 * jQuery Delay Plugin
 * version: 0.0.1 (14-Jan-2010)
 * @requires jQuery v1.3.0 or later
 * Author: drew (drew.wells@claytonhomes.com)
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */
jQuery.fn.eachDelay = function(callback, speed){
	return jQuery.eachDelay( this, callback, speed)
}
jQuery.extend({
	eachDelay: function(object,callback, speed){
		var name, i = -1, length = object.length, $div = $('<div>'), id;
		if (length === undefined) { //not an array process as object
			var arr = [], x = -1;
			for (name in object) arr[++x] = name;
			id = window.setInterval(function(){
			 if( ++i === arr.length || callback.call(object[ arr[i] ], arr[i], object[ arr[i] ]) === false)
			 	 clearInterval(id);
			}, speed);
		}
		else { //array-compatible element ie. [], jQuery Object
			id = window.setInterval(function(){
				if (++i === object.length || callback.call(object[i], i, object[i]) === false)
					clearInterval(id);
			}, speed);
		}
		return object;
	}
});