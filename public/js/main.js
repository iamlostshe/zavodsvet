////=require 1/jquery.min.js
////=require 1/jquery-ui.js
////=require slick-carousel/slick/slick.min.js
;(function (factory) {
  'use strict'
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory)
  } else if (typeof exports !== 'undefined') {
    module.exports = factory(require('jquery'))
  } else {
    factory(jQuery)
  }
})(function ($) {
  'use strict'
  var Slick = window.Slick || {}
  Slick = (function () {
    var instanceUid = 0
    function Slick(element, settings) {
      var _ = this,
        dataSettings
      _.defaults = {
        accessibility: true,
        adaptiveHeight: false,
        appendArrows: $(element),
        appendDots: $(element),
        arrows: true,
        asNavFor: null,
        prevArrow:
          '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
        nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
        autoplay: false,
        autoplaySpeed: 3e3,
        centerMode: false,
        centerPadding: '50px',
        cssEase: 'ease',
        customPaging: function (slider, i) {
          return $('<button type="button" />').text(i + 1)
        },
        dots: false,
        dotsClass: 'slick-dots',
        draggable: true,
        easing: 'linear',
        edgeFriction: 0.35,
        fade: false,
        focusOnSelect: false,
        focusOnChange: false,
        infinite: true,
        initialSlide: 0,
        lazyLoad: 'ondemand',
        mobileFirst: false,
        pauseOnHover: true,
        pauseOnFocus: true,
        pauseOnDotsHover: false,
        respondTo: 'window',
        responsive: null,
        rows: 1,
        rtl: false,
        slide: '',
        slidesPerRow: 1,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 500,
        swipe: true,
        swipeToSlide: false,
        touchMove: true,
        touchThreshold: 5,
        useCSS: true,
        useTransform: true,
        variableWidth: false,
        vertical: false,
        verticalSwiping: false,
        waitForAnimate: true,
        zIndex: 1e3,
      }
      _.initials = {
        animating: false,
        dragging: false,
        autoPlayTimer: null,
        currentDirection: 0,
        currentLeft: null,
        currentSlide: 0,
        direction: 1,
        $dots: null,
        listWidth: null,
        listHeight: null,
        loadIndex: 0,
        $nextArrow: null,
        $prevArrow: null,
        scrolling: false,
        slideCount: null,
        slideWidth: null,
        $slideTrack: null,
        $slides: null,
        sliding: false,
        slideOffset: 0,
        swipeLeft: null,
        swiping: false,
        $list: null,
        touchObject: {},
        transformsEnabled: false,
        unslicked: false,
      }
      $.extend(_, _.initials)
      _.activeBreakpoint = null
      _.animType = null
      _.animProp = null
      _.breakpoints = []
      _.breakpointSettings = []
      _.cssTransitions = false
      _.focussed = false
      _.interrupted = false
      _.hidden = 'hidden'
      _.paused = true
      _.positionProp = null
      _.respondTo = null
      _.rowCount = 1
      _.shouldClick = true
      _.$slider = $(element)
      _.$slidesCache = null
      _.transformType = null
      _.transitionType = null
      _.visibilityChange = 'visibilitychange'
      _.windowWidth = 0
      _.windowTimer = null
      dataSettings = $(element).data('slick') || {}
      _.options = $.extend({}, _.defaults, settings, dataSettings)
      _.currentSlide = _.options.initialSlide
      _.originalSettings = _.options
      if (typeof document.mozHidden !== 'undefined') {
        _.hidden = 'mozHidden'
        _.visibilityChange = 'mozvisibilitychange'
      } else if (typeof document.webkitHidden !== 'undefined') {
        _.hidden = 'webkitHidden'
        _.visibilityChange = 'webkitvisibilitychange'
      }
      _.autoPlay = $.proxy(_.autoPlay, _)
      _.autoPlayClear = $.proxy(_.autoPlayClear, _)
      _.autoPlayIterator = $.proxy(_.autoPlayIterator, _)
      _.changeSlide = $.proxy(_.changeSlide, _)
      _.clickHandler = $.proxy(_.clickHandler, _)
      _.selectHandler = $.proxy(_.selectHandler, _)
      _.setPosition = $.proxy(_.setPosition, _)
      _.swipeHandler = $.proxy(_.swipeHandler, _)
      _.dragHandler = $.proxy(_.dragHandler, _)
      _.keyHandler = $.proxy(_.keyHandler, _)
      _.instanceUid = instanceUid++
      _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/
      _.registerBreakpoints()
      _.init(true)
    }
    return Slick
  })()
  Slick.prototype.activateADA = function () {
    var _ = this
    _.$slideTrack
      .find('.slick-active')
      .attr({ 'aria-hidden': 'false' })
      .find('a, input, button, select')
      .attr({ tabindex: '0' })
  }
  Slick.prototype.addSlide = Slick.prototype.slickAdd = function (markup, index, addBefore) {
    var _ = this
    if (typeof index === 'boolean') {
      addBefore = index
      index = null
    } else if (index < 0 || index >= _.slideCount) {
      return false
    }
    _.unload()
    if (typeof index === 'number') {
      if (index === 0 && _.$slides.length === 0) {
        $(markup).appendTo(_.$slideTrack)
      } else if (addBefore) {
        $(markup).insertBefore(_.$slides.eq(index))
      } else {
        $(markup).insertAfter(_.$slides.eq(index))
      }
    } else {
      if (addBefore === true) {
        $(markup).prependTo(_.$slideTrack)
      } else {
        $(markup).appendTo(_.$slideTrack)
      }
    }
    _.$slides = _.$slideTrack.children(this.options.slide)
    _.$slideTrack.children(this.options.slide).detach()
    _.$slideTrack.append(_.$slides)
    _.$slides.each(function (index, element) {
      $(element).attr('data-slick-index', index)
    })
    _.$slidesCache = _.$slides
    _.reinit()
  }
  Slick.prototype.animateHeight = function () {
    var _ = this
    if (
      _.options.slidesToShow === 1 &&
      _.options.adaptiveHeight === true &&
      _.options.vertical === false
    ) {
      var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true)
      _.$list.animate({ height: targetHeight }, _.options.speed)
    }
  }
  Slick.prototype.animateSlide = function (targetLeft, callback) {
    var animProps = {},
      _ = this
    _.animateHeight()
    if (_.options.rtl === true && _.options.vertical === false) {
      targetLeft = -targetLeft
    }
    if (_.transformsEnabled === false) {
      if (_.options.vertical === false) {
        _.$slideTrack.animate({ left: targetLeft }, _.options.speed, _.options.easing, callback)
      } else {
        _.$slideTrack.animate({ top: targetLeft }, _.options.speed, _.options.easing, callback)
      }
    } else {
      if (_.cssTransitions === false) {
        if (_.options.rtl === true) {
          _.currentLeft = -_.currentLeft
        }
        $({ animStart: _.currentLeft }).animate(
          { animStart: targetLeft },
          {
            duration: _.options.speed,
            easing: _.options.easing,
            step: function (now) {
              now = Math.ceil(now)
              if (_.options.vertical === false) {
                animProps[_.animType] = 'translate(' + now + 'px, 0px)'
                _.$slideTrack.css(animProps)
              } else {
                animProps[_.animType] = 'translate(0px,' + now + 'px)'
                _.$slideTrack.css(animProps)
              }
            },
            complete: function () {
              if (callback) {
                callback.call()
              }
            },
          },
        )
      } else {
        _.applyTransition()
        targetLeft = Math.ceil(targetLeft)
        if (_.options.vertical === false) {
          animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)'
        } else {
          animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)'
        }
        _.$slideTrack.css(animProps)
        if (callback) {
          setTimeout(function () {
            _.disableTransition()
            callback.call()
          }, _.options.speed)
        }
      }
    }
  }
  Slick.prototype.getNavTarget = function () {
    var _ = this,
      asNavFor = _.options.asNavFor
    if (asNavFor && asNavFor !== null) {
      asNavFor = $(asNavFor).not(_.$slider)
    }
    return asNavFor
  }
  Slick.prototype.asNavFor = function (index) {
    var _ = this,
      asNavFor = _.getNavTarget()
    if (asNavFor !== null && typeof asNavFor === 'object') {
      asNavFor.each(function () {
        var target = $(this).slick('getSlick')
        if (!target.unslicked) {
          target.slideHandler(index, true)
        }
      })
    }
  }
  Slick.prototype.applyTransition = function (slide) {
    var _ = this,
      transition = {}
    if (_.options.fade === false) {
      transition[_.transitionType] =
        _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase
    } else {
      transition[_.transitionType] = 'opacity ' + _.options.speed + 'ms ' + _.options.cssEase
    }
    if (_.options.fade === false) {
      _.$slideTrack.css(transition)
    } else {
      _.$slides.eq(slide).css(transition)
    }
  }
  Slick.prototype.autoPlay = function () {
    var _ = this
    _.autoPlayClear()
    if (_.slideCount > _.options.slidesToShow) {
      _.autoPlayTimer = setInterval(_.autoPlayIterator, _.options.autoplaySpeed)
    }
  }
  Slick.prototype.autoPlayClear = function () {
    var _ = this
    if (_.autoPlayTimer) {
      clearInterval(_.autoPlayTimer)
    }
  }
  Slick.prototype.autoPlayIterator = function () {
    var _ = this,
      slideTo = _.currentSlide + _.options.slidesToScroll
    if (!_.paused && !_.interrupted && !_.focussed) {
      if (_.options.infinite === false) {
        if (_.direction === 1 && _.currentSlide + 1 === _.slideCount - 1) {
          _.direction = 0
        } else if (_.direction === 0) {
          slideTo = _.currentSlide - _.options.slidesToScroll
          if (_.currentSlide - 1 === 0) {
            _.direction = 1
          }
        }
      }
      _.slideHandler(slideTo)
    }
  }
  Slick.prototype.buildArrows = function () {
    var _ = this
    if (_.options.arrows === true) {
      _.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow')
      _.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow')
      if (_.slideCount > _.options.slidesToShow) {
        _.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex')
        _.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex')
        if (_.htmlExpr.test(_.options.prevArrow)) {
          _.$prevArrow.prependTo(_.options.appendArrows)
        }
        if (_.htmlExpr.test(_.options.nextArrow)) {
          _.$nextArrow.appendTo(_.options.appendArrows)
        }
        if (_.options.infinite !== true) {
          _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true')
        }
      } else {
        _.$prevArrow
          .add(_.$nextArrow)
          .addClass('slick-hidden')
          .attr({ 'aria-disabled': 'true', tabindex: '-1' })
      }
    }
  }
  Slick.prototype.buildDots = function () {
    var _ = this,
      i,
      dot
    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
      _.$slider.addClass('slick-dotted')
      dot = $('<ul />').addClass(_.options.dotsClass)
      for (i = 0; i <= _.getDotCount(); i += 1) {
        dot.append($('<li />').append(_.options.customPaging.call(this, _, i)))
      }
      _.$dots = dot.appendTo(_.options.appendDots)
      _.$dots.find('li').first().addClass('slick-active')
    }
  }
  Slick.prototype.buildOut = function () {
    var _ = this
    _.$slides = _.$slider.children(_.options.slide + ':not(.slick-cloned)').addClass('slick-slide')
    _.slideCount = _.$slides.length
    _.$slides.each(function (index, element) {
      $(element)
        .attr('data-slick-index', index)
        .data('originalStyling', $(element).attr('style') || '')
    })
    _.$slider.addClass('slick-slider')
    _.$slideTrack =
      _.slideCount === 0
        ? $('<div class="slick-track"/>').appendTo(_.$slider)
        : _.$slides.wrapAll('<div class="slick-track"/>').parent()
    _.$list = _.$slideTrack.wrap('<div class="slick-list"/>').parent()
    _.$slideTrack.css('opacity', 0)
    if (_.options.centerMode === true || _.options.swipeToSlide === true) {
      _.options.slidesToScroll = 1
    }
    $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading')
    _.setupInfinite()
    _.buildArrows()
    _.buildDots()
    _.updateDots()
    _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0)
    if (_.options.draggable === true) {
      _.$list.addClass('draggable')
    }
  }
  Slick.prototype.buildRows = function () {
    var _ = this,
      a,
      b,
      c,
      newSlides,
      numOfSlides,
      originalSlides,
      slidesPerSection
    newSlides = document.createDocumentFragment()
    originalSlides = _.$slider.children()
    if (_.options.rows > 0) {
      slidesPerSection = _.options.slidesPerRow * _.options.rows
      numOfSlides = Math.ceil(originalSlides.length / slidesPerSection)
      for (a = 0; a < numOfSlides; a++) {
        var slide = document.createElement('div')
        for (b = 0; b < _.options.rows; b++) {
          var row = document.createElement('div')
          for (c = 0; c < _.options.slidesPerRow; c++) {
            var target = a * slidesPerSection + (b * _.options.slidesPerRow + c)
            if (originalSlides.get(target)) {
              row.appendChild(originalSlides.get(target))
            }
          }
          slide.appendChild(row)
        }
        newSlides.appendChild(slide)
      }
      _.$slider.empty().append(newSlides)
      _.$slider
        .children()
        .children()
        .children()
        .css({
          width: 100 / _.options.slidesPerRow + '%',
          display: 'inline-block',
        })
    }
  }
  Slick.prototype.checkResponsive = function (initial, forceUpdate) {
    var _ = this,
      breakpoint,
      targetBreakpoint,
      respondToWidth,
      triggerBreakpoint = false
    var sliderWidth = _.$slider.width()
    var windowWidth = window.innerWidth || $(window).width()
    if (_.respondTo === 'window') {
      respondToWidth = windowWidth
    } else if (_.respondTo === 'slider') {
      respondToWidth = sliderWidth
    } else if (_.respondTo === 'min') {
      respondToWidth = Math.min(windowWidth, sliderWidth)
    }
    if (_.options.responsive && _.options.responsive.length && _.options.responsive !== null) {
      targetBreakpoint = null
      for (breakpoint in _.breakpoints) {
        if (_.breakpoints.hasOwnProperty(breakpoint)) {
          if (_.originalSettings.mobileFirst === false) {
            if (respondToWidth < _.breakpoints[breakpoint]) {
              targetBreakpoint = _.breakpoints[breakpoint]
            }
          } else {
            if (respondToWidth > _.breakpoints[breakpoint]) {
              targetBreakpoint = _.breakpoints[breakpoint]
            }
          }
        }
      }
      if (targetBreakpoint !== null) {
        if (_.activeBreakpoint !== null) {
          if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
            _.activeBreakpoint = targetBreakpoint
            if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
              _.unslick(targetBreakpoint)
            } else {
              _.options = $.extend({}, _.originalSettings, _.breakpointSettings[targetBreakpoint])
              if (initial === true) {
                _.currentSlide = _.options.initialSlide
              }
              _.refresh(initial)
            }
            triggerBreakpoint = targetBreakpoint
          }
        } else {
          _.activeBreakpoint = targetBreakpoint
          if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
            _.unslick(targetBreakpoint)
          } else {
            _.options = $.extend({}, _.originalSettings, _.breakpointSettings[targetBreakpoint])
            if (initial === true) {
              _.currentSlide = _.options.initialSlide
            }
            _.refresh(initial)
          }
          triggerBreakpoint = targetBreakpoint
        }
      } else {
        if (_.activeBreakpoint !== null) {
          _.activeBreakpoint = null
          _.options = _.originalSettings
          if (initial === true) {
            _.currentSlide = _.options.initialSlide
          }
          _.refresh(initial)
          triggerBreakpoint = targetBreakpoint
        }
      }
      if (!initial && triggerBreakpoint !== false) {
        _.$slider.trigger('breakpoint', [_, triggerBreakpoint])
      }
    }
  }
  Slick.prototype.changeSlide = function (event, dontAnimate) {
    var _ = this,
      $target = $(event.currentTarget),
      indexOffset,
      slideOffset,
      unevenOffset
    if ($target.is('a')) {
      event.preventDefault()
    }
    if (!$target.is('li')) {
      $target = $target.closest('li')
    }
    unevenOffset = _.slideCount % _.options.slidesToScroll !== 0
    indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll
    switch (event.data.message) {
      case 'previous':
        slideOffset =
          indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset
        if (_.slideCount > _.options.slidesToShow) {
          _.slideHandler(_.currentSlide - slideOffset, false, dontAnimate)
        }
        break
      case 'next':
        slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset
        if (_.slideCount > _.options.slidesToShow) {
          _.slideHandler(_.currentSlide + slideOffset, false, dontAnimate)
        }
        break
      case 'index':
        var index =
          event.data.index === 0
            ? 0
            : event.data.index || $target.index() * _.options.slidesToScroll
        _.slideHandler(_.checkNavigable(index), false, dontAnimate)
        $target.children().trigger('focus')
        break
      default:
        return
    }
  }
  Slick.prototype.checkNavigable = function (index) {
    var _ = this,
      navigables,
      prevNavigable
    navigables = _.getNavigableIndexes()
    prevNavigable = 0
    if (index > navigables[navigables.length - 1]) {
      index = navigables[navigables.length - 1]
    } else {
      for (var n in navigables) {
        if (index < navigables[n]) {
          index = prevNavigable
          break
        }
        prevNavigable = navigables[n]
      }
    }
    return index
  }
  Slick.prototype.cleanUpEvents = function () {
    var _ = this
    if (_.options.dots && _.$dots !== null) {
      $('li', _.$dots)
        .off('click.slick', _.changeSlide)
        .off('mouseenter.slick', $.proxy(_.interrupt, _, true))
        .off('mouseleave.slick', $.proxy(_.interrupt, _, false))
      if (_.options.accessibility === true) {
        _.$dots.off('keydown.slick', _.keyHandler)
      }
    }
    _.$slider.off('focus.slick blur.slick')
    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
      _.$prevArrow && _.$prevArrow.off('click.slick', _.changeSlide)
      _.$nextArrow && _.$nextArrow.off('click.slick', _.changeSlide)
      if (_.options.accessibility === true) {
        _.$prevArrow && _.$prevArrow.off('keydown.slick', _.keyHandler)
        _.$nextArrow && _.$nextArrow.off('keydown.slick', _.keyHandler)
      }
    }
    _.$list.off('touchstart.slick mousedown.slick', _.swipeHandler)
    _.$list.off('touchmove.slick mousemove.slick', _.swipeHandler)
    _.$list.off('touchend.slick mouseup.slick', _.swipeHandler)
    _.$list.off('touchcancel.slick mouseleave.slick', _.swipeHandler)
    _.$list.off('click.slick', _.clickHandler)
    $(document).off(_.visibilityChange, _.visibility)
    _.cleanUpSlideEvents()
    if (_.options.accessibility === true) {
      _.$list.off('keydown.slick', _.keyHandler)
    }
    if (_.options.focusOnSelect === true) {
      $(_.$slideTrack).children().off('click.slick', _.selectHandler)
    }
    $(window).off('orientationchange.slick.slick-' + _.instanceUid, _.orientationChange)
    $(window).off('resize.slick.slick-' + _.instanceUid, _.resize)
    $('[draggable!=true]', _.$slideTrack).off('dragstart', _.preventDefault)
    $(window).off('load.slick.slick-' + _.instanceUid, _.setPosition)
  }
  Slick.prototype.cleanUpSlideEvents = function () {
    var _ = this
    _.$list.off('mouseenter.slick', $.proxy(_.interrupt, _, true))
    _.$list.off('mouseleave.slick', $.proxy(_.interrupt, _, false))
  }
  Slick.prototype.cleanUpRows = function () {
    var _ = this,
      originalSlides
    if (_.options.rows > 0) {
      originalSlides = _.$slides.children().children()
      originalSlides.removeAttr('style')
      _.$slider.empty().append(originalSlides)
    }
  }
  Slick.prototype.clickHandler = function (event) {
    var _ = this
    if (_.shouldClick === false) {
      event.stopImmediatePropagation()
      event.stopPropagation()
      event.preventDefault()
    }
  }
  Slick.prototype.destroy = function (refresh) {
    var _ = this
    _.autoPlayClear()
    _.touchObject = {}
    _.cleanUpEvents()
    $('.slick-cloned', _.$slider).detach()
    if (_.$dots) {
      _.$dots.remove()
    }
    if (_.$prevArrow && _.$prevArrow.length) {
      _.$prevArrow
        .removeClass('slick-disabled slick-arrow slick-hidden')
        .removeAttr('aria-hidden aria-disabled tabindex')
        .css('display', '')
      if (_.htmlExpr.test(_.options.prevArrow)) {
        _.$prevArrow.remove()
      }
    }
    if (_.$nextArrow && _.$nextArrow.length) {
      _.$nextArrow
        .removeClass('slick-disabled slick-arrow slick-hidden')
        .removeAttr('aria-hidden aria-disabled tabindex')
        .css('display', '')
      if (_.htmlExpr.test(_.options.nextArrow)) {
        _.$nextArrow.remove()
      }
    }
    if (_.$slides) {
      _.$slides
        .removeClass('slick-slide slick-active slick-center slick-visible slick-current')
        .removeAttr('aria-hidden')
        .removeAttr('data-slick-index')
        .each(function () {
          $(this).attr('style', $(this).data('originalStyling'))
        })
      _.$slideTrack.children(this.options.slide).detach()
      _.$slideTrack.detach()
      _.$list.detach()
      _.$slider.append(_.$slides)
    }
    _.cleanUpRows()
    _.$slider.removeClass('slick-slider')
    _.$slider.removeClass('slick-initialized')
    _.$slider.removeClass('slick-dotted')
    _.unslicked = true
    if (!refresh) {
      _.$slider.trigger('destroy', [_])
    }
  }
  Slick.prototype.disableTransition = function (slide) {
    var _ = this,
      transition = {}
    transition[_.transitionType] = ''
    if (_.options.fade === false) {
      _.$slideTrack.css(transition)
    } else {
      _.$slides.eq(slide).css(transition)
    }
  }
  Slick.prototype.fadeSlide = function (slideIndex, callback) {
    var _ = this
    if (_.cssTransitions === false) {
      _.$slides.eq(slideIndex).css({ zIndex: _.options.zIndex })
      _.$slides.eq(slideIndex).animate({ opacity: 1 }, _.options.speed, _.options.easing, callback)
    } else {
      _.applyTransition(slideIndex)
      _.$slides.eq(slideIndex).css({ opacity: 1, zIndex: _.options.zIndex })
      if (callback) {
        setTimeout(function () {
          _.disableTransition(slideIndex)
          callback.call()
        }, _.options.speed)
      }
    }
  }
  Slick.prototype.fadeSlideOut = function (slideIndex) {
    var _ = this
    if (_.cssTransitions === false) {
      _.$slides
        .eq(slideIndex)
        .animate({ opacity: 0, zIndex: _.options.zIndex - 2 }, _.options.speed, _.options.easing)
    } else {
      _.applyTransition(slideIndex)
      _.$slides.eq(slideIndex).css({ opacity: 0, zIndex: _.options.zIndex - 2 })
    }
  }
  Slick.prototype.filterSlides = Slick.prototype.slickFilter = function (filter) {
    var _ = this
    if (filter !== null) {
      _.$slidesCache = _.$slides
      _.unload()
      _.$slideTrack.children(this.options.slide).detach()
      _.$slidesCache.filter(filter).appendTo(_.$slideTrack)
      _.reinit()
    }
  }
  Slick.prototype.focusHandler = function () {
    var _ = this
    _.$slider
      .off('focus.slick blur.slick')
      .on('focus.slick', '*', function (event) {
        var $sf = $(this)
        setTimeout(function () {
          if (_.options.pauseOnFocus) {
            if ($sf.is(':focus')) {
              _.focussed = true
              _.autoPlay()
            }
          }
        }, 0)
      })
      .on('blur.slick', '*', function (event) {
        var $sf = $(this)
        if (_.options.pauseOnFocus) {
          _.focussed = false
          _.autoPlay()
        }
      })
  }
  Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide = function () {
    var _ = this
    return _.currentSlide
  }
  Slick.prototype.getDotCount = function () {
    var _ = this
    var breakPoint = 0
    var counter = 0
    var pagerQty = 0
    if (_.options.infinite === true) {
      if (_.slideCount <= _.options.slidesToShow) {
        ++pagerQty
      } else {
        while (breakPoint < _.slideCount) {
          ++pagerQty
          breakPoint = counter + _.options.slidesToScroll
          counter +=
            _.options.slidesToScroll <= _.options.slidesToShow
              ? _.options.slidesToScroll
              : _.options.slidesToShow
        }
      }
    } else if (_.options.centerMode === true) {
      pagerQty = _.slideCount
    } else if (!_.options.asNavFor) {
      pagerQty = 1 + Math.ceil((_.slideCount - _.options.slidesToShow) / _.options.slidesToScroll)
    } else {
      while (breakPoint < _.slideCount) {
        ++pagerQty
        breakPoint = counter + _.options.slidesToScroll
        counter +=
          _.options.slidesToScroll <= _.options.slidesToShow
            ? _.options.slidesToScroll
            : _.options.slidesToShow
      }
    }
    return pagerQty - 1
  }
  Slick.prototype.getLeft = function (slideIndex) {
    var _ = this,
      targetLeft,
      verticalHeight,
      verticalOffset = 0,
      targetSlide,
      coef
    _.slideOffset = 0
    verticalHeight = _.$slides.first().outerHeight(true)
    if (_.options.infinite === true) {
      if (_.slideCount > _.options.slidesToShow) {
        _.slideOffset = _.slideWidth * _.options.slidesToShow * -1
        coef = -1
        if (_.options.vertical === true && _.options.centerMode === true) {
          if (_.options.slidesToShow === 2) {
            coef = -1.5
          } else if (_.options.slidesToShow === 1) {
            coef = -2
          }
        }
        verticalOffset = verticalHeight * _.options.slidesToShow * coef
      }
      if (_.slideCount % _.options.slidesToScroll !== 0) {
        if (
          slideIndex + _.options.slidesToScroll > _.slideCount &&
          _.slideCount > _.options.slidesToShow
        ) {
          if (slideIndex > _.slideCount) {
            _.slideOffset =
              (_.options.slidesToShow - (slideIndex - _.slideCount)) * _.slideWidth * -1
            verticalOffset =
              (_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight * -1
          } else {
            _.slideOffset = (_.slideCount % _.options.slidesToScroll) * _.slideWidth * -1
            verticalOffset = (_.slideCount % _.options.slidesToScroll) * verticalHeight * -1
          }
        }
      }
    } else {
      if (slideIndex + _.options.slidesToShow > _.slideCount) {
        _.slideOffset = (slideIndex + _.options.slidesToShow - _.slideCount) * _.slideWidth
        verticalOffset = (slideIndex + _.options.slidesToShow - _.slideCount) * verticalHeight
      }
    }
    if (_.slideCount <= _.options.slidesToShow) {
      _.slideOffset = 0
      verticalOffset = 0
    }
    if (_.options.centerMode === true && _.slideCount <= _.options.slidesToShow) {
      _.slideOffset =
        (_.slideWidth * Math.floor(_.options.slidesToShow)) / 2 - (_.slideWidth * _.slideCount) / 2
    } else if (_.options.centerMode === true && _.options.infinite === true) {
      _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth
    } else if (_.options.centerMode === true) {
      _.slideOffset = 0
      _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2)
    }
    if (_.options.vertical === false) {
      targetLeft = slideIndex * _.slideWidth * -1 + _.slideOffset
    } else {
      targetLeft = slideIndex * verticalHeight * -1 + verticalOffset
    }
    if (_.options.variableWidth === true) {
      if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
        targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex)
      } else {
        targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow)
      }
      if (_.options.rtl === true) {
        if (targetSlide[0]) {
          targetLeft =
            (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1
        } else {
          targetLeft = 0
        }
      } else {
        targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0
      }
      if (_.options.centerMode === true) {
        if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
          targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex)
        } else {
          targetSlide = _.$slideTrack
            .children('.slick-slide')
            .eq(slideIndex + _.options.slidesToShow + 1)
        }
        if (_.options.rtl === true) {
          if (targetSlide[0]) {
            targetLeft =
              (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1
          } else {
            targetLeft = 0
          }
        } else {
          targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0
        }
        targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2
      }
    }
    return targetLeft
  }
  Slick.prototype.getOption = Slick.prototype.slickGetOption = function (option) {
    var _ = this
    return _.options[option]
  }
  Slick.prototype.getNavigableIndexes = function () {
    var _ = this,
      breakPoint = 0,
      counter = 0,
      indexes = [],
      max
    if (_.options.infinite === false) {
      max = _.slideCount
    } else {
      breakPoint = _.options.slidesToScroll * -1
      counter = _.options.slidesToScroll * -1
      max = _.slideCount * 2
    }
    while (breakPoint < max) {
      indexes.push(breakPoint)
      breakPoint = counter + _.options.slidesToScroll
      counter +=
        _.options.slidesToScroll <= _.options.slidesToShow
          ? _.options.slidesToScroll
          : _.options.slidesToShow
    }
    return indexes
  }
  Slick.prototype.getSlick = function () {
    return this
  }
  Slick.prototype.getSlideCount = function () {
    var _ = this,
      slidesTraversed,
      swipedSlide,
      swipeTarget,
      centerOffset
    centerOffset = _.options.centerMode === true ? Math.floor(_.$list.width() / 2) : 0
    swipeTarget = _.swipeLeft * -1 + centerOffset
    if (_.options.swipeToSlide === true) {
      _.$slideTrack.find('.slick-slide').each(function (index, slide) {
        var slideOuterWidth, slideOffset, slideRightBoundary
        slideOuterWidth = $(slide).outerWidth()
        slideOffset = slide.offsetLeft
        if (_.options.centerMode !== true) {
          slideOffset += slideOuterWidth / 2
        }
        slideRightBoundary = slideOffset + slideOuterWidth
        if (swipeTarget < slideRightBoundary) {
          swipedSlide = slide
          return false
        }
      })
      slidesTraversed = Math.abs($(swipedSlide).attr('data-slick-index') - _.currentSlide) || 1
      return slidesTraversed
    } else {
      return _.options.slidesToScroll
    }
  }
  Slick.prototype.goTo = Slick.prototype.slickGoTo = function (slide, dontAnimate) {
    var _ = this
    _.changeSlide({ data: { message: 'index', index: parseInt(slide) } }, dontAnimate)
  }
  Slick.prototype.init = function (creation) {
    var _ = this
    if (!$(_.$slider).hasClass('slick-initialized')) {
      $(_.$slider).addClass('slick-initialized')
      _.buildRows()
      _.buildOut()
      _.setProps()
      _.startLoad()
      _.loadSlider()
      _.initializeEvents()
      _.updateArrows()
      _.updateDots()
      _.checkResponsive(true)
      _.focusHandler()
    }
    if (creation) {
      _.$slider.trigger('init', [_])
    }
    if (_.options.accessibility === true) {
      _.initADA()
    }
    if (_.options.autoplay) {
      _.paused = false
      _.autoPlay()
    }
  }
  Slick.prototype.initADA = function () {
    var _ = this,
      numDotGroups = Math.ceil(_.slideCount / _.options.slidesToShow),
      tabControlIndexes = _.getNavigableIndexes().filter(function (val) {
        return val >= 0 && val < _.slideCount
      })
    _.$slides
      .add(_.$slideTrack.find('.slick-cloned'))
      .attr({ 'aria-hidden': 'true', tabindex: '-1' })
      .find('a, input, button, select')
      .attr({ tabindex: '-1' })
    if (_.$dots !== null) {
      _.$slides.not(_.$slideTrack.find('.slick-cloned')).each(function (i) {
        var slideControlIndex = tabControlIndexes.indexOf(i)
        $(this).attr({
          role: 'tabpanel',
          id: 'slick-slide' + _.instanceUid + i,
          tabindex: -1,
        })
        if (slideControlIndex !== -1) {
          var ariaButtonControl = 'slick-slide-control' + _.instanceUid + slideControlIndex
          if ($('#' + ariaButtonControl).length) {
            $(this).attr({
              'aria-describedby': ariaButtonControl,
            })
          }
        }
      })
      _.$dots
        .attr('role', 'tablist')
        .find('li')
        .each(function (i) {
          var mappedSlideIndex = tabControlIndexes[i]
          $(this).attr({ role: 'presentation' })
          $(this)
            .find('button')
            .first()
            .attr({
              role: 'tab',
              id: 'slick-slide-control' + _.instanceUid + i,
              'aria-controls': 'slick-slide' + _.instanceUid + mappedSlideIndex,
              'aria-label': i + 1 + ' of ' + numDotGroups,
              'aria-selected': null,
              tabindex: '-1',
            })
        })
        .eq(_.currentSlide)
        .find('button')
        .attr({ 'aria-selected': 'true', tabindex: '0' })
        .end()
    }
    for (var i = _.currentSlide, max = i + _.options.slidesToShow; i < max; i++) {
      if (_.options.focusOnChange) {
        _.$slides.eq(i).attr({ tabindex: '0' })
      } else {
        _.$slides.eq(i).removeAttr('tabindex')
      }
    }
    _.activateADA()
  }
  Slick.prototype.initArrowEvents = function () {
    var _ = this
    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
      _.$prevArrow.off('click.slick').on('click.slick', { message: 'previous' }, _.changeSlide)
      _.$nextArrow.off('click.slick').on('click.slick', { message: 'next' }, _.changeSlide)
      if (_.options.accessibility === true) {
        _.$prevArrow.on('keydown.slick', _.keyHandler)
        _.$nextArrow.on('keydown.slick', _.keyHandler)
      }
    }
  }
  Slick.prototype.initDotEvents = function () {
    var _ = this
    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
      $('li', _.$dots).on('click.slick', { message: 'index' }, _.changeSlide)
      if (_.options.accessibility === true) {
        _.$dots.on('keydown.slick', _.keyHandler)
      }
    }
    if (
      _.options.dots === true &&
      _.options.pauseOnDotsHover === true &&
      _.slideCount > _.options.slidesToShow
    ) {
      $('li', _.$dots)
        .on('mouseenter.slick', $.proxy(_.interrupt, _, true))
        .on('mouseleave.slick', $.proxy(_.interrupt, _, false))
    }
  }
  Slick.prototype.initSlideEvents = function () {
    var _ = this
    if (_.options.pauseOnHover) {
      _.$list.on('mouseenter.slick', $.proxy(_.interrupt, _, true))
      _.$list.on('mouseleave.slick', $.proxy(_.interrupt, _, false))
    }
  }
  Slick.prototype.initializeEvents = function () {
    var _ = this
    _.initArrowEvents()
    _.initDotEvents()
    _.initSlideEvents()
    _.$list.on('touchstart.slick mousedown.slick', { action: 'start' }, _.swipeHandler)
    _.$list.on('touchmove.slick mousemove.slick', { action: 'move' }, _.swipeHandler)
    _.$list.on('touchend.slick mouseup.slick', { action: 'end' }, _.swipeHandler)
    _.$list.on('touchcancel.slick mouseleave.slick', { action: 'end' }, _.swipeHandler)
    _.$list.on('click.slick', _.clickHandler)
    $(document).on(_.visibilityChange, $.proxy(_.visibility, _))
    if (_.options.accessibility === true) {
      _.$list.on('keydown.slick', _.keyHandler)
    }
    if (_.options.focusOnSelect === true) {
      $(_.$slideTrack).children().on('click.slick', _.selectHandler)
    }
    $(window).on('orientationchange.slick.slick-' + _.instanceUid, $.proxy(_.orientationChange, _))
    $(window).on('resize.slick.slick-' + _.instanceUid, $.proxy(_.resize, _))
    $('[draggable!=true]', _.$slideTrack).on('dragstart', _.preventDefault)
    $(window).on('load.slick.slick-' + _.instanceUid, _.setPosition)
    $(_.setPosition)
  }
  Slick.prototype.initUI = function () {
    var _ = this
    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
      _.$prevArrow.show()
      _.$nextArrow.show()
    }
    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
      _.$dots.show()
    }
  }
  Slick.prototype.keyHandler = function (event) {
    var _ = this
    if (!event.target.tagName.match('TEXTAREA|INPUT|SELECT')) {
      if (event.keyCode === 37 && _.options.accessibility === true) {
        _.changeSlide({
          data: {
            message: _.options.rtl === true ? 'next' : 'previous',
          },
        })
      } else if (event.keyCode === 39 && _.options.accessibility === true) {
        _.changeSlide({
          data: {
            message: _.options.rtl === true ? 'previous' : 'next',
          },
        })
      }
    }
  }
  Slick.prototype.lazyLoad = function () {
    var _ = this,
      loadRange,
      cloneRange,
      rangeStart,
      rangeEnd
    function loadImages(imagesScope) {
      $('img[data-lazy]', imagesScope).each(function () {
        var image = $(this),
          imageSource = $(this).attr('data-lazy'),
          imageSrcSet = $(this).attr('data-srcset'),
          imageSizes = $(this).attr('data-sizes') || _.$slider.attr('data-sizes'),
          imageToLoad = document.createElement('img')
        imageToLoad.onload = function () {
          image.animate({ opacity: 0 }, 100, function () {
            if (imageSrcSet) {
              image.attr('srcset', imageSrcSet)
              if (imageSizes) {
                image.attr('sizes', imageSizes)
              }
            }
            image.attr('src', imageSource).animate({ opacity: 1 }, 200, function () {
              image.removeAttr('data-lazy data-srcset data-sizes').removeClass('slick-loading')
            })
            _.$slider.trigger('lazyLoaded', [_, image, imageSource])
          })
        }
        imageToLoad.onerror = function () {
          image
            .removeAttr('data-lazy')
            .removeClass('slick-loading')
            .addClass('slick-lazyload-error')
          _.$slider.trigger('lazyLoadError', [_, image, imageSource])
        }
        imageToLoad.src = imageSource
      })
    }
    if (_.options.centerMode === true) {
      if (_.options.infinite === true) {
        rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1)
        rangeEnd = rangeStart + _.options.slidesToShow + 2
      } else {
        rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1))
        rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide
      }
    } else {
      rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide
      rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow)
      if (_.options.fade === true) {
        if (rangeStart > 0) rangeStart--
        if (rangeEnd <= _.slideCount) rangeEnd++
      }
    }
    loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd)
    if (_.options.lazyLoad === 'anticipated') {
      var prevSlide = rangeStart - 1,
        nextSlide = rangeEnd,
        $slides = _.$slider.find('.slick-slide')
      for (var i = 0; i < _.options.slidesToScroll; i++) {
        if (prevSlide < 0) prevSlide = _.slideCount - 1
        loadRange = loadRange.add($slides.eq(prevSlide))
        loadRange = loadRange.add($slides.eq(nextSlide))
        prevSlide--
        nextSlide++
      }
    }
    loadImages(loadRange)
    if (_.slideCount <= _.options.slidesToShow) {
      cloneRange = _.$slider.find('.slick-slide')
      loadImages(cloneRange)
    } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
      cloneRange = _.$slider.find('.slick-cloned').slice(0, _.options.slidesToShow)
      loadImages(cloneRange)
    } else if (_.currentSlide === 0) {
      cloneRange = _.$slider.find('.slick-cloned').slice(_.options.slidesToShow * -1)
      loadImages(cloneRange)
    }
  }
  Slick.prototype.loadSlider = function () {
    var _ = this
    _.setPosition()
    _.$slideTrack.css({ opacity: 1 })
    _.$slider.removeClass('slick-loading')
    _.initUI()
    if (_.options.lazyLoad === 'progressive') {
      _.progressiveLazyLoad()
    }
  }
  Slick.prototype.next = Slick.prototype.slickNext = function () {
    var _ = this
    _.changeSlide({ data: { message: 'next' } })
  }
  Slick.prototype.orientationChange = function () {
    var _ = this
    _.checkResponsive()
    _.setPosition()
  }
  Slick.prototype.pause = Slick.prototype.slickPause = function () {
    var _ = this
    _.autoPlayClear()
    _.paused = true
  }
  Slick.prototype.play = Slick.prototype.slickPlay = function () {
    var _ = this
    _.autoPlay()
    _.options.autoplay = true
    _.paused = false
    _.focussed = false
    _.interrupted = false
  }
  Slick.prototype.postSlide = function (index) {
    var _ = this
    if (!_.unslicked) {
      _.$slider.trigger('afterChange', [_, index])
      _.animating = false
      if (_.slideCount > _.options.slidesToShow) {
        _.setPosition()
      }
      _.swipeLeft = null
      if (_.options.autoplay) {
        _.autoPlay()
      }
      if (_.options.accessibility === true) {
        _.initADA()
        if (_.options.focusOnChange) {
          var $currentSlide = $(_.$slides.get(_.currentSlide))
          $currentSlide.attr('tabindex', 0).focus()
        }
      }
    }
  }
  Slick.prototype.prev = Slick.prototype.slickPrev = function () {
    var _ = this
    _.changeSlide({ data: { message: 'previous' } })
  }
  Slick.prototype.preventDefault = function (event) {
    event.preventDefault()
  }
  Slick.prototype.progressiveLazyLoad = function (tryCount) {
    tryCount = tryCount || 1
    var _ = this,
      $imgsToLoad = $('img[data-lazy]', _.$slider),
      image,
      imageSource,
      imageSrcSet,
      imageSizes,
      imageToLoad
    if ($imgsToLoad.length) {
      image = $imgsToLoad.first()
      imageSource = image.attr('data-lazy')
      imageSrcSet = image.attr('data-srcset')
      imageSizes = image.attr('data-sizes') || _.$slider.attr('data-sizes')
      imageToLoad = document.createElement('img')
      imageToLoad.onload = function () {
        if (imageSrcSet) {
          image.attr('srcset', imageSrcSet)
          if (imageSizes) {
            image.attr('sizes', imageSizes)
          }
        }
        image
          .attr('src', imageSource)
          .removeAttr('data-lazy data-srcset data-sizes')
          .removeClass('slick-loading')
        if (_.options.adaptiveHeight === true) {
          _.setPosition()
        }
        _.$slider.trigger('lazyLoaded', [_, image, imageSource])
        _.progressiveLazyLoad()
      }
      imageToLoad.onerror = function () {
        if (tryCount < 3) {
          setTimeout(function () {
            _.progressiveLazyLoad(tryCount + 1)
          }, 500)
        } else {
          image
            .removeAttr('data-lazy')
            .removeClass('slick-loading')
            .addClass('slick-lazyload-error')
          _.$slider.trigger('lazyLoadError', [_, image, imageSource])
          _.progressiveLazyLoad()
        }
      }
      imageToLoad.src = imageSource
    } else {
      _.$slider.trigger('allImagesLoaded', [_])
    }
  }
  Slick.prototype.refresh = function (initializing) {
    var _ = this,
      currentSlide,
      lastVisibleIndex
    lastVisibleIndex = _.slideCount - _.options.slidesToShow
    if (!_.options.infinite && _.currentSlide > lastVisibleIndex) {
      _.currentSlide = lastVisibleIndex
    }
    if (_.slideCount <= _.options.slidesToShow) {
      _.currentSlide = 0
    }
    currentSlide = _.currentSlide
    _.destroy(true)
    $.extend(_, _.initials, { currentSlide: currentSlide })
    _.init()
    if (!initializing) {
      _.changeSlide({ data: { message: 'index', index: currentSlide } }, false)
    }
  }
  Slick.prototype.registerBreakpoints = function () {
    var _ = this,
      breakpoint,
      currentBreakpoint,
      l,
      responsiveSettings = _.options.responsive || null
    if ($.type(responsiveSettings) === 'array' && responsiveSettings.length) {
      _.respondTo = _.options.respondTo || 'window'
      for (breakpoint in responsiveSettings) {
        l = _.breakpoints.length - 1
        if (responsiveSettings.hasOwnProperty(breakpoint)) {
          currentBreakpoint = responsiveSettings[breakpoint].breakpoint
          while (l >= 0) {
            if (_.breakpoints[l] && _.breakpoints[l] === currentBreakpoint) {
              _.breakpoints.splice(l, 1)
            }
            l--
          }
          _.breakpoints.push(currentBreakpoint)
          _.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings
        }
      }
      _.breakpoints.sort(function (a, b) {
        return _.options.mobileFirst ? a - b : b - a
      })
    }
  }
  Slick.prototype.reinit = function () {
    var _ = this
    _.$slides = _.$slideTrack.children(_.options.slide).addClass('slick-slide')
    _.slideCount = _.$slides.length
    if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
      _.currentSlide = _.currentSlide - _.options.slidesToScroll
    }
    if (_.slideCount <= _.options.slidesToShow) {
      _.currentSlide = 0
    }
    _.registerBreakpoints()
    _.setProps()
    _.setupInfinite()
    _.buildArrows()
    _.updateArrows()
    _.initArrowEvents()
    _.buildDots()
    _.updateDots()
    _.initDotEvents()
    _.cleanUpSlideEvents()
    _.initSlideEvents()
    _.checkResponsive(false, true)
    if (_.options.focusOnSelect === true) {
      $(_.$slideTrack).children().on('click.slick', _.selectHandler)
    }
    _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0)
    _.setPosition()
    _.focusHandler()
    _.paused = !_.options.autoplay
    _.autoPlay()
    _.$slider.trigger('reInit', [_])
  }
  Slick.prototype.resize = function () {
    var _ = this
    if ($(window).width() !== _.windowWidth) {
      clearTimeout(_.windowDelay)
      _.windowDelay = window.setTimeout(function () {
        _.windowWidth = $(window).width()
        _.checkResponsive()
        if (!_.unslicked) {
          _.setPosition()
        }
      }, 50)
    }
  }
  Slick.prototype.removeSlide = Slick.prototype.slickRemove = function (
    index,
    removeBefore,
    removeAll,
  ) {
    var _ = this
    if (typeof index === 'boolean') {
      removeBefore = index
      index = removeBefore === true ? 0 : _.slideCount - 1
    } else {
      index = removeBefore === true ? --index : index
    }
    if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
      return false
    }
    _.unload()
    if (removeAll === true) {
      _.$slideTrack.children().remove()
    } else {
      _.$slideTrack.children(this.options.slide).eq(index).remove()
    }
    _.$slides = _.$slideTrack.children(this.options.slide)
    _.$slideTrack.children(this.options.slide).detach()
    _.$slideTrack.append(_.$slides)
    _.$slidesCache = _.$slides
    _.reinit()
  }
  Slick.prototype.setCSS = function (position) {
    var _ = this,
      positionProps = {},
      x,
      y
    if (_.options.rtl === true) {
      position = -position
    }
    x = _.positionProp == 'left' ? Math.ceil(position) + 'px' : '0px'
    y = _.positionProp == 'top' ? Math.ceil(position) + 'px' : '0px'
    positionProps[_.positionProp] = position
    if (_.transformsEnabled === false) {
      _.$slideTrack.css(positionProps)
    } else {
      positionProps = {}
      if (_.cssTransitions === false) {
        positionProps[_.animType] = 'translate(' + x + ', ' + y + ')'
        _.$slideTrack.css(positionProps)
      } else {
        positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)'
        _.$slideTrack.css(positionProps)
      }
    }
  }
  Slick.prototype.setDimensions = function () {
    var _ = this
    if (_.options.vertical === false) {
      if (_.options.centerMode === true) {
        _.$list.css({ padding: '0px ' + _.options.centerPadding })
      }
    } else {
      _.$list.height(_.$slides.first().outerHeight(true) * _.options.slidesToShow)
      if (_.options.centerMode === true) {
        _.$list.css({ padding: _.options.centerPadding + ' 0px' })
      }
    }
    _.listWidth = _.$list.width()
    _.listHeight = _.$list.height()
    if (_.options.vertical === false && _.options.variableWidth === false) {
      _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow)
      _.$slideTrack.width(Math.ceil(_.slideWidth * _.$slideTrack.children('.slick-slide').length))
    } else if (_.options.variableWidth === true) {
      _.$slideTrack.width(5e3 * _.slideCount)
    } else {
      _.slideWidth = Math.ceil(_.listWidth)
      _.$slideTrack.height(
        Math.ceil(
          _.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length,
        ),
      )
    }
    var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width()
    if (_.options.variableWidth === false)
      _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset)
  }
  Slick.prototype.setFade = function () {
    var _ = this,
      targetLeft
    _.$slides.each(function (index, element) {
      targetLeft = _.slideWidth * index * -1
      if (_.options.rtl === true) {
        $(element).css({
          position: 'relative',
          right: targetLeft,
          top: 0,
          zIndex: _.options.zIndex - 2,
          opacity: 0,
        })
      } else {
        $(element).css({
          position: 'relative',
          left: targetLeft,
          top: 0,
          zIndex: _.options.zIndex - 2,
          opacity: 0,
        })
      }
    })
    _.$slides.eq(_.currentSlide).css({ zIndex: _.options.zIndex - 1, opacity: 1 })
  }
  Slick.prototype.setHeight = function () {
    var _ = this
    if (
      _.options.slidesToShow === 1 &&
      _.options.adaptiveHeight === true &&
      _.options.vertical === false
    ) {
      var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true)
      _.$list.css('height', targetHeight)
    }
  }
  Slick.prototype.setOption = Slick.prototype.slickSetOption = function () {
    var _ = this,
      l,
      item,
      option,
      value,
      refresh = false,
      type
    if ($.type(arguments[0]) === 'object') {
      option = arguments[0]
      refresh = arguments[1]
      type = 'multiple'
    } else if ($.type(arguments[0]) === 'string') {
      option = arguments[0]
      value = arguments[1]
      refresh = arguments[2]
      if (arguments[0] === 'responsive' && $.type(arguments[1]) === 'array') {
        type = 'responsive'
      } else if (typeof arguments[1] !== 'undefined') {
        type = 'single'
      }
    }
    if (type === 'single') {
      _.options[option] = value
    } else if (type === 'multiple') {
      $.each(option, function (opt, val) {
        _.options[opt] = val
      })
    } else if (type === 'responsive') {
      for (item in value) {
        if ($.type(_.options.responsive) !== 'array') {
          _.options.responsive = [value[item]]
        } else {
          l = _.options.responsive.length - 1
          while (l >= 0) {
            if (_.options.responsive[l].breakpoint === value[item].breakpoint) {
              _.options.responsive.splice(l, 1)
            }
            l--
          }
          _.options.responsive.push(value[item])
        }
      }
    }
    if (refresh) {
      _.unload()
      _.reinit()
    }
  }
  Slick.prototype.setPosition = function () {
    var _ = this
    _.setDimensions()
    _.setHeight()
    if (_.options.fade === false) {
      _.setCSS(_.getLeft(_.currentSlide))
    } else {
      _.setFade()
    }
    _.$slider.trigger('setPosition', [_])
  }
  Slick.prototype.setProps = function () {
    var _ = this,
      bodyStyle = document.body.style
    _.positionProp = _.options.vertical === true ? 'top' : 'left'
    if (_.positionProp === 'top') {
      _.$slider.addClass('slick-vertical')
    } else {
      _.$slider.removeClass('slick-vertical')
    }
    if (
      bodyStyle.WebkitTransition !== undefined ||
      bodyStyle.MozTransition !== undefined ||
      bodyStyle.msTransition !== undefined
    ) {
      if (_.options.useCSS === true) {
        _.cssTransitions = true
      }
    }
    if (_.options.fade) {
      if (typeof _.options.zIndex === 'number') {
        if (_.options.zIndex < 3) {
          _.options.zIndex = 3
        }
      } else {
        _.options.zIndex = _.defaults.zIndex
      }
    }
    if (bodyStyle.OTransform !== undefined) {
      _.animType = 'OTransform'
      _.transformType = '-o-transform'
      _.transitionType = 'OTransition'
      if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined)
        _.animType = false
    }
    if (bodyStyle.MozTransform !== undefined) {
      _.animType = 'MozTransform'
      _.transformType = '-moz-transform'
      _.transitionType = 'MozTransition'
      if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined)
        _.animType = false
    }
    if (bodyStyle.webkitTransform !== undefined) {
      _.animType = 'webkitTransform'
      _.transformType = '-webkit-transform'
      _.transitionType = 'webkitTransition'
      if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined)
        _.animType = false
    }
    if (bodyStyle.msTransform !== undefined) {
      _.animType = 'msTransform'
      _.transformType = '-ms-transform'
      _.transitionType = 'msTransition'
      if (bodyStyle.msTransform === undefined) _.animType = false
    }
    if (bodyStyle.transform !== undefined && _.animType !== false) {
      _.animType = 'transform'
      _.transformType = 'transform'
      _.transitionType = 'transition'
    }
    _.transformsEnabled = _.options.useTransform && _.animType !== null && _.animType !== false
  }
  Slick.prototype.setSlideClasses = function (index) {
    var _ = this,
      centerOffset,
      allSlides,
      indexOffset,
      remainder
    allSlides = _.$slider
      .find('.slick-slide')
      .removeClass('slick-active slick-center slick-current')
      .attr('aria-hidden', 'true')
    _.$slides.eq(index).addClass('slick-current')
    if (_.options.centerMode === true) {
      var evenCoef = _.options.slidesToShow % 2 === 0 ? 1 : 0
      centerOffset = Math.floor(_.options.slidesToShow / 2)
      if (_.options.infinite === true) {
        if (index >= centerOffset && index <= _.slideCount - 1 - centerOffset) {
          _.$slides
            .slice(index - centerOffset + evenCoef, index + centerOffset + 1)
            .addClass('slick-active')
            .attr('aria-hidden', 'false')
        } else {
          indexOffset = _.options.slidesToShow + index
          allSlides
            .slice(indexOffset - centerOffset + 1 + evenCoef, indexOffset + centerOffset + 2)
            .addClass('slick-active')
            .attr('aria-hidden', 'false')
        }
        if (index === 0) {
          allSlides.eq(allSlides.length - 1 - _.options.slidesToShow).addClass('slick-center')
        } else if (index === _.slideCount - 1) {
          allSlides.eq(_.options.slidesToShow).addClass('slick-center')
        }
      }
      _.$slides.eq(index).addClass('slick-center')
    } else {
      if (index >= 0 && index <= _.slideCount - _.options.slidesToShow) {
        _.$slides
          .slice(index, index + _.options.slidesToShow)
          .addClass('slick-active')
          .attr('aria-hidden', 'false')
      } else if (allSlides.length <= _.options.slidesToShow) {
        allSlides.addClass('slick-active').attr('aria-hidden', 'false')
      } else {
        remainder = _.slideCount % _.options.slidesToShow
        indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index
        if (
          _.options.slidesToShow == _.options.slidesToScroll &&
          _.slideCount - index < _.options.slidesToShow
        ) {
          allSlides
            .slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder)
            .addClass('slick-active')
            .attr('aria-hidden', 'false')
        } else {
          allSlides
            .slice(indexOffset, indexOffset + _.options.slidesToShow)
            .addClass('slick-active')
            .attr('aria-hidden', 'false')
        }
      }
    }
    if (_.options.lazyLoad === 'ondemand' || _.options.lazyLoad === 'anticipated') {
      _.lazyLoad()
    }
  }
  Slick.prototype.setupInfinite = function () {
    var _ = this,
      i,
      slideIndex,
      infiniteCount
    if (_.options.fade === true) {
      _.options.centerMode = false
    }
    if (_.options.infinite === true && _.options.fade === false) {
      slideIndex = null
      if (_.slideCount > _.options.slidesToShow) {
        if (_.options.centerMode === true) {
          infiniteCount = _.options.slidesToShow + 1
        } else {
          infiniteCount = _.options.slidesToShow
        }
        for (i = _.slideCount; i > _.slideCount - infiniteCount; i -= 1) {
          slideIndex = i - 1
          $(_.$slides[slideIndex])
            .clone(true)
            .attr('id', '')
            .attr('data-slick-index', slideIndex - _.slideCount)
            .prependTo(_.$slideTrack)
            .addClass('slick-cloned')
        }
        for (i = 0; i < infiniteCount + _.slideCount; i += 1) {
          slideIndex = i
          $(_.$slides[slideIndex])
            .clone(true)
            .attr('id', '')
            .attr('data-slick-index', slideIndex + _.slideCount)
            .appendTo(_.$slideTrack)
            .addClass('slick-cloned')
        }
        _.$slideTrack
          .find('.slick-cloned')
          .find('[id]')
          .each(function () {
            $(this).attr('id', '')
          })
      }
    }
  }
  Slick.prototype.interrupt = function (toggle) {
    var _ = this
    if (!toggle) {
      _.autoPlay()
    }
    _.interrupted = toggle
  }
  Slick.prototype.selectHandler = function (event) {
    var _ = this
    var targetElement = $(event.target).is('.slick-slide')
      ? $(event.target)
      : $(event.target).parents('.slick-slide')
    var index = parseInt(targetElement.attr('data-slick-index'))
    if (!index) index = 0
    if (_.slideCount <= _.options.slidesToShow) {
      _.slideHandler(index, false, true)
      return
    }
    _.slideHandler(index)
  }
  Slick.prototype.slideHandler = function (index, sync, dontAnimate) {
    var targetSlide,
      animSlide,
      oldSlide,
      slideLeft,
      targetLeft = null,
      _ = this,
      navTarget
    sync = sync || false
    if (_.animating === true && _.options.waitForAnimate === true) {
      return
    }
    if (_.options.fade === true && _.currentSlide === index) {
      return
    }
    if (sync === false) {
      _.asNavFor(index)
    }
    targetSlide = index
    targetLeft = _.getLeft(targetSlide)
    slideLeft = _.getLeft(_.currentSlide)
    _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft
    if (
      _.options.infinite === false &&
      _.options.centerMode === false &&
      (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)
    ) {
      if (_.options.fade === false) {
        targetSlide = _.currentSlide
        if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
          _.animateSlide(slideLeft, function () {
            _.postSlide(targetSlide)
          })
        } else {
          _.postSlide(targetSlide)
        }
      }
      return
    } else if (
      _.options.infinite === false &&
      _.options.centerMode === true &&
      (index < 0 || index > _.slideCount - _.options.slidesToScroll)
    ) {
      if (_.options.fade === false) {
        targetSlide = _.currentSlide
        if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
          _.animateSlide(slideLeft, function () {
            _.postSlide(targetSlide)
          })
        } else {
          _.postSlide(targetSlide)
        }
      }
      return
    }
    if (_.options.autoplay) {
      clearInterval(_.autoPlayTimer)
    }
    if (targetSlide < 0) {
      if (_.slideCount % _.options.slidesToScroll !== 0) {
        animSlide = _.slideCount - (_.slideCount % _.options.slidesToScroll)
      } else {
        animSlide = _.slideCount + targetSlide
      }
    } else if (targetSlide >= _.slideCount) {
      if (_.slideCount % _.options.slidesToScroll !== 0) {
        animSlide = 0
      } else {
        animSlide = targetSlide - _.slideCount
      }
    } else {
      animSlide = targetSlide
    }
    _.animating = true
    _.$slider.trigger('beforeChange', [_, _.currentSlide, animSlide])
    oldSlide = _.currentSlide
    _.currentSlide = animSlide
    _.setSlideClasses(_.currentSlide)
    if (_.options.asNavFor) {
      navTarget = _.getNavTarget()
      navTarget = navTarget.slick('getSlick')
      if (navTarget.slideCount <= navTarget.options.slidesToShow) {
        navTarget.setSlideClasses(_.currentSlide)
      }
    }
    _.updateDots()
    _.updateArrows()
    if (_.options.fade === true) {
      if (dontAnimate !== true) {
        _.fadeSlideOut(oldSlide)
        _.fadeSlide(animSlide, function () {
          _.postSlide(animSlide)
        })
      } else {
        _.postSlide(animSlide)
      }
      _.animateHeight()
      return
    }
    if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
      _.animateSlide(targetLeft, function () {
        _.postSlide(animSlide)
      })
    } else {
      _.postSlide(animSlide)
    }
  }
  Slick.prototype.startLoad = function () {
    var _ = this
    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
      _.$prevArrow.hide()
      _.$nextArrow.hide()
    }
    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
      _.$dots.hide()
    }
    _.$slider.addClass('slick-loading')
  }
  Slick.prototype.swipeDirection = function () {
    var xDist,
      yDist,
      r,
      swipeAngle,
      _ = this
    xDist = _.touchObject.startX - _.touchObject.curX
    yDist = _.touchObject.startY - _.touchObject.curY
    r = Math.atan2(yDist, xDist)
    swipeAngle = Math.round((r * 180) / Math.PI)
    if (swipeAngle < 0) {
      swipeAngle = 360 - Math.abs(swipeAngle)
    }
    if (swipeAngle <= 45 && swipeAngle >= 0) {
      return _.options.rtl === false ? 'left' : 'right'
    }
    if (swipeAngle <= 360 && swipeAngle >= 315) {
      return _.options.rtl === false ? 'left' : 'right'
    }
    if (swipeAngle >= 135 && swipeAngle <= 225) {
      return _.options.rtl === false ? 'right' : 'left'
    }
    if (_.options.verticalSwiping === true) {
      if (swipeAngle >= 35 && swipeAngle <= 135) {
        return 'down'
      } else {
        return 'up'
      }
    }
    return 'vertical'
  }
  Slick.prototype.swipeEnd = function (event) {
    var _ = this,
      slideCount,
      direction
    _.dragging = false
    _.swiping = false
    if (_.scrolling) {
      _.scrolling = false
      return false
    }
    _.interrupted = false
    _.shouldClick = _.touchObject.swipeLength > 10 ? false : true
    if (_.touchObject.curX === undefined) {
      return false
    }
    if (_.touchObject.edgeHit === true) {
      _.$slider.trigger('edge', [_, _.swipeDirection()])
    }
    if (_.touchObject.swipeLength >= _.touchObject.minSwipe) {
      direction = _.swipeDirection()
      switch (direction) {
        case 'left':
        case 'down':
          slideCount = _.options.swipeToSlide
            ? _.checkNavigable(_.currentSlide + _.getSlideCount())
            : _.currentSlide + _.getSlideCount()
          _.currentDirection = 0
          break
        case 'right':
        case 'up':
          slideCount = _.options.swipeToSlide
            ? _.checkNavigable(_.currentSlide - _.getSlideCount())
            : _.currentSlide - _.getSlideCount()
          _.currentDirection = 1
          break
        default:
      }
      if (direction != 'vertical') {
        _.slideHandler(slideCount)
        _.touchObject = {}
        _.$slider.trigger('swipe', [_, direction])
      }
    } else {
      if (_.touchObject.startX !== _.touchObject.curX) {
        _.slideHandler(_.currentSlide)
        _.touchObject = {}
      }
    }
  }
  Slick.prototype.swipeHandler = function (event) {
    var _ = this
    if (_.options.swipe === false || ('ontouchend' in document && _.options.swipe === false)) {
      return
    } else if (_.options.draggable === false && event.type.indexOf('mouse') !== -1) {
      return
    }
    _.touchObject.fingerCount =
      event.originalEvent && event.originalEvent.touches !== undefined
        ? event.originalEvent.touches.length
        : 1
    _.touchObject.minSwipe = _.listWidth / _.options.touchThreshold
    if (_.options.verticalSwiping === true) {
      _.touchObject.minSwipe = _.listHeight / _.options.touchThreshold
    }
    switch (event.data.action) {
      case 'start':
        _.swipeStart(event)
        break
      case 'move':
        _.swipeMove(event)
        break
      case 'end':
        _.swipeEnd(event)
        break
    }
  }
  Slick.prototype.swipeMove = function (event) {
    var _ = this,
      edgeWasHit = false,
      curLeft,
      swipeDirection,
      swipeLength,
      positionOffset,
      touches,
      verticalSwipeLength
    touches = event.originalEvent !== undefined ? event.originalEvent.touches : null
    if (!_.dragging || _.scrolling || (touches && touches.length !== 1)) {
      return false
    }
    curLeft = _.getLeft(_.currentSlide)
    _.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX
    _.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY
    _.touchObject.swipeLength = Math.round(
      Math.sqrt(Math.pow(_.touchObject.curX - _.touchObject.startX, 2)),
    )
    verticalSwipeLength = Math.round(
      Math.sqrt(Math.pow(_.touchObject.curY - _.touchObject.startY, 2)),
    )
    if (!_.options.verticalSwiping && !_.swiping && verticalSwipeLength > 4) {
      _.scrolling = true
      return false
    }
    if (_.options.verticalSwiping === true) {
      _.touchObject.swipeLength = verticalSwipeLength
    }
    swipeDirection = _.swipeDirection()
    if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {
      _.swiping = true
      event.preventDefault()
    }
    positionOffset =
      (_.options.rtl === false ? 1 : -1) * (_.touchObject.curX > _.touchObject.startX ? 1 : -1)
    if (_.options.verticalSwiping === true) {
      positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1
    }
    swipeLength = _.touchObject.swipeLength
    _.touchObject.edgeHit = false
    if (_.options.infinite === false) {
      if (
        (_.currentSlide === 0 && swipeDirection === 'right') ||
        (_.currentSlide >= _.getDotCount() && swipeDirection === 'left')
      ) {
        swipeLength = _.touchObject.swipeLength * _.options.edgeFriction
        _.touchObject.edgeHit = true
      }
    }
    if (_.options.vertical === false) {
      _.swipeLeft = curLeft + swipeLength * positionOffset
    } else {
      _.swipeLeft = curLeft + swipeLength * (_.$list.height() / _.listWidth) * positionOffset
    }
    if (_.options.verticalSwiping === true) {
      _.swipeLeft = curLeft + swipeLength * positionOffset
    }
    if (_.options.fade === true || _.options.touchMove === false) {
      return false
    }
    if (_.animating === true) {
      _.swipeLeft = null
      return false
    }
    _.setCSS(_.swipeLeft)
  }
  Slick.prototype.swipeStart = function (event) {
    var _ = this,
      touches
    _.interrupted = true
    if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {
      _.touchObject = {}
      return false
    }
    if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
      touches = event.originalEvent.touches[0]
    }
    _.touchObject.startX = _.touchObject.curX =
      touches !== undefined ? touches.pageX : event.clientX
    _.touchObject.startY = _.touchObject.curY =
      touches !== undefined ? touches.pageY : event.clientY
    _.dragging = true
  }
  Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter = function () {
    var _ = this
    if (_.$slidesCache !== null) {
      _.unload()
      _.$slideTrack.children(this.options.slide).detach()
      _.$slidesCache.appendTo(_.$slideTrack)
      _.reinit()
    }
  }
  Slick.prototype.unload = function () {
    var _ = this
    $('.slick-cloned', _.$slider).remove()
    if (_.$dots) {
      _.$dots.remove()
    }
    if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {
      _.$prevArrow.remove()
    }
    if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {
      _.$nextArrow.remove()
    }
    _.$slides
      .removeClass('slick-slide slick-active slick-visible slick-current')
      .attr('aria-hidden', 'true')
      .css('width', '')
  }
  Slick.prototype.unslick = function (fromBreakpoint) {
    var _ = this
    _.$slider.trigger('unslick', [_, fromBreakpoint])
    _.destroy()
  }
  Slick.prototype.updateArrows = function () {
    var _ = this,
      centerOffset
    centerOffset = Math.floor(_.options.slidesToShow / 2)
    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow && !_.options.infinite) {
      _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false')
      _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false')
      if (_.currentSlide === 0) {
        _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true')
        _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false')
      } else if (
        _.currentSlide >= _.slideCount - _.options.slidesToShow &&
        _.options.centerMode === false
      ) {
        _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true')
        _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false')
      } else if (_.currentSlide >= _.slideCount - 1 && _.options.centerMode === true) {
        _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true')
        _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false')
      }
    }
  }
  Slick.prototype.updateDots = function () {
    var _ = this
    if (_.$dots !== null) {
      _.$dots.find('li').removeClass('slick-active').end()
      _.$dots
        .find('li')
        .eq(Math.floor(_.currentSlide / _.options.slidesToScroll))
        .addClass('slick-active')
    }
  }
  Slick.prototype.visibility = function () {
    var _ = this
    if (_.options.autoplay) {
      if (document[_.hidden]) {
        _.interrupted = true
      } else {
        _.interrupted = false
      }
    }
  }
  $.fn.slick = function () {
    var _ = this,
      opt = arguments[0],
      args = Array.prototype.slice.call(arguments, 1),
      l = _.length,
      i,
      ret
    for (i = 0; i < l; i++) {
      if (typeof opt == 'object' || typeof opt == 'undefined') _[i].slick = new Slick(_[i], opt)
      else ret = _[i].slick[opt].apply(_[i].slick, args)
      if (typeof ret != 'undefined') return ret
    }
    return _
  }
})
/*! device.js 0.1.57 */
;(function () {
  var a, b, c, d, e, f, g, h, i
  ;(window.device = {}),
    (b = window.document.documentElement),
    (i = window.navigator.userAgent.toLowerCase()),
    (device.ios = function () {
      return device.iphone() || device.ipod() || device.ipad()
    }),
    (device.iphone = function () {
      return c('iphone')
    }),
    (device.ipod = function () {
      return c('ipod')
    }),
    (device.ipad = function () {
      return c('ipad')
    }),
    (device.android = function () {
      return c('android')
    }),
    (device.androidPhone = function () {
      return device.android() && c('mobile')
    }),
    (device.androidTablet = function () {
      return device.android() && !c('mobile')
    }),
    (device.blackberry = function () {
      return c('blackberry') || c('bb10') || c('rim')
    }),
    (device.blackberryPhone = function () {
      return device.blackberry() && !c('tablet')
    }),
    (device.blackberryTablet = function () {
      return device.blackberry() && c('tablet')
    }),
    (device.windows = function () {
      return c('windows')
    }),
    (device.windowsPhone = function () {
      return device.windows() && c('phone')
    }),
    (device.windowsTablet = function () {
      return device.windows() && c('touch')
    }),
    (device.fxos = function () {
      return c('(mobile; rv:') || c('(tablet; rv:')
    }),
    (device.fxosPhone = function () {
      return device.fxos() && c('mobile')
    }),
    (device.fxosTablet = function () {
      return device.fxos() && c('tablet')
    }),
    (device.mobile = function () {
      return (
        device.androidPhone() ||
        device.iphone() ||
        device.ipod() ||
        device.windowsPhone() ||
        device.blackberryPhone() ||
        device.fxosPhone()
      )
    }),
    (device.tablet = function () {
      return (
        device.ipad() ||
        device.androidTablet() ||
        device.blackberryTablet() ||
        device.windowsTablet() ||
        device.fxosTablet()
      )
    }),
    (device.portrait = function () {
      return 90 !== Math.abs(window.orientation)
    }),
    (device.landscape = function () {
      return 90 === Math.abs(window.orientation)
    }),
    (c = function (a) {
      return -1 !== i.indexOf(a)
    }),
    (e = function (a) {
      var c
      return (c = new RegExp(a, 'i')), b.className.match(c)
    }),
    (a = function (a) {
      return e(a) ? void 0 : (b.className += ' ' + a)
    }),
    (g = function (a) {
      return e(a) ? (b.className = b.className.replace(a, '')) : void 0
    }),
    device.ios()
      ? device.ipad()
        ? a('ios ipad tablet')
        : device.iphone()
          ? a('ios iphone mobile')
          : device.ipod() && a('ios ipod mobile')
      : device.android()
        ? device.androidTablet()
          ? a('android tablet')
          : a('android mobile')
        : device.blackberry()
          ? device.blackberryTablet()
            ? a('blackberry tablet')
            : a('blackberry mobile')
          : device.windows()
            ? device.windowsTablet()
              ? a('windows tablet')
              : device.windowsPhone()
                ? a('windows mobile')
                : a('desktop')
            : device.fxos()
              ? device.fxosTablet()
                ? a('fxos tablet')
                : a('fxos mobile')
              : a('desktop'),
    (d = function () {
      return device.landscape() ? (g('portrait'), a('landscape')) : (g('landscape'), a('portrait'))
    }),
    (h = 'onorientationchange' in window),
    (f = h ? 'orientationchange' : 'resize'),
    window.addEventListener
      ? window.addEventListener(f, d, !1)
      : window.attachEvent
        ? window.attachEvent(f, d)
        : (window[f] = d),
    d()
}).call(this)
;('use strict')
!(function (e) {
  'function' == typeof define && define.amd
    ? define(e)
    : 'undefined' != typeof module && module.exports
      ? (module.exports = e())
      : (window.enterView = e.call(this))
})(function () {
  var e = function (e) {
    function n() {
      g =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (e) {
          return setTimeout(e, 1e3 / 60)
        }
    }
    function t() {
      if (h && 'number' == typeof h) {
        var e = Math.min(Math.max(0, h), 1)
        return q - e * q
      }
      return q
    }
    function i() {
      var e = document.documentElement.clientHeight,
        n = window.innerHeight || 0
      q = Math.max(e, n)
    }
    function o() {
      y = !1
      var e = t()
      ;(A = A.filter(function (n) {
        var t = n.getBoundingClientRect(),
          i = t.top,
          o = i < e
        if (o && !n.__enter_view) {
          if ((m(n), _)) return !1
        } else !o && n.__enter_view && w && w(n)
        return (n.__enter_view = o), !0
      })),
        A.length || window.removeEventListener('scroll', r, !0)
    }
    function r() {
      y || ((y = !0), g(o))
    }
    function u() {
      i(), o()
    }
    function f(e) {
      for (var n = e.length, t = [], i = 0; i < n; i += 1) t.push(e[i])
      return t
    }
    function c(e) {
      var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : document
      return 'string' == typeof e
        ? f(n.querySelectorAll(e))
        : e instanceof NodeList
          ? f(e)
          : e instanceof Array
            ? e
            : void 0
    }
    function d() {
      A = c(l)
    }
    function a() {
      window.addEventListener('resize', u, !0), window.addEventListener('scroll', r, !0), u()
    }
    function s() {
      var e = l && m
      e || console.error('must set selector and enter options'), n(), d(), a(), o()
    }
    var l = e.selector,
      m = e.enter,
      w = e.exit,
      v = e.offset,
      h = void 0 === v ? 0 : v,
      p = e.once,
      _ = void 0 !== p && p,
      g = null,
      y = !1,
      A = [],
      q = 0
    s()
  }
  return e
})
/*! nouislider - 11.1.0 - 2018-04-02 11:18:13 */
!(function (a) {
  'function' == typeof define && define.amd
    ? define([], a)
    : 'object' == typeof exports
      ? (module.exports = a())
      : (window.noUiSlider = a())
})(function () {
  'use strict'
  function a(a) {
    return 'object' == typeof a && 'function' == typeof a.to && 'function' == typeof a.from
  }
  function b(a) {
    a.parentElement.removeChild(a)
  }
  function c(a) {
    return null !== a && void 0 !== a
  }
  function d(a) {
    a.preventDefault()
  }
  function e(a) {
    return a.filter(function (a) {
      return !this[a] && (this[a] = !0)
    }, {})
  }
  function f(a, b) {
    return Math.round(a / b) * b
  }
  function g(a, b) {
    var c = a.getBoundingClientRect(),
      d = a.ownerDocument,
      e = d.documentElement,
      f = p(d)
    return (
      /webkit.*Chrome.*Mobile/i.test(navigator.userAgent) && (f.x = 0),
      b ? c.top + f.y - e.clientTop : c.left + f.x - e.clientLeft
    )
  }
  function h(a) {
    return 'number' == typeof a && !isNaN(a) && isFinite(a)
  }
  function i(a, b, c) {
    c > 0 &&
      (m(a, b),
      setTimeout(function () {
        n(a, b)
      }, c))
  }
  function j(a) {
    return Math.max(Math.min(a, 100), 0)
  }
  function k(a) {
    return Array.isArray(a) ? a : [a]
  }
  function l(a) {
    a = String(a)
    var b = a.split('.')
    return b.length > 1 ? b[1].length : 0
  }
  function m(a, b) {
    a.classList ? a.classList.add(b) : (a.className += ' ' + b)
  }
  function n(a, b) {
    a.classList
      ? a.classList.remove(b)
      : (a.className = a.className.replace(
          new RegExp('(^|\\b)' + b.split(' ').join('|') + '(\\b|$)', 'gi'),
          ' ',
        ))
  }
  function o(a, b) {
    return a.classList ? a.classList.contains(b) : new RegExp('\\b' + b + '\\b').test(a.className)
  }
  function p(a) {
    var b = void 0 !== window.pageXOffset,
      c = 'CSS1Compat' === (a.compatMode || '')
    return {
      x: b ? window.pageXOffset : c ? a.documentElement.scrollLeft : a.body.scrollLeft,
      y: b ? window.pageYOffset : c ? a.documentElement.scrollTop : a.body.scrollTop,
    }
  }
  function q() {
    return window.navigator.pointerEnabled
      ? { start: 'pointerdown', move: 'pointermove', end: 'pointerup' }
      : window.navigator.msPointerEnabled
        ? {
            start: 'MSPointerDown',
            move: 'MSPointerMove',
            end: 'MSPointerUp',
          }
        : {
            start: 'mousedown touchstart',
            move: 'mousemove touchmove',
            end: 'mouseup touchend',
          }
  }
  function r() {
    var a = !1
    try {
      var b = Object.defineProperty({}, 'passive', {
        get: function () {
          a = !0
        },
      })
      window.addEventListener('test', null, b)
    } catch (a) {}
    return a
  }
  function s() {
    return window.CSS && CSS.supports && CSS.supports('touch-action', 'none')
  }
  function t(a, b) {
    return 100 / (b - a)
  }
  function u(a, b) {
    return (100 * b) / (a[1] - a[0])
  }
  function v(a, b) {
    return u(a, a[0] < 0 ? b + Math.abs(a[0]) : b - a[0])
  }
  function w(a, b) {
    return (b * (a[1] - a[0])) / 100 + a[0]
  }
  function x(a, b) {
    for (var c = 1; a >= b[c]; ) c += 1
    return c
  }
  function y(a, b, c) {
    if (c >= a.slice(-1)[0]) return 100
    var d = x(c, a),
      e = a[d - 1],
      f = a[d],
      g = b[d - 1],
      h = b[d]
    return g + v([e, f], c) / t(g, h)
  }
  function z(a, b, c) {
    if (c >= 100) return a.slice(-1)[0]
    var d = x(c, b),
      e = a[d - 1],
      f = a[d],
      g = b[d - 1]
    return w([e, f], (c - g) * t(g, b[d]))
  }
  function A(a, b, c, d) {
    if (100 === d) return d
    var e = x(d, a),
      g = a[e - 1],
      h = a[e]
    return c ? (d - g > (h - g) / 2 ? h : g) : b[e - 1] ? a[e - 1] + f(d - a[e - 1], b[e - 1]) : d
  }
  function B(a, b, c) {
    var d
    if (('number' == typeof b && (b = [b]), !Array.isArray(b)))
      throw new Error('noUiSlider (' + $ + "): 'range' contains invalid value.")
    if (((d = 'min' === a ? 0 : 'max' === a ? 100 : parseFloat(a)), !h(d) || !h(b[0])))
      throw new Error('noUiSlider (' + $ + "): 'range' value isn't numeric.")
    c.xPct.push(d),
      c.xVal.push(b[0]),
      d ? c.xSteps.push(!isNaN(b[1]) && b[1]) : isNaN(b[1]) || (c.xSteps[0] = b[1]),
      c.xHighestCompleteStep.push(0)
  }
  function C(a, b, c) {
    if (!b) return !0
    c.xSteps[a] = u([c.xVal[a], c.xVal[a + 1]], b) / t(c.xPct[a], c.xPct[a + 1])
    var d = (c.xVal[a + 1] - c.xVal[a]) / c.xNumSteps[a],
      e = Math.ceil(Number(d.toFixed(3)) - 1),
      f = c.xVal[a] + c.xNumSteps[a] * e
    c.xHighestCompleteStep[a] = f
  }
  function D(a, b, c) {
    ;(this.xPct = []),
      (this.xVal = []),
      (this.xSteps = [c || !1]),
      (this.xNumSteps = [!1]),
      (this.xHighestCompleteStep = []),
      (this.snap = b)
    var d,
      e = []
    for (d in a) a.hasOwnProperty(d) && e.push([a[d], d])
    for (
      e.length && 'object' == typeof e[0][0]
        ? e.sort(function (a, b) {
            return a[0][0] - b[0][0]
          })
        : e.sort(function (a, b) {
            return a[0] - b[0]
          }),
        d = 0;
      d < e.length;
      d++
    )
      B(e[d][1], e[d][0], this)
    for (this.xNumSteps = this.xSteps.slice(0), d = 0; d < this.xNumSteps.length; d++)
      C(d, this.xNumSteps[d], this)
  }
  function E(b) {
    if (a(b)) return !0
    throw new Error('noUiSlider (' + $ + "): 'format' requires 'to' and 'from' methods.")
  }
  function F(a, b) {
    if (!h(b)) throw new Error('noUiSlider (' + $ + "): 'step' is not numeric.")
    a.singleStep = b
  }
  function G(a, b) {
    if ('object' != typeof b || Array.isArray(b))
      throw new Error('noUiSlider (' + $ + "): 'range' is not an object.")
    if (void 0 === b.min || void 0 === b.max)
      throw new Error('noUiSlider (' + $ + "): Missing 'min' or 'max' in 'range'.")
    if (b.min === b.max)
      throw new Error('noUiSlider (' + $ + "): 'range' 'min' and 'max' cannot be equal.")
    a.spectrum = new D(b, a.snap, a.singleStep)
  }
  function H(a, b) {
    if (((b = k(b)), !Array.isArray(b) || !b.length))
      throw new Error('noUiSlider (' + $ + "): 'start' option is incorrect.")
    ;(a.handles = b.length), (a.start = b)
  }
  function I(a, b) {
    if (((a.snap = b), 'boolean' != typeof b))
      throw new Error('noUiSlider (' + $ + "): 'snap' option must be a boolean.")
  }
  function J(a, b) {
    if (((a.animate = b), 'boolean' != typeof b))
      throw new Error('noUiSlider (' + $ + "): 'animate' option must be a boolean.")
  }
  function K(a, b) {
    if (((a.animationDuration = b), 'number' != typeof b))
      throw new Error('noUiSlider (' + $ + "): 'animationDuration' option must be a number.")
  }
  function L(a, b) {
    var c,
      d = [!1]
    if (('lower' === b ? (b = [!0, !1]) : 'upper' === b && (b = [!1, !0]), !0 === b || !1 === b)) {
      for (c = 1; c < a.handles; c++) d.push(b)
      d.push(!1)
    } else {
      if (!Array.isArray(b) || !b.length || b.length !== a.handles + 1)
        throw new Error('noUiSlider (' + $ + "): 'connect' option doesn't match handle count.")
      d = b
    }
    a.connect = d
  }
  function M(a, b) {
    switch (b) {
      case 'horizontal':
        a.ort = 0
        break
      case 'vertical':
        a.ort = 1
        break
      default:
        throw new Error('noUiSlider (' + $ + "): 'orientation' option is invalid.")
    }
  }
  function N(a, b) {
    if (!h(b)) throw new Error('noUiSlider (' + $ + "): 'margin' option must be numeric.")
    if (0 !== b && ((a.margin = a.spectrum.getMargin(b)), !a.margin))
      throw new Error(
        'noUiSlider (' + $ + "): 'margin' option is only supported on linear sliders.",
      )
  }
  function O(a, b) {
    if (!h(b)) throw new Error('noUiSlider (' + $ + "): 'limit' option must be numeric.")
    if (((a.limit = a.spectrum.getMargin(b)), !a.limit || a.handles < 2))
      throw new Error(
        'noUiSlider (' +
          $ +
          "): 'limit' option is only supported on linear sliders with 2 or more handles.",
      )
  }
  function P(a, b) {
    if (!h(b) && !Array.isArray(b))
      throw new Error(
        'noUiSlider (' + $ + "): 'padding' option must be numeric or array of exactly 2 numbers.",
      )
    if (Array.isArray(b) && 2 !== b.length && !h(b[0]) && !h(b[1]))
      throw new Error(
        'noUiSlider (' + $ + "): 'padding' option must be numeric or array of exactly 2 numbers.",
      )
    if (0 !== b) {
      if (
        (Array.isArray(b) || (b = [b, b]),
        (a.padding = [a.spectrum.getMargin(b[0]), a.spectrum.getMargin(b[1])]),
        !1 === a.padding[0] || !1 === a.padding[1])
      )
        throw new Error(
          'noUiSlider (' + $ + "): 'padding' option is only supported on linear sliders.",
        )
      if (a.padding[0] < 0 || a.padding[1] < 0)
        throw new Error('noUiSlider (' + $ + "): 'padding' option must be a positive number(s).")
      if (a.padding[0] + a.padding[1] >= 100)
        throw new Error(
          'noUiSlider (' + $ + "): 'padding' option must not exceed 100% of the range.",
        )
    }
  }
  function Q(a, b) {
    switch (b) {
      case 'ltr':
        a.dir = 0
        break
      case 'rtl':
        a.dir = 1
        break
      default:
        throw new Error('noUiSlider (' + $ + "): 'direction' option was not recognized.")
    }
  }
  function R(a, b) {
    if ('string' != typeof b)
      throw new Error('noUiSlider (' + $ + "): 'behaviour' must be a string containing options.")
    var c = b.indexOf('tap') >= 0,
      d = b.indexOf('drag') >= 0,
      e = b.indexOf('fixed') >= 0,
      f = b.indexOf('snap') >= 0,
      g = b.indexOf('hover') >= 0
    if (e) {
      if (2 !== a.handles)
        throw new Error('noUiSlider (' + $ + "): 'fixed' behaviour must be used with 2 handles")
      N(a, a.start[1] - a.start[0])
    }
    a.events = { tap: c || f, drag: d, fixed: e, snap: f, hover: g }
  }
  function S(a, b) {
    if (!1 !== b)
      if (!0 === b) {
        a.tooltips = []
        for (var c = 0; c < a.handles; c++) a.tooltips.push(!0)
      } else {
        if (((a.tooltips = k(b)), a.tooltips.length !== a.handles))
          throw new Error('noUiSlider (' + $ + '): must pass a formatter for all handles.')
        a.tooltips.forEach(function (a) {
          if ('boolean' != typeof a && ('object' != typeof a || 'function' != typeof a.to))
            throw new Error(
              'noUiSlider (' + $ + "): 'tooltips' must be passed a formatter or 'false'.",
            )
        })
      }
  }
  function T(a, b) {
    ;(a.ariaFormat = b), E(b)
  }
  function U(a, b) {
    ;(a.format = b), E(b)
  }
  function V(a, b) {
    if ('string' != typeof b && !1 !== b)
      throw new Error('noUiSlider (' + $ + "): 'cssPrefix' must be a string or `false`.")
    a.cssPrefix = b
  }
  function W(a, b) {
    if ('object' != typeof b)
      throw new Error('noUiSlider (' + $ + "): 'cssClasses' must be an object.")
    if ('string' == typeof a.cssPrefix) {
      a.cssClasses = {}
      for (var c in b) b.hasOwnProperty(c) && (a.cssClasses[c] = a.cssPrefix + b[c])
    } else a.cssClasses = b
  }
  function X(a) {
    var b = {
        margin: 0,
        limit: 0,
        padding: 0,
        animate: !0,
        animationDuration: 300,
        ariaFormat: _,
        format: _,
      },
      d = {
        step: { r: !1, t: F },
        start: { r: !0, t: H },
        connect: { r: !0, t: L },
        direction: { r: !0, t: Q },
        snap: { r: !1, t: I },
        animate: { r: !1, t: J },
        animationDuration: { r: !1, t: K },
        range: { r: !0, t: G },
        orientation: { r: !1, t: M },
        margin: { r: !1, t: N },
        limit: { r: !1, t: O },
        padding: { r: !1, t: P },
        behaviour: { r: !0, t: R },
        ariaFormat: { r: !1, t: T },
        format: { r: !1, t: U },
        tooltips: { r: !1, t: S },
        cssPrefix: { r: !0, t: V },
        cssClasses: { r: !0, t: W },
      },
      e = {
        connect: !1,
        direction: 'ltr',
        behaviour: 'tap',
        orientation: 'horizontal',
        cssPrefix: 'noUi-',
        cssClasses: {
          target: 'target',
          base: 'base',
          origin: 'origin',
          handle: 'handle',
          handleLower: 'handle-lower',
          handleUpper: 'handle-upper',
          horizontal: 'horizontal',
          vertical: 'vertical',
          background: 'background',
          connect: 'connect',
          connects: 'connects',
          ltr: 'ltr',
          rtl: 'rtl',
          draggable: 'draggable',
          drag: 'state-drag',
          tap: 'state-tap',
          active: 'active',
          tooltip: 'tooltip',
          pips: 'pips',
          pipsHorizontal: 'pips-horizontal',
          pipsVertical: 'pips-vertical',
          marker: 'marker',
          markerHorizontal: 'marker-horizontal',
          markerVertical: 'marker-vertical',
          markerNormal: 'marker-normal',
          markerLarge: 'marker-large',
          markerSub: 'marker-sub',
          value: 'value',
          valueHorizontal: 'value-horizontal',
          valueVertical: 'value-vertical',
          valueNormal: 'value-normal',
          valueLarge: 'value-large',
          valueSub: 'value-sub',
        },
      }
    a.format && !a.ariaFormat && (a.ariaFormat = a.format),
      Object.keys(d).forEach(function (f) {
        if (!c(a[f]) && void 0 === e[f]) {
          if (d[f].r) throw new Error('noUiSlider (' + $ + "): '" + f + "' is required.")
          return !0
        }
        d[f].t(b, c(a[f]) ? a[f] : e[f])
      }),
      (b.pips = a.pips)
    var f = document.createElement('div'),
      g = void 0 !== f.style.msTransform,
      h = void 0 !== f.style.transform
    b.transformRule = h ? 'transform' : g ? 'msTransform' : 'webkitTransform'
    var i = [
      ['left', 'top'],
      ['right', 'bottom'],
    ]
    return (b.style = i[b.dir][b.ort]), b
  }
  function Y(a, c, f) {
    function h(a, b) {
      var c = ya.createElement('div')
      return b && m(c, b), a.appendChild(c), c
    }
    function l(a, b) {
      var d = h(a, c.cssClasses.origin),
        e = h(d, c.cssClasses.handle)
      return (
        e.setAttribute('data-handle', b),
        e.setAttribute('tabindex', '0'),
        e.setAttribute('role', 'slider'),
        e.setAttribute('aria-orientation', c.ort ? 'vertical' : 'horizontal'),
        0 === b
          ? m(e, c.cssClasses.handleLower)
          : b === c.handles - 1 && m(e, c.cssClasses.handleUpper),
        d
      )
    }
    function t(a, b) {
      return !!b && h(a, c.cssClasses.connect)
    }
    function u(a, b) {
      var d = h(b, c.cssClasses.connects)
      ;(ka = []), (la = []), la.push(t(d, a[0]))
      for (var e = 0; e < c.handles; e++) ka.push(l(b, e)), (ta[e] = e), la.push(t(d, a[e + 1]))
    }
    function v(a) {
      m(a, c.cssClasses.target),
        0 === c.dir ? m(a, c.cssClasses.ltr) : m(a, c.cssClasses.rtl),
        0 === c.ort ? m(a, c.cssClasses.horizontal) : m(a, c.cssClasses.vertical),
        (ja = h(a, c.cssClasses.base))
    }
    function w(a, b) {
      return !!c.tooltips[b] && h(a.firstChild, c.cssClasses.tooltip)
    }
    function x() {
      var a = ka.map(w)
      Q('update', function (b, d, e) {
        if (a[d]) {
          var f = b[d]
          !0 !== c.tooltips[d] && (f = c.tooltips[d].to(e[d])), (a[d].innerHTML = f)
        }
      })
    }
    function y() {
      Q('update', function (a, b, d, e, f) {
        ta.forEach(function (a) {
          var b = ka[a],
            e = U(sa, a, 0, !0, !0, !0),
            g = U(sa, a, 100, !0, !0, !0),
            h = f[a],
            i = c.ariaFormat.to(d[a])
          b.children[0].setAttribute('aria-valuemin', e.toFixed(1)),
            b.children[0].setAttribute('aria-valuemax', g.toFixed(1)),
            b.children[0].setAttribute('aria-valuenow', h.toFixed(1)),
            b.children[0].setAttribute('aria-valuetext', i)
        })
      })
    }
    function z(a, b, c) {
      if ('range' === a || 'steps' === a) return va.xVal
      if ('count' === a) {
        if (b < 2)
          throw new Error('noUiSlider (' + $ + "): 'values' (>= 2) required for mode 'count'.")
        var d = b - 1,
          e = 100 / d
        for (b = []; d--; ) b[d] = d * e
        b.push(100), (a = 'positions')
      }
      return 'positions' === a
        ? b.map(function (a) {
            return va.fromStepping(c ? va.getStep(a) : a)
          })
        : 'values' === a
          ? c
            ? b.map(function (a) {
                return va.fromStepping(va.getStep(va.toStepping(a)))
              })
            : b
          : void 0
    }
    function A(a, b, c) {
      function d(a, b) {
        return (a + b).toFixed(7) / 1
      }
      var f = {},
        g = va.xVal[0],
        h = va.xVal[va.xVal.length - 1],
        i = !1,
        j = !1,
        k = 0
      return (
        (c = e(
          c.slice().sort(function (a, b) {
            return a - b
          }),
        )),
        c[0] !== g && (c.unshift(g), (i = !0)),
        c[c.length - 1] !== h && (c.push(h), (j = !0)),
        c.forEach(function (e, g) {
          var h,
            l,
            m,
            n,
            o,
            p,
            q,
            r,
            s,
            t,
            u = e,
            v = c[g + 1]
          if (('steps' === b && (h = va.xNumSteps[g]), h || (h = v - u), !1 !== u && void 0 !== v))
            for (h = Math.max(h, 1e-7), l = u; l <= v; l = d(l, h)) {
              for (
                n = va.toStepping(l), o = n - k, r = o / a, s = Math.round(r), t = o / s, m = 1;
                m <= s;
                m += 1
              )
                (p = k + m * t), (f[p.toFixed(5)] = ['x', 0])
              ;(q = c.indexOf(l) > -1 ? 1 : 'steps' === b ? 2 : 0),
                !g && i && (q = 0),
                (l === v && j) || (f[n.toFixed(5)] = [l, q]),
                (k = n)
            }
        }),
        f
      )
    }
    function B(a, b, d) {
      function e(a, b) {
        var d = b === c.cssClasses.value,
          e = d ? k : l,
          f = d ? i : j
        return b + ' ' + e[c.ort] + ' ' + f[a]
      }
      function f(a, f) {
        f[1] = f[1] && b ? b(f[0], f[1]) : f[1]
        var i = h(g, !1)
        ;(i.className = e(f[1], c.cssClasses.marker)),
          (i.style[c.style] = a + '%'),
          f[1] &&
            ((i = h(g, !1)),
            (i.className = e(f[1], c.cssClasses.value)),
            i.setAttribute('data-value', f[0]),
            (i.style[c.style] = a + '%'),
            (i.innerText = d.to(f[0])))
      }
      var g = ya.createElement('div'),
        i = [c.cssClasses.valueNormal, c.cssClasses.valueLarge, c.cssClasses.valueSub],
        j = [c.cssClasses.markerNormal, c.cssClasses.markerLarge, c.cssClasses.markerSub],
        k = [c.cssClasses.valueHorizontal, c.cssClasses.valueVertical],
        l = [c.cssClasses.markerHorizontal, c.cssClasses.markerVertical]
      return (
        m(g, c.cssClasses.pips),
        m(g, 0 === c.ort ? c.cssClasses.pipsHorizontal : c.cssClasses.pipsVertical),
        Object.keys(a).forEach(function (b) {
          f(b, a[b])
        }),
        g
      )
    }
    function C() {
      na && (b(na), (na = null))
    }
    function D(a) {
      C()
      var b = a.mode,
        c = a.density || 1,
        d = a.filter || !1,
        e = a.values || !1,
        f = a.stepped || !1,
        g = z(b, e, f),
        h = A(c, b, g),
        i = a.format || { to: Math.round }
      return (na = ra.appendChild(B(h, d, i)))
    }
    function E() {
      var a = ja.getBoundingClientRect(),
        b = 'offset' + ['Width', 'Height'][c.ort]
      return 0 === c.ort ? a.width || ja[b] : a.height || ja[b]
    }
    function F(a, b, d, e) {
      var f = function (f) {
          return (
            !!(f = G(f, e.pageOffset, e.target || b)) &&
            !(ra.hasAttribute('disabled') && !e.doNotReject) &&
            !(o(ra, c.cssClasses.tap) && !e.doNotReject) &&
            !(a === oa.start && void 0 !== f.buttons && f.buttons > 1) &&
            (!e.hover || !f.buttons) &&
            (qa || f.preventDefault(), (f.calcPoint = f.points[c.ort]), void d(f, e))
          )
        },
        g = []
      return (
        a.split(' ').forEach(function (a) {
          b.addEventListener(a, f, !!qa && { passive: !0 }), g.push([a, f])
        }),
        g
      )
    }
    function G(a, b, c) {
      var d,
        e,
        f = 0 === a.type.indexOf('touch'),
        g = 0 === a.type.indexOf('mouse'),
        h = 0 === a.type.indexOf('pointer')
      if ((0 === a.type.indexOf('MSPointer') && (h = !0), f)) {
        var i = function (a) {
          return a.target === c || c.contains(a.target)
        }
        if ('touchstart' === a.type) {
          var j = Array.prototype.filter.call(a.touches, i)
          if (j.length > 1) return !1
          ;(d = j[0].pageX), (e = j[0].pageY)
        } else {
          var k = Array.prototype.find.call(a.changedTouches, i)
          if (!k) return !1
          ;(d = k.pageX), (e = k.pageY)
        }
      }
      return (
        (b = b || p(ya)),
        (g || h) && ((d = a.clientX + b.x), (e = a.clientY + b.y)),
        (a.pageOffset = b),
        (a.points = [d, e]),
        (a.cursor = g || h),
        a
      )
    }
    function H(a) {
      var b = a - g(ja, c.ort),
        d = (100 * b) / E()
      return (d = j(d)), c.dir ? 100 - d : d
    }
    function I(a) {
      var b = 100,
        c = !1
      return (
        ka.forEach(function (d, e) {
          if (!d.hasAttribute('disabled')) {
            var f = Math.abs(sa[e] - a)
            ;(f < b || (100 === f && 100 === b)) && ((c = e), (b = f))
          }
        }),
        c
      )
    }
    function J(a, b) {
      'mouseout' === a.type && 'HTML' === a.target.nodeName && null === a.relatedTarget && L(a, b)
    }
    function K(a, b) {
      if (
        -1 === navigator.appVersion.indexOf('MSIE 9') &&
        0 === a.buttons &&
        0 !== b.buttonsProperty
      )
        return L(a, b)
      var d = (c.dir ? -1 : 1) * (a.calcPoint - b.startCalcPoint)
      W(d > 0, (100 * d) / b.baseSize, b.locations, b.handleNumbers)
    }
    function L(a, b) {
      b.handle && (n(b.handle, c.cssClasses.active), (ua -= 1)),
        b.listeners.forEach(function (a) {
          za.removeEventListener(a[0], a[1])
        }),
        0 === ua &&
          (n(ra, c.cssClasses.drag),
          _(),
          a.cursor && ((Aa.style.cursor = ''), Aa.removeEventListener('selectstart', d))),
        b.handleNumbers.forEach(function (a) {
          S('change', a), S('set', a), S('end', a)
        })
    }
    function M(a, b) {
      var e
      if (1 === b.handleNumbers.length) {
        var f = ka[b.handleNumbers[0]]
        if (f.hasAttribute('disabled')) return !1
        ;(e = f.children[0]), (ua += 1), m(e, c.cssClasses.active)
      }
      a.stopPropagation()
      var g = [],
        h = F(oa.move, za, K, {
          target: a.target,
          handle: e,
          listeners: g,
          startCalcPoint: a.calcPoint,
          baseSize: E(),
          pageOffset: a.pageOffset,
          handleNumbers: b.handleNumbers,
          buttonsProperty: a.buttons,
          locations: sa.slice(),
        }),
        i = F(oa.end, za, L, {
          target: a.target,
          handle: e,
          listeners: g,
          doNotReject: !0,
          handleNumbers: b.handleNumbers,
        }),
        j = F('mouseout', za, J, {
          target: a.target,
          handle: e,
          listeners: g,
          doNotReject: !0,
          handleNumbers: b.handleNumbers,
        })
      g.push.apply(g, h.concat(i, j)),
        a.cursor &&
          ((Aa.style.cursor = getComputedStyle(a.target).cursor),
          ka.length > 1 && m(ra, c.cssClasses.drag),
          Aa.addEventListener('selectstart', d, !1)),
        b.handleNumbers.forEach(function (a) {
          S('start', a)
        })
    }
    function N(a) {
      a.stopPropagation()
      var b = H(a.calcPoint),
        d = I(b)
      if (!1 === d) return !1
      c.events.snap || i(ra, c.cssClasses.tap, c.animationDuration),
        aa(d, b, !0, !0),
        _(),
        S('slide', d, !0),
        S('update', d, !0),
        S('change', d, !0),
        S('set', d, !0),
        c.events.snap && M(a, { handleNumbers: [d] })
    }
    function O(a) {
      var b = H(a.calcPoint),
        c = va.getStep(b),
        d = va.fromStepping(c)
      Object.keys(xa).forEach(function (a) {
        'hover' === a.split('.')[0] &&
          xa[a].forEach(function (a) {
            a.call(ma, d)
          })
      })
    }
    function P(a) {
      a.fixed ||
        ka.forEach(function (a, b) {
          F(oa.start, a.children[0], M, { handleNumbers: [b] })
        }),
        a.tap && F(oa.start, ja, N, {}),
        a.hover && F(oa.move, ja, O, { hover: !0 }),
        a.drag &&
          la.forEach(function (b, d) {
            if (!1 !== b && 0 !== d && d !== la.length - 1) {
              var e = ka[d - 1],
                f = ka[d],
                g = [b]
              m(b, c.cssClasses.draggable),
                a.fixed && (g.push(e.children[0]), g.push(f.children[0])),
                g.forEach(function (a) {
                  F(oa.start, a, M, {
                    handles: [e, f],
                    handleNumbers: [d - 1, d],
                  })
                })
            }
          })
    }
    function Q(a, b) {
      ;(xa[a] = xa[a] || []),
        xa[a].push(b),
        'update' === a.split('.')[0] &&
          ka.forEach(function (a, b) {
            S('update', b)
          })
    }
    function R(a) {
      var b = a && a.split('.')[0],
        c = b && a.substring(b.length)
      Object.keys(xa).forEach(function (a) {
        var d = a.split('.')[0],
          e = a.substring(d.length)
        ;(b && b !== d) || (c && c !== e) || delete xa[a]
      })
    }
    function S(a, b, d) {
      Object.keys(xa).forEach(function (e) {
        var f = e.split('.')[0]
        a === f &&
          xa[e].forEach(function (a) {
            a.call(ma, wa.map(c.format.to), b, wa.slice(), d || !1, sa.slice())
          })
      })
    }
    function T(a) {
      return a + '%'
    }
    function U(a, b, d, e, f, g) {
      return (
        ka.length > 1 &&
          (e && b > 0 && (d = Math.max(d, a[b - 1] + c.margin)),
          f && b < ka.length - 1 && (d = Math.min(d, a[b + 1] - c.margin))),
        ka.length > 1 &&
          c.limit &&
          (e && b > 0 && (d = Math.min(d, a[b - 1] + c.limit)),
          f && b < ka.length - 1 && (d = Math.max(d, a[b + 1] - c.limit))),
        c.padding &&
          (0 === b && (d = Math.max(d, c.padding[0])),
          b === ka.length - 1 && (d = Math.min(d, 100 - c.padding[1]))),
        (d = va.getStep(d)),
        !((d = j(d)) === a[b] && !g) && d
      )
    }
    function V(a, b) {
      var d = c.ort
      return (d ? b : a) + ', ' + (d ? a : b)
    }
    function W(a, b, c, d) {
      var e = c.slice(),
        f = [!a, a],
        g = [a, !a]
      ;(d = d.slice()),
        a && d.reverse(),
        d.length > 1
          ? d.forEach(function (a, c) {
              var d = U(e, a, e[a] + b, f[c], g[c], !1)
              !1 === d ? (b = 0) : ((b = d - e[a]), (e[a] = d))
            })
          : (f = g = [!0])
      var h = !1
      d.forEach(function (a, d) {
        h = aa(a, c[a] + b, f[d], g[d]) || h
      }),
        h &&
          d.forEach(function (a) {
            S('update', a), S('slide', a)
          })
    }
    function Y(a, b) {
      return c.dir ? 100 - a - b : a
    }
    function Z(a, b) {
      ;(sa[a] = b), (wa[a] = va.fromStepping(b))
      var d = 'translate(' + V(T(Y(b, 0) - Ba), '0') + ')'
      ;(ka[a].style[c.transformRule] = d), ba(a), ba(a + 1)
    }
    function _() {
      ta.forEach(function (a) {
        var b = sa[a] > 50 ? -1 : 1,
          c = 3 + (ka.length + b * a)
        ka[a].style.zIndex = c
      })
    }
    function aa(a, b, c, d) {
      return !1 !== (b = U(sa, a, b, c, d, !1)) && (Z(a, b), !0)
    }
    function ba(a) {
      if (la[a]) {
        var b = 0,
          d = 100
        0 !== a && (b = sa[a - 1]), a !== la.length - 1 && (d = sa[a])
        var e = d - b,
          f = 'translate(' + V(T(Y(b, e)), '0') + ')',
          g = 'scale(' + V(e / 100, '1') + ')'
        la[a].style[c.transformRule] = f + ' ' + g
      }
    }
    function ca(a, b) {
      return null === a || !1 === a || void 0 === a
        ? sa[b]
        : ('number' == typeof a && (a = String(a)),
          (a = c.format.from(a)),
          (a = va.toStepping(a)),
          !1 === a || isNaN(a) ? sa[b] : a)
    }
    function da(a, b) {
      var d = k(a),
        e = void 0 === sa[0]
      ;(b = void 0 === b || !!b),
        c.animate && !e && i(ra, c.cssClasses.tap, c.animationDuration),
        ta.forEach(function (a) {
          aa(a, ca(d[a], a), !0, !1)
        }),
        ta.forEach(function (a) {
          aa(a, sa[a], !0, !0)
        }),
        _(),
        ta.forEach(function (a) {
          S('update', a), null !== d[a] && b && S('set', a)
        })
    }
    function ea(a) {
      da(c.start, a)
    }
    function fa() {
      var a = wa.map(c.format.to)
      return 1 === a.length ? a[0] : a
    }
    function ga() {
      for (var a in c.cssClasses) c.cssClasses.hasOwnProperty(a) && n(ra, c.cssClasses[a])
      for (; ra.firstChild; ) ra.removeChild(ra.firstChild)
      delete ra.noUiSlider
    }
    function ha() {
      return sa.map(function (a, b) {
        var c = va.getNearbySteps(a),
          d = wa[b],
          e = c.thisStep.step,
          f = null
        !1 !== e && d + e > c.stepAfter.startValue && (e = c.stepAfter.startValue - d),
          (f =
            d > c.thisStep.startValue
              ? c.thisStep.step
              : !1 !== c.stepBefore.step && d - c.stepBefore.highestStep),
          100 === a ? (e = null) : 0 === a && (f = null)
        var g = va.countStepDecimals()
        return (
          null !== e && !1 !== e && (e = Number(e.toFixed(g))),
          null !== f && !1 !== f && (f = Number(f.toFixed(g))),
          [f, e]
        )
      })
    }
    function ia(a, b) {
      var d = fa(),
        e = ['margin', 'limit', 'padding', 'range', 'animate', 'snap', 'step', 'format']
      e.forEach(function (b) {
        void 0 !== a[b] && (f[b] = a[b])
      })
      var g = X(f)
      e.forEach(function (b) {
        void 0 !== a[b] && (c[b] = g[b])
      }),
        (va = g.spectrum),
        (c.margin = g.margin),
        (c.limit = g.limit),
        (c.padding = g.padding),
        c.pips && D(c.pips),
        (sa = []),
        da(a.start || d, b)
    }
    var ja,
      ka,
      la,
      ma,
      na,
      oa = q(),
      pa = s(),
      qa = pa && r(),
      ra = a,
      sa = [],
      ta = [],
      ua = 0,
      va = c.spectrum,
      wa = [],
      xa = {},
      ya = a.ownerDocument,
      za = ya.documentElement,
      Aa = ya.body,
      Ba = 'rtl' === ya.dir || 1 === c.ort ? 0 : 100
    return (
      v(ra),
      u(c.connect, ja),
      P(c.events),
      da(c.start),
      (ma = {
        destroy: ga,
        steps: ha,
        on: Q,
        off: R,
        get: fa,
        set: da,
        reset: ea,
        __moveHandles: function (a, b, c) {
          W(a, b, sa, c)
        },
        options: f,
        updateOptions: ia,
        target: ra,
        removePips: C,
        pips: D,
      }),
      c.pips && D(c.pips),
      c.tooltips && x(),
      y(),
      ma
    )
  }
  function Z(a, b) {
    if (!a || !a.nodeName)
      throw new Error('noUiSlider (' + $ + '): create requires a single element, got: ' + a)
    if (a.noUiSlider) throw new Error('noUiSlider (' + $ + '): Slider was already initialized.')
    var c = X(b, a),
      d = Y(a, c, b)
    return (a.noUiSlider = d), d
  }
  var $ = '11.1.0'
  ;(D.prototype.getMargin = function (a) {
    var b = this.xNumSteps[0]
    if (b && (a / b) % 1 != 0)
      throw new Error(
        'noUiSlider (' + $ + "): 'limit', 'margin' and 'padding' must be divisible by step.",
      )
    return 2 === this.xPct.length && u(this.xVal, a)
  }),
    (D.prototype.toStepping = function (a) {
      return (a = y(this.xVal, this.xPct, a))
    }),
    (D.prototype.fromStepping = function (a) {
      return z(this.xVal, this.xPct, a)
    }),
    (D.prototype.getStep = function (a) {
      return (a = A(this.xPct, this.xSteps, this.snap, a))
    }),
    (D.prototype.getNearbySteps = function (a) {
      var b = x(a, this.xPct)
      return {
        stepBefore: {
          startValue: this.xVal[b - 2],
          step: this.xNumSteps[b - 2],
          highestStep: this.xHighestCompleteStep[b - 2],
        },
        thisStep: {
          startValue: this.xVal[b - 1],
          step: this.xNumSteps[b - 1],
          highestStep: this.xHighestCompleteStep[b - 1],
        },
        stepAfter: {
          startValue: this.xVal[b - 0],
          step: this.xNumSteps[b - 0],
          highestStep: this.xHighestCompleteStep[b - 0],
        },
      }
    }),
    (D.prototype.countStepDecimals = function () {
      var a = this.xNumSteps.map(l)
      return Math.max.apply(null, a)
    }),
    (D.prototype.convert = function (a) {
      return this.getStep(this.toStepping(a))
    })
  var _ = {
    to: function (a) {
      return void 0 !== a && a.toFixed(2)
    },
    from: Number,
  }
  return { version: $, create: Z }
})

$('.TopPanel').on('click', '.burger', function () {
  $('.burger').toggleClass('active')
  $('#Menu').toggleClass('active')
})

$(function () {
  var $propertiesForm = $('.mall-category-filter')
  var $body = $('body')
  $body.on('click', '.js-mall-filter', function () {
    var $input = $(this).find('input')
    $(this).toggleClass('mall-filter__option--selected')
    $input.prop('checked', !$input.prop('checked'))
    $propertiesForm.trigger('submit')
  })
  $body.on('click', '.js-mall-clear-filter', function () {
    var $parent = $(this).closest('.mall-property')
    $parent.find(':input:not([type="checkbox"])').val('')
    $parent.find('input[type="checkbox"]').prop('checked', false)
    $parent.find('.mall-filter__option--selected').removeClass('mall-filter__option--selected')
    var slider = $parent.find('.mall-slider-handles')[0]
    if (slider) {
      slider.noUiSlider.updateOptions({
        start: [slider.dataset.min, slider.dataset.max],
      })
    }
    $propertiesForm.trigger('submit')
  })
  $propertiesForm.on('submit', function (e) {
    e.preventDefault()
    $.publish('mall.category.filter.start')
    $(this).request('categoryFilter::onSetFilter', {
      loading: $.oc.stripeLoadIndicator,
      complete: function (response) {
        $.oc.stripeLoadIndicator.hide()
        if (response.responseJSON.hasOwnProperty('queryString')) {
          history.replaceState(null, '', '?' + response.responseJSON.queryString)
        }
        $('[data-filter]').hide()
        if (response.responseJSON.hasOwnProperty('filter')) {
          for (var filter of Object.keys(response.responseJSON.filter)) {
            $('[data-filter="' + filter + '"]').show()
          }
        }
        $.publish('mall.category.filter.complete')
      },
      error: function () {
        $.oc.stripeLoadIndicator.hide()
        $.oc.flashMsg({
          text: 'Fehler beim Ausführen der Suche.',
          class: 'error',
        })
        $.publish('mall.category.filter.error')
      },
    })
  })

  //выбор категории
  $('.TitlePage_categoriyaBTN').click(function (e) {
    var container = $(this).parent()
    if (container.hasClass('open')) {
      container.removeClass('open')
    } else {
      $('.TitlePage_categoriya.open').removeClass('open')
      container.addClass('open')
    }
    e.stopPropagation()
  })
  $('html').click(function (e) {
    if ($(e.target).closest('.TitlePage_categoriya.open .TitlePage_categoriyaBTN').length == 0) {
      $('.TitlePage_categoriya.open').removeClass('open')
    }
  })
  $('.Card__item_img').on('click', '.Card__switch_foto', function () {
    $('.Card__switch').removeClass('active')
    $('.Card__switch_foto').addClass('active')
    $('.Card__image').removeClass('active')
    $('.Card__image_foto').addClass('active')
    $('.bottleColor').show(300)
    $('.bottleColor__item').removeClass('active')
    $('.bottleColor__item_transparent').addClass('active')
  })
  $('.Card__item_img').on('click', '.Card__switch_drawing', function () {
    $('.Card__switch').removeClass('active')
    $('.Card__switch_drawing').addClass('active')
    $('.Card__image').removeClass('active')
    $('.Card__image_drawing').addClass('active')
    $('.bottleColor').hide(300)
    $('.bottleColor__item').removeClass('active')
  })
  $('.Card__item_img').on('click', '.bottleColor__item_transparent', function () {
    $('.Card__switch').removeClass('active')
    $('.Card__switch_foto').addClass('active')
    $('.Card__image').removeClass('active')
    $('.Card__image_foto').addClass('active')
    $('.bottleColor__item').removeClass('active')
    $(this).addClass('active')
  })
  $('.Card__item_img').on('click', '.bottleColor__item_color', function () {
    $('.Card__switch').removeClass('active')
    $('.Card__switch_foto').addClass('active')
    $('.Card__image').removeClass('active')
    $('.Card__image_fotoColor').addClass('active')
    $('.bottleColor__item').removeClass('active')
    $(this).addClass('active')
  })
  $('.Card__item_img').on('click', '.bottleColor__item_ultraFlnt', function () {
    $('.Card__switch').removeClass('active')
    $('.Card__switch_foto').addClass('active')
    $('.Card__image').removeClass('active')
    $('.Card__image_fotoColor').addClass('active')
    $('.bottleColor__item').removeClass('active')
    $(this).addClass('active')
  })

  var target = document.getElementById('videoBlock')
  var modal = document.getElementById('modal')
  var links = document.querySelectorAll('.video-link')
  links.forEach(function (link) {
    //var url = link.getAttribute("data-video-url");
    link.addEventListener('click', function () {
      //target.src = url;
      target.play()
      modal.showModal()
    })
  })
  $('body').on('click', '.slick-ManePage__btnVideo,.video-link', function () {
    $('body').addClass('videoActive')
  })
  $('body').on('click', '.SendRequestModal__btn_js', function () {
    $('body').addClass('videoActive')
    $('.ContactFormModal').addClass('open')
  })
  $('.ContactFormModal').on('click', '#close-modal', function () {
    $('.ContactFormModal').removeClass('open')
    $('body').removeClass('videoActive')
  })
  $('.ContactFormModal').on('click', '.ContactFormModal_tel', function () {
    $('.ContactFormModal_mail').removeClass('active')
    $('.ContactFormModal_tel').addClass('active')
    $('.ContactFormModalForm_mail').removeClass('active')
    $('.ContactFormModalForm_tel').addClass('active')
  })
  $('.ContactFormModal').on('click', '.ContactFormModal_mail', function () {
    $('.ContactFormModal_tel').removeClass('active')
    $('.ContactFormModal_mail').addClass('active')
    $('.ContactFormModalForm_tel').removeClass('active')
    $('.ContactFormModalForm_mail').addClass('active')
  })
})

// (function () {
// 	"use strict";
// 	$(".input-file").each(function () {
// 		var $input = $(this),
// 			$label = $input.next(".js-labelFile"),
// 			labelVal = $label.html();
// 		$input.on("change", function (element) {
// 			var fileName = "";
// 			if (element.target.value)
// 				fileName = element.target.value.split("\\").pop();
// 			fileName
// 				? $label
// 						.addClass("has-file")
// 						.find(".js-fileName")
// 						.html(fileName)
// 				: $label.removeClass("has-file").html(labelVal);
// 		});
// 	});
// });
$(function () {
  $('input[type=file]').each(function () {
    var $input = $(this),
      $label = $input.next('.js-labelFile'),
      labelVal = $label.html()

    $input.hide()
    $input.on('change', function (element) {
      var fileName = ''
      if (element.target.value) fileName = element.target.value.split('\\').pop()
      fileName
        ? $label.addClass('has-file').find('.js-fileName').html(fileName)
        : $label.removeClass('has-file').html(labelVal)
    })
  })
})

$('.complexShape__item_slick').slick({
  lazyLoad: 'progressive',
  slidesToShow: 1,
  slidesToScroll: 1,
  asNavFor: '',
  dots: false,
  centerMode: true,
  focusOnSelect: true,
  vertical: false,
  fade: true,
  infinite: true,
})
$('.slick-ManePage').slick({
  lazyLoad: 'ondemand',
  mobileFirst: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  asNavFor: '',
  dots: false,
  centerMode: true,
  focusOnSelect: true,
  vertical: false,
  speed: 700,
  fade: true,
  cssEase: 'ease-in',
  infinite: false,
  responsive: [
    {
      breakpoint: 640,
      settings: { infinite: true },
    },
  ],
})
$('.slick-PrideCompany').slick({
  lazyLoad: 'progressive',
  slidesToShow: 1,
  slidesToScroll: 1,
  asNavFor: '',
  dots: false,
  centerMode: true,
  focusOnSelect: true,
  vertical: false,
  fade: true,
  infinite: false,
})
$('#PRODUCTphoto').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  fade: false,
  adaptiveHeight: true,
  asNavFor: '#PRODUCTprvw',
})
$('.mobile #PRODUCTprvw').slick({
  slidesToShow: 3,
  slidesToScroll: 1,
  asNavFor: '#PRODUCTphoto',
  dots: false,
  centerMode: true,
  focusOnSelect: true,
  vertical: false,
})
$('#TabsList').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  fade: true,
  asNavFor: '#Tabs',
})
$('.mobile #Tabs').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  asNavFor: '#TabsList',
  dots: true,
  centerMode: true,
  focusOnSelect: true,
})
$('.desktop #Tabs').slick({
  slidesToShow: 3,
  slidesToScroll: 1,
  asNavFor: '#TabsList',
  dots: true,
  centerMode: true,
  focusOnSelect: true,
})
$('#FromCollectionWRP').slick({
  slidesToShow: 4,
  slidesToScroll: 1,
  arrows: true,
  fade: false,
  dots: false,
  responsive: [
    {
      breakpoint: 1199,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        arrows: true,
        dots: false,
      },
    },
    {
      breakpoint: 700,
      settings: { infinite: true, slidesToShow: 2, slidesToScroll: 2 },
    },
    {
      breakpoint: 480,
      settings: { infinite: true, slidesToShow: 1, slidesToScroll: 1 },
    },
  ],
})
$('#YouWatchedWRP').slick({
  slidesToShow: 4,
  slidesToScroll: 1,
  arrows: true,
  fade: false,
  dots: false,
  responsive: [
    {
      breakpoint: 1199,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        arrows: true,
        dots: false,
      },
    },
    {
      breakpoint: 700,
      settings: { slidesToShow: 2, slidesToScroll: 2 },
    },
    {
      breakpoint: 480,
      settings: { slidesToShow: 1, slidesToScroll: 1 },
    },
  ],
})

window.addEventListener('resize', resizeFunc)

function resizeFunc() {
  var w = $(window).width()
  w = w > 1312 ? 1312 : w
  var h = (w / 1312) * 729
  var h2 = (w / 1312) * 500

  $('.slick-ManePage').css({
    width: w + 'px',
    height: h + 'px',
  })

  $('.slick-ManePage__item').css({
    width: w + 'px',
    height: h + 'px',
  })

  $('.paraWrapper__item').css({
    width: w + 'px',
    height: h + 'px',
  })

  $('.slick-PrideCompany').css({
    width: w + 'px',
    height: h2 + 'px',
  })

  // $(".PrideCompany").css({
  // width: w+"px",
  // height: h2+"px",
  // });

  $('.PrideCompany__item').css({
    width: w + 'px',
    height: h2 + 'px',
  })

  // $(".PrideCompany__item:after").css({
  // height: "50px",
  // });

  $('.slick-ManePage__item_1').on('mousemove', (e) => {
    var sizeInterval = $(window).width() / 13
    var index = Number((e.pageX / sizeInterval).toFixed(0))
    document.getElementById('slide1_0').src = 'images/slides/slide_1/' + index + '.jpg'
  })
}

function readyFunc() {
  resizeFunc()

  var vids = $('#video_background')
  $.each(vids, function () {
    this.controls = false
  })
}

$(document).ready(function () {
  readyFunc()
})

//////////////////////////////////////////////////////////////////
$(function () {
  // Filters
  var body = $('body'),
    fltBtns = $('.fltButtons'),
    fltFields = fltBtns.find('input.flt'),
    fltSliders = $('.mall-slider-handles'),
    sliders = []
  // Filters >>> toggle mobile panel
  $('.Filters').on('click', '.FiltersBTN', function () {
    $(this).parent().toggleClass('OPEN')
    body.toggleClass('ovfh')
  })
  // Filters >>> toggle filters panel
  fltBtns.on('click', function (e) {
    if (
      !$(e.target).closest('.Filters__itemMenu').length &&
      !$(e.target).closest('.icoFltr').length
    ) {
      let el = $(this)
      if (!el.hasClass('open')) {
        $('.fltButtons').removeClass('open')
      }
      el.toggleClass('open')
    }
  })
  body.on('click', function (e) {
    if (!$(e.target).closest('.fltButtons').length) {
      $('.fltButtons').removeClass('open')
    }
  })
  // Filters >>> sliders
  fltSliders.each(function () {
    var el = this,
      idx = $(el).data('index')
    sliders[idx] = noUiSlider.create(el, {
      start: [el.dataset.start, el.dataset.end],
      connect: true,
      tooltips: true,
      step: 10,
      range: {
        min: [parseInt(el.dataset.min)],
        max: [parseInt(el.dataset.max)],
      },
      pips: {
        mode: 'range',
        density: 20,
      },
    })
    sliders[idx].on('slide', function (values) {
      let currBox = $(el).parents('.Filters__item'),
        min = currBox.find('input.min'),
        max = currBox.find('input.max')
      min.val(parseInt(values[0]))
      max.val(parseInt(values[1]))
    })
    sliders[idx].on('change', function (values) {
      let currBox = $(el).parents('.Filters__item'),
        min = currBox.find('input.min'),
        max = currBox.find('input.max')
      $(el).parents('.Filters__item').find('input.min').trigger('change')
    })
  })
  // Filters >>> change
  fltFields.on('change', function () {
    fltBtns.each(function () {
      var el = $(this),
        elems = el.find('input.flt'),
        filters = {
          checkbox: [],
          number: [],
          color: [],
        },
        check = false
      elems.each(function () {
        let el = $(this),
          key = el.hasClass('number') ? 'number' : 'checkbox'
        switch (key) {
          case 'number':
            let val = parseInt(el.val()),
              dataVal = parseInt(el.data('value'))
            if (val != dataVal) {
              filters.number.push({
                name: el.attr('name'),
                value: val,
              })
            }
            break
          case 'checkbox':
            if (el.prop('checked')) {
              let name = el.attr('name')
              if (
                $.inArray(name, ['', '_color_transparent', '_color_ultraflint', '_color_brown'])
              ) {
                filters.color.push({ name: name })
              } else {
                filters.checkbox.push({ name: name })
              }
            }
            break
        }
      })
      $.each(filters, function (key, val) {
        if (check) {
          check = false
          return true
        } else {
          if (val.length) {
            check = true
            el.addClass('active')
            if (key == 'number') {
              let min = el.find('input.min'),
                max = el.find('input.max')
              el.find('.Filters__itemResalt').html(' (' + min.val() + '-' + max.val() + ')')
            }
          } else {
            el.removeClass('active')
            if (key == 'number') {
              el.find('.Filters__itemResalt').html('')
            }
          }
        }
      })
    })
    postFilters()
    return false
  })
  // Filters >>> reset
  body.on('click', '.icoFltr, [data-action="clear_filters"]', function (e) {
    let target = $(e.target)
    if (target.hasClass('icoFltr')) {
      let box = target.parents('.fltButtons'),
        fields = box.find('input')
      fields.each(function () {
        let el = $(this)
        if (el.hasClass('number min')) {
          let box = el.parents('.Filters__inputWRP'),
            maxField = box.find('input.max'),
            slider = box.next('.mall-slider-handles').data('index')
          el.val(el.data('value'))
          maxField.val(maxField.data('value'))
          sliders[slider].set([el.data('value'), maxField.data('value')])
        } else if (!el.hasClass('number')) {
          el.prop('checked', false)
        }
      })
      box.removeClass('active').find('.Filters__itemResalt').html('')
    } else {
      fltBtns.each(function () {
        let box = $(this),
          fields = box.find('input')
        fields.each(function () {
          let el = $(this)
          if (el.hasClass('number min')) {
            let box = el.parents('.Filters__inputWRP'),
              maxField = box.find('input.max'),
              slider = box.next('.mall-slider-handles').data('index')
            el.val(el.data('value'))
            maxField.val(maxField.data('value'))
            sliders[slider].set([el.data('value'), maxField.data('value')])
          } else {
            el.prop('checked', false)
          }
        })
        box.removeClass('active').find('.Filters__itemResalt').html('')
      })
    }
    postFilters()
    return false
  })
  // Sort
  $('body').on('click', '[data-action="toggle_sort"]', function () {
    let el = $(this)
    if (!el.hasClass('active')) {
      $('[data-action="toggle_sort"]').removeClass('active')
      el.addClass('active')
      postFilters()
    }
    return false
  })
  // Hide category img
  if (typeof getUrlParams(window.location.href).page != 'undefined') {
    $('.Catalog__item_IMG').remove()
  } else {
    $('.Catalog__item_IMG').show(0)
  }
  // Pagination
  $(document).on('pdopage_load', function (e, config, response) {
    $('#footer > .wrapper:eq(0)').replaceWith(response.pagination)
  })
})

function postFilters() {
  if (typeof pdoPage == 'undefined') {
    return
  } else {
    let form = $('#filters'),
      formData = form.serializeArray(),
      postData = [],
      sortData = $('[data-action="toggle_sort"].active')
    $.each(formData, function () {
      let el = $('[name="' + this.name + '"]')
      if (el.hasClass('number')) {
        if (el.hasClass('min')) {
          let minVal = Number(el.val()),
            minDataVal = Number(el.data('value')),
            maxField = el.parents('.Filters__inputWRP').find('input.max'),
            maxVal = Number(maxField.val()),
            maxDataVal = Number(maxField.data('value'))
          if (minVal != minDataVal || maxVal != maxDataVal) {
            postData.push(this)
            postData.push({
              name: maxField.attr('name'),
              value: maxVal,
            })
          }
        }
      } else {
        postData.push(this)
      }
    })
    if (sortData.length) {
      postData.push({
        name: 'sort',
        value: sortData.data('sort') + '||' + sortData.data('dir'),
      })
    }
    $.post(
      window.location.origin,
      {
        action: 'filters',
        hash: pdoPage.configs.page.hash,
        data: postData,
      },
      function (response) {
        console.log(response)
        let tmp = document.location.href.split('?'),
          href = window.location.origin + window.location.pathname,
          pushStateStr = ''
        pdoPage.keys.page = 0
        pdoPage.loadPage(tmp[0], pdoPage.configs.page)
        if (response.get) {
          pushStateStr = response.get
        }
        if (typeof getUrlParams(window.location.href).page != 'undefined') {
          let pageStr = 'page=' + getUrlParams(window.location.href).page
          pushStateStr += pushStateStr ? '&' + pageStr : pageStr
        }
        pushStateStr = pushStateStr ? href + '?' + pushStateStr : href
        history.pushState(null, null, pushStateStr)
        console.log(pushStateStr)
      },
      'json',
    )
  }
}

function getUrlParams(url) {
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1),
    obj = {}
  if (queryString) {
    queryString = queryString.split('#')[0]
    var arr = queryString.split('&')
    for (var i = 0; i < arr.length; i++) {
      var a = arr[i].split('='),
        paramNum = undefined,
        paramName = a[0].replace(/\[\d*\]/, function (v) {
          paramNum = v.slice(1, -1)
          return ''
        }),
        paramValue = typeof a[1] === 'undefined' ? true : a[1]
      paramName = paramName.toLowerCase()
      paramValue = paramValue.toLowerCase()
      if (obj[paramName]) {
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]]
        }
        if (typeof paramNum === 'undefined') {
          obj[paramName].push(paramValue)
        } else {
          obj[paramName][paramNum] = paramValue
        }
      } else {
        obj[paramName] = paramValue
      }
    }
  }
  return obj
}

// Madal video iFrame
$(document).ready(function () {
  let my_video = document.getElementById('iframeVideoModal')
  my_video = my_video.getElementsByTagName('iframe')[0].contentWindow

  $('#play_video').on('click', function () {
    $('body').toggleClass('videoActive')
    $('#iframeVideoModal').toggleClass('PlayVideoFrame')
    my_video.postMessage('{"event": "command", "func": "playVideo", "args": ""}', '*')
  })

  $('#close-modal').on('click', function () {
    $('body').toggleClass('videoActive')
    $('#iframeVideoModal').toggleClass('PlayVideoFrame')
    my_video.postMessage('{"event": "command", "func": "pauseVideo", "args": ""}', '*')
  })
  $('#close-modal2').on('click', function () {
    $('body').toggleClass('videoActive')
    $('#iframeVideoModal').toggleClass('PlayVideoFrame')
    my_video.postMessage('{"event": "command", "func": "pauseVideo", "args": ""}', '*')
  })
})
// /Madal video iFrame
