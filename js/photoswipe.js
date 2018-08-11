jQuery(function($) {
	var PhotoSwipe = window.PhotoSwipe,
		PhotoSwipeUI_Default = window.PhotoSwipeUI_Default;

	$('body').on('click', 'a[data-size]', function(e) {
		if( !PhotoSwipe || !PhotoSwipeUI_Default ) {
			return;
		}

		e.preventDefault();
		openPhotoSwipe( this );
	});

	var parseThumbnailElements = function(gallery, el) {
		var elements = $(gallery).find('a[data-size]').has('img'),
			galleryItems = [],
			index;

		elements.each(function(i) {
			var $el = $(this),
				size = $el.data('size').split('x'),
				caption;

			if( $el.next().is('.wp-caption-text') ) {
				// image with caption
				caption = $el.next().text();
			} else if( $el.parent().next().is('.wp-caption-text') ) {
				// gallery icon with caption
				caption = $el.parent().next().text();
			} else {
				caption = $el.attr('title');
			}

			galleryItems.push({
				src: $el.attr('href'),
				w: parseInt(size[0], 10),
				h: parseInt(size[1], 10),
				title: caption,
				msrc: $el.find('img').attr('src'),
				el: $el
			});
			if( el === $el.get(0) ) {
				index = i;
			}
		});

		return [galleryItems, parseInt(index, 10)];
	};

	var openPhotoSwipe = function( element, disableAnimation ) {
		var pswpElement = $('.pswp').get(0),
			galleryElement = $(element).parents('.gallery, .hentry, .main, body').first(),
			gallery,
			options,
			items, index;

		items = parseThumbnailElements(galleryElement, element);
		index = items[1];
		items = items[0];

		options = {
			index: index,
			getThumbBoundsFn: function(index) {
				var image = items[index].el.find('img'),
					offset = image.offset();

				return {x:offset.left, y:offset.top, w:image.width()};
			},
			showHideOpacity: true,
			history: false
		};

		if(disableAnimation) {
			options.showAnimationDuration = 0;
		}

		// Pass data to PhotoSwipe and initialize it
		gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
		gallery.init();
	};

	// my custom photo swipe
	var selectors = '#primary img'
	$(document).on('click', selectors, function () {
		new ZSwipe({
			currentImg: $(this)
		});
	})

	function ZSwipe (settings) {
		this.settings = settings
		this.items = []
		this.index = 0

		this.getItems()
		this.getIndex()

		var options = {
			index: this.index
		}
		new PhotoSwipe( $('.pswp').get(0), PhotoSwipeUI_Default, this.items, options).init();
	}
	ZSwipe.prototype.getIndex = function () {
		var self = this
		this.items.forEach(function (item, index) {
			if (self.settings.currentImg.attr('src') === item.src) {
				self.index = index
			}
		})
	}
	ZSwipe.prototype.getItems = function () {
		var self = this
		$(selectors).each(function () {
			self.items.push({
				src: $(this).attr('src'),
				w: $(this).attr('width') || 300,
				h: $(this).attr('height') || 300
			})
		})
	}
});
