/* (c) 2012 Gerhut (Gerhut@GMail.com) || http://gerhut.net)
 * LastChangedDate: 2012-7-31 21:08:02 +0800 (Tue, 31 Jul 2012)
 * Version: 0.0.0
 * Requires: jQuery 1.4.3+
 */
 
(function($) {
	$.flipbook = {
		transform: "rotateY(90deg)",
		duration: "300"
	};
	
	$.fn.flipbook = function(s) {
	
		var doFlip = function($obj, dir) {
			
			var indStart = $obj.data("onTop");
			var indEnd = indStart + dir;
			if(indEnd < 0 || indEnd >= $obj.children().length)
				return;
			
			$obj.children().eq(indStart).css("z-index", 0);
			$obj.children().eq(indEnd).css("z-index", 1);		
			
			$obj.data("flipping", false);
			var $staStart = $obj.children().eq(indStart).clone().wrap("<div/>").parent();
			var $staEnd = $obj.children().eq(indEnd).clone().wrap("<div/>").parent();
			var $aniStart = $obj.children().eq(indStart).clone().wrap("<div/>").parent();
			var $aniEnd = $obj.children().eq(indEnd).clone().wrap("<div/>").parent();
			
			$aniEnd.css({
				"-webkit-transform": $.flipbook.transform,
				"-webkit-transition": "-webkit-transform " + $.flipbook.duration + "ms ease-out"
			}).add($aniStart.css("-webkit-transition", "-webkit-transform " + $.flipbook.duration + "ms ease-in")).css({
				"z-index": 3
			}).add($staStart).add($staEnd).css({
				position: "absolute",
				zIndex: 2,
				width: $obj.outerWidth() / 2,
				height: $obj.outerHeight(),
				overflow: "hidden",
				"-webkit-transform-origin": "right center"
			});
			
			(dir == -1 ? $staStart.add($aniEnd) : $staEnd.add($aniStart))
				.offset({top: 0, left: $obj.outerWidth() / 2})
				.css("-webkit-transform-origin", "left center")
				.children()
					.offset({top: 0, left: -$obj.outerWidth() / 2});

			$obj.append($staStart).append($staEnd).append($aniStart).append($aniEnd);
			
			setTimeout(function() {
				$aniStart.css("-webkit-transform", $.flipbook.transform);
				setTimeout(function() {
					$aniEnd.css("-webkit-transform", "");
					setTimeout(function() {
						$staStart.add($staEnd).add($aniStart).add($aniEnd).remove();
						$obj.data({
							flipping: false,
							onTop: indEnd
						});
					}, $.flipbook.duration);
				}, $.flipbook.duration);
			}, 10);
		};
		
		this
			.data({onTop: 0, flipping: false})
			.children()
				.css({
					position: "absolute",
					zIndex: 0
				})
				.width(this.outerWidth())
				.height(this.outerHeight())
				.offset(this.offset())
				.click(this, function(event) {
					if(!event.data.data("flipping")) {
						if(event.offsetX < event.data.outerWidth() / 2)
							doFlip(event.data, -1);
						else
							doFlip(event.data, 1);
					}
				})
				.eq(this.data("onTop"))
					.css("zIndex", 1);
		return this;
	}
})(jQuery);