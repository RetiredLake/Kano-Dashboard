/**
* Copyright (C) 2014 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Tom Bettany <tom.bettany@kano.me>
* Description: Overrides the console to log using Kano-Logger
*/

(function() {
'use strict';

var logger = {
    debug: false,
    console: console,
    log: function(type) {
        if (logger.debug) {
            logger.console[type].apply(logger.console, arguments[1]);
        }

        var args = [];
        for (var x = 0, len = arguments[1].length; x < len; x++) {
            args.push(arguments[1][x]);
        }

        backend.call('log', type, args);
    }
};

console = {
    assert: function() {
        logger.log('assert', arguments);
    },
    count: function() {
        logger.log('count', arguments);
    },
    debug: function() {
        logger.log('debug', arguments);
    },
    dir: function() {
        logger.log('dir', arguments);
    },
    dirxml: function() {
        logger.log('dirxml', arguments);
    },
    error: function() {
        logger.log('error', arguments);
    },
    group: function() {
        logger.log('group', arguments);
    },
    groupCollapsed: function() {
        logger.log('groupCollapsed', arguments);
    },
    groupEnd: function() {
        logger.log('groupEnd', arguments);
    },
    info: function() {
        logger.log('info', arguments);
    },
    log: function() {
        logger.log('log', arguments);
    },
    markTimeline: function() {
        logger.log('markTimeline', arguments);
    },
    profile: function() {
        logger.log('profile', arguments);
    },
    profileEnd: function() {
        logger.log('profileEnd', arguments);
    },
    time: function() {
        logger.log('time', arguments);
    },
    timeEnd: function() {
        logger.log('timeEnd', arguments);
    },
    timeStamp: function() {
        logger.log('timeStamp', arguments);
    },
    trace: function() {
        logger.log('trace', arguments);
    },
    warn: function() {
        logger.log('warn', arguments);
    }
};

})();
/*
 * Copyright 2008 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview
 * Utility functions and classes for Soy.
 *
 * <p>
 * The top portion of this file contains utilities for Soy users:<ul>
 *   <li> soy.StringBuilder: Compatible with the 'stringbuilder' code style.
 *   <li> soy.renderElement: Render template and set as innerHTML of an element.
 *   <li> soy.renderAsFragment: Render template and return as HTML fragment.
 * </ul>
 *
 * <p>
 * The bottom portion of this file contains utilities that should only be called
 * by Soy-generated JS code. Please do not use these functions directly from
 * your hand-writen code. Their names all start with '$$'.
 *
 * @author Garrett Boyer
 * @author Mike Samuel
 * @author Kai Huang
 * @author Aharon Lanin
 */


// COPIED FROM nogoog_shim.js

// Create closure namespaces.
var goog = goog || {};


goog.DEBUG = false;


goog.inherits = function(childCtor, parentCtor) {
  /** @constructor */
  function tempCtor() {}
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
  childCtor.prototype.constructor = childCtor;
};


// Just enough browser detection for this file.
if (!goog.userAgent) {
  goog.userAgent = (function() {
    var userAgent = "";
    if ("undefined" !== typeof navigator && navigator
        && "string" == typeof navigator.userAgent) {
      userAgent = navigator.userAgent;
    }
    var isOpera = userAgent.indexOf('Opera') == 0;
    return {
      jscript: {
        /**
         * @type {boolean}
         */
        HAS_JSCRIPT: 'ScriptEngine' in this
      },
      /**
       * @type {boolean}
       */
      OPERA: isOpera,
      /**
       * @type {boolean}
       */
      IE: !isOpera && userAgent.indexOf('MSIE') != -1,
      /**
       * @type {boolean}
       */
      WEBKIT: !isOpera && userAgent.indexOf('WebKit') != -1
    };
  })();
}

if (!goog.asserts) {
  goog.asserts = {
    /**
     * @param {*} condition Condition to check.
     */
    assert: function (condition) {
      if (!condition) {
        throw Error('Assertion error');
      }
    },
    /**
     * @param {...*} var_args
     */
    fail: function (var_args) {}
  };
}


// Stub out the document wrapper used by renderAs*.
if (!goog.dom) {
  goog.dom = {};
  /**
   * @param {Document=} d
   * @constructor
   */
  goog.dom.DomHelper = function(d) {
    this.document_ = d || document;
  };
  /**
   * @return {!Document}
   */
  goog.dom.DomHelper.prototype.getDocument = function() {
    return this.document_;
  };
  /**
   * Creates a new element.
   * @param {string} name Tag name.
   * @return {!Element}
   */
  goog.dom.DomHelper.prototype.createElement = function(name) {
    return this.document_.createElement(name);
  };
  /**
   * Creates a new document fragment.
   * @return {!DocumentFragment}
   */
  goog.dom.DomHelper.prototype.createDocumentFragment = function() {
    return this.document_.createDocumentFragment();
  };
}


if (!goog.format) {
  goog.format = {
    insertWordBreaks: function(str, maxCharsBetweenWordBreaks) {
      str = String(str);

      var resultArr = [];
      var resultArrLen = 0;

      // These variables keep track of important state inside str.
      var isInTag = false;  // whether we're inside an HTML tag
      var isMaybeInEntity = false;  // whether we might be inside an HTML entity
      var numCharsWithoutBreak = 0;  // number of chars since last word break
      var flushIndex = 0;  // index of first char not yet flushed to resultArr

      for (var i = 0, n = str.length; i < n; ++i) {
        var charCode = str.charCodeAt(i);

        // If hit maxCharsBetweenWordBreaks, and not space next, then add <wbr>.
        if (numCharsWithoutBreak >= maxCharsBetweenWordBreaks &&
            // space
            charCode != 32) {
          resultArr[resultArrLen++] = str.substring(flushIndex, i);
          flushIndex = i;
          resultArr[resultArrLen++] = goog.format.WORD_BREAK;
          numCharsWithoutBreak = 0;
        }

        if (isInTag) {
          // If inside an HTML tag and we see '>', it's the end of the tag.
          if (charCode == 62) {
            isInTag = false;
          }

        } else if (isMaybeInEntity) {
          switch (charCode) {
            // Inside an entity, a ';' is the end of the entity.
            // The entity that just ended counts as one char, so increment
            // numCharsWithoutBreak.
          case 59:  // ';'
            isMaybeInEntity = false;
            ++numCharsWithoutBreak;
            break;
            // If maybe inside an entity and we see '<', we weren't actually in
            // an entity. But now we're inside and HTML tag.
          case 60:  // '<'
            isMaybeInEntity = false;
            isInTag = true;
            break;
            // If maybe inside an entity and we see ' ', we weren't actually in
            // an entity. Just correct the state and reset the
            // numCharsWithoutBreak since we just saw a space.
          case 32:  // ' '
            isMaybeInEntity = false;
            numCharsWithoutBreak = 0;
            break;
          }

        } else {  // !isInTag && !isInEntity
          switch (charCode) {
            // When not within a tag or an entity and we see '<', we're now
            // inside an HTML tag.
          case 60:  // '<'
            isInTag = true;
            break;
            // When not within a tag or an entity and we see '&', we might be
            // inside an entity.
          case 38:  // '&'
            isMaybeInEntity = true;
            break;
            // When we see a space, reset the numCharsWithoutBreak count.
          case 32:  // ' '
            numCharsWithoutBreak = 0;
            break;
            // When we see a non-space, increment the numCharsWithoutBreak.
          default:
            ++numCharsWithoutBreak;
            break;
          }
        }
      }

      // Flush the remaining chars at the end of the string.
      resultArr[resultArrLen++] = str.substring(flushIndex);

      return resultArr.join('');
    },
    /**
     * String inserted as a word break by insertWordBreaks(). Safari requires
     * <wbr></wbr>, Opera needs the 'shy' entity, though this will give a
     * visible hyphen at breaks. Other browsers just use <wbr>.
     * @type {string}
     * @private
     */
    WORD_BREAK: goog.userAgent.WEBKIT
        ? '<wbr></wbr>' : goog.userAgent.OPERA ? '&shy;' : '<wbr>'
  };
}


if (!goog.i18n) {
  goog.i18n = {
    bidi: {
      /**
       * Check the directionality of a piece of text, return true if the piece
       * of text should be laid out in RTL direction.
       * @param {string} text The piece of text that need to be detected.
       * @param {boolean=} opt_isHtml Whether {@code text} is HTML/HTML-escaped.
       *     Default: false.
       * @return {boolean}
       * @private
       */
      detectRtlDirectionality: function(text, opt_isHtml) {
        text = soyshim.$$bidiStripHtmlIfNecessary_(text, opt_isHtml);
        return soyshim.$$bidiRtlWordRatio_(text)
            > soyshim.$$bidiRtlDetectionThreshold_;
      }
    }
  };
}

/**
 * Directionality enum.
 * @enum {number}
 */
goog.i18n.bidi.Dir = {
  RTL: -1,
  UNKNOWN: 0,
  LTR: 1
};


/**
 * Convert a directionality given in various formats to a goog.i18n.bidi.Dir
 * constant. Useful for interaction with different standards of directionality
 * representation.
 *
 * @param {goog.i18n.bidi.Dir|number|boolean} givenDir Directionality given in
 *     one of the following formats:
 *     1. A goog.i18n.bidi.Dir constant.
 *     2. A number (positive = LRT, negative = RTL, 0 = unknown).
 *     3. A boolean (true = RTL, false = LTR).
 * @return {goog.i18n.bidi.Dir} A goog.i18n.bidi.Dir constant matching the given
 *     directionality.
 */
goog.i18n.bidi.toDir = function(givenDir) {
  if (typeof givenDir == 'number') {
    return givenDir > 0 ? goog.i18n.bidi.Dir.LTR :
        givenDir < 0 ? goog.i18n.bidi.Dir.RTL : goog.i18n.bidi.Dir.UNKNOWN;
  } else {
    return givenDir ? goog.i18n.bidi.Dir.RTL : goog.i18n.bidi.Dir.LTR;
  }
};


/**
 * Utility class for formatting text for display in a potentially
 * opposite-directionality context without garbling. Provides the following
 * functionality:
 *
 * @param {goog.i18n.bidi.Dir|number|boolean} dir The context
 *     directionality as a number
 *     (positive = LRT, negative = RTL, 0 = unknown).
 * @constructor
 */
goog.i18n.BidiFormatter = function(dir) {
  this.dir_ = goog.i18n.bidi.toDir(dir);
};


/**
 * Returns 'dir="ltr"' or 'dir="rtl"', depending on {@code text}'s estimated
 * directionality, if it is not the same as the context directionality.
 * Otherwise, returns the empty string.
 *
 * @param {string} text Text whose directionality is to be estimated.
 * @param {boolean=} opt_isHtml Whether {@code text} is HTML / HTML-escaped.
 *     Default: false.
 * @return {string} 'dir="rtl"' for RTL text in non-RTL context; 'dir="ltr"' for
 *     LTR text in non-LTR context; else, the empty string.
 */
goog.i18n.BidiFormatter.prototype.dirAttr = function (text, opt_isHtml) {
  var dir = soy.$$bidiTextDir(text, opt_isHtml);
  return dir && dir != this.dir_ ? dir < 0 ? 'dir="rtl"' : 'dir="ltr"' : '';
};

/**
 * Returns the trailing horizontal edge, i.e. "right" or "left", depending on
 * the global bidi directionality.
 * @return {string} "left" for RTL context and "right" otherwise.
 */
goog.i18n.BidiFormatter.prototype.endEdge = function () {
  return this.dir_ < 0 ? 'left' : 'right';
};

/**
 * Returns the Unicode BiDi mark matching the context directionality (LRM for
 * LTR context directionality, RLM for RTL context directionality), or the
 * empty string for neutral / unknown context directionality.
 *
 * @return {string} LRM for LTR context directionality and RLM for RTL context
 *     directionality.
 */
goog.i18n.BidiFormatter.prototype.mark = function () {
  return (
      (this.dir_ > 0) ? '\u200E' /*LRM*/ :
      (this.dir_ < 0) ? '\u200F' /*RLM*/ :
      '');
};

/**
 * Returns a Unicode BiDi mark matching the context directionality (LRM or RLM)
 * if the directionality or the exit directionality of {@code text} are opposite
 * to the context directionality. Otherwise returns the empty string.
 *
 * @param {string} text The input text.
 * @param {boolean=} opt_isHtml Whether {@code text} is HTML / HTML-escaped.
 *     Default: false.
 * @return {string} A Unicode bidi mark matching the global directionality or
 *     the empty string.
 */
goog.i18n.BidiFormatter.prototype.markAfter = function (text, opt_isHtml) {
  var dir = soy.$$bidiTextDir(text, opt_isHtml);
  return soyshim.$$bidiMarkAfterKnownDir_(this.dir_, dir, text, opt_isHtml);
};

/**
 * Formats a string of unknown directionality for use in HTML output of the
 * context directionality, so an opposite-directionality string is neither
 * garbled nor garbles what follows it.
 *
 * @param {string} str The input text.
 * @param {boolean=} placeholder This argument exists for consistency with the
 *     Closure Library. Specifying it has no effect.
 * @return {string} Input text after applying the above processing.
 */
goog.i18n.BidiFormatter.prototype.spanWrap = function(str, placeholder) {
  str = String(str);
  var textDir = soy.$$bidiTextDir(str, true);
  var reset = soyshim.$$bidiMarkAfterKnownDir_(this.dir_, textDir, str, true);
  if (textDir > 0 && this.dir_ <= 0) {
    str = '<span dir="ltr">' + str + '</span>';
  } else if (textDir < 0 && this.dir_ >= 0) {
    str = '<span dir="rtl">' + str + '</span>';
  }
  return str + reset;
};

/**
 * Returns the leading horizontal edge, i.e. "left" or "right", depending on
 * the global bidi directionality.
 * @return {string} "right" for RTL context and "left" otherwise.
 */
goog.i18n.BidiFormatter.prototype.startEdge = function () {
  return this.dir_ < 0 ? 'right' : 'left';
};

/**
 * Formats a string of unknown directionality for use in plain-text output of
 * the context directionality, so an opposite-directionality string is neither
 * garbled nor garbles what follows it.
 * As opposed to {@link #spanWrap}, this makes use of unicode BiDi formatting
 * characters. In HTML, its *only* valid use is inside of elements that do not
 * allow mark-up, e.g. an 'option' tag.
 *
 * @param {string} str The input text.
 * @param {boolean=} placeholder This argument exists for consistency with the
 *     Closure Library. Specifying it has no effect.
 * @return {string} Input text after applying the above processing.
 */
goog.i18n.BidiFormatter.prototype.unicodeWrap = function(str, placeholder) {
  str = String(str);
  var textDir = soy.$$bidiTextDir(str, true);
  var reset = soyshim.$$bidiMarkAfterKnownDir_(this.dir_, textDir, str, true);
  if (textDir > 0 && this.dir_ <= 0) {
    str = '\u202A' + str + '\u202C';
  } else if (textDir < 0 && this.dir_ >= 0) {
    str = '\u202B' + str + '\u202C';
  }
  return str + reset;
};


if (!goog.string) {
  goog.string = {
    /**
     * Converts \r\n, \r, and \n to <br>s
     * @param {*} str The string in which to convert newlines.
     * @param {boolean=} opt_xml Whether to use XML compatible tags.
     * @return {string} A copy of {@code str} with converted newlines.
     */
    newLineToBr: function(str, opt_xml) {

      str = String(str);

      // This quick test helps in the case when there are no chars to replace,
      // in the worst case this makes barely a difference to the time taken.
      if (!goog.string.NEWLINE_TO_BR_RE_.test(str)) {
        return str;
      }

      return str.replace(/(\r\n|\r|\n)/g, opt_xml ? '<br />' : '<br>');
    },
    urlEncode: encodeURIComponent,
    /**
     * Regular expression used within newlineToBr().
     * @type {RegExp}
     * @private
     */
    NEWLINE_TO_BR_RE_: /[\r\n]/
  };
}

/**
 * Utility class to facilitate much faster string concatenation in IE,
 * using Array.join() rather than the '+' operator. For other browsers
 * we simply use the '+' operator.
 *
 * @param {Object|number|string|boolean=} opt_a1 Optional first initial item
 *     to append.
 * @param {...Object|number|string|boolean} var_args Other initial items to
 *     append, e.g., new goog.string.StringBuffer('foo', 'bar').
 * @constructor
 */
goog.string.StringBuffer = function(opt_a1, var_args) {
  /**
   * Internal buffer for the string to be concatenated.
   * @type {string|Array}
   * @private
   */
  this.buffer_ = goog.userAgent.jscript.HAS_JSCRIPT ? [] : '';

  if (opt_a1 != null) {
    this.append.apply(this, arguments);
  }
};


/**
 * Length of internal buffer (faster than calling buffer_.length).
 * Only used for IE.
 * @type {number}
 * @private
 */
goog.string.StringBuffer.prototype.bufferLength_ = 0;

/**
 * Appends one or more items to the string.
 *
 * Calling this with null, undefined, or empty arguments is an error.
 *
 * @param {Object|number|string|boolean} a1 Required first string.
 * @param {Object|number|string|boolean=} opt_a2 Optional second string.
 * @param {...Object|number|string|boolean} var_args Other items to append,
 *     e.g., sb.append('foo', 'bar', 'baz').
 * @return {goog.string.StringBuffer} This same StringBuilder object.
 */
goog.string.StringBuffer.prototype.append = function(a1, opt_a2, var_args) {

  if (goog.userAgent.jscript.HAS_JSCRIPT) {
    if (opt_a2 == null) {  // no second argument (note: undefined == null)
      // Array assignment is 2x faster than Array push. Also, use a1
      // directly to avoid arguments instantiation, another 2x improvement.
      this.buffer_[this.bufferLength_++] = a1;
    } else {
      var arr = /**@type {Array.<number|string|boolean>}*/(this.buffer_);
      arr.push.apply(arr, arguments);
      this.bufferLength_ = this.buffer_.length;
    }

  } else {

    // Use a1 directly to avoid arguments instantiation for single-arg case.
    this.buffer_ += a1;
    if (opt_a2 != null) {  // no second argument (note: undefined == null)
      for (var i = 1; i < arguments.length; i++) {
        this.buffer_ += arguments[i];
      }
    }
  }

  return this;
};


/**
 * Clears the string.
 */
goog.string.StringBuffer.prototype.clear = function() {

  if (goog.userAgent.jscript.HAS_JSCRIPT) {
     this.buffer_.length = 0;  // reuse array to avoid creating new object
     this.bufferLength_ = 0;

   } else {
     this.buffer_ = '';
   }
};


/**
 * Returns the concatenated string.
 *
 * @return {string} The concatenated string.
 */
goog.string.StringBuffer.prototype.toString = function() {

  if (goog.userAgent.jscript.HAS_JSCRIPT) {
    var str = this.buffer_.join('');
    // Given a string with the entire contents, simplify the StringBuilder by
    // setting its contents to only be this string, rather than many fragments.
    this.clear();
    if (str) {
      this.append(str);
    }
    return str;

  } else {
    return /** @type {string} */ (this.buffer_);
  }
};


if (!goog.soy) goog.soy = {
  /**
   * Helper function to render a Soy template and then set the
   * output string as the innerHTML of an element. It is recommended
   * to use this helper function instead of directly setting
   * innerHTML in your hand-written code, so that it will be easier
   * to audit the code for cross-site scripting vulnerabilities.
   *
   * @param {Function} template The Soy template defining element's content.
   * @param {Object=} opt_templateData The data for the template.
   * @param {Object=} opt_injectedData The injected data for the template.
   * @param {(goog.dom.DomHelper|Document)=} opt_dom The context in which DOM
   *     nodes will be created.
   */
  renderAsElement: function(
    template, opt_templateData, opt_injectedData, opt_dom) {
    return /** @type {!Element} */ (soyshim.$$renderWithWrapper_(
        template, opt_templateData, opt_dom, true /* asElement */,
        opt_injectedData));
  },
  /**
   * Helper function to render a Soy template into a single node or
   * a document fragment. If the rendered HTML string represents a
   * single node, then that node is returned (note that this is
   * *not* a fragment, despite them name of the method). Otherwise a
   * document fragment is returned containing the rendered nodes.
   *
   * @param {Function} template The Soy template defining element's content.
   * @param {Object=} opt_templateData The data for the template.
   * @param {Object=} opt_injectedData The injected data for the template.
   * @param {(goog.dom.DomHelper|Document)=} opt_dom The context in which DOM
   *     nodes will be created.
   * @return {!Node} The resulting node or document fragment.
   */
  renderAsFragment: function(
    template, opt_templateData, opt_injectedData, opt_dom) {
    return soyshim.$$renderWithWrapper_(
        template, opt_templateData, opt_dom, false /* asElement */,
        opt_injectedData);
  },
  /**
   * Helper function to render a Soy template and then set the output string as
   * the innerHTML of an element. It is recommended to use this helper function
   * instead of directly setting innerHTML in your hand-written code, so that it
   * will be easier to audit the code for cross-site scripting vulnerabilities.
   *
   * NOTE: New code should consider using goog.soy.renderElement instead.
   *
   * @param {Element} element The element whose content we are rendering.
   * @param {Function} template The Soy template defining the element's content.
   * @param {Object=} opt_templateData The data for the template.
   * @param {Object=} opt_injectedData The injected data for the template.
   */
  renderElement: function(
      element, template, opt_templateData, opt_injectedData) {
    element.innerHTML = template(opt_templateData, null, opt_injectedData);
  },
  data: {}
};


/**
 * A type of textual content.
 *
 * This is an enum of type Object so that these values are unforgeable.
 *
 * @enum {!Object}
 */
goog.soy.data.SanitizedContentKind = {

  /**
   * A snippet of HTML that does not start or end inside a tag, comment, entity,
   * or DOCTYPE; and that does not contain any executable code
   * (JS, {@code <object>}s, etc.) from a different trust domain.
   */
  HTML: {},

  /**
   * Executable Javascript code or expression, safe for insertion in a
   * script-tag or event handler context, known to be free of any
   * attacker-controlled scripts. This can either be side-effect-free
   * Javascript (such as JSON) or Javascript that entirely under Google's
   * control.
   */
  JS: goog.DEBUG ? {sanitizedContentJsStrChars: true} : {},

  /**
   * A sequence of code units that can appear between quotes (either kind) in a
   * JS program without causing a parse error, and without causing any side
   * effects.
   * <p>
   * The content should not contain unescaped quotes, newlines, or anything else
   * that would cause parsing to fail or to cause a JS parser to finish the
   * string its parsing inside the content.
   * <p>
   * The content must also not end inside an escape sequence ; no partial octal
   * escape sequences or odd number of '{@code \}'s at the end.
   */
  JS_STR_CHARS: {},

  /** A properly encoded portion of a URI. */
  URI: {},

  /**
   * Repeated attribute names and values. For example,
   * {@code dir="ltr" foo="bar" onclick="trustedFunction()" checked}.
   */
  ATTRIBUTES: goog.DEBUG ? {sanitizedContentHtmlAttribute: true} : {},

  // TODO: Consider separating rules, declarations, and values into
  // separate types, but for simplicity, we'll treat explicitly blessed
  // SanitizedContent as allowed in all of these contexts.
  /**
   * A CSS3 declaration, property, value or group of semicolon separated
   * declarations.
   */
  CSS: {},

  /**
   * Unsanitized plain-text content.
   *
   * This is effectively the "null" entry of this enum, and is sometimes used
   * to explicitly mark content that should never be used unescaped. Since any
   * string is safe to use as text, being of ContentKind.TEXT makes no
   * guarantees about its safety in any other context such as HTML.
   */
  TEXT: {}
};



/**
 * A string-like object that carries a content-type.
 *
 * IMPORTANT! Do not create these directly, nor instantiate the subclasses.
 * Instead, use a trusted, centrally reviewed library as endorsed by your team
 * to generate these objects. Otherwise, you risk accidentally creating
 * SanitizedContent that is attacker-controlled and gets evaluated unescaped in
 * templates.
 *
 * @constructor
 */
goog.soy.data.SanitizedContent = function() {
  throw Error('Do not instantiate directly');
};


/**
 * The context in which this content is safe from XSS attacks.
 * @type {goog.soy.data.SanitizedContentKind}
 */
goog.soy.data.SanitizedContent.prototype.contentKind;


/**
 * The already-safe content.
 * @type {string}
 */
goog.soy.data.SanitizedContent.prototype.content;


/** @override */
goog.soy.data.SanitizedContent.prototype.toString = function() {
  return this.content;
};


var soy = { esc: {} };
var soydata = {};
soydata.VERY_UNSAFE = {};
var soyshim = { $$DEFAULT_TEMPLATE_DATA_: {} };
/**
 * Helper function to render a Soy template into a single node or a document
 * fragment. If the rendered HTML string represents a single node, then that
 * node is returned. Otherwise a document fragment is created and returned
 * (wrapped in a DIV element if #opt_singleNode is true).
 *
 * @param {Function} template The Soy template defining the element's content.
 * @param {Object=} opt_templateData The data for the template.
 * @param {(goog.dom.DomHelper|Document)=} opt_dom The context in which DOM
 *     nodes will be created.
 * @param {boolean=} opt_asElement Whether to wrap the fragment in an
 *     element if the template does not render a single element. If true,
 *     result is always an Element.
 * @param {Object=} opt_injectedData The injected data for the template.
 * @return {!Node} The resulting node or document fragment.
 * @private
 */
soyshim.$$renderWithWrapper_ = function(
    template, opt_templateData, opt_dom, opt_asElement, opt_injectedData) {

  var dom = opt_dom || document;
  var wrapper = dom.createElement('div');
  wrapper.innerHTML = template(
    opt_templateData || soyshim.$$DEFAULT_TEMPLATE_DATA_, undefined,
    opt_injectedData);

  // If the template renders as a single element, return it.
  if (wrapper.childNodes.length == 1) {
    var firstChild = wrapper.firstChild;
    if (!opt_asElement || firstChild.nodeType == 1 /* Element */) {
      return /** @type {!Node} */ (firstChild);
    }
  }

  // If we're forcing it to be a single element, return the wrapper DIV.
  if (opt_asElement) {
    return wrapper;
  }

  // Otherwise, create and return a fragment.
  var fragment = dom.createDocumentFragment();
  while (wrapper.firstChild) {
    fragment.appendChild(wrapper.firstChild);
  }
  return fragment;
};


/**
 * Returns a Unicode BiDi mark matching bidiGlobalDir (LRM or RLM) if the
 * directionality or the exit directionality of text are opposite to
 * bidiGlobalDir. Otherwise returns the empty string.
 * If opt_isHtml, makes sure to ignore the LTR nature of the mark-up and escapes
 * in text, making the logic suitable for HTML and HTML-escaped text.
 * @param {number} bidiGlobalDir The global directionality context: 1 if ltr, -1
 *     if rtl, 0 if unknown.
 * @param {number} dir text's directionality: 1 if ltr, -1 if rtl, 0 if unknown.
 * @param {string} text The text whose directionality is to be estimated.
 * @param {boolean=} opt_isHtml Whether text is HTML/HTML-escaped.
 *     Default: false.
 * @return {string} A Unicode bidi mark matching bidiGlobalDir, or
 *     the empty string when text's overall and exit directionalities both match
 *     bidiGlobalDir, or bidiGlobalDir is 0 (unknown).
 * @private
 */
soyshim.$$bidiMarkAfterKnownDir_ = function(
    bidiGlobalDir, dir, text, opt_isHtml) {
  return (
      bidiGlobalDir > 0 && (dir < 0 ||
          soyshim.$$bidiIsRtlExitText_(text, opt_isHtml)) ? '\u200E' : // LRM
      bidiGlobalDir < 0 && (dir > 0 ||
          soyshim.$$bidiIsLtrExitText_(text, opt_isHtml)) ? '\u200F' : // RLM
      '');
};


/**
 * Strips str of any HTML mark-up and escapes. Imprecise in several ways, but
 * precision is not very important, since the result is only meant to be used
 * for directionality detection.
 * @param {string} str The string to be stripped.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {string} The stripped string.
 * @private
 */
soyshim.$$bidiStripHtmlIfNecessary_ = function(str, opt_isHtml) {
  return opt_isHtml ? str.replace(soyshim.$$BIDI_HTML_SKIP_RE_, ' ') : str;
};


/**
 * Simplified regular expression for am HTML tag (opening or closing) or an HTML
 * escape - the things we want to skip over in order to ignore their ltr
 * characters.
 * @type {RegExp}
 * @private
 */
soyshim.$$BIDI_HTML_SKIP_RE_ = /<[^>]*>|&[^;]+;/g;


/**
 * A practical pattern to identify strong LTR character. This pattern is not
 * theoretically correct according to unicode standard. It is simplified for
 * performance and small code size.
 * @type {string}
 * @private
 */
soyshim.$$bidiLtrChars_ =
    'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF' +
    '\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF';


/**
 * A practical pattern to identify strong neutral and weak character. This
 * pattern is not theoretically correct according to unicode standard. It is
 * simplified for performance and small code size.
 * @type {string}
 * @private
 */
soyshim.$$bidiNeutralChars_ =
    '\u0000-\u0020!-@[-`{-\u00BF\u00D7\u00F7\u02B9-\u02FF\u2000-\u2BFF';


/**
 * A practical pattern to identify strong RTL character. This pattern is not
 * theoretically correct according to unicode standard. It is simplified for
 * performance and small code size.
 * @type {string}
 * @private
 */
soyshim.$$bidiRtlChars_ = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC';


/**
 * Regular expressions to check if a piece of text is of RTL directionality
 * on first character with strong directionality.
 * @type {RegExp}
 * @private
 */
soyshim.$$bidiRtlDirCheckRe_ = new RegExp(
    '^[^' + soyshim.$$bidiLtrChars_ + ']*[' + soyshim.$$bidiRtlChars_ + ']');


/**
 * Regular expressions to check if a piece of text is of neutral directionality.
 * Url are considered as neutral.
 * @type {RegExp}
 * @private
 */
soyshim.$$bidiNeutralDirCheckRe_ = new RegExp(
    '^[' + soyshim.$$bidiNeutralChars_ + ']*$|^http://');


/**
 * Check the directionality of the a piece of text based on the first character
 * with strong directionality.
 * @param {string} str string being checked.
 * @return {boolean} return true if rtl directionality is being detected.
 * @private
 */
soyshim.$$bidiIsRtlText_ = function(str) {
  return soyshim.$$bidiRtlDirCheckRe_.test(str);
};


/**
 * Check the directionality of the a piece of text based on the first character
 * with strong directionality.
 * @param {string} str string being checked.
 * @return {boolean} true if all characters have neutral directionality.
 * @private
 */
soyshim.$$bidiIsNeutralText_ = function(str) {
  return soyshim.$$bidiNeutralDirCheckRe_.test(str);
};


/**
 * This constant controls threshold of rtl directionality.
 * @type {number}
 * @private
 */
soyshim.$$bidiRtlDetectionThreshold_ = 0.40;


/**
 * Returns the RTL ratio based on word count.
 * @param {string} str the string that need to be checked.
 * @return {number} the ratio of RTL words among all words with directionality.
 * @private
 */
soyshim.$$bidiRtlWordRatio_ = function(str) {
  var rtlCount = 0;
  var totalCount = 0;
  var tokens = str.split(' ');
  for (var i = 0; i < tokens.length; i++) {
    if (soyshim.$$bidiIsRtlText_(tokens[i])) {
      rtlCount++;
      totalCount++;
    } else if (!soyshim.$$bidiIsNeutralText_(tokens[i])) {
      totalCount++;
    }
  }

  return totalCount == 0 ? 0 : rtlCount / totalCount;
};


/**
 * Regular expressions to check if the last strongly-directional character in a
 * piece of text is LTR.
 * @type {RegExp}
 * @private
 */
soyshim.$$bidiLtrExitDirCheckRe_ = new RegExp(
    '[' + soyshim.$$bidiLtrChars_ + '][^' + soyshim.$$bidiRtlChars_ + ']*$');


/**
 * Regular expressions to check if the last strongly-directional character in a
 * piece of text is RTL.
 * @type {RegExp}
 * @private
 */
soyshim.$$bidiRtlExitDirCheckRe_ = new RegExp(
    '[' + soyshim.$$bidiRtlChars_ + '][^' + soyshim.$$bidiLtrChars_ + ']*$');


/**
 * Check if the exit directionality a piece of text is LTR, i.e. if the last
 * strongly-directional character in the string is LTR.
 * @param {string} str string being checked.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {boolean} Whether LTR exit directionality was detected.
 * @private
 */
soyshim.$$bidiIsLtrExitText_ = function(str, opt_isHtml) {
  str = soyshim.$$bidiStripHtmlIfNecessary_(str, opt_isHtml);
  return soyshim.$$bidiLtrExitDirCheckRe_.test(str);
};


/**
 * Check if the exit directionality a piece of text is RTL, i.e. if the last
 * strongly-directional character in the string is RTL.
 * @param {string} str string being checked.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {boolean} Whether RTL exit directionality was detected.
 * @private
 */
soyshim.$$bidiIsRtlExitText_ = function(str, opt_isHtml) {
  str = soyshim.$$bidiStripHtmlIfNecessary_(str, opt_isHtml);
  return soyshim.$$bidiRtlExitDirCheckRe_.test(str);
};


// =============================================================================
// COPIED FROM soyutils_usegoog.js


// -----------------------------------------------------------------------------
// StringBuilder (compatible with the 'stringbuilder' code style).


/**
 * Utility class to facilitate much faster string concatenation in IE,
 * using Array.join() rather than the '+' operator. For other browsers
 * we simply use the '+' operator.
 *
 * @param {Object} var_args Initial items to append,
 *     e.g., new soy.StringBuilder('foo', 'bar').
 * @constructor
 */
soy.StringBuilder = goog.string.StringBuffer;


// -----------------------------------------------------------------------------
// soydata: Defines typed strings, e.g. an HTML string {@code "a<b>c"} is
// semantically distinct from the plain text string {@code "a<b>c"} and smart
// templates can take that distinction into account.

/**
 * A type of textual content.
 *
 * This is an enum of type Object so that these values are unforgeable.
 *
 * @enum {!Object}
 */
soydata.SanitizedContentKind = goog.soy.data.SanitizedContentKind;


/**
 * Content of type {@link soydata.SanitizedContentKind.HTML}.
 *
 * The content is a string of HTML that can safely be embedded in a PCDATA
 * context in your app.  If you would be surprised to find that an HTML
 * sanitizer produced {@code s} (e.g.  it runs code or fetches bad URLs) and
 * you wouldn't write a template that produces {@code s} on security or privacy
 * grounds, then don't pass {@code s} here.
 *
 * @constructor
 * @extends {goog.soy.data.SanitizedContent}
 */
soydata.SanitizedHtml = function() {
  goog.soy.data.SanitizedContent.call(this);  // Throws an exception.
};
goog.inherits(soydata.SanitizedHtml, goog.soy.data.SanitizedContent);

/** @override */
soydata.SanitizedHtml.prototype.contentKind = soydata.SanitizedContentKind.HTML;


/**
 * Content of type {@link soydata.SanitizedContentKind.JS}.
 *
 * The content is Javascript source that when evaluated does not execute any
 * attacker-controlled scripts.
 *
 * @constructor
 * @extends {goog.soy.data.SanitizedContent}
 */
soydata.SanitizedJs = function() {
  goog.soy.data.SanitizedContent.call(this);  // Throws an exception.
};
goog.inherits(soydata.SanitizedJs, goog.soy.data.SanitizedContent);

/** @override */
soydata.SanitizedJs.prototype.contentKind =
    soydata.SanitizedContentKind.JS;


/**
 * Content of type {@link soydata.SanitizedContentKind.JS_STR_CHARS}.
 *
 * The content can be safely inserted as part of a single- or double-quoted
 * string without terminating the string.
 *
 * @constructor
 * @extends {goog.soy.data.SanitizedContent}
 */
soydata.SanitizedJsStrChars = function() {
  goog.soy.data.SanitizedContent.call(this);  // Throws an exception.
};
goog.inherits(soydata.SanitizedJsStrChars, goog.soy.data.SanitizedContent);

/** @override */
soydata.SanitizedJsStrChars.prototype.contentKind =
    soydata.SanitizedContentKind.JS_STR_CHARS;


/**
 * Content of type {@link soydata.SanitizedContentKind.URI}.
 *
 * The content is a URI chunk that the caller knows is safe to emit in a
 * template.
 *
 * @constructor
 * @extends {goog.soy.data.SanitizedContent}
 */
soydata.SanitizedUri = function() {
  goog.soy.data.SanitizedContent.call(this);  // Throws an exception.
};
goog.inherits(soydata.SanitizedUri, goog.soy.data.SanitizedContent);

/** @override */
soydata.SanitizedUri.prototype.contentKind = soydata.SanitizedContentKind.URI;


/**
 * Content of type {@link soydata.SanitizedContentKind.ATTRIBUTES}.
 *
 * The content should be safely embeddable within an open tag, such as a
 * key="value" pair.
 *
 * @constructor
 * @extends {goog.soy.data.SanitizedContent}
 */
soydata.SanitizedHtmlAttribute = function() {
  goog.soy.data.SanitizedContent.call(this);  // Throws an exception.
};
goog.inherits(soydata.SanitizedHtmlAttribute, goog.soy.data.SanitizedContent);

/** @override */
soydata.SanitizedHtmlAttribute.prototype.contentKind =
    soydata.SanitizedContentKind.ATTRIBUTES;


/**
 * Content of type {@link soydata.SanitizedContentKind.CSS}.
 *
 * The content is non-attacker-exploitable CSS, such as {@code color:#c3d9ff}.
 *
 * @constructor
 * @extends {goog.soy.data.SanitizedContent}
 */
soydata.SanitizedCss = function() {
  goog.soy.data.SanitizedContent.call(this);  // Throws an exception.
};
goog.inherits(soydata.SanitizedCss, goog.soy.data.SanitizedContent);

/** @override */
soydata.SanitizedCss.prototype.contentKind =
    soydata.SanitizedContentKind.CSS;


/**
 * Unsanitized plain text string.
 *
 * While all strings are effectively safe to use as a plain text, there are no
 * guarantees about safety in any other context such as HTML. This is
 * sometimes used to mark that should never be used unescaped.
 *
 * @param {*} content Plain text with no guarantees.
 * @constructor
 * @extends {goog.soy.data.SanitizedContent}
 */
soydata.UnsanitizedText = function(content) {
  /** @override */
  this.content = String(content);
};
goog.inherits(soydata.UnsanitizedText, goog.soy.data.SanitizedContent);

/** @override */
soydata.UnsanitizedText.prototype.contentKind =
    soydata.SanitizedContentKind.TEXT;


/**
 * Creates a factory for SanitizedContent types.
 *
 * This is a hack so that the soydata.VERY_UNSAFE.ordainSanitized* can
 * instantiate Sanitized* classes, without making the Sanitized* constructors
 * publicly usable. Requiring all construction to use the VERY_UNSAFE names
 * helps callers and their reviewers easily tell that creating SanitizedContent
 * is not always safe and calls for careful review.
 *
 * @param {function(new: T, string)} ctor A constructor.
 * @return {!function(*): T} A factory that takes content and returns a
 *     new instance.
 * @template T
 * @private
 */
soydata.$$makeSanitizedContentFactory_ = function(ctor) {
  /** @constructor */
  function InstantiableCtor() {}
  InstantiableCtor.prototype = ctor.prototype;
  return function(content) {
    var result = new InstantiableCtor();
    result.content = String(content);
    return result;
  };
};


// -----------------------------------------------------------------------------
// Sanitized content ordainers. Please use these with extreme caution (with the
// exception of markUnsanitizedText). A good recommendation is to limit usage
// of these to just a handful of files in your source tree where usages can be
// carefully audited.


/**
 * Protects a string from being used in an noAutoescaped context.
 *
 * This is useful for content where there is significant risk of accidental
 * unescaped usage in a Soy template. A great case is for user-controlled
 * data that has historically been a source of vulernabilities.
 *
 * @param {*} content Text to protect.
 * @return {!soydata.UnsanitizedText} A wrapper that is rejected by the
 *     Soy noAutoescape print directive.
 */
soydata.markUnsanitizedText = function(content) {
  return new soydata.UnsanitizedText(content);
};


/**
 * Takes a leap of faith that the provided content is "safe" HTML.
 *
 * @param {*} content A string of HTML that can safely be embedded in
 *     a PCDATA context in your app. If you would be surprised to find that an
 *     HTML sanitizer produced {@code s} (e.g. it runs code or fetches bad URLs)
 *     and you wouldn't write a template that produces {@code s} on security or
 *     privacy grounds, then don't pass {@code s} here.
 * @return {!soydata.SanitizedHtml} Sanitized content wrapper that
 *     indicates to Soy not to escape when printed as HTML.
 */
soydata.VERY_UNSAFE.ordainSanitizedHtml =
    soydata.$$makeSanitizedContentFactory_(soydata.SanitizedHtml);


/**
 * Takes a leap of faith that the provided content is "safe" (non-attacker-
 * controlled, XSS-free) Javascript.
 *
 * @param {*} content Javascript source that when evaluated does not
 *     execute any attacker-controlled scripts.
 * @return {!soydata.SanitizedJs} Sanitized content wrapper that indicates to
 *     Soy not to escape when printed as Javascript source.
 */
soydata.VERY_UNSAFE.ordainSanitizedJs =
    soydata.$$makeSanitizedContentFactory_(soydata.SanitizedJs);


// TODO: This function is probably necessary, either externally or internally
// as an implementation detail. Generally, plain text will always work here,
// as there's no harm to unescaping the string and then re-escaping when
// finally printed.
/**
 * Takes a leap of faith that the provided content can be safely embedded in
 * a Javascript string without re-esacping.
 *
 * @param {*} content Content that can be safely inserted as part of a
 *     single- or double-quoted string without terminating the string.
 * @return {!soydata.SanitizedJsStrChars} Sanitized content wrapper that
 *     indicates to Soy not to escape when printed in a JS string.
 */
soydata.VERY_UNSAFE.ordainSanitizedJsStrChars =
    soydata.$$makeSanitizedContentFactory_(soydata.SanitizedJsStrChars);


/**
 * Takes a leap of faith that the provided content is "safe" to use as a URI
 * in a Soy template.
 *
 * This creates a Soy SanitizedContent object which indicates to Soy there is
 * no need to escape it when printed as a URI (e.g. in an href or src
 * attribute), such as if it's already been encoded or  if it's a Javascript:
 * URI.
 *
 * @param {*} content A chunk of URI that the caller knows is safe to
 *     emit in a template.
 * @return {!soydata.SanitizedUri} Sanitized content wrapper that indicates to
 *     Soy not to escape or filter when printed in URI context.
 */
soydata.VERY_UNSAFE.ordainSanitizedUri =
    soydata.$$makeSanitizedContentFactory_(soydata.SanitizedUri);


/**
 * Takes a leap of faith that the provided content is "safe" to use as an
 * HTML attribute.
 *
 * @param {*} content An attribute name and value, such as
 *     {@code dir="ltr"}.
 * @return {!soydata.SanitizedHtmlAttribute} Sanitized content wrapper that
 *     indicates to Soy not to escape when printed as an HTML attribute.
 */
soydata.VERY_UNSAFE.ordainSanitizedHtmlAttribute =
    soydata.$$makeSanitizedContentFactory_(soydata.SanitizedHtmlAttribute);


/**
 * Takes a leap of faith that the provided content is "safe" to use as CSS
 * in a style attribute or block.
 *
 * @param {*} content CSS, such as {@code color:#c3d9ff}.
 * @return {!soydata.SanitizedCss} Sanitized CSS wrapper that indicates to
 *     Soy there is no need to escape or filter when printed in CSS context.
 */
soydata.VERY_UNSAFE.ordainSanitizedCss =
    soydata.$$makeSanitizedContentFactory_(soydata.SanitizedCss);


// -----------------------------------------------------------------------------
// Public utilities.


/**
 * Helper function to render a Soy template and then set the output string as
 * the innerHTML of an element. It is recommended to use this helper function
 * instead of directly setting innerHTML in your hand-written code, so that it
 * will be easier to audit the code for cross-site scripting vulnerabilities.
 *
 * NOTE: New code should consider using goog.soy.renderElement instead.
 *
 * @param {Element} element The element whose content we are rendering.
 * @param {Function} template The Soy template defining the element's content.
 * @param {Object=} opt_templateData The data for the template.
 * @param {Object=} opt_injectedData The injected data for the template.
 */
soy.renderElement = goog.soy.renderElement;


/**
 * Helper function to render a Soy template into a single node or a document
 * fragment. If the rendered HTML string represents a single node, then that
 * node is returned (note that this is *not* a fragment, despite them name of
 * the method). Otherwise a document fragment is returned containing the
 * rendered nodes.
 *
 * NOTE: New code should consider using goog.soy.renderAsFragment
 * instead (note that the arguments are different).
 *
 * @param {Function} template The Soy template defining the element's content.
 * @param {Object=} opt_templateData The data for the template.
 * @param {Document=} opt_document The document used to create DOM nodes. If not
 *     specified, global document object is used.
 * @param {Object=} opt_injectedData The injected data for the template.
 * @return {!Node} The resulting node or document fragment.
 */
soy.renderAsFragment = function(
    template, opt_templateData, opt_document, opt_injectedData) {
  return goog.soy.renderAsFragment(
      template, opt_templateData, opt_injectedData,
      new goog.dom.DomHelper(opt_document));
};


/**
 * Helper function to render a Soy template into a single node. If the rendered
 * HTML string represents a single node, then that node is returned. Otherwise,
 * a DIV element is returned containing the rendered nodes.
 *
 * NOTE: New code should consider using goog.soy.renderAsElement
 * instead (note that the arguments are different).
 *
 * @param {Function} template The Soy template defining the element's content.
 * @param {Object=} opt_templateData The data for the template.
 * @param {Document=} opt_document The document used to create DOM nodes. If not
 *     specified, global document object is used.
 * @param {Object=} opt_injectedData The injected data for the template.
 * @return {!Element} Rendered template contents, wrapped in a parent DIV
 *     element if necessary.
 */
soy.renderAsElement = function(
    template, opt_templateData, opt_document, opt_injectedData) {
  return goog.soy.renderAsElement(
      template, opt_templateData, opt_injectedData,
      new goog.dom.DomHelper(opt_document));
};


// -----------------------------------------------------------------------------
// Below are private utilities to be used by Soy-generated code only.


/**
 * Builds an augmented map. The returned map will contain mappings from both
 * the base map and the additional map. If the same key appears in both, then
 * the value from the additional map will be visible, while the value from the
 * base map will be hidden. The base map will be used, but not modified.
 *
 * @param {!Object} baseMap The original map to augment.
 * @param {!Object} additionalMap A map containing the additional mappings.
 * @return {!Object} An augmented map containing both the original and
 *     additional mappings.
 */
soy.$$augmentMap = function(baseMap, additionalMap) {

  // Create a new map whose '__proto__' field is set to baseMap.
  /** @constructor */
  function TempCtor() {}
  TempCtor.prototype = baseMap;
  var augmentedMap = new TempCtor();

  // Add the additional mappings to the new map.
  for (var key in additionalMap) {
    augmentedMap[key] = additionalMap[key];
  }

  return augmentedMap;
};


/**
 * Checks that the given map key is a string.
 * @param {*} key Key to check.
 * @return {string} The given key.
 */
soy.$$checkMapKey = function(key) {
  if ((typeof key) != 'string') {
    throw Error(
        'Map literal\'s key expression must evaluate to string' +
        ' (encountered type "' + (typeof key) + '").');
  }
  return key;
};


/**
 * Gets the keys in a map as an array. There are no guarantees on the order.
 * @param {Object} map The map to get the keys of.
 * @return {Array.<string>} The array of keys in the given map.
 */
soy.$$getMapKeys = function(map) {
  var mapKeys = [];
  for (var key in map) {
    mapKeys.push(key);
  }
  return mapKeys;
};


/**
 * Gets a consistent unique id for the given delegate template name. Two calls
 * to this function will return the same id if and only if the input names are
 * the same.
 *
 * <p> Important: This function must always be called with a string constant.
 *
 * <p> If Closure Compiler is not being used, then this is just this identity
 * function. If Closure Compiler is being used, then each call to this function
 * will be replaced with a short string constant, which will be consistent per
 * input name.
 *
 * @param {string} delTemplateName The delegate template name for which to get a
 *     consistent unique id.
 * @return {string} A unique id that is consistent per input name.
 *
 * @consistentIdGenerator
 */
soy.$$getDelTemplateId = function(delTemplateName) {
  return delTemplateName;
};


/**
 * Map from registered delegate template key to the priority of the
 * implementation.
 * @type {Object}
 * @private
 */
soy.$$DELEGATE_REGISTRY_PRIORITIES_ = {};

/**
 * Map from registered delegate template key to the implementation function.
 * @type {Object}
 * @private
 */
soy.$$DELEGATE_REGISTRY_FUNCTIONS_ = {};


/**
 * Registers a delegate implementation. If the same delegate template key (id
 * and variant) has been registered previously, then priority values are
 * compared and only the higher priority implementation is stored (if
 * priorities are equal, an error is thrown).
 *
 * @param {string} delTemplateId The delegate template id.
 * @param {string} delTemplateVariant The delegate template variant (can be
 *     empty string).
 * @param {number} delPriority The implementation's priority value.
 * @param {Function} delFn The implementation function.
 */
soy.$$registerDelegateFn = function(
    delTemplateId, delTemplateVariant, delPriority, delFn) {

  var mapKey = 'key_' + delTemplateId + ':' + delTemplateVariant;
  var currPriority = soy.$$DELEGATE_REGISTRY_PRIORITIES_[mapKey];
  if (currPriority === undefined || delPriority > currPriority) {
    // Registering new or higher-priority function: replace registry entry.
    soy.$$DELEGATE_REGISTRY_PRIORITIES_[mapKey] = delPriority;
    soy.$$DELEGATE_REGISTRY_FUNCTIONS_[mapKey] = delFn;
  } else if (delPriority == currPriority) {
    // Registering same-priority function: error.
    throw Error(
        'Encountered two active delegates with the same priority ("' +
            delTemplateId + ':' + delTemplateVariant + '").');
  } else {
    // Registering lower-priority function: do nothing.
  }
};


/**
 * Retrieves the (highest-priority) implementation that has been registered for
 * a given delegate template key (id and variant). If no implementation has
 * been registered for the key, then the fallback is the same id with empty
 * variant. If the fallback is also not registered, and allowsEmptyDefault is
 * true, then returns an implementation that is equivalent to an empty template
 * (i.e. rendered output would be empty string).
 *
 * @param {string} delTemplateId The delegate template id.
 * @param {string} delTemplateVariant The delegate template variant (can be
 *     empty string).
 * @param {boolean} allowsEmptyDefault Whether to default to the empty template
 *     function if there's no active implementation.
 * @return {Function} The retrieved implementation function.
 */
soy.$$getDelegateFn = function(
    delTemplateId, delTemplateVariant, allowsEmptyDefault) {

  var delFn = soy.$$DELEGATE_REGISTRY_FUNCTIONS_[
      'key_' + delTemplateId + ':' + delTemplateVariant];
  if (! delFn && delTemplateVariant != '') {
    // Fallback to empty variant.
    delFn = soy.$$DELEGATE_REGISTRY_FUNCTIONS_['key_' + delTemplateId + ':'];
  }

  if (delFn) {
    return delFn;
  } else if (allowsEmptyDefault) {
    return soy.$$EMPTY_TEMPLATE_FN_;
  } else {
    throw Error(
        'Found no active impl for delegate call to "' + delTemplateId + ':' +
            delTemplateVariant + '" (and not allowemptydefault="true").');
  }
};


/**
 * Private helper soy.$$getDelegateFn(). This is the empty template function
 * that is returned whenever there's no delegate implementation found.
 *
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @param {Object.<string, *>=} opt_ijData
 * @return {string}
 * @private
 */
soy.$$EMPTY_TEMPLATE_FN_ = function(opt_data, opt_sb, opt_ijData) {
  return '';
};


// -----------------------------------------------------------------------------
// Escape/filter/normalize.


/**
 * Escapes HTML special characters in a string. Escapes double quote '"' in
 * addition to '&', '<', and '>' so that a string can be included in an HTML
 * tag attribute value within double quotes.
 * Will emit known safe HTML as-is.
 *
 * @param {*} value The string-like value to be escaped. May not be a string,
 *     but the value will be coerced to a string.
 * @return {string} An escaped version of value.
 */
soy.$$escapeHtml = function(value) {
  // TODO: Perhaps we should just ignore the contentKind property and instead
  // look only at the constructor.
  if (value && value.contentKind &&
      value.contentKind === goog.soy.data.SanitizedContentKind.HTML) {
    goog.asserts.assert(
        value.constructor === soydata.SanitizedHtml);
    return value.content;
  }
  return soy.esc.$$escapeHtmlHelper(value);
};


/**
 * Strips unsafe tags to convert a string of untrusted HTML into HTML that
 * is safe to embed.
 *
 * @param {*} value The string-like value to be escaped. May not be a string,
 *     but the value will be coerced to a string.
 * @return {string} A sanitized and normalized version of value.
 */
soy.$$cleanHtml = function(value) {
  if (value && value.contentKind &&
      value.contentKind === goog.soy.data.SanitizedContentKind.HTML) {
    goog.asserts.assert(
        value.constructor === soydata.SanitizedHtml);
    return value.content;
  }
  return soy.$$stripHtmlTags(value, soy.esc.$$SAFE_TAG_WHITELIST_);
};


/**
 * Escapes HTML special characters in a string so that it can be embedded in
 * RCDATA.
 * <p>
 * Escapes HTML special characters so that the value will not prematurely end
 * the body of a tag like {@code <textarea>} or {@code <title>}. RCDATA tags
 * cannot contain other HTML entities, so it is not strictly necessary to escape
 * HTML special characters except when part of that text looks like an HTML
 * entity or like a close tag : {@code </textarea>}.
 * <p>
 * Will normalize known safe HTML to make sure that sanitized HTML (which could
 * contain an innocuous {@code </textarea>} don't prematurely end an RCDATA
 * element.
 *
 * @param {*} value The string-like value to be escaped. May not be a string,
 *     but the value will be coerced to a string.
 * @return {string} An escaped version of value.
 */
soy.$$escapeHtmlRcdata = function(value) {
  if (value && value.contentKind &&
      value.contentKind === goog.soy.data.SanitizedContentKind.HTML) {
    goog.asserts.assert(
        value.constructor === soydata.SanitizedHtml);
    return soy.esc.$$normalizeHtmlHelper(value.content);
  }
  return soy.esc.$$escapeHtmlHelper(value);
};


/**
 * Matches any/only HTML5 void elements' start tags.
 * See http://www.w3.org/TR/html-markup/syntax.html#syntax-elements
 * @type {RegExp}
 * @private
 */
soy.$$HTML5_VOID_ELEMENTS_ = new RegExp(
    '^<(?:area|base|br|col|command|embed|hr|img|input' +
    '|keygen|link|meta|param|source|track|wbr)\\b');


/**
 * Removes HTML tags from a string of known safe HTML.
 * If opt_tagWhitelist is not specified or is empty, then
 * the result can be used as an attribute value.
 *
 * @param {*} value The HTML to be escaped. May not be a string, but the
 *     value will be coerced to a string.
 * @param {Object.<string, number>=} opt_tagWhitelist Has an own property whose
 *     name is a lower-case tag name and whose value is {@code 1} for
 *     each element that is allowed in the output.
 * @return {string} A representation of value without disallowed tags,
 *     HTML comments, or other non-text content.
 */
soy.$$stripHtmlTags = function(value, opt_tagWhitelist) {
  if (!opt_tagWhitelist) {
    // If we have no white-list, then use a fast track which elides all tags.
    return String(value).replace(soy.esc.$$HTML_TAG_REGEX_, '')
        // This is just paranoia since callers should normalize the result
        // anyway, but if they didn't, it would be necessary to ensure that
        // after the first replace non-tag uses of < do not recombine into
        // tags as in "<<foo>script>alert(1337)</<foo>script>".
        .replace(soy.esc.$$LT_REGEX_, '&lt;');
  }

  // Escapes '[' so that we can use [123] below to mark places where tags
  // have been removed.
  var html = String(value).replace(/\[/g, '&#91;');

  // Consider all uses of '<' and replace whitelisted tags with markers like
  // [1] which are indices into a list of approved tag names.
  // Replace all other uses of < and > with entities.
  var tags = [];
  html = html.replace(
    soy.esc.$$HTML_TAG_REGEX_,
    function(tok, tagName) {
      if (tagName) {
        tagName = tagName.toLowerCase();
        if (opt_tagWhitelist.hasOwnProperty(tagName) &&
            opt_tagWhitelist[tagName]) {
          var start = tok.charAt(1) === '/' ? '</' : '<';
          var index = tags.length;
          tags[index] = start + tagName + '>';
          return '[' + index + ']';
        }
      }
      return '';
    });

  // Escape HTML special characters. Now there are no '<' in html that could
  // start a tag.
  html = soy.esc.$$normalizeHtmlHelper(html);

  var finalCloseTags = soy.$$balanceTags_(tags);

  // Now html contains no tags or less-than characters that could become
  // part of a tag via a replacement operation and tags only contains
  // approved tags.
  // Reinsert the white-listed tags.
  html = html.replace(
       /\[(\d+)\]/g, function(_, index) { return tags[index]; });

  // Close any still open tags.
  // This prevents unclosed formatting elements like <ol> and <table> from
  // breaking the layout of containing HTML.
  return html + finalCloseTags;
};


/**
 * Throw out any close tags that don't correspond to start tags.
 * If {@code <table>} is used for formatting, embedded HTML shouldn't be able
 * to use a mismatched {@code </table>} to break page layout.
 *
 * @param {Array.<string>} tags an array of tags that will be modified in place
 *    include tags, the empty string, or concatenations of empty tags.
 * @return {string} zero or more closed tags that close all elements that are
 *    opened in tags but not closed.
 * @private
 */
soy.$$balanceTags_ = function(tags) {
  var open = [];
  for (var i = 0, n = tags.length; i < n; ++i) {
    var tag = tags[i];
    if (tag.charAt(1) === '/') {
      var openTagIndex = open.length - 1;
      // NOTE: This is essentially lastIndexOf, but it's not supported in IE.
      while (openTagIndex >= 0 && open[openTagIndex] != tag) {
        openTagIndex--;
      }
      if (openTagIndex < 0) {
        tags[i] = '';  // Drop close tag.
      } else {
        tags[i] = open.slice(openTagIndex).reverse().join('');
        open.length = openTagIndex;
      }
    } else if (!soy.$$HTML5_VOID_ELEMENTS_.test(tag)) {
      open.push('</' + tag.substring(1));
    }
  }
  return open.reverse().join('');
};


/**
 * Escapes HTML special characters in an HTML attribute value.
 *
 * @param {*} value The HTML to be escaped. May not be a string, but the
 *     value will be coerced to a string.
 * @return {string} An escaped version of value.
 */
soy.$$escapeHtmlAttribute = function(value) {
  if (value && value.contentKind) {
    // NOTE: We don't accept ATTRIBUTES here because ATTRIBUTES is
    // actually not the attribute value context, but instead k/v pairs.
    if (value.contentKind === goog.soy.data.SanitizedContentKind.HTML) {
      // NOTE: After removing tags, we also escape quotes ("normalize") so that
      // the HTML can be embedded in attribute context.
      goog.asserts.assert(
          value.constructor === soydata.SanitizedHtml);
      return soy.esc.$$normalizeHtmlHelper(soy.$$stripHtmlTags(value.content));
    }
  }
  return soy.esc.$$escapeHtmlHelper(value);
};


/**
 * Escapes HTML special characters in a string including space and other
 * characters that can end an unquoted HTML attribute value.
 *
 * @param {*} value The HTML to be escaped. May not be a string, but the
 *     value will be coerced to a string.
 * @return {string} An escaped version of value.
 */
soy.$$escapeHtmlAttributeNospace = function(value) {
  if (value && value.contentKind) {
    if (value.contentKind === goog.soy.data.SanitizedContentKind.HTML) {
      goog.asserts.assert(value.constructor ===
          soydata.SanitizedHtml);
      return soy.esc.$$normalizeHtmlNospaceHelper(
          soy.$$stripHtmlTags(value.content));
    }
  }
  return soy.esc.$$escapeHtmlNospaceHelper(value);
};


/**
 * Filters out strings that cannot be a substring of a valid HTML attribute.
 *
 * Note the input is expected to be key=value pairs.
 *
 * @param {*} value The value to escape. May not be a string, but the value
 *     will be coerced to a string.
 * @return {string} A valid HTML attribute name part or name/value pair.
 *     {@code "zSoyz"} if the input is invalid.
 */
soy.$$filterHtmlAttributes = function(value) {
  // NOTE: Explicitly no support for SanitizedContentKind.HTML, since that is
  // meaningless in this context, which is generally *between* html attributes.
  if (value &&
      value.contentKind === goog.soy.data.SanitizedContentKind.ATTRIBUTES) {
    goog.asserts.assert(value.constructor ===
        soydata.SanitizedHtmlAttribute);
    // Add a space at the end to ensure this won't get merged into following
    // attributes, unless the interpretation is unambiguous (ending with quotes
    // or a space).
    return value.content.replace(/([^"'\s])$/, '$1 ');
  }
  // TODO: Dynamically inserting attributes that aren't marked as trusted is
  // probably unnecessary.  Any filtering done here will either be inadequate
  // for security or not flexible enough.  Having clients use kind="attributes"
  // in parameters seems like a wiser idea.
  return soy.esc.$$filterHtmlAttributesHelper(value);
};


/**
 * Filters out strings that cannot be a substring of a valid HTML element name.
 *
 * @param {*} value The value to escape. May not be a string, but the value
 *     will be coerced to a string.
 * @return {string} A valid HTML element name part.
 *     {@code "zSoyz"} if the input is invalid.
 */
soy.$$filterHtmlElementName = function(value) {
  // NOTE: We don't accept any SanitizedContent here. HTML indicates valid
  // PCDATA, not tag names. A sloppy developer shouldn't be able to cause an
  // exploit:
  // ... {let userInput}script src=http://evil.com/evil.js{/let} ...
  // ... {param tagName kind="html"}{$userInput}{/param} ...
  // ... <{$tagName}>Hello World</{$tagName}>
  return soy.esc.$$filterHtmlElementNameHelper(value);
};


/**
 * Escapes characters in the value to make it valid content for a JS string
 * literal.
 *
 * @param {*} value The value to escape. May not be a string, but the value
 *     will be coerced to a string.
 * @return {string} An escaped version of value.
 * @deprecated
 */
soy.$$escapeJs = function(value) {
  return soy.$$escapeJsString(value);
};


/**
 * Escapes characters in the value to make it valid content for a JS string
 * literal.
 *
 * @param {*} value The value to escape. May not be a string, but the value
 *     will be coerced to a string.
 * @return {string} An escaped version of value.
 */
soy.$$escapeJsString = function(value) {
  if (value &&
      value.contentKind === goog.soy.data.SanitizedContentKind.JS_STR_CHARS) {
    // TODO: It might still be worthwhile to normalize it to remove
    // unescaped quotes, null, etc: replace(/(?:^|[^\])['"]/g, '\\$
    goog.asserts.assert(value.constructor ===
        soydata.SanitizedJsStrChars);
    return value.content;
  }
  return soy.esc.$$escapeJsStringHelper(value);
};


/**
 * Encodes a value as a JavaScript literal.
 *
 * @param {*} value The value to escape. May not be a string, but the value
 *     will be coerced to a string.
 * @return {string} A JavaScript code representation of the input.
 */
soy.$$escapeJsValue = function(value) {
  // We surround values with spaces so that they can't be interpolated into
  // identifiers by accident.
  // We could use parentheses but those might be interpreted as a function call.
  if (value == null) {  // Intentionally matches undefined.
    // Java returns null from maps where there is no corresponding key while
    // JS returns undefined.
    // We always output null for compatibility with Java which does not have a
    // distinct undefined value.
    return ' null ';
  }
  if (value.contentKind == goog.soy.data.SanitizedContentKind.JS) {
    goog.asserts.assert(value.constructor ===
        soydata.SanitizedJs);
    return value.content;
  }
  switch (typeof value) {
    case 'boolean': case 'number':
      return ' ' + value + ' ';
    default:
      return "'" + soy.esc.$$escapeJsStringHelper(String(value)) + "'";
  }
};


/**
 * Escapes characters in the string to make it valid content for a JS regular
 * expression literal.
 *
 * @param {*} value The value to escape. May not be a string, but the value
 *     will be coerced to a string.
 * @return {string} An escaped version of value.
 */
soy.$$escapeJsRegex = function(value) {
  return soy.esc.$$escapeJsRegexHelper(value);
};


/**
 * Matches all URI mark characters that conflict with HTML attribute delimiters
 * or that cannot appear in a CSS uri.
 * From <a href="http://www.w3.org/TR/CSS2/grammar.html">G.2: CSS grammar</a>
 * <pre>
 *     url        ([!#$%&*-~]|{nonascii}|{escape})*
 * </pre>
 *
 * @type {RegExp}
 * @private
 */
soy.$$problematicUriMarks_ = /['()]/g;

/**
 * @param {string} ch A single character in {@link soy.$$problematicUriMarks_}.
 * @return {string}
 * @private
 */
soy.$$pctEncode_ = function(ch) {
  return '%' + ch.charCodeAt(0).toString(16);
};

/**
 * Escapes a string so that it can be safely included in a URI.
 *
 * @param {*} value The value to escape. May not be a string, but the value
 *     will be coerced to a string.
 * @return {string} An escaped version of value.
 */
soy.$$escapeUri = function(value) {
  if (value && value.contentKind === goog.soy.data.SanitizedContentKind.URI) {
    goog.asserts.assert(value.constructor ===
        soydata.SanitizedUri);
    return soy.$$normalizeUri(value);
  }
  // Apostophes and parentheses are not matched by encodeURIComponent.
  // They are technically special in URIs, but only appear in the obsolete mark
  // production in Appendix D.2 of RFC 3986, so can be encoded without changing
  // semantics.
  var encoded = soy.esc.$$escapeUriHelper(value);
  soy.$$problematicUriMarks_.lastIndex = 0;
  if (soy.$$problematicUriMarks_.test(encoded)) {
    return encoded.replace(soy.$$problematicUriMarks_, soy.$$pctEncode_);
  }
  return encoded;
};


/**
 * Removes rough edges from a URI by escaping any raw HTML/JS string delimiters.
 *
 * @param {*} value The value to escape. May not be a string, but the value
 *     will be coerced to a string.
 * @return {string} An escaped version of value.
 */
soy.$$normalizeUri = function(value) {
  return soy.esc.$$normalizeUriHelper(value);
};


/**
 * Vets a URI's protocol and removes rough edges from a URI by escaping
 * any raw HTML/JS string delimiters.
 *
 * @param {*} value The value to escape. May not be a string, but the value
 *     will be coerced to a string.
 * @return {string} An escaped version of value.
 */
soy.$$filterNormalizeUri = function(value) {
  if (value && value.contentKind == goog.soy.data.SanitizedContentKind.URI) {
    goog.asserts.assert(value.constructor ===
        soydata.SanitizedUri);
    return soy.$$normalizeUri(value);
  }
  return soy.esc.$$filterNormalizeUriHelper(value);
};


/**
 * Escapes a string so it can safely be included inside a quoted CSS string.
 *
 * @param {*} value The value to escape. May not be a string, but the value
 *     will be coerced to a string.
 * @return {string} An escaped version of value.
 */
soy.$$escapeCssString = function(value) {
  return soy.esc.$$escapeCssStringHelper(value);
};


/**
 * Encodes a value as a CSS identifier part, keyword, or quantity.
 *
 * @param {*} value The value to escape. May not be a string, but the value
 *     will be coerced to a string.
 * @return {string} A safe CSS identifier part, keyword, or quanitity.
 */
soy.$$filterCssValue = function(value) {
  if (value && value.contentKind === goog.soy.data.SanitizedContentKind.CSS) {
    goog.asserts.assert(value.constructor ===
        soydata.SanitizedCss);
    return value.content;
  }
  // Uses == to intentionally match null and undefined for Java compatibility.
  if (value == null) {
    return '';
  }
  return soy.esc.$$filterCssValueHelper(value);
};


/**
 * Sanity-checks noAutoescape input for explicitly tainted content.
 *
 * SanitizedContentKind.TEXT is used to explicitly mark input that was never
 * meant to be used unescaped.
 *
 * @param {*} value The value to filter.
 * @return {string} The value, that we dearly hope will not cause an attack.
 */
soy.$$filterNoAutoescape = function(value) {
  if (value && value.contentKind === goog.soy.data.SanitizedContentKind.TEXT) {
    // Fail in development mode.
    goog.asserts.fail(
        'Tainted SanitizedContentKind.TEXT for |noAutoescape: `%s`',
        [value.content]);
    // Return innocuous data in production.
    return 'zSoyz';
  }
  return String(value);
};


// -----------------------------------------------------------------------------
// Basic directives/functions.


/**
 * Converts \r\n, \r, and \n to <br>s
 * @param {*} str The string in which to convert newlines.
 * @return {string} A copy of {@code str} with converted newlines.
 */
soy.$$changeNewlineToBr = function(str) {
  return goog.string.newLineToBr(String(str), false);
};


/**
 * Inserts word breaks ('wbr' tags) into a HTML string at a given interval. The
 * counter is reset if a space is encountered. Word breaks aren't inserted into
 * HTML tags or entities. Entites count towards the character count; HTML tags
 * do not.
 *
 * @param {*} str The HTML string to insert word breaks into. Can be other
 *     types, but the value will be coerced to a string.
 * @param {number} maxCharsBetweenWordBreaks Maximum number of non-space
 *     characters to allow before adding a word break.
 * @return {string} The string including word breaks.
 */
soy.$$insertWordBreaks = function(str, maxCharsBetweenWordBreaks) {
  return goog.format.insertWordBreaks(String(str), maxCharsBetweenWordBreaks);
};


/**
 * Truncates a string to a given max length (if it's currently longer),
 * optionally adding ellipsis at the end.
 *
 * @param {*} str The string to truncate. Can be other types, but the value will
 *     be coerced to a string.
 * @param {number} maxLen The maximum length of the string after truncation
 *     (including ellipsis, if applicable).
 * @param {boolean} doAddEllipsis Whether to add ellipsis if the string needs
 *     truncation.
 * @return {string} The string after truncation.
 */
soy.$$truncate = function(str, maxLen, doAddEllipsis) {

  str = String(str);
  if (str.length <= maxLen) {
    return str;  // no need to truncate
  }

  // If doAddEllipsis, either reduce maxLen to compensate, or else if maxLen is
  // too small, just turn off doAddEllipsis.
  if (doAddEllipsis) {
    if (maxLen > 3) {
      maxLen -= 3;
    } else {
      doAddEllipsis = false;
    }
  }

  // Make sure truncating at maxLen doesn't cut up a unicode surrogate pair.
  if (soy.$$isHighSurrogate_(str.charAt(maxLen - 1)) &&
      soy.$$isLowSurrogate_(str.charAt(maxLen))) {
    maxLen -= 1;
  }

  // Truncate.
  str = str.substring(0, maxLen);

  // Add ellipsis.
  if (doAddEllipsis) {
    str += '...';
  }

  return str;
};

/**
 * Private helper for $$truncate() to check whether a char is a high surrogate.
 * @param {string} ch The char to check.
 * @return {boolean} Whether the given char is a unicode high surrogate.
 * @private
 */
soy.$$isHighSurrogate_ = function(ch) {
  return 0xD800 <= ch && ch <= 0xDBFF;
};

/**
 * Private helper for $$truncate() to check whether a char is a low surrogate.
 * @param {string} ch The char to check.
 * @return {boolean} Whether the given char is a unicode low surrogate.
 * @private
 */
soy.$$isLowSurrogate_ = function(ch) {
  return 0xDC00 <= ch && ch <= 0xDFFF;
};


// -----------------------------------------------------------------------------
// Bidi directives/functions.


/**
 * Cache of bidi formatter by context directionality, so we don't keep on
 * creating new objects.
 * @type {!Object.<!goog.i18n.BidiFormatter>}
 * @private
 */
soy.$$bidiFormatterCache_ = {};


/**
 * Returns cached bidi formatter for bidiGlobalDir, or creates a new one.
 * @param {number} bidiGlobalDir The global directionality context: 1 if ltr, -1
 *     if rtl, 0 if unknown.
 * @return {goog.i18n.BidiFormatter} A formatter for bidiGlobalDir.
 * @private
 */
soy.$$getBidiFormatterInstance_ = function(bidiGlobalDir) {
  return soy.$$bidiFormatterCache_[bidiGlobalDir] ||
         (soy.$$bidiFormatterCache_[bidiGlobalDir] =
             new goog.i18n.BidiFormatter(bidiGlobalDir));
};


/**
 * Estimate the overall directionality of text. If opt_isHtml, makes sure to
 * ignore the LTR nature of the mark-up and escapes in text, making the logic
 * suitable for HTML and HTML-escaped text.
 * @param {string} text The text whose directionality is to be estimated.
 * @param {boolean=} opt_isHtml Whether text is HTML/HTML-escaped.
 *     Default: false.
 * @return {number} 1 if text is LTR, -1 if it is RTL, and 0 if it is neutral.
 */
soy.$$bidiTextDir = function(text, opt_isHtml) {
  if (!text) {
    return 0;
  }
  return goog.i18n.bidi.detectRtlDirectionality(text, opt_isHtml) ? -1 : 1;
};


/**
 * Returns 'dir="ltr"' or 'dir="rtl"', depending on text's estimated
 * directionality, if it is not the same as bidiGlobalDir.
 * Otherwise, returns the empty string.
 * If opt_isHtml, makes sure to ignore the LTR nature of the mark-up and escapes
 * in text, making the logic suitable for HTML and HTML-escaped text.
 * @param {number} bidiGlobalDir The global directionality context: 1 if ltr, -1
 *     if rtl, 0 if unknown.
 * @param {string} text The text whose directionality is to be estimated.
 * @param {boolean=} opt_isHtml Whether text is HTML/HTML-escaped.
 *     Default: false.
 * @return {soydata.SanitizedHtmlAttribute} 'dir="rtl"' for RTL text in non-RTL
 *     context; 'dir="ltr"' for LTR text in non-LTR context;
 *     else, the empty string.
 */
soy.$$bidiDirAttr = function(bidiGlobalDir, text, opt_isHtml) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtmlAttribute(
      soy.$$getBidiFormatterInstance_(bidiGlobalDir).dirAttr(text, opt_isHtml));
};


/**
 * Returns a Unicode BiDi mark matching bidiGlobalDir (LRM or RLM) if the
 * directionality or the exit directionality of text are opposite to
 * bidiGlobalDir. Otherwise returns the empty string.
 * If opt_isHtml, makes sure to ignore the LTR nature of the mark-up and escapes
 * in text, making the logic suitable for HTML and HTML-escaped text.
 * @param {number} bidiGlobalDir The global directionality context: 1 if ltr, -1
 *     if rtl, 0 if unknown.
 * @param {string} text The text whose directionality is to be estimated.
 * @param {boolean=} opt_isHtml Whether text is HTML/HTML-escaped.
 *     Default: false.
 * @return {string} A Unicode bidi mark matching bidiGlobalDir, or the empty
 *     string when text's overall and exit directionalities both match
 *     bidiGlobalDir, or bidiGlobalDir is 0 (unknown).
 */
soy.$$bidiMarkAfter = function(bidiGlobalDir, text, opt_isHtml) {
  var formatter = soy.$$getBidiFormatterInstance_(bidiGlobalDir);
  return formatter.markAfter(text, opt_isHtml);
};


/**
 * Returns str wrapped in a <span dir="ltr|rtl"> according to its directionality
 * - but only if that is neither neutral nor the same as the global context.
 * Otherwise, returns str unchanged.
 * Always treats str as HTML/HTML-escaped, i.e. ignores mark-up and escapes when
 * estimating str's directionality.
 * @param {number} bidiGlobalDir The global directionality context: 1 if ltr, -1
 *     if rtl, 0 if unknown.
 * @param {*} str The string to be wrapped. Can be other types, but the value
 *     will be coerced to a string.
 * @return {string} The wrapped string.
 */
soy.$$bidiSpanWrap = function(bidiGlobalDir, str) {
  var formatter = soy.$$getBidiFormatterInstance_(bidiGlobalDir);
  return formatter.spanWrap(str + '', true);
};


/**
 * Returns str wrapped in Unicode BiDi formatting characters according to its
 * directionality, i.e. either LRE or RLE at the beginning and PDF at the end -
 * but only if str's directionality is neither neutral nor the same as the
 * global context. Otherwise, returns str unchanged.
 * Always treats str as HTML/HTML-escaped, i.e. ignores mark-up and escapes when
 * estimating str's directionality.
 * @param {number} bidiGlobalDir The global directionality context: 1 if ltr, -1
 *     if rtl, 0 if unknown.
 * @param {*} str The string to be wrapped. Can be other types, but the value
 *     will be coerced to a string.
 * @return {string} The wrapped string.
 */
soy.$$bidiUnicodeWrap = function(bidiGlobalDir, str) {
  var formatter = soy.$$getBidiFormatterInstance_(bidiGlobalDir);
  return formatter.unicodeWrap(str + '', true);
};


// -----------------------------------------------------------------------------
// Generated code.




// START GENERATED CODE FOR ESCAPERS.

/**
 * @type {function (*) : string}
 */
soy.esc.$$escapeUriHelper = function(v) {
  return encodeURIComponent(String(v));
};

/**
 * Maps charcters to the escaped versions for the named escape directives.
 * @type {Object.<string, string>}
 * @private
 */
soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_ = {
  '\x00': '\x26#0;',
  '\x22': '\x26quot;',
  '\x26': '\x26amp;',
  '\x27': '\x26#39;',
  '\x3c': '\x26lt;',
  '\x3e': '\x26gt;',
  '\x09': '\x26#9;',
  '\x0a': '\x26#10;',
  '\x0b': '\x26#11;',
  '\x0c': '\x26#12;',
  '\x0d': '\x26#13;',
  ' ': '\x26#32;',
  '-': '\x26#45;',
  '\/': '\x26#47;',
  '\x3d': '\x26#61;',
  '`': '\x26#96;',
  '\x85': '\x26#133;',
  '\xa0': '\x26#160;',
  '\u2028': '\x26#8232;',
  '\u2029': '\x26#8233;'
};

/**
 * A function that can be used with String.replace..
 * @param {string} ch A single character matched by a compatible matcher.
 * @return {string} A token in the output language.
 * @private
 */
soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_ = function(ch) {
  return soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_[ch];
};

/**
 * Maps charcters to the escaped versions for the named escape directives.
 * @type {Object.<string, string>}
 * @private
 */
soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_ = {
  '\x00': '\\x00',
  '\x08': '\\x08',
  '\x09': '\\t',
  '\x0a': '\\n',
  '\x0b': '\\x0b',
  '\x0c': '\\f',
  '\x0d': '\\r',
  '\x22': '\\x22',
  '\x26': '\\x26',
  '\x27': '\\x27',
  '\/': '\\\/',
  '\x3c': '\\x3c',
  '\x3d': '\\x3d',
  '\x3e': '\\x3e',
  '\\': '\\\\',
  '\x85': '\\x85',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029',
  '$': '\\x24',
  '(': '\\x28',
  ')': '\\x29',
  '*': '\\x2a',
  '+': '\\x2b',
  ',': '\\x2c',
  '-': '\\x2d',
  '.': '\\x2e',
  ':': '\\x3a',
  '?': '\\x3f',
  '[': '\\x5b',
  ']': '\\x5d',
  '^': '\\x5e',
  '{': '\\x7b',
  '|': '\\x7c',
  '}': '\\x7d'
};

/**
 * A function that can be used with String.replace..
 * @param {string} ch A single character matched by a compatible matcher.
 * @return {string} A token in the output language.
 * @private
 */
soy.esc.$$REPLACER_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_ = function(ch) {
  return soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_[ch];
};

/**
 * Maps charcters to the escaped versions for the named escape directives.
 * @type {Object.<string, string>}
 * @private
 */
soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_CSS_STRING_ = {
  '\x00': '\\0 ',
  '\x08': '\\8 ',
  '\x09': '\\9 ',
  '\x0a': '\\a ',
  '\x0b': '\\b ',
  '\x0c': '\\c ',
  '\x0d': '\\d ',
  '\x22': '\\22 ',
  '\x26': '\\26 ',
  '\x27': '\\27 ',
  '(': '\\28 ',
  ')': '\\29 ',
  '*': '\\2a ',
  '\/': '\\2f ',
  ':': '\\3a ',
  ';': '\\3b ',
  '\x3c': '\\3c ',
  '\x3d': '\\3d ',
  '\x3e': '\\3e ',
  '@': '\\40 ',
  '\\': '\\5c ',
  '{': '\\7b ',
  '}': '\\7d ',
  '\x85': '\\85 ',
  '\xa0': '\\a0 ',
  '\u2028': '\\2028 ',
  '\u2029': '\\2029 '
};

/**
 * A function that can be used with String.replace..
 * @param {string} ch A single character matched by a compatible matcher.
 * @return {string} A token in the output language.
 * @private
 */
soy.esc.$$REPLACER_FOR_ESCAPE_CSS_STRING_ = function(ch) {
  return soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_CSS_STRING_[ch];
};

/**
 * Maps charcters to the escaped versions for the named escape directives.
 * @type {Object.<string, string>}
 * @private
 */
soy.esc.$$ESCAPE_MAP_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_ = {
  '\x00': '%00',
  '\x01': '%01',
  '\x02': '%02',
  '\x03': '%03',
  '\x04': '%04',
  '\x05': '%05',
  '\x06': '%06',
  '\x07': '%07',
  '\x08': '%08',
  '\x09': '%09',
  '\x0a': '%0A',
  '\x0b': '%0B',
  '\x0c': '%0C',
  '\x0d': '%0D',
  '\x0e': '%0E',
  '\x0f': '%0F',
  '\x10': '%10',
  '\x11': '%11',
  '\x12': '%12',
  '\x13': '%13',
  '\x14': '%14',
  '\x15': '%15',
  '\x16': '%16',
  '\x17': '%17',
  '\x18': '%18',
  '\x19': '%19',
  '\x1a': '%1A',
  '\x1b': '%1B',
  '\x1c': '%1C',
  '\x1d': '%1D',
  '\x1e': '%1E',
  '\x1f': '%1F',
  ' ': '%20',
  '\x22': '%22',
  '\x27': '%27',
  '(': '%28',
  ')': '%29',
  '\x3c': '%3C',
  '\x3e': '%3E',
  '\\': '%5C',
  '{': '%7B',
  '}': '%7D',
  '\x7f': '%7F',
  '\x85': '%C2%85',
  '\xa0': '%C2%A0',
  '\u2028': '%E2%80%A8',
  '\u2029': '%E2%80%A9',
  '\uff01': '%EF%BC%81',
  '\uff03': '%EF%BC%83',
  '\uff04': '%EF%BC%84',
  '\uff06': '%EF%BC%86',
  '\uff07': '%EF%BC%87',
  '\uff08': '%EF%BC%88',
  '\uff09': '%EF%BC%89',
  '\uff0a': '%EF%BC%8A',
  '\uff0b': '%EF%BC%8B',
  '\uff0c': '%EF%BC%8C',
  '\uff0f': '%EF%BC%8F',
  '\uff1a': '%EF%BC%9A',
  '\uff1b': '%EF%BC%9B',
  '\uff1d': '%EF%BC%9D',
  '\uff1f': '%EF%BC%9F',
  '\uff20': '%EF%BC%A0',
  '\uff3b': '%EF%BC%BB',
  '\uff3d': '%EF%BC%BD'
};

/**
 * A function that can be used with String.replace..
 * @param {string} ch A single character matched by a compatible matcher.
 * @return {string} A token in the output language.
 * @private
 */
soy.esc.$$REPLACER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_ = function(ch) {
  return soy.esc.$$ESCAPE_MAP_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_[ch];
};

/**
 * Matches characters that need to be escaped for the named directives.
 * @type RegExp
 * @private
 */
soy.esc.$$MATCHER_FOR_ESCAPE_HTML_ = /[\x00\x22\x26\x27\x3c\x3e]/g;

/**
 * Matches characters that need to be escaped for the named directives.
 * @type RegExp
 * @private
 */
soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_ = /[\x00\x22\x27\x3c\x3e]/g;

/**
 * Matches characters that need to be escaped for the named directives.
 * @type RegExp
 * @private
 */
soy.esc.$$MATCHER_FOR_ESCAPE_HTML_NOSPACE_ = /[\x00\x09-\x0d \x22\x26\x27\x2d\/\x3c-\x3e`\x85\xa0\u2028\u2029]/g;

/**
 * Matches characters that need to be escaped for the named directives.
 * @type RegExp
 * @private
 */
soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_NOSPACE_ = /[\x00\x09-\x0d \x22\x27\x2d\/\x3c-\x3e`\x85\xa0\u2028\u2029]/g;

/**
 * Matches characters that need to be escaped for the named directives.
 * @type RegExp
 * @private
 */
soy.esc.$$MATCHER_FOR_ESCAPE_JS_STRING_ = /[\x00\x08-\x0d\x22\x26\x27\/\x3c-\x3e\\\x85\u2028\u2029]/g;

/**
 * Matches characters that need to be escaped for the named directives.
 * @type RegExp
 * @private
 */
soy.esc.$$MATCHER_FOR_ESCAPE_JS_REGEX_ = /[\x00\x08-\x0d\x22\x24\x26-\/\x3a\x3c-\x3f\x5b-\x5e\x7b-\x7d\x85\u2028\u2029]/g;

/**
 * Matches characters that need to be escaped for the named directives.
 * @type RegExp
 * @private
 */
soy.esc.$$MATCHER_FOR_ESCAPE_CSS_STRING_ = /[\x00\x08-\x0d\x22\x26-\x2a\/\x3a-\x3e@\\\x7b\x7d\x85\xa0\u2028\u2029]/g;

/**
 * Matches characters that need to be escaped for the named directives.
 * @type RegExp
 * @private
 */
soy.esc.$$MATCHER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_ = /[\x00- \x22\x27-\x29\x3c\x3e\\\x7b\x7d\x7f\x85\xa0\u2028\u2029\uff01\uff03\uff04\uff06-\uff0c\uff0f\uff1a\uff1b\uff1d\uff1f\uff20\uff3b\uff3d]/g;

/**
 * A pattern that vets values produced by the named directives.
 * @type RegExp
 * @private
 */
soy.esc.$$FILTER_FOR_FILTER_CSS_VALUE_ = /^(?!-*(?:expression|(?:moz-)?binding))(?:[.#]?-?(?:[_a-z0-9-]+)(?:-[_a-z0-9-]+)*-?|-?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:[a-z]{1,2}|%)?|!important|)$/i;

/**
 * A pattern that vets values produced by the named directives.
 * @type RegExp
 * @private
 */
soy.esc.$$FILTER_FOR_FILTER_NORMALIZE_URI_ = /^(?:(?:https?|mailto):|[^&:\/?#]*(?:[\/?#]|$))/i;

/**
 * A pattern that vets values produced by the named directives.
 * @type RegExp
 * @private
 */
soy.esc.$$FILTER_FOR_FILTER_HTML_ATTRIBUTES_ = /^(?!style|on|action|archive|background|cite|classid|codebase|data|dsync|href|longdesc|src|usemap)(?:[a-z0-9_$:-]*)$/i;

/**
 * A pattern that vets values produced by the named directives.
 * @type RegExp
 * @private
 */
soy.esc.$$FILTER_FOR_FILTER_HTML_ELEMENT_NAME_ = /^(?!script|style|title|textarea|xmp|no)[a-z0-9_$:-]*$/i;

/**
 * A helper for the Soy directive |escapeHtml
 * @param {*} value Can be of any type but will be coerced to a string.
 * @return {string} The escaped text.
 */
soy.esc.$$escapeHtmlHelper = function(value) {
  var str = String(value);
  return str.replace(
      soy.esc.$$MATCHER_FOR_ESCAPE_HTML_,
      soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_);
};

/**
 * A helper for the Soy directive |normalizeHtml
 * @param {*} value Can be of any type but will be coerced to a string.
 * @return {string} The escaped text.
 */
soy.esc.$$normalizeHtmlHelper = function(value) {
  var str = String(value);
  return str.replace(
      soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_,
      soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_);
};

/**
 * A helper for the Soy directive |escapeHtmlNospace
 * @param {*} value Can be of any type but will be coerced to a string.
 * @return {string} The escaped text.
 */
soy.esc.$$escapeHtmlNospaceHelper = function(value) {
  var str = String(value);
  return str.replace(
      soy.esc.$$MATCHER_FOR_ESCAPE_HTML_NOSPACE_,
      soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_);
};

/**
 * A helper for the Soy directive |normalizeHtmlNospace
 * @param {*} value Can be of any type but will be coerced to a string.
 * @return {string} The escaped text.
 */
soy.esc.$$normalizeHtmlNospaceHelper = function(value) {
  var str = String(value);
  return str.replace(
      soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_NOSPACE_,
      soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_);
};

/**
 * A helper for the Soy directive |escapeJsString
 * @param {*} value Can be of any type but will be coerced to a string.
 * @return {string} The escaped text.
 */
soy.esc.$$escapeJsStringHelper = function(value) {
  var str = String(value);
  return str.replace(
      soy.esc.$$MATCHER_FOR_ESCAPE_JS_STRING_,
      soy.esc.$$REPLACER_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_);
};

/**
 * A helper for the Soy directive |escapeJsRegex
 * @param {*} value Can be of any type but will be coerced to a string.
 * @return {string} The escaped text.
 */
soy.esc.$$escapeJsRegexHelper = function(value) {
  var str = String(value);
  return str.replace(
      soy.esc.$$MATCHER_FOR_ESCAPE_JS_REGEX_,
      soy.esc.$$REPLACER_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_);
};

/**
 * A helper for the Soy directive |escapeCssString
 * @param {*} value Can be of any type but will be coerced to a string.
 * @return {string} The escaped text.
 */
soy.esc.$$escapeCssStringHelper = function(value) {
  var str = String(value);
  return str.replace(
      soy.esc.$$MATCHER_FOR_ESCAPE_CSS_STRING_,
      soy.esc.$$REPLACER_FOR_ESCAPE_CSS_STRING_);
};

/**
 * A helper for the Soy directive |filterCssValue
 * @param {*} value Can be of any type but will be coerced to a string.
 * @return {string} The escaped text.
 */
soy.esc.$$filterCssValueHelper = function(value) {
  var str = String(value);
  if (!soy.esc.$$FILTER_FOR_FILTER_CSS_VALUE_.test(str)) {
    return 'zSoyz';
  }
  return str;
};

/**
 * A helper for the Soy directive |normalizeUri
 * @param {*} value Can be of any type but will be coerced to a string.
 * @return {string} The escaped text.
 */
soy.esc.$$normalizeUriHelper = function(value) {
  var str = String(value);
  return str.replace(
      soy.esc.$$MATCHER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_,
      soy.esc.$$REPLACER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_);
};

/**
 * A helper for the Soy directive |filterNormalizeUri
 * @param {*} value Can be of any type but will be coerced to a string.
 * @return {string} The escaped text.
 */
soy.esc.$$filterNormalizeUriHelper = function(value) {
  var str = String(value);
  if (!soy.esc.$$FILTER_FOR_FILTER_NORMALIZE_URI_.test(str)) {
    return '#zSoyz';
  }
  return str.replace(
      soy.esc.$$MATCHER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_,
      soy.esc.$$REPLACER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_);
};

/**
 * A helper for the Soy directive |filterHtmlAttributes
 * @param {*} value Can be of any type but will be coerced to a string.
 * @return {string} The escaped text.
 */
soy.esc.$$filterHtmlAttributesHelper = function(value) {
  var str = String(value);
  if (!soy.esc.$$FILTER_FOR_FILTER_HTML_ATTRIBUTES_.test(str)) {
    return 'zSoyz';
  }
  return str;
};

/**
 * A helper for the Soy directive |filterHtmlElementName
 * @param {*} value Can be of any type but will be coerced to a string.
 * @return {string} The escaped text.
 */
soy.esc.$$filterHtmlElementNameHelper = function(value) {
  var str = String(value);
  if (!soy.esc.$$FILTER_FOR_FILTER_HTML_ELEMENT_NAME_.test(str)) {
    return 'zSoyz';
  }
  return str;
};

/**
 * Matches all tags, HTML comments, and DOCTYPEs in tag soup HTML.
 * By removing these, and replacing any '<' or '>' characters with
 * entities we guarantee that the result can be embedded into a
 * an attribute without introducing a tag boundary.
 *
 * @type {RegExp}
 * @private
 */
soy.esc.$$HTML_TAG_REGEX_ = /<(?:!|\/?([a-zA-Z][a-zA-Z0-9:\-]*))(?:[^>'"]|"[^"]*"|'[^']*')*>/g;

/**
 * Matches all occurrences of '<'.
 *
 * @type {RegExp}
 * @private
 */
soy.esc.$$LT_REGEX_ = /</g;

/**
 * Maps lower-case names of innocuous tags to 1.
 *
 * @type {Object.<string,number>}
 * @private
 */
soy.esc.$$SAFE_TAG_WHITELIST_ = {'b': 1, 'br': 1, 'em': 1, 'i': 1, 's': 1, 'sub': 1, 'sup': 1, 'u': 1};

// END GENERATED CODE
/**
 * Blockly Apps: Common code
 *
 * Copyright 2013 Google Inc.
 * http://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Common support code for Blockly apps.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

var BlocklyApps = {};

/**
 * Gets the message with the given key from the document.
 * @param {string} key The key of the document element.
 * @return {string} The innerHTML of the specified element,
 *     or an error message if the element was not found.
 */

BlocklyApps.getMsg = function(key) {
  var msg = BlocklyApps.getMsgOrNull(key);
  return msg === null ? '[Unknown message: ' + key + ']' : msg;
};
/**
 * Gets the message with the given key from the document.
 * @param {string} key The key of the document element.
 * @return {string} The innerHTML of the specified element,
 *     or null if the element was not found.
 */
BlocklyApps.getMsgOrNull = function(key) {
  var element = document.getElementById(key);
  if (element) {
    var text = element.innerHTML;
    // Convert newline sequences.
    text = text.replace(/\\n/g, '\n');
    return text;
  } else {
    return null;
  }
};
/**
 * Blockly Demo: Storage
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Loading and saving blocks with localStorage and cloud storage.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

// Create a namespace.
var BlocklyStorage = {};

/**
 * Backup code blocks to localStorage.
 * @private
 */

BlocklyStorage.backupBlocks_ = function() {
  if ('localStorage' in window) {
    var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    // Gets the current URL.
    var url = window.location.href;
    window.localStorage.setItem(url, Blockly.Xml.domToText(xml));
  }
};

/**
 * Restore code blocks from localStorage.
 */
BlocklyStorage.restoreBlocks = function() {
  var url = window.location.href;
  if ('localStorage' in window && window.localStorage[url]) {
    var xml = Blockly.Xml.textToDom(window.localStorage[url]);
    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
  }
};

/*
 * Migrates the cache to the new level.
 * To be called when a new level is unlocked.
 */
BlocklyStorage.migrateCache = function()
{
  if ('localStorage' in window && 'Code' in window) {
      var data = BlocklyStorage.getCurrentLevel(),
      progress = Number(data),
      url = window.location.href.split('#')[0];
      window.localStorage.setItem(url + '#project' + String(progress + 1), window.localStorage[url + '#project' + String(progress)]);
  }
};

/*
 * Migrates the cache from level migrateFrom to migrateTo.
 *
 */
BlocklyStorage.migrateCacheLevels = function(migrateFrom, migrateTo, max_number)
{
  if ('localStorage' in window && 'Code' in window) {
    var url = window.location.href.split('#')[0];
    migrateFrom = (migrateFrom < 1) ? 1 : migrateFrom;
    migrateTo = (migrateTo > max_number) ? max_number + 1 : migrateTo;
    window.localStorage.setItem(url + '#project' + String(migrateTo), window.localStorage[url + '#project' + String(migrateFrom)]);
  }
};

/*
 * Migrates the cache to the playground.
 * To be called on clicking the menu button and on passing a new level.
 */
 /*BlocklyStorage.migrateCacheToPlayground = function ()
{
  if ('localStorage' in window && 'Code' in window) {
    var urlProject = window.location.href;
    var url = window.location.href.split('#')[0];
    window.localStorage.setItem(url + '#playground', window.localStorage[urlProject]);
  }
};*/

/*
 * Gets current level from URL
 *
*/
BlocklyStorage.getCurrentLevel = function() {
  if ('localStorage' in window && 'Code' in window) {
    var projectString = window.location.href.split('#project')[1];
    return projectString;
  }
};

/*
 * Clears the storage for a project.
 * @param {int} project The project for which we want to clear.
 */
BlocklyStorage.clearProjectCache = function(project) {
  var url = window.location.href.split('#')[0];
  window.localStorage.removeItem(url + '#project' + project);
};
/**
*
* sound-fx.js
*
* Copyright (C) 2014 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Description: Sound FX Definitions.
*/

var Sound = {};

(function() {
'use strict';

Sound = function(file) {
    this.file = file;
};

Sound.prototype.play = function() {
    backend.call('play_sound', this.file, function() {
    });
};

})();


var SoundFX = {};

(function() {
'use strict';

SoundFX = {
    make     : new Sound('../../kano-media/sounds/kano_make.wav'),
    complete : new Sound('../../kano-media/sounds/kano_challenge_complete.wav'),
    block    : {
        grab    : new Sound('../../kano-media/sounds/blocks/kano_blocks_grab.wav'),
        release : new Sound('../../kano-media/sounds/blocks/kano_blocks_ungrab.wav')
    }
};

})();
/**
* Copyright (C) 2014 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Tom Bettany <tom.bettany@kano.me>
* Description: Commonly used utility functions
*/

var Utilities = {};

(function() {
'use strict';

/**
 * Converts an array of blocks into an array of block types.
 * @param  {block[]}   The blocks to be converted into types
 * @return {string[]}  The types of the given blocks
 */
Utilities.blocksToBlockTypes = function(blocks) {
    var blockInfo = Utilities.blocksToBlockInfo(blocks),
        types = [];

    for (var x = 0, len = blockInfo.length; x < len; x++) {
        types.push(blockInfo[x].Type);
    }

    return types;
};

Utilities.idToInputLabel = function(block, label) {
    var blockInfo = Utilities.blocksToBlockInfo([block], true);

    try {
        return blockInfo[0].labels[label];
    } catch (err) {
        return label;
    }
};

Utilities.blocksToBlockInfo = function(blocks, isChild) {
    var blockInfo = [],
        lst,
        item,
        row,
        block,
        id,
        label,
        val,
        parent,
        childrenNodes,
        dropdownInputsKeys = [
            'PLAYER',
            'VALUE',
            'OPERATORS',
            'CHAR',
            'DIRECTION',
            'COORD',
            'SPEED',
            'ITEM',
            'TYPE',
            'SOUNDS',
            'SOUND',
            'SCENE',
            'IMAGES'
        ],
        nestedBlocksTypes = [
            'controls_repeat_ext',
            'api_xyzPlugIn',
            'api_getBlock',
            'api_PostToChat',
            'setVariable',
            'api_sleep'
        ],
        childrenIDS = [];

    var isAChild = function(block_id) {
        return childrenIDS.indexOf(block_id) > -1 ? true : false;
    };

    //check if blocks is just an object
    if (!(blocks instanceof Array)) {
        blocks = [blocks];
    }

    for (var x = 0; x < blocks.length; x++) {

        //Check if block is an object and is not a child, so that children nodes are generated only inside their parent block
        if (typeof blocks[x] === 'object' && !isAChild (blocks[x].id)) {

            block = {
                id: blocks[x].id,
                Type: blocks[x].type,
                labels: {},
                inputs: {},
                hasDropdownInput: false
            };
            lst = blocks[x].inputList;

            if (lst) {

                for (var obj = 0, len = lst.length; obj < len; obj++) {
                    item = lst[obj];
                    row = lst[obj].titleRow;

                    // Attempt to stop blocks failing when sharing with a math_arithmetic block
                    if (row.length === 0 && item.name == 'A') {
                        // An input plug at the start of of logic boolean or a number arithmetuc block
                        id = item.name;
                        val = 'input';
                    } else if (row[0]) {
                        label = row[0].text_;

                        if (row.length === 2 || row.length === 3) {
                            // An input with a text box
                            label = row[0].text_;
                            id    = row[row.length - 1].name;
                            val   = row[row.length - 1].text_;

                            if (id === undefined) {
                                if (row[0].src_ && row[2].src_) {
                                    if (row[0].src_.indexOf('quote') !== -1
                                            && row[2].src_.indexOf('quote') !== -1) {  // String block with quotes
                                        id = row[1].name;
                                        val = row[1].text_;
                                        label=id;
                                    }
                                } else {  // Dropdown
                                    id = row[0].name;
                                    val = label;
                                    label = id;
                                }
                            }
                        } else {
                            if (item.name === '' && !row[0].name) {
                                // Not an input
                                continue;
                            }

                            id = row[0].name;
                            val = label;

                            if (id === undefined) {
                                // An input plug
                                id = item.name;
                                val = 'input';
                            } else {
                                // A text input
                                label = id;
                            }
                        }
                    }

                    block.labels[id] = label;
                    block.inputs[id] = val;
                }
            }

            //Getting info on the parent only if it is not a child
            if (blocks[x].parentBlock_ && !isChild){
                parent=[];
                parent.push(blocks[x].parentBlock_);
                block.parentBlock = Utilities.blocksToBlockInfo(parent);
            }

            if (nestedBlocksTypes.indexOf(blocks[x].type) > -1) {

                //Getting info on the children nodes, if any
                if (blocks[x].childBlocks_ && blocks[x].childBlocks_.length>0 ) {
                    childrenNodes=[];

                    for (var index in blocks[x].childBlocks_) {
                        childrenIDS.push(blocks[x].childBlocks_[index].id);
                        childrenNodes.push(blocks[x].childBlocks_[index]);
                    }

                    block.childBlocks = Utilities.blocksToBlockInfo(childrenNodes, true);
                }

            }


            // Check if has dropdown input
            for (var index in dropdownInputsKeys){

                if (dropdownInputsKeys[index] in blocks[x]) {
                    block.hasDropdownInput = true;
                    block.dropdownValuesKey = dropdownInputsKeys[index];
                }
            }

            blockInfo.push(block);
        }
    }
    return blockInfo;
};

/**
 * Retrieves list of blocks in the workspace
 * (from top to bottom with child blocks listed after their parents)
 * @param  {boolean}  sorted  Whether the blocks should be sorted from top to bottom
 * @return {blocks[]}         The blocks in the workspace
 */
Utilities.getBlocks = function(sorted, ignoreDefaults) {
    var steps = [],
        workspace,
        blocks;

    try {
        workspace = Blockly.mainWorkspace;
        blocks = workspace.getTopBlocks(sorted);
    } catch (e) {
        return [];
    }

    return Utilities.getChildChain(blocks, ignoreDefaults);
};

Utilities.getBlockFromId = function(id) {
   var blocks = Utilities.getBlocks(false, false);

    for (var x = 0, len = blocks.length; x < len; x++) {
        if (blocks[x].id === id) {
            return blocks[x];
        }
    }
};

Utilities.getChildChain = function(blocks, ignoreDefaults) {
    var blockChain = [],
        len        = blocks.length,
        children;

    if (len === 1 || len === undefined) {
        blocks = blocks[0] || blocks;
        blockChain.push(blocks);
        blockChain = blockChain.concat(Utilities.getChildChain(blocks.getChildren(), ignoreDefaults));
        return blockChain;
    }

    for (var x = 0; x < len; x++) {
        children = Utilities.getChildChain(blocks[x], ignoreDefaults);

        if (children.length > 0 && ignoreDefaults === true) {
            children = Utilities.removeDefaultChildren(blocks[x], children);
        }

        blockChain = blockChain.concat(children);
    }

    return blockChain;
};

Utilities.getBlocksInfo = function(sorted, ignoreDefaults) {
    return Utilities.blocksToBlockInfo(Utilities.getBlocks(sorted, ignoreDefaults));
};

Utilities.defaultChildBlocks = {};

Utilities.getDefaultChildBlocks = (function() {
    var parser,
        xmlToolbox,
        xmlBlocks,
        joinedBlocks,
        defaultChildBlocks = [];

    if (window.DOMParser) {
        parser = new DOMParser();
        xmlToolbox = parser.parseFromString(toolbox.playgroundunlockedtoolbox(), 'text/xml');
    }

    xmlBlocks = xmlToolbox.getElementsByTagName('block');
    for (var x = 0; x < xmlBlocks.length; x++) {
        joinedBlocks = {};

        joinedBlocks.parent = xmlBlocks[x].parentNode.parentNode.getAttribute('type');
        if (joinedBlocks.parent !== null) {
            joinedBlocks.child = xmlBlocks[x].getAttribute('type');

            defaultChildBlocks.push(joinedBlocks);
        }
    }

    Utilities.defaultChildBlocks = defaultChildBlocks;
})();

Utilities.isChildDefault = function(parent, child) {
    var families = Utilities.defaultChildBlocks;

    for (var x = 0; x < families.length; x++) {
        if (families[x].parent === parent && families[x].child === child) {
            return true;
        }
    }

    return false;
};

Utilities.removeDefaultChildren = function(parent, children) {
    var removedList = [],
        parentType = parent.type,
        child,
        childType;

    for (var x = 0; x < children.length; x++) {
        child = children[x];
        childType = child.type;

        if (!Utilities.isChildDefault(parentType, childType)) {
            removedList.push(child);
        }
    }

    return removedList;
};

/**
 * Retrieves an array of the block types within the workspace.
 * @param  {boolean}  sorted  Should the returned blocks be ordered?
 * @return {string[]}         Array of block types within the workspace
 */
Utilities.getBlocksTypes = function(sorted, ignoreDefaults) {
    var blocks = Utilities.getBlocks(sorted, ignoreDefaults);

    return Utilities.blocksToBlockTypes(blocks);
};

Utilities.blockTypeToName = function(type) {
    // Remove pong/api prefix
    type = type.replace('pong_', '');
    type = type.replace('api_', '');

    // Insert spaces between camelCase words
    type = type.replace(/([A-Z])/g, ' $1');

    // Convert _ and - to spaces
    type = type.replace(/[_-]/g, ' ');

    // Convert to title case
    type = Utilities.toTitleCase(type);

    return type;
};

Utilities.toTitleCase = function(str) {
    return str.replace(/\w\S*/g,
                       function(txt) {
                           return txt.charAt(0).toUpperCase() +
                                  txt.substr(1).toLowerCase();
                       });
};

Utilities.sanitise = function(str) {
    return str.replace(/[^a-z 0-9]+/gi, '');
};

Utilities.isMenu = function() {
    var href = location.href;

    if (href.indexOf('#project') === -1) {
        return true;
    } else {
        return false;
    }
};

Utilities.debug = function(block) {
    console.log(block);
};

if (!Array.prototype.last) {
    Array.prototype.last = function() {
        return this[this.length - 1];
    };
}

})();
/**
* Copyright (C) 2014 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Tom Bettany <tom.bettany@kano.me>
* Description: A class to group elements from selectors to apply attributes and use methods to them all.
*/

var ElementGroup = {};

(function() {
'use strict';

ElementGroup = function(selector) {
    var selectors = selector.split('|');

    this.elements = [];

    for (var x = 0, len = selectors.length; x < len; x++) {
        this.elements.push.apply(this.elements, document.querySelectorAll(selectors[x]));
    }
};

ElementGroup.prototype.setAttr = function(attr, value) {
    for (var x = 0, len = this.elements.length; x < len; x++) {
        try {
            this.elements[x][attr] = value;
        } catch (e) {
            console.log('ERROR while attempting to set ', this.elements[x], '.' + attr + ' = ' + value, 'Resulting error ', e);
        }
    }
};

ElementGroup.prototype.addEventListener = function(type, listener, useCapture) {
    for (var x = 0, len = this.elements.length; x < len; x++) {
        try {
            this.elements[x].addEventListener(type, listener, useCapture);
        } catch (e) {
            console.log('ERROR while attempting to add event listener to ' + this.elements[x], 'Resulting error ', e);
        }
    }
};

ElementGroup.prototype.removeEventListener = function(type, listener, useCapture) {
    for (var x = 0, len = this.elements.length; x < len; x++) {
        try {
            this.elements[x].removeEventListener(type, listener, useCapture);
        } catch (e) {
            console.log('ERROR while attempting to remove event listener from ' + this.elements[x], 'Resulting error ', e);
        }
    }
};

ElementGroup.prototype.classList_add = function(className) {
    for (var x = 0, len = this.elements.length; x < len; x++) {
        try {
            this.elements[x].classList.add(className);
        } catch (e) {
            console.log('ERROR while attempting to add class ' + className + ' to ' + this.elements[x], 'Resulting error ', e);
        }
    }
};

ElementGroup.prototype.classList_remove = function(className) {
    for (var x = 0, len = this.elements.length; x < len; x++) {
        try {
            this.elements[x].classList.remove(className);
        } catch (e) {
            console.log('ERROR while attempting to remove class ' + className + ' from ' + this.elements[x], 'Resulting error ', e);
        }
    }
};

})();
/**
* Copyright (C) 2014 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Tom Bettany <tom.bettany@kano.me>
* Description: Stores data about stats.
*/

var Stats = {};

(function() {
'use strict';

Stats.update = function(code) {
    var getBlocksAdded = function() {
        var workspace = Blockly.mainWorkspace,
            blocks    = workspace.getAllBlocks();

        return blocks.length;
    };

    var getMakes = function() {
        return 1;
    };

    var getCodeLinesAddCount = function(newCode) {
        if (typeof(newCode) === 'undefined') {
            return 0;
        }

        var newLineCount;

        backend.call('count_new_lines_of_code', newCode,
                     function(return_value) {
                        newLineCount = return_value;
                     });

        return newLineCount;
    };

    // Save to profile.
    backend.call('update_stats', getBlocksAdded(),
                 getMakes(), getCodeLinesAddCount(code));
};

})();
/**
* Copyright (C) 2014 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Tom Bettany <tom.bettany@kano.me>
* Description: A class to handle challenges.
*/

var Challenge = {};

(function() {
'use strict';

Challenge = function(data, shared) {
    if (typeof(data) !== 'undefined') {
        this.import(data);
    } else {
        var emptyXML = '<xml>' +
                           '<filename> </filename>' +
                           '<description> </description>' +
                           '<blocks> </blocks>' +
                           '<tutorial> </tutorial>' +
                           '<shared>false</shared>' +
                           '<screenshot> </screenshot>' +
                       '</xml>';

        this.xmlData = new DOMParser().parseFromString(emptyXML, 'text/xml');
        this.setShared(shared);
        this.setDataFromForm();
    }
};

/**
 * Imports challenge data into the object.
 * @param {string/XML DOM} data  XML defining a challenge
 */
Challenge.prototype.import = function(data) {
    if (typeof data === 'xml') {
        this.xmlData = data;
    } else {
        try {
            this.xmlData = Blockly.Xml.textToDom(data);
        } catch (e) {
            alert('Error parsing XML:\n' + e);
        }
    }
};

/**
 * Exports challenge data from the object.
 * @return {string}  XML defining a challenge
 */
Challenge.prototype.export = function() {
    return Blockly.Xml.domToText(this.xmlData);
};

/**
 * Retrieves the XML stored in the object.
 * @return {XML DOM}  XML defining a challenge
 */
Challenge.prototype.getXML = function() {
    return this.xmlData;
};

/**
 * Retrieves the blocks stored in the object
 * @return {XML DOM}  XML defining some blocks
 */
Challenge.prototype.getBlocks = function() {
    var blocks = this.xmlData.getElementsByTagName('blocks')[0].childNodes[0].nodeValue;

    return Blockly.Xml.textToDom(blocks);
};

/**
 * Retrieves the filename stored in the object
 * @return {string}  The filename
 */
Challenge.prototype.getFilename = function() {
    var filename = this.xmlData.getElementsByTagName('filename')[0].childNodes[0].nodeValue;

    return filename.replace(/[^0-9 a-z]+/gi, ' ');
};

/**
 * Retrieves the description stored in the object.
 * @return {string}  The description
 */
Challenge.prototype.getDescription = function() {
    return this.xmlData.getElementsByTagName('description')[0].childNodes[0].nodeValue;
};

/**
 * Retrieves the screenshot stored in the object.
 * @return {string}  The screenshot encoded as ASCII
 */
Challenge.prototype.getScreenshot = function() {
    return this.xmlData.getElementsByTagName('screenshot')[0].childNodes[0].nodeValue;
};

/**
 * Retrieves the tutorial stored in the object.
 * @return {string}  The steps of the tutorial
 */
Challenge.prototype.getTutorial = function() {
    return this.xmlData.getElementsByTagName('tutorial')[0].childNodes[0].nodeValue;
};

/**
 * Retrieves whether the challenge has been shared.
 * @return {boolean}  Has the challenge been shared
 */
Challenge.prototype.getShared = function() {
    return JSON.parse(this.xmlData.getElementsByTagName('shared')[0].childNodes[0].nodeValue);
};

/**
 * Sets the blocks stored in the object
 * @param {XML DOM}  XML defining some blocks
 */
Challenge.prototype.setBlocks = function(blocks) {
    blocks = Blockly.Xml.domToText(blocks);
    this.xmlData.getElementsByTagName('blocks')[0].childNodes[0].nodeValue = blocks;
};

/**
 * Sets the filename stored in the object
 * @param {string}  The filename
 */
Challenge.prototype.setFilename = function(filename) {
    this.xmlData.getElementsByTagName('filename')[0].childNodes[0].nodeValue = Utilities.sanitise(filename);
};

/**
 * Sets the description stored in the object.
 * @param {string}  The description
 */
Challenge.prototype.setDescription = function(description) {
    this.xmlData.getElementsByTagName('description')[0].childNodes[0].nodeValue = description;
};

/**
 * Sets the screenshot stored in the object.
 * @param {string}  The screenshot encoded as ASCII
 */
Challenge.prototype.setScreenshot = function(screenshot) {
    //this.xmlData.getElementsByTagName('screenshot')[0].childNodes[0].nodeValue = screenshot;
    this.xmlData.getElementsByTagName('screenshot')[0].childNodes[0].nodeValue = '';
};

/**
 * Sets the tutorial stored in the object.
 * @param {string}  The steps of the tutorial
 */
Challenge.prototype.setTutorial = function(tutorial) {
    this.xmlData.getElementsByTagName('tutorial')[0].childNodes[0].nodeValue = tutorial;
};

/**
 * Sets whether the challenge has been shared.
 * @param {boolean}  Has the challenge been shared
 */
Challenge.prototype.setShared = function(shared) {
    if (shared) {
        this.xmlData.getElementsByTagName('shared')[0].childNodes[0].nodeValue = shared;
    }
};

/**
 * Sets the data in the object from the workspace and form inputs.
 */
Challenge.prototype.setDataFromForm = function() {
    var screenshot = document.getElementsByClassName('screenshot')[0].src.split('?')[0],
        xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace),
        self = this,
        save_type = this.getShared() ? 'share' : 'save';

    this.setBlocks(xml);

    // Get a timestamped share filename prefix in the form: share20160918224589
    // keep in mind that special characters like underscores are stripped later on.
    var d = new Date();
    var timestamp_filename="share" + d.getFullYear() + d.getMonth() + d.getDay() +
        d.getHours() + d.getMinutes() + d.getSeconds();

    this.setFilename(document.getElementById('filename_' + save_type).value || timestamp_filename);
    this.setDescription(document.getElementsByClassName('description')[0].value);
    this.setTutorial(Steps.generateSteps());

    backend.call('read_image',
                 // Strip off the 'file://' prefix
                 screenshot.substring(7, screenshot.length),
                 function(data) {
                     self.setScreenshot(data);
                 });
};

})();
/**
* Copyright (C) 2014 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Team Kano <team-software@kano.me>
* Description: IO operations
*/

var IO = {};

(function() {
'use strict';

/**
* Save blocks to cache.
*
* The following added to Code.init is ideal but is slow on the Pi. Instead
* we will cache when the Make, Save and Ship buttons are pressed.
*   document.getElementById('content_blocks').addEventListener('mouseup', Code.cache, false);
*/
IO.cache = function() {
    if ('BlocklyStorage' in window) {
        BlocklyStorage.backupBlocks_();
    }
};

IO.form = {
    /*
     * Migrates the share form contents to the save form.
     */
    migrate : function() {
        var screenshot = document.getElementsByClassName('screenshot'),
            filename = document.getElementsByClassName('filename'),
            description = document.getElementsByClassName('description');

        screenshot[0].src = screenshot[1].src;
        filename[0].value = filename[1].value;
        description[0].value = description[1].value;
    },
    addListeners : function() {
        new ElementGroup('.filename').addEventListener('input', IO.form.validateInputs, false);
    },
    removeListeners : function() {
        new ElementGroup('.filename').removeEventListener('input', IO.form.validateInputs, false);
    },
    validateInputs : function(event) {
        var caller      = event.target || event.srcElement,
            callerText  = caller.value,
            buttons     = new ElementGroup('div.dialog.save button.launch|div.dialog.share button.launch');

        if (Utilities.sanitise(callerText) === '') {
            buttons.setAttr('disabled', true);
            buttons.classList_add('disabled');
        } else {
            buttons.setAttr('disabled', false);
            buttons.classList_remove('disabled');
        }
    }
};

/**
 * Save blocks and upload them to Kanuxbox
 */
IO.shipBlocks = function() {
    IO.form.migrate();

    var challenge = new Challenge(),
        filename  = challenge.getFilename();

    IO.save.XML(true);

    backend.call('ship', filename, function(returnValue) {
        if (returnValue !== 0) {
            window.location.hash = '#loadFileFail';
            AlertsMessages.error.displayMsg(Language.alert.shareFail);
        } else {
            AlertsMessages.success.displayMsg(Language.alert.share);
        }
    });

    location.hash = '#menu';
};

/**
 * Save blocks to local file.
 * @param {boolean}  Is the file being shared?
 */
IO.save = {
    XML : function(shared, loadChallenge) {
        var challenge = new Challenge(undefined, shared),
            filename  = challenge.getFilename();

        challenge.setShared(shared);
        if (Project.advancedModeEnabled) {
            IO.save.advancedMode("share", filename);
        }

        if (loadChallenge === true) {
            IO.loadedChallenge = challenge;
        }
        // Create a request to save the code
        backend.call('save_challenge', filename, challenge.getDescription(), challenge.export(), function(res) {
            if (res == 1) {
                AlertsMessages.success.displayMsg(Language.alert.save);
            }
        });

        Code.closeMenu();
    },
    advancedMode : function(save_type, filename) {
        var code     = CodePreview.advancedMode.getCode();

        filename = filename || document.getElementById('filename_save').value;

        backend.call('save', filename + '.py', code,
            function(){
            });

        Code.closeMenu();
    }
};

IO.loadedChallenge = {};

IO.load = {
    inject : {
        blocks : {
            dialog : function(challenge, skipWarning) {
                Project.switch(Project.challenge.count + 1);

                if (skipWarning) {
                    Blockly.mainWorkspace.clear();
                    IO.load.inject.blocks.onWorkspace(challenge);
                } else {
                    window.location.hash = '#loadMakeOrPlay';
                }
            },
            onWorkspace : function(challenge) {
                //Since we are interested on just pushing the blocks, do not show the tooltips
                if (Project.tooltip) {
                    try {
                        Project.tooltip.setShown(false);
                    } catch (e) {
                        // Just means that the user hasn't visited a project with a tooltip yet.
                    }
                }
                Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, challenge.getBlocks());
                backend.call('on_web_load', function() {});
            },
        },
        steps : {
            dialog : function(challenge) {
                var count;

                Project.switch(Project.challenge.count + 1);

                count = Blockly.mainWorkspace.getAllBlocks().length;
                if (count) {
                    window.location.hash = "#clearBlocksLoadStepsDialog";
                } else {
                    IO.tooltip.display(challenge);
                }

                backend.call('on_web_load', function() {});
            }
        },
        advancedMode : {
            onWorkspace : function(code) {
                Project.switch(Project.challenge.count + 1);

                CodePreview.advancedMode.setCode(code);
            }
        }
    },

    file : {
        local : {
            XML : function(defaultDir) {
                backend.call('chooseFile', defaultDir, function(filename) {
                    if (filename !== '') {
                        backend.call('readFile', filename, function(xmlString) {
                            IO.loadedChallenge = new Challenge(xmlString);
                            IO.load.inject.blocks.dialog(IO.loadedChallenge);
                        });
                    } else {
                        location.hash = '#menu';
                    }
                });
            },
            XMLfromFilename : function(filename) {
                Project.switch(Project.challenge.count + 1);

                backend.call('readFile', filename, function(xmlString) {
                    IO.loadedChallenge = new Challenge(xmlString);
                    IO.load.inject.blocks.dialog(IO.loadedChallenge);
                });
            },
            python : function(defaultDir) {
                backend.call('chooseFile', defaultDir, '{"py": "Code Files"}', function(filename) {
                    if (filename !== '') {
                        backend.call('readFile', filename, function(pythonString) {
                            IO.load.inject.advancedMode.onWorkspace(pythonString);
                        });
                    } else {
                        location.hash = '#menu';
                    }
                });
            }
        },
        remote : {
            XML : function() {
                // Feedback
                var loadButtons = new ElementGroup('div.dialog.loadSource div div.top button');
                loadButtons.setAttr('disabled', true);

                setTimeout(function() {
                    backend.call('web_load', function(xmlString) {
                        if (xmlString !== null) {
                            IO.loadedChallenge = new Challenge(xmlString);
                            IO.load.inject.blocks.dialog(IO.loadedChallenge);
                        } else {
                            location.hash = '#menu';
                        }
                    });

                    loadButtons.setAttr('disabled', false);
                }, 100);
            },
            python : function() {
                backend.call('web_load', function(pythonString) {
                    if (pythonString !== null) {
                        IO.load.inject.advancedMode.onWorkspace(code);
                    } else {
                        location.hash = '#menu';
                    }
                });
            }
        }
    }
};

IO.tooltip = {
    tooltip : {},
    display : function(challenge) {
        IO.tooltip.tooltip = new Tooltip(challenge.getTutorial(),
                                         '<div class=\'tip\'><img src=\'../../kano-blocks/blockly/media/1x1.gif\' class=\'hint-icon hint\'><p class=\'hintlabel\'>',
                                         '</p></div>');
        IO.tooltip.tooltip.displayProject(1);
    }
};

IO.screenshot = {
    src : '',
    updateSrc : function() {
        IO.screenshot.src = '/tmp/screenshot.png';
    },
    refreshElements : function() {
        if (IO.screenshot.src === '') {
            // No screenshot taken yet, don't bother updating.
            return;
        }

        var screenshotElements = new ElementGroup('.screenshot');

        // Trick to make the screenshot refresh.
        screenshotElements.setAttr('src', IO.screenshot.src + "?v=" + Date());
    }
};

})();
/**
 * Blockly Apps: Code
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview JavaScript for Blockly's Code application.
 * @author fraser@google.com (Neil Fraser)
 */

(function() {
  document.addEventListener(
    'keydown',
    function(evt) {
      if (evt.keyCode === 27) {
          Code.closeMenu();
      }
    },
    false
  );
})();

var SUPPORTED_LOCALES = [
  'en',
  'en-QQ',
  'es-AR',
];

function getLanguage() {
  var language = window.navigator.languages ? window.navigator.languages[0] :
    window.navigator.userLanguage || window.navigator.language || 'en',
    p = language.indexOf('-');

  language = language.toLowerCase();

  // check if full locale is supported
  if (SUPPORTED_LOCALES.indexOf(language) > -1) {
    return language;
  }

  // otherwise check that if just the language is supported
  language = (p > -1) ? language.substr(0, p) : language;
  if (SUPPORTED_LOCALES.indexOf(language) > -1) {
    return language;
  }
  // language is not supported so default to 'en'
  return 'en';
}

// Supported languages.
BlocklyApps.LANGUAGES = {
  // Format: ['Language name', 'direction', 'XX_compressed.js']
  'en': ['English', 'ltr', '../generated/en_compressed.js'],
  'en-QQ': ['English QA', 'ltr', '../generated/en-QQ_compressed.js'],
  'es-AR': ['Spanish', 'ltr', '../generated/es-AR_compressed.js']
};
BlocklyApps.LANG = getLanguage();

/**
 * Create a namespace for the application.
 */
var Code = {};

(function() {
'use strict';

Code.close_window = function() {
  IO.cache();
  Stats.update();
  backend.call('exit');
};

/**
* Enables buttons.  Pass string of button ID
*/
Code.enableButton = function(buttonName) {
  var button = document.getElementById(buttonName);
  button.classList.remove('locked');
  button.disabled = false;
};

/**
* Disables buttons.
*/
Code.disableButton = function(buttonName) {
  var button = document.getElementById(buttonName);
  button.classList.add('locked');
  button.disabled = true;
};

/**
 * Discard all blocks from the workspace.
 */
Code.discard = function() {
    Blockly.mainWorkspace.clear();
    if (Project.getLastVisited() < Project.NUMBER) {
        Project.tooltip.displayProject(Project.getLastVisited());
    }

    if ('CodePreview' in window) {
        CodePreview.advancedMode.reset();
    }
};

/**
 * Shows alert asking user if they want to delete all the blocks on the workspace
 */
Code.confirmDiscard = function () {
    var count = Blockly.mainWorkspace.getAllBlocks().length,
        message = BlocklyApps.getMsg('Code_discard').replace('%1', count),
        heading = document.querySelector('#discardDialog>div>div.discardElements>div.top>div.heading');

    // Custom message dictating number of blocks created
    if (count >= 2) {

        // Find HTML element that contains heading of the dialog box
        heading.innerHTML = message;
        window.location.hash = '#discardDialog';

    } else {
        Code.discard();
    }
};

/*
 * Takes the user back to the Menu screen with the list of levels.
 * Used for Menu button.
 */
Code.goToMenu = function() {
    IO.cache();
    //BlocklyStorage.migrateCacheToPlayground();
    window.location.hash = '#menu';
    $('#menu').click(function(e) {
        if($(e.target).parents('#menucontainer').length == 0) {
            Code.closeMenu();
        }
    });
    $('#loadSource').click(function(e) {
        if($(e.target).parents('#loadSourceContainer').length == 0) {
            window.location.hash = '#menu';
        }
    });
    $('#shareDialog').click(function(e) {
        if($(e.target).parents('#share').length == 0) {
            window.location.hash = '#menu';
        }
    });
    $('#saveDialog').click(function(e) {
        if($(e.target).parents('#save').length == 0) {
            window.location.hash = '#menu';
        }
    });
};

/*
 * Fade out text or image.
 * @param {string} id The id of the element
 */
Code.fadeOut = function(id) {
  $('#' + id).fadeOut('slow');
};

/*
 * Make message appear, then wait 5 seconds and make it fade out again.
 * @param {string} id The id of the element
 * @param {string} message The message we want displayed to the screen
 */
Code.timeOut = function(id, message) {
  document.getElementById(id).innerHTML = message;
  $('#' + id).fadeIn('slow');
  var timer = setTimeout(
      function() {
          Code.fadeOut(id);
      }, 8000);
};

/*
 * When window is in focus, clickMe message will be displayed
 */
Code.onFocus = function() {
  $(window).focus(function() {
    $('#clickMeAlert').fadeOut(1000);
  });
};

/*
 * When window is in out of focus, clickMe message will be hidden
 */
Code.onBlur = function() {
  $(window).blur(function() {
    $('#clickMeAlert').fadeIn(1000);
  });
};

Code.tutorial = true;

Code.tutorial_toggle = function() {
  Code.tutorial = !Code.tutorial;
};

Code.closeMenu = function() {
    if (Utilities.isMenu()) {
        var level = Project.getLastVisited();

        Project.switch(level);
        try {
            Project.tooltip.setShown(Code.tutorial);
        } catch (e) {
        }
    }
};

/**
 * Common functionality for replay
 */
Code.replay = function() {
  var level = Project.getLastVisited();

  setTimeout(
      function() {
          Project.tooltip.displayProject(level);
          Project.tooltip.setShown(Code.tutorial);
          AlertsMessages.levelDone.displayMsg(Language.alert.finishedLevel);
      },
      0);
};

})();
/**
* Copyright (C) 2015 Kano Computing Ltd
* License: GNU GPL v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Tom Bettany <tom.bettany@kano.me>
* Description: A class to store the state of the workspace
*/

var WorkspaceState = {};

(function() {
'use strict';

WorkspaceState = function(args) {
    if (args.event) {
        this._parse_event(args.event);
    } else {
        this.event_type = args.event_type || '';
        this.event_params = args.event_params || '';
    }

    this.tip_message = args.tip_message || '';
    this.position = args.position || '';
    this.direction = args.direction || '';
    this.progressor = args.progressor || '';
    this.progressor_tree = args.progressor_tree || [];
    this.selected_id = args.selected_id || [];
};

WorkspaceState.prototype._parse_event = function(selector) {
    var split_selector = selector.split('+');

    this.event_type = split_selector[0];
    this.event_params = split_selector.slice(1);

    this._parse_event_params(this.event_params);
};

WorkspaceState.prototype._parse_event_params = function(event_params) {
    switch (this.event_type) {
    case 'buttonPress':
        this.button = event_params[0];
        break;
    case 'blockAdd':
        this.block = event_params[0];
        break;
    case 'blockConnect':
        this.parent = event_params[0];
        this.child = event_params[1];
        break;
    case 'dropdownInputChange':
        this.field = event_params[0];
        // Consider as the plus operator if the value is not set,
        // since the splitting of the attributes is on the plus itself
        this.value = event_params[1] || '+';

        break;
    case 'colourInputChange':
        this.field = event_params[0];

        break;
    case 'textInputChange':
        var op;

        if (event_params.length === 3) {
            this.parent = event_params[0];
            event_params.splice(0, 1);
        }

        this.field = event_params[0];
        op = event_params[1].match(/^[!==<>]{1,3}/);

        if (op) {
            this.operator = op[0];
            this.value = event_params[1].substring(this.operator.length);
        } else {
            this.operator = '===';
            this.value = event_params[1];
        }

        break;
    }
};

})();

/**
* Copyright (C) 2015 Kano Computing Ltd
* License: GNU GPL v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Tom Bettany <tom.bettany@kano.me>
* Description: A class to handle the historical states of the workspace
*/

var WorkspaceHistory = {};

(function() {
'use strict';

WorkspaceHistory = function(params) {
    this.step_count = params.step_count || 1;

    var events = params.events || [],
        tip_messages = params.tip_messages || [],
        positions = params.positions || [],
        directions = params.directions || [],
        progressors = params.progressors || [];

    this.steps = [];
    for (var i = 0; i < this.step_count; i++) {
        this.steps.push(new WorkspaceState({
            event: events[i],
            tip_message: tip_messages[i],
            position: positions[i],
            direction: directions[i],
            progressor: progressors[i]
        }));
    }
};

WorkspaceHistory.prototype._save_workspace = function(current_step_idx) {
    this.get(current_step_idx).workspace = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace, true);
};

WorkspaceHistory.prototype._migrate_mutables = function(current_step_idx) {
    var current_step = this.get(current_step_idx),
        next_step = this.get(current_step_idx + 1);

    // '.slice()' to create a copy rather than a reference to the original
    if (next_step) {
        next_step.selected_id = current_step.selected_id.slice();
        next_step.progressor_tree = current_step.progressor_tree.slice();
    }
    
};

WorkspaceHistory.prototype.save = function(idx) {
    this._save_workspace(idx);
    this._migrate_mutables(idx);
};


WorkspaceHistory.prototype._load_workspace = function(current_step_idx) {
    Blockly.mainWorkspace.clear();
    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace,
                               this.get(current_step_idx).workspace);
};

WorkspaceHistory.prototype.restore = function(idx) {
    this._load_workspace(idx);
};

WorkspaceHistory.prototype.get = function(idx) {
    return this.steps[idx - 1];
};

})();
/**
* Copyright (C) 2015 Kano Computing Ltd
* License: GNU GPL v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Tom Bettany <tom@kano.me>
* Description: A class to handle the progress bar
*/

var ChallengeProgressBar = {};

(function() {
'use strict';

ChallengeProgressBar = function(params) {
    this.max_steps = params.max_steps || 1;
    this.furthest_step = 1;

    this._progress_bar = document.querySelector('.toolbar .progressBar');
    this._progress_done_bar = this._progress_bar.querySelector('.progressDoneBar');
    this._current_step_label = this._progress_bar.querySelector('.currentStep');

    this._max_step_indicator = this._progress_bar.querySelector('.maxStepsIndicator');
    this._max_step_icon = this._max_step_indicator.querySelector('.icon');
    this._max_step_label = this._max_step_indicator.querySelector('.maxSteps');

    this.undoButton = document.querySelector('.stepsNavigation .previousStep');
    this.redoButton = document.querySelector('.stepsNavigation .nextStep');

    if (params.disabled) {
        this.disable();
        return;
    } else {
        this.enable();
    }

    this._max_step_label.innerHTML = this.max_steps;

    this.update(1);
};

ChallengeProgressBar.prototype.disable = function() {
    this._update_progress_bar(this.max_steps);
    this.redoButton.disabled = true;
    this.undoButton.disabled = true;
    this._max_step_label.style.display = 'none';
};

ChallengeProgressBar.prototype.enable = function() {
    this._max_step_label.style.display = '';
};

ChallengeProgressBar.prototype.update = function(current_step) {
    this._update_progress_bar(current_step);
    this._update_furthest_step(current_step);
    this._update_navigation_buttons(current_step);
    this._current_step_label.innerHTML = current_step;
};

ChallengeProgressBar.prototype._update_progress_bar = function(current_step) {
    var progress = 100 * (current_step - 1) / (this.max_steps - 1),
        progress_width;

    this._progress_bar.classList.remove('complete');
    this._max_step_icon.classList.remove('lightning');
    this._max_step_icon.classList.add('greyLightning');

    this._max_step_indicator.style.display = '';
    switch(isNaN(progress) || progress) {
    case 0:
        progress_width = '15px';
        break;
    case 100:
    case true:
        progress_width = '100%';
        this._progress_bar.classList.add('complete');
        this._max_step_icon.classList.remove('greyLightning');
        this._max_step_icon.classList.add('lightning');
        break;
    default:
        progress_width = progress + '%';
    }

    this._progress_done_bar.style.width = progress_width;
};

ChallengeProgressBar.prototype._update_furthest_step = function(current_step) {
    this.furthest_step = Math.max(current_step, this.furthest_step);
};

ChallengeProgressBar.prototype._update_navigation_buttons = function(current_step) {
    this.redoButton.disabled = (current_step >= this.furthest_step);
    this.undoButton.disabled = (current_step <= 1);
};

ChallengeProgressBar.prototype.reset_furthest_step = function(new_furthest) {
    this.furthest_step = new_furthest;
    this._update_navigation_buttons(new_furthest);
};

})();
/**
* Copyright (C) 2014 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Tom Bettany <tom.bettany@kano.me>
* Description: A class to create and cycle through tutorial messages
*/

var Pointer = {};

(function() {
'use strict';

/**
 * A class to create and cycle through tutorial messages with
 * @param selector          The selector of the containing element to be directed
 * @param content           An array of content to be displayed
 *                            Can be formatted with HTML
 *                            e.g. ["First message", "Second message"]
 * @param position          An array of positions.
 *                            Can take the form of a list of selectors or coordinates for the display
 *                            Inserting a "hide" element will hide the tutorial for that step.
 *                            e.g. [["100px","100px"],"myselector",["200px","150px"],"hide"]
 * @param direction         An array of directions
 *                            r  for the message to appear to the left
 *                            u  for the message to appear beneath
 *                            l  for the message to appear to the right
 *                            d  for the message to appear above
 *                      [other]  message will appear at the bottom.
 *                            e.g. ['u', 'd', 'l', 'l', 'r']
 * @param progressSelector  An array of selectors which will be used to trigger progress through the steps
 *                            e.g. ["selector1","selector2"]
 */
Pointer = function(selector, content, position, direction, progressSelector) {

    // Validate inputs.
    if (content.length !== direction.length
        || content.length !== position.length
        || content.length !== progressSelector.length) {
        console.log('The length of the content, position, direction and '
                    + 'progress selector arrays must be the same.');
        return -1;
    }

    // Initialization variables
    this.selector = document.getElementById(selector);
    this.shown = true;

    // Computed values
    this.currentStep = 1;
    this.maxSteps = content.length;

    this.progress_bar = new ChallengeProgressBar({
        max_steps: this.maxSteps
    });

    this.workspace_history = new WorkspaceHistory({
        step_count: this.maxSteps,
        events: progressSelector,
        tip_messages: content,
        positions: position,
        directions: direction,
        progressors: progressSelector
    });

    var self = this;

    try {
        // Make sure that we can't see the tutorial in playground mode.
        document.getElementById('playground')
                .addEventListener('click',
                                  function() {
                                      self.hide();
                                  },
                                  false);
    } catch (e) {

    }

    this.addListeners();

    this.draw();
};

Pointer.prototype.getStep = function(offset) {
    offset = offset || 0;

    return this.workspace_history.get(this.currentStep + offset);
};

Pointer.prototype.addListeners = function() {
    var self = this;

    var blockAddHandler = function(evt) {
        self._reset_furthest_step();

        if (self.getStep().event_type !== 'blockAdd') {
            return;
        }

        var block = evt.blocksChanged.type;

        for (var x = 0, len = block.length; x < len; x++) {
            if (block === self.getStep().progressor_tree[x]) {
                //check if the following step suggests to set an already selected value
                skipStepIfDefaultValue(evt.blocksChanged);
                self.showNext();

                return;
            }
        }



        self.showPrevious();
    };

    var skipStepIfDefaultValue = function (block) {
        var nextStep = self.getStep(1);
                if (nextStep.event_type === 'dropdownInputChange') {
                    var info_block = Utilities.blocksToBlockInfo(block)[0];
                    var default_value = info_block.inputs[info_block.dropdownValuesKey];
                    if (default_value === nextStep.value) {
                        self.showNext();
                    }
                }
                return;
    };

    var flyoutCloseHandler = function() {
        if (self.getStep().event_type !== 'blockAdd' || self.currentStep === self.maxSteps) {
            return;
        }

        setTimeout(
            function() {
                self.showPrevious();
            }, 100);
    };

    var textInputChangeHandler = function(evt) {
        self._reset_furthest_step();

        var operator;
        var objectToCompare;

        if (self.getStep().event_type !== 'textInputChange') {
            return;
        }

        var change = evt.blocksChanged,
            block = change.sourceBlock_,
            fieldName = change.name,
            fieldText = change.text_;

        if (self.getStep().parent) {
            // We don't want to change the previous block added
            self.getStep().progressor_tree.push(self.getStep().parent);
        }

        for (var i = 0, len = self.getStep().progressor_tree.length; i < len; i++) {

            if (block.type === self.getStep().progressor_tree[i]) {
                if (fieldName === self.getStep().field && fieldText.length > 0) {
                    // I don't see a way around eval without having a case for each operation :-(
                    if (eval('"' + fieldText + '"' + self.getStep().operator + '"' + self.getStep().value + '"')) {
                        self.showNext();
                        return;
                    }
                }
            }
        }
    };

    var dropdownInputChangeHandler = function(evt) {
        self._reset_furthest_step();

        if (self.getStep().event_type !== 'dropdownInputChange') {
            return;
        }

        var change = evt.blocksChanged,
            block = change.sourceBlock_,
            dropdownText = change.value_;

        for (var i = 0, len = self.getStep().progressor_tree.length; i < len; i++) {
            if (block.type === self.getStep().progressor_tree[i]) {
                if (dropdownText === self.getStep().value) {
                    self.showNext();
                    return;
                }
            }
        }
    };

    var colourInputChangeHandler = function(evt) {
        self._reset_furthest_step();

        if (self.getStep().event_type !== 'colourInputChange') {
            return;
        }

        var change = evt.blocksChanged,
            block = change.sourceBlock_;

        for (var i = 0, len = self.getStep().progressor_tree.length; i < len; i++) {
            if (block.type === self.getStep().progressor_tree[i]) {
                self.showNext();
                return;
            }
        }
    };

    var blockConnectHandler = function(evt) {
        self._reset_furthest_step();

        if (self.getStep().event_type !== 'blockConnect') {
            return;
        }

        // Blocks sent by the blockConnect event
        var change = evt.blocksChanged;

        // Check the blocks sent by the blockConnect event are the same as the ones
        // listed in the tutorial
        if (change[0].type == self.getStep().parent
            && change[1].type == self.getStep().child) {

            self.showNext();
            return;
        }
    };

    var blockMouseReleaseHandler = function(evt) {
        self._reset_furthest_step();

        var block = evt.blocksChanged,
            id = block.id,
            type = Utilities.getBlockFromId(id).type;

        if (self.getStep().progressor_tree[0] === type
            && (self.getStep().selected_id.length === 0
                || Utilities.getBlockFromId(self.getStep().selected_id.last()).type !== type)) {

                self.getStep().selected_id.push(id);
        }
    };

    var blockOrphanedHandler = function(evt) {
        var currentStep = self.getStep() || {},
            currentBlockType = currentStep.child,
            orphanedBlockType = evt.blocksChanged;

        if (currentBlockType === orphanedBlockType) {
            AlertsMessages.error.displayMsg(
                'Your block has been removed, please try again',
                5000
            );
            self.undo();
        }
    };

    var canvas;

    try {
        canvas = Blockly.mainWorkspace.getCanvas();
    } catch(e) {
        // There is no workspace canvas, return gracefully.
        return;
    }

    // Attach event listeners.
    canvas.addEventListener('blockAdd',
                            blockAddHandler,
                            false);

    canvas.addEventListener('textInputChange',
                            textInputChangeHandler,
                            false);

    canvas.addEventListener('dropdownInputChange',
                            dropdownInputChangeHandler,
                            false);

    canvas.addEventListener('colourInputChange',
                            colourInputChangeHandler,
                            false);

    canvas.addEventListener('flyoutClose',
                            flyoutCloseHandler,
                            false);

    canvas.addEventListener("blockConnect",
                            blockConnectHandler,
                            false);

    canvas.addEventListener("blockMouseRelease",
                            blockMouseReleaseHandler,
                            false);

    canvas.addEventListener("blockOrphaned",
                            blockOrphanedHandler,
                            false);
};

Pointer.prototype._reset_furthest_step = function() {
    // Need to guard against restoring as it triggers all the event listeners
    if (!this._is_currently_restoring) {
        this.progress_bar.reset_furthest_step(this.currentStep);
    }
};

Pointer.prototype._restore_workspace = function() {
    this._is_currently_restoring = true;
    this.workspace_history.restore(this.currentStep);
    this._is_currently_restoring = false;

};

/**
 * Moves to the next tutorial message
 * @return {int}  0 Success
 *               -1 Already on the last message
 */
Pointer.prototype.showNext = function(params) {
    if (this.currentStep < this.maxSteps) {
        this.workspace_history.save(this.currentStep);

        this.currentStep++;
        this.progress_bar.update(this.currentStep);

        if (params && params.restore_history) {
            this._restore_workspace();
        }

        this.draw();

        return 0;
    } else {
        this.hide();
    }
};

/**
 * Moves to the previous message
 * @return {int}  0 Success
 *               -1 Already on the first message
 */
Pointer.prototype.showPrevious = function() {
    if (this.currentStep > 1) {
        this.workspace_history.save(this.currentStep);

        this.currentStep--;
        this.progress_bar.update(this.currentStep);

        if (!this._is_next_step_valid()) {
            this._reset_furthest_step();
        }

        this._restore_workspace();
        this.draw();

        return 0;
    } else {
        return -1;
    }
};

/**
 * Resets the current step
 */
Pointer.prototype.resetStep = function() {
    this.addListeners();
    this.draw();
    // FIXME: Need to remove old event listener.
    // FIXME: Need to handle a flyout return caused
    //        by re-initialising the workspace
};

/**
 * Fills the supplied selector with the current tutorial step
 */
Pointer.prototype.draw = function() {
    var coordinates = this.parsePosition(this.getStep().position);

    // Escape if we are told not to draw for this step.
    if (coordinates === 0)
    {
        this.updateListeners();
        this.hide();
        return;
    }

    coordinates = this.ensureCoordinatesOnScreen(coordinates);

	// Content
    var contentWrapperHeader = '<div class = \'tutorialContent\'>';
    var contentWrapperFooter = '</div>';

    this.selector.innerHTML = contentWrapperHeader +
                                this.getStep().tip_message +
                                contentWrapperFooter;

    this.selector.resetStyles = function() {
        this.classList.remove('default');
        this.classList.remove('up');
        this.classList.remove('down');
        this.classList.remove('left');
        this.classList.remove('right');

        this.style.top = 'auto';
        this.style.bottom = 'auto';
        this.style.left = 'auto';
        this.style.right = 'auto';
        this.style.position = '';
    };

    this.selector.centre = function() {
        this.style.left = 0;
        this.style.right = 0;
        this.style.marginLeft = 'auto';
        this.style.marginRight = 'auto';
        this.style.position = 'relative';
    };

    this.selector.resetStyles();

    switch ((coordinates === -1) || this.getStep().direction) {
        case 'r':
            // Message on the left
            this.selector.style.right = coordinates[0];
            this.selector.style.top = coordinates[1];
            this.selector.classList.add('right');
            break;
        case 'u':
            // Message beneath
            this.selector.style.left = coordinates[0];
            this.selector.style.top = coordinates[1];
            this.selector.classList.add('up');
            break;
        case 'l':
            // Message on the right
            this.selector.style.left = coordinates[0];
            this.selector.style.top = coordinates[1];
            this.selector.classList.add('left');
            break;
        case 'd':
            // Message on the top
            this.selector.style.left = coordinates[0];
            this.selector.style.bottom = coordinates[1];
            this.selector.classList.add('down');
            break;
        case 'manual':
            // Place the message with no arrow manually
            if (coordinates[0] === 'auto') {
                this.selector.centre();
            } else {
                this.selector.style.left = coordinates[0];
            }

            this.selector.style.top = coordinates[1];
            break;
        default:
            // Centre the hint at the top of teh screen
            this.selector.classList.add('default');
            // Use this to put the message at the top of the screen
            this.selector.style.top = '10px';
            this.selector.centre();
    }

    this.updateListeners();

    if (this.shown)
        this.show();
};

/**
 * Create an array of coordinate positions from a mixture of coordinates and selectors
 * @param  {string}   position A set of coordinates or a selector
 * @return {string[]}          A 2 dimensional array of coordinate positions
 */
Pointer.prototype.parsePosition = function(position) {
    if (position.length === 2) {
        // This is already a coordinate
        return position;
    }

    // FIXME : Position does not match properly if === is used
    if (position == 'hide') {
        // We want the element to be hidden for this step.
        return 0;
    }

    var splitPos = position.split('+'),
        self = this;

    var parseBlockStr = function(str) {
        var offset = {
                x: 170 + Blockly.mainWorkspace.scrollX,
                y: -55 + Blockly.mainWorkspace.scrollY
            },
            selected = Utilities.getBlockFromId(self.getStep().selected_id.last()),
            conns;

        switch (str) {
        case '':
            var size = selected.svg_.svgGroup_.getBBox(),
                pos  = selected.getRelativeToSurfaceXY();

            return [(pos.x + offset.x + size.width) + 'px',
                    (pos.y + offset.y + (size.height / 2)) + 'px'];

        case 'Child':
            conns = selected.getConnections_();

            for (var x = 0, len = conns.length; x < len; x++) {
                if (conns[x].label === splitPos[1]) {
                    self.getStep().selected_id.push(conns[x].targetConnection.sourceBlock_.id);

                    break;
                }
            }

            return self.parsePosition(splitPos.slice(2).join('+'));

        case 'Input':
            try {
                conns = selected.getConnections_();
            } catch (e) {
                e.description = 'Could not get connections.';
                console.log(e);
                return -1;
            }

            for (var x = 0, len = conns.length; x < len; x++) {
                if (conns[x].label === splitPos[1]) {
                    return [(conns[x].x_ + offset.x) + 'px',
                            (conns[x].y_ + offset.y) + 'px'];
                }

            }
        }
    };

    var prevStr = 'previous',
        workspaceStr = 'workspace';

    /**
     * The 'workspace' prefix allows selection
     * of blocks already on the workspace
     */
    if (position.indexOf(workspaceStr) === 0) {
        var blocks = Utilities.getBlocks(),
            blockStr = splitPos[0].substr(workspaceStr.length);

        // Find the correct block in the workspace
        for (var x = 0, len = blocks.length; x < len; x++) {
            if (blocks[x].type === splitPos[1]) {
                this.getStep().selected_id.push(blocks[x].id);
                splitPos.splice(1, 1);
            }
        }

        return parseBlockStr(blockStr);
    }

    /**
     * The 'previous' prefix uses the last selected block
     */
    if (position.indexOf(prevStr) === 0) {
        var prev = splitPos[0].substr(prevStr.length);

        while (prev[0] === '^') {
            this.getStep().selected_id.pop();
            prev = prev.slice(1);
        }

        return parseBlockStr(prev);
    }

    // This is a selector, so translate it.
    return this.getCoordinatesOfSelector(position, this.getStep().direction);
};

/**
 * Prevents coordinates which would cause the tips to be offscreen from being returned
 * @param  {string[]}   position A set of coordinates to check
 * @return {string[]}            Validated coordinates
 */
Pointer.prototype.ensureCoordinatesOnScreen = function(coords) {
    if (coords.length !== 2) {
        return coords;
    }

    var x = parseInt(coords[0].replace('px','')),
        y = parseInt(coords[1].replace('px', '')),
        screenWidth = document.body.clientWidth,
        offset = {
            x: 100,
            y: 40
        };

    if (isNaN(x) || isNaN(y)) {
        return coords;
    }

    if (x > screenWidth - offset.x
        && this.getStep().direction === 'l') {

        this.getStep().direction = 'r';
        x = screenWidth + offset.x - x;
        y += offset.y;
    }

    x += 'px';
    y += 'px';

    return [x, y];
};

/**
 * Calculates the position of an element from its selector
 * @param {string} selector       The selector to be pointing to
 * @param {int}    direction   r  for the message to appear to the left
 *                             u  for the message to appear beneath
 *                             l  for the message to appear to the right
 *                             d  for the message to appear above
 * @return {string[]}             A 2 dimensional array of coordinates
 */
Pointer.prototype.getCoordinatesOfSelector = function(selector, direction) {
    var xOffset = 20,
        yOffset = -40,
        selectorElement,
        selectorPosition;

    try {
        selectorElement = document.querySelector(selector);
        selectorPosition = selectorElement.getBoundingClientRect();
    } catch (e) {
        e.description = 'Selector not found';
        console.log(e);
        return -1;
    }

    switch (direction) {
    case 'r':
        // Left
        return [(document.body.clientWidth - selectorPosition.left) + 'px',
                selectorPosition.top + yOffset + 'px'];
    case 'u':
        // Beneath
        return [(1.5 * selectorPosition.left - 0.5 * selectorPosition.right) + 'px',
                (selectorPosition.bottom + 20) + 'px'];
    case 'l':
        // Right
        return [(selectorPosition.right + xOffset) + 'px',
                (selectorPosition.top + yOffset) + 'px'];
    case 'd':
        // Above
        return [(0.6 * selectorPosition.left + 0.4 * selectorPosition.right - 120) + 'px',
                (30 + document.body.clientHeight - selectorPosition.top) + 'px'];
    default:
        console.log('Direction not found');
        return [selectorPosition.right + 'px',
                selectorPosition.top + 'px'];
    }
};

/**
 * Hides the tutorial
 */
Pointer.prototype.hide = function() {
    this.selector.style.display = 'none';
};

/**
 * Shows the tutorial
 */
Pointer.prototype.show = function() {
    this.selector.style.display = 'block';
};

/**
 * Adds an event listener to the selector, for the current step, used to progress through the steps
 * Event types:
 *    buttonPress
 *    blockAdd
 *    textInputChange
 *    dropdownInputChange
 */
Pointer.prototype.updateListeners = function() {
    // Remove prior button press handler to prevent it being registered twice
    if (this._buttonPressHandler) {
        this._registeredButton
            .removeEventListener('mouseup',
                                 this._buttonPressHandler,
                                 false);

        this._registeredButton = null;
        this._buttonPressHandler = null;
    }

    /**
     * buttonPress events are different because the listener
     * changes and needs to be removed after being triggered
     */
    switch(this.getStep().event_type) {
    case 'buttonPress':
        var self = this;

        this._registeredButton = document.querySelector(this.getStep().button);
        this._buttonPressHandler = function() {
            self.showNext();
        };

        this._registeredButton
            .addEventListener('mouseup',
                              this._buttonPressHandler,
                              false);
        break;
    case 'blockAdd':
        this.getStep().progressor_tree = [this.getStep().block];
        break;
    }
};

/**
 * Retrieves the current step of tutorial
 * @return {int}  The current progress
 */
Pointer.prototype.getProgress = function() {
    return this.currentStep;
};

/**
 * Sets the current progress
 * TODO: Implement updating of the step and switching event listeners.
 * @param {int} progress  The step to set the tutorial to
 */
Pointer.prototype.setProgress = function(progress) {
    this.currentStep = progress;
};

/**
 * Sets whether the object should be displayed
 * @param {Boolean} value  Should the object be displayed?
 *                           true   Display
 *                           false  Don't display
 */
Pointer.prototype.setShown = function(value) {
    this.shown = value;
    if (!this.shown)
        this.hide();
    else if (this.parsePosition(this.getStep().position) !== -1)
        this.show();
};

Pointer.prototype._skipped_undo_events = [
    'blockAdd',
    'textInputChange',
    'dropdownInputChange',
    'colourInputChange',
    'blockConnect'
];

Pointer.prototype._skipped_redo_events = [
    'buttonPress'
];

Pointer.prototype._is_next_step_valid = function() {
    var remaining_steps = this.progress_bar.furthest_step - this.currentStep;

    for (var step_no = 1, step; step_no < remaining_steps; step++) {
        step = this.getStep(step_no);

        if (this._skipped_redo_events.indexOf(step.event_type) === -1) {
            return true;
        }
    }

    return false;
};

Pointer.prototype.undo = function() {
    var event_type = this.getStep(-1).event_type;

    // Some events should be skipped as they lead to problems
    if (this._skipped_undo_events.indexOf(event_type) !== -1) {
        this.workspace_history.save(this.currentStep);
        this.currentStep--;

        this.undo();
    } else {
        this.showPrevious();
    }
};

Pointer.prototype.redo = function() {
    if (this.currentStep === this.progress_bar.furthest_step) {
        return;
    }

    var event_type = this.getStep(1).event_type;

    // Some events should be skipped as they lead to problems
    if (this._skipped_undo_events.indexOf(event_type) !== -1) {
        this.currentStep++;
        this.redo();
    } else {
        this.showNext({
            restore_history: true
        });
    }
};

})();
/**
* Copyright (C) 2014 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Tom Bettany <tom.bettany@kano.me>
* Description: A class to create tutorial messages from an XML specification file.
*/

var Tooltip = {};

(function() {
'use strict';

/**
 * Loads a project tutorial from an XML file
 * @param {string} xmlFile  Path to the XML file to load or pure XML
 */
Tooltip = function(xmlFile, paddingBefore, paddingAfter) {
    var parser,
        data;

    this.paddingBefore = paddingBefore;
    this.paddingAfter = paddingAfter;

    if (xmlFile.indexOf('.xml') !== -1) {
        // This is a filepath.
        backend.call('readFile', xmlFile, function(xmlString) {
            data = xmlString;
        });
    } else {
        // This is pure XML.
        data = xmlFile;
    }

    if (window.DOMParser) {
        parser = new DOMParser();
        this.xmlDoc = parser.parseFromString(data, 'text/xml');
    }
};

Tooltip.prototype.getTipText = function(idx) {
    var currentStep = this.tutorialDialog.currentStep - 1;
    if (typeof(idx) === 'undefined') {
        idx = currentStep;
    } else {
        idx = currentStep + idx;
    }

    try {
        return this.tipText[idx].firstChild.nodeValue;
    } catch (e) {
        return '';
    }
};

/**
 * Sets up the tooltip messages for the specified project.
 * @param  {int} project  The project to display the tooltips for.
 */
Tooltip.prototype.displayProject = function(project) {
    var positions,
        tips,
        directions,
        progressors,
        xml;

    xml = this.xmlDoc.getElementsByTagName('project')[project - 1];

    positions = this.xmlToArray(xml.getElementsByTagName('position'));
    this.tipText = xml.getElementsByTagName('tip');
    tips = this.xmlToArray(this.tipText);
    directions = this.xmlToArray(xml.getElementsByTagName('direction'));
    progressors = this.xmlToArray(xml.getElementsByTagName('progressor'));

    this.tutorialDialog = new Pointer('tutorialDialog',
                                        this.padArray(tips,
                                                      this.paddingBefore,
                                                      this.paddingAfter),
                                        this._parsePositions(positions),
                                        directions,
                                        progressors);
};

/**
 * Takes an XML object and returns an array of its values.
 * Essentially puts the xml.childNodes[0].nodeValue into an array.
 * @param  {XML parsed object} xml  The XML object to be converted
 * @return {string[]}               An array of the values
 */
Tooltip.prototype.xmlToArray = function(xml) {
    var length = xml.length;
    var xmlArray = [];
    for (var i = 0; i < length; i++) {
        if (xml[i].childNodes[0]) {
            xmlArray.push(xml[i].childNodes[0].nodeValue);
        } else {
            xmlArray.push('');
        }
    }

    return xmlArray;
};

/**
 * Takes an array and adds strings to the beginning or end of each element.
 * Useful to add HTML tags around raw data.
 * @param  {string[]} array   The array to pad
 * @param  {string}   before  The string to place before each element
 * @param  {string}   after   The string to place after each element
 * @return {string[]}         The padded array
 */
Tooltip.prototype.padArray = function(array, before, after) {
  var length = array.length;

  if (typeof before === 'undefined')
    before = '';
  if (typeof after === 'undefined')
    after = '';

  for (var i = 0; i < length; i++) {
    array[i] = before + array[i] + after;
  }
  return array;
};

/**
 * Switches the tooltip to be displayed
 */
Tooltip.prototype.showNext = function() {
  this.tutorialDialog.showNext();
};

/**
 * Switches the tooltip to be displayed
 */
Tooltip.prototype.showPrevious = function() {
  this.tutorialDialog.showPrevious();
};

/**
 * Switches the tooltip to be displayed
 */
Tooltip.prototype.redo = function() {
  this.tutorialDialog.redo();
};

/**
 * Switches the tooltip to be displayed
 */
Tooltip.prototype.undo = function() {
  this.tutorialDialog.undo();
};

/**
 * Resets the step of the tooltip
 */
Tooltip.prototype.resetStep = function() {
  this.tutorialDialog.resetStep();
};

/**
 * Switches the tooltip to be displayed
 */
Tooltip.prototype.show = function() {
  this.tutorialDialog.show();
};

/**
 * Switches the tooltip to be displayed
 */
Tooltip.prototype.hide = function() {
  this.tutorialDialog.hide();
};

/**
 * Sets whether the tooltip should be displayed
 * @param {Boolean} value  Should the object be displayed?
 *                           true   Display
 *                           false  Don't display
 */
Tooltip.prototype.setShown = function(value) {
  this.tutorialDialog.setShown(value);
};

/**.
 * Parses out coordinates from a given positionstring
 * @param  {string[]} positions  An array of positions
 * @return {string[]}            An array of parsed positions
 */
Tooltip.prototype._parsePositions = function(positions) {
  for (var i = 0; i < positions.length; i++) {
    if (positions[i].indexOf(',') !== -1) {
      positions[i] = positions[i].split(',');
    }
  }

  return positions;
};

})();
/**
* Copyright (C) 2014 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Tom Bettany <tom.bettany@kano.me>
* Description: A class to generate tutorial steps.
*/

var Steps = {};

(function() {
'use strict';

/**
 * Generates steps from the blocks on the workspace.
 */
Steps.generateSteps = function() {
    var category,
        categoryDiv,
        steps    = Utilities.getBlocksInfo(true, true),
        stepsXML = '<?xml version="1.0" encoding="UTF-8"?>\n' +
                   '<level>\n' +
                   '    <project>\n';

    var generateSetValueSteps = function (step) {
        for (var input in step.inputs) {

            if (step.inputs[input] !== 'input') {

                if (Steps.getLabelFromInput(input,step.labels)){
                    var label = Steps.getLabelFromInput(input,step.labels);
                    var progressor;

                    if (step.inputs[input] === '<') {
                        step.inputs[input]='lessThan';
                    }

                    //pong_ball block has both dropdown and text input, so treat it differently
                    if (step.Type === 'pong_ball') {
                        if (label === 'IMAGE') {
                            progressor = 'dropdownInputChange+' + label + '+' + step.inputs[input];
                        } else {
                            progressor = 'textInputChange+' + label + '+===' + step.inputs[input];
                        }
                    } else {
                        // Check if it is a dropdown input and it is not the math_arithmetic or the logic_compare blocks
                        if (step.hasDropdownInput
                            && step.Type !== 'math_arithmetic'
                            && step.Type !== 'logic_compare') {

                            progressor = 'dropdownInputChange+' + label + '+' + step.inputs[input];
                        } else if (step.Type === 'math_arithmetic' || step.Type === 'logic_compare') {
                            progressor = 'dropdownInputChange+' + label + '+' + Steps.mapToHTMLOperator(step.inputs[input]);
                        } else if (step.Type === 'colour_picker') {
                            progressor = 'colourInputChange+COLOUR';
                            step.inputs[input] = 'a colour';
                        } else {
                            progressor = 'textInputChange+' + label + '+===' + step.inputs[input];
                        }
                    }

                    stepsXML += Steps.generateStepXML('',
                                                      'Set ' + label + ' to ' + step.inputs[input],
                                                      'l',
                                                      progressor);
                }
            }
        }
    };

    for (var x = 0, len = steps.length; x < len; x++) {
        category    = Steps.getCategoryFromType(steps[x].Type);

        // Skip step if the block isn't in the menu.
        if (category) {
            categoryDiv = 'div.blocks-tree-' + category.replace(' ', '-').toLowerCase();

            // Category selection
            stepsXML += Steps.generateStepXML(categoryDiv,
                                              'Select the ' + Utilities.toTitleCase(category) + ' category',
                                              'l',
                                              'buttonPress+' + categoryDiv);


            // Block selection
            stepsXML += Steps.generateStepXML('g.flyout.svgBlock-' + steps[x].Type,
                                              'Choose the ' +
                                                  Utilities.blockTypeToName(steps[x].Type) +
                                                  ' block',
                                              'l',
                                              'blockAdd+' + steps[x].Type);

            //Check if it should be attached to some other blocks
            if (steps[x].parentBlock) {

              stepsXML += Steps.generateStepXML('',
                                                'Connect to the ' + Utilities.blockTypeToName(steps[x].parentBlock[0].Type) + ' block',
                                                'l',
                                                'blockConnect+' + steps[x].parentBlock[0].Type + '+' + steps[x].Type);
            }

            //generate steps to set the value on inner inputs
            generateSetValueSteps(steps[x]);

            //generate steps to set the values on inner inputs of children nodes
            if (steps[x].childBlocks) {
                for (var index in steps[x].childBlocks) {
                    generateSetValueSteps(steps[x].childBlocks[index]);
                }
            }
        }
        // Check if it already comes connected to a parent block
        else if (steps[x].parentBlock) {
            generateSetValueSteps(steps[x]);
        }
    }

    // Add an instruction to Make and then finish up the xml.
    stepsXML += Steps.generateStepXML('#runButton', 'Make', 'd', 'NONE') +
                '    </project>\n' +
                '</level>';
    return stepsXML;
};

/**
*  It maps the symbol operators (+,-,x,÷,^,...) to HTML unicode characters
*/
Steps.mapToHTMLOperator = function(operator) {
    switch (operator) {
    case '÷':
        return '&#247;';
    case '+':
        return '&#43;';
    case '-':
        return '&#45;';
    case '×':
        return '&#215;';
    case '^':
        return '&#94;';
    case '≠':
        return '&#8800;';
    case '=':
        return '&#61;';
    case '≤':
        return '&#8804;';
    case 'lessThan':
        return '&#60;';
    case '≥':
        return '&#8805;';
    case '>':
        return '&#62;';
    }

};

/**
 * Map the input into the label to show it to the user.
 */
Steps.getLabelFromInput = function(input, labels) {
    for (var label in labels) {
        if (label==input) {
            return labels[label];
        }
    }

    return;
};

Steps.generateStepXML = function(position, tip, direction, progressor) {
    return '        <step>\n' +
           '            <position>' + position + '</position>\n' +
           '            <tip>' + tip + '</tip>\n' +
           '            <direction>' + direction + '</direction>\n' +
           '            <progressor>' + progressor + '</progressor>\n' +
           '        </step>\n';
};

Steps.getCategoryFromType = function(type) {
    var parser,
        xmlToolbox,
        xmlCategories,
        xmlBlocks,
        cat_no,
        block_no;

    if (!window.DOMParser) {
        return false;
    }

    parser = new DOMParser();
    xmlToolbox = parser.parseFromString(toolbox.playgroundunlockedtoolbox(), 'text/xml');
    xmlCategories = xmlToolbox.getElementsByTagName('category');
    cat_no = xmlCategories.length;

    for (var x = 0; x < cat_no; x++) {
        xmlBlocks = xmlCategories[x].getElementsByTagName('block');
        block_no = xmlBlocks.length;

        for (var i = 0; i < block_no; i++) {
            if (xmlBlocks[i].getAttribute('type') === type) {
                return xmlCategories[x].getAttribute('name');
            }
        }
    }

    return false;
};

})();
/**
* Copyright (C) 2014 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Tom Bettany <tom.bettany@kano.me>
* Description: Extension of the pointer class to handle pop-up messages
*/

Alerts = {};

(function() {
'use strict';

Alerts = function(selector, content, position, direction, progressSelector) {
    Pointer.call(this, selector, content, position, direction, progressSelector);
};

Alerts.prototype = Object.create(Pointer.prototype);

Alerts.prototype.contructor = Alerts;

Alerts.prototype.displayMsg = function(msg, timeout) {
    var msgDiv = this.selector.getElementsByClassName('msg')[0],
        self = this;

    msgDiv.innerHTML = msg;
    this.show();

    if (timeout) {
        setTimeout(function() {
            self.hide();
        }, timeout);
    }
};

})();
/**
* Copyright (C) 2014 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Tom Bettany <tom.bettany@kano.me>
* Description: Alert message definitions
*/

var AlertsMessages = {};

(function() {
'use strict';

AlertsMessages.success = {};
AlertsMessages.hint = {};
AlertsMessages.error = {};
AlertsMessages.levelDone = {};

AlertsMessages.hideOnMake = function() {
    AlertsMessages.success.hide();
    AlertsMessages.hint.hide();
    AlertsMessages.error.hide();
};

AlertsMessages.hideAll = function() {
    AlertsMessages.hideOnMake();
    AlertsMessages.levelDone.hide();
};

(function() {
    function createMessages() {
        AlertsMessages.success = new Alerts('successAlert',
                                            ['<div class=\'success\'>' +
                                                 '<img src=\'../../kano-blocks/blockly/media/1x1.gif\' class=\'hint-icon success\'>' +
                                                 '<span class=\'hintlabel\'>GREAT!&nbsp;&nbsp;' +
                                                 '<span class=\'msg\'>' +
                                                 '</span></span>' +
                                             '</div>' +
                                             '<button class=\'closelabel\' onclick=\'AlertsMessages.success.hide()\'>' +
                                                 'OK' +
                                             '</button>'],
                                            [['auto', '10px']],
                                            ['manual'],
                                            ['.cross']);
        AlertsMessages.success.hide();

        AlertsMessages.hint = new Alerts('hintAlert',
                                         ['<div class=\'hint\'>' +
                                              '<img src=\'../../kano-blocks/blockly/media/1x1.gif\' class=\'hint-icon tip\'>' +
                                              '<span class=\'hintlabel\'>HINT!&nbsp;&nbsp;' +
                                              '<span class=\'msg\'>' +
                                              '</span></span>' +
                                          '</div>' +
                                          '<button class=\'closelabel\' onclick=\'AlertsMessages.hint.hide()\'>' +
                                              'OK' +
                                          '</button>'],
                                         [['auto', '10px']],
                                         ['manual'],
                                         ['.cross']);
        AlertsMessages.hint.hide();

        AlertsMessages.error = new Alerts('errorAlert',
                                          ['<div class=\'error\'>' +
                                               '<img src=\'../../kano-blocks/blockly/media/1x1.gif\' class=\'hint-icon error\'>' +
                                               '<span class=\'hintlabel\'>ERROR!&nbsp;&nbsp;' +
                                               '<span class=\'msg\'>' +
                                               '</span></span>' +
                                           '</div>' +
                                           '<button class=\'closelabel\' onclick=\'AlertsMessages.error.hide()\'>' +
                                               'OK' +
                                           '</button>'],
                                          [['auto', '10px']],
                                          ['manual'],
                                          ['.cross']);
        AlertsMessages.error.hide();

        AlertsMessages.levelDone = new Alerts('finishedLevelAlert',
                                          ['<div class=\'levelDone\'>' +
                                               '<img src=\'../../kano-blocks/blockly/media/1x1.gif\' class=\'hint-icon success\'>' +
                                               '<span class=\'hintlabel\'>CHALLENGE COMPLETE!&nbsp;&nbsp;' +
                                               '<span class=\'msg\'>' +
                                               '</span></span>' +
                                           '</div>' +
                                           '<button class=\'closelabel\' onclick=\'AlertsMessages.levelDone.hide(); Project.goToNext()\'>' +
                                               '<img src=\'../../kano-blocks/blockly/media/1x1.gif\' class=\'icon projectMenuIcons whiteRightArrow\'>' +
                                           '</button>'],
                                          [['auto', '10px']],
                                          ['manual'],
                                          ['.cross']);
        AlertsMessages.levelDone.hide();
    };

    window.addEventListener('load',
                            createMessages,
                            false);
})();

})();
/**
* Copyright (C) 2014-2015 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Team Kano <team-software@kano.me>
* Description: Handles the help window.
*/

var Help = {};

(function() {
'use strict';

Help.getForumLink = function() {
    return Project.getCurrent().language.forum;
};

/**
 * Toggles the help on and off
 */
Help.toggle = function() {
    document.getElementById("helpSwitch").classList.toggle("down");
    if (document.getElementById("helpSwitch").classList.contains("down")) {
        Help.updateInfo();
        document.getElementById("helpScreen").style.display = "block";
    } else {
        Help.showMenu();
        document.getElementById("helpScreen").style.display = "none";
    }
};

Help.showBlockConfiguration = function() {
    document.getElementById("blockSolution").style.display = "table-cell";
    document.getElementById("stillStuck").style.display = "none";
    Help.change_forumPage_display("none");
    Help.change_blockControls_display("none");
};

Help.showForumPage = function() {
    Help.change_forumPage_display("table-cell");
    document.getElementById("stillStuck").style.display = "none";
    document.getElementById("blockSolution").style.display = "none";
    Help.change_blockControls_display("none");

    var url = Help.getForumLink();
    backend.call('launch_forum', url, function(){});
};

Help.showMenu = function() {
    document.getElementById("stillStuck").style.display = "table-cell";
    document.getElementById("blockSolution").style.display = "none";
    Help.change_forumPage_display("none");
    Help.change_blockControls_display("none");
};

Help.showBlockControls = function() {
    Help.change_blockControls_display("table-cell");
    document.getElementById("stillStuck").style.display = "none";
    document.getElementById("blockSolution").style.display = "none";
    Help.change_forumPage_display("none");
};

// In pong, the block controls screen doesn't exist
Help.change_blockControls_display = function(display_type) {
    if (document.getElementById("blockControls") !== null) {
        document.getElementById("blockControls").style.display = display_type;
    }
};

// In minecraft, the forum page screen may not exist
Help.change_forumPage_display = function(display_type) {
    if (document.getElementById("forumPage") !== null) {
        document.getElementById("forumPage").style.display = display_type;
    }
};

Help.updateInfo = function() {
    var title = Project.getCurrent().language.title;
    var description = Project.getCurrent().language.description;
    var prev_step = Project.tooltip.getTipText(-1);
    var next_step = Project.tooltip.getTipText();
    document.getElementById("helpTitle").innerHTML = title;
    document.getElementById("helpDescription").innerHTML = description;
    document.getElementById("prevStep").innerHTML = prev_step;
    document.getElementById("nextStep").innerHTML = next_step;

    if (Project.getCurrent().level == 1) {
        document.getElementById("showSolutionButton").disabled = true;
    } else {
        document.getElementById("showSolutionButton").disabled = false;
    }

    // update the info of each of the elements in the hide section
    // Update block configuration image
    var name = Project.getName();
    var challengeNumber = Project.getCurrent().level;
    var filename = "../../make-" +
                    name +
                    "/" +
                    name +
                    "/media/completed-challenges/challenge-" +
                    challengeNumber +
                    ".png";

    document.getElementById("blockSolutionImg").src = filename;

    // Update forum post link
    //var forumLink = Help.getForumLink();
    //document.getElementById("forumPageIFrame").src = forumLink;
};

Help.hideScreen = function() {
    Help.showMenu();
    document.getElementById("helpScreen").style.display = "none";
    document.getElementById("helpSwitch").classList.remove("down");
};

Help.toggle_button = (function() {
    var set_help_switch_display = function(display_state) {
        var help_switch = document.getElementById('helpSwitch');

        if (help_switch) {
            help_switch.style.display = display_state;
        }
    };

    return {
        show: function() {
            set_help_switch_display('');
        },
        hide: function() {
            set_help_switch_display('none');
        }
    };
})();

})();
/**
* Copyright (C) 2014 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Tom Bettany <tom.bettany@kano.me>
* Description: Utilities related to displaying and updating the code preview window
*/

var CodePreview = {
    codeInput: function() {
        var editor = ace.edit('advancedModeCode');
        editor.setTheme('ace/theme/tomorrow_night');
        editor.getSession().setMode('ace/mode/python');
        editor.$blockScrolling = Infinity;

        return editor;
    },
    codeDialogInput: function() {
        var editor = ace.edit('code_preview_input');
        editor.setTheme('ace/theme/tomorrow_night');
        editor.setReadOnly(true);
        editor.getSession().setMode('ace/mode/python');
        editor.$blockScrolling = Infinity;

        return editor;
    }
};

(function() {
'use strict';

/**
 * Toggles the code preview on and off
 */
CodePreview.toggle = function() {
    if (document.getElementById('codeSwitch') !== null
        && document.getElementById('codeSwitch').checked) {

        CodePreview.renderCode();
        CodePreview.turn.on();
        window.addEventListener('mouseup', CodePreview.renderCode, false);
    } else {
        CodePreview.turn.off();
        window.removeEventListener('mouseup', CodePreview.renderCode, false);
    }
};

/**
 * Renders the code for the code preview
 */
CodePreview.renderCode = function() {
    var code = Project.getCode();
    CodePreview.codeDialogInput().setValue(code);
};

CodePreview.turn = {
    off : function() {
        document.getElementById('codeSwitch').checked = false;
        var codeDialog = document.getElementById('codePreview');
        codeDialog.classList.add('hidden');
    },
    on : function() {
        if (document.getElementById('codeSwitch') !== null) {
            document.getElementById('codeSwitch').checked = true;
            var codeDialog = document.getElementById('codePreview');
            codeDialog.classList.remove('hidden');
            CodePreview.renderCode();
        }
    }
};

CodePreview.advancedMode = {
    activated : false,
    setup : false,
    _code :   'import minecraft.minecraft as minecraft\n' +
              'import minecraft.block as block\n' +
              'import time\n' +
              '\n' +
              '\n' +
              'mc = minecraft.Minecraft.create()\n' +
              '\n',
    enable: function() {
        var advancedToggle = document.querySelector('.codePreview .basicMode .advancedModeToggle');

        advancedToggle.classList.remove('hidden');
    },
    disable: function() {
        var advancedToggle = document.querySelector('.codePreview .basicMode .advancedModeToggle');

        advancedToggle.classList.add('hidden');
    },
    setCode : function(code) {
        var codeText  = new CodeText(code);

        CodePreview.advancedMode._code = codeText.getCode();
        CodePreview.codeInput().setValue(CodePreview.advancedMode._code);
    },
    getCode : function() {
        var code = new CodeText(CodePreview.codeInput().getValue());

        code = code.getCode();
        return code;
    },
    reset: function() {
        CodePreview.advancedMode._code = '';
        CodePreview.codeInput().setValue('');
    },
    update: function() {
        CodePreview.advancedMode._code = CodePreview.advancedMode.getCode();

        backend.call('merge_code',
                     Project.getCode(),
                     CodePreview.advancedMode._code,
                     function(code) {
                         CodePreview.advancedMode.setCode(code);
                     });
    },
    view : function(state) {
        var codeEditor = (function() {
            var editor = document.getElementById('codePreview');

            return {
                off : function() {
                    editor.classList.remove('advanced');

                    CodePreview.advancedMode.activated = false;
                },
                on : function() {
                    CodePreview.advancedMode.update();
                    CodePreview.turn.on();
                    editor.classList.add('advanced');

                    if ('localStorage' in window
                        && localStorage.advancedModeRun !== 'true' ) {

                        localStorage.advancedModeRun = true;
                        location.hash = '#advancedModeExplainDialog';
                    }

                    CodePreview.advancedMode.activated = true;
                },
                setup: function() {
                    var guide = editor.querySelector('.codePreview .advancedMode .guide > span.msg');

                    CodePreview.advancedMode.update();

                    guide.innerHTML = '';
                    var code = '<ul>' +
                               '<li>mc.postToChat(): writes a message on the game</li>' +
                               '<li>mc.setBlock(x, y, z, type): changes the type of a single block</li>' +
                               '<li>mc.getBlock(x, y, z): returns the type of a block</li>' +
                               '<li>mc.setBlocks(x1, y1, z1, x2, y2, z2, type): changes the type of a group of blocks</li>' +
                               '<li>mc.player.setTilePos(x, y, z): changes your position</li>' +
                               '<li>time.sleep(t): pauses for t seconds</li>' +
                               '</ul>';
                    guide.appendChild(document.createTextNode(code));
                    guide.innerHTML = code;
                    CodePreview.advancedMode.setup = true;
                }
            };
        })();

        var codeToggleSwitch = (function() {
            var codeToggle   = document.querySelector('div.toolbar div.half.right > button.toggle.code'),
                toggleSwitch = codeToggle.querySelector('#codeSwitch');

            return {
                enable : function() {
                    toggleSwitch.disabled = false;
                    codeToggle.classList.remove('disabled');
                },
                disable : function() {
                    toggleSwitch.checked = false;
                    toggleSwitch.disabled = true;
                    codeToggle.classList.add('disabled');
                }
            };
        })();

        var advancedToggleSwitch = (function() {
            var codePreviewWindow = document.querySelector('.codePreview');

            return {
                basic : function() {
                    codePreviewWindow.classList.remove('advanced');
                },
                advanced : function() {
                    codePreviewWindow.classList.add('advanced');
                }
            };
        })();

        if (!CodePreview.advancedMode.setup) {
            codeEditor.setup();
        }

        if (state) {
            advancedToggleSwitch.advanced();
            CodePreview.turn.on();
            codeToggleSwitch.disable();
            codeEditor.on();
        } else {
            advancedToggleSwitch.basic();
            codeToggleSwitch.enable();
            codeEditor.off();
            CodePreview.renderCode();
        }
    },
    guide : {
        visible: false,
        toggle: function() {
            if (CodePreview.advancedMode.guide.visible) {
                CodePreview.advancedMode.guide.turn.off();
            } else {
                CodePreview.advancedMode.guide.turn.on();
            }
        },
        turn: {
            on: function() {
                var guide = document.querySelector('.codePreview .advancedMode .guide');
                guide.classList.remove('hidden');
                CodePreview.advancedMode.guide.visible = true;
            },
            off: function() {
                var guide = document.querySelector('.codePreview .advancedMode .guide');
                guide.classList.add('hidden');
                CodePreview.advancedMode.guide.visible = false;
            }
        }
    }
};

})();
/**
* Copyright (C) 2014 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Team Kano <team-software@kano.me>
* Description: A class to create new projects.
*/

var NewProject = {};

(function() {
'use strict';

NewProject = function(level) {
    var latestLevel = Project.level,
        levelCount  = Project.challenge.count;

    // 1st project has level 1
    this.level = level;
    this.currentProject = false;
    this.unlocked = (this.level == 1 || this.level == levelCount + 1);
    this.lastVisited = (this.level <= latestLevel);
    this.cache = '';
    this.projectButton = document.getElementById('project' + this.level);
    this.img = document.getElementById('img' + this.level);

    this.updateLanguage();
};

NewProject.prototype.updateLanguage = function() {
    if (this.level === Project.challenge.count + 1) {
        this.language = Language.playground;
        this.language.number = '';
        this.language.numberOfTotal = '';
    } else {
        this.language = Language.project[this.level];
        this.language.number = this.level;
        this.language.numberOfTotal = '(' + this.level + '/' + Project.challenge.count + ')';
    }
};

NewProject.prototype.unlock = function() {
    var latestLevel = Project.level;

    if (this.level <= latestLevel) {
        this.unlocked = true;

        if (this.level > Project.challenge.count) {
            this.projectButton.classList.remove('locked');
            this.projectButton.classList.add('unlocked');
        } else if (this.level < latestLevel) {
            this.projectButton.classList.remove('locked');
            this.projectButton.classList.remove('working');
            this.projectButton.classList.add('completed');

            var xpLabel = document.querySelectorAll('.dialog.challenge .dialogItem.projectMenu .bottom .xp .xpLabel');
            xpLabel[this.level - 1].innerHTML = this.xp;
            try {
                this.img.classList.remove('padlock');
                this.img.classList.remove('lightning');
                this.img.classList.add('tick');
            } catch (e) {
            }
            this.projectButton.disabled = false;
        } else {
            this.projectButton.classList.add('working');
            try {
                this.img.classList.remove('padlock');
                this.img.classList.add('lightning');
            } catch (e) {
            }
            this.projectButton.disabled = false;
        }
    }

    this.setIcons();
};

NewProject.prototype.setIcons = function() {
    var objective = this.language.objective || '',
        badge = this.language.badge || '';

    if (objective !== '') {
        this.projectButton.classList.add('objective');
    }

    if (badge !== '') {
        this.projectButton.classList.add('badge');
    }
};

})();
/**
* Copyright (C) 2014-2015 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Team Kano <team-software@kano.me>
* Description: A base class for the project class defined in each level.
*/

var ProjectBase = {};

(function() {
'use strict';

ProjectBase = function (challengeCount, tooltipPath, name, enableAdv) {
    this.projectName = name;
    this.challenge = {};
    this.challenge.count = challengeCount;
    this.level     = {};
    this.tooltip   = new Tooltip(tooltipPath,
                                 '<div class=\'tip\'><p class=\'hintlabel\'>',
                                 '</p></div>'),
    this.advancedModeEnabled = enableAdv || false;
};

/*
 *  Writes the information about each project to the menu.
 *  This is done here so the text can be put in _messages.js
 */
ProjectBase.prototype.updateInformation = function(level) {
    new ElementGroup('.challengeNumber').setAttr(
        'innerHTML', this.challenge[level].language.number);
    new ElementGroup('.challengeNumberOfTotal').setAttr(
        'innerHTML', this.challenge[level].language.numberOfTotal);
    new ElementGroup('.challengeTitle').setAttr(
        'innerHTML', this.challenge[level].language.title);
    new ElementGroup('.challengeDescription').setAttr(
        'innerHTML', this.challenge[level].language.description);
    new ElementGroup('.objectiveLabel').setAttr(
        'innerHTML', this.challenge[level].language.objective);
    new ElementGroup('.badgeLabel').setAttr(
        'innerHTML', this.challenge[level].language.badge || '');
    new ElementGroup('.challengeInfo .stat.xp .xpLabel').setAttr(
        'innerHTML', this.challenge[level].xp || '');

    var lines = this.challenge[level].language.codeLines,
        line_str = lines  + ' LINE';

    if (lines !== '1') {
        line_str += 'S';
    }
    new ElementGroup('.linesLabel').setAttr(
        'innerHTML', line_str);
};

ProjectBase.prototype.reload = function() {
    var rtl     = BlocklyApps.LANGUAGES[BlocklyApps.LANG][1] == 'rtl',
        toolbox = document.getElementById('toolbox'),
        blocks  = document.getElementById('content_blocks');

    try {
        Blockly.inject(blocks,
            {path: '../blockly/',
             rtl: rtl,
             toolbox: toolbox});

        BlocklyStorage.restoreBlocks();

        // Show the selected pane.
        blocks.style.visibility = 'visible';
        Blockly.fireUiEvent(window, 'resize');
    } catch (e) {
    }
};

ProjectBase.prototype.loadLevel = function(callback) {
    var self = this;

    backend.call('load_level', function(loadedLevel) {
        self.level = loadedLevel;
        if (callback) {
            callback();
        }
    });
};

ProjectBase.prototype.showSplashMenu = function() {
    // Show the menu at startup.
    if (this.readLastUnlocked() === 1) {
        backend.call('play_intro', function() {});
        this.goToIntro(1);
    } else {
        window.location.hash = '#splashOther';
    }
};

ProjectBase.prototype.init = function() {
    var self = this;

    // Re-emit the load event, the following relies on it for initialisation.
    // TODO: The 'load' event does come through, but it does so late.
    var evt = document.createEvent('Event');
    evt.initEvent('load', false, false);
    window.dispatchEvent(evt);

    this.loadLevel.call(self, function() {
        backend.call('get_xp', function(xp) {
            xp = JSON.parse(xp);

            for (var i = 1; i <= self.challenge.count + 1; i++) {
                self.challenge[i] = new NewProject(i, self.level, self.challenge.count);
                self.challenge[i].xp = xp[i];
                self.challenge[i].unlock(self.level);
            }

            self.updateInformation(self.level);
            self.showSplashMenu.call(self);
        });

        AlertsMessages.hideAll();
        // ProjectBase.prototype.reload.call(self);
        self.reload();

        // CLI argument parsing
        backend.call('arg_level', function(argLevel) {
            if (!argLevel) {
                return;
            } else if (argLevel == 'make') {
                self.goToNext();
            } else if (argLevel == 'play') {
                self.goToPlayground();
            } else {
                IO.load.file.local.XMLfromFilename(argLevel);
            }
        });
    });
};

ProjectBase.prototype.goToIntro = function(project) {
    if (!this.challenge[project].unlocked) {
        return;
    }

    Project.updateInformation(project);
    Project.setLastVisited(project);

    if (project < this.level) {
        location.hash = '#replayProjectIntroDialog';
    } else if (project === this.challenge.count + 1) {
        location.hash = '#playgroundIntroDialog';
    } else {
        location.hash = "#projectIntroDialog";
    }

};

/**
 * Switches the project workspace.
 * @param  {String} project The project to be loaded.
 *                          Must match the name used in the project's {template .*toolbox} section (omit 'toolbox').
 *                          Leave blank for all the blocks in the toolbox.
 *                          Examples:
 *                            If {template .project1toolbox} is defined, call Code.switchProject('project1')
 *                            Call Code.switchProject('') for the whole toolbox
 */
ProjectBase.prototype.switch = function(project) {
    if (!this.challenge[project].unlocked) {
        return;
    }

    var previousLevel = this.getLastVisited(),
        level         = this.level;

    this.updateInformation(project);
    this.setLastVisited(project);
    location.hash = '#project' + project;

    if (project > this.challenge.count) {
        project = 'playgroundunlockedtoolbox';

        if (this.advancedModeEnabled) {
            CodePreview.advancedMode.enable();
            CodePreview.advancedMode.view(CodePreview.advancedMode.activated);
        }

        if (!this.advanceModeEnabled || !CodePreview.advancedMode.activated) {
            document.getElementById('content_blocks').innerHTML = window.toolbox[project]();
            this.reload();
         }

        try {
            this.tooltip.setShown(false);
        } catch (e) {
            // Just means that the user hasn't visited a project with a tooltip yet.
        }

        Help.toggle_button.hide();

        new ChallengeProgressBar({
            disabled: true
        });

    } else {
        var projectName;

        if (project === -1) {
            projectName = "project" + previousLevel + "toolbox";
        } else {
            projectName = "project" + project + "toolbox";
        }

        if (this.advancedModeEnabled) {
            CodePreview.advancedMode.view(false);

            // This is to fix bug when going from Advanced mode to a challenge.
            // Code preview is still shown but toggle button is off.
            if (!document.getElementById('codeSwitch').checked) {
                CodePreview.turn.off();
            }

            CodePreview.advancedMode.disable();
        }

        document.getElementById('content_blocks').innerHTML = window.toolbox[projectName]();
        this.reload();

        if (project !== previousLevel || this.initialStart === undefined) {
            AlertsMessages.hideAll();
            this.tooltip.displayProject(project);
            this.initialStart = true;
        } else {
            // Returning to the same challenge
            // FIXME: For now just reset the tips.
            // Eventually do : this.tooltip.resetStep();
            this.tooltip.displayProject(project);
        }

        try {
            this.tooltip.setShown(Code.tutorial);
        } catch (e) {
            // Just means that the user hasn't visited a project with a tooltip yet.
        }

        Help.toggle_button.hide();
    }

};

ProjectBase.prototype.getCurrent = function() {
    var level = this.getLastVisited();

    return this.challenge[level];
};

ProjectBase.prototype.getName = function() {
    return this.projectName;
};

ProjectBase.prototype.reset = function() {
    Project.switch(-1);
};

ProjectBase.prototype.deleteOrphans = function() {
    var blocks = Blockly.mainWorkspace.getTopBlocks(true);
    // Alert user if a block is sitting on the workspace that perhaps shouldn't be
    // e.g. the rebound block sitting alone can cause odd results
    for (var x = 0, block; block = blocks[x]; x++) {
        if (block.getChildren().length === 0) {
            if (!block.canBeAlone) {
                block.dispose(false, false);
                AlertsMessages.error.displayMsg(Language.alert.blockAlone);
            }
        }
    }
};

/*
 * Decides whether user can level up. Checks to see if the workspace has the blocks required for levelling up.
 */
ProjectBase.prototype.levelUp = function(code) {
    var project = Project.getLastVisited(),
        data    = Project.level;

    if (project != data) {
        return;
    }
    this.deleteOrphans();

    if (this.isLevelComplete(code, data)) {
        this.changeLastUnlocked(data + 1);
        SoundFX.complete.play();
    }
};

/* Unlocks the next level
 * @param  {Number} newLevel, the level you are unlocking
 * Caching of blocks means this must be different to Minecraft
 */
ProjectBase.prototype.changeLastUnlocked = function(newLevel) {
    var self = this;
    this.level = newLevel;

    this.challenge[newLevel].unlock(this.level);
    this.challenge[newLevel - 1].unlock(this.level);

    backend.call('save_level_and_calculate_xp_diff', newLevel, function(xp_gain) {
        var xp_msg,
            code_msg;

        if (newLevel > self.challenge.count) {
            window.location.hash = '#congratulations';
        } else {
            self.levelUpCaching(newLevel);
            window.location.hash = '#levelUp';
        }
    });
};

/**
 * Reads the level from localStorage in browser.
 * @return {number} The level unlocked.
*/
ProjectBase.prototype.readLastUnlocked = function() {
    return Project.level;
};

/*
 * Sends the user to the current level in the system
 */
 ProjectBase.prototype.goToCurrent = function() {
    var level = this.getLastVisited();

    this.switch(level);
};

/*
 * Sends the user to the previous level in the system
 *
 */
ProjectBase.prototype.goToPrev = function() {
    var level = this.getLastVisited();

    this.goToIntro(level - 1);
};

/*
 * Sends the user to the next level in the system
 */
ProjectBase.prototype.goToNext = function() {
    var level = this.getLastVisited();

    this.goToIntro(level + 1);
};

/*
 * Sends the user to the playground
 */
ProjectBase.prototype.goToPlayground = function() {
    var level = this.challenge.count + 1;

    this.goToIntro(level);
};

})();
/**
* Copyright (C) 2014 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Tom Bettany <tom.bettany@kano.me>
* Description: Handles keyboard signals.
*/

var Signal = {};

(function() {
'use strict';

Signal.save = function() {
    if (Utilities.isMenu()) {
        return;
    }

    IO.screenshot.refreshElements();
    location.hash='#saveDialog';
    IO.form.addListeners();
};

Signal.load = function(filepath) {
    if (filepath !== undefined) {
        IO.load.file.local.XMLfromFilename(filepath);
        return;
    }

    if (Utilities.isMenu()) {
        return;
    }

    location.hash='#loadSource';
};

Signal.share = function() {
    if (Utilities.isMenu()) {
        return;
    }

    IO.screenshot.refreshElements();
    location.hash='#shareDialog';
    IO.form.addListeners();
};

Signal.make = function() {
    if (Utilities.isMenu()) {
        return;
    }

    SoundFX.make.play();
    Stats.update();
    IO.screenshot.updateSrc();

    if ('Pong' in window) {
        Pong.savePythonScript();
    } else if ('Minecraft' in window) {
        Minecraft.savePythonScript();
    }
};

})();
