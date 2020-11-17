/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.5.3): alert.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import $ from 'jquery'
import Util from './util'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'alert'
const VERSION = '4.5.3'
const DATA_KEY = 'bs.alert'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'
const JQUERY_NO_CONFLICT = $.fn[NAME]

const SELECTOR_DISMISS = '[data-dismiss="alert"]'

const EVENT_CLOSE = `close${EVENT_KEY}`
const EVENT_CLOSED = `closed${EVENT_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`

const CLASS_NAME_ALERT = 'alert'
const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_SHOW = 'show'

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Alert {
  constructor(element) {
    this._element = element
  }

  // Getters

  static get VERSION() {
    return VERSION
  }

  // Public

  close(element) {
    let rootElement = this._element
    if (element) {
      rootElement = this._getRootElement(element)
    }

    const customEvent = this._triggerCloseEvent(rootElement)

    if (customEvent.isDefaultPrevented()) {
      return
    }

    this._removeElement(rootElement)
  }

  dispose() {
    $.removeData(this._element, DATA_KEY)
    this._element = null
  }

  // Private

  _getRootElement(element) {
    const selector = Util.getSelectorFromElement(element)
    let parent = false

    if (selector) {
      parent = document.querySelector(selector)
    }

    if (!parent) {
      parent = $(element).closest(`.${CLASS_NAME_ALERT}`)[0]
    }

    return parent
  }

  _triggerCloseEvent(element) {
    const closeEvent = $.Event(EVENT_CLOSE)

    $(element).trigger(closeEvent)
    return closeEvent
  }

  _removeElement(element) {
    $(element).removeClass(CLASS_NAME_SHOW)

    if (!$(element).hasClass(CLASS_NAME_FADE)) {
      this._destroyElement(element)
      return
    }

    const transitionDuration = Util.getTransitionDurationFromElement(element)

    $(element)
      .one(Util.TRANSITION_END, event => this._destroyElement(element, event))
      .emulateTransitionEnd(transitionDuration)
  }

  _destroyElement(element) {
    $(element)
      .detach()
      .trigger(EVENT_CLOSED)
      .remove()
  }

  // Static

  static _jQueryInterface(config) {
    return this.each(function () {
      const $element = $(this)
      let data = $element.data(DATA_KEY)

      if (!data) {
        data = new Alert(this)
        $element.data(DATA_KEY, data)
      }

      if (config === 'close') {
        data[config](this)
      }
    })
  }

  static _handleDismiss(alertInstance) {
    return function (event) {
      if (event) {
        event.preventDefault()
      }

      alertInstance.close(this)
    }
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(document).on(
  EVENT_CLICK_DATA_API,
  SELECTOR_DISMISS,
  Alert._handleDismiss(new Alert())
)

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

$.fn[NAME] = Alert._jQueryInterface
$.fn[NAME].Constructor = Alert
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT
  return Alert._jQueryInterface
}

export default Alert

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.5.3): button.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import $ from 'jquery'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'button'
const VERSION = '4.5.3'
const DATA_KEY = 'bs.button'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'
const JQUERY_NO_CONFLICT = $.fn[NAME]

const CLASS_NAME_ACTIVE = 'active'
const CLASS_NAME_BUTTON = 'btn'
const CLASS_NAME_FOCUS = 'focus'

const SELECTOR_DATA_TOGGLE_CARROT = '[data-toggle^="button"]'
const SELECTOR_DATA_TOGGLES = '[data-toggle="buttons"]'
const SELECTOR_DATA_TOGGLE = '[data-toggle="button"]'
const SELECTOR_DATA_TOGGLES_BUTTONS = '[data-toggle="buttons"] .btn'
const SELECTOR_INPUT = 'input:not([type="hidden"])'
const SELECTOR_ACTIVE = '.active'
const SELECTOR_BUTTON = '.btn'

const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`
const EVENT_FOCUS_BLUR_DATA_API = `focus${EVENT_KEY}${DATA_API_KEY} ` +
                          `blur${EVENT_KEY}${DATA_API_KEY}`
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Button {
  constructor(element) {
    this._element = element
    this.shouldAvoidTriggerChange = false
  }

  // Getters

  static get VERSION() {
    return VERSION
  }

  // Public

  toggle() {
    let triggerChangeEvent = true
    let addAriaPressed = true
    const rootElement = $(this._element).closest(SELECTOR_DATA_TOGGLES)[0]

    if (rootElement) {
      const input = this._element.querySelector(SELECTOR_INPUT)

      if (input) {
        if (input.type === 'radio') {
          if (input.checked && this._element.classList.contains(CLASS_NAME_ACTIVE)) {
            triggerChangeEvent = false
          } else {
            const activeElement = rootElement.querySelector(SELECTOR_ACTIVE)

            if (activeElement) {
              $(activeElement).removeClass(CLASS_NAME_ACTIVE)
            }
          }
        }

        if (triggerChangeEvent) {
          // if it's not a radio button or checkbox don't add a pointless/invalid checked property to the input
          if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = !this._element.classList.contains(CLASS_NAME_ACTIVE)
          }

          if (!this.shouldAvoidTriggerChange) {
            $(input).trigger('change')
          }
        }

        input.focus()
        addAriaPressed = false
      }
    }

    if (!(this._element.hasAttribute('disabled') || this._element.classList.contains('disabled'))) {
      if (addAriaPressed) {
        this._element.setAttribute('aria-pressed', !this._element.classList.contains(CLASS_NAME_ACTIVE))
      }

      if (triggerChangeEvent) {
        $(this._element).toggleClass(CLASS_NAME_ACTIVE)
      }
    }
  }

  dispose() {
    $.removeData(this._element, DATA_KEY)
    this._element = null
  }

  // Static

  static _jQueryInterface(config, avoidTriggerChange) {
    return this.each(function () {
      const $element = $(this)
      let data = $element.data(DATA_KEY)

      if (!data) {
        data = new Button(this)
        $element.data(DATA_KEY, data)
      }

      data.shouldAvoidTriggerChange = avoidTriggerChange

      if (config === 'toggle') {
        data[config]()
      }
    })
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(document)
  .on(EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE_CARROT, event => {
    let button = event.target
    const initialButton = button

    if (!$(button).hasClass(CLASS_NAME_BUTTON)) {
      button = $(button).closest(SELECTOR_BUTTON)[0]
    }

    if (!button || button.hasAttribute('disabled') || button.classList.contains('disabled')) {
      event.preventDefault() // work around Firefox bug #1540995
    } else {
      const inputBtn = button.querySelector(SELECTOR_INPUT)

      if (inputBtn && (inputBtn.hasAttribute('disabled') || inputBtn.classList.contains('disabled'))) {
        event.preventDefault() // work around Firefox bug #1540995
        return
      }

      if (initialButton.tagName === 'INPUT' || button.tagName !== 'LABEL') {
        Button._jQueryInterface.call($(button), 'toggle', initialButton.tagName === 'INPUT')
      }
    }
  })
  .on(EVENT_FOCUS_BLUR_DATA_API, SELECTOR_DATA_TOGGLE_CARROT, event => {
    const button = $(event.target).closest(SELECTOR_BUTTON)[0]
    $(button).toggleClass(CLASS_NAME_FOCUS, /^focus(in)?$/.test(event.type))
  })

$(window).on(EVENT_LOAD_DATA_API, () => {
  // ensure correct active class is set to match the controls' actual values/states

  // find all checkboxes/readio buttons inside data-toggle groups
  let buttons = [].slice.call(document.querySelectorAll(SELECTOR_DATA_TOGGLES_BUTTONS))
  for (let i = 0, len = buttons.length; i < len; i++) {
    const button = buttons[i]
    const input = button.querySelector(SELECTOR_INPUT)
    if (input.checked || input.hasAttribute('checked')) {
      button.classList.add(CLASS_NAME_ACTIVE)
    } else {
      button.classList.remove(CLASS_NAME_ACTIVE)
    }
  }

  // find all button toggles
  buttons = [].slice.call(document.querySelectorAll(SELECTOR_DATA_TOGGLE))
  for (let i = 0, len = buttons.length; i < len; i++) {
    const button = buttons[i]
    if (button.getAttribute('aria-pressed') === 'true') {
      button.classList.add(CLASS_NAME_ACTIVE)
    } else {
      button.classList.remove(CLASS_NAME_ACTIVE)
    }
  }
})

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

$.fn[NAME] = Button._jQueryInterface
$.fn[NAME].Constructor = Button
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT
  return Button._jQueryInterface
}

export default Button

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.5.3): carousel.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import $ from 'jquery'
import Util from './util'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'carousel'
const VERSION = '4.5.3'
const DATA_KEY = 'bs.carousel'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'
const JQUERY_NO_CONFLICT = $.fn[NAME]
const ARROW_LEFT_KEYCODE = 37 // KeyboardEvent.which value for left arrow key
const ARROW_RIGHT_KEYCODE = 39 // KeyboardEvent.which value for right arrow key
const TOUCHEVENT_COMPAT_WAIT = 500 // Time for mouse compat events to fire after touch
const SWIPE_THRESHOLD = 40

const Default = {
  interval: 5000,
  keyboard: true,
  slide: false,
  pause: 'hover',
  wrap: true,
  touch: true
}

const DefaultType = {
  interval: '(number|boolean)',
  keyboard: 'boolean',
  slide: '(boolean|string)',
  pause: '(string|boolean)',
  wrap: 'boolean',
  touch: 'boolean'
}

const DIRECTION_NEXT = 'next'
const DIRECTION_PREV = 'prev'
const DIRECTION_LEFT = 'left'
const DIRECTION_RIGHT = 'right'

const EVENT_SLIDE = `slide${EVENT_KEY}`
const EVENT_SLID = `slid${EVENT_KEY}`
const EVENT_KEYDOWN = `keydown${EVENT_KEY}`
const EVENT_MOUSEENTER = `mouseenter${EVENT_KEY}`
const EVENT_MOUSELEAVE = `mouseleave${EVENT_KEY}`
const EVENT_TOUCHSTART = `touchstart${EVENT_KEY}`
const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY}`
const EVENT_TOUCHEND = `touchend${EVENT_KEY}`
const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY}`
const EVENT_POINTERUP = `pointerup${EVENT_KEY}`
const EVENT_DRAG_START = `dragstart${EVENT_KEY}`
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`

const CLASS_NAME_CAROUSEL = 'carousel'
const CLASS_NAME_ACTIVE = 'active'
const CLASS_NAME_SLIDE = 'slide'
const CLASS_NAME_RIGHT = 'carousel-item-right'
const CLASS_NAME_LEFT = 'carousel-item-left'
const CLASS_NAME_NEXT = 'carousel-item-next'
const CLASS_NAME_PREV = 'carousel-item-prev'
const CLASS_NAME_POINTER_EVENT = 'pointer-event'

const SELECTOR_ACTIVE = '.active'
const SELECTOR_ACTIVE_ITEM = '.active.carousel-item'
const SELECTOR_ITEM = '.carousel-item'
const SELECTOR_ITEM_IMG = '.carousel-item img'
const SELECTOR_NEXT_PREV = '.carousel-item-next, .carousel-item-prev'
const SELECTOR_INDICATORS = '.carousel-indicators'
const SELECTOR_DATA_SLIDE = '[data-slide], [data-slide-to]'
const SELECTOR_DATA_RIDE = '[data-ride="carousel"]'

const PointerType = {
  TOUCH: 'touch',
  PEN: 'pen'
}

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */
class Carousel {
  constructor(element, config) {
    this._items = null
    this._interval = null
    this._activeElement = null
    this._isPaused = false
    this._isSliding = false
    this.touchTimeout = null
    this.touchStartX = 0
    this.touchDeltaX = 0

    this._config = this._getConfig(config)
    this._element = element
    this._indicatorsElement = this._element.querySelector(SELECTOR_INDICATORS)
    this._touchSupported = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0
    this._pointerEvent = Boolean(window.PointerEvent || window.MSPointerEvent)

    this._addEventListeners()
  }

  // Getters

  static get VERSION() {
    return VERSION
  }

  static get Default() {
    return Default
  }

  // Public

  next() {
    if (!this._isSliding) {
      this._slide(DIRECTION_NEXT)
    }
  }

  nextWhenVisible() {
    const $element = $(this._element)
    // Don't call next when the page isn't visible
    // or the carousel or its parent isn't visible
    if (!document.hidden &&
      ($element.is(':visible') && $element.css('visibility') !== 'hidden')) {
      this.next()
    }
  }

  prev() {
    if (!this._isSliding) {
      this._slide(DIRECTION_PREV)
    }
  }

  pause(event) {
    if (!event) {
      this._isPaused = true
    }

    if (this._element.querySelector(SELECTOR_NEXT_PREV)) {
      Util.triggerTransitionEnd(this._element)
      this.cycle(true)
    }

    clearInterval(this._interval)
    this._interval = null
  }

  cycle(event) {
    if (!event) {
      this._isPaused = false
    }

    if (this._interval) {
      clearInterval(this._interval)
      this._interval = null
    }

    if (this._config.interval && !this._isPaused) {
      this._interval = setInterval(
        (document.visibilityState ? this.nextWhenVisible : this.next).bind(this),
        this._config.interval
      )
    }
  }

  to(index) {
    this._activeElement = this._element.querySelector(SELECTOR_ACTIVE_ITEM)

    const activeIndex = this._getItemIndex(this._activeElement)

    if (index > this._items.length - 1 || index < 0) {
      return
    }

    if (this._isSliding) {
      $(this._element).one(EVENT_SLID, () => this.to(index))
      return
    }

    if (activeIndex === index) {
      this.pause()
      this.cycle()
      return
    }

    const direction = index > activeIndex ?
      DIRECTION_NEXT :
      DIRECTION_PREV

    this._slide(direction, this._items[index])
  }

  dispose() {
    $(this._element).off(EVENT_KEY)
    $.removeData(this._element, DATA_KEY)

    this._items = null
    this._config = null
    this._element = null
    this._interval = null
    this._isPaused = null
    this._isSliding = null
    this._activeElement = null
    this._indicatorsElement = null
  }

  // Private

  _getConfig(config) {
    config = {
      ...Default,
      ...config
    }
    Util.typeCheckConfig(NAME, config, DefaultType)
    return config
  }

  _handleSwipe() {
    const absDeltax = Math.abs(this.touchDeltaX)

    if (absDeltax <= SWIPE_THRESHOLD) {
      return
    }

    const direction = absDeltax / this.touchDeltaX

    this.touchDeltaX = 0

    // swipe left
    if (direction > 0) {
      this.prev()
    }

    // swipe right
    if (direction < 0) {
      this.next()
    }
  }

  _addEventListeners() {
    if (this._config.keyboard) {
      $(this._element).on(EVENT_KEYDOWN, event => this._keydown(event))
    }

    if (this._config.pause === 'hover') {
      $(this._element)
        .on(EVENT_MOUSEENTER, event => this.pause(event))
        .on(EVENT_MOUSELEAVE, event => this.cycle(event))
    }

    if (this._config.touch) {
      this._addTouchEventListeners()
    }
  }

  _addTouchEventListeners() {
    if (!this._touchSupported) {
      return
    }

    const start = event => {
      if (this._pointerEvent && PointerType[event.originalEvent.pointerType.toUpperCase()]) {
        this.touchStartX = event.originalEvent.clientX
      } else if (!this._pointerEvent) {
        this.touchStartX = event.originalEvent.touches[0].clientX
      }
    }

    const move = event => {
      // ensure swiping with one touch and not pinching
      if (event.originalEvent.touches && event.originalEvent.touches.length > 1) {
        this.touchDeltaX = 0
      } else {
        this.touchDeltaX = event.originalEvent.touches[0].clientX - this.touchStartX
      }
    }

    const end = event => {
      if (this._pointerEvent && PointerType[event.originalEvent.pointerType.toUpperCase()]) {
        this.touchDeltaX = event.originalEvent.clientX - this.touchStartX
      }

      this._handleSwipe()
      if (this._config.pause === 'hover') {
        // If it's a touch-enabled device, mouseenter/leave are fired as
        // part of the mouse compatibility events on first tap - the carousel
        // would stop cycling until user tapped out of it;
        // here, we listen for touchend, explicitly pause the carousel
        // (as if it's the second time we tap on it, mouseenter compat event
        // is NOT fired) and after a timeout (to allow for mouse compatibility
        // events to fire) we explicitly restart cycling

        this.pause()
        if (this.touchTimeout) {
          clearTimeout(this.touchTimeout)
        }

        this.touchTimeout = setTimeout(event => this.cycle(event), TOUCHEVENT_COMPAT_WAIT + this._config.interval)
      }
    }

    $(this._element.querySelectorAll(SELECTOR_ITEM_IMG))
      .on(EVENT_DRAG_START, e => e.preventDefault())

    if (this._pointerEvent) {
      $(this._element).on(EVENT_POINTERDOWN, event => start(event))
      $(this._element).on(EVENT_POINTERUP, event => end(event))

      this._element.classList.add(CLASS_NAME_POINTER_EVENT)
    } else {
      $(this._element).on(EVENT_TOUCHSTART, event => start(event))
      $(this._element).on(EVENT_TOUCHMOVE, event => move(event))
      $(this._element).on(EVENT_TOUCHEND, event => end(event))
    }
  }

  _keydown(event) {
    if (/input|textarea/i.test(event.target.tagName)) {
      return
    }

    switch (event.which) {
      case ARROW_LEFT_KEYCODE:
        event.preventDefault()
        this.prev()
        break
      case ARROW_RIGHT_KEYCODE:
        event.preventDefault()
        this.next()
        break
      default:
    }
  }

  _getItemIndex(element) {
    this._items = element && element.parentNode ?
      [].slice.call(element.parentNode.querySelectorAll(SELECTOR_ITEM)) :
      []
    return this._items.indexOf(element)
  }

  _getItemByDirection(direction, activeElement) {
    const isNextDirection = direction === DIRECTION_NEXT
    const isPrevDirection = direction === DIRECTION_PREV
    const activeIndex = this._getItemIndex(activeElement)
    const lastItemIndex = this._items.length - 1
    const isGoingToWrap = isPrevDirection && activeIndex === 0 ||
                            isNextDirection && activeIndex === lastItemIndex

    if (isGoingToWrap && !this._config.wrap) {
      return activeElement
    }

    const delta = direction === DIRECTION_PREV ? -1 : 1
    const itemIndex = (activeIndex + delta) % this._items.length

    return itemIndex === -1 ?
      this._items[this._items.length - 1] : this._items[itemIndex]
  }

  _triggerSlideEvent(relatedTarget, eventDirectionName) {
    const targetIndex = this._getItemIndex(relatedTarget)
    const fromIndex = this._getItemIndex(this._element.querySelector(SELECTOR_ACTIVE_ITEM))
    const slideEvent = $.Event(EVENT_SLIDE, {
      relatedTarget,
      direction: eventDirectionName,
      from: fromIndex,
      to: targetIndex
    })

    $(this._element).trigger(slideEvent)

    return slideEvent
  }

  _setActiveIndicatorElement(element) {
    if (this._indicatorsElement) {
      const indicators = [].slice.call(this._indicatorsElement.querySelectorAll(SELECTOR_ACTIVE))
      $(indicators).removeClass(CLASS_NAME_ACTIVE)

      const nextIndicator = this._indicatorsElement.children[
        this._getItemIndex(element)
      ]

      if (nextIndicator) {
        $(nextIndicator).addClass(CLASS_NAME_ACTIVE)
      }
    }
  }

  _slide(direction, element) {
    const activeElement = this._element.querySelector(SELECTOR_ACTIVE_ITEM)
    const activeElementIndex = this._getItemIndex(activeElement)
    const nextElement = element || activeElement &&
      this._getItemByDirection(direction, activeElement)
    const nextElementIndex = this._getItemIndex(nextElement)
    const isCycling = Boolean(this._interval)

    let directionalClassName
    let orderClassName
    let eventDirectionName

    if (direction === DIRECTION_NEXT) {
      directionalClassName = CLASS_NAME_LEFT
      orderClassName = CLASS_NAME_NEXT
      eventDirectionName = DIRECTION_LEFT
    } else {
      directionalClassName = CLASS_NAME_RIGHT
      orderClassName = CLASS_NAME_PREV
      eventDirectionName = DIRECTION_RIGHT
    }

    if (nextElement && $(nextElement).hasClass(CLASS_NAME_ACTIVE)) {
      this._isSliding = false
      return
    }

    const slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName)
    if (slideEvent.isDefaultPrevented()) {
      return
    }

    if (!activeElement || !nextElement) {
      // Some weirdness is happening, so we bail
      return
    }

    this._isSliding = true

    if (isCycling) {
      this.pause()
    }

    this._setActiveIndicatorElement(nextElement)

    const slidEvent = $.Event(EVENT_SLID, {
      relatedTarget: nextElement,
      direction: eventDirectionName,
      from: activeElementIndex,
      to: nextElementIndex
    })

    if ($(this._element).hasClass(CLASS_NAME_SLIDE)) {
      $(nextElement).addClass(orderClassName)

      Util.reflow(nextElement)

      $(activeElement).addClass(directionalClassName)
      $(nextElement).addClass(directionalClassName)

      const nextElementInterval = parseInt(nextElement.getAttribute('data-interval'), 10)
      if (nextElementInterval) {
        this._config.defaultInterval = this._config.defaultInterval || this._config.interval
        this._config.interval = nextElementInterval
      } else {
        this._config.interval = this._config.defaultInterval || this._config.interval
      }

      const transitionDuration = Util.getTransitionDurationFromElement(activeElement)

      $(activeElement)
        .one(Util.TRANSITION_END, () => {
          $(nextElement)
            .removeClass(`${directionalClassName} ${orderClassName}`)
            .addClass(CLASS_NAME_ACTIVE)

          $(activeElement).removeClass(`${CLASS_NAME_ACTIVE} ${orderClassName} ${directionalClassName}`)

          this._isSliding = false

          setTimeout(() => $(this._element).trigger(slidEvent), 0)
        })
        .emulateTransitionEnd(transitionDuration)
    } else {
      $(activeElement).removeClass(CLASS_NAME_ACTIVE)
      $(nextElement).addClass(CLASS_NAME_ACTIVE)

      this._isSliding = false
      $(this._element).trigger(slidEvent)
    }

    if (isCycling) {
      this.cycle()
    }
  }

  // Static

  static _jQueryInterface(config) {
    return this.each(function () {
      let data = $(this).data(DATA_KEY)
      let _config = {
        ...Default,
        ...$(this).data()
      }

      if (typeof config === 'object') {
        _config = {
          ..._config,
          ...config
        }
      }

      const action = typeof config === 'string' ? config : _config.slide

      if (!data) {
        data = new Carousel(this, _config)
        $(this).data(DATA_KEY, data)
      }

      if (typeof config === 'number') {
        data.to(config)
      } else if (typeof action === 'string') {
        if (typeof data[action] === 'undefined') {
          throw new TypeError(`No method named "${action}"`)
        }

        data[action]()
      } else if (_config.interval && _config.ride) {
        data.pause()
        data.cycle()
      }
    })
  }

  static _dataApiClickHandler(event) {
    const selector = Util.getSelectorFromElement(this)

    if (!selector) {
      return
    }

    const target = $(selector)[0]

    if (!target || !$(target).hasClass(CLASS_NAME_CAROUSEL)) {
      return
    }

    const config = {
      ...$(target).data(),
      ...$(this).data()
    }
    const slideIndex = this.getAttribute('data-slide-to')

    if (slideIndex) {
      config.interval = false
    }

    Carousel._jQueryInterface.call($(target), config)

    if (slideIndex) {
      $(target).data(DATA_KEY).to(slideIndex)
    }

    event.preventDefault()
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(document).on(EVENT_CLICK_DATA_API, SELECTOR_DATA_SLIDE, Carousel._dataApiClickHandler)

$(window).on(EVENT_LOAD_DATA_API, () => {
  const carousels = [].slice.call(document.querySelectorAll(SELECTOR_DATA_RIDE))
  for (let i = 0, len = carousels.length; i < len; i++) {
    const $carousel = $(carousels[i])
    Carousel._jQueryInterface.call($carousel, $carousel.data())
  }
})

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

$.fn[NAME] = Carousel._jQueryInterface
$.fn[NAME].Constructor = Carousel
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT
  return Carousel._jQueryInterface
}

export default Carousel

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.5.3): collapse.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import $ from 'jquery'
import Util from './util'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'collapse'
const VERSION = '4.5.3'
const DATA_KEY = 'bs.collapse'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'
const JQUERY_NO_CONFLICT = $.fn[NAME]

const Default = {
  toggle: true,
  parent: ''
}

const DefaultType = {
  toggle: 'boolean',
  parent: '(string|element)'
}

const EVENT_SHOW = `show${EVENT_KEY}`
const EVENT_SHOWN = `shown${EVENT_KEY}`
const EVENT_HIDE = `hide${EVENT_KEY}`
const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`

const CLASS_NAME_SHOW = 'show'
const CLASS_NAME_COLLAPSE = 'collapse'
const CLASS_NAME_COLLAPSING = 'collapsing'
const CLASS_NAME_COLLAPSED = 'collapsed'

const DIMENSION_WIDTH = 'width'
const DIMENSION_HEIGHT = 'height'

const SELECTOR_ACTIVES = '.show, .collapsing'
const SELECTOR_DATA_TOGGLE = '[data-toggle="collapse"]'

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Collapse {
  constructor(element, config) {
    this._isTransitioning = false
    this._element = element
    this._config = this._getConfig(config)
    this._triggerArray = [].slice.call(document.querySelectorAll(
      `[data-toggle="collapse"][href="#${element.id}"],` +
      `[data-toggle="collapse"][data-target="#${element.id}"]`
    ))

    const toggleList = [].slice.call(document.querySelectorAll(SELECTOR_DATA_TOGGLE))
    for (let i = 0, len = toggleList.length; i < len; i++) {
      const elem = toggleList[i]
      const selector = Util.getSelectorFromElement(elem)
      const filterElement = [].slice.call(document.querySelectorAll(selector))
        .filter(foundElem => foundElem === element)

      if (selector !== null && filterElement.length > 0) {
        this._selector = selector
        this._triggerArray.push(elem)
      }
    }

    this._parent = this._config.parent ? this._getParent() : null

    if (!this._config.parent) {
      this._addAriaAndCollapsedClass(this._element, this._triggerArray)
    }

    if (this._config.toggle) {
      this.toggle()
    }
  }

  // Getters

  static get VERSION() {
    return VERSION
  }

  static get Default() {
    return Default
  }

  // Public

  toggle() {
    if ($(this._element).hasClass(CLASS_NAME_SHOW)) {
      this.hide()
    } else {
      this.show()
    }
  }

  show() {
    if (this._isTransitioning ||
      $(this._element).hasClass(CLASS_NAME_SHOW)) {
      return
    }

    let actives
    let activesData

    if (this._parent) {
      actives = [].slice.call(this._parent.querySelectorAll(SELECTOR_ACTIVES))
        .filter(elem => {
          if (typeof this._config.parent === 'string') {
            return elem.getAttribute('data-parent') === this._config.parent
          }

          return elem.classList.contains(CLASS_NAME_COLLAPSE)
        })

      if (actives.length === 0) {
        actives = null
      }
    }

    if (actives) {
      activesData = $(actives).not(this._selector).data(DATA_KEY)
      if (activesData && activesData._isTransitioning) {
        return
      }
    }

    const startEvent = $.Event(EVENT_SHOW)
    $(this._element).trigger(startEvent)
    if (startEvent.isDefaultPrevented()) {
      return
    }

    if (actives) {
      Collapse._jQueryInterface.call($(actives).not(this._selector), 'hide')
      if (!activesData) {
        $(actives).data(DATA_KEY, null)
      }
    }

    const dimension = this._getDimension()

    $(this._element)
      .removeClass(CLASS_NAME_COLLAPSE)
      .addClass(CLASS_NAME_COLLAPSING)

    this._element.style[dimension] = 0

    if (this._triggerArray.length) {
      $(this._triggerArray)
        .removeClass(CLASS_NAME_COLLAPSED)
        .attr('aria-expanded', true)
    }

    this.setTransitioning(true)

    const complete = () => {
      $(this._element)
        .removeClass(CLASS_NAME_COLLAPSING)
        .addClass(`${CLASS_NAME_COLLAPSE} ${CLASS_NAME_SHOW}`)

      this._element.style[dimension] = ''

      this.setTransitioning(false)

      $(this._element).trigger(EVENT_SHOWN)
    }

    const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1)
    const scrollSize = `scroll${capitalizedDimension}`
    const transitionDuration = Util.getTransitionDurationFromElement(this._element)

    $(this._element)
      .one(Util.TRANSITION_END, complete)
      .emulateTransitionEnd(transitionDuration)

    this._element.style[dimension] = `${this._element[scrollSize]}px`
  }

  hide() {
    if (this._isTransitioning ||
      !$(this._element).hasClass(CLASS_NAME_SHOW)) {
      return
    }

    const startEvent = $.Event(EVENT_HIDE)
    $(this._element).trigger(startEvent)
    if (startEvent.isDefaultPrevented()) {
      return
    }

    const dimension = this._getDimension()

    this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`

    Util.reflow(this._element)

    $(this._element)
      .addClass(CLASS_NAME_COLLAPSING)
      .removeClass(`${CLASS_NAME_COLLAPSE} ${CLASS_NAME_SHOW}`)

    const triggerArrayLength = this._triggerArray.length
    if (triggerArrayLength > 0) {
      for (let i = 0; i < triggerArrayLength; i++) {
        const trigger = this._triggerArray[i]
        const selector = Util.getSelectorFromElement(trigger)

        if (selector !== null) {
          const $elem = $([].slice.call(document.querySelectorAll(selector)))
          if (!$elem.hasClass(CLASS_NAME_SHOW)) {
            $(trigger).addClass(CLASS_NAME_COLLAPSED)
              .attr('aria-expanded', false)
          }
        }
      }
    }

    this.setTransitioning(true)

    const complete = () => {
      this.setTransitioning(false)
      $(this._element)
        .removeClass(CLASS_NAME_COLLAPSING)
        .addClass(CLASS_NAME_COLLAPSE)
        .trigger(EVENT_HIDDEN)
    }

    this._element.style[dimension] = ''
    const transitionDuration = Util.getTransitionDurationFromElement(this._element)

    $(this._element)
      .one(Util.TRANSITION_END, complete)
      .emulateTransitionEnd(transitionDuration)
  }

  setTransitioning(isTransitioning) {
    this._isTransitioning = isTransitioning
  }

  dispose() {
    $.removeData(this._element, DATA_KEY)

    this._config = null
    this._parent = null
    this._element = null
    this._triggerArray = null
    this._isTransitioning = null
  }

  // Private

  _getConfig(config) {
    config = {
      ...Default,
      ...config
    }
    config.toggle = Boolean(config.toggle) // Coerce string values
    Util.typeCheckConfig(NAME, config, DefaultType)
    return config
  }

  _getDimension() {
    const hasWidth = $(this._element).hasClass(DIMENSION_WIDTH)
    return hasWidth ? DIMENSION_WIDTH : DIMENSION_HEIGHT
  }

  _getParent() {
    let parent

    if (Util.isElement(this._config.parent)) {
      parent = this._config.parent

      // It's a jQuery object
      if (typeof this._config.parent.jquery !== 'undefined') {
        parent = this._config.parent[0]
      }
    } else {
      parent = document.querySelector(this._config.parent)
    }

    const selector = `[data-toggle="collapse"][data-parent="${this._config.parent}"]`
    const children = [].slice.call(parent.querySelectorAll(selector))

    $(children).each((i, element) => {
      this._addAriaAndCollapsedClass(
        Collapse._getTargetFromElement(element),
        [element]
      )
    })

    return parent
  }

  _addAriaAndCollapsedClass(element, triggerArray) {
    const isOpen = $(element).hasClass(CLASS_NAME_SHOW)

    if (triggerArray.length) {
      $(triggerArray)
        .toggleClass(CLASS_NAME_COLLAPSED, !isOpen)
        .attr('aria-expanded', isOpen)
    }
  }

  // Static

  static _getTargetFromElement(element) {
    const selector = Util.getSelectorFromElement(element)
    return selector ? document.querySelector(selector) : null
  }

  static _jQueryInterface(config) {
    return this.each(function () {
      const $element = $(this)
      let data = $element.data(DATA_KEY)
      const _config = {
        ...Default,
        ...$element.data(),
        ...(typeof config === 'object' && config ? config : {})
      }

      if (!data && _config.toggle && typeof config === 'string' && /show|hide/.test(config)) {
        _config.toggle = false
      }

      if (!data) {
        data = new Collapse(this, _config)
        $element.data(DATA_KEY, data)
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`)
        }

        data[config]()
      }
    })
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(document).on(EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
  if (event.currentTarget.tagName === 'A') {
    event.preventDefault()
  }

  const $trigger = $(this)
  const selector = Util.getSelectorFromElement(this)
  const selectors = [].slice.call(document.querySelectorAll(selector))

  $(selectors).each(function () {
    const $target = $(this)
    const data = $target.data(DATA_KEY)
    const config = data ? 'toggle' : $trigger.data()
    Collapse._jQueryInterface.call($target, config)
  })
})

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

$.fn[NAME] = Collapse._jQueryInterface
$.fn[NAME].Constructor = Collapse
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT
  return Collapse._jQueryInterface
}

export default Collapse

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.5.3): dropdown.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import $ from 'jquery'
import Popper from 'popper.js'
import Util from './util'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'dropdown'
const VERSION = '4.5.3'
const DATA_KEY = 'bs.dropdown'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'
const JQUERY_NO_CONFLICT = $.fn[NAME]
const ESCAPE_KEYCODE = 27 // KeyboardEvent.which value for Escape (Esc) key
const SPACE_KEYCODE = 32 // KeyboardEvent.which value for space key
const TAB_KEYCODE = 9 // KeyboardEvent.which value for tab key
const ARROW_UP_KEYCODE = 38 // KeyboardEvent.which value for up arrow key
const ARROW_DOWN_KEYCODE = 40 // KeyboardEvent.which value for down arrow key
const RIGHT_MOUSE_BUTTON_WHICH = 3 // MouseEvent.which value for the right button (assuming a right-handed mouse)
const REGEXP_KEYDOWN = new RegExp(`${ARROW_UP_KEYCODE}|${ARROW_DOWN_KEYCODE}|${ESCAPE_KEYCODE}`)

const EVENT_HIDE = `hide${EVENT_KEY}`
const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_SHOW = `show${EVENT_KEY}`
const EVENT_SHOWN = `shown${EVENT_KEY}`
const EVENT_CLICK = `click${EVENT_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`
const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY}${DATA_API_KEY}`
const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY}${DATA_API_KEY}`

const CLASS_NAME_DISABLED = 'disabled'
const CLASS_NAME_SHOW = 'show'
const CLASS_NAME_DROPUP = 'dropup'
const CLASS_NAME_DROPRIGHT = 'dropright'
const CLASS_NAME_DROPLEFT = 'dropleft'
const CLASS_NAME_MENURIGHT = 'dropdown-menu-right'
const CLASS_NAME_POSITION_STATIC = 'position-static'

const SELECTOR_DATA_TOGGLE = '[data-toggle="dropdown"]'
const SELECTOR_FORM_CHILD = '.dropdown form'
const SELECTOR_MENU = '.dropdown-menu'
const SELECTOR_NAVBAR_NAV = '.navbar-nav'
const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)'

const PLACEMENT_TOP = 'top-start'
const PLACEMENT_TOPEND = 'top-end'
const PLACEMENT_BOTTOM = 'bottom-start'
const PLACEMENT_BOTTOMEND = 'bottom-end'
const PLACEMENT_RIGHT = 'right-start'
const PLACEMENT_LEFT = 'left-start'

const Default = {
  offset: 0,
  flip: true,
  boundary: 'scrollParent',
  reference: 'toggle',
  display: 'dynamic',
  popperConfig: null
}

const DefaultType = {
  offset: '(number|string|function)',
  flip: 'boolean',
  boundary: '(string|element)',
  reference: '(string|element)',
  display: 'string',
  popperConfig: '(null|object)'
}

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Dropdown {
  constructor(element, config) {
    this._element = element
    this._popper = null
    this._config = this._getConfig(config)
    this._menu = this._getMenuElement()
    this._inNavbar = this._detectNavbar()

    this._addEventListeners()
  }

  // Getters

  static get VERSION() {
    return VERSION
  }

  static get Default() {
    return Default
  }

  static get DefaultType() {
    return DefaultType
  }

  // Public

  toggle() {
    if (this._element.disabled || $(this._element).hasClass(CLASS_NAME_DISABLED)) {
      return
    }

    const isActive = $(this._menu).hasClass(CLASS_NAME_SHOW)

    Dropdown._clearMenus()

    if (isActive) {
      return
    }

    this.show(true)
  }

  show(usePopper = false) {
    if (this._element.disabled || $(this._element).hasClass(CLASS_NAME_DISABLED) || $(this._menu).hasClass(CLASS_NAME_SHOW)) {
      return
    }

    const relatedTarget = {
      relatedTarget: this._element
    }
    const showEvent = $.Event(EVENT_SHOW, relatedTarget)
    const parent = Dropdown._getParentFromElement(this._element)

    $(parent).trigger(showEvent)

    if (showEvent.isDefaultPrevented()) {
      return
    }

    // Disable totally Popper.js for Dropdown in Navbar
    if (!this._inNavbar && usePopper) {
      /**
       * Check for Popper dependency
       * Popper - https://popper.js.org
       */
      if (typeof Popper === 'undefined') {
        throw new TypeError('Bootstrap\'s dropdowns require Popper.js (https://popper.js.org/)')
      }

      let referenceElement = this._element

      if (this._config.reference === 'parent') {
        referenceElement = parent
      } else if (Util.isElement(this._config.reference)) {
        referenceElement = this._config.reference

        // Check if it's jQuery element
        if (typeof this._config.reference.jquery !== 'undefined') {
          referenceElement = this._config.reference[0]
        }
      }

      // If boundary is not `scrollParent`, then set position to `static`
      // to allow the menu to "escape" the scroll parent's boundaries
      // https://github.com/twbs/bootstrap/issues/24251
      if (this._config.boundary !== 'scrollParent') {
        $(parent).addClass(CLASS_NAME_POSITION_STATIC)
      }

      this._popper = new Popper(referenceElement, this._menu, this._getPopperConfig())
    }

    // If this is a touch-enabled device we add extra
    // empty mouseover listeners to the body's immediate children;
    // only needed because of broken event delegation on iOS
    // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
    if ('ontouchstart' in document.documentElement &&
        $(parent).closest(SELECTOR_NAVBAR_NAV).length === 0) {
      $(document.body).children().on('mouseover', null, $.noop)
    }

    this._element.focus()
    this._element.setAttribute('aria-expanded', true)

    $(this._menu).toggleClass(CLASS_NAME_SHOW)
    $(parent)
      .toggleClass(CLASS_NAME_SHOW)
      .trigger($.Event(EVENT_SHOWN, relatedTarget))
  }

  hide() {
    if (this._element.disabled || $(this._element).hasClass(CLASS_NAME_DISABLED) || !$(this._menu).hasClass(CLASS_NAME_SHOW)) {
      return
    }

    const relatedTarget = {
      relatedTarget: this._element
    }
    const hideEvent = $.Event(EVENT_HIDE, relatedTarget)
    const parent = Dropdown._getParentFromElement(this._element)

    $(parent).trigger(hideEvent)

    if (hideEvent.isDefaultPrevented()) {
      return
    }

    if (this._popper) {
      this._popper.destroy()
    }

    $(this._menu).toggleClass(CLASS_NAME_SHOW)
    $(parent)
      .toggleClass(CLASS_NAME_SHOW)
      .trigger($.Event(EVENT_HIDDEN, relatedTarget))
  }

  dispose() {
    $.removeData(this._element, DATA_KEY)
    $(this._element).off(EVENT_KEY)
    this._element = null
    this._menu = null
    if (this._popper !== null) {
      this._popper.destroy()
      this._popper = null
    }
  }

  update() {
    this._inNavbar = this._detectNavbar()
    if (this._popper !== null) {
      this._popper.scheduleUpdate()
    }
  }

  // Private

  _addEventListeners() {
    $(this._element).on(EVENT_CLICK, event => {
      event.preventDefault()
      event.stopPropagation()
      this.toggle()
    })
  }

  _getConfig(config) {
    config = {
      ...this.constructor.Default,
      ...$(this._element).data(),
      ...config
    }

    Util.typeCheckConfig(
      NAME,
      config,
      this.constructor.DefaultType
    )

    return config
  }

  _getMenuElement() {
    if (!this._menu) {
      const parent = Dropdown._getParentFromElement(this._element)

      if (parent) {
        this._menu = parent.querySelector(SELECTOR_MENU)
      }
    }

    return this._menu
  }

  _getPlacement() {
    const $parentDropdown = $(this._element.parentNode)
    let placement = PLACEMENT_BOTTOM

    // Handle dropup
    if ($parentDropdown.hasClass(CLASS_NAME_DROPUP)) {
      placement = $(this._menu).hasClass(CLASS_NAME_MENURIGHT) ?
        PLACEMENT_TOPEND :
        PLACEMENT_TOP
    } else if ($parentDropdown.hasClass(CLASS_NAME_DROPRIGHT)) {
      placement = PLACEMENT_RIGHT
    } else if ($parentDropdown.hasClass(CLASS_NAME_DROPLEFT)) {
      placement = PLACEMENT_LEFT
    } else if ($(this._menu).hasClass(CLASS_NAME_MENURIGHT)) {
      placement = PLACEMENT_BOTTOMEND
    }

    return placement
  }

  _detectNavbar() {
    return $(this._element).closest('.navbar').length > 0
  }

  _getOffset() {
    const offset = {}

    if (typeof this._config.offset === 'function') {
      offset.fn = data => {
        data.offsets = {
          ...data.offsets,
          ...(this._config.offset(data.offsets, this._element) || {})
        }

        return data
      }
    } else {
      offset.offset = this._config.offset
    }

    return offset
  }

  _getPopperConfig() {
    const popperConfig = {
      placement: this._getPlacement(),
      modifiers: {
        offset: this._getOffset(),
        flip: {
          enabled: this._config.flip
        },
        preventOverflow: {
          boundariesElement: this._config.boundary
        }
      }
    }

    // Disable Popper.js if we have a static display
    if (this._config.display === 'static') {
      popperConfig.modifiers.applyStyle = {
        enabled: false
      }
    }

    return {
      ...popperConfig,
      ...this._config.popperConfig
    }
  }

  // Static

  static _jQueryInterface(config) {
    return this.each(function () {
      let data = $(this).data(DATA_KEY)
      const _config = typeof config === 'object' ? config : null

      if (!data) {
        data = new Dropdown(this, _config)
        $(this).data(DATA_KEY, data)
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`)
        }

        data[config]()
      }
    })
  }

  static _clearMenus(event) {
    if (event && (event.which === RIGHT_MOUSE_BUTTON_WHICH ||
      event.type === 'keyup' && event.which !== TAB_KEYCODE)) {
      return
    }

    const toggles = [].slice.call(document.querySelectorAll(SELECTOR_DATA_TOGGLE))

    for (let i = 0, len = toggles.length; i < len; i++) {
      const parent = Dropdown._getParentFromElement(toggles[i])
      const context = $(toggles[i]).data(DATA_KEY)
      const relatedTarget = {
        relatedTarget: toggles[i]
      }

      if (event && event.type === 'click') {
        relatedTarget.clickEvent = event
      }

      if (!context) {
        continue
      }

      const dropdownMenu = context._menu
      if (!$(parent).hasClass(CLASS_NAME_SHOW)) {
        continue
      }

      if (event && (event.type === 'click' &&
          /input|textarea/i.test(event.target.tagName) || event.type === 'keyup' && event.which === TAB_KEYCODE) &&
          $.contains(parent, event.target)) {
        continue
      }

      const hideEvent = $.Event(EVENT_HIDE, relatedTarget)
      $(parent).trigger(hideEvent)
      if (hideEvent.isDefaultPrevented()) {
        continue
      }

      // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support
      if ('ontouchstart' in document.documentElement) {
        $(document.body).children().off('mouseover', null, $.noop)
      }

      toggles[i].setAttribute('aria-expanded', 'false')

      if (context._popper) {
        context._popper.destroy()
      }

      $(dropdownMenu).removeClass(CLASS_NAME_SHOW)
      $(parent)
        .removeClass(CLASS_NAME_SHOW)
        .trigger($.Event(EVENT_HIDDEN, relatedTarget))
    }
  }

  static _getParentFromElement(element) {
    let parent
    const selector = Util.getSelectorFromElement(element)

    if (selector) {
      parent = document.querySelector(selector)
    }

    return parent || element.parentNode
  }

  // eslint-disable-next-line complexity
  static _dataApiKeydownHandler(event) {
    // If not input/textarea:
    //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
    // If input/textarea:
    //  - If space key => not a dropdown command
    //  - If key is other than escape
    //    - If key is not up or down => not a dropdown command
    //    - If trigger inside the menu => not a dropdown command
    if (/input|textarea/i.test(event.target.tagName) ?
      event.which === SPACE_KEYCODE || event.which !== ESCAPE_KEYCODE &&
      (event.which !== ARROW_DOWN_KEYCODE && event.which !== ARROW_UP_KEYCODE ||
        $(event.target).closest(SELECTOR_MENU).length) : !REGEXP_KEYDOWN.test(event.which)) {
      return
    }

    if (this.disabled || $(this).hasClass(CLASS_NAME_DISABLED)) {
      return
    }

    const parent = Dropdown._getParentFromElement(this)
    const isActive = $(parent).hasClass(CLASS_NAME_SHOW)

    if (!isActive && event.which === ESCAPE_KEYCODE) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    if (!isActive || (event.which === ESCAPE_KEYCODE || event.which === SPACE_KEYCODE)) {
      if (event.which === ESCAPE_KEYCODE) {
        $(parent.querySelector(SELECTOR_DATA_TOGGLE)).trigger('focus')
      }

      $(this).trigger('click')
      return
    }

    const items = [].slice.call(parent.querySelectorAll(SELECTOR_VISIBLE_ITEMS))
      .filter(item => $(item).is(':visible'))

    if (items.length === 0) {
      return
    }

    let index = items.indexOf(event.target)

    if (event.which === ARROW_UP_KEYCODE && index > 0) { // Up
      index--
    }

    if (event.which === ARROW_DOWN_KEYCODE && index < items.length - 1) { // Down
      index++
    }

    if (index < 0) {
      index = 0
    }

    items[index].focus()
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(document)
  .on(EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE, Dropdown._dataApiKeydownHandler)
  .on(EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown._dataApiKeydownHandler)
  .on(`${EVENT_CLICK_DATA_API} ${EVENT_KEYUP_DATA_API}`, Dropdown._clearMenus)
  .on(EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
    event.preventDefault()
    event.stopPropagation()
    Dropdown._jQueryInterface.call($(this), 'toggle')
  })
  .on(EVENT_CLICK_DATA_API, SELECTOR_FORM_CHILD, e => {
    e.stopPropagation()
  })

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

$.fn[NAME] = Dropdown._jQueryInterface
$.fn[NAME].Constructor = Dropdown
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT
  return Dropdown._jQueryInterface
}

export default Dropdown

import Alert from './alert'
import Button from './button'
import Carousel from './carousel'
import Collapse from './collapse'
import Dropdown from './dropdown'
import Modal from './modal'
import Popover from './popover'
import Scrollspy from './scrollspy'
import Tab from './tab'
import Toast from './toast'
import Tooltip from './tooltip'
import Util from './util'

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.5.3): index.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

export {
  Util,
  Alert,
  Button,
  Carousel,
  Collapse,
  Dropdown,
  Modal,
  Popover,
  Scrollspy,
  Tab,
  Toast,
  Tooltip,
  $
}

// import Alert from './alert'
// import Button from './button'
// import Carousel from './carousel'
// import Collapse from './collapse'
// import Dropdown from './dropdown'
// import Modal from './modal'
// import Popover from './popover'
// import Scrollspy from './scrollspy'
// import Tab from './tab'
// import Toast from './toast'
// import Tooltip from './tooltip'
// import Util from './util'

// /**
//  * --------------------------------------------------------------------------
//  * Bootstrap (v4.5.3): index.js
//  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
//  * --------------------------------------------------------------------------
//  */

// export {
//   Util,
//   Alert,
//   Button,
//   Carousel,
//   Collapse,
//   Dropdown,
//   Modal,
//   Popover,
//   Scrollspy,
//   Tab,
//   Toast,
//   Tooltip
// }

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.5.3): modal.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import $ from 'jquery'
import Util from './util'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'modal'
const VERSION = '4.5.3'
const DATA_KEY = 'bs.modal'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'
const JQUERY_NO_CONFLICT = $.fn[NAME]
const ESCAPE_KEYCODE = 27 // KeyboardEvent.which value for Escape (Esc) key

const Default = {
  backdrop: true,
  keyboard: true,
  focus: true,
  show: true
}

const DefaultType = {
  backdrop: '(boolean|string)',
  keyboard: 'boolean',
  focus: 'boolean',
  show: 'boolean'
}

const EVENT_HIDE = `hide${EVENT_KEY}`
const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY}`
const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_SHOW = `show${EVENT_KEY}`
const EVENT_SHOWN = `shown${EVENT_KEY}`
const EVENT_FOCUSIN = `focusin${EVENT_KEY}`
const EVENT_RESIZE = `resize${EVENT_KEY}`
const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY}`
const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY}`
const EVENT_MOUSEUP_DISMISS = `mouseup.dismiss${EVENT_KEY}`
const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`

const CLASS_NAME_SCROLLABLE = 'modal-dialog-scrollable'
const CLASS_NAME_SCROLLBAR_MEASURER = 'modal-scrollbar-measure'
const CLASS_NAME_BACKDROP = 'modal-backdrop'
const CLASS_NAME_OPEN = 'modal-open'
const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_SHOW = 'show'
const CLASS_NAME_STATIC = 'modal-static'

const SELECTOR_DIALOG = '.modal-dialog'
const SELECTOR_MODAL_BODY = '.modal-body'
const SELECTOR_DATA_TOGGLE = '[data-toggle="modal"]'
const SELECTOR_DATA_DISMISS = '[data-dismiss="modal"]'
const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top'
const SELECTOR_STICKY_CONTENT = '.sticky-top'

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Modal {
  constructor(element, config) {
    this._config = this._getConfig(config)
    this._element = element
    this._dialog = element.querySelector(SELECTOR_DIALOG)
    this._backdrop = null
    this._isShown = false
    this._isBodyOverflowing = false
    this._ignoreBackdropClick = false
    this._isTransitioning = false
    this._scrollbarWidth = 0
  }

  // Getters

  static get VERSION() {
    return VERSION
  }

  static get Default() {
    return Default
  }

  // Public

  toggle(relatedTarget) {
    return this._isShown ? this.hide() : this.show(relatedTarget)
  }

  show(relatedTarget) {
    if (this._isShown || this._isTransitioning) {
      return
    }

    if ($(this._element).hasClass(CLASS_NAME_FADE)) {
      this._isTransitioning = true
    }

    const showEvent = $.Event(EVENT_SHOW, {
      relatedTarget
    })

    $(this._element).trigger(showEvent)

    if (this._isShown || showEvent.isDefaultPrevented()) {
      return
    }

    this._isShown = true

    this._checkScrollbar()
    this._setScrollbar()

    this._adjustDialog()

    this._setEscapeEvent()
    this._setResizeEvent()

    $(this._element).on(
      EVENT_CLICK_DISMISS,
      SELECTOR_DATA_DISMISS,
      event => this.hide(event)
    )

    $(this._dialog).on(EVENT_MOUSEDOWN_DISMISS, () => {
      $(this._element).one(EVENT_MOUSEUP_DISMISS, event => {
        if ($(event.target).is(this._element)) {
          this._ignoreBackdropClick = true
        }
      })
    })

    this._showBackdrop(() => this._showElement(relatedTarget))
  }

  hide(event) {
    if (event) {
      event.preventDefault()
    }

    if (!this._isShown || this._isTransitioning) {
      return
    }

    const hideEvent = $.Event(EVENT_HIDE)

    $(this._element).trigger(hideEvent)

    if (!this._isShown || hideEvent.isDefaultPrevented()) {
      return
    }

    this._isShown = false
    const transition = $(this._element).hasClass(CLASS_NAME_FADE)

    if (transition) {
      this._isTransitioning = true
    }

    this._setEscapeEvent()
    this._setResizeEvent()

    $(document).off(EVENT_FOCUSIN)

    $(this._element).removeClass(CLASS_NAME_SHOW)

    $(this._element).off(EVENT_CLICK_DISMISS)
    $(this._dialog).off(EVENT_MOUSEDOWN_DISMISS)

    if (transition) {
      const transitionDuration = Util.getTransitionDurationFromElement(this._element)

      $(this._element)
        .one(Util.TRANSITION_END, event => this._hideModal(event))
        .emulateTransitionEnd(transitionDuration)
    } else {
      this._hideModal()
    }
  }

  dispose() {
    [window, this._element, this._dialog]
      .forEach(htmlElement => $(htmlElement).off(EVENT_KEY))

    /**
     * `document` has 2 events `EVENT_FOCUSIN` and `EVENT_CLICK_DATA_API`
     * Do not move `document` in `htmlElements` array
     * It will remove `EVENT_CLICK_DATA_API` event that should remain
     */
    $(document).off(EVENT_FOCUSIN)

    $.removeData(this._element, DATA_KEY)

    this._config = null
    this._element = null
    this._dialog = null
    this._backdrop = null
    this._isShown = null
    this._isBodyOverflowing = null
    this._ignoreBackdropClick = null
    this._isTransitioning = null
    this._scrollbarWidth = null
  }

  handleUpdate() {
    this._adjustDialog()
  }

  // Private

  _getConfig(config) {
    config = {
      ...Default,
      ...config
    }
    Util.typeCheckConfig(NAME, config, DefaultType)
    return config
  }

  _triggerBackdropTransition() {
    if (this._config.backdrop === 'static') {
      const hideEventPrevented = $.Event(EVENT_HIDE_PREVENTED)

      $(this._element).trigger(hideEventPrevented)
      if (hideEventPrevented.isDefaultPrevented()) {
        return
      }

      const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight

      if (!isModalOverflowing) {
        this._element.style.overflowY = 'hidden'
      }

      this._element.classList.add(CLASS_NAME_STATIC)

      const modalTransitionDuration = Util.getTransitionDurationFromElement(this._dialog)
      $(this._element).off(Util.TRANSITION_END)

      $(this._element).one(Util.TRANSITION_END, () => {
        this._element.classList.remove(CLASS_NAME_STATIC)
        if (!isModalOverflowing) {
          $(this._element).one(Util.TRANSITION_END, () => {
            this._element.style.overflowY = ''
          })
            .emulateTransitionEnd(this._element, modalTransitionDuration)
        }
      })
        .emulateTransitionEnd(modalTransitionDuration)
      this._element.focus()
    } else {
      this.hide()
    }
  }

  _showElement(relatedTarget) {
    const transition = $(this._element).hasClass(CLASS_NAME_FADE)
    const modalBody = this._dialog ? this._dialog.querySelector(SELECTOR_MODAL_BODY) : null

    if (!this._element.parentNode ||
        this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
      // Don't move modal's DOM position
      document.body.appendChild(this._element)
    }

    this._element.style.display = 'block'
    this._element.removeAttribute('aria-hidden')
    this._element.setAttribute('aria-modal', true)
    this._element.setAttribute('role', 'dialog')

    if ($(this._dialog).hasClass(CLASS_NAME_SCROLLABLE) && modalBody) {
      modalBody.scrollTop = 0
    } else {
      this._element.scrollTop = 0
    }

    if (transition) {
      Util.reflow(this._element)
    }

    $(this._element).addClass(CLASS_NAME_SHOW)

    if (this._config.focus) {
      this._enforceFocus()
    }

    const shownEvent = $.Event(EVENT_SHOWN, {
      relatedTarget
    })

    const transitionComplete = () => {
      if (this._config.focus) {
        this._element.focus()
      }

      this._isTransitioning = false
      $(this._element).trigger(shownEvent)
    }

    if (transition) {
      const transitionDuration = Util.getTransitionDurationFromElement(this._dialog)

      $(this._dialog)
        .one(Util.TRANSITION_END, transitionComplete)
        .emulateTransitionEnd(transitionDuration)
    } else {
      transitionComplete()
    }
  }

  _enforceFocus() {
    $(document)
      .off(EVENT_FOCUSIN) // Guard against infinite focus loop
      .on(EVENT_FOCUSIN, event => {
        if (document !== event.target &&
            this._element !== event.target &&
            $(this._element).has(event.target).length === 0) {
          this._element.focus()
        }
      })
  }

  _setEscapeEvent() {
    if (this._isShown) {
      $(this._element).on(EVENT_KEYDOWN_DISMISS, event => {
        if (this._config.keyboard && event.which === ESCAPE_KEYCODE) {
          event.preventDefault()
          this.hide()
        } else if (!this._config.keyboard && event.which === ESCAPE_KEYCODE) {
          this._triggerBackdropTransition()
        }
      })
    } else if (!this._isShown) {
      $(this._element).off(EVENT_KEYDOWN_DISMISS)
    }
  }

  _setResizeEvent() {
    if (this._isShown) {
      $(window).on(EVENT_RESIZE, event => this.handleUpdate(event))
    } else {
      $(window).off(EVENT_RESIZE)
    }
  }

  _hideModal() {
    this._element.style.display = 'none'
    this._element.setAttribute('aria-hidden', true)
    this._element.removeAttribute('aria-modal')
    this._element.removeAttribute('role')
    this._isTransitioning = false
    this._showBackdrop(() => {
      $(document.body).removeClass(CLASS_NAME_OPEN)
      this._resetAdjustments()
      this._resetScrollbar()
      $(this._element).trigger(EVENT_HIDDEN)
    })
  }

  _removeBackdrop() {
    if (this._backdrop) {
      $(this._backdrop).remove()
      this._backdrop = null
    }
  }

  _showBackdrop(callback) {
    const animate = $(this._element).hasClass(CLASS_NAME_FADE) ?
      CLASS_NAME_FADE : ''

    if (this._isShown && this._config.backdrop) {
      this._backdrop = document.createElement('div')
      this._backdrop.className = CLASS_NAME_BACKDROP

      if (animate) {
        this._backdrop.classList.add(animate)
      }

      $(this._backdrop).appendTo(document.body)

      $(this._element).on(EVENT_CLICK_DISMISS, event => {
        if (this._ignoreBackdropClick) {
          this._ignoreBackdropClick = false
          return
        }

        if (event.target !== event.currentTarget) {
          return
        }

        this._triggerBackdropTransition()
      })

      if (animate) {
        Util.reflow(this._backdrop)
      }

      $(this._backdrop).addClass(CLASS_NAME_SHOW)

      if (!callback) {
        return
      }

      if (!animate) {
        callback()
        return
      }

      const backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop)

      $(this._backdrop)
        .one(Util.TRANSITION_END, callback)
        .emulateTransitionEnd(backdropTransitionDuration)
    } else if (!this._isShown && this._backdrop) {
      $(this._backdrop).removeClass(CLASS_NAME_SHOW)

      const callbackRemove = () => {
        this._removeBackdrop()
        if (callback) {
          callback()
        }
      }

      if ($(this._element).hasClass(CLASS_NAME_FADE)) {
        const backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop)

        $(this._backdrop)
          .one(Util.TRANSITION_END, callbackRemove)
          .emulateTransitionEnd(backdropTransitionDuration)
      } else {
        callbackRemove()
      }
    } else if (callback) {
      callback()
    }
  }

  // ----------------------------------------------------------------------
  // the following methods are used to handle overflowing modals
  // todo (fat): these should probably be refactored out of modal.js
  // ----------------------------------------------------------------------

  _adjustDialog() {
    const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight

    if (!this._isBodyOverflowing && isModalOverflowing) {
      this._element.style.paddingLeft = `${this._scrollbarWidth}px`
    }

    if (this._isBodyOverflowing && !isModalOverflowing) {
      this._element.style.paddingRight = `${this._scrollbarWidth}px`
    }
  }

  _resetAdjustments() {
    this._element.style.paddingLeft = ''
    this._element.style.paddingRight = ''
  }

  _checkScrollbar() {
    const rect = document.body.getBoundingClientRect()
    this._isBodyOverflowing = Math.round(rect.left + rect.right) < window.innerWidth
    this._scrollbarWidth = this._getScrollbarWidth()
  }

  _setScrollbar() {
    if (this._isBodyOverflowing) {
      // Note: DOMNode.style.paddingRight returns the actual value or '' if not set
      //   while $(DOMNode).css('padding-right') returns the calculated value or 0 if not set
      const fixedContent = [].slice.call(document.querySelectorAll(SELECTOR_FIXED_CONTENT))
      const stickyContent = [].slice.call(document.querySelectorAll(SELECTOR_STICKY_CONTENT))

      // Adjust fixed content padding
      $(fixedContent).each((index, element) => {
        const actualPadding = element.style.paddingRight
        const calculatedPadding = $(element).css('padding-right')
        $(element)
          .data('padding-right', actualPadding)
          .css('padding-right', `${parseFloat(calculatedPadding) + this._scrollbarWidth}px`)
      })

      // Adjust sticky content margin
      $(stickyContent).each((index, element) => {
        const actualMargin = element.style.marginRight
        const calculatedMargin = $(element).css('margin-right')
        $(element)
          .data('margin-right', actualMargin)
          .css('margin-right', `${parseFloat(calculatedMargin) - this._scrollbarWidth}px`)
      })

      // Adjust body padding
      const actualPadding = document.body.style.paddingRight
      const calculatedPadding = $(document.body).css('padding-right')
      $(document.body)
        .data('padding-right', actualPadding)
        .css('padding-right', `${parseFloat(calculatedPadding) + this._scrollbarWidth}px`)
    }

    $(document.body).addClass(CLASS_NAME_OPEN)
  }

  _resetScrollbar() {
    // Restore fixed content padding
    const fixedContent = [].slice.call(document.querySelectorAll(SELECTOR_FIXED_CONTENT))
    $(fixedContent).each((index, element) => {
      const padding = $(element).data('padding-right')
      $(element).removeData('padding-right')
      element.style.paddingRight = padding ? padding : ''
    })

    // Restore sticky content
    const elements = [].slice.call(document.querySelectorAll(`${SELECTOR_STICKY_CONTENT}`))
    $(elements).each((index, element) => {
      const margin = $(element).data('margin-right')
      if (typeof margin !== 'undefined') {
        $(element).css('margin-right', margin).removeData('margin-right')
      }
    })

    // Restore body padding
    const padding = $(document.body).data('padding-right')
    $(document.body).removeData('padding-right')
    document.body.style.paddingRight = padding ? padding : ''
  }

  _getScrollbarWidth() { // thx d.walsh
    const scrollDiv = document.createElement('div')
    scrollDiv.className = CLASS_NAME_SCROLLBAR_MEASURER
    document.body.appendChild(scrollDiv)
    const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth
    document.body.removeChild(scrollDiv)
    return scrollbarWidth
  }

  // Static

  static _jQueryInterface(config, relatedTarget) {
    return this.each(function () {
      let data = $(this).data(DATA_KEY)
      const _config = {
        ...Default,
        ...$(this).data(),
        ...(typeof config === 'object' && config ? config : {})
      }

      if (!data) {
        data = new Modal(this, _config)
        $(this).data(DATA_KEY, data)
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`)
        }

        data[config](relatedTarget)
      } else if (_config.show) {
        data.show(relatedTarget)
      }
    })
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(document).on(EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  let target
  const selector = Util.getSelectorFromElement(this)

  if (selector) {
    target = document.querySelector(selector)
  }

  const config = $(target).data(DATA_KEY) ?
    'toggle' : {
      ...$(target).data(),
      ...$(this).data()
    }

  if (this.tagName === 'A' || this.tagName === 'AREA') {
    event.preventDefault()
  }

  const $target = $(target).one(EVENT_SHOW, showEvent => {
    if (showEvent.isDefaultPrevented()) {
      // Only register focus restorer if modal will actually get shown
      return
    }

    $target.one(EVENT_HIDDEN, () => {
      if ($(this).is(':visible')) {
        this.focus()
      }
    })
  })

  Modal._jQueryInterface.call($(target), config, this)
})

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

$.fn[NAME] = Modal._jQueryInterface
$.fn[NAME].Constructor = Modal
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT
  return Modal._jQueryInterface
}

export default Modal

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.5.3): popover.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import $ from 'jquery'
import Tooltip from './tooltip'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'popover'
const VERSION = '4.5.3'
const DATA_KEY = 'bs.popover'
const EVENT_KEY = `.${DATA_KEY}`
const JQUERY_NO_CONFLICT = $.fn[NAME]
const CLASS_PREFIX = 'bs-popover'
const BSCLS_PREFIX_REGEX = new RegExp(`(^|\\s)${CLASS_PREFIX}\\S+`, 'g')

const Default = {
  ...Tooltip.Default,
  placement: 'right',
  trigger: 'click',
  content: '',
  template: '<div class="popover" role="tooltip">' +
              '<div class="arrow"></div>' +
              '<h3 class="popover-header"></h3>' +
              '<div class="popover-body"></div></div>'
}

const DefaultType = {
  ...Tooltip.DefaultType,
  content: '(string|element|function)'
}

const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_SHOW = 'show'

const SELECTOR_TITLE = '.popover-header'
const SELECTOR_CONTENT = '.popover-body'

const Event = {
  HIDE: `hide${EVENT_KEY}`,
  HIDDEN: `hidden${EVENT_KEY}`,
  SHOW: `show${EVENT_KEY}`,
  SHOWN: `shown${EVENT_KEY}`,
  INSERTED: `inserted${EVENT_KEY}`,
  CLICK: `click${EVENT_KEY}`,
  FOCUSIN: `focusin${EVENT_KEY}`,
  FOCUSOUT: `focusout${EVENT_KEY}`,
  MOUSEENTER: `mouseenter${EVENT_KEY}`,
  MOUSELEAVE: `mouseleave${EVENT_KEY}`
}

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Popover extends Tooltip {
  // Getters

  static get VERSION() {
    return VERSION
  }

  static get Default() {
    return Default
  }

  static get NAME() {
    return NAME
  }

  static get DATA_KEY() {
    return DATA_KEY
  }

  static get Event() {
    return Event
  }

  static get EVENT_KEY() {
    return EVENT_KEY
  }

  static get DefaultType() {
    return DefaultType
  }

  // Overrides

  isWithContent() {
    return this.getTitle() || this._getContent()
  }

  addAttachmentClass(attachment) {
    $(this.getTipElement()).addClass(`${CLASS_PREFIX}-${attachment}`)
  }

  getTipElement() {
    this.tip = this.tip || $(this.config.template)[0]
    return this.tip
  }

  setContent() {
    const $tip = $(this.getTipElement())

    // We use append for html objects to maintain js events
    this.setElementContent($tip.find(SELECTOR_TITLE), this.getTitle())
    let content = this._getContent()
    if (typeof content === 'function') {
      content = content.call(this.element)
    }

    this.setElementContent($tip.find(SELECTOR_CONTENT), content)

    $tip.removeClass(`${CLASS_NAME_FADE} ${CLASS_NAME_SHOW}`)
  }

  // Private

  _getContent() {
    return this.element.getAttribute('data-content') ||
      this.config.content
  }

  _cleanTipClass() {
    const $tip = $(this.getTipElement())
    const tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX)
    if (tabClass !== null && tabClass.length > 0) {
      $tip.removeClass(tabClass.join(''))
    }
  }

  // Static

  static _jQueryInterface(config) {
    return this.each(function () {
      let data = $(this).data(DATA_KEY)
      const _config = typeof config === 'object' ? config : null

      if (!data && /dispose|hide/.test(config)) {
        return
      }

      if (!data) {
        data = new Popover(this, _config)
        $(this).data(DATA_KEY, data)
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`)
        }

        data[config]()
      }
    })
  }
}

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

$.fn[NAME] = Popover._jQueryInterface
$.fn[NAME].Constructor = Popover
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT
  return Popover._jQueryInterface
}

export default Popover

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.5.3): scrollspy.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import $ from 'jquery'
import Util from './util'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'scrollspy'
const VERSION = '4.5.3'
const DATA_KEY = 'bs.scrollspy'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'
const JQUERY_NO_CONFLICT = $.fn[NAME]

const Default = {
  offset: 10,
  method: 'auto',
  target: ''
}

const DefaultType = {
  offset: 'number',
  method: 'string',
  target: '(string|element)'
}

const EVENT_ACTIVATE = `activate${EVENT_KEY}`
const EVENT_SCROLL = `scroll${EVENT_KEY}`
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`

const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item'
const CLASS_NAME_ACTIVE = 'active'

const SELECTOR_DATA_SPY = '[data-spy="scroll"]'
const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group'
const SELECTOR_NAV_LINKS = '.nav-link'
const SELECTOR_NAV_ITEMS = '.nav-item'
const SELECTOR_LIST_ITEMS = '.list-group-item'
const SELECTOR_DROPDOWN = '.dropdown'
const SELECTOR_DROPDOWN_ITEMS = '.dropdown-item'
const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle'

const METHOD_OFFSET = 'offset'
const METHOD_POSITION = 'position'

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class ScrollSpy {
  constructor(element, config) {
    this._element = element
    this._scrollElement = element.tagName === 'BODY' ? window : element
    this._config = this._getConfig(config)
    this._selector = `${this._config.target} ${SELECTOR_NAV_LINKS},` +
                          `${this._config.target} ${SELECTOR_LIST_ITEMS},` +
                          `${this._config.target} ${SELECTOR_DROPDOWN_ITEMS}`
    this._offsets = []
    this._targets = []
    this._activeTarget = null
    this._scrollHeight = 0

    $(this._scrollElement).on(EVENT_SCROLL, event => this._process(event))

    this.refresh()
    this._process()
  }

  // Getters

  static get VERSION() {
    return VERSION
  }

  static get Default() {
    return Default
  }

  // Public

  refresh() {
    const autoMethod = this._scrollElement === this._scrollElement.window ?
      METHOD_OFFSET : METHOD_POSITION

    const offsetMethod = this._config.method === 'auto' ?
      autoMethod : this._config.method

    const offsetBase = offsetMethod === METHOD_POSITION ?
      this._getScrollTop() : 0

    this._offsets = []
    this._targets = []

    this._scrollHeight = this._getScrollHeight()

    const targets = [].slice.call(document.querySelectorAll(this._selector))

    targets
      .map(element => {
        let target
        const targetSelector = Util.getSelectorFromElement(element)

        if (targetSelector) {
          target = document.querySelector(targetSelector)
        }

        if (target) {
          const targetBCR = target.getBoundingClientRect()
          if (targetBCR.width || targetBCR.height) {
            // TODO (fat): remove sketch reliance on jQuery position/offset
            return [
              $(target)[offsetMethod]().top + offsetBase,
              targetSelector
            ]
          }
        }

        return null
      })
      .filter(item => item)
      .sort((a, b) => a[0] - b[0])
      .forEach(item => {
        this._offsets.push(item[0])
        this._targets.push(item[1])
      })
  }

  dispose() {
    $.removeData(this._element, DATA_KEY)
    $(this._scrollElement).off(EVENT_KEY)

    this._element = null
    this._scrollElement = null
    this._config = null
    this._selector = null
    this._offsets = null
    this._targets = null
    this._activeTarget = null
    this._scrollHeight = null
  }

  // Private

  _getConfig(config) {
    config = {
      ...Default,
      ...(typeof config === 'object' && config ? config : {})
    }

    if (typeof config.target !== 'string' && Util.isElement(config.target)) {
      let id = $(config.target).attr('id')
      if (!id) {
        id = Util.getUID(NAME)
        $(config.target).attr('id', id)
      }

      config.target = `#${id}`
    }

    Util.typeCheckConfig(NAME, config, DefaultType)

    return config
  }

  _getScrollTop() {
    return this._scrollElement === window ?
      this._scrollElement.pageYOffset : this._scrollElement.scrollTop
  }

  _getScrollHeight() {
    return this._scrollElement.scrollHeight || Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    )
  }

  _getOffsetHeight() {
    return this._scrollElement === window ?
      window.innerHeight : this._scrollElement.getBoundingClientRect().height
  }

  _process() {
    const scrollTop = this._getScrollTop() + this._config.offset
    const scrollHeight = this._getScrollHeight()
    const maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight()

    if (this._scrollHeight !== scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      const target = this._targets[this._targets.length - 1]

      if (this._activeTarget !== target) {
        this._activate(target)
      }

      return
    }

    if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {
      this._activeTarget = null
      this._clear()
      return
    }

    for (let i = this._offsets.length; i--;) {
      const isActiveTarget = this._activeTarget !== this._targets[i] &&
          scrollTop >= this._offsets[i] &&
          (typeof this._offsets[i + 1] === 'undefined' ||
              scrollTop < this._offsets[i + 1])

      if (isActiveTarget) {
        this._activate(this._targets[i])
      }
    }
  }

  _activate(target) {
    this._activeTarget = target

    this._clear()

    const queries = this._selector
      .split(',')
      .map(selector => `${selector}[data-target="${target}"],${selector}[href="${target}"]`)

    const $link = $([].slice.call(document.querySelectorAll(queries.join(','))))

    if ($link.hasClass(CLASS_NAME_DROPDOWN_ITEM)) {
      $link.closest(SELECTOR_DROPDOWN)
        .find(SELECTOR_DROPDOWN_TOGGLE)
        .addClass(CLASS_NAME_ACTIVE)
      $link.addClass(CLASS_NAME_ACTIVE)
    } else {
      // Set triggered link as active
      $link.addClass(CLASS_NAME_ACTIVE)
      // Set triggered links parents as active
      // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
      $link.parents(SELECTOR_NAV_LIST_GROUP)
        .prev(`${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`)
        .addClass(CLASS_NAME_ACTIVE)
      // Handle special case when .nav-link is inside .nav-item
      $link.parents(SELECTOR_NAV_LIST_GROUP)
        .prev(SELECTOR_NAV_ITEMS)
        .children(SELECTOR_NAV_LINKS)
        .addClass(CLASS_NAME_ACTIVE)
    }

    $(this._scrollElement).trigger(EVENT_ACTIVATE, {
      relatedTarget: target
    })
  }

  _clear() {
    [].slice.call(document.querySelectorAll(this._selector))
      .filter(node => node.classList.contains(CLASS_NAME_ACTIVE))
      .forEach(node => node.classList.remove(CLASS_NAME_ACTIVE))
  }

  // Static

  static _jQueryInterface(config) {
    return this.each(function () {
      let data = $(this).data(DATA_KEY)
      const _config = typeof config === 'object' && config

      if (!data) {
        data = new ScrollSpy(this, _config)
        $(this).data(DATA_KEY, data)
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`)
        }

        data[config]()
      }
    })
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(window).on(EVENT_LOAD_DATA_API, () => {
  const scrollSpys = [].slice.call(document.querySelectorAll(SELECTOR_DATA_SPY))
  const scrollSpysLength = scrollSpys.length

  for (let i = scrollSpysLength; i--;) {
    const $spy = $(scrollSpys[i])
    ScrollSpy._jQueryInterface.call($spy, $spy.data())
  }
})

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

$.fn[NAME] = ScrollSpy._jQueryInterface
$.fn[NAME].Constructor = ScrollSpy
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT
  return ScrollSpy._jQueryInterface
}

export default ScrollSpy

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.5.3): tab.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import $ from 'jquery'
import Util from './util'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'tab'
const VERSION = '4.5.3'
const DATA_KEY = 'bs.tab'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'
const JQUERY_NO_CONFLICT = $.fn[NAME]

const EVENT_HIDE = `hide${EVENT_KEY}`
const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_SHOW = `show${EVENT_KEY}`
const EVENT_SHOWN = `shown${EVENT_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`

const CLASS_NAME_DROPDOWN_MENU = 'dropdown-menu'
const CLASS_NAME_ACTIVE = 'active'
const CLASS_NAME_DISABLED = 'disabled'
const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_SHOW = 'show'

const SELECTOR_DROPDOWN = '.dropdown'
const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group'
const SELECTOR_ACTIVE = '.active'
const SELECTOR_ACTIVE_UL = '> li > .active'
const SELECTOR_DATA_TOGGLE = '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]'
const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle'
const SELECTOR_DROPDOWN_ACTIVE_CHILD = '> .dropdown-menu .active'

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Tab {
  constructor(element) {
    this._element = element
  }

  // Getters

  static get VERSION() {
    return VERSION
  }

  // Public

  show() {
    if (this._element.parentNode &&
        this._element.parentNode.nodeType === Node.ELEMENT_NODE &&
        $(this._element).hasClass(CLASS_NAME_ACTIVE) ||
        $(this._element).hasClass(CLASS_NAME_DISABLED)) {
      return
    }

    let target
    let previous
    const listElement = $(this._element).closest(SELECTOR_NAV_LIST_GROUP)[0]
    const selector = Util.getSelectorFromElement(this._element)

    if (listElement) {
      const itemSelector = listElement.nodeName === 'UL' || listElement.nodeName === 'OL' ? SELECTOR_ACTIVE_UL : SELECTOR_ACTIVE
      previous = $.makeArray($(listElement).find(itemSelector))
      previous = previous[previous.length - 1]
    }

    const hideEvent = $.Event(EVENT_HIDE, {
      relatedTarget: this._element
    })

    const showEvent = $.Event(EVENT_SHOW, {
      relatedTarget: previous
    })

    if (previous) {
      $(previous).trigger(hideEvent)
    }

    $(this._element).trigger(showEvent)

    if (showEvent.isDefaultPrevented() ||
        hideEvent.isDefaultPrevented()) {
      return
    }

    if (selector) {
      target = document.querySelector(selector)
    }

    this._activate(
      this._element,
      listElement
    )

    const complete = () => {
      const hiddenEvent = $.Event(EVENT_HIDDEN, {
        relatedTarget: this._element
      })

      const shownEvent = $.Event(EVENT_SHOWN, {
        relatedTarget: previous
      })

      $(previous).trigger(hiddenEvent)
      $(this._element).trigger(shownEvent)
    }

    if (target) {
      this._activate(target, target.parentNode, complete)
    } else {
      complete()
    }
  }

  dispose() {
    $.removeData(this._element, DATA_KEY)
    this._element = null
  }

  // Private

  _activate(element, container, callback) {
    const activeElements = container && (container.nodeName === 'UL' || container.nodeName === 'OL') ?
      $(container).find(SELECTOR_ACTIVE_UL) :
      $(container).children(SELECTOR_ACTIVE)

    const active = activeElements[0]
    const isTransitioning = callback && (active && $(active).hasClass(CLASS_NAME_FADE))
    const complete = () => this._transitionComplete(
      element,
      active,
      callback
    )

    if (active && isTransitioning) {
      const transitionDuration = Util.getTransitionDurationFromElement(active)

      $(active)
        .removeClass(CLASS_NAME_SHOW)
        .one(Util.TRANSITION_END, complete)
        .emulateTransitionEnd(transitionDuration)
    } else {
      complete()
    }
  }

  _transitionComplete(element, active, callback) {
    if (active) {
      $(active).removeClass(CLASS_NAME_ACTIVE)

      const dropdownChild = $(active.parentNode).find(
        SELECTOR_DROPDOWN_ACTIVE_CHILD
      )[0]

      if (dropdownChild) {
        $(dropdownChild).removeClass(CLASS_NAME_ACTIVE)
      }

      if (active.getAttribute('role') === 'tab') {
        active.setAttribute('aria-selected', false)
      }
    }

    $(element).addClass(CLASS_NAME_ACTIVE)
    if (element.getAttribute('role') === 'tab') {
      element.setAttribute('aria-selected', true)
    }

    Util.reflow(element)

    if (element.classList.contains(CLASS_NAME_FADE)) {
      element.classList.add(CLASS_NAME_SHOW)
    }

    if (element.parentNode && $(element.parentNode).hasClass(CLASS_NAME_DROPDOWN_MENU)) {
      const dropdownElement = $(element).closest(SELECTOR_DROPDOWN)[0]

      if (dropdownElement) {
        const dropdownToggleList = [].slice.call(dropdownElement.querySelectorAll(SELECTOR_DROPDOWN_TOGGLE))

        $(dropdownToggleList).addClass(CLASS_NAME_ACTIVE)
      }

      element.setAttribute('aria-expanded', true)
    }

    if (callback) {
      callback()
    }
  }

  // Static

  static _jQueryInterface(config) {
    return this.each(function () {
      const $this = $(this)
      let data = $this.data(DATA_KEY)

      if (!data) {
        data = new Tab(this)
        $this.data(DATA_KEY, data)
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`)
        }

        data[config]()
      }
    })
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(document)
  .on(EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
    event.preventDefault()
    Tab._jQueryInterface.call($(this), 'show')
  })

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

$.fn[NAME] = Tab._jQueryInterface
$.fn[NAME].Constructor = Tab
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT
  return Tab._jQueryInterface
}

export default Tab

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.5.3): toast.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import $ from 'jquery'
import Util from './util'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'toast'
const VERSION = '4.5.3'
const DATA_KEY = 'bs.toast'
const EVENT_KEY = `.${DATA_KEY}`
const JQUERY_NO_CONFLICT = $.fn[NAME]

const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY}`
const EVENT_HIDE = `hide${EVENT_KEY}`
const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_SHOW = `show${EVENT_KEY}`
const EVENT_SHOWN = `shown${EVENT_KEY}`

const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_HIDE = 'hide'
const CLASS_NAME_SHOW = 'show'
const CLASS_NAME_SHOWING = 'showing'

const DefaultType = {
  animation: 'boolean',
  autohide: 'boolean',
  delay: 'number'
}

const Default = {
  animation: true,
  autohide: true,
  delay: 500
}

const SELECTOR_DATA_DISMISS = '[data-dismiss="toast"]'

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Toast {
  constructor(element, config) {
    this._element = element
    this._config = this._getConfig(config)
    this._timeout = null
    this._setListeners()
  }

  // Getters

  static get VERSION() {
    return VERSION
  }

  static get DefaultType() {
    return DefaultType
  }

  static get Default() {
    return Default
  }

  // Public

  show() {
    const showEvent = $.Event(EVENT_SHOW)

    $(this._element).trigger(showEvent)
    if (showEvent.isDefaultPrevented()) {
      return
    }

    this._clearTimeout()

    if (this._config.animation) {
      this._element.classList.add(CLASS_NAME_FADE)
    }

    const complete = () => {
      this._element.classList.remove(CLASS_NAME_SHOWING)
      this._element.classList.add(CLASS_NAME_SHOW)

      $(this._element).trigger(EVENT_SHOWN)

      if (this._config.autohide) {
        this._timeout = setTimeout(() => {
          this.hide()
        }, this._config.delay)
      }
    }

    this._element.classList.remove(CLASS_NAME_HIDE)
    Util.reflow(this._element)
    this._element.classList.add(CLASS_NAME_SHOWING)
    if (this._config.animation) {
      const transitionDuration = Util.getTransitionDurationFromElement(this._element)

      $(this._element)
        .one(Util.TRANSITION_END, complete)
        .emulateTransitionEnd(transitionDuration)
    } else {
      complete()
    }
  }

  hide() {
    if (!this._element.classList.contains(CLASS_NAME_SHOW)) {
      return
    }

    const hideEvent = $.Event(EVENT_HIDE)

    $(this._element).trigger(hideEvent)
    if (hideEvent.isDefaultPrevented()) {
      return
    }

    this._close()
  }

  dispose() {
    this._clearTimeout()

    if (this._element.classList.contains(CLASS_NAME_SHOW)) {
      this._element.classList.remove(CLASS_NAME_SHOW)
    }

    $(this._element).off(EVENT_CLICK_DISMISS)

    $.removeData(this._element, DATA_KEY)
    this._element = null
    this._config = null
  }

  // Private

  _getConfig(config) {
    config = {
      ...Default,
      ...$(this._element).data(),
      ...(typeof config === 'object' && config ? config : {})
    }

    Util.typeCheckConfig(
      NAME,
      config,
      this.constructor.DefaultType
    )

    return config
  }

  _setListeners() {
    $(this._element).on(EVENT_CLICK_DISMISS, SELECTOR_DATA_DISMISS, () => this.hide())
  }

  _close() {
    const complete = () => {
      this._element.classList.add(CLASS_NAME_HIDE)
      $(this._element).trigger(EVENT_HIDDEN)
    }

    this._element.classList.remove(CLASS_NAME_SHOW)
    if (this._config.animation) {
      const transitionDuration = Util.getTransitionDurationFromElement(this._element)

      $(this._element)
        .one(Util.TRANSITION_END, complete)
        .emulateTransitionEnd(transitionDuration)
    } else {
      complete()
    }
  }

  _clearTimeout() {
    clearTimeout(this._timeout)
    this._timeout = null
  }

  // Static

  static _jQueryInterface(config) {
    return this.each(function () {
      const $element = $(this)
      let data = $element.data(DATA_KEY)
      const _config = typeof config === 'object' && config

      if (!data) {
        data = new Toast(this, _config)
        $element.data(DATA_KEY, data)
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`)
        }

        data[config](this)
      }
    })
  }
}

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

$.fn[NAME] = Toast._jQueryInterface
$.fn[NAME].Constructor = Toast
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT
  return Toast._jQueryInterface
}

export default Toast

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.5.3): tooltip.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import {
  DefaultWhitelist,
  sanitizeHtml
} from './tools/sanitizer'
import $ from 'jquery'
import Popper from 'popper.js'
import Util from './util'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'tooltip'
const VERSION = '4.5.3'
const DATA_KEY = 'bs.tooltip'
const EVENT_KEY = `.${DATA_KEY}`
const JQUERY_NO_CONFLICT = $.fn[NAME]
const CLASS_PREFIX = 'bs-tooltip'
const BSCLS_PREFIX_REGEX = new RegExp(`(^|\\s)${CLASS_PREFIX}\\S+`, 'g')
const DISALLOWED_ATTRIBUTES = ['sanitize', 'whiteList', 'sanitizeFn']

const DefaultType = {
  animation: 'boolean',
  template: 'string',
  title: '(string|element|function)',
  trigger: 'string',
  delay: '(number|object)',
  html: 'boolean',
  selector: '(string|boolean)',
  placement: '(string|function)',
  offset: '(number|string|function)',
  container: '(string|element|boolean)',
  fallbackPlacement: '(string|array)',
  boundary: '(string|element)',
  sanitize: 'boolean',
  sanitizeFn: '(null|function)',
  whiteList: 'object',
  popperConfig: '(null|object)'
}

const AttachmentMap = {
  AUTO: 'auto',
  TOP: 'top',
  RIGHT: 'right',
  BOTTOM: 'bottom',
  LEFT: 'left'
}

const Default = {
  animation: true,
  template: '<div class="tooltip" role="tooltip">' +
                    '<div class="arrow"></div>' +
                    '<div class="tooltip-inner"></div></div>',
  trigger: 'hover focus',
  title: '',
  delay: 0,
  html: false,
  selector: false,
  placement: 'top',
  offset: 0,
  container: false,
  fallbackPlacement: 'flip',
  boundary: 'scrollParent',
  sanitize: true,
  sanitizeFn: null,
  whiteList: DefaultWhitelist,
  popperConfig: null
}

const HOVER_STATE_SHOW = 'show'
const HOVER_STATE_OUT = 'out'

const Event = {
  HIDE: `hide${EVENT_KEY}`,
  HIDDEN: `hidden${EVENT_KEY}`,
  SHOW: `show${EVENT_KEY}`,
  SHOWN: `shown${EVENT_KEY}`,
  INSERTED: `inserted${EVENT_KEY}`,
  CLICK: `click${EVENT_KEY}`,
  FOCUSIN: `focusin${EVENT_KEY}`,
  FOCUSOUT: `focusout${EVENT_KEY}`,
  MOUSEENTER: `mouseenter${EVENT_KEY}`,
  MOUSELEAVE: `mouseleave${EVENT_KEY}`
}

const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_SHOW = 'show'

const SELECTOR_TOOLTIP_INNER = '.tooltip-inner'
const SELECTOR_ARROW = '.arrow'

const TRIGGER_HOVER = 'hover'
const TRIGGER_FOCUS = 'focus'
const TRIGGER_CLICK = 'click'
const TRIGGER_MANUAL = 'manual'

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Tooltip {
  constructor(element, config) {
    if (typeof Popper === 'undefined') {
      throw new TypeError('Bootstrap\'s tooltips require Popper.js (https://popper.js.org/)')
    }

    // private
    this._isEnabled = true
    this._timeout = 0
    this._hoverState = ''
    this._activeTrigger = {}
    this._popper = null

    // Protected
    this.element = element
    this.config = this._getConfig(config)
    this.tip = null

    this._setListeners()
  }

  // Getters

  static get VERSION() {
    return VERSION
  }

  static get Default() {
    return Default
  }

  static get NAME() {
    return NAME
  }

  static get DATA_KEY() {
    return DATA_KEY
  }

  static get Event() {
    return Event
  }

  static get EVENT_KEY() {
    return EVENT_KEY
  }

  static get DefaultType() {
    return DefaultType
  }

  // Public

  enable() {
    this._isEnabled = true
  }

  disable() {
    this._isEnabled = false
  }

  toggleEnabled() {
    this._isEnabled = !this._isEnabled
  }

  toggle(event) {
    if (!this._isEnabled) {
      return
    }

    if (event) {
      const dataKey = this.constructor.DATA_KEY
      let context = $(event.currentTarget).data(dataKey)

      if (!context) {
        context = new this.constructor(
          event.currentTarget,
          this._getDelegateConfig()
        )
        $(event.currentTarget).data(dataKey, context)
      }

      context._activeTrigger.click = !context._activeTrigger.click

      if (context._isWithActiveTrigger()) {
        context._enter(null, context)
      } else {
        context._leave(null, context)
      }
    } else {
      if ($(this.getTipElement()).hasClass(CLASS_NAME_SHOW)) {
        this._leave(null, this)
        return
      }

      this._enter(null, this)
    }
  }

  dispose() {
    clearTimeout(this._timeout)

    $.removeData(this.element, this.constructor.DATA_KEY)

    $(this.element).off(this.constructor.EVENT_KEY)
    $(this.element).closest('.modal').off('hide.bs.modal', this._hideModalHandler)

    if (this.tip) {
      $(this.tip).remove()
    }

    this._isEnabled = null
    this._timeout = null
    this._hoverState = null
    this._activeTrigger = null
    if (this._popper) {
      this._popper.destroy()
    }

    this._popper = null
    this.element = null
    this.config = null
    this.tip = null
  }

  show() {
    if ($(this.element).css('display') === 'none') {
      throw new Error('Please use show on visible elements')
    }

    const showEvent = $.Event(this.constructor.Event.SHOW)
    if (this.isWithContent() && this._isEnabled) {
      $(this.element).trigger(showEvent)

      const shadowRoot = Util.findShadowRoot(this.element)
      const isInTheDom = $.contains(
        shadowRoot !== null ? shadowRoot : this.element.ownerDocument.documentElement,
        this.element
      )

      if (showEvent.isDefaultPrevented() || !isInTheDom) {
        return
      }

      const tip = this.getTipElement()
      const tipId = Util.getUID(this.constructor.NAME)

      tip.setAttribute('id', tipId)
      this.element.setAttribute('aria-describedby', tipId)

      this.setContent()

      if (this.config.animation) {
        $(tip).addClass(CLASS_NAME_FADE)
      }

      const placement = typeof this.config.placement === 'function' ?
        this.config.placement.call(this, tip, this.element) :
        this.config.placement

      const attachment = this._getAttachment(placement)
      this.addAttachmentClass(attachment)

      const container = this._getContainer()
      $(tip).data(this.constructor.DATA_KEY, this)

      if (!$.contains(this.element.ownerDocument.documentElement, this.tip)) {
        $(tip).appendTo(container)
      }

      $(this.element).trigger(this.constructor.Event.INSERTED)

      this._popper = new Popper(this.element, tip, this._getPopperConfig(attachment))

      $(tip).addClass(CLASS_NAME_SHOW)

      // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
      if ('ontouchstart' in document.documentElement) {
        $(document.body).children().on('mouseover', null, $.noop)
      }

      const complete = () => {
        if (this.config.animation) {
          this._fixTransition()
        }

        const prevHoverState = this._hoverState
        this._hoverState = null

        $(this.element).trigger(this.constructor.Event.SHOWN)

        if (prevHoverState === HOVER_STATE_OUT) {
          this._leave(null, this)
        }
      }

      if ($(this.tip).hasClass(CLASS_NAME_FADE)) {
        const transitionDuration = Util.getTransitionDurationFromElement(this.tip)

        $(this.tip)
          .one(Util.TRANSITION_END, complete)
          .emulateTransitionEnd(transitionDuration)
      } else {
        complete()
      }
    }
  }

  hide(callback) {
    const tip = this.getTipElement()
    const hideEvent = $.Event(this.constructor.Event.HIDE)
    const complete = () => {
      if (this._hoverState !== HOVER_STATE_SHOW && tip.parentNode) {
        tip.parentNode.removeChild(tip)
      }

      this._cleanTipClass()
      this.element.removeAttribute('aria-describedby')
      $(this.element).trigger(this.constructor.Event.HIDDEN)
      if (this._popper !== null) {
        this._popper.destroy()
      }

      if (callback) {
        callback()
      }
    }

    $(this.element).trigger(hideEvent)

    if (hideEvent.isDefaultPrevented()) {
      return
    }

    $(tip).removeClass(CLASS_NAME_SHOW)

    // If this is a touch-enabled device we remove the extra
    // empty mouseover listeners we added for iOS support
    if ('ontouchstart' in document.documentElement) {
      $(document.body).children().off('mouseover', null, $.noop)
    }

    this._activeTrigger[TRIGGER_CLICK] = false
    this._activeTrigger[TRIGGER_FOCUS] = false
    this._activeTrigger[TRIGGER_HOVER] = false

    if ($(this.tip).hasClass(CLASS_NAME_FADE)) {
      const transitionDuration = Util.getTransitionDurationFromElement(tip)

      $(tip)
        .one(Util.TRANSITION_END, complete)
        .emulateTransitionEnd(transitionDuration)
    } else {
      complete()
    }

    this._hoverState = ''
  }

  update() {
    if (this._popper !== null) {
      this._popper.scheduleUpdate()
    }
  }

  // Protected

  isWithContent() {
    return Boolean(this.getTitle())
  }

  addAttachmentClass(attachment) {
    $(this.getTipElement()).addClass(`${CLASS_PREFIX}-${attachment}`)
  }

  getTipElement() {
    this.tip = this.tip || $(this.config.template)[0]
    return this.tip
  }

  setContent() {
    const tip = this.getTipElement()
    this.setElementContent($(tip.querySelectorAll(SELECTOR_TOOLTIP_INNER)), this.getTitle())
    $(tip).removeClass(`${CLASS_NAME_FADE} ${CLASS_NAME_SHOW}`)
  }

  setElementContent($element, content) {
    if (typeof content === 'object' && (content.nodeType || content.jquery)) {
      // Content is a DOM node or a jQuery
      if (this.config.html) {
        if (!$(content).parent().is($element)) {
          $element.empty().append(content)
        }
      } else {
        $element.text($(content).text())
      }

      return
    }

    if (this.config.html) {
      if (this.config.sanitize) {
        content = sanitizeHtml(content, this.config.whiteList, this.config.sanitizeFn)
      }

      $element.html(content)
    } else {
      $element.text(content)
    }
  }

  getTitle() {
    let title = this.element.getAttribute('data-original-title')

    if (!title) {
      title = typeof this.config.title === 'function' ?
        this.config.title.call(this.element) :
        this.config.title
    }

    return title
  }

  // Private

  _getPopperConfig(attachment) {
    const defaultBsConfig = {
      placement: attachment,
      modifiers: {
        offset: this._getOffset(),
        flip: {
          behavior: this.config.fallbackPlacement
        },
        arrow: {
          element: SELECTOR_ARROW
        },
        preventOverflow: {
          boundariesElement: this.config.boundary
        }
      },
      onCreate: data => {
        if (data.originalPlacement !== data.placement) {
          this._handlePopperPlacementChange(data)
        }
      },
      onUpdate: data => this._handlePopperPlacementChange(data)
    }

    return {
      ...defaultBsConfig,
      ...this.config.popperConfig
    }
  }

  _getOffset() {
    const offset = {}

    if (typeof this.config.offset === 'function') {
      offset.fn = data => {
        data.offsets = {
          ...data.offsets,
          ...(this.config.offset(data.offsets, this.element) || {})
        }

        return data
      }
    } else {
      offset.offset = this.config.offset
    }

    return offset
  }

  _getContainer() {
    if (this.config.container === false) {
      return document.body
    }

    if (Util.isElement(this.config.container)) {
      return $(this.config.container)
    }

    return $(document).find(this.config.container)
  }

  _getAttachment(placement) {
    return AttachmentMap[placement.toUpperCase()]
  }

  _setListeners() {
    const triggers = this.config.trigger.split(' ')

    triggers.forEach(trigger => {
      if (trigger === 'click') {
        $(this.element).on(
          this.constructor.Event.CLICK,
          this.config.selector,
          event => this.toggle(event)
        )
      } else if (trigger !== TRIGGER_MANUAL) {
        const eventIn = trigger === TRIGGER_HOVER ?
          this.constructor.Event.MOUSEENTER :
          this.constructor.Event.FOCUSIN
        const eventOut = trigger === TRIGGER_HOVER ?
          this.constructor.Event.MOUSELEAVE :
          this.constructor.Event.FOCUSOUT

        $(this.element)
          .on(eventIn, this.config.selector, event => this._enter(event))
          .on(eventOut, this.config.selector, event => this._leave(event))
      }
    })

    this._hideModalHandler = () => {
      if (this.element) {
        this.hide()
      }
    }

    $(this.element).closest('.modal').on('hide.bs.modal', this._hideModalHandler)

    if (this.config.selector) {
      this.config = {
        ...this.config,
        trigger: 'manual',
        selector: ''
      }
    } else {
      this._fixTitle()
    }
  }

  _fixTitle() {
    const titleType = typeof this.element.getAttribute('data-original-title')

    if (this.element.getAttribute('title') || titleType !== 'string') {
      this.element.setAttribute(
        'data-original-title',
        this.element.getAttribute('title') || ''
      )

      this.element.setAttribute('title', '')
    }
  }

  _enter(event, context) {
    const dataKey = this.constructor.DATA_KEY
    context = context || $(event.currentTarget).data(dataKey)

    if (!context) {
      context = new this.constructor(
        event.currentTarget,
        this._getDelegateConfig()
      )
      $(event.currentTarget).data(dataKey, context)
    }

    if (event) {
      context._activeTrigger[
        event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER
      ] = true
    }

    if ($(context.getTipElement()).hasClass(CLASS_NAME_SHOW) || context._hoverState === HOVER_STATE_SHOW) {
      context._hoverState = HOVER_STATE_SHOW
      return
    }

    clearTimeout(context._timeout)

    context._hoverState = HOVER_STATE_SHOW

    if (!context.config.delay || !context.config.delay.show) {
      context.show()
      return
    }

    context._timeout = setTimeout(() => {
      if (context._hoverState === HOVER_STATE_SHOW) {
        context.show()
      }
    }, context.config.delay.show)
  }

  _leave(event, context) {
    const dataKey = this.constructor.DATA_KEY
    context = context || $(event.currentTarget).data(dataKey)

    if (!context) {
      context = new this.constructor(
        event.currentTarget,
        this._getDelegateConfig()
      )
      $(event.currentTarget).data(dataKey, context)
    }

    if (event) {
      context._activeTrigger[
        event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER
      ] = false
    }

    if (context._isWithActiveTrigger()) {
      return
    }

    clearTimeout(context._timeout)

    context._hoverState = HOVER_STATE_OUT

    if (!context.config.delay || !context.config.delay.hide) {
      context.hide()
      return
    }

    context._timeout = setTimeout(() => {
      if (context._hoverState === HOVER_STATE_OUT) {
        context.hide()
      }
    }, context.config.delay.hide)
  }

  _isWithActiveTrigger() {
    for (const trigger in this._activeTrigger) {
      if (this._activeTrigger[trigger]) {
        return true
      }
    }

    return false
  }

  _getConfig(config) {
    const dataAttributes = $(this.element).data()

    Object.keys(dataAttributes)
      .forEach(dataAttr => {
        if (DISALLOWED_ATTRIBUTES.indexOf(dataAttr) !== -1) {
          delete dataAttributes[dataAttr]
        }
      })

    config = {
      ...this.constructor.Default,
      ...dataAttributes,
      ...(typeof config === 'object' && config ? config : {})
    }

    if (typeof config.delay === 'number') {
      config.delay = {
        show: config.delay,
        hide: config.delay
      }
    }

    if (typeof config.title === 'number') {
      config.title = config.title.toString()
    }

    if (typeof config.content === 'number') {
      config.content = config.content.toString()
    }

    Util.typeCheckConfig(
      NAME,
      config,
      this.constructor.DefaultType
    )

    if (config.sanitize) {
      config.template = sanitizeHtml(config.template, config.whiteList, config.sanitizeFn)
    }

    return config
  }

  _getDelegateConfig() {
    const config = {}

    if (this.config) {
      for (const key in this.config) {
        if (this.constructor.Default[key] !== this.config[key]) {
          config[key] = this.config[key]
        }
      }
    }

    return config
  }

  _cleanTipClass() {
    const $tip = $(this.getTipElement())
    const tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX)
    if (tabClass !== null && tabClass.length) {
      $tip.removeClass(tabClass.join(''))
    }
  }

  _handlePopperPlacementChange(popperData) {
    this.tip = popperData.instance.popper
    this._cleanTipClass()
    this.addAttachmentClass(this._getAttachment(popperData.placement))
  }

  _fixTransition() {
    const tip = this.getTipElement()
    const initConfigAnimation = this.config.animation

    if (tip.getAttribute('x-placement') !== null) {
      return
    }

    $(tip).removeClass(CLASS_NAME_FADE)
    this.config.animation = false
    this.hide()
    this.show()
    this.config.animation = initConfigAnimation
  }

  // Static

  static _jQueryInterface(config) {
    return this.each(function () {
      const $element = $(this)
      let data = $element.data(DATA_KEY)
      const _config = typeof config === 'object' && config

      if (!data && /dispose|hide/.test(config)) {
        return
      }

      if (!data) {
        data = new Tooltip(this, _config)
        $element.data(DATA_KEY, data)
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`)
        }

        data[config]()
      }
    })
  }
}

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

$.fn[NAME] = Tooltip._jQueryInterface
$.fn[NAME].Constructor = Tooltip
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT
  return Tooltip._jQueryInterface
}

export default Tooltip

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.5.3): util.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import $ from 'jquery'

/**
 * ------------------------------------------------------------------------
 * Private TransitionEnd Helpers
 * ------------------------------------------------------------------------
 */

const TRANSITION_END = 'transitionend'
const MAX_UID = 1000000
const MILLISECONDS_MULTIPLIER = 1000

// Shoutout AngusCroll (https://goo.gl/pxwQGp)
function toType(obj) {
  if (obj === null || typeof obj === 'undefined') {
    return `${obj}`
  }

  return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase()
}

function getSpecialTransitionEndEvent() {
  return {
    bindType: TRANSITION_END,
    delegateType: TRANSITION_END,
    handle(event) {
      if ($(event.target).is(this)) {
        return event.handleObj.handler.apply(this, arguments) // eslint-disable-line prefer-rest-params
      }

      return undefined
    }
  }
}

function transitionEndEmulator(duration) {
  let called = false

  $(this).one(Util.TRANSITION_END, () => {
    called = true
  })

  setTimeout(() => {
    if (!called) {
      Util.triggerTransitionEnd(this)
    }
  }, duration)

  return this
}

function setTransitionEndSupport() {
  $.fn.emulateTransitionEnd = transitionEndEmulator
  $.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent()
}

/**
 * --------------------------------------------------------------------------
 * Public Util Api
 * --------------------------------------------------------------------------
 */

const Util = {
  TRANSITION_END: 'bsTransitionEnd',

  getUID(prefix) {
    do {
      prefix += ~~(Math.random() * MAX_UID) // "~~" acts like a faster Math.floor() here
    } while (document.getElementById(prefix))

    return prefix
  },

  getSelectorFromElement(element) {
    let selector = element.getAttribute('data-target')

    if (!selector || selector === '#') {
      const hrefAttr = element.getAttribute('href')
      selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : ''
    }

    try {
      return document.querySelector(selector) ? selector : null
    } catch (_) {
      return null
    }
  },

  getTransitionDurationFromElement(element) {
    if (!element) {
      return 0
    }

    // Get transition-duration of the element
    let transitionDuration = $(element).css('transition-duration')
    let transitionDelay = $(element).css('transition-delay')

    const floatTransitionDuration = parseFloat(transitionDuration)
    const floatTransitionDelay = parseFloat(transitionDelay)

    // Return 0 if element or transition duration is not found
    if (!floatTransitionDuration && !floatTransitionDelay) {
      return 0
    }

    // If multiple durations are defined, take the first
    transitionDuration = transitionDuration.split(',')[0]
    transitionDelay = transitionDelay.split(',')[0]

    return (parseFloat(transitionDuration) + parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER
  },

  reflow(element) {
    return element.offsetHeight
  },

  triggerTransitionEnd(element) {
    $(element).trigger(TRANSITION_END)
  },

  supportsTransitionEnd() {
    return Boolean(TRANSITION_END)
  },

  isElement(obj) {
    return (obj[0] || obj).nodeType
  },

  typeCheckConfig(componentName, config, configTypes) {
    for (const property in configTypes) {
      if (Object.prototype.hasOwnProperty.call(configTypes, property)) {
        const expectedTypes = configTypes[property]
        const value = config[property]
        const valueType = value && Util.isElement(value) ?
          'element' : toType(value)

        if (!new RegExp(expectedTypes).test(valueType)) {
          throw new Error(
            `${componentName.toUpperCase()}: ` +
            `Option "${property}" provided type "${valueType}" ` +
            `but expected type "${expectedTypes}".`)
        }
      }
    }
  },

  findShadowRoot(element) {
    if (!document.documentElement.attachShadow) {
      return null
    }

    // Can find the shadow root otherwise it'll return the document
    if (typeof element.getRootNode === 'function') {
      const root = element.getRootNode()
      return root instanceof ShadowRoot ? root : null
    }

    if (element instanceof ShadowRoot) {
      return element
    }

    // when we don't find a shadow root
    if (!element.parentNode) {
      return null
    }

    return Util.findShadowRoot(element.parentNode)
  },

  jQueryDetection() {
    if (typeof $ === 'undefined') {
      throw new TypeError('Bootstrap\'s JavaScript requires jQuery. jQuery must be included before Bootstrap\'s JavaScript.')
    }

    const version = $.fn.jquery.split(' ')[0].split('.')
    const minMajor = 1
    const ltMajor = 2
    const minMinor = 9
    const minPatch = 1
    const maxMajor = 4

    if (version[0] < ltMajor && version[1] < minMinor || version[0] === minMajor && version[1] === minMinor && version[2] < minPatch || version[0] >= maxMajor) {
      throw new Error('Bootstrap\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0')
    }
  }
}

Util.jQueryDetection()
setTransitionEndSupport()

export default Util
