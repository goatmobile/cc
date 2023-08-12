(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/canvas/lib/parse-font.js
  var require_parse_font = __commonJS({
    "node_modules/canvas/lib/parse-font.js"(exports, module) {
      "use strict";
      var weights = "bold|bolder|lighter|[1-9]00";
      var styles = "italic|oblique";
      var variants = "small-caps";
      var stretches = "ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded";
      var units = "px|pt|pc|in|cm|mm|%|em|ex|ch|rem|q";
      var string = `'([^']+)'|"([^"]+)"|[\\w\\s-]+`;
      var weightRe = new RegExp(`(${weights}) +`, "i");
      var styleRe = new RegExp(`(${styles}) +`, "i");
      var variantRe = new RegExp(`(${variants}) +`, "i");
      var stretchRe = new RegExp(`(${stretches}) +`, "i");
      var sizeFamilyRe = new RegExp(
        `([\\d\\.]+)(${units}) *((?:${string})( *, *(?:${string}))*)`
      );
      var cache = {};
      var defaultHeight = 16;
      module.exports = (str) => {
        if (cache[str])
          return cache[str];
        const sizeFamily = sizeFamilyRe.exec(str);
        if (!sizeFamily)
          return;
        const font = {
          weight: "normal",
          style: "normal",
          stretch: "normal",
          variant: "normal",
          size: parseFloat(sizeFamily[1]),
          unit: sizeFamily[2],
          family: sizeFamily[3].replace(/["']/g, "").replace(/ *, */g, ",")
        };
        let weight, style, variant, stretch;
        const substr = str.substring(0, sizeFamily.index);
        if (weight = weightRe.exec(substr))
          font.weight = weight[1];
        if (style = styleRe.exec(substr))
          font.style = style[1];
        if (variant = variantRe.exec(substr))
          font.variant = variant[1];
        if (stretch = stretchRe.exec(substr))
          font.stretch = stretch[1];
        switch (font.unit) {
          case "pt":
            font.size /= 0.75;
            break;
          case "pc":
            font.size *= 16;
            break;
          case "in":
            font.size *= 96;
            break;
          case "cm":
            font.size *= 96 / 2.54;
            break;
          case "mm":
            font.size *= 96 / 25.4;
            break;
          case "%":
            break;
          case "em":
          case "rem":
            font.size *= defaultHeight / 0.75;
            break;
          case "q":
            font.size *= 96 / 25.4 / 4;
            break;
        }
        return cache[str] = font;
      };
    }
  });

  // node_modules/canvas/browser.js
  var require_browser = __commonJS({
    "node_modules/canvas/browser.js"(exports) {
      var parseFont = require_parse_font();
      exports.parseFont = parseFont;
      exports.createCanvas = function(width, height) {
        return Object.assign(document.createElement("canvas"), { width, height });
      };
      exports.createImageData = function(array, width, height) {
        switch (arguments.length) {
          case 0:
            return new ImageData();
          case 1:
            return new ImageData(array);
          case 2:
            return new ImageData(array, width);
          default:
            return new ImageData(array, width, height);
        }
      };
      exports.loadImage = function(src, options) {
        return new Promise(function(resolve, reject) {
          const image = Object.assign(document.createElement("img"), options);
          function cleanup() {
            image.onload = null;
            image.onerror = null;
          }
          image.onload = function() {
            cleanup();
            resolve(image);
          };
          image.onerror = function() {
            cleanup();
            reject(new Error('Failed to load the image "' + src + '"'));
          };
          image.src = src;
        });
      };
    }
  });

  // node_modules/resemblejs/resemble.js
  var require_resemble = __commonJS({
    "node_modules/resemblejs/resemble.js"(exports, module) {
      var naiveFallback = function() {
        if (typeof self === "object" && self) {
          return self;
        }
        if (typeof window === "object" && window) {
          return window;
        }
        throw new Error("Unable to resolve global `this`");
      };
      var getGlobalThis = function() {
        if (typeof globalThis === "object" && globalThis) {
          return globalThis;
        }
        try {
          Object.defineProperty(Object.prototype, "__global__", {
            get: function() {
              return this;
            },
            configurable: true
          });
        } catch (error) {
          return naiveFallback();
        }
        try {
          if (!__global__) {
            return naiveFallback();
          }
          return __global__;
        } finally {
          delete Object.prototype.__global__;
        }
      };
      var isNode = function() {
        const globalPolyfill = getGlobalThis();
        return typeof globalPolyfill.process !== "undefined" && globalPolyfill.process.versions && globalPolyfill.process.versions.node;
      };
      (function(root, factory) {
        "use strict";
        if (typeof define === "function" && define.amd) {
          define([], factory);
        } else if (typeof module === "object" && module.exports) {
          module.exports = factory();
        } else {
          root.resemble = factory();
        }
      })(exports, function() {
        "use strict";
        var Img;
        var Canvas;
        var loadNodeCanvasImage;
        if (isNode()) {
          Canvas = require_browser();
          Img = Canvas.Image;
          loadNodeCanvasImage = Canvas.loadImage;
        } else {
          Img = Image;
        }
        function createCanvas(width, height) {
          if (isNode()) {
            return Canvas.createCanvas(width, height);
          }
          var cnvs = document.createElement("canvas");
          cnvs.width = width;
          cnvs.height = height;
          return cnvs;
        }
        var oldGlobalSettings = {};
        var globalOutputSettings = oldGlobalSettings;
        var resemble = function(fileData) {
          var pixelTransparency = 1;
          var errorPixelColor = {
            red: 255,
            green: 0,
            blue: 255,
            alpha: 255
          };
          var targetPix = { r: 0, g: 0, b: 0, a: 0 };
          var errorPixelTransform = {
            flat: function(px, offset) {
              px[offset] = errorPixelColor.red;
              px[offset + 1] = errorPixelColor.green;
              px[offset + 2] = errorPixelColor.blue;
              px[offset + 3] = errorPixelColor.alpha;
            },
            movement: function(px, offset, d1, d2) {
              px[offset] = (d2.r * (errorPixelColor.red / 255) + errorPixelColor.red) / 2;
              px[offset + 1] = (d2.g * (errorPixelColor.green / 255) + errorPixelColor.green) / 2;
              px[offset + 2] = (d2.b * (errorPixelColor.blue / 255) + errorPixelColor.blue) / 2;
              px[offset + 3] = d2.a;
            },
            flatDifferenceIntensity: function(px, offset, d1, d2) {
              px[offset] = errorPixelColor.red;
              px[offset + 1] = errorPixelColor.green;
              px[offset + 2] = errorPixelColor.blue;
              px[offset + 3] = colorsDistance(d1, d2);
            },
            movementDifferenceIntensity: function(px, offset, d1, d2) {
              var ratio = colorsDistance(d1, d2) / 255 * 0.8;
              px[offset] = (1 - ratio) * (d2.r * (errorPixelColor.red / 255)) + ratio * errorPixelColor.red;
              px[offset + 1] = (1 - ratio) * (d2.g * (errorPixelColor.green / 255)) + ratio * errorPixelColor.green;
              px[offset + 2] = (1 - ratio) * (d2.b * (errorPixelColor.blue / 255)) + ratio * errorPixelColor.blue;
              px[offset + 3] = d2.a;
            },
            diffOnly: function(px, offset, d1, d2) {
              px[offset] = d2.r;
              px[offset + 1] = d2.g;
              px[offset + 2] = d2.b;
              px[offset + 3] = d2.a;
            }
          };
          var errorPixel = errorPixelTransform.flat;
          var errorType;
          var boundingBoxes;
          var ignoredBoxes;
          var ignoreAreasColoredWith;
          var largeImageThreshold = 1200;
          var useCrossOrigin = true;
          var data = {};
          var images = [];
          var updateCallbackArray = [];
          var tolerance = {
            red: 16,
            green: 16,
            blue: 16,
            alpha: 16,
            minBrightness: 16,
            maxBrightness: 240
          };
          var ignoreAntialiasing = false;
          var ignoreColors = false;
          var scaleToSameSize = false;
          var compareOnly = false;
          var returnEarlyThreshold;
          function colorsDistance(c1, c2) {
            return (Math.abs(c1.r - c2.r) + Math.abs(c1.g - c2.g) + Math.abs(c1.b - c2.b)) / 3;
          }
          function withinBoundingBox(x, y, width, height, box) {
            return x > (box.left || 0) && x < (box.right || width) && y > (box.top || 0) && y < (box.bottom || height);
          }
          function withinComparedArea(x, y, width, height, pixel2) {
            var isIncluded = true;
            var i2;
            var boundingBox;
            var ignoredBox;
            var selected;
            var ignored;
            if (boundingBoxes instanceof Array) {
              selected = false;
              for (i2 = 0; i2 < boundingBoxes.length; i2++) {
                boundingBox = boundingBoxes[i2];
                if (withinBoundingBox(x, y, width, height, boundingBox)) {
                  selected = true;
                  break;
                }
              }
            }
            if (ignoredBoxes instanceof Array) {
              ignored = true;
              for (i2 = 0; i2 < ignoredBoxes.length; i2++) {
                ignoredBox = ignoredBoxes[i2];
                if (withinBoundingBox(x, y, width, height, ignoredBox)) {
                  ignored = false;
                  break;
                }
              }
            }
            if (ignoreAreasColoredWith) {
              return colorsDistance(pixel2, ignoreAreasColoredWith) !== 0;
            }
            if (selected === void 0 && ignored === void 0) {
              return true;
            }
            if (selected === false && ignored === true) {
              return false;
            }
            if (selected === true || ignored === true) {
              isIncluded = true;
            }
            if (selected === false || ignored === false) {
              isIncluded = false;
            }
            return isIncluded;
          }
          function triggerDataUpdate() {
            var len = updateCallbackArray.length;
            var i2;
            for (i2 = 0; i2 < len; i2++) {
              if (typeof updateCallbackArray[i2] === "function") {
                updateCallbackArray[i2](data);
              }
            }
          }
          function loop(w2, h2, callback) {
            var x;
            var y;
            for (x = 0; x < w2; x++) {
              for (y = 0; y < h2; y++) {
                callback(x, y);
              }
            }
          }
          function parseImage(sourceImageData, width, height) {
            var pixelCount = 0;
            var redTotal = 0;
            var greenTotal = 0;
            var blueTotal = 0;
            var alphaTotal = 0;
            var brightnessTotal = 0;
            var whiteTotal = 0;
            var blackTotal = 0;
            loop(width, height, function(horizontalPos, verticalPos) {
              var offset = (verticalPos * width + horizontalPos) * 4;
              var red = sourceImageData[offset];
              var green = sourceImageData[offset + 1];
              var blue = sourceImageData[offset + 2];
              var alpha = sourceImageData[offset + 3];
              var brightness = getBrightness(red, green, blue);
              if (red === green && red === blue && alpha) {
                if (red === 0) {
                  blackTotal++;
                } else if (red === 255) {
                  whiteTotal++;
                }
              }
              pixelCount++;
              redTotal += red / 255 * 100;
              greenTotal += green / 255 * 100;
              blueTotal += blue / 255 * 100;
              alphaTotal += (255 - alpha) / 255 * 100;
              brightnessTotal += brightness / 255 * 100;
            });
            data.red = Math.floor(redTotal / pixelCount);
            data.green = Math.floor(greenTotal / pixelCount);
            data.blue = Math.floor(blueTotal / pixelCount);
            data.alpha = Math.floor(alphaTotal / pixelCount);
            data.brightness = Math.floor(brightnessTotal / pixelCount);
            data.white = Math.floor(whiteTotal / pixelCount * 100);
            data.black = Math.floor(blackTotal / pixelCount * 100);
            triggerDataUpdate();
          }
          function onLoadImage(hiddenImage, callback) {
            var width = hiddenImage.width;
            var height = hiddenImage.height;
            if (scaleToSameSize && images.length === 1) {
              width = images[0].width;
              height = images[0].height;
            }
            var hiddenCanvas = createCanvas(width, height);
            var imageData;
            hiddenCanvas.getContext("2d").drawImage(hiddenImage, 0, 0, width, height);
            imageData = hiddenCanvas.getContext("2d").getImageData(0, 0, width, height);
            images.push(imageData);
            callback(imageData, width, height);
          }
          function loadImageData(fileDataForImage, callback) {
            var fileReader;
            var hiddenImage = new Img();
            if (!hiddenImage.setAttribute) {
              hiddenImage.setAttribute = function setAttribute() {
              };
            }
            if (useCrossOrigin) {
              hiddenImage.setAttribute("crossorigin", "anonymous");
            }
            hiddenImage.onerror = function(event) {
              hiddenImage.onload = null;
              hiddenImage.onerror = null;
              const error = event ? event + "" : "Unknown error";
              images.push({ error: `Failed to load image '${fileDataForImage}'. ${error}` });
              callback();
            };
            hiddenImage.onload = function() {
              hiddenImage.onload = null;
              hiddenImage.onerror = null;
              onLoadImage(hiddenImage, callback);
            };
            if (typeof fileDataForImage === "string") {
              hiddenImage.src = fileDataForImage;
              if (!isNode() && hiddenImage.complete && hiddenImage.naturalWidth > 0) {
                hiddenImage.onload();
              }
            } else if (typeof fileDataForImage.data !== "undefined" && typeof fileDataForImage.width === "number" && typeof fileDataForImage.height === "number") {
              images.push(fileDataForImage);
              callback(fileDataForImage, fileDataForImage.width, fileDataForImage.height);
            } else if (typeof Buffer !== "undefined" && fileDataForImage instanceof Buffer) {
              loadNodeCanvasImage(fileDataForImage).then(function(image) {
                hiddenImage.onload = null;
                hiddenImage.onerror = null;
                onLoadImage(image, callback);
              }).catch(function(err) {
                images.push({
                  error: err ? err + "" : "Image load error."
                });
                callback();
              });
            } else {
              fileReader = new FileReader();
              fileReader.onload = function(event) {
                hiddenImage.src = event.target.result;
              };
              fileReader.readAsDataURL(fileDataForImage);
            }
          }
          function isColorSimilar(a2, b2, color) {
            var absDiff = Math.abs(a2 - b2);
            if (typeof a2 === "undefined") {
              return false;
            }
            if (typeof b2 === "undefined") {
              return false;
            }
            if (a2 === b2) {
              return true;
            } else if (absDiff < tolerance[color]) {
              return true;
            }
            return false;
          }
          function isPixelBrightnessSimilar(d1, d2) {
            var alpha = isColorSimilar(d1.a, d2.a, "alpha");
            var brightness = isColorSimilar(d1.brightness, d2.brightness, "minBrightness");
            return brightness && alpha;
          }
          function getBrightness(r2, g2, b2) {
            return 0.3 * r2 + 0.59 * g2 + 0.11 * b2;
          }
          function isRGBSame(d1, d2) {
            var red = d1.r === d2.r;
            var green = d1.g === d2.g;
            var blue = d1.b === d2.b;
            return red && green && blue;
          }
          function isRGBSimilar(d1, d2) {
            var red = isColorSimilar(d1.r, d2.r, "red");
            var green = isColorSimilar(d1.g, d2.g, "green");
            var blue = isColorSimilar(d1.b, d2.b, "blue");
            var alpha = isColorSimilar(d1.a, d2.a, "alpha");
            return red && green && blue && alpha;
          }
          function isContrasting(d1, d2) {
            return Math.abs(d1.brightness - d2.brightness) > tolerance.maxBrightness;
          }
          function getHue(red, green, blue) {
            var r2 = red / 255;
            var g2 = green / 255;
            var b2 = blue / 255;
            var max = Math.max(r2, g2, b2);
            var min = Math.min(r2, g2, b2);
            var h2;
            var d2;
            if (max === min) {
              h2 = 0;
            } else {
              d2 = max - min;
              switch (max) {
                case r2:
                  h2 = (g2 - b2) / d2 + (g2 < b2 ? 6 : 0);
                  break;
                case g2:
                  h2 = (b2 - r2) / d2 + 2;
                  break;
                case b2:
                  h2 = (r2 - g2) / d2 + 4;
                  break;
                default:
                  h2 /= 6;
              }
            }
            return h2;
          }
          function isAntialiased(sourcePix, pix, cacheSet, verticalPos, horizontalPos, width) {
            var offset;
            var distance = 1;
            var i2;
            var j2;
            var hasHighContrastSibling = 0;
            var hasSiblingWithDifferentHue = 0;
            var hasEquivalentSibling = 0;
            addHueInfo(sourcePix);
            for (i2 = distance * -1; i2 <= distance; i2++) {
              for (j2 = distance * -1; j2 <= distance; j2++) {
                if (i2 === 0 && j2 === 0) {
                } else {
                  offset = ((verticalPos + j2) * width + (horizontalPos + i2)) * 4;
                  if (!getPixelInfo(targetPix, pix, offset, cacheSet)) {
                    continue;
                  }
                  addBrightnessInfo(targetPix);
                  addHueInfo(targetPix);
                  if (isContrasting(sourcePix, targetPix)) {
                    hasHighContrastSibling++;
                  }
                  if (isRGBSame(sourcePix, targetPix)) {
                    hasEquivalentSibling++;
                  }
                  if (Math.abs(targetPix.h - sourcePix.h) > 0.3) {
                    hasSiblingWithDifferentHue++;
                  }
                  if (hasSiblingWithDifferentHue > 1 || hasHighContrastSibling > 1) {
                    return true;
                  }
                }
              }
            }
            if (hasEquivalentSibling < 2) {
              return true;
            }
            return false;
          }
          function copyPixel(px, offset, pix) {
            if (errorType === "diffOnly") {
              return;
            }
            px[offset] = pix.r;
            px[offset + 1] = pix.g;
            px[offset + 2] = pix.b;
            px[offset + 3] = pix.a * pixelTransparency;
          }
          function copyGrayScalePixel(px, offset, pix) {
            if (errorType === "diffOnly") {
              return;
            }
            px[offset] = pix.brightness;
            px[offset + 1] = pix.brightness;
            px[offset + 2] = pix.brightness;
            px[offset + 3] = pix.a * pixelTransparency;
          }
          function getPixelInfo(dst, pix, offset) {
            if (pix.length > offset) {
              dst.r = pix[offset];
              dst.g = pix[offset + 1];
              dst.b = pix[offset + 2];
              dst.a = pix[offset + 3];
              return true;
            }
            return false;
          }
          function addBrightnessInfo(pix) {
            pix.brightness = getBrightness(pix.r, pix.g, pix.b);
          }
          function addHueInfo(pix) {
            pix.h = getHue(pix.r, pix.g, pix.b);
          }
          function analyseImages(img1, img2, width, height) {
            var data1 = img1.data;
            var data2 = img2.data;
            var hiddenCanvas;
            var context;
            var imgd;
            var pix;
            if (!compareOnly) {
              hiddenCanvas = createCanvas(width, height);
              context = hiddenCanvas.getContext("2d");
              imgd = context.createImageData(width, height);
              pix = imgd.data;
            }
            var mismatchCount = 0;
            var diffBounds = {
              top: height,
              left: width,
              bottom: 0,
              right: 0
            };
            var updateBounds = function(x, y) {
              diffBounds.left = Math.min(x, diffBounds.left);
              diffBounds.right = Math.max(x, diffBounds.right);
              diffBounds.top = Math.min(y, diffBounds.top);
              diffBounds.bottom = Math.max(y, diffBounds.bottom);
            };
            var time = Date.now();
            var skip;
            if (!!largeImageThreshold && ignoreAntialiasing && (width > largeImageThreshold || height > largeImageThreshold)) {
              skip = 6;
            }
            var pixel1 = { r: 0, g: 0, b: 0, a: 0 };
            var pixel2 = { r: 0, g: 0, b: 0, a: 0 };
            var skipTheRest = false;
            loop(width, height, function(horizontalPos, verticalPos) {
              if (skipTheRest) {
                return;
              }
              if (skip) {
                if (verticalPos % skip === 0 || horizontalPos % skip === 0) {
                  return;
                }
              }
              var offset = (verticalPos * width + horizontalPos) * 4;
              if (!getPixelInfo(pixel1, data1, offset, 1) || !getPixelInfo(pixel2, data2, offset, 2)) {
                return;
              }
              var isWithinComparedArea = withinComparedArea(horizontalPos, verticalPos, width, height, pixel2);
              if (ignoreColors) {
                addBrightnessInfo(pixel1);
                addBrightnessInfo(pixel2);
                if (isPixelBrightnessSimilar(pixel1, pixel2) || !isWithinComparedArea) {
                  if (!compareOnly) {
                    copyGrayScalePixel(pix, offset, pixel2);
                  }
                } else {
                  if (!compareOnly) {
                    errorPixel(pix, offset, pixel1, pixel2);
                  }
                  mismatchCount++;
                  updateBounds(horizontalPos, verticalPos);
                }
                return;
              }
              if (isRGBSimilar(pixel1, pixel2) || !isWithinComparedArea) {
                if (!compareOnly) {
                  copyPixel(pix, offset, pixel1);
                }
              } else if (ignoreAntialiasing && (addBrightnessInfo(pixel1), addBrightnessInfo(pixel2), isAntialiased(pixel1, data1, 1, verticalPos, horizontalPos, width) || isAntialiased(pixel2, data2, 2, verticalPos, horizontalPos, width))) {
                if (isPixelBrightnessSimilar(pixel1, pixel2) || !isWithinComparedArea) {
                  if (!compareOnly) {
                    copyGrayScalePixel(pix, offset, pixel2);
                  }
                } else {
                  if (!compareOnly) {
                    errorPixel(pix, offset, pixel1, pixel2);
                  }
                  mismatchCount++;
                  updateBounds(horizontalPos, verticalPos);
                }
              } else {
                if (!compareOnly) {
                  errorPixel(pix, offset, pixel1, pixel2);
                }
                mismatchCount++;
                updateBounds(horizontalPos, verticalPos);
              }
              if (compareOnly) {
                var currentMisMatchPercent = mismatchCount / (height * width) * 100;
                if (currentMisMatchPercent > returnEarlyThreshold) {
                  skipTheRest = true;
                }
              }
            });
            data.rawMisMatchPercentage = mismatchCount / (height * width) * 100;
            data.misMatchPercentage = data.rawMisMatchPercentage.toFixed(2);
            data.diffBounds = diffBounds;
            data.analysisTime = Date.now() - time;
            data.getImageDataUrl = function(text) {
              if (compareOnly) {
                throw Error("No diff image available - ran in compareOnly mode");
              }
              var barHeight = 0;
              if (text) {
                barHeight = addLabel(text, context, hiddenCanvas);
              }
              context.putImageData(imgd, 0, barHeight);
              return hiddenCanvas.toDataURL("image/png");
            };
            if (!compareOnly && hiddenCanvas.toBuffer) {
              data.getBuffer = function(includeOriginal) {
                if (includeOriginal) {
                  var imageWidth = hiddenCanvas.width + 2;
                  hiddenCanvas.width = imageWidth * 3;
                  context.putImageData(img1, 0, 0);
                  context.putImageData(img2, imageWidth, 0);
                  context.putImageData(imgd, imageWidth * 2, 0);
                } else {
                  context.putImageData(imgd, 0, 0);
                }
                return hiddenCanvas.toBuffer();
              };
            }
          }
          function addLabel(text, context, hiddenCanvas) {
            var textPadding = 2;
            context.font = "12px sans-serif";
            var textWidth = context.measureText(text).width + textPadding * 2;
            var barHeight = 22;
            if (textWidth > hiddenCanvas.width) {
              hiddenCanvas.width = textWidth;
            }
            hiddenCanvas.height += barHeight;
            context.fillStyle = "#666";
            context.fillRect(0, 0, hiddenCanvas.width, barHeight - 4);
            context.fillStyle = "#fff";
            context.fillRect(0, barHeight - 4, hiddenCanvas.width, 4);
            context.fillStyle = "#fff";
            context.textBaseline = "top";
            context.font = "12px sans-serif";
            context.fillText(text, textPadding, 1);
            return barHeight;
          }
          function normalise(img, w2, h2) {
            var c2;
            var context;
            if (img.height < h2 || img.width < w2) {
              c2 = createCanvas(w2, h2);
              context = c2.getContext("2d");
              context.putImageData(img, 0, 0);
              return context.getImageData(0, 0, w2, h2);
            }
            return img;
          }
          function outputSettings(options) {
            var key;
            if (options.errorColor) {
              for (key in options.errorColor) {
                if (options.errorColor.hasOwnProperty(key)) {
                  errorPixelColor[key] = options.errorColor[key] === void 0 ? errorPixelColor[key] : options.errorColor[key];
                }
              }
            }
            if (options.errorType && errorPixelTransform[options.errorType]) {
              errorPixel = errorPixelTransform[options.errorType];
              errorType = options.errorType;
            }
            if (options.errorPixel && typeof options.errorPixel === "function") {
              errorPixel = options.errorPixel;
            }
            pixelTransparency = isNaN(Number(options.transparency)) ? pixelTransparency : options.transparency;
            if (options.largeImageThreshold !== void 0) {
              largeImageThreshold = options.largeImageThreshold;
            }
            if (options.useCrossOrigin !== void 0) {
              useCrossOrigin = options.useCrossOrigin;
            }
            if (options.boundingBox !== void 0) {
              boundingBoxes = [options.boundingBox];
            }
            if (options.ignoredBox !== void 0) {
              ignoredBoxes = [options.ignoredBox];
            }
            if (options.boundingBoxes !== void 0) {
              boundingBoxes = options.boundingBoxes;
            }
            if (options.ignoredBoxes !== void 0) {
              ignoredBoxes = options.ignoredBoxes;
            }
            if (options.ignoreAreasColoredWith !== void 0) {
              ignoreAreasColoredWith = options.ignoreAreasColoredWith;
            }
          }
          function compare(one, two) {
            if (globalOutputSettings !== oldGlobalSettings) {
              outputSettings(globalOutputSettings);
            }
            function onceWeHaveBoth() {
              var width;
              var height;
              if (images.length === 2) {
                if (images[0].error || images[1].error) {
                  data = {};
                  data.error = images[0].error ? images[0].error : images[1].error;
                  triggerDataUpdate();
                  return;
                }
                width = images[0].width > images[1].width ? images[0].width : images[1].width;
                height = images[0].height > images[1].height ? images[0].height : images[1].height;
                if (images[0].width === images[1].width && images[0].height === images[1].height) {
                  data.isSameDimensions = true;
                } else {
                  data.isSameDimensions = false;
                }
                data.dimensionDifference = {
                  width: images[0].width - images[1].width,
                  height: images[0].height - images[1].height
                };
                analyseImages(normalise(images[0], width, height), normalise(images[1], width, height), width, height);
                triggerDataUpdate();
              }
            }
            images = [];
            loadImageData(one, onceWeHaveBoth);
            loadImageData(two, onceWeHaveBoth);
          }
          function getCompareApi(param) {
            var secondFileData;
            var hasMethod = typeof param === "function";
            if (!hasMethod) {
              secondFileData = param;
            }
            var self2 = {
              setReturnEarlyThreshold: function(threshold) {
                if (threshold) {
                  compareOnly = true;
                  returnEarlyThreshold = threshold;
                }
                return self2;
              },
              scaleToSameSize: function() {
                scaleToSameSize = true;
                if (hasMethod) {
                  param();
                }
                return self2;
              },
              useOriginalSize: function() {
                scaleToSameSize = false;
                if (hasMethod) {
                  param();
                }
                return self2;
              },
              ignoreNothing: function() {
                tolerance.red = 0;
                tolerance.green = 0;
                tolerance.blue = 0;
                tolerance.alpha = 0;
                tolerance.minBrightness = 0;
                tolerance.maxBrightness = 255;
                ignoreAntialiasing = false;
                ignoreColors = false;
                if (hasMethod) {
                  param();
                }
                return self2;
              },
              ignoreLess: function() {
                tolerance.red = 16;
                tolerance.green = 16;
                tolerance.blue = 16;
                tolerance.alpha = 16;
                tolerance.minBrightness = 16;
                tolerance.maxBrightness = 240;
                ignoreAntialiasing = false;
                ignoreColors = false;
                if (hasMethod) {
                  param();
                }
                return self2;
              },
              ignoreAntialiasing: function() {
                tolerance.red = 32;
                tolerance.green = 32;
                tolerance.blue = 32;
                tolerance.alpha = 32;
                tolerance.minBrightness = 64;
                tolerance.maxBrightness = 96;
                ignoreAntialiasing = true;
                ignoreColors = false;
                if (hasMethod) {
                  param();
                }
                return self2;
              },
              ignoreColors: function() {
                tolerance.alpha = 16;
                tolerance.minBrightness = 16;
                tolerance.maxBrightness = 240;
                ignoreAntialiasing = false;
                ignoreColors = true;
                if (hasMethod) {
                  param();
                }
                return self2;
              },
              ignoreAlpha: function() {
                tolerance.red = 16;
                tolerance.green = 16;
                tolerance.blue = 16;
                tolerance.alpha = 255;
                tolerance.minBrightness = 16;
                tolerance.maxBrightness = 240;
                ignoreAntialiasing = false;
                ignoreColors = false;
                if (hasMethod) {
                  param();
                }
                return self2;
              },
              repaint: function() {
                if (hasMethod) {
                  param();
                }
                return self2;
              },
              outputSettings: function(options) {
                outputSettings(options);
                return self2;
              },
              onComplete: function(callback) {
                updateCallbackArray.push(callback);
                var wrapper = function() {
                  compare(fileData, secondFileData);
                };
                wrapper();
                return getCompareApi(wrapper);
              },
              setupCustomTolerance: function(customSettings) {
                for (var property in tolerance) {
                  if (!customSettings.hasOwnProperty(property)) {
                    continue;
                  }
                  tolerance[property] = customSettings[property];
                }
              }
            };
            return self2;
          }
          var rootSelf = {
            onComplete: function(callback) {
              updateCallbackArray.push(callback);
              loadImageData(fileData, function(imageData, width, height) {
                parseImage(imageData.data, width, height);
              });
            },
            compareTo: function(secondFileData) {
              return getCompareApi(secondFileData);
            },
            outputSettings: function(options) {
              outputSettings(options);
              return rootSelf;
            }
          };
          return rootSelf;
        };
        function setGlobalOutputSettings(settings) {
          globalOutputSettings = settings;
          return resemble;
        }
        function applyIgnore(api, ignore, customTolerance) {
          switch (ignore) {
            case "nothing":
              api.ignoreNothing();
              break;
            case "less":
              api.ignoreLess();
              break;
            case "antialiasing":
              api.ignoreAntialiasing();
              break;
            case "colors":
              api.ignoreColors();
              break;
            case "alpha":
              api.ignoreAlpha();
              break;
            default:
              throw new Error("Invalid ignore: " + ignore);
          }
          api.setupCustomTolerance(customTolerance);
        }
        resemble.compare = function(image1, image2, options, cb) {
          var callback;
          var opt;
          if (typeof options === "function") {
            callback = options;
            opt = {};
          } else {
            callback = cb;
            opt = options || {};
          }
          var res = resemble(image1);
          var compare;
          if (opt.output) {
            res.outputSettings(opt.output);
          }
          compare = res.compareTo(image2);
          if (opt.returnEarlyThreshold) {
            compare.setReturnEarlyThreshold(opt.returnEarlyThreshold);
          }
          if (opt.scaleToSameSize) {
            compare.scaleToSameSize();
          }
          var toleranceSettings = opt.tolerance || {};
          if (typeof opt.ignore === "string") {
            applyIgnore(compare, opt.ignore, toleranceSettings);
          } else if (opt.ignore && opt.ignore.forEach) {
            opt.ignore.forEach(function(v2) {
              applyIgnore(compare, v2, toleranceSettings);
            });
          }
          compare.onComplete(function(data) {
            if (data.error) {
              callback(data.error);
            } else {
              callback(null, data);
            }
          });
        };
        resemble.outputSettings = setGlobalOutputSettings;
        return resemble;
      });
    }
  });

  // node_modules/resemblejs/compareImages.js
  var require_compareImages = __commonJS({
    "node_modules/resemblejs/compareImages.js"(exports, module) {
      var resemble = require_resemble();
      module.exports = function compareImages2(image1, image2, options) {
        return new Promise((resolve, reject) => {
          resemble.compare(image1, image2, options, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      };
    }
  });

  // node_modules/preact/dist/preact.module.js
  var n;
  var l;
  var u;
  var i;
  var t;
  var o;
  var r;
  var f = {};
  var e = [];
  var c = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
  function s(n2, l2) {
    for (var u2 in l2)
      n2[u2] = l2[u2];
    return n2;
  }
  function a(n2) {
    var l2 = n2.parentNode;
    l2 && l2.removeChild(n2);
  }
  function h(l2, u2, i2) {
    var t2, o2, r2, f2 = {};
    for (r2 in u2)
      "key" == r2 ? t2 = u2[r2] : "ref" == r2 ? o2 = u2[r2] : f2[r2] = u2[r2];
    if (arguments.length > 2 && (f2.children = arguments.length > 3 ? n.call(arguments, 2) : i2), "function" == typeof l2 && null != l2.defaultProps)
      for (r2 in l2.defaultProps)
        void 0 === f2[r2] && (f2[r2] = l2.defaultProps[r2]);
    return v(l2, f2, t2, o2, null);
  }
  function v(n2, i2, t2, o2, r2) {
    var f2 = { type: n2, props: i2, key: t2, ref: o2, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, __h: null, constructor: void 0, __v: null == r2 ? ++u : r2 };
    return null == r2 && null != l.vnode && l.vnode(f2), f2;
  }
  function p(n2) {
    return n2.children;
  }
  function d(n2, l2) {
    this.props = n2, this.context = l2;
  }
  function _(n2, l2) {
    if (null == l2)
      return n2.__ ? _(n2.__, n2.__.__k.indexOf(n2) + 1) : null;
    for (var u2; l2 < n2.__k.length; l2++)
      if (null != (u2 = n2.__k[l2]) && null != u2.__e)
        return u2.__e;
    return "function" == typeof n2.type ? _(n2) : null;
  }
  function k(n2) {
    var l2, u2;
    if (null != (n2 = n2.__) && null != n2.__c) {
      for (n2.__e = n2.__c.base = null, l2 = 0; l2 < n2.__k.length; l2++)
        if (null != (u2 = n2.__k[l2]) && null != u2.__e) {
          n2.__e = n2.__c.base = u2.__e;
          break;
        }
      return k(n2);
    }
  }
  function b(n2) {
    (!n2.__d && (n2.__d = true) && t.push(n2) && !g.__r++ || o !== l.debounceRendering) && ((o = l.debounceRendering) || setTimeout)(g);
  }
  function g() {
    for (var n2; g.__r = t.length; )
      n2 = t.sort(function(n3, l2) {
        return n3.__v.__b - l2.__v.__b;
      }), t = [], n2.some(function(n3) {
        var l2, u2, i2, t2, o2, r2;
        n3.__d && (o2 = (t2 = (l2 = n3).__v).__e, (r2 = l2.__P) && (u2 = [], (i2 = s({}, t2)).__v = t2.__v + 1, j(r2, t2, i2, l2.__n, void 0 !== r2.ownerSVGElement, null != t2.__h ? [o2] : null, u2, null == o2 ? _(t2) : o2, t2.__h), z(u2, t2), t2.__e != o2 && k(t2)));
      });
  }
  function w(n2, l2, u2, i2, t2, o2, r2, c2, s2, a2) {
    var h2, y, d2, k2, b2, g2, w2, x = i2 && i2.__k || e, C2 = x.length;
    for (u2.__k = [], h2 = 0; h2 < l2.length; h2++)
      if (null != (k2 = u2.__k[h2] = null == (k2 = l2[h2]) || "boolean" == typeof k2 ? null : "string" == typeof k2 || "number" == typeof k2 || "bigint" == typeof k2 ? v(null, k2, null, null, k2) : Array.isArray(k2) ? v(p, { children: k2 }, null, null, null) : k2.__b > 0 ? v(k2.type, k2.props, k2.key, k2.ref ? k2.ref : null, k2.__v) : k2)) {
        if (k2.__ = u2, k2.__b = u2.__b + 1, null === (d2 = x[h2]) || d2 && k2.key == d2.key && k2.type === d2.type)
          x[h2] = void 0;
        else
          for (y = 0; y < C2; y++) {
            if ((d2 = x[y]) && k2.key == d2.key && k2.type === d2.type) {
              x[y] = void 0;
              break;
            }
            d2 = null;
          }
        j(n2, k2, d2 = d2 || f, t2, o2, r2, c2, s2, a2), b2 = k2.__e, (y = k2.ref) && d2.ref != y && (w2 || (w2 = []), d2.ref && w2.push(d2.ref, null, k2), w2.push(y, k2.__c || b2, k2)), null != b2 ? (null == g2 && (g2 = b2), "function" == typeof k2.type && k2.__k === d2.__k ? k2.__d = s2 = m(k2, s2, n2) : s2 = A(n2, k2, d2, x, b2, s2), "function" == typeof u2.type && (u2.__d = s2)) : s2 && d2.__e == s2 && s2.parentNode != n2 && (s2 = _(d2));
      }
    for (u2.__e = g2, h2 = C2; h2--; )
      null != x[h2] && N(x[h2], x[h2]);
    if (w2)
      for (h2 = 0; h2 < w2.length; h2++)
        M(w2[h2], w2[++h2], w2[++h2]);
  }
  function m(n2, l2, u2) {
    for (var i2, t2 = n2.__k, o2 = 0; t2 && o2 < t2.length; o2++)
      (i2 = t2[o2]) && (i2.__ = n2, l2 = "function" == typeof i2.type ? m(i2, l2, u2) : A(u2, i2, i2, t2, i2.__e, l2));
    return l2;
  }
  function A(n2, l2, u2, i2, t2, o2) {
    var r2, f2, e2;
    if (void 0 !== l2.__d)
      r2 = l2.__d, l2.__d = void 0;
    else if (null == u2 || t2 != o2 || null == t2.parentNode)
      n:
        if (null == o2 || o2.parentNode !== n2)
          n2.appendChild(t2), r2 = null;
        else {
          for (f2 = o2, e2 = 0; (f2 = f2.nextSibling) && e2 < i2.length; e2 += 1)
            if (f2 == t2)
              break n;
          n2.insertBefore(t2, o2), r2 = o2;
        }
    return void 0 !== r2 ? r2 : t2.nextSibling;
  }
  function C(n2, l2, u2, i2, t2) {
    var o2;
    for (o2 in u2)
      "children" === o2 || "key" === o2 || o2 in l2 || H(n2, o2, null, u2[o2], i2);
    for (o2 in l2)
      t2 && "function" != typeof l2[o2] || "children" === o2 || "key" === o2 || "value" === o2 || "checked" === o2 || u2[o2] === l2[o2] || H(n2, o2, l2[o2], u2[o2], i2);
  }
  function $(n2, l2, u2) {
    "-" === l2[0] ? n2.setProperty(l2, u2) : n2[l2] = null == u2 ? "" : "number" != typeof u2 || c.test(l2) ? u2 : u2 + "px";
  }
  function H(n2, l2, u2, i2, t2) {
    var o2;
    n:
      if ("style" === l2)
        if ("string" == typeof u2)
          n2.style.cssText = u2;
        else {
          if ("string" == typeof i2 && (n2.style.cssText = i2 = ""), i2)
            for (l2 in i2)
              u2 && l2 in u2 || $(n2.style, l2, "");
          if (u2)
            for (l2 in u2)
              i2 && u2[l2] === i2[l2] || $(n2.style, l2, u2[l2]);
        }
      else if ("o" === l2[0] && "n" === l2[1])
        o2 = l2 !== (l2 = l2.replace(/Capture$/, "")), l2 = l2.toLowerCase() in n2 ? l2.toLowerCase().slice(2) : l2.slice(2), n2.l || (n2.l = {}), n2.l[l2 + o2] = u2, u2 ? i2 || n2.addEventListener(l2, o2 ? T : I, o2) : n2.removeEventListener(l2, o2 ? T : I, o2);
      else if ("dangerouslySetInnerHTML" !== l2) {
        if (t2)
          l2 = l2.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
        else if ("href" !== l2 && "list" !== l2 && "form" !== l2 && "tabIndex" !== l2 && "download" !== l2 && l2 in n2)
          try {
            n2[l2] = null == u2 ? "" : u2;
            break n;
          } catch (n3) {
          }
        "function" == typeof u2 || (null == u2 || false === u2 && -1 == l2.indexOf("-") ? n2.removeAttribute(l2) : n2.setAttribute(l2, u2));
      }
  }
  function I(n2) {
    this.l[n2.type + false](l.event ? l.event(n2) : n2);
  }
  function T(n2) {
    this.l[n2.type + true](l.event ? l.event(n2) : n2);
  }
  function j(n2, u2, i2, t2, o2, r2, f2, e2, c2) {
    var a2, h2, v2, y, _2, k2, b2, g2, m2, x, A2, C2, $2, H2, I2, T2 = u2.type;
    if (void 0 !== u2.constructor)
      return null;
    null != i2.__h && (c2 = i2.__h, e2 = u2.__e = i2.__e, u2.__h = null, r2 = [e2]), (a2 = l.__b) && a2(u2);
    try {
      n:
        if ("function" == typeof T2) {
          if (g2 = u2.props, m2 = (a2 = T2.contextType) && t2[a2.__c], x = a2 ? m2 ? m2.props.value : a2.__ : t2, i2.__c ? b2 = (h2 = u2.__c = i2.__c).__ = h2.__E : ("prototype" in T2 && T2.prototype.render ? u2.__c = h2 = new T2(g2, x) : (u2.__c = h2 = new d(g2, x), h2.constructor = T2, h2.render = O), m2 && m2.sub(h2), h2.props = g2, h2.state || (h2.state = {}), h2.context = x, h2.__n = t2, v2 = h2.__d = true, h2.__h = [], h2._sb = []), null == h2.__s && (h2.__s = h2.state), null != T2.getDerivedStateFromProps && (h2.__s == h2.state && (h2.__s = s({}, h2.__s)), s(h2.__s, T2.getDerivedStateFromProps(g2, h2.__s))), y = h2.props, _2 = h2.state, v2)
            null == T2.getDerivedStateFromProps && null != h2.componentWillMount && h2.componentWillMount(), null != h2.componentDidMount && h2.__h.push(h2.componentDidMount);
          else {
            if (null == T2.getDerivedStateFromProps && g2 !== y && null != h2.componentWillReceiveProps && h2.componentWillReceiveProps(g2, x), !h2.__e && null != h2.shouldComponentUpdate && false === h2.shouldComponentUpdate(g2, h2.__s, x) || u2.__v === i2.__v) {
              for (h2.props = g2, h2.state = h2.__s, u2.__v !== i2.__v && (h2.__d = false), h2.__v = u2, u2.__e = i2.__e, u2.__k = i2.__k, u2.__k.forEach(function(n3) {
                n3 && (n3.__ = u2);
              }), A2 = 0; A2 < h2._sb.length; A2++)
                h2.__h.push(h2._sb[A2]);
              h2._sb = [], h2.__h.length && f2.push(h2);
              break n;
            }
            null != h2.componentWillUpdate && h2.componentWillUpdate(g2, h2.__s, x), null != h2.componentDidUpdate && h2.__h.push(function() {
              h2.componentDidUpdate(y, _2, k2);
            });
          }
          if (h2.context = x, h2.props = g2, h2.__v = u2, h2.__P = n2, C2 = l.__r, $2 = 0, "prototype" in T2 && T2.prototype.render) {
            for (h2.state = h2.__s, h2.__d = false, C2 && C2(u2), a2 = h2.render(h2.props, h2.state, h2.context), H2 = 0; H2 < h2._sb.length; H2++)
              h2.__h.push(h2._sb[H2]);
            h2._sb = [];
          } else
            do {
              h2.__d = false, C2 && C2(u2), a2 = h2.render(h2.props, h2.state, h2.context), h2.state = h2.__s;
            } while (h2.__d && ++$2 < 25);
          h2.state = h2.__s, null != h2.getChildContext && (t2 = s(s({}, t2), h2.getChildContext())), v2 || null == h2.getSnapshotBeforeUpdate || (k2 = h2.getSnapshotBeforeUpdate(y, _2)), I2 = null != a2 && a2.type === p && null == a2.key ? a2.props.children : a2, w(n2, Array.isArray(I2) ? I2 : [I2], u2, i2, t2, o2, r2, f2, e2, c2), h2.base = u2.__e, u2.__h = null, h2.__h.length && f2.push(h2), b2 && (h2.__E = h2.__ = null), h2.__e = false;
        } else
          null == r2 && u2.__v === i2.__v ? (u2.__k = i2.__k, u2.__e = i2.__e) : u2.__e = L(i2.__e, u2, i2, t2, o2, r2, f2, c2);
      (a2 = l.diffed) && a2(u2);
    } catch (n3) {
      u2.__v = null, (c2 || null != r2) && (u2.__e = e2, u2.__h = !!c2, r2[r2.indexOf(e2)] = null), l.__e(n3, u2, i2);
    }
  }
  function z(n2, u2) {
    l.__c && l.__c(u2, n2), n2.some(function(u3) {
      try {
        n2 = u3.__h, u3.__h = [], n2.some(function(n3) {
          n3.call(u3);
        });
      } catch (n3) {
        l.__e(n3, u3.__v);
      }
    });
  }
  function L(l2, u2, i2, t2, o2, r2, e2, c2) {
    var s2, h2, v2, y = i2.props, p2 = u2.props, d2 = u2.type, k2 = 0;
    if ("svg" === d2 && (o2 = true), null != r2) {
      for (; k2 < r2.length; k2++)
        if ((s2 = r2[k2]) && "setAttribute" in s2 == !!d2 && (d2 ? s2.localName === d2 : 3 === s2.nodeType)) {
          l2 = s2, r2[k2] = null;
          break;
        }
    }
    if (null == l2) {
      if (null === d2)
        return document.createTextNode(p2);
      l2 = o2 ? document.createElementNS("http://www.w3.org/2000/svg", d2) : document.createElement(d2, p2.is && p2), r2 = null, c2 = false;
    }
    if (null === d2)
      y === p2 || c2 && l2.data === p2 || (l2.data = p2);
    else {
      if (r2 = r2 && n.call(l2.childNodes), h2 = (y = i2.props || f).dangerouslySetInnerHTML, v2 = p2.dangerouslySetInnerHTML, !c2) {
        if (null != r2)
          for (y = {}, k2 = 0; k2 < l2.attributes.length; k2++)
            y[l2.attributes[k2].name] = l2.attributes[k2].value;
        (v2 || h2) && (v2 && (h2 && v2.__html == h2.__html || v2.__html === l2.innerHTML) || (l2.innerHTML = v2 && v2.__html || ""));
      }
      if (C(l2, p2, y, o2, c2), v2)
        u2.__k = [];
      else if (k2 = u2.props.children, w(l2, Array.isArray(k2) ? k2 : [k2], u2, i2, t2, o2 && "foreignObject" !== d2, r2, e2, r2 ? r2[0] : i2.__k && _(i2, 0), c2), null != r2)
        for (k2 = r2.length; k2--; )
          null != r2[k2] && a(r2[k2]);
      c2 || ("value" in p2 && void 0 !== (k2 = p2.value) && (k2 !== l2.value || "progress" === d2 && !k2 || "option" === d2 && k2 !== y.value) && H(l2, "value", k2, y.value, false), "checked" in p2 && void 0 !== (k2 = p2.checked) && k2 !== l2.checked && H(l2, "checked", k2, y.checked, false));
    }
    return l2;
  }
  function M(n2, u2, i2) {
    try {
      "function" == typeof n2 ? n2(u2) : n2.current = u2;
    } catch (n3) {
      l.__e(n3, i2);
    }
  }
  function N(n2, u2, i2) {
    var t2, o2;
    if (l.unmount && l.unmount(n2), (t2 = n2.ref) && (t2.current && t2.current !== n2.__e || M(t2, null, u2)), null != (t2 = n2.__c)) {
      if (t2.componentWillUnmount)
        try {
          t2.componentWillUnmount();
        } catch (n3) {
          l.__e(n3, u2);
        }
      t2.base = t2.__P = null, n2.__c = void 0;
    }
    if (t2 = n2.__k)
      for (o2 = 0; o2 < t2.length; o2++)
        t2[o2] && N(t2[o2], u2, i2 || "function" != typeof n2.type);
    i2 || null == n2.__e || a(n2.__e), n2.__ = n2.__e = n2.__d = void 0;
  }
  function O(n2, l2, u2) {
    return this.constructor(n2, u2);
  }
  function P(u2, i2, t2) {
    var o2, r2, e2;
    l.__ && l.__(u2, i2), r2 = (o2 = "function" == typeof t2) ? null : t2 && t2.__k || i2.__k, e2 = [], j(i2, u2 = (!o2 && t2 || i2).__k = h(p, null, [u2]), r2 || f, f, void 0 !== i2.ownerSVGElement, !o2 && t2 ? [t2] : r2 ? null : i2.firstChild ? n.call(i2.childNodes) : null, e2, !o2 && t2 ? t2 : r2 ? r2.__e : i2.firstChild, o2), z(e2, u2);
  }
  n = e.slice, l = { __e: function(n2, l2, u2, i2) {
    for (var t2, o2, r2; l2 = l2.__; )
      if ((t2 = l2.__c) && !t2.__)
        try {
          if ((o2 = t2.constructor) && null != o2.getDerivedStateFromError && (t2.setState(o2.getDerivedStateFromError(n2)), r2 = t2.__d), null != t2.componentDidCatch && (t2.componentDidCatch(n2, i2 || {}), r2 = t2.__d), r2)
            return t2.__E = t2;
        } catch (l3) {
          n2 = l3;
        }
    throw n2;
  } }, u = 0, i = function(n2) {
    return null != n2 && void 0 === n2.constructor;
  }, d.prototype.setState = function(n2, l2) {
    var u2;
    u2 = null != this.__s && this.__s !== this.state ? this.__s : this.__s = s({}, this.state), "function" == typeof n2 && (n2 = n2(s({}, u2), this.props)), n2 && s(u2, n2), null != n2 && this.__v && (l2 && this._sb.push(l2), b(this));
  }, d.prototype.forceUpdate = function(n2) {
    this.__v && (this.__e = true, n2 && this.__h.push(n2), b(this));
  }, d.prototype.render = p, t = [], g.__r = 0, r = 0;

  // js/script.jsx
  var import_compareImages = __toESM(require_compareImages());
  var container = document.querySelector("#container");
  var Chooser = class extends d {
    constructor(props) {
      super(props);
      this.setState({
        color: props.colors[0],
        radius: props.radii[0]
      });
    }
    componentDidUpdate() {
      this.props.updater(this.state.color, this.state.radius);
    }
    render() {
      let colorRows = [];
      for (const color of this.props.colors) {
        colorRows.push(
          /* @__PURE__ */ h("td", {
            class: "pr-1"
          }, /* @__PURE__ */ h("div", {
            onClick: () => {
              this.setState({
                color
              });
            },
            class: "rounded-md",
            style: {
              width: "60px",
              height: "60px",
              backgroundColor: color,
              border: this.state.color == color ? "2px solid red" : "2px solid black",
              cursor: "pointer"
            }
          }))
        );
      }
      let radiusRows = [];
      radiusRows.push(
        /* @__PURE__ */ h("td", {
          class: "pr-1"
        }, /* @__PURE__ */ h("div", {
          onClick: () => {
            const canvas = document.querySelector("#canvas");
            const ctx = canvas.getContext("2d");
            ctx.rect(
              0,
              0,
              canvas.getAttribute("width"),
              canvas.getAttribute("height")
            );
            ctx.fillStyle = this.state.color;
            ctx.fill();
          },
          class: "flex items-center justify-center rounded-md",
          style: {
            width: "60px",
            height: "60px",
            backgroundColor: this.state.color,
            border: "1px solid black",
            cursor: "pointer"
          }
        }, /* @__PURE__ */ h("svg", {
          width: "40",
          height: "40",
          viewBox: "-1 0 16 16",
          xmlns: "http://www.w3.org/2000/svg"
        }, /* @__PURE__ */ h("path", {
          fill: "#fff",
          stroke: "#000",
          "stroke-width": "0.5",
          d: "M6.192 2.78c-.458-.677-.927-1.248-1.35-1.643a2.972 2.972 0 0 0-.71-.515c-.217-.104-.56-.205-.882-.02c-.367.213-.427.63-.43.896c-.003.304.064.664.173 1.044c.196.687.556 1.528 1.035 2.402L.752 8.22c-.277.277-.269.656-.218.918c.055.283.187.593.36.903c.348.627.92 1.361 1.626 2.068c.707.707 1.441 1.278 2.068 1.626c.31.173.62.305.903.36c.262.05.64.059.918-.218l5.615-5.615c.118.257.092.512.05.939c-.03.292-.068.665-.073 1.176v.123h.003a1 1 0 0 0 1.993 0H14v-.057a1.01 1.01 0 0 0-.004-.117c-.055-1.25-.7-2.738-1.86-3.494a4.322 4.322 0 0 0-.211-.434c-.349-.626-.92-1.36-1.627-2.067c-.707-.707-1.441-1.279-2.068-1.627c-.31-.172-.62-.304-.903-.36c-.262-.05-.64-.058-.918.219l-.217.216zM4.16 1.867c.381.356.844.922 1.311 1.632l-.704.705c-.382-.727-.66-1.402-.813-1.938a3.283 3.283 0 0 1-.131-.673c.091.061.204.15.337.274zm.394 3.965c.54.852 1.107 1.567 1.607 2.033a.5.5 0 1 0 .682-.732c-.453-.422-1.017-1.136-1.564-2.027l1.088-1.088c.054.12.115.243.183.365c.349.627.92 1.361 1.627 2.068c.706.707 1.44 1.278 2.068 1.626c.122.068.244.13.365.183l-4.861 4.862a.571.571 0 0 1-.068-.01c-.137-.027-.342-.104-.608-.252c-.524-.292-1.186-.8-1.846-1.46c-.66-.66-1.168-1.32-1.46-1.846c-.147-.265-.225-.47-.251-.607a.573.573 0 0 1-.01-.068l3.048-3.047zm2.87-1.935a2.44 2.44 0 0 1-.241-.561c.135.033.324.11.562.241c.524.292 1.186.8 1.846 1.46c.45.45.83.901 1.118 1.31a3.497 3.497 0 0 0-1.066.091a11.27 11.27 0 0 1-.76-.694c-.66-.66-1.167-1.322-1.458-1.847z"
        }))))
      );
      for (const size of this.props.radii) {
        radiusRows.push(
          /* @__PURE__ */ h("td", null, /* @__PURE__ */ h("div", {
            class: `rounded-md flex items-center cursor-pointer justify-center ${this.state.radius == size ? "bg-green-200" : "bg-grey-200"}`,
            style: {
              minWidth: "60px",
              minHeight: "60px"
            },
            onClick: () => {
              this.setState({
                radius: size
              });
            }
          }, /* @__PURE__ */ h("div", {
            style: {
              width: `${size * 2}px`,
              height: `${size * 2}px`,
              backgroundColor: this.state.color,
              border: "2px solid black",
              borderRadius: "100000px"
            }
          })))
        );
      }
      let radiusSelector = /* @__PURE__ */ h("table", {
        class: "mt-1"
      }, /* @__PURE__ */ h("tbody", null, /* @__PURE__ */ h("tr", null, radiusRows)));
      let colorSelector = /* @__PURE__ */ h("table", {
        class: "mt-1"
      }, /* @__PURE__ */ h("tbody", null, /* @__PURE__ */ h("tr", null, colorRows)));
      return /* @__PURE__ */ h("div", {
        class: "flex flex-col items-center"
      }, /* @__PURE__ */ h("div", null, colorSelector), /* @__PURE__ */ h("div", null, radiusSelector));
    }
  };
  function flagDrawer(options) {
    let colors = options.colors;
    let isDrawing = false;
    let rect = null;
    colors = colors.map((x) => `#${x}`);
    let currColor = colors[0];
    let radiuses = [5, 10, 25];
    let currRadius = radiuses[0];
    const canvasWidth = options.width;
    const canvasHeight = options.height;
    let lastCoords = null;
    const drawCircle = (ctx, options2) => {
      ctx.beginPath();
      ctx.arc(options2.x, options2.y, options2.radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = options2.color;
      ctx.fill();
    };
    const mouseStart = (e2) => {
      const canvas = e2.target;
      e2.stopPropagation();
      e2.preventDefault();
      const ctx = canvas.getContext("2d");
      rect = canvas.getBoundingClientRect();
      let x = e2.x - rect.x;
      let y = e2.y - rect.y;
      drawCircle(ctx, {
        x,
        y,
        radius: currRadius,
        color: currColor
      });
      lastCoords = [x, y];
      isDrawing = true;
    };
    const mouseMove = (e2) => {
      if (!isDrawing) {
        return;
      }
      e2.stopPropagation();
      e2.preventDefault();
      let x = null;
      let y = null;
      if (e2 instanceof TouchEvent) {
        const touch = e2.targetTouches[0];
        x = touch.clientX - rect.x;
        y = touch.clientY - rect.y;
      } else {
        x = e2.x - rect.x;
        y = e2.y - rect.y;
      }
      const canvas = e2.target;
      const ctx = canvas.getContext("2d");
      if (lastCoords !== null) {
        ctx.beginPath();
        ctx.moveTo(lastCoords[0], lastCoords[1]);
        ctx.lineTo(x, y);
        ctx.lineWidth = currRadius * 2;
        ctx.strokeStyle = currColor;
        ctx.stroke();
      }
      drawCircle(ctx, {
        x,
        y,
        radius: currRadius,
        color: currColor
      });
      lastCoords = [x, y];
    };
    const mouseEnd = (e2) => {
      isDrawing = false;
    };
    document.body.addEventListener("mouseup", mouseEnd);
    document.body.addEventListener("touchend", mouseEnd);
    let canvasEl = /* @__PURE__ */ h("canvas", {
      width: canvasWidth,
      height: canvasHeight,
      id: "canvas",
      style: "border: 1px solid black; margin: 0 auto;",
      onMouseDown: mouseStart,
      onMouseMove: mouseMove,
      onTouchStart: mouseStart,
      onTouchMove: mouseMove
    });
    return /* @__PURE__ */ h("div", {
      class: "mt-2"
    }, canvasEl, /* @__PURE__ */ h(Chooser, {
      colors,
      radii: radiuses,
      updater: (color, radius) => {
        currColor = color;
        currRadius = radius;
      }
    }));
  }
  async function compareFlags(name, drawnFlagCanvas, svgUrl) {
    let img = new Image();
    img.src = `/compare-flags/${name}-flag-150px.png`;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    let result = await (0, import_compareImages.default)(
      canvas.toDataURL(),
      drawnFlagCanvas.toDataURL(),
      {
        scaleToSameSize: true,
        tolerance: {
          alpha: 100
        }
      }
    );
    return { name, similarityPercent: 100 - result.misMatchPercentage };
  }
  function rng(seed) {
    function random() {
      let x = Math.sin(seed++) * 1e4;
      return x - Math.floor(x);
    }
    return random;
  }
  function hashString(str) {
    var hash = 0, i2, chr;
    if (str.length === 0)
      return hash;
    for (i2 = 0; i2 < str.length; i2++) {
      chr = str.charCodeAt(i2);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }
    return hash;
  }
  function pickCountry(data) {
    let countries = Object.keys(data);
    let today = new Date();
    let todayHash = hashString(today.toDateString());
    let random = rng(todayHash);
    let idx = Math.floor(random() * countries.length);
    return countries[idx];
  }
  async function rankFlags(countries) {
    let svgs = countries.map((x) => [x, `/data/${x}/flag.svg`]);
    const drawnFlag = document.querySelector("#canvas");
    console.log(drawnFlag);
    let coros = [];
    for (const [name, svgUrl] of svgs) {
      coros.push(compareFlags(name, drawnFlag, svgUrl));
    }
    let data = await Promise.all(coros);
    data = data.sort((a2, b2) => b2.similarityPercent - a2.similarityPercent);
    return data;
  }
  var Checker = class extends d {
    constructor(props) {
      super(props);
      this.state = {
        status: "none"
      };
    }
    render() {
      let button = null;
      if (this.state.status === "checking") {
        button = /* @__PURE__ */ h("p", null, "Checking...");
      } else {
        button = /* @__PURE__ */ h("button", {
          class: "btn btn-outline btn-secondary",
          onClick: async () => {
            console.log("Checking");
            this.setState({
              status: "checking"
            });
            await checkSubmission(
              this.props.data,
              this.props.country,
              this.props.countryData
            );
            this.setState({
              status: "none"
            });
          }
        }, "Submit");
      }
      return /* @__PURE__ */ h("div", {
        class: "mt-2"
      }, button);
    }
  };
  var failPhrases = ["Oopsie doopsie", "Not quite"];
  var successPhrases = ["Great job"];
  function choose(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  function showModal(successes) {
    let trackerRows = [];
    trackerRows.push(
      /* @__PURE__ */ h("tr", null, /* @__PURE__ */ h("td", null, /* @__PURE__ */ h("div", {
        class: "mr-4"
      }, "Name")), /* @__PURE__ */ h("td", null, successes.name ? "\u2714\uFE0F" : successes.name === null ? "\u2754" : "\u274C"))
    );
    trackerRows.push(
      /* @__PURE__ */ h("tr", null, /* @__PURE__ */ h("td", null, /* @__PURE__ */ h("div", {
        class: "mr-4"
      }, "Capital")), /* @__PURE__ */ h("td", null, successes.capital ? "\u2714\uFE0F" : successes.capital === null ? "\u2754" : "\u274C"))
    );
    trackerRows.push(
      /* @__PURE__ */ h("tr", null, /* @__PURE__ */ h("td", null, /* @__PURE__ */ h("div", {
        class: "mr-4"
      }, "Flag")), /* @__PURE__ */ h("td", null, successes.flag ? "\u2714\uFE0F" : successes.flag === null ? "\u2754" : "\u274C"))
    );
    let shareText = null;
    let passed = successes.name && successes.flag && successes.capital;
    if (passed) {
      shareText = "meow";
    } else {
      shareText = `Uh oh! I'm stuck at ${successes.num_attempts} tries on today's Coucapag! Maybe you can help me?`;
    }
    let tryAgainButton = null;
    if (!passed) {
      tryAgainButton = /* @__PURE__ */ h("button", {
        onClick: () => {
          hideErrorModal();
        },
        class: "btn mt-4"
      }, "Try Again");
    }
    const pluralize = (word, n2) => {
      if (n2 !== 1) {
        return word + "s";
      }
      return word;
    };
    let attemptMsg = null;
    let today = new Date().toLocaleDateString();
    if (passed) {
      attemptMsg = `Correct in ${successes.num_attempts} ${pluralize(
        "attempt",
        successes.num_attempts
      )} on ${today}!`;
    } else {
      attemptMsg = `${successes.num_attempts} ${pluralize(
        "attempt",
        successes.num_attempts
      )} so far on ${today} :(`;
    }
    const modal = /* @__PURE__ */ h("div", {
      class: "py-10 flex flex-col items-center justify-center w-80 max-w-md bg-slate-700 text-center text-white border-2 rounded-lg shadow-2xl drop-shadow-2xl"
    }, /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("span", {
      style: "font-family: Helvetica, sans-serif",
      class: "mt-10 bg-slate-100 p-2 text-black text-4xl rounded-xl"
    }, passed ? choose(successPhrases) : choose(failPhrases), "!")), /* @__PURE__ */ h("div", {
      class: "mt-4"
    }, attemptMsg), /* @__PURE__ */ h("div", {
      class: "mt-4"
    }, /* @__PURE__ */ h("table", null, /* @__PURE__ */ h("tbody", null, trackerRows))), /* @__PURE__ */ h("div", null, tryAgainButton), /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("button", {
      onClick: () => {
        share(shareText);
      },
      class: "btn mt-4"
    }, /* @__PURE__ */ h("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "32",
      height: "32",
      viewBox: "0 0 16 16"
    }, /* @__PURE__ */ h("g", {
      fill: "none",
      stroke: "currentColor",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "1.5"
    }, /* @__PURE__ */ h("circle", {
      cx: "4",
      cy: "8",
      r: "2.25"
    }), /* @__PURE__ */ h("circle", {
      cx: "12",
      cy: "12",
      r: "2.25"
    }), /* @__PURE__ */ h("circle", {
      cx: "12",
      cy: "4",
      r: "2.25"
    }), /* @__PURE__ */ h("path", {
      d: "m6 9l4 2M6 7l4-2"
    }))), " ", passed ? "Share" : "Give Up")));
    P(modal, document.querySelector("#error-modal"));
  }
  function hideErrorModal() {
    document.querySelector("#error-modal").innerHTML = "";
  }
  function copyToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      var successful = document.execCommand("copy");
      var msg = successful ? "successful" : "unsuccessful";
    } catch (err) {
      console.error(err);
    }
    document.body.removeChild(textArea);
  }
  function share(msg) {
    const url = "https://coucapags.whatscookin.biz/";
    if (navigator.share) {
      navigator.share({
        title: url,
        text: msg,
        url
      }).then(() => console.log("Successful share")).catch((error) => console.log("Error sharing", error));
    } else {
      console.log("Sharing", url);
      copyToClipboard(msg + "\n\n" + url);
      alert("Copied to clipboard!");
    }
  }
  function lenientStringMatch(expected, actual) {
    let removeChars = [" ", "'", "\u02BB", "."];
    expected = expected.toLowerCase();
    actual = actual.toLowerCase();
    for (const char of removeChars) {
      expected = expected.replaceAll(char, "");
      actual = actual.replaceAll(char, "");
    }
    let acceptableSubstitutions = {
      \u00E9: ["e"],
      \u00F3: ["o"],
      \u0103: ["a"],
      \u0219: ["s"],
      \u00ED: ["i"]
    };
    if (expected.length !== actual.length) {
      return false;
    }
    for (let i2 = 0; i2 < expected.length; i2++) {
      let charA = expected.charAt(i2);
      let charB = actual.charAt(i2);
      console.log(charA, charB);
      if (charA !== charB) {
        let subs = acceptableSubstitutions[charA];
        if (!subs) {
          return false;
        }
        if (!subs.includes(charB)) {
          return false;
        }
      }
    }
    return true;
    console.log(expected.length);
    console.log(actual.length);
    return expected === actual;
  }
  async function checkSubmission(data, country, countryData) {
    let countries = Object.keys(data);
    console.log(countryData.capital);
    console.log(lenientStringMatch(countryData.capital, "SAn Jose"));
    const name = document.querySelector("#country-name").value;
    const capital = document.querySelector("#country-capital").value;
    console.log(countryData);
    let prevAttempts = localStorage.getItem("num_attempts");
    if (prevAttempts === null || prevAttempts === void 0) {
      prevAttempts = 0;
    }
    prevAttempts = parseInt(prevAttempts);
    let currAttempts = prevAttempts + 1;
    localStorage.setItem("num_attempts", currAttempts);
    let successes = {
      name: null,
      capital: null,
      flag: null,
      num_attempts: currAttempts
    };
    successes.name = lenientStringMatch(countryData.name, name);
    successes.capital = lenientStringMatch(countryData.capital, capital);
    if (successes.name && successes.capital) {
      let flagMatches = await rankFlags(countries);
      console.log(flagMatches);
      console.log(flagMatches.slice(0, 10).map((x) => x.name));
      console.log(flagMatches.slice(0, 10).map((x) => x.name));
      let isInTopN = flagMatches.slice(0, 4).map((x) => x.name).includes(country);
      let countryFlagToShow = isInTopN ? country : flagMatches[0].name;
      let isFlagMatch = flagMatches.slice(0, 4).map((x) => x.name).includes(country);
      successes.flag = isFlagMatch;
    }
    showModal(successes);
  }
  async function main() {
    let cr = await fetch("/data/countries.json");
    let countries = await cr.json();
    let r2 = await fetch("/colors.json");
    let content = await r2.json();
    let country = pickCountry(content);
    let colors = content[country];
    let img = new Image();
    img.src = `/data/${country}/flag.svg`;
    img.onload = () => {
      let height = img.height;
      let width = img.width;
      let goalHeight = 150;
      let scale = goalHeight / height;
      height = height * scale;
      width = width * scale;
      P(
        /* @__PURE__ */ h("div", {
          class: "flex justify-center flex-col items-center"
        }, /* @__PURE__ */ h("img", {
          class: "noselect w-60",
          src: `/data/${country}/outline.svg`
        }), /* @__PURE__ */ h("div", {
          class: "w-full flex items-center flex-col px-4"
        }, /* @__PURE__ */ h("div", {
          class: "mb-2 w-full"
        }, /* @__PURE__ */ h("span", {
          class: "font-bold block"
        }, "Name"), /* @__PURE__ */ h("input", {
          class: "mt-2 input input-bordered input-primary w-full",
          type: "text",
          id: "country-name"
        })), /* @__PURE__ */ h("div", {
          class: "mb-2 w-full"
        }, /* @__PURE__ */ h("span", {
          class: "font-bold block"
        }, "Capital"), /* @__PURE__ */ h("input", {
          class: "mt-2 input input-bordered input-primary w-full",
          type: "text",
          id: "country-capital"
        }))), /* @__PURE__ */ h("div", {
          class: "w-full"
        }, /* @__PURE__ */ h("span", {
          class: "px-4 font-bold block"
        }, "The Flag")), /* @__PURE__ */ h("div", null, flagDrawer({
          width,
          height,
          colors
        })), /* @__PURE__ */ h(Checker, {
          data: content,
          country,
          countryData: countries[country]
        })),
        container
      );
    };
  }
  main();
})();
//# sourceMappingURL=script.dist.js.map
