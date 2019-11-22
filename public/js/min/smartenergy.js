(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var Chromath = require('./src/chromath.js');
module.exports = Chromath;

},{"./src/chromath.js":2}],2:[function(require,module,exports){
var util = require('./util');
/*
   Class: Chromath
*/
// Group: Constructors
/*
   Constructor: Chromath
   Create a new Chromath instance from a string or integer

   Parameters:
   mixed - The value to use for creating the color

   Returns:
   <Chromath> instance

   Properties:
   r - The red channel of the RGB representation of the Chromath. A number between 0 and 255.
   g - The green channel of the RGB representation of the Chromath. A number between 0 and 255.
   b - The blue channel of the RGB representation of the Chromath. A number between 0 and 255.
   a - The alpha channel of the Chromath. A number between 0 and 1.
   h - The hue of the Chromath. A number between 0 and 360.
   sl - The saturation of the HSL representation of the Chromath. A number between 0 and 1.
   sv - The saturation of the HSV/HSB representation of the Chromath. A number between 0 and 1.
   l - The lightness of the HSL representation of the Chromath. A number between 0 and 1.
   v - The lightness of the HSV/HSB representation of the Chromath. A number between 0 and 1.

   Examples:
  (start code)
// There are many ways to create a Chromath instance
new Chromath('#FF0000');                  // Hex (6 characters with hash)
new Chromath('FF0000');                   // Hex (6 characters without hash)
new Chromath('#F00');                     // Hex (3 characters with hash)
new Chromath('F00');                      // Hex (3 characters without hash)
new Chromath('red');                      // CSS/SVG Color name
new Chromath('rgb(255, 0, 0)');           // RGB via CSS
new Chromath({r: 255, g: 0, b: 0});       // RGB via object
new Chromath('rgba(255, 0, 0, 1)');       // RGBA via CSS
new Chromath({r: 255, g: 0, b: 0, a: 1}); // RGBA via object
new Chromath('hsl(0, 100%, 50%)');        // HSL via CSS
new Chromath({h: 0, s: 1, l: 0.5});       // HSL via object
new Chromath('hsla(0, 100%, 50%, 1)');    // HSLA via CSS
new Chromath({h: 0, s: 1, l: 0.5, a: 1}); // HSLA via object
new Chromath('hsv(0, 100%, 100%)');       // HSV via CSS
new Chromath({h: 0, s: 1, v: 1});         // HSV via object
new Chromath('hsva(0, 100%, 100%, 1)');   // HSVA via CSS
new Chromath({h: 0, s: 1, v: 1, a: 1});   // HSVA via object
new Chromath('hsb(0, 100%, 100%)');       // HSB via CSS
new Chromath({h: 0, s: 1, b: 1});         // HSB via object
new Chromath('hsba(0, 100%, 100%, 1)');   // HSBA via CSS
new Chromath({h: 0, s: 1, b: 1, a: 1});   // HSBA via object
new Chromath(16711680);                   // RGB via integer (alpha currently ignored)
(end code)
*/
function Chromath( mixed )
{
    var channels, color, hsl, hsv, rgb;

    if (util.isString(mixed) || util.isNumber(mixed)) {
        channels = Chromath.parse(mixed);
    } else if (util.isArray(mixed)){
        throw new Error('Unsure how to parse array `'+mixed+'`' +
                        ', please pass an object or CSS style ' +
                        'or try Chromath.rgb, Chromath.hsl, or Chromath.hsv'
                       );
    } else if (mixed instanceof Chromath) {
        channels = util.merge({}, mixed);
    } else if (util.isObject(mixed)){
        channels = util.merge({}, mixed);
    }

    if (! channels)
        throw new Error('Could not parse `'+mixed+'`');
    else if (!isFinite(channels.a))
        channels.a = 1;

    if ('r' in channels ){
        rgb = util.rgb.scaled01([channels.r, channels.g, channels.b]);
        hsl = Chromath.rgb2hsl(rgb);
        hsv = Chromath.rgb2hsv(rgb);
    } else if ('h' in channels ){
        if ('l' in channels){
            hsl = util.hsl.scaled([channels.h, channels.s, channels.l]);
            rgb = Chromath.hsl2rgb(hsl);
            hsv = Chromath.rgb2hsv(rgb);
        } else if ('v' in channels || 'b' in channels) {
            if ('b' in channels) channels.v = channels.b;
            hsv = util.hsl.scaled([channels.h, channels.s, channels.v]);
            rgb = Chromath.hsv2rgb(hsv);
            hsl = Chromath.rgb2hsl(rgb);
        }
    }


    util.merge(this, {
        r:  rgb[0],  g: rgb[1], b: rgb[2],
        h:  hsl[0], sl: hsl[1], l: hsl[2],
        sv: hsv[1],  v: hsv[2], a: channels.a
    });

    return this;
}

/*
  Constructor: Chromath.rgb
  Create a new <Chromath> instance from RGB values

  Parameters:
  r - Number, 0-255, representing the green channel OR Array OR object (with keys r,g,b) of RGB values
  g - Number, 0-255, representing the green channel
  b - Number, 0-255, representing the red channel
  a - (Optional) Float, 0-1, representing the alpha channel

 Returns:
 <Chromath>

 Examples:
 > > new Chromath.rgb(123, 234, 56).toString()
 > "#7BEA38"

 > > new Chromath.rgb([123, 234, 56]).toString()
 > "#7BEA38"

 > > new Chromath.rgb({r: 123, g: 234, b: 56}).toString()
 > "#7BEA38"
 */
Chromath.rgb = function (r, g, b, a)
{
    var rgba = util.rgb.fromArgs(r, g, b, a);
    r = rgba[0], g = rgba[1], b = rgba[2], a = rgba[3];

    return new Chromath({r: r, g: g, b: b, a: a});
};

/*
  Constructor: Chromath.rgba
  Alias for <Chromath.rgb>
*/
Chromath.rgba = Chromath.rgb;

/*
  Constructor: Chromath.hsl
  Create a new Chromath instance from HSL values

  Parameters:
  h - Number, -Infinity - Infinity, representing the hue OR Array OR object (with keys h,s,l) of HSL values
  s - Number, 0-1, representing the saturation
  l - Number, 0-1, representing the lightness
  a - (Optional) Float, 0-1, representing the alpha channel

  Returns:
  <Chromath>

  Examples:
  > > new Chromath.hsl(240, 1, 0.5).toString()
  > "#0000FF"

  > > new Chromath.hsl([240, 1, 0.5]).toString()
  > "#0000FF"

  > new Chromath.hsl({h:240, s:1, l:0.5}).toString()
  > "#0000FF"
 */
Chromath.hsl = function (h, s, l, a)
{
    var hsla = util.hsl.fromArgs(h, s, l, a);
    h = hsla[0], s = hsla[1], l = hsla[2], a = hsla[3];

    return new Chromath({h: h, s: s, l: l, a: a});
};

/*
  Constructor: Chromath.hsla
  Alias for <Chromath.hsl>
*/
Chromath.hsla = Chromath.hsl;

/*
  Constructor: Chromath.hsv
  Create a new Chromath instance from HSV values

  Parameters:
  h - Number, -Infinity - Infinity, representing the hue OR Array OR object (with keys h,s,l) of HSV values
  s - Number, 0-1, representing the saturation
  v - Number, 0-1, representing the lightness
  a - (Optional) Float, 0-1, representing the alpha channel

  Returns:
  <Chromath>

  Examples:
  > > new Chromath.hsv(240, 1, 1).toString()
  > "#0000FF"

  > > new Chromath.hsv([240, 1, 1]).toString()
  > "#0000FF"

  > > new Chromath.hsv({h:240, s:1, v:1}).toString()
  > "#0000FF"
 */
Chromath.hsv = function (h, s, v, a)
{
    var hsva = util.hsl.fromArgs(h, s, v, a);
    h = hsva[0], s = hsva[1], v = hsva[2], a = hsva[3];

    return new Chromath({h: h, s: s, v: v, a: a});
};

/*
  Constructor: Chromath.hsva
  Alias for <Chromath.hsv>
*/
Chromath.hsva = Chromath.hsv;

/*
  Constructor: Chromath.hsb
  Alias for <Chromath.hsv>
 */
Chromath.hsb = Chromath.hsv;

/*
   Constructor: Chromath.hsba
   Alias for <Chromath.hsva>
 */
Chromath.hsba = Chromath.hsva;

// Group: Static methods - representation
/*
  Method: Chromath.toInteger
  Convert a color into an integer (alpha channel currently omitted)

  Parameters:
  color - Accepts the same arguments as the Chromath constructor

  Returns:
  integer

  Examples:
  > > Chromath.toInteger('green');
  > 32768

  > > Chromath.toInteger('white');
  > 16777215
*/
Chromath.toInteger = function (color)
{
    // create something like '008000' (green)
    var hex6 = new Chromath(color).hex().join('');

    // Arguments beginning with `0x` are treated as hex values
    return Number('0x' + hex6);
};

/*
  Method: Chromath.toName
  Return the W3C color name of the color it matches

  Parameters:
  comparison

  Examples:
  > > Chromath.toName('rgb(255, 0, 255)');
  > 'fuchsia'

  > > Chromath.toName(65535);
  > 'aqua'
*/
Chromath.toName = function (comparison)
{
    comparison = +new Chromath(comparison);
    for (var color in Chromath.colors) if (+Chromath[color] == comparison) return color;
};

// Group: Static methods - color conversion
/*
  Method: Chromath.rgb2hex
  Convert an RGB value to a Hex value

  Returns: array

  Example:
  > > Chromath.rgb2hex(50, 100, 150)
  > "[32, 64, 96]"
 */
Chromath.rgb2hex = function rgb2hex(r, g, b)
{
    var rgb = util.rgb.scaled01(r, g, b);
    var hex = rgb.map(function (pct) {
      var dec = Math.round(pct * 255);
      var hex = dec.toString(16).toUpperCase();
      return util.lpad(hex, 2, 0);
    });

    return hex;
};

// Converted from http://en.wikipedia.org/wiki/HSL_and_HSV#General_approach
/*
  Method: Chromath.rgb2hsl
  Convert RGB to HSL

  Parameters:
  r - Number, 0-255, representing the green channel OR Array OR object (with keys r,g,b) of RGB values
  g - Number, 0-255, representing the green channel
  b - Number, 0-255, representing the red channel

  Returns: array

  > > Chromath.rgb2hsl(0, 255, 0);
  > [ 120, 1, 0.5 ]

  > > Chromath.rgb2hsl([0, 0, 255]);
  > [ 240, 1, 0.5 ]

  > > Chromath.rgb2hsl({r: 255, g: 0, b: 0});
  > [ 0, 1, 0.5 ]
 */
Chromath.rgb2hsl = function rgb2hsl(r, g, b)
{
    var rgb = util.rgb.scaled01(r, g, b);
    r = rgb[0], g = rgb[1], b = rgb[2];

    var M = Math.max(r, g, b);
    var m = Math.min(r, g, b);
    var C = M - m;
    var L = 0.5*(M + m);
    var S = (C === 0) ? 0 : C/(1-Math.abs(2*L-1));

    var h;
    if (C === 0) h = 0; // spec'd as undefined, but usually set to 0
    else if (M === r) h = ((g-b)/C) % 6;
    else if (M === g) h = ((b-r)/C) + 2;
    else if (M === b) h = ((r-g)/C) + 4;

    var H = 60 * h;

    return [H, parseFloat(S), parseFloat(L)];
};

/*
  Method: Chromath.rgb2hsv
  Convert RGB to HSV

  Parameters:
  r - Number, 0-255, representing the green channel OR Array OR object (with keys r,g,b) of RGB values
  g - Number, 0-255, representing the green channel
  b - Number, 0-255, representing the red channel

  Returns:
  Array

  > > Chromath.rgb2hsv(0, 255, 0);
  > [ 120, 1, 1 ]

  > > Chromath.rgb2hsv([0, 0, 255]);
  > [ 240, 1, 1 ]

  > > Chromath.rgb2hsv({r: 255, g: 0, b: 0});
  > [ 0, 1, 1 ]
 */
Chromath.rgb2hsv = function rgb2hsv(r, g, b)
{
    var rgb = util.rgb.scaled01(r, g, b);
    r = rgb[0], g = rgb[1], b = rgb[2];

    var M = Math.max(r, g, b);
    var m = Math.min(r, g, b);
    var C = M - m;
    var L = M;
    var S = (C === 0) ? 0 : C/M;

    var h;
    if (C === 0) h = 0; // spec'd as undefined, but usually set to 0
    else if (M === r) h = ((g-b)/C) % 6;
    else if (M === g) h = ((b-r)/C) + 2;
    else if (M === b) h = ((r-g)/C) + 4;

    var H = 60 * h;

    return [H, parseFloat(S), parseFloat(L)];
};

/*
   Method: Chromath.rgb2hsb
   Alias for <Chromath.rgb2hsv>
 */
Chromath.rgb2hsb = Chromath.rgb2hsv;

/*
  Method: Chromath.hsl2rgb
  Convert from HSL to RGB

  Parameters:
  h - Number, -Infinity - Infinity, representing the hue OR Array OR object (with keys h,s,l) of HSL values
  s - Number, 0-1, representing the saturation
  l - Number, 0-1, representing the lightness

  Returns:
  array

  Examples:
  > > Chromath.hsl2rgb(360, 1, 0.5);
  > [ 255, 0, 0 ]

  > > Chromath.hsl2rgb([0, 1, 0.5]);
  > [ 255, 0, 0 ]

  > > Chromath.hsl2rgb({h: 210, s:1, v: 0.5});
  > [ 0, 127.5, 255 ]
 */
// TODO: Can I %= hp and then do a switch?
Chromath.hsl2rgb = function hsl2rgb(h, s, l)
{
    var hsl = util.hsl.scaled(h, s, l);
    h=hsl[0], s=hsl[1], l=hsl[2];

    var C = (1 - Math.abs(2*l-1)) * s;
    var hp = h/60;
    var X = C * (1-Math.abs(hp%2-1));
    var rgb, m;

    switch (Math.floor(hp)){
    case 0:  rgb = [C,X,0]; break;
    case 1:  rgb = [X,C,0]; break;
    case 2:  rgb = [0,C,X]; break;
    case 3:  rgb = [0,X,C]; break;
    case 4:  rgb = [X,0,C]; break;
    case 5:  rgb = [C,0,X]; break;
    default: rgb = [0,0,0];
    }

    m = l - (C/2);

    return [
        (rgb[0]+m),
        (rgb[1]+m),
        (rgb[2]+m)
    ];
};

/*
  Method: Chromath.hsv2rgb
  Convert HSV to RGB

  Parameters:
  h - Number, -Infinity - Infinity, representing the hue OR Array OR object (with keys h,s,v or h,s,b) of HSV values
  s - Number, 0-1, representing the saturation
  v - Number, 0-1, representing the lightness

  Examples:
  > > Chromath.hsv2rgb(360, 1, 1);
  > [ 255, 0, 0 ]

  > > Chromath.hsv2rgb([0, 1, 0.5]);
  > [ 127.5, 0, 0 ]

  > > Chromath.hsv2rgb({h: 210, s: 0.5, v: 1});
  > [ 127.5, 191.25, 255 ]
 */
Chromath.hsv2rgb = function hsv2rgb(h, s, v)
{
    var hsv = util.hsl.scaled(h, s, v);
    h=hsv[0], s=hsv[1], v=hsv[2];

    var C = v * s;
    var hp = h/60;
    var X = C*(1-Math.abs(hp%2-1));
    var rgb, m;

    if (h == undefined)         rgb = [0,0,0];
    else if (0 <= hp && hp < 1) rgb = [C,X,0];
    else if (1 <= hp && hp < 2) rgb = [X,C,0];
    else if (2 <= hp && hp < 3) rgb = [0,C,X];
    else if (3 <= hp && hp < 4) rgb = [0,X,C];
    else if (4 <= hp && hp < 5) rgb = [X,0,C];
    else if (5 <= hp && hp < 6) rgb = [C,0,X];

    m = v - C;

    return [
        (rgb[0]+m),
        (rgb[1]+m),
        (rgb[2]+m)
    ];
};

/*
   Method: Chromath.hsb2rgb
   Alias for <Chromath.hsv2rgb>
 */
Chromath.hsb2rgb = Chromath.hsv2rgb;

/*
    Property: Chromath.convert
    Aliases for the Chromath.x2y functions.
    Use like Chromath.convert[x][y](args) or Chromath.convert.x.y(args)
*/
Chromath.convert = {
    rgb: {
        hex: Chromath.hsv2rgb,
        hsl: Chromath.rgb2hsl,
        hsv: Chromath.rgb2hsv
    },
    hsl: {
        rgb: Chromath.hsl2rgb
    },
    hsv: {
        rgb: Chromath.hsv2rgb
    }
};

/* Group: Static methods - color scheme */
/*
  Method: Chromath.complement
  Return the complement of the given color

  Returns: <Chromath>

  > > Chromath.complement(new Chromath('red'));
  > { r: 0, g: 255, b: 255, a: 1, h: 180, sl: 1, sv: 1, l: 0.5, v: 1 }

  > > Chromath.complement(new Chromath('red')).toString();
  > '#00FFFF'
 */
Chromath.complement = function (color)
{
    var c = new Chromath(color);
    var hsl = c.toHSLObject();

    hsl.h = (hsl.h + 180) % 360;

    return new Chromath(hsl);
};

/*
  Method: Chromath.triad
  Create a triad color scheme from the given Chromath.

  Examples:
  > > Chromath.triad(Chromath.yellow)
  > [ { r: 255, g: 255, b: 0, a: 1, h: 60, sl: 1, sv: 1, l: 0.5, v: 1 },
  >   { r: 0, g: 255, b: 255, a: 1, h: 180, sl: 1, sv: 1, l: 0.5, v: 1 },
  >   { r: 255, g: 0, b: 255, a: 1, h: 300, sl: 1, sv: 1, l: 0.5, v: 1 } ]

 > > Chromath.triad(Chromath.yellow).toString();
 > '#FFFF00,#00FFFF,#FF00FF'
*/
Chromath.triad = function (color)
{
    var c = new Chromath(color);

    return [
        c,
        new Chromath({r: c.b, g: c.r, b: c.g}),
        new Chromath({r: c.g, g: c.b, b: c.r})
    ];
};

/*
  Method: Chromath.tetrad
  Create a tetrad color scheme from the given Chromath.

  Examples:
  > > Chromath.tetrad(Chromath.cyan)
  > [ { r: 0, g: 255, b: 255, a: 1, h: 180, sl: 1, sv: 1, l: 0.5, v: 1 },
  >   { r: 255, g: 0, b: 255, a: 1, h: 300, sl: 1, sv: 1, l: 0.5, v: 1 },
  >   { r: 255, g: 255, b: 0, a: 1, h: 60, sl: 1, sv: 1, l: 0.5, v: 1 },
  >   { r: 0, g: 255, b: 0, a: 1, h: 120, sl: 1, sv: 1, l: 0.5, v: 1 } ]

  > > Chromath.tetrad(Chromath.cyan).toString();
  > '#00FFFF,#FF00FF,#FFFF00,#00FF00'
*/
Chromath.tetrad = function (color)
{
    var c = new Chromath(color);

    return [
        c,
        new Chromath({r: c.b, g: c.r, b: c.b}),
        new Chromath({r: c.b, g: c.g, b: c.r}),
        new Chromath({r: c.r, g: c.b, b: c.r})
    ];
};

/*
  Method: Chromath.analogous
  Find analogous colors from a given color

  Parameters:
  mixed - Any argument which is passed to <Chromath>
  results - How many colors to return (default = 3)
  slices - How many pieces are in the color wheel (default = 12)

  Examples:
  > > Chromath.analogous(new Chromath('rgb(0, 255, 255)'))
  > [ { r: 0, g: 255, b: 255, a: 1, h: 180, sl: 1, sv: 1, l: 0.5, v: 1 },
  >   { r: 0, g: 255, b: 101, a: 1, h: 144, sl: 1, sv: 1, l: 0.5, v: 1 },
  >   { r: 0, g: 255, b: 153, a: 1, h: 156, sl: 1, sv: 1, l: 0.5, v: 1 },
  >   { r: 0, g: 255, b: 203, a: 1, h: 168, sl: 1, sv: 1, l: 0.5, v: 1 },
  >   { r: 0, g: 255, b: 255, a: 1, h: 180, sl: 1, sv: 1, l: 0.5, v: 1 },
  >   { r: 0, g: 203, b: 255, a: 1, h: 192, sl: 1, sv: 1, l: 0.5, v: 1 },
  >   { r: 0, g: 153, b: 255, a: 1, h: 204, sl: 1, sv: 1, l: 0.5, v: 1 },
  >   { r: 0, g: 101, b: 255, a: 1, h: 216, sl: 1, sv: 1, l: 0.5, v: 1 } ]

  > > Chromath.analogous(new Chromath('rgb(0, 255, 255)')).toString()
  > '#00FFFF,#00FF65,#00FF99,#00FFCB,#00FFFF,#00CBFF,#0099FF,#0065FF'
 */
Chromath.analogous = function (color, results, slices)
{
    if (!isFinite(results)) results = 3;
    if (!isFinite(slices)) slices = 12;

    var c = new Chromath(color);
    var hsv = c.toHSVObject();
    var slice = 360 / slices;
    var ret = [ c ];

    hsv.h = ((hsv.h - (slices * results >> 1)) + 720) % 360;
    while (--results) {
        hsv.h = (hsv.h + slice) % 360;
        ret.push(new Chromath(hsv));
    }

    return ret;
};

/*
  Method: Chromath.monochromatic
  Return a series of the given color at various lightnesses

  Examples:
  > > Chromath.monochromatic('rgb(0, 100, 255)').forEach(function (c){ console.log(c.toHSVString()); })
  > hsv(216,100%,20%)
  > hsv(216,100%,40%)
  > hsv(216,100%,60%)
  > hsv(216,100%,80%)
  > hsv(216,100%,100%)
*/
Chromath.monochromatic = function (color, results)
{
    if (!results) results = 5;

    var c = new Chromath(color);
    var hsv = c.toHSVObject();
    var inc = 1 / results;
    var ret = [], step = 0;

    while (step++ < results) {
        hsv.v = step * inc;
        ret.push(new Chromath(hsv));
    }

    return ret;
};

/*
  Method: Chromath.splitcomplement
  Generate a split complement color scheme from the given color

  Examples:
  > > Chromath.splitcomplement('rgb(0, 100, 255)')
  > [ { r: 0, g: 100, b: 255, h: 216.47058823529414, sl: 1, l: 0.5, sv: 1, v: 1, a: 1 },
  >   { r: 255, g: 183, b: 0, h: 43.19999999999999, sl: 1, l: 0.5, sv: 1, v: 1, a: 1 },
  >   { r: 255, g: 73, b: 0, h: 17.279999999999973, sl: 1, l: 0.5, sv: 1, v: 1, a: 1 } ]

  > > Chromath.splitcomplement('rgb(0, 100, 255)').toString()
  > '#0064FF,#FFB700,#FF4900'
 */
Chromath.splitcomplement = function (color)
{
    var ref = new Chromath(color);
    var hsv = ref.toHSVObject();

    var a = new Chromath.hsv({
        h: (hsv.h + 150) % 360,
        s: hsv.s,
        v: hsv.v
    });

    var b = new Chromath.hsv({
        h: (hsv.h + 210) % 360,
        s: hsv.s,
        v: hsv.v
    });

    return [ref, a, b];
};

//Group: Static methods - color alteration
/*
  Method: Chromath.tint
  Lighten a color by adding a percentage of white to it

  Returns <Chromath>

  > > Chromath.tint('rgb(0, 100, 255)', 0.5).toRGBString();
  > 'rgb(127,177,255)'
*/
Chromath.tint = function ( from, by )
{
    return Chromath.towards( from, '#FFFFFF', by );
};

/*
   Method: Chromath.lighten
   Alias for <Chromath.tint>
*/
Chromath.lighten = Chromath.tint;

/*
  Method: Chromath.shade
  Darken a color by adding a percentage of black to it

  Example:
  > > Chromath.darken('rgb(0, 100, 255)', 0.5).toRGBString();
  > 'rgb(0,50,127)'
 */
Chromath.shade = function ( from, by )
{
    return Chromath.towards( from, '#000000', by );
};

/*
   Method: Chromath.darken
   Alias for <Chromath.shade>
 */
Chromath.darken = Chromath.shade;

/*
  Method: Chromath.desaturate
  Desaturate a color using any of 3 approaches

  Parameters:
  color - any argument accepted by the <Chromath> constructor
  formula - The formula to use (from <xarg's greyfilter at http://www.xarg.org/project/jquery-color-plugin-xcolor>)
  - 1 - xarg's own formula
  - 2 - Sun's formula: (1 - avg) / (100 / 35) + avg)
  - empty - The oft-seen 30% red, 59% green, 11% blue formula

  Examples:
  > > Chromath.desaturate('red').toString()
  > "#4C4C4C"

  > > Chromath.desaturate('red', 1).toString()
  > "#373737"

  > > Chromath.desaturate('red', 2).toString()
  > "#909090"
*/
Chromath.desaturate = function (color, formula)
{
    var c = new Chromath(color), rgb, avg;

    switch (formula) {
    case 1: // xarg's formula
        avg = .35 + 13 * (c.r + c.g + c.b) / 60; break;
    case 2: // Sun's formula: (1 - avg) / (100 / 35) + avg)
        avg = (13 * (c.r + c.g + c.b) + 5355) / 60; break;
    default:
        avg = c.r * .3 + c.g * .59 + c.b * .11;
    }

    avg = util.clamp(avg, 0, 255);
    rgb = {r: avg, g: avg, b: avg};

    return new Chromath(rgb);
};

/*
  Method: Chromath.greyscale
  Alias for <Chromath.desaturate>
*/
Chromath.greyscale = Chromath.desaturate;

/*
  Method: Chromath.websafe
  Convert a color to one of the 216 "websafe" colors

  Examples:
  > > Chromath.websafe('#ABCDEF').toString()
  > '#99CCFF'

  > > Chromath.websafe('#BBCDEF').toString()
  > '#CCCCFF'
 */
Chromath.websafe = function (color)
{
    color = new Chromath(color);

    color.r = Math.round(color.r / 51) * 51;
    color.g = Math.round(color.g / 51) * 51;
    color.b = Math.round(color.b / 51) * 51;

    return new Chromath(color);
};

//Group: Static methods - color combination
/*
  Method: Chromath.additive
  Combine any number colors using additive color

  Examples:
  > > Chromath.additive('#F00', '#0F0').toString();
  > '#FFFF00'

  > > Chromath.additive('#F00', '#0F0').toString() == Chromath.yellow.toString();
  > true

  > > Chromath.additive('red', '#0F0', 'rgb(0, 0, 255)').toString() == Chromath.white.toString();
  > true
 */
Chromath.additive = function ()
{
    var args = arguments.length-2, i=-1, a, b;
    while (i++ < args){

        a = a || new Chromath(arguments[i]);
        b = new Chromath(arguments[i+1]);

        if ((a.r += b.r) > 255) a.r = 255;
        if ((a.g += b.g) > 255) a.g = 255;
        if ((a.b += b.b) > 255) a.b = 255;

        a = new Chromath(a);
    }

    return a;
};

/*
  Method: Chromath.subtractive
  Combine any number of colors using subtractive color

  Examples:
  > > Chromath.subtractive('yellow', 'magenta').toString();
  > '#FF0000'

  > > Chromath.subtractive('yellow', 'magenta').toString() === Chromath.red.toString();
  > true

  > > Chromath.subtractive('cyan', 'magenta', 'yellow').toString();
  > '#000000'

  > > Chromath.subtractive('red', '#0F0', 'rgb(0, 0, 255)').toString();
  > '#000000'
*/
Chromath.subtractive = function ()
{
    var args = arguments.length-2, i=-1, a, b;
    while (i++ < args){

        a = a || new Chromath(arguments[i]);
        b = new Chromath(arguments[i+1]);

        if ((a.r += b.r - 255) < 0) a.r = 0;
        if ((a.g += b.g - 255) < 0) a.g = 0;
        if ((a.b += b.b - 255) < 0) a.b = 0;

        a = new Chromath(a);
    }

    return a;
};

/*
  Method: Chromath.multiply
  Multiply any number of colors

  Examples:
  > > Chromath.multiply(Chromath.lightgoldenrodyellow, Chromath.lightblue).toString();
  > "#A9D3BD"

  > > Chromath.multiply(Chromath.oldlace, Chromath.lightblue, Chromath.darkblue).toString();
  > "#000070"
*/
Chromath.multiply = function ()
{
    var args = arguments.length-2, i=-1, a, b;
    while (i++ < args){

        a = a || new Chromath(arguments[i]);
        b = new Chromath(arguments[i+1]);

        a.r = (a.r / 255 * b.r)|0;
        a.g = (a.g / 255 * b.g)|0;
        a.b = (a.b / 255 * b.b)|0;

        a = new Chromath(a);
    }

    return a;
};

/*
  Method: Chromath.average
  Averages any number of colors

  Examples:
  > > Chromath.average(Chromath.lightgoldenrodyellow, Chromath.lightblue).toString()
  > "#D3E9DC"

  > > Chromath.average(Chromath.oldlace, Chromath.lightblue, Chromath.darkblue).toString()
  > "#6A73B8"
 */
Chromath.average = function ()
{
    var args = arguments.length-2, i=-1, a, b;
    while (i++ < args){

        a = a || new Chromath(arguments[i]);
        b = new Chromath(arguments[i+1]);

        a.r = (a.r + b.r) >> 1;
        a.g = (a.g + b.g) >> 1;
        a.b = (a.b + b.b) >> 1;

        a = new Chromath(a);
    }

    return a;
};

/*
  Method: Chromath.overlay
  Add one color on top of another with a given transparency

  Examples:
  > > Chromath.average(Chromath.lightgoldenrodyellow, Chromath.lightblue).toString()
  > "#D3E9DC"

  > > Chromath.average(Chromath.oldlace, Chromath.lightblue, Chromath.darkblue).toString()
  > "#6A73B8"
 */
Chromath.overlay = function (top, bottom, opacity)
{
    var a = new Chromath(top);
    var b = new Chromath(bottom);

    if (opacity > 1) opacity /= 100;
    opacity = util.clamp(opacity - 1 + b.a, 0, 1);

    return new Chromath({
        r: util.lerp(a.r, b.r, opacity),
        g: util.lerp(a.g, b.g, opacity),
        b: util.lerp(a.b, b.b, opacity)
    });
};


//Group: Static methods - other
/*
  Method: Chromath.towards
  Move from one color towards another by the given percentage (0-1, 0-100)

  Parameters:
  from - The starting color
  to - The destination color
  by - The percentage, expressed as a floating number between 0 and 1, to move towards the destination color
  interpolator - The function to use for interpolating between the two points. Defaults to Linear Interpolation. Function has the signature `(from, to, by)` with the parameters having the same meaning as those in `towards`.

  > > Chromath.towards('red', 'yellow', 0.5).toString()
  > "#FF7F00"
*/
Chromath.towards = function (from, to, by, interpolator)
{
    if (!to) { return from; }
    if (!isFinite(by))
        throw new Error('TypeError: `by`(' + by  +') should be between 0 and 1');
    if (!(from instanceof Chromath)) from = new Chromath(from);
    if (!(to instanceof Chromath)) to = new Chromath(to || '#FFFFFF');
    if (!interpolator) interpolator = util.lerp;
    by = parseFloat(by);

    return new Chromath({
        r: interpolator(from.r, to.r, by),
        g: interpolator(from.g, to.g, by),
        b: interpolator(from.b, to.b, by),
        a: interpolator(from.a, to.a, by)
    });
};

/*
  Method: Chromath.gradient
  Create an array of Chromath objects

  Parameters:
  from - The beginning color of the gradient
  to - The end color of the gradient
  slices - The number of colors in the array
  slice - The color at a specific, 1-based, slice index

  Examples:
  > > Chromath.gradient('red', 'yellow').length;
  > 20

  > > Chromath.gradient('red', 'yellow', 5).toString();
  > "#FF0000,#FF3F00,#FF7F00,#FFBF00,#FFFF00"

  > > Chromath.gradient('red', 'yellow', 5, 2).toString();
  > "#FF7F00"

  > > Chromath.gradient('red', 'yellow', 5)[2].toString();
  > "#FF7F00"
 */
Chromath.gradient = function (from, to, slices, slice)
{
    var gradient = [], stops;

    if (! slices) slices = 20;
    stops = (slices-1);

    if (isFinite(slice)) return Chromath.towards(from, to, slice/stops);
    else slice = -1;

    while (++slice < slices){
        gradient.push(Chromath.towards(from, to, slice/stops));
    }

    return gradient;
};

/*
  Method: Chromath.parse
  Iterate through the objects set in Chromath.parsers and, if a match is made, return the value specified by the matching parsers `process` function

  Parameters:
  string - The string to parse

  Example:
  > > Chromath.parse('rgb(0, 128, 255)')
  > { r: 0, g: 128, b: 255, a: undefined }
 */
Chromath.parse = function (string)
{
    var parsers = Chromath.parsers, i, l, parser, parts, channels;

    for (i = 0, l = parsers.length; i < l; i++) {
        parser = parsers[i];
        parts = parser.regex.exec(string);
        if (parts && parts.length) channels = parser.process.apply(this, parts);
        if (channels) return channels;
    }
};

// Group: Static properties
/*
  Property: Chromath.parsers
   An array of objects for attempting to convert a string describing a color into an object containing the various channels. No user action is required but parsers can be

   Object properties:
   regex - regular expression used to test the string or numeric input
   process - function which is passed the results of `regex.match` and returns an object with either the rgb, hsl, hsv, or hsb channels of the Chromath.

   Examples:
(start code)
// Add a parser
Chromath.parsers.push({
    example: [3554431, 16809984],
    regex: /^\d+$/,
    process: function (color){
        return {
            r: color >> 16 & 255,
            g: color >> 8 & 255,
            b: color & 255
        };
    }
});
(end code)
(start code)
// Override entirely
Chromath.parsers = [
   {
       example: [3554431, 16809984],
       regex: /^\d+$/,
       process: function (color){
           return {
               r: color >> 16 & 255,
               g: color >> 8 & 255,
               b: color & 255
           };
       }
   },

   {
       example: ['#fb0', 'f0f'],
       regex: /^#?([\dA-F]{1})([\dA-F]{1})([\dA-F]{1})$/i,
       process: function (hex, r, g, b){
           return {
               r: parseInt(r + r, 16),
               g: parseInt(g + g, 16),
               b: parseInt(b + b, 16)
           };
       }
   }
(end code)
 */
Chromath.parsers = require('./parsers').parsers;

// Group: Instance methods - color representation
Chromath.prototype = require('./prototype')(Chromath);

/*
  Property: Chromath.colors
  Object, indexed by SVG/CSS color name, of <Chromath> instances
  The color names from CSS and SVG 1.0

  Examples:
  > > Chromath.colors.aliceblue.toRGBArray()
  > [240, 248, 255]

  > > Chromath.colors.beige.toString()
  > "#F5F5DC"

  > // Can also be accessed without `.color`
  > > Chromath.aliceblue.toRGBArray()
  > [240, 248, 255]

  > > Chromath.beige.toString()
  > "#F5F5DC"
*/
var css2Colors  = require('./colornames_css2');
var css3Colors  = require('./colornames_css3');
var allColors   = util.merge({}, css2Colors, css3Colors);
Chromath.colors = {};
for (var colorName in allColors) {
    // e.g., Chromath.wheat and Chromath.colors.wheat
    Chromath[colorName] = Chromath.colors[colorName] = new Chromath(allColors[colorName]);
}
// add a parser for the color names
Chromath.parsers.push({
    example: ['red', 'burlywood'],
    regex: /^[a-z]+$/i,
    process: function (colorName){
        if (Chromath.colors[colorName]) return Chromath.colors[colorName];
    }
});

module.exports = Chromath;

},{"./colornames_css2":3,"./colornames_css3":4,"./parsers":5,"./prototype":6,"./util":7}],3:[function(require,module,exports){
module.exports = {
    // from http://www.w3.org/TR/REC-html40/types.html#h-6.5
    aqua    : {r: 0,   g: 255, b: 255},
    black   : {r: 0,   g: 0,   b: 0},
    blue    : {r: 0,   g: 0,   b: 255},
    fuchsia : {r: 255, g: 0,   b: 255},
    gray    : {r: 128, g: 128, b: 128},
    green   : {r: 0,   g: 128, b: 0},
    lime    : {r: 0,   g: 255, b: 0},
    maroon  : {r: 128, g: 0,   b: 0},
    navy    : {r: 0,   g: 0,   b: 128},
    olive   : {r: 128, g: 128, b: 0},
    purple  : {r: 128, g: 0,   b: 128},
    red     : {r: 255, g: 0,   b: 0},
    silver  : {r: 192, g: 192, b: 192},
    teal    : {r: 0,   g: 128, b: 128},
    white   : {r: 255, g: 255, b: 255},
    yellow  : {r: 255, g: 255, b: 0}
};

},{}],4:[function(require,module,exports){
module.exports = {
    // http://www.w3.org/TR/css3-color/#svg-color
    // http://www.w3.org/TR/SVG/types.html#ColorKeywords
    aliceblue            : {r: 240, g: 248, b: 255},
    antiquewhite         : {r: 250, g: 235, b: 215},
    aquamarine           : {r: 127, g: 255, b: 212},
    azure                : {r: 240, g: 255, b: 255},
    beige                : {r: 245, g: 245, b: 220},
    bisque               : {r: 255, g: 228, b: 196},
    blanchedalmond       : {r: 255, g: 235, b: 205},
    blueviolet           : {r: 138, g: 43,  b: 226},
    brown                : {r: 165, g: 42,  b: 42},
    burlywood            : {r: 222, g: 184, b: 135},
    cadetblue            : {r: 95,  g: 158, b: 160},
    chartreuse           : {r: 127, g: 255, b: 0},
    chocolate            : {r: 210, g: 105, b: 30},
    coral                : {r: 255, g: 127, b: 80},
    cornflowerblue       : {r: 100, g: 149, b: 237},
    cornsilk             : {r: 255, g: 248, b: 220},
    crimson              : {r: 220, g: 20,  b: 60},
    cyan                 : {r: 0,   g: 255, b: 255},
    darkblue             : {r: 0,   g: 0,   b: 139},
    darkcyan             : {r: 0,   g: 139, b: 139},
    darkgoldenrod        : {r: 184, g: 134, b: 11},
    darkgray             : {r: 169, g: 169, b: 169},
    darkgreen            : {r: 0,   g: 100, b: 0},
    darkgrey             : {r: 169, g: 169, b: 169},
    darkkhaki            : {r: 189, g: 183, b: 107},
    darkmagenta          : {r: 139, g: 0,   b: 139},
    darkolivegreen       : {r: 85,  g: 107, b: 47},
    darkorange           : {r: 255, g: 140, b: 0},
    darkorchid           : {r: 153, g: 50,  b: 204},
    darkred              : {r: 139, g: 0,   b: 0},
    darksalmon           : {r: 233, g: 150, b: 122},
    darkseagreen         : {r: 143, g: 188, b: 143},
    darkslateblue        : {r: 72,  g: 61,  b: 139},
    darkslategray        : {r: 47,  g: 79,  b: 79},
    darkslategrey        : {r: 47,  g: 79,  b: 79},
    darkturquoise        : {r: 0,   g: 206, b: 209},
    darkviolet           : {r: 148, g: 0,   b: 211},
    deeppink             : {r: 255, g: 20,  b: 147},
    deepskyblue          : {r: 0,   g: 191, b: 255},
    dimgray              : {r: 105, g: 105, b: 105},
    dimgrey              : {r: 105, g: 105, b: 105},
    dodgerblue           : {r: 30,  g: 144, b: 255},
    firebrick            : {r: 178, g: 34,  b: 34},
    floralwhite          : {r: 255, g: 250, b: 240},
    forestgreen          : {r: 34,  g: 139, b: 34},
    gainsboro            : {r: 220, g: 220, b: 220},
    ghostwhite           : {r: 248, g: 248, b: 255},
    gold                 : {r: 255, g: 215, b: 0},
    goldenrod            : {r: 218, g: 165, b: 32},
    greenyellow          : {r: 173, g: 255, b: 47},
    grey                 : {r: 128, g: 128, b: 128},
    honeydew             : {r: 240, g: 255, b: 240},
    hotpink              : {r: 255, g: 105, b: 180},
    indianred            : {r: 205, g: 92,  b: 92},
    indigo               : {r: 75,  g: 0,   b: 130},
    ivory                : {r: 255, g: 255, b: 240},
    khaki                : {r: 240, g: 230, b: 140},
    lavender             : {r: 230, g: 230, b: 250},
    lavenderblush        : {r: 255, g: 240, b: 245},
    lawngreen            : {r: 124, g: 252, b: 0},
    lemonchiffon         : {r: 255, g: 250, b: 205},
    lightblue            : {r: 173, g: 216, b: 230},
    lightcoral           : {r: 240, g: 128, b: 128},
    lightcyan            : {r: 224, g: 255, b: 255},
    lightgoldenrodyellow : {r: 250, g: 250, b: 210},
    lightgray            : {r: 211, g: 211, b: 211},
    lightgreen           : {r: 144, g: 238, b: 144},
    lightgrey            : {r: 211, g: 211, b: 211},
    lightpink            : {r: 255, g: 182, b: 193},
    lightsalmon          : {r: 255, g: 160, b: 122},
    lightseagreen        : {r: 32,  g: 178, b: 170},
    lightskyblue         : {r: 135, g: 206, b: 250},
    lightslategray       : {r: 119, g: 136, b: 153},
    lightslategrey       : {r: 119, g: 136, b: 153},
    lightsteelblue       : {r: 176, g: 196, b: 222},
    lightyellow          : {r: 255, g: 255, b: 224},
    limegreen            : {r: 50,  g: 205, b: 50},
    linen                : {r: 250, g: 240, b: 230},
    magenta              : {r: 255, g: 0,   b: 255},
    mediumaquamarine     : {r: 102, g: 205, b: 170},
    mediumblue           : {r: 0,   g: 0,   b: 205},
    mediumorchid         : {r: 186, g: 85,  b: 211},
    mediumpurple         : {r: 147, g: 112, b: 219},
    mediumseagreen       : {r: 60,  g: 179, b: 113},
    mediumslateblue      : {r: 123, g: 104, b: 238},
    mediumspringgreen    : {r: 0,   g: 250, b: 154},
    mediumturquoise      : {r: 72,  g: 209, b: 204},
    mediumvioletred      : {r: 199, g: 21,  b: 133},
    midnightblue         : {r: 25,  g: 25,  b: 112},
    mintcream            : {r: 245, g: 255, b: 250},
    mistyrose            : {r: 255, g: 228, b: 225},
    moccasin             : {r: 255, g: 228, b: 181},
    navajowhite          : {r: 255, g: 222, b: 173},
    oldlace              : {r: 253, g: 245, b: 230},
    olivedrab            : {r: 107, g: 142, b: 35},
    orange               : {r: 255, g: 165, b: 0},
    orangered            : {r: 255, g: 69,  b: 0},
    orchid               : {r: 218, g: 112, b: 214},
    palegoldenrod        : {r: 238, g: 232, b: 170},
    palegreen            : {r: 152, g: 251, b: 152},
    paleturquoise        : {r: 175, g: 238, b: 238},
    palevioletred        : {r: 219, g: 112, b: 147},
    papayawhip           : {r: 255, g: 239, b: 213},
    peachpuff            : {r: 255, g: 218, b: 185},
    peru                 : {r: 205, g: 133, b: 63},
    pink                 : {r: 255, g: 192, b: 203},
    plum                 : {r: 221, g: 160, b: 221},
    powderblue           : {r: 176, g: 224, b: 230},
    rosybrown            : {r: 188, g: 143, b: 143},
    royalblue            : {r: 65,  g: 105, b: 225},
    saddlebrown          : {r: 139, g: 69,  b: 19},
    salmon               : {r: 250, g: 128, b: 114},
    sandybrown           : {r: 244, g: 164, b: 96},
    seagreen             : {r: 46,  g: 139, b: 87},
    seashell             : {r: 255, g: 245, b: 238},
    sienna               : {r: 160, g: 82,  b: 45},
    skyblue              : {r: 135, g: 206, b: 235},
    slateblue            : {r: 106, g: 90,  b: 205},
    slategray            : {r: 112, g: 128, b: 144},
    slategrey            : {r: 112, g: 128, b: 144},
    snow                 : {r: 255, g: 250, b: 250},
    springgreen          : {r: 0,   g: 255, b: 127},
    steelblue            : {r: 70,  g: 130, b: 180},
    tan                  : {r: 210, g: 180, b: 140},
    thistle              : {r: 216, g: 191, b: 216},
    tomato               : {r: 255, g: 99,  b: 71},
    turquoise            : {r: 64,  g: 224, b: 208},
    violet               : {r: 238, g: 130, b: 238},
    wheat                : {r: 245, g: 222, b: 179},
    whitesmoke           : {r: 245, g: 245, b: 245},
    yellowgreen          : {r: 154, g: 205, b: 50}
}

},{}],5:[function(require,module,exports){
var util = require('./util');

module.exports = {
    parsers: [
        {
            example: [3554431, 16809984],
            regex: /^\d+$/,
            process: function (color){
                return {
                    //a: color >> 24 & 255,
                    r: color >> 16 & 255,
                    g: color >> 8 & 255,
                    b: color & 255
                };
            }
        },

        {
            example: ['#fb0', 'f0f'],
            regex: /^#?([\dA-F]{1})([\dA-F]{1})([\dA-F]{1})$/i,
            process: function (hex, r, g, b){
                return {
                    r: parseInt(r + r, 16),
                    g: parseInt(g + g, 16),
                    b: parseInt(b + b, 16)
                };
            }
        },

        {
            example: ['#00ff00', '336699'],
            regex: /^#?([\dA-F]{2})([\dA-F]{2})([\dA-F]{2})$/i,
            process: function (hex, r, g, b){
                return {
                    r: parseInt(r, 16),
                    g: parseInt(g, 16),
                    b: parseInt(b, 16)
                };
            }
        },

        {
            example: ['rgb(123, 234, 45)', 'rgb(25, 50%, 100%)', 'rgba(12%, 34, 56%, 0.78)'],
            // regex: /^rgba*\((\d{1,3}\%*),\s*(\d{1,3}\%*),\s*(\d{1,3}\%*)(?:,\s*([0-9.]+))?\)/,
            regex: /^rgba*\(([0-9]*\.?[0-9]+\%*),\s*([0-9]*\.?[0-9]+\%*),\s*([0-9]*\.?[0-9]+\%*)(?:,\s*([0-9.]+))?\)/,
            process: function (s,r,g,b,a)
            {
                r = r && r.slice(-1) == '%' ? (r.slice(0,-1) / 100) : r*1;
                g = g && g.slice(-1) == '%' ? (g.slice(0,-1) / 100) : g*1;
                b = b && b.slice(-1) == '%' ? (b.slice(0,-1) / 100) : b*1;
                a = a*1;

                return {
                    r: util.clamp(r, 0, 255),
                    g: util.clamp(g, 0, 255),
                    b: util.clamp(b, 0, 255),
                    a: util.clamp(a, 0, 1) || undefined
                };
            }
        },

        {
            example: ['hsl(123, 34%, 45%)', 'hsla(25, 50%, 100%, 0.75)', 'hsv(12, 34%, 56%)'],
            regex: /^hs([bvl])a*\((\d{1,3}\%*),\s*(\d{1,3}\%*),\s*(\d{1,3}\%*)(?:,\s*([0-9.]+))?\)/,
            process: function (c,lv,h,s,l,a)
            {
                h *= 1;
                s = s.slice(0,-1) / 100;
                l = l.slice(0,-1) / 100;
                a *= 1;

                var obj = {
                    h: util.clamp(h, 0, 360),
                    a: util.clamp(l, 0, 1)
                };
                // `s` is used in many different spaces (HSL, HSV, HSB)
                // so we use `sl`, `sv` and `sb` to differentiate
                obj['s'+lv] = util.clamp(s, 0, 1),
                obj[lv] = util.clamp(l, 0, 1);

                return obj;
            }
        }
    ]
};

},{"./util":7}],6:[function(require,module,exports){
module.exports = function ChromathPrototype(Chromath) {
  return {
      /*
         Method: toName
         Call <Chromath.toName> on the current instance
         > > var color = new Chromath('rgb(173, 216, 230)');
         > > color.toName();
         > "lightblue"
      */
      toName: function (){ return Chromath.toName(this); },

      /*
         Method: toString
         Display the instance as a string. Defaults to <Chromath.toHexString>
         > > var color = Chromath.rgb(56, 78, 90);
         > > Color.toHexString();
         > "#384E5A"
      */
      toString: function (){ return this.toHexString(); },

      /*
         Method: valueOf
         Display the instance as an integer. Defaults to <Chromath.toInteger>
         > > var yellow = new Chromath('yellow');
         > > yellow.valueOf();
         > 16776960
         > > +yellow
         > 16776960
      */
      valueOf: function (){ return Chromath.toInteger(this); },

    /*
       Method: rgb
       Return the RGB array of the instance
       > > new Chromath('red').rgb();
       > [255, 0, 0]
    */
      rgb: function (){ return this.toRGBArray(); },

      /*
         Method: toRGBArray
         Return the RGB array of the instance
         > > Chromath.burlywood.toRGBArray();
         > [255, 184, 135]
      */
      toRGBArray: function (){ return this.toRGBAArray().slice(0,3); },

      /*
         Method: toRGBObject
         Return the RGB object of the instance
         > > new Chromath('burlywood').toRGBObject();
         > {r: 255, g: 184, b: 135}
      */
      toRGBObject: function ()
      {
          var rgb = this.toRGBArray();

          return {r: rgb[0], g: rgb[1], b: rgb[2]};
      },

      /*
         Method: toRGBString
         Return the RGB string of the instance
         > > new Chromath('aliceblue').toRGBString();
         > "rgb(240,248,255)"
      */
      toRGBString: function ()
      {
          return "rgb("+ this.toRGBArray().join(",") +")";
      },

      /*
         Method: rgba
         Return the RGBA array of the instance
         > > new Chromath('red').rgba();
         > [255, 0, 0, 1]
      */
      rgba: function (){ return this.toRGBAArray(); },

      /*
         Method: toRGBAArray
         Return the RGBA array of the instance
         > > Chromath.lime.toRGBAArray();
         > [0, 255, 0, 1]
      */
      toRGBAArray: function ()
      {
          var rgba = [
              Math.round(this.r*255),
              Math.round(this.g*255),
              Math.round(this.b*255),
              parseFloat(this.a)
          ];

          return rgba;
      },

      /*
         Method: toRGBAObject
         Return the RGBA object of the instance
         > > Chromath.cadetblue.toRGBAObject();
         > {r: 95, g: 158, b: 160}
      */
      toRGBAObject: function ()
      {
          var rgba = this.toRGBAArray();

          return {r: rgba[0], g: rgba[1], b: rgba[2], a: rgba[3]};
      },

      /*
         Method: toRGBAString
         Return the RGBA string of the instance
         > > new Chromath('darkblue').toRGBAString();
         > "rgba(0,0,139,1)"
      */
      toRGBAString: function (){
          return "rgba("+ this.toRGBAArray().join(",") +")";
      },

      /*
         Method: hex
         Return the hex array of the instance
         > new Chromath('darkgreen').hex()
         [ '00', '64', '00' ]
      */
      hex: function (){ return this.toHexArray(); },

      /*
        Method: toHexArray
         Return the hex array of the instance
        > > Chromath.firebrick.toHexArray();
        > ["B2", "22", "22"]
      */
      toHexArray: function (){
          return Chromath.rgb2hex(this.r, this.g, this.b);
      },

      /*
         Method: toHexObject
         Return the hex object of the instance
         > > Chromath.gainsboro.toHexObject();
         > {r: "DC", g: "DC", b: "DC"}
      */
      toHexObject: function ()
      {
          var hex = this.toHexArray();

          return { r: hex[0], g: hex[1], b: hex[2] };
      },

      /*
        Method: toHexString
         Return the hex string of the instance
        > > Chromath.honeydew.toHexString();
        > "#F0FFF0"
      */
      toHexString: function (){
          var hex = this.toHexArray();

          return '#' + hex.join('');
      },

      /*
         Method: hsl
         Return the HSL array of the instance
         > >new Chromath('green').hsl();
         > [120, 1, 0.25098039215686274]
      */
      hsl: function (){ return this.toHSLArray(); },

      /*
         Method: toHSLArray
         Return the HSL array of the instance
         > > new Chromath('red').toHSLArray();
         > [0, 1, 0.5]
      */
      toHSLArray: function (){
          return this.toHSLAArray().slice(0,3);
      },

      /*
         Method: toHSLObject
         Return the HSL object of the instance
         > > new Chromath('red').toHSLObject();
         [h:0, s:1, l:0.5]
      */
      toHSLObject: function ()
      {
          var hsl = this.toHSLArray();

          return {h: hsl[0], s: hsl[1], l: hsl[2]};
      },

      /*
         Method: toHSLString
         Return the HSL string of the instance
         > > new Chromath('red').toHSLString();
         > "hsl(0,1,0.5)"
      */
      toHSLString: function (){
          var hsla = this.toHSLAArray();
          var vals = [
              hsla[0],
              Math.round(hsla[1]*100)+'%',
              Math.round(hsla[2]*100)+'%'
          ];

          return 'hsl('+ vals +')';
      },

      /*
        Method: hsla
        Return the HSLA array of the instance
        > > new Chromath('green').hsla();
        > [120, 1, 0.25098039215686274, 1]
      */
      hsla: function (){ return this.toHSLAArray(); },

      /*
         Method: toHSLArray
         Return the HSLA array of the instance
         > > Chromath.antiquewhite.toHSLAArray();
         > [34, 0.7777777777777773, 0.9117647058823529, 1]
      */
      toHSLAArray: function ()
      {
          return [
              Math.round(this.h),
              parseFloat(this.sl),
              parseFloat(this.l),
              parseFloat(this.a)
          ];
      },

      /*
         Method: toHSLAObject
         Return the HSLA object of the instance
         > > Chromath.antiquewhite.toHSLAArray();
         > {h:34, s:0.7777777777777773, l:0.9117647058823529, a:1}
      */
      toHSLAObject: function ()
      {
          var hsla = this.toHSLAArray();

          return {h: hsla[0], s: hsla[1], l: hsla[2], a: hsla[3]};
      },

      /*
         Method: toHSLAString
         Return the HSLA string of the instance
         > > Chromath.antiquewhite.toHSLAString();
         > "hsla(34,0.7777777777777773,0.9117647058823529,1)"
      */
      toHSLAString: function (){
          var hsla = this.toHSLAArray();
          var vals = [
              hsla[0],
              Math.round(hsla[1]*100)+'%',
              Math.round(hsla[2]*100)+'%',
              Math.round(hsla[3])
          ];

          return 'hsla('+ vals +')';
      },

      /*
         Method: hsv
         Return the HSV array of the instance
         > > new Chromath('blue').hsv();
         > [240, 1, 1]
      */
      hsv: function (){ return this.toHSVArray(); },

      /*
         Method: toHSVArray
         Return the HSV array of the instance
         > > new Chromath('navajowhite').toHSVArray();
         > [36, 0.32156862745098036, 1]
      */
      toHSVArray: function ()
      {
          return this.toHSVAArray().slice(0,3);
      },

      /*
         Method: toHSVObject
         Return the HSV object of the instance
         > > new Chromath('navajowhite').toHSVObject();
         > {h36, s:0.32156862745098036, v:1}
      */
      toHSVObject: function ()
      {
          var hsva = this.toHSVAArray();

          return {h: hsva[0], s: hsva[1], v: hsva[2]};
      },

      /*
         Method: toHSVString
         Return the HSV string of the instance
         > > new Chromath('navajowhite').toHSVString();
         > "hsv(36,32.15686274509804%,100%)"
      */
      toHSVString: function ()
      {
          var hsv = this.toHSVArray();
          var vals = [
              hsv[0],
              Math.round(hsv[1]*100)+'%',
              Math.round(hsv[2]*100)+'%'
          ];

          return 'hsv('+ vals +')';
      },

      /*
         Method: hsva
         Return the HSVA array of the instance
         > > new Chromath('blue').hsva();
         > [240, 1, 1, 1]
      */
      hsva: function (){ return this.toHSVAArray(); },

      /*
         Method: toHSVAArray
         Return the HSVA array of the instance
         > > new Chromath('olive').toHSVAArray();
         > [60, 1, 0.5019607843137255, 1]
      */
      toHSVAArray: function (){
          return [
              Math.round(this.h),
              parseFloat(this.sv),
              parseFloat(this.v),
              parseFloat(this.a)
          ];
      },

      /*
         Method: toHSVAObject
         Return the HSVA object of the instance
         > > new Chromath('olive').toHSVAArray();
         > {h:60, s: 1, v:0.5019607843137255, a:1}
      */
      toHSVAObject: function (){
          var hsva = this.toHSVAArray();

          return {h: hsva[0], s: hsva[1], l: hsva[2], a: hsva[3]};
      },

      /*
         Method: toHSVAString
         Return the HSVA string of the instance
         > > new Chromath('olive').toHSVAString();
         > "hsva(60,100%,50.19607843137255%,1)"
      */
      toHSVAString: function ()
      {
          var hsva = this.toHSVAArray();
          var vals = [
              hsva[0],
              Math.round(hsva[1]*100)+'%',
              Math.round(hsva[2]*100)+'%',
              hsva[3]
          ];

          return 'hsva('+ vals +')';
      },

      /*
         Method: hsb
         Alias for <hsv>
      */
      hsb: function (){ return this.hsv(); },

      /*
         Method: toHSBArray
         Alias for <toHSBArray>
      */
      toHSBArray: function ()
      {
          return this.toHSVArray();
      },

      /*
         Method: toHSBObject
         Alias for <toHSVObject>
      */
      toHSBObject: function ()
      {
          return this.toHSVObject();
      },

      /*
         Method: toHSBString
         Alias for <toHSVString>
      */
      toHSBString: function ()
      {
          return this.toHSVString();
      },

      /*
         Method: hsba
         Alias for <hsva>
      */
      hsba: function (){ return this.hsva(); },

      /*
         Method: toHSBAArray
         Alias for <toHSVAArray>
      */
      toHSBAArray: function (){
          return this.toHSVAArray();
      },

      /*
         Method: toHSBAObject
         Alias for <toHSVAObject>
      */
      toHSBAObject: function (){
          return this.toHSVAObject();
      },

      /*
         Method: toHSBAString
         Alias for <toHSVAString>
      */
      toHSBAString: function ()
      {
          return this.toHSVAString();
      },

      //Group: Instance methods - color scheme
      /*
         Method: complement
         Calls <Chromath.complement> with the current instance as the first parameter

         > > Chromath.red.complement().rgb();
         > [0, 255, 255]
      */
      complement: function (){
          return Chromath.complement(this);
      },

      /*
         Method: triad
         Calls <Chromath.triad> with the current instance as the first parameter

         > > new Chromath('hsl(0, 100%, 50%)').triad().toString();
         > "#FF0000,#00FF00,#0000FF"
      */
      triad: function (){
          return Chromath.triad(this);
      },

      /*
         Method: tetrad
         Calls <Chromath.tetrad> with the current instance as the first parameter

         > > Chromath.hsb(240, 1, 1).triad();
         > [Chromath, Chromath, Chromath]
      */
      tetrad: function (){
          return Chromath.tetrad(this);
      },

      /*
         Method: analogous
         Calls <Chromath.analogous> with the current instance as the first parameter

         > > Chromath.hsb(120, 1, 1).analogous();
         > [Chromath, Chromath, Chromath, Chromath, Chromath, Chromath, Chromath, Chromath]

         > > Chromath.hsb(180, 1, 1).analogous(5).toString();
         > "#00FFFF,#00FFB2,#00FFE5,#00E5FF,#00B2FF"

         > > Chromath.hsb(180, 1, 1).analogous(5, 10).toString();
         > "#00FFFF,#00FF19,#00FFB2,#00B2FF,#0019FF"
      */
      analogous: function (results, slices){
          return Chromath.analogous(this, results, slices);
      },

      /*
        Method: monochromatic
         Calls <Chromath.monochromatic> with the current instance as the first parameter

        > > Chromath.blue.monochromatic().toString();
        > "#000033,#000066,#000099,#0000CC,#0000FF"
      */
      monochromatic: function (results){
          return Chromath.monochromatic(this, results);
      },

      /*
         Method: splitcomplement
         Calls <Chromath.splitcomplement> with the current instance as the first parameter

         > > Chromath.blue.splitcomplement().toString();
         > "#0000FF,#FFCC00,#FF5100"
      */
      splitcomplement: function (){
          return Chromath.splitcomplement(this);
      },

      // Group: Instance methods - color alteration
      /*
         Method: tint
         Calls <Chromath.tint> with the current instance as the first parameter

         > > new Chromath('yellow').tint(0.25).toString();
         > "#FFFF3F"
      */
      tint: function (by) {
          return Chromath.tint(this, by);
      },

      /*
         Method: lighten
         Alias for <tint>
      */
      lighten: function (by) {
        return this.tint(by);
      },

      /*
        Method: shade
         Calls <Chromath.shade> with the current instance as the first parameter

        > > new Chromath('yellow').shade(0.25).toString();
        > "#BFBF00"
      */
      shade: function (by) {
          return Chromath.shade(this, by);
      },

      /*
         Method: darken
         Alias for <shade>
      */
      darken: function (by) {
        return this.shade(by);
      },

      /*
         Method: desaturate
         Calls <Chromath.desaturate> with the current instance as the first parameter

       > > new Chromath('orange').desaturate().toString();
       > "#ADADAD"

       > > new Chromath('orange').desaturate(1).toString();
       > "#5B5B5B"

       > > new Chromath('orange').desaturate(2).toString();
       > "#B4B4B4"
       */
      desaturate: function (formula){
          return Chromath.desaturate(this, formula);
      },

      /*
        Method: greyscale
        Alias for <desaturate>
      */
      greyscale: function (formula) {
        return this.desaturate(formula);
      },

      /*
         Method: websafe
         Calls <Chromath.websafe> with the current instance as the first parameter

         > > Chromath.rgb(123, 234, 56).toString();
         > "#7BEA38"

         > Chromath.rgb(123, 234, 56).websafe().toString();
         > "#66FF33"
       */
      websafe: function (){
          return Chromath.websafe(this);
      },

      // Group: Instance methods - color combination
      /*
         Method: additive
         Calls <Chromath.additive> with the current instance as the first parameter

         > > new Chromath('red').additive('#00FF00', 'blue').toString();
         > "#FFFFFF"
      */
      additive: function (){
          var arr = Array.prototype.slice.call(arguments);
          return Chromath.additive.apply(Chromath, [this].concat(arr));
      },

      /*
         Method: subtractive
         Calls <Chromath.subtractive> with the current instance as the first parameter

         > > new Chromath('cyan').subtractive('magenta', 'yellow').toString();
         > "#000000"
      */
      subtractive: function (){
          var arr = Array.prototype.slice.call(arguments);
          return Chromath.subtractive.apply(Chromath, [this].concat(arr));
      },

      /*
         Method: multiply
         Calls <Chromath.multiply> with the current instance as the first parameter

         > > Chromath.lightcyan.multiply(Chromath.brown).toString();
         > "#902A2A"
      */
      multiply: function (){
          var arr = Array.prototype.slice.call(arguments);
          return Chromath.multiply.apply(Chromath, [this].concat(arr));
      },

      /*
         Method: average
         Calls <Chromath.average> with the current instance as the first parameter

         > > Chromath.black.average('white').rgb();
         > [127, 127, 127]
      */
      average: function (){
          var arr = Array.prototype.slice.call(arguments);
          return Chromath.average.apply(Chromath, [this].concat(arr));
      },

      /*
         Method: overlay
         Calls <Chromath.overlay> with the current instance as the first parameter

       > > Chromath.red.overlay('green', 0.4).toString();
       > "#993300"

       > > Chromath.red.overlay('green', 1).toString();
       > "#008000"

       > > Chromath.red.overlay('green', 0).toString();
       > "#FF0000"
       */
      overlay: function (bottom, transparency){
          return Chromath.overlay(this, bottom, transparency);
      },

      // Group: Instance methods - other
      /*
         Method: clone
         Return an independent copy of the instance
      */
      clone: function (){
          return new Chromath(this);
      },

      /*
         Method: towards
         Calls <Chromath.towards> with the current instance as the first parameter

         > > var red = new Chromath('red');
         > > red.towards('yellow', 0.55).toString();
         > "#FF8C00"
      */
      towards: function (to, by) {
          return Chromath.towards(this, to, by);
      },

      /*
         Method: gradient
         Calls <Chromath.gradient> with the current instance as the first parameter

         > > new Chromath('#F00').gradient('#00F').toString()
         > "#FF0000,#F1000D,#E4001A,#D60028,#C90035,#BB0043,#AE0050,#A1005D,#93006B,#860078,#780086,#6B0093,#5D00A1,#5000AE,#4300BB,#3500C9,#2800D6,#1A00E4,#0D00F1,#0000FF"

         > > new Chromath('#F00').gradient('#00F', 5).toString()
         > "#FF0000,#BF003F,#7F007F,#3F00BF,#0000FF"

         > > new Chromath('#F00').gradient('#00F', 5, 3).toString()
         > "#3F00BF"
      */
      gradient: function (to, slices, slice){
          return Chromath.gradient(this, to, slices, slice);
      }
  };
};

},{}],7:[function(require,module,exports){
var util = {};

util.clamp = function ( val, min, max ) {
    if (val > max) return max;
    if (val < min) return min;
    return val;
};

util.merge = function () {
    var dest = arguments[0], i=1, source, prop;
    while (source = arguments[i++])
        for (prop in source) dest[prop] = source[prop];

    return dest;
};

util.isArray = function ( test ) {
    return Object.prototype.toString.call(test) === '[object Array]';
};

util.isString = function ( test ) {
    return Object.prototype.toString.call(test) === '[object String]';
};

util.isNumber = function ( test ) {
    return Object.prototype.toString.call(test) === '[object Number]';
};

util.isObject = function ( test ) {
    return Object.prototype.toString.call(test) === '[object Object]';
};

util.lpad = function ( val, len, pad ) {
    val = val.toString();
    if (!len) len = 2;
    if (!pad) pad = '0';

    while (val.length < len) val = pad+val;

    return val;
};

util.lerp = function (from, to, by) {
    return from + (to-from) * by;
};

util.times = function (n, fn, context) {
    for (var i = 0, results = []; i < n; i++) {
        results[i] = fn.call(context, i);
    }
    return results;
};

util.rgb = {
    fromArgs: function (r, g, b, a) {
        var rgb = arguments[0];

        if (util.isArray(rgb)){ r=rgb[0]; g=rgb[1]; b=rgb[2]; a=rgb[3]; }
        if (util.isObject(rgb)){ r=rgb.r; g=rgb.g; b=rgb.b; a=rgb.a;  }

        return [r, g, b, a];
    },
    scaled01: function (r, g, b) {
        if (!isFinite(arguments[1])){
            var rgb = util.rgb.fromArgs(r, g, b);
            r = rgb[0], g = rgb[1], b = rgb[2];
        }

        if (r > 1) r /= 255;
        if (g > 1) g /= 255;
        if (b > 1) b /= 255;

        return [r, g, b];
    },
    pctWithSymbol: function (r, g, b) {
        var rgb = this.scaled01(r, g, b);

        return rgb.map(function (v) {
            return Math.round(v * 255) + '%';
        });
    }
};

util.hsl = {
    fromArgs: function (h, s, l, a) {
        var hsl = arguments[0];

        if (util.isArray(hsl)){ h=hsl[0]; s=hsl[1]; l=hsl[2]; a=hsl[3]; }
        if (util.isObject(hsl)){ h=hsl.h; s=hsl.s; l=(hsl.l || hsl.v); a=hsl.a; }

        return [h, s, l, a];
    },
    scaled: function (h, s, l) {
        if (!isFinite(arguments[1])){
            var hsl = util.hsl.fromArgs(h, s, l);
            h = hsl[0], s = hsl[1], l = hsl[2];
        }

        h = (((h % 360) + 360) % 360);
        if (s > 1) s /= 100;
        if (l > 1) l /= 100;

        return [h, s, l];
    }
};

module.exports = util;

},{}],8:[function(require,module,exports){
function Createcss () {

}

Createcss.prototype = {
  selector: function(selector, style) {
    if (!document.styleSheets) {
      return
    }

    if (document.getElementsByTagName("head").length == 0) {
      return
    }

    var stylesheet
    var mediaType

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
  }
}

module.exports = new Createcss()
},{}],9:[function(require,module,exports){
const Dashboard = require('./modules/Dashboard');
const Router = require('./modules/Router');

$(function(){
  window.Dashboard = new Dashboard()
  window.Dashboard.render()
  window.Dashboard.router = new Router
  Backbone.history.start()
})
},{"./modules/Dashboard":14,"./modules/Router":23}],10:[function(require,module,exports){
const ChartView = require('./ChartView')

const BarChartView = ChartView.extend({
  render: function() {
    var self = this
    this.$el.html(this.template(this.model.toJSON()))
    this.updateChartTools()
    this.$el.find('.chart-inner').css('overflow', 'hidden')
    this.chartel = this.$el.find('.chart-inner > .the-chart').get(0)
    this.chart = false
    return this
  },
  drawChart: function() {
    this.chart = new GeoDash.BarChartVertical(this.chartel, {
      x: this.model.get('key')
      , y: this.model.get('y')
      , colors: this.model.get('colors')
      , yTickFormat: d3.format(".2s")
      , yLabel: this.model.get('yLabel')
      , hoverTemplate: "{{x}}: {{y}} " + this.model.get('units')
      , opacity: 0.9
      , barLabels: this.model.get('barLabels')
      , barLabelFormat: this.model.get('barLabelFormat')
      , xLabelAngle: this.model.get('xLabelAngle')
      , xAxisLabelPadding: this.model.get('xAxisLabelPadding')
      , legend: this.model.get('legend')
      , legendWidth: 'auto'
      , legendPosition: 'inside'
      , valueFormat: this.model.get('valueFormat')
    })
  },
  prepData: function(data){
    var self = this
    var row = data[0]
    if (row) {
      data = _.sortBy(data, function(row, i) {
        return row[self.chart.options.y[0]]
      }).reverse()
      this.setColors(data)
      this.model.set('data', data, {silent: true})
      if (data.length > self.dataLimit) {
        data = data.splice(0, self.dataLimit)
      }
    }
    return data
  }
})

module.exports = BarChartView
},{"./ChartView":13}],11:[function(require,module,exports){
const ChartModel = require('./ChartModel')

const ChartCollection = Backbone.Collection.extend({
  model: ChartModel
})

module.exports = ChartCollection
},{"./ChartModel":12}],12:[function(require,module,exports){
const ChartModel = Backbone.Model.extend({
  defaults: function() {
    return {
      api: '/',
      title: 'Chart Title',
      sort_key: false,
      sort_desc: true,
      chart_type: 'bar',
      key: 'Name',
      y: [],
      loading: false,
      hoverTemplate: '{{x}}: {{y}}',
      units: '',
      visible: true,
      toolbar: true,
      sort: true,
      width: 'col-lg-3 col-md-6 col-sm-12',
      barLabels: false,
      xLabelAngle: false,
      xAxisLabelPadding: 20,
      legend: false,
      valueFormat: d3.format(',.2f'),
      labelFormat: function(d) { return d },
      barLabelFormat: d3.format(',.2s'),
      dontFormat: [],
      showUnitsInTable: false,
      geo: false,
      colors: Dashboard.colors,
      filter_color: false,
      yLabel: false,
      tools: false
    }
  },
  initialize: function() {
    this.listenTo(this, 'change:visible', this.update)
    if (this.geo) {
      Dashboard.filterCollection.on('change:value', this.update, this)
    }
  },
  toJSON: function() {
    var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
    json.cid = this.cid;
    return json;
  },
  update: function() {
    var self = this
    if (this.get('visible')) {
      this.set('loading', true)
      this.abort()
      var url = this.makeQuery(this.get('api'))
      this.request = $.getJSON(url, function(res){
        self.set('loading', false)
        self.set('data', res)
      })
    }
  },
  abort: function() {
    if (this.request && this.request.readyState !== 4) {
      this.request.abort()
    }
  },
  makeQuery: function(url) {
    var self = this
    url += '?'
    Dashboard.filterCollection.each(function(filter) {
      if (filter.get('active')) {
        url += filter.get('type') + '=' + filter.get('value') + '&'
      }
    })
    url += 'tab=' + Dashboard.activetab
    var geotype = ''
    var geofilters = Dashboard.filterCollection.where({type: 'geotype'})
    if (geofilters.length > 0) {
      geotype = geofilters[0].get('value')
    }
    url += '&geotype=' + geotype
    if (this.get('geo')) {
      self.set('key', geotype)
    }
    return url
  },
  clearData: function() {
    var data = this.get('data')
    if (data && data[0]) {
      if (this.get('chart_type') === 'stat') {
        var keys = _.keys(data[0])
      } else {
        var keys = _.without(_.keys(data[0]), this.get('key'))
      }
      data.forEach(function(row) {
        keys.forEach(function(key) {
          row[key] = 0
        })
      })
      this.set('data', data)
      this.trigger('change:data')
    }
  },
  sortByKey: function(data, column) {
    if(!this.get('sort_key')) {
      this.set('sort_key', column)
      this.set('sort_desc', false)
    } else if(this.get('sort_key') === column) {
      var sort_order = this.get('sort_desc')
      this.set('sort_desc', !sort_order)
    } else if(this.get('sort_key') !== column) {
      this.set('sort_key', column)
      this.set('sort_desc', false)
    }
    if(this.get('sort_desc')){
      data = _.sortBy(data, function(obj){ return obj[column] }).reverse()
    } else {
      data = _.sortBy(data, function(obj){ return obj[column] })
    }
    return data
  }
})

module.exports = ChartModel
},{}],13:[function(require,module,exports){
const chromath = require('chromath')
const templates = require('./templates')(Handlebars)

const ChartView = Backbone.View.extend({
  template: templates.chart,
  dataLimit: 30,
  events: {
    "click .download":  "download",
    "click .code":  "code",
    "click .totable": "toTable",
    "change .chart-tools input": 'changeChartTools'
  },
  initialize: function(options) {
    var self = this
    this.options = options || {};
    $(window).on('resize', function(){
      self.chart = false
      self.update()
    })
    this.listenTo(this.model, 'change:data', this.update)
    this.listenTo(this.model, 'change:loading', this.loading)
    this.listenTo(this.model, 'change:key', this.changeKey)
    this.listenTo(this.model, 'change:colors', this.changeColors)
    this.listenTo(this.model, 'change:yLabel', this.changeLabels)
    this.listenTo(this.model, 'remove', this.remove)
    this.hoverTemplate = '{{label}}: {{value}} ' + this.model.get('units')
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()))
    return this
  },
  updateChartTools: function() {
    var self = this
    if (this.model.get('tools')) {
      this.$el.find('.chart-tools input').each(function(idx) {
        if (typeof self.model.get('y') === 'string') {
          var y = [self.model.get('y')]
        } else {
          var y = self.model.get('y')
        }
        if ($(this).val().split(',').join(',') === y.join(',')) {
          $(this).attr('checked', 'checked')
        }
      })
    } else {
      this.$el.find('.chart-tools').hide()
    }
  },
  changeChartTools: function(e) {
    var value = $(e.currentTarget).val()
    this.changeChartOptionsOnKey(value)
    this.update()
  },
  changeChartOptionsOnKey: function(key) {
    var self = this
    this.chart.options.valueFormat = d3.format(',.0f')
    this.chart.options.barLabelFormat = d3.format(',.0f')
    this.chart.options.barLabels = this.model.get('barLabels')

    var colors = []
      , keys = key.split(',')
      , tool = _.findWhere(this.model.get('tools'), {value: key})

    if (tool) {
      if (tool.type) {
        if (tool.type === 'money') {
          this.chart.options.barLabelFormat = d3.format('$,.2s')
          this.chart.options.valueFormat = d3.format('$,.0f')
        }
      }
      if (tool.yLabel) {
        this.chart.options.yLabel = tool.yLabel
      }
      if (tool.color) {
        colors = tool.color
      } else {
        var new_colors = _.without(Dashboard.colors, Dashboard.tab_colors[Dashboard.activetab])
        keys.forEach(function(key, i) {
          colors.push(
            chromath.lighten(
              Dashboard.tab_colors[Dashboard.activetab],
              (i * 40)/100
            ).toString()
          )
        })
      }
    }
    console.log(colors)

    this.chart.options.y = keys
    this.model.set('y', keys)
    this.model.set('colors', colors)
    this.model.set('barLabelFormat', this.chart.options.barLabelFormat)
    this.model.set('valueFormat', this.chart.options.valueFormat)
    this.model.set('yLabel', this.chart.options.yLabel)
  },
  changeKey: function() {
    if (this.chart) this.chart.options.x = this.model.get('key')
  },
  update: function() {
    if(!this.chart) {
      this.resize()
      this.drawChart()
    }
    var d = this.prepData(this.model.get('data'))
    if (d.length) {
      this.empty(false)
      this.chart.update(d)
    } else {
      this.empty(true)
    }
  },
  resize: function() {
    var height = this.$el.find('.chart').innerHeight()
      - this.$el.find('.title').outerHeight(true)
    this.$el.find('.chart-inner').css('height', height)
  },
  remove: function() {
    this.$el.parent().remove()
  },
  changeLabels: function() {
    this.chart.setYAxisLabel(this.model.get('yLabel'))
  },
  changeColors: function() {
    this.chart.setColor(this.model.get('colors'))
  },
  setColors: function(data) {
    var self = this
    var colors = []
    if (this.model.get('filter_color') === true) {
      _.each(data, function(d) {
        var x = d[self.model.get('key')]
        var filters = Dashboard.filterCollection.where({value: x})
        if (filters.length) {
          if (filters[0].get('color')) {
            colors.push(filters[0].get('color'))
          }
        }
      })
      if (colors.length) {
        self.model.set('colors', colors)
      }
    }
  },
  loading: function(e) {
    var self = this
    if (this.model.get('loading')) {
      this.$el.find('.loader').show()
    } else {
      this.$el.find('.loader').hide()
    }
  },
  prepData: function(data) {
    return data
  },
  download: function(e) {
    var url = this.model.makeQuery(this.model.get('api'))
    url += '&csv=true'
    window.location.href = url
  },
  code: function(e) {
    var url = this.model.makeQuery()
    window.open(url)
  },
  toTable: function() {
    var TableView = require('./TableView')
    var view = new TableView({
      model: this.model,
      chart: this.chart
    })
    this.$el.parent().html(view.render().el)
    view.resize()
  },
  empty: function(empty) {
    if (empty) {
      this.$el.find('.the-chart').hide()
      this.$el.find('.chart-tools').hide()
      this.$el.find('.nodata').show()
    } else {
      this.$el.find('.the-chart').show()
      if (this.model.get('tools')) this.$el.find('.chart-tools').show()
      this.$el.find('.nodata').hide()
    }
  }
})

module.exports = ChartView
},{"./TableView":26,"./templates":28,"chromath":1}],14:[function(require,module,exports){

const MapView = require('./MapView')
const ChartModel = require('./ChartModel')
const BarChartView = require('./BarChartView')
const StackedBarChartView = require('./StackedBarChartView')
const HorizontalBarChartView = require('./HorizontalBarChartView')
const TableView = require('./TableView')
const LineChartView = require('./LineChartView')
const PieChartView = require('./PieChartView')
const StatView = require('./StatView')
const FilterCollection = require('./FilterCollection')
const FilterMenuView = require('./FilterMenuView')
const ChartCollection = require('./ChartCollection')
const templates = require('./templates')(Handlebars)

var Dashboard = Backbone.View.extend({
  colors: ['#2790B0', '#2B4E72', '#94BA65'],
  template: templates.dashboard,
  el: $(".dashboard"),
  activetab: 'home',
  socrata_links: {
    'renewable': 'https://data.maryland.gov/dataset/Renewable-Energy-Geocoded/mqt3-eu4s',
    'efficiency': 'https://data.maryland.gov/dataset/Energy-Efficiency-Geocoded/3afy-8fbr',
    'transportation': 'https://data.maryland.gov/dataset/Transportation-Geocoded/4dvs-jtxq'
  },
  tab_colors: {
    'renewable': '#12A6B8',
    'efficiency': '#2B4E72',
    'transportation': '#E5972F'
  },
  initialize: function() {

    this.filterCollection = new FilterCollection()
    this.makeFilters()
    this.filterCollection.on('change:active', this.update, this)
    this.filterCollection.on('add', this.update, this)
    this.filterCollection.on('remove', this.update, this)

    this.chartCollection = new ChartCollection()
    this.chartCollection.on('add', this.renderChart, this)
    this.makeCharts()
  },
  makeCharts: function() {
    var self = this
    this.mapModel = {title: "Map", api: 'api/getPoints', key: 'geo', chart_type: 'map'}
    this.charts = {
      stats: {
        title: "Investment Stats",
        api: 'api/getStats',
        key: 'contribution',
        chart_type: 'stat',
        format: d3.format('$,'),
        width: 'col-md-6 col-lg-3',
        toolbar: false,
        sort: false
      },
      technology: {
        title: "Technology Type",
        api: 'api/getTechnology',
        y: 'Contribution',
        key: 'Technology',
        chart_type: 'pie',
        filter_color: true,
        units: '',
        valueFormat: d3.format('$,.0f'),
        width: 'col-lg-3 col-md-3 col-sm-12',
        tools: [{value: 'Contribution', text: 'Contribution', type: 'money'}, {value: 'Projects', text: 'Projects'}]
      },
      mea_contribution: {
        title: "Contribution By Region",
        api: 'api/getContribution',
        key: 'County',
        y: ['MEA Contribution'],
        chart_type: 'stacked',
        group: 'geo',
        units: '',
        valueFormat: d3.format('$,.0f'),
        width: 'col-lg-6 col-md-9',
        colors: [self.colors[0]],
        yLabel: 'Dollars',
        xLabelAngle: -60,
        xAxisLabelPadding: 50,
        legend: true,
        dontFormat: ['Investment Leverage'],
        geo: true,
        tools: [{value: 'MEA Contribution', text: 'MEA Contribution', type: 'money', yLabel: 'Dollars'}, {value: 'MEA Contribution,Leveraged Investment', text: 'All Contributions', type: 'money', yLabel: 'Dollars'}]
      },
      program: {
        title: "Activity By Program",
        api: 'api/getProgramName',
        key: 'Program Name',
        y: ['Contribution'],
        colors: [self.colors[0]],
        chart_type: 'bar',
        units: '',
        barLabels: true,
        yLabel: 'Dollars',
        valueFormat: d3.format('$,.0f'),
        tools: [{value: 'Contribution', text: 'Contribution', type: 'money', yLabel: 'Dollars'}, {value: 'Projects', text: 'Projects', yLabel: 'Projects'}],
        barLabelFormat: d3.format('$.2s')
      },
      sector: {
        title: "Activity By Sector",
        api: 'api/getSector',
        key: 'Sector',
        y: ['Contribution'],
        colors: [self.colors[0]],
        chart_type: 'bar',
        yLabel: 'Dollars',
        units: '',
        barLabels: true,
        valueFormat: d3.format('$,.0f'),
        tools: [{value: 'Contribution', text: 'Contribution', type: 'money', yLabel: 'Dollars'},
        {value: 'Projects', text: 'Projects', yLabel: 'Projects'}],
        barLabelFormat: d3.format('$.2s')
      },
      electricity: {title: "Electricity Savings By Region", api: 'api/getSavings', key: 'County', y: ['Savings'], chart_type: 'bar', units: 'kWh', geo: true, width: 'col-md-6 col-sm-12', colors: [self.colors[0]], yLabel: 'kWh', width: 'col-lg-6 col-md-12', xLabelAngle: -60, xAxisLabelPadding: 50},
      reduction: {title: "CO2 Emissions Reductions By Region", api: 'api/getReductions', key: 'County', y: ['Reduction'], chart_type: 'bar', units: 'tons', geo: true, width: 'col-md-6 col-sm-12', colors: [self.colors[0]], yLabel: 'Tons', width: 'col-lg-6 col-md-12', xLabelAngle: -60, xAxisLabelPadding: 50},
      reductionTime: {title: "CO2 Reduction", api: 'api/getReductionOverTime', key: 'Date', y: 'Reduction', chart_type: 'line', units: 'tons', labelFormat: d3.time.format("%m/%y"), showUnitsInTable: true, yLabel: 'Tons'},
      station_technology: {
        title: "Charging/Fueling Station Technology",
        api: 'api/getStationTechnology',
        key: 'Technology',
        y: 'Stations',
        chart_type: 'pie',
        units: '',
        valueFormat: d3.format(',.0f'),
        filter_color: true,
        width: 'col-lg-3 col-md-3 col-sm-12',
        tools: [{value: 'Contribution', text: 'Contribution', type: 'money'}, {value: 'Stations', text: 'Stations'}]
      },
      vehicle_technology: {
        title: "Vehicle Technology",
        api: 'api/getVehicleTechnology',
        key: 'Technology',
        y: 'Projects',
        chart_type: 'pie',
        units: '',
        valueFormat: d3.format('$,.0f'),
        filter_color: true,
        width: 'col-lg-3 col-md-3 col-sm-12',
        tools: [{value: 'Contribution', text: 'Contribution', type: 'money'}, {value: 'Projects', text: 'Projects'}]
      }
    }
    this.charts.sector2 = _.clone(this.charts.sector)
    this.charts.sector2.width = 'col-lg-3 col-md-3 col-sm-12'
    this.charts.program2 = _.clone(this.charts.program)
    this.charts.program2.width = 'col-lg-6 col-md-12'
    this.chart_hash = {
      efficiency: [this.charts.stats, 
      this.charts.sector2, 
      this.charts.mea_contribution, 
      this.charts.program2, this.charts.electricity, 
      this.charts.reduction],
      renewable: [this.charts.stats, this.charts.technology, this.charts.mea_contribution, this.charts.program, this.charts.sector, this.charts.reductionTime
      ],
      transportation: [this.charts.stats, this.charts.vehicle_technology, this.charts.mea_contribution, this.charts.sector, this.charts.station_technology],
      capacity_charts: [
        {title: "Capacity By Area", api: 'api/getCapacityByArea', key: 'County', y: ['Capacity'], chart_type: 'bar', showUnitsInTable: true, geo: true, valueFormat: d3.format(',.2f'), width: 'col-md-6 col-sm-12'},
        {title: "Capacity By Sector", api: 'api/getCapacityBySector', key: 'Sector', y: ['Capacity'], chart_type: 'bar', showUnitsInTable: true},
        {title: "Capacity Growth", api: 'api/getCapacityOverTime', key: 'Date', y: ['Capacity'], chart_type: 'line', labelFormat: d3.time.format("%Y"), showUnitsInTable: true, filter_color: true},
      ]
    }
  },
  makeFilters: function() {
    this.effiency = []
    this.renewables = [
      {value: 'Solar PV', color: '#f39c12', type: 'technology', units: 'kW'},
      {value: 'Solar Hot Water', color: '#16a085', type: 'technology', units: 'sqft'},
      {value: 'Geothermal', color: '#FF4136', type: 'technology', units: 'tons'},
      {value: 'Wood Burning Stove', color: '#FFDC00', type: 'technology', units: 'BTUs/hr'},
      {value: 'Wind', color: '#3498db', type: 'technology', units: 'kW'},
      {value: 'Bioheat', color: '#9b59b6', type: 'technology', units: 'gallons'},
      {value: 'Landfill Gas', color: '#01FF70', type: 'technology', units: 'kW'}
    ]
    this.vehicle_technology = [
      {value: 'Electric', color: '#0074D9', type: 'vehicle_technology'},
      //{value: 'Biodiesel', color: '#f39c12', type: 'vehicle_technology'},
      //{value: 'E85', color: '#2ECC40', type: 'vehicle_technology'},
      {value: 'Natural Gas (CNG)', color: '#FFDC00', type: 'vehicle_technology'},
      //{value: 'Natural Gas (LNG)', color: '#39CCCC', type: 'vehicle_technology'},
      {value: 'Propane', color: '#FF4136', type: 'vehicle_technology'},
      //{value: 'Hydrogen', color: '#F012BE', type: 'vehicle_technology'},
      {value: 'Hybrid', color: '#B10DC9', type: 'vehicle_technology'},
      {value: 'Hybrid Electric', color: '#626f9a', type: 'vehicle_technology'},
      {value: 'Idle Reduction', color: '#01FF70', type: 'vehicle_technology'},
    ]
    this.stations = [
      {value: 'Electric', color: '#0074D9', type: 'charging_fueling_station_technology'},
      {value: 'Biodiesel', color: '#f39c12', type: 'charging_fueling_station_technology', visible: false},
      {value: 'E85', color: '#2ECC40', type: 'charging_fueling_station_technology'},
      {value: 'Natural Gas (CNG)', color: '#FFDC00', type: 'charging_fueling_station_technology'},
      {value: 'LPG', color: '#FF4136', type: 'charging_fueling_station_technology', visible: false},
      {value: 'Back-up Generator', color: '#7D7F81', type: 'charging_fueling_station_technology'}
    ]
    this.programtypes = [
      {value: 'Grant', type: 'program_type'},
      {value: 'Rebate/Voucher', type: 'program_type'},
      {value: 'Financing', type: 'program_type'},
      {value: 'Tax Credit', type: 'program_type'},
      {value: 'Other', type: 'program_type'}
    ]
    this.program_names = [
      {value: "EmPOWER Clean Energy Communities Low-to-Moderate Income Grant Program", type: 'program_name'},
      {value: "Maryland Smart Energy Communities", type: 'program_name'},
      {value: "EECBG Building Retrofit", type: 'program_name'},
      {value: "Maryland Home Energy Loan Program", type: 'program_name'},
      {value: "State Agency Loan Program", type: 'program_name'},
      {value: "Energy Efficient Appliance Rebate Program", type: 'program_name'},
      {value: "EmPOWER Maryland Challenege: Commercial-Industrial Grant Program", type: 'program_name'},
      {value: "State Building Energy Performance Contracting (run by DGS)", type: 'program_name'},
      {value: "Maryland Statewide Farm Energy Audit Program", type: 'program_name'},
      {value: "Home Performance Rebate Program", type: 'program_name'},
      {value: "Jane E. Lawton Conservation Loan Program ", type: 'program_name'},
      {value: "Kathleen A.P. Mathias Agriculture Energy Efficiency Grant Program", type: 'program_name'}
    ]
    this.sectors = [
      {value: 'Residential', type: 'sector'},
      {value: 'Commercial', type: 'sector'},
      {value: 'Agriculture', type: 'sector'},
      {value: 'Local Government', type: 'sector'},
      {value: 'State Government', type: 'sector'}
    ]
    this.sectors2 = _.clone(this.sectors)
    this.sectors2.splice(2,1)
    this.filter_hash = {
      'efficiency': this.sectors.concat(this.program_names),
      'renewable': this.sectors.concat(this.renewables),
      'transportation': this.sectors2.concat(this.stations).concat(this.vehicle_technology)
    }
    this.filterCollection.add(this.filter_hash[this.activetab])
  },
  renderChart: function(chart) {
    var view = {}
    if (chart.get('chart_type') === 'map') {
      this.mapView = new MapView({
        model: chart
      })

      this.$el.find('.charts > .row').append(this.mapView.render().el)
      this.mapView.makeMap()
    } else {
      if (!chart.get('filter_color') && this.tab_colors[this.activetab]) {
        chart.set('colors', [this.tab_colors[this.activetab]])
      }
      view = this.makeChartView(chart)
      var container = $('<div class="chart-container"/>')
      container.append(view.render().el)
      this.$el.find('.charts > .row').append(container)
      setTimeout(function(){view.resize()}, 100)
    }
  },
  makeChartView: function(chart) {
    var view
    switch (chart.get('chart_type')) {
      case 'bar':
        view = new BarChartView({
          model: chart
        })
        break
      case 'stacked':
        view = new StackedBarChartView({
          model: chart
        })
        break
      case 'line':
        view = new LineChartView({
          model: chart
        })
        break
      case 'pie':
        view = new PieChartView({
          model: chart
        })
        break
      case 'hbar':
        view = new HorizontalBarChartView({
          model: chart
        })
        break
      case 'table':
        view = new TableView({
          model: chart
        })
        break
      case 'stat':
        view = new StatView({
          model: chart
        })
        break
    }
    return view
  },
  render: function() {
    this.$el.html(this.template())

    this.chartCollection.add(this.mapModel)

    this.filterMenuView = new FilterMenuView()
    this.$el.find('.charts > .row').append(this.filterMenuView.render().el)

    this.filterMenuView.update()

    this.chartCollection.add(this.chart_hash[this.activetab])

    return this
  },
  update: function(e) {
    var self = this
    this.updateChartCollection()
    this.chartCollection.each(function(chart) {
      chart.update()
    })
  },
  updateChartCollection: function() {
    var self = this
    var tech_filters = this.filterCollection.where({active: true, type: 'technology'})
    if (tech_filters.length === 1) {
      var new_charts = []
      this.chart_hash['capacity_charts'].forEach(function(chart) {
        chart = _.clone(chart)
        var chart_exits = self.chartCollection.where({api: chart.api})
        if (chart_exits.length === 0) {
          chart.title = tech_filters[0].get('value') + ' ' + chart.title
          chart.units = tech_filters[0].get('units')
          chart.yLabel = chart.units
          if (chart.chart_type === 'line') {
            chart.colors = [tech_filters[0].get('color')]
          }
          new_charts.push(chart)
        }
      })
      if (new_charts.length) this.capacityCharts = this.chartCollection.add(new_charts)
    } else {
      if (this.capacityCharts) this.chartCollection.remove(this.capacityCharts)
    }
  },
  switchTab: function(tab) {
    $('ul.nav li').removeClass('active')
    $('ul.nav li a[href="#' + tab + '"]').parent().addClass('active')
    var self = this
    if (tab === 'home') {
      $('.charts').hide()
      $('.filter-summary').hide()
      $('.home').show()
    } else {
      $('.home').hide()
      $('.charts').show()
      $('.filter-summary').show()
      if (tab !== this.activetab) {
        this.activetab = tab
        $('.tab-info a').attr('href', self.socrata_links[tab])
        this.mapView.map.invalidateSize()
        var filters = []
        var geos = this.filterCollection.where({geo: true})
        var geotype = this.filterCollection.where({type: 'geotype'})
        this.filterCollection.reset(this.filter_hash[tab].concat(geos).concat(geotype))
        this.filterMenuView.update()

        var charts = []
        this.chartCollection.findWhere({chart_type: 'map'}).set('data', [])
        this.chartCollection.each(function(chart, idx) {
          if (chart.get('chart_type') !== 'map') {
            chart.abort()
            charts.push(chart)
          }
        })
        this.chartCollection.remove(charts)
        this.chartCollection.add(this.chart_hash[tab])
        this.update()
      }
    }
  }
})

module.exports = Dashboard
},{"./BarChartView":10,"./ChartCollection":11,"./ChartModel":12,"./FilterCollection":15,"./FilterMenuView":17,"./HorizontalBarChartView":19,"./LineChartView":20,"./MapView":21,"./PieChartView":22,"./StackedBarChartView":24,"./StatView":25,"./TableView":26,"./templates":28}],15:[function(require,module,exports){
const FilterModel = require('./FilterModel')

const FilterCollection = Backbone.Collection.extend({
  model: FilterModel
})

module.exports = FilterCollection
},{"./FilterModel":18}],16:[function(require,module,exports){
const templates = require('./templates')(Handlebars)

const FilterLabelView = Backbone.View.extend({
  template: templates['filter-label'],
  tagName: 'div',
  className: 'filter-label',
  events: {
    'click': 'activate'
  },
  initialize: function() {
    this.listenTo(this.model, 'remove', this.remove)
    this.listenTo(this.model, 'change:active', this.changeActive)
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()))
    this.style()
    return this
  },
  style: function() {
    if (this.model.get('color')) {
      //if ((this.model.get('type') === 'sector' && Dashboard.activetab === 'efficiency')
       //  || (Dashboard.activetab !== 'efficiency' && this.model.get('type') !== 'sector')) {
        this.$el.find('button').addClass('colored')
        this.$el.find('button').css('background-color', this.model.get('color'))
      //}
    }
  },
  activate: function(filter, e){
    var active = this.model.get('active')
    this.model.set('active', !active)
  },
  changeActive: function() {
    if (this.model.get('active')) {
      this.$el.find('button').addClass('active')
    } else {
      this.$el.find('button').removeClass('active')
    }
  }
})

module.exports = FilterLabelView
},{"./templates":28}],17:[function(require,module,exports){
const ChartView = require('./ChartView')
const FilterLabelView = require('./FilterLabelView')
const TechnologyFilter = require('./TechnologyFilter')
const templates = require('./templates')(Handlebars)  

const FilterMenuView = ChartView.extend({
  template: templates['filter-menu'],
  description: {
    renewable: 'Select filters to view Maryland Energy Administration contributions to the growth of affordable and reliable renewable energy in our state.',
    efficiency: 'Select filters to view Maryland Energy Administration contributions to the growth of affordable energy efficiency in our state.',
    transportation: 'Select filters to view Maryland Energy Administration contributions to the growth of affordable and reliable clean transportation in our state.'
  },
  events: {
    'click .reset': 'resetFilters',
    'change select': 'changeDropdown'
  },
  initialize: function(){
    Dashboard.filterCollection.on('change:active', this.changeSummary, this)
    Dashboard.filterCollection.on('add', this.changeSummary, this)
    Dashboard.filterCollection.on('remove', this.changeSummary, this)
    Dashboard.filterCollection.on('reset', this.removeFilter, this)
  },
  render: function() {
    var self = this
    this.$el.html(this.template({title: 'Project Filters', toolbar: false}))
    this.changeSummary()
    return this
  },
  update: function() {
    var self = this
    this.resize()
    self.$el.find('.technology').hide()
    self.$el.find('.vehicle_technology').hide()
    self.$el.find('.sector').hide()
    self.$el.find('.program').hide()
    self.$el.find('.charging_fueling_station_technology').hide()
    self.$el.find('.description > p').html(this.description[Dashboard.activetab])
    $('.the-filters').empty()
    Dashboard.filterCollection.each(function(filter) {
      if (filter.get('visible')) {
        if (filter.get('type') === 'technology') {
          self.$el.find('.technology').show()
          self.$el.find('.technology .the-filters').append(new TechnologyFilter({model: filter}).render().el)
        } else if (filter.get('type') === 'vehicle_technology') {
          self.$el.find('.vehicle_technology').show()
          self.$el.find('.vehicle_technology .the-filters').append(new TechnologyFilter({model: filter}).render().el)
        } else if (filter.get('type') === 'charging_fueling_station_technology') {
          self.$el.find('.charging_fueling_station_technology').show()
          self.$el.find('.charging_fueling_station_technology .the-filters').append(new TechnologyFilter({model: filter}).render().el)
        } else if (filter.get('type') === 'sector') {
          self.$el.find('.sector').show()
          self.$el.find('.sector .the-filters').append(new FilterLabelView({model: filter}).render().el)
        } else if (filter.get('type') === 'program_type') {
          self.$el.find('.program').show()
          self.$el.find('.program .the-filters').append(new FilterLabelView({model: filter}).render().el)
        }
      }
    })
    var program_names = Dashboard.filterCollection.where({type: 'program_name'})
    if (program_names.length) {
      var dropdown = this.makeDropDown('program_name', program_names)
      self.$el.find('.program').show()
      self.$el.find('.program .the-filters').append(dropdown)
    }
  },
  makeDropDown: function(type, filters) {
    filters.sort(function(a, b){
      if (a.get('value') < b.get('value')) return -1
      if (a.get('value') > b.get('value')) return 1
      return 0
    })
    var html = '<select class="form-control" id="' + type + '">'
    html += '<option value="">All</option>'
    _.each(filters, function(filter) {
      html += '<option value="' + filter.get('value') + '">' + filter.get('value') + '</option>'
    })
    html += '</select>'
    return html
  },
  changeDropdown: function(e) {
    var value = $(e.currentTarget).val()
    var type = $(e.currentTarget).attr('id')
    _.each(Dashboard.filterCollection.where({type: type}), function(f) {
      f.set('active', false, {silent: true})
    })
    var filter = Dashboard.filterCollection.findWhere({type: type, value: value})
    if (filter) {
      filter.set('active', true, {silent: true})
    }
    this.changeSummary()
    Dashboard.update()
  },
  removeFilter: function(filter) {

  },
  resetFilters: function() {
    Dashboard.mapView.reset()
    var geofilters = Dashboard.filterCollection.where({geo: true})
    Dashboard.filterCollection.remove(geofilters)
    Dashboard.filterCollection.each(function(filter) {
      if (filter.get('active')) filter.set({'active': false})
    })
    this.$el.find('select').val('')
  },
  changeSummary: function() {
    $('.dashboard .filter-summary').html('')
    var summary = '<p>'
    var filters = _.reject(Dashboard.filterCollection.where({active: true}), function(f) {
      if (f.get('type') === 'group') return true
    })
    if (filters.length == 0) {
      summary += 'All Projects'
    } else {
      var filters = Dashboard.filterCollection.where({active: true, type: 'technology'})
      if (filters.length) {
        var x = []
        _.each(filters, function(f) {
          x.push(f.get('value'))
        })
        if (filters.length == 1) {
          summary += x[0] + ' projects'
        } else {
          summary += _.initial(x).join(', ')
            + ' and ' + _.last(x)
            + ' projects'
        }
      } else {
        summary += 'All projects'
      }
      var filters = Dashboard.filterCollection.where({active: true, geo: true})
      if (filters.length) {
        var x = []
        _.each(filters, function(f) {
          x.push(f.get('value'))
        })
        var type = filters[0].get('type')
        var geo_lookup = {
          'county': 'County',
          'legislative': 'Legislative District',
          'congressional': 'Congressional District',
          'zipcode': 'Zip Code',
        }
        summary += ' in '
        if (filters.length === 1 ) {
          if (type === 'county') {
            summary += x[0] + ' ' + geo_lookup[type]
          } else {
            summary += geo_lookup[type] + ' ' + x[0]
          }
        } else {
          var list = '' + _.initial(x).join(', ')
            + ' and ' + _.last(x)
          if (type === 'county') {
            summary += list + ' Counties'
          } else {
            summary += geo_lookup[type] + 's ' + list
          }
        }
      }
      var filters = Dashboard.filterCollection.where({active: true, type: 'program_type'})
      if (filters.length) {
        var x = []
        _.each(filters, function(f) {
          x.push(f.get('value'))
        })
        if (filters.length == 1) {
          summary += ' funded by ' + x.join(', ')
        } else {
          summary += ' funded by '
            + _.initial(x).join(', ')
            + ' and ' + _.last(x)
        }
      }
      var filters = Dashboard.filterCollection.where({active: true, type: 'program_name'})
      if (filters.length) {
        var x = []
        _.each(filters, function(f) {
          x.push(f.get('value'))
        })
        if (filters.length == 1) {
          summary += ' in the ' + x.join(', ').replace('Program', '') + ' program'
        } else {

        }
      }
      var filters = Dashboard.filterCollection.where({active: true, type: 'sector'})
      if (filters.length) {
        var x = []
        _.each(filters, function(f) {
          x.push(f.get('value'))
        })
        if (filters.length == 1) {
          summary += ' in the ' + x[0] + ' sector'
        } else {
          summary += ' in '
            + _.initial(x).join(', ')
            + ' and ' + _.last(x)
            + ' sectors'
        }
      }
    }
    summary += '</p>'
    $('.dashboard .filter-summary').html(summary)
  }
})

module.exports = FilterMenuView
},{"./ChartView":13,"./FilterLabelView":16,"./TechnologyFilter":27,"./templates":28}],18:[function(require,module,exports){
const createcss = require('createcss')

const FilterModel = Backbone.Model.extend({
  defaults: function() {
    return {
      active: false,
      visible: true
    }
  },
  initialize: function(){
    if(!this.get('display')) {
      this.set('display', this.get('value'))
    }
    if (this.get('color')) {
      createcss.selector('.' + this.get('type') + this.get('value').replace(/ /g, '').replace('(', '').replace(')', ''), 'background: ' + this.get('color'))
    }
  }
})

module.exports = FilterModel
},{"createcss":8}],19:[function(require,module,exports){
const BarChartView = require('./BarChartView')

const HorizontalBarChartView = BarChartView.extend({
  drawChart: function() {
    var chartel = this.$el.find('.chart-inner').get(0)
    this.chart = new GeoDash.BarChartHorizontal(chartel, {
      y: this.model.get('key')
      , x: []
      , colors: Dashboard.colors
      , xTickFormat: d3.format(".2s")
      , yWidth: 60
      , opacity: 1
    })
  },
  prepData: function(data){
    var row = data[0]
    var keys = _.without(_.keys(row), this.model.get('key'))
    var numberkeys = []
    _.each(keys, function(key){
      if(_.isNumber(row[key])){
        numberkeys.push(key)
      }
    })
    this.chart.options.x = numberkeys
    return data
  }
})

module.exports = HorizontalBarChartView
},{"./BarChartView":10}],20:[function(require,module,exports){
const BarChartView = require('./BarChartView')


const LineChartView = BarChartView.extend({
  drawChart: function() {
    if (this.model.get('colors')) {
      this.colors = this.model.get('colors')
    }
    this.chart = new GeoDash.LineChart(this.chartel, {
      x: this.model.get('key')
      , y: this.model.get('y')
      , colors: this.colors
      , legend: true
      , legendWidth: 90
      , hoverTemplate: '{{y}} ' + this.model.get('units')
      , interpolate: 'monotone'
      , xTickFormat: d3.time.format('%Y')
      , yTicksCount: 5
      , dotRadius: 2
      , legend: false
      , showArea: true
      , accumulate: true
      , valueFormat: this.model.get('valueFormat')
      , yLabel: this.model.get('yLabel')
      , xTimeInterval: {
          timePeriod: d3.time.year,
          interval: 1
        }
    })
  },
  prepData: function(res) {
    var self = this
    var keys = _.without(_.keys(res[0]), this.model.get('key'))
    if (this.model.get('y')) {
      this.chart.options.y = this.model.get('y')
    } else {
      this.chart.options.y = keys
    }
    var parseDate = d3.time.format('%-m-%Y').parse
    _.each(res, function(obj, idx){
      var isDate = _.isDate(obj[self.model.get('key')])
      if (!isDate) {
        obj[self.model.get('key')] = parseDate(obj[self.model.get('key')])
      }
      _.each(keys, function(key) {
        var x = obj[key]
        obj[key] = Math.round(x*100) / 100
      })
    })
    res = _.sortBy(res, function(row, i) {
      return row[self.model.get('key')]
    })
    this.model.set('data', res, {silent: true})
    //this.setColors(data)
    return res
  }
})

module.exports = LineChartView
},{"./BarChartView":10}],21:[function(require,module,exports){
const ChartModel = require('./ChartModel')
const FilterModel = require('./FilterModel')
const templates = require('./templates')(Handlebars)

const MapView = Backbone.View.extend({
  template: templates.map,
  layers_template: templates.layers,
  templates: {
    'renewable': templates['renewable-popup'],
    'efficiency': templates['efficiency-popup'],
    'transportation': templates['transportation-popup']
  },
  technology_fields: {
    'renewable': ['technology'],
    'efficiency': ['sector'],
    'transportation': ['charging_fueling_station_technology', 'vehicle_technology']
  },  
  color_fields: {
    'renewable': 'technology',
    'efficiency': 'sector',
    'transportation': 'charging_fueling_station_technology'
  },  
  events: {
    'click .layerToggle': 'layerToggle'
  },
  initialize: function() {
    this.render()
    this.listenTo(this.model, 'change:data', this.update, this)
    this.listenTo(Dashboard.filterCollection, 'remove', this.updateGeoFilters, this)
    this.listenTo(this.model, 'change:loading', this.loading)
  },
  render: function() {
      this.$el.html(this.template())
    return this
  },
  makeMap: function() {
    var self = this
    var el = this.$el.find('.map').get(0)
    this.map = L.map(el, {
      attributionControl: false,
      minZoom: 7,
      maxZoom: 16,
      defaultExtentControl: true
    }).setView([39, -77], 7)
    self.$el.find('.map').find('.leaflet-top.leaflet-right').html('<div class="loader"><i class="fa fa-circle-o-notch fa-spin"></i></div>')
    self.$el.find('.map').find('.leaflet-bottom.leaflet-right').html('<div id="mouseover" class="layerToggle"></div>')
    this.makeLayers()
  },
  makeLayers: function() {
    var self = this
    this.style = {
      "color": "#333",
      "weight": 1,
      "opacity": 0.65,
      "fillOpacity": 0.1,
      "fillColor": "#A9C783"
    }
    this.selectedStyle = JSON.parse(JSON.stringify(this.style))
    this.selectedStyle.fillOpacity = 0.4

    this.circlestyle = {
      radius: 4,
      fillColor: "#bbb",
      color: "#333",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8,
      projects: 1
    }

    var mapbox = L.tileLayer('https://{s}.tiles.mapbox.com/v3/esrgc.map-y9awf40v/{z}/{x}/{y}.png')
    mapbox.addTo(self.map)

    this.projects = L.markerClusterGroup({
      maxClusterRadius: 50,
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      polygonOptions: {
        color: '#2B4E72',
        weight: 2,
        fillColor: '#333',
        fillOpacity: 0.1
      },
      iconCreateFunction: function(cluster) {
        var markers = cluster.getAllChildMarkers()
        var num_projects = 0
        var tech = []
        var tech_fields = []
        _.each(markers, function(m) {
          if (m.options.projects) {
            num_projects += m.options.projects
          }
          if (m.options.tech) tech.push(m.options.tech)
          if (m.options.tech_field) tech_fields.push(m.options.tech_field)
        })
        tech = _.uniq(tech)
        tech_fields = _.uniq(tech_fields)
        var className = 'projects-icon '
        if (tech.length === 1 && Dashboard.activetab !== 'efficiency') {
          className += tech[0]
        } else {
          className += 'multiple'
        }
        if (tech_fields.length === 1) {
          className += ' ' + tech_fields[0]
        }
        className = className + ' ' + Dashboard.activetab
        return new L.DivIcon({
          className: className,
          html: num_projects,
          iconSize: L.point(30, 30)
        })
      }
    }).addTo(self.map)

    $.when(
      $.getJSON('data/maryland-single.json', function(json) {
        self.maryland = L.geoJson(json, {
          style: self.style,
          name: 'state'
        })
      }),
      $.getJSON('data/maryland-counties.json', function(json) {
        self.counties = L.geoJson(json, {
          style: self.style,
          onEachFeature: self.onEachFeature.bind(self),
          name: 'county'
        }).addTo(self.map)
        var f = new FilterModel({
          value: self.counties.options.name,
          type: 'geotype'
        }).on('change:value', function(e) {
          _.each(Dashboard.chartCollection.where({geo: true}), function(chart) {
            chart.update()
          })
        })
        Dashboard.filterCollection.add(f)
      }),
      $.getJSON('data/maryland-legislative-districts.json', function(json) {
        self.legislativeDistricts = L.geoJson(json, {
          style: self.style,
          onEachFeature: self.onEachFeature.bind(self),
          name: 'legislative'
        })
      }),
      $.getJSON('data/maryland-congressional-districts.json', function(json) {
        self.congressionalDistricts = L.geoJson(json, {
          style: self.style,
          onEachFeature: self.onEachFeature.bind(self),
          name: 'congressional'
        })
      }),
      $.getJSON('data/maryland-zips.json', function(json) {
        self.zips = L.geoJson(json, {
          style: self.style,
          onEachFeature: self.onEachFeature.bind(self),
          name: 'zipcode'
        })
      })
    ).then(function() {

      self.layer_switcher = {layers: [
        {name: "Maryland", id: "state", layer: self.maryland, type: 'base'},
        {name: "Counties", id: "county", layer: self.counties, type: 'base'},
        {name: "Leg. Dist.", id: "legislative", layer: self.legislativeDistricts, type: 'base'},
        {name: "Cong. Dist.", id: "congressional", layer: self.congressionalDistricts, type: 'base'},
        {name: "Zip Codes", id: "zipcode", layer: self.zips, type: 'base'},
        {name: "Individual Projects", id: "projects", layer: self.projects, type: 'overlay'}
      ]}
      var layers_html = self.layers_template(self.layer_switcher)
      self.$el.find('.map').find('.leaflet-bottom.leaflet-left').html(layers_html)
      self.$el.find('#county').find('p').addClass('active')
      self.$el.find('#projects').find('p').addClass('active')
    })
  },
  makePopup: function(features, latlng, tech_field) {
    var self = this
    var money = d3.format('$,f')
    var content = '<div class="map-projects">'
    _.each(features, function(feature) {
      var i = (parseFloat(feature.total_project_cost) - parseFloat(feature.mea_award))/parseFloat(feature.mea_award) || 0
      feature.investment_leverage = d3.round(i, 2)
      if (feature.mea_award) {
        feature.mea_award = money(feature.mea_award)
      }
      if (feature.other_agency_dollars) {
        feature.other_agency_dollars = money(feature.other_agency_dollars)
      } else {
        feature.other_agency_dollars = money(0)
      }
      if (feature.total_project_cost) {
        feature.total_project_cost = money(feature.total_project_cost)
      }
      feature.color = '#bbb'
      //var color_field = self.color_fields[Dashboard.activetab]
      if (feature[tech_field]) {
        var filter = Dashboard.filterCollection.where({value: feature[tech_field]})
        if (filter.length) {
          feature.color = filter[0].get('color')
        }
      }
      content += self.templates[Dashboard.activetab](feature)
    })
    content += '</div>'
    return content
  },
  layerToggle: function(e) {
    var self = this
    var id = $(e.currentTarget).attr('id')
    var layer = _.findWhere(this.layer_switcher.layers, {id: id})
    if (layer && layer.type === 'overlay') {
      if (self.map.hasLayer(layer.layer)) {
        this.map.removeLayer(layer.layer)
        $(e.currentTarget).find('p').removeClass('active')
        this.model.set('visible', false)
      } else {
        this.map.addLayer(layer.layer)
        $(e.currentTarget).find('p').addClass('active')
        this.model.set('visible', true)
      }
    } else if (layer.type === 'base') {
      if (!this.map.hasLayer(layer.layer)) {
        var base = _.where(this.layer_switcher.layers, {type: 'base'})
        _.each(base, function(l) {
          self.map.removeLayer(l.layer)
          self.$el.find('.layerToggle#' + l.id).find('p').removeClass('active')
        })
        var geofilters = Dashboard.filterCollection.where({geo: true})
        Dashboard.filterCollection.remove(geofilters)
        this.map.addLayer(layer.layer)
        $(e.currentTarget).find('p').addClass('active')
        Dashboard.filterCollection.findWhere({type: 'geotype'}).set('value', layer.id)
      }
    }
  },
  onEachFeature: function(feature, layer) {
    var self = this
    layer.on('click', function(feature, layer, e){
      var options = layer.options || layer._options
      var name = feature.properties.name
      var filter = Dashboard.filterCollection.findWhere({type: options.name, value: name})
      if (filter) {
        layer.setStyle(self.style)
        Dashboard.filterCollection.remove(filter)
      } else {
        layer.setStyle(self.selectedStyle)
        var f = new FilterModel({
          value: name,
          type: options.name,
          active: true,
          geo: true
        })
        Dashboard.filterCollection.add(f)
      }
    }.bind(this, feature, layer))
    layer.on('mouseover', function(layer, e) {
      var options = layer.options || layer._options
      var name = e.target.feature.properties.name
      if (options.name === 'congressional') {
        name = name.replace('24', '')
      }
      self.$el.find('.map').find('#mouseover').html(name)
      self.$el.find('.map').find('#mouseover').show()
    }.bind(this, layer))
    layer.on('mouseout', function(e) {
      self.$el.find('.map').find('#mouseover').hide()
    })
  },
  updateGeoFilters: function(filter) {
    var self = this
    if (filter.get('geo')) {
      var layer = _.where(this.layer_switcher.layers, {id: filter.get('type')})[0].layer
      layer.eachLayer(function(l) {
        if(l.feature.properties.name === filter.get('value')) {
          l.setStyle(self.style)
        }
      })
    }
  },
  update: function() {
    var self = this
    self.projects.clearLayers()
    self.map.closePopup()
    _.each(this.model.get('data').points, function(point) {
      if (point.point) {
        var latlng = point.point.split(',').map(parseFloat)
        var technology_fields = self.technology_fields[Dashboard.activetab]
        technology_fields.forEach(function(tech_field, tech_idx) {
          if (point[tech_field] && point[tech_field].length) {
            for(var i = 0; i < point[tech_field].length; i++) {
              var technology = point[tech_field][i].t
              var projects = point[tech_field][i].p
              var tech_filter = tech_field + technology.replace(/ /g, '').replace('(', '').replace(')', '')
              if (projects > 1) {
                var className = 'projects-icon '
                var marker_props = {projects: projects}
                if (tech_field !== 'sector') {
                  className += tech_filter
                  className += ' ' + tech_field
                  marker_props.tech = tech_filter
                  marker_props.tech_field = tech_field
                }
                marker_props.icon = L.divIcon({
                  className: className,
                  html: projects,
                  iconSize: L.point(30, 30)
                })
                var marker = L.marker(latlng, marker_props)
              } else {
                if (technology) {
                  if (tech_field !== 'sector') {
                    self.circlestyle.tech = tech_filter
                    self.circlestyle.tech_field = tech_field
                  }
                  var filter = Dashboard.filterCollection.where({value: technology, type: tech_field})
                  if (filter.length) {
                    if (tech_field === 'sector') {
                      self.circlestyle.fillColor = '#bbb'
                    } else {
                      self.circlestyle.fillColor = filter[0].get('color')
                    }
                    self.circlestyle.radius = 6
                  }
                } else {
                  self.circlestyle.tech = 'multiple'
                  self.circlestyle.fillColor = '#000'
                }
                if (tech_field === 'charging_fueling_station_technology') {
                  var marker_props = {projects: 1}
                  var className = 'projects-icon '
                  className += tech_filter
                  className += ' ' + tech_field
                  marker_props.tech = tech_filter
                  marker_props.tech_field = tech_field
                  marker_props.icon = L.divIcon({
                    className: className,
                    iconSize: L.point(10, 10)
                  })
                  var marker = L.marker(latlng, marker_props)
                } else {
                  var marker = L.circleMarker(latlng, self.circlestyle)
                }
              }
              marker.on('click', self.markerClick.bind(self, point, tech_field, technology, latlng))
              self.projects.addLayer(marker)
            }
          }
        })
      }
    })
  },
  markerClick: function(project, tech_field, technology, latlng, e) {
    var self = this
    var url = 'api/getProjectsByPoint'
    url = self.model.makeQuery(url)
    //url += '&_id=' + project._id
    url += '&point=' + project.point
    url += '&tech=' + technology
    url += '&tech_field=' + tech_field
    var popup = L.popup()
    .setLatLng(latlng)
    .setContent('Loading')
    .openOn(self.map)
    $.getJSON(url, function(res){
      popup.setContent(self.makePopup(res, latlng, tech_field))
    })
  },
  loading: function() {
    this.$el.find('.map').find('.loader').toggle()
  },
  reset: function() {
    this.map.setView([39, -77], 7)
  }
})

module.exports = MapView
},{"./ChartModel":12,"./FilterModel":18,"./templates":28}],22:[function(require,module,exports){
const BarChartView = require('./BarChartView')

const PieChartView = BarChartView.extend({
  changeKey: function() {
    if (this.chart) {
      this.chart.options.label = this.model.get('key')
    }
  },
  drawChart: function() {
    this.chart = new GeoDash.PieChart(this.chartel, {
      label: this.model.get('key')
      , value: this.model.get('y')
      , y: this.model.get('y')
      , colors: this.model.get('colors')
      , arclabels: true
      , arclabelsMin: 8
      , opacity: 1
      , hoverTemplate: '{{label}}: {{value}} ' + this.model.get('units')
      , valueFormat: this.model.get('valueFormat')
      , arcstrokewidth: 1
      , arcstrokecolor: '#fff'
      , innerRadius: 0
      , legend: this.model.get('legend')
    })
  },
  changeChartOptionsOnKey: function(key) {

    this.chart.options.valueFormat = d3.format(',.0f')

    var tool = _.findWhere(this.model.get('tools'), {value: key})
    if (tool) {
      if (tool.type) {
        if (tool.type === 'money') {
          this.chart.options.valueFormat = d3.format('$,.0f')
        }
      }
    }

    this.chart.options.value = key
    this.chart.options.y = key
    this.model.set('value', key)
    this.model.set('y', key)
  },
  prepData: function(data){
    var self = this
    var row = data[0]
    if (row) {
      data = _.sortBy(data, function(row, i) {
        return row[self.chart.options.y]
      }).reverse()
      this.setColors(data)
      this.model.set('data', data, {silent: true})
      if (data.length > self.dataLimit) {
        data = data.splice(0, self.dataLimit)
      }
    }
    return data
  }
})

module.exports = PieChartView
},{"./BarChartView":10}],23:[function(require,module,exports){
const Router = Backbone.Router.extend({
  routes: {
    ':tab': 'renewable'
  },
  renewable: function(tab) {
    Dashboard.switchTab(tab)
  }
})

module.exports = Router
},{}],24:[function(require,module,exports){
const BarChartView = require('./BarChartView')

const StackedBarChartView = BarChartView.extend({
  prepData: function(data){
    var self = this
    var row = data[0]
    if (row) {
      var totals = []
      data.forEach(function(row, i) {
        if (!row[self.model.get('key')]) {
          row[self.model.get('key')] = 'Other'
        }
        totals[i] = 0
        if (typeof self.chart.options.y === 'string') {
          var y = +row[self.chart.options.y]
          row[self.chart.options.y] = y
          totals[i] += y
        } else if (typeof self.chart.options.y === 'object') {
          self.chart.options.y.forEach(function(y) {
            row[y] = +row[y]
            totals[i] += row[y]
          })
        }
      })
      data = _.sortBy(data, function(row, i) {
        return totals[i]
      }).reverse()
      this.setColors(data)
      this.model.set('data', data, {silent: true})
      data = _.map(data, function(row) {
        if (row['MEA Contribution'] === 0) {
          var i = 0
        } else {
          var i = (parseFloat(row['Total Project Cost']) - parseFloat(row['MEA Contribution']))/parseFloat(row['MEA Contribution']) || 0
        }
        row['Investment Leverage'] = d3.round(i, 2)
        return row
      })
      if (data.length > self.dataLimit) {
        data = data.splice(0, self.dataLimit)
      }
    }
    return data
  },
  toTable: function(){
    var y = ['Total Project Cost', 'MEA Contribution', 'Investment Leverage']
    var TableView = require('./TableView')
    var view = new TableView({
      model: this.model,
      y: y,
      chart: this.chart
    })
    this.$el.parent().html(view.render().el)
    view.resize()
  }
})

module.exports = StackedBarChartView
},{"./BarChartView":10,"./TableView":26}],25:[function(require,module,exports){
const ChartView = require('./ChartView')
const templates = require('./templates')(Handlebars)

const StatView = ChartView.extend({
  template: templates.stat,
  format: d3.format('$,.0f'),
  events: function(){
    return _.extend({}, ChartView.prototype.events,{
      
    })
  },
  render: function() {
    var self = this
    this.$el.html(this.template(this.model.toJSON()))
    this.$el.find('.chart-inner').css('overflow', 'hidden')
    this.chart = false
    return this
  },
  update: function() {
    this.resize()
    var round = d3.format('.2')
    if (Dashboard.activetab === 'efficiency') {
      this.$el.find('.efficiency-note').show()
    } else {
      this.$el.find('.efficiency-note').hide()
    }
    if (this.model.get('data').length) {
      this.empty(false)
      var data = this.model.get('data')[0]
      var stat = {}
      stat.contribution = this.format(data.contribution)
      stat.sum_other_agency_dollars = this.format(data.sum_other_agency_dollars)
      if (data.il_contribution === 0 || data.il_project_cost === 0) {
        stat.investment_leverage = 'Not Available'
      } else {
        var i = (parseFloat(data.il_project_cost) - parseFloat(data.il_contribution))/parseFloat(data.il_contribution) || 0
        stat.investment_leverage = d3.round(i, 2)
      }
      if (data.project_cost === 0) {
        stat.project_cost = 'Not Available'
      } else {
        stat.project_cost = this.format(data.project_cost)
      }
      if (data.electricity_savings_kwh) {
        stat.electricity_savings_kwh = d3.round(data.electricity_savings_kwh, 0)
      }
      var html = '<table class="table table-condensed statview">'
      html += '<tr><td>Total Projects</td><td>' + d3.format(',')(data.total_projects) + '</td></tr>'
      html += '<tr><td>MEA Contribution</td><td>' + stat.contribution + '</td></tr>'
      html += '<tr><td>Total Project Cost</td><td>' + stat.project_cost + '</td></tr>'
      html += '<tr><td>Investment Leverage</td><td>' + stat.investment_leverage + '</td></tr>'
      if (Dashboard.activetab === 'efficiency') {
        html += '<tr><td>Electricity Savings</td><td>' + d3.format(',')(stat.electricity_savings_kwh) + ' kWh</td></tr>'
      }
      html += '</table>'
      this.$el.find('.stat').html(html)
    } else {
      this.empty(true)
    }
  },
  prepData: function(data){
    return data
  }
})

module.exports = StatView
},{"./ChartView":13,"./templates":28}],26:[function(require,module,exports){
const ChartView = require('./ChartView')
const templates = require('./templates')(Handlebars)

const TableView = ChartView.extend({
  template: templates['table-empty'],
  events: function(){
    return _.extend({},ChartView.prototype.events,{
      'click th' : 'sortByHeader',
      'click td.grouper' : 'setGroupBy',
      "click .tochart": "toChart"
    })
  },
  render: function() {
    var self = this
    this.$el.html(this.template(this.model.toJSON()))
    this.drawTable(this.model.get('data'))
    this.$el.find('th').each(function(idx, th){
      if(th.innerHTML === self.model.get('sort_key')) {
        $(th).addClass('sort')
      }
    })
    $(this.$el.find('thead tr')).each(function(idx){
      $(this).children(':first').addClass('first')
    })
    $('.grouper a').tooltip()
    return this
  },
  update: function(){
    this.drawTable(this.model.get('data'))
    this.resize()
  },
  drawTable: function(data) {
    var self = this
    if (this.options.y) {
      var y = this.options.y
    } else if (this.options.chart.options.y) {
      var y = this.options.chart.options.y
    } else {
      var  y = this.model.get('y')
    }
    var self = this
    var table = this.$el.find('table')
    table.empty()
    var html = '<thead><tr>'
    var keys = []
    html += '<th>' + this.model.get('key') + '</th>'
    if (typeof y === 'string') {
      y = [y]
    }
    y.forEach(function(_y) {
      html += '<th>' + _y
      if (self.model.get('showUnitsInTable')) {
        html += ' (' + self.model.get('units') + ')'
      }
      html += '</th>'
      keys.push(_y)
    })
    html += '</tr></thead><tbody>'
    _.each(data, function(row, idx) {
      html += '<tr>'
      html += '<td>' + self.model.get('labelFormat')(row[self.model.get('key')]) + '</td>'
        _.each(keys, function(key) {
          html += '<td>'
          if (self.model.get('dontFormat').indexOf(key) < 0) {
            html += self.options.chart.options.valueFormat(row[key])
          } else {
            html += row[key]
          }
          html += '</td>'
        })
      html += '</tr>'
    })
    html += '</tbody>'
    table.html(html)
  },
  prepData: function(res) {
    var self = this
    var table = {
      rows: [],
      columns: []
    }
    if(res.length) {
      var data = res
      var columns = _.keys(data[0])
      table.columns = columns
      _.each(data, function(row){
        var v = []
        columns.forEach(function(c) {
          v.push(row[c])
        })
        table.rows.push({
          row: v
        })
      })
    }
    return table
  },
  sortByHeader: function(e) {
    var column = $(e.target).html()
    var data = this.model.sortByKey(this.model.get('data'), column)
    this.drawTable(data)
    //this.model.set('data', data)
  },
  setGroupBy: function(e){
    var groupBy = this.model.get('groupBy')
    var value = $('<div />').html($(e.target).html()).text()
    if(!this.model.get('showID')) {
      var key = _.where(this.model.get('data'), {'Name': value})[0]['ID']
    } else {
      var key = value
    }
    var m = Dashboard.filterCollection.where({name: groupBy})
    if(m.length) {
      m[0].set({name: groupBy, value: key, display: value})
    } else {
      Dashboard.filterCollection.add([
        {name: groupBy, value: key, display: value}
      ])
    }
  },
  toChart: function(){
    var view = Dashboard.makeChartView(this.model)
    this.$el.parent().html(view.render().el)
    view.update()
  }
})

module.exports = TableView
},{"./ChartView":13,"./templates":28}],27:[function(require,module,exports){
const FilterLabelView = require('./FilterLabelView')
const templates = require('./templates')(Handlebars)

const TechnologyFilter = FilterLabelView.extend({
  template: templates['project-type']
})

module.exports = TechnologyFilter
},{"./FilterLabelView":16,"./templates":28}],28:[function(require,module,exports){
module.exports = function(Handlebars) {

var templates = {};

Handlebars.registerPartial("title", Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "  <div class=\"toolbar\">\r\n    <i class=\"fa fa-table tool totable\"></i>\r\n    <i class=\"fa fa-bar-chart-o tool tochart\"></i>\r\n  </div>\r\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, options, functionType="function", helperMissing=helpers.helperMissing, blockHelperMissing=helpers.blockHelperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\"title\">\r\n";
  stack1 = ((helper = (helper = helpers.toolbar || (depth0 != null ? depth0.toolbar : depth0)) != null ? helper : helperMissing),(options={"name":"toolbar","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}),(typeof helper === functionType ? helper.call(depth0, options) : helper));
  if (!helpers.toolbar) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if (stack1 != null) { buffer += stack1; }
  return buffer + "  <h3>"
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</h3>\r\n</div>";
},"useData":true}));

templates["chart"] = Handlebars.template({"1":function(depth0,helpers,partials,data,depths) {
  var helper, lambda=this.lambda, escapeExpression=this.escapeExpression, functionType="function", helperMissing=helpers.helperMissing;
  return "        <label><input type=\"radio\" name=\""
    + escapeExpression(lambda((depths[1] != null ? depths[1].cid : depths[1]), depth0))
    + "-chart-tools\" value=\""
    + escapeExpression(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"value","hash":{},"data":data}) : helper)))
    + "\"> "
    + escapeExpression(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"text","hash":{},"data":data}) : helper)))
    + "</label>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\""
    + escapeExpression(((helper = (helper = helpers.width || (depth0 != null ? depth0.width : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"width","hash":{},"data":data}) : helper)))
    + " block\">\r\n  <div class=\"chart\">\r\n";
  stack1 = this.invokePartial(partials.title, '    ', 'title', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  buffer += "    <div class=\"chart-inner\">\r\n      <div class=\"chart-tools\">\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.tools : depth0), {"name":"each","hash":{},"fn":this.program(1, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "      </div>\r\n      <div class=\"loader\"><i class=\"fa fa-circle-o-notch fa-spin\"></i></div>\r\n      <div class=\"the-chart\"></div>\r\n      <div class=\"nodata\">N/A</div>\r\n    </div>\r\n  </div>\r\n</div>";
},"usePartial":true,"useData":true,"useDepths":true});

templates["dashboard"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"home\">\r\n  <div class=\"row\">\r\n    <div class=\"col-lg-8 col-md-12 col-lg-offset-2 intro\">\r\n      <div class=\"panel panel-default\">\r\n        <div class=\"panel-heading\">\r\n          <h3 class=\"panel-title\">Welcome to the Maryland Smart Energy Investment Dashboard!</h3>\r\n        </div>\r\n        <div class=\"panel-body\">\r\n        <p>This dashboard illustrates <a href=\"https://energy.maryland.gov\">Maryland Energy Administration’s</a> contributions to the growth of <strong>affordable</strong>, <strong>reliable</strong>, <strong>renewable</strong> energy and <strong>energy efficiency</strong> industries in our state.</p>\r\n      <p>Additionally, this tool pinpoints publicly accessible locations of electric vehicle charging stations and other alternative refueling stations in our State.</p>\r\n      <p>The Maryland Smart Energy Investment Dashboard largely tracks MEA’s investments and is not intended to give a comprehensive summary of all projects and installations across the state. MEA occasionally makes changes in the types of projects eligible for awards; MEA's website has information on currently open programs and the types of projects eligible for awards. Please check the map periodically, as we continue the growth of Maryland’s energy economy.</p>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class=\"row\">\r\n    <div class=\"col-lg-8 col-md-12 col-lg-offset-2\">\r\n      <div id=\"chartLinkButtons\">\r\n        <div class=\"panel panel-default\">\r\n          <div class=\"panel-heading\">\r\n            <h3 class=\"panel-title\">Select a Section Below to Begin</h3>\r\n          </div>\r\n          <div class=\"panel-body\">\r\n                <div class=\"linkButton\">\r\n                  <h3>Renewable Energy</h3>\r\n                  <div class=\"linkButtonImg\"><a href=\"#renewable\" class=\"darken\"><img src=\"img/renewable-icon.png\"></a></div>\r\n                  <div class=\"description\">Show MEA contributions to the growth of affordable and reliable renewable energy.</div>\r\n                </div>\r\n                <div class=\"linkButton\">\r\n                  <h3>Energy Efficiency</h3>\r\n                  <div class=\"linkButtonImg\"><a href=\"#efficiency\" class=\"darken\"><img src=\"img/efficiency-icon.png\"></a></div>\r\n                  <div class=\"description\">Show MEA contributions to the growth of affordable energy efficiency.</div>\r\n                </div>\r\n                <div class=\"linkButton\">\r\n                  <h3>Transportation</h3>\r\n                  <div class=\"linkButtonImg\"><a href=\"#transportation\" class=\"darken\"><img src=\"img/transportation-icon.png\"></a></div>\r\n                  <div class=\"description\">Show MEA contributions to the growth of affordable and reliable clean transportation.</div>\r\n                </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class=\"row\">\r\n    <div class=\"col-lg-8 col-md-12 col-lg-offset-2\">\r\n      <div class=\"panel panel-default\">\r\n        <div class=\"panel-heading\" role=\"tab\" id=\"headingTwo\">\r\n          <h3 class=\"panel-title\">\r\n            <a data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#collapseTwo\" aria-expanded=\"false\" aria-controls=\"collapseTwo\">\r\n              Dashboard Help\r\n            </a>\r\n          </h3>\r\n        </div>\r\n        <div id=\"collapseTwo\" class=\"panel-collapse collapse in\" role=\"tabpanel\" aria-labelledby=\"headingTwo\">\r\n          <div class=\"panel-body\">\r\n            <p>Data on this dashboard can be viewed and downloaded from Maryland’s <a href=\"https://data.maryland.gov\">Open Data Portal</a>.</p>\r\n            <p>View a video User Guide on <a href=\"https://www.youtube.com/watch?v=UjX0k85u9gQ\">YouTube</a>.</p>\r\n            <p>Use the map filter list in the lower left-hand corner of the map to specify the type of geography to compare and to specify whether individual projects should be displayed on the map. Similar geographies can be compared by selecting one or more from the map. Deselect a region by single clicking it on the map or clear all selections using the Reset Map button.</p>\r\n            <p>Individual projects are displayed by default as numbered points on the map. These points are clustered at different zoom levels so as you zoom in on the map, the points disaggregate until a single point is visible or the points break out into their respective technologies. Click an individual project point to view a popup list of statistics relevant to that specific project.</p>\r\n            <p>Use the \"Project Filters\" buttons to further refine the charts.</p>\r\n            <p>The data display can be manipulated by selecting the chart or table icon in the upper right-hand side of each graph.</p>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <div class=\"logos\">\r\n        <a href=\"https://energy.maryland.gov\"><img src=\"img/mea_small.png\" alt=\"\"></a>\r\n        <a href=\"https://doit.maryland.gov/Pages/default.aspx\"><img src=\"img/doit_small.png\" alt=\"\"></a>\r\n        <a href=\"https://www.esrgc.org\"><img src=\"img/esrgc_logo.png\" alt=\"\"></a>\r\n        <a href=\"https://www.salisbury.edu\"><img src=\"img/SU logo.png\" alt=\"\"></a>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n<div class=\"charts\">\r\n  <div class=\"tab-info\"><a href=\"https://data.maryland.gov/dataset/Renewable-Energy-Geocoded/mqt3-eu4s\">View and Download Raw Data</a></div>\r\n  <div class=\"row\"></div>\r\n</div>";
  },"useData":true});

templates["efficiency-popup"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<a href=\""
    + escapeExpression(((helper = (helper = helpers.link || (depth0 != null ? depth0.link : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"link","hash":{},"data":data}) : helper)))
    + "\" target=\"_blank\">"
    + escapeExpression(((helper = (helper = helpers.program_name || (depth0 != null ? depth0.program_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"program_name","hash":{},"data":data}) : helper)))
    + "</a>";
},"3":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return escapeExpression(((helper = (helper = helpers.program_name || (depth0 != null ? depth0.program_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"program_name","hash":{},"data":data}) : helper)));
  },"5":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li><b>Project Name:</b> "
    + escapeExpression(((helper = (helper = helpers.project_name || (depth0 != null ? depth0.project_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"project_name","hash":{},"data":data}) : helper)))
    + "</li>";
},"7":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li><b>Total Project Cost:</b> "
    + escapeExpression(((helper = (helper = helpers.total_project_cost || (depth0 != null ? depth0.total_project_cost : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"total_project_cost","hash":{},"data":data}) : helper)))
    + "</li>";
},"9":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li><b>Investment Leverage:</b> "
    + escapeExpression(((helper = (helper = helpers.investment_leverage || (depth0 != null ? depth0.investment_leverage : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"investment_leverage","hash":{},"data":data}) : helper)))
    + "</li>";
},"11":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li><b>Notes:</b> "
    + escapeExpression(((helper = (helper = helpers.notes || (depth0 != null ? depth0.notes : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"notes","hash":{},"data":data}) : helper)))
    + "</li>";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\"map-project\" style=\"background: "
    + escapeExpression(((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"color","hash":{},"data":data}) : helper)))
    + "\">\r\n  <ul class=\"list-unstyled\">\r\n    <li><b>Program Name:</b> \r\n      ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.link : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n    </li>\r\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.project_name : depth0), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n    <li><b>Sector:</b> "
    + escapeExpression(((helper = (helper = helpers.sector || (depth0 != null ? depth0.sector : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"sector","hash":{},"data":data}) : helper)))
    + "</li>\r\n    <li><b>MEA Contribution:</b> "
    + escapeExpression(((helper = (helper = helpers.mea_award || (depth0 != null ? depth0.mea_award : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"mea_award","hash":{},"data":data}) : helper)))
    + "</li>\r\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.total_project_cost : depth0), {"name":"if","hash":{},"fn":this.program(7, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.investment_leverage : depth0), {"name":"if","hash":{},"fn":this.program(9, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n    <li><b>Electricity Savings:</b> "
    + escapeExpression(((helper = (helper = helpers.electricity_savings_kwh || (depth0 != null ? depth0.electricity_savings_kwh : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"electricity_savings_kwh","hash":{},"data":data}) : helper)))
    + " kWh</li>\r\n    <li><b>CO2 Emissions Reductions:</b> "
    + escapeExpression(((helper = (helper = helpers.co2_emissions_reductions_tons || (depth0 != null ? depth0.co2_emissions_reductions_tons : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"co2_emissions_reductions_tons","hash":{},"data":data}) : helper)))
    + " tons</li>\r\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.notes : depth0), {"name":"if","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n  </ul>\r\n</div>";
},"useData":true});

templates["filter-label"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<button type=\"button\" class=\"btn btn-default btn-sm\">"
    + escapeExpression(((helper = (helper = helpers.display || (depth0 != null ? depth0.display : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"display","hash":{},"data":data}) : helper)))
    + "</button>";
},"useData":true});

templates["filter-menu"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class=\"col-sm-6 block\">\r\n  <div class=\"chart\">\r\n";
  stack1 = this.invokePartial(partials.title, '    ', 'title', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    <div class=\"chart-inner\">\r\n    <div class=\"row\">\r\n\r\n    </div>\r\n      <div class=\"filters container-fluid\">\r\n        <div class=\"row\">\r\n          <div class=\"col-md-12\">\r\n            <div class=\"description\">\r\n              <p></p>\r\n              <button type=\"button\" class=\"btn btn-default btn-xs reset\">Reset Map</button>\r\n            </div>\r\n          </div>\r\n          <div class=\"filter-box technology col-md-6\">\r\n            <div class=\"filter-title\">Technology</div>\r\n            <div class=\"the-filters\"></div>\r\n          </div>\r\n          <div class=\"filter-box vehicle_technology col-md-6\">\r\n            <div class=\"filter-title\"><div class=\"projects-icon vehicle_technology\"></div> Vehicle Technology</div>\r\n            <div class=\"the-filters\"></div>\r\n          </div>\r\n          <div class=\"filter-box charging_fueling_station_technology col-md-6\">\r\n            <div class=\"filter-title\"><div class=\"projects-icon charging_fueling_station_technology\"></div> Charging/Fueling Station Technology</div>\r\n            <div class=\"the-filters\"></div>\r\n          </div>\r\n          <div class=\"filter-box sector col-md-6\">\r\n            <div class=\"filter-title\">Sector</div>\r\n            <div class=\"the-filters\"></div>\r\n          </div>\r\n          <div class=\"filter-box program col-md-6\">\r\n            <div class=\"filter-title\">Program</div>\r\n            <div class=\"the-filters\"></div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>";
},"usePartial":true,"useData":true});

templates["layers"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"layerToggle leaflet-control\">\r\n  <p data-dynamite-selected=\"true\">"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "<i class=\"fa fa-check\"></i></p>\r\n</div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, options, functionType="function", helperMissing=helpers.helperMissing, blockHelperMissing=helpers.blockHelperMissing;
  stack1 = ((helper = (helper = helpers.layers || (depth0 != null ? depth0.layers : depth0)) != null ? helper : helperMissing),(options={"name":"layers","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}),(typeof helper === functionType ? helper.call(depth0, options) : helper));
  if (!helpers.layers) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if (stack1 != null) { return stack1; }
  else { return ''; }
  },"useData":true});

templates["map"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"col-sm-6 block\">\r\n  <div class=\"map\"></div>\r\n</div>";
  },"useData":true});

templates["project-type"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<button type=\"button\" class=\"btn btn-default btn-sm\">"
    + escapeExpression(((helper = (helper = helpers.display || (depth0 != null ? depth0.display : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"display","hash":{},"data":data}) : helper)))
    + "</button>";
},"useData":true});

templates["renewable-popup"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<a href=\""
    + escapeExpression(((helper = (helper = helpers.link || (depth0 != null ? depth0.link : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"link","hash":{},"data":data}) : helper)))
    + "\" target=\"_blank\">"
    + escapeExpression(((helper = (helper = helpers.program_name || (depth0 != null ? depth0.program_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"program_name","hash":{},"data":data}) : helper)))
    + "</a>";
},"3":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return escapeExpression(((helper = (helper = helpers.program_name || (depth0 != null ? depth0.program_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"program_name","hash":{},"data":data}) : helper)));
  },"5":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li><b>Project Name:</b> "
    + escapeExpression(((helper = (helper = helpers.project_name || (depth0 != null ? depth0.project_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"project_name","hash":{},"data":data}) : helper)))
    + "</li>";
},"7":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li><b>Total Project Cost:</b> "
    + escapeExpression(((helper = (helper = helpers.total_project_cost || (depth0 != null ? depth0.total_project_cost : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"total_project_cost","hash":{},"data":data}) : helper)))
    + "</li>";
},"9":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li><b>Investment Leverage:</b> "
    + escapeExpression(((helper = (helper = helpers.investment_leverage || (depth0 != null ? depth0.investment_leverage : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"investment_leverage","hash":{},"data":data}) : helper)))
    + "</li>";
},"11":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li><b>Notes:</b> "
    + escapeExpression(((helper = (helper = helpers.notes || (depth0 != null ? depth0.notes : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"notes","hash":{},"data":data}) : helper)))
    + "</li>";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\"map-project\" style=\"background: "
    + escapeExpression(((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"color","hash":{},"data":data}) : helper)))
    + "\">\r\n  <ul class=\"list-unstyled\">\r\n    <li><b>Technology:</b> "
    + escapeExpression(((helper = (helper = helpers.technology || (depth0 != null ? depth0.technology : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"technology","hash":{},"data":data}) : helper)))
    + "</li>\r\n    <li><b>Program Name:</b> \r\n      ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.link : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n    </li>\r\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.project_name : depth0), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n    <li><b>MEA Contribution:</b> "
    + escapeExpression(((helper = (helper = helpers.mea_award || (depth0 != null ? depth0.mea_award : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"mea_award","hash":{},"data":data}) : helper)))
    + "</li>\r\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.total_project_cost : depth0), {"name":"if","hash":{},"fn":this.program(7, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.investment_leverage : depth0), {"name":"if","hash":{},"fn":this.program(9, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n    <li><b>Capacity:</b> "
    + escapeExpression(((helper = (helper = helpers.capacity || (depth0 != null ? depth0.capacity : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"capacity","hash":{},"data":data}) : helper)))
    + " "
    + escapeExpression(((helper = (helper = helpers.capacity_units || (depth0 != null ? depth0.capacity_units : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"capacity_units","hash":{},"data":data}) : helper)))
    + "</li>\r\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.notes : depth0), {"name":"if","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n  </ul>\r\n</div>";
},"useData":true});

templates["stat"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\""
    + escapeExpression(((helper = (helper = helpers.width || (depth0 != null ? depth0.width : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"width","hash":{},"data":data}) : helper)))
    + " block\">\r\n  <div class=\"chart\">\r\n";
  stack1 = this.invokePartial(partials.title, '    ', 'title', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    <div class=\"chart-inner\">\r\n      <div class=\"loader\"><i class=\"fa fa-circle-o-notch fa-spin\"></i></div>\r\n      <div class=\"the-chart\">\r\n        <div class=\"stat\"></div>\r\n        <div class=\"note\"><span class=\"efficiency-note\">* Investment Leverage for energy efficiency is low due to financing programs, for which investment leverage is not calculated.<br></span>* Residential and Agricultural projects are plotted at the center of their zip codes to ensure recipient privacy.</div>\r\n      </div>\r\n      <div class=\"nodata\">This combination of filters has no applicable projects.</div>\r\n    </div>\r\n  </div>\r\n</div>";
},"usePartial":true,"useData":true});

templates["table-empty"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\""
    + escapeExpression(((helper = (helper = helpers.width || (depth0 != null ? depth0.width : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"width","hash":{},"data":data}) : helper)))
    + " block\">\r\n  <div class=\"chart\">\r\n";
  stack1 = this.invokePartial(partials.title, '    ', 'title', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    <div class=\"chart-inner\">\r\n      <table class=\"table table-condensed table-hover\">\r\n\r\n      </table>\r\n    </div>\r\n  </div>\r\n</div>";
},"usePartial":true,"useData":true});

templates["transportation-popup"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li><b>Charging Station Technology:</b> "
    + escapeExpression(((helper = (helper = helpers.charging_fueling_station_technology || (depth0 != null ? depth0.charging_fueling_station_technology : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"charging_fueling_station_technology","hash":{},"data":data}) : helper)))
    + "</li>";
},"3":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li><b>Vehicle Technology:</b> "
    + escapeExpression(((helper = (helper = helpers.vehicle_technology || (depth0 != null ? depth0.vehicle_technology : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"vehicle_technology","hash":{},"data":data}) : helper)))
    + "</li>";
},"5":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<a href=\""
    + escapeExpression(((helper = (helper = helpers.link || (depth0 != null ? depth0.link : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"link","hash":{},"data":data}) : helper)))
    + "\" target=\"_blank\">"
    + escapeExpression(((helper = (helper = helpers.program_name || (depth0 != null ? depth0.program_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"program_name","hash":{},"data":data}) : helper)))
    + "</a>";
},"7":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return escapeExpression(((helper = (helper = helpers.program_name || (depth0 != null ? depth0.program_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"program_name","hash":{},"data":data}) : helper)));
  },"9":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li><b>Project Name:</b> "
    + escapeExpression(((helper = (helper = helpers.project_name || (depth0 != null ? depth0.project_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"project_name","hash":{},"data":data}) : helper)))
    + "</li>";
},"11":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li><b>Total Project Cost:</b> "
    + escapeExpression(((helper = (helper = helpers.total_project_cost || (depth0 != null ? depth0.total_project_cost : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"total_project_cost","hash":{},"data":data}) : helper)))
    + "</li>";
},"13":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li><b>Investment Leverage:</b> "
    + escapeExpression(((helper = (helper = helpers.investment_leverage || (depth0 != null ? depth0.investment_leverage : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"investment_leverage","hash":{},"data":data}) : helper)))
    + "</li>";
},"15":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li><b>Gallons of Gasoline Equivalent Avoided:</b> "
    + escapeExpression(((helper = (helper = helpers.gallons_of_gasoline_equivalent_avoided || (depth0 != null ? depth0.gallons_of_gasoline_equivalent_avoided : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"gallons_of_gasoline_equivalent_avoided","hash":{},"data":data}) : helper)))
    + "</li>";
},"17":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li><b>Notes:</b> "
    + escapeExpression(((helper = (helper = helpers.notes || (depth0 != null ? depth0.notes : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"notes","hash":{},"data":data}) : helper)))
    + "</li>";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\"map-project\" style=\"background: "
    + escapeExpression(((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"color","hash":{},"data":data}) : helper)))
    + "\">\r\n  <ul class=\"list-unstyled\">\r\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.charging_fueling_station_technology : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.vehicle_technology : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n    <li><b>Program Name:</b> \r\n      ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.link : depth0), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.program(7, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n    </li>\r\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.project_name : depth0), {"name":"if","hash":{},"fn":this.program(9, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n    <li><b>MEA Contribution:</b> "
    + escapeExpression(((helper = (helper = helpers.mea_award || (depth0 != null ? depth0.mea_award : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"mea_award","hash":{},"data":data}) : helper)))
    + "</li>\r\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.total_project_cost : depth0), {"name":"if","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.investment_leverage : depth0), {"name":"if","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.gallons_of_gasoline_equivalent_avoided : depth0), {"name":"if","hash":{},"fn":this.program(15, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.notes : depth0), {"name":"if","hash":{},"fn":this.program(17, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n  </ul>\r\n</div>";
},"useData":true});

return templates;

};
},{}]},{},[9])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY2hyb21hdGgvaW5kZXguanMiLCJub2RlX21vZHVsZXMvY2hyb21hdGgvc3JjL2Nocm9tYXRoLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9tYXRoL3NyYy9jb2xvcm5hbWVzX2NzczIuanMiLCJub2RlX21vZHVsZXMvY2hyb21hdGgvc3JjL2NvbG9ybmFtZXNfY3NzMy5qcyIsIm5vZGVfbW9kdWxlcy9jaHJvbWF0aC9zcmMvcGFyc2Vycy5qcyIsIm5vZGVfbW9kdWxlcy9jaHJvbWF0aC9zcmMvcHJvdG90eXBlLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9tYXRoL3NyYy91dGlsLmpzIiwibm9kZV9tb2R1bGVzL2NyZWF0ZWNzcy9pbmRleC5qcyIsInB1YmxpYy9qcy9pbmRleC5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL0JhckNoYXJ0Vmlldy5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL0NoYXJ0Q29sbGVjdGlvbi5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL0NoYXJ0TW9kZWwuanMiLCJwdWJsaWMvanMvbW9kdWxlcy9DaGFydFZpZXcuanMiLCJwdWJsaWMvanMvbW9kdWxlcy9EYXNoYm9hcmQuanMiLCJwdWJsaWMvanMvbW9kdWxlcy9GaWx0ZXJDb2xsZWN0aW9uLmpzIiwicHVibGljL2pzL21vZHVsZXMvRmlsdGVyTGFiZWxWaWV3LmpzIiwicHVibGljL2pzL21vZHVsZXMvRmlsdGVyTWVudVZpZXcuanMiLCJwdWJsaWMvanMvbW9kdWxlcy9GaWx0ZXJNb2RlbC5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL0hvcml6b250YWxCYXJDaGFydFZpZXcuanMiLCJwdWJsaWMvanMvbW9kdWxlcy9MaW5lQ2hhcnRWaWV3LmpzIiwicHVibGljL2pzL21vZHVsZXMvTWFwVmlldy5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL1BpZUNoYXJ0Vmlldy5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL1JvdXRlci5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL1N0YWNrZWRCYXJDaGFydFZpZXcuanMiLCJwdWJsaWMvanMvbW9kdWxlcy9TdGF0Vmlldy5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL1RhYmxlVmlldy5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL1RlY2hub2xvZ3lGaWx0ZXIuanMiLCJwdWJsaWMvanMvbW9kdWxlcy90ZW1wbGF0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDam5DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbHJCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2WEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2WEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwidmFyIENocm9tYXRoID0gcmVxdWlyZSgnLi9zcmMvY2hyb21hdGguanMnKTtcbm1vZHVsZS5leHBvcnRzID0gQ2hyb21hdGg7XG4iLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuLypcbiAgIENsYXNzOiBDaHJvbWF0aFxuKi9cbi8vIEdyb3VwOiBDb25zdHJ1Y3RvcnNcbi8qXG4gICBDb25zdHJ1Y3RvcjogQ2hyb21hdGhcbiAgIENyZWF0ZSBhIG5ldyBDaHJvbWF0aCBpbnN0YW5jZSBmcm9tIGEgc3RyaW5nIG9yIGludGVnZXJcblxuICAgUGFyYW1ldGVyczpcbiAgIG1peGVkIC0gVGhlIHZhbHVlIHRvIHVzZSBmb3IgY3JlYXRpbmcgdGhlIGNvbG9yXG5cbiAgIFJldHVybnM6XG4gICA8Q2hyb21hdGg+IGluc3RhbmNlXG5cbiAgIFByb3BlcnRpZXM6XG4gICByIC0gVGhlIHJlZCBjaGFubmVsIG9mIHRoZSBSR0IgcmVwcmVzZW50YXRpb24gb2YgdGhlIENocm9tYXRoLiBBIG51bWJlciBiZXR3ZWVuIDAgYW5kIDI1NS5cbiAgIGcgLSBUaGUgZ3JlZW4gY2hhbm5lbCBvZiB0aGUgUkdCIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBDaHJvbWF0aC4gQSBudW1iZXIgYmV0d2VlbiAwIGFuZCAyNTUuXG4gICBiIC0gVGhlIGJsdWUgY2hhbm5lbCBvZiB0aGUgUkdCIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBDaHJvbWF0aC4gQSBudW1iZXIgYmV0d2VlbiAwIGFuZCAyNTUuXG4gICBhIC0gVGhlIGFscGhhIGNoYW5uZWwgb2YgdGhlIENocm9tYXRoLiBBIG51bWJlciBiZXR3ZWVuIDAgYW5kIDEuXG4gICBoIC0gVGhlIGh1ZSBvZiB0aGUgQ2hyb21hdGguIEEgbnVtYmVyIGJldHdlZW4gMCBhbmQgMzYwLlxuICAgc2wgLSBUaGUgc2F0dXJhdGlvbiBvZiB0aGUgSFNMIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBDaHJvbWF0aC4gQSBudW1iZXIgYmV0d2VlbiAwIGFuZCAxLlxuICAgc3YgLSBUaGUgc2F0dXJhdGlvbiBvZiB0aGUgSFNWL0hTQiByZXByZXNlbnRhdGlvbiBvZiB0aGUgQ2hyb21hdGguIEEgbnVtYmVyIGJldHdlZW4gMCBhbmQgMS5cbiAgIGwgLSBUaGUgbGlnaHRuZXNzIG9mIHRoZSBIU0wgcmVwcmVzZW50YXRpb24gb2YgdGhlIENocm9tYXRoLiBBIG51bWJlciBiZXR3ZWVuIDAgYW5kIDEuXG4gICB2IC0gVGhlIGxpZ2h0bmVzcyBvZiB0aGUgSFNWL0hTQiByZXByZXNlbnRhdGlvbiBvZiB0aGUgQ2hyb21hdGguIEEgbnVtYmVyIGJldHdlZW4gMCBhbmQgMS5cblxuICAgRXhhbXBsZXM6XG4gIChzdGFydCBjb2RlKVxuLy8gVGhlcmUgYXJlIG1hbnkgd2F5cyB0byBjcmVhdGUgYSBDaHJvbWF0aCBpbnN0YW5jZVxubmV3IENocm9tYXRoKCcjRkYwMDAwJyk7ICAgICAgICAgICAgICAgICAgLy8gSGV4ICg2IGNoYXJhY3RlcnMgd2l0aCBoYXNoKVxubmV3IENocm9tYXRoKCdGRjAwMDAnKTsgICAgICAgICAgICAgICAgICAgLy8gSGV4ICg2IGNoYXJhY3RlcnMgd2l0aG91dCBoYXNoKVxubmV3IENocm9tYXRoKCcjRjAwJyk7ICAgICAgICAgICAgICAgICAgICAgLy8gSGV4ICgzIGNoYXJhY3RlcnMgd2l0aCBoYXNoKVxubmV3IENocm9tYXRoKCdGMDAnKTsgICAgICAgICAgICAgICAgICAgICAgLy8gSGV4ICgzIGNoYXJhY3RlcnMgd2l0aG91dCBoYXNoKVxubmV3IENocm9tYXRoKCdyZWQnKTsgICAgICAgICAgICAgICAgICAgICAgLy8gQ1NTL1NWRyBDb2xvciBuYW1lXG5uZXcgQ2hyb21hdGgoJ3JnYigyNTUsIDAsIDApJyk7ICAgICAgICAgICAvLyBSR0IgdmlhIENTU1xubmV3IENocm9tYXRoKHtyOiAyNTUsIGc6IDAsIGI6IDB9KTsgICAgICAgLy8gUkdCIHZpYSBvYmplY3Rcbm5ldyBDaHJvbWF0aCgncmdiYSgyNTUsIDAsIDAsIDEpJyk7ICAgICAgIC8vIFJHQkEgdmlhIENTU1xubmV3IENocm9tYXRoKHtyOiAyNTUsIGc6IDAsIGI6IDAsIGE6IDF9KTsgLy8gUkdCQSB2aWEgb2JqZWN0XG5uZXcgQ2hyb21hdGgoJ2hzbCgwLCAxMDAlLCA1MCUpJyk7ICAgICAgICAvLyBIU0wgdmlhIENTU1xubmV3IENocm9tYXRoKHtoOiAwLCBzOiAxLCBsOiAwLjV9KTsgICAgICAgLy8gSFNMIHZpYSBvYmplY3Rcbm5ldyBDaHJvbWF0aCgnaHNsYSgwLCAxMDAlLCA1MCUsIDEpJyk7ICAgIC8vIEhTTEEgdmlhIENTU1xubmV3IENocm9tYXRoKHtoOiAwLCBzOiAxLCBsOiAwLjUsIGE6IDF9KTsgLy8gSFNMQSB2aWEgb2JqZWN0XG5uZXcgQ2hyb21hdGgoJ2hzdigwLCAxMDAlLCAxMDAlKScpOyAgICAgICAvLyBIU1YgdmlhIENTU1xubmV3IENocm9tYXRoKHtoOiAwLCBzOiAxLCB2OiAxfSk7ICAgICAgICAgLy8gSFNWIHZpYSBvYmplY3Rcbm5ldyBDaHJvbWF0aCgnaHN2YSgwLCAxMDAlLCAxMDAlLCAxKScpOyAgIC8vIEhTVkEgdmlhIENTU1xubmV3IENocm9tYXRoKHtoOiAwLCBzOiAxLCB2OiAxLCBhOiAxfSk7ICAgLy8gSFNWQSB2aWEgb2JqZWN0XG5uZXcgQ2hyb21hdGgoJ2hzYigwLCAxMDAlLCAxMDAlKScpOyAgICAgICAvLyBIU0IgdmlhIENTU1xubmV3IENocm9tYXRoKHtoOiAwLCBzOiAxLCBiOiAxfSk7ICAgICAgICAgLy8gSFNCIHZpYSBvYmplY3Rcbm5ldyBDaHJvbWF0aCgnaHNiYSgwLCAxMDAlLCAxMDAlLCAxKScpOyAgIC8vIEhTQkEgdmlhIENTU1xubmV3IENocm9tYXRoKHtoOiAwLCBzOiAxLCBiOiAxLCBhOiAxfSk7ICAgLy8gSFNCQSB2aWEgb2JqZWN0XG5uZXcgQ2hyb21hdGgoMTY3MTE2ODApOyAgICAgICAgICAgICAgICAgICAvLyBSR0IgdmlhIGludGVnZXIgKGFscGhhIGN1cnJlbnRseSBpZ25vcmVkKVxuKGVuZCBjb2RlKVxuKi9cbmZ1bmN0aW9uIENocm9tYXRoKCBtaXhlZCApXG57XG4gICAgdmFyIGNoYW5uZWxzLCBjb2xvciwgaHNsLCBoc3YsIHJnYjtcblxuICAgIGlmICh1dGlsLmlzU3RyaW5nKG1peGVkKSB8fCB1dGlsLmlzTnVtYmVyKG1peGVkKSkge1xuICAgICAgICBjaGFubmVscyA9IENocm9tYXRoLnBhcnNlKG1peGVkKTtcbiAgICB9IGVsc2UgaWYgKHV0aWwuaXNBcnJheShtaXhlZCkpe1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VyZSBob3cgdG8gcGFyc2UgYXJyYXkgYCcrbWl4ZWQrJ2AnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICcsIHBsZWFzZSBwYXNzIGFuIG9iamVjdCBvciBDU1Mgc3R5bGUgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnb3IgdHJ5IENocm9tYXRoLnJnYiwgQ2hyb21hdGguaHNsLCBvciBDaHJvbWF0aC5oc3YnXG4gICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgfSBlbHNlIGlmIChtaXhlZCBpbnN0YW5jZW9mIENocm9tYXRoKSB7XG4gICAgICAgIGNoYW5uZWxzID0gdXRpbC5tZXJnZSh7fSwgbWl4ZWQpO1xuICAgIH0gZWxzZSBpZiAodXRpbC5pc09iamVjdChtaXhlZCkpe1xuICAgICAgICBjaGFubmVscyA9IHV0aWwubWVyZ2Uoe30sIG1peGVkKTtcbiAgICB9XG5cbiAgICBpZiAoISBjaGFubmVscylcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgcGFyc2UgYCcrbWl4ZWQrJ2AnKTtcbiAgICBlbHNlIGlmICghaXNGaW5pdGUoY2hhbm5lbHMuYSkpXG4gICAgICAgIGNoYW5uZWxzLmEgPSAxO1xuXG4gICAgaWYgKCdyJyBpbiBjaGFubmVscyApe1xuICAgICAgICByZ2IgPSB1dGlsLnJnYi5zY2FsZWQwMShbY2hhbm5lbHMuciwgY2hhbm5lbHMuZywgY2hhbm5lbHMuYl0pO1xuICAgICAgICBoc2wgPSBDaHJvbWF0aC5yZ2IyaHNsKHJnYik7XG4gICAgICAgIGhzdiA9IENocm9tYXRoLnJnYjJoc3YocmdiKTtcbiAgICB9IGVsc2UgaWYgKCdoJyBpbiBjaGFubmVscyApe1xuICAgICAgICBpZiAoJ2wnIGluIGNoYW5uZWxzKXtcbiAgICAgICAgICAgIGhzbCA9IHV0aWwuaHNsLnNjYWxlZChbY2hhbm5lbHMuaCwgY2hhbm5lbHMucywgY2hhbm5lbHMubF0pO1xuICAgICAgICAgICAgcmdiID0gQ2hyb21hdGguaHNsMnJnYihoc2wpO1xuICAgICAgICAgICAgaHN2ID0gQ2hyb21hdGgucmdiMmhzdihyZ2IpO1xuICAgICAgICB9IGVsc2UgaWYgKCd2JyBpbiBjaGFubmVscyB8fCAnYicgaW4gY2hhbm5lbHMpIHtcbiAgICAgICAgICAgIGlmICgnYicgaW4gY2hhbm5lbHMpIGNoYW5uZWxzLnYgPSBjaGFubmVscy5iO1xuICAgICAgICAgICAgaHN2ID0gdXRpbC5oc2wuc2NhbGVkKFtjaGFubmVscy5oLCBjaGFubmVscy5zLCBjaGFubmVscy52XSk7XG4gICAgICAgICAgICByZ2IgPSBDaHJvbWF0aC5oc3YycmdiKGhzdik7XG4gICAgICAgICAgICBoc2wgPSBDaHJvbWF0aC5yZ2IyaHNsKHJnYik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHV0aWwubWVyZ2UodGhpcywge1xuICAgICAgICByOiAgcmdiWzBdLCAgZzogcmdiWzFdLCBiOiByZ2JbMl0sXG4gICAgICAgIGg6ICBoc2xbMF0sIHNsOiBoc2xbMV0sIGw6IGhzbFsyXSxcbiAgICAgICAgc3Y6IGhzdlsxXSwgIHY6IGhzdlsyXSwgYTogY2hhbm5lbHMuYVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG59XG5cbi8qXG4gIENvbnN0cnVjdG9yOiBDaHJvbWF0aC5yZ2JcbiAgQ3JlYXRlIGEgbmV3IDxDaHJvbWF0aD4gaW5zdGFuY2UgZnJvbSBSR0IgdmFsdWVzXG5cbiAgUGFyYW1ldGVyczpcbiAgciAtIE51bWJlciwgMC0yNTUsIHJlcHJlc2VudGluZyB0aGUgZ3JlZW4gY2hhbm5lbCBPUiBBcnJheSBPUiBvYmplY3QgKHdpdGgga2V5cyByLGcsYikgb2YgUkdCIHZhbHVlc1xuICBnIC0gTnVtYmVyLCAwLTI1NSwgcmVwcmVzZW50aW5nIHRoZSBncmVlbiBjaGFubmVsXG4gIGIgLSBOdW1iZXIsIDAtMjU1LCByZXByZXNlbnRpbmcgdGhlIHJlZCBjaGFubmVsXG4gIGEgLSAoT3B0aW9uYWwpIEZsb2F0LCAwLTEsIHJlcHJlc2VudGluZyB0aGUgYWxwaGEgY2hhbm5lbFxuXG4gUmV0dXJuczpcbiA8Q2hyb21hdGg+XG5cbiBFeGFtcGxlczpcbiA+ID4gbmV3IENocm9tYXRoLnJnYigxMjMsIDIzNCwgNTYpLnRvU3RyaW5nKClcbiA+IFwiIzdCRUEzOFwiXG5cbiA+ID4gbmV3IENocm9tYXRoLnJnYihbMTIzLCAyMzQsIDU2XSkudG9TdHJpbmcoKVxuID4gXCIjN0JFQTM4XCJcblxuID4gPiBuZXcgQ2hyb21hdGgucmdiKHtyOiAxMjMsIGc6IDIzNCwgYjogNTZ9KS50b1N0cmluZygpXG4gPiBcIiM3QkVBMzhcIlxuICovXG5DaHJvbWF0aC5yZ2IgPSBmdW5jdGlvbiAociwgZywgYiwgYSlcbntcbiAgICB2YXIgcmdiYSA9IHV0aWwucmdiLmZyb21BcmdzKHIsIGcsIGIsIGEpO1xuICAgIHIgPSByZ2JhWzBdLCBnID0gcmdiYVsxXSwgYiA9IHJnYmFbMl0sIGEgPSByZ2JhWzNdO1xuXG4gICAgcmV0dXJuIG5ldyBDaHJvbWF0aCh7cjogciwgZzogZywgYjogYiwgYTogYX0pO1xufTtcblxuLypcbiAgQ29uc3RydWN0b3I6IENocm9tYXRoLnJnYmFcbiAgQWxpYXMgZm9yIDxDaHJvbWF0aC5yZ2I+XG4qL1xuQ2hyb21hdGgucmdiYSA9IENocm9tYXRoLnJnYjtcblxuLypcbiAgQ29uc3RydWN0b3I6IENocm9tYXRoLmhzbFxuICBDcmVhdGUgYSBuZXcgQ2hyb21hdGggaW5zdGFuY2UgZnJvbSBIU0wgdmFsdWVzXG5cbiAgUGFyYW1ldGVyczpcbiAgaCAtIE51bWJlciwgLUluZmluaXR5IC0gSW5maW5pdHksIHJlcHJlc2VudGluZyB0aGUgaHVlIE9SIEFycmF5IE9SIG9iamVjdCAod2l0aCBrZXlzIGgscyxsKSBvZiBIU0wgdmFsdWVzXG4gIHMgLSBOdW1iZXIsIDAtMSwgcmVwcmVzZW50aW5nIHRoZSBzYXR1cmF0aW9uXG4gIGwgLSBOdW1iZXIsIDAtMSwgcmVwcmVzZW50aW5nIHRoZSBsaWdodG5lc3NcbiAgYSAtIChPcHRpb25hbCkgRmxvYXQsIDAtMSwgcmVwcmVzZW50aW5nIHRoZSBhbHBoYSBjaGFubmVsXG5cbiAgUmV0dXJuczpcbiAgPENocm9tYXRoPlxuXG4gIEV4YW1wbGVzOlxuICA+ID4gbmV3IENocm9tYXRoLmhzbCgyNDAsIDEsIDAuNSkudG9TdHJpbmcoKVxuICA+IFwiIzAwMDBGRlwiXG5cbiAgPiA+IG5ldyBDaHJvbWF0aC5oc2woWzI0MCwgMSwgMC41XSkudG9TdHJpbmcoKVxuICA+IFwiIzAwMDBGRlwiXG5cbiAgPiBuZXcgQ2hyb21hdGguaHNsKHtoOjI0MCwgczoxLCBsOjAuNX0pLnRvU3RyaW5nKClcbiAgPiBcIiMwMDAwRkZcIlxuICovXG5DaHJvbWF0aC5oc2wgPSBmdW5jdGlvbiAoaCwgcywgbCwgYSlcbntcbiAgICB2YXIgaHNsYSA9IHV0aWwuaHNsLmZyb21BcmdzKGgsIHMsIGwsIGEpO1xuICAgIGggPSBoc2xhWzBdLCBzID0gaHNsYVsxXSwgbCA9IGhzbGFbMl0sIGEgPSBoc2xhWzNdO1xuXG4gICAgcmV0dXJuIG5ldyBDaHJvbWF0aCh7aDogaCwgczogcywgbDogbCwgYTogYX0pO1xufTtcblxuLypcbiAgQ29uc3RydWN0b3I6IENocm9tYXRoLmhzbGFcbiAgQWxpYXMgZm9yIDxDaHJvbWF0aC5oc2w+XG4qL1xuQ2hyb21hdGguaHNsYSA9IENocm9tYXRoLmhzbDtcblxuLypcbiAgQ29uc3RydWN0b3I6IENocm9tYXRoLmhzdlxuICBDcmVhdGUgYSBuZXcgQ2hyb21hdGggaW5zdGFuY2UgZnJvbSBIU1YgdmFsdWVzXG5cbiAgUGFyYW1ldGVyczpcbiAgaCAtIE51bWJlciwgLUluZmluaXR5IC0gSW5maW5pdHksIHJlcHJlc2VudGluZyB0aGUgaHVlIE9SIEFycmF5IE9SIG9iamVjdCAod2l0aCBrZXlzIGgscyxsKSBvZiBIU1YgdmFsdWVzXG4gIHMgLSBOdW1iZXIsIDAtMSwgcmVwcmVzZW50aW5nIHRoZSBzYXR1cmF0aW9uXG4gIHYgLSBOdW1iZXIsIDAtMSwgcmVwcmVzZW50aW5nIHRoZSBsaWdodG5lc3NcbiAgYSAtIChPcHRpb25hbCkgRmxvYXQsIDAtMSwgcmVwcmVzZW50aW5nIHRoZSBhbHBoYSBjaGFubmVsXG5cbiAgUmV0dXJuczpcbiAgPENocm9tYXRoPlxuXG4gIEV4YW1wbGVzOlxuICA+ID4gbmV3IENocm9tYXRoLmhzdigyNDAsIDEsIDEpLnRvU3RyaW5nKClcbiAgPiBcIiMwMDAwRkZcIlxuXG4gID4gPiBuZXcgQ2hyb21hdGguaHN2KFsyNDAsIDEsIDFdKS50b1N0cmluZygpXG4gID4gXCIjMDAwMEZGXCJcblxuICA+ID4gbmV3IENocm9tYXRoLmhzdih7aDoyNDAsIHM6MSwgdjoxfSkudG9TdHJpbmcoKVxuICA+IFwiIzAwMDBGRlwiXG4gKi9cbkNocm9tYXRoLmhzdiA9IGZ1bmN0aW9uIChoLCBzLCB2LCBhKVxue1xuICAgIHZhciBoc3ZhID0gdXRpbC5oc2wuZnJvbUFyZ3MoaCwgcywgdiwgYSk7XG4gICAgaCA9IGhzdmFbMF0sIHMgPSBoc3ZhWzFdLCB2ID0gaHN2YVsyXSwgYSA9IGhzdmFbM107XG5cbiAgICByZXR1cm4gbmV3IENocm9tYXRoKHtoOiBoLCBzOiBzLCB2OiB2LCBhOiBhfSk7XG59O1xuXG4vKlxuICBDb25zdHJ1Y3RvcjogQ2hyb21hdGguaHN2YVxuICBBbGlhcyBmb3IgPENocm9tYXRoLmhzdj5cbiovXG5DaHJvbWF0aC5oc3ZhID0gQ2hyb21hdGguaHN2O1xuXG4vKlxuICBDb25zdHJ1Y3RvcjogQ2hyb21hdGguaHNiXG4gIEFsaWFzIGZvciA8Q2hyb21hdGguaHN2PlxuICovXG5DaHJvbWF0aC5oc2IgPSBDaHJvbWF0aC5oc3Y7XG5cbi8qXG4gICBDb25zdHJ1Y3RvcjogQ2hyb21hdGguaHNiYVxuICAgQWxpYXMgZm9yIDxDaHJvbWF0aC5oc3ZhPlxuICovXG5DaHJvbWF0aC5oc2JhID0gQ2hyb21hdGguaHN2YTtcblxuLy8gR3JvdXA6IFN0YXRpYyBtZXRob2RzIC0gcmVwcmVzZW50YXRpb25cbi8qXG4gIE1ldGhvZDogQ2hyb21hdGgudG9JbnRlZ2VyXG4gIENvbnZlcnQgYSBjb2xvciBpbnRvIGFuIGludGVnZXIgKGFscGhhIGNoYW5uZWwgY3VycmVudGx5IG9taXR0ZWQpXG5cbiAgUGFyYW1ldGVyczpcbiAgY29sb3IgLSBBY2NlcHRzIHRoZSBzYW1lIGFyZ3VtZW50cyBhcyB0aGUgQ2hyb21hdGggY29uc3RydWN0b3JcblxuICBSZXR1cm5zOlxuICBpbnRlZ2VyXG5cbiAgRXhhbXBsZXM6XG4gID4gPiBDaHJvbWF0aC50b0ludGVnZXIoJ2dyZWVuJyk7XG4gID4gMzI3NjhcblxuICA+ID4gQ2hyb21hdGgudG9JbnRlZ2VyKCd3aGl0ZScpO1xuICA+IDE2Nzc3MjE1XG4qL1xuQ2hyb21hdGgudG9JbnRlZ2VyID0gZnVuY3Rpb24gKGNvbG9yKVxue1xuICAgIC8vIGNyZWF0ZSBzb21ldGhpbmcgbGlrZSAnMDA4MDAwJyAoZ3JlZW4pXG4gICAgdmFyIGhleDYgPSBuZXcgQ2hyb21hdGgoY29sb3IpLmhleCgpLmpvaW4oJycpO1xuXG4gICAgLy8gQXJndW1lbnRzIGJlZ2lubmluZyB3aXRoIGAweGAgYXJlIHRyZWF0ZWQgYXMgaGV4IHZhbHVlc1xuICAgIHJldHVybiBOdW1iZXIoJzB4JyArIGhleDYpO1xufTtcblxuLypcbiAgTWV0aG9kOiBDaHJvbWF0aC50b05hbWVcbiAgUmV0dXJuIHRoZSBXM0MgY29sb3IgbmFtZSBvZiB0aGUgY29sb3IgaXQgbWF0Y2hlc1xuXG4gIFBhcmFtZXRlcnM6XG4gIGNvbXBhcmlzb25cblxuICBFeGFtcGxlczpcbiAgPiA+IENocm9tYXRoLnRvTmFtZSgncmdiKDI1NSwgMCwgMjU1KScpO1xuICA+ICdmdWNoc2lhJ1xuXG4gID4gPiBDaHJvbWF0aC50b05hbWUoNjU1MzUpO1xuICA+ICdhcXVhJ1xuKi9cbkNocm9tYXRoLnRvTmFtZSA9IGZ1bmN0aW9uIChjb21wYXJpc29uKVxue1xuICAgIGNvbXBhcmlzb24gPSArbmV3IENocm9tYXRoKGNvbXBhcmlzb24pO1xuICAgIGZvciAodmFyIGNvbG9yIGluIENocm9tYXRoLmNvbG9ycykgaWYgKCtDaHJvbWF0aFtjb2xvcl0gPT0gY29tcGFyaXNvbikgcmV0dXJuIGNvbG9yO1xufTtcblxuLy8gR3JvdXA6IFN0YXRpYyBtZXRob2RzIC0gY29sb3IgY29udmVyc2lvblxuLypcbiAgTWV0aG9kOiBDaHJvbWF0aC5yZ2IyaGV4XG4gIENvbnZlcnQgYW4gUkdCIHZhbHVlIHRvIGEgSGV4IHZhbHVlXG5cbiAgUmV0dXJuczogYXJyYXlcblxuICBFeGFtcGxlOlxuICA+ID4gQ2hyb21hdGgucmdiMmhleCg1MCwgMTAwLCAxNTApXG4gID4gXCJbMzIsIDY0LCA5Nl1cIlxuICovXG5DaHJvbWF0aC5yZ2IyaGV4ID0gZnVuY3Rpb24gcmdiMmhleChyLCBnLCBiKVxue1xuICAgIHZhciByZ2IgPSB1dGlsLnJnYi5zY2FsZWQwMShyLCBnLCBiKTtcbiAgICB2YXIgaGV4ID0gcmdiLm1hcChmdW5jdGlvbiAocGN0KSB7XG4gICAgICB2YXIgZGVjID0gTWF0aC5yb3VuZChwY3QgKiAyNTUpO1xuICAgICAgdmFyIGhleCA9IGRlYy50b1N0cmluZygxNikudG9VcHBlckNhc2UoKTtcbiAgICAgIHJldHVybiB1dGlsLmxwYWQoaGV4LCAyLCAwKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBoZXg7XG59O1xuXG4vLyBDb252ZXJ0ZWQgZnJvbSBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0hTTF9hbmRfSFNWI0dlbmVyYWxfYXBwcm9hY2hcbi8qXG4gIE1ldGhvZDogQ2hyb21hdGgucmdiMmhzbFxuICBDb252ZXJ0IFJHQiB0byBIU0xcblxuICBQYXJhbWV0ZXJzOlxuICByIC0gTnVtYmVyLCAwLTI1NSwgcmVwcmVzZW50aW5nIHRoZSBncmVlbiBjaGFubmVsIE9SIEFycmF5IE9SIG9iamVjdCAod2l0aCBrZXlzIHIsZyxiKSBvZiBSR0IgdmFsdWVzXG4gIGcgLSBOdW1iZXIsIDAtMjU1LCByZXByZXNlbnRpbmcgdGhlIGdyZWVuIGNoYW5uZWxcbiAgYiAtIE51bWJlciwgMC0yNTUsIHJlcHJlc2VudGluZyB0aGUgcmVkIGNoYW5uZWxcblxuICBSZXR1cm5zOiBhcnJheVxuXG4gID4gPiBDaHJvbWF0aC5yZ2IyaHNsKDAsIDI1NSwgMCk7XG4gID4gWyAxMjAsIDEsIDAuNSBdXG5cbiAgPiA+IENocm9tYXRoLnJnYjJoc2woWzAsIDAsIDI1NV0pO1xuICA+IFsgMjQwLCAxLCAwLjUgXVxuXG4gID4gPiBDaHJvbWF0aC5yZ2IyaHNsKHtyOiAyNTUsIGc6IDAsIGI6IDB9KTtcbiAgPiBbIDAsIDEsIDAuNSBdXG4gKi9cbkNocm9tYXRoLnJnYjJoc2wgPSBmdW5jdGlvbiByZ2IyaHNsKHIsIGcsIGIpXG57XG4gICAgdmFyIHJnYiA9IHV0aWwucmdiLnNjYWxlZDAxKHIsIGcsIGIpO1xuICAgIHIgPSByZ2JbMF0sIGcgPSByZ2JbMV0sIGIgPSByZ2JbMl07XG5cbiAgICB2YXIgTSA9IE1hdGgubWF4KHIsIGcsIGIpO1xuICAgIHZhciBtID0gTWF0aC5taW4ociwgZywgYik7XG4gICAgdmFyIEMgPSBNIC0gbTtcbiAgICB2YXIgTCA9IDAuNSooTSArIG0pO1xuICAgIHZhciBTID0gKEMgPT09IDApID8gMCA6IEMvKDEtTWF0aC5hYnMoMipMLTEpKTtcblxuICAgIHZhciBoO1xuICAgIGlmIChDID09PSAwKSBoID0gMDsgLy8gc3BlYydkIGFzIHVuZGVmaW5lZCwgYnV0IHVzdWFsbHkgc2V0IHRvIDBcbiAgICBlbHNlIGlmIChNID09PSByKSBoID0gKChnLWIpL0MpICUgNjtcbiAgICBlbHNlIGlmIChNID09PSBnKSBoID0gKChiLXIpL0MpICsgMjtcbiAgICBlbHNlIGlmIChNID09PSBiKSBoID0gKChyLWcpL0MpICsgNDtcblxuICAgIHZhciBIID0gNjAgKiBoO1xuXG4gICAgcmV0dXJuIFtILCBwYXJzZUZsb2F0KFMpLCBwYXJzZUZsb2F0KEwpXTtcbn07XG5cbi8qXG4gIE1ldGhvZDogQ2hyb21hdGgucmdiMmhzdlxuICBDb252ZXJ0IFJHQiB0byBIU1ZcblxuICBQYXJhbWV0ZXJzOlxuICByIC0gTnVtYmVyLCAwLTI1NSwgcmVwcmVzZW50aW5nIHRoZSBncmVlbiBjaGFubmVsIE9SIEFycmF5IE9SIG9iamVjdCAod2l0aCBrZXlzIHIsZyxiKSBvZiBSR0IgdmFsdWVzXG4gIGcgLSBOdW1iZXIsIDAtMjU1LCByZXByZXNlbnRpbmcgdGhlIGdyZWVuIGNoYW5uZWxcbiAgYiAtIE51bWJlciwgMC0yNTUsIHJlcHJlc2VudGluZyB0aGUgcmVkIGNoYW5uZWxcblxuICBSZXR1cm5zOlxuICBBcnJheVxuXG4gID4gPiBDaHJvbWF0aC5yZ2IyaHN2KDAsIDI1NSwgMCk7XG4gID4gWyAxMjAsIDEsIDEgXVxuXG4gID4gPiBDaHJvbWF0aC5yZ2IyaHN2KFswLCAwLCAyNTVdKTtcbiAgPiBbIDI0MCwgMSwgMSBdXG5cbiAgPiA+IENocm9tYXRoLnJnYjJoc3Yoe3I6IDI1NSwgZzogMCwgYjogMH0pO1xuICA+IFsgMCwgMSwgMSBdXG4gKi9cbkNocm9tYXRoLnJnYjJoc3YgPSBmdW5jdGlvbiByZ2IyaHN2KHIsIGcsIGIpXG57XG4gICAgdmFyIHJnYiA9IHV0aWwucmdiLnNjYWxlZDAxKHIsIGcsIGIpO1xuICAgIHIgPSByZ2JbMF0sIGcgPSByZ2JbMV0sIGIgPSByZ2JbMl07XG5cbiAgICB2YXIgTSA9IE1hdGgubWF4KHIsIGcsIGIpO1xuICAgIHZhciBtID0gTWF0aC5taW4ociwgZywgYik7XG4gICAgdmFyIEMgPSBNIC0gbTtcbiAgICB2YXIgTCA9IE07XG4gICAgdmFyIFMgPSAoQyA9PT0gMCkgPyAwIDogQy9NO1xuXG4gICAgdmFyIGg7XG4gICAgaWYgKEMgPT09IDApIGggPSAwOyAvLyBzcGVjJ2QgYXMgdW5kZWZpbmVkLCBidXQgdXN1YWxseSBzZXQgdG8gMFxuICAgIGVsc2UgaWYgKE0gPT09IHIpIGggPSAoKGctYikvQykgJSA2O1xuICAgIGVsc2UgaWYgKE0gPT09IGcpIGggPSAoKGItcikvQykgKyAyO1xuICAgIGVsc2UgaWYgKE0gPT09IGIpIGggPSAoKHItZykvQykgKyA0O1xuXG4gICAgdmFyIEggPSA2MCAqIGg7XG5cbiAgICByZXR1cm4gW0gsIHBhcnNlRmxvYXQoUyksIHBhcnNlRmxvYXQoTCldO1xufTtcblxuLypcbiAgIE1ldGhvZDogQ2hyb21hdGgucmdiMmhzYlxuICAgQWxpYXMgZm9yIDxDaHJvbWF0aC5yZ2IyaHN2PlxuICovXG5DaHJvbWF0aC5yZ2IyaHNiID0gQ2hyb21hdGgucmdiMmhzdjtcblxuLypcbiAgTWV0aG9kOiBDaHJvbWF0aC5oc2wycmdiXG4gIENvbnZlcnQgZnJvbSBIU0wgdG8gUkdCXG5cbiAgUGFyYW1ldGVyczpcbiAgaCAtIE51bWJlciwgLUluZmluaXR5IC0gSW5maW5pdHksIHJlcHJlc2VudGluZyB0aGUgaHVlIE9SIEFycmF5IE9SIG9iamVjdCAod2l0aCBrZXlzIGgscyxsKSBvZiBIU0wgdmFsdWVzXG4gIHMgLSBOdW1iZXIsIDAtMSwgcmVwcmVzZW50aW5nIHRoZSBzYXR1cmF0aW9uXG4gIGwgLSBOdW1iZXIsIDAtMSwgcmVwcmVzZW50aW5nIHRoZSBsaWdodG5lc3NcblxuICBSZXR1cm5zOlxuICBhcnJheVxuXG4gIEV4YW1wbGVzOlxuICA+ID4gQ2hyb21hdGguaHNsMnJnYigzNjAsIDEsIDAuNSk7XG4gID4gWyAyNTUsIDAsIDAgXVxuXG4gID4gPiBDaHJvbWF0aC5oc2wycmdiKFswLCAxLCAwLjVdKTtcbiAgPiBbIDI1NSwgMCwgMCBdXG5cbiAgPiA+IENocm9tYXRoLmhzbDJyZ2Ioe2g6IDIxMCwgczoxLCB2OiAwLjV9KTtcbiAgPiBbIDAsIDEyNy41LCAyNTUgXVxuICovXG4vLyBUT0RPOiBDYW4gSSAlPSBocCBhbmQgdGhlbiBkbyBhIHN3aXRjaD9cbkNocm9tYXRoLmhzbDJyZ2IgPSBmdW5jdGlvbiBoc2wycmdiKGgsIHMsIGwpXG57XG4gICAgdmFyIGhzbCA9IHV0aWwuaHNsLnNjYWxlZChoLCBzLCBsKTtcbiAgICBoPWhzbFswXSwgcz1oc2xbMV0sIGw9aHNsWzJdO1xuXG4gICAgdmFyIEMgPSAoMSAtIE1hdGguYWJzKDIqbC0xKSkgKiBzO1xuICAgIHZhciBocCA9IGgvNjA7XG4gICAgdmFyIFggPSBDICogKDEtTWF0aC5hYnMoaHAlMi0xKSk7XG4gICAgdmFyIHJnYiwgbTtcblxuICAgIHN3aXRjaCAoTWF0aC5mbG9vcihocCkpe1xuICAgIGNhc2UgMDogIHJnYiA9IFtDLFgsMF07IGJyZWFrO1xuICAgIGNhc2UgMTogIHJnYiA9IFtYLEMsMF07IGJyZWFrO1xuICAgIGNhc2UgMjogIHJnYiA9IFswLEMsWF07IGJyZWFrO1xuICAgIGNhc2UgMzogIHJnYiA9IFswLFgsQ107IGJyZWFrO1xuICAgIGNhc2UgNDogIHJnYiA9IFtYLDAsQ107IGJyZWFrO1xuICAgIGNhc2UgNTogIHJnYiA9IFtDLDAsWF07IGJyZWFrO1xuICAgIGRlZmF1bHQ6IHJnYiA9IFswLDAsMF07XG4gICAgfVxuXG4gICAgbSA9IGwgLSAoQy8yKTtcblxuICAgIHJldHVybiBbXG4gICAgICAgIChyZ2JbMF0rbSksXG4gICAgICAgIChyZ2JbMV0rbSksXG4gICAgICAgIChyZ2JbMl0rbSlcbiAgICBdO1xufTtcblxuLypcbiAgTWV0aG9kOiBDaHJvbWF0aC5oc3YycmdiXG4gIENvbnZlcnQgSFNWIHRvIFJHQlxuXG4gIFBhcmFtZXRlcnM6XG4gIGggLSBOdW1iZXIsIC1JbmZpbml0eSAtIEluZmluaXR5LCByZXByZXNlbnRpbmcgdGhlIGh1ZSBPUiBBcnJheSBPUiBvYmplY3QgKHdpdGgga2V5cyBoLHMsdiBvciBoLHMsYikgb2YgSFNWIHZhbHVlc1xuICBzIC0gTnVtYmVyLCAwLTEsIHJlcHJlc2VudGluZyB0aGUgc2F0dXJhdGlvblxuICB2IC0gTnVtYmVyLCAwLTEsIHJlcHJlc2VudGluZyB0aGUgbGlnaHRuZXNzXG5cbiAgRXhhbXBsZXM6XG4gID4gPiBDaHJvbWF0aC5oc3YycmdiKDM2MCwgMSwgMSk7XG4gID4gWyAyNTUsIDAsIDAgXVxuXG4gID4gPiBDaHJvbWF0aC5oc3YycmdiKFswLCAxLCAwLjVdKTtcbiAgPiBbIDEyNy41LCAwLCAwIF1cblxuICA+ID4gQ2hyb21hdGguaHN2MnJnYih7aDogMjEwLCBzOiAwLjUsIHY6IDF9KTtcbiAgPiBbIDEyNy41LCAxOTEuMjUsIDI1NSBdXG4gKi9cbkNocm9tYXRoLmhzdjJyZ2IgPSBmdW5jdGlvbiBoc3YycmdiKGgsIHMsIHYpXG57XG4gICAgdmFyIGhzdiA9IHV0aWwuaHNsLnNjYWxlZChoLCBzLCB2KTtcbiAgICBoPWhzdlswXSwgcz1oc3ZbMV0sIHY9aHN2WzJdO1xuXG4gICAgdmFyIEMgPSB2ICogcztcbiAgICB2YXIgaHAgPSBoLzYwO1xuICAgIHZhciBYID0gQyooMS1NYXRoLmFicyhocCUyLTEpKTtcbiAgICB2YXIgcmdiLCBtO1xuXG4gICAgaWYgKGggPT0gdW5kZWZpbmVkKSAgICAgICAgIHJnYiA9IFswLDAsMF07XG4gICAgZWxzZSBpZiAoMCA8PSBocCAmJiBocCA8IDEpIHJnYiA9IFtDLFgsMF07XG4gICAgZWxzZSBpZiAoMSA8PSBocCAmJiBocCA8IDIpIHJnYiA9IFtYLEMsMF07XG4gICAgZWxzZSBpZiAoMiA8PSBocCAmJiBocCA8IDMpIHJnYiA9IFswLEMsWF07XG4gICAgZWxzZSBpZiAoMyA8PSBocCAmJiBocCA8IDQpIHJnYiA9IFswLFgsQ107XG4gICAgZWxzZSBpZiAoNCA8PSBocCAmJiBocCA8IDUpIHJnYiA9IFtYLDAsQ107XG4gICAgZWxzZSBpZiAoNSA8PSBocCAmJiBocCA8IDYpIHJnYiA9IFtDLDAsWF07XG5cbiAgICBtID0gdiAtIEM7XG5cbiAgICByZXR1cm4gW1xuICAgICAgICAocmdiWzBdK20pLFxuICAgICAgICAocmdiWzFdK20pLFxuICAgICAgICAocmdiWzJdK20pXG4gICAgXTtcbn07XG5cbi8qXG4gICBNZXRob2Q6IENocm9tYXRoLmhzYjJyZ2JcbiAgIEFsaWFzIGZvciA8Q2hyb21hdGguaHN2MnJnYj5cbiAqL1xuQ2hyb21hdGguaHNiMnJnYiA9IENocm9tYXRoLmhzdjJyZ2I7XG5cbi8qXG4gICAgUHJvcGVydHk6IENocm9tYXRoLmNvbnZlcnRcbiAgICBBbGlhc2VzIGZvciB0aGUgQ2hyb21hdGgueDJ5IGZ1bmN0aW9ucy5cbiAgICBVc2UgbGlrZSBDaHJvbWF0aC5jb252ZXJ0W3hdW3ldKGFyZ3MpIG9yIENocm9tYXRoLmNvbnZlcnQueC55KGFyZ3MpXG4qL1xuQ2hyb21hdGguY29udmVydCA9IHtcbiAgICByZ2I6IHtcbiAgICAgICAgaGV4OiBDaHJvbWF0aC5oc3YycmdiLFxuICAgICAgICBoc2w6IENocm9tYXRoLnJnYjJoc2wsXG4gICAgICAgIGhzdjogQ2hyb21hdGgucmdiMmhzdlxuICAgIH0sXG4gICAgaHNsOiB7XG4gICAgICAgIHJnYjogQ2hyb21hdGguaHNsMnJnYlxuICAgIH0sXG4gICAgaHN2OiB7XG4gICAgICAgIHJnYjogQ2hyb21hdGguaHN2MnJnYlxuICAgIH1cbn07XG5cbi8qIEdyb3VwOiBTdGF0aWMgbWV0aG9kcyAtIGNvbG9yIHNjaGVtZSAqL1xuLypcbiAgTWV0aG9kOiBDaHJvbWF0aC5jb21wbGVtZW50XG4gIFJldHVybiB0aGUgY29tcGxlbWVudCBvZiB0aGUgZ2l2ZW4gY29sb3JcblxuICBSZXR1cm5zOiA8Q2hyb21hdGg+XG5cbiAgPiA+IENocm9tYXRoLmNvbXBsZW1lbnQobmV3IENocm9tYXRoKCdyZWQnKSk7XG4gID4geyByOiAwLCBnOiAyNTUsIGI6IDI1NSwgYTogMSwgaDogMTgwLCBzbDogMSwgc3Y6IDEsIGw6IDAuNSwgdjogMSB9XG5cbiAgPiA+IENocm9tYXRoLmNvbXBsZW1lbnQobmV3IENocm9tYXRoKCdyZWQnKSkudG9TdHJpbmcoKTtcbiAgPiAnIzAwRkZGRidcbiAqL1xuQ2hyb21hdGguY29tcGxlbWVudCA9IGZ1bmN0aW9uIChjb2xvcilcbntcbiAgICB2YXIgYyA9IG5ldyBDaHJvbWF0aChjb2xvcik7XG4gICAgdmFyIGhzbCA9IGMudG9IU0xPYmplY3QoKTtcblxuICAgIGhzbC5oID0gKGhzbC5oICsgMTgwKSAlIDM2MDtcblxuICAgIHJldHVybiBuZXcgQ2hyb21hdGgoaHNsKTtcbn07XG5cbi8qXG4gIE1ldGhvZDogQ2hyb21hdGgudHJpYWRcbiAgQ3JlYXRlIGEgdHJpYWQgY29sb3Igc2NoZW1lIGZyb20gdGhlIGdpdmVuIENocm9tYXRoLlxuXG4gIEV4YW1wbGVzOlxuICA+ID4gQ2hyb21hdGgudHJpYWQoQ2hyb21hdGgueWVsbG93KVxuICA+IFsgeyByOiAyNTUsIGc6IDI1NSwgYjogMCwgYTogMSwgaDogNjAsIHNsOiAxLCBzdjogMSwgbDogMC41LCB2OiAxIH0sXG4gID4gICB7IHI6IDAsIGc6IDI1NSwgYjogMjU1LCBhOiAxLCBoOiAxODAsIHNsOiAxLCBzdjogMSwgbDogMC41LCB2OiAxIH0sXG4gID4gICB7IHI6IDI1NSwgZzogMCwgYjogMjU1LCBhOiAxLCBoOiAzMDAsIHNsOiAxLCBzdjogMSwgbDogMC41LCB2OiAxIH0gXVxuXG4gPiA+IENocm9tYXRoLnRyaWFkKENocm9tYXRoLnllbGxvdykudG9TdHJpbmcoKTtcbiA+ICcjRkZGRjAwLCMwMEZGRkYsI0ZGMDBGRidcbiovXG5DaHJvbWF0aC50cmlhZCA9IGZ1bmN0aW9uIChjb2xvcilcbntcbiAgICB2YXIgYyA9IG5ldyBDaHJvbWF0aChjb2xvcik7XG5cbiAgICByZXR1cm4gW1xuICAgICAgICBjLFxuICAgICAgICBuZXcgQ2hyb21hdGgoe3I6IGMuYiwgZzogYy5yLCBiOiBjLmd9KSxcbiAgICAgICAgbmV3IENocm9tYXRoKHtyOiBjLmcsIGc6IGMuYiwgYjogYy5yfSlcbiAgICBdO1xufTtcblxuLypcbiAgTWV0aG9kOiBDaHJvbWF0aC50ZXRyYWRcbiAgQ3JlYXRlIGEgdGV0cmFkIGNvbG9yIHNjaGVtZSBmcm9tIHRoZSBnaXZlbiBDaHJvbWF0aC5cblxuICBFeGFtcGxlczpcbiAgPiA+IENocm9tYXRoLnRldHJhZChDaHJvbWF0aC5jeWFuKVxuICA+IFsgeyByOiAwLCBnOiAyNTUsIGI6IDI1NSwgYTogMSwgaDogMTgwLCBzbDogMSwgc3Y6IDEsIGw6IDAuNSwgdjogMSB9LFxuICA+ICAgeyByOiAyNTUsIGc6IDAsIGI6IDI1NSwgYTogMSwgaDogMzAwLCBzbDogMSwgc3Y6IDEsIGw6IDAuNSwgdjogMSB9LFxuICA+ICAgeyByOiAyNTUsIGc6IDI1NSwgYjogMCwgYTogMSwgaDogNjAsIHNsOiAxLCBzdjogMSwgbDogMC41LCB2OiAxIH0sXG4gID4gICB7IHI6IDAsIGc6IDI1NSwgYjogMCwgYTogMSwgaDogMTIwLCBzbDogMSwgc3Y6IDEsIGw6IDAuNSwgdjogMSB9IF1cblxuICA+ID4gQ2hyb21hdGgudGV0cmFkKENocm9tYXRoLmN5YW4pLnRvU3RyaW5nKCk7XG4gID4gJyMwMEZGRkYsI0ZGMDBGRiwjRkZGRjAwLCMwMEZGMDAnXG4qL1xuQ2hyb21hdGgudGV0cmFkID0gZnVuY3Rpb24gKGNvbG9yKVxue1xuICAgIHZhciBjID0gbmV3IENocm9tYXRoKGNvbG9yKTtcblxuICAgIHJldHVybiBbXG4gICAgICAgIGMsXG4gICAgICAgIG5ldyBDaHJvbWF0aCh7cjogYy5iLCBnOiBjLnIsIGI6IGMuYn0pLFxuICAgICAgICBuZXcgQ2hyb21hdGgoe3I6IGMuYiwgZzogYy5nLCBiOiBjLnJ9KSxcbiAgICAgICAgbmV3IENocm9tYXRoKHtyOiBjLnIsIGc6IGMuYiwgYjogYy5yfSlcbiAgICBdO1xufTtcblxuLypcbiAgTWV0aG9kOiBDaHJvbWF0aC5hbmFsb2dvdXNcbiAgRmluZCBhbmFsb2dvdXMgY29sb3JzIGZyb20gYSBnaXZlbiBjb2xvclxuXG4gIFBhcmFtZXRlcnM6XG4gIG1peGVkIC0gQW55IGFyZ3VtZW50IHdoaWNoIGlzIHBhc3NlZCB0byA8Q2hyb21hdGg+XG4gIHJlc3VsdHMgLSBIb3cgbWFueSBjb2xvcnMgdG8gcmV0dXJuIChkZWZhdWx0ID0gMylcbiAgc2xpY2VzIC0gSG93IG1hbnkgcGllY2VzIGFyZSBpbiB0aGUgY29sb3Igd2hlZWwgKGRlZmF1bHQgPSAxMilcblxuICBFeGFtcGxlczpcbiAgPiA+IENocm9tYXRoLmFuYWxvZ291cyhuZXcgQ2hyb21hdGgoJ3JnYigwLCAyNTUsIDI1NSknKSlcbiAgPiBbIHsgcjogMCwgZzogMjU1LCBiOiAyNTUsIGE6IDEsIGg6IDE4MCwgc2w6IDEsIHN2OiAxLCBsOiAwLjUsIHY6IDEgfSxcbiAgPiAgIHsgcjogMCwgZzogMjU1LCBiOiAxMDEsIGE6IDEsIGg6IDE0NCwgc2w6IDEsIHN2OiAxLCBsOiAwLjUsIHY6IDEgfSxcbiAgPiAgIHsgcjogMCwgZzogMjU1LCBiOiAxNTMsIGE6IDEsIGg6IDE1Niwgc2w6IDEsIHN2OiAxLCBsOiAwLjUsIHY6IDEgfSxcbiAgPiAgIHsgcjogMCwgZzogMjU1LCBiOiAyMDMsIGE6IDEsIGg6IDE2OCwgc2w6IDEsIHN2OiAxLCBsOiAwLjUsIHY6IDEgfSxcbiAgPiAgIHsgcjogMCwgZzogMjU1LCBiOiAyNTUsIGE6IDEsIGg6IDE4MCwgc2w6IDEsIHN2OiAxLCBsOiAwLjUsIHY6IDEgfSxcbiAgPiAgIHsgcjogMCwgZzogMjAzLCBiOiAyNTUsIGE6IDEsIGg6IDE5Miwgc2w6IDEsIHN2OiAxLCBsOiAwLjUsIHY6IDEgfSxcbiAgPiAgIHsgcjogMCwgZzogMTUzLCBiOiAyNTUsIGE6IDEsIGg6IDIwNCwgc2w6IDEsIHN2OiAxLCBsOiAwLjUsIHY6IDEgfSxcbiAgPiAgIHsgcjogMCwgZzogMTAxLCBiOiAyNTUsIGE6IDEsIGg6IDIxNiwgc2w6IDEsIHN2OiAxLCBsOiAwLjUsIHY6IDEgfSBdXG5cbiAgPiA+IENocm9tYXRoLmFuYWxvZ291cyhuZXcgQ2hyb21hdGgoJ3JnYigwLCAyNTUsIDI1NSknKSkudG9TdHJpbmcoKVxuICA+ICcjMDBGRkZGLCMwMEZGNjUsIzAwRkY5OSwjMDBGRkNCLCMwMEZGRkYsIzAwQ0JGRiwjMDA5OUZGLCMwMDY1RkYnXG4gKi9cbkNocm9tYXRoLmFuYWxvZ291cyA9IGZ1bmN0aW9uIChjb2xvciwgcmVzdWx0cywgc2xpY2VzKVxue1xuICAgIGlmICghaXNGaW5pdGUocmVzdWx0cykpIHJlc3VsdHMgPSAzO1xuICAgIGlmICghaXNGaW5pdGUoc2xpY2VzKSkgc2xpY2VzID0gMTI7XG5cbiAgICB2YXIgYyA9IG5ldyBDaHJvbWF0aChjb2xvcik7XG4gICAgdmFyIGhzdiA9IGMudG9IU1ZPYmplY3QoKTtcbiAgICB2YXIgc2xpY2UgPSAzNjAgLyBzbGljZXM7XG4gICAgdmFyIHJldCA9IFsgYyBdO1xuXG4gICAgaHN2LmggPSAoKGhzdi5oIC0gKHNsaWNlcyAqIHJlc3VsdHMgPj4gMSkpICsgNzIwKSAlIDM2MDtcbiAgICB3aGlsZSAoLS1yZXN1bHRzKSB7XG4gICAgICAgIGhzdi5oID0gKGhzdi5oICsgc2xpY2UpICUgMzYwO1xuICAgICAgICByZXQucHVzaChuZXcgQ2hyb21hdGgoaHN2KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbn07XG5cbi8qXG4gIE1ldGhvZDogQ2hyb21hdGgubW9ub2Nocm9tYXRpY1xuICBSZXR1cm4gYSBzZXJpZXMgb2YgdGhlIGdpdmVuIGNvbG9yIGF0IHZhcmlvdXMgbGlnaHRuZXNzZXNcblxuICBFeGFtcGxlczpcbiAgPiA+IENocm9tYXRoLm1vbm9jaHJvbWF0aWMoJ3JnYigwLCAxMDAsIDI1NSknKS5mb3JFYWNoKGZ1bmN0aW9uIChjKXsgY29uc29sZS5sb2coYy50b0hTVlN0cmluZygpKTsgfSlcbiAgPiBoc3YoMjE2LDEwMCUsMjAlKVxuICA+IGhzdigyMTYsMTAwJSw0MCUpXG4gID4gaHN2KDIxNiwxMDAlLDYwJSlcbiAgPiBoc3YoMjE2LDEwMCUsODAlKVxuICA+IGhzdigyMTYsMTAwJSwxMDAlKVxuKi9cbkNocm9tYXRoLm1vbm9jaHJvbWF0aWMgPSBmdW5jdGlvbiAoY29sb3IsIHJlc3VsdHMpXG57XG4gICAgaWYgKCFyZXN1bHRzKSByZXN1bHRzID0gNTtcblxuICAgIHZhciBjID0gbmV3IENocm9tYXRoKGNvbG9yKTtcbiAgICB2YXIgaHN2ID0gYy50b0hTVk9iamVjdCgpO1xuICAgIHZhciBpbmMgPSAxIC8gcmVzdWx0cztcbiAgICB2YXIgcmV0ID0gW10sIHN0ZXAgPSAwO1xuXG4gICAgd2hpbGUgKHN0ZXArKyA8IHJlc3VsdHMpIHtcbiAgICAgICAgaHN2LnYgPSBzdGVwICogaW5jO1xuICAgICAgICByZXQucHVzaChuZXcgQ2hyb21hdGgoaHN2KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbn07XG5cbi8qXG4gIE1ldGhvZDogQ2hyb21hdGguc3BsaXRjb21wbGVtZW50XG4gIEdlbmVyYXRlIGEgc3BsaXQgY29tcGxlbWVudCBjb2xvciBzY2hlbWUgZnJvbSB0aGUgZ2l2ZW4gY29sb3JcblxuICBFeGFtcGxlczpcbiAgPiA+IENocm9tYXRoLnNwbGl0Y29tcGxlbWVudCgncmdiKDAsIDEwMCwgMjU1KScpXG4gID4gWyB7IHI6IDAsIGc6IDEwMCwgYjogMjU1LCBoOiAyMTYuNDcwNTg4MjM1Mjk0MTQsIHNsOiAxLCBsOiAwLjUsIHN2OiAxLCB2OiAxLCBhOiAxIH0sXG4gID4gICB7IHI6IDI1NSwgZzogMTgzLCBiOiAwLCBoOiA0My4xOTk5OTk5OTk5OTk5OSwgc2w6IDEsIGw6IDAuNSwgc3Y6IDEsIHY6IDEsIGE6IDEgfSxcbiAgPiAgIHsgcjogMjU1LCBnOiA3MywgYjogMCwgaDogMTcuMjc5OTk5OTk5OTk5OTczLCBzbDogMSwgbDogMC41LCBzdjogMSwgdjogMSwgYTogMSB9IF1cblxuICA+ID4gQ2hyb21hdGguc3BsaXRjb21wbGVtZW50KCdyZ2IoMCwgMTAwLCAyNTUpJykudG9TdHJpbmcoKVxuICA+ICcjMDA2NEZGLCNGRkI3MDAsI0ZGNDkwMCdcbiAqL1xuQ2hyb21hdGguc3BsaXRjb21wbGVtZW50ID0gZnVuY3Rpb24gKGNvbG9yKVxue1xuICAgIHZhciByZWYgPSBuZXcgQ2hyb21hdGgoY29sb3IpO1xuICAgIHZhciBoc3YgPSByZWYudG9IU1ZPYmplY3QoKTtcblxuICAgIHZhciBhID0gbmV3IENocm9tYXRoLmhzdih7XG4gICAgICAgIGg6IChoc3YuaCArIDE1MCkgJSAzNjAsXG4gICAgICAgIHM6IGhzdi5zLFxuICAgICAgICB2OiBoc3YudlxuICAgIH0pO1xuXG4gICAgdmFyIGIgPSBuZXcgQ2hyb21hdGguaHN2KHtcbiAgICAgICAgaDogKGhzdi5oICsgMjEwKSAlIDM2MCxcbiAgICAgICAgczogaHN2LnMsXG4gICAgICAgIHY6IGhzdi52XG4gICAgfSk7XG5cbiAgICByZXR1cm4gW3JlZiwgYSwgYl07XG59O1xuXG4vL0dyb3VwOiBTdGF0aWMgbWV0aG9kcyAtIGNvbG9yIGFsdGVyYXRpb25cbi8qXG4gIE1ldGhvZDogQ2hyb21hdGgudGludFxuICBMaWdodGVuIGEgY29sb3IgYnkgYWRkaW5nIGEgcGVyY2VudGFnZSBvZiB3aGl0ZSB0byBpdFxuXG4gIFJldHVybnMgPENocm9tYXRoPlxuXG4gID4gPiBDaHJvbWF0aC50aW50KCdyZ2IoMCwgMTAwLCAyNTUpJywgMC41KS50b1JHQlN0cmluZygpO1xuICA+ICdyZ2IoMTI3LDE3NywyNTUpJ1xuKi9cbkNocm9tYXRoLnRpbnQgPSBmdW5jdGlvbiAoIGZyb20sIGJ5IClcbntcbiAgICByZXR1cm4gQ2hyb21hdGgudG93YXJkcyggZnJvbSwgJyNGRkZGRkYnLCBieSApO1xufTtcblxuLypcbiAgIE1ldGhvZDogQ2hyb21hdGgubGlnaHRlblxuICAgQWxpYXMgZm9yIDxDaHJvbWF0aC50aW50PlxuKi9cbkNocm9tYXRoLmxpZ2h0ZW4gPSBDaHJvbWF0aC50aW50O1xuXG4vKlxuICBNZXRob2Q6IENocm9tYXRoLnNoYWRlXG4gIERhcmtlbiBhIGNvbG9yIGJ5IGFkZGluZyBhIHBlcmNlbnRhZ2Ugb2YgYmxhY2sgdG8gaXRcblxuICBFeGFtcGxlOlxuICA+ID4gQ2hyb21hdGguZGFya2VuKCdyZ2IoMCwgMTAwLCAyNTUpJywgMC41KS50b1JHQlN0cmluZygpO1xuICA+ICdyZ2IoMCw1MCwxMjcpJ1xuICovXG5DaHJvbWF0aC5zaGFkZSA9IGZ1bmN0aW9uICggZnJvbSwgYnkgKVxue1xuICAgIHJldHVybiBDaHJvbWF0aC50b3dhcmRzKCBmcm9tLCAnIzAwMDAwMCcsIGJ5ICk7XG59O1xuXG4vKlxuICAgTWV0aG9kOiBDaHJvbWF0aC5kYXJrZW5cbiAgIEFsaWFzIGZvciA8Q2hyb21hdGguc2hhZGU+XG4gKi9cbkNocm9tYXRoLmRhcmtlbiA9IENocm9tYXRoLnNoYWRlO1xuXG4vKlxuICBNZXRob2Q6IENocm9tYXRoLmRlc2F0dXJhdGVcbiAgRGVzYXR1cmF0ZSBhIGNvbG9yIHVzaW5nIGFueSBvZiAzIGFwcHJvYWNoZXNcblxuICBQYXJhbWV0ZXJzOlxuICBjb2xvciAtIGFueSBhcmd1bWVudCBhY2NlcHRlZCBieSB0aGUgPENocm9tYXRoPiBjb25zdHJ1Y3RvclxuICBmb3JtdWxhIC0gVGhlIGZvcm11bGEgdG8gdXNlIChmcm9tIDx4YXJnJ3MgZ3JleWZpbHRlciBhdCBodHRwOi8vd3d3Lnhhcmcub3JnL3Byb2plY3QvanF1ZXJ5LWNvbG9yLXBsdWdpbi14Y29sb3I+KVxuICAtIDEgLSB4YXJnJ3Mgb3duIGZvcm11bGFcbiAgLSAyIC0gU3VuJ3MgZm9ybXVsYTogKDEgLSBhdmcpIC8gKDEwMCAvIDM1KSArIGF2ZylcbiAgLSBlbXB0eSAtIFRoZSBvZnQtc2VlbiAzMCUgcmVkLCA1OSUgZ3JlZW4sIDExJSBibHVlIGZvcm11bGFcblxuICBFeGFtcGxlczpcbiAgPiA+IENocm9tYXRoLmRlc2F0dXJhdGUoJ3JlZCcpLnRvU3RyaW5nKClcbiAgPiBcIiM0QzRDNENcIlxuXG4gID4gPiBDaHJvbWF0aC5kZXNhdHVyYXRlKCdyZWQnLCAxKS50b1N0cmluZygpXG4gID4gXCIjMzczNzM3XCJcblxuICA+ID4gQ2hyb21hdGguZGVzYXR1cmF0ZSgncmVkJywgMikudG9TdHJpbmcoKVxuICA+IFwiIzkwOTA5MFwiXG4qL1xuQ2hyb21hdGguZGVzYXR1cmF0ZSA9IGZ1bmN0aW9uIChjb2xvciwgZm9ybXVsYSlcbntcbiAgICB2YXIgYyA9IG5ldyBDaHJvbWF0aChjb2xvciksIHJnYiwgYXZnO1xuXG4gICAgc3dpdGNoIChmb3JtdWxhKSB7XG4gICAgY2FzZSAxOiAvLyB4YXJnJ3MgZm9ybXVsYVxuICAgICAgICBhdmcgPSAuMzUgKyAxMyAqIChjLnIgKyBjLmcgKyBjLmIpIC8gNjA7IGJyZWFrO1xuICAgIGNhc2UgMjogLy8gU3VuJ3MgZm9ybXVsYTogKDEgLSBhdmcpIC8gKDEwMCAvIDM1KSArIGF2ZylcbiAgICAgICAgYXZnID0gKDEzICogKGMuciArIGMuZyArIGMuYikgKyA1MzU1KSAvIDYwOyBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgICBhdmcgPSBjLnIgKiAuMyArIGMuZyAqIC41OSArIGMuYiAqIC4xMTtcbiAgICB9XG5cbiAgICBhdmcgPSB1dGlsLmNsYW1wKGF2ZywgMCwgMjU1KTtcbiAgICByZ2IgPSB7cjogYXZnLCBnOiBhdmcsIGI6IGF2Z307XG5cbiAgICByZXR1cm4gbmV3IENocm9tYXRoKHJnYik7XG59O1xuXG4vKlxuICBNZXRob2Q6IENocm9tYXRoLmdyZXlzY2FsZVxuICBBbGlhcyBmb3IgPENocm9tYXRoLmRlc2F0dXJhdGU+XG4qL1xuQ2hyb21hdGguZ3JleXNjYWxlID0gQ2hyb21hdGguZGVzYXR1cmF0ZTtcblxuLypcbiAgTWV0aG9kOiBDaHJvbWF0aC53ZWJzYWZlXG4gIENvbnZlcnQgYSBjb2xvciB0byBvbmUgb2YgdGhlIDIxNiBcIndlYnNhZmVcIiBjb2xvcnNcblxuICBFeGFtcGxlczpcbiAgPiA+IENocm9tYXRoLndlYnNhZmUoJyNBQkNERUYnKS50b1N0cmluZygpXG4gID4gJyM5OUNDRkYnXG5cbiAgPiA+IENocm9tYXRoLndlYnNhZmUoJyNCQkNERUYnKS50b1N0cmluZygpXG4gID4gJyNDQ0NDRkYnXG4gKi9cbkNocm9tYXRoLndlYnNhZmUgPSBmdW5jdGlvbiAoY29sb3IpXG57XG4gICAgY29sb3IgPSBuZXcgQ2hyb21hdGgoY29sb3IpO1xuXG4gICAgY29sb3IuciA9IE1hdGgucm91bmQoY29sb3IuciAvIDUxKSAqIDUxO1xuICAgIGNvbG9yLmcgPSBNYXRoLnJvdW5kKGNvbG9yLmcgLyA1MSkgKiA1MTtcbiAgICBjb2xvci5iID0gTWF0aC5yb3VuZChjb2xvci5iIC8gNTEpICogNTE7XG5cbiAgICByZXR1cm4gbmV3IENocm9tYXRoKGNvbG9yKTtcbn07XG5cbi8vR3JvdXA6IFN0YXRpYyBtZXRob2RzIC0gY29sb3IgY29tYmluYXRpb25cbi8qXG4gIE1ldGhvZDogQ2hyb21hdGguYWRkaXRpdmVcbiAgQ29tYmluZSBhbnkgbnVtYmVyIGNvbG9ycyB1c2luZyBhZGRpdGl2ZSBjb2xvclxuXG4gIEV4YW1wbGVzOlxuICA+ID4gQ2hyb21hdGguYWRkaXRpdmUoJyNGMDAnLCAnIzBGMCcpLnRvU3RyaW5nKCk7XG4gID4gJyNGRkZGMDAnXG5cbiAgPiA+IENocm9tYXRoLmFkZGl0aXZlKCcjRjAwJywgJyMwRjAnKS50b1N0cmluZygpID09IENocm9tYXRoLnllbGxvdy50b1N0cmluZygpO1xuICA+IHRydWVcblxuICA+ID4gQ2hyb21hdGguYWRkaXRpdmUoJ3JlZCcsICcjMEYwJywgJ3JnYigwLCAwLCAyNTUpJykudG9TdHJpbmcoKSA9PSBDaHJvbWF0aC53aGl0ZS50b1N0cmluZygpO1xuICA+IHRydWVcbiAqL1xuQ2hyb21hdGguYWRkaXRpdmUgPSBmdW5jdGlvbiAoKVxue1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLmxlbmd0aC0yLCBpPS0xLCBhLCBiO1xuICAgIHdoaWxlIChpKysgPCBhcmdzKXtcblxuICAgICAgICBhID0gYSB8fCBuZXcgQ2hyb21hdGgoYXJndW1lbnRzW2ldKTtcbiAgICAgICAgYiA9IG5ldyBDaHJvbWF0aChhcmd1bWVudHNbaSsxXSk7XG5cbiAgICAgICAgaWYgKChhLnIgKz0gYi5yKSA+IDI1NSkgYS5yID0gMjU1O1xuICAgICAgICBpZiAoKGEuZyArPSBiLmcpID4gMjU1KSBhLmcgPSAyNTU7XG4gICAgICAgIGlmICgoYS5iICs9IGIuYikgPiAyNTUpIGEuYiA9IDI1NTtcblxuICAgICAgICBhID0gbmV3IENocm9tYXRoKGEpO1xuICAgIH1cblxuICAgIHJldHVybiBhO1xufTtcblxuLypcbiAgTWV0aG9kOiBDaHJvbWF0aC5zdWJ0cmFjdGl2ZVxuICBDb21iaW5lIGFueSBudW1iZXIgb2YgY29sb3JzIHVzaW5nIHN1YnRyYWN0aXZlIGNvbG9yXG5cbiAgRXhhbXBsZXM6XG4gID4gPiBDaHJvbWF0aC5zdWJ0cmFjdGl2ZSgneWVsbG93JywgJ21hZ2VudGEnKS50b1N0cmluZygpO1xuICA+ICcjRkYwMDAwJ1xuXG4gID4gPiBDaHJvbWF0aC5zdWJ0cmFjdGl2ZSgneWVsbG93JywgJ21hZ2VudGEnKS50b1N0cmluZygpID09PSBDaHJvbWF0aC5yZWQudG9TdHJpbmcoKTtcbiAgPiB0cnVlXG5cbiAgPiA+IENocm9tYXRoLnN1YnRyYWN0aXZlKCdjeWFuJywgJ21hZ2VudGEnLCAneWVsbG93JykudG9TdHJpbmcoKTtcbiAgPiAnIzAwMDAwMCdcblxuICA+ID4gQ2hyb21hdGguc3VidHJhY3RpdmUoJ3JlZCcsICcjMEYwJywgJ3JnYigwLCAwLCAyNTUpJykudG9TdHJpbmcoKTtcbiAgPiAnIzAwMDAwMCdcbiovXG5DaHJvbWF0aC5zdWJ0cmFjdGl2ZSA9IGZ1bmN0aW9uICgpXG57XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoLTIsIGk9LTEsIGEsIGI7XG4gICAgd2hpbGUgKGkrKyA8IGFyZ3Mpe1xuXG4gICAgICAgIGEgPSBhIHx8IG5ldyBDaHJvbWF0aChhcmd1bWVudHNbaV0pO1xuICAgICAgICBiID0gbmV3IENocm9tYXRoKGFyZ3VtZW50c1tpKzFdKTtcblxuICAgICAgICBpZiAoKGEuciArPSBiLnIgLSAyNTUpIDwgMCkgYS5yID0gMDtcbiAgICAgICAgaWYgKChhLmcgKz0gYi5nIC0gMjU1KSA8IDApIGEuZyA9IDA7XG4gICAgICAgIGlmICgoYS5iICs9IGIuYiAtIDI1NSkgPCAwKSBhLmIgPSAwO1xuXG4gICAgICAgIGEgPSBuZXcgQ2hyb21hdGgoYSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGE7XG59O1xuXG4vKlxuICBNZXRob2Q6IENocm9tYXRoLm11bHRpcGx5XG4gIE11bHRpcGx5IGFueSBudW1iZXIgb2YgY29sb3JzXG5cbiAgRXhhbXBsZXM6XG4gID4gPiBDaHJvbWF0aC5tdWx0aXBseShDaHJvbWF0aC5saWdodGdvbGRlbnJvZHllbGxvdywgQ2hyb21hdGgubGlnaHRibHVlKS50b1N0cmluZygpO1xuICA+IFwiI0E5RDNCRFwiXG5cbiAgPiA+IENocm9tYXRoLm11bHRpcGx5KENocm9tYXRoLm9sZGxhY2UsIENocm9tYXRoLmxpZ2h0Ymx1ZSwgQ2hyb21hdGguZGFya2JsdWUpLnRvU3RyaW5nKCk7XG4gID4gXCIjMDAwMDcwXCJcbiovXG5DaHJvbWF0aC5tdWx0aXBseSA9IGZ1bmN0aW9uICgpXG57XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoLTIsIGk9LTEsIGEsIGI7XG4gICAgd2hpbGUgKGkrKyA8IGFyZ3Mpe1xuXG4gICAgICAgIGEgPSBhIHx8IG5ldyBDaHJvbWF0aChhcmd1bWVudHNbaV0pO1xuICAgICAgICBiID0gbmV3IENocm9tYXRoKGFyZ3VtZW50c1tpKzFdKTtcblxuICAgICAgICBhLnIgPSAoYS5yIC8gMjU1ICogYi5yKXwwO1xuICAgICAgICBhLmcgPSAoYS5nIC8gMjU1ICogYi5nKXwwO1xuICAgICAgICBhLmIgPSAoYS5iIC8gMjU1ICogYi5iKXwwO1xuXG4gICAgICAgIGEgPSBuZXcgQ2hyb21hdGgoYSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGE7XG59O1xuXG4vKlxuICBNZXRob2Q6IENocm9tYXRoLmF2ZXJhZ2VcbiAgQXZlcmFnZXMgYW55IG51bWJlciBvZiBjb2xvcnNcblxuICBFeGFtcGxlczpcbiAgPiA+IENocm9tYXRoLmF2ZXJhZ2UoQ2hyb21hdGgubGlnaHRnb2xkZW5yb2R5ZWxsb3csIENocm9tYXRoLmxpZ2h0Ymx1ZSkudG9TdHJpbmcoKVxuICA+IFwiI0QzRTlEQ1wiXG5cbiAgPiA+IENocm9tYXRoLmF2ZXJhZ2UoQ2hyb21hdGgub2xkbGFjZSwgQ2hyb21hdGgubGlnaHRibHVlLCBDaHJvbWF0aC5kYXJrYmx1ZSkudG9TdHJpbmcoKVxuICA+IFwiIzZBNzNCOFwiXG4gKi9cbkNocm9tYXRoLmF2ZXJhZ2UgPSBmdW5jdGlvbiAoKVxue1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLmxlbmd0aC0yLCBpPS0xLCBhLCBiO1xuICAgIHdoaWxlIChpKysgPCBhcmdzKXtcblxuICAgICAgICBhID0gYSB8fCBuZXcgQ2hyb21hdGgoYXJndW1lbnRzW2ldKTtcbiAgICAgICAgYiA9IG5ldyBDaHJvbWF0aChhcmd1bWVudHNbaSsxXSk7XG5cbiAgICAgICAgYS5yID0gKGEuciArIGIucikgPj4gMTtcbiAgICAgICAgYS5nID0gKGEuZyArIGIuZykgPj4gMTtcbiAgICAgICAgYS5iID0gKGEuYiArIGIuYikgPj4gMTtcblxuICAgICAgICBhID0gbmV3IENocm9tYXRoKGEpO1xuICAgIH1cblxuICAgIHJldHVybiBhO1xufTtcblxuLypcbiAgTWV0aG9kOiBDaHJvbWF0aC5vdmVybGF5XG4gIEFkZCBvbmUgY29sb3Igb24gdG9wIG9mIGFub3RoZXIgd2l0aCBhIGdpdmVuIHRyYW5zcGFyZW5jeVxuXG4gIEV4YW1wbGVzOlxuICA+ID4gQ2hyb21hdGguYXZlcmFnZShDaHJvbWF0aC5saWdodGdvbGRlbnJvZHllbGxvdywgQ2hyb21hdGgubGlnaHRibHVlKS50b1N0cmluZygpXG4gID4gXCIjRDNFOURDXCJcblxuICA+ID4gQ2hyb21hdGguYXZlcmFnZShDaHJvbWF0aC5vbGRsYWNlLCBDaHJvbWF0aC5saWdodGJsdWUsIENocm9tYXRoLmRhcmtibHVlKS50b1N0cmluZygpXG4gID4gXCIjNkE3M0I4XCJcbiAqL1xuQ2hyb21hdGgub3ZlcmxheSA9IGZ1bmN0aW9uICh0b3AsIGJvdHRvbSwgb3BhY2l0eSlcbntcbiAgICB2YXIgYSA9IG5ldyBDaHJvbWF0aCh0b3ApO1xuICAgIHZhciBiID0gbmV3IENocm9tYXRoKGJvdHRvbSk7XG5cbiAgICBpZiAob3BhY2l0eSA+IDEpIG9wYWNpdHkgLz0gMTAwO1xuICAgIG9wYWNpdHkgPSB1dGlsLmNsYW1wKG9wYWNpdHkgLSAxICsgYi5hLCAwLCAxKTtcblxuICAgIHJldHVybiBuZXcgQ2hyb21hdGgoe1xuICAgICAgICByOiB1dGlsLmxlcnAoYS5yLCBiLnIsIG9wYWNpdHkpLFxuICAgICAgICBnOiB1dGlsLmxlcnAoYS5nLCBiLmcsIG9wYWNpdHkpLFxuICAgICAgICBiOiB1dGlsLmxlcnAoYS5iLCBiLmIsIG9wYWNpdHkpXG4gICAgfSk7XG59O1xuXG5cbi8vR3JvdXA6IFN0YXRpYyBtZXRob2RzIC0gb3RoZXJcbi8qXG4gIE1ldGhvZDogQ2hyb21hdGgudG93YXJkc1xuICBNb3ZlIGZyb20gb25lIGNvbG9yIHRvd2FyZHMgYW5vdGhlciBieSB0aGUgZ2l2ZW4gcGVyY2VudGFnZSAoMC0xLCAwLTEwMClcblxuICBQYXJhbWV0ZXJzOlxuICBmcm9tIC0gVGhlIHN0YXJ0aW5nIGNvbG9yXG4gIHRvIC0gVGhlIGRlc3RpbmF0aW9uIGNvbG9yXG4gIGJ5IC0gVGhlIHBlcmNlbnRhZ2UsIGV4cHJlc3NlZCBhcyBhIGZsb2F0aW5nIG51bWJlciBiZXR3ZWVuIDAgYW5kIDEsIHRvIG1vdmUgdG93YXJkcyB0aGUgZGVzdGluYXRpb24gY29sb3JcbiAgaW50ZXJwb2xhdG9yIC0gVGhlIGZ1bmN0aW9uIHRvIHVzZSBmb3IgaW50ZXJwb2xhdGluZyBiZXR3ZWVuIHRoZSB0d28gcG9pbnRzLiBEZWZhdWx0cyB0byBMaW5lYXIgSW50ZXJwb2xhdGlvbi4gRnVuY3Rpb24gaGFzIHRoZSBzaWduYXR1cmUgYChmcm9tLCB0bywgYnkpYCB3aXRoIHRoZSBwYXJhbWV0ZXJzIGhhdmluZyB0aGUgc2FtZSBtZWFuaW5nIGFzIHRob3NlIGluIGB0b3dhcmRzYC5cblxuICA+ID4gQ2hyb21hdGgudG93YXJkcygncmVkJywgJ3llbGxvdycsIDAuNSkudG9TdHJpbmcoKVxuICA+IFwiI0ZGN0YwMFwiXG4qL1xuQ2hyb21hdGgudG93YXJkcyA9IGZ1bmN0aW9uIChmcm9tLCB0bywgYnksIGludGVycG9sYXRvcilcbntcbiAgICBpZiAoIXRvKSB7IHJldHVybiBmcm9tOyB9XG4gICAgaWYgKCFpc0Zpbml0ZShieSkpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVHlwZUVycm9yOiBgYnlgKCcgKyBieSAgKycpIHNob3VsZCBiZSBiZXR3ZWVuIDAgYW5kIDEnKTtcbiAgICBpZiAoIShmcm9tIGluc3RhbmNlb2YgQ2hyb21hdGgpKSBmcm9tID0gbmV3IENocm9tYXRoKGZyb20pO1xuICAgIGlmICghKHRvIGluc3RhbmNlb2YgQ2hyb21hdGgpKSB0byA9IG5ldyBDaHJvbWF0aCh0byB8fCAnI0ZGRkZGRicpO1xuICAgIGlmICghaW50ZXJwb2xhdG9yKSBpbnRlcnBvbGF0b3IgPSB1dGlsLmxlcnA7XG4gICAgYnkgPSBwYXJzZUZsb2F0KGJ5KTtcblxuICAgIHJldHVybiBuZXcgQ2hyb21hdGgoe1xuICAgICAgICByOiBpbnRlcnBvbGF0b3IoZnJvbS5yLCB0by5yLCBieSksXG4gICAgICAgIGc6IGludGVycG9sYXRvcihmcm9tLmcsIHRvLmcsIGJ5KSxcbiAgICAgICAgYjogaW50ZXJwb2xhdG9yKGZyb20uYiwgdG8uYiwgYnkpLFxuICAgICAgICBhOiBpbnRlcnBvbGF0b3IoZnJvbS5hLCB0by5hLCBieSlcbiAgICB9KTtcbn07XG5cbi8qXG4gIE1ldGhvZDogQ2hyb21hdGguZ3JhZGllbnRcbiAgQ3JlYXRlIGFuIGFycmF5IG9mIENocm9tYXRoIG9iamVjdHNcblxuICBQYXJhbWV0ZXJzOlxuICBmcm9tIC0gVGhlIGJlZ2lubmluZyBjb2xvciBvZiB0aGUgZ3JhZGllbnRcbiAgdG8gLSBUaGUgZW5kIGNvbG9yIG9mIHRoZSBncmFkaWVudFxuICBzbGljZXMgLSBUaGUgbnVtYmVyIG9mIGNvbG9ycyBpbiB0aGUgYXJyYXlcbiAgc2xpY2UgLSBUaGUgY29sb3IgYXQgYSBzcGVjaWZpYywgMS1iYXNlZCwgc2xpY2UgaW5kZXhcblxuICBFeGFtcGxlczpcbiAgPiA+IENocm9tYXRoLmdyYWRpZW50KCdyZWQnLCAneWVsbG93JykubGVuZ3RoO1xuICA+IDIwXG5cbiAgPiA+IENocm9tYXRoLmdyYWRpZW50KCdyZWQnLCAneWVsbG93JywgNSkudG9TdHJpbmcoKTtcbiAgPiBcIiNGRjAwMDAsI0ZGM0YwMCwjRkY3RjAwLCNGRkJGMDAsI0ZGRkYwMFwiXG5cbiAgPiA+IENocm9tYXRoLmdyYWRpZW50KCdyZWQnLCAneWVsbG93JywgNSwgMikudG9TdHJpbmcoKTtcbiAgPiBcIiNGRjdGMDBcIlxuXG4gID4gPiBDaHJvbWF0aC5ncmFkaWVudCgncmVkJywgJ3llbGxvdycsIDUpWzJdLnRvU3RyaW5nKCk7XG4gID4gXCIjRkY3RjAwXCJcbiAqL1xuQ2hyb21hdGguZ3JhZGllbnQgPSBmdW5jdGlvbiAoZnJvbSwgdG8sIHNsaWNlcywgc2xpY2UpXG57XG4gICAgdmFyIGdyYWRpZW50ID0gW10sIHN0b3BzO1xuXG4gICAgaWYgKCEgc2xpY2VzKSBzbGljZXMgPSAyMDtcbiAgICBzdG9wcyA9IChzbGljZXMtMSk7XG5cbiAgICBpZiAoaXNGaW5pdGUoc2xpY2UpKSByZXR1cm4gQ2hyb21hdGgudG93YXJkcyhmcm9tLCB0bywgc2xpY2Uvc3RvcHMpO1xuICAgIGVsc2Ugc2xpY2UgPSAtMTtcblxuICAgIHdoaWxlICgrK3NsaWNlIDwgc2xpY2VzKXtcbiAgICAgICAgZ3JhZGllbnQucHVzaChDaHJvbWF0aC50b3dhcmRzKGZyb20sIHRvLCBzbGljZS9zdG9wcykpO1xuICAgIH1cblxuICAgIHJldHVybiBncmFkaWVudDtcbn07XG5cbi8qXG4gIE1ldGhvZDogQ2hyb21hdGgucGFyc2VcbiAgSXRlcmF0ZSB0aHJvdWdoIHRoZSBvYmplY3RzIHNldCBpbiBDaHJvbWF0aC5wYXJzZXJzIGFuZCwgaWYgYSBtYXRjaCBpcyBtYWRlLCByZXR1cm4gdGhlIHZhbHVlIHNwZWNpZmllZCBieSB0aGUgbWF0Y2hpbmcgcGFyc2VycyBgcHJvY2Vzc2AgZnVuY3Rpb25cblxuICBQYXJhbWV0ZXJzOlxuICBzdHJpbmcgLSBUaGUgc3RyaW5nIHRvIHBhcnNlXG5cbiAgRXhhbXBsZTpcbiAgPiA+IENocm9tYXRoLnBhcnNlKCdyZ2IoMCwgMTI4LCAyNTUpJylcbiAgPiB7IHI6IDAsIGc6IDEyOCwgYjogMjU1LCBhOiB1bmRlZmluZWQgfVxuICovXG5DaHJvbWF0aC5wYXJzZSA9IGZ1bmN0aW9uIChzdHJpbmcpXG57XG4gICAgdmFyIHBhcnNlcnMgPSBDaHJvbWF0aC5wYXJzZXJzLCBpLCBsLCBwYXJzZXIsIHBhcnRzLCBjaGFubmVscztcblxuICAgIGZvciAoaSA9IDAsIGwgPSBwYXJzZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBwYXJzZXIgPSBwYXJzZXJzW2ldO1xuICAgICAgICBwYXJ0cyA9IHBhcnNlci5yZWdleC5leGVjKHN0cmluZyk7XG4gICAgICAgIGlmIChwYXJ0cyAmJiBwYXJ0cy5sZW5ndGgpIGNoYW5uZWxzID0gcGFyc2VyLnByb2Nlc3MuYXBwbHkodGhpcywgcGFydHMpO1xuICAgICAgICBpZiAoY2hhbm5lbHMpIHJldHVybiBjaGFubmVscztcbiAgICB9XG59O1xuXG4vLyBHcm91cDogU3RhdGljIHByb3BlcnRpZXNcbi8qXG4gIFByb3BlcnR5OiBDaHJvbWF0aC5wYXJzZXJzXG4gICBBbiBhcnJheSBvZiBvYmplY3RzIGZvciBhdHRlbXB0aW5nIHRvIGNvbnZlcnQgYSBzdHJpbmcgZGVzY3JpYmluZyBhIGNvbG9yIGludG8gYW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHZhcmlvdXMgY2hhbm5lbHMuIE5vIHVzZXIgYWN0aW9uIGlzIHJlcXVpcmVkIGJ1dCBwYXJzZXJzIGNhbiBiZVxuXG4gICBPYmplY3QgcHJvcGVydGllczpcbiAgIHJlZ2V4IC0gcmVndWxhciBleHByZXNzaW9uIHVzZWQgdG8gdGVzdCB0aGUgc3RyaW5nIG9yIG51bWVyaWMgaW5wdXRcbiAgIHByb2Nlc3MgLSBmdW5jdGlvbiB3aGljaCBpcyBwYXNzZWQgdGhlIHJlc3VsdHMgb2YgYHJlZ2V4Lm1hdGNoYCBhbmQgcmV0dXJucyBhbiBvYmplY3Qgd2l0aCBlaXRoZXIgdGhlIHJnYiwgaHNsLCBoc3YsIG9yIGhzYiBjaGFubmVscyBvZiB0aGUgQ2hyb21hdGguXG5cbiAgIEV4YW1wbGVzOlxuKHN0YXJ0IGNvZGUpXG4vLyBBZGQgYSBwYXJzZXJcbkNocm9tYXRoLnBhcnNlcnMucHVzaCh7XG4gICAgZXhhbXBsZTogWzM1NTQ0MzEsIDE2ODA5OTg0XSxcbiAgICByZWdleDogL15cXGQrJC8sXG4gICAgcHJvY2VzczogZnVuY3Rpb24gKGNvbG9yKXtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHI6IGNvbG9yID4+IDE2ICYgMjU1LFxuICAgICAgICAgICAgZzogY29sb3IgPj4gOCAmIDI1NSxcbiAgICAgICAgICAgIGI6IGNvbG9yICYgMjU1XG4gICAgICAgIH07XG4gICAgfVxufSk7XG4oZW5kIGNvZGUpXG4oc3RhcnQgY29kZSlcbi8vIE92ZXJyaWRlIGVudGlyZWx5XG5DaHJvbWF0aC5wYXJzZXJzID0gW1xuICAge1xuICAgICAgIGV4YW1wbGU6IFszNTU0NDMxLCAxNjgwOTk4NF0sXG4gICAgICAgcmVnZXg6IC9eXFxkKyQvLFxuICAgICAgIHByb2Nlc3M6IGZ1bmN0aW9uIChjb2xvcil7XG4gICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICByOiBjb2xvciA+PiAxNiAmIDI1NSxcbiAgICAgICAgICAgICAgIGc6IGNvbG9yID4+IDggJiAyNTUsXG4gICAgICAgICAgICAgICBiOiBjb2xvciAmIDI1NVxuICAgICAgICAgICB9O1xuICAgICAgIH1cbiAgIH0sXG5cbiAgIHtcbiAgICAgICBleGFtcGxlOiBbJyNmYjAnLCAnZjBmJ10sXG4gICAgICAgcmVnZXg6IC9eIz8oW1xcZEEtRl17MX0pKFtcXGRBLUZdezF9KShbXFxkQS1GXXsxfSkkL2ksXG4gICAgICAgcHJvY2VzczogZnVuY3Rpb24gKGhleCwgciwgZywgYil7XG4gICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICByOiBwYXJzZUludChyICsgciwgMTYpLFxuICAgICAgICAgICAgICAgZzogcGFyc2VJbnQoZyArIGcsIDE2KSxcbiAgICAgICAgICAgICAgIGI6IHBhcnNlSW50KGIgKyBiLCAxNilcbiAgICAgICAgICAgfTtcbiAgICAgICB9XG4gICB9XG4oZW5kIGNvZGUpXG4gKi9cbkNocm9tYXRoLnBhcnNlcnMgPSByZXF1aXJlKCcuL3BhcnNlcnMnKS5wYXJzZXJzO1xuXG4vLyBHcm91cDogSW5zdGFuY2UgbWV0aG9kcyAtIGNvbG9yIHJlcHJlc2VudGF0aW9uXG5DaHJvbWF0aC5wcm90b3R5cGUgPSByZXF1aXJlKCcuL3Byb3RvdHlwZScpKENocm9tYXRoKTtcblxuLypcbiAgUHJvcGVydHk6IENocm9tYXRoLmNvbG9yc1xuICBPYmplY3QsIGluZGV4ZWQgYnkgU1ZHL0NTUyBjb2xvciBuYW1lLCBvZiA8Q2hyb21hdGg+IGluc3RhbmNlc1xuICBUaGUgY29sb3IgbmFtZXMgZnJvbSBDU1MgYW5kIFNWRyAxLjBcblxuICBFeGFtcGxlczpcbiAgPiA+IENocm9tYXRoLmNvbG9ycy5hbGljZWJsdWUudG9SR0JBcnJheSgpXG4gID4gWzI0MCwgMjQ4LCAyNTVdXG5cbiAgPiA+IENocm9tYXRoLmNvbG9ycy5iZWlnZS50b1N0cmluZygpXG4gID4gXCIjRjVGNURDXCJcblxuICA+IC8vIENhbiBhbHNvIGJlIGFjY2Vzc2VkIHdpdGhvdXQgYC5jb2xvcmBcbiAgPiA+IENocm9tYXRoLmFsaWNlYmx1ZS50b1JHQkFycmF5KClcbiAgPiBbMjQwLCAyNDgsIDI1NV1cblxuICA+ID4gQ2hyb21hdGguYmVpZ2UudG9TdHJpbmcoKVxuICA+IFwiI0Y1RjVEQ1wiXG4qL1xudmFyIGNzczJDb2xvcnMgID0gcmVxdWlyZSgnLi9jb2xvcm5hbWVzX2NzczInKTtcbnZhciBjc3MzQ29sb3JzICA9IHJlcXVpcmUoJy4vY29sb3JuYW1lc19jc3MzJyk7XG52YXIgYWxsQ29sb3JzICAgPSB1dGlsLm1lcmdlKHt9LCBjc3MyQ29sb3JzLCBjc3MzQ29sb3JzKTtcbkNocm9tYXRoLmNvbG9ycyA9IHt9O1xuZm9yICh2YXIgY29sb3JOYW1lIGluIGFsbENvbG9ycykge1xuICAgIC8vIGUuZy4sIENocm9tYXRoLndoZWF0IGFuZCBDaHJvbWF0aC5jb2xvcnMud2hlYXRcbiAgICBDaHJvbWF0aFtjb2xvck5hbWVdID0gQ2hyb21hdGguY29sb3JzW2NvbG9yTmFtZV0gPSBuZXcgQ2hyb21hdGgoYWxsQ29sb3JzW2NvbG9yTmFtZV0pO1xufVxuLy8gYWRkIGEgcGFyc2VyIGZvciB0aGUgY29sb3IgbmFtZXNcbkNocm9tYXRoLnBhcnNlcnMucHVzaCh7XG4gICAgZXhhbXBsZTogWydyZWQnLCAnYnVybHl3b29kJ10sXG4gICAgcmVnZXg6IC9eW2Etel0rJC9pLFxuICAgIHByb2Nlc3M6IGZ1bmN0aW9uIChjb2xvck5hbWUpe1xuICAgICAgICBpZiAoQ2hyb21hdGguY29sb3JzW2NvbG9yTmFtZV0pIHJldHVybiBDaHJvbWF0aC5jb2xvcnNbY29sb3JOYW1lXTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDaHJvbWF0aDtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIC8vIGZyb20gaHR0cDovL3d3dy53My5vcmcvVFIvUkVDLWh0bWw0MC90eXBlcy5odG1sI2gtNi41XG4gICAgYXF1YSAgICA6IHtyOiAwLCAgIGc6IDI1NSwgYjogMjU1fSxcbiAgICBibGFjayAgIDoge3I6IDAsICAgZzogMCwgICBiOiAwfSxcbiAgICBibHVlICAgIDoge3I6IDAsICAgZzogMCwgICBiOiAyNTV9LFxuICAgIGZ1Y2hzaWEgOiB7cjogMjU1LCBnOiAwLCAgIGI6IDI1NX0sXG4gICAgZ3JheSAgICA6IHtyOiAxMjgsIGc6IDEyOCwgYjogMTI4fSxcbiAgICBncmVlbiAgIDoge3I6IDAsICAgZzogMTI4LCBiOiAwfSxcbiAgICBsaW1lICAgIDoge3I6IDAsICAgZzogMjU1LCBiOiAwfSxcbiAgICBtYXJvb24gIDoge3I6IDEyOCwgZzogMCwgICBiOiAwfSxcbiAgICBuYXZ5ICAgIDoge3I6IDAsICAgZzogMCwgICBiOiAxMjh9LFxuICAgIG9saXZlICAgOiB7cjogMTI4LCBnOiAxMjgsIGI6IDB9LFxuICAgIHB1cnBsZSAgOiB7cjogMTI4LCBnOiAwLCAgIGI6IDEyOH0sXG4gICAgcmVkICAgICA6IHtyOiAyNTUsIGc6IDAsICAgYjogMH0sXG4gICAgc2lsdmVyICA6IHtyOiAxOTIsIGc6IDE5MiwgYjogMTkyfSxcbiAgICB0ZWFsICAgIDoge3I6IDAsICAgZzogMTI4LCBiOiAxMjh9LFxuICAgIHdoaXRlICAgOiB7cjogMjU1LCBnOiAyNTUsIGI6IDI1NX0sXG4gICAgeWVsbG93ICA6IHtyOiAyNTUsIGc6IDI1NSwgYjogMH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9jc3MzLWNvbG9yLyNzdmctY29sb3JcbiAgICAvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9TVkcvdHlwZXMuaHRtbCNDb2xvcktleXdvcmRzXG4gICAgYWxpY2VibHVlICAgICAgICAgICAgOiB7cjogMjQwLCBnOiAyNDgsIGI6IDI1NX0sXG4gICAgYW50aXF1ZXdoaXRlICAgICAgICAgOiB7cjogMjUwLCBnOiAyMzUsIGI6IDIxNX0sXG4gICAgYXF1YW1hcmluZSAgICAgICAgICAgOiB7cjogMTI3LCBnOiAyNTUsIGI6IDIxMn0sXG4gICAgYXp1cmUgICAgICAgICAgICAgICAgOiB7cjogMjQwLCBnOiAyNTUsIGI6IDI1NX0sXG4gICAgYmVpZ2UgICAgICAgICAgICAgICAgOiB7cjogMjQ1LCBnOiAyNDUsIGI6IDIyMH0sXG4gICAgYmlzcXVlICAgICAgICAgICAgICAgOiB7cjogMjU1LCBnOiAyMjgsIGI6IDE5Nn0sXG4gICAgYmxhbmNoZWRhbG1vbmQgICAgICAgOiB7cjogMjU1LCBnOiAyMzUsIGI6IDIwNX0sXG4gICAgYmx1ZXZpb2xldCAgICAgICAgICAgOiB7cjogMTM4LCBnOiA0MywgIGI6IDIyNn0sXG4gICAgYnJvd24gICAgICAgICAgICAgICAgOiB7cjogMTY1LCBnOiA0MiwgIGI6IDQyfSxcbiAgICBidXJseXdvb2QgICAgICAgICAgICA6IHtyOiAyMjIsIGc6IDE4NCwgYjogMTM1fSxcbiAgICBjYWRldGJsdWUgICAgICAgICAgICA6IHtyOiA5NSwgIGc6IDE1OCwgYjogMTYwfSxcbiAgICBjaGFydHJldXNlICAgICAgICAgICA6IHtyOiAxMjcsIGc6IDI1NSwgYjogMH0sXG4gICAgY2hvY29sYXRlICAgICAgICAgICAgOiB7cjogMjEwLCBnOiAxMDUsIGI6IDMwfSxcbiAgICBjb3JhbCAgICAgICAgICAgICAgICA6IHtyOiAyNTUsIGc6IDEyNywgYjogODB9LFxuICAgIGNvcm5mbG93ZXJibHVlICAgICAgIDoge3I6IDEwMCwgZzogMTQ5LCBiOiAyMzd9LFxuICAgIGNvcm5zaWxrICAgICAgICAgICAgIDoge3I6IDI1NSwgZzogMjQ4LCBiOiAyMjB9LFxuICAgIGNyaW1zb24gICAgICAgICAgICAgIDoge3I6IDIyMCwgZzogMjAsICBiOiA2MH0sXG4gICAgY3lhbiAgICAgICAgICAgICAgICAgOiB7cjogMCwgICBnOiAyNTUsIGI6IDI1NX0sXG4gICAgZGFya2JsdWUgICAgICAgICAgICAgOiB7cjogMCwgICBnOiAwLCAgIGI6IDEzOX0sXG4gICAgZGFya2N5YW4gICAgICAgICAgICAgOiB7cjogMCwgICBnOiAxMzksIGI6IDEzOX0sXG4gICAgZGFya2dvbGRlbnJvZCAgICAgICAgOiB7cjogMTg0LCBnOiAxMzQsIGI6IDExfSxcbiAgICBkYXJrZ3JheSAgICAgICAgICAgICA6IHtyOiAxNjksIGc6IDE2OSwgYjogMTY5fSxcbiAgICBkYXJrZ3JlZW4gICAgICAgICAgICA6IHtyOiAwLCAgIGc6IDEwMCwgYjogMH0sXG4gICAgZGFya2dyZXkgICAgICAgICAgICAgOiB7cjogMTY5LCBnOiAxNjksIGI6IDE2OX0sXG4gICAgZGFya2toYWtpICAgICAgICAgICAgOiB7cjogMTg5LCBnOiAxODMsIGI6IDEwN30sXG4gICAgZGFya21hZ2VudGEgICAgICAgICAgOiB7cjogMTM5LCBnOiAwLCAgIGI6IDEzOX0sXG4gICAgZGFya29saXZlZ3JlZW4gICAgICAgOiB7cjogODUsICBnOiAxMDcsIGI6IDQ3fSxcbiAgICBkYXJrb3JhbmdlICAgICAgICAgICA6IHtyOiAyNTUsIGc6IDE0MCwgYjogMH0sXG4gICAgZGFya29yY2hpZCAgICAgICAgICAgOiB7cjogMTUzLCBnOiA1MCwgIGI6IDIwNH0sXG4gICAgZGFya3JlZCAgICAgICAgICAgICAgOiB7cjogMTM5LCBnOiAwLCAgIGI6IDB9LFxuICAgIGRhcmtzYWxtb24gICAgICAgICAgIDoge3I6IDIzMywgZzogMTUwLCBiOiAxMjJ9LFxuICAgIGRhcmtzZWFncmVlbiAgICAgICAgIDoge3I6IDE0MywgZzogMTg4LCBiOiAxNDN9LFxuICAgIGRhcmtzbGF0ZWJsdWUgICAgICAgIDoge3I6IDcyLCAgZzogNjEsICBiOiAxMzl9LFxuICAgIGRhcmtzbGF0ZWdyYXkgICAgICAgIDoge3I6IDQ3LCAgZzogNzksICBiOiA3OX0sXG4gICAgZGFya3NsYXRlZ3JleSAgICAgICAgOiB7cjogNDcsICBnOiA3OSwgIGI6IDc5fSxcbiAgICBkYXJrdHVycXVvaXNlICAgICAgICA6IHtyOiAwLCAgIGc6IDIwNiwgYjogMjA5fSxcbiAgICBkYXJrdmlvbGV0ICAgICAgICAgICA6IHtyOiAxNDgsIGc6IDAsICAgYjogMjExfSxcbiAgICBkZWVwcGluayAgICAgICAgICAgICA6IHtyOiAyNTUsIGc6IDIwLCAgYjogMTQ3fSxcbiAgICBkZWVwc2t5Ymx1ZSAgICAgICAgICA6IHtyOiAwLCAgIGc6IDE5MSwgYjogMjU1fSxcbiAgICBkaW1ncmF5ICAgICAgICAgICAgICA6IHtyOiAxMDUsIGc6IDEwNSwgYjogMTA1fSxcbiAgICBkaW1ncmV5ICAgICAgICAgICAgICA6IHtyOiAxMDUsIGc6IDEwNSwgYjogMTA1fSxcbiAgICBkb2RnZXJibHVlICAgICAgICAgICA6IHtyOiAzMCwgIGc6IDE0NCwgYjogMjU1fSxcbiAgICBmaXJlYnJpY2sgICAgICAgICAgICA6IHtyOiAxNzgsIGc6IDM0LCAgYjogMzR9LFxuICAgIGZsb3JhbHdoaXRlICAgICAgICAgIDoge3I6IDI1NSwgZzogMjUwLCBiOiAyNDB9LFxuICAgIGZvcmVzdGdyZWVuICAgICAgICAgIDoge3I6IDM0LCAgZzogMTM5LCBiOiAzNH0sXG4gICAgZ2FpbnNib3JvICAgICAgICAgICAgOiB7cjogMjIwLCBnOiAyMjAsIGI6IDIyMH0sXG4gICAgZ2hvc3R3aGl0ZSAgICAgICAgICAgOiB7cjogMjQ4LCBnOiAyNDgsIGI6IDI1NX0sXG4gICAgZ29sZCAgICAgICAgICAgICAgICAgOiB7cjogMjU1LCBnOiAyMTUsIGI6IDB9LFxuICAgIGdvbGRlbnJvZCAgICAgICAgICAgIDoge3I6IDIxOCwgZzogMTY1LCBiOiAzMn0sXG4gICAgZ3JlZW55ZWxsb3cgICAgICAgICAgOiB7cjogMTczLCBnOiAyNTUsIGI6IDQ3fSxcbiAgICBncmV5ICAgICAgICAgICAgICAgICA6IHtyOiAxMjgsIGc6IDEyOCwgYjogMTI4fSxcbiAgICBob25leWRldyAgICAgICAgICAgICA6IHtyOiAyNDAsIGc6IDI1NSwgYjogMjQwfSxcbiAgICBob3RwaW5rICAgICAgICAgICAgICA6IHtyOiAyNTUsIGc6IDEwNSwgYjogMTgwfSxcbiAgICBpbmRpYW5yZWQgICAgICAgICAgICA6IHtyOiAyMDUsIGc6IDkyLCAgYjogOTJ9LFxuICAgIGluZGlnbyAgICAgICAgICAgICAgIDoge3I6IDc1LCAgZzogMCwgICBiOiAxMzB9LFxuICAgIGl2b3J5ICAgICAgICAgICAgICAgIDoge3I6IDI1NSwgZzogMjU1LCBiOiAyNDB9LFxuICAgIGtoYWtpICAgICAgICAgICAgICAgIDoge3I6IDI0MCwgZzogMjMwLCBiOiAxNDB9LFxuICAgIGxhdmVuZGVyICAgICAgICAgICAgIDoge3I6IDIzMCwgZzogMjMwLCBiOiAyNTB9LFxuICAgIGxhdmVuZGVyYmx1c2ggICAgICAgIDoge3I6IDI1NSwgZzogMjQwLCBiOiAyNDV9LFxuICAgIGxhd25ncmVlbiAgICAgICAgICAgIDoge3I6IDEyNCwgZzogMjUyLCBiOiAwfSxcbiAgICBsZW1vbmNoaWZmb24gICAgICAgICA6IHtyOiAyNTUsIGc6IDI1MCwgYjogMjA1fSxcbiAgICBsaWdodGJsdWUgICAgICAgICAgICA6IHtyOiAxNzMsIGc6IDIxNiwgYjogMjMwfSxcbiAgICBsaWdodGNvcmFsICAgICAgICAgICA6IHtyOiAyNDAsIGc6IDEyOCwgYjogMTI4fSxcbiAgICBsaWdodGN5YW4gICAgICAgICAgICA6IHtyOiAyMjQsIGc6IDI1NSwgYjogMjU1fSxcbiAgICBsaWdodGdvbGRlbnJvZHllbGxvdyA6IHtyOiAyNTAsIGc6IDI1MCwgYjogMjEwfSxcbiAgICBsaWdodGdyYXkgICAgICAgICAgICA6IHtyOiAyMTEsIGc6IDIxMSwgYjogMjExfSxcbiAgICBsaWdodGdyZWVuICAgICAgICAgICA6IHtyOiAxNDQsIGc6IDIzOCwgYjogMTQ0fSxcbiAgICBsaWdodGdyZXkgICAgICAgICAgICA6IHtyOiAyMTEsIGc6IDIxMSwgYjogMjExfSxcbiAgICBsaWdodHBpbmsgICAgICAgICAgICA6IHtyOiAyNTUsIGc6IDE4MiwgYjogMTkzfSxcbiAgICBsaWdodHNhbG1vbiAgICAgICAgICA6IHtyOiAyNTUsIGc6IDE2MCwgYjogMTIyfSxcbiAgICBsaWdodHNlYWdyZWVuICAgICAgICA6IHtyOiAzMiwgIGc6IDE3OCwgYjogMTcwfSxcbiAgICBsaWdodHNreWJsdWUgICAgICAgICA6IHtyOiAxMzUsIGc6IDIwNiwgYjogMjUwfSxcbiAgICBsaWdodHNsYXRlZ3JheSAgICAgICA6IHtyOiAxMTksIGc6IDEzNiwgYjogMTUzfSxcbiAgICBsaWdodHNsYXRlZ3JleSAgICAgICA6IHtyOiAxMTksIGc6IDEzNiwgYjogMTUzfSxcbiAgICBsaWdodHN0ZWVsYmx1ZSAgICAgICA6IHtyOiAxNzYsIGc6IDE5NiwgYjogMjIyfSxcbiAgICBsaWdodHllbGxvdyAgICAgICAgICA6IHtyOiAyNTUsIGc6IDI1NSwgYjogMjI0fSxcbiAgICBsaW1lZ3JlZW4gICAgICAgICAgICA6IHtyOiA1MCwgIGc6IDIwNSwgYjogNTB9LFxuICAgIGxpbmVuICAgICAgICAgICAgICAgIDoge3I6IDI1MCwgZzogMjQwLCBiOiAyMzB9LFxuICAgIG1hZ2VudGEgICAgICAgICAgICAgIDoge3I6IDI1NSwgZzogMCwgICBiOiAyNTV9LFxuICAgIG1lZGl1bWFxdWFtYXJpbmUgICAgIDoge3I6IDEwMiwgZzogMjA1LCBiOiAxNzB9LFxuICAgIG1lZGl1bWJsdWUgICAgICAgICAgIDoge3I6IDAsICAgZzogMCwgICBiOiAyMDV9LFxuICAgIG1lZGl1bW9yY2hpZCAgICAgICAgIDoge3I6IDE4NiwgZzogODUsICBiOiAyMTF9LFxuICAgIG1lZGl1bXB1cnBsZSAgICAgICAgIDoge3I6IDE0NywgZzogMTEyLCBiOiAyMTl9LFxuICAgIG1lZGl1bXNlYWdyZWVuICAgICAgIDoge3I6IDYwLCAgZzogMTc5LCBiOiAxMTN9LFxuICAgIG1lZGl1bXNsYXRlYmx1ZSAgICAgIDoge3I6IDEyMywgZzogMTA0LCBiOiAyMzh9LFxuICAgIG1lZGl1bXNwcmluZ2dyZWVuICAgIDoge3I6IDAsICAgZzogMjUwLCBiOiAxNTR9LFxuICAgIG1lZGl1bXR1cnF1b2lzZSAgICAgIDoge3I6IDcyLCAgZzogMjA5LCBiOiAyMDR9LFxuICAgIG1lZGl1bXZpb2xldHJlZCAgICAgIDoge3I6IDE5OSwgZzogMjEsICBiOiAxMzN9LFxuICAgIG1pZG5pZ2h0Ymx1ZSAgICAgICAgIDoge3I6IDI1LCAgZzogMjUsICBiOiAxMTJ9LFxuICAgIG1pbnRjcmVhbSAgICAgICAgICAgIDoge3I6IDI0NSwgZzogMjU1LCBiOiAyNTB9LFxuICAgIG1pc3R5cm9zZSAgICAgICAgICAgIDoge3I6IDI1NSwgZzogMjI4LCBiOiAyMjV9LFxuICAgIG1vY2Nhc2luICAgICAgICAgICAgIDoge3I6IDI1NSwgZzogMjI4LCBiOiAxODF9LFxuICAgIG5hdmFqb3doaXRlICAgICAgICAgIDoge3I6IDI1NSwgZzogMjIyLCBiOiAxNzN9LFxuICAgIG9sZGxhY2UgICAgICAgICAgICAgIDoge3I6IDI1MywgZzogMjQ1LCBiOiAyMzB9LFxuICAgIG9saXZlZHJhYiAgICAgICAgICAgIDoge3I6IDEwNywgZzogMTQyLCBiOiAzNX0sXG4gICAgb3JhbmdlICAgICAgICAgICAgICAgOiB7cjogMjU1LCBnOiAxNjUsIGI6IDB9LFxuICAgIG9yYW5nZXJlZCAgICAgICAgICAgIDoge3I6IDI1NSwgZzogNjksICBiOiAwfSxcbiAgICBvcmNoaWQgICAgICAgICAgICAgICA6IHtyOiAyMTgsIGc6IDExMiwgYjogMjE0fSxcbiAgICBwYWxlZ29sZGVucm9kICAgICAgICA6IHtyOiAyMzgsIGc6IDIzMiwgYjogMTcwfSxcbiAgICBwYWxlZ3JlZW4gICAgICAgICAgICA6IHtyOiAxNTIsIGc6IDI1MSwgYjogMTUyfSxcbiAgICBwYWxldHVycXVvaXNlICAgICAgICA6IHtyOiAxNzUsIGc6IDIzOCwgYjogMjM4fSxcbiAgICBwYWxldmlvbGV0cmVkICAgICAgICA6IHtyOiAyMTksIGc6IDExMiwgYjogMTQ3fSxcbiAgICBwYXBheWF3aGlwICAgICAgICAgICA6IHtyOiAyNTUsIGc6IDIzOSwgYjogMjEzfSxcbiAgICBwZWFjaHB1ZmYgICAgICAgICAgICA6IHtyOiAyNTUsIGc6IDIxOCwgYjogMTg1fSxcbiAgICBwZXJ1ICAgICAgICAgICAgICAgICA6IHtyOiAyMDUsIGc6IDEzMywgYjogNjN9LFxuICAgIHBpbmsgICAgICAgICAgICAgICAgIDoge3I6IDI1NSwgZzogMTkyLCBiOiAyMDN9LFxuICAgIHBsdW0gICAgICAgICAgICAgICAgIDoge3I6IDIyMSwgZzogMTYwLCBiOiAyMjF9LFxuICAgIHBvd2RlcmJsdWUgICAgICAgICAgIDoge3I6IDE3NiwgZzogMjI0LCBiOiAyMzB9LFxuICAgIHJvc3licm93biAgICAgICAgICAgIDoge3I6IDE4OCwgZzogMTQzLCBiOiAxNDN9LFxuICAgIHJveWFsYmx1ZSAgICAgICAgICAgIDoge3I6IDY1LCAgZzogMTA1LCBiOiAyMjV9LFxuICAgIHNhZGRsZWJyb3duICAgICAgICAgIDoge3I6IDEzOSwgZzogNjksICBiOiAxOX0sXG4gICAgc2FsbW9uICAgICAgICAgICAgICAgOiB7cjogMjUwLCBnOiAxMjgsIGI6IDExNH0sXG4gICAgc2FuZHlicm93biAgICAgICAgICAgOiB7cjogMjQ0LCBnOiAxNjQsIGI6IDk2fSxcbiAgICBzZWFncmVlbiAgICAgICAgICAgICA6IHtyOiA0NiwgIGc6IDEzOSwgYjogODd9LFxuICAgIHNlYXNoZWxsICAgICAgICAgICAgIDoge3I6IDI1NSwgZzogMjQ1LCBiOiAyMzh9LFxuICAgIHNpZW5uYSAgICAgICAgICAgICAgIDoge3I6IDE2MCwgZzogODIsICBiOiA0NX0sXG4gICAgc2t5Ymx1ZSAgICAgICAgICAgICAgOiB7cjogMTM1LCBnOiAyMDYsIGI6IDIzNX0sXG4gICAgc2xhdGVibHVlICAgICAgICAgICAgOiB7cjogMTA2LCBnOiA5MCwgIGI6IDIwNX0sXG4gICAgc2xhdGVncmF5ICAgICAgICAgICAgOiB7cjogMTEyLCBnOiAxMjgsIGI6IDE0NH0sXG4gICAgc2xhdGVncmV5ICAgICAgICAgICAgOiB7cjogMTEyLCBnOiAxMjgsIGI6IDE0NH0sXG4gICAgc25vdyAgICAgICAgICAgICAgICAgOiB7cjogMjU1LCBnOiAyNTAsIGI6IDI1MH0sXG4gICAgc3ByaW5nZ3JlZW4gICAgICAgICAgOiB7cjogMCwgICBnOiAyNTUsIGI6IDEyN30sXG4gICAgc3RlZWxibHVlICAgICAgICAgICAgOiB7cjogNzAsICBnOiAxMzAsIGI6IDE4MH0sXG4gICAgdGFuICAgICAgICAgICAgICAgICAgOiB7cjogMjEwLCBnOiAxODAsIGI6IDE0MH0sXG4gICAgdGhpc3RsZSAgICAgICAgICAgICAgOiB7cjogMjE2LCBnOiAxOTEsIGI6IDIxNn0sXG4gICAgdG9tYXRvICAgICAgICAgICAgICAgOiB7cjogMjU1LCBnOiA5OSwgIGI6IDcxfSxcbiAgICB0dXJxdW9pc2UgICAgICAgICAgICA6IHtyOiA2NCwgIGc6IDIyNCwgYjogMjA4fSxcbiAgICB2aW9sZXQgICAgICAgICAgICAgICA6IHtyOiAyMzgsIGc6IDEzMCwgYjogMjM4fSxcbiAgICB3aGVhdCAgICAgICAgICAgICAgICA6IHtyOiAyNDUsIGc6IDIyMiwgYjogMTc5fSxcbiAgICB3aGl0ZXNtb2tlICAgICAgICAgICA6IHtyOiAyNDUsIGc6IDI0NSwgYjogMjQ1fSxcbiAgICB5ZWxsb3dncmVlbiAgICAgICAgICA6IHtyOiAxNTQsIGc6IDIwNSwgYjogNTB9XG59XG4iLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBwYXJzZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIGV4YW1wbGU6IFszNTU0NDMxLCAxNjgwOTk4NF0sXG4gICAgICAgICAgICByZWdleDogL15cXGQrJC8sXG4gICAgICAgICAgICBwcm9jZXNzOiBmdW5jdGlvbiAoY29sb3Ipe1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIC8vYTogY29sb3IgPj4gMjQgJiAyNTUsXG4gICAgICAgICAgICAgICAgICAgIHI6IGNvbG9yID4+IDE2ICYgMjU1LFxuICAgICAgICAgICAgICAgICAgICBnOiBjb2xvciA+PiA4ICYgMjU1LFxuICAgICAgICAgICAgICAgICAgICBiOiBjb2xvciAmIDI1NVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAge1xuICAgICAgICAgICAgZXhhbXBsZTogWycjZmIwJywgJ2YwZiddLFxuICAgICAgICAgICAgcmVnZXg6IC9eIz8oW1xcZEEtRl17MX0pKFtcXGRBLUZdezF9KShbXFxkQS1GXXsxfSkkL2ksXG4gICAgICAgICAgICBwcm9jZXNzOiBmdW5jdGlvbiAoaGV4LCByLCBnLCBiKXtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICByOiBwYXJzZUludChyICsgciwgMTYpLFxuICAgICAgICAgICAgICAgICAgICBnOiBwYXJzZUludChnICsgZywgMTYpLFxuICAgICAgICAgICAgICAgICAgICBiOiBwYXJzZUludChiICsgYiwgMTYpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICB7XG4gICAgICAgICAgICBleGFtcGxlOiBbJyMwMGZmMDAnLCAnMzM2Njk5J10sXG4gICAgICAgICAgICByZWdleDogL14jPyhbXFxkQS1GXXsyfSkoW1xcZEEtRl17Mn0pKFtcXGRBLUZdezJ9KSQvaSxcbiAgICAgICAgICAgIHByb2Nlc3M6IGZ1bmN0aW9uIChoZXgsIHIsIGcsIGIpe1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHI6IHBhcnNlSW50KHIsIDE2KSxcbiAgICAgICAgICAgICAgICAgICAgZzogcGFyc2VJbnQoZywgMTYpLFxuICAgICAgICAgICAgICAgICAgICBiOiBwYXJzZUludChiLCAxNilcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHtcbiAgICAgICAgICAgIGV4YW1wbGU6IFsncmdiKDEyMywgMjM0LCA0NSknLCAncmdiKDI1LCA1MCUsIDEwMCUpJywgJ3JnYmEoMTIlLCAzNCwgNTYlLCAwLjc4KSddLFxuICAgICAgICAgICAgLy8gcmVnZXg6IC9ecmdiYSpcXCgoXFxkezEsM31cXCUqKSxcXHMqKFxcZHsxLDN9XFwlKiksXFxzKihcXGR7MSwzfVxcJSopKD86LFxccyooWzAtOS5dKykpP1xcKS8sXG4gICAgICAgICAgICByZWdleDogL15yZ2JhKlxcKChbMC05XSpcXC4/WzAtOV0rXFwlKiksXFxzKihbMC05XSpcXC4/WzAtOV0rXFwlKiksXFxzKihbMC05XSpcXC4/WzAtOV0rXFwlKikoPzosXFxzKihbMC05Ll0rKSk/XFwpLyxcbiAgICAgICAgICAgIHByb2Nlc3M6IGZ1bmN0aW9uIChzLHIsZyxiLGEpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgciA9IHIgJiYgci5zbGljZSgtMSkgPT0gJyUnID8gKHIuc2xpY2UoMCwtMSkgLyAxMDApIDogcioxO1xuICAgICAgICAgICAgICAgIGcgPSBnICYmIGcuc2xpY2UoLTEpID09ICclJyA/IChnLnNsaWNlKDAsLTEpIC8gMTAwKSA6IGcqMTtcbiAgICAgICAgICAgICAgICBiID0gYiAmJiBiLnNsaWNlKC0xKSA9PSAnJScgPyAoYi5zbGljZSgwLC0xKSAvIDEwMCkgOiBiKjE7XG4gICAgICAgICAgICAgICAgYSA9IGEqMTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHI6IHV0aWwuY2xhbXAociwgMCwgMjU1KSxcbiAgICAgICAgICAgICAgICAgICAgZzogdXRpbC5jbGFtcChnLCAwLCAyNTUpLFxuICAgICAgICAgICAgICAgICAgICBiOiB1dGlsLmNsYW1wKGIsIDAsIDI1NSksXG4gICAgICAgICAgICAgICAgICAgIGE6IHV0aWwuY2xhbXAoYSwgMCwgMSkgfHwgdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICB7XG4gICAgICAgICAgICBleGFtcGxlOiBbJ2hzbCgxMjMsIDM0JSwgNDUlKScsICdoc2xhKDI1LCA1MCUsIDEwMCUsIDAuNzUpJywgJ2hzdigxMiwgMzQlLCA1NiUpJ10sXG4gICAgICAgICAgICByZWdleDogL15ocyhbYnZsXSlhKlxcKChcXGR7MSwzfVxcJSopLFxccyooXFxkezEsM31cXCUqKSxcXHMqKFxcZHsxLDN9XFwlKikoPzosXFxzKihbMC05Ll0rKSk/XFwpLyxcbiAgICAgICAgICAgIHByb2Nlc3M6IGZ1bmN0aW9uIChjLGx2LGgscyxsLGEpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaCAqPSAxO1xuICAgICAgICAgICAgICAgIHMgPSBzLnNsaWNlKDAsLTEpIC8gMTAwO1xuICAgICAgICAgICAgICAgIGwgPSBsLnNsaWNlKDAsLTEpIC8gMTAwO1xuICAgICAgICAgICAgICAgIGEgKj0gMTtcblxuICAgICAgICAgICAgICAgIHZhciBvYmogPSB7XG4gICAgICAgICAgICAgICAgICAgIGg6IHV0aWwuY2xhbXAoaCwgMCwgMzYwKSxcbiAgICAgICAgICAgICAgICAgICAgYTogdXRpbC5jbGFtcChsLCAwLCAxKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgLy8gYHNgIGlzIHVzZWQgaW4gbWFueSBkaWZmZXJlbnQgc3BhY2VzIChIU0wsIEhTViwgSFNCKVxuICAgICAgICAgICAgICAgIC8vIHNvIHdlIHVzZSBgc2xgLCBgc3ZgIGFuZCBgc2JgIHRvIGRpZmZlcmVudGlhdGVcbiAgICAgICAgICAgICAgICBvYmpbJ3MnK2x2XSA9IHV0aWwuY2xhbXAocywgMCwgMSksXG4gICAgICAgICAgICAgICAgb2JqW2x2XSA9IHV0aWwuY2xhbXAobCwgMCwgMSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgXVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gQ2hyb21hdGhQcm90b3R5cGUoQ2hyb21hdGgpIHtcbiAgcmV0dXJuIHtcbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IHRvTmFtZVxuICAgICAgICAgQ2FsbCA8Q2hyb21hdGgudG9OYW1lPiBvbiB0aGUgY3VycmVudCBpbnN0YW5jZVxuICAgICAgICAgPiA+IHZhciBjb2xvciA9IG5ldyBDaHJvbWF0aCgncmdiKDE3MywgMjE2LCAyMzApJyk7XG4gICAgICAgICA+ID4gY29sb3IudG9OYW1lKCk7XG4gICAgICAgICA+IFwibGlnaHRibHVlXCJcbiAgICAgICovXG4gICAgICB0b05hbWU6IGZ1bmN0aW9uICgpeyByZXR1cm4gQ2hyb21hdGgudG9OYW1lKHRoaXMpOyB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiB0b1N0cmluZ1xuICAgICAgICAgRGlzcGxheSB0aGUgaW5zdGFuY2UgYXMgYSBzdHJpbmcuIERlZmF1bHRzIHRvIDxDaHJvbWF0aC50b0hleFN0cmluZz5cbiAgICAgICAgID4gPiB2YXIgY29sb3IgPSBDaHJvbWF0aC5yZ2IoNTYsIDc4LCA5MCk7XG4gICAgICAgICA+ID4gQ29sb3IudG9IZXhTdHJpbmcoKTtcbiAgICAgICAgID4gXCIjMzg0RTVBXCJcbiAgICAgICovXG4gICAgICB0b1N0cmluZzogZnVuY3Rpb24gKCl7IHJldHVybiB0aGlzLnRvSGV4U3RyaW5nKCk7IH0sXG5cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IHZhbHVlT2ZcbiAgICAgICAgIERpc3BsYXkgdGhlIGluc3RhbmNlIGFzIGFuIGludGVnZXIuIERlZmF1bHRzIHRvIDxDaHJvbWF0aC50b0ludGVnZXI+XG4gICAgICAgICA+ID4gdmFyIHllbGxvdyA9IG5ldyBDaHJvbWF0aCgneWVsbG93Jyk7XG4gICAgICAgICA+ID4geWVsbG93LnZhbHVlT2YoKTtcbiAgICAgICAgID4gMTY3NzY5NjBcbiAgICAgICAgID4gPiAreWVsbG93XG4gICAgICAgICA+IDE2Nzc2OTYwXG4gICAgICAqL1xuICAgICAgdmFsdWVPZjogZnVuY3Rpb24gKCl7IHJldHVybiBDaHJvbWF0aC50b0ludGVnZXIodGhpcyk7IH0sXG5cbiAgICAvKlxuICAgICAgIE1ldGhvZDogcmdiXG4gICAgICAgUmV0dXJuIHRoZSBSR0IgYXJyYXkgb2YgdGhlIGluc3RhbmNlXG4gICAgICAgPiA+IG5ldyBDaHJvbWF0aCgncmVkJykucmdiKCk7XG4gICAgICAgPiBbMjU1LCAwLCAwXVxuICAgICovXG4gICAgICByZ2I6IGZ1bmN0aW9uICgpeyByZXR1cm4gdGhpcy50b1JHQkFycmF5KCk7IH0sXG5cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IHRvUkdCQXJyYXlcbiAgICAgICAgIFJldHVybiB0aGUgUkdCIGFycmF5IG9mIHRoZSBpbnN0YW5jZVxuICAgICAgICAgPiA+IENocm9tYXRoLmJ1cmx5d29vZC50b1JHQkFycmF5KCk7XG4gICAgICAgICA+IFsyNTUsIDE4NCwgMTM1XVxuICAgICAgKi9cbiAgICAgIHRvUkdCQXJyYXk6IGZ1bmN0aW9uICgpeyByZXR1cm4gdGhpcy50b1JHQkFBcnJheSgpLnNsaWNlKDAsMyk7IH0sXG5cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IHRvUkdCT2JqZWN0XG4gICAgICAgICBSZXR1cm4gdGhlIFJHQiBvYmplY3Qgb2YgdGhlIGluc3RhbmNlXG4gICAgICAgICA+ID4gbmV3IENocm9tYXRoKCdidXJseXdvb2QnKS50b1JHQk9iamVjdCgpO1xuICAgICAgICAgPiB7cjogMjU1LCBnOiAxODQsIGI6IDEzNX1cbiAgICAgICovXG4gICAgICB0b1JHQk9iamVjdDogZnVuY3Rpb24gKClcbiAgICAgIHtcbiAgICAgICAgICB2YXIgcmdiID0gdGhpcy50b1JHQkFycmF5KCk7XG5cbiAgICAgICAgICByZXR1cm4ge3I6IHJnYlswXSwgZzogcmdiWzFdLCBiOiByZ2JbMl19O1xuICAgICAgfSxcblxuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogdG9SR0JTdHJpbmdcbiAgICAgICAgIFJldHVybiB0aGUgUkdCIHN0cmluZyBvZiB0aGUgaW5zdGFuY2VcbiAgICAgICAgID4gPiBuZXcgQ2hyb21hdGgoJ2FsaWNlYmx1ZScpLnRvUkdCU3RyaW5nKCk7XG4gICAgICAgICA+IFwicmdiKDI0MCwyNDgsMjU1KVwiXG4gICAgICAqL1xuICAgICAgdG9SR0JTdHJpbmc6IGZ1bmN0aW9uICgpXG4gICAgICB7XG4gICAgICAgICAgcmV0dXJuIFwicmdiKFwiKyB0aGlzLnRvUkdCQXJyYXkoKS5qb2luKFwiLFwiKSArXCIpXCI7XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiByZ2JhXG4gICAgICAgICBSZXR1cm4gdGhlIFJHQkEgYXJyYXkgb2YgdGhlIGluc3RhbmNlXG4gICAgICAgICA+ID4gbmV3IENocm9tYXRoKCdyZWQnKS5yZ2JhKCk7XG4gICAgICAgICA+IFsyNTUsIDAsIDAsIDFdXG4gICAgICAqL1xuICAgICAgcmdiYTogZnVuY3Rpb24gKCl7IHJldHVybiB0aGlzLnRvUkdCQUFycmF5KCk7IH0sXG5cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IHRvUkdCQUFycmF5XG4gICAgICAgICBSZXR1cm4gdGhlIFJHQkEgYXJyYXkgb2YgdGhlIGluc3RhbmNlXG4gICAgICAgICA+ID4gQ2hyb21hdGgubGltZS50b1JHQkFBcnJheSgpO1xuICAgICAgICAgPiBbMCwgMjU1LCAwLCAxXVxuICAgICAgKi9cbiAgICAgIHRvUkdCQUFycmF5OiBmdW5jdGlvbiAoKVxuICAgICAge1xuICAgICAgICAgIHZhciByZ2JhID0gW1xuICAgICAgICAgICAgICBNYXRoLnJvdW5kKHRoaXMucioyNTUpLFxuICAgICAgICAgICAgICBNYXRoLnJvdW5kKHRoaXMuZyoyNTUpLFxuICAgICAgICAgICAgICBNYXRoLnJvdW5kKHRoaXMuYioyNTUpLFxuICAgICAgICAgICAgICBwYXJzZUZsb2F0KHRoaXMuYSlcbiAgICAgICAgICBdO1xuXG4gICAgICAgICAgcmV0dXJuIHJnYmE7XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiB0b1JHQkFPYmplY3RcbiAgICAgICAgIFJldHVybiB0aGUgUkdCQSBvYmplY3Qgb2YgdGhlIGluc3RhbmNlXG4gICAgICAgICA+ID4gQ2hyb21hdGguY2FkZXRibHVlLnRvUkdCQU9iamVjdCgpO1xuICAgICAgICAgPiB7cjogOTUsIGc6IDE1OCwgYjogMTYwfVxuICAgICAgKi9cbiAgICAgIHRvUkdCQU9iamVjdDogZnVuY3Rpb24gKClcbiAgICAgIHtcbiAgICAgICAgICB2YXIgcmdiYSA9IHRoaXMudG9SR0JBQXJyYXkoKTtcblxuICAgICAgICAgIHJldHVybiB7cjogcmdiYVswXSwgZzogcmdiYVsxXSwgYjogcmdiYVsyXSwgYTogcmdiYVszXX07XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiB0b1JHQkFTdHJpbmdcbiAgICAgICAgIFJldHVybiB0aGUgUkdCQSBzdHJpbmcgb2YgdGhlIGluc3RhbmNlXG4gICAgICAgICA+ID4gbmV3IENocm9tYXRoKCdkYXJrYmx1ZScpLnRvUkdCQVN0cmluZygpO1xuICAgICAgICAgPiBcInJnYmEoMCwwLDEzOSwxKVwiXG4gICAgICAqL1xuICAgICAgdG9SR0JBU3RyaW5nOiBmdW5jdGlvbiAoKXtcbiAgICAgICAgICByZXR1cm4gXCJyZ2JhKFwiKyB0aGlzLnRvUkdCQUFycmF5KCkuam9pbihcIixcIikgK1wiKVwiO1xuICAgICAgfSxcblxuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogaGV4XG4gICAgICAgICBSZXR1cm4gdGhlIGhleCBhcnJheSBvZiB0aGUgaW5zdGFuY2VcbiAgICAgICAgID4gbmV3IENocm9tYXRoKCdkYXJrZ3JlZW4nKS5oZXgoKVxuICAgICAgICAgWyAnMDAnLCAnNjQnLCAnMDAnIF1cbiAgICAgICovXG4gICAgICBoZXg6IGZ1bmN0aW9uICgpeyByZXR1cm4gdGhpcy50b0hleEFycmF5KCk7IH0sXG5cbiAgICAgIC8qXG4gICAgICAgIE1ldGhvZDogdG9IZXhBcnJheVxuICAgICAgICAgUmV0dXJuIHRoZSBoZXggYXJyYXkgb2YgdGhlIGluc3RhbmNlXG4gICAgICAgID4gPiBDaHJvbWF0aC5maXJlYnJpY2sudG9IZXhBcnJheSgpO1xuICAgICAgICA+IFtcIkIyXCIsIFwiMjJcIiwgXCIyMlwiXVxuICAgICAgKi9cbiAgICAgIHRvSGV4QXJyYXk6IGZ1bmN0aW9uICgpe1xuICAgICAgICAgIHJldHVybiBDaHJvbWF0aC5yZ2IyaGV4KHRoaXMuciwgdGhpcy5nLCB0aGlzLmIpO1xuICAgICAgfSxcblxuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogdG9IZXhPYmplY3RcbiAgICAgICAgIFJldHVybiB0aGUgaGV4IG9iamVjdCBvZiB0aGUgaW5zdGFuY2VcbiAgICAgICAgID4gPiBDaHJvbWF0aC5nYWluc2Jvcm8udG9IZXhPYmplY3QoKTtcbiAgICAgICAgID4ge3I6IFwiRENcIiwgZzogXCJEQ1wiLCBiOiBcIkRDXCJ9XG4gICAgICAqL1xuICAgICAgdG9IZXhPYmplY3Q6IGZ1bmN0aW9uICgpXG4gICAgICB7XG4gICAgICAgICAgdmFyIGhleCA9IHRoaXMudG9IZXhBcnJheSgpO1xuXG4gICAgICAgICAgcmV0dXJuIHsgcjogaGV4WzBdLCBnOiBoZXhbMV0sIGI6IGhleFsyXSB9O1xuICAgICAgfSxcblxuICAgICAgLypcbiAgICAgICAgTWV0aG9kOiB0b0hleFN0cmluZ1xuICAgICAgICAgUmV0dXJuIHRoZSBoZXggc3RyaW5nIG9mIHRoZSBpbnN0YW5jZVxuICAgICAgICA+ID4gQ2hyb21hdGguaG9uZXlkZXcudG9IZXhTdHJpbmcoKTtcbiAgICAgICAgPiBcIiNGMEZGRjBcIlxuICAgICAgKi9cbiAgICAgIHRvSGV4U3RyaW5nOiBmdW5jdGlvbiAoKXtcbiAgICAgICAgICB2YXIgaGV4ID0gdGhpcy50b0hleEFycmF5KCk7XG5cbiAgICAgICAgICByZXR1cm4gJyMnICsgaGV4LmpvaW4oJycpO1xuICAgICAgfSxcblxuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogaHNsXG4gICAgICAgICBSZXR1cm4gdGhlIEhTTCBhcnJheSBvZiB0aGUgaW5zdGFuY2VcbiAgICAgICAgID4gPm5ldyBDaHJvbWF0aCgnZ3JlZW4nKS5oc2woKTtcbiAgICAgICAgID4gWzEyMCwgMSwgMC4yNTA5ODAzOTIxNTY4NjI3NF1cbiAgICAgICovXG4gICAgICBoc2w6IGZ1bmN0aW9uICgpeyByZXR1cm4gdGhpcy50b0hTTEFycmF5KCk7IH0sXG5cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IHRvSFNMQXJyYXlcbiAgICAgICAgIFJldHVybiB0aGUgSFNMIGFycmF5IG9mIHRoZSBpbnN0YW5jZVxuICAgICAgICAgPiA+IG5ldyBDaHJvbWF0aCgncmVkJykudG9IU0xBcnJheSgpO1xuICAgICAgICAgPiBbMCwgMSwgMC41XVxuICAgICAgKi9cbiAgICAgIHRvSFNMQXJyYXk6IGZ1bmN0aW9uICgpe1xuICAgICAgICAgIHJldHVybiB0aGlzLnRvSFNMQUFycmF5KCkuc2xpY2UoMCwzKTtcbiAgICAgIH0sXG5cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IHRvSFNMT2JqZWN0XG4gICAgICAgICBSZXR1cm4gdGhlIEhTTCBvYmplY3Qgb2YgdGhlIGluc3RhbmNlXG4gICAgICAgICA+ID4gbmV3IENocm9tYXRoKCdyZWQnKS50b0hTTE9iamVjdCgpO1xuICAgICAgICAgW2g6MCwgczoxLCBsOjAuNV1cbiAgICAgICovXG4gICAgICB0b0hTTE9iamVjdDogZnVuY3Rpb24gKClcbiAgICAgIHtcbiAgICAgICAgICB2YXIgaHNsID0gdGhpcy50b0hTTEFycmF5KCk7XG5cbiAgICAgICAgICByZXR1cm4ge2g6IGhzbFswXSwgczogaHNsWzFdLCBsOiBoc2xbMl19O1xuICAgICAgfSxcblxuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogdG9IU0xTdHJpbmdcbiAgICAgICAgIFJldHVybiB0aGUgSFNMIHN0cmluZyBvZiB0aGUgaW5zdGFuY2VcbiAgICAgICAgID4gPiBuZXcgQ2hyb21hdGgoJ3JlZCcpLnRvSFNMU3RyaW5nKCk7XG4gICAgICAgICA+IFwiaHNsKDAsMSwwLjUpXCJcbiAgICAgICovXG4gICAgICB0b0hTTFN0cmluZzogZnVuY3Rpb24gKCl7XG4gICAgICAgICAgdmFyIGhzbGEgPSB0aGlzLnRvSFNMQUFycmF5KCk7XG4gICAgICAgICAgdmFyIHZhbHMgPSBbXG4gICAgICAgICAgICAgIGhzbGFbMF0sXG4gICAgICAgICAgICAgIE1hdGgucm91bmQoaHNsYVsxXSoxMDApKyclJyxcbiAgICAgICAgICAgICAgTWF0aC5yb3VuZChoc2xhWzJdKjEwMCkrJyUnXG4gICAgICAgICAgXTtcblxuICAgICAgICAgIHJldHVybiAnaHNsKCcrIHZhbHMgKycpJztcbiAgICAgIH0sXG5cbiAgICAgIC8qXG4gICAgICAgIE1ldGhvZDogaHNsYVxuICAgICAgICBSZXR1cm4gdGhlIEhTTEEgYXJyYXkgb2YgdGhlIGluc3RhbmNlXG4gICAgICAgID4gPiBuZXcgQ2hyb21hdGgoJ2dyZWVuJykuaHNsYSgpO1xuICAgICAgICA+IFsxMjAsIDEsIDAuMjUwOTgwMzkyMTU2ODYyNzQsIDFdXG4gICAgICAqL1xuICAgICAgaHNsYTogZnVuY3Rpb24gKCl7IHJldHVybiB0aGlzLnRvSFNMQUFycmF5KCk7IH0sXG5cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IHRvSFNMQXJyYXlcbiAgICAgICAgIFJldHVybiB0aGUgSFNMQSBhcnJheSBvZiB0aGUgaW5zdGFuY2VcbiAgICAgICAgID4gPiBDaHJvbWF0aC5hbnRpcXVld2hpdGUudG9IU0xBQXJyYXkoKTtcbiAgICAgICAgID4gWzM0LCAwLjc3Nzc3Nzc3Nzc3Nzc3NzMsIDAuOTExNzY0NzA1ODgyMzUyOSwgMV1cbiAgICAgICovXG4gICAgICB0b0hTTEFBcnJheTogZnVuY3Rpb24gKClcbiAgICAgIHtcbiAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICBNYXRoLnJvdW5kKHRoaXMuaCksXG4gICAgICAgICAgICAgIHBhcnNlRmxvYXQodGhpcy5zbCksXG4gICAgICAgICAgICAgIHBhcnNlRmxvYXQodGhpcy5sKSxcbiAgICAgICAgICAgICAgcGFyc2VGbG9hdCh0aGlzLmEpXG4gICAgICAgICAgXTtcbiAgICAgIH0sXG5cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IHRvSFNMQU9iamVjdFxuICAgICAgICAgUmV0dXJuIHRoZSBIU0xBIG9iamVjdCBvZiB0aGUgaW5zdGFuY2VcbiAgICAgICAgID4gPiBDaHJvbWF0aC5hbnRpcXVld2hpdGUudG9IU0xBQXJyYXkoKTtcbiAgICAgICAgID4ge2g6MzQsIHM6MC43Nzc3Nzc3Nzc3Nzc3NzczLCBsOjAuOTExNzY0NzA1ODgyMzUyOSwgYToxfVxuICAgICAgKi9cbiAgICAgIHRvSFNMQU9iamVjdDogZnVuY3Rpb24gKClcbiAgICAgIHtcbiAgICAgICAgICB2YXIgaHNsYSA9IHRoaXMudG9IU0xBQXJyYXkoKTtcblxuICAgICAgICAgIHJldHVybiB7aDogaHNsYVswXSwgczogaHNsYVsxXSwgbDogaHNsYVsyXSwgYTogaHNsYVszXX07XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiB0b0hTTEFTdHJpbmdcbiAgICAgICAgIFJldHVybiB0aGUgSFNMQSBzdHJpbmcgb2YgdGhlIGluc3RhbmNlXG4gICAgICAgICA+ID4gQ2hyb21hdGguYW50aXF1ZXdoaXRlLnRvSFNMQVN0cmluZygpO1xuICAgICAgICAgPiBcImhzbGEoMzQsMC43Nzc3Nzc3Nzc3Nzc3NzczLDAuOTExNzY0NzA1ODgyMzUyOSwxKVwiXG4gICAgICAqL1xuICAgICAgdG9IU0xBU3RyaW5nOiBmdW5jdGlvbiAoKXtcbiAgICAgICAgICB2YXIgaHNsYSA9IHRoaXMudG9IU0xBQXJyYXkoKTtcbiAgICAgICAgICB2YXIgdmFscyA9IFtcbiAgICAgICAgICAgICAgaHNsYVswXSxcbiAgICAgICAgICAgICAgTWF0aC5yb3VuZChoc2xhWzFdKjEwMCkrJyUnLFxuICAgICAgICAgICAgICBNYXRoLnJvdW5kKGhzbGFbMl0qMTAwKSsnJScsXG4gICAgICAgICAgICAgIE1hdGgucm91bmQoaHNsYVszXSlcbiAgICAgICAgICBdO1xuXG4gICAgICAgICAgcmV0dXJuICdoc2xhKCcrIHZhbHMgKycpJztcbiAgICAgIH0sXG5cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IGhzdlxuICAgICAgICAgUmV0dXJuIHRoZSBIU1YgYXJyYXkgb2YgdGhlIGluc3RhbmNlXG4gICAgICAgICA+ID4gbmV3IENocm9tYXRoKCdibHVlJykuaHN2KCk7XG4gICAgICAgICA+IFsyNDAsIDEsIDFdXG4gICAgICAqL1xuICAgICAgaHN2OiBmdW5jdGlvbiAoKXsgcmV0dXJuIHRoaXMudG9IU1ZBcnJheSgpOyB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiB0b0hTVkFycmF5XG4gICAgICAgICBSZXR1cm4gdGhlIEhTViBhcnJheSBvZiB0aGUgaW5zdGFuY2VcbiAgICAgICAgID4gPiBuZXcgQ2hyb21hdGgoJ25hdmFqb3doaXRlJykudG9IU1ZBcnJheSgpO1xuICAgICAgICAgPiBbMzYsIDAuMzIxNTY4NjI3NDUwOTgwMzYsIDFdXG4gICAgICAqL1xuICAgICAgdG9IU1ZBcnJheTogZnVuY3Rpb24gKClcbiAgICAgIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy50b0hTVkFBcnJheSgpLnNsaWNlKDAsMyk7XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiB0b0hTVk9iamVjdFxuICAgICAgICAgUmV0dXJuIHRoZSBIU1Ygb2JqZWN0IG9mIHRoZSBpbnN0YW5jZVxuICAgICAgICAgPiA+IG5ldyBDaHJvbWF0aCgnbmF2YWpvd2hpdGUnKS50b0hTVk9iamVjdCgpO1xuICAgICAgICAgPiB7aDM2LCBzOjAuMzIxNTY4NjI3NDUwOTgwMzYsIHY6MX1cbiAgICAgICovXG4gICAgICB0b0hTVk9iamVjdDogZnVuY3Rpb24gKClcbiAgICAgIHtcbiAgICAgICAgICB2YXIgaHN2YSA9IHRoaXMudG9IU1ZBQXJyYXkoKTtcblxuICAgICAgICAgIHJldHVybiB7aDogaHN2YVswXSwgczogaHN2YVsxXSwgdjogaHN2YVsyXX07XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiB0b0hTVlN0cmluZ1xuICAgICAgICAgUmV0dXJuIHRoZSBIU1Ygc3RyaW5nIG9mIHRoZSBpbnN0YW5jZVxuICAgICAgICAgPiA+IG5ldyBDaHJvbWF0aCgnbmF2YWpvd2hpdGUnKS50b0hTVlN0cmluZygpO1xuICAgICAgICAgPiBcImhzdigzNiwzMi4xNTY4NjI3NDUwOTgwNCUsMTAwJSlcIlxuICAgICAgKi9cbiAgICAgIHRvSFNWU3RyaW5nOiBmdW5jdGlvbiAoKVxuICAgICAge1xuICAgICAgICAgIHZhciBoc3YgPSB0aGlzLnRvSFNWQXJyYXkoKTtcbiAgICAgICAgICB2YXIgdmFscyA9IFtcbiAgICAgICAgICAgICAgaHN2WzBdLFxuICAgICAgICAgICAgICBNYXRoLnJvdW5kKGhzdlsxXSoxMDApKyclJyxcbiAgICAgICAgICAgICAgTWF0aC5yb3VuZChoc3ZbMl0qMTAwKSsnJSdcbiAgICAgICAgICBdO1xuXG4gICAgICAgICAgcmV0dXJuICdoc3YoJysgdmFscyArJyknO1xuICAgICAgfSxcblxuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogaHN2YVxuICAgICAgICAgUmV0dXJuIHRoZSBIU1ZBIGFycmF5IG9mIHRoZSBpbnN0YW5jZVxuICAgICAgICAgPiA+IG5ldyBDaHJvbWF0aCgnYmx1ZScpLmhzdmEoKTtcbiAgICAgICAgID4gWzI0MCwgMSwgMSwgMV1cbiAgICAgICovXG4gICAgICBoc3ZhOiBmdW5jdGlvbiAoKXsgcmV0dXJuIHRoaXMudG9IU1ZBQXJyYXkoKTsgfSxcblxuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogdG9IU1ZBQXJyYXlcbiAgICAgICAgIFJldHVybiB0aGUgSFNWQSBhcnJheSBvZiB0aGUgaW5zdGFuY2VcbiAgICAgICAgID4gPiBuZXcgQ2hyb21hdGgoJ29saXZlJykudG9IU1ZBQXJyYXkoKTtcbiAgICAgICAgID4gWzYwLCAxLCAwLjUwMTk2MDc4NDMxMzcyNTUsIDFdXG4gICAgICAqL1xuICAgICAgdG9IU1ZBQXJyYXk6IGZ1bmN0aW9uICgpe1xuICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgIE1hdGgucm91bmQodGhpcy5oKSxcbiAgICAgICAgICAgICAgcGFyc2VGbG9hdCh0aGlzLnN2KSxcbiAgICAgICAgICAgICAgcGFyc2VGbG9hdCh0aGlzLnYpLFxuICAgICAgICAgICAgICBwYXJzZUZsb2F0KHRoaXMuYSlcbiAgICAgICAgICBdO1xuICAgICAgfSxcblxuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogdG9IU1ZBT2JqZWN0XG4gICAgICAgICBSZXR1cm4gdGhlIEhTVkEgb2JqZWN0IG9mIHRoZSBpbnN0YW5jZVxuICAgICAgICAgPiA+IG5ldyBDaHJvbWF0aCgnb2xpdmUnKS50b0hTVkFBcnJheSgpO1xuICAgICAgICAgPiB7aDo2MCwgczogMSwgdjowLjUwMTk2MDc4NDMxMzcyNTUsIGE6MX1cbiAgICAgICovXG4gICAgICB0b0hTVkFPYmplY3Q6IGZ1bmN0aW9uICgpe1xuICAgICAgICAgIHZhciBoc3ZhID0gdGhpcy50b0hTVkFBcnJheSgpO1xuXG4gICAgICAgICAgcmV0dXJuIHtoOiBoc3ZhWzBdLCBzOiBoc3ZhWzFdLCBsOiBoc3ZhWzJdLCBhOiBoc3ZhWzNdfTtcbiAgICAgIH0sXG5cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IHRvSFNWQVN0cmluZ1xuICAgICAgICAgUmV0dXJuIHRoZSBIU1ZBIHN0cmluZyBvZiB0aGUgaW5zdGFuY2VcbiAgICAgICAgID4gPiBuZXcgQ2hyb21hdGgoJ29saXZlJykudG9IU1ZBU3RyaW5nKCk7XG4gICAgICAgICA+IFwiaHN2YSg2MCwxMDAlLDUwLjE5NjA3ODQzMTM3MjU1JSwxKVwiXG4gICAgICAqL1xuICAgICAgdG9IU1ZBU3RyaW5nOiBmdW5jdGlvbiAoKVxuICAgICAge1xuICAgICAgICAgIHZhciBoc3ZhID0gdGhpcy50b0hTVkFBcnJheSgpO1xuICAgICAgICAgIHZhciB2YWxzID0gW1xuICAgICAgICAgICAgICBoc3ZhWzBdLFxuICAgICAgICAgICAgICBNYXRoLnJvdW5kKGhzdmFbMV0qMTAwKSsnJScsXG4gICAgICAgICAgICAgIE1hdGgucm91bmQoaHN2YVsyXSoxMDApKyclJyxcbiAgICAgICAgICAgICAgaHN2YVszXVxuICAgICAgICAgIF07XG5cbiAgICAgICAgICByZXR1cm4gJ2hzdmEoJysgdmFscyArJyknO1xuICAgICAgfSxcblxuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogaHNiXG4gICAgICAgICBBbGlhcyBmb3IgPGhzdj5cbiAgICAgICovXG4gICAgICBoc2I6IGZ1bmN0aW9uICgpeyByZXR1cm4gdGhpcy5oc3YoKTsgfSxcblxuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogdG9IU0JBcnJheVxuICAgICAgICAgQWxpYXMgZm9yIDx0b0hTQkFycmF5PlxuICAgICAgKi9cbiAgICAgIHRvSFNCQXJyYXk6IGZ1bmN0aW9uICgpXG4gICAgICB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMudG9IU1ZBcnJheSgpO1xuICAgICAgfSxcblxuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogdG9IU0JPYmplY3RcbiAgICAgICAgIEFsaWFzIGZvciA8dG9IU1ZPYmplY3Q+XG4gICAgICAqL1xuICAgICAgdG9IU0JPYmplY3Q6IGZ1bmN0aW9uICgpXG4gICAgICB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMudG9IU1ZPYmplY3QoKTtcbiAgICAgIH0sXG5cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IHRvSFNCU3RyaW5nXG4gICAgICAgICBBbGlhcyBmb3IgPHRvSFNWU3RyaW5nPlxuICAgICAgKi9cbiAgICAgIHRvSFNCU3RyaW5nOiBmdW5jdGlvbiAoKVxuICAgICAge1xuICAgICAgICAgIHJldHVybiB0aGlzLnRvSFNWU3RyaW5nKCk7XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiBoc2JhXG4gICAgICAgICBBbGlhcyBmb3IgPGhzdmE+XG4gICAgICAqL1xuICAgICAgaHNiYTogZnVuY3Rpb24gKCl7IHJldHVybiB0aGlzLmhzdmEoKTsgfSxcblxuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogdG9IU0JBQXJyYXlcbiAgICAgICAgIEFsaWFzIGZvciA8dG9IU1ZBQXJyYXk+XG4gICAgICAqL1xuICAgICAgdG9IU0JBQXJyYXk6IGZ1bmN0aW9uICgpe1xuICAgICAgICAgIHJldHVybiB0aGlzLnRvSFNWQUFycmF5KCk7XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiB0b0hTQkFPYmplY3RcbiAgICAgICAgIEFsaWFzIGZvciA8dG9IU1ZBT2JqZWN0PlxuICAgICAgKi9cbiAgICAgIHRvSFNCQU9iamVjdDogZnVuY3Rpb24gKCl7XG4gICAgICAgICAgcmV0dXJuIHRoaXMudG9IU1ZBT2JqZWN0KCk7XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiB0b0hTQkFTdHJpbmdcbiAgICAgICAgIEFsaWFzIGZvciA8dG9IU1ZBU3RyaW5nPlxuICAgICAgKi9cbiAgICAgIHRvSFNCQVN0cmluZzogZnVuY3Rpb24gKClcbiAgICAgIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy50b0hTVkFTdHJpbmcoKTtcbiAgICAgIH0sXG5cbiAgICAgIC8vR3JvdXA6IEluc3RhbmNlIG1ldGhvZHMgLSBjb2xvciBzY2hlbWVcbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IGNvbXBsZW1lbnRcbiAgICAgICAgIENhbGxzIDxDaHJvbWF0aC5jb21wbGVtZW50PiB3aXRoIHRoZSBjdXJyZW50IGluc3RhbmNlIGFzIHRoZSBmaXJzdCBwYXJhbWV0ZXJcblxuICAgICAgICAgPiA+IENocm9tYXRoLnJlZC5jb21wbGVtZW50KCkucmdiKCk7XG4gICAgICAgICA+IFswLCAyNTUsIDI1NV1cbiAgICAgICovXG4gICAgICBjb21wbGVtZW50OiBmdW5jdGlvbiAoKXtcbiAgICAgICAgICByZXR1cm4gQ2hyb21hdGguY29tcGxlbWVudCh0aGlzKTtcbiAgICAgIH0sXG5cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IHRyaWFkXG4gICAgICAgICBDYWxscyA8Q2hyb21hdGgudHJpYWQ+IHdpdGggdGhlIGN1cnJlbnQgaW5zdGFuY2UgYXMgdGhlIGZpcnN0IHBhcmFtZXRlclxuXG4gICAgICAgICA+ID4gbmV3IENocm9tYXRoKCdoc2woMCwgMTAwJSwgNTAlKScpLnRyaWFkKCkudG9TdHJpbmcoKTtcbiAgICAgICAgID4gXCIjRkYwMDAwLCMwMEZGMDAsIzAwMDBGRlwiXG4gICAgICAqL1xuICAgICAgdHJpYWQ6IGZ1bmN0aW9uICgpe1xuICAgICAgICAgIHJldHVybiBDaHJvbWF0aC50cmlhZCh0aGlzKTtcbiAgICAgIH0sXG5cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IHRldHJhZFxuICAgICAgICAgQ2FsbHMgPENocm9tYXRoLnRldHJhZD4gd2l0aCB0aGUgY3VycmVudCBpbnN0YW5jZSBhcyB0aGUgZmlyc3QgcGFyYW1ldGVyXG5cbiAgICAgICAgID4gPiBDaHJvbWF0aC5oc2IoMjQwLCAxLCAxKS50cmlhZCgpO1xuICAgICAgICAgPiBbQ2hyb21hdGgsIENocm9tYXRoLCBDaHJvbWF0aF1cbiAgICAgICovXG4gICAgICB0ZXRyYWQ6IGZ1bmN0aW9uICgpe1xuICAgICAgICAgIHJldHVybiBDaHJvbWF0aC50ZXRyYWQodGhpcyk7XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiBhbmFsb2dvdXNcbiAgICAgICAgIENhbGxzIDxDaHJvbWF0aC5hbmFsb2dvdXM+IHdpdGggdGhlIGN1cnJlbnQgaW5zdGFuY2UgYXMgdGhlIGZpcnN0IHBhcmFtZXRlclxuXG4gICAgICAgICA+ID4gQ2hyb21hdGguaHNiKDEyMCwgMSwgMSkuYW5hbG9nb3VzKCk7XG4gICAgICAgICA+IFtDaHJvbWF0aCwgQ2hyb21hdGgsIENocm9tYXRoLCBDaHJvbWF0aCwgQ2hyb21hdGgsIENocm9tYXRoLCBDaHJvbWF0aCwgQ2hyb21hdGhdXG5cbiAgICAgICAgID4gPiBDaHJvbWF0aC5oc2IoMTgwLCAxLCAxKS5hbmFsb2dvdXMoNSkudG9TdHJpbmcoKTtcbiAgICAgICAgID4gXCIjMDBGRkZGLCMwMEZGQjIsIzAwRkZFNSwjMDBFNUZGLCMwMEIyRkZcIlxuXG4gICAgICAgICA+ID4gQ2hyb21hdGguaHNiKDE4MCwgMSwgMSkuYW5hbG9nb3VzKDUsIDEwKS50b1N0cmluZygpO1xuICAgICAgICAgPiBcIiMwMEZGRkYsIzAwRkYxOSwjMDBGRkIyLCMwMEIyRkYsIzAwMTlGRlwiXG4gICAgICAqL1xuICAgICAgYW5hbG9nb3VzOiBmdW5jdGlvbiAocmVzdWx0cywgc2xpY2VzKXtcbiAgICAgICAgICByZXR1cm4gQ2hyb21hdGguYW5hbG9nb3VzKHRoaXMsIHJlc3VsdHMsIHNsaWNlcyk7XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgICBNZXRob2Q6IG1vbm9jaHJvbWF0aWNcbiAgICAgICAgIENhbGxzIDxDaHJvbWF0aC5tb25vY2hyb21hdGljPiB3aXRoIHRoZSBjdXJyZW50IGluc3RhbmNlIGFzIHRoZSBmaXJzdCBwYXJhbWV0ZXJcblxuICAgICAgICA+ID4gQ2hyb21hdGguYmx1ZS5tb25vY2hyb21hdGljKCkudG9TdHJpbmcoKTtcbiAgICAgICAgPiBcIiMwMDAwMzMsIzAwMDA2NiwjMDAwMDk5LCMwMDAwQ0MsIzAwMDBGRlwiXG4gICAgICAqL1xuICAgICAgbW9ub2Nocm9tYXRpYzogZnVuY3Rpb24gKHJlc3VsdHMpe1xuICAgICAgICAgIHJldHVybiBDaHJvbWF0aC5tb25vY2hyb21hdGljKHRoaXMsIHJlc3VsdHMpO1xuICAgICAgfSxcblxuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogc3BsaXRjb21wbGVtZW50XG4gICAgICAgICBDYWxscyA8Q2hyb21hdGguc3BsaXRjb21wbGVtZW50PiB3aXRoIHRoZSBjdXJyZW50IGluc3RhbmNlIGFzIHRoZSBmaXJzdCBwYXJhbWV0ZXJcblxuICAgICAgICAgPiA+IENocm9tYXRoLmJsdWUuc3BsaXRjb21wbGVtZW50KCkudG9TdHJpbmcoKTtcbiAgICAgICAgID4gXCIjMDAwMEZGLCNGRkNDMDAsI0ZGNTEwMFwiXG4gICAgICAqL1xuICAgICAgc3BsaXRjb21wbGVtZW50OiBmdW5jdGlvbiAoKXtcbiAgICAgICAgICByZXR1cm4gQ2hyb21hdGguc3BsaXRjb21wbGVtZW50KHRoaXMpO1xuICAgICAgfSxcblxuICAgICAgLy8gR3JvdXA6IEluc3RhbmNlIG1ldGhvZHMgLSBjb2xvciBhbHRlcmF0aW9uXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiB0aW50XG4gICAgICAgICBDYWxscyA8Q2hyb21hdGgudGludD4gd2l0aCB0aGUgY3VycmVudCBpbnN0YW5jZSBhcyB0aGUgZmlyc3QgcGFyYW1ldGVyXG5cbiAgICAgICAgID4gPiBuZXcgQ2hyb21hdGgoJ3llbGxvdycpLnRpbnQoMC4yNSkudG9TdHJpbmcoKTtcbiAgICAgICAgID4gXCIjRkZGRjNGXCJcbiAgICAgICovXG4gICAgICB0aW50OiBmdW5jdGlvbiAoYnkpIHtcbiAgICAgICAgICByZXR1cm4gQ2hyb21hdGgudGludCh0aGlzLCBieSk7XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiBsaWdodGVuXG4gICAgICAgICBBbGlhcyBmb3IgPHRpbnQ+XG4gICAgICAqL1xuICAgICAgbGlnaHRlbjogZnVuY3Rpb24gKGJ5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRpbnQoYnkpO1xuICAgICAgfSxcblxuICAgICAgLypcbiAgICAgICAgTWV0aG9kOiBzaGFkZVxuICAgICAgICAgQ2FsbHMgPENocm9tYXRoLnNoYWRlPiB3aXRoIHRoZSBjdXJyZW50IGluc3RhbmNlIGFzIHRoZSBmaXJzdCBwYXJhbWV0ZXJcblxuICAgICAgICA+ID4gbmV3IENocm9tYXRoKCd5ZWxsb3cnKS5zaGFkZSgwLjI1KS50b1N0cmluZygpO1xuICAgICAgICA+IFwiI0JGQkYwMFwiXG4gICAgICAqL1xuICAgICAgc2hhZGU6IGZ1bmN0aW9uIChieSkge1xuICAgICAgICAgIHJldHVybiBDaHJvbWF0aC5zaGFkZSh0aGlzLCBieSk7XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiBkYXJrZW5cbiAgICAgICAgIEFsaWFzIGZvciA8c2hhZGU+XG4gICAgICAqL1xuICAgICAgZGFya2VuOiBmdW5jdGlvbiAoYnkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2hhZGUoYnkpO1xuICAgICAgfSxcblxuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogZGVzYXR1cmF0ZVxuICAgICAgICAgQ2FsbHMgPENocm9tYXRoLmRlc2F0dXJhdGU+IHdpdGggdGhlIGN1cnJlbnQgaW5zdGFuY2UgYXMgdGhlIGZpcnN0IHBhcmFtZXRlclxuXG4gICAgICAgPiA+IG5ldyBDaHJvbWF0aCgnb3JhbmdlJykuZGVzYXR1cmF0ZSgpLnRvU3RyaW5nKCk7XG4gICAgICAgPiBcIiNBREFEQURcIlxuXG4gICAgICAgPiA+IG5ldyBDaHJvbWF0aCgnb3JhbmdlJykuZGVzYXR1cmF0ZSgxKS50b1N0cmluZygpO1xuICAgICAgID4gXCIjNUI1QjVCXCJcblxuICAgICAgID4gPiBuZXcgQ2hyb21hdGgoJ29yYW5nZScpLmRlc2F0dXJhdGUoMikudG9TdHJpbmcoKTtcbiAgICAgICA+IFwiI0I0QjRCNFwiXG4gICAgICAgKi9cbiAgICAgIGRlc2F0dXJhdGU6IGZ1bmN0aW9uIChmb3JtdWxhKXtcbiAgICAgICAgICByZXR1cm4gQ2hyb21hdGguZGVzYXR1cmF0ZSh0aGlzLCBmb3JtdWxhKTtcbiAgICAgIH0sXG5cbiAgICAgIC8qXG4gICAgICAgIE1ldGhvZDogZ3JleXNjYWxlXG4gICAgICAgIEFsaWFzIGZvciA8ZGVzYXR1cmF0ZT5cbiAgICAgICovXG4gICAgICBncmV5c2NhbGU6IGZ1bmN0aW9uIChmb3JtdWxhKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlc2F0dXJhdGUoZm9ybXVsYSk7XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiB3ZWJzYWZlXG4gICAgICAgICBDYWxscyA8Q2hyb21hdGgud2Vic2FmZT4gd2l0aCB0aGUgY3VycmVudCBpbnN0YW5jZSBhcyB0aGUgZmlyc3QgcGFyYW1ldGVyXG5cbiAgICAgICAgID4gPiBDaHJvbWF0aC5yZ2IoMTIzLCAyMzQsIDU2KS50b1N0cmluZygpO1xuICAgICAgICAgPiBcIiM3QkVBMzhcIlxuXG4gICAgICAgICA+IENocm9tYXRoLnJnYigxMjMsIDIzNCwgNTYpLndlYnNhZmUoKS50b1N0cmluZygpO1xuICAgICAgICAgPiBcIiM2NkZGMzNcIlxuICAgICAgICovXG4gICAgICB3ZWJzYWZlOiBmdW5jdGlvbiAoKXtcbiAgICAgICAgICByZXR1cm4gQ2hyb21hdGgud2Vic2FmZSh0aGlzKTtcbiAgICAgIH0sXG5cbiAgICAgIC8vIEdyb3VwOiBJbnN0YW5jZSBtZXRob2RzIC0gY29sb3IgY29tYmluYXRpb25cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IGFkZGl0aXZlXG4gICAgICAgICBDYWxscyA8Q2hyb21hdGguYWRkaXRpdmU+IHdpdGggdGhlIGN1cnJlbnQgaW5zdGFuY2UgYXMgdGhlIGZpcnN0IHBhcmFtZXRlclxuXG4gICAgICAgICA+ID4gbmV3IENocm9tYXRoKCdyZWQnKS5hZGRpdGl2ZSgnIzAwRkYwMCcsICdibHVlJykudG9TdHJpbmcoKTtcbiAgICAgICAgID4gXCIjRkZGRkZGXCJcbiAgICAgICovXG4gICAgICBhZGRpdGl2ZTogZnVuY3Rpb24gKCl7XG4gICAgICAgICAgdmFyIGFyciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgICAgcmV0dXJuIENocm9tYXRoLmFkZGl0aXZlLmFwcGx5KENocm9tYXRoLCBbdGhpc10uY29uY2F0KGFycikpO1xuICAgICAgfSxcblxuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogc3VidHJhY3RpdmVcbiAgICAgICAgIENhbGxzIDxDaHJvbWF0aC5zdWJ0cmFjdGl2ZT4gd2l0aCB0aGUgY3VycmVudCBpbnN0YW5jZSBhcyB0aGUgZmlyc3QgcGFyYW1ldGVyXG5cbiAgICAgICAgID4gPiBuZXcgQ2hyb21hdGgoJ2N5YW4nKS5zdWJ0cmFjdGl2ZSgnbWFnZW50YScsICd5ZWxsb3cnKS50b1N0cmluZygpO1xuICAgICAgICAgPiBcIiMwMDAwMDBcIlxuICAgICAgKi9cbiAgICAgIHN1YnRyYWN0aXZlOiBmdW5jdGlvbiAoKXtcbiAgICAgICAgICB2YXIgYXJyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICByZXR1cm4gQ2hyb21hdGguc3VidHJhY3RpdmUuYXBwbHkoQ2hyb21hdGgsIFt0aGlzXS5jb25jYXQoYXJyKSk7XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiBtdWx0aXBseVxuICAgICAgICAgQ2FsbHMgPENocm9tYXRoLm11bHRpcGx5PiB3aXRoIHRoZSBjdXJyZW50IGluc3RhbmNlIGFzIHRoZSBmaXJzdCBwYXJhbWV0ZXJcblxuICAgICAgICAgPiA+IENocm9tYXRoLmxpZ2h0Y3lhbi5tdWx0aXBseShDaHJvbWF0aC5icm93bikudG9TdHJpbmcoKTtcbiAgICAgICAgID4gXCIjOTAyQTJBXCJcbiAgICAgICovXG4gICAgICBtdWx0aXBseTogZnVuY3Rpb24gKCl7XG4gICAgICAgICAgdmFyIGFyciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgICAgcmV0dXJuIENocm9tYXRoLm11bHRpcGx5LmFwcGx5KENocm9tYXRoLCBbdGhpc10uY29uY2F0KGFycikpO1xuICAgICAgfSxcblxuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogYXZlcmFnZVxuICAgICAgICAgQ2FsbHMgPENocm9tYXRoLmF2ZXJhZ2U+IHdpdGggdGhlIGN1cnJlbnQgaW5zdGFuY2UgYXMgdGhlIGZpcnN0IHBhcmFtZXRlclxuXG4gICAgICAgICA+ID4gQ2hyb21hdGguYmxhY2suYXZlcmFnZSgnd2hpdGUnKS5yZ2IoKTtcbiAgICAgICAgID4gWzEyNywgMTI3LCAxMjddXG4gICAgICAqL1xuICAgICAgYXZlcmFnZTogZnVuY3Rpb24gKCl7XG4gICAgICAgICAgdmFyIGFyciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgICAgcmV0dXJuIENocm9tYXRoLmF2ZXJhZ2UuYXBwbHkoQ2hyb21hdGgsIFt0aGlzXS5jb25jYXQoYXJyKSk7XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiBvdmVybGF5XG4gICAgICAgICBDYWxscyA8Q2hyb21hdGgub3ZlcmxheT4gd2l0aCB0aGUgY3VycmVudCBpbnN0YW5jZSBhcyB0aGUgZmlyc3QgcGFyYW1ldGVyXG5cbiAgICAgICA+ID4gQ2hyb21hdGgucmVkLm92ZXJsYXkoJ2dyZWVuJywgMC40KS50b1N0cmluZygpO1xuICAgICAgID4gXCIjOTkzMzAwXCJcblxuICAgICAgID4gPiBDaHJvbWF0aC5yZWQub3ZlcmxheSgnZ3JlZW4nLCAxKS50b1N0cmluZygpO1xuICAgICAgID4gXCIjMDA4MDAwXCJcblxuICAgICAgID4gPiBDaHJvbWF0aC5yZWQub3ZlcmxheSgnZ3JlZW4nLCAwKS50b1N0cmluZygpO1xuICAgICAgID4gXCIjRkYwMDAwXCJcbiAgICAgICAqL1xuICAgICAgb3ZlcmxheTogZnVuY3Rpb24gKGJvdHRvbSwgdHJhbnNwYXJlbmN5KXtcbiAgICAgICAgICByZXR1cm4gQ2hyb21hdGgub3ZlcmxheSh0aGlzLCBib3R0b20sIHRyYW5zcGFyZW5jeSk7XG4gICAgICB9LFxuXG4gICAgICAvLyBHcm91cDogSW5zdGFuY2UgbWV0aG9kcyAtIG90aGVyXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiBjbG9uZVxuICAgICAgICAgUmV0dXJuIGFuIGluZGVwZW5kZW50IGNvcHkgb2YgdGhlIGluc3RhbmNlXG4gICAgICAqL1xuICAgICAgY2xvbmU6IGZ1bmN0aW9uICgpe1xuICAgICAgICAgIHJldHVybiBuZXcgQ2hyb21hdGgodGhpcyk7XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiB0b3dhcmRzXG4gICAgICAgICBDYWxscyA8Q2hyb21hdGgudG93YXJkcz4gd2l0aCB0aGUgY3VycmVudCBpbnN0YW5jZSBhcyB0aGUgZmlyc3QgcGFyYW1ldGVyXG5cbiAgICAgICAgID4gPiB2YXIgcmVkID0gbmV3IENocm9tYXRoKCdyZWQnKTtcbiAgICAgICAgID4gPiByZWQudG93YXJkcygneWVsbG93JywgMC41NSkudG9TdHJpbmcoKTtcbiAgICAgICAgID4gXCIjRkY4QzAwXCJcbiAgICAgICovXG4gICAgICB0b3dhcmRzOiBmdW5jdGlvbiAodG8sIGJ5KSB7XG4gICAgICAgICAgcmV0dXJuIENocm9tYXRoLnRvd2FyZHModGhpcywgdG8sIGJ5KTtcbiAgICAgIH0sXG5cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IGdyYWRpZW50XG4gICAgICAgICBDYWxscyA8Q2hyb21hdGguZ3JhZGllbnQ+IHdpdGggdGhlIGN1cnJlbnQgaW5zdGFuY2UgYXMgdGhlIGZpcnN0IHBhcmFtZXRlclxuXG4gICAgICAgICA+ID4gbmV3IENocm9tYXRoKCcjRjAwJykuZ3JhZGllbnQoJyMwMEYnKS50b1N0cmluZygpXG4gICAgICAgICA+IFwiI0ZGMDAwMCwjRjEwMDBELCNFNDAwMUEsI0Q2MDAyOCwjQzkwMDM1LCNCQjAwNDMsI0FFMDA1MCwjQTEwMDVELCM5MzAwNkIsIzg2MDA3OCwjNzgwMDg2LCM2QjAwOTMsIzVEMDBBMSwjNTAwMEFFLCM0MzAwQkIsIzM1MDBDOSwjMjgwMEQ2LCMxQTAwRTQsIzBEMDBGMSwjMDAwMEZGXCJcblxuICAgICAgICAgPiA+IG5ldyBDaHJvbWF0aCgnI0YwMCcpLmdyYWRpZW50KCcjMDBGJywgNSkudG9TdHJpbmcoKVxuICAgICAgICAgPiBcIiNGRjAwMDAsI0JGMDAzRiwjN0YwMDdGLCMzRjAwQkYsIzAwMDBGRlwiXG5cbiAgICAgICAgID4gPiBuZXcgQ2hyb21hdGgoJyNGMDAnKS5ncmFkaWVudCgnIzAwRicsIDUsIDMpLnRvU3RyaW5nKClcbiAgICAgICAgID4gXCIjM0YwMEJGXCJcbiAgICAgICovXG4gICAgICBncmFkaWVudDogZnVuY3Rpb24gKHRvLCBzbGljZXMsIHNsaWNlKXtcbiAgICAgICAgICByZXR1cm4gQ2hyb21hdGguZ3JhZGllbnQodGhpcywgdG8sIHNsaWNlcywgc2xpY2UpO1xuICAgICAgfVxuICB9O1xufTtcbiIsInZhciB1dGlsID0ge307XG5cbnV0aWwuY2xhbXAgPSBmdW5jdGlvbiAoIHZhbCwgbWluLCBtYXggKSB7XG4gICAgaWYgKHZhbCA+IG1heCkgcmV0dXJuIG1heDtcbiAgICBpZiAodmFsIDwgbWluKSByZXR1cm4gbWluO1xuICAgIHJldHVybiB2YWw7XG59O1xuXG51dGlsLm1lcmdlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBkZXN0ID0gYXJndW1lbnRzWzBdLCBpPTEsIHNvdXJjZSwgcHJvcDtcbiAgICB3aGlsZSAoc291cmNlID0gYXJndW1lbnRzW2krK10pXG4gICAgICAgIGZvciAocHJvcCBpbiBzb3VyY2UpIGRlc3RbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG5cbiAgICByZXR1cm4gZGVzdDtcbn07XG5cbnV0aWwuaXNBcnJheSA9IGZ1bmN0aW9uICggdGVzdCApIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHRlc3QpID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxudXRpbC5pc1N0cmluZyA9IGZ1bmN0aW9uICggdGVzdCApIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHRlc3QpID09PSAnW29iamVjdCBTdHJpbmddJztcbn07XG5cbnV0aWwuaXNOdW1iZXIgPSBmdW5jdGlvbiAoIHRlc3QgKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0ZXN0KSA9PT0gJ1tvYmplY3QgTnVtYmVyXSc7XG59O1xuXG51dGlsLmlzT2JqZWN0ID0gZnVuY3Rpb24gKCB0ZXN0ICkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodGVzdCkgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xufTtcblxudXRpbC5scGFkID0gZnVuY3Rpb24gKCB2YWwsIGxlbiwgcGFkICkge1xuICAgIHZhbCA9IHZhbC50b1N0cmluZygpO1xuICAgIGlmICghbGVuKSBsZW4gPSAyO1xuICAgIGlmICghcGFkKSBwYWQgPSAnMCc7XG5cbiAgICB3aGlsZSAodmFsLmxlbmd0aCA8IGxlbikgdmFsID0gcGFkK3ZhbDtcblxuICAgIHJldHVybiB2YWw7XG59O1xuXG51dGlsLmxlcnAgPSBmdW5jdGlvbiAoZnJvbSwgdG8sIGJ5KSB7XG4gICAgcmV0dXJuIGZyb20gKyAodG8tZnJvbSkgKiBieTtcbn07XG5cbnV0aWwudGltZXMgPSBmdW5jdGlvbiAobiwgZm4sIGNvbnRleHQpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgcmVzdWx0cyA9IFtdOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgIHJlc3VsdHNbaV0gPSBmbi5jYWxsKGNvbnRleHQsIGkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbn07XG5cbnV0aWwucmdiID0ge1xuICAgIGZyb21BcmdzOiBmdW5jdGlvbiAociwgZywgYiwgYSkge1xuICAgICAgICB2YXIgcmdiID0gYXJndW1lbnRzWzBdO1xuXG4gICAgICAgIGlmICh1dGlsLmlzQXJyYXkocmdiKSl7IHI9cmdiWzBdOyBnPXJnYlsxXTsgYj1yZ2JbMl07IGE9cmdiWzNdOyB9XG4gICAgICAgIGlmICh1dGlsLmlzT2JqZWN0KHJnYikpeyByPXJnYi5yOyBnPXJnYi5nOyBiPXJnYi5iOyBhPXJnYi5hOyAgfVxuXG4gICAgICAgIHJldHVybiBbciwgZywgYiwgYV07XG4gICAgfSxcbiAgICBzY2FsZWQwMTogZnVuY3Rpb24gKHIsIGcsIGIpIHtcbiAgICAgICAgaWYgKCFpc0Zpbml0ZShhcmd1bWVudHNbMV0pKXtcbiAgICAgICAgICAgIHZhciByZ2IgPSB1dGlsLnJnYi5mcm9tQXJncyhyLCBnLCBiKTtcbiAgICAgICAgICAgIHIgPSByZ2JbMF0sIGcgPSByZ2JbMV0sIGIgPSByZ2JbMl07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAociA+IDEpIHIgLz0gMjU1O1xuICAgICAgICBpZiAoZyA+IDEpIGcgLz0gMjU1O1xuICAgICAgICBpZiAoYiA+IDEpIGIgLz0gMjU1O1xuXG4gICAgICAgIHJldHVybiBbciwgZywgYl07XG4gICAgfSxcbiAgICBwY3RXaXRoU3ltYm9sOiBmdW5jdGlvbiAociwgZywgYikge1xuICAgICAgICB2YXIgcmdiID0gdGhpcy5zY2FsZWQwMShyLCBnLCBiKTtcblxuICAgICAgICByZXR1cm4gcmdiLm1hcChmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgucm91bmQodiAqIDI1NSkgKyAnJSc7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbnV0aWwuaHNsID0ge1xuICAgIGZyb21BcmdzOiBmdW5jdGlvbiAoaCwgcywgbCwgYSkge1xuICAgICAgICB2YXIgaHNsID0gYXJndW1lbnRzWzBdO1xuXG4gICAgICAgIGlmICh1dGlsLmlzQXJyYXkoaHNsKSl7IGg9aHNsWzBdOyBzPWhzbFsxXTsgbD1oc2xbMl07IGE9aHNsWzNdOyB9XG4gICAgICAgIGlmICh1dGlsLmlzT2JqZWN0KGhzbCkpeyBoPWhzbC5oOyBzPWhzbC5zOyBsPShoc2wubCB8fCBoc2wudik7IGE9aHNsLmE7IH1cblxuICAgICAgICByZXR1cm4gW2gsIHMsIGwsIGFdO1xuICAgIH0sXG4gICAgc2NhbGVkOiBmdW5jdGlvbiAoaCwgcywgbCkge1xuICAgICAgICBpZiAoIWlzRmluaXRlKGFyZ3VtZW50c1sxXSkpe1xuICAgICAgICAgICAgdmFyIGhzbCA9IHV0aWwuaHNsLmZyb21BcmdzKGgsIHMsIGwpO1xuICAgICAgICAgICAgaCA9IGhzbFswXSwgcyA9IGhzbFsxXSwgbCA9IGhzbFsyXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGggPSAoKChoICUgMzYwKSArIDM2MCkgJSAzNjApO1xuICAgICAgICBpZiAocyA+IDEpIHMgLz0gMTAwO1xuICAgICAgICBpZiAobCA+IDEpIGwgLz0gMTAwO1xuXG4gICAgICAgIHJldHVybiBbaCwgcywgbF07XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB1dGlsO1xuIiwiZnVuY3Rpb24gQ3JlYXRlY3NzICgpIHtcblxufVxuXG5DcmVhdGVjc3MucHJvdG90eXBlID0ge1xuICBzZWxlY3RvcjogZnVuY3Rpb24oc2VsZWN0b3IsIHN0eWxlKSB7XG4gICAgaWYgKCFkb2N1bWVudC5zdHlsZVNoZWV0cykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKS5sZW5ndGggPT0gMCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdmFyIHN0eWxlc2hlZXRcbiAgICB2YXIgbWVkaWFUeXBlXG5cbiAgICB2YXIgc3R5bGVTaGVldEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIilcbiAgICBzdHlsZVNoZWV0RWxlbWVudC50eXBlID0gXCJ0ZXh0L2Nzc1wiXG5cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0uYXBwZW5kQ2hpbGQoc3R5bGVTaGVldEVsZW1lbnQpXG5cbiAgICBmb3IoIGkgPSAwOyBpIDwgZG9jdW1lbnQuc3R5bGVTaGVldHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChkb2N1bWVudC5zdHlsZVNoZWV0c1tpXS5kaXNhYmxlZCkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgc3R5bGVTaGVldCA9IGRvY3VtZW50LnN0eWxlU2hlZXRzW2ldXG4gICAgfVxuXG4gICAgdmFyIG1lZGlhID0gc3R5bGVTaGVldC5tZWRpYVxuICAgICAgbWVkaWFUeXBlID0gdHlwZW9mIG1lZGlhXG5cbiAgICBpZiAobWVkaWFUeXBlID09IFwic3RyaW5nXCIpIHtcbiAgICAgIGZvciggaSA9IDA7IGkgPCBzdHlsZVNoZWV0LnJ1bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChzdHlsZVNoZWV0LnJ1bGVzW2ldLnNlbGVjdG9yVGV4dCAmJiBzdHlsZVNoZWV0LnJ1bGVzW2ldLnNlbGVjdG9yVGV4dC50b0xvd2VyQ2FzZSgpID09IHNlbGVjdG9yLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICBzdHlsZVNoZWV0LnJ1bGVzW2ldLnN0eWxlLmNzc1RleHQgPSBzdHlsZVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHN0eWxlU2hlZXQuYWRkUnVsZShzZWxlY3Rvciwgc3R5bGUpXG4gICAgfSBlbHNlIGlmIChtZWRpYVR5cGUgPT0gXCJvYmplY3RcIikge1xuICAgICAgZm9yKCBpID0gMDsgaSA8IHN0eWxlU2hlZXQuY3NzUnVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHN0eWxlU2hlZXQuY3NzUnVsZXNbaV0uc2VsZWN0b3JUZXh0ICYmIHN0eWxlU2hlZXQuY3NzUnVsZXNbaV0uc2VsZWN0b3JUZXh0LnRvTG93ZXJDYXNlKCkgPT0gc2VsZWN0b3IudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgIHN0eWxlU2hlZXQuY3NzUnVsZXNbaV0uc3R5bGUuY3NzVGV4dCA9IHN0eWxlXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc3R5bGVTaGVldC5pbnNlcnRSdWxlKHNlbGVjdG9yICsgXCJ7XCIgKyBzdHlsZSArIFwifVwiLCAwKVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBDcmVhdGVjc3MoKSIsImNvbnN0IERhc2hib2FyZCA9IHJlcXVpcmUoJy4vbW9kdWxlcy9EYXNoYm9hcmQnKTtcclxuY29uc3QgUm91dGVyID0gcmVxdWlyZSgnLi9tb2R1bGVzL1JvdXRlcicpO1xyXG5cclxuJChmdW5jdGlvbigpe1xyXG4gIHdpbmRvdy5EYXNoYm9hcmQgPSBuZXcgRGFzaGJvYXJkKClcclxuICB3aW5kb3cuRGFzaGJvYXJkLnJlbmRlcigpXHJcbiAgd2luZG93LkRhc2hib2FyZC5yb3V0ZXIgPSBuZXcgUm91dGVyXHJcbiAgQmFja2JvbmUuaGlzdG9yeS5zdGFydCgpXHJcbn0pIiwiY29uc3QgQ2hhcnRWaWV3ID0gcmVxdWlyZSgnLi9DaGFydFZpZXcnKVxyXG5cclxuY29uc3QgQmFyQ2hhcnRWaWV3ID0gQ2hhcnRWaWV3LmV4dGVuZCh7XHJcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcclxuICAgIHZhciBzZWxmID0gdGhpc1xyXG4gICAgdGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKHRoaXMubW9kZWwudG9KU09OKCkpKVxyXG4gICAgdGhpcy51cGRhdGVDaGFydFRvb2xzKClcclxuICAgIHRoaXMuJGVsLmZpbmQoJy5jaGFydC1pbm5lcicpLmNzcygnb3ZlcmZsb3cnLCAnaGlkZGVuJylcclxuICAgIHRoaXMuY2hhcnRlbCA9IHRoaXMuJGVsLmZpbmQoJy5jaGFydC1pbm5lciA+IC50aGUtY2hhcnQnKS5nZXQoMClcclxuICAgIHRoaXMuY2hhcnQgPSBmYWxzZVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9LFxyXG4gIGRyYXdDaGFydDogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmNoYXJ0ID0gbmV3IEdlb0Rhc2guQmFyQ2hhcnRWZXJ0aWNhbCh0aGlzLmNoYXJ0ZWwsIHtcclxuICAgICAgeDogdGhpcy5tb2RlbC5nZXQoJ2tleScpXHJcbiAgICAgICwgeTogdGhpcy5tb2RlbC5nZXQoJ3knKVxyXG4gICAgICAsIGNvbG9yczogdGhpcy5tb2RlbC5nZXQoJ2NvbG9ycycpXHJcbiAgICAgICwgeVRpY2tGb3JtYXQ6IGQzLmZvcm1hdChcIi4yc1wiKVxyXG4gICAgICAsIHlMYWJlbDogdGhpcy5tb2RlbC5nZXQoJ3lMYWJlbCcpXHJcbiAgICAgICwgaG92ZXJUZW1wbGF0ZTogXCJ7e3h9fToge3t5fX0gXCIgKyB0aGlzLm1vZGVsLmdldCgndW5pdHMnKVxyXG4gICAgICAsIG9wYWNpdHk6IDAuOVxyXG4gICAgICAsIGJhckxhYmVsczogdGhpcy5tb2RlbC5nZXQoJ2JhckxhYmVscycpXHJcbiAgICAgICwgYmFyTGFiZWxGb3JtYXQ6IHRoaXMubW9kZWwuZ2V0KCdiYXJMYWJlbEZvcm1hdCcpXHJcbiAgICAgICwgeExhYmVsQW5nbGU6IHRoaXMubW9kZWwuZ2V0KCd4TGFiZWxBbmdsZScpXHJcbiAgICAgICwgeEF4aXNMYWJlbFBhZGRpbmc6IHRoaXMubW9kZWwuZ2V0KCd4QXhpc0xhYmVsUGFkZGluZycpXHJcbiAgICAgICwgbGVnZW5kOiB0aGlzLm1vZGVsLmdldCgnbGVnZW5kJylcclxuICAgICAgLCBsZWdlbmRXaWR0aDogJ2F1dG8nXHJcbiAgICAgICwgbGVnZW5kUG9zaXRpb246ICdpbnNpZGUnXHJcbiAgICAgICwgdmFsdWVGb3JtYXQ6IHRoaXMubW9kZWwuZ2V0KCd2YWx1ZUZvcm1hdCcpXHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgcHJlcERhdGE6IGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzXHJcbiAgICB2YXIgcm93ID0gZGF0YVswXVxyXG4gICAgaWYgKHJvdykge1xyXG4gICAgICBkYXRhID0gXy5zb3J0QnkoZGF0YSwgZnVuY3Rpb24ocm93LCBpKSB7XHJcbiAgICAgICAgcmV0dXJuIHJvd1tzZWxmLmNoYXJ0Lm9wdGlvbnMueVswXV1cclxuICAgICAgfSkucmV2ZXJzZSgpXHJcbiAgICAgIHRoaXMuc2V0Q29sb3JzKGRhdGEpXHJcbiAgICAgIHRoaXMubW9kZWwuc2V0KCdkYXRhJywgZGF0YSwge3NpbGVudDogdHJ1ZX0pXHJcbiAgICAgIGlmIChkYXRhLmxlbmd0aCA+IHNlbGYuZGF0YUxpbWl0KSB7XHJcbiAgICAgICAgZGF0YSA9IGRhdGEuc3BsaWNlKDAsIHNlbGYuZGF0YUxpbWl0KVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGF0YVxyXG4gIH1cclxufSlcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQmFyQ2hhcnRWaWV3IiwiY29uc3QgQ2hhcnRNb2RlbCA9IHJlcXVpcmUoJy4vQ2hhcnRNb2RlbCcpXHJcblxyXG5jb25zdCBDaGFydENvbGxlY3Rpb24gPSBCYWNrYm9uZS5Db2xsZWN0aW9uLmV4dGVuZCh7XHJcbiAgbW9kZWw6IENoYXJ0TW9kZWxcclxufSlcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2hhcnRDb2xsZWN0aW9uIiwiY29uc3QgQ2hhcnRNb2RlbCA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XHJcbiAgZGVmYXVsdHM6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgYXBpOiAnLycsXHJcbiAgICAgIHRpdGxlOiAnQ2hhcnQgVGl0bGUnLFxyXG4gICAgICBzb3J0X2tleTogZmFsc2UsXHJcbiAgICAgIHNvcnRfZGVzYzogdHJ1ZSxcclxuICAgICAgY2hhcnRfdHlwZTogJ2JhcicsXHJcbiAgICAgIGtleTogJ05hbWUnLFxyXG4gICAgICB5OiBbXSxcclxuICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgIGhvdmVyVGVtcGxhdGU6ICd7e3h9fToge3t5fX0nLFxyXG4gICAgICB1bml0czogJycsXHJcbiAgICAgIHZpc2libGU6IHRydWUsXHJcbiAgICAgIHRvb2xiYXI6IHRydWUsXHJcbiAgICAgIHNvcnQ6IHRydWUsXHJcbiAgICAgIHdpZHRoOiAnY29sLWxnLTMgY29sLW1kLTYgY29sLXNtLTEyJyxcclxuICAgICAgYmFyTGFiZWxzOiBmYWxzZSxcclxuICAgICAgeExhYmVsQW5nbGU6IGZhbHNlLFxyXG4gICAgICB4QXhpc0xhYmVsUGFkZGluZzogMjAsXHJcbiAgICAgIGxlZ2VuZDogZmFsc2UsXHJcbiAgICAgIHZhbHVlRm9ybWF0OiBkMy5mb3JtYXQoJywuMmYnKSxcclxuICAgICAgbGFiZWxGb3JtYXQ6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQgfSxcclxuICAgICAgYmFyTGFiZWxGb3JtYXQ6IGQzLmZvcm1hdCgnLC4ycycpLFxyXG4gICAgICBkb250Rm9ybWF0OiBbXSxcclxuICAgICAgc2hvd1VuaXRzSW5UYWJsZTogZmFsc2UsXHJcbiAgICAgIGdlbzogZmFsc2UsXHJcbiAgICAgIGNvbG9yczogRGFzaGJvYXJkLmNvbG9ycyxcclxuICAgICAgZmlsdGVyX2NvbG9yOiBmYWxzZSxcclxuICAgICAgeUxhYmVsOiBmYWxzZSxcclxuICAgICAgdG9vbHM6IGZhbHNlXHJcbiAgICB9XHJcbiAgfSxcclxuICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMubGlzdGVuVG8odGhpcywgJ2NoYW5nZTp2aXNpYmxlJywgdGhpcy51cGRhdGUpXHJcbiAgICBpZiAodGhpcy5nZW8pIHtcclxuICAgICAgRGFzaGJvYXJkLmZpbHRlckNvbGxlY3Rpb24ub24oJ2NoYW5nZTp2YWx1ZScsIHRoaXMudXBkYXRlLCB0aGlzKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgdG9KU09OOiBmdW5jdGlvbigpIHtcclxuICAgIHZhciBqc29uID0gQmFja2JvbmUuTW9kZWwucHJvdG90eXBlLnRvSlNPTi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAganNvbi5jaWQgPSB0aGlzLmNpZDtcclxuICAgIHJldHVybiBqc29uO1xyXG4gIH0sXHJcbiAgdXBkYXRlOiBmdW5jdGlvbigpIHtcclxuICAgIHZhciBzZWxmID0gdGhpc1xyXG4gICAgaWYgKHRoaXMuZ2V0KCd2aXNpYmxlJykpIHtcclxuICAgICAgdGhpcy5zZXQoJ2xvYWRpbmcnLCB0cnVlKVxyXG4gICAgICB0aGlzLmFib3J0KClcclxuICAgICAgdmFyIHVybCA9IHRoaXMubWFrZVF1ZXJ5KHRoaXMuZ2V0KCdhcGknKSlcclxuICAgICAgdGhpcy5yZXF1ZXN0ID0gJC5nZXRKU09OKHVybCwgZnVuY3Rpb24ocmVzKXtcclxuICAgICAgICBzZWxmLnNldCgnbG9hZGluZycsIGZhbHNlKVxyXG4gICAgICAgIHNlbGYuc2V0KCdkYXRhJywgcmVzKVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYWJvcnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKHRoaXMucmVxdWVzdCAmJiB0aGlzLnJlcXVlc3QucmVhZHlTdGF0ZSAhPT0gNCkge1xyXG4gICAgICB0aGlzLnJlcXVlc3QuYWJvcnQoKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgbWFrZVF1ZXJ5OiBmdW5jdGlvbih1cmwpIHtcclxuICAgIHZhciBzZWxmID0gdGhpc1xyXG4gICAgdXJsICs9ICc/J1xyXG4gICAgRGFzaGJvYXJkLmZpbHRlckNvbGxlY3Rpb24uZWFjaChmdW5jdGlvbihmaWx0ZXIpIHtcclxuICAgICAgaWYgKGZpbHRlci5nZXQoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgdXJsICs9IGZpbHRlci5nZXQoJ3R5cGUnKSArICc9JyArIGZpbHRlci5nZXQoJ3ZhbHVlJykgKyAnJidcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIHVybCArPSAndGFiPScgKyBEYXNoYm9hcmQuYWN0aXZldGFiXHJcbiAgICB2YXIgZ2VvdHlwZSA9ICcnXHJcbiAgICB2YXIgZ2VvZmlsdGVycyA9IERhc2hib2FyZC5maWx0ZXJDb2xsZWN0aW9uLndoZXJlKHt0eXBlOiAnZ2VvdHlwZSd9KVxyXG4gICAgaWYgKGdlb2ZpbHRlcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICBnZW90eXBlID0gZ2VvZmlsdGVyc1swXS5nZXQoJ3ZhbHVlJylcclxuICAgIH1cclxuICAgIHVybCArPSAnJmdlb3R5cGU9JyArIGdlb3R5cGVcclxuICAgIGlmICh0aGlzLmdldCgnZ2VvJykpIHtcclxuICAgICAgc2VsZi5zZXQoJ2tleScsIGdlb3R5cGUpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdXJsXHJcbiAgfSxcclxuICBjbGVhckRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGRhdGEgPSB0aGlzLmdldCgnZGF0YScpXHJcbiAgICBpZiAoZGF0YSAmJiBkYXRhWzBdKSB7XHJcbiAgICAgIGlmICh0aGlzLmdldCgnY2hhcnRfdHlwZScpID09PSAnc3RhdCcpIHtcclxuICAgICAgICB2YXIga2V5cyA9IF8ua2V5cyhkYXRhWzBdKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciBrZXlzID0gXy53aXRob3V0KF8ua2V5cyhkYXRhWzBdKSwgdGhpcy5nZXQoJ2tleScpKVxyXG4gICAgICB9XHJcbiAgICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihyb3cpIHtcclxuICAgICAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XHJcbiAgICAgICAgICByb3dba2V5XSA9IDBcclxuICAgICAgICB9KVxyXG4gICAgICB9KVxyXG4gICAgICB0aGlzLnNldCgnZGF0YScsIGRhdGEpXHJcbiAgICAgIHRoaXMudHJpZ2dlcignY2hhbmdlOmRhdGEnKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgc29ydEJ5S2V5OiBmdW5jdGlvbihkYXRhLCBjb2x1bW4pIHtcclxuICAgIGlmKCF0aGlzLmdldCgnc29ydF9rZXknKSkge1xyXG4gICAgICB0aGlzLnNldCgnc29ydF9rZXknLCBjb2x1bW4pXHJcbiAgICAgIHRoaXMuc2V0KCdzb3J0X2Rlc2MnLCBmYWxzZSlcclxuICAgIH0gZWxzZSBpZih0aGlzLmdldCgnc29ydF9rZXknKSA9PT0gY29sdW1uKSB7XHJcbiAgICAgIHZhciBzb3J0X29yZGVyID0gdGhpcy5nZXQoJ3NvcnRfZGVzYycpXHJcbiAgICAgIHRoaXMuc2V0KCdzb3J0X2Rlc2MnLCAhc29ydF9vcmRlcilcclxuICAgIH0gZWxzZSBpZih0aGlzLmdldCgnc29ydF9rZXknKSAhPT0gY29sdW1uKSB7XHJcbiAgICAgIHRoaXMuc2V0KCdzb3J0X2tleScsIGNvbHVtbilcclxuICAgICAgdGhpcy5zZXQoJ3NvcnRfZGVzYycsIGZhbHNlKVxyXG4gICAgfVxyXG4gICAgaWYodGhpcy5nZXQoJ3NvcnRfZGVzYycpKXtcclxuICAgICAgZGF0YSA9IF8uc29ydEJ5KGRhdGEsIGZ1bmN0aW9uKG9iail7IHJldHVybiBvYmpbY29sdW1uXSB9KS5yZXZlcnNlKClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRhdGEgPSBfLnNvcnRCeShkYXRhLCBmdW5jdGlvbihvYmopeyByZXR1cm4gb2JqW2NvbHVtbl0gfSlcclxuICAgIH1cclxuICAgIHJldHVybiBkYXRhXHJcbiAgfVxyXG59KVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDaGFydE1vZGVsIiwiY29uc3QgY2hyb21hdGggPSByZXF1aXJlKCdjaHJvbWF0aCcpXHJcbmNvbnN0IHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4vdGVtcGxhdGVzJykoSGFuZGxlYmFycylcclxuXHJcbmNvbnN0IENoYXJ0VmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcclxuICB0ZW1wbGF0ZTogdGVtcGxhdGVzLmNoYXJ0LFxyXG4gIGRhdGFMaW1pdDogMzAsXHJcbiAgZXZlbnRzOiB7XHJcbiAgICBcImNsaWNrIC5kb3dubG9hZFwiOiAgXCJkb3dubG9hZFwiLFxyXG4gICAgXCJjbGljayAuY29kZVwiOiAgXCJjb2RlXCIsXHJcbiAgICBcImNsaWNrIC50b3RhYmxlXCI6IFwidG9UYWJsZVwiLFxyXG4gICAgXCJjaGFuZ2UgLmNoYXJ0LXRvb2xzIGlucHV0XCI6ICdjaGFuZ2VDaGFydFRvb2xzJ1xyXG4gIH0sXHJcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzXHJcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbigpe1xyXG4gICAgICBzZWxmLmNoYXJ0ID0gZmFsc2VcclxuICAgICAgc2VsZi51cGRhdGUoKVxyXG4gICAgfSlcclxuICAgIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgJ2NoYW5nZTpkYXRhJywgdGhpcy51cGRhdGUpXHJcbiAgICB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsICdjaGFuZ2U6bG9hZGluZycsIHRoaXMubG9hZGluZylcclxuICAgIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgJ2NoYW5nZTprZXknLCB0aGlzLmNoYW5nZUtleSlcclxuICAgIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgJ2NoYW5nZTpjb2xvcnMnLCB0aGlzLmNoYW5nZUNvbG9ycylcclxuICAgIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgJ2NoYW5nZTp5TGFiZWwnLCB0aGlzLmNoYW5nZUxhYmVscylcclxuICAgIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgJ3JlbW92ZScsIHRoaXMucmVtb3ZlKVxyXG4gICAgdGhpcy5ob3ZlclRlbXBsYXRlID0gJ3t7bGFiZWx9fToge3t2YWx1ZX19ICcgKyB0aGlzLm1vZGVsLmdldCgndW5pdHMnKVxyXG4gIH0sXHJcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZSh0aGlzLm1vZGVsLnRvSlNPTigpKSlcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfSxcclxuICB1cGRhdGVDaGFydFRvb2xzOiBmdW5jdGlvbigpIHtcclxuICAgIHZhciBzZWxmID0gdGhpc1xyXG4gICAgaWYgKHRoaXMubW9kZWwuZ2V0KCd0b29scycpKSB7XHJcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5jaGFydC10b29scyBpbnB1dCcpLmVhY2goZnVuY3Rpb24oaWR4KSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBzZWxmLm1vZGVsLmdldCgneScpID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgdmFyIHkgPSBbc2VsZi5tb2RlbC5nZXQoJ3knKV1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdmFyIHkgPSBzZWxmLm1vZGVsLmdldCgneScpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgkKHRoaXMpLnZhbCgpLnNwbGl0KCcsJykuam9pbignLCcpID09PSB5LmpvaW4oJywnKSkge1xyXG4gICAgICAgICAgJCh0aGlzKS5hdHRyKCdjaGVja2VkJywgJ2NoZWNrZWQnKVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5jaGFydC10b29scycpLmhpZGUoKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgY2hhbmdlQ2hhcnRUb29sczogZnVuY3Rpb24oZSkge1xyXG4gICAgdmFyIHZhbHVlID0gJChlLmN1cnJlbnRUYXJnZXQpLnZhbCgpXHJcbiAgICB0aGlzLmNoYW5nZUNoYXJ0T3B0aW9uc09uS2V5KHZhbHVlKVxyXG4gICAgdGhpcy51cGRhdGUoKVxyXG4gIH0sXHJcbiAgY2hhbmdlQ2hhcnRPcHRpb25zT25LZXk6IGZ1bmN0aW9uKGtleSkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzXHJcbiAgICB0aGlzLmNoYXJ0Lm9wdGlvbnMudmFsdWVGb3JtYXQgPSBkMy5mb3JtYXQoJywuMGYnKVxyXG4gICAgdGhpcy5jaGFydC5vcHRpb25zLmJhckxhYmVsRm9ybWF0ID0gZDMuZm9ybWF0KCcsLjBmJylcclxuICAgIHRoaXMuY2hhcnQub3B0aW9ucy5iYXJMYWJlbHMgPSB0aGlzLm1vZGVsLmdldCgnYmFyTGFiZWxzJylcclxuXHJcbiAgICB2YXIgY29sb3JzID0gW11cclxuICAgICAgLCBrZXlzID0ga2V5LnNwbGl0KCcsJylcclxuICAgICAgLCB0b29sID0gXy5maW5kV2hlcmUodGhpcy5tb2RlbC5nZXQoJ3Rvb2xzJyksIHt2YWx1ZToga2V5fSlcclxuXHJcbiAgICBpZiAodG9vbCkge1xyXG4gICAgICBpZiAodG9vbC50eXBlKSB7XHJcbiAgICAgICAgaWYgKHRvb2wudHlwZSA9PT0gJ21vbmV5Jykge1xyXG4gICAgICAgICAgdGhpcy5jaGFydC5vcHRpb25zLmJhckxhYmVsRm9ybWF0ID0gZDMuZm9ybWF0KCckLC4ycycpXHJcbiAgICAgICAgICB0aGlzLmNoYXJ0Lm9wdGlvbnMudmFsdWVGb3JtYXQgPSBkMy5mb3JtYXQoJyQsLjBmJylcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRvb2wueUxhYmVsKSB7XHJcbiAgICAgICAgdGhpcy5jaGFydC5vcHRpb25zLnlMYWJlbCA9IHRvb2wueUxhYmVsXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRvb2wuY29sb3IpIHtcclxuICAgICAgICBjb2xvcnMgPSB0b29sLmNvbG9yXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFyIG5ld19jb2xvcnMgPSBfLndpdGhvdXQoRGFzaGJvYXJkLmNvbG9ycywgRGFzaGJvYXJkLnRhYl9jb2xvcnNbRGFzaGJvYXJkLmFjdGl2ZXRhYl0pXHJcbiAgICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSwgaSkge1xyXG4gICAgICAgICAgY29sb3JzLnB1c2goXHJcbiAgICAgICAgICAgIGNocm9tYXRoLmxpZ2h0ZW4oXHJcbiAgICAgICAgICAgICAgRGFzaGJvYXJkLnRhYl9jb2xvcnNbRGFzaGJvYXJkLmFjdGl2ZXRhYl0sXHJcbiAgICAgICAgICAgICAgKGkgKiA0MCkvMTAwXHJcbiAgICAgICAgICAgICkudG9TdHJpbmcoKVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnNvbGUubG9nKGNvbG9ycylcclxuXHJcbiAgICB0aGlzLmNoYXJ0Lm9wdGlvbnMueSA9IGtleXNcclxuICAgIHRoaXMubW9kZWwuc2V0KCd5Jywga2V5cylcclxuICAgIHRoaXMubW9kZWwuc2V0KCdjb2xvcnMnLCBjb2xvcnMpXHJcbiAgICB0aGlzLm1vZGVsLnNldCgnYmFyTGFiZWxGb3JtYXQnLCB0aGlzLmNoYXJ0Lm9wdGlvbnMuYmFyTGFiZWxGb3JtYXQpXHJcbiAgICB0aGlzLm1vZGVsLnNldCgndmFsdWVGb3JtYXQnLCB0aGlzLmNoYXJ0Lm9wdGlvbnMudmFsdWVGb3JtYXQpXHJcbiAgICB0aGlzLm1vZGVsLnNldCgneUxhYmVsJywgdGhpcy5jaGFydC5vcHRpb25zLnlMYWJlbClcclxuICB9LFxyXG4gIGNoYW5nZUtleTogZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAodGhpcy5jaGFydCkgdGhpcy5jaGFydC5vcHRpb25zLnggPSB0aGlzLm1vZGVsLmdldCgna2V5JylcclxuICB9LFxyXG4gIHVwZGF0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICBpZighdGhpcy5jaGFydCkge1xyXG4gICAgICB0aGlzLnJlc2l6ZSgpXHJcbiAgICAgIHRoaXMuZHJhd0NoYXJ0KClcclxuICAgIH1cclxuICAgIHZhciBkID0gdGhpcy5wcmVwRGF0YSh0aGlzLm1vZGVsLmdldCgnZGF0YScpKVxyXG4gICAgaWYgKGQubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMuZW1wdHkoZmFsc2UpXHJcbiAgICAgIHRoaXMuY2hhcnQudXBkYXRlKGQpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmVtcHR5KHRydWUpXHJcbiAgICB9XHJcbiAgfSxcclxuICByZXNpemU6IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGhlaWdodCA9IHRoaXMuJGVsLmZpbmQoJy5jaGFydCcpLmlubmVySGVpZ2h0KClcclxuICAgICAgLSB0aGlzLiRlbC5maW5kKCcudGl0bGUnKS5vdXRlckhlaWdodCh0cnVlKVxyXG4gICAgdGhpcy4kZWwuZmluZCgnLmNoYXJ0LWlubmVyJykuY3NzKCdoZWlnaHQnLCBoZWlnaHQpXHJcbiAgfSxcclxuICByZW1vdmU6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy4kZWwucGFyZW50KCkucmVtb3ZlKClcclxuICB9LFxyXG4gIGNoYW5nZUxhYmVsczogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmNoYXJ0LnNldFlBeGlzTGFiZWwodGhpcy5tb2RlbC5nZXQoJ3lMYWJlbCcpKVxyXG4gIH0sXHJcbiAgY2hhbmdlQ29sb3JzOiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuY2hhcnQuc2V0Q29sb3IodGhpcy5tb2RlbC5nZXQoJ2NvbG9ycycpKVxyXG4gIH0sXHJcbiAgc2V0Q29sb3JzOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXNcclxuICAgIHZhciBjb2xvcnMgPSBbXVxyXG4gICAgaWYgKHRoaXMubW9kZWwuZ2V0KCdmaWx0ZXJfY29sb3InKSA9PT0gdHJ1ZSkge1xyXG4gICAgICBfLmVhY2goZGF0YSwgZnVuY3Rpb24oZCkge1xyXG4gICAgICAgIHZhciB4ID0gZFtzZWxmLm1vZGVsLmdldCgna2V5JyldXHJcbiAgICAgICAgdmFyIGZpbHRlcnMgPSBEYXNoYm9hcmQuZmlsdGVyQ29sbGVjdGlvbi53aGVyZSh7dmFsdWU6IHh9KVxyXG4gICAgICAgIGlmIChmaWx0ZXJzLmxlbmd0aCkge1xyXG4gICAgICAgICAgaWYgKGZpbHRlcnNbMF0uZ2V0KCdjb2xvcicpKSB7XHJcbiAgICAgICAgICAgIGNvbG9ycy5wdXNoKGZpbHRlcnNbMF0uZ2V0KCdjb2xvcicpKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgaWYgKGNvbG9ycy5sZW5ndGgpIHtcclxuICAgICAgICBzZWxmLm1vZGVsLnNldCgnY29sb3JzJywgY29sb3JzKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBsb2FkaW5nOiBmdW5jdGlvbihlKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXNcclxuICAgIGlmICh0aGlzLm1vZGVsLmdldCgnbG9hZGluZycpKSB7XHJcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5sb2FkZXInKS5zaG93KClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5sb2FkZXInKS5oaWRlKClcclxuICAgIH1cclxuICB9LFxyXG4gIHByZXBEYXRhOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICByZXR1cm4gZGF0YVxyXG4gIH0sXHJcbiAgZG93bmxvYWQ6IGZ1bmN0aW9uKGUpIHtcclxuICAgIHZhciB1cmwgPSB0aGlzLm1vZGVsLm1ha2VRdWVyeSh0aGlzLm1vZGVsLmdldCgnYXBpJykpXHJcbiAgICB1cmwgKz0gJyZjc3Y9dHJ1ZSdcclxuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdXJsXHJcbiAgfSxcclxuICBjb2RlOiBmdW5jdGlvbihlKSB7XHJcbiAgICB2YXIgdXJsID0gdGhpcy5tb2RlbC5tYWtlUXVlcnkoKVxyXG4gICAgd2luZG93Lm9wZW4odXJsKVxyXG4gIH0sXHJcbiAgdG9UYWJsZTogZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgVGFibGVWaWV3ID0gcmVxdWlyZSgnLi9UYWJsZVZpZXcnKVxyXG4gICAgdmFyIHZpZXcgPSBuZXcgVGFibGVWaWV3KHtcclxuICAgICAgbW9kZWw6IHRoaXMubW9kZWwsXHJcbiAgICAgIGNoYXJ0OiB0aGlzLmNoYXJ0XHJcbiAgICB9KVxyXG4gICAgdGhpcy4kZWwucGFyZW50KCkuaHRtbCh2aWV3LnJlbmRlcigpLmVsKVxyXG4gICAgdmlldy5yZXNpemUoKVxyXG4gIH0sXHJcbiAgZW1wdHk6IGZ1bmN0aW9uKGVtcHR5KSB7XHJcbiAgICBpZiAoZW1wdHkpIHtcclxuICAgICAgdGhpcy4kZWwuZmluZCgnLnRoZS1jaGFydCcpLmhpZGUoKVxyXG4gICAgICB0aGlzLiRlbC5maW5kKCcuY2hhcnQtdG9vbHMnKS5oaWRlKClcclxuICAgICAgdGhpcy4kZWwuZmluZCgnLm5vZGF0YScpLnNob3coKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy4kZWwuZmluZCgnLnRoZS1jaGFydCcpLnNob3coKVxyXG4gICAgICBpZiAodGhpcy5tb2RlbC5nZXQoJ3Rvb2xzJykpIHRoaXMuJGVsLmZpbmQoJy5jaGFydC10b29scycpLnNob3coKVxyXG4gICAgICB0aGlzLiRlbC5maW5kKCcubm9kYXRhJykuaGlkZSgpXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDaGFydFZpZXciLCJcclxuY29uc3QgTWFwVmlldyA9IHJlcXVpcmUoJy4vTWFwVmlldycpXHJcbmNvbnN0IENoYXJ0TW9kZWwgPSByZXF1aXJlKCcuL0NoYXJ0TW9kZWwnKVxyXG5jb25zdCBCYXJDaGFydFZpZXcgPSByZXF1aXJlKCcuL0JhckNoYXJ0VmlldycpXHJcbmNvbnN0IFN0YWNrZWRCYXJDaGFydFZpZXcgPSByZXF1aXJlKCcuL1N0YWNrZWRCYXJDaGFydFZpZXcnKVxyXG5jb25zdCBIb3Jpem9udGFsQmFyQ2hhcnRWaWV3ID0gcmVxdWlyZSgnLi9Ib3Jpem9udGFsQmFyQ2hhcnRWaWV3JylcclxuY29uc3QgVGFibGVWaWV3ID0gcmVxdWlyZSgnLi9UYWJsZVZpZXcnKVxyXG5jb25zdCBMaW5lQ2hhcnRWaWV3ID0gcmVxdWlyZSgnLi9MaW5lQ2hhcnRWaWV3JylcclxuY29uc3QgUGllQ2hhcnRWaWV3ID0gcmVxdWlyZSgnLi9QaWVDaGFydFZpZXcnKVxyXG5jb25zdCBTdGF0VmlldyA9IHJlcXVpcmUoJy4vU3RhdFZpZXcnKVxyXG5jb25zdCBGaWx0ZXJDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi9GaWx0ZXJDb2xsZWN0aW9uJylcclxuY29uc3QgRmlsdGVyTWVudVZpZXcgPSByZXF1aXJlKCcuL0ZpbHRlck1lbnVWaWV3JylcclxuY29uc3QgQ2hhcnRDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi9DaGFydENvbGxlY3Rpb24nKVxyXG5jb25zdCB0ZW1wbGF0ZXMgPSByZXF1aXJlKCcuL3RlbXBsYXRlcycpKEhhbmRsZWJhcnMpXHJcblxyXG52YXIgRGFzaGJvYXJkID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xyXG4gIGNvbG9yczogWycjMjc5MEIwJywgJyMyQjRFNzInLCAnIzk0QkE2NSddLFxyXG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZXMuZGFzaGJvYXJkLFxyXG4gIGVsOiAkKFwiLmRhc2hib2FyZFwiKSxcclxuICBhY3RpdmV0YWI6ICdob21lJyxcclxuICBzb2NyYXRhX2xpbmtzOiB7XHJcbiAgICAncmVuZXdhYmxlJzogJ2h0dHBzOi8vZGF0YS5tYXJ5bGFuZC5nb3YvZGF0YXNldC9SZW5ld2FibGUtRW5lcmd5LUdlb2NvZGVkL21xdDMtZXU0cycsXHJcbiAgICAnZWZmaWNpZW5jeSc6ICdodHRwczovL2RhdGEubWFyeWxhbmQuZ292L2RhdGFzZXQvRW5lcmd5LUVmZmljaWVuY3ktR2VvY29kZWQvM2FmeS04ZmJyJyxcclxuICAgICd0cmFuc3BvcnRhdGlvbic6ICdodHRwczovL2RhdGEubWFyeWxhbmQuZ292L2RhdGFzZXQvVHJhbnNwb3J0YXRpb24tR2VvY29kZWQvNGR2cy1qdHhxJ1xyXG4gIH0sXHJcbiAgdGFiX2NvbG9yczoge1xyXG4gICAgJ3JlbmV3YWJsZSc6ICcjMTJBNkI4JyxcclxuICAgICdlZmZpY2llbmN5JzogJyMyQjRFNzInLFxyXG4gICAgJ3RyYW5zcG9ydGF0aW9uJzogJyNFNTk3MkYnXHJcbiAgfSxcclxuICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICB0aGlzLmZpbHRlckNvbGxlY3Rpb24gPSBuZXcgRmlsdGVyQ29sbGVjdGlvbigpXHJcbiAgICB0aGlzLm1ha2VGaWx0ZXJzKClcclxuICAgIHRoaXMuZmlsdGVyQ29sbGVjdGlvbi5vbignY2hhbmdlOmFjdGl2ZScsIHRoaXMudXBkYXRlLCB0aGlzKVxyXG4gICAgdGhpcy5maWx0ZXJDb2xsZWN0aW9uLm9uKCdhZGQnLCB0aGlzLnVwZGF0ZSwgdGhpcylcclxuICAgIHRoaXMuZmlsdGVyQ29sbGVjdGlvbi5vbigncmVtb3ZlJywgdGhpcy51cGRhdGUsIHRoaXMpXHJcblxyXG4gICAgdGhpcy5jaGFydENvbGxlY3Rpb24gPSBuZXcgQ2hhcnRDb2xsZWN0aW9uKClcclxuICAgIHRoaXMuY2hhcnRDb2xsZWN0aW9uLm9uKCdhZGQnLCB0aGlzLnJlbmRlckNoYXJ0LCB0aGlzKVxyXG4gICAgdGhpcy5tYWtlQ2hhcnRzKClcclxuICB9LFxyXG4gIG1ha2VDaGFydHM6IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzXHJcbiAgICB0aGlzLm1hcE1vZGVsID0ge3RpdGxlOiBcIk1hcFwiLCBhcGk6ICdhcGkvZ2V0UG9pbnRzJywga2V5OiAnZ2VvJywgY2hhcnRfdHlwZTogJ21hcCd9XHJcbiAgICB0aGlzLmNoYXJ0cyA9IHtcclxuICAgICAgc3RhdHM6IHtcclxuICAgICAgICB0aXRsZTogXCJJbnZlc3RtZW50IFN0YXRzXCIsXHJcbiAgICAgICAgYXBpOiAnYXBpL2dldFN0YXRzJyxcclxuICAgICAgICBrZXk6ICdjb250cmlidXRpb24nLFxyXG4gICAgICAgIGNoYXJ0X3R5cGU6ICdzdGF0JyxcclxuICAgICAgICBmb3JtYXQ6IGQzLmZvcm1hdCgnJCwnKSxcclxuICAgICAgICB3aWR0aDogJ2NvbC1tZC02IGNvbC1sZy0zJyxcclxuICAgICAgICB0b29sYmFyOiBmYWxzZSxcclxuICAgICAgICBzb3J0OiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICB0ZWNobm9sb2d5OiB7XHJcbiAgICAgICAgdGl0bGU6IFwiVGVjaG5vbG9neSBUeXBlXCIsXHJcbiAgICAgICAgYXBpOiAnYXBpL2dldFRlY2hub2xvZ3knLFxyXG4gICAgICAgIHk6ICdDb250cmlidXRpb24nLFxyXG4gICAgICAgIGtleTogJ1RlY2hub2xvZ3knLFxyXG4gICAgICAgIGNoYXJ0X3R5cGU6ICdwaWUnLFxyXG4gICAgICAgIGZpbHRlcl9jb2xvcjogdHJ1ZSxcclxuICAgICAgICB1bml0czogJycsXHJcbiAgICAgICAgdmFsdWVGb3JtYXQ6IGQzLmZvcm1hdCgnJCwuMGYnKSxcclxuICAgICAgICB3aWR0aDogJ2NvbC1sZy0zIGNvbC1tZC0zIGNvbC1zbS0xMicsXHJcbiAgICAgICAgdG9vbHM6IFt7dmFsdWU6ICdDb250cmlidXRpb24nLCB0ZXh0OiAnQ29udHJpYnV0aW9uJywgdHlwZTogJ21vbmV5J30sIHt2YWx1ZTogJ1Byb2plY3RzJywgdGV4dDogJ1Byb2plY3RzJ31dXHJcbiAgICAgIH0sXHJcbiAgICAgIG1lYV9jb250cmlidXRpb246IHtcclxuICAgICAgICB0aXRsZTogXCJDb250cmlidXRpb24gQnkgUmVnaW9uXCIsXHJcbiAgICAgICAgYXBpOiAnYXBpL2dldENvbnRyaWJ1dGlvbicsXHJcbiAgICAgICAga2V5OiAnQ291bnR5JyxcclxuICAgICAgICB5OiBbJ01FQSBDb250cmlidXRpb24nXSxcclxuICAgICAgICBjaGFydF90eXBlOiAnc3RhY2tlZCcsXHJcbiAgICAgICAgZ3JvdXA6ICdnZW8nLFxyXG4gICAgICAgIHVuaXRzOiAnJyxcclxuICAgICAgICB2YWx1ZUZvcm1hdDogZDMuZm9ybWF0KCckLC4wZicpLFxyXG4gICAgICAgIHdpZHRoOiAnY29sLWxnLTYgY29sLW1kLTknLFxyXG4gICAgICAgIGNvbG9yczogW3NlbGYuY29sb3JzWzBdXSxcclxuICAgICAgICB5TGFiZWw6ICdEb2xsYXJzJyxcclxuICAgICAgICB4TGFiZWxBbmdsZTogLTYwLFxyXG4gICAgICAgIHhBeGlzTGFiZWxQYWRkaW5nOiA1MCxcclxuICAgICAgICBsZWdlbmQ6IHRydWUsXHJcbiAgICAgICAgZG9udEZvcm1hdDogWydJbnZlc3RtZW50IExldmVyYWdlJ10sXHJcbiAgICAgICAgZ2VvOiB0cnVlLFxyXG4gICAgICAgIHRvb2xzOiBbe3ZhbHVlOiAnTUVBIENvbnRyaWJ1dGlvbicsIHRleHQ6ICdNRUEgQ29udHJpYnV0aW9uJywgdHlwZTogJ21vbmV5JywgeUxhYmVsOiAnRG9sbGFycyd9LCB7dmFsdWU6ICdNRUEgQ29udHJpYnV0aW9uLExldmVyYWdlZCBJbnZlc3RtZW50JywgdGV4dDogJ0FsbCBDb250cmlidXRpb25zJywgdHlwZTogJ21vbmV5JywgeUxhYmVsOiAnRG9sbGFycyd9XVxyXG4gICAgICB9LFxyXG4gICAgICBwcm9ncmFtOiB7XHJcbiAgICAgICAgdGl0bGU6IFwiQWN0aXZpdHkgQnkgUHJvZ3JhbVwiLFxyXG4gICAgICAgIGFwaTogJ2FwaS9nZXRQcm9ncmFtTmFtZScsXHJcbiAgICAgICAga2V5OiAnUHJvZ3JhbSBOYW1lJyxcclxuICAgICAgICB5OiBbJ0NvbnRyaWJ1dGlvbiddLFxyXG4gICAgICAgIGNvbG9yczogW3NlbGYuY29sb3JzWzBdXSxcclxuICAgICAgICBjaGFydF90eXBlOiAnYmFyJyxcclxuICAgICAgICB1bml0czogJycsXHJcbiAgICAgICAgYmFyTGFiZWxzOiB0cnVlLFxyXG4gICAgICAgIHlMYWJlbDogJ0RvbGxhcnMnLFxyXG4gICAgICAgIHZhbHVlRm9ybWF0OiBkMy5mb3JtYXQoJyQsLjBmJyksXHJcbiAgICAgICAgdG9vbHM6IFt7dmFsdWU6ICdDb250cmlidXRpb24nLCB0ZXh0OiAnQ29udHJpYnV0aW9uJywgdHlwZTogJ21vbmV5JywgeUxhYmVsOiAnRG9sbGFycyd9LCB7dmFsdWU6ICdQcm9qZWN0cycsIHRleHQ6ICdQcm9qZWN0cycsIHlMYWJlbDogJ1Byb2plY3RzJ31dLFxyXG4gICAgICAgIGJhckxhYmVsRm9ybWF0OiBkMy5mb3JtYXQoJyQuMnMnKVxyXG4gICAgICB9LFxyXG4gICAgICBzZWN0b3I6IHtcclxuICAgICAgICB0aXRsZTogXCJBY3Rpdml0eSBCeSBTZWN0b3JcIixcclxuICAgICAgICBhcGk6ICdhcGkvZ2V0U2VjdG9yJyxcclxuICAgICAgICBrZXk6ICdTZWN0b3InLFxyXG4gICAgICAgIHk6IFsnQ29udHJpYnV0aW9uJ10sXHJcbiAgICAgICAgY29sb3JzOiBbc2VsZi5jb2xvcnNbMF1dLFxyXG4gICAgICAgIGNoYXJ0X3R5cGU6ICdiYXInLFxyXG4gICAgICAgIHlMYWJlbDogJ0RvbGxhcnMnLFxyXG4gICAgICAgIHVuaXRzOiAnJyxcclxuICAgICAgICBiYXJMYWJlbHM6IHRydWUsXHJcbiAgICAgICAgdmFsdWVGb3JtYXQ6IGQzLmZvcm1hdCgnJCwuMGYnKSxcclxuICAgICAgICB0b29sczogW3t2YWx1ZTogJ0NvbnRyaWJ1dGlvbicsIHRleHQ6ICdDb250cmlidXRpb24nLCB0eXBlOiAnbW9uZXknLCB5TGFiZWw6ICdEb2xsYXJzJ30sXHJcbiAgICAgICAge3ZhbHVlOiAnUHJvamVjdHMnLCB0ZXh0OiAnUHJvamVjdHMnLCB5TGFiZWw6ICdQcm9qZWN0cyd9XSxcclxuICAgICAgICBiYXJMYWJlbEZvcm1hdDogZDMuZm9ybWF0KCckLjJzJylcclxuICAgICAgfSxcclxuICAgICAgZWxlY3RyaWNpdHk6IHt0aXRsZTogXCJFbGVjdHJpY2l0eSBTYXZpbmdzIEJ5IFJlZ2lvblwiLCBhcGk6ICdhcGkvZ2V0U2F2aW5ncycsIGtleTogJ0NvdW50eScsIHk6IFsnU2F2aW5ncyddLCBjaGFydF90eXBlOiAnYmFyJywgdW5pdHM6ICdrV2gnLCBnZW86IHRydWUsIHdpZHRoOiAnY29sLW1kLTYgY29sLXNtLTEyJywgY29sb3JzOiBbc2VsZi5jb2xvcnNbMF1dLCB5TGFiZWw6ICdrV2gnLCB3aWR0aDogJ2NvbC1sZy02IGNvbC1tZC0xMicsIHhMYWJlbEFuZ2xlOiAtNjAsIHhBeGlzTGFiZWxQYWRkaW5nOiA1MH0sXHJcbiAgICAgIHJlZHVjdGlvbjoge3RpdGxlOiBcIkNPMiBFbWlzc2lvbnMgUmVkdWN0aW9ucyBCeSBSZWdpb25cIiwgYXBpOiAnYXBpL2dldFJlZHVjdGlvbnMnLCBrZXk6ICdDb3VudHknLCB5OiBbJ1JlZHVjdGlvbiddLCBjaGFydF90eXBlOiAnYmFyJywgdW5pdHM6ICd0b25zJywgZ2VvOiB0cnVlLCB3aWR0aDogJ2NvbC1tZC02IGNvbC1zbS0xMicsIGNvbG9yczogW3NlbGYuY29sb3JzWzBdXSwgeUxhYmVsOiAnVG9ucycsIHdpZHRoOiAnY29sLWxnLTYgY29sLW1kLTEyJywgeExhYmVsQW5nbGU6IC02MCwgeEF4aXNMYWJlbFBhZGRpbmc6IDUwfSxcclxuICAgICAgcmVkdWN0aW9uVGltZToge3RpdGxlOiBcIkNPMiBSZWR1Y3Rpb25cIiwgYXBpOiAnYXBpL2dldFJlZHVjdGlvbk92ZXJUaW1lJywga2V5OiAnRGF0ZScsIHk6ICdSZWR1Y3Rpb24nLCBjaGFydF90eXBlOiAnbGluZScsIHVuaXRzOiAndG9ucycsIGxhYmVsRm9ybWF0OiBkMy50aW1lLmZvcm1hdChcIiVtLyV5XCIpLCBzaG93VW5pdHNJblRhYmxlOiB0cnVlLCB5TGFiZWw6ICdUb25zJ30sXHJcbiAgICAgIHN0YXRpb25fdGVjaG5vbG9neToge1xyXG4gICAgICAgIHRpdGxlOiBcIkNoYXJnaW5nL0Z1ZWxpbmcgU3RhdGlvbiBUZWNobm9sb2d5XCIsXHJcbiAgICAgICAgYXBpOiAnYXBpL2dldFN0YXRpb25UZWNobm9sb2d5JyxcclxuICAgICAgICBrZXk6ICdUZWNobm9sb2d5JyxcclxuICAgICAgICB5OiAnU3RhdGlvbnMnLFxyXG4gICAgICAgIGNoYXJ0X3R5cGU6ICdwaWUnLFxyXG4gICAgICAgIHVuaXRzOiAnJyxcclxuICAgICAgICB2YWx1ZUZvcm1hdDogZDMuZm9ybWF0KCcsLjBmJyksXHJcbiAgICAgICAgZmlsdGVyX2NvbG9yOiB0cnVlLFxyXG4gICAgICAgIHdpZHRoOiAnY29sLWxnLTMgY29sLW1kLTMgY29sLXNtLTEyJyxcclxuICAgICAgICB0b29sczogW3t2YWx1ZTogJ0NvbnRyaWJ1dGlvbicsIHRleHQ6ICdDb250cmlidXRpb24nLCB0eXBlOiAnbW9uZXknfSwge3ZhbHVlOiAnU3RhdGlvbnMnLCB0ZXh0OiAnU3RhdGlvbnMnfV1cclxuICAgICAgfSxcclxuICAgICAgdmVoaWNsZV90ZWNobm9sb2d5OiB7XHJcbiAgICAgICAgdGl0bGU6IFwiVmVoaWNsZSBUZWNobm9sb2d5XCIsXHJcbiAgICAgICAgYXBpOiAnYXBpL2dldFZlaGljbGVUZWNobm9sb2d5JyxcclxuICAgICAgICBrZXk6ICdUZWNobm9sb2d5JyxcclxuICAgICAgICB5OiAnUHJvamVjdHMnLFxyXG4gICAgICAgIGNoYXJ0X3R5cGU6ICdwaWUnLFxyXG4gICAgICAgIHVuaXRzOiAnJyxcclxuICAgICAgICB2YWx1ZUZvcm1hdDogZDMuZm9ybWF0KCckLC4wZicpLFxyXG4gICAgICAgIGZpbHRlcl9jb2xvcjogdHJ1ZSxcclxuICAgICAgICB3aWR0aDogJ2NvbC1sZy0zIGNvbC1tZC0zIGNvbC1zbS0xMicsXHJcbiAgICAgICAgdG9vbHM6IFt7dmFsdWU6ICdDb250cmlidXRpb24nLCB0ZXh0OiAnQ29udHJpYnV0aW9uJywgdHlwZTogJ21vbmV5J30sIHt2YWx1ZTogJ1Byb2plY3RzJywgdGV4dDogJ1Byb2plY3RzJ31dXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMuY2hhcnRzLnNlY3RvcjIgPSBfLmNsb25lKHRoaXMuY2hhcnRzLnNlY3RvcilcclxuICAgIHRoaXMuY2hhcnRzLnNlY3RvcjIud2lkdGggPSAnY29sLWxnLTMgY29sLW1kLTMgY29sLXNtLTEyJ1xyXG4gICAgdGhpcy5jaGFydHMucHJvZ3JhbTIgPSBfLmNsb25lKHRoaXMuY2hhcnRzLnByb2dyYW0pXHJcbiAgICB0aGlzLmNoYXJ0cy5wcm9ncmFtMi53aWR0aCA9ICdjb2wtbGctNiBjb2wtbWQtMTInXHJcbiAgICB0aGlzLmNoYXJ0X2hhc2ggPSB7XHJcbiAgICAgIGVmZmljaWVuY3k6IFt0aGlzLmNoYXJ0cy5zdGF0cywgXHJcbiAgICAgIHRoaXMuY2hhcnRzLnNlY3RvcjIsIFxyXG4gICAgICB0aGlzLmNoYXJ0cy5tZWFfY29udHJpYnV0aW9uLCBcclxuICAgICAgdGhpcy5jaGFydHMucHJvZ3JhbTIsIHRoaXMuY2hhcnRzLmVsZWN0cmljaXR5LCBcclxuICAgICAgdGhpcy5jaGFydHMucmVkdWN0aW9uXSxcclxuICAgICAgcmVuZXdhYmxlOiBbdGhpcy5jaGFydHMuc3RhdHMsIHRoaXMuY2hhcnRzLnRlY2hub2xvZ3ksIHRoaXMuY2hhcnRzLm1lYV9jb250cmlidXRpb24sIHRoaXMuY2hhcnRzLnByb2dyYW0sIHRoaXMuY2hhcnRzLnNlY3RvciwgdGhpcy5jaGFydHMucmVkdWN0aW9uVGltZVxyXG4gICAgICBdLFxyXG4gICAgICB0cmFuc3BvcnRhdGlvbjogW3RoaXMuY2hhcnRzLnN0YXRzLCB0aGlzLmNoYXJ0cy52ZWhpY2xlX3RlY2hub2xvZ3ksIHRoaXMuY2hhcnRzLm1lYV9jb250cmlidXRpb24sIHRoaXMuY2hhcnRzLnNlY3RvciwgdGhpcy5jaGFydHMuc3RhdGlvbl90ZWNobm9sb2d5XSxcclxuICAgICAgY2FwYWNpdHlfY2hhcnRzOiBbXHJcbiAgICAgICAge3RpdGxlOiBcIkNhcGFjaXR5IEJ5IEFyZWFcIiwgYXBpOiAnYXBpL2dldENhcGFjaXR5QnlBcmVhJywga2V5OiAnQ291bnR5JywgeTogWydDYXBhY2l0eSddLCBjaGFydF90eXBlOiAnYmFyJywgc2hvd1VuaXRzSW5UYWJsZTogdHJ1ZSwgZ2VvOiB0cnVlLCB2YWx1ZUZvcm1hdDogZDMuZm9ybWF0KCcsLjJmJyksIHdpZHRoOiAnY29sLW1kLTYgY29sLXNtLTEyJ30sXHJcbiAgICAgICAge3RpdGxlOiBcIkNhcGFjaXR5IEJ5IFNlY3RvclwiLCBhcGk6ICdhcGkvZ2V0Q2FwYWNpdHlCeVNlY3RvcicsIGtleTogJ1NlY3RvcicsIHk6IFsnQ2FwYWNpdHknXSwgY2hhcnRfdHlwZTogJ2JhcicsIHNob3dVbml0c0luVGFibGU6IHRydWV9LFxyXG4gICAgICAgIHt0aXRsZTogXCJDYXBhY2l0eSBHcm93dGhcIiwgYXBpOiAnYXBpL2dldENhcGFjaXR5T3ZlclRpbWUnLCBrZXk6ICdEYXRlJywgeTogWydDYXBhY2l0eSddLCBjaGFydF90eXBlOiAnbGluZScsIGxhYmVsRm9ybWF0OiBkMy50aW1lLmZvcm1hdChcIiVZXCIpLCBzaG93VW5pdHNJblRhYmxlOiB0cnVlLCBmaWx0ZXJfY29sb3I6IHRydWV9LFxyXG4gICAgICBdXHJcbiAgICB9XHJcbiAgfSxcclxuICBtYWtlRmlsdGVyczogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmVmZmllbmN5ID0gW11cclxuICAgIHRoaXMucmVuZXdhYmxlcyA9IFtcclxuICAgICAge3ZhbHVlOiAnU29sYXIgUFYnLCBjb2xvcjogJyNmMzljMTInLCB0eXBlOiAndGVjaG5vbG9neScsIHVuaXRzOiAna1cnfSxcclxuICAgICAge3ZhbHVlOiAnU29sYXIgSG90IFdhdGVyJywgY29sb3I6ICcjMTZhMDg1JywgdHlwZTogJ3RlY2hub2xvZ3knLCB1bml0czogJ3NxZnQnfSxcclxuICAgICAge3ZhbHVlOiAnR2VvdGhlcm1hbCcsIGNvbG9yOiAnI0ZGNDEzNicsIHR5cGU6ICd0ZWNobm9sb2d5JywgdW5pdHM6ICd0b25zJ30sXHJcbiAgICAgIHt2YWx1ZTogJ1dvb2QgQnVybmluZyBTdG92ZScsIGNvbG9yOiAnI0ZGREMwMCcsIHR5cGU6ICd0ZWNobm9sb2d5JywgdW5pdHM6ICdCVFVzL2hyJ30sXHJcbiAgICAgIHt2YWx1ZTogJ1dpbmQnLCBjb2xvcjogJyMzNDk4ZGInLCB0eXBlOiAndGVjaG5vbG9neScsIHVuaXRzOiAna1cnfSxcclxuICAgICAge3ZhbHVlOiAnQmlvaGVhdCcsIGNvbG9yOiAnIzliNTliNicsIHR5cGU6ICd0ZWNobm9sb2d5JywgdW5pdHM6ICdnYWxsb25zJ30sXHJcbiAgICAgIHt2YWx1ZTogJ0xhbmRmaWxsIEdhcycsIGNvbG9yOiAnIzAxRkY3MCcsIHR5cGU6ICd0ZWNobm9sb2d5JywgdW5pdHM6ICdrVyd9XHJcbiAgICBdXHJcbiAgICB0aGlzLnZlaGljbGVfdGVjaG5vbG9neSA9IFtcclxuICAgICAge3ZhbHVlOiAnRWxlY3RyaWMnLCBjb2xvcjogJyMwMDc0RDknLCB0eXBlOiAndmVoaWNsZV90ZWNobm9sb2d5J30sXHJcbiAgICAgIC8ve3ZhbHVlOiAnQmlvZGllc2VsJywgY29sb3I6ICcjZjM5YzEyJywgdHlwZTogJ3ZlaGljbGVfdGVjaG5vbG9neSd9LFxyXG4gICAgICAvL3t2YWx1ZTogJ0U4NScsIGNvbG9yOiAnIzJFQ0M0MCcsIHR5cGU6ICd2ZWhpY2xlX3RlY2hub2xvZ3knfSxcclxuICAgICAge3ZhbHVlOiAnTmF0dXJhbCBHYXMgKENORyknLCBjb2xvcjogJyNGRkRDMDAnLCB0eXBlOiAndmVoaWNsZV90ZWNobm9sb2d5J30sXHJcbiAgICAgIC8ve3ZhbHVlOiAnTmF0dXJhbCBHYXMgKExORyknLCBjb2xvcjogJyMzOUNDQ0MnLCB0eXBlOiAndmVoaWNsZV90ZWNobm9sb2d5J30sXHJcbiAgICAgIHt2YWx1ZTogJ1Byb3BhbmUnLCBjb2xvcjogJyNGRjQxMzYnLCB0eXBlOiAndmVoaWNsZV90ZWNobm9sb2d5J30sXHJcbiAgICAgIC8ve3ZhbHVlOiAnSHlkcm9nZW4nLCBjb2xvcjogJyNGMDEyQkUnLCB0eXBlOiAndmVoaWNsZV90ZWNobm9sb2d5J30sXHJcbiAgICAgIHt2YWx1ZTogJ0h5YnJpZCcsIGNvbG9yOiAnI0IxMERDOScsIHR5cGU6ICd2ZWhpY2xlX3RlY2hub2xvZ3knfSxcclxuICAgICAge3ZhbHVlOiAnSHlicmlkIEVsZWN0cmljJywgY29sb3I6ICcjNjI2ZjlhJywgdHlwZTogJ3ZlaGljbGVfdGVjaG5vbG9neSd9LFxyXG4gICAgICB7dmFsdWU6ICdJZGxlIFJlZHVjdGlvbicsIGNvbG9yOiAnIzAxRkY3MCcsIHR5cGU6ICd2ZWhpY2xlX3RlY2hub2xvZ3knfSxcclxuICAgIF1cclxuICAgIHRoaXMuc3RhdGlvbnMgPSBbXHJcbiAgICAgIHt2YWx1ZTogJ0VsZWN0cmljJywgY29sb3I6ICcjMDA3NEQ5JywgdHlwZTogJ2NoYXJnaW5nX2Z1ZWxpbmdfc3RhdGlvbl90ZWNobm9sb2d5J30sXHJcbiAgICAgIHt2YWx1ZTogJ0Jpb2RpZXNlbCcsIGNvbG9yOiAnI2YzOWMxMicsIHR5cGU6ICdjaGFyZ2luZ19mdWVsaW5nX3N0YXRpb25fdGVjaG5vbG9neScsIHZpc2libGU6IGZhbHNlfSxcclxuICAgICAge3ZhbHVlOiAnRTg1JywgY29sb3I6ICcjMkVDQzQwJywgdHlwZTogJ2NoYXJnaW5nX2Z1ZWxpbmdfc3RhdGlvbl90ZWNobm9sb2d5J30sXHJcbiAgICAgIHt2YWx1ZTogJ05hdHVyYWwgR2FzIChDTkcpJywgY29sb3I6ICcjRkZEQzAwJywgdHlwZTogJ2NoYXJnaW5nX2Z1ZWxpbmdfc3RhdGlvbl90ZWNobm9sb2d5J30sXHJcbiAgICAgIHt2YWx1ZTogJ0xQRycsIGNvbG9yOiAnI0ZGNDEzNicsIHR5cGU6ICdjaGFyZ2luZ19mdWVsaW5nX3N0YXRpb25fdGVjaG5vbG9neScsIHZpc2libGU6IGZhbHNlfSxcclxuICAgICAge3ZhbHVlOiAnQmFjay11cCBHZW5lcmF0b3InLCBjb2xvcjogJyM3RDdGODEnLCB0eXBlOiAnY2hhcmdpbmdfZnVlbGluZ19zdGF0aW9uX3RlY2hub2xvZ3knfVxyXG4gICAgXVxyXG4gICAgdGhpcy5wcm9ncmFtdHlwZXMgPSBbXHJcbiAgICAgIHt2YWx1ZTogJ0dyYW50JywgdHlwZTogJ3Byb2dyYW1fdHlwZSd9LFxyXG4gICAgICB7dmFsdWU6ICdSZWJhdGUvVm91Y2hlcicsIHR5cGU6ICdwcm9ncmFtX3R5cGUnfSxcclxuICAgICAge3ZhbHVlOiAnRmluYW5jaW5nJywgdHlwZTogJ3Byb2dyYW1fdHlwZSd9LFxyXG4gICAgICB7dmFsdWU6ICdUYXggQ3JlZGl0JywgdHlwZTogJ3Byb2dyYW1fdHlwZSd9LFxyXG4gICAgICB7dmFsdWU6ICdPdGhlcicsIHR5cGU6ICdwcm9ncmFtX3R5cGUnfVxyXG4gICAgXVxyXG4gICAgdGhpcy5wcm9ncmFtX25hbWVzID0gW1xyXG4gICAgICB7dmFsdWU6IFwiRW1QT1dFUiBDbGVhbiBFbmVyZ3kgQ29tbXVuaXRpZXMgTG93LXRvLU1vZGVyYXRlIEluY29tZSBHcmFudCBQcm9ncmFtXCIsIHR5cGU6ICdwcm9ncmFtX25hbWUnfSxcclxuICAgICAge3ZhbHVlOiBcIk1hcnlsYW5kIFNtYXJ0IEVuZXJneSBDb21tdW5pdGllc1wiLCB0eXBlOiAncHJvZ3JhbV9uYW1lJ30sXHJcbiAgICAgIHt2YWx1ZTogXCJFRUNCRyBCdWlsZGluZyBSZXRyb2ZpdFwiLCB0eXBlOiAncHJvZ3JhbV9uYW1lJ30sXHJcbiAgICAgIHt2YWx1ZTogXCJNYXJ5bGFuZCBIb21lIEVuZXJneSBMb2FuIFByb2dyYW1cIiwgdHlwZTogJ3Byb2dyYW1fbmFtZSd9LFxyXG4gICAgICB7dmFsdWU6IFwiU3RhdGUgQWdlbmN5IExvYW4gUHJvZ3JhbVwiLCB0eXBlOiAncHJvZ3JhbV9uYW1lJ30sXHJcbiAgICAgIHt2YWx1ZTogXCJFbmVyZ3kgRWZmaWNpZW50IEFwcGxpYW5jZSBSZWJhdGUgUHJvZ3JhbVwiLCB0eXBlOiAncHJvZ3JhbV9uYW1lJ30sXHJcbiAgICAgIHt2YWx1ZTogXCJFbVBPV0VSIE1hcnlsYW5kIENoYWxsZW5lZ2U6IENvbW1lcmNpYWwtSW5kdXN0cmlhbCBHcmFudCBQcm9ncmFtXCIsIHR5cGU6ICdwcm9ncmFtX25hbWUnfSxcclxuICAgICAge3ZhbHVlOiBcIlN0YXRlIEJ1aWxkaW5nIEVuZXJneSBQZXJmb3JtYW5jZSBDb250cmFjdGluZyAocnVuIGJ5IERHUylcIiwgdHlwZTogJ3Byb2dyYW1fbmFtZSd9LFxyXG4gICAgICB7dmFsdWU6IFwiTWFyeWxhbmQgU3RhdGV3aWRlIEZhcm0gRW5lcmd5IEF1ZGl0IFByb2dyYW1cIiwgdHlwZTogJ3Byb2dyYW1fbmFtZSd9LFxyXG4gICAgICB7dmFsdWU6IFwiSG9tZSBQZXJmb3JtYW5jZSBSZWJhdGUgUHJvZ3JhbVwiLCB0eXBlOiAncHJvZ3JhbV9uYW1lJ30sXHJcbiAgICAgIHt2YWx1ZTogXCJKYW5lIEUuIExhd3RvbiBDb25zZXJ2YXRpb24gTG9hbiBQcm9ncmFtIFwiLCB0eXBlOiAncHJvZ3JhbV9uYW1lJ30sXHJcbiAgICAgIHt2YWx1ZTogXCJLYXRobGVlbiBBLlAuIE1hdGhpYXMgQWdyaWN1bHR1cmUgRW5lcmd5IEVmZmljaWVuY3kgR3JhbnQgUHJvZ3JhbVwiLCB0eXBlOiAncHJvZ3JhbV9uYW1lJ31cclxuICAgIF1cclxuICAgIHRoaXMuc2VjdG9ycyA9IFtcclxuICAgICAge3ZhbHVlOiAnUmVzaWRlbnRpYWwnLCB0eXBlOiAnc2VjdG9yJ30sXHJcbiAgICAgIHt2YWx1ZTogJ0NvbW1lcmNpYWwnLCB0eXBlOiAnc2VjdG9yJ30sXHJcbiAgICAgIHt2YWx1ZTogJ0FncmljdWx0dXJlJywgdHlwZTogJ3NlY3Rvcid9LFxyXG4gICAgICB7dmFsdWU6ICdMb2NhbCBHb3Zlcm5tZW50JywgdHlwZTogJ3NlY3Rvcid9LFxyXG4gICAgICB7dmFsdWU6ICdTdGF0ZSBHb3Zlcm5tZW50JywgdHlwZTogJ3NlY3Rvcid9XHJcbiAgICBdXHJcbiAgICB0aGlzLnNlY3RvcnMyID0gXy5jbG9uZSh0aGlzLnNlY3RvcnMpXHJcbiAgICB0aGlzLnNlY3RvcnMyLnNwbGljZSgyLDEpXHJcbiAgICB0aGlzLmZpbHRlcl9oYXNoID0ge1xyXG4gICAgICAnZWZmaWNpZW5jeSc6IHRoaXMuc2VjdG9ycy5jb25jYXQodGhpcy5wcm9ncmFtX25hbWVzKSxcclxuICAgICAgJ3JlbmV3YWJsZSc6IHRoaXMuc2VjdG9ycy5jb25jYXQodGhpcy5yZW5ld2FibGVzKSxcclxuICAgICAgJ3RyYW5zcG9ydGF0aW9uJzogdGhpcy5zZWN0b3JzMi5jb25jYXQodGhpcy5zdGF0aW9ucykuY29uY2F0KHRoaXMudmVoaWNsZV90ZWNobm9sb2d5KVxyXG4gICAgfVxyXG4gICAgdGhpcy5maWx0ZXJDb2xsZWN0aW9uLmFkZCh0aGlzLmZpbHRlcl9oYXNoW3RoaXMuYWN0aXZldGFiXSlcclxuICB9LFxyXG4gIHJlbmRlckNoYXJ0OiBmdW5jdGlvbihjaGFydCkge1xyXG4gICAgdmFyIHZpZXcgPSB7fVxyXG4gICAgaWYgKGNoYXJ0LmdldCgnY2hhcnRfdHlwZScpID09PSAnbWFwJykge1xyXG4gICAgICB0aGlzLm1hcFZpZXcgPSBuZXcgTWFwVmlldyh7XHJcbiAgICAgICAgbW9kZWw6IGNoYXJ0XHJcbiAgICAgIH0pXHJcblxyXG4gICAgICB0aGlzLiRlbC5maW5kKCcuY2hhcnRzID4gLnJvdycpLmFwcGVuZCh0aGlzLm1hcFZpZXcucmVuZGVyKCkuZWwpXHJcbiAgICAgIHRoaXMubWFwVmlldy5tYWtlTWFwKClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmICghY2hhcnQuZ2V0KCdmaWx0ZXJfY29sb3InKSAmJiB0aGlzLnRhYl9jb2xvcnNbdGhpcy5hY3RpdmV0YWJdKSB7XHJcbiAgICAgICAgY2hhcnQuc2V0KCdjb2xvcnMnLCBbdGhpcy50YWJfY29sb3JzW3RoaXMuYWN0aXZldGFiXV0pXHJcbiAgICAgIH1cclxuICAgICAgdmlldyA9IHRoaXMubWFrZUNoYXJ0VmlldyhjaGFydClcclxuICAgICAgdmFyIGNvbnRhaW5lciA9ICQoJzxkaXYgY2xhc3M9XCJjaGFydC1jb250YWluZXJcIi8+JylcclxuICAgICAgY29udGFpbmVyLmFwcGVuZCh2aWV3LnJlbmRlcigpLmVsKVxyXG4gICAgICB0aGlzLiRlbC5maW5kKCcuY2hhcnRzID4gLnJvdycpLmFwcGVuZChjb250YWluZXIpXHJcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXt2aWV3LnJlc2l6ZSgpfSwgMTAwKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgbWFrZUNoYXJ0VmlldzogZnVuY3Rpb24oY2hhcnQpIHtcclxuICAgIHZhciB2aWV3XHJcbiAgICBzd2l0Y2ggKGNoYXJ0LmdldCgnY2hhcnRfdHlwZScpKSB7XHJcbiAgICAgIGNhc2UgJ2Jhcic6XHJcbiAgICAgICAgdmlldyA9IG5ldyBCYXJDaGFydFZpZXcoe1xyXG4gICAgICAgICAgbW9kZWw6IGNoYXJ0XHJcbiAgICAgICAgfSlcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdzdGFja2VkJzpcclxuICAgICAgICB2aWV3ID0gbmV3IFN0YWNrZWRCYXJDaGFydFZpZXcoe1xyXG4gICAgICAgICAgbW9kZWw6IGNoYXJ0XHJcbiAgICAgICAgfSlcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdsaW5lJzpcclxuICAgICAgICB2aWV3ID0gbmV3IExpbmVDaGFydFZpZXcoe1xyXG4gICAgICAgICAgbW9kZWw6IGNoYXJ0XHJcbiAgICAgICAgfSlcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdwaWUnOlxyXG4gICAgICAgIHZpZXcgPSBuZXcgUGllQ2hhcnRWaWV3KHtcclxuICAgICAgICAgIG1vZGVsOiBjaGFydFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnaGJhcic6XHJcbiAgICAgICAgdmlldyA9IG5ldyBIb3Jpem9udGFsQmFyQ2hhcnRWaWV3KHtcclxuICAgICAgICAgIG1vZGVsOiBjaGFydFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAndGFibGUnOlxyXG4gICAgICAgIHZpZXcgPSBuZXcgVGFibGVWaWV3KHtcclxuICAgICAgICAgIG1vZGVsOiBjaGFydFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnc3RhdCc6XHJcbiAgICAgICAgdmlldyA9IG5ldyBTdGF0Vmlldyh7XHJcbiAgICAgICAgICBtb2RlbDogY2hhcnRcclxuICAgICAgICB9KVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdmlld1xyXG4gIH0sXHJcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZSgpKVxyXG5cclxuICAgIHRoaXMuY2hhcnRDb2xsZWN0aW9uLmFkZCh0aGlzLm1hcE1vZGVsKVxyXG5cclxuICAgIHRoaXMuZmlsdGVyTWVudVZpZXcgPSBuZXcgRmlsdGVyTWVudVZpZXcoKVxyXG4gICAgdGhpcy4kZWwuZmluZCgnLmNoYXJ0cyA+IC5yb3cnKS5hcHBlbmQodGhpcy5maWx0ZXJNZW51Vmlldy5yZW5kZXIoKS5lbClcclxuXHJcbiAgICB0aGlzLmZpbHRlck1lbnVWaWV3LnVwZGF0ZSgpXHJcblxyXG4gICAgdGhpcy5jaGFydENvbGxlY3Rpb24uYWRkKHRoaXMuY2hhcnRfaGFzaFt0aGlzLmFjdGl2ZXRhYl0pXHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9LFxyXG4gIHVwZGF0ZTogZnVuY3Rpb24oZSkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzXHJcbiAgICB0aGlzLnVwZGF0ZUNoYXJ0Q29sbGVjdGlvbigpXHJcbiAgICB0aGlzLmNoYXJ0Q29sbGVjdGlvbi5lYWNoKGZ1bmN0aW9uKGNoYXJ0KSB7XHJcbiAgICAgIGNoYXJ0LnVwZGF0ZSgpXHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgdXBkYXRlQ2hhcnRDb2xsZWN0aW9uOiBmdW5jdGlvbigpIHtcclxuICAgIHZhciBzZWxmID0gdGhpc1xyXG4gICAgdmFyIHRlY2hfZmlsdGVycyA9IHRoaXMuZmlsdGVyQ29sbGVjdGlvbi53aGVyZSh7YWN0aXZlOiB0cnVlLCB0eXBlOiAndGVjaG5vbG9neSd9KVxyXG4gICAgaWYgKHRlY2hfZmlsdGVycy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgdmFyIG5ld19jaGFydHMgPSBbXVxyXG4gICAgICB0aGlzLmNoYXJ0X2hhc2hbJ2NhcGFjaXR5X2NoYXJ0cyddLmZvckVhY2goZnVuY3Rpb24oY2hhcnQpIHtcclxuICAgICAgICBjaGFydCA9IF8uY2xvbmUoY2hhcnQpXHJcbiAgICAgICAgdmFyIGNoYXJ0X2V4aXRzID0gc2VsZi5jaGFydENvbGxlY3Rpb24ud2hlcmUoe2FwaTogY2hhcnQuYXBpfSlcclxuICAgICAgICBpZiAoY2hhcnRfZXhpdHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICBjaGFydC50aXRsZSA9IHRlY2hfZmlsdGVyc1swXS5nZXQoJ3ZhbHVlJykgKyAnICcgKyBjaGFydC50aXRsZVxyXG4gICAgICAgICAgY2hhcnQudW5pdHMgPSB0ZWNoX2ZpbHRlcnNbMF0uZ2V0KCd1bml0cycpXHJcbiAgICAgICAgICBjaGFydC55TGFiZWwgPSBjaGFydC51bml0c1xyXG4gICAgICAgICAgaWYgKGNoYXJ0LmNoYXJ0X3R5cGUgPT09ICdsaW5lJykge1xyXG4gICAgICAgICAgICBjaGFydC5jb2xvcnMgPSBbdGVjaF9maWx0ZXJzWzBdLmdldCgnY29sb3InKV1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIG5ld19jaGFydHMucHVzaChjaGFydClcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIGlmIChuZXdfY2hhcnRzLmxlbmd0aCkgdGhpcy5jYXBhY2l0eUNoYXJ0cyA9IHRoaXMuY2hhcnRDb2xsZWN0aW9uLmFkZChuZXdfY2hhcnRzKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHRoaXMuY2FwYWNpdHlDaGFydHMpIHRoaXMuY2hhcnRDb2xsZWN0aW9uLnJlbW92ZSh0aGlzLmNhcGFjaXR5Q2hhcnRzKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgc3dpdGNoVGFiOiBmdW5jdGlvbih0YWIpIHtcclxuICAgICQoJ3VsLm5hdiBsaScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxyXG4gICAgJCgndWwubmF2IGxpIGFbaHJlZj1cIiMnICsgdGFiICsgJ1wiXScpLnBhcmVudCgpLmFkZENsYXNzKCdhY3RpdmUnKVxyXG4gICAgdmFyIHNlbGYgPSB0aGlzXHJcbiAgICBpZiAodGFiID09PSAnaG9tZScpIHtcclxuICAgICAgJCgnLmNoYXJ0cycpLmhpZGUoKVxyXG4gICAgICAkKCcuZmlsdGVyLXN1bW1hcnknKS5oaWRlKClcclxuICAgICAgJCgnLmhvbWUnKS5zaG93KClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoJy5ob21lJykuaGlkZSgpXHJcbiAgICAgICQoJy5jaGFydHMnKS5zaG93KClcclxuICAgICAgJCgnLmZpbHRlci1zdW1tYXJ5Jykuc2hvdygpXHJcbiAgICAgIGlmICh0YWIgIT09IHRoaXMuYWN0aXZldGFiKSB7XHJcbiAgICAgICAgdGhpcy5hY3RpdmV0YWIgPSB0YWJcclxuICAgICAgICAkKCcudGFiLWluZm8gYScpLmF0dHIoJ2hyZWYnLCBzZWxmLnNvY3JhdGFfbGlua3NbdGFiXSlcclxuICAgICAgICB0aGlzLm1hcFZpZXcubWFwLmludmFsaWRhdGVTaXplKClcclxuICAgICAgICB2YXIgZmlsdGVycyA9IFtdXHJcbiAgICAgICAgdmFyIGdlb3MgPSB0aGlzLmZpbHRlckNvbGxlY3Rpb24ud2hlcmUoe2dlbzogdHJ1ZX0pXHJcbiAgICAgICAgdmFyIGdlb3R5cGUgPSB0aGlzLmZpbHRlckNvbGxlY3Rpb24ud2hlcmUoe3R5cGU6ICdnZW90eXBlJ30pXHJcbiAgICAgICAgdGhpcy5maWx0ZXJDb2xsZWN0aW9uLnJlc2V0KHRoaXMuZmlsdGVyX2hhc2hbdGFiXS5jb25jYXQoZ2VvcykuY29uY2F0KGdlb3R5cGUpKVxyXG4gICAgICAgIHRoaXMuZmlsdGVyTWVudVZpZXcudXBkYXRlKClcclxuXHJcbiAgICAgICAgdmFyIGNoYXJ0cyA9IFtdXHJcbiAgICAgICAgdGhpcy5jaGFydENvbGxlY3Rpb24uZmluZFdoZXJlKHtjaGFydF90eXBlOiAnbWFwJ30pLnNldCgnZGF0YScsIFtdKVxyXG4gICAgICAgIHRoaXMuY2hhcnRDb2xsZWN0aW9uLmVhY2goZnVuY3Rpb24oY2hhcnQsIGlkeCkge1xyXG4gICAgICAgICAgaWYgKGNoYXJ0LmdldCgnY2hhcnRfdHlwZScpICE9PSAnbWFwJykge1xyXG4gICAgICAgICAgICBjaGFydC5hYm9ydCgpXHJcbiAgICAgICAgICAgIGNoYXJ0cy5wdXNoKGNoYXJ0KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy5jaGFydENvbGxlY3Rpb24ucmVtb3ZlKGNoYXJ0cylcclxuICAgICAgICB0aGlzLmNoYXJ0Q29sbGVjdGlvbi5hZGQodGhpcy5jaGFydF9oYXNoW3RhYl0pXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEYXNoYm9hcmQiLCJjb25zdCBGaWx0ZXJNb2RlbCA9IHJlcXVpcmUoJy4vRmlsdGVyTW9kZWwnKVxyXG5cclxuY29uc3QgRmlsdGVyQ29sbGVjdGlvbiA9IEJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKHtcclxuICBtb2RlbDogRmlsdGVyTW9kZWxcclxufSlcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRmlsdGVyQ29sbGVjdGlvbiIsImNvbnN0IHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4vdGVtcGxhdGVzJykoSGFuZGxlYmFycylcclxuXHJcbmNvbnN0IEZpbHRlckxhYmVsVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcclxuICB0ZW1wbGF0ZTogdGVtcGxhdGVzWydmaWx0ZXItbGFiZWwnXSxcclxuICB0YWdOYW1lOiAnZGl2JyxcclxuICBjbGFzc05hbWU6ICdmaWx0ZXItbGFiZWwnLFxyXG4gIGV2ZW50czoge1xyXG4gICAgJ2NsaWNrJzogJ2FjdGl2YXRlJ1xyXG4gIH0sXHJcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsICdyZW1vdmUnLCB0aGlzLnJlbW92ZSlcclxuICAgIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgJ2NoYW5nZTphY3RpdmUnLCB0aGlzLmNoYW5nZUFjdGl2ZSlcclxuICB9LFxyXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUodGhpcy5tb2RlbC50b0pTT04oKSkpXHJcbiAgICB0aGlzLnN0eWxlKClcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfSxcclxuICBzdHlsZTogZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAodGhpcy5tb2RlbC5nZXQoJ2NvbG9yJykpIHtcclxuICAgICAgLy9pZiAoKHRoaXMubW9kZWwuZ2V0KCd0eXBlJykgPT09ICdzZWN0b3InICYmIERhc2hib2FyZC5hY3RpdmV0YWIgPT09ICdlZmZpY2llbmN5JylcclxuICAgICAgIC8vICB8fCAoRGFzaGJvYXJkLmFjdGl2ZXRhYiAhPT0gJ2VmZmljaWVuY3knICYmIHRoaXMubW9kZWwuZ2V0KCd0eXBlJykgIT09ICdzZWN0b3InKSkge1xyXG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJ2J1dHRvbicpLmFkZENsYXNzKCdjb2xvcmVkJylcclxuICAgICAgICB0aGlzLiRlbC5maW5kKCdidXR0b24nKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCB0aGlzLm1vZGVsLmdldCgnY29sb3InKSlcclxuICAgICAgLy99XHJcbiAgICB9XHJcbiAgfSxcclxuICBhY3RpdmF0ZTogZnVuY3Rpb24oZmlsdGVyLCBlKXtcclxuICAgIHZhciBhY3RpdmUgPSB0aGlzLm1vZGVsLmdldCgnYWN0aXZlJylcclxuICAgIHRoaXMubW9kZWwuc2V0KCdhY3RpdmUnLCAhYWN0aXZlKVxyXG4gIH0sXHJcbiAgY2hhbmdlQWN0aXZlOiBmdW5jdGlvbigpIHtcclxuICAgIGlmICh0aGlzLm1vZGVsLmdldCgnYWN0aXZlJykpIHtcclxuICAgICAgdGhpcy4kZWwuZmluZCgnYnV0dG9uJykuYWRkQ2xhc3MoJ2FjdGl2ZScpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLiRlbC5maW5kKCdidXR0b24nKS5yZW1vdmVDbGFzcygnYWN0aXZlJylcclxuICAgIH1cclxuICB9XHJcbn0pXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZpbHRlckxhYmVsVmlldyIsImNvbnN0IENoYXJ0VmlldyA9IHJlcXVpcmUoJy4vQ2hhcnRWaWV3JylcclxuY29uc3QgRmlsdGVyTGFiZWxWaWV3ID0gcmVxdWlyZSgnLi9GaWx0ZXJMYWJlbFZpZXcnKVxyXG5jb25zdCBUZWNobm9sb2d5RmlsdGVyID0gcmVxdWlyZSgnLi9UZWNobm9sb2d5RmlsdGVyJylcclxuY29uc3QgdGVtcGxhdGVzID0gcmVxdWlyZSgnLi90ZW1wbGF0ZXMnKShIYW5kbGViYXJzKSAgXHJcblxyXG5jb25zdCBGaWx0ZXJNZW51VmlldyA9IENoYXJ0Vmlldy5leHRlbmQoe1xyXG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZXNbJ2ZpbHRlci1tZW51J10sXHJcbiAgZGVzY3JpcHRpb246IHtcclxuICAgIHJlbmV3YWJsZTogJ1NlbGVjdCBmaWx0ZXJzIHRvIHZpZXcgTWFyeWxhbmQgRW5lcmd5IEFkbWluaXN0cmF0aW9uIGNvbnRyaWJ1dGlvbnMgdG8gdGhlIGdyb3d0aCBvZiBhZmZvcmRhYmxlIGFuZCByZWxpYWJsZSByZW5ld2FibGUgZW5lcmd5IGluIG91ciBzdGF0ZS4nLFxyXG4gICAgZWZmaWNpZW5jeTogJ1NlbGVjdCBmaWx0ZXJzIHRvIHZpZXcgTWFyeWxhbmQgRW5lcmd5IEFkbWluaXN0cmF0aW9uIGNvbnRyaWJ1dGlvbnMgdG8gdGhlIGdyb3d0aCBvZiBhZmZvcmRhYmxlIGVuZXJneSBlZmZpY2llbmN5IGluIG91ciBzdGF0ZS4nLFxyXG4gICAgdHJhbnNwb3J0YXRpb246ICdTZWxlY3QgZmlsdGVycyB0byB2aWV3IE1hcnlsYW5kIEVuZXJneSBBZG1pbmlzdHJhdGlvbiBjb250cmlidXRpb25zIHRvIHRoZSBncm93dGggb2YgYWZmb3JkYWJsZSBhbmQgcmVsaWFibGUgY2xlYW4gdHJhbnNwb3J0YXRpb24gaW4gb3VyIHN0YXRlLidcclxuICB9LFxyXG4gIGV2ZW50czoge1xyXG4gICAgJ2NsaWNrIC5yZXNldCc6ICdyZXNldEZpbHRlcnMnLFxyXG4gICAgJ2NoYW5nZSBzZWxlY3QnOiAnY2hhbmdlRHJvcGRvd24nXHJcbiAgfSxcclxuICBpbml0aWFsaXplOiBmdW5jdGlvbigpe1xyXG4gICAgRGFzaGJvYXJkLmZpbHRlckNvbGxlY3Rpb24ub24oJ2NoYW5nZTphY3RpdmUnLCB0aGlzLmNoYW5nZVN1bW1hcnksIHRoaXMpXHJcbiAgICBEYXNoYm9hcmQuZmlsdGVyQ29sbGVjdGlvbi5vbignYWRkJywgdGhpcy5jaGFuZ2VTdW1tYXJ5LCB0aGlzKVxyXG4gICAgRGFzaGJvYXJkLmZpbHRlckNvbGxlY3Rpb24ub24oJ3JlbW92ZScsIHRoaXMuY2hhbmdlU3VtbWFyeSwgdGhpcylcclxuICAgIERhc2hib2FyZC5maWx0ZXJDb2xsZWN0aW9uLm9uKCdyZXNldCcsIHRoaXMucmVtb3ZlRmlsdGVyLCB0aGlzKVxyXG4gIH0sXHJcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcclxuICAgIHZhciBzZWxmID0gdGhpc1xyXG4gICAgdGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKHt0aXRsZTogJ1Byb2plY3QgRmlsdGVycycsIHRvb2xiYXI6IGZhbHNlfSkpXHJcbiAgICB0aGlzLmNoYW5nZVN1bW1hcnkoKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9LFxyXG4gIHVwZGF0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXNcclxuICAgIHRoaXMucmVzaXplKClcclxuICAgIHNlbGYuJGVsLmZpbmQoJy50ZWNobm9sb2d5JykuaGlkZSgpXHJcbiAgICBzZWxmLiRlbC5maW5kKCcudmVoaWNsZV90ZWNobm9sb2d5JykuaGlkZSgpXHJcbiAgICBzZWxmLiRlbC5maW5kKCcuc2VjdG9yJykuaGlkZSgpXHJcbiAgICBzZWxmLiRlbC5maW5kKCcucHJvZ3JhbScpLmhpZGUoKVxyXG4gICAgc2VsZi4kZWwuZmluZCgnLmNoYXJnaW5nX2Z1ZWxpbmdfc3RhdGlvbl90ZWNobm9sb2d5JykuaGlkZSgpXHJcbiAgICBzZWxmLiRlbC5maW5kKCcuZGVzY3JpcHRpb24gPiBwJykuaHRtbCh0aGlzLmRlc2NyaXB0aW9uW0Rhc2hib2FyZC5hY3RpdmV0YWJdKVxyXG4gICAgJCgnLnRoZS1maWx0ZXJzJykuZW1wdHkoKVxyXG4gICAgRGFzaGJvYXJkLmZpbHRlckNvbGxlY3Rpb24uZWFjaChmdW5jdGlvbihmaWx0ZXIpIHtcclxuICAgICAgaWYgKGZpbHRlci5nZXQoJ3Zpc2libGUnKSkge1xyXG4gICAgICAgIGlmIChmaWx0ZXIuZ2V0KCd0eXBlJykgPT09ICd0ZWNobm9sb2d5Jykge1xyXG4gICAgICAgICAgc2VsZi4kZWwuZmluZCgnLnRlY2hub2xvZ3knKS5zaG93KClcclxuICAgICAgICAgIHNlbGYuJGVsLmZpbmQoJy50ZWNobm9sb2d5IC50aGUtZmlsdGVycycpLmFwcGVuZChuZXcgVGVjaG5vbG9neUZpbHRlcih7bW9kZWw6IGZpbHRlcn0pLnJlbmRlcigpLmVsKVxyXG4gICAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLmdldCgndHlwZScpID09PSAndmVoaWNsZV90ZWNobm9sb2d5Jykge1xyXG4gICAgICAgICAgc2VsZi4kZWwuZmluZCgnLnZlaGljbGVfdGVjaG5vbG9neScpLnNob3coKVxyXG4gICAgICAgICAgc2VsZi4kZWwuZmluZCgnLnZlaGljbGVfdGVjaG5vbG9neSAudGhlLWZpbHRlcnMnKS5hcHBlbmQobmV3IFRlY2hub2xvZ3lGaWx0ZXIoe21vZGVsOiBmaWx0ZXJ9KS5yZW5kZXIoKS5lbClcclxuICAgICAgICB9IGVsc2UgaWYgKGZpbHRlci5nZXQoJ3R5cGUnKSA9PT0gJ2NoYXJnaW5nX2Z1ZWxpbmdfc3RhdGlvbl90ZWNobm9sb2d5Jykge1xyXG4gICAgICAgICAgc2VsZi4kZWwuZmluZCgnLmNoYXJnaW5nX2Z1ZWxpbmdfc3RhdGlvbl90ZWNobm9sb2d5Jykuc2hvdygpXHJcbiAgICAgICAgICBzZWxmLiRlbC5maW5kKCcuY2hhcmdpbmdfZnVlbGluZ19zdGF0aW9uX3RlY2hub2xvZ3kgLnRoZS1maWx0ZXJzJykuYXBwZW5kKG5ldyBUZWNobm9sb2d5RmlsdGVyKHttb2RlbDogZmlsdGVyfSkucmVuZGVyKCkuZWwpXHJcbiAgICAgICAgfSBlbHNlIGlmIChmaWx0ZXIuZ2V0KCd0eXBlJykgPT09ICdzZWN0b3InKSB7XHJcbiAgICAgICAgICBzZWxmLiRlbC5maW5kKCcuc2VjdG9yJykuc2hvdygpXHJcbiAgICAgICAgICBzZWxmLiRlbC5maW5kKCcuc2VjdG9yIC50aGUtZmlsdGVycycpLmFwcGVuZChuZXcgRmlsdGVyTGFiZWxWaWV3KHttb2RlbDogZmlsdGVyfSkucmVuZGVyKCkuZWwpXHJcbiAgICAgICAgfSBlbHNlIGlmIChmaWx0ZXIuZ2V0KCd0eXBlJykgPT09ICdwcm9ncmFtX3R5cGUnKSB7XHJcbiAgICAgICAgICBzZWxmLiRlbC5maW5kKCcucHJvZ3JhbScpLnNob3coKVxyXG4gICAgICAgICAgc2VsZi4kZWwuZmluZCgnLnByb2dyYW0gLnRoZS1maWx0ZXJzJykuYXBwZW5kKG5ldyBGaWx0ZXJMYWJlbFZpZXcoe21vZGVsOiBmaWx0ZXJ9KS5yZW5kZXIoKS5lbClcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICB2YXIgcHJvZ3JhbV9uYW1lcyA9IERhc2hib2FyZC5maWx0ZXJDb2xsZWN0aW9uLndoZXJlKHt0eXBlOiAncHJvZ3JhbV9uYW1lJ30pXHJcbiAgICBpZiAocHJvZ3JhbV9uYW1lcy5sZW5ndGgpIHtcclxuICAgICAgdmFyIGRyb3Bkb3duID0gdGhpcy5tYWtlRHJvcERvd24oJ3Byb2dyYW1fbmFtZScsIHByb2dyYW1fbmFtZXMpXHJcbiAgICAgIHNlbGYuJGVsLmZpbmQoJy5wcm9ncmFtJykuc2hvdygpXHJcbiAgICAgIHNlbGYuJGVsLmZpbmQoJy5wcm9ncmFtIC50aGUtZmlsdGVycycpLmFwcGVuZChkcm9wZG93bilcclxuICAgIH1cclxuICB9LFxyXG4gIG1ha2VEcm9wRG93bjogZnVuY3Rpb24odHlwZSwgZmlsdGVycykge1xyXG4gICAgZmlsdGVycy5zb3J0KGZ1bmN0aW9uKGEsIGIpe1xyXG4gICAgICBpZiAoYS5nZXQoJ3ZhbHVlJykgPCBiLmdldCgndmFsdWUnKSkgcmV0dXJuIC0xXHJcbiAgICAgIGlmIChhLmdldCgndmFsdWUnKSA+IGIuZ2V0KCd2YWx1ZScpKSByZXR1cm4gMVxyXG4gICAgICByZXR1cm4gMFxyXG4gICAgfSlcclxuICAgIHZhciBodG1sID0gJzxzZWxlY3QgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBpZD1cIicgKyB0eXBlICsgJ1wiPidcclxuICAgIGh0bWwgKz0gJzxvcHRpb24gdmFsdWU9XCJcIj5BbGw8L29wdGlvbj4nXHJcbiAgICBfLmVhY2goZmlsdGVycywgZnVuY3Rpb24oZmlsdGVyKSB7XHJcbiAgICAgIGh0bWwgKz0gJzxvcHRpb24gdmFsdWU9XCInICsgZmlsdGVyLmdldCgndmFsdWUnKSArICdcIj4nICsgZmlsdGVyLmdldCgndmFsdWUnKSArICc8L29wdGlvbj4nXHJcbiAgICB9KVxyXG4gICAgaHRtbCArPSAnPC9zZWxlY3Q+J1xyXG4gICAgcmV0dXJuIGh0bWxcclxuICB9LFxyXG4gIGNoYW5nZURyb3Bkb3duOiBmdW5jdGlvbihlKSB7XHJcbiAgICB2YXIgdmFsdWUgPSAkKGUuY3VycmVudFRhcmdldCkudmFsKClcclxuICAgIHZhciB0eXBlID0gJChlLmN1cnJlbnRUYXJnZXQpLmF0dHIoJ2lkJylcclxuICAgIF8uZWFjaChEYXNoYm9hcmQuZmlsdGVyQ29sbGVjdGlvbi53aGVyZSh7dHlwZTogdHlwZX0pLCBmdW5jdGlvbihmKSB7XHJcbiAgICAgIGYuc2V0KCdhY3RpdmUnLCBmYWxzZSwge3NpbGVudDogdHJ1ZX0pXHJcbiAgICB9KVxyXG4gICAgdmFyIGZpbHRlciA9IERhc2hib2FyZC5maWx0ZXJDb2xsZWN0aW9uLmZpbmRXaGVyZSh7dHlwZTogdHlwZSwgdmFsdWU6IHZhbHVlfSlcclxuICAgIGlmIChmaWx0ZXIpIHtcclxuICAgICAgZmlsdGVyLnNldCgnYWN0aXZlJywgdHJ1ZSwge3NpbGVudDogdHJ1ZX0pXHJcbiAgICB9XHJcbiAgICB0aGlzLmNoYW5nZVN1bW1hcnkoKVxyXG4gICAgRGFzaGJvYXJkLnVwZGF0ZSgpXHJcbiAgfSxcclxuICByZW1vdmVGaWx0ZXI6IGZ1bmN0aW9uKGZpbHRlcikge1xyXG5cclxuICB9LFxyXG4gIHJlc2V0RmlsdGVyczogZnVuY3Rpb24oKSB7XHJcbiAgICBEYXNoYm9hcmQubWFwVmlldy5yZXNldCgpXHJcbiAgICB2YXIgZ2VvZmlsdGVycyA9IERhc2hib2FyZC5maWx0ZXJDb2xsZWN0aW9uLndoZXJlKHtnZW86IHRydWV9KVxyXG4gICAgRGFzaGJvYXJkLmZpbHRlckNvbGxlY3Rpb24ucmVtb3ZlKGdlb2ZpbHRlcnMpXHJcbiAgICBEYXNoYm9hcmQuZmlsdGVyQ29sbGVjdGlvbi5lYWNoKGZ1bmN0aW9uKGZpbHRlcikge1xyXG4gICAgICBpZiAoZmlsdGVyLmdldCgnYWN0aXZlJykpIGZpbHRlci5zZXQoeydhY3RpdmUnOiBmYWxzZX0pXHJcbiAgICB9KVxyXG4gICAgdGhpcy4kZWwuZmluZCgnc2VsZWN0JykudmFsKCcnKVxyXG4gIH0sXHJcbiAgY2hhbmdlU3VtbWFyeTogZnVuY3Rpb24oKSB7XHJcbiAgICAkKCcuZGFzaGJvYXJkIC5maWx0ZXItc3VtbWFyeScpLmh0bWwoJycpXHJcbiAgICB2YXIgc3VtbWFyeSA9ICc8cD4nXHJcbiAgICB2YXIgZmlsdGVycyA9IF8ucmVqZWN0KERhc2hib2FyZC5maWx0ZXJDb2xsZWN0aW9uLndoZXJlKHthY3RpdmU6IHRydWV9KSwgZnVuY3Rpb24oZikge1xyXG4gICAgICBpZiAoZi5nZXQoJ3R5cGUnKSA9PT0gJ2dyb3VwJykgcmV0dXJuIHRydWVcclxuICAgIH0pXHJcbiAgICBpZiAoZmlsdGVycy5sZW5ndGggPT0gMCkge1xyXG4gICAgICBzdW1tYXJ5ICs9ICdBbGwgUHJvamVjdHMnXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgZmlsdGVycyA9IERhc2hib2FyZC5maWx0ZXJDb2xsZWN0aW9uLndoZXJlKHthY3RpdmU6IHRydWUsIHR5cGU6ICd0ZWNobm9sb2d5J30pXHJcbiAgICAgIGlmIChmaWx0ZXJzLmxlbmd0aCkge1xyXG4gICAgICAgIHZhciB4ID0gW11cclxuICAgICAgICBfLmVhY2goZmlsdGVycywgZnVuY3Rpb24oZikge1xyXG4gICAgICAgICAgeC5wdXNoKGYuZ2V0KCd2YWx1ZScpKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgaWYgKGZpbHRlcnMubGVuZ3RoID09IDEpIHtcclxuICAgICAgICAgIHN1bW1hcnkgKz0geFswXSArICcgcHJvamVjdHMnXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHN1bW1hcnkgKz0gXy5pbml0aWFsKHgpLmpvaW4oJywgJylcclxuICAgICAgICAgICAgKyAnIGFuZCAnICsgXy5sYXN0KHgpXHJcbiAgICAgICAgICAgICsgJyBwcm9qZWN0cydcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc3VtbWFyeSArPSAnQWxsIHByb2plY3RzJ1xyXG4gICAgICB9XHJcbiAgICAgIHZhciBmaWx0ZXJzID0gRGFzaGJvYXJkLmZpbHRlckNvbGxlY3Rpb24ud2hlcmUoe2FjdGl2ZTogdHJ1ZSwgZ2VvOiB0cnVlfSlcclxuICAgICAgaWYgKGZpbHRlcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgdmFyIHggPSBbXVxyXG4gICAgICAgIF8uZWFjaChmaWx0ZXJzLCBmdW5jdGlvbihmKSB7XHJcbiAgICAgICAgICB4LnB1c2goZi5nZXQoJ3ZhbHVlJykpXHJcbiAgICAgICAgfSlcclxuICAgICAgICB2YXIgdHlwZSA9IGZpbHRlcnNbMF0uZ2V0KCd0eXBlJylcclxuICAgICAgICB2YXIgZ2VvX2xvb2t1cCA9IHtcclxuICAgICAgICAgICdjb3VudHknOiAnQ291bnR5JyxcclxuICAgICAgICAgICdsZWdpc2xhdGl2ZSc6ICdMZWdpc2xhdGl2ZSBEaXN0cmljdCcsXHJcbiAgICAgICAgICAnY29uZ3Jlc3Npb25hbCc6ICdDb25ncmVzc2lvbmFsIERpc3RyaWN0JyxcclxuICAgICAgICAgICd6aXBjb2RlJzogJ1ppcCBDb2RlJyxcclxuICAgICAgICB9XHJcbiAgICAgICAgc3VtbWFyeSArPSAnIGluICdcclxuICAgICAgICBpZiAoZmlsdGVycy5sZW5ndGggPT09IDEgKSB7XHJcbiAgICAgICAgICBpZiAodHlwZSA9PT0gJ2NvdW50eScpIHtcclxuICAgICAgICAgICAgc3VtbWFyeSArPSB4WzBdICsgJyAnICsgZ2VvX2xvb2t1cFt0eXBlXVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc3VtbWFyeSArPSBnZW9fbG9va3VwW3R5cGVdICsgJyAnICsgeFswXVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB2YXIgbGlzdCA9ICcnICsgXy5pbml0aWFsKHgpLmpvaW4oJywgJylcclxuICAgICAgICAgICAgKyAnIGFuZCAnICsgXy5sYXN0KHgpXHJcbiAgICAgICAgICBpZiAodHlwZSA9PT0gJ2NvdW50eScpIHtcclxuICAgICAgICAgICAgc3VtbWFyeSArPSBsaXN0ICsgJyBDb3VudGllcydcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHN1bW1hcnkgKz0gZ2VvX2xvb2t1cFt0eXBlXSArICdzICcgKyBsaXN0XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHZhciBmaWx0ZXJzID0gRGFzaGJvYXJkLmZpbHRlckNvbGxlY3Rpb24ud2hlcmUoe2FjdGl2ZTogdHJ1ZSwgdHlwZTogJ3Byb2dyYW1fdHlwZSd9KVxyXG4gICAgICBpZiAoZmlsdGVycy5sZW5ndGgpIHtcclxuICAgICAgICB2YXIgeCA9IFtdXHJcbiAgICAgICAgXy5lYWNoKGZpbHRlcnMsIGZ1bmN0aW9uKGYpIHtcclxuICAgICAgICAgIHgucHVzaChmLmdldCgndmFsdWUnKSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIGlmIChmaWx0ZXJzLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICBzdW1tYXJ5ICs9ICcgZnVuZGVkIGJ5ICcgKyB4LmpvaW4oJywgJylcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc3VtbWFyeSArPSAnIGZ1bmRlZCBieSAnXHJcbiAgICAgICAgICAgICsgXy5pbml0aWFsKHgpLmpvaW4oJywgJylcclxuICAgICAgICAgICAgKyAnIGFuZCAnICsgXy5sYXN0KHgpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHZhciBmaWx0ZXJzID0gRGFzaGJvYXJkLmZpbHRlckNvbGxlY3Rpb24ud2hlcmUoe2FjdGl2ZTogdHJ1ZSwgdHlwZTogJ3Byb2dyYW1fbmFtZSd9KVxyXG4gICAgICBpZiAoZmlsdGVycy5sZW5ndGgpIHtcclxuICAgICAgICB2YXIgeCA9IFtdXHJcbiAgICAgICAgXy5lYWNoKGZpbHRlcnMsIGZ1bmN0aW9uKGYpIHtcclxuICAgICAgICAgIHgucHVzaChmLmdldCgndmFsdWUnKSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIGlmIChmaWx0ZXJzLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICBzdW1tYXJ5ICs9ICcgaW4gdGhlICcgKyB4LmpvaW4oJywgJykucmVwbGFjZSgnUHJvZ3JhbScsICcnKSArICcgcHJvZ3JhbSdcclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgdmFyIGZpbHRlcnMgPSBEYXNoYm9hcmQuZmlsdGVyQ29sbGVjdGlvbi53aGVyZSh7YWN0aXZlOiB0cnVlLCB0eXBlOiAnc2VjdG9yJ30pXHJcbiAgICAgIGlmIChmaWx0ZXJzLmxlbmd0aCkge1xyXG4gICAgICAgIHZhciB4ID0gW11cclxuICAgICAgICBfLmVhY2goZmlsdGVycywgZnVuY3Rpb24oZikge1xyXG4gICAgICAgICAgeC5wdXNoKGYuZ2V0KCd2YWx1ZScpKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgaWYgKGZpbHRlcnMubGVuZ3RoID09IDEpIHtcclxuICAgICAgICAgIHN1bW1hcnkgKz0gJyBpbiB0aGUgJyArIHhbMF0gKyAnIHNlY3RvcidcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc3VtbWFyeSArPSAnIGluICdcclxuICAgICAgICAgICAgKyBfLmluaXRpYWwoeCkuam9pbignLCAnKVxyXG4gICAgICAgICAgICArICcgYW5kICcgKyBfLmxhc3QoeClcclxuICAgICAgICAgICAgKyAnIHNlY3RvcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBzdW1tYXJ5ICs9ICc8L3A+J1xyXG4gICAgJCgnLmRhc2hib2FyZCAuZmlsdGVyLXN1bW1hcnknKS5odG1sKHN1bW1hcnkpXHJcbiAgfVxyXG59KVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGaWx0ZXJNZW51VmlldyIsImNvbnN0IGNyZWF0ZWNzcyA9IHJlcXVpcmUoJ2NyZWF0ZWNzcycpXHJcblxyXG5jb25zdCBGaWx0ZXJNb2RlbCA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XHJcbiAgZGVmYXVsdHM6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgYWN0aXZlOiBmYWxzZSxcclxuICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKXtcclxuICAgIGlmKCF0aGlzLmdldCgnZGlzcGxheScpKSB7XHJcbiAgICAgIHRoaXMuc2V0KCdkaXNwbGF5JywgdGhpcy5nZXQoJ3ZhbHVlJykpXHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5nZXQoJ2NvbG9yJykpIHtcclxuICAgICAgY3JlYXRlY3NzLnNlbGVjdG9yKCcuJyArIHRoaXMuZ2V0KCd0eXBlJykgKyB0aGlzLmdldCgndmFsdWUnKS5yZXBsYWNlKC8gL2csICcnKS5yZXBsYWNlKCcoJywgJycpLnJlcGxhY2UoJyknLCAnJyksICdiYWNrZ3JvdW5kOiAnICsgdGhpcy5nZXQoJ2NvbG9yJykpXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGaWx0ZXJNb2RlbCIsImNvbnN0IEJhckNoYXJ0VmlldyA9IHJlcXVpcmUoJy4vQmFyQ2hhcnRWaWV3JylcclxuXHJcbmNvbnN0IEhvcml6b250YWxCYXJDaGFydFZpZXcgPSBCYXJDaGFydFZpZXcuZXh0ZW5kKHtcclxuICBkcmF3Q2hhcnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGNoYXJ0ZWwgPSB0aGlzLiRlbC5maW5kKCcuY2hhcnQtaW5uZXInKS5nZXQoMClcclxuICAgIHRoaXMuY2hhcnQgPSBuZXcgR2VvRGFzaC5CYXJDaGFydEhvcml6b250YWwoY2hhcnRlbCwge1xyXG4gICAgICB5OiB0aGlzLm1vZGVsLmdldCgna2V5JylcclxuICAgICAgLCB4OiBbXVxyXG4gICAgICAsIGNvbG9yczogRGFzaGJvYXJkLmNvbG9yc1xyXG4gICAgICAsIHhUaWNrRm9ybWF0OiBkMy5mb3JtYXQoXCIuMnNcIilcclxuICAgICAgLCB5V2lkdGg6IDYwXHJcbiAgICAgICwgb3BhY2l0eTogMVxyXG4gICAgfSlcclxuICB9LFxyXG4gIHByZXBEYXRhOiBmdW5jdGlvbihkYXRhKXtcclxuICAgIHZhciByb3cgPSBkYXRhWzBdXHJcbiAgICB2YXIga2V5cyA9IF8ud2l0aG91dChfLmtleXMocm93KSwgdGhpcy5tb2RlbC5nZXQoJ2tleScpKVxyXG4gICAgdmFyIG51bWJlcmtleXMgPSBbXVxyXG4gICAgXy5lYWNoKGtleXMsIGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgIGlmKF8uaXNOdW1iZXIocm93W2tleV0pKXtcclxuICAgICAgICBudW1iZXJrZXlzLnB1c2goa2V5KVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgdGhpcy5jaGFydC5vcHRpb25zLnggPSBudW1iZXJrZXlzXHJcbiAgICByZXR1cm4gZGF0YVxyXG4gIH1cclxufSlcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSG9yaXpvbnRhbEJhckNoYXJ0VmlldyIsImNvbnN0IEJhckNoYXJ0VmlldyA9IHJlcXVpcmUoJy4vQmFyQ2hhcnRWaWV3JylcclxuXHJcblxyXG5jb25zdCBMaW5lQ2hhcnRWaWV3ID0gQmFyQ2hhcnRWaWV3LmV4dGVuZCh7XHJcbiAgZHJhd0NoYXJ0OiBmdW5jdGlvbigpIHtcclxuICAgIGlmICh0aGlzLm1vZGVsLmdldCgnY29sb3JzJykpIHtcclxuICAgICAgdGhpcy5jb2xvcnMgPSB0aGlzLm1vZGVsLmdldCgnY29sb3JzJylcclxuICAgIH1cclxuICAgIHRoaXMuY2hhcnQgPSBuZXcgR2VvRGFzaC5MaW5lQ2hhcnQodGhpcy5jaGFydGVsLCB7XHJcbiAgICAgIHg6IHRoaXMubW9kZWwuZ2V0KCdrZXknKVxyXG4gICAgICAsIHk6IHRoaXMubW9kZWwuZ2V0KCd5JylcclxuICAgICAgLCBjb2xvcnM6IHRoaXMuY29sb3JzXHJcbiAgICAgICwgbGVnZW5kOiB0cnVlXHJcbiAgICAgICwgbGVnZW5kV2lkdGg6IDkwXHJcbiAgICAgICwgaG92ZXJUZW1wbGF0ZTogJ3t7eX19ICcgKyB0aGlzLm1vZGVsLmdldCgndW5pdHMnKVxyXG4gICAgICAsIGludGVycG9sYXRlOiAnbW9ub3RvbmUnXHJcbiAgICAgICwgeFRpY2tGb3JtYXQ6IGQzLnRpbWUuZm9ybWF0KCclWScpXHJcbiAgICAgICwgeVRpY2tzQ291bnQ6IDVcclxuICAgICAgLCBkb3RSYWRpdXM6IDJcclxuICAgICAgLCBsZWdlbmQ6IGZhbHNlXHJcbiAgICAgICwgc2hvd0FyZWE6IHRydWVcclxuICAgICAgLCBhY2N1bXVsYXRlOiB0cnVlXHJcbiAgICAgICwgdmFsdWVGb3JtYXQ6IHRoaXMubW9kZWwuZ2V0KCd2YWx1ZUZvcm1hdCcpXHJcbiAgICAgICwgeUxhYmVsOiB0aGlzLm1vZGVsLmdldCgneUxhYmVsJylcclxuICAgICAgLCB4VGltZUludGVydmFsOiB7XHJcbiAgICAgICAgICB0aW1lUGVyaW9kOiBkMy50aW1lLnllYXIsXHJcbiAgICAgICAgICBpbnRlcnZhbDogMVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgfSxcclxuICBwcmVwRGF0YTogZnVuY3Rpb24ocmVzKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXNcclxuICAgIHZhciBrZXlzID0gXy53aXRob3V0KF8ua2V5cyhyZXNbMF0pLCB0aGlzLm1vZGVsLmdldCgna2V5JykpXHJcbiAgICBpZiAodGhpcy5tb2RlbC5nZXQoJ3knKSkge1xyXG4gICAgICB0aGlzLmNoYXJ0Lm9wdGlvbnMueSA9IHRoaXMubW9kZWwuZ2V0KCd5JylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuY2hhcnQub3B0aW9ucy55ID0ga2V5c1xyXG4gICAgfVxyXG4gICAgdmFyIHBhcnNlRGF0ZSA9IGQzLnRpbWUuZm9ybWF0KCclLW0tJVknKS5wYXJzZVxyXG4gICAgXy5lYWNoKHJlcywgZnVuY3Rpb24ob2JqLCBpZHgpe1xyXG4gICAgICB2YXIgaXNEYXRlID0gXy5pc0RhdGUob2JqW3NlbGYubW9kZWwuZ2V0KCdrZXknKV0pXHJcbiAgICAgIGlmICghaXNEYXRlKSB7XHJcbiAgICAgICAgb2JqW3NlbGYubW9kZWwuZ2V0KCdrZXknKV0gPSBwYXJzZURhdGUob2JqW3NlbGYubW9kZWwuZ2V0KCdrZXknKV0pXHJcbiAgICAgIH1cclxuICAgICAgXy5lYWNoKGtleXMsIGZ1bmN0aW9uKGtleSkge1xyXG4gICAgICAgIHZhciB4ID0gb2JqW2tleV1cclxuICAgICAgICBvYmpba2V5XSA9IE1hdGgucm91bmQoeCoxMDApIC8gMTAwXHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG4gICAgcmVzID0gXy5zb3J0QnkocmVzLCBmdW5jdGlvbihyb3csIGkpIHtcclxuICAgICAgcmV0dXJuIHJvd1tzZWxmLm1vZGVsLmdldCgna2V5JyldXHJcbiAgICB9KVxyXG4gICAgdGhpcy5tb2RlbC5zZXQoJ2RhdGEnLCByZXMsIHtzaWxlbnQ6IHRydWV9KVxyXG4gICAgLy90aGlzLnNldENvbG9ycyhkYXRhKVxyXG4gICAgcmV0dXJuIHJlc1xyXG4gIH1cclxufSlcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGluZUNoYXJ0VmlldyIsImNvbnN0IENoYXJ0TW9kZWwgPSByZXF1aXJlKCcuL0NoYXJ0TW9kZWwnKVxyXG5jb25zdCBGaWx0ZXJNb2RlbCA9IHJlcXVpcmUoJy4vRmlsdGVyTW9kZWwnKVxyXG5jb25zdCB0ZW1wbGF0ZXMgPSByZXF1aXJlKCcuL3RlbXBsYXRlcycpKEhhbmRsZWJhcnMpXHJcblxyXG5jb25zdCBNYXBWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xyXG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZXMubWFwLFxyXG4gIGxheWVyc190ZW1wbGF0ZTogdGVtcGxhdGVzLmxheWVycyxcclxuICB0ZW1wbGF0ZXM6IHtcclxuICAgICdyZW5ld2FibGUnOiB0ZW1wbGF0ZXNbJ3JlbmV3YWJsZS1wb3B1cCddLFxyXG4gICAgJ2VmZmljaWVuY3knOiB0ZW1wbGF0ZXNbJ2VmZmljaWVuY3ktcG9wdXAnXSxcclxuICAgICd0cmFuc3BvcnRhdGlvbic6IHRlbXBsYXRlc1sndHJhbnNwb3J0YXRpb24tcG9wdXAnXVxyXG4gIH0sXHJcbiAgdGVjaG5vbG9neV9maWVsZHM6IHtcclxuICAgICdyZW5ld2FibGUnOiBbJ3RlY2hub2xvZ3knXSxcclxuICAgICdlZmZpY2llbmN5JzogWydzZWN0b3InXSxcclxuICAgICd0cmFuc3BvcnRhdGlvbic6IFsnY2hhcmdpbmdfZnVlbGluZ19zdGF0aW9uX3RlY2hub2xvZ3knLCAndmVoaWNsZV90ZWNobm9sb2d5J11cclxuICB9LCAgXHJcbiAgY29sb3JfZmllbGRzOiB7XHJcbiAgICAncmVuZXdhYmxlJzogJ3RlY2hub2xvZ3knLFxyXG4gICAgJ2VmZmljaWVuY3knOiAnc2VjdG9yJyxcclxuICAgICd0cmFuc3BvcnRhdGlvbic6ICdjaGFyZ2luZ19mdWVsaW5nX3N0YXRpb25fdGVjaG5vbG9neSdcclxuICB9LCAgXHJcbiAgZXZlbnRzOiB7XHJcbiAgICAnY2xpY2sgLmxheWVyVG9nZ2xlJzogJ2xheWVyVG9nZ2xlJ1xyXG4gIH0sXHJcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLnJlbmRlcigpXHJcbiAgICB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsICdjaGFuZ2U6ZGF0YScsIHRoaXMudXBkYXRlLCB0aGlzKVxyXG4gICAgdGhpcy5saXN0ZW5UbyhEYXNoYm9hcmQuZmlsdGVyQ29sbGVjdGlvbiwgJ3JlbW92ZScsIHRoaXMudXBkYXRlR2VvRmlsdGVycywgdGhpcylcclxuICAgIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgJ2NoYW5nZTpsb2FkaW5nJywgdGhpcy5sb2FkaW5nKVxyXG4gIH0sXHJcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcclxuICAgICAgdGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKCkpXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH0sXHJcbiAgbWFrZU1hcDogZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXNcclxuICAgIHZhciBlbCA9IHRoaXMuJGVsLmZpbmQoJy5tYXAnKS5nZXQoMClcclxuICAgIHRoaXMubWFwID0gTC5tYXAoZWwsIHtcclxuICAgICAgYXR0cmlidXRpb25Db250cm9sOiBmYWxzZSxcclxuICAgICAgbWluWm9vbTogNyxcclxuICAgICAgbWF4Wm9vbTogMTYsXHJcbiAgICAgIGRlZmF1bHRFeHRlbnRDb250cm9sOiB0cnVlXHJcbiAgICB9KS5zZXRWaWV3KFszOSwgLTc3XSwgNylcclxuICAgIHNlbGYuJGVsLmZpbmQoJy5tYXAnKS5maW5kKCcubGVhZmxldC10b3AubGVhZmxldC1yaWdodCcpLmh0bWwoJzxkaXYgY2xhc3M9XCJsb2FkZXJcIj48aSBjbGFzcz1cImZhIGZhLWNpcmNsZS1vLW5vdGNoIGZhLXNwaW5cIj48L2k+PC9kaXY+JylcclxuICAgIHNlbGYuJGVsLmZpbmQoJy5tYXAnKS5maW5kKCcubGVhZmxldC1ib3R0b20ubGVhZmxldC1yaWdodCcpLmh0bWwoJzxkaXYgaWQ9XCJtb3VzZW92ZXJcIiBjbGFzcz1cImxheWVyVG9nZ2xlXCI+PC9kaXY+JylcclxuICAgIHRoaXMubWFrZUxheWVycygpXHJcbiAgfSxcclxuICBtYWtlTGF5ZXJzOiBmdW5jdGlvbigpIHtcclxuICAgIHZhciBzZWxmID0gdGhpc1xyXG4gICAgdGhpcy5zdHlsZSA9IHtcclxuICAgICAgXCJjb2xvclwiOiBcIiMzMzNcIixcclxuICAgICAgXCJ3ZWlnaHRcIjogMSxcclxuICAgICAgXCJvcGFjaXR5XCI6IDAuNjUsXHJcbiAgICAgIFwiZmlsbE9wYWNpdHlcIjogMC4xLFxyXG4gICAgICBcImZpbGxDb2xvclwiOiBcIiNBOUM3ODNcIlxyXG4gICAgfVxyXG4gICAgdGhpcy5zZWxlY3RlZFN0eWxlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLnN0eWxlKSlcclxuICAgIHRoaXMuc2VsZWN0ZWRTdHlsZS5maWxsT3BhY2l0eSA9IDAuNFxyXG5cclxuICAgIHRoaXMuY2lyY2xlc3R5bGUgPSB7XHJcbiAgICAgIHJhZGl1czogNCxcclxuICAgICAgZmlsbENvbG9yOiBcIiNiYmJcIixcclxuICAgICAgY29sb3I6IFwiIzMzM1wiLFxyXG4gICAgICB3ZWlnaHQ6IDEsXHJcbiAgICAgIG9wYWNpdHk6IDEsXHJcbiAgICAgIGZpbGxPcGFjaXR5OiAwLjgsXHJcbiAgICAgIHByb2plY3RzOiAxXHJcbiAgICB9XHJcblxyXG4gICAgdmFyIG1hcGJveCA9IEwudGlsZUxheWVyKCdodHRwczovL3tzfS50aWxlcy5tYXBib3guY29tL3YzL2VzcmdjLm1hcC15OWF3ZjQwdi97en0ve3h9L3t5fS5wbmcnKVxyXG4gICAgbWFwYm94LmFkZFRvKHNlbGYubWFwKVxyXG5cclxuICAgIHRoaXMucHJvamVjdHMgPSBMLm1hcmtlckNsdXN0ZXJHcm91cCh7XHJcbiAgICAgIG1heENsdXN0ZXJSYWRpdXM6IDUwLFxyXG4gICAgICBzaG93Q292ZXJhZ2VPbkhvdmVyOiBmYWxzZSxcclxuICAgICAgc3BpZGVyZnlPbk1heFpvb206IHRydWUsXHJcbiAgICAgIHBvbHlnb25PcHRpb25zOiB7XHJcbiAgICAgICAgY29sb3I6ICcjMkI0RTcyJyxcclxuICAgICAgICB3ZWlnaHQ6IDIsXHJcbiAgICAgICAgZmlsbENvbG9yOiAnIzMzMycsXHJcbiAgICAgICAgZmlsbE9wYWNpdHk6IDAuMVxyXG4gICAgICB9LFxyXG4gICAgICBpY29uQ3JlYXRlRnVuY3Rpb246IGZ1bmN0aW9uKGNsdXN0ZXIpIHtcclxuICAgICAgICB2YXIgbWFya2VycyA9IGNsdXN0ZXIuZ2V0QWxsQ2hpbGRNYXJrZXJzKClcclxuICAgICAgICB2YXIgbnVtX3Byb2plY3RzID0gMFxyXG4gICAgICAgIHZhciB0ZWNoID0gW11cclxuICAgICAgICB2YXIgdGVjaF9maWVsZHMgPSBbXVxyXG4gICAgICAgIF8uZWFjaChtYXJrZXJzLCBmdW5jdGlvbihtKSB7XHJcbiAgICAgICAgICBpZiAobS5vcHRpb25zLnByb2plY3RzKSB7XHJcbiAgICAgICAgICAgIG51bV9wcm9qZWN0cyArPSBtLm9wdGlvbnMucHJvamVjdHNcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChtLm9wdGlvbnMudGVjaCkgdGVjaC5wdXNoKG0ub3B0aW9ucy50ZWNoKVxyXG4gICAgICAgICAgaWYgKG0ub3B0aW9ucy50ZWNoX2ZpZWxkKSB0ZWNoX2ZpZWxkcy5wdXNoKG0ub3B0aW9ucy50ZWNoX2ZpZWxkKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGVjaCA9IF8udW5pcSh0ZWNoKVxyXG4gICAgICAgIHRlY2hfZmllbGRzID0gXy51bmlxKHRlY2hfZmllbGRzKVxyXG4gICAgICAgIHZhciBjbGFzc05hbWUgPSAncHJvamVjdHMtaWNvbiAnXHJcbiAgICAgICAgaWYgKHRlY2gubGVuZ3RoID09PSAxICYmIERhc2hib2FyZC5hY3RpdmV0YWIgIT09ICdlZmZpY2llbmN5Jykge1xyXG4gICAgICAgICAgY2xhc3NOYW1lICs9IHRlY2hbMF1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY2xhc3NOYW1lICs9ICdtdWx0aXBsZSdcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRlY2hfZmllbGRzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgY2xhc3NOYW1lICs9ICcgJyArIHRlY2hfZmllbGRzWzBdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNsYXNzTmFtZSA9IGNsYXNzTmFtZSArICcgJyArIERhc2hib2FyZC5hY3RpdmV0YWJcclxuICAgICAgICByZXR1cm4gbmV3IEwuRGl2SWNvbih7XHJcbiAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzTmFtZSxcclxuICAgICAgICAgIGh0bWw6IG51bV9wcm9qZWN0cyxcclxuICAgICAgICAgIGljb25TaXplOiBMLnBvaW50KDMwLCAzMClcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9KS5hZGRUbyhzZWxmLm1hcClcclxuXHJcbiAgICAkLndoZW4oXHJcbiAgICAgICQuZ2V0SlNPTignZGF0YS9tYXJ5bGFuZC1zaW5nbGUuanNvbicsIGZ1bmN0aW9uKGpzb24pIHtcclxuICAgICAgICBzZWxmLm1hcnlsYW5kID0gTC5nZW9Kc29uKGpzb24sIHtcclxuICAgICAgICAgIHN0eWxlOiBzZWxmLnN0eWxlLFxyXG4gICAgICAgICAgbmFtZTogJ3N0YXRlJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgIH0pLFxyXG4gICAgICAkLmdldEpTT04oJ2RhdGEvbWFyeWxhbmQtY291bnRpZXMuanNvbicsIGZ1bmN0aW9uKGpzb24pIHtcclxuICAgICAgICBzZWxmLmNvdW50aWVzID0gTC5nZW9Kc29uKGpzb24sIHtcclxuICAgICAgICAgIHN0eWxlOiBzZWxmLnN0eWxlLFxyXG4gICAgICAgICAgb25FYWNoRmVhdHVyZTogc2VsZi5vbkVhY2hGZWF0dXJlLmJpbmQoc2VsZiksXHJcbiAgICAgICAgICBuYW1lOiAnY291bnR5J1xyXG4gICAgICAgIH0pLmFkZFRvKHNlbGYubWFwKVxyXG4gICAgICAgIHZhciBmID0gbmV3IEZpbHRlck1vZGVsKHtcclxuICAgICAgICAgIHZhbHVlOiBzZWxmLmNvdW50aWVzLm9wdGlvbnMubmFtZSxcclxuICAgICAgICAgIHR5cGU6ICdnZW90eXBlJ1xyXG4gICAgICAgIH0pLm9uKCdjaGFuZ2U6dmFsdWUnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICBfLmVhY2goRGFzaGJvYXJkLmNoYXJ0Q29sbGVjdGlvbi53aGVyZSh7Z2VvOiB0cnVlfSksIGZ1bmN0aW9uKGNoYXJ0KSB7XHJcbiAgICAgICAgICAgIGNoYXJ0LnVwZGF0ZSgpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgRGFzaGJvYXJkLmZpbHRlckNvbGxlY3Rpb24uYWRkKGYpXHJcbiAgICAgIH0pLFxyXG4gICAgICAkLmdldEpTT04oJ2RhdGEvbWFyeWxhbmQtbGVnaXNsYXRpdmUtZGlzdHJpY3RzLmpzb24nLCBmdW5jdGlvbihqc29uKSB7XHJcbiAgICAgICAgc2VsZi5sZWdpc2xhdGl2ZURpc3RyaWN0cyA9IEwuZ2VvSnNvbihqc29uLCB7XHJcbiAgICAgICAgICBzdHlsZTogc2VsZi5zdHlsZSxcclxuICAgICAgICAgIG9uRWFjaEZlYXR1cmU6IHNlbGYub25FYWNoRmVhdHVyZS5iaW5kKHNlbGYpLFxyXG4gICAgICAgICAgbmFtZTogJ2xlZ2lzbGF0aXZlJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgIH0pLFxyXG4gICAgICAkLmdldEpTT04oJ2RhdGEvbWFyeWxhbmQtY29uZ3Jlc3Npb25hbC1kaXN0cmljdHMuanNvbicsIGZ1bmN0aW9uKGpzb24pIHtcclxuICAgICAgICBzZWxmLmNvbmdyZXNzaW9uYWxEaXN0cmljdHMgPSBMLmdlb0pzb24oanNvbiwge1xyXG4gICAgICAgICAgc3R5bGU6IHNlbGYuc3R5bGUsXHJcbiAgICAgICAgICBvbkVhY2hGZWF0dXJlOiBzZWxmLm9uRWFjaEZlYXR1cmUuYmluZChzZWxmKSxcclxuICAgICAgICAgIG5hbWU6ICdjb25ncmVzc2lvbmFsJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgIH0pLFxyXG4gICAgICAkLmdldEpTT04oJ2RhdGEvbWFyeWxhbmQtemlwcy5qc29uJywgZnVuY3Rpb24oanNvbikge1xyXG4gICAgICAgIHNlbGYuemlwcyA9IEwuZ2VvSnNvbihqc29uLCB7XHJcbiAgICAgICAgICBzdHlsZTogc2VsZi5zdHlsZSxcclxuICAgICAgICAgIG9uRWFjaEZlYXR1cmU6IHNlbGYub25FYWNoRmVhdHVyZS5iaW5kKHNlbGYpLFxyXG4gICAgICAgICAgbmFtZTogJ3ppcGNvZGUnXHJcbiAgICAgICAgfSlcclxuICAgICAgfSlcclxuICAgICkudGhlbihmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgIHNlbGYubGF5ZXJfc3dpdGNoZXIgPSB7bGF5ZXJzOiBbXHJcbiAgICAgICAge25hbWU6IFwiTWFyeWxhbmRcIiwgaWQ6IFwic3RhdGVcIiwgbGF5ZXI6IHNlbGYubWFyeWxhbmQsIHR5cGU6ICdiYXNlJ30sXHJcbiAgICAgICAge25hbWU6IFwiQ291bnRpZXNcIiwgaWQ6IFwiY291bnR5XCIsIGxheWVyOiBzZWxmLmNvdW50aWVzLCB0eXBlOiAnYmFzZSd9LFxyXG4gICAgICAgIHtuYW1lOiBcIkxlZy4gRGlzdC5cIiwgaWQ6IFwibGVnaXNsYXRpdmVcIiwgbGF5ZXI6IHNlbGYubGVnaXNsYXRpdmVEaXN0cmljdHMsIHR5cGU6ICdiYXNlJ30sXHJcbiAgICAgICAge25hbWU6IFwiQ29uZy4gRGlzdC5cIiwgaWQ6IFwiY29uZ3Jlc3Npb25hbFwiLCBsYXllcjogc2VsZi5jb25ncmVzc2lvbmFsRGlzdHJpY3RzLCB0eXBlOiAnYmFzZSd9LFxyXG4gICAgICAgIHtuYW1lOiBcIlppcCBDb2Rlc1wiLCBpZDogXCJ6aXBjb2RlXCIsIGxheWVyOiBzZWxmLnppcHMsIHR5cGU6ICdiYXNlJ30sXHJcbiAgICAgICAge25hbWU6IFwiSW5kaXZpZHVhbCBQcm9qZWN0c1wiLCBpZDogXCJwcm9qZWN0c1wiLCBsYXllcjogc2VsZi5wcm9qZWN0cywgdHlwZTogJ292ZXJsYXknfVxyXG4gICAgICBdfVxyXG4gICAgICB2YXIgbGF5ZXJzX2h0bWwgPSBzZWxmLmxheWVyc190ZW1wbGF0ZShzZWxmLmxheWVyX3N3aXRjaGVyKVxyXG4gICAgICBzZWxmLiRlbC5maW5kKCcubWFwJykuZmluZCgnLmxlYWZsZXQtYm90dG9tLmxlYWZsZXQtbGVmdCcpLmh0bWwobGF5ZXJzX2h0bWwpXHJcbiAgICAgIHNlbGYuJGVsLmZpbmQoJyNjb3VudHknKS5maW5kKCdwJykuYWRkQ2xhc3MoJ2FjdGl2ZScpXHJcbiAgICAgIHNlbGYuJGVsLmZpbmQoJyNwcm9qZWN0cycpLmZpbmQoJ3AnKS5hZGRDbGFzcygnYWN0aXZlJylcclxuICAgIH0pXHJcbiAgfSxcclxuICBtYWtlUG9wdXA6IGZ1bmN0aW9uKGZlYXR1cmVzLCBsYXRsbmcsIHRlY2hfZmllbGQpIHtcclxuICAgIHZhciBzZWxmID0gdGhpc1xyXG4gICAgdmFyIG1vbmV5ID0gZDMuZm9ybWF0KCckLGYnKVxyXG4gICAgdmFyIGNvbnRlbnQgPSAnPGRpdiBjbGFzcz1cIm1hcC1wcm9qZWN0c1wiPidcclxuICAgIF8uZWFjaChmZWF0dXJlcywgZnVuY3Rpb24oZmVhdHVyZSkge1xyXG4gICAgICB2YXIgaSA9IChwYXJzZUZsb2F0KGZlYXR1cmUudG90YWxfcHJvamVjdF9jb3N0KSAtIHBhcnNlRmxvYXQoZmVhdHVyZS5tZWFfYXdhcmQpKS9wYXJzZUZsb2F0KGZlYXR1cmUubWVhX2F3YXJkKSB8fCAwXHJcbiAgICAgIGZlYXR1cmUuaW52ZXN0bWVudF9sZXZlcmFnZSA9IGQzLnJvdW5kKGksIDIpXHJcbiAgICAgIGlmIChmZWF0dXJlLm1lYV9hd2FyZCkge1xyXG4gICAgICAgIGZlYXR1cmUubWVhX2F3YXJkID0gbW9uZXkoZmVhdHVyZS5tZWFfYXdhcmQpXHJcbiAgICAgIH1cclxuICAgICAgaWYgKGZlYXR1cmUub3RoZXJfYWdlbmN5X2RvbGxhcnMpIHtcclxuICAgICAgICBmZWF0dXJlLm90aGVyX2FnZW5jeV9kb2xsYXJzID0gbW9uZXkoZmVhdHVyZS5vdGhlcl9hZ2VuY3lfZG9sbGFycylcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBmZWF0dXJlLm90aGVyX2FnZW5jeV9kb2xsYXJzID0gbW9uZXkoMClcclxuICAgICAgfVxyXG4gICAgICBpZiAoZmVhdHVyZS50b3RhbF9wcm9qZWN0X2Nvc3QpIHtcclxuICAgICAgICBmZWF0dXJlLnRvdGFsX3Byb2plY3RfY29zdCA9IG1vbmV5KGZlYXR1cmUudG90YWxfcHJvamVjdF9jb3N0KVxyXG4gICAgICB9XHJcbiAgICAgIGZlYXR1cmUuY29sb3IgPSAnI2JiYidcclxuICAgICAgLy92YXIgY29sb3JfZmllbGQgPSBzZWxmLmNvbG9yX2ZpZWxkc1tEYXNoYm9hcmQuYWN0aXZldGFiXVxyXG4gICAgICBpZiAoZmVhdHVyZVt0ZWNoX2ZpZWxkXSkge1xyXG4gICAgICAgIHZhciBmaWx0ZXIgPSBEYXNoYm9hcmQuZmlsdGVyQ29sbGVjdGlvbi53aGVyZSh7dmFsdWU6IGZlYXR1cmVbdGVjaF9maWVsZF19KVxyXG4gICAgICAgIGlmIChmaWx0ZXIubGVuZ3RoKSB7XHJcbiAgICAgICAgICBmZWF0dXJlLmNvbG9yID0gZmlsdGVyWzBdLmdldCgnY29sb3InKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBjb250ZW50ICs9IHNlbGYudGVtcGxhdGVzW0Rhc2hib2FyZC5hY3RpdmV0YWJdKGZlYXR1cmUpXHJcbiAgICB9KVxyXG4gICAgY29udGVudCArPSAnPC9kaXY+J1xyXG4gICAgcmV0dXJuIGNvbnRlbnRcclxuICB9LFxyXG4gIGxheWVyVG9nZ2xlOiBmdW5jdGlvbihlKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXNcclxuICAgIHZhciBpZCA9ICQoZS5jdXJyZW50VGFyZ2V0KS5hdHRyKCdpZCcpXHJcbiAgICB2YXIgbGF5ZXIgPSBfLmZpbmRXaGVyZSh0aGlzLmxheWVyX3N3aXRjaGVyLmxheWVycywge2lkOiBpZH0pXHJcbiAgICBpZiAobGF5ZXIgJiYgbGF5ZXIudHlwZSA9PT0gJ292ZXJsYXknKSB7XHJcbiAgICAgIGlmIChzZWxmLm1hcC5oYXNMYXllcihsYXllci5sYXllcikpIHtcclxuICAgICAgICB0aGlzLm1hcC5yZW1vdmVMYXllcihsYXllci5sYXllcilcclxuICAgICAgICAkKGUuY3VycmVudFRhcmdldCkuZmluZCgncCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxyXG4gICAgICAgIHRoaXMubW9kZWwuc2V0KCd2aXNpYmxlJywgZmFsc2UpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5tYXAuYWRkTGF5ZXIobGF5ZXIubGF5ZXIpXHJcbiAgICAgICAgJChlLmN1cnJlbnRUYXJnZXQpLmZpbmQoJ3AnKS5hZGRDbGFzcygnYWN0aXZlJylcclxuICAgICAgICB0aGlzLm1vZGVsLnNldCgndmlzaWJsZScsIHRydWUpXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAobGF5ZXIudHlwZSA9PT0gJ2Jhc2UnKSB7XHJcbiAgICAgIGlmICghdGhpcy5tYXAuaGFzTGF5ZXIobGF5ZXIubGF5ZXIpKSB7XHJcbiAgICAgICAgdmFyIGJhc2UgPSBfLndoZXJlKHRoaXMubGF5ZXJfc3dpdGNoZXIubGF5ZXJzLCB7dHlwZTogJ2Jhc2UnfSlcclxuICAgICAgICBfLmVhY2goYmFzZSwgZnVuY3Rpb24obCkge1xyXG4gICAgICAgICAgc2VsZi5tYXAucmVtb3ZlTGF5ZXIobC5sYXllcilcclxuICAgICAgICAgIHNlbGYuJGVsLmZpbmQoJy5sYXllclRvZ2dsZSMnICsgbC5pZCkuZmluZCgncCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdmFyIGdlb2ZpbHRlcnMgPSBEYXNoYm9hcmQuZmlsdGVyQ29sbGVjdGlvbi53aGVyZSh7Z2VvOiB0cnVlfSlcclxuICAgICAgICBEYXNoYm9hcmQuZmlsdGVyQ29sbGVjdGlvbi5yZW1vdmUoZ2VvZmlsdGVycylcclxuICAgICAgICB0aGlzLm1hcC5hZGRMYXllcihsYXllci5sYXllcilcclxuICAgICAgICAkKGUuY3VycmVudFRhcmdldCkuZmluZCgncCcpLmFkZENsYXNzKCdhY3RpdmUnKVxyXG4gICAgICAgIERhc2hib2FyZC5maWx0ZXJDb2xsZWN0aW9uLmZpbmRXaGVyZSh7dHlwZTogJ2dlb3R5cGUnfSkuc2V0KCd2YWx1ZScsIGxheWVyLmlkKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBvbkVhY2hGZWF0dXJlOiBmdW5jdGlvbihmZWF0dXJlLCBsYXllcikge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzXHJcbiAgICBsYXllci5vbignY2xpY2snLCBmdW5jdGlvbihmZWF0dXJlLCBsYXllciwgZSl7XHJcbiAgICAgIHZhciBvcHRpb25zID0gbGF5ZXIub3B0aW9ucyB8fCBsYXllci5fb3B0aW9uc1xyXG4gICAgICB2YXIgbmFtZSA9IGZlYXR1cmUucHJvcGVydGllcy5uYW1lXHJcbiAgICAgIHZhciBmaWx0ZXIgPSBEYXNoYm9hcmQuZmlsdGVyQ29sbGVjdGlvbi5maW5kV2hlcmUoe3R5cGU6IG9wdGlvbnMubmFtZSwgdmFsdWU6IG5hbWV9KVxyXG4gICAgICBpZiAoZmlsdGVyKSB7XHJcbiAgICAgICAgbGF5ZXIuc2V0U3R5bGUoc2VsZi5zdHlsZSlcclxuICAgICAgICBEYXNoYm9hcmQuZmlsdGVyQ29sbGVjdGlvbi5yZW1vdmUoZmlsdGVyKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxheWVyLnNldFN0eWxlKHNlbGYuc2VsZWN0ZWRTdHlsZSlcclxuICAgICAgICB2YXIgZiA9IG5ldyBGaWx0ZXJNb2RlbCh7XHJcbiAgICAgICAgICB2YWx1ZTogbmFtZSxcclxuICAgICAgICAgIHR5cGU6IG9wdGlvbnMubmFtZSxcclxuICAgICAgICAgIGFjdGl2ZTogdHJ1ZSxcclxuICAgICAgICAgIGdlbzogdHJ1ZVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgRGFzaGJvYXJkLmZpbHRlckNvbGxlY3Rpb24uYWRkKGYpXHJcbiAgICAgIH1cclxuICAgIH0uYmluZCh0aGlzLCBmZWF0dXJlLCBsYXllcikpXHJcbiAgICBsYXllci5vbignbW91c2VvdmVyJywgZnVuY3Rpb24obGF5ZXIsIGUpIHtcclxuICAgICAgdmFyIG9wdGlvbnMgPSBsYXllci5vcHRpb25zIHx8IGxheWVyLl9vcHRpb25zXHJcbiAgICAgIHZhciBuYW1lID0gZS50YXJnZXQuZmVhdHVyZS5wcm9wZXJ0aWVzLm5hbWVcclxuICAgICAgaWYgKG9wdGlvbnMubmFtZSA9PT0gJ2NvbmdyZXNzaW9uYWwnKSB7XHJcbiAgICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgnMjQnLCAnJylcclxuICAgICAgfVxyXG4gICAgICBzZWxmLiRlbC5maW5kKCcubWFwJykuZmluZCgnI21vdXNlb3ZlcicpLmh0bWwobmFtZSlcclxuICAgICAgc2VsZi4kZWwuZmluZCgnLm1hcCcpLmZpbmQoJyNtb3VzZW92ZXInKS5zaG93KClcclxuICAgIH0uYmluZCh0aGlzLCBsYXllcikpXHJcbiAgICBsYXllci5vbignbW91c2VvdXQnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgIHNlbGYuJGVsLmZpbmQoJy5tYXAnKS5maW5kKCcjbW91c2VvdmVyJykuaGlkZSgpXHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgdXBkYXRlR2VvRmlsdGVyczogZnVuY3Rpb24oZmlsdGVyKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXNcclxuICAgIGlmIChmaWx0ZXIuZ2V0KCdnZW8nKSkge1xyXG4gICAgICB2YXIgbGF5ZXIgPSBfLndoZXJlKHRoaXMubGF5ZXJfc3dpdGNoZXIubGF5ZXJzLCB7aWQ6IGZpbHRlci5nZXQoJ3R5cGUnKX0pWzBdLmxheWVyXHJcbiAgICAgIGxheWVyLmVhY2hMYXllcihmdW5jdGlvbihsKSB7XHJcbiAgICAgICAgaWYobC5mZWF0dXJlLnByb3BlcnRpZXMubmFtZSA9PT0gZmlsdGVyLmdldCgndmFsdWUnKSkge1xyXG4gICAgICAgICAgbC5zZXRTdHlsZShzZWxmLnN0eWxlKVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9LFxyXG4gIHVwZGF0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXNcclxuICAgIHNlbGYucHJvamVjdHMuY2xlYXJMYXllcnMoKVxyXG4gICAgc2VsZi5tYXAuY2xvc2VQb3B1cCgpXHJcbiAgICBfLmVhY2godGhpcy5tb2RlbC5nZXQoJ2RhdGEnKS5wb2ludHMsIGZ1bmN0aW9uKHBvaW50KSB7XHJcbiAgICAgIGlmIChwb2ludC5wb2ludCkge1xyXG4gICAgICAgIHZhciBsYXRsbmcgPSBwb2ludC5wb2ludC5zcGxpdCgnLCcpLm1hcChwYXJzZUZsb2F0KVxyXG4gICAgICAgIHZhciB0ZWNobm9sb2d5X2ZpZWxkcyA9IHNlbGYudGVjaG5vbG9neV9maWVsZHNbRGFzaGJvYXJkLmFjdGl2ZXRhYl1cclxuICAgICAgICB0ZWNobm9sb2d5X2ZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uKHRlY2hfZmllbGQsIHRlY2hfaWR4KSB7XHJcbiAgICAgICAgICBpZiAocG9pbnRbdGVjaF9maWVsZF0gJiYgcG9pbnRbdGVjaF9maWVsZF0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBwb2ludFt0ZWNoX2ZpZWxkXS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgIHZhciB0ZWNobm9sb2d5ID0gcG9pbnRbdGVjaF9maWVsZF1baV0udFxyXG4gICAgICAgICAgICAgIHZhciBwcm9qZWN0cyA9IHBvaW50W3RlY2hfZmllbGRdW2ldLnBcclxuICAgICAgICAgICAgICB2YXIgdGVjaF9maWx0ZXIgPSB0ZWNoX2ZpZWxkICsgdGVjaG5vbG9neS5yZXBsYWNlKC8gL2csICcnKS5yZXBsYWNlKCcoJywgJycpLnJlcGxhY2UoJyknLCAnJylcclxuICAgICAgICAgICAgICBpZiAocHJvamVjdHMgPiAxKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2xhc3NOYW1lID0gJ3Byb2plY3RzLWljb24gJ1xyXG4gICAgICAgICAgICAgICAgdmFyIG1hcmtlcl9wcm9wcyA9IHtwcm9qZWN0czogcHJvamVjdHN9XHJcbiAgICAgICAgICAgICAgICBpZiAodGVjaF9maWVsZCAhPT0gJ3NlY3RvcicpIHtcclxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lICs9IHRlY2hfZmlsdGVyXHJcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZSArPSAnICcgKyB0ZWNoX2ZpZWxkXHJcbiAgICAgICAgICAgICAgICAgIG1hcmtlcl9wcm9wcy50ZWNoID0gdGVjaF9maWx0ZXJcclxuICAgICAgICAgICAgICAgICAgbWFya2VyX3Byb3BzLnRlY2hfZmllbGQgPSB0ZWNoX2ZpZWxkXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBtYXJrZXJfcHJvcHMuaWNvbiA9IEwuZGl2SWNvbih7XHJcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogY2xhc3NOYW1lLFxyXG4gICAgICAgICAgICAgICAgICBodG1sOiBwcm9qZWN0cyxcclxuICAgICAgICAgICAgICAgICAgaWNvblNpemU6IEwucG9pbnQoMzAsIDMwKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIHZhciBtYXJrZXIgPSBMLm1hcmtlcihsYXRsbmcsIG1hcmtlcl9wcm9wcylcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRlY2hub2xvZ3kpIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKHRlY2hfZmllbGQgIT09ICdzZWN0b3InKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jaXJjbGVzdHlsZS50ZWNoID0gdGVjaF9maWx0ZXJcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmNpcmNsZXN0eWxlLnRlY2hfZmllbGQgPSB0ZWNoX2ZpZWxkXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgdmFyIGZpbHRlciA9IERhc2hib2FyZC5maWx0ZXJDb2xsZWN0aW9uLndoZXJlKHt2YWx1ZTogdGVjaG5vbG9neSwgdHlwZTogdGVjaF9maWVsZH0pXHJcbiAgICAgICAgICAgICAgICAgIGlmIChmaWx0ZXIubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRlY2hfZmllbGQgPT09ICdzZWN0b3InKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNpcmNsZXN0eWxlLmZpbGxDb2xvciA9ICcjYmJiJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNpcmNsZXN0eWxlLmZpbGxDb2xvciA9IGZpbHRlclswXS5nZXQoJ2NvbG9yJylcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jaXJjbGVzdHlsZS5yYWRpdXMgPSA2XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIHNlbGYuY2lyY2xlc3R5bGUudGVjaCA9ICdtdWx0aXBsZSdcclxuICAgICAgICAgICAgICAgICAgc2VsZi5jaXJjbGVzdHlsZS5maWxsQ29sb3IgPSAnIzAwMCdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0ZWNoX2ZpZWxkID09PSAnY2hhcmdpbmdfZnVlbGluZ19zdGF0aW9uX3RlY2hub2xvZ3knKSB7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBtYXJrZXJfcHJvcHMgPSB7cHJvamVjdHM6IDF9XHJcbiAgICAgICAgICAgICAgICAgIHZhciBjbGFzc05hbWUgPSAncHJvamVjdHMtaWNvbiAnXHJcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZSArPSB0ZWNoX2ZpbHRlclxyXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWUgKz0gJyAnICsgdGVjaF9maWVsZFxyXG4gICAgICAgICAgICAgICAgICBtYXJrZXJfcHJvcHMudGVjaCA9IHRlY2hfZmlsdGVyXHJcbiAgICAgICAgICAgICAgICAgIG1hcmtlcl9wcm9wcy50ZWNoX2ZpZWxkID0gdGVjaF9maWVsZFxyXG4gICAgICAgICAgICAgICAgICBtYXJrZXJfcHJvcHMuaWNvbiA9IEwuZGl2SWNvbih7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBjbGFzc05hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgaWNvblNpemU6IEwucG9pbnQoMTAsIDEwKVxyXG4gICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICB2YXIgbWFya2VyID0gTC5tYXJrZXIobGF0bG5nLCBtYXJrZXJfcHJvcHMpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICB2YXIgbWFya2VyID0gTC5jaXJjbGVNYXJrZXIobGF0bG5nLCBzZWxmLmNpcmNsZXN0eWxlKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBtYXJrZXIub24oJ2NsaWNrJywgc2VsZi5tYXJrZXJDbGljay5iaW5kKHNlbGYsIHBvaW50LCB0ZWNoX2ZpZWxkLCB0ZWNobm9sb2d5LCBsYXRsbmcpKVxyXG4gICAgICAgICAgICAgIHNlbGYucHJvamVjdHMuYWRkTGF5ZXIobWFya2VyKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9LFxyXG4gIG1hcmtlckNsaWNrOiBmdW5jdGlvbihwcm9qZWN0LCB0ZWNoX2ZpZWxkLCB0ZWNobm9sb2d5LCBsYXRsbmcsIGUpIHtcclxuICAgIHZhciBzZWxmID0gdGhpc1xyXG4gICAgdmFyIHVybCA9ICdhcGkvZ2V0UHJvamVjdHNCeVBvaW50J1xyXG4gICAgdXJsID0gc2VsZi5tb2RlbC5tYWtlUXVlcnkodXJsKVxyXG4gICAgLy91cmwgKz0gJyZfaWQ9JyArIHByb2plY3QuX2lkXHJcbiAgICB1cmwgKz0gJyZwb2ludD0nICsgcHJvamVjdC5wb2ludFxyXG4gICAgdXJsICs9ICcmdGVjaD0nICsgdGVjaG5vbG9neVxyXG4gICAgdXJsICs9ICcmdGVjaF9maWVsZD0nICsgdGVjaF9maWVsZFxyXG4gICAgdmFyIHBvcHVwID0gTC5wb3B1cCgpXHJcbiAgICAuc2V0TGF0TG5nKGxhdGxuZylcclxuICAgIC5zZXRDb250ZW50KCdMb2FkaW5nJylcclxuICAgIC5vcGVuT24oc2VsZi5tYXApXHJcbiAgICAkLmdldEpTT04odXJsLCBmdW5jdGlvbihyZXMpe1xyXG4gICAgICBwb3B1cC5zZXRDb250ZW50KHNlbGYubWFrZVBvcHVwKHJlcywgbGF0bG5nLCB0ZWNoX2ZpZWxkKSlcclxuICAgIH0pXHJcbiAgfSxcclxuICBsb2FkaW5nOiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuJGVsLmZpbmQoJy5tYXAnKS5maW5kKCcubG9hZGVyJykudG9nZ2xlKClcclxuICB9LFxyXG4gIHJlc2V0OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMubWFwLnNldFZpZXcoWzM5LCAtNzddLCA3KVxyXG4gIH1cclxufSlcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWFwVmlldyIsImNvbnN0IEJhckNoYXJ0VmlldyA9IHJlcXVpcmUoJy4vQmFyQ2hhcnRWaWV3JylcclxuXHJcbmNvbnN0IFBpZUNoYXJ0VmlldyA9IEJhckNoYXJ0Vmlldy5leHRlbmQoe1xyXG4gIGNoYW5nZUtleTogZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAodGhpcy5jaGFydCkge1xyXG4gICAgICB0aGlzLmNoYXJ0Lm9wdGlvbnMubGFiZWwgPSB0aGlzLm1vZGVsLmdldCgna2V5JylcclxuICAgIH1cclxuICB9LFxyXG4gIGRyYXdDaGFydDogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmNoYXJ0ID0gbmV3IEdlb0Rhc2guUGllQ2hhcnQodGhpcy5jaGFydGVsLCB7XHJcbiAgICAgIGxhYmVsOiB0aGlzLm1vZGVsLmdldCgna2V5JylcclxuICAgICAgLCB2YWx1ZTogdGhpcy5tb2RlbC5nZXQoJ3knKVxyXG4gICAgICAsIHk6IHRoaXMubW9kZWwuZ2V0KCd5JylcclxuICAgICAgLCBjb2xvcnM6IHRoaXMubW9kZWwuZ2V0KCdjb2xvcnMnKVxyXG4gICAgICAsIGFyY2xhYmVsczogdHJ1ZVxyXG4gICAgICAsIGFyY2xhYmVsc01pbjogOFxyXG4gICAgICAsIG9wYWNpdHk6IDFcclxuICAgICAgLCBob3ZlclRlbXBsYXRlOiAne3tsYWJlbH19OiB7e3ZhbHVlfX0gJyArIHRoaXMubW9kZWwuZ2V0KCd1bml0cycpXHJcbiAgICAgICwgdmFsdWVGb3JtYXQ6IHRoaXMubW9kZWwuZ2V0KCd2YWx1ZUZvcm1hdCcpXHJcbiAgICAgICwgYXJjc3Ryb2tld2lkdGg6IDFcclxuICAgICAgLCBhcmNzdHJva2Vjb2xvcjogJyNmZmYnXHJcbiAgICAgICwgaW5uZXJSYWRpdXM6IDBcclxuICAgICAgLCBsZWdlbmQ6IHRoaXMubW9kZWwuZ2V0KCdsZWdlbmQnKVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGNoYW5nZUNoYXJ0T3B0aW9uc09uS2V5OiBmdW5jdGlvbihrZXkpIHtcclxuXHJcbiAgICB0aGlzLmNoYXJ0Lm9wdGlvbnMudmFsdWVGb3JtYXQgPSBkMy5mb3JtYXQoJywuMGYnKVxyXG5cclxuICAgIHZhciB0b29sID0gXy5maW5kV2hlcmUodGhpcy5tb2RlbC5nZXQoJ3Rvb2xzJyksIHt2YWx1ZToga2V5fSlcclxuICAgIGlmICh0b29sKSB7XHJcbiAgICAgIGlmICh0b29sLnR5cGUpIHtcclxuICAgICAgICBpZiAodG9vbC50eXBlID09PSAnbW9uZXknKSB7XHJcbiAgICAgICAgICB0aGlzLmNoYXJ0Lm9wdGlvbnMudmFsdWVGb3JtYXQgPSBkMy5mb3JtYXQoJyQsLjBmJylcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNoYXJ0Lm9wdGlvbnMudmFsdWUgPSBrZXlcclxuICAgIHRoaXMuY2hhcnQub3B0aW9ucy55ID0ga2V5XHJcbiAgICB0aGlzLm1vZGVsLnNldCgndmFsdWUnLCBrZXkpXHJcbiAgICB0aGlzLm1vZGVsLnNldCgneScsIGtleSlcclxuICB9LFxyXG4gIHByZXBEYXRhOiBmdW5jdGlvbihkYXRhKXtcclxuICAgIHZhciBzZWxmID0gdGhpc1xyXG4gICAgdmFyIHJvdyA9IGRhdGFbMF1cclxuICAgIGlmIChyb3cpIHtcclxuICAgICAgZGF0YSA9IF8uc29ydEJ5KGRhdGEsIGZ1bmN0aW9uKHJvdywgaSkge1xyXG4gICAgICAgIHJldHVybiByb3dbc2VsZi5jaGFydC5vcHRpb25zLnldXHJcbiAgICAgIH0pLnJldmVyc2UoKVxyXG4gICAgICB0aGlzLnNldENvbG9ycyhkYXRhKVxyXG4gICAgICB0aGlzLm1vZGVsLnNldCgnZGF0YScsIGRhdGEsIHtzaWxlbnQ6IHRydWV9KVxyXG4gICAgICBpZiAoZGF0YS5sZW5ndGggPiBzZWxmLmRhdGFMaW1pdCkge1xyXG4gICAgICAgIGRhdGEgPSBkYXRhLnNwbGljZSgwLCBzZWxmLmRhdGFMaW1pdClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRhdGFcclxuICB9XHJcbn0pXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBpZUNoYXJ0VmlldyIsImNvbnN0IFJvdXRlciA9IEJhY2tib25lLlJvdXRlci5leHRlbmQoe1xyXG4gIHJvdXRlczoge1xyXG4gICAgJzp0YWInOiAncmVuZXdhYmxlJ1xyXG4gIH0sXHJcbiAgcmVuZXdhYmxlOiBmdW5jdGlvbih0YWIpIHtcclxuICAgIERhc2hib2FyZC5zd2l0Y2hUYWIodGFiKVxyXG4gIH1cclxufSlcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUm91dGVyIiwiY29uc3QgQmFyQ2hhcnRWaWV3ID0gcmVxdWlyZSgnLi9CYXJDaGFydFZpZXcnKVxyXG5cclxuY29uc3QgU3RhY2tlZEJhckNoYXJ0VmlldyA9IEJhckNoYXJ0Vmlldy5leHRlbmQoe1xyXG4gIHByZXBEYXRhOiBmdW5jdGlvbihkYXRhKXtcclxuICAgIHZhciBzZWxmID0gdGhpc1xyXG4gICAgdmFyIHJvdyA9IGRhdGFbMF1cclxuICAgIGlmIChyb3cpIHtcclxuICAgICAgdmFyIHRvdGFscyA9IFtdXHJcbiAgICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihyb3csIGkpIHtcclxuICAgICAgICBpZiAoIXJvd1tzZWxmLm1vZGVsLmdldCgna2V5JyldKSB7XHJcbiAgICAgICAgICByb3dbc2VsZi5tb2RlbC5nZXQoJ2tleScpXSA9ICdPdGhlcidcclxuICAgICAgICB9XHJcbiAgICAgICAgdG90YWxzW2ldID0gMFxyXG4gICAgICAgIGlmICh0eXBlb2Ygc2VsZi5jaGFydC5vcHRpb25zLnkgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICB2YXIgeSA9ICtyb3dbc2VsZi5jaGFydC5vcHRpb25zLnldXHJcbiAgICAgICAgICByb3dbc2VsZi5jaGFydC5vcHRpb25zLnldID0geVxyXG4gICAgICAgICAgdG90YWxzW2ldICs9IHlcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzZWxmLmNoYXJ0Lm9wdGlvbnMueSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgIHNlbGYuY2hhcnQub3B0aW9ucy55LmZvckVhY2goZnVuY3Rpb24oeSkge1xyXG4gICAgICAgICAgICByb3dbeV0gPSArcm93W3ldXHJcbiAgICAgICAgICAgIHRvdGFsc1tpXSArPSByb3dbeV1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICBkYXRhID0gXy5zb3J0QnkoZGF0YSwgZnVuY3Rpb24ocm93LCBpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRvdGFsc1tpXVxyXG4gICAgICB9KS5yZXZlcnNlKClcclxuICAgICAgdGhpcy5zZXRDb2xvcnMoZGF0YSlcclxuICAgICAgdGhpcy5tb2RlbC5zZXQoJ2RhdGEnLCBkYXRhLCB7c2lsZW50OiB0cnVlfSlcclxuICAgICAgZGF0YSA9IF8ubWFwKGRhdGEsIGZ1bmN0aW9uKHJvdykge1xyXG4gICAgICAgIGlmIChyb3dbJ01FQSBDb250cmlidXRpb24nXSA9PT0gMCkge1xyXG4gICAgICAgICAgdmFyIGkgPSAwXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHZhciBpID0gKHBhcnNlRmxvYXQocm93WydUb3RhbCBQcm9qZWN0IENvc3QnXSkgLSBwYXJzZUZsb2F0KHJvd1snTUVBIENvbnRyaWJ1dGlvbiddKSkvcGFyc2VGbG9hdChyb3dbJ01FQSBDb250cmlidXRpb24nXSkgfHwgMFxyXG4gICAgICAgIH1cclxuICAgICAgICByb3dbJ0ludmVzdG1lbnQgTGV2ZXJhZ2UnXSA9IGQzLnJvdW5kKGksIDIpXHJcbiAgICAgICAgcmV0dXJuIHJvd1xyXG4gICAgICB9KVxyXG4gICAgICBpZiAoZGF0YS5sZW5ndGggPiBzZWxmLmRhdGFMaW1pdCkge1xyXG4gICAgICAgIGRhdGEgPSBkYXRhLnNwbGljZSgwLCBzZWxmLmRhdGFMaW1pdClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRhdGFcclxuICB9LFxyXG4gIHRvVGFibGU6IGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgeSA9IFsnVG90YWwgUHJvamVjdCBDb3N0JywgJ01FQSBDb250cmlidXRpb24nLCAnSW52ZXN0bWVudCBMZXZlcmFnZSddXHJcbiAgICB2YXIgVGFibGVWaWV3ID0gcmVxdWlyZSgnLi9UYWJsZVZpZXcnKVxyXG4gICAgdmFyIHZpZXcgPSBuZXcgVGFibGVWaWV3KHtcclxuICAgICAgbW9kZWw6IHRoaXMubW9kZWwsXHJcbiAgICAgIHk6IHksXHJcbiAgICAgIGNoYXJ0OiB0aGlzLmNoYXJ0XHJcbiAgICB9KVxyXG4gICAgdGhpcy4kZWwucGFyZW50KCkuaHRtbCh2aWV3LnJlbmRlcigpLmVsKVxyXG4gICAgdmlldy5yZXNpemUoKVxyXG4gIH1cclxufSlcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3RhY2tlZEJhckNoYXJ0VmlldyIsImNvbnN0IENoYXJ0VmlldyA9IHJlcXVpcmUoJy4vQ2hhcnRWaWV3JylcclxuY29uc3QgdGVtcGxhdGVzID0gcmVxdWlyZSgnLi90ZW1wbGF0ZXMnKShIYW5kbGViYXJzKVxyXG5cclxuY29uc3QgU3RhdFZpZXcgPSBDaGFydFZpZXcuZXh0ZW5kKHtcclxuICB0ZW1wbGF0ZTogdGVtcGxhdGVzLnN0YXQsXHJcbiAgZm9ybWF0OiBkMy5mb3JtYXQoJyQsLjBmJyksXHJcbiAgZXZlbnRzOiBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCBDaGFydFZpZXcucHJvdG90eXBlLmV2ZW50cyx7XHJcbiAgICAgIFxyXG4gICAgfSlcclxuICB9LFxyXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXNcclxuICAgIHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZSh0aGlzLm1vZGVsLnRvSlNPTigpKSlcclxuICAgIHRoaXMuJGVsLmZpbmQoJy5jaGFydC1pbm5lcicpLmNzcygnb3ZlcmZsb3cnLCAnaGlkZGVuJylcclxuICAgIHRoaXMuY2hhcnQgPSBmYWxzZVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9LFxyXG4gIHVwZGF0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLnJlc2l6ZSgpXHJcbiAgICB2YXIgcm91bmQgPSBkMy5mb3JtYXQoJy4yJylcclxuICAgIGlmIChEYXNoYm9hcmQuYWN0aXZldGFiID09PSAnZWZmaWNpZW5jeScpIHtcclxuICAgICAgdGhpcy4kZWwuZmluZCgnLmVmZmljaWVuY3ktbm90ZScpLnNob3coKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy4kZWwuZmluZCgnLmVmZmljaWVuY3ktbm90ZScpLmhpZGUoKVxyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMubW9kZWwuZ2V0KCdkYXRhJykubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMuZW1wdHkoZmFsc2UpXHJcbiAgICAgIHZhciBkYXRhID0gdGhpcy5tb2RlbC5nZXQoJ2RhdGEnKVswXVxyXG4gICAgICB2YXIgc3RhdCA9IHt9XHJcbiAgICAgIHN0YXQuY29udHJpYnV0aW9uID0gdGhpcy5mb3JtYXQoZGF0YS5jb250cmlidXRpb24pXHJcbiAgICAgIHN0YXQuc3VtX290aGVyX2FnZW5jeV9kb2xsYXJzID0gdGhpcy5mb3JtYXQoZGF0YS5zdW1fb3RoZXJfYWdlbmN5X2RvbGxhcnMpXHJcbiAgICAgIGlmIChkYXRhLmlsX2NvbnRyaWJ1dGlvbiA9PT0gMCB8fCBkYXRhLmlsX3Byb2plY3RfY29zdCA9PT0gMCkge1xyXG4gICAgICAgIHN0YXQuaW52ZXN0bWVudF9sZXZlcmFnZSA9ICdOb3QgQXZhaWxhYmxlJ1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciBpID0gKHBhcnNlRmxvYXQoZGF0YS5pbF9wcm9qZWN0X2Nvc3QpIC0gcGFyc2VGbG9hdChkYXRhLmlsX2NvbnRyaWJ1dGlvbikpL3BhcnNlRmxvYXQoZGF0YS5pbF9jb250cmlidXRpb24pIHx8IDBcclxuICAgICAgICBzdGF0LmludmVzdG1lbnRfbGV2ZXJhZ2UgPSBkMy5yb3VuZChpLCAyKVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChkYXRhLnByb2plY3RfY29zdCA9PT0gMCkge1xyXG4gICAgICAgIHN0YXQucHJvamVjdF9jb3N0ID0gJ05vdCBBdmFpbGFibGUnXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc3RhdC5wcm9qZWN0X2Nvc3QgPSB0aGlzLmZvcm1hdChkYXRhLnByb2plY3RfY29zdClcclxuICAgICAgfVxyXG4gICAgICBpZiAoZGF0YS5lbGVjdHJpY2l0eV9zYXZpbmdzX2t3aCkge1xyXG4gICAgICAgIHN0YXQuZWxlY3RyaWNpdHlfc2F2aW5nc19rd2ggPSBkMy5yb3VuZChkYXRhLmVsZWN0cmljaXR5X3NhdmluZ3Nfa3doLCAwKVxyXG4gICAgICB9XHJcbiAgICAgIHZhciBodG1sID0gJzx0YWJsZSBjbGFzcz1cInRhYmxlIHRhYmxlLWNvbmRlbnNlZCBzdGF0dmlld1wiPidcclxuICAgICAgaHRtbCArPSAnPHRyPjx0ZD5Ub3RhbCBQcm9qZWN0czwvdGQ+PHRkPicgKyBkMy5mb3JtYXQoJywnKShkYXRhLnRvdGFsX3Byb2plY3RzKSArICc8L3RkPjwvdHI+J1xyXG4gICAgICBodG1sICs9ICc8dHI+PHRkPk1FQSBDb250cmlidXRpb248L3RkPjx0ZD4nICsgc3RhdC5jb250cmlidXRpb24gKyAnPC90ZD48L3RyPidcclxuICAgICAgaHRtbCArPSAnPHRyPjx0ZD5Ub3RhbCBQcm9qZWN0IENvc3Q8L3RkPjx0ZD4nICsgc3RhdC5wcm9qZWN0X2Nvc3QgKyAnPC90ZD48L3RyPidcclxuICAgICAgaHRtbCArPSAnPHRyPjx0ZD5JbnZlc3RtZW50IExldmVyYWdlPC90ZD48dGQ+JyArIHN0YXQuaW52ZXN0bWVudF9sZXZlcmFnZSArICc8L3RkPjwvdHI+J1xyXG4gICAgICBpZiAoRGFzaGJvYXJkLmFjdGl2ZXRhYiA9PT0gJ2VmZmljaWVuY3knKSB7XHJcbiAgICAgICAgaHRtbCArPSAnPHRyPjx0ZD5FbGVjdHJpY2l0eSBTYXZpbmdzPC90ZD48dGQ+JyArIGQzLmZvcm1hdCgnLCcpKHN0YXQuZWxlY3RyaWNpdHlfc2F2aW5nc19rd2gpICsgJyBrV2g8L3RkPjwvdHI+J1xyXG4gICAgICB9XHJcbiAgICAgIGh0bWwgKz0gJzwvdGFibGU+J1xyXG4gICAgICB0aGlzLiRlbC5maW5kKCcuc3RhdCcpLmh0bWwoaHRtbClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZW1wdHkodHJ1ZSlcclxuICAgIH1cclxuICB9LFxyXG4gIHByZXBEYXRhOiBmdW5jdGlvbihkYXRhKXtcclxuICAgIHJldHVybiBkYXRhXHJcbiAgfVxyXG59KVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTdGF0VmlldyIsImNvbnN0IENoYXJ0VmlldyA9IHJlcXVpcmUoJy4vQ2hhcnRWaWV3JylcclxuY29uc3QgdGVtcGxhdGVzID0gcmVxdWlyZSgnLi90ZW1wbGF0ZXMnKShIYW5kbGViYXJzKVxyXG5cclxuY29uc3QgVGFibGVWaWV3ID0gQ2hhcnRWaWV3LmV4dGVuZCh7XHJcbiAgdGVtcGxhdGU6IHRlbXBsYXRlc1sndGFibGUtZW1wdHknXSxcclxuICBldmVudHM6IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gXy5leHRlbmQoe30sQ2hhcnRWaWV3LnByb3RvdHlwZS5ldmVudHMse1xyXG4gICAgICAnY2xpY2sgdGgnIDogJ3NvcnRCeUhlYWRlcicsXHJcbiAgICAgICdjbGljayB0ZC5ncm91cGVyJyA6ICdzZXRHcm91cEJ5JyxcclxuICAgICAgXCJjbGljayAudG9jaGFydFwiOiBcInRvQ2hhcnRcIlxyXG4gICAgfSlcclxuICB9LFxyXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXNcclxuICAgIHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZSh0aGlzLm1vZGVsLnRvSlNPTigpKSlcclxuICAgIHRoaXMuZHJhd1RhYmxlKHRoaXMubW9kZWwuZ2V0KCdkYXRhJykpXHJcbiAgICB0aGlzLiRlbC5maW5kKCd0aCcpLmVhY2goZnVuY3Rpb24oaWR4LCB0aCl7XHJcbiAgICAgIGlmKHRoLmlubmVySFRNTCA9PT0gc2VsZi5tb2RlbC5nZXQoJ3NvcnRfa2V5JykpIHtcclxuICAgICAgICAkKHRoKS5hZGRDbGFzcygnc29ydCcpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICAkKHRoaXMuJGVsLmZpbmQoJ3RoZWFkIHRyJykpLmVhY2goZnVuY3Rpb24oaWR4KXtcclxuICAgICAgJCh0aGlzKS5jaGlsZHJlbignOmZpcnN0JykuYWRkQ2xhc3MoJ2ZpcnN0JylcclxuICAgIH0pXHJcbiAgICAkKCcuZ3JvdXBlciBhJykudG9vbHRpcCgpXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH0sXHJcbiAgdXBkYXRlOiBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5kcmF3VGFibGUodGhpcy5tb2RlbC5nZXQoJ2RhdGEnKSlcclxuICAgIHRoaXMucmVzaXplKClcclxuICB9LFxyXG4gIGRyYXdUYWJsZTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLnkpIHtcclxuICAgICAgdmFyIHkgPSB0aGlzLm9wdGlvbnMueVxyXG4gICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMuY2hhcnQub3B0aW9ucy55KSB7XHJcbiAgICAgIHZhciB5ID0gdGhpcy5vcHRpb25zLmNoYXJ0Lm9wdGlvbnMueVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmFyICB5ID0gdGhpcy5tb2RlbC5nZXQoJ3knKVxyXG4gICAgfVxyXG4gICAgdmFyIHNlbGYgPSB0aGlzXHJcbiAgICB2YXIgdGFibGUgPSB0aGlzLiRlbC5maW5kKCd0YWJsZScpXHJcbiAgICB0YWJsZS5lbXB0eSgpXHJcbiAgICB2YXIgaHRtbCA9ICc8dGhlYWQ+PHRyPidcclxuICAgIHZhciBrZXlzID0gW11cclxuICAgIGh0bWwgKz0gJzx0aD4nICsgdGhpcy5tb2RlbC5nZXQoJ2tleScpICsgJzwvdGg+J1xyXG4gICAgaWYgKHR5cGVvZiB5ID09PSAnc3RyaW5nJykge1xyXG4gICAgICB5ID0gW3ldXHJcbiAgICB9XHJcbiAgICB5LmZvckVhY2goZnVuY3Rpb24oX3kpIHtcclxuICAgICAgaHRtbCArPSAnPHRoPicgKyBfeVxyXG4gICAgICBpZiAoc2VsZi5tb2RlbC5nZXQoJ3Nob3dVbml0c0luVGFibGUnKSkge1xyXG4gICAgICAgIGh0bWwgKz0gJyAoJyArIHNlbGYubW9kZWwuZ2V0KCd1bml0cycpICsgJyknXHJcbiAgICAgIH1cclxuICAgICAgaHRtbCArPSAnPC90aD4nXHJcbiAgICAgIGtleXMucHVzaChfeSlcclxuICAgIH0pXHJcbiAgICBodG1sICs9ICc8L3RyPjwvdGhlYWQ+PHRib2R5PidcclxuICAgIF8uZWFjaChkYXRhLCBmdW5jdGlvbihyb3csIGlkeCkge1xyXG4gICAgICBodG1sICs9ICc8dHI+J1xyXG4gICAgICBodG1sICs9ICc8dGQ+JyArIHNlbGYubW9kZWwuZ2V0KCdsYWJlbEZvcm1hdCcpKHJvd1tzZWxmLm1vZGVsLmdldCgna2V5JyldKSArICc8L3RkPidcclxuICAgICAgICBfLmVhY2goa2V5cywgZnVuY3Rpb24oa2V5KSB7XHJcbiAgICAgICAgICBodG1sICs9ICc8dGQ+J1xyXG4gICAgICAgICAgaWYgKHNlbGYubW9kZWwuZ2V0KCdkb250Rm9ybWF0JykuaW5kZXhPZihrZXkpIDwgMCkge1xyXG4gICAgICAgICAgICBodG1sICs9IHNlbGYub3B0aW9ucy5jaGFydC5vcHRpb25zLnZhbHVlRm9ybWF0KHJvd1trZXldKVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaHRtbCArPSByb3dba2V5XVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaHRtbCArPSAnPC90ZD4nXHJcbiAgICAgICAgfSlcclxuICAgICAgaHRtbCArPSAnPC90cj4nXHJcbiAgICB9KVxyXG4gICAgaHRtbCArPSAnPC90Ym9keT4nXHJcbiAgICB0YWJsZS5odG1sKGh0bWwpXHJcbiAgfSxcclxuICBwcmVwRGF0YTogZnVuY3Rpb24ocmVzKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXNcclxuICAgIHZhciB0YWJsZSA9IHtcclxuICAgICAgcm93czogW10sXHJcbiAgICAgIGNvbHVtbnM6IFtdXHJcbiAgICB9XHJcbiAgICBpZihyZXMubGVuZ3RoKSB7XHJcbiAgICAgIHZhciBkYXRhID0gcmVzXHJcbiAgICAgIHZhciBjb2x1bW5zID0gXy5rZXlzKGRhdGFbMF0pXHJcbiAgICAgIHRhYmxlLmNvbHVtbnMgPSBjb2x1bW5zXHJcbiAgICAgIF8uZWFjaChkYXRhLCBmdW5jdGlvbihyb3cpe1xyXG4gICAgICAgIHZhciB2ID0gW11cclxuICAgICAgICBjb2x1bW5zLmZvckVhY2goZnVuY3Rpb24oYykge1xyXG4gICAgICAgICAgdi5wdXNoKHJvd1tjXSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIHRhYmxlLnJvd3MucHVzaCh7XHJcbiAgICAgICAgICByb3c6IHZcclxuICAgICAgICB9KVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRhYmxlXHJcbiAgfSxcclxuICBzb3J0QnlIZWFkZXI6IGZ1bmN0aW9uKGUpIHtcclxuICAgIHZhciBjb2x1bW4gPSAkKGUudGFyZ2V0KS5odG1sKClcclxuICAgIHZhciBkYXRhID0gdGhpcy5tb2RlbC5zb3J0QnlLZXkodGhpcy5tb2RlbC5nZXQoJ2RhdGEnKSwgY29sdW1uKVxyXG4gICAgdGhpcy5kcmF3VGFibGUoZGF0YSlcclxuICAgIC8vdGhpcy5tb2RlbC5zZXQoJ2RhdGEnLCBkYXRhKVxyXG4gIH0sXHJcbiAgc2V0R3JvdXBCeTogZnVuY3Rpb24oZSl7XHJcbiAgICB2YXIgZ3JvdXBCeSA9IHRoaXMubW9kZWwuZ2V0KCdncm91cEJ5JylcclxuICAgIHZhciB2YWx1ZSA9ICQoJzxkaXYgLz4nKS5odG1sKCQoZS50YXJnZXQpLmh0bWwoKSkudGV4dCgpXHJcbiAgICBpZighdGhpcy5tb2RlbC5nZXQoJ3Nob3dJRCcpKSB7XHJcbiAgICAgIHZhciBrZXkgPSBfLndoZXJlKHRoaXMubW9kZWwuZ2V0KCdkYXRhJyksIHsnTmFtZSc6IHZhbHVlfSlbMF1bJ0lEJ11cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciBrZXkgPSB2YWx1ZVxyXG4gICAgfVxyXG4gICAgdmFyIG0gPSBEYXNoYm9hcmQuZmlsdGVyQ29sbGVjdGlvbi53aGVyZSh7bmFtZTogZ3JvdXBCeX0pXHJcbiAgICBpZihtLmxlbmd0aCkge1xyXG4gICAgICBtWzBdLnNldCh7bmFtZTogZ3JvdXBCeSwgdmFsdWU6IGtleSwgZGlzcGxheTogdmFsdWV9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgRGFzaGJvYXJkLmZpbHRlckNvbGxlY3Rpb24uYWRkKFtcclxuICAgICAgICB7bmFtZTogZ3JvdXBCeSwgdmFsdWU6IGtleSwgZGlzcGxheTogdmFsdWV9XHJcbiAgICAgIF0pXHJcbiAgICB9XHJcbiAgfSxcclxuICB0b0NoYXJ0OiBmdW5jdGlvbigpe1xyXG4gICAgdmFyIHZpZXcgPSBEYXNoYm9hcmQubWFrZUNoYXJ0Vmlldyh0aGlzLm1vZGVsKVxyXG4gICAgdGhpcy4kZWwucGFyZW50KCkuaHRtbCh2aWV3LnJlbmRlcigpLmVsKVxyXG4gICAgdmlldy51cGRhdGUoKVxyXG4gIH1cclxufSlcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGFibGVWaWV3IiwiY29uc3QgRmlsdGVyTGFiZWxWaWV3ID0gcmVxdWlyZSgnLi9GaWx0ZXJMYWJlbFZpZXcnKVxyXG5jb25zdCB0ZW1wbGF0ZXMgPSByZXF1aXJlKCcuL3RlbXBsYXRlcycpKEhhbmRsZWJhcnMpXHJcblxyXG5jb25zdCBUZWNobm9sb2d5RmlsdGVyID0gRmlsdGVyTGFiZWxWaWV3LmV4dGVuZCh7XHJcbiAgdGVtcGxhdGU6IHRlbXBsYXRlc1sncHJvamVjdC10eXBlJ11cclxufSlcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGVjaG5vbG9neUZpbHRlciIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oSGFuZGxlYmFycykge1xyXG5cclxudmFyIHRlbXBsYXRlcyA9IHt9O1xyXG5cclxuSGFuZGxlYmFycy5yZWdpc3RlclBhcnRpYWwoXCJ0aXRsZVwiLCBIYW5kbGViYXJzLnRlbXBsYXRlKHtcIjFcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHJldHVybiBcIiAgPGRpdiBjbGFzcz1cXFwidG9vbGJhclxcXCI+XFxyXFxuICAgIDxpIGNsYXNzPVxcXCJmYSBmYS10YWJsZSB0b29sIHRvdGFibGVcXFwiPjwvaT5cXHJcXG4gICAgPGkgY2xhc3M9XFxcImZhIGZhLWJhci1jaGFydC1vIHRvb2wgdG9jaGFydFxcXCI+PC9pPlxcclxcbiAgPC9kaXY+XFxyXFxuXCI7XG4gIH0sXCJjb21waWxlclwiOls2LFwiPj0gMi4wLjAtYmV0YS4xXCJdLFwibWFpblwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdmFyIHN0YWNrMSwgaGVscGVyLCBvcHRpb25zLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgYmxvY2tIZWxwZXJNaXNzaW5nPWhlbHBlcnMuYmxvY2tIZWxwZXJNaXNzaW5nLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbiwgYnVmZmVyID0gXCI8ZGl2IGNsYXNzPVxcXCJ0aXRsZVxcXCI+XFxyXFxuXCI7XG4gIHN0YWNrMSA9ICgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMudG9vbGJhciB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAudG9vbGJhciA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwob3B0aW9ucz17XCJuYW1lXCI6XCJ0b29sYmFyXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSgxLCBkYXRhKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIG9wdGlvbnMpIDogaGVscGVyKSk7XG4gIGlmICghaGVscGVycy50b29sYmFyKSB7IHN0YWNrMSA9IGJsb2NrSGVscGVyTWlzc2luZy5jYWxsKGRlcHRoMCwgc3RhY2sxLCBvcHRpb25zKTsgfVxuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyICsgXCIgIDxoMz5cIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLnRpdGxlIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC50aXRsZSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJ0aXRsZVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCI8L2gzPlxcclxcbjwvZGl2PlwiO1xufSxcInVzZURhdGFcIjp0cnVlfSkpO1xyXG5cclxudGVtcGxhdGVzW1wiY2hhcnRcIl0gPSBIYW5kbGViYXJzLnRlbXBsYXRlKHtcIjFcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhLGRlcHRocykge1xuICB2YXIgaGVscGVyLCBsYW1iZGE9dGhpcy5sYW1iZGEsIGVzY2FwZUV4cHJlc3Npb249dGhpcy5lc2NhcGVFeHByZXNzaW9uLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZztcbiAgcmV0dXJuIFwiICAgICAgICA8bGFiZWw+PGlucHV0IHR5cGU9XFxcInJhZGlvXFxcIiBuYW1lPVxcXCJcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbihsYW1iZGEoKGRlcHRoc1sxXSAhPSBudWxsID8gZGVwdGhzWzFdLmNpZCA6IGRlcHRoc1sxXSksIGRlcHRoMCkpXG4gICAgKyBcIi1jaGFydC10b29sc1xcXCIgdmFsdWU9XFxcIlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMudmFsdWUgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnZhbHVlIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcInZhbHVlXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCI+IFwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMudGV4dCB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAudGV4dCA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJ0ZXh0XCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIjwvbGFiZWw+XFxyXFxuXCI7XG59LFwiY29tcGlsZXJcIjpbNixcIj49IDIuMC4wLWJldGEuMVwiXSxcIm1haW5cIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhLGRlcHRocykge1xuICB2YXIgc3RhY2sxLCBoZWxwZXIsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGhlbHBlck1pc3Npbmc9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbiwgYnVmZmVyID0gXCI8ZGl2IGNsYXNzPVxcXCJcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLndpZHRoIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC53aWR0aCA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJ3aWR0aFwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCIgYmxvY2tcXFwiPlxcclxcbiAgPGRpdiBjbGFzcz1cXFwiY2hhcnRcXFwiPlxcclxcblwiO1xuICBzdGFjazEgPSB0aGlzLmludm9rZVBhcnRpYWwocGFydGlhbHMudGl0bGUsICcgICAgJywgJ3RpdGxlJywgZGVwdGgwLCB1bmRlZmluZWQsIGhlbHBlcnMsIHBhcnRpYWxzLCBkYXRhKTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgYnVmZmVyICs9IFwiICAgIDxkaXYgY2xhc3M9XFxcImNoYXJ0LWlubmVyXFxcIj5cXHJcXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJjaGFydC10b29sc1xcXCI+XFxyXFxuXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnMuZWFjaC5jYWxsKGRlcHRoMCwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnRvb2xzIDogZGVwdGgwKSwge1wibmFtZVwiOlwiZWFjaFwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oMSwgZGF0YSwgZGVwdGhzKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyICsgXCIgICAgICA8L2Rpdj5cXHJcXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJsb2FkZXJcXFwiPjxpIGNsYXNzPVxcXCJmYSBmYS1jaXJjbGUtby1ub3RjaCBmYS1zcGluXFxcIj48L2k+PC9kaXY+XFxyXFxuICAgICAgPGRpdiBjbGFzcz1cXFwidGhlLWNoYXJ0XFxcIj48L2Rpdj5cXHJcXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJub2RhdGFcXFwiPk4vQTwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gIDwvZGl2PlxcclxcbjwvZGl2PlwiO1xufSxcInVzZVBhcnRpYWxcIjp0cnVlLFwidXNlRGF0YVwiOnRydWUsXCJ1c2VEZXB0aHNcIjp0cnVlfSk7XHJcblxyXG50ZW1wbGF0ZXNbXCJkYXNoYm9hcmRcIl0gPSBIYW5kbGViYXJzLnRlbXBsYXRlKHtcImNvbXBpbGVyXCI6WzYsXCI+PSAyLjAuMC1iZXRhLjFcIl0sXCJtYWluXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICByZXR1cm4gXCI8ZGl2IGNsYXNzPVxcXCJob21lXFxcIj5cXHJcXG4gIDxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC1sZy04IGNvbC1tZC0xMiBjb2wtbGctb2Zmc2V0LTIgaW50cm9cXFwiPlxcclxcbiAgICAgIDxkaXYgY2xhc3M9XFxcInBhbmVsIHBhbmVsLWRlZmF1bHRcXFwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwicGFuZWwtaGVhZGluZ1xcXCI+XFxyXFxuICAgICAgICAgIDxoMyBjbGFzcz1cXFwicGFuZWwtdGl0bGVcXFwiPldlbGNvbWUgdG8gdGhlIE1hcnlsYW5kIFNtYXJ0IEVuZXJneSBJbnZlc3RtZW50IERhc2hib2FyZCE8L2gzPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJwYW5lbC1ib2R5XFxcIj5cXHJcXG4gICAgICAgIDxwPlRoaXMgZGFzaGJvYXJkIGlsbHVzdHJhdGVzIDxhIGhyZWY9XFxcImh0dHBzOi8vZW5lcmd5Lm1hcnlsYW5kLmdvdlxcXCI+TWFyeWxhbmQgRW5lcmd5IEFkbWluaXN0cmF0aW9u4oCZczwvYT4gY29udHJpYnV0aW9ucyB0byB0aGUgZ3Jvd3RoIG9mIDxzdHJvbmc+YWZmb3JkYWJsZTwvc3Ryb25nPiwgPHN0cm9uZz5yZWxpYWJsZTwvc3Ryb25nPiwgPHN0cm9uZz5yZW5ld2FibGU8L3N0cm9uZz4gZW5lcmd5IGFuZCA8c3Ryb25nPmVuZXJneSBlZmZpY2llbmN5PC9zdHJvbmc+IGluZHVzdHJpZXMgaW4gb3VyIHN0YXRlLjwvcD5cXHJcXG4gICAgICA8cD5BZGRpdGlvbmFsbHksIHRoaXMgdG9vbCBwaW5wb2ludHMgcHVibGljbHkgYWNjZXNzaWJsZSBsb2NhdGlvbnMgb2YgZWxlY3RyaWMgdmVoaWNsZSBjaGFyZ2luZyBzdGF0aW9ucyBhbmQgb3RoZXIgYWx0ZXJuYXRpdmUgcmVmdWVsaW5nIHN0YXRpb25zIGluIG91ciBTdGF0ZS48L3A+XFxyXFxuICAgICAgPHA+VGhlIE1hcnlsYW5kIFNtYXJ0IEVuZXJneSBJbnZlc3RtZW50IERhc2hib2FyZCBsYXJnZWx5IHRyYWNrcyBNRUHigJlzIGludmVzdG1lbnRzIGFuZCBpcyBub3QgaW50ZW5kZWQgdG8gZ2l2ZSBhIGNvbXByZWhlbnNpdmUgc3VtbWFyeSBvZiBhbGwgcHJvamVjdHMgYW5kIGluc3RhbGxhdGlvbnMgYWNyb3NzIHRoZSBzdGF0ZS4gTUVBIG9jY2FzaW9uYWxseSBtYWtlcyBjaGFuZ2VzIGluIHRoZSB0eXBlcyBvZiBwcm9qZWN0cyBlbGlnaWJsZSBmb3IgYXdhcmRzOyBNRUEncyB3ZWJzaXRlIGhhcyBpbmZvcm1hdGlvbiBvbiBjdXJyZW50bHkgb3BlbiBwcm9ncmFtcyBhbmQgdGhlIHR5cGVzIG9mIHByb2plY3RzIGVsaWdpYmxlIGZvciBhd2FyZHMuIFBsZWFzZSBjaGVjayB0aGUgbWFwIHBlcmlvZGljYWxseSwgYXMgd2UgY29udGludWUgdGhlIGdyb3d0aCBvZiBNYXJ5bGFuZOKAmXMgZW5lcmd5IGVjb25vbXkuPC9wPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgPC9kaXY+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgPC9kaXY+XFxyXFxuICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctOCBjb2wtbWQtMTIgY29sLWxnLW9mZnNldC0yXFxcIj5cXHJcXG4gICAgICA8ZGl2IGlkPVxcXCJjaGFydExpbmtCdXR0b25zXFxcIj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcInBhbmVsIHBhbmVsLWRlZmF1bHRcXFwiPlxcclxcbiAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJwYW5lbC1oZWFkaW5nXFxcIj5cXHJcXG4gICAgICAgICAgICA8aDMgY2xhc3M9XFxcInBhbmVsLXRpdGxlXFxcIj5TZWxlY3QgYSBTZWN0aW9uIEJlbG93IHRvIEJlZ2luPC9oMz5cXHJcXG4gICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInBhbmVsLWJvZHlcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsaW5rQnV0dG9uXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICA8aDM+UmVuZXdhYmxlIEVuZXJneTwvaDM+XFxyXFxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGlua0J1dHRvbkltZ1xcXCI+PGEgaHJlZj1cXFwiI3JlbmV3YWJsZVxcXCIgY2xhc3M9XFxcImRhcmtlblxcXCI+PGltZyBzcmM9XFxcImltZy9yZW5ld2FibGUtaWNvbi5wbmdcXFwiPjwvYT48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXNjcmlwdGlvblxcXCI+U2hvdyBNRUEgY29udHJpYnV0aW9ucyB0byB0aGUgZ3Jvd3RoIG9mIGFmZm9yZGFibGUgYW5kIHJlbGlhYmxlIHJlbmV3YWJsZSBlbmVyZ3kuPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsaW5rQnV0dG9uXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICA8aDM+RW5lcmd5IEVmZmljaWVuY3k8L2gzPlxcclxcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxpbmtCdXR0b25JbWdcXFwiPjxhIGhyZWY9XFxcIiNlZmZpY2llbmN5XFxcIiBjbGFzcz1cXFwiZGFya2VuXFxcIj48aW1nIHNyYz1cXFwiaW1nL2VmZmljaWVuY3ktaWNvbi5wbmdcXFwiPjwvYT48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXNjcmlwdGlvblxcXCI+U2hvdyBNRUEgY29udHJpYnV0aW9ucyB0byB0aGUgZ3Jvd3RoIG9mIGFmZm9yZGFibGUgZW5lcmd5IGVmZmljaWVuY3kuPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsaW5rQnV0dG9uXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICA8aDM+VHJhbnNwb3J0YXRpb248L2gzPlxcclxcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxpbmtCdXR0b25JbWdcXFwiPjxhIGhyZWY9XFxcIiN0cmFuc3BvcnRhdGlvblxcXCIgY2xhc3M9XFxcImRhcmtlblxcXCI+PGltZyBzcmM9XFxcImltZy90cmFuc3BvcnRhdGlvbi1pY29uLnBuZ1xcXCI+PC9hPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImRlc2NyaXB0aW9uXFxcIj5TaG93IE1FQSBjb250cmlidXRpb25zIHRvIHRoZSBncm93dGggb2YgYWZmb3JkYWJsZSBhbmQgcmVsaWFibGUgY2xlYW4gdHJhbnNwb3J0YXRpb24uPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gIDwvZGl2PlxcclxcbiAgPGRpdiBjbGFzcz1cXFwicm93XFxcIj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTggY29sLW1kLTEyIGNvbC1sZy1vZmZzZXQtMlxcXCI+XFxyXFxuICAgICAgPGRpdiBjbGFzcz1cXFwicGFuZWwgcGFuZWwtZGVmYXVsdFxcXCI+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJwYW5lbC1oZWFkaW5nXFxcIiByb2xlPVxcXCJ0YWJcXFwiIGlkPVxcXCJoZWFkaW5nVHdvXFxcIj5cXHJcXG4gICAgICAgICAgPGgzIGNsYXNzPVxcXCJwYW5lbC10aXRsZVxcXCI+XFxyXFxuICAgICAgICAgICAgPGEgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXBhcmVudD1cXFwiI2FjY29yZGlvblxcXCIgaHJlZj1cXFwiI2NvbGxhcHNlVHdvXFxcIiBhcmlhLWV4cGFuZGVkPVxcXCJmYWxzZVxcXCIgYXJpYS1jb250cm9scz1cXFwiY29sbGFwc2VUd29cXFwiPlxcclxcbiAgICAgICAgICAgICAgRGFzaGJvYXJkIEhlbHBcXHJcXG4gICAgICAgICAgICA8L2E+XFxyXFxuICAgICAgICAgIDwvaDM+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgaWQ9XFxcImNvbGxhcHNlVHdvXFxcIiBjbGFzcz1cXFwicGFuZWwtY29sbGFwc2UgY29sbGFwc2UgaW5cXFwiIHJvbGU9XFxcInRhYnBhbmVsXFxcIiBhcmlhLWxhYmVsbGVkYnk9XFxcImhlYWRpbmdUd29cXFwiPlxcclxcbiAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJwYW5lbC1ib2R5XFxcIj5cXHJcXG4gICAgICAgICAgICA8cD5EYXRhIG9uIHRoaXMgZGFzaGJvYXJkIGNhbiBiZSB2aWV3ZWQgYW5kIGRvd25sb2FkZWQgZnJvbSBNYXJ5bGFuZOKAmXMgPGEgaHJlZj1cXFwiaHR0cHM6Ly9kYXRhLm1hcnlsYW5kLmdvdlxcXCI+T3BlbiBEYXRhIFBvcnRhbDwvYT4uPC9wPlxcclxcbiAgICAgICAgICAgIDxwPlZpZXcgYSB2aWRlbyBVc2VyIEd1aWRlIG9uIDxhIGhyZWY9XFxcImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9VWpYMGs4NXU5Z1FcXFwiPllvdVR1YmU8L2E+LjwvcD5cXHJcXG4gICAgICAgICAgICA8cD5Vc2UgdGhlIG1hcCBmaWx0ZXIgbGlzdCBpbiB0aGUgbG93ZXIgbGVmdC1oYW5kIGNvcm5lciBvZiB0aGUgbWFwIHRvIHNwZWNpZnkgdGhlIHR5cGUgb2YgZ2VvZ3JhcGh5IHRvIGNvbXBhcmUgYW5kIHRvIHNwZWNpZnkgd2hldGhlciBpbmRpdmlkdWFsIHByb2plY3RzIHNob3VsZCBiZSBkaXNwbGF5ZWQgb24gdGhlIG1hcC4gU2ltaWxhciBnZW9ncmFwaGllcyBjYW4gYmUgY29tcGFyZWQgYnkgc2VsZWN0aW5nIG9uZSBvciBtb3JlIGZyb20gdGhlIG1hcC4gRGVzZWxlY3QgYSByZWdpb24gYnkgc2luZ2xlIGNsaWNraW5nIGl0IG9uIHRoZSBtYXAgb3IgY2xlYXIgYWxsIHNlbGVjdGlvbnMgdXNpbmcgdGhlIFJlc2V0IE1hcCBidXR0b24uPC9wPlxcclxcbiAgICAgICAgICAgIDxwPkluZGl2aWR1YWwgcHJvamVjdHMgYXJlIGRpc3BsYXllZCBieSBkZWZhdWx0IGFzIG51bWJlcmVkIHBvaW50cyBvbiB0aGUgbWFwLiBUaGVzZSBwb2ludHMgYXJlIGNsdXN0ZXJlZCBhdCBkaWZmZXJlbnQgem9vbSBsZXZlbHMgc28gYXMgeW91IHpvb20gaW4gb24gdGhlIG1hcCwgdGhlIHBvaW50cyBkaXNhZ2dyZWdhdGUgdW50aWwgYSBzaW5nbGUgcG9pbnQgaXMgdmlzaWJsZSBvciB0aGUgcG9pbnRzIGJyZWFrIG91dCBpbnRvIHRoZWlyIHJlc3BlY3RpdmUgdGVjaG5vbG9naWVzLiBDbGljayBhbiBpbmRpdmlkdWFsIHByb2plY3QgcG9pbnQgdG8gdmlldyBhIHBvcHVwIGxpc3Qgb2Ygc3RhdGlzdGljcyByZWxldmFudCB0byB0aGF0IHNwZWNpZmljIHByb2plY3QuPC9wPlxcclxcbiAgICAgICAgICAgIDxwPlVzZSB0aGUgXFxcIlByb2plY3QgRmlsdGVyc1xcXCIgYnV0dG9ucyB0byBmdXJ0aGVyIHJlZmluZSB0aGUgY2hhcnRzLjwvcD5cXHJcXG4gICAgICAgICAgICA8cD5UaGUgZGF0YSBkaXNwbGF5IGNhbiBiZSBtYW5pcHVsYXRlZCBieSBzZWxlY3RpbmcgdGhlIGNoYXJ0IG9yIHRhYmxlIGljb24gaW4gdGhlIHVwcGVyIHJpZ2h0LWhhbmQgc2lkZSBvZiBlYWNoIGdyYXBoLjwvcD5cXHJcXG4gICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICA8L2Rpdj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICA8L2Rpdj5cXHJcXG4gIDxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC1tZC0xMlxcXCI+XFxyXFxuICAgICAgPGRpdiBjbGFzcz1cXFwibG9nb3NcXFwiPlxcclxcbiAgICAgICAgPGEgaHJlZj1cXFwiaHR0cHM6Ly9lbmVyZ3kubWFyeWxhbmQuZ292XFxcIj48aW1nIHNyYz1cXFwiaW1nL21lYV9zbWFsbC5wbmdcXFwiIGFsdD1cXFwiXFxcIj48L2E+XFxyXFxuICAgICAgICA8YSBocmVmPVxcXCJodHRwczovL2RvaXQubWFyeWxhbmQuZ292L1BhZ2VzL2RlZmF1bHQuYXNweFxcXCI+PGltZyBzcmM9XFxcImltZy9kb2l0X3NtYWxsLnBuZ1xcXCIgYWx0PVxcXCJcXFwiPjwvYT5cXHJcXG4gICAgICAgIDxhIGhyZWY9XFxcImh0dHBzOi8vd3d3LmVzcmdjLm9yZ1xcXCI+PGltZyBzcmM9XFxcImltZy9lc3JnY19sb2dvLnBuZ1xcXCIgYWx0PVxcXCJcXFwiPjwvYT5cXHJcXG4gICAgICAgIDxhIGhyZWY9XFxcImh0dHBzOi8vd3d3LnNhbGlzYnVyeS5lZHVcXFwiPjxpbWcgc3JjPVxcXCJpbWcvU1UgbG9nby5wbmdcXFwiIGFsdD1cXFwiXFxcIj48L2E+XFxyXFxuICAgICAgPC9kaXY+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgPC9kaXY+XFxyXFxuPC9kaXY+XFxyXFxuPGRpdiBjbGFzcz1cXFwiY2hhcnRzXFxcIj5cXHJcXG4gIDxkaXYgY2xhc3M9XFxcInRhYi1pbmZvXFxcIj48YSBocmVmPVxcXCJodHRwczovL2RhdGEubWFyeWxhbmQuZ292L2RhdGFzZXQvUmVuZXdhYmxlLUVuZXJneS1HZW9jb2RlZC9tcXQzLWV1NHNcXFwiPlZpZXcgYW5kIERvd25sb2FkIFJhdyBEYXRhPC9hPjwvZGl2PlxcclxcbiAgPGRpdiBjbGFzcz1cXFwicm93XFxcIj48L2Rpdj5cXHJcXG48L2Rpdj5cIjtcbiAgfSxcInVzZURhdGFcIjp0cnVlfSk7XHJcblxyXG50ZW1wbGF0ZXNbXCJlZmZpY2llbmN5LXBvcHVwXCJdID0gSGFuZGxlYmFycy50ZW1wbGF0ZSh7XCIxXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb247XG4gIHJldHVybiBcIjxhIGhyZWY9XFxcIlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMubGluayB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAubGluayA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJsaW5rXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCIgdGFyZ2V0PVxcXCJfYmxhbmtcXFwiPlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMucHJvZ3JhbV9uYW1lIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5wcm9ncmFtX25hbWUgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwicHJvZ3JhbV9uYW1lXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIjwvYT5cIjtcbn0sXCIzXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb247XG4gIHJldHVybiBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMucHJvZ3JhbV9uYW1lIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5wcm9ncmFtX25hbWUgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwicHJvZ3JhbV9uYW1lXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpO1xuICB9LFwiNVwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdmFyIGhlbHBlciwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgaGVscGVyTWlzc2luZz1oZWxwZXJzLmhlbHBlck1pc3NpbmcsIGVzY2FwZUV4cHJlc3Npb249dGhpcy5lc2NhcGVFeHByZXNzaW9uO1xuICByZXR1cm4gXCI8bGk+PGI+UHJvamVjdCBOYW1lOjwvYj4gXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5wcm9qZWN0X25hbWUgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnByb2plY3RfbmFtZSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJwcm9qZWN0X25hbWVcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiPC9saT5cIjtcbn0sXCI3XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb247XG4gIHJldHVybiBcIjxsaT48Yj5Ub3RhbCBQcm9qZWN0IENvc3Q6PC9iPiBcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLnRvdGFsX3Byb2plY3RfY29zdCB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAudG90YWxfcHJvamVjdF9jb3N0IDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcInRvdGFsX3Byb2plY3RfY29zdFwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCI8L2xpPlwiO1xufSxcIjlcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBoZWxwZXIsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGhlbHBlck1pc3Npbmc9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbjtcbiAgcmV0dXJuIFwiPGxpPjxiPkludmVzdG1lbnQgTGV2ZXJhZ2U6PC9iPiBcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLmludmVzdG1lbnRfbGV2ZXJhZ2UgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmludmVzdG1lbnRfbGV2ZXJhZ2UgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwiaW52ZXN0bWVudF9sZXZlcmFnZVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCI8L2xpPlwiO1xufSxcIjExXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb247XG4gIHJldHVybiBcIjxsaT48Yj5Ob3Rlczo8L2I+IFwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMubm90ZXMgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLm5vdGVzIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcIm5vdGVzXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIjwvbGk+XCI7XG59LFwiY29tcGlsZXJcIjpbNixcIj49IDIuMC4wLWJldGEuMVwiXSxcIm1haW5cIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBzdGFjazEsIGhlbHBlciwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgaGVscGVyTWlzc2luZz1oZWxwZXJzLmhlbHBlck1pc3NpbmcsIGVzY2FwZUV4cHJlc3Npb249dGhpcy5lc2NhcGVFeHByZXNzaW9uLCBidWZmZXIgPSBcIjxkaXYgY2xhc3M9XFxcIm1hcC1wcm9qZWN0XFxcIiBzdHlsZT1cXFwiYmFja2dyb3VuZDogXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5jb2xvciB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuY29sb3IgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwiY29sb3JcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxcIj5cXHJcXG4gIDx1bCBjbGFzcz1cXFwibGlzdC11bnN0eWxlZFxcXCI+XFxyXFxuICAgIDxsaT48Yj5Qcm9ncmFtIE5hbWU6PC9iPiBcXHJcXG4gICAgICBcIjtcbiAgc3RhY2sxID0gaGVscGVyc1snaWYnXS5jYWxsKGRlcHRoMCwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmxpbmsgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJpZlwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oMSwgZGF0YSksXCJpbnZlcnNlXCI6dGhpcy5wcm9ncmFtKDMsIGRhdGEpLFwiZGF0YVwiOmRhdGF9KTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgYnVmZmVyICs9IFwiXFxyXFxuICAgIDwvbGk+XFxyXFxuICAgIFwiO1xuICBzdGFjazEgPSBoZWxwZXJzWydpZiddLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAucHJvamVjdF9uYW1lIDogZGVwdGgwKSwge1wibmFtZVwiOlwiaWZcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDUsIGRhdGEpLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIGJ1ZmZlciArPSBcIlxcclxcbiAgICA8bGk+PGI+U2VjdG9yOjwvYj4gXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5zZWN0b3IgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnNlY3RvciA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJzZWN0b3JcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiPC9saT5cXHJcXG4gICAgPGxpPjxiPk1FQSBDb250cmlidXRpb246PC9iPiBcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLm1lYV9hd2FyZCB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAubWVhX2F3YXJkIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcIm1lYV9hd2FyZFwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCI8L2xpPlxcclxcbiAgICBcIjtcbiAgc3RhY2sxID0gaGVscGVyc1snaWYnXS5jYWxsKGRlcHRoMCwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnRvdGFsX3Byb2plY3RfY29zdCA6IGRlcHRoMCksIHtcIm5hbWVcIjpcImlmXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSg3LCBkYXRhKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gXCJcXHJcXG4gICAgXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ2lmJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5pbnZlc3RtZW50X2xldmVyYWdlIDogZGVwdGgwKSwge1wibmFtZVwiOlwiaWZcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDksIGRhdGEpLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIGJ1ZmZlciArPSBcIlxcclxcbiAgICA8bGk+PGI+RWxlY3RyaWNpdHkgU2F2aW5nczo8L2I+IFwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuZWxlY3RyaWNpdHlfc2F2aW5nc19rd2ggfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmVsZWN0cmljaXR5X3NhdmluZ3Nfa3doIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcImVsZWN0cmljaXR5X3NhdmluZ3Nfa3doXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIiBrV2g8L2xpPlxcclxcbiAgICA8bGk+PGI+Q08yIEVtaXNzaW9ucyBSZWR1Y3Rpb25zOjwvYj4gXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5jbzJfZW1pc3Npb25zX3JlZHVjdGlvbnNfdG9ucyB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuY28yX2VtaXNzaW9uc19yZWR1Y3Rpb25zX3RvbnMgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwiY28yX2VtaXNzaW9uc19yZWR1Y3Rpb25zX3RvbnNcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiIHRvbnM8L2xpPlxcclxcbiAgICBcIjtcbiAgc3RhY2sxID0gaGVscGVyc1snaWYnXS5jYWxsKGRlcHRoMCwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLm5vdGVzIDogZGVwdGgwKSwge1wibmFtZVwiOlwiaWZcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDExLCBkYXRhKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyICsgXCJcXHJcXG4gIDwvdWw+XFxyXFxuPC9kaXY+XCI7XG59LFwidXNlRGF0YVwiOnRydWV9KTtcclxuXHJcbnRlbXBsYXRlc1tcImZpbHRlci1sYWJlbFwiXSA9IEhhbmRsZWJhcnMudGVtcGxhdGUoe1wiY29tcGlsZXJcIjpbNixcIj49IDIuMC4wLWJldGEuMVwiXSxcIm1haW5cIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBoZWxwZXIsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGhlbHBlck1pc3Npbmc9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbjtcbiAgcmV0dXJuIFwiPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJidG4gYnRuLWRlZmF1bHQgYnRuLXNtXFxcIj5cIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLmRpc3BsYXkgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmRpc3BsYXkgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwiZGlzcGxheVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCI8L2J1dHRvbj5cIjtcbn0sXCJ1c2VEYXRhXCI6dHJ1ZX0pO1xyXG5cclxudGVtcGxhdGVzW1wiZmlsdGVyLW1lbnVcIl0gPSBIYW5kbGViYXJzLnRlbXBsYXRlKHtcImNvbXBpbGVyXCI6WzYsXCI+PSAyLjAuMC1iZXRhLjFcIl0sXCJtYWluXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgc3RhY2sxLCBidWZmZXIgPSBcIjxkaXYgY2xhc3M9XFxcImNvbC1zbS02IGJsb2NrXFxcIj5cXHJcXG4gIDxkaXYgY2xhc3M9XFxcImNoYXJ0XFxcIj5cXHJcXG5cIjtcbiAgc3RhY2sxID0gdGhpcy5pbnZva2VQYXJ0aWFsKHBhcnRpYWxzLnRpdGxlLCAnICAgICcsICd0aXRsZScsIGRlcHRoMCwgdW5kZWZpbmVkLCBoZWxwZXJzLCBwYXJ0aWFscywgZGF0YSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXIgKyBcIiAgICA8ZGl2IGNsYXNzPVxcXCJjaGFydC1pbm5lclxcXCI+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxyXFxuXFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICAgIDxkaXYgY2xhc3M9XFxcImZpbHRlcnMgY29udGFpbmVyLWZsdWlkXFxcIj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxyXFxuICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC1tZC0xMlxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGVzY3JpcHRpb25cXFwiPlxcclxcbiAgICAgICAgICAgICAgPHA+PC9wPlxcclxcbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJidG4gYnRuLWRlZmF1bHQgYnRuLXhzIHJlc2V0XFxcIj5SZXNldCBNYXA8L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImZpbHRlci1ib3ggdGVjaG5vbG9neSBjb2wtbWQtNlxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiZmlsdGVyLXRpdGxlXFxcIj5UZWNobm9sb2d5PC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidGhlLWZpbHRlcnNcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgPGRpdiBjbGFzcz1cXFwiZmlsdGVyLWJveCB2ZWhpY2xlX3RlY2hub2xvZ3kgY29sLW1kLTZcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImZpbHRlci10aXRsZVxcXCI+PGRpdiBjbGFzcz1cXFwicHJvamVjdHMtaWNvbiB2ZWhpY2xlX3RlY2hub2xvZ3lcXFwiPjwvZGl2PiBWZWhpY2xlIFRlY2hub2xvZ3k8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ0aGUtZmlsdGVyc1xcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJmaWx0ZXItYm94IGNoYXJnaW5nX2Z1ZWxpbmdfc3RhdGlvbl90ZWNobm9sb2d5IGNvbC1tZC02XFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJmaWx0ZXItdGl0bGVcXFwiPjxkaXYgY2xhc3M9XFxcInByb2plY3RzLWljb24gY2hhcmdpbmdfZnVlbGluZ19zdGF0aW9uX3RlY2hub2xvZ3lcXFwiPjwvZGl2PiBDaGFyZ2luZy9GdWVsaW5nIFN0YXRpb24gVGVjaG5vbG9neTwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInRoZS1maWx0ZXJzXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImZpbHRlci1ib3ggc2VjdG9yIGNvbC1tZC02XFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJmaWx0ZXItdGl0bGVcXFwiPlNlY3RvcjwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInRoZS1maWx0ZXJzXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImZpbHRlci1ib3ggcHJvZ3JhbSBjb2wtbWQtNlxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiZmlsdGVyLXRpdGxlXFxcIj5Qcm9ncmFtPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidGhlLWZpbHRlcnNcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gIDwvZGl2PlxcclxcbjwvZGl2PlwiO1xufSxcInVzZVBhcnRpYWxcIjp0cnVlLFwidXNlRGF0YVwiOnRydWV9KTtcclxuXHJcbnRlbXBsYXRlc1tcImxheWVyc1wiXSA9IEhhbmRsZWJhcnMudGVtcGxhdGUoe1wiMVwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdmFyIGhlbHBlciwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgaGVscGVyTWlzc2luZz1oZWxwZXJzLmhlbHBlck1pc3NpbmcsIGVzY2FwZUV4cHJlc3Npb249dGhpcy5lc2NhcGVFeHByZXNzaW9uO1xuICByZXR1cm4gXCI8ZGl2IGlkPVxcXCJcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLmlkIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5pZCA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJpZFwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCJcXFwiIGNsYXNzPVxcXCJsYXllclRvZ2dsZSBsZWFmbGV0LWNvbnRyb2xcXFwiPlxcclxcbiAgPHAgZGF0YS1keW5hbWl0ZS1zZWxlY3RlZD1cXFwidHJ1ZVxcXCI+XCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5uYW1lIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5uYW1lIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcIm5hbWVcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiPGkgY2xhc3M9XFxcImZhIGZhLWNoZWNrXFxcIj48L2k+PC9wPlxcclxcbjwvZGl2PlxcclxcblwiO1xufSxcImNvbXBpbGVyXCI6WzYsXCI+PSAyLjAuMC1iZXRhLjFcIl0sXCJtYWluXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgc3RhY2sxLCBoZWxwZXIsIG9wdGlvbnMsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGhlbHBlck1pc3Npbmc9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBibG9ja0hlbHBlck1pc3Npbmc9aGVscGVycy5ibG9ja0hlbHBlck1pc3Npbmc7XG4gIHN0YWNrMSA9ICgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMubGF5ZXJzIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5sYXllcnMgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKG9wdGlvbnM9e1wibmFtZVwiOlwibGF5ZXJzXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSgxLCBkYXRhKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIG9wdGlvbnMpIDogaGVscGVyKSk7XG4gIGlmICghaGVscGVycy5sYXllcnMpIHsgc3RhY2sxID0gYmxvY2tIZWxwZXJNaXNzaW5nLmNhbGwoZGVwdGgwLCBzdGFjazEsIG9wdGlvbnMpOyB9XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyByZXR1cm4gc3RhY2sxOyB9XG4gIGVsc2UgeyByZXR1cm4gJyc7IH1cbiAgfSxcInVzZURhdGFcIjp0cnVlfSk7XHJcblxyXG50ZW1wbGF0ZXNbXCJtYXBcIl0gPSBIYW5kbGViYXJzLnRlbXBsYXRlKHtcImNvbXBpbGVyXCI6WzYsXCI+PSAyLjAuMC1iZXRhLjFcIl0sXCJtYWluXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICByZXR1cm4gXCI8ZGl2IGNsYXNzPVxcXCJjb2wtc20tNiBibG9ja1xcXCI+XFxyXFxuICA8ZGl2IGNsYXNzPVxcXCJtYXBcXFwiPjwvZGl2PlxcclxcbjwvZGl2PlwiO1xuICB9LFwidXNlRGF0YVwiOnRydWV9KTtcclxuXHJcbnRlbXBsYXRlc1tcInByb2plY3QtdHlwZVwiXSA9IEhhbmRsZWJhcnMudGVtcGxhdGUoe1wiY29tcGlsZXJcIjpbNixcIj49IDIuMC4wLWJldGEuMVwiXSxcIm1haW5cIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBoZWxwZXIsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGhlbHBlck1pc3Npbmc9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbjtcbiAgcmV0dXJuIFwiPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJidG4gYnRuLWRlZmF1bHQgYnRuLXNtXFxcIj5cIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLmRpc3BsYXkgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmRpc3BsYXkgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwiZGlzcGxheVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCI8L2J1dHRvbj5cIjtcbn0sXCJ1c2VEYXRhXCI6dHJ1ZX0pO1xyXG5cclxudGVtcGxhdGVzW1wicmVuZXdhYmxlLXBvcHVwXCJdID0gSGFuZGxlYmFycy50ZW1wbGF0ZSh7XCIxXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb247XG4gIHJldHVybiBcIjxhIGhyZWY9XFxcIlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMubGluayB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAubGluayA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJsaW5rXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCIgdGFyZ2V0PVxcXCJfYmxhbmtcXFwiPlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMucHJvZ3JhbV9uYW1lIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5wcm9ncmFtX25hbWUgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwicHJvZ3JhbV9uYW1lXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIjwvYT5cIjtcbn0sXCIzXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb247XG4gIHJldHVybiBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMucHJvZ3JhbV9uYW1lIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5wcm9ncmFtX25hbWUgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwicHJvZ3JhbV9uYW1lXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpO1xuICB9LFwiNVwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdmFyIGhlbHBlciwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgaGVscGVyTWlzc2luZz1oZWxwZXJzLmhlbHBlck1pc3NpbmcsIGVzY2FwZUV4cHJlc3Npb249dGhpcy5lc2NhcGVFeHByZXNzaW9uO1xuICByZXR1cm4gXCI8bGk+PGI+UHJvamVjdCBOYW1lOjwvYj4gXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5wcm9qZWN0X25hbWUgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnByb2plY3RfbmFtZSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJwcm9qZWN0X25hbWVcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiPC9saT5cIjtcbn0sXCI3XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb247XG4gIHJldHVybiBcIjxsaT48Yj5Ub3RhbCBQcm9qZWN0IENvc3Q6PC9iPiBcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLnRvdGFsX3Byb2plY3RfY29zdCB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAudG90YWxfcHJvamVjdF9jb3N0IDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcInRvdGFsX3Byb2plY3RfY29zdFwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCI8L2xpPlwiO1xufSxcIjlcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBoZWxwZXIsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGhlbHBlck1pc3Npbmc9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbjtcbiAgcmV0dXJuIFwiPGxpPjxiPkludmVzdG1lbnQgTGV2ZXJhZ2U6PC9iPiBcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLmludmVzdG1lbnRfbGV2ZXJhZ2UgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmludmVzdG1lbnRfbGV2ZXJhZ2UgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwiaW52ZXN0bWVudF9sZXZlcmFnZVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCI8L2xpPlwiO1xufSxcIjExXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb247XG4gIHJldHVybiBcIjxsaT48Yj5Ob3Rlczo8L2I+IFwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMubm90ZXMgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLm5vdGVzIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcIm5vdGVzXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIjwvbGk+XCI7XG59LFwiY29tcGlsZXJcIjpbNixcIj49IDIuMC4wLWJldGEuMVwiXSxcIm1haW5cIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBzdGFjazEsIGhlbHBlciwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgaGVscGVyTWlzc2luZz1oZWxwZXJzLmhlbHBlck1pc3NpbmcsIGVzY2FwZUV4cHJlc3Npb249dGhpcy5lc2NhcGVFeHByZXNzaW9uLCBidWZmZXIgPSBcIjxkaXYgY2xhc3M9XFxcIm1hcC1wcm9qZWN0XFxcIiBzdHlsZT1cXFwiYmFja2dyb3VuZDogXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5jb2xvciB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuY29sb3IgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwiY29sb3JcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxcIj5cXHJcXG4gIDx1bCBjbGFzcz1cXFwibGlzdC11bnN0eWxlZFxcXCI+XFxyXFxuICAgIDxsaT48Yj5UZWNobm9sb2d5OjwvYj4gXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy50ZWNobm9sb2d5IHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC50ZWNobm9sb2d5IDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcInRlY2hub2xvZ3lcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiPC9saT5cXHJcXG4gICAgPGxpPjxiPlByb2dyYW0gTmFtZTo8L2I+IFxcclxcbiAgICAgIFwiO1xuICBzdGFjazEgPSBoZWxwZXJzWydpZiddLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAubGluayA6IGRlcHRoMCksIHtcIm5hbWVcIjpcImlmXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSgxLCBkYXRhKSxcImludmVyc2VcIjp0aGlzLnByb2dyYW0oMywgZGF0YSksXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gXCJcXHJcXG4gICAgPC9saT5cXHJcXG4gICAgXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ2lmJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5wcm9qZWN0X25hbWUgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJpZlwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oNSwgZGF0YSksXCJpbnZlcnNlXCI6dGhpcy5ub29wLFwiZGF0YVwiOmRhdGF9KTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgYnVmZmVyICs9IFwiXFxyXFxuICAgIDxsaT48Yj5NRUEgQ29udHJpYnV0aW9uOjwvYj4gXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5tZWFfYXdhcmQgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLm1lYV9hd2FyZCA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJtZWFfYXdhcmRcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiPC9saT5cXHJcXG4gICAgXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ2lmJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC50b3RhbF9wcm9qZWN0X2Nvc3QgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJpZlwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oNywgZGF0YSksXCJpbnZlcnNlXCI6dGhpcy5ub29wLFwiZGF0YVwiOmRhdGF9KTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgYnVmZmVyICs9IFwiXFxyXFxuICAgIFwiO1xuICBzdGFjazEgPSBoZWxwZXJzWydpZiddLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuaW52ZXN0bWVudF9sZXZlcmFnZSA6IGRlcHRoMCksIHtcIm5hbWVcIjpcImlmXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSg5LCBkYXRhKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gXCJcXHJcXG4gICAgPGxpPjxiPkNhcGFjaXR5OjwvYj4gXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5jYXBhY2l0eSB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuY2FwYWNpdHkgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwiY2FwYWNpdHlcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiIFwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuY2FwYWNpdHlfdW5pdHMgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmNhcGFjaXR5X3VuaXRzIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcImNhcGFjaXR5X3VuaXRzXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIjwvbGk+XFxyXFxuICAgIFwiO1xuICBzdGFjazEgPSBoZWxwZXJzWydpZiddLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAubm90ZXMgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJpZlwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oMTEsIGRhdGEpLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXIgKyBcIlxcclxcbiAgPC91bD5cXHJcXG48L2Rpdj5cIjtcbn0sXCJ1c2VEYXRhXCI6dHJ1ZX0pO1xyXG5cclxudGVtcGxhdGVzW1wic3RhdFwiXSA9IEhhbmRsZWJhcnMudGVtcGxhdGUoe1wiY29tcGlsZXJcIjpbNixcIj49IDIuMC4wLWJldGEuMVwiXSxcIm1haW5cIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBzdGFjazEsIGhlbHBlciwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgaGVscGVyTWlzc2luZz1oZWxwZXJzLmhlbHBlck1pc3NpbmcsIGVzY2FwZUV4cHJlc3Npb249dGhpcy5lc2NhcGVFeHByZXNzaW9uLCBidWZmZXIgPSBcIjxkaXYgY2xhc3M9XFxcIlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMud2lkdGggfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLndpZHRoIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcIndpZHRoXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIiBibG9ja1xcXCI+XFxyXFxuICA8ZGl2IGNsYXNzPVxcXCJjaGFydFxcXCI+XFxyXFxuXCI7XG4gIHN0YWNrMSA9IHRoaXMuaW52b2tlUGFydGlhbChwYXJ0aWFscy50aXRsZSwgJyAgICAnLCAndGl0bGUnLCBkZXB0aDAsIHVuZGVmaW5lZCwgaGVscGVycywgcGFydGlhbHMsIGRhdGEpO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyICsgXCIgICAgPGRpdiBjbGFzcz1cXFwiY2hhcnQtaW5uZXJcXFwiPlxcclxcbiAgICAgIDxkaXYgY2xhc3M9XFxcImxvYWRlclxcXCI+PGkgY2xhc3M9XFxcImZhIGZhLWNpcmNsZS1vLW5vdGNoIGZhLXNwaW5cXFwiPjwvaT48L2Rpdj5cXHJcXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJ0aGUtY2hhcnRcXFwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwic3RhdFxcXCI+PC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJub3RlXFxcIj48c3BhbiBjbGFzcz1cXFwiZWZmaWNpZW5jeS1ub3RlXFxcIj4qIEludmVzdG1lbnQgTGV2ZXJhZ2UgZm9yIGVuZXJneSBlZmZpY2llbmN5IGlzIGxvdyBkdWUgdG8gZmluYW5jaW5nIHByb2dyYW1zLCBmb3Igd2hpY2ggaW52ZXN0bWVudCBsZXZlcmFnZSBpcyBub3QgY2FsY3VsYXRlZC48YnI+PC9zcGFuPiogUmVzaWRlbnRpYWwgYW5kIEFncmljdWx0dXJhbCBwcm9qZWN0cyBhcmUgcGxvdHRlZCBhdCB0aGUgY2VudGVyIG9mIHRoZWlyIHppcCBjb2RlcyB0byBlbnN1cmUgcmVjaXBpZW50IHByaXZhY3kuPC9kaXY+XFxyXFxuICAgICAgPC9kaXY+XFxyXFxuICAgICAgPGRpdiBjbGFzcz1cXFwibm9kYXRhXFxcIj5UaGlzIGNvbWJpbmF0aW9uIG9mIGZpbHRlcnMgaGFzIG5vIGFwcGxpY2FibGUgcHJvamVjdHMuPC9kaXY+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgPC9kaXY+XFxyXFxuPC9kaXY+XCI7XG59LFwidXNlUGFydGlhbFwiOnRydWUsXCJ1c2VEYXRhXCI6dHJ1ZX0pO1xyXG5cclxudGVtcGxhdGVzW1widGFibGUtZW1wdHlcIl0gPSBIYW5kbGViYXJzLnRlbXBsYXRlKHtcImNvbXBpbGVyXCI6WzYsXCI+PSAyLjAuMC1iZXRhLjFcIl0sXCJtYWluXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgc3RhY2sxLCBoZWxwZXIsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGhlbHBlck1pc3Npbmc9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbiwgYnVmZmVyID0gXCI8ZGl2IGNsYXNzPVxcXCJcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLndpZHRoIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC53aWR0aCA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJ3aWR0aFwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCIgYmxvY2tcXFwiPlxcclxcbiAgPGRpdiBjbGFzcz1cXFwiY2hhcnRcXFwiPlxcclxcblwiO1xuICBzdGFjazEgPSB0aGlzLmludm9rZVBhcnRpYWwocGFydGlhbHMudGl0bGUsICcgICAgJywgJ3RpdGxlJywgZGVwdGgwLCB1bmRlZmluZWQsIGhlbHBlcnMsIHBhcnRpYWxzLCBkYXRhKTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgcmV0dXJuIGJ1ZmZlciArIFwiICAgIDxkaXYgY2xhc3M9XFxcImNoYXJ0LWlubmVyXFxcIj5cXHJcXG4gICAgICA8dGFibGUgY2xhc3M9XFxcInRhYmxlIHRhYmxlLWNvbmRlbnNlZCB0YWJsZS1ob3ZlclxcXCI+XFxyXFxuXFxyXFxuICAgICAgPC90YWJsZT5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICA8L2Rpdj5cXHJcXG48L2Rpdj5cIjtcbn0sXCJ1c2VQYXJ0aWFsXCI6dHJ1ZSxcInVzZURhdGFcIjp0cnVlfSk7XHJcblxyXG50ZW1wbGF0ZXNbXCJ0cmFuc3BvcnRhdGlvbi1wb3B1cFwiXSA9IEhhbmRsZWJhcnMudGVtcGxhdGUoe1wiMVwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdmFyIGhlbHBlciwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgaGVscGVyTWlzc2luZz1oZWxwZXJzLmhlbHBlck1pc3NpbmcsIGVzY2FwZUV4cHJlc3Npb249dGhpcy5lc2NhcGVFeHByZXNzaW9uO1xuICByZXR1cm4gXCI8bGk+PGI+Q2hhcmdpbmcgU3RhdGlvbiBUZWNobm9sb2d5OjwvYj4gXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5jaGFyZ2luZ19mdWVsaW5nX3N0YXRpb25fdGVjaG5vbG9neSB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuY2hhcmdpbmdfZnVlbGluZ19zdGF0aW9uX3RlY2hub2xvZ3kgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwiY2hhcmdpbmdfZnVlbGluZ19zdGF0aW9uX3RlY2hub2xvZ3lcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiPC9saT5cIjtcbn0sXCIzXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb247XG4gIHJldHVybiBcIjxsaT48Yj5WZWhpY2xlIFRlY2hub2xvZ3k6PC9iPiBcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLnZlaGljbGVfdGVjaG5vbG9neSB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAudmVoaWNsZV90ZWNobm9sb2d5IDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcInZlaGljbGVfdGVjaG5vbG9neVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCI8L2xpPlwiO1xufSxcIjVcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBoZWxwZXIsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGhlbHBlck1pc3Npbmc9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbjtcbiAgcmV0dXJuIFwiPGEgaHJlZj1cXFwiXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5saW5rIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5saW5rIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcImxpbmtcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxcIiB0YXJnZXQ9XFxcIl9ibGFua1xcXCI+XCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5wcm9ncmFtX25hbWUgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnByb2dyYW1fbmFtZSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJwcm9ncmFtX25hbWVcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiPC9hPlwiO1xufSxcIjdcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBoZWxwZXIsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGhlbHBlck1pc3Npbmc9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbjtcbiAgcmV0dXJuIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5wcm9ncmFtX25hbWUgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnByb2dyYW1fbmFtZSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJwcm9ncmFtX25hbWVcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSk7XG4gIH0sXCI5XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb247XG4gIHJldHVybiBcIjxsaT48Yj5Qcm9qZWN0IE5hbWU6PC9iPiBcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLnByb2plY3RfbmFtZSB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAucHJvamVjdF9uYW1lIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcInByb2plY3RfbmFtZVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCI8L2xpPlwiO1xufSxcIjExXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb247XG4gIHJldHVybiBcIjxsaT48Yj5Ub3RhbCBQcm9qZWN0IENvc3Q6PC9iPiBcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLnRvdGFsX3Byb2plY3RfY29zdCB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAudG90YWxfcHJvamVjdF9jb3N0IDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcInRvdGFsX3Byb2plY3RfY29zdFwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCI8L2xpPlwiO1xufSxcIjEzXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb247XG4gIHJldHVybiBcIjxsaT48Yj5JbnZlc3RtZW50IExldmVyYWdlOjwvYj4gXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5pbnZlc3RtZW50X2xldmVyYWdlIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5pbnZlc3RtZW50X2xldmVyYWdlIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcImludmVzdG1lbnRfbGV2ZXJhZ2VcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiPC9saT5cIjtcbn0sXCIxNVwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdmFyIGhlbHBlciwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgaGVscGVyTWlzc2luZz1oZWxwZXJzLmhlbHBlck1pc3NpbmcsIGVzY2FwZUV4cHJlc3Npb249dGhpcy5lc2NhcGVFeHByZXNzaW9uO1xuICByZXR1cm4gXCI8bGk+PGI+R2FsbG9ucyBvZiBHYXNvbGluZSBFcXVpdmFsZW50IEF2b2lkZWQ6PC9iPiBcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLmdhbGxvbnNfb2ZfZ2Fzb2xpbmVfZXF1aXZhbGVudF9hdm9pZGVkIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5nYWxsb25zX29mX2dhc29saW5lX2VxdWl2YWxlbnRfYXZvaWRlZCA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJnYWxsb25zX29mX2dhc29saW5lX2VxdWl2YWxlbnRfYXZvaWRlZFwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCI8L2xpPlwiO1xufSxcIjE3XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb247XG4gIHJldHVybiBcIjxsaT48Yj5Ob3Rlczo8L2I+IFwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMubm90ZXMgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLm5vdGVzIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcIm5vdGVzXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIjwvbGk+XCI7XG59LFwiY29tcGlsZXJcIjpbNixcIj49IDIuMC4wLWJldGEuMVwiXSxcIm1haW5cIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBzdGFjazEsIGhlbHBlciwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgaGVscGVyTWlzc2luZz1oZWxwZXJzLmhlbHBlck1pc3NpbmcsIGVzY2FwZUV4cHJlc3Npb249dGhpcy5lc2NhcGVFeHByZXNzaW9uLCBidWZmZXIgPSBcIjxkaXYgY2xhc3M9XFxcIm1hcC1wcm9qZWN0XFxcIiBzdHlsZT1cXFwiYmFja2dyb3VuZDogXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5jb2xvciB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuY29sb3IgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwiY29sb3JcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxcIj5cXHJcXG4gIDx1bCBjbGFzcz1cXFwibGlzdC11bnN0eWxlZFxcXCI+XFxyXFxuICAgIFwiO1xuICBzdGFjazEgPSBoZWxwZXJzWydpZiddLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuY2hhcmdpbmdfZnVlbGluZ19zdGF0aW9uX3RlY2hub2xvZ3kgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJpZlwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oMSwgZGF0YSksXCJpbnZlcnNlXCI6dGhpcy5ub29wLFwiZGF0YVwiOmRhdGF9KTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgYnVmZmVyICs9IFwiXFxyXFxuICAgIFwiO1xuICBzdGFjazEgPSBoZWxwZXJzWydpZiddLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAudmVoaWNsZV90ZWNobm9sb2d5IDogZGVwdGgwKSwge1wibmFtZVwiOlwiaWZcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDMsIGRhdGEpLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIGJ1ZmZlciArPSBcIlxcclxcbiAgICA8bGk+PGI+UHJvZ3JhbSBOYW1lOjwvYj4gXFxyXFxuICAgICAgXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ2lmJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5saW5rIDogZGVwdGgwKSwge1wibmFtZVwiOlwiaWZcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDUsIGRhdGEpLFwiaW52ZXJzZVwiOnRoaXMucHJvZ3JhbSg3LCBkYXRhKSxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIGJ1ZmZlciArPSBcIlxcclxcbiAgICA8L2xpPlxcclxcbiAgICBcIjtcbiAgc3RhY2sxID0gaGVscGVyc1snaWYnXS5jYWxsKGRlcHRoMCwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnByb2plY3RfbmFtZSA6IGRlcHRoMCksIHtcIm5hbWVcIjpcImlmXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSg5LCBkYXRhKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gXCJcXHJcXG4gICAgPGxpPjxiPk1FQSBDb250cmlidXRpb246PC9iPiBcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLm1lYV9hd2FyZCB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAubWVhX2F3YXJkIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcIm1lYV9hd2FyZFwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCI8L2xpPlxcclxcbiAgICBcIjtcbiAgc3RhY2sxID0gaGVscGVyc1snaWYnXS5jYWxsKGRlcHRoMCwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnRvdGFsX3Byb2plY3RfY29zdCA6IGRlcHRoMCksIHtcIm5hbWVcIjpcImlmXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSgxMSwgZGF0YSksXCJpbnZlcnNlXCI6dGhpcy5ub29wLFwiZGF0YVwiOmRhdGF9KTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgYnVmZmVyICs9IFwiXFxyXFxuICAgIFwiO1xuICBzdGFjazEgPSBoZWxwZXJzWydpZiddLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuaW52ZXN0bWVudF9sZXZlcmFnZSA6IGRlcHRoMCksIHtcIm5hbWVcIjpcImlmXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSgxMywgZGF0YSksXCJpbnZlcnNlXCI6dGhpcy5ub29wLFwiZGF0YVwiOmRhdGF9KTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgYnVmZmVyICs9IFwiXFxyXFxuICAgIFwiO1xuICBzdGFjazEgPSBoZWxwZXJzWydpZiddLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuZ2FsbG9uc19vZl9nYXNvbGluZV9lcXVpdmFsZW50X2F2b2lkZWQgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJpZlwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oMTUsIGRhdGEpLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIGJ1ZmZlciArPSBcIlxcclxcbiAgICBcIjtcbiAgc3RhY2sxID0gaGVscGVyc1snaWYnXS5jYWxsKGRlcHRoMCwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLm5vdGVzIDogZGVwdGgwKSwge1wibmFtZVwiOlwiaWZcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDE3LCBkYXRhKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyICsgXCJcXHJcXG4gIDwvdWw+XFxyXFxuPC9kaXY+XCI7XG59LFwidXNlRGF0YVwiOnRydWV9KTtcclxuXHJcbnJldHVybiB0ZW1wbGF0ZXM7XHJcblxyXG59OyJdfQ==
