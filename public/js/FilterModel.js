var FilterModel = Backbone.Model.extend({
  defaults: function() {
    return {
      active: false
    }
  },
  initialize: function(){
    if(!this.get('display')) {
      this.set('display', this.get('value'))
    }
    if (this.get('color')) {
      this.createCSSSelector('.' + this.get('value').replace(/ /g, ''), 'background: ' + this.get('color'))
    }
  },
  createCSSSelector: function(selector, style) {
    if (!document.styleSheets) {
      return
    }

    if (document.getElementsByTagName("head").length == 0) {
      return
    }

    var stylesheet
    var mediaType
    if (document.styleSheets.length > 0) {
      for( i = 0; i < document.styleSheets.length; i++) {
        if (document.styleSheets[i].disabled) {
          continue
        }
        var media = document.styleSheets[i].media
        mediaType = typeof media

        if (mediaType == "string") {
          if (media == "" || (media.indexOf("screen") != -1)) {
            styleSheet = document.styleSheets[i]
          }
        } else if (mediaType == "object") {
          if (media.mediaText == "" || (media.mediaText.indexOf("screen") != -1)) {
            styleSheet = document.styleSheets[i]
          }
        }

        if ( typeof styleSheet != "undefined") {
          break
        }
      }
    }

    if ( typeof styleSheet == "undefined") {
      var styleSheetElement = document.createElement("style")
      styleSheetElement.type = "text/css"

      document.getElementsByTagName("head")[0].appendChild(styleSheetElement)

      for( i = 0; i < document.styleSheets.length; i++) {
        if (document.styleSheets[i].disabled) {
          continue
        }
        styleSheet = document.styleSheets[i]
      }

      var media = styleSheet.media
      mediaType = typeof media
    }

    if (mediaType == "string") {
      for( i = 0; i < styleSheet.rules.length; i++) {
        if (styleSheet.rules[i].selectorText && styleSheet.rules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
          styleSheet.rules[i].style.cssText = style
          return
        }
      }

      styleSheet.addRule(selector, style)
    } else if (mediaType == "object") {
      for( i = 0; i < styleSheet.cssRules.length; i++) {
        if (styleSheet.cssRules[i].selectorText && styleSheet.cssRules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
          styleSheet.cssRules[i].style.cssText = style
          return
        }
      }

      styleSheet.insertRule(selector + "{" + style + "}", 0)
    }
  },
  hexToRgb: function(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b
    })

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null
  }
})

module.exports = FilterModel