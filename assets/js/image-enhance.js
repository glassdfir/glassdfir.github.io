/* Image enhancements for post and page content:
   - every content image opens in the lightbox (arrow keys / swipe between images on the page)
   - meaningful alt text becomes a caption under the image and in the lightbox
   Runs after the theme's scripts.min.js and re-initializes Magnific Popup. */
(function ($) {
  if (!$ || !$.fn.magnificPopup) return;

  var IMAGE_LINK = /\.(png|jpe?g|gif|webp)(\?.*)?$/i;

  // Alt text that is just a file name, a date stamp or a placeholder is not worth showing.
  function captionFor(img) {
    var alt = $.trim($(img).attr('alt') || '');
    if (alt.length < 4) return '';
    if (/\.(png|jpe?g|gif|webp)$/i.test(alt)) return '';
    if (/^(image|img|picture|photo|untitled|screen ?shot|screenshot|alt)\b/i.test(alt)) return '';
    if (/\d{4}-\d{2}-\d{2}/.test(alt)) return '';
    return alt;
  }

  $(function () {
    $('#main article img').not('.entry-feature-image, .entry-header img').each(function () {
      var img = this, $img = $(img);
      var src = $img.attr('src') || '';
      if (/^data:/i.test(src) && src.length < 200) return;          // tiny inline icons
      var w = parseInt($img.attr('width'), 10);
      if (w && w < 100) return;                                     // badges and icons

      var $link = $img.closest('a');
      if ($link.length) {
        // Already linked: zoom only if the link points at an image.
        if (!IMAGE_LINK.test($link.attr('href') || '')) return;
        $link.addClass('image-popup');
      } else {
        $img.wrap('<a class="image-popup" href="' + src.replace(/"/g, '&quot;') + '"></a>');
        $link = $img.parent();
      }
      $link.attr('aria-label', 'Open image full size');

      // An image that sits alone in its paragraph becomes a captioned figure.
      var caption = captionFor(img);
      var $p = $link.parent('p');
      if ($p.length && $p.children().length === 1 && $.trim($p.text()) === '') {
        var $fig = $('<figure class="post-figure"></figure>');
        $p.replaceWith($fig);
        $fig.append($link);
        if (caption) $fig.append($('<figcaption></figcaption>').text(caption));
      } else if (caption && !$link.parent().is('figure')) {
        $link.after($('<span class="img-caption"></span>').text(caption));
      }
    });

    $('#main article .image-popup').magnificPopup({
      type: 'image',
      tLoading: 'Loading image #%curr%...',
      gallery: { enabled: true, navigateByImgClick: true, preload: [0, 1], tCounter: '%curr% of %total%' },
      image: {
        tError: '<a href="%url%">Image #%curr%</a> could not be loaded.',
        titleSrc: function (item) { return captionFor(item.el.find('img')[0]); }
      },
      closeOnContentClick: false,
      removalDelay: 300,
      mainClass: 'mfp-fade mfp-with-zoom',
      zoom: {
        enabled: true,
        duration: 250,
        opener: function (el) { return el.find('img'); }
      }
    });
  });
})(window.jQuery);
