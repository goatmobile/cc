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
        function createCanvas2(width, height) {
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
          function colorsDistance(c1, c22) {
            return (Math.abs(c1.r - c22.r) + Math.abs(c1.g - c22.g) + Math.abs(c1.b - c22.b)) / 3;
          }
          function withinBoundingBox(x, y2, width, height, box) {
            return x > (box.left || 0) && x < (box.right || width) && y2 > (box.top || 0) && y2 < (box.bottom || height);
          }
          function withinComparedArea(x, y2, width, height, pixel2) {
            var isIncluded = true;
            var i3;
            var boundingBox;
            var ignoredBox;
            var selected;
            var ignored;
            if (boundingBoxes instanceof Array) {
              selected = false;
              for (i3 = 0; i3 < boundingBoxes.length; i3++) {
                boundingBox = boundingBoxes[i3];
                if (withinBoundingBox(x, y2, width, height, boundingBox)) {
                  selected = true;
                  break;
                }
              }
            }
            if (ignoredBoxes instanceof Array) {
              ignored = true;
              for (i3 = 0; i3 < ignoredBoxes.length; i3++) {
                ignoredBox = ignoredBoxes[i3];
                if (withinBoundingBox(x, y2, width, height, ignoredBox)) {
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
            var i3;
            for (i3 = 0; i3 < len; i3++) {
              if (typeof updateCallbackArray[i3] === "function") {
                updateCallbackArray[i3](data);
              }
            }
          }
          function loop(w2, h3, callback) {
            var x;
            var y2;
            for (x = 0; x < w2; x++) {
              for (y2 = 0; y2 < h3; y2++) {
                callback(x, y2);
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
            var hiddenCanvas = createCanvas2(width, height);
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
          function isColorSimilar(a3, b2, color) {
            var absDiff = Math.abs(a3 - b2);
            if (typeof a3 === "undefined") {
              return false;
            }
            if (typeof b2 === "undefined") {
              return false;
            }
            if (a3 === b2) {
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
          function getBrightness(r3, g2, b2) {
            return 0.3 * r3 + 0.59 * g2 + 0.11 * b2;
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
            var r3 = red / 255;
            var g2 = green / 255;
            var b2 = blue / 255;
            var max = Math.max(r3, g2, b2);
            var min = Math.min(r3, g2, b2);
            var h3;
            var d2;
            if (max === min) {
              h3 = 0;
            } else {
              d2 = max - min;
              switch (max) {
                case r3:
                  h3 = (g2 - b2) / d2 + (g2 < b2 ? 6 : 0);
                  break;
                case g2:
                  h3 = (b2 - r3) / d2 + 2;
                  break;
                case b2:
                  h3 = (r3 - g2) / d2 + 4;
                  break;
                default:
                  h3 /= 6;
              }
            }
            return h3;
          }
          function isAntialiased(sourcePix, pix, cacheSet, verticalPos, horizontalPos, width) {
            var offset;
            var distance = 1;
            var i3;
            var j2;
            var hasHighContrastSibling = 0;
            var hasSiblingWithDifferentHue = 0;
            var hasEquivalentSibling = 0;
            addHueInfo(sourcePix);
            for (i3 = distance * -1; i3 <= distance; i3++) {
              for (j2 = distance * -1; j2 <= distance; j2++) {
                if (i3 === 0 && j2 === 0) {
                } else {
                  offset = ((verticalPos + j2) * width + (horizontalPos + i3)) * 4;
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
              hiddenCanvas = createCanvas2(width, height);
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
            var updateBounds = function(x, y2) {
              diffBounds.left = Math.min(x, diffBounds.left);
              diffBounds.right = Math.max(x, diffBounds.right);
              diffBounds.top = Math.min(y2, diffBounds.top);
              diffBounds.bottom = Math.max(y2, diffBounds.bottom);
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
          function normalise(img, w2, h3) {
            var c4;
            var context;
            if (img.height < h3 || img.width < w2) {
              c4 = createCanvas2(w2, h3);
              context = c4.getContext("2d");
              context.putImageData(img, 0, 0);
              return context.getImageData(0, 0, w2, h3);
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
            opt.ignore.forEach(function(v3) {
              applyIgnore(compare, v3, toleranceSettings);
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

  // node_modules/performance-now/lib/performance-now.js
  var require_performance_now = __commonJS({
    "node_modules/performance-now/lib/performance-now.js"(exports, module) {
      (function() {
        var getNanoSeconds, hrtime, loadTime, moduleLoadTime, nodeLoadTime, upTime;
        if (typeof performance !== "undefined" && performance !== null && performance.now) {
          module.exports = function() {
            return performance.now();
          };
        } else if (typeof process !== "undefined" && process !== null && process.hrtime) {
          module.exports = function() {
            return (getNanoSeconds() - nodeLoadTime) / 1e6;
          };
          hrtime = process.hrtime;
          getNanoSeconds = function() {
            var hr;
            hr = hrtime();
            return hr[0] * 1e9 + hr[1];
          };
          moduleLoadTime = getNanoSeconds();
          upTime = process.uptime() * 1e9;
          nodeLoadTime = moduleLoadTime - upTime;
        } else if (Date.now) {
          module.exports = function() {
            return Date.now() - loadTime;
          };
          loadTime = Date.now();
        } else {
          module.exports = function() {
            return new Date().getTime() - loadTime;
          };
          loadTime = new Date().getTime();
        }
      }).call(exports);
    }
  });

  // node_modules/raf/index.js
  var require_raf = __commonJS({
    "node_modules/raf/index.js"(exports, module) {
      var now = require_performance_now();
      var root = typeof window === "undefined" ? global : window;
      var vendors = ["moz", "webkit"];
      var suffix = "AnimationFrame";
      var raf = root["request" + suffix];
      var caf = root["cancel" + suffix] || root["cancelRequest" + suffix];
      for (i3 = 0; !raf && i3 < vendors.length; i3++) {
        raf = root[vendors[i3] + "Request" + suffix];
        caf = root[vendors[i3] + "Cancel" + suffix] || root[vendors[i3] + "CancelRequest" + suffix];
      }
      var i3;
      if (!raf || !caf) {
        last = 0, id = 0, queue = [], frameDuration = 1e3 / 60;
        raf = function(callback) {
          if (queue.length === 0) {
            var _now = now(), next = Math.max(0, frameDuration - (_now - last));
            last = next + _now;
            setTimeout(function() {
              var cp = queue.slice(0);
              queue.length = 0;
              for (var i4 = 0; i4 < cp.length; i4++) {
                if (!cp[i4].cancelled) {
                  try {
                    cp[i4].callback(last);
                  } catch (e3) {
                    setTimeout(function() {
                      throw e3;
                    }, 0);
                  }
                }
              }
            }, Math.round(next));
          }
          queue.push({
            handle: ++id,
            callback,
            cancelled: false
          });
          return id;
        };
        caf = function(handle) {
          for (var i4 = 0; i4 < queue.length; i4++) {
            if (queue[i4].handle === handle) {
              queue[i4].cancelled = true;
            }
          }
        };
      }
      var last;
      var id;
      var queue;
      var frameDuration;
      module.exports = function(fn) {
        return raf.call(root, fn);
      };
      module.exports.cancel = function() {
        caf.apply(root, arguments);
      };
      module.exports.polyfill = function(object) {
        if (!object) {
          object = root;
        }
        object.requestAnimationFrame = raf;
        object.cancelAnimationFrame = caf;
      };
    }
  });

  // node_modules/rgbcolor/index.js
  var require_rgbcolor = __commonJS({
    "node_modules/rgbcolor/index.js"(exports, module) {
      module.exports = function(color_string) {
        this.ok = false;
        this.alpha = 1;
        if (color_string.charAt(0) == "#") {
          color_string = color_string.substr(1, 6);
        }
        color_string = color_string.replace(/ /g, "");
        color_string = color_string.toLowerCase();
        var simple_colors = {
          aliceblue: "f0f8ff",
          antiquewhite: "faebd7",
          aqua: "00ffff",
          aquamarine: "7fffd4",
          azure: "f0ffff",
          beige: "f5f5dc",
          bisque: "ffe4c4",
          black: "000000",
          blanchedalmond: "ffebcd",
          blue: "0000ff",
          blueviolet: "8a2be2",
          brown: "a52a2a",
          burlywood: "deb887",
          cadetblue: "5f9ea0",
          chartreuse: "7fff00",
          chocolate: "d2691e",
          coral: "ff7f50",
          cornflowerblue: "6495ed",
          cornsilk: "fff8dc",
          crimson: "dc143c",
          cyan: "00ffff",
          darkblue: "00008b",
          darkcyan: "008b8b",
          darkgoldenrod: "b8860b",
          darkgray: "a9a9a9",
          darkgreen: "006400",
          darkkhaki: "bdb76b",
          darkmagenta: "8b008b",
          darkolivegreen: "556b2f",
          darkorange: "ff8c00",
          darkorchid: "9932cc",
          darkred: "8b0000",
          darksalmon: "e9967a",
          darkseagreen: "8fbc8f",
          darkslateblue: "483d8b",
          darkslategray: "2f4f4f",
          darkturquoise: "00ced1",
          darkviolet: "9400d3",
          deeppink: "ff1493",
          deepskyblue: "00bfff",
          dimgray: "696969",
          dodgerblue: "1e90ff",
          feldspar: "d19275",
          firebrick: "b22222",
          floralwhite: "fffaf0",
          forestgreen: "228b22",
          fuchsia: "ff00ff",
          gainsboro: "dcdcdc",
          ghostwhite: "f8f8ff",
          gold: "ffd700",
          goldenrod: "daa520",
          gray: "808080",
          green: "008000",
          greenyellow: "adff2f",
          honeydew: "f0fff0",
          hotpink: "ff69b4",
          indianred: "cd5c5c",
          indigo: "4b0082",
          ivory: "fffff0",
          khaki: "f0e68c",
          lavender: "e6e6fa",
          lavenderblush: "fff0f5",
          lawngreen: "7cfc00",
          lemonchiffon: "fffacd",
          lightblue: "add8e6",
          lightcoral: "f08080",
          lightcyan: "e0ffff",
          lightgoldenrodyellow: "fafad2",
          lightgrey: "d3d3d3",
          lightgreen: "90ee90",
          lightpink: "ffb6c1",
          lightsalmon: "ffa07a",
          lightseagreen: "20b2aa",
          lightskyblue: "87cefa",
          lightslateblue: "8470ff",
          lightslategray: "778899",
          lightsteelblue: "b0c4de",
          lightyellow: "ffffe0",
          lime: "00ff00",
          limegreen: "32cd32",
          linen: "faf0e6",
          magenta: "ff00ff",
          maroon: "800000",
          mediumaquamarine: "66cdaa",
          mediumblue: "0000cd",
          mediumorchid: "ba55d3",
          mediumpurple: "9370d8",
          mediumseagreen: "3cb371",
          mediumslateblue: "7b68ee",
          mediumspringgreen: "00fa9a",
          mediumturquoise: "48d1cc",
          mediumvioletred: "c71585",
          midnightblue: "191970",
          mintcream: "f5fffa",
          mistyrose: "ffe4e1",
          moccasin: "ffe4b5",
          navajowhite: "ffdead",
          navy: "000080",
          oldlace: "fdf5e6",
          olive: "808000",
          olivedrab: "6b8e23",
          orange: "ffa500",
          orangered: "ff4500",
          orchid: "da70d6",
          palegoldenrod: "eee8aa",
          palegreen: "98fb98",
          paleturquoise: "afeeee",
          palevioletred: "d87093",
          papayawhip: "ffefd5",
          peachpuff: "ffdab9",
          peru: "cd853f",
          pink: "ffc0cb",
          plum: "dda0dd",
          powderblue: "b0e0e6",
          purple: "800080",
          rebeccapurple: "663399",
          red: "ff0000",
          rosybrown: "bc8f8f",
          royalblue: "4169e1",
          saddlebrown: "8b4513",
          salmon: "fa8072",
          sandybrown: "f4a460",
          seagreen: "2e8b57",
          seashell: "fff5ee",
          sienna: "a0522d",
          silver: "c0c0c0",
          skyblue: "87ceeb",
          slateblue: "6a5acd",
          slategray: "708090",
          snow: "fffafa",
          springgreen: "00ff7f",
          steelblue: "4682b4",
          tan: "d2b48c",
          teal: "008080",
          thistle: "d8bfd8",
          tomato: "ff6347",
          turquoise: "40e0d0",
          violet: "ee82ee",
          violetred: "d02090",
          wheat: "f5deb3",
          white: "ffffff",
          whitesmoke: "f5f5f5",
          yellow: "ffff00",
          yellowgreen: "9acd32"
        };
        color_string = simple_colors[color_string] || color_string;
        var color_defs = [
          {
            re: /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*((?:\d?\.)?\d)\)$/,
            example: ["rgba(123, 234, 45, 0.8)", "rgba(255,234,245,1.0)"],
            process: function(bits2) {
              return [
                parseInt(bits2[1]),
                parseInt(bits2[2]),
                parseInt(bits2[3]),
                parseFloat(bits2[4])
              ];
            }
          },
          {
            re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
            example: ["rgb(123, 234, 45)", "rgb(255,234,245)"],
            process: function(bits2) {
              return [
                parseInt(bits2[1]),
                parseInt(bits2[2]),
                parseInt(bits2[3])
              ];
            }
          },
          {
            re: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
            example: ["#00ff00", "336699"],
            process: function(bits2) {
              return [
                parseInt(bits2[1], 16),
                parseInt(bits2[2], 16),
                parseInt(bits2[3], 16)
              ];
            }
          },
          {
            re: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
            example: ["#fb0", "f0f"],
            process: function(bits2) {
              return [
                parseInt(bits2[1] + bits2[1], 16),
                parseInt(bits2[2] + bits2[2], 16),
                parseInt(bits2[3] + bits2[3], 16)
              ];
            }
          }
        ];
        for (var i3 = 0; i3 < color_defs.length; i3++) {
          var re = color_defs[i3].re;
          var processor = color_defs[i3].process;
          var bits = re.exec(color_string);
          if (bits) {
            var channels = processor(bits);
            this.r = channels[0];
            this.g = channels[1];
            this.b = channels[2];
            if (channels.length > 3) {
              this.alpha = channels[3];
            }
            this.ok = true;
          }
        }
        this.r = this.r < 0 || isNaN(this.r) ? 0 : this.r > 255 ? 255 : this.r;
        this.g = this.g < 0 || isNaN(this.g) ? 0 : this.g > 255 ? 255 : this.g;
        this.b = this.b < 0 || isNaN(this.b) ? 0 : this.b > 255 ? 255 : this.b;
        this.alpha = this.alpha < 0 ? 0 : this.alpha > 1 || isNaN(this.alpha) ? 1 : this.alpha;
        this.toRGB = function() {
          return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
        };
        this.toRGBA = function() {
          return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.alpha + ")";
        };
        this.toHex = function() {
          var r3 = this.r.toString(16);
          var g2 = this.g.toString(16);
          var b2 = this.b.toString(16);
          if (r3.length == 1)
            r3 = "0" + r3;
          if (g2.length == 1)
            g2 = "0" + g2;
          if (b2.length == 1)
            b2 = "0" + b2;
          return "#" + r3 + g2 + b2;
        };
        this.getHelpXML = function() {
          var examples = new Array();
          for (var i4 = 0; i4 < color_defs.length; i4++) {
            var example = color_defs[i4].example;
            for (var j2 = 0; j2 < example.length; j2++) {
              examples[examples.length] = example[j2];
            }
          }
          for (var sc in simple_colors) {
            examples[examples.length] = sc;
          }
          var xml = document.createElement("ul");
          xml.setAttribute("id", "rgbcolor-examples");
          for (var i4 = 0; i4 < examples.length; i4++) {
            try {
              var list_item = document.createElement("li");
              var list_color = new RGBColor(examples[i4]);
              var example_div = document.createElement("div");
              example_div.style.cssText = "margin: 3px; border: 1px solid black; background:" + list_color.toHex() + "; color:" + list_color.toHex();
              example_div.appendChild(document.createTextNode("test"));
              var list_item_value = document.createTextNode(
                " " + examples[i4] + " -> " + list_color.toRGB() + " -> " + list_color.toHex()
              );
              list_item.appendChild(example_div);
              list_item.appendChild(list_item_value);
              xml.appendChild(list_item);
            } catch (e3) {
            }
          }
          return xml;
        };
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
  function s(n3, l3) {
    for (var u3 in l3)
      n3[u3] = l3[u3];
    return n3;
  }
  function a(n3) {
    var l3 = n3.parentNode;
    l3 && l3.removeChild(n3);
  }
  function h(l3, u3, i3) {
    var t3, o3, r3, f3 = {};
    for (r3 in u3)
      "key" == r3 ? t3 = u3[r3] : "ref" == r3 ? o3 = u3[r3] : f3[r3] = u3[r3];
    if (arguments.length > 2 && (f3.children = arguments.length > 3 ? n.call(arguments, 2) : i3), "function" == typeof l3 && null != l3.defaultProps)
      for (r3 in l3.defaultProps)
        void 0 === f3[r3] && (f3[r3] = l3.defaultProps[r3]);
    return v(l3, f3, t3, o3, null);
  }
  function v(n3, i3, t3, o3, r3) {
    var f3 = { type: n3, props: i3, key: t3, ref: o3, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, __h: null, constructor: void 0, __v: null == r3 ? ++u : r3 };
    return null == r3 && null != l.vnode && l.vnode(f3), f3;
  }
  function p(n3) {
    return n3.children;
  }
  function d(n3, l3) {
    this.props = n3, this.context = l3;
  }
  function _(n3, l3) {
    if (null == l3)
      return n3.__ ? _(n3.__, n3.__.__k.indexOf(n3) + 1) : null;
    for (var u3; l3 < n3.__k.length; l3++)
      if (null != (u3 = n3.__k[l3]) && null != u3.__e)
        return u3.__e;
    return "function" == typeof n3.type ? _(n3) : null;
  }
  function k(n3) {
    var l3, u3;
    if (null != (n3 = n3.__) && null != n3.__c) {
      for (n3.__e = n3.__c.base = null, l3 = 0; l3 < n3.__k.length; l3++)
        if (null != (u3 = n3.__k[l3]) && null != u3.__e) {
          n3.__e = n3.__c.base = u3.__e;
          break;
        }
      return k(n3);
    }
  }
  function b(n3) {
    (!n3.__d && (n3.__d = true) && t.push(n3) && !g.__r++ || o !== l.debounceRendering) && ((o = l.debounceRendering) || setTimeout)(g);
  }
  function g() {
    for (var n3; g.__r = t.length; )
      n3 = t.sort(function(n4, l3) {
        return n4.__v.__b - l3.__v.__b;
      }), t = [], n3.some(function(n4) {
        var l3, u3, i3, t3, o3, r3;
        n4.__d && (o3 = (t3 = (l3 = n4).__v).__e, (r3 = l3.__P) && (u3 = [], (i3 = s({}, t3)).__v = t3.__v + 1, j(r3, t3, i3, l3.__n, void 0 !== r3.ownerSVGElement, null != t3.__h ? [o3] : null, u3, null == o3 ? _(t3) : o3, t3.__h), z(u3, t3), t3.__e != o3 && k(t3)));
      });
  }
  function w(n3, l3, u3, i3, t3, o3, r3, c4, s3, a3) {
    var h3, y2, d2, k2, b2, g2, w2, x = i3 && i3.__k || e, C2 = x.length;
    for (u3.__k = [], h3 = 0; h3 < l3.length; h3++)
      if (null != (k2 = u3.__k[h3] = null == (k2 = l3[h3]) || "boolean" == typeof k2 ? null : "string" == typeof k2 || "number" == typeof k2 || "bigint" == typeof k2 ? v(null, k2, null, null, k2) : Array.isArray(k2) ? v(p, { children: k2 }, null, null, null) : k2.__b > 0 ? v(k2.type, k2.props, k2.key, k2.ref ? k2.ref : null, k2.__v) : k2)) {
        if (k2.__ = u3, k2.__b = u3.__b + 1, null === (d2 = x[h3]) || d2 && k2.key == d2.key && k2.type === d2.type)
          x[h3] = void 0;
        else
          for (y2 = 0; y2 < C2; y2++) {
            if ((d2 = x[y2]) && k2.key == d2.key && k2.type === d2.type) {
              x[y2] = void 0;
              break;
            }
            d2 = null;
          }
        j(n3, k2, d2 = d2 || f, t3, o3, r3, c4, s3, a3), b2 = k2.__e, (y2 = k2.ref) && d2.ref != y2 && (w2 || (w2 = []), d2.ref && w2.push(d2.ref, null, k2), w2.push(y2, k2.__c || b2, k2)), null != b2 ? (null == g2 && (g2 = b2), "function" == typeof k2.type && k2.__k === d2.__k ? k2.__d = s3 = m(k2, s3, n3) : s3 = A(n3, k2, d2, x, b2, s3), "function" == typeof u3.type && (u3.__d = s3)) : s3 && d2.__e == s3 && s3.parentNode != n3 && (s3 = _(d2));
      }
    for (u3.__e = g2, h3 = C2; h3--; )
      null != x[h3] && N(x[h3], x[h3]);
    if (w2)
      for (h3 = 0; h3 < w2.length; h3++)
        M(w2[h3], w2[++h3], w2[++h3]);
  }
  function m(n3, l3, u3) {
    for (var i3, t3 = n3.__k, o3 = 0; t3 && o3 < t3.length; o3++)
      (i3 = t3[o3]) && (i3.__ = n3, l3 = "function" == typeof i3.type ? m(i3, l3, u3) : A(u3, i3, i3, t3, i3.__e, l3));
    return l3;
  }
  function A(n3, l3, u3, i3, t3, o3) {
    var r3, f3, e3;
    if (void 0 !== l3.__d)
      r3 = l3.__d, l3.__d = void 0;
    else if (null == u3 || t3 != o3 || null == t3.parentNode)
      n:
        if (null == o3 || o3.parentNode !== n3)
          n3.appendChild(t3), r3 = null;
        else {
          for (f3 = o3, e3 = 0; (f3 = f3.nextSibling) && e3 < i3.length; e3 += 1)
            if (f3 == t3)
              break n;
          n3.insertBefore(t3, o3), r3 = o3;
        }
    return void 0 !== r3 ? r3 : t3.nextSibling;
  }
  function C(n3, l3, u3, i3, t3) {
    var o3;
    for (o3 in u3)
      "children" === o3 || "key" === o3 || o3 in l3 || H(n3, o3, null, u3[o3], i3);
    for (o3 in l3)
      t3 && "function" != typeof l3[o3] || "children" === o3 || "key" === o3 || "value" === o3 || "checked" === o3 || u3[o3] === l3[o3] || H(n3, o3, l3[o3], u3[o3], i3);
  }
  function $(n3, l3, u3) {
    "-" === l3[0] ? n3.setProperty(l3, u3) : n3[l3] = null == u3 ? "" : "number" != typeof u3 || c.test(l3) ? u3 : u3 + "px";
  }
  function H(n3, l3, u3, i3, t3) {
    var o3;
    n:
      if ("style" === l3)
        if ("string" == typeof u3)
          n3.style.cssText = u3;
        else {
          if ("string" == typeof i3 && (n3.style.cssText = i3 = ""), i3)
            for (l3 in i3)
              u3 && l3 in u3 || $(n3.style, l3, "");
          if (u3)
            for (l3 in u3)
              i3 && u3[l3] === i3[l3] || $(n3.style, l3, u3[l3]);
        }
      else if ("o" === l3[0] && "n" === l3[1])
        o3 = l3 !== (l3 = l3.replace(/Capture$/, "")), l3 = l3.toLowerCase() in n3 ? l3.toLowerCase().slice(2) : l3.slice(2), n3.l || (n3.l = {}), n3.l[l3 + o3] = u3, u3 ? i3 || n3.addEventListener(l3, o3 ? T : I, o3) : n3.removeEventListener(l3, o3 ? T : I, o3);
      else if ("dangerouslySetInnerHTML" !== l3) {
        if (t3)
          l3 = l3.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
        else if ("href" !== l3 && "list" !== l3 && "form" !== l3 && "tabIndex" !== l3 && "download" !== l3 && l3 in n3)
          try {
            n3[l3] = null == u3 ? "" : u3;
            break n;
          } catch (n4) {
          }
        "function" == typeof u3 || (null == u3 || false === u3 && -1 == l3.indexOf("-") ? n3.removeAttribute(l3) : n3.setAttribute(l3, u3));
      }
  }
  function I(n3) {
    this.l[n3.type + false](l.event ? l.event(n3) : n3);
  }
  function T(n3) {
    this.l[n3.type + true](l.event ? l.event(n3) : n3);
  }
  function j(n3, u3, i3, t3, o3, r3, f3, e3, c4) {
    var a3, h3, v3, y2, _3, k2, b2, g2, m4, x, A2, C2, $2, H2, I2, T3 = u3.type;
    if (void 0 !== u3.constructor)
      return null;
    null != i3.__h && (c4 = i3.__h, e3 = u3.__e = i3.__e, u3.__h = null, r3 = [e3]), (a3 = l.__b) && a3(u3);
    try {
      n:
        if ("function" == typeof T3) {
          if (g2 = u3.props, m4 = (a3 = T3.contextType) && t3[a3.__c], x = a3 ? m4 ? m4.props.value : a3.__ : t3, i3.__c ? b2 = (h3 = u3.__c = i3.__c).__ = h3.__E : ("prototype" in T3 && T3.prototype.render ? u3.__c = h3 = new T3(g2, x) : (u3.__c = h3 = new d(g2, x), h3.constructor = T3, h3.render = O), m4 && m4.sub(h3), h3.props = g2, h3.state || (h3.state = {}), h3.context = x, h3.__n = t3, v3 = h3.__d = true, h3.__h = [], h3._sb = []), null == h3.__s && (h3.__s = h3.state), null != T3.getDerivedStateFromProps && (h3.__s == h3.state && (h3.__s = s({}, h3.__s)), s(h3.__s, T3.getDerivedStateFromProps(g2, h3.__s))), y2 = h3.props, _3 = h3.state, v3)
            null == T3.getDerivedStateFromProps && null != h3.componentWillMount && h3.componentWillMount(), null != h3.componentDidMount && h3.__h.push(h3.componentDidMount);
          else {
            if (null == T3.getDerivedStateFromProps && g2 !== y2 && null != h3.componentWillReceiveProps && h3.componentWillReceiveProps(g2, x), !h3.__e && null != h3.shouldComponentUpdate && false === h3.shouldComponentUpdate(g2, h3.__s, x) || u3.__v === i3.__v) {
              for (h3.props = g2, h3.state = h3.__s, u3.__v !== i3.__v && (h3.__d = false), h3.__v = u3, u3.__e = i3.__e, u3.__k = i3.__k, u3.__k.forEach(function(n4) {
                n4 && (n4.__ = u3);
              }), A2 = 0; A2 < h3._sb.length; A2++)
                h3.__h.push(h3._sb[A2]);
              h3._sb = [], h3.__h.length && f3.push(h3);
              break n;
            }
            null != h3.componentWillUpdate && h3.componentWillUpdate(g2, h3.__s, x), null != h3.componentDidUpdate && h3.__h.push(function() {
              h3.componentDidUpdate(y2, _3, k2);
            });
          }
          if (h3.context = x, h3.props = g2, h3.__v = u3, h3.__P = n3, C2 = l.__r, $2 = 0, "prototype" in T3 && T3.prototype.render) {
            for (h3.state = h3.__s, h3.__d = false, C2 && C2(u3), a3 = h3.render(h3.props, h3.state, h3.context), H2 = 0; H2 < h3._sb.length; H2++)
              h3.__h.push(h3._sb[H2]);
            h3._sb = [];
          } else
            do {
              h3.__d = false, C2 && C2(u3), a3 = h3.render(h3.props, h3.state, h3.context), h3.state = h3.__s;
            } while (h3.__d && ++$2 < 25);
          h3.state = h3.__s, null != h3.getChildContext && (t3 = s(s({}, t3), h3.getChildContext())), v3 || null == h3.getSnapshotBeforeUpdate || (k2 = h3.getSnapshotBeforeUpdate(y2, _3)), I2 = null != a3 && a3.type === p && null == a3.key ? a3.props.children : a3, w(n3, Array.isArray(I2) ? I2 : [I2], u3, i3, t3, o3, r3, f3, e3, c4), h3.base = u3.__e, u3.__h = null, h3.__h.length && f3.push(h3), b2 && (h3.__E = h3.__ = null), h3.__e = false;
        } else
          null == r3 && u3.__v === i3.__v ? (u3.__k = i3.__k, u3.__e = i3.__e) : u3.__e = L(i3.__e, u3, i3, t3, o3, r3, f3, c4);
      (a3 = l.diffed) && a3(u3);
    } catch (n4) {
      u3.__v = null, (c4 || null != r3) && (u3.__e = e3, u3.__h = !!c4, r3[r3.indexOf(e3)] = null), l.__e(n4, u3, i3);
    }
  }
  function z(n3, u3) {
    l.__c && l.__c(u3, n3), n3.some(function(u4) {
      try {
        n3 = u4.__h, u4.__h = [], n3.some(function(n4) {
          n4.call(u4);
        });
      } catch (n4) {
        l.__e(n4, u4.__v);
      }
    });
  }
  function L(l3, u3, i3, t3, o3, r3, e3, c4) {
    var s3, h3, v3, y2 = i3.props, p3 = u3.props, d2 = u3.type, k2 = 0;
    if ("svg" === d2 && (o3 = true), null != r3) {
      for (; k2 < r3.length; k2++)
        if ((s3 = r3[k2]) && "setAttribute" in s3 == !!d2 && (d2 ? s3.localName === d2 : 3 === s3.nodeType)) {
          l3 = s3, r3[k2] = null;
          break;
        }
    }
    if (null == l3) {
      if (null === d2)
        return document.createTextNode(p3);
      l3 = o3 ? document.createElementNS("http://www.w3.org/2000/svg", d2) : document.createElement(d2, p3.is && p3), r3 = null, c4 = false;
    }
    if (null === d2)
      y2 === p3 || c4 && l3.data === p3 || (l3.data = p3);
    else {
      if (r3 = r3 && n.call(l3.childNodes), h3 = (y2 = i3.props || f).dangerouslySetInnerHTML, v3 = p3.dangerouslySetInnerHTML, !c4) {
        if (null != r3)
          for (y2 = {}, k2 = 0; k2 < l3.attributes.length; k2++)
            y2[l3.attributes[k2].name] = l3.attributes[k2].value;
        (v3 || h3) && (v3 && (h3 && v3.__html == h3.__html || v3.__html === l3.innerHTML) || (l3.innerHTML = v3 && v3.__html || ""));
      }
      if (C(l3, p3, y2, o3, c4), v3)
        u3.__k = [];
      else if (k2 = u3.props.children, w(l3, Array.isArray(k2) ? k2 : [k2], u3, i3, t3, o3 && "foreignObject" !== d2, r3, e3, r3 ? r3[0] : i3.__k && _(i3, 0), c4), null != r3)
        for (k2 = r3.length; k2--; )
          null != r3[k2] && a(r3[k2]);
      c4 || ("value" in p3 && void 0 !== (k2 = p3.value) && (k2 !== l3.value || "progress" === d2 && !k2 || "option" === d2 && k2 !== y2.value) && H(l3, "value", k2, y2.value, false), "checked" in p3 && void 0 !== (k2 = p3.checked) && k2 !== l3.checked && H(l3, "checked", k2, y2.checked, false));
    }
    return l3;
  }
  function M(n3, u3, i3) {
    try {
      "function" == typeof n3 ? n3(u3) : n3.current = u3;
    } catch (n4) {
      l.__e(n4, i3);
    }
  }
  function N(n3, u3, i3) {
    var t3, o3;
    if (l.unmount && l.unmount(n3), (t3 = n3.ref) && (t3.current && t3.current !== n3.__e || M(t3, null, u3)), null != (t3 = n3.__c)) {
      if (t3.componentWillUnmount)
        try {
          t3.componentWillUnmount();
        } catch (n4) {
          l.__e(n4, u3);
        }
      t3.base = t3.__P = null, n3.__c = void 0;
    }
    if (t3 = n3.__k)
      for (o3 = 0; o3 < t3.length; o3++)
        t3[o3] && N(t3[o3], u3, i3 || "function" != typeof n3.type);
    i3 || null == n3.__e || a(n3.__e), n3.__ = n3.__e = n3.__d = void 0;
  }
  function O(n3, l3, u3) {
    return this.constructor(n3, u3);
  }
  function P(u3, i3, t3) {
    var o3, r3, e3;
    l.__ && l.__(u3, i3), r3 = (o3 = "function" == typeof t3) ? null : t3 && t3.__k || i3.__k, e3 = [], j(i3, u3 = (!o3 && t3 || i3).__k = h(p, null, [u3]), r3 || f, f, void 0 !== i3.ownerSVGElement, !o3 && t3 ? [t3] : r3 ? null : i3.firstChild ? n.call(i3.childNodes) : null, e3, !o3 && t3 ? t3 : r3 ? r3.__e : i3.firstChild, o3), z(e3, u3);
  }
  n = e.slice, l = { __e: function(n3, l3, u3, i3) {
    for (var t3, o3, r3; l3 = l3.__; )
      if ((t3 = l3.__c) && !t3.__)
        try {
          if ((o3 = t3.constructor) && null != o3.getDerivedStateFromError && (t3.setState(o3.getDerivedStateFromError(n3)), r3 = t3.__d), null != t3.componentDidCatch && (t3.componentDidCatch(n3, i3 || {}), r3 = t3.__d), r3)
            return t3.__E = t3;
        } catch (l4) {
          n3 = l4;
        }
    throw n3;
  } }, u = 0, i = function(n3) {
    return null != n3 && void 0 === n3.constructor;
  }, d.prototype.setState = function(n3, l3) {
    var u3;
    u3 = null != this.__s && this.__s !== this.state ? this.__s : this.__s = s({}, this.state), "function" == typeof n3 && (n3 = n3(s({}, u3), this.props)), n3 && s(u3, n3), null != n3 && this.__v && (l3 && this._sb.push(l3), b(this));
  }, d.prototype.forceUpdate = function(n3) {
    this.__v && (this.__e = true, n3 && this.__h.push(n3), b(this));
  }, d.prototype.render = p, t = [], g.__r = 0, r = 0;

  // js/script.jsx
  var import_compareImages = __toESM(require_compareImages());

  // node_modules/canvg/dist/index.js
  var import_raf = __toESM(require_raf(), 1);
  var import_rgbcolor = __toESM(require_rgbcolor(), 1);

  // node_modules/svg-pathdata/lib/SVGPathData.module.js
  var t2 = function(r3, e3) {
    return (t2 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t3, r4) {
      t3.__proto__ = r4;
    } || function(t3, r4) {
      for (var e4 in r4)
        Object.prototype.hasOwnProperty.call(r4, e4) && (t3[e4] = r4[e4]);
    })(r3, e3);
  };
  function r2(r3, e3) {
    if ("function" != typeof e3 && null !== e3)
      throw new TypeError("Class extends value " + String(e3) + " is not a constructor or null");
    function i3() {
      this.constructor = r3;
    }
    t2(r3, e3), r3.prototype = null === e3 ? Object.create(e3) : (i3.prototype = e3.prototype, new i3());
  }
  function e2(t3) {
    var r3 = "";
    Array.isArray(t3) || (t3 = [t3]);
    for (var e3 = 0; e3 < t3.length; e3++) {
      var i3 = t3[e3];
      if (i3.type === _2.CLOSE_PATH)
        r3 += "z";
      else if (i3.type === _2.HORIZ_LINE_TO)
        r3 += (i3.relative ? "h" : "H") + i3.x;
      else if (i3.type === _2.VERT_LINE_TO)
        r3 += (i3.relative ? "v" : "V") + i3.y;
      else if (i3.type === _2.MOVE_TO)
        r3 += (i3.relative ? "m" : "M") + i3.x + " " + i3.y;
      else if (i3.type === _2.LINE_TO)
        r3 += (i3.relative ? "l" : "L") + i3.x + " " + i3.y;
      else if (i3.type === _2.CURVE_TO)
        r3 += (i3.relative ? "c" : "C") + i3.x1 + " " + i3.y1 + " " + i3.x2 + " " + i3.y2 + " " + i3.x + " " + i3.y;
      else if (i3.type === _2.SMOOTH_CURVE_TO)
        r3 += (i3.relative ? "s" : "S") + i3.x2 + " " + i3.y2 + " " + i3.x + " " + i3.y;
      else if (i3.type === _2.QUAD_TO)
        r3 += (i3.relative ? "q" : "Q") + i3.x1 + " " + i3.y1 + " " + i3.x + " " + i3.y;
      else if (i3.type === _2.SMOOTH_QUAD_TO)
        r3 += (i3.relative ? "t" : "T") + i3.x + " " + i3.y;
      else {
        if (i3.type !== _2.ARC)
          throw new Error('Unexpected command type "' + i3.type + '" at index ' + e3 + ".");
        r3 += (i3.relative ? "a" : "A") + i3.rX + " " + i3.rY + " " + i3.xRot + " " + +i3.lArcFlag + " " + +i3.sweepFlag + " " + i3.x + " " + i3.y;
      }
    }
    return r3;
  }
  function i2(t3, r3) {
    var e3 = t3[0], i3 = t3[1];
    return [e3 * Math.cos(r3) - i3 * Math.sin(r3), e3 * Math.sin(r3) + i3 * Math.cos(r3)];
  }
  function a2() {
    for (var t3 = [], r3 = 0; r3 < arguments.length; r3++)
      t3[r3] = arguments[r3];
    for (var e3 = 0; e3 < t3.length; e3++)
      if ("number" != typeof t3[e3])
        throw new Error("assertNumbers arguments[" + e3 + "] is not a number. " + typeof t3[e3] + " == typeof " + t3[e3]);
    return true;
  }
  var n2 = Math.PI;
  function o2(t3, r3, e3) {
    t3.lArcFlag = 0 === t3.lArcFlag ? 0 : 1, t3.sweepFlag = 0 === t3.sweepFlag ? 0 : 1;
    var a3 = t3.rX, o3 = t3.rY, s3 = t3.x, u3 = t3.y;
    a3 = Math.abs(t3.rX), o3 = Math.abs(t3.rY);
    var h3 = i2([(r3 - s3) / 2, (e3 - u3) / 2], -t3.xRot / 180 * n2), c4 = h3[0], y2 = h3[1], p3 = Math.pow(c4, 2) / Math.pow(a3, 2) + Math.pow(y2, 2) / Math.pow(o3, 2);
    1 < p3 && (a3 *= Math.sqrt(p3), o3 *= Math.sqrt(p3)), t3.rX = a3, t3.rY = o3;
    var m4 = Math.pow(a3, 2) * Math.pow(y2, 2) + Math.pow(o3, 2) * Math.pow(c4, 2), O3 = (t3.lArcFlag !== t3.sweepFlag ? 1 : -1) * Math.sqrt(Math.max(0, (Math.pow(a3, 2) * Math.pow(o3, 2) - m4) / m4)), l3 = a3 * y2 / o3 * O3, T3 = -o3 * c4 / a3 * O3, v3 = i2([l3, T3], t3.xRot / 180 * n2);
    t3.cX = v3[0] + (r3 + s3) / 2, t3.cY = v3[1] + (e3 + u3) / 2, t3.phi1 = Math.atan2((y2 - T3) / o3, (c4 - l3) / a3), t3.phi2 = Math.atan2((-y2 - T3) / o3, (-c4 - l3) / a3), 0 === t3.sweepFlag && t3.phi2 > t3.phi1 && (t3.phi2 -= 2 * n2), 1 === t3.sweepFlag && t3.phi2 < t3.phi1 && (t3.phi2 += 2 * n2), t3.phi1 *= 180 / n2, t3.phi2 *= 180 / n2;
  }
  function s2(t3, r3, e3) {
    a2(t3, r3, e3);
    var i3 = t3 * t3 + r3 * r3 - e3 * e3;
    if (0 > i3)
      return [];
    if (0 === i3)
      return [[t3 * e3 / (t3 * t3 + r3 * r3), r3 * e3 / (t3 * t3 + r3 * r3)]];
    var n3 = Math.sqrt(i3);
    return [[(t3 * e3 + r3 * n3) / (t3 * t3 + r3 * r3), (r3 * e3 - t3 * n3) / (t3 * t3 + r3 * r3)], [(t3 * e3 - r3 * n3) / (t3 * t3 + r3 * r3), (r3 * e3 + t3 * n3) / (t3 * t3 + r3 * r3)]];
  }
  var u2;
  var h2 = Math.PI / 180;
  function c2(t3, r3, e3) {
    return (1 - e3) * t3 + e3 * r3;
  }
  function y(t3, r3, e3, i3) {
    return t3 + Math.cos(i3 / 180 * n2) * r3 + Math.sin(i3 / 180 * n2) * e3;
  }
  function p2(t3, r3, e3, i3) {
    var a3 = 1e-6, n3 = r3 - t3, o3 = e3 - r3, s3 = 3 * n3 + 3 * (i3 - e3) - 6 * o3, u3 = 6 * (o3 - n3), h3 = 3 * n3;
    return Math.abs(s3) < a3 ? [-h3 / u3] : function(t4, r4, e4) {
      void 0 === e4 && (e4 = 1e-6);
      var i4 = t4 * t4 / 4 - r4;
      if (i4 < -e4)
        return [];
      if (i4 <= e4)
        return [-t4 / 2];
      var a4 = Math.sqrt(i4);
      return [-t4 / 2 - a4, -t4 / 2 + a4];
    }(u3 / s3, h3 / s3, a3);
  }
  function m2(t3, r3, e3, i3, a3) {
    var n3 = 1 - a3;
    return t3 * (n3 * n3 * n3) + r3 * (3 * n3 * n3 * a3) + e3 * (3 * n3 * a3 * a3) + i3 * (a3 * a3 * a3);
  }
  !function(t3) {
    function r3() {
      return u3(function(t4, r4, e4) {
        return t4.relative && (void 0 !== t4.x1 && (t4.x1 += r4), void 0 !== t4.y1 && (t4.y1 += e4), void 0 !== t4.x2 && (t4.x2 += r4), void 0 !== t4.y2 && (t4.y2 += e4), void 0 !== t4.x && (t4.x += r4), void 0 !== t4.y && (t4.y += e4), t4.relative = false), t4;
      });
    }
    function e3() {
      var t4 = NaN, r4 = NaN, e4 = NaN, i3 = NaN;
      return u3(function(a3, n4, o3) {
        return a3.type & _2.SMOOTH_CURVE_TO && (a3.type = _2.CURVE_TO, t4 = isNaN(t4) ? n4 : t4, r4 = isNaN(r4) ? o3 : r4, a3.x1 = a3.relative ? n4 - t4 : 2 * n4 - t4, a3.y1 = a3.relative ? o3 - r4 : 2 * o3 - r4), a3.type & _2.CURVE_TO ? (t4 = a3.relative ? n4 + a3.x2 : a3.x2, r4 = a3.relative ? o3 + a3.y2 : a3.y2) : (t4 = NaN, r4 = NaN), a3.type & _2.SMOOTH_QUAD_TO && (a3.type = _2.QUAD_TO, e4 = isNaN(e4) ? n4 : e4, i3 = isNaN(i3) ? o3 : i3, a3.x1 = a3.relative ? n4 - e4 : 2 * n4 - e4, a3.y1 = a3.relative ? o3 - i3 : 2 * o3 - i3), a3.type & _2.QUAD_TO ? (e4 = a3.relative ? n4 + a3.x1 : a3.x1, i3 = a3.relative ? o3 + a3.y1 : a3.y1) : (e4 = NaN, i3 = NaN), a3;
      });
    }
    function n3() {
      var t4 = NaN, r4 = NaN;
      return u3(function(e4, i3, a3) {
        if (e4.type & _2.SMOOTH_QUAD_TO && (e4.type = _2.QUAD_TO, t4 = isNaN(t4) ? i3 : t4, r4 = isNaN(r4) ? a3 : r4, e4.x1 = e4.relative ? i3 - t4 : 2 * i3 - t4, e4.y1 = e4.relative ? a3 - r4 : 2 * a3 - r4), e4.type & _2.QUAD_TO) {
          t4 = e4.relative ? i3 + e4.x1 : e4.x1, r4 = e4.relative ? a3 + e4.y1 : e4.y1;
          var n4 = e4.x1, o3 = e4.y1;
          e4.type = _2.CURVE_TO, e4.x1 = ((e4.relative ? 0 : i3) + 2 * n4) / 3, e4.y1 = ((e4.relative ? 0 : a3) + 2 * o3) / 3, e4.x2 = (e4.x + 2 * n4) / 3, e4.y2 = (e4.y + 2 * o3) / 3;
        } else
          t4 = NaN, r4 = NaN;
        return e4;
      });
    }
    function u3(t4) {
      var r4 = 0, e4 = 0, i3 = NaN, a3 = NaN;
      return function(n4) {
        if (isNaN(i3) && !(n4.type & _2.MOVE_TO))
          throw new Error("path must start with moveto");
        var o3 = t4(n4, r4, e4, i3, a3);
        return n4.type & _2.CLOSE_PATH && (r4 = i3, e4 = a3), void 0 !== n4.x && (r4 = n4.relative ? r4 + n4.x : n4.x), void 0 !== n4.y && (e4 = n4.relative ? e4 + n4.y : n4.y), n4.type & _2.MOVE_TO && (i3 = r4, a3 = e4), o3;
      };
    }
    function O3(t4, r4, e4, i3, n4, o3) {
      return a2(t4, r4, e4, i3, n4, o3), u3(function(a3, s3, u4, h3) {
        var c4 = a3.x1, y2 = a3.x2, p3 = a3.relative && !isNaN(h3), m4 = void 0 !== a3.x ? a3.x : p3 ? 0 : s3, O4 = void 0 !== a3.y ? a3.y : p3 ? 0 : u4;
        function l4(t5) {
          return t5 * t5;
        }
        a3.type & _2.HORIZ_LINE_TO && 0 !== r4 && (a3.type = _2.LINE_TO, a3.y = a3.relative ? 0 : u4), a3.type & _2.VERT_LINE_TO && 0 !== e4 && (a3.type = _2.LINE_TO, a3.x = a3.relative ? 0 : s3), void 0 !== a3.x && (a3.x = a3.x * t4 + O4 * e4 + (p3 ? 0 : n4)), void 0 !== a3.y && (a3.y = m4 * r4 + a3.y * i3 + (p3 ? 0 : o3)), void 0 !== a3.x1 && (a3.x1 = a3.x1 * t4 + a3.y1 * e4 + (p3 ? 0 : n4)), void 0 !== a3.y1 && (a3.y1 = c4 * r4 + a3.y1 * i3 + (p3 ? 0 : o3)), void 0 !== a3.x2 && (a3.x2 = a3.x2 * t4 + a3.y2 * e4 + (p3 ? 0 : n4)), void 0 !== a3.y2 && (a3.y2 = y2 * r4 + a3.y2 * i3 + (p3 ? 0 : o3));
        var T3 = t4 * i3 - r4 * e4;
        if (void 0 !== a3.xRot && (1 !== t4 || 0 !== r4 || 0 !== e4 || 1 !== i3))
          if (0 === T3)
            delete a3.rX, delete a3.rY, delete a3.xRot, delete a3.lArcFlag, delete a3.sweepFlag, a3.type = _2.LINE_TO;
          else {
            var v3 = a3.xRot * Math.PI / 180, f3 = Math.sin(v3), N3 = Math.cos(v3), x = 1 / l4(a3.rX), d2 = 1 / l4(a3.rY), E = l4(N3) * x + l4(f3) * d2, A2 = 2 * f3 * N3 * (x - d2), C2 = l4(f3) * x + l4(N3) * d2, M2 = E * i3 * i3 - A2 * r4 * i3 + C2 * r4 * r4, R = A2 * (t4 * i3 + r4 * e4) - 2 * (E * e4 * i3 + C2 * t4 * r4), g2 = E * e4 * e4 - A2 * t4 * e4 + C2 * t4 * t4, I2 = (Math.atan2(R, M2 - g2) + Math.PI) % Math.PI / 2, S = Math.sin(I2), L2 = Math.cos(I2);
            a3.rX = Math.abs(T3) / Math.sqrt(M2 * l4(L2) + R * S * L2 + g2 * l4(S)), a3.rY = Math.abs(T3) / Math.sqrt(M2 * l4(S) - R * S * L2 + g2 * l4(L2)), a3.xRot = 180 * I2 / Math.PI;
          }
        return void 0 !== a3.sweepFlag && 0 > T3 && (a3.sweepFlag = +!a3.sweepFlag), a3;
      });
    }
    function l3() {
      return function(t4) {
        var r4 = {};
        for (var e4 in t4)
          r4[e4] = t4[e4];
        return r4;
      };
    }
    t3.ROUND = function(t4) {
      function r4(r5) {
        return Math.round(r5 * t4) / t4;
      }
      return void 0 === t4 && (t4 = 1e13), a2(t4), function(t5) {
        return void 0 !== t5.x1 && (t5.x1 = r4(t5.x1)), void 0 !== t5.y1 && (t5.y1 = r4(t5.y1)), void 0 !== t5.x2 && (t5.x2 = r4(t5.x2)), void 0 !== t5.y2 && (t5.y2 = r4(t5.y2)), void 0 !== t5.x && (t5.x = r4(t5.x)), void 0 !== t5.y && (t5.y = r4(t5.y)), void 0 !== t5.rX && (t5.rX = r4(t5.rX)), void 0 !== t5.rY && (t5.rY = r4(t5.rY)), t5;
      };
    }, t3.TO_ABS = r3, t3.TO_REL = function() {
      return u3(function(t4, r4, e4) {
        return t4.relative || (void 0 !== t4.x1 && (t4.x1 -= r4), void 0 !== t4.y1 && (t4.y1 -= e4), void 0 !== t4.x2 && (t4.x2 -= r4), void 0 !== t4.y2 && (t4.y2 -= e4), void 0 !== t4.x && (t4.x -= r4), void 0 !== t4.y && (t4.y -= e4), t4.relative = true), t4;
      });
    }, t3.NORMALIZE_HVZ = function(t4, r4, e4) {
      return void 0 === t4 && (t4 = true), void 0 === r4 && (r4 = true), void 0 === e4 && (e4 = true), u3(function(i3, a3, n4, o3, s3) {
        if (isNaN(o3) && !(i3.type & _2.MOVE_TO))
          throw new Error("path must start with moveto");
        return r4 && i3.type & _2.HORIZ_LINE_TO && (i3.type = _2.LINE_TO, i3.y = i3.relative ? 0 : n4), e4 && i3.type & _2.VERT_LINE_TO && (i3.type = _2.LINE_TO, i3.x = i3.relative ? 0 : a3), t4 && i3.type & _2.CLOSE_PATH && (i3.type = _2.LINE_TO, i3.x = i3.relative ? o3 - a3 : o3, i3.y = i3.relative ? s3 - n4 : s3), i3.type & _2.ARC && (0 === i3.rX || 0 === i3.rY) && (i3.type = _2.LINE_TO, delete i3.rX, delete i3.rY, delete i3.xRot, delete i3.lArcFlag, delete i3.sweepFlag), i3;
      });
    }, t3.NORMALIZE_ST = e3, t3.QT_TO_C = n3, t3.INFO = u3, t3.SANITIZE = function(t4) {
      void 0 === t4 && (t4 = 0), a2(t4);
      var r4 = NaN, e4 = NaN, i3 = NaN, n4 = NaN;
      return u3(function(a3, o3, s3, u4, h3) {
        var c4 = Math.abs, y2 = false, p3 = 0, m4 = 0;
        if (a3.type & _2.SMOOTH_CURVE_TO && (p3 = isNaN(r4) ? 0 : o3 - r4, m4 = isNaN(e4) ? 0 : s3 - e4), a3.type & (_2.CURVE_TO | _2.SMOOTH_CURVE_TO) ? (r4 = a3.relative ? o3 + a3.x2 : a3.x2, e4 = a3.relative ? s3 + a3.y2 : a3.y2) : (r4 = NaN, e4 = NaN), a3.type & _2.SMOOTH_QUAD_TO ? (i3 = isNaN(i3) ? o3 : 2 * o3 - i3, n4 = isNaN(n4) ? s3 : 2 * s3 - n4) : a3.type & _2.QUAD_TO ? (i3 = a3.relative ? o3 + a3.x1 : a3.x1, n4 = a3.relative ? s3 + a3.y1 : a3.y2) : (i3 = NaN, n4 = NaN), a3.type & _2.LINE_COMMANDS || a3.type & _2.ARC && (0 === a3.rX || 0 === a3.rY || !a3.lArcFlag) || a3.type & _2.CURVE_TO || a3.type & _2.SMOOTH_CURVE_TO || a3.type & _2.QUAD_TO || a3.type & _2.SMOOTH_QUAD_TO) {
          var O4 = void 0 === a3.x ? 0 : a3.relative ? a3.x : a3.x - o3, l4 = void 0 === a3.y ? 0 : a3.relative ? a3.y : a3.y - s3;
          p3 = isNaN(i3) ? void 0 === a3.x1 ? p3 : a3.relative ? a3.x : a3.x1 - o3 : i3 - o3, m4 = isNaN(n4) ? void 0 === a3.y1 ? m4 : a3.relative ? a3.y : a3.y1 - s3 : n4 - s3;
          var T3 = void 0 === a3.x2 ? 0 : a3.relative ? a3.x : a3.x2 - o3, v3 = void 0 === a3.y2 ? 0 : a3.relative ? a3.y : a3.y2 - s3;
          c4(O4) <= t4 && c4(l4) <= t4 && c4(p3) <= t4 && c4(m4) <= t4 && c4(T3) <= t4 && c4(v3) <= t4 && (y2 = true);
        }
        return a3.type & _2.CLOSE_PATH && c4(o3 - u4) <= t4 && c4(s3 - h3) <= t4 && (y2 = true), y2 ? [] : a3;
      });
    }, t3.MATRIX = O3, t3.ROTATE = function(t4, r4, e4) {
      void 0 === r4 && (r4 = 0), void 0 === e4 && (e4 = 0), a2(t4, r4, e4);
      var i3 = Math.sin(t4), n4 = Math.cos(t4);
      return O3(n4, i3, -i3, n4, r4 - r4 * n4 + e4 * i3, e4 - r4 * i3 - e4 * n4);
    }, t3.TRANSLATE = function(t4, r4) {
      return void 0 === r4 && (r4 = 0), a2(t4, r4), O3(1, 0, 0, 1, t4, r4);
    }, t3.SCALE = function(t4, r4) {
      return void 0 === r4 && (r4 = t4), a2(t4, r4), O3(t4, 0, 0, r4, 0, 0);
    }, t3.SKEW_X = function(t4) {
      return a2(t4), O3(1, 0, Math.atan(t4), 1, 0, 0);
    }, t3.SKEW_Y = function(t4) {
      return a2(t4), O3(1, Math.atan(t4), 0, 1, 0, 0);
    }, t3.X_AXIS_SYMMETRY = function(t4) {
      return void 0 === t4 && (t4 = 0), a2(t4), O3(-1, 0, 0, 1, t4, 0);
    }, t3.Y_AXIS_SYMMETRY = function(t4) {
      return void 0 === t4 && (t4 = 0), a2(t4), O3(1, 0, 0, -1, 0, t4);
    }, t3.A_TO_C = function() {
      return u3(function(t4, r4, e4) {
        return _2.ARC === t4.type ? function(t5, r5, e5) {
          var a3, n4, s3, u4;
          t5.cX || o2(t5, r5, e5);
          for (var y2 = Math.min(t5.phi1, t5.phi2), p3 = Math.max(t5.phi1, t5.phi2) - y2, m4 = Math.ceil(p3 / 90), O4 = new Array(m4), l4 = r5, T3 = e5, v3 = 0; v3 < m4; v3++) {
            var f3 = c2(t5.phi1, t5.phi2, v3 / m4), N3 = c2(t5.phi1, t5.phi2, (v3 + 1) / m4), x = N3 - f3, d2 = 4 / 3 * Math.tan(x * h2 / 4), E = [Math.cos(f3 * h2) - d2 * Math.sin(f3 * h2), Math.sin(f3 * h2) + d2 * Math.cos(f3 * h2)], A2 = E[0], C2 = E[1], M2 = [Math.cos(N3 * h2), Math.sin(N3 * h2)], R = M2[0], g2 = M2[1], I2 = [R + d2 * Math.sin(N3 * h2), g2 - d2 * Math.cos(N3 * h2)], S = I2[0], L2 = I2[1];
            O4[v3] = { relative: t5.relative, type: _2.CURVE_TO };
            var H2 = function(r6, e6) {
              var a4 = i2([r6 * t5.rX, e6 * t5.rY], t5.xRot), n5 = a4[0], o3 = a4[1];
              return [t5.cX + n5, t5.cY + o3];
            };
            a3 = H2(A2, C2), O4[v3].x1 = a3[0], O4[v3].y1 = a3[1], n4 = H2(S, L2), O4[v3].x2 = n4[0], O4[v3].y2 = n4[1], s3 = H2(R, g2), O4[v3].x = s3[0], O4[v3].y = s3[1], t5.relative && (O4[v3].x1 -= l4, O4[v3].y1 -= T3, O4[v3].x2 -= l4, O4[v3].y2 -= T3, O4[v3].x -= l4, O4[v3].y -= T3), l4 = (u4 = [O4[v3].x, O4[v3].y])[0], T3 = u4[1];
          }
          return O4;
        }(t4, t4.relative ? 0 : r4, t4.relative ? 0 : e4) : t4;
      });
    }, t3.ANNOTATE_ARCS = function() {
      return u3(function(t4, r4, e4) {
        return t4.relative && (r4 = 0, e4 = 0), _2.ARC === t4.type && o2(t4, r4, e4), t4;
      });
    }, t3.CLONE = l3, t3.CALCULATE_BOUNDS = function() {
      var t4 = function(t5) {
        var r4 = {};
        for (var e4 in t5)
          r4[e4] = t5[e4];
        return r4;
      }, i3 = r3(), a3 = n3(), h3 = e3(), c4 = u3(function(r4, e4, n4) {
        var u4 = h3(a3(i3(t4(r4))));
        function O4(t5) {
          t5 > c4.maxX && (c4.maxX = t5), t5 < c4.minX && (c4.minX = t5);
        }
        function l4(t5) {
          t5 > c4.maxY && (c4.maxY = t5), t5 < c4.minY && (c4.minY = t5);
        }
        if (u4.type & _2.DRAWING_COMMANDS && (O4(e4), l4(n4)), u4.type & _2.HORIZ_LINE_TO && O4(u4.x), u4.type & _2.VERT_LINE_TO && l4(u4.y), u4.type & _2.LINE_TO && (O4(u4.x), l4(u4.y)), u4.type & _2.CURVE_TO) {
          O4(u4.x), l4(u4.y);
          for (var T3 = 0, v3 = p2(e4, u4.x1, u4.x2, u4.x); T3 < v3.length; T3++) {
            0 < (w2 = v3[T3]) && 1 > w2 && O4(m2(e4, u4.x1, u4.x2, u4.x, w2));
          }
          for (var f3 = 0, N3 = p2(n4, u4.y1, u4.y2, u4.y); f3 < N3.length; f3++) {
            0 < (w2 = N3[f3]) && 1 > w2 && l4(m2(n4, u4.y1, u4.y2, u4.y, w2));
          }
        }
        if (u4.type & _2.ARC) {
          O4(u4.x), l4(u4.y), o2(u4, e4, n4);
          for (var x = u4.xRot / 180 * Math.PI, d2 = Math.cos(x) * u4.rX, E = Math.sin(x) * u4.rX, A2 = -Math.sin(x) * u4.rY, C2 = Math.cos(x) * u4.rY, M2 = u4.phi1 < u4.phi2 ? [u4.phi1, u4.phi2] : -180 > u4.phi2 ? [u4.phi2 + 360, u4.phi1 + 360] : [u4.phi2, u4.phi1], R = M2[0], g2 = M2[1], I2 = function(t5) {
            var r5 = t5[0], e5 = t5[1], i4 = 180 * Math.atan2(e5, r5) / Math.PI;
            return i4 < R ? i4 + 360 : i4;
          }, S = 0, L2 = s2(A2, -d2, 0).map(I2); S < L2.length; S++) {
            (w2 = L2[S]) > R && w2 < g2 && O4(y(u4.cX, d2, A2, w2));
          }
          for (var H2 = 0, U = s2(C2, -E, 0).map(I2); H2 < U.length; H2++) {
            var w2;
            (w2 = U[H2]) > R && w2 < g2 && l4(y(u4.cY, E, C2, w2));
          }
        }
        return r4;
      });
      return c4.minX = 1 / 0, c4.maxX = -1 / 0, c4.minY = 1 / 0, c4.maxY = -1 / 0, c4;
    };
  }(u2 || (u2 = {}));
  var O2;
  var l2 = function() {
    function t3() {
    }
    return t3.prototype.round = function(t4) {
      return this.transform(u2.ROUND(t4));
    }, t3.prototype.toAbs = function() {
      return this.transform(u2.TO_ABS());
    }, t3.prototype.toRel = function() {
      return this.transform(u2.TO_REL());
    }, t3.prototype.normalizeHVZ = function(t4, r3, e3) {
      return this.transform(u2.NORMALIZE_HVZ(t4, r3, e3));
    }, t3.prototype.normalizeST = function() {
      return this.transform(u2.NORMALIZE_ST());
    }, t3.prototype.qtToC = function() {
      return this.transform(u2.QT_TO_C());
    }, t3.prototype.aToC = function() {
      return this.transform(u2.A_TO_C());
    }, t3.prototype.sanitize = function(t4) {
      return this.transform(u2.SANITIZE(t4));
    }, t3.prototype.translate = function(t4, r3) {
      return this.transform(u2.TRANSLATE(t4, r3));
    }, t3.prototype.scale = function(t4, r3) {
      return this.transform(u2.SCALE(t4, r3));
    }, t3.prototype.rotate = function(t4, r3, e3) {
      return this.transform(u2.ROTATE(t4, r3, e3));
    }, t3.prototype.matrix = function(t4, r3, e3, i3, a3, n3) {
      return this.transform(u2.MATRIX(t4, r3, e3, i3, a3, n3));
    }, t3.prototype.skewX = function(t4) {
      return this.transform(u2.SKEW_X(t4));
    }, t3.prototype.skewY = function(t4) {
      return this.transform(u2.SKEW_Y(t4));
    }, t3.prototype.xSymmetry = function(t4) {
      return this.transform(u2.X_AXIS_SYMMETRY(t4));
    }, t3.prototype.ySymmetry = function(t4) {
      return this.transform(u2.Y_AXIS_SYMMETRY(t4));
    }, t3.prototype.annotateArcs = function() {
      return this.transform(u2.ANNOTATE_ARCS());
    }, t3;
  }();
  var T2 = function(t3) {
    return " " === t3 || "	" === t3 || "\r" === t3 || "\n" === t3;
  };
  var v2 = function(t3) {
    return "0".charCodeAt(0) <= t3.charCodeAt(0) && t3.charCodeAt(0) <= "9".charCodeAt(0);
  };
  var f2 = function(t3) {
    function e3() {
      var r3 = t3.call(this) || this;
      return r3.curNumber = "", r3.curCommandType = -1, r3.curCommandRelative = false, r3.canParseCommandOrComma = true, r3.curNumberHasExp = false, r3.curNumberHasExpDigits = false, r3.curNumberHasDecimal = false, r3.curArgs = [], r3;
    }
    return r2(e3, t3), e3.prototype.finish = function(t4) {
      if (void 0 === t4 && (t4 = []), this.parse(" ", t4), 0 !== this.curArgs.length || !this.canParseCommandOrComma)
        throw new SyntaxError("Unterminated command at the path end.");
      return t4;
    }, e3.prototype.parse = function(t4, r3) {
      var e4 = this;
      void 0 === r3 && (r3 = []);
      for (var i3 = function(t5) {
        r3.push(t5), e4.curArgs.length = 0, e4.canParseCommandOrComma = true;
      }, a3 = 0; a3 < t4.length; a3++) {
        var n3 = t4[a3], o3 = !(this.curCommandType !== _2.ARC || 3 !== this.curArgs.length && 4 !== this.curArgs.length || 1 !== this.curNumber.length || "0" !== this.curNumber && "1" !== this.curNumber), s3 = v2(n3) && ("0" === this.curNumber && "0" === n3 || o3);
        if (!v2(n3) || s3)
          if ("e" !== n3 && "E" !== n3)
            if ("-" !== n3 && "+" !== n3 || !this.curNumberHasExp || this.curNumberHasExpDigits)
              if ("." !== n3 || this.curNumberHasExp || this.curNumberHasDecimal || o3) {
                if (this.curNumber && -1 !== this.curCommandType) {
                  var u3 = Number(this.curNumber);
                  if (isNaN(u3))
                    throw new SyntaxError("Invalid number ending at " + a3);
                  if (this.curCommandType === _2.ARC) {
                    if (0 === this.curArgs.length || 1 === this.curArgs.length) {
                      if (0 > u3)
                        throw new SyntaxError('Expected positive number, got "' + u3 + '" at index "' + a3 + '"');
                    } else if ((3 === this.curArgs.length || 4 === this.curArgs.length) && "0" !== this.curNumber && "1" !== this.curNumber)
                      throw new SyntaxError('Expected a flag, got "' + this.curNumber + '" at index "' + a3 + '"');
                  }
                  this.curArgs.push(u3), this.curArgs.length === N2[this.curCommandType] && (_2.HORIZ_LINE_TO === this.curCommandType ? i3({ type: _2.HORIZ_LINE_TO, relative: this.curCommandRelative, x: u3 }) : _2.VERT_LINE_TO === this.curCommandType ? i3({ type: _2.VERT_LINE_TO, relative: this.curCommandRelative, y: u3 }) : this.curCommandType === _2.MOVE_TO || this.curCommandType === _2.LINE_TO || this.curCommandType === _2.SMOOTH_QUAD_TO ? (i3({ type: this.curCommandType, relative: this.curCommandRelative, x: this.curArgs[0], y: this.curArgs[1] }), _2.MOVE_TO === this.curCommandType && (this.curCommandType = _2.LINE_TO)) : this.curCommandType === _2.CURVE_TO ? i3({ type: _2.CURVE_TO, relative: this.curCommandRelative, x1: this.curArgs[0], y1: this.curArgs[1], x2: this.curArgs[2], y2: this.curArgs[3], x: this.curArgs[4], y: this.curArgs[5] }) : this.curCommandType === _2.SMOOTH_CURVE_TO ? i3({ type: _2.SMOOTH_CURVE_TO, relative: this.curCommandRelative, x2: this.curArgs[0], y2: this.curArgs[1], x: this.curArgs[2], y: this.curArgs[3] }) : this.curCommandType === _2.QUAD_TO ? i3({ type: _2.QUAD_TO, relative: this.curCommandRelative, x1: this.curArgs[0], y1: this.curArgs[1], x: this.curArgs[2], y: this.curArgs[3] }) : this.curCommandType === _2.ARC && i3({ type: _2.ARC, relative: this.curCommandRelative, rX: this.curArgs[0], rY: this.curArgs[1], xRot: this.curArgs[2], lArcFlag: this.curArgs[3], sweepFlag: this.curArgs[4], x: this.curArgs[5], y: this.curArgs[6] })), this.curNumber = "", this.curNumberHasExpDigits = false, this.curNumberHasExp = false, this.curNumberHasDecimal = false, this.canParseCommandOrComma = true;
                }
                if (!T2(n3))
                  if ("," === n3 && this.canParseCommandOrComma)
                    this.canParseCommandOrComma = false;
                  else if ("+" !== n3 && "-" !== n3 && "." !== n3)
                    if (s3)
                      this.curNumber = n3, this.curNumberHasDecimal = false;
                    else {
                      if (0 !== this.curArgs.length)
                        throw new SyntaxError("Unterminated command at index " + a3 + ".");
                      if (!this.canParseCommandOrComma)
                        throw new SyntaxError('Unexpected character "' + n3 + '" at index ' + a3 + ". Command cannot follow comma");
                      if (this.canParseCommandOrComma = false, "z" !== n3 && "Z" !== n3)
                        if ("h" === n3 || "H" === n3)
                          this.curCommandType = _2.HORIZ_LINE_TO, this.curCommandRelative = "h" === n3;
                        else if ("v" === n3 || "V" === n3)
                          this.curCommandType = _2.VERT_LINE_TO, this.curCommandRelative = "v" === n3;
                        else if ("m" === n3 || "M" === n3)
                          this.curCommandType = _2.MOVE_TO, this.curCommandRelative = "m" === n3;
                        else if ("l" === n3 || "L" === n3)
                          this.curCommandType = _2.LINE_TO, this.curCommandRelative = "l" === n3;
                        else if ("c" === n3 || "C" === n3)
                          this.curCommandType = _2.CURVE_TO, this.curCommandRelative = "c" === n3;
                        else if ("s" === n3 || "S" === n3)
                          this.curCommandType = _2.SMOOTH_CURVE_TO, this.curCommandRelative = "s" === n3;
                        else if ("q" === n3 || "Q" === n3)
                          this.curCommandType = _2.QUAD_TO, this.curCommandRelative = "q" === n3;
                        else if ("t" === n3 || "T" === n3)
                          this.curCommandType = _2.SMOOTH_QUAD_TO, this.curCommandRelative = "t" === n3;
                        else {
                          if ("a" !== n3 && "A" !== n3)
                            throw new SyntaxError('Unexpected character "' + n3 + '" at index ' + a3 + ".");
                          this.curCommandType = _2.ARC, this.curCommandRelative = "a" === n3;
                        }
                      else
                        r3.push({ type: _2.CLOSE_PATH }), this.canParseCommandOrComma = true, this.curCommandType = -1;
                    }
                  else
                    this.curNumber = n3, this.curNumberHasDecimal = "." === n3;
              } else
                this.curNumber += n3, this.curNumberHasDecimal = true;
            else
              this.curNumber += n3;
          else
            this.curNumber += n3, this.curNumberHasExp = true;
        else
          this.curNumber += n3, this.curNumberHasExpDigits = this.curNumberHasExp;
      }
      return r3;
    }, e3.prototype.transform = function(t4) {
      return Object.create(this, { parse: { value: function(r3, e4) {
        void 0 === e4 && (e4 = []);
        for (var i3 = 0, a3 = Object.getPrototypeOf(this).parse.call(this, r3); i3 < a3.length; i3++) {
          var n3 = a3[i3], o3 = t4(n3);
          Array.isArray(o3) ? e4.push.apply(e4, o3) : e4.push(o3);
        }
        return e4;
      } } });
    }, e3;
  }(l2);
  var _2 = function(t3) {
    function i3(r3) {
      var e3 = t3.call(this) || this;
      return e3.commands = "string" == typeof r3 ? i3.parse(r3) : r3, e3;
    }
    return r2(i3, t3), i3.prototype.encode = function() {
      return i3.encode(this.commands);
    }, i3.prototype.getBounds = function() {
      var t4 = u2.CALCULATE_BOUNDS();
      return this.transform(t4), t4;
    }, i3.prototype.transform = function(t4) {
      for (var r3 = [], e3 = 0, i4 = this.commands; e3 < i4.length; e3++) {
        var a3 = t4(i4[e3]);
        Array.isArray(a3) ? r3.push.apply(r3, a3) : r3.push(a3);
      }
      return this.commands = r3, this;
    }, i3.encode = function(t4) {
      return e2(t4);
    }, i3.parse = function(t4) {
      var r3 = new f2(), e3 = [];
      return r3.parse(t4, e3), r3.finish(e3), e3;
    }, i3.CLOSE_PATH = 1, i3.MOVE_TO = 2, i3.HORIZ_LINE_TO = 4, i3.VERT_LINE_TO = 8, i3.LINE_TO = 16, i3.CURVE_TO = 32, i3.SMOOTH_CURVE_TO = 64, i3.QUAD_TO = 128, i3.SMOOTH_QUAD_TO = 256, i3.ARC = 512, i3.LINE_COMMANDS = i3.LINE_TO | i3.HORIZ_LINE_TO | i3.VERT_LINE_TO, i3.DRAWING_COMMANDS = i3.HORIZ_LINE_TO | i3.VERT_LINE_TO | i3.LINE_TO | i3.CURVE_TO | i3.SMOOTH_CURVE_TO | i3.QUAD_TO | i3.SMOOTH_QUAD_TO | i3.ARC, i3;
  }(l2);
  var N2 = ((O2 = {})[_2.MOVE_TO] = 2, O2[_2.LINE_TO] = 2, O2[_2.HORIZ_LINE_TO] = 1, O2[_2.VERT_LINE_TO] = 1, O2[_2.CLOSE_PATH] = 0, O2[_2.QUAD_TO] = 4, O2[_2.SMOOTH_QUAD_TO] = 2, O2[_2.CURVE_TO] = 6, O2[_2.SMOOTH_CURVE_TO] = 4, O2[_2.ARC] = 7, O2);

  // node_modules/stackblur-canvas/dist/stackblur-es.js
  function _typeof(obj) {
    "@babel/helpers - typeof";
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function(obj2) {
        return typeof obj2;
      };
    } else {
      _typeof = function(obj2) {
        return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
      };
    }
    return _typeof(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  var mulTable = [512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328, 320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335, 329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456, 451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335, 332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292, 289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259];
  var shgTable = [9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24];
  function getImageDataFromCanvas(canvas, topX, topY, width, height) {
    if (typeof canvas === "string") {
      canvas = document.getElementById(canvas);
    }
    if (!canvas || _typeof(canvas) !== "object" || !("getContext" in canvas)) {
      throw new TypeError("Expecting canvas with `getContext` method in processCanvasRGB(A) calls!");
    }
    var context = canvas.getContext("2d");
    try {
      return context.getImageData(topX, topY, width, height);
    } catch (e3) {
      throw new Error("unable to access image data: " + e3);
    }
  }
  function processCanvasRGBA(canvas, topX, topY, width, height, radius) {
    if (isNaN(radius) || radius < 1) {
      return;
    }
    radius |= 0;
    var imageData = getImageDataFromCanvas(canvas, topX, topY, width, height);
    imageData = processImageDataRGBA(imageData, topX, topY, width, height, radius);
    canvas.getContext("2d").putImageData(imageData, topX, topY);
  }
  function processImageDataRGBA(imageData, topX, topY, width, height, radius) {
    var pixels = imageData.data;
    var div = 2 * radius + 1;
    var widthMinus1 = width - 1;
    var heightMinus1 = height - 1;
    var radiusPlus1 = radius + 1;
    var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;
    var stackStart = new BlurStack();
    var stack = stackStart;
    var stackEnd;
    for (var i3 = 1; i3 < div; i3++) {
      stack = stack.next = new BlurStack();
      if (i3 === radiusPlus1) {
        stackEnd = stack;
      }
    }
    stack.next = stackStart;
    var stackIn = null, stackOut = null, yw = 0, yi = 0;
    var mulSum = mulTable[radius];
    var shgSum = shgTable[radius];
    for (var y2 = 0; y2 < height; y2++) {
      stack = stackStart;
      var pr = pixels[yi], pg = pixels[yi + 1], pb = pixels[yi + 2], pa = pixels[yi + 3];
      for (var _i = 0; _i < radiusPlus1; _i++) {
        stack.r = pr;
        stack.g = pg;
        stack.b = pb;
        stack.a = pa;
        stack = stack.next;
      }
      var rInSum = 0, gInSum = 0, bInSum = 0, aInSum = 0, rOutSum = radiusPlus1 * pr, gOutSum = radiusPlus1 * pg, bOutSum = radiusPlus1 * pb, aOutSum = radiusPlus1 * pa, rSum = sumFactor * pr, gSum = sumFactor * pg, bSum = sumFactor * pb, aSum = sumFactor * pa;
      for (var _i2 = 1; _i2 < radiusPlus1; _i2++) {
        var p3 = yi + ((widthMinus1 < _i2 ? widthMinus1 : _i2) << 2);
        var r3 = pixels[p3], g2 = pixels[p3 + 1], b2 = pixels[p3 + 2], a3 = pixels[p3 + 3];
        var rbs = radiusPlus1 - _i2;
        rSum += (stack.r = r3) * rbs;
        gSum += (stack.g = g2) * rbs;
        bSum += (stack.b = b2) * rbs;
        aSum += (stack.a = a3) * rbs;
        rInSum += r3;
        gInSum += g2;
        bInSum += b2;
        aInSum += a3;
        stack = stack.next;
      }
      stackIn = stackStart;
      stackOut = stackEnd;
      for (var x = 0; x < width; x++) {
        var paInitial = aSum * mulSum >> shgSum;
        pixels[yi + 3] = paInitial;
        if (paInitial !== 0) {
          var _a2 = 255 / paInitial;
          pixels[yi] = (rSum * mulSum >> shgSum) * _a2;
          pixels[yi + 1] = (gSum * mulSum >> shgSum) * _a2;
          pixels[yi + 2] = (bSum * mulSum >> shgSum) * _a2;
        } else {
          pixels[yi] = pixels[yi + 1] = pixels[yi + 2] = 0;
        }
        rSum -= rOutSum;
        gSum -= gOutSum;
        bSum -= bOutSum;
        aSum -= aOutSum;
        rOutSum -= stackIn.r;
        gOutSum -= stackIn.g;
        bOutSum -= stackIn.b;
        aOutSum -= stackIn.a;
        var _p = x + radius + 1;
        _p = yw + (_p < widthMinus1 ? _p : widthMinus1) << 2;
        rInSum += stackIn.r = pixels[_p];
        gInSum += stackIn.g = pixels[_p + 1];
        bInSum += stackIn.b = pixels[_p + 2];
        aInSum += stackIn.a = pixels[_p + 3];
        rSum += rInSum;
        gSum += gInSum;
        bSum += bInSum;
        aSum += aInSum;
        stackIn = stackIn.next;
        var _stackOut = stackOut, _r = _stackOut.r, _g = _stackOut.g, _b = _stackOut.b, _a = _stackOut.a;
        rOutSum += _r;
        gOutSum += _g;
        bOutSum += _b;
        aOutSum += _a;
        rInSum -= _r;
        gInSum -= _g;
        bInSum -= _b;
        aInSum -= _a;
        stackOut = stackOut.next;
        yi += 4;
      }
      yw += width;
    }
    for (var _x = 0; _x < width; _x++) {
      yi = _x << 2;
      var _pr = pixels[yi], _pg = pixels[yi + 1], _pb = pixels[yi + 2], _pa = pixels[yi + 3], _rOutSum = radiusPlus1 * _pr, _gOutSum = radiusPlus1 * _pg, _bOutSum = radiusPlus1 * _pb, _aOutSum = radiusPlus1 * _pa, _rSum = sumFactor * _pr, _gSum = sumFactor * _pg, _bSum = sumFactor * _pb, _aSum = sumFactor * _pa;
      stack = stackStart;
      for (var _i3 = 0; _i3 < radiusPlus1; _i3++) {
        stack.r = _pr;
        stack.g = _pg;
        stack.b = _pb;
        stack.a = _pa;
        stack = stack.next;
      }
      var yp = width;
      var _gInSum = 0, _bInSum = 0, _aInSum = 0, _rInSum = 0;
      for (var _i4 = 1; _i4 <= radius; _i4++) {
        yi = yp + _x << 2;
        var _rbs = radiusPlus1 - _i4;
        _rSum += (stack.r = _pr = pixels[yi]) * _rbs;
        _gSum += (stack.g = _pg = pixels[yi + 1]) * _rbs;
        _bSum += (stack.b = _pb = pixels[yi + 2]) * _rbs;
        _aSum += (stack.a = _pa = pixels[yi + 3]) * _rbs;
        _rInSum += _pr;
        _gInSum += _pg;
        _bInSum += _pb;
        _aInSum += _pa;
        stack = stack.next;
        if (_i4 < heightMinus1) {
          yp += width;
        }
      }
      yi = _x;
      stackIn = stackStart;
      stackOut = stackEnd;
      for (var _y = 0; _y < height; _y++) {
        var _p2 = yi << 2;
        pixels[_p2 + 3] = _pa = _aSum * mulSum >> shgSum;
        if (_pa > 0) {
          _pa = 255 / _pa;
          pixels[_p2] = (_rSum * mulSum >> shgSum) * _pa;
          pixels[_p2 + 1] = (_gSum * mulSum >> shgSum) * _pa;
          pixels[_p2 + 2] = (_bSum * mulSum >> shgSum) * _pa;
        } else {
          pixels[_p2] = pixels[_p2 + 1] = pixels[_p2 + 2] = 0;
        }
        _rSum -= _rOutSum;
        _gSum -= _gOutSum;
        _bSum -= _bOutSum;
        _aSum -= _aOutSum;
        _rOutSum -= stackIn.r;
        _gOutSum -= stackIn.g;
        _bOutSum -= stackIn.b;
        _aOutSum -= stackIn.a;
        _p2 = _x + ((_p2 = _y + radiusPlus1) < heightMinus1 ? _p2 : heightMinus1) * width << 2;
        _rSum += _rInSum += stackIn.r = pixels[_p2];
        _gSum += _gInSum += stackIn.g = pixels[_p2 + 1];
        _bSum += _bInSum += stackIn.b = pixels[_p2 + 2];
        _aSum += _aInSum += stackIn.a = pixels[_p2 + 3];
        stackIn = stackIn.next;
        _rOutSum += _pr = stackOut.r;
        _gOutSum += _pg = stackOut.g;
        _bOutSum += _pb = stackOut.b;
        _aOutSum += _pa = stackOut.a;
        _rInSum -= _pr;
        _gInSum -= _pg;
        _bInSum -= _pb;
        _aInSum -= _pa;
        stackOut = stackOut.next;
        yi += width;
      }
    }
    return imageData;
  }
  var BlurStack = function BlurStack2() {
    _classCallCheck(this, BlurStack2);
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;
    this.next = null;
  };

  // node_modules/canvg/dist/index.js
  function compressSpaces(str) {
    return str.replace(/(?!\u3000)\s+/gm, " ");
  }
  function trimLeft(str) {
    return str.replace(/^[\n \t]+/, "");
  }
  function trimRight(str) {
    return str.replace(/[\n \t]+$/, "");
  }
  function toNumbers(str) {
    const matches = str.match(/-?(\d+(?:\.\d*(?:[eE][+-]?\d+)?)?|\.\d+)(?=\D|$)/gm);
    return matches ? matches.map(parseFloat) : [];
  }
  function toMatrixValue(str) {
    const numbers = toNumbers(str);
    const matrix = [
      numbers[0] || 0,
      numbers[1] || 0,
      numbers[2] || 0,
      numbers[3] || 0,
      numbers[4] || 0,
      numbers[5] || 0
    ];
    return matrix;
  }
  var allUppercase = /^[A-Z-]+$/;
  function normalizeAttributeName(name) {
    if (allUppercase.test(name)) {
      return name.toLowerCase();
    }
    return name;
  }
  function parseExternalUrl(url) {
    const urlMatch = /url\(('([^']+)'|"([^"]+)"|([^'")]+))\)/.exec(url);
    if (!urlMatch) {
      return "";
    }
    return urlMatch[2] || urlMatch[3] || urlMatch[4] || "";
  }
  function normalizeColor(color) {
    if (!color.startsWith("rgb")) {
      return color;
    }
    let rgbParts = 3;
    const normalizedColor = color.replace(
      /\d+(\.\d+)?/g,
      (num, isFloat) => rgbParts-- && isFloat ? String(Math.round(parseFloat(num))) : num
    );
    return normalizedColor;
  }
  var attributeRegex = /(\[[^\]]+\])/g;
  var idRegex = /(#[^\s+>~.[:]+)/g;
  var classRegex = /(\.[^\s+>~.[:]+)/g;
  var pseudoElementRegex = /(::[^\s+>~.[:]+|:first-line|:first-letter|:before|:after)/gi;
  var pseudoClassWithBracketsRegex = /(:[\w-]+\([^)]*\))/gi;
  var pseudoClassRegex = /(:[^\s+>~.[:]+)/g;
  var elementRegex = /([^\s+>~.[:]+)/g;
  function findSelectorMatch(selector, regex) {
    const matches = regex.exec(selector);
    if (!matches) {
      return [
        selector,
        0
      ];
    }
    return [
      selector.replace(regex, " "),
      matches.length
    ];
  }
  function getSelectorSpecificity(selector) {
    const specificity = [
      0,
      0,
      0
    ];
    let currentSelector = selector.replace(/:not\(([^)]*)\)/g, "     $1 ").replace(/{[\s\S]*/gm, " ");
    let delta = 0;
    [currentSelector, delta] = findSelectorMatch(currentSelector, attributeRegex);
    specificity[1] += delta;
    [currentSelector, delta] = findSelectorMatch(currentSelector, idRegex);
    specificity[0] += delta;
    [currentSelector, delta] = findSelectorMatch(currentSelector, classRegex);
    specificity[1] += delta;
    [currentSelector, delta] = findSelectorMatch(currentSelector, pseudoElementRegex);
    specificity[2] += delta;
    [currentSelector, delta] = findSelectorMatch(currentSelector, pseudoClassWithBracketsRegex);
    specificity[1] += delta;
    [currentSelector, delta] = findSelectorMatch(currentSelector, pseudoClassRegex);
    specificity[1] += delta;
    currentSelector = currentSelector.replace(/[*\s+>~]/g, " ").replace(/[#.]/g, " ");
    [currentSelector, delta] = findSelectorMatch(currentSelector, elementRegex);
    specificity[2] += delta;
    return specificity.join("");
  }
  var PSEUDO_ZERO = 1e-8;
  function vectorMagnitude(v3) {
    return Math.sqrt(Math.pow(v3[0], 2) + Math.pow(v3[1], 2));
  }
  function vectorsRatio(u3, v3) {
    return (u3[0] * v3[0] + u3[1] * v3[1]) / (vectorMagnitude(u3) * vectorMagnitude(v3));
  }
  function vectorsAngle(u3, v3) {
    return (u3[0] * v3[1] < u3[1] * v3[0] ? -1 : 1) * Math.acos(vectorsRatio(u3, v3));
  }
  function CB1(t3) {
    return t3 * t3 * t3;
  }
  function CB2(t3) {
    return 3 * t3 * t3 * (1 - t3);
  }
  function CB3(t3) {
    return 3 * t3 * (1 - t3) * (1 - t3);
  }
  function CB4(t3) {
    return (1 - t3) * (1 - t3) * (1 - t3);
  }
  function QB1(t3) {
    return t3 * t3;
  }
  function QB2(t3) {
    return 2 * t3 * (1 - t3);
  }
  function QB3(t3) {
    return (1 - t3) * (1 - t3);
  }
  var Property = class {
    static empty(document2) {
      return new Property(document2, "EMPTY", "");
    }
    split() {
      let separator = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : " ";
      const { document: document2, name } = this;
      return compressSpaces(this.getString()).trim().split(separator).map(
        (value) => new Property(document2, name, value)
      );
    }
    hasValue(zeroIsValue) {
      const value = this.value;
      return value !== null && value !== "" && (zeroIsValue || value !== 0) && typeof value !== "undefined";
    }
    isString(regexp) {
      const { value } = this;
      const result = typeof value === "string";
      if (!result || !regexp) {
        return result;
      }
      return regexp.test(value);
    }
    isUrlDefinition() {
      return this.isString(/^url\(/);
    }
    isPixels() {
      if (!this.hasValue()) {
        return false;
      }
      const asString = this.getString();
      switch (true) {
        case asString.endsWith("px"):
        case /^[0-9]+$/.test(asString):
          return true;
        default:
          return false;
      }
    }
    setValue(value) {
      this.value = value;
      return this;
    }
    getValue(def) {
      if (typeof def === "undefined" || this.hasValue()) {
        return this.value;
      }
      return def;
    }
    getNumber(def) {
      if (!this.hasValue()) {
        if (typeof def === "undefined") {
          return 0;
        }
        return parseFloat(def);
      }
      const { value } = this;
      let n3 = parseFloat(value);
      if (this.isString(/%$/)) {
        n3 /= 100;
      }
      return n3;
    }
    getString(def) {
      if (typeof def === "undefined" || this.hasValue()) {
        return typeof this.value === "undefined" ? "" : String(this.value);
      }
      return String(def);
    }
    getColor(def) {
      let color = this.getString(def);
      if (this.isNormalizedColor) {
        return color;
      }
      this.isNormalizedColor = true;
      color = normalizeColor(color);
      this.value = color;
      return color;
    }
    getDpi() {
      return 96;
    }
    getRem() {
      return this.document.rootEmSize;
    }
    getEm() {
      return this.document.emSize;
    }
    getUnits() {
      return this.getString().replace(/[0-9.-]/g, "");
    }
    getPixels(axisOrIsFontSize) {
      let processPercent = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      if (!this.hasValue()) {
        return 0;
      }
      const [axis, isFontSize] = typeof axisOrIsFontSize === "boolean" ? [
        void 0,
        axisOrIsFontSize
      ] : [
        axisOrIsFontSize
      ];
      const { viewPort } = this.document.screen;
      switch (true) {
        case this.isString(/vmin$/):
          return this.getNumber() / 100 * Math.min(viewPort.computeSize("x"), viewPort.computeSize("y"));
        case this.isString(/vmax$/):
          return this.getNumber() / 100 * Math.max(viewPort.computeSize("x"), viewPort.computeSize("y"));
        case this.isString(/vw$/):
          return this.getNumber() / 100 * viewPort.computeSize("x");
        case this.isString(/vh$/):
          return this.getNumber() / 100 * viewPort.computeSize("y");
        case this.isString(/rem$/):
          return this.getNumber() * this.getRem();
        case this.isString(/em$/):
          return this.getNumber() * this.getEm();
        case this.isString(/ex$/):
          return this.getNumber() * this.getEm() / 2;
        case this.isString(/px$/):
          return this.getNumber();
        case this.isString(/pt$/):
          return this.getNumber() * this.getDpi() * (1 / 72);
        case this.isString(/pc$/):
          return this.getNumber() * 15;
        case this.isString(/cm$/):
          return this.getNumber() * this.getDpi() / 2.54;
        case this.isString(/mm$/):
          return this.getNumber() * this.getDpi() / 25.4;
        case this.isString(/in$/):
          return this.getNumber() * this.getDpi();
        case (this.isString(/%$/) && isFontSize):
          return this.getNumber() * this.getEm();
        case this.isString(/%$/):
          return this.getNumber() * viewPort.computeSize(axis);
        default: {
          const n3 = this.getNumber();
          if (processPercent && n3 < 1) {
            return n3 * viewPort.computeSize(axis);
          }
          return n3;
        }
      }
    }
    getMilliseconds() {
      if (!this.hasValue()) {
        return 0;
      }
      if (this.isString(/ms$/)) {
        return this.getNumber();
      }
      return this.getNumber() * 1e3;
    }
    getRadians() {
      if (!this.hasValue()) {
        return 0;
      }
      switch (true) {
        case this.isString(/deg$/):
          return this.getNumber() * (Math.PI / 180);
        case this.isString(/grad$/):
          return this.getNumber() * (Math.PI / 200);
        case this.isString(/rad$/):
          return this.getNumber();
        default:
          return this.getNumber() * (Math.PI / 180);
      }
    }
    getDefinition() {
      const asString = this.getString();
      const match = /#([^)'"]+)/.exec(asString);
      const name = (match === null || match === void 0 ? void 0 : match[1]) || asString;
      return this.document.definitions[name];
    }
    getFillStyleDefinition(element, opacity) {
      let def = this.getDefinition();
      if (!def) {
        return null;
      }
      if (typeof def.createGradient === "function" && "getBoundingBox" in element) {
        return def.createGradient(this.document.ctx, element, opacity);
      }
      if (typeof def.createPattern === "function") {
        if (def.getHrefAttribute().hasValue()) {
          const patternTransform = def.getAttribute("patternTransform");
          def = def.getHrefAttribute().getDefinition();
          if (def && patternTransform.hasValue()) {
            def.getAttribute("patternTransform", true).setValue(patternTransform.value);
          }
        }
        if (def) {
          return def.createPattern(this.document.ctx, element, opacity);
        }
      }
      return null;
    }
    getTextBaseline() {
      if (!this.hasValue()) {
        return null;
      }
      const key = this.getString();
      return Property.textBaselineMapping[key] || null;
    }
    addOpacity(opacity) {
      let value = this.getColor();
      const len = value.length;
      let commas = 0;
      for (let i3 = 0; i3 < len; i3++) {
        if (value[i3] === ",") {
          commas++;
        }
        if (commas === 3) {
          break;
        }
      }
      if (opacity.hasValue() && this.isString() && commas !== 3) {
        const color = new import_rgbcolor.default(value);
        if (color.ok) {
          color.alpha = opacity.getNumber();
          value = color.toRGBA();
        }
      }
      return new Property(this.document, this.name, value);
    }
    constructor(document2, name, value) {
      this.document = document2;
      this.name = name;
      this.value = value;
      this.isNormalizedColor = false;
    }
  };
  Property.textBaselineMapping = {
    "baseline": "alphabetic",
    "before-edge": "top",
    "text-before-edge": "top",
    "middle": "middle",
    "central": "middle",
    "after-edge": "bottom",
    "text-after-edge": "bottom",
    "ideographic": "ideographic",
    "alphabetic": "alphabetic",
    "hanging": "hanging",
    "mathematical": "alphabetic"
  };
  var ViewPort = class {
    clear() {
      this.viewPorts = [];
    }
    setCurrent(width, height) {
      this.viewPorts.push({
        width,
        height
      });
    }
    removeCurrent() {
      this.viewPorts.pop();
    }
    getRoot() {
      const [root] = this.viewPorts;
      if (!root) {
        return getDefault();
      }
      return root;
    }
    getCurrent() {
      const { viewPorts } = this;
      const current = viewPorts[viewPorts.length - 1];
      if (!current) {
        return getDefault();
      }
      return current;
    }
    get width() {
      return this.getCurrent().width;
    }
    get height() {
      return this.getCurrent().height;
    }
    computeSize(d2) {
      if (typeof d2 === "number") {
        return d2;
      }
      if (d2 === "x") {
        return this.width;
      }
      if (d2 === "y") {
        return this.height;
      }
      return Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2)) / Math.sqrt(2);
    }
    constructor() {
      this.viewPorts = [];
    }
  };
  ViewPort.DEFAULT_VIEWPORT_WIDTH = 800;
  ViewPort.DEFAULT_VIEWPORT_HEIGHT = 600;
  function getDefault() {
    return {
      width: ViewPort.DEFAULT_VIEWPORT_WIDTH,
      height: ViewPort.DEFAULT_VIEWPORT_HEIGHT
    };
  }
  var Point = class {
    static parse(point) {
      let defaultValue = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
      const [x = defaultValue, y2 = defaultValue] = toNumbers(point);
      return new Point(x, y2);
    }
    static parseScale(scale) {
      let defaultValue = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
      const [x = defaultValue, y2 = x] = toNumbers(scale);
      return new Point(x, y2);
    }
    static parsePath(path) {
      const points = toNumbers(path);
      const len = points.length;
      const pathPoints = [];
      for (let i3 = 0; i3 < len; i3 += 2) {
        pathPoints.push(new Point(points[i3], points[i3 + 1]));
      }
      return pathPoints;
    }
    angleTo(point) {
      return Math.atan2(point.y - this.y, point.x - this.x);
    }
    applyTransform(transform) {
      const { x, y: y2 } = this;
      const xp = x * transform[0] + y2 * transform[2] + transform[4];
      const yp = x * transform[1] + y2 * transform[3] + transform[5];
      this.x = xp;
      this.y = yp;
    }
    constructor(x, y2) {
      this.x = x;
      this.y = y2;
    }
  };
  var Mouse = class {
    isWorking() {
      return this.working;
    }
    start() {
      if (this.working) {
        return;
      }
      const { screen, onClick, onMouseMove } = this;
      const canvas = screen.ctx.canvas;
      canvas.onclick = onClick;
      canvas.onmousemove = onMouseMove;
      this.working = true;
    }
    stop() {
      if (!this.working) {
        return;
      }
      const canvas = this.screen.ctx.canvas;
      this.working = false;
      canvas.onclick = null;
      canvas.onmousemove = null;
    }
    hasEvents() {
      return this.working && this.events.length > 0;
    }
    runEvents() {
      if (!this.working) {
        return;
      }
      const { screen: document2, events, eventElements } = this;
      const { style } = document2.ctx.canvas;
      let element;
      if (style) {
        style.cursor = "";
      }
      events.forEach((param, i3) => {
        let { run } = param;
        element = eventElements[i3];
        while (element) {
          run(element);
          element = element.parent;
        }
      });
      this.events = [];
      this.eventElements = [];
    }
    checkPath(element, ctx) {
      if (!this.working || !ctx) {
        return;
      }
      const { events, eventElements } = this;
      events.forEach((param, i3) => {
        let { x, y: y2 } = param;
        if (!eventElements[i3] && ctx.isPointInPath && ctx.isPointInPath(x, y2)) {
          eventElements[i3] = element;
        }
      });
    }
    checkBoundingBox(element, boundingBox) {
      if (!this.working || !boundingBox) {
        return;
      }
      const { events, eventElements } = this;
      events.forEach((param, i3) => {
        let { x, y: y2 } = param;
        if (!eventElements[i3] && boundingBox.isPointInBox(x, y2)) {
          eventElements[i3] = element;
        }
      });
    }
    mapXY(x, y2) {
      const { window: window2, ctx } = this.screen;
      const point = new Point(x, y2);
      let element = ctx.canvas;
      while (element) {
        point.x -= element.offsetLeft;
        point.y -= element.offsetTop;
        element = element.offsetParent;
      }
      if (window2 === null || window2 === void 0 ? void 0 : window2.scrollX) {
        point.x += window2.scrollX;
      }
      if (window2 === null || window2 === void 0 ? void 0 : window2.scrollY) {
        point.y += window2.scrollY;
      }
      return point;
    }
    onClick(event) {
      const { x, y: y2 } = this.mapXY(event.clientX, event.clientY);
      this.events.push({
        type: "onclick",
        x,
        y: y2,
        run(eventTarget) {
          if (eventTarget.onClick) {
            eventTarget.onClick();
          }
        }
      });
    }
    onMouseMove(event) {
      const { x, y: y2 } = this.mapXY(event.clientX, event.clientY);
      this.events.push({
        type: "onmousemove",
        x,
        y: y2,
        run(eventTarget) {
          if (eventTarget.onMouseMove) {
            eventTarget.onMouseMove();
          }
        }
      });
    }
    constructor(screen) {
      this.screen = screen;
      this.working = false;
      this.events = [];
      this.eventElements = [];
      this.onClick = this.onClick.bind(this);
      this.onMouseMove = this.onMouseMove.bind(this);
    }
  };
  var defaultWindow = typeof window !== "undefined" ? window : null;
  var defaultFetch$1 = typeof fetch !== "undefined" ? fetch.bind(void 0) : void 0;
  var Screen = class {
    wait(checker) {
      this.waits.push(checker);
    }
    ready() {
      if (!this.readyPromise) {
        return Promise.resolve();
      }
      return this.readyPromise;
    }
    isReady() {
      if (this.isReadyLock) {
        return true;
      }
      const isReadyLock = this.waits.every(
        (_3) => _3()
      );
      if (isReadyLock) {
        this.waits = [];
        if (this.resolveReady) {
          this.resolveReady();
        }
      }
      this.isReadyLock = isReadyLock;
      return isReadyLock;
    }
    setDefaults(ctx) {
      ctx.strokeStyle = "rgba(0,0,0,0)";
      ctx.lineCap = "butt";
      ctx.lineJoin = "miter";
      ctx.miterLimit = 4;
    }
    setViewBox(param) {
      let { document: document2, ctx, aspectRatio, width, desiredWidth, height, desiredHeight, minX = 0, minY = 0, refX, refY, clip = false, clipX = 0, clipY = 0 } = param;
      const cleanAspectRatio = compressSpaces(aspectRatio).replace(/^defer\s/, "");
      const [aspectRatioAlign, aspectRatioMeetOrSlice] = cleanAspectRatio.split(" ");
      const align = aspectRatioAlign || "xMidYMid";
      const meetOrSlice = aspectRatioMeetOrSlice || "meet";
      const scaleX = width / desiredWidth;
      const scaleY = height / desiredHeight;
      const scaleMin = Math.min(scaleX, scaleY);
      const scaleMax = Math.max(scaleX, scaleY);
      let finalDesiredWidth = desiredWidth;
      let finalDesiredHeight = desiredHeight;
      if (meetOrSlice === "meet") {
        finalDesiredWidth *= scaleMin;
        finalDesiredHeight *= scaleMin;
      }
      if (meetOrSlice === "slice") {
        finalDesiredWidth *= scaleMax;
        finalDesiredHeight *= scaleMax;
      }
      const refXProp = new Property(document2, "refX", refX);
      const refYProp = new Property(document2, "refY", refY);
      const hasRefs = refXProp.hasValue() && refYProp.hasValue();
      if (hasRefs) {
        ctx.translate(-scaleMin * refXProp.getPixels("x"), -scaleMin * refYProp.getPixels("y"));
      }
      if (clip) {
        const scaledClipX = scaleMin * clipX;
        const scaledClipY = scaleMin * clipY;
        ctx.beginPath();
        ctx.moveTo(scaledClipX, scaledClipY);
        ctx.lineTo(width, scaledClipY);
        ctx.lineTo(width, height);
        ctx.lineTo(scaledClipX, height);
        ctx.closePath();
        ctx.clip();
      }
      if (!hasRefs) {
        const isMeetMinY = meetOrSlice === "meet" && scaleMin === scaleY;
        const isSliceMaxY = meetOrSlice === "slice" && scaleMax === scaleY;
        const isMeetMinX = meetOrSlice === "meet" && scaleMin === scaleX;
        const isSliceMaxX = meetOrSlice === "slice" && scaleMax === scaleX;
        if (align.startsWith("xMid") && (isMeetMinY || isSliceMaxY)) {
          ctx.translate(width / 2 - finalDesiredWidth / 2, 0);
        }
        if (align.endsWith("YMid") && (isMeetMinX || isSliceMaxX)) {
          ctx.translate(0, height / 2 - finalDesiredHeight / 2);
        }
        if (align.startsWith("xMax") && (isMeetMinY || isSliceMaxY)) {
          ctx.translate(width - finalDesiredWidth, 0);
        }
        if (align.endsWith("YMax") && (isMeetMinX || isSliceMaxX)) {
          ctx.translate(0, height - finalDesiredHeight);
        }
      }
      switch (true) {
        case align === "none":
          ctx.scale(scaleX, scaleY);
          break;
        case meetOrSlice === "meet":
          ctx.scale(scaleMin, scaleMin);
          break;
        case meetOrSlice === "slice":
          ctx.scale(scaleMax, scaleMax);
          break;
      }
      ctx.translate(-minX, -minY);
    }
    start(element) {
      let { enableRedraw = false, ignoreMouse = false, ignoreAnimation = false, ignoreDimensions = false, ignoreClear = false, forceRedraw, scaleWidth, scaleHeight, offsetX, offsetY } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      const { mouse } = this;
      const frameDuration = 1e3 / Screen.FRAMERATE;
      this.isReadyLock = false;
      this.frameDuration = frameDuration;
      this.readyPromise = new Promise((resolve) => {
        this.resolveReady = resolve;
      });
      if (this.isReady()) {
        this.render(element, ignoreDimensions, ignoreClear, scaleWidth, scaleHeight, offsetX, offsetY);
      }
      if (!enableRedraw) {
        return;
      }
      let now = Date.now();
      let then = now;
      let delta = 0;
      const tick = () => {
        now = Date.now();
        delta = now - then;
        if (delta >= frameDuration) {
          then = now - delta % frameDuration;
          if (this.shouldUpdate(ignoreAnimation, forceRedraw)) {
            this.render(element, ignoreDimensions, ignoreClear, scaleWidth, scaleHeight, offsetX, offsetY);
            mouse.runEvents();
          }
        }
        this.intervalId = (0, import_raf.default)(tick);
      };
      if (!ignoreMouse) {
        mouse.start();
      }
      this.intervalId = (0, import_raf.default)(tick);
    }
    stop() {
      if (this.intervalId) {
        import_raf.default.cancel(this.intervalId);
        this.intervalId = null;
      }
      this.mouse.stop();
    }
    shouldUpdate(ignoreAnimation, forceRedraw) {
      if (!ignoreAnimation) {
        const { frameDuration } = this;
        const shouldUpdate1 = this.animations.reduce(
          (shouldUpdate, animation) => animation.update(frameDuration) || shouldUpdate,
          false
        );
        if (shouldUpdate1) {
          return true;
        }
      }
      if (typeof forceRedraw === "function" && forceRedraw()) {
        return true;
      }
      if (!this.isReadyLock && this.isReady()) {
        return true;
      }
      if (this.mouse.hasEvents()) {
        return true;
      }
      return false;
    }
    render(element, ignoreDimensions, ignoreClear, scaleWidth, scaleHeight, offsetX, offsetY) {
      const { viewPort, ctx, isFirstRender } = this;
      const canvas = ctx.canvas;
      viewPort.clear();
      if (canvas.width && canvas.height) {
        viewPort.setCurrent(canvas.width, canvas.height);
      }
      const widthStyle = element.getStyle("width");
      const heightStyle = element.getStyle("height");
      if (!ignoreDimensions && (isFirstRender || typeof scaleWidth !== "number" && typeof scaleHeight !== "number")) {
        if (widthStyle.hasValue()) {
          canvas.width = widthStyle.getPixels("x");
          if (canvas.style) {
            canvas.style.width = "".concat(canvas.width, "px");
          }
        }
        if (heightStyle.hasValue()) {
          canvas.height = heightStyle.getPixels("y");
          if (canvas.style) {
            canvas.style.height = "".concat(canvas.height, "px");
          }
        }
      }
      let cWidth = canvas.clientWidth || canvas.width;
      let cHeight = canvas.clientHeight || canvas.height;
      if (ignoreDimensions && widthStyle.hasValue() && heightStyle.hasValue()) {
        cWidth = widthStyle.getPixels("x");
        cHeight = heightStyle.getPixels("y");
      }
      viewPort.setCurrent(cWidth, cHeight);
      if (typeof offsetX === "number") {
        element.getAttribute("x", true).setValue(offsetX);
      }
      if (typeof offsetY === "number") {
        element.getAttribute("y", true).setValue(offsetY);
      }
      if (typeof scaleWidth === "number" || typeof scaleHeight === "number") {
        const viewBox = toNumbers(element.getAttribute("viewBox").getString());
        let xRatio = 0;
        let yRatio = 0;
        if (typeof scaleWidth === "number") {
          const widthStyle2 = element.getStyle("width");
          if (widthStyle2.hasValue()) {
            xRatio = widthStyle2.getPixels("x") / scaleWidth;
          } else if (viewBox[2] && !isNaN(viewBox[2])) {
            xRatio = viewBox[2] / scaleWidth;
          }
        }
        if (typeof scaleHeight === "number") {
          const heightStyle2 = element.getStyle("height");
          if (heightStyle2.hasValue()) {
            yRatio = heightStyle2.getPixels("y") / scaleHeight;
          } else if (viewBox[3] && !isNaN(viewBox[3])) {
            yRatio = viewBox[3] / scaleHeight;
          }
        }
        if (!xRatio) {
          xRatio = yRatio;
        }
        if (!yRatio) {
          yRatio = xRatio;
        }
        element.getAttribute("width", true).setValue(scaleWidth);
        element.getAttribute("height", true).setValue(scaleHeight);
        const transformStyle = element.getStyle("transform", true, true);
        transformStyle.setValue("".concat(transformStyle.getString(), " scale(").concat(1 / xRatio, ", ").concat(1 / yRatio, ")"));
      }
      if (!ignoreClear) {
        ctx.clearRect(0, 0, cWidth, cHeight);
      }
      element.render(ctx);
      if (isFirstRender) {
        this.isFirstRender = false;
      }
    }
    constructor(ctx, { fetch: fetch2 = defaultFetch$1, window: window2 = defaultWindow } = {}) {
      this.ctx = ctx;
      this.viewPort = new ViewPort();
      this.mouse = new Mouse(this);
      this.animations = [];
      this.waits = [];
      this.frameDuration = 0;
      this.isReadyLock = false;
      this.isFirstRender = true;
      this.intervalId = null;
      this.window = window2;
      if (!fetch2) {
        throw new Error("Can't find 'fetch' in 'globalThis', please provide it via options");
      }
      this.fetch = fetch2;
    }
  };
  Screen.defaultWindow = defaultWindow;
  Screen.defaultFetch = defaultFetch$1;
  Screen.FRAMERATE = 30;
  Screen.MAX_VIRTUAL_PIXELS = 3e4;
  var { defaultFetch } = Screen;
  var DefaultDOMParser = typeof DOMParser !== "undefined" ? DOMParser : void 0;
  var Parser = class {
    async parse(resource) {
      if (resource.startsWith("<")) {
        return this.parseFromString(resource);
      }
      return this.load(resource);
    }
    parseFromString(xml) {
      const parser = new this.DOMParser();
      try {
        return this.checkDocument(parser.parseFromString(xml, "image/svg+xml"));
      } catch (err) {
        return this.checkDocument(parser.parseFromString(xml, "text/xml"));
      }
    }
    checkDocument(document2) {
      const parserError = document2.getElementsByTagName("parsererror")[0];
      if (parserError) {
        throw new Error(parserError.textContent || "Unknown parse error");
      }
      return document2;
    }
    async load(url) {
      const response = await this.fetch(url);
      const xml = await response.text();
      return this.parseFromString(xml);
    }
    constructor({ fetch: fetch2 = defaultFetch, DOMParser: DOMParser2 = DefaultDOMParser } = {}) {
      if (!fetch2) {
        throw new Error("Can't find 'fetch' in 'globalThis', please provide it via options");
      }
      if (!DOMParser2) {
        throw new Error("Can't find 'DOMParser' in 'globalThis', please provide it via options");
      }
      this.fetch = fetch2;
      this.DOMParser = DOMParser2;
    }
  };
  var Translate = class {
    apply(ctx) {
      const { x, y: y2 } = this.point;
      ctx.translate(x || 0, y2 || 0);
    }
    unapply(ctx) {
      const { x, y: y2 } = this.point;
      ctx.translate(-1 * x || 0, -1 * y2 || 0);
    }
    applyToPoint(point) {
      const { x, y: y2 } = this.point;
      point.applyTransform([
        1,
        0,
        0,
        1,
        x || 0,
        y2 || 0
      ]);
    }
    constructor(_3, point) {
      this.type = "translate";
      this.point = Point.parse(point);
    }
  };
  var Rotate = class {
    apply(ctx) {
      const { cx, cy, originX, originY, angle } = this;
      const tx = cx + originX.getPixels("x");
      const ty = cy + originY.getPixels("y");
      ctx.translate(tx, ty);
      ctx.rotate(angle.getRadians());
      ctx.translate(-tx, -ty);
    }
    unapply(ctx) {
      const { cx, cy, originX, originY, angle } = this;
      const tx = cx + originX.getPixels("x");
      const ty = cy + originY.getPixels("y");
      ctx.translate(tx, ty);
      ctx.rotate(-1 * angle.getRadians());
      ctx.translate(-tx, -ty);
    }
    applyToPoint(point) {
      const { cx, cy, angle } = this;
      const rad = angle.getRadians();
      point.applyTransform([
        1,
        0,
        0,
        1,
        cx || 0,
        cy || 0
      ]);
      point.applyTransform([
        Math.cos(rad),
        Math.sin(rad),
        -Math.sin(rad),
        Math.cos(rad),
        0,
        0
      ]);
      point.applyTransform([
        1,
        0,
        0,
        1,
        -cx || 0,
        -cy || 0
      ]);
    }
    constructor(document2, rotate, transformOrigin) {
      this.type = "rotate";
      const numbers = toNumbers(rotate);
      this.angle = new Property(document2, "angle", numbers[0]);
      this.originX = transformOrigin[0];
      this.originY = transformOrigin[1];
      this.cx = numbers[1] || 0;
      this.cy = numbers[2] || 0;
    }
  };
  var Scale = class {
    apply(ctx) {
      const { scale: { x, y: y2 }, originX, originY } = this;
      const tx = originX.getPixels("x");
      const ty = originY.getPixels("y");
      ctx.translate(tx, ty);
      ctx.scale(x, y2 || x);
      ctx.translate(-tx, -ty);
    }
    unapply(ctx) {
      const { scale: { x, y: y2 }, originX, originY } = this;
      const tx = originX.getPixels("x");
      const ty = originY.getPixels("y");
      ctx.translate(tx, ty);
      ctx.scale(1 / x, 1 / y2 || x);
      ctx.translate(-tx, -ty);
    }
    applyToPoint(point) {
      const { x, y: y2 } = this.scale;
      point.applyTransform([
        x || 0,
        0,
        0,
        y2 || 0,
        0,
        0
      ]);
    }
    constructor(_3, scale, transformOrigin) {
      this.type = "scale";
      const scaleSize = Point.parseScale(scale);
      if (scaleSize.x === 0 || scaleSize.y === 0) {
        scaleSize.x = PSEUDO_ZERO;
        scaleSize.y = PSEUDO_ZERO;
      }
      this.scale = scaleSize;
      this.originX = transformOrigin[0];
      this.originY = transformOrigin[1];
    }
  };
  var Matrix = class {
    apply(ctx) {
      const { originX, originY, matrix } = this;
      const tx = originX.getPixels("x");
      const ty = originY.getPixels("y");
      ctx.translate(tx, ty);
      ctx.transform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
      ctx.translate(-tx, -ty);
    }
    unapply(ctx) {
      const { originX, originY, matrix } = this;
      const a3 = matrix[0];
      const b2 = matrix[2];
      const c4 = matrix[4];
      const d2 = matrix[1];
      const e3 = matrix[3];
      const f3 = matrix[5];
      const g2 = 0;
      const h3 = 0;
      const i3 = 1;
      const det = 1 / (a3 * (e3 * i3 - f3 * h3) - b2 * (d2 * i3 - f3 * g2) + c4 * (d2 * h3 - e3 * g2));
      const tx = originX.getPixels("x");
      const ty = originY.getPixels("y");
      ctx.translate(tx, ty);
      ctx.transform(det * (e3 * i3 - f3 * h3), det * (f3 * g2 - d2 * i3), det * (c4 * h3 - b2 * i3), det * (a3 * i3 - c4 * g2), det * (b2 * f3 - c4 * e3), det * (c4 * d2 - a3 * f3));
      ctx.translate(-tx, -ty);
    }
    applyToPoint(point) {
      point.applyTransform(this.matrix);
    }
    constructor(_3, matrix, transformOrigin) {
      this.type = "matrix";
      this.matrix = toMatrixValue(matrix);
      this.originX = transformOrigin[0];
      this.originY = transformOrigin[1];
    }
  };
  var Skew = class extends Matrix {
    constructor(document2, skew, transformOrigin) {
      super(document2, skew, transformOrigin);
      this.type = "skew";
      this.angle = new Property(document2, "angle", skew);
    }
  };
  var SkewX = class extends Skew {
    constructor(document2, skew, transformOrigin) {
      super(document2, skew, transformOrigin);
      this.type = "skewX";
      this.matrix = [
        1,
        0,
        Math.tan(this.angle.getRadians()),
        1,
        0,
        0
      ];
    }
  };
  var SkewY = class extends Skew {
    constructor(document2, skew, transformOrigin) {
      super(document2, skew, transformOrigin);
      this.type = "skewY";
      this.matrix = [
        1,
        Math.tan(this.angle.getRadians()),
        0,
        1,
        0,
        0
      ];
    }
  };
  function parseTransforms(transform) {
    return compressSpaces(transform).trim().replace(/\)([a-zA-Z])/g, ") $1").replace(/\)(\s?,\s?)/g, ") ").split(/\s(?=[a-z])/);
  }
  function parseTransform(transform) {
    const [type = "", value = ""] = transform.split("(");
    return [
      type.trim(),
      value.trim().replace(")", "")
    ];
  }
  var Transform = class {
    static fromElement(document2, element) {
      const transformStyle = element.getStyle("transform", false, true);
      if (transformStyle.hasValue()) {
        const [transformOriginXProperty, transformOriginYProperty = transformOriginXProperty] = element.getStyle("transform-origin", false, true).split();
        if (transformOriginXProperty && transformOriginYProperty) {
          const transformOrigin = [
            transformOriginXProperty,
            transformOriginYProperty
          ];
          return new Transform(document2, transformStyle.getString(), transformOrigin);
        }
      }
      return null;
    }
    apply(ctx) {
      this.transforms.forEach(
        (transform) => transform.apply(ctx)
      );
    }
    unapply(ctx) {
      this.transforms.forEach(
        (transform) => transform.unapply(ctx)
      );
    }
    applyToPoint(point) {
      this.transforms.forEach(
        (transform) => transform.applyToPoint(point)
      );
    }
    constructor(document2, transform1, transformOrigin) {
      this.document = document2;
      this.transforms = [];
      const data = parseTransforms(transform1);
      data.forEach((transform) => {
        if (transform === "none") {
          return;
        }
        const [type, value] = parseTransform(transform);
        const TransformType = Transform.transformTypes[type];
        if (TransformType) {
          this.transforms.push(new TransformType(this.document, value, transformOrigin));
        }
      });
    }
  };
  Transform.transformTypes = {
    translate: Translate,
    rotate: Rotate,
    scale: Scale,
    matrix: Matrix,
    skewX: SkewX,
    skewY: SkewY
  };
  var Element = class {
    getAttribute(name) {
      let createIfNotExists = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      const attr = this.attributes[name];
      if (!attr && createIfNotExists) {
        const attr2 = new Property(this.document, name, "");
        this.attributes[name] = attr2;
        return attr2;
      }
      return attr || Property.empty(this.document);
    }
    getHrefAttribute() {
      let href;
      for (const key in this.attributes) {
        if (key === "href" || key.endsWith(":href")) {
          href = this.attributes[key];
          break;
        }
      }
      return href || Property.empty(this.document);
    }
    getStyle(name) {
      let createIfNotExists = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false, skipAncestors = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
      const style = this.styles[name];
      if (style) {
        return style;
      }
      const attr = this.getAttribute(name);
      if (attr.hasValue()) {
        this.styles[name] = attr;
        return attr;
      }
      if (!skipAncestors) {
        const { parent } = this;
        if (parent) {
          const parentStyle = parent.getStyle(name);
          if (parentStyle.hasValue()) {
            return parentStyle;
          }
        }
      }
      if (createIfNotExists) {
        const style2 = new Property(this.document, name, "");
        this.styles[name] = style2;
        return style2;
      }
      return Property.empty(this.document);
    }
    render(ctx) {
      if (this.getStyle("display").getString() === "none" || this.getStyle("visibility").getString() === "hidden") {
        return;
      }
      ctx.save();
      if (this.getStyle("mask").hasValue()) {
        const mask = this.getStyle("mask").getDefinition();
        if (mask) {
          this.applyEffects(ctx);
          mask.apply(ctx, this);
        }
      } else if (this.getStyle("filter").getValue("none") !== "none") {
        const filter = this.getStyle("filter").getDefinition();
        if (filter) {
          this.applyEffects(ctx);
          filter.apply(ctx, this);
        }
      } else {
        this.setContext(ctx);
        this.renderChildren(ctx);
        this.clearContext(ctx);
      }
      ctx.restore();
    }
    setContext(_3) {
    }
    applyEffects(ctx) {
      const transform = Transform.fromElement(this.document, this);
      if (transform) {
        transform.apply(ctx);
      }
      const clipPathStyleProp = this.getStyle("clip-path", false, true);
      if (clipPathStyleProp.hasValue()) {
        const clip = clipPathStyleProp.getDefinition();
        if (clip) {
          clip.apply(ctx);
        }
      }
    }
    clearContext(_3) {
    }
    renderChildren(ctx) {
      this.children.forEach((child) => {
        child.render(ctx);
      });
    }
    addChild(childNode) {
      const child = childNode instanceof Element ? childNode : this.document.createElement(childNode);
      child.parent = this;
      if (!Element.ignoreChildTypes.includes(child.type)) {
        this.children.push(child);
      }
    }
    matchesSelector(selector) {
      var ref;
      const { node } = this;
      if (typeof node.matches === "function") {
        return node.matches(selector);
      }
      const styleClasses = (ref = node.getAttribute) === null || ref === void 0 ? void 0 : ref.call(node, "class");
      if (!styleClasses || styleClasses === "") {
        return false;
      }
      return styleClasses.split(" ").some(
        (styleClass) => ".".concat(styleClass) === selector
      );
    }
    addStylesFromStyleDefinition() {
      const { styles, stylesSpecificity } = this.document;
      let styleProp;
      for (const selector in styles) {
        if (!selector.startsWith("@") && this.matchesSelector(selector)) {
          const style = styles[selector];
          const specificity = stylesSpecificity[selector];
          if (style) {
            for (const name in style) {
              let existingSpecificity = this.stylesSpecificity[name];
              if (typeof existingSpecificity === "undefined") {
                existingSpecificity = "000";
              }
              if (specificity && specificity >= existingSpecificity) {
                styleProp = style[name];
                if (styleProp) {
                  this.styles[name] = styleProp;
                }
                this.stylesSpecificity[name] = specificity;
              }
            }
          }
        }
      }
    }
    removeStyles(element, ignoreStyles) {
      const toRestore1 = ignoreStyles.reduce((toRestore, name) => {
        const styleProp = element.getStyle(name);
        if (!styleProp.hasValue()) {
          return toRestore;
        }
        const value = styleProp.getString();
        styleProp.setValue("");
        return [
          ...toRestore,
          [
            name,
            value
          ]
        ];
      }, []);
      return toRestore1;
    }
    restoreStyles(element, styles) {
      styles.forEach((param) => {
        let [name, value] = param;
        element.getStyle(name, true).setValue(value);
      });
    }
    isFirstChild() {
      var ref;
      return ((ref = this.parent) === null || ref === void 0 ? void 0 : ref.children.indexOf(this)) === 0;
    }
    constructor(document2, node, captureTextNodes = false) {
      this.document = document2;
      this.node = node;
      this.captureTextNodes = captureTextNodes;
      this.type = "";
      this.attributes = {};
      this.styles = {};
      this.stylesSpecificity = {};
      this.animationFrozen = false;
      this.animationFrozenValue = "";
      this.parent = null;
      this.children = [];
      if (!node || node.nodeType !== 1) {
        return;
      }
      Array.from(node.attributes).forEach((attribute) => {
        const nodeName = normalizeAttributeName(attribute.nodeName);
        this.attributes[nodeName] = new Property(document2, nodeName, attribute.value);
      });
      this.addStylesFromStyleDefinition();
      if (this.getAttribute("style").hasValue()) {
        const styles = this.getAttribute("style").getString().split(";").map(
          (_3) => _3.trim()
        );
        styles.forEach((style) => {
          if (!style) {
            return;
          }
          const [name, value] = style.split(":").map(
            (_3) => _3.trim()
          );
          if (name) {
            this.styles[name] = new Property(document2, name, value);
          }
        });
      }
      const { definitions } = document2;
      const id = this.getAttribute("id");
      if (id.hasValue()) {
        if (!definitions[id.getString()]) {
          definitions[id.getString()] = this;
        }
      }
      Array.from(node.childNodes).forEach((childNode) => {
        if (childNode.nodeType === 1) {
          this.addChild(childNode);
        } else if (captureTextNodes && (childNode.nodeType === 3 || childNode.nodeType === 4)) {
          const textNode = document2.createTextNode(childNode);
          if (textNode.getText().length > 0) {
            this.addChild(textNode);
          }
        }
      });
    }
  };
  Element.ignoreChildTypes = [
    "title"
  ];
  var UnknownElement = class extends Element {
    constructor(document2, node, captureTextNodes) {
      super(document2, node, captureTextNodes);
    }
  };
  function wrapFontFamily(fontFamily) {
    const trimmed = fontFamily.trim();
    return /^('|")/.test(trimmed) ? trimmed : '"'.concat(trimmed, '"');
  }
  function prepareFontFamily(fontFamily) {
    return typeof process === "undefined" ? fontFamily : fontFamily.trim().split(",").map(wrapFontFamily).join(",");
  }
  function prepareFontStyle(fontStyle) {
    if (!fontStyle) {
      return "";
    }
    const targetFontStyle = fontStyle.trim().toLowerCase();
    switch (targetFontStyle) {
      case "normal":
      case "italic":
      case "oblique":
      case "inherit":
      case "initial":
      case "unset":
        return targetFontStyle;
      default:
        if (/^oblique\s+(-|)\d+deg$/.test(targetFontStyle)) {
          return targetFontStyle;
        }
        return "";
    }
  }
  function prepareFontWeight(fontWeight) {
    if (!fontWeight) {
      return "";
    }
    const targetFontWeight = fontWeight.trim().toLowerCase();
    switch (targetFontWeight) {
      case "normal":
      case "bold":
      case "lighter":
      case "bolder":
      case "inherit":
      case "initial":
      case "unset":
        return targetFontWeight;
      default:
        if (/^[\d.]+$/.test(targetFontWeight)) {
          return targetFontWeight;
        }
        return "";
    }
  }
  var Font = class {
    static parse() {
      let font = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", inherit = arguments.length > 1 ? arguments[1] : void 0;
      let fontStyle = "";
      let fontVariant = "";
      let fontWeight = "";
      let fontSize = "";
      let fontFamily = "";
      const parts = compressSpaces(font).trim().split(" ");
      const set = {
        fontSize: false,
        fontStyle: false,
        fontWeight: false,
        fontVariant: false
      };
      parts.forEach((part) => {
        switch (true) {
          case (!set.fontStyle && Font.styles.includes(part)):
            if (part !== "inherit") {
              fontStyle = part;
            }
            set.fontStyle = true;
            break;
          case (!set.fontVariant && Font.variants.includes(part)):
            if (part !== "inherit") {
              fontVariant = part;
            }
            set.fontStyle = true;
            set.fontVariant = true;
            break;
          case (!set.fontWeight && Font.weights.includes(part)):
            if (part !== "inherit") {
              fontWeight = part;
            }
            set.fontStyle = true;
            set.fontVariant = true;
            set.fontWeight = true;
            break;
          case !set.fontSize:
            if (part !== "inherit") {
              fontSize = part.split("/")[0] || "";
            }
            set.fontStyle = true;
            set.fontVariant = true;
            set.fontWeight = true;
            set.fontSize = true;
            break;
          default:
            if (part !== "inherit") {
              fontFamily += part;
            }
        }
      });
      return new Font(fontStyle, fontVariant, fontWeight, fontSize, fontFamily, inherit);
    }
    toString() {
      return [
        prepareFontStyle(this.fontStyle),
        this.fontVariant,
        prepareFontWeight(this.fontWeight),
        this.fontSize,
        prepareFontFamily(this.fontFamily)
      ].join(" ").trim();
    }
    constructor(fontStyle, fontVariant, fontWeight, fontSize, fontFamily, inherit) {
      const inheritFont = inherit ? typeof inherit === "string" ? Font.parse(inherit) : inherit : {};
      this.fontFamily = fontFamily || inheritFont.fontFamily;
      this.fontSize = fontSize || inheritFont.fontSize;
      this.fontStyle = fontStyle || inheritFont.fontStyle;
      this.fontWeight = fontWeight || inheritFont.fontWeight;
      this.fontVariant = fontVariant || inheritFont.fontVariant;
    }
  };
  Font.styles = "normal|italic|oblique|inherit";
  Font.variants = "normal|small-caps|inherit";
  Font.weights = "normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900|inherit";
  var BoundingBox = class {
    get x() {
      return this.x1;
    }
    get y() {
      return this.y1;
    }
    get width() {
      return this.x2 - this.x1;
    }
    get height() {
      return this.y2 - this.y1;
    }
    addPoint(x, y2) {
      if (typeof x !== "undefined") {
        if (isNaN(this.x1) || isNaN(this.x2)) {
          this.x1 = x;
          this.x2 = x;
        }
        if (x < this.x1) {
          this.x1 = x;
        }
        if (x > this.x2) {
          this.x2 = x;
        }
      }
      if (typeof y2 !== "undefined") {
        if (isNaN(this.y1) || isNaN(this.y2)) {
          this.y1 = y2;
          this.y2 = y2;
        }
        if (y2 < this.y1) {
          this.y1 = y2;
        }
        if (y2 > this.y2) {
          this.y2 = y2;
        }
      }
    }
    addX(x) {
      this.addPoint(x, 0);
    }
    addY(y2) {
      this.addPoint(0, y2);
    }
    addBoundingBox(boundingBox) {
      if (!boundingBox) {
        return;
      }
      const { x1, y1, x2, y2 } = boundingBox;
      this.addPoint(x1, y1);
      this.addPoint(x2, y2);
    }
    sumCubic(t3, p0, p1, p22, p3) {
      return Math.pow(1 - t3, 3) * p0 + 3 * Math.pow(1 - t3, 2) * t3 * p1 + 3 * (1 - t3) * Math.pow(t3, 2) * p22 + Math.pow(t3, 3) * p3;
    }
    bezierCurveAdd(forX, p0, p1, p22, p3) {
      const b2 = 6 * p0 - 12 * p1 + 6 * p22;
      const a3 = -3 * p0 + 9 * p1 - 9 * p22 + 3 * p3;
      const c4 = 3 * p1 - 3 * p0;
      if (a3 === 0) {
        if (b2 === 0) {
          return;
        }
        const t3 = -c4 / b2;
        if (0 < t3 && t3 < 1) {
          if (forX) {
            this.addX(this.sumCubic(t3, p0, p1, p22, p3));
          } else {
            this.addY(this.sumCubic(t3, p0, p1, p22, p3));
          }
        }
        return;
      }
      const b2ac = Math.pow(b2, 2) - 4 * c4 * a3;
      if (b2ac < 0) {
        return;
      }
      const t1 = (-b2 + Math.sqrt(b2ac)) / (2 * a3);
      if (0 < t1 && t1 < 1) {
        if (forX) {
          this.addX(this.sumCubic(t1, p0, p1, p22, p3));
        } else {
          this.addY(this.sumCubic(t1, p0, p1, p22, p3));
        }
      }
      const t22 = (-b2 - Math.sqrt(b2ac)) / (2 * a3);
      if (0 < t22 && t22 < 1) {
        if (forX) {
          this.addX(this.sumCubic(t22, p0, p1, p22, p3));
        } else {
          this.addY(this.sumCubic(t22, p0, p1, p22, p3));
        }
      }
    }
    addBezierCurve(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y) {
      this.addPoint(p0x, p0y);
      this.addPoint(p3x, p3y);
      this.bezierCurveAdd(true, p0x, p1x, p2x, p3x);
      this.bezierCurveAdd(false, p0y, p1y, p2y, p3y);
    }
    addQuadraticCurve(p0x, p0y, p1x, p1y, p2x, p2y) {
      const cp1x = p0x + 2 / 3 * (p1x - p0x);
      const cp1y = p0y + 2 / 3 * (p1y - p0y);
      const cp2x = cp1x + 1 / 3 * (p2x - p0x);
      const cp2y = cp1y + 1 / 3 * (p2y - p0y);
      this.addBezierCurve(p0x, p0y, cp1x, cp2x, cp1y, cp2y, p2x, p2y);
    }
    isPointInBox(x, y2) {
      const { x1, y1, x2, y2: y22 } = this;
      return x1 <= x && x <= x2 && y1 <= y2 && y2 <= y22;
    }
    constructor(x1 = Number.NaN, y1 = Number.NaN, x2 = Number.NaN, y2 = Number.NaN) {
      this.x1 = x1;
      this.y1 = y1;
      this.x2 = x2;
      this.y2 = y2;
      this.addPoint(x1, y1);
      this.addPoint(x2, y2);
    }
  };
  var RenderedElement = class extends Element {
    calculateOpacity() {
      let opacity = 1;
      let element = this;
      while (element) {
        const opacityStyle = element.getStyle("opacity", false, true);
        if (opacityStyle.hasValue(true)) {
          opacity *= opacityStyle.getNumber();
        }
        element = element.parent;
      }
      return opacity;
    }
    setContext(ctx) {
      let fromMeasure = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      if (!fromMeasure) {
        const fillStyleProp = this.getStyle("fill");
        const fillOpacityStyleProp = this.getStyle("fill-opacity");
        const strokeStyleProp = this.getStyle("stroke");
        const strokeOpacityProp = this.getStyle("stroke-opacity");
        if (fillStyleProp.isUrlDefinition()) {
          const fillStyle = fillStyleProp.getFillStyleDefinition(this, fillOpacityStyleProp);
          if (fillStyle) {
            ctx.fillStyle = fillStyle;
          }
        } else if (fillStyleProp.hasValue()) {
          if (fillStyleProp.getString() === "currentColor") {
            fillStyleProp.setValue(this.getStyle("color").getColor());
          }
          const fillStyle = fillStyleProp.getColor();
          if (fillStyle !== "inherit") {
            ctx.fillStyle = fillStyle === "none" ? "rgba(0,0,0,0)" : fillStyle;
          }
        }
        if (fillOpacityStyleProp.hasValue()) {
          const fillStyle = new Property(this.document, "fill", ctx.fillStyle).addOpacity(fillOpacityStyleProp).getColor();
          ctx.fillStyle = fillStyle;
        }
        if (strokeStyleProp.isUrlDefinition()) {
          const strokeStyle = strokeStyleProp.getFillStyleDefinition(this, strokeOpacityProp);
          if (strokeStyle) {
            ctx.strokeStyle = strokeStyle;
          }
        } else if (strokeStyleProp.hasValue()) {
          if (strokeStyleProp.getString() === "currentColor") {
            strokeStyleProp.setValue(this.getStyle("color").getColor());
          }
          const strokeStyle = strokeStyleProp.getString();
          if (strokeStyle !== "inherit") {
            ctx.strokeStyle = strokeStyle === "none" ? "rgba(0,0,0,0)" : strokeStyle;
          }
        }
        if (strokeOpacityProp.hasValue()) {
          const strokeStyle = new Property(this.document, "stroke", ctx.strokeStyle).addOpacity(strokeOpacityProp).getString();
          ctx.strokeStyle = strokeStyle;
        }
        const strokeWidthStyleProp = this.getStyle("stroke-width");
        if (strokeWidthStyleProp.hasValue()) {
          const newLineWidth = strokeWidthStyleProp.getPixels();
          ctx.lineWidth = !newLineWidth ? PSEUDO_ZERO : newLineWidth;
        }
        const strokeLinecapStyleProp = this.getStyle("stroke-linecap");
        const strokeLinejoinStyleProp = this.getStyle("stroke-linejoin");
        const strokeMiterlimitProp = this.getStyle("stroke-miterlimit");
        const strokeDasharrayStyleProp = this.getStyle("stroke-dasharray");
        const strokeDashoffsetProp = this.getStyle("stroke-dashoffset");
        if (strokeLinecapStyleProp.hasValue()) {
          ctx.lineCap = strokeLinecapStyleProp.getString();
        }
        if (strokeLinejoinStyleProp.hasValue()) {
          ctx.lineJoin = strokeLinejoinStyleProp.getString();
        }
        if (strokeMiterlimitProp.hasValue()) {
          ctx.miterLimit = strokeMiterlimitProp.getNumber();
        }
        if (strokeDasharrayStyleProp.hasValue() && strokeDasharrayStyleProp.getString() !== "none") {
          const gaps = toNumbers(strokeDasharrayStyleProp.getString());
          if (typeof ctx.setLineDash !== "undefined") {
            ctx.setLineDash(gaps);
          } else if (typeof ctx.webkitLineDash !== "undefined") {
            ctx.webkitLineDash = gaps;
          } else if (typeof ctx.mozDash !== "undefined" && !(gaps.length === 1 && gaps[0] === 0)) {
            ctx.mozDash = gaps;
          }
          const offset = strokeDashoffsetProp.getPixels();
          if (typeof ctx.lineDashOffset !== "undefined") {
            ctx.lineDashOffset = offset;
          } else if (typeof ctx.webkitLineDashOffset !== "undefined") {
            ctx.webkitLineDashOffset = offset;
          } else if (typeof ctx.mozDashOffset !== "undefined") {
            ctx.mozDashOffset = offset;
          }
        }
      }
      this.modifiedEmSizeStack = false;
      if (typeof ctx.font !== "undefined") {
        const fontStyleProp = this.getStyle("font");
        const fontStyleStyleProp = this.getStyle("font-style");
        const fontVariantStyleProp = this.getStyle("font-variant");
        const fontWeightStyleProp = this.getStyle("font-weight");
        const fontSizeStyleProp = this.getStyle("font-size");
        const fontFamilyStyleProp = this.getStyle("font-family");
        const font = new Font(fontStyleStyleProp.getString(), fontVariantStyleProp.getString(), fontWeightStyleProp.getString(), fontSizeStyleProp.hasValue() ? "".concat(fontSizeStyleProp.getPixels(true), "px") : "", fontFamilyStyleProp.getString(), Font.parse(fontStyleProp.getString(), ctx.font));
        fontStyleStyleProp.setValue(font.fontStyle);
        fontVariantStyleProp.setValue(font.fontVariant);
        fontWeightStyleProp.setValue(font.fontWeight);
        fontSizeStyleProp.setValue(font.fontSize);
        fontFamilyStyleProp.setValue(font.fontFamily);
        ctx.font = font.toString();
        if (fontSizeStyleProp.isPixels()) {
          this.document.emSize = fontSizeStyleProp.getPixels();
          this.modifiedEmSizeStack = true;
        }
      }
      if (!fromMeasure) {
        this.applyEffects(ctx);
        ctx.globalAlpha = this.calculateOpacity();
      }
    }
    clearContext(ctx) {
      super.clearContext(ctx);
      if (this.modifiedEmSizeStack) {
        this.document.popEmSize();
      }
    }
    constructor(...args) {
      super(...args);
      this.modifiedEmSizeStack = false;
    }
  };
  var TextElement = class extends RenderedElement {
    setContext(ctx) {
      let fromMeasure = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      super.setContext(ctx, fromMeasure);
      const textBaseline = this.getStyle("dominant-baseline").getTextBaseline() || this.getStyle("alignment-baseline").getTextBaseline();
      if (textBaseline) {
        ctx.textBaseline = textBaseline;
      }
    }
    initializeCoordinates() {
      this.x = 0;
      this.y = 0;
      this.leafTexts = [];
      this.textChunkStart = 0;
      this.minX = Number.POSITIVE_INFINITY;
      this.maxX = Number.NEGATIVE_INFINITY;
    }
    getBoundingBox(ctx) {
      if (this.type !== "text") {
        return this.getTElementBoundingBox(ctx);
      }
      this.initializeCoordinates();
      this.adjustChildCoordinatesRecursive(ctx);
      let boundingBox = null;
      this.children.forEach((_3, i3) => {
        const childBoundingBox = this.getChildBoundingBox(ctx, this, this, i3);
        if (!boundingBox) {
          boundingBox = childBoundingBox;
        } else {
          boundingBox.addBoundingBox(childBoundingBox);
        }
      });
      return boundingBox;
    }
    getFontSize() {
      const { document: document2, parent } = this;
      const inheritFontSize = Font.parse(document2.ctx.font).fontSize;
      const fontSize = parent.getStyle("font-size").getNumber(inheritFontSize);
      return fontSize;
    }
    getTElementBoundingBox(ctx) {
      const fontSize = this.getFontSize();
      return new BoundingBox(this.x, this.y - fontSize, this.x + this.measureText(ctx), this.y);
    }
    getGlyph(font, text, i3) {
      const char = text[i3];
      let glyph;
      if (font.isArabic) {
        var ref;
        const len = text.length;
        const prevChar = text[i3 - 1];
        const nextChar = text[i3 + 1];
        let arabicForm = "isolated";
        if ((i3 === 0 || prevChar === " ") && i3 < len - 1 && nextChar !== " ") {
          arabicForm = "terminal";
        }
        if (i3 > 0 && prevChar !== " " && i3 < len - 1 && nextChar !== " ") {
          arabicForm = "medial";
        }
        if (i3 > 0 && prevChar !== " " && (i3 === len - 1 || nextChar === " ")) {
          arabicForm = "initial";
        }
        glyph = ((ref = font.arabicGlyphs[char]) === null || ref === void 0 ? void 0 : ref[arabicForm]) || font.glyphs[char];
      } else {
        glyph = font.glyphs[char];
      }
      if (!glyph) {
        glyph = font.missingGlyph;
      }
      return glyph;
    }
    getText() {
      return "";
    }
    getTextFromNode(node) {
      const textNode = node || this.node;
      const childNodes = Array.from(textNode.parentNode.childNodes);
      const index = childNodes.indexOf(textNode);
      const lastIndex = childNodes.length - 1;
      let text = compressSpaces(
        textNode.textContent || ""
      );
      if (index === 0) {
        text = trimLeft(text);
      }
      if (index === lastIndex) {
        text = trimRight(text);
      }
      return text;
    }
    renderChildren(ctx) {
      if (this.type !== "text") {
        this.renderTElementChildren(ctx);
        return;
      }
      this.initializeCoordinates();
      this.adjustChildCoordinatesRecursive(ctx);
      this.children.forEach((_3, i3) => {
        this.renderChild(ctx, this, this, i3);
      });
      const { mouse } = this.document.screen;
      if (mouse.isWorking()) {
        mouse.checkBoundingBox(this, this.getBoundingBox(ctx));
      }
    }
    renderTElementChildren(ctx) {
      const { document: document2, parent } = this;
      const renderText = this.getText();
      const customFont = parent.getStyle("font-family").getDefinition();
      if (customFont) {
        const { unitsPerEm } = customFont.fontFace;
        const ctxFont = Font.parse(document2.ctx.font);
        const fontSize = parent.getStyle("font-size").getNumber(ctxFont.fontSize);
        const fontStyle = parent.getStyle("font-style").getString(ctxFont.fontStyle);
        const scale = fontSize / unitsPerEm;
        const text = customFont.isRTL ? renderText.split("").reverse().join("") : renderText;
        const dx = toNumbers(parent.getAttribute("dx").getString());
        const len = text.length;
        for (let i3 = 0; i3 < len; i3++) {
          const glyph = this.getGlyph(customFont, text, i3);
          ctx.translate(this.x, this.y);
          ctx.scale(scale, -scale);
          const lw = ctx.lineWidth;
          ctx.lineWidth = ctx.lineWidth * unitsPerEm / fontSize;
          if (fontStyle === "italic") {
            ctx.transform(1, 0, 0.4, 1, 0, 0);
          }
          glyph.render(ctx);
          if (fontStyle === "italic") {
            ctx.transform(1, 0, -0.4, 1, 0, 0);
          }
          ctx.lineWidth = lw;
          ctx.scale(1 / scale, -1 / scale);
          ctx.translate(-this.x, -this.y);
          this.x += fontSize * (glyph.horizAdvX || customFont.horizAdvX) / unitsPerEm;
          if (typeof dx[i3] !== "undefined" && !isNaN(dx[i3])) {
            this.x += dx[i3];
          }
        }
        return;
      }
      const { x, y: y2 } = this;
      if (ctx.fillStyle) {
        ctx.fillText(renderText, x, y2);
      }
      if (ctx.strokeStyle) {
        ctx.strokeText(renderText, x, y2);
      }
    }
    applyAnchoring() {
      if (this.textChunkStart >= this.leafTexts.length) {
        return;
      }
      const firstElement = this.leafTexts[this.textChunkStart];
      const textAnchor = firstElement.getStyle("text-anchor").getString("start");
      const isRTL = false;
      let shift = 0;
      if (textAnchor === "start" && !isRTL || textAnchor === "end" && isRTL) {
        shift = firstElement.x - this.minX;
      } else if (textAnchor === "end" && !isRTL || textAnchor === "start" && isRTL) {
        shift = firstElement.x - this.maxX;
      } else {
        shift = firstElement.x - (this.minX + this.maxX) / 2;
      }
      for (let i3 = this.textChunkStart; i3 < this.leafTexts.length; i3++) {
        this.leafTexts[i3].x += shift;
      }
      this.minX = Number.POSITIVE_INFINITY;
      this.maxX = Number.NEGATIVE_INFINITY;
      this.textChunkStart = this.leafTexts.length;
    }
    adjustChildCoordinatesRecursive(ctx) {
      this.children.forEach((_3, i3) => {
        this.adjustChildCoordinatesRecursiveCore(ctx, this, this, i3);
      });
      this.applyAnchoring();
    }
    adjustChildCoordinatesRecursiveCore(ctx, textParent, parent, i1) {
      const child = parent.children[i1];
      if (child.children.length > 0) {
        child.children.forEach((_3, i3) => {
          textParent.adjustChildCoordinatesRecursiveCore(ctx, textParent, child, i3);
        });
      } else {
        this.adjustChildCoordinates(ctx, textParent, parent, i1);
      }
    }
    adjustChildCoordinates(ctx, textParent, parent, i3) {
      const child = parent.children[i3];
      if (typeof child.measureText !== "function") {
        return child;
      }
      ctx.save();
      child.setContext(ctx, true);
      const xAttr = child.getAttribute("x");
      const yAttr = child.getAttribute("y");
      const dxAttr = child.getAttribute("dx");
      const dyAttr = child.getAttribute("dy");
      const customFont = child.getStyle("font-family").getDefinition();
      const isRTL = Boolean(customFont === null || customFont === void 0 ? void 0 : customFont.isRTL);
      if (i3 === 0) {
        if (!xAttr.hasValue()) {
          xAttr.setValue(child.getInheritedAttribute("x"));
        }
        if (!yAttr.hasValue()) {
          yAttr.setValue(child.getInheritedAttribute("y"));
        }
        if (!dxAttr.hasValue()) {
          dxAttr.setValue(child.getInheritedAttribute("dx"));
        }
        if (!dyAttr.hasValue()) {
          dyAttr.setValue(child.getInheritedAttribute("dy"));
        }
      }
      const width = child.measureText(ctx);
      if (isRTL) {
        textParent.x -= width;
      }
      if (xAttr.hasValue()) {
        textParent.applyAnchoring();
        child.x = xAttr.getPixels("x");
        if (dxAttr.hasValue()) {
          child.x += dxAttr.getPixels("x");
        }
      } else {
        if (dxAttr.hasValue()) {
          textParent.x += dxAttr.getPixels("x");
        }
        child.x = textParent.x;
      }
      textParent.x = child.x;
      if (!isRTL) {
        textParent.x += width;
      }
      if (yAttr.hasValue()) {
        child.y = yAttr.getPixels("y");
        if (dyAttr.hasValue()) {
          child.y += dyAttr.getPixels("y");
        }
      } else {
        if (dyAttr.hasValue()) {
          textParent.y += dyAttr.getPixels("y");
        }
        child.y = textParent.y;
      }
      textParent.y = child.y;
      textParent.leafTexts.push(child);
      textParent.minX = Math.min(textParent.minX, child.x, child.x + width);
      textParent.maxX = Math.max(textParent.maxX, child.x, child.x + width);
      child.clearContext(ctx);
      ctx.restore();
      return child;
    }
    getChildBoundingBox(ctx, textParent, parent, i22) {
      const child = parent.children[i22];
      if (typeof child.getBoundingBox !== "function") {
        return null;
      }
      const boundingBox = child.getBoundingBox(ctx);
      if (boundingBox) {
        child.children.forEach((_3, i3) => {
          const childBoundingBox = textParent.getChildBoundingBox(ctx, textParent, child, i3);
          boundingBox.addBoundingBox(childBoundingBox);
        });
      }
      return boundingBox;
    }
    renderChild(ctx, textParent, parent, i3) {
      const child = parent.children[i3];
      child.render(ctx);
      child.children.forEach((_3, i4) => {
        textParent.renderChild(ctx, textParent, child, i4);
      });
    }
    measureText(ctx) {
      const { measureCache } = this;
      if (~measureCache) {
        return measureCache;
      }
      const renderText = this.getText();
      const measure = this.measureTargetText(ctx, renderText);
      this.measureCache = measure;
      return measure;
    }
    measureTargetText(ctx, targetText) {
      if (!targetText.length) {
        return 0;
      }
      const { parent } = this;
      const customFont = parent.getStyle("font-family").getDefinition();
      if (customFont) {
        const fontSize = this.getFontSize();
        const text = customFont.isRTL ? targetText.split("").reverse().join("") : targetText;
        const dx = toNumbers(parent.getAttribute("dx").getString());
        const len = text.length;
        let measure2 = 0;
        for (let i3 = 0; i3 < len; i3++) {
          const glyph = this.getGlyph(customFont, text, i3);
          measure2 += (glyph.horizAdvX || customFont.horizAdvX) * fontSize / customFont.fontFace.unitsPerEm;
          if (typeof dx[i3] !== "undefined" && !isNaN(dx[i3])) {
            measure2 += dx[i3];
          }
        }
        return measure2;
      }
      if (!ctx.measureText) {
        return targetText.length * 10;
      }
      ctx.save();
      this.setContext(ctx, true);
      const { width: measure } = ctx.measureText(targetText);
      this.clearContext(ctx);
      ctx.restore();
      return measure;
    }
    getInheritedAttribute(name) {
      let current = this;
      while (current instanceof TextElement && current.isFirstChild() && current.parent) {
        const parentAttr = current.parent.getAttribute(name);
        if (parentAttr.hasValue(true)) {
          return parentAttr.getString("0");
        }
        current = current.parent;
      }
      return null;
    }
    constructor(document2, node, captureTextNodes) {
      super(document2, node, new.target === TextElement ? true : captureTextNodes);
      this.type = "text";
      this.x = 0;
      this.y = 0;
      this.leafTexts = [];
      this.textChunkStart = 0;
      this.minX = Number.POSITIVE_INFINITY;
      this.maxX = Number.NEGATIVE_INFINITY;
      this.measureCache = -1;
    }
  };
  var TSpanElement = class extends TextElement {
    getText() {
      return this.text;
    }
    constructor(document2, node, captureTextNodes) {
      super(document2, node, new.target === TSpanElement ? true : captureTextNodes);
      this.type = "tspan";
      this.text = this.children.length > 0 ? "" : this.getTextFromNode();
    }
  };
  var TextNode = class extends TSpanElement {
    constructor(...args) {
      super(...args);
      this.type = "textNode";
    }
  };
  var PathParser = class extends _2 {
    reset() {
      this.i = -1;
      this.command = null;
      this.previousCommand = null;
      this.start = new Point(0, 0);
      this.control = new Point(0, 0);
      this.current = new Point(0, 0);
      this.points = [];
      this.angles = [];
    }
    isEnd() {
      const { i: i3, commands } = this;
      return i3 >= commands.length - 1;
    }
    next() {
      const command = this.commands[++this.i];
      this.previousCommand = this.command;
      this.command = command;
      return command;
    }
    getPoint() {
      let xProp = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "x", yProp = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "y";
      const point = new Point(this.command[xProp], this.command[yProp]);
      return this.makeAbsolute(point);
    }
    getAsControlPoint(xProp, yProp) {
      const point = this.getPoint(xProp, yProp);
      this.control = point;
      return point;
    }
    getAsCurrentPoint(xProp, yProp) {
      const point = this.getPoint(xProp, yProp);
      this.current = point;
      return point;
    }
    getReflectedControlPoint() {
      const previousCommand = this.previousCommand.type;
      if (previousCommand !== _2.CURVE_TO && previousCommand !== _2.SMOOTH_CURVE_TO && previousCommand !== _2.QUAD_TO && previousCommand !== _2.SMOOTH_QUAD_TO) {
        return this.current;
      }
      const { current: { x: cx, y: cy }, control: { x: ox, y: oy } } = this;
      const point = new Point(2 * cx - ox, 2 * cy - oy);
      return point;
    }
    makeAbsolute(point) {
      if (this.command.relative) {
        const { x, y: y2 } = this.current;
        point.x += x;
        point.y += y2;
      }
      return point;
    }
    addMarker(point, from, priorTo) {
      const { points, angles } = this;
      if (priorTo && angles.length > 0 && !angles[angles.length - 1]) {
        angles[angles.length - 1] = points[points.length - 1].angleTo(priorTo);
      }
      this.addMarkerAngle(point, from ? from.angleTo(point) : null);
    }
    addMarkerAngle(point, angle) {
      this.points.push(point);
      this.angles.push(angle);
    }
    getMarkerPoints() {
      return this.points;
    }
    getMarkerAngles() {
      const { angles } = this;
      const len = angles.length;
      for (let i3 = 0; i3 < len; i3++) {
        if (!angles[i3]) {
          for (let j2 = i3 + 1; j2 < len; j2++) {
            if (angles[j2]) {
              angles[i3] = angles[j2];
              break;
            }
          }
        }
      }
      return angles;
    }
    constructor(path) {
      super(path.replace(/([+\-.])\s+/gm, "$1").replace(/[^MmZzLlHhVvCcSsQqTtAae\d\s.,+-].*/g, ""));
      this.control = new Point(0, 0);
      this.start = new Point(0, 0);
      this.current = new Point(0, 0);
      this.command = null;
      this.commands = this.commands;
      this.i = -1;
      this.previousCommand = null;
      this.points = [];
      this.angles = [];
    }
  };
  var PathElement = class extends RenderedElement {
    path(ctx) {
      const { pathParser } = this;
      const boundingBox = new BoundingBox();
      pathParser.reset();
      if (ctx) {
        ctx.beginPath();
      }
      while (!pathParser.isEnd()) {
        switch (pathParser.next().type) {
          case PathParser.MOVE_TO:
            this.pathM(ctx, boundingBox);
            break;
          case PathParser.LINE_TO:
            this.pathL(ctx, boundingBox);
            break;
          case PathParser.HORIZ_LINE_TO:
            this.pathH(ctx, boundingBox);
            break;
          case PathParser.VERT_LINE_TO:
            this.pathV(ctx, boundingBox);
            break;
          case PathParser.CURVE_TO:
            this.pathC(ctx, boundingBox);
            break;
          case PathParser.SMOOTH_CURVE_TO:
            this.pathS(ctx, boundingBox);
            break;
          case PathParser.QUAD_TO:
            this.pathQ(ctx, boundingBox);
            break;
          case PathParser.SMOOTH_QUAD_TO:
            this.pathT(ctx, boundingBox);
            break;
          case PathParser.ARC:
            this.pathA(ctx, boundingBox);
            break;
          case PathParser.CLOSE_PATH:
            this.pathZ(ctx, boundingBox);
            break;
        }
      }
      return boundingBox;
    }
    getBoundingBox(_ctx) {
      return this.path();
    }
    getMarkers() {
      const { pathParser } = this;
      const points = pathParser.getMarkerPoints();
      const angles = pathParser.getMarkerAngles();
      const markers = points.map(
        (point, i3) => [
          point,
          angles[i3]
        ]
      );
      return markers;
    }
    renderChildren(ctx) {
      this.path(ctx);
      this.document.screen.mouse.checkPath(this, ctx);
      const fillRuleStyleProp = this.getStyle("fill-rule");
      if (ctx.fillStyle !== "") {
        if (fillRuleStyleProp.getString("inherit") !== "inherit") {
          ctx.fill(fillRuleStyleProp.getString());
        } else {
          ctx.fill();
        }
      }
      if (ctx.strokeStyle !== "") {
        if (this.getAttribute("vector-effect").getString() === "non-scaling-stroke") {
          ctx.save();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.stroke();
          ctx.restore();
        } else {
          ctx.stroke();
        }
      }
      const markers = this.getMarkers();
      if (markers) {
        const markersLastIndex = markers.length - 1;
        const markerStartStyleProp = this.getStyle("marker-start");
        const markerMidStyleProp = this.getStyle("marker-mid");
        const markerEndStyleProp = this.getStyle("marker-end");
        if (markerStartStyleProp.isUrlDefinition()) {
          const marker = markerStartStyleProp.getDefinition();
          const [point, angle] = markers[0];
          marker.render(ctx, point, angle);
        }
        if (markerMidStyleProp.isUrlDefinition()) {
          const marker = markerMidStyleProp.getDefinition();
          for (let i3 = 1; i3 < markersLastIndex; i3++) {
            const [point, angle] = markers[i3];
            marker.render(ctx, point, angle);
          }
        }
        if (markerEndStyleProp.isUrlDefinition()) {
          const marker = markerEndStyleProp.getDefinition();
          const [point, angle] = markers[markersLastIndex];
          marker.render(ctx, point, angle);
        }
      }
    }
    static pathM(pathParser) {
      const point = pathParser.getAsCurrentPoint();
      pathParser.start = pathParser.current;
      return {
        point
      };
    }
    pathM(ctx, boundingBox) {
      const { pathParser } = this;
      const { point } = PathElement.pathM(pathParser);
      const { x, y: y2 } = point;
      pathParser.addMarker(point);
      boundingBox.addPoint(x, y2);
      if (ctx) {
        ctx.moveTo(x, y2);
      }
    }
    static pathL(pathParser) {
      const { current } = pathParser;
      const point = pathParser.getAsCurrentPoint();
      return {
        current,
        point
      };
    }
    pathL(ctx, boundingBox) {
      const { pathParser } = this;
      const { current, point } = PathElement.pathL(pathParser);
      const { x, y: y2 } = point;
      pathParser.addMarker(point, current);
      boundingBox.addPoint(x, y2);
      if (ctx) {
        ctx.lineTo(x, y2);
      }
    }
    static pathH(pathParser) {
      const { current, command } = pathParser;
      const point = new Point((command.relative ? current.x : 0) + command.x, current.y);
      pathParser.current = point;
      return {
        current,
        point
      };
    }
    pathH(ctx, boundingBox) {
      const { pathParser } = this;
      const { current, point } = PathElement.pathH(pathParser);
      const { x, y: y2 } = point;
      pathParser.addMarker(point, current);
      boundingBox.addPoint(x, y2);
      if (ctx) {
        ctx.lineTo(x, y2);
      }
    }
    static pathV(pathParser) {
      const { current, command } = pathParser;
      const point = new Point(current.x, (command.relative ? current.y : 0) + command.y);
      pathParser.current = point;
      return {
        current,
        point
      };
    }
    pathV(ctx, boundingBox) {
      const { pathParser } = this;
      const { current, point } = PathElement.pathV(pathParser);
      const { x, y: y2 } = point;
      pathParser.addMarker(point, current);
      boundingBox.addPoint(x, y2);
      if (ctx) {
        ctx.lineTo(x, y2);
      }
    }
    static pathC(pathParser) {
      const { current } = pathParser;
      const point = pathParser.getPoint("x1", "y1");
      const controlPoint = pathParser.getAsControlPoint("x2", "y2");
      const currentPoint = pathParser.getAsCurrentPoint();
      return {
        current,
        point,
        controlPoint,
        currentPoint
      };
    }
    pathC(ctx, boundingBox) {
      const { pathParser } = this;
      const { current, point, controlPoint, currentPoint } = PathElement.pathC(pathParser);
      pathParser.addMarker(currentPoint, controlPoint, point);
      boundingBox.addBezierCurve(current.x, current.y, point.x, point.y, controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
      if (ctx) {
        ctx.bezierCurveTo(point.x, point.y, controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
      }
    }
    static pathS(pathParser) {
      const { current } = pathParser;
      const point = pathParser.getReflectedControlPoint();
      const controlPoint = pathParser.getAsControlPoint("x2", "y2");
      const currentPoint = pathParser.getAsCurrentPoint();
      return {
        current,
        point,
        controlPoint,
        currentPoint
      };
    }
    pathS(ctx, boundingBox) {
      const { pathParser } = this;
      const { current, point, controlPoint, currentPoint } = PathElement.pathS(pathParser);
      pathParser.addMarker(currentPoint, controlPoint, point);
      boundingBox.addBezierCurve(current.x, current.y, point.x, point.y, controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
      if (ctx) {
        ctx.bezierCurveTo(point.x, point.y, controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
      }
    }
    static pathQ(pathParser) {
      const { current } = pathParser;
      const controlPoint = pathParser.getAsControlPoint("x1", "y1");
      const currentPoint = pathParser.getAsCurrentPoint();
      return {
        current,
        controlPoint,
        currentPoint
      };
    }
    pathQ(ctx, boundingBox) {
      const { pathParser } = this;
      const { current, controlPoint, currentPoint } = PathElement.pathQ(pathParser);
      pathParser.addMarker(currentPoint, controlPoint, controlPoint);
      boundingBox.addQuadraticCurve(current.x, current.y, controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
      if (ctx) {
        ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
      }
    }
    static pathT(pathParser) {
      const { current } = pathParser;
      const controlPoint = pathParser.getReflectedControlPoint();
      pathParser.control = controlPoint;
      const currentPoint = pathParser.getAsCurrentPoint();
      return {
        current,
        controlPoint,
        currentPoint
      };
    }
    pathT(ctx, boundingBox) {
      const { pathParser } = this;
      const { current, controlPoint, currentPoint } = PathElement.pathT(pathParser);
      pathParser.addMarker(currentPoint, controlPoint, controlPoint);
      boundingBox.addQuadraticCurve(current.x, current.y, controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
      if (ctx) {
        ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
      }
    }
    static pathA(pathParser) {
      const { current, command } = pathParser;
      let { rX, rY, xRot, lArcFlag, sweepFlag } = command;
      const xAxisRotation = xRot * (Math.PI / 180);
      const currentPoint = pathParser.getAsCurrentPoint();
      const currp = new Point(Math.cos(xAxisRotation) * (current.x - currentPoint.x) / 2 + Math.sin(xAxisRotation) * (current.y - currentPoint.y) / 2, -Math.sin(xAxisRotation) * (current.x - currentPoint.x) / 2 + Math.cos(xAxisRotation) * (current.y - currentPoint.y) / 2);
      const l3 = Math.pow(currp.x, 2) / Math.pow(rX, 2) + Math.pow(currp.y, 2) / Math.pow(rY, 2);
      if (l3 > 1) {
        rX *= Math.sqrt(l3);
        rY *= Math.sqrt(l3);
      }
      let s3 = (lArcFlag === sweepFlag ? -1 : 1) * Math.sqrt((Math.pow(rX, 2) * Math.pow(rY, 2) - Math.pow(rX, 2) * Math.pow(currp.y, 2) - Math.pow(rY, 2) * Math.pow(currp.x, 2)) / (Math.pow(rX, 2) * Math.pow(currp.y, 2) + Math.pow(rY, 2) * Math.pow(currp.x, 2)));
      if (isNaN(s3)) {
        s3 = 0;
      }
      const cpp = new Point(s3 * rX * currp.y / rY, s3 * -rY * currp.x / rX);
      const centp = new Point((current.x + currentPoint.x) / 2 + Math.cos(xAxisRotation) * cpp.x - Math.sin(xAxisRotation) * cpp.y, (current.y + currentPoint.y) / 2 + Math.sin(xAxisRotation) * cpp.x + Math.cos(xAxisRotation) * cpp.y);
      const a1 = vectorsAngle([
        1,
        0
      ], [
        (currp.x - cpp.x) / rX,
        (currp.y - cpp.y) / rY
      ]);
      const u3 = [
        (currp.x - cpp.x) / rX,
        (currp.y - cpp.y) / rY
      ];
      const v3 = [
        (-currp.x - cpp.x) / rX,
        (-currp.y - cpp.y) / rY
      ];
      let ad = vectorsAngle(u3, v3);
      if (vectorsRatio(u3, v3) <= -1) {
        ad = Math.PI;
      }
      if (vectorsRatio(u3, v3) >= 1) {
        ad = 0;
      }
      return {
        currentPoint,
        rX,
        rY,
        sweepFlag,
        xAxisRotation,
        centp,
        a1,
        ad
      };
    }
    pathA(ctx, boundingBox) {
      const { pathParser } = this;
      const { currentPoint, rX, rY, sweepFlag, xAxisRotation, centp, a1, ad } = PathElement.pathA(pathParser);
      const dir = 1 - sweepFlag ? 1 : -1;
      const ah = a1 + dir * (ad / 2);
      const halfWay = new Point(centp.x + rX * Math.cos(ah), centp.y + rY * Math.sin(ah));
      pathParser.addMarkerAngle(halfWay, ah - dir * Math.PI / 2);
      pathParser.addMarkerAngle(currentPoint, ah - dir * Math.PI);
      boundingBox.addPoint(currentPoint.x, currentPoint.y);
      if (ctx && !isNaN(a1) && !isNaN(ad)) {
        const r3 = rX > rY ? rX : rY;
        const sx = rX > rY ? 1 : rX / rY;
        const sy = rX > rY ? rY / rX : 1;
        ctx.translate(centp.x, centp.y);
        ctx.rotate(xAxisRotation);
        ctx.scale(sx, sy);
        ctx.arc(0, 0, r3, a1, a1 + ad, Boolean(1 - sweepFlag));
        ctx.scale(1 / sx, 1 / sy);
        ctx.rotate(-xAxisRotation);
        ctx.translate(-centp.x, -centp.y);
      }
    }
    static pathZ(pathParser) {
      pathParser.current = pathParser.start;
    }
    pathZ(ctx, boundingBox) {
      PathElement.pathZ(this.pathParser);
      if (ctx) {
        if (boundingBox.x1 !== boundingBox.x2 && boundingBox.y1 !== boundingBox.y2) {
          ctx.closePath();
        }
      }
    }
    constructor(document2, node, captureTextNodes) {
      super(document2, node, captureTextNodes);
      this.type = "path";
      this.pathParser = new PathParser(this.getAttribute("d").getString());
    }
  };
  var SVGElement = class extends RenderedElement {
    setContext(ctx) {
      var ref;
      const { document: document2 } = this;
      const { screen, window: window2 } = document2;
      const canvas = ctx.canvas;
      screen.setDefaults(ctx);
      if ("style" in canvas && typeof ctx.font !== "undefined" && window2 && typeof window2.getComputedStyle !== "undefined") {
        ctx.font = window2.getComputedStyle(canvas).getPropertyValue("font");
        const fontSizeProp = new Property(document2, "fontSize", Font.parse(ctx.font).fontSize);
        if (fontSizeProp.hasValue()) {
          document2.rootEmSize = fontSizeProp.getPixels("y");
          document2.emSize = document2.rootEmSize;
        }
      }
      if (!this.getAttribute("x").hasValue()) {
        this.getAttribute("x", true).setValue(0);
      }
      if (!this.getAttribute("y").hasValue()) {
        this.getAttribute("y", true).setValue(0);
      }
      let { width, height } = screen.viewPort;
      if (!this.getStyle("width").hasValue()) {
        this.getStyle("width", true).setValue("100%");
      }
      if (!this.getStyle("height").hasValue()) {
        this.getStyle("height", true).setValue("100%");
      }
      if (!this.getStyle("color").hasValue()) {
        this.getStyle("color", true).setValue("black");
      }
      const refXAttr = this.getAttribute("refX");
      const refYAttr = this.getAttribute("refY");
      const viewBoxAttr = this.getAttribute("viewBox");
      const viewBox = viewBoxAttr.hasValue() ? toNumbers(viewBoxAttr.getString()) : null;
      const clip = !this.root && this.getStyle("overflow").getValue("hidden") !== "visible";
      let minX = 0;
      let minY = 0;
      let clipX = 0;
      let clipY = 0;
      if (viewBox) {
        minX = viewBox[0];
        minY = viewBox[1];
      }
      if (!this.root) {
        width = this.getStyle("width").getPixels("x");
        height = this.getStyle("height").getPixels("y");
        if (this.type === "marker") {
          clipX = minX;
          clipY = minY;
          minX = 0;
          minY = 0;
        }
      }
      screen.viewPort.setCurrent(width, height);
      if (this.node && (!this.parent || ((ref = this.node.parentNode) === null || ref === void 0 ? void 0 : ref.nodeName) === "foreignObject") && this.getStyle("transform", false, true).hasValue() && !this.getStyle("transform-origin", false, true).hasValue()) {
        this.getStyle("transform-origin", true, true).setValue("50% 50%");
      }
      super.setContext(ctx);
      ctx.translate(this.getAttribute("x").getPixels("x"), this.getAttribute("y").getPixels("y"));
      if (viewBox) {
        width = viewBox[2];
        height = viewBox[3];
      }
      document2.setViewBox({
        ctx,
        aspectRatio: this.getAttribute("preserveAspectRatio").getString(),
        width: screen.viewPort.width,
        desiredWidth: width,
        height: screen.viewPort.height,
        desiredHeight: height,
        minX,
        minY,
        refX: refXAttr.getValue(),
        refY: refYAttr.getValue(),
        clip,
        clipX,
        clipY
      });
      if (viewBox) {
        screen.viewPort.removeCurrent();
        screen.viewPort.setCurrent(width, height);
      }
    }
    clearContext(ctx) {
      super.clearContext(ctx);
      this.document.screen.viewPort.removeCurrent();
    }
    resize(width) {
      let height = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : width, preserveAspectRatio = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
      const widthAttr = this.getAttribute("width", true);
      const heightAttr = this.getAttribute("height", true);
      const viewBoxAttr = this.getAttribute("viewBox");
      const styleAttr = this.getAttribute("style");
      const originWidth = widthAttr.getNumber(0);
      const originHeight = heightAttr.getNumber(0);
      if (preserveAspectRatio) {
        if (typeof preserveAspectRatio === "string") {
          this.getAttribute("preserveAspectRatio", true).setValue(preserveAspectRatio);
        } else {
          const preserveAspectRatioAttr = this.getAttribute("preserveAspectRatio");
          if (preserveAspectRatioAttr.hasValue()) {
            preserveAspectRatioAttr.setValue(preserveAspectRatioAttr.getString().replace(/^\s*(\S.*\S)\s*$/, "$1"));
          }
        }
      }
      widthAttr.setValue(width);
      heightAttr.setValue(height);
      if (!viewBoxAttr.hasValue()) {
        viewBoxAttr.setValue("0 0 ".concat(originWidth || width, " ").concat(originHeight || height));
      }
      if (styleAttr.hasValue()) {
        const widthStyle = this.getStyle("width");
        const heightStyle = this.getStyle("height");
        if (widthStyle.hasValue()) {
          widthStyle.setValue("".concat(width, "px"));
        }
        if (heightStyle.hasValue()) {
          heightStyle.setValue("".concat(height, "px"));
        }
      }
    }
    constructor(...args) {
      super(...args);
      this.type = "svg";
      this.root = false;
    }
  };
  var RectElement = class extends PathElement {
    path(ctx) {
      const x = this.getAttribute("x").getPixels("x");
      const y2 = this.getAttribute("y").getPixels("y");
      const width = this.getStyle("width", false, true).getPixels("x");
      const height = this.getStyle("height", false, true).getPixels("y");
      const rxAttr = this.getAttribute("rx");
      const ryAttr = this.getAttribute("ry");
      let rx = rxAttr.getPixels("x");
      let ry = ryAttr.getPixels("y");
      if (rxAttr.hasValue() && !ryAttr.hasValue()) {
        ry = rx;
      }
      if (ryAttr.hasValue() && !rxAttr.hasValue()) {
        rx = ry;
      }
      rx = Math.min(rx, width / 2);
      ry = Math.min(ry, height / 2);
      if (ctx) {
        const KAPPA = 4 * ((Math.sqrt(2) - 1) / 3);
        ctx.beginPath();
        if (height > 0 && width > 0) {
          ctx.moveTo(x + rx, y2);
          ctx.lineTo(x + width - rx, y2);
          ctx.bezierCurveTo(x + width - rx + KAPPA * rx, y2, x + width, y2 + ry - KAPPA * ry, x + width, y2 + ry);
          ctx.lineTo(x + width, y2 + height - ry);
          ctx.bezierCurveTo(x + width, y2 + height - ry + KAPPA * ry, x + width - rx + KAPPA * rx, y2 + height, x + width - rx, y2 + height);
          ctx.lineTo(x + rx, y2 + height);
          ctx.bezierCurveTo(x + rx - KAPPA * rx, y2 + height, x, y2 + height - ry + KAPPA * ry, x, y2 + height - ry);
          ctx.lineTo(x, y2 + ry);
          ctx.bezierCurveTo(x, y2 + ry - KAPPA * ry, x + rx - KAPPA * rx, y2, x + rx, y2);
          ctx.closePath();
        }
      }
      return new BoundingBox(x, y2, x + width, y2 + height);
    }
    getMarkers() {
      return null;
    }
    constructor(...args) {
      super(...args);
      this.type = "rect";
    }
  };
  var CircleElement = class extends PathElement {
    path(ctx) {
      const cx = this.getAttribute("cx").getPixels("x");
      const cy = this.getAttribute("cy").getPixels("y");
      const r3 = this.getAttribute("r").getPixels();
      if (ctx && r3 > 0) {
        ctx.beginPath();
        ctx.arc(cx, cy, r3, 0, Math.PI * 2, false);
        ctx.closePath();
      }
      return new BoundingBox(cx - r3, cy - r3, cx + r3, cy + r3);
    }
    getMarkers() {
      return null;
    }
    constructor(...args) {
      super(...args);
      this.type = "circle";
    }
  };
  var EllipseElement = class extends PathElement {
    path(ctx) {
      const KAPPA = 4 * ((Math.sqrt(2) - 1) / 3);
      const rx = this.getAttribute("rx").getPixels("x");
      const ry = this.getAttribute("ry").getPixels("y");
      const cx = this.getAttribute("cx").getPixels("x");
      const cy = this.getAttribute("cy").getPixels("y");
      if (ctx && rx > 0 && ry > 0) {
        ctx.beginPath();
        ctx.moveTo(cx + rx, cy);
        ctx.bezierCurveTo(cx + rx, cy + KAPPA * ry, cx + KAPPA * rx, cy + ry, cx, cy + ry);
        ctx.bezierCurveTo(cx - KAPPA * rx, cy + ry, cx - rx, cy + KAPPA * ry, cx - rx, cy);
        ctx.bezierCurveTo(cx - rx, cy - KAPPA * ry, cx - KAPPA * rx, cy - ry, cx, cy - ry);
        ctx.bezierCurveTo(cx + KAPPA * rx, cy - ry, cx + rx, cy - KAPPA * ry, cx + rx, cy);
        ctx.closePath();
      }
      return new BoundingBox(cx - rx, cy - ry, cx + rx, cy + ry);
    }
    getMarkers() {
      return null;
    }
    constructor(...args) {
      super(...args);
      this.type = "ellipse";
    }
  };
  var LineElement = class extends PathElement {
    getPoints() {
      return [
        new Point(this.getAttribute("x1").getPixels("x"), this.getAttribute("y1").getPixels("y")),
        new Point(this.getAttribute("x2").getPixels("x"), this.getAttribute("y2").getPixels("y"))
      ];
    }
    path(ctx) {
      const [{ x: x0, y: y0 }, { x: x1, y: y1 }] = this.getPoints();
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
      }
      return new BoundingBox(x0, y0, x1, y1);
    }
    getMarkers() {
      const [p0, p1] = this.getPoints();
      const a3 = p0.angleTo(p1);
      return [
        [
          p0,
          a3
        ],
        [
          p1,
          a3
        ]
      ];
    }
    constructor(...args) {
      super(...args);
      this.type = "line";
    }
  };
  var PolylineElement = class extends PathElement {
    path(ctx) {
      const { points } = this;
      const [{ x: x0, y: y0 }] = points;
      const boundingBox = new BoundingBox(x0, y0);
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(x0, y0);
      }
      points.forEach((param) => {
        let { x, y: y2 } = param;
        boundingBox.addPoint(x, y2);
        if (ctx) {
          ctx.lineTo(x, y2);
        }
      });
      return boundingBox;
    }
    getMarkers() {
      const { points } = this;
      const lastIndex = points.length - 1;
      const markers = [];
      points.forEach((point, i3) => {
        if (i3 === lastIndex) {
          return;
        }
        markers.push([
          point,
          point.angleTo(points[i3 + 1])
        ]);
      });
      if (markers.length > 0) {
        markers.push([
          points[points.length - 1],
          markers[markers.length - 1][1]
        ]);
      }
      return markers;
    }
    constructor(document2, node, captureTextNodes) {
      super(document2, node, captureTextNodes);
      this.type = "polyline";
      this.points = [];
      this.points = Point.parsePath(this.getAttribute("points").getString());
    }
  };
  var PolygonElement = class extends PolylineElement {
    path(ctx) {
      const boundingBox = super.path(ctx);
      const [{ x, y: y2 }] = this.points;
      if (ctx) {
        ctx.lineTo(x, y2);
        ctx.closePath();
      }
      return boundingBox;
    }
    constructor(...args) {
      super(...args);
      this.type = "polygon";
    }
  };
  var PatternElement = class extends Element {
    createPattern(ctx, _3, parentOpacityProp) {
      const width = this.getStyle("width").getPixels("x", true);
      const height = this.getStyle("height").getPixels("y", true);
      const patternSvg = new SVGElement(this.document, null);
      patternSvg.attributes.viewBox = new Property(this.document, "viewBox", this.getAttribute("viewBox").getValue());
      patternSvg.attributes.width = new Property(this.document, "width", "".concat(width, "px"));
      patternSvg.attributes.height = new Property(this.document, "height", "".concat(height, "px"));
      patternSvg.attributes.transform = new Property(this.document, "transform", this.getAttribute("patternTransform").getValue());
      patternSvg.children = this.children;
      const patternCanvas = this.document.createCanvas(width, height);
      const patternCtx = patternCanvas.getContext("2d");
      const xAttr = this.getAttribute("x");
      const yAttr = this.getAttribute("y");
      if (xAttr.hasValue() && yAttr.hasValue()) {
        patternCtx.translate(xAttr.getPixels("x", true), yAttr.getPixels("y", true));
      }
      if (parentOpacityProp.hasValue()) {
        this.styles["fill-opacity"] = parentOpacityProp;
      } else {
        Reflect.deleteProperty(this.styles, "fill-opacity");
      }
      for (let x = -1; x <= 1; x++) {
        for (let y2 = -1; y2 <= 1; y2++) {
          patternCtx.save();
          patternSvg.attributes.x = new Property(this.document, "x", x * patternCanvas.width);
          patternSvg.attributes.y = new Property(this.document, "y", y2 * patternCanvas.height);
          patternSvg.render(patternCtx);
          patternCtx.restore();
        }
      }
      const pattern = ctx.createPattern(patternCanvas, "repeat");
      return pattern;
    }
    constructor(...args) {
      super(...args);
      this.type = "pattern";
    }
  };
  var MarkerElement = class extends Element {
    render(ctx, point, angle) {
      if (!point) {
        return;
      }
      const { x, y: y2 } = point;
      const orient = this.getAttribute("orient").getString("auto");
      const markerUnits = this.getAttribute("markerUnits").getString("strokeWidth");
      ctx.translate(x, y2);
      if (orient === "auto") {
        ctx.rotate(angle);
      }
      if (markerUnits === "strokeWidth") {
        ctx.scale(ctx.lineWidth, ctx.lineWidth);
      }
      ctx.save();
      const markerSvg = new SVGElement(this.document);
      markerSvg.type = this.type;
      markerSvg.attributes.viewBox = new Property(this.document, "viewBox", this.getAttribute("viewBox").getValue());
      markerSvg.attributes.refX = new Property(this.document, "refX", this.getAttribute("refX").getValue());
      markerSvg.attributes.refY = new Property(this.document, "refY", this.getAttribute("refY").getValue());
      markerSvg.attributes.width = new Property(this.document, "width", this.getAttribute("markerWidth").getValue());
      markerSvg.attributes.height = new Property(this.document, "height", this.getAttribute("markerHeight").getValue());
      markerSvg.attributes.overflow = new Property(this.document, "overflow", this.getAttribute("overflow").getValue());
      markerSvg.attributes.fill = new Property(this.document, "fill", this.getAttribute("fill").getColor("black"));
      markerSvg.attributes.stroke = new Property(this.document, "stroke", this.getAttribute("stroke").getValue("none"));
      markerSvg.children = this.children;
      markerSvg.render(ctx);
      ctx.restore();
      if (markerUnits === "strokeWidth") {
        ctx.scale(1 / ctx.lineWidth, 1 / ctx.lineWidth);
      }
      if (orient === "auto") {
        ctx.rotate(-angle);
      }
      ctx.translate(-x, -y2);
    }
    constructor(...args) {
      super(...args);
      this.type = "marker";
    }
  };
  var DefsElement = class extends Element {
    render() {
    }
    constructor(...args) {
      super(...args);
      this.type = "defs";
    }
  };
  var GElement = class extends RenderedElement {
    getBoundingBox(ctx) {
      const boundingBox = new BoundingBox();
      this.children.forEach((child) => {
        boundingBox.addBoundingBox(child.getBoundingBox(ctx));
      });
      return boundingBox;
    }
    constructor(...args) {
      super(...args);
      this.type = "g";
    }
  };
  var GradientElement = class extends Element {
    getGradientUnits() {
      return this.getAttribute("gradientUnits").getString("objectBoundingBox");
    }
    createGradient(ctx, element, parentOpacityProp) {
      let stopsContainer = this;
      if (this.getHrefAttribute().hasValue()) {
        stopsContainer = this.getHrefAttribute().getDefinition();
        this.inheritStopContainer(stopsContainer);
      }
      const { stops } = stopsContainer;
      const gradient = this.getGradient(ctx, element);
      if (!gradient) {
        return this.addParentOpacity(parentOpacityProp, stops[stops.length - 1].color);
      }
      stops.forEach((stop) => {
        gradient.addColorStop(stop.offset, this.addParentOpacity(parentOpacityProp, stop.color));
      });
      if (this.getAttribute("gradientTransform").hasValue()) {
        const { document: document2 } = this;
        const { MAX_VIRTUAL_PIXELS } = Screen;
        const { viewPort } = document2.screen;
        const rootView = viewPort.getRoot();
        const rect = new RectElement(document2);
        rect.attributes.x = new Property(document2, "x", -MAX_VIRTUAL_PIXELS / 3);
        rect.attributes.y = new Property(document2, "y", -MAX_VIRTUAL_PIXELS / 3);
        rect.attributes.width = new Property(document2, "width", MAX_VIRTUAL_PIXELS);
        rect.attributes.height = new Property(document2, "height", MAX_VIRTUAL_PIXELS);
        const group = new GElement(document2);
        group.attributes.transform = new Property(document2, "transform", this.getAttribute("gradientTransform").getValue());
        group.children = [
          rect
        ];
        const patternSvg = new SVGElement(document2);
        patternSvg.attributes.x = new Property(document2, "x", 0);
        patternSvg.attributes.y = new Property(document2, "y", 0);
        patternSvg.attributes.width = new Property(document2, "width", rootView.width);
        patternSvg.attributes.height = new Property(document2, "height", rootView.height);
        patternSvg.children = [
          group
        ];
        const patternCanvas = document2.createCanvas(rootView.width, rootView.height);
        const patternCtx = patternCanvas.getContext("2d");
        patternCtx.fillStyle = gradient;
        patternSvg.render(patternCtx);
        return patternCtx.createPattern(patternCanvas, "no-repeat");
      }
      return gradient;
    }
    inheritStopContainer(stopsContainer) {
      this.attributesToInherit.forEach((attributeToInherit) => {
        if (!this.getAttribute(attributeToInherit).hasValue() && stopsContainer.getAttribute(attributeToInherit).hasValue()) {
          this.getAttribute(attributeToInherit, true).setValue(stopsContainer.getAttribute(attributeToInherit).getValue());
        }
      });
    }
    addParentOpacity(parentOpacityProp, color) {
      if (parentOpacityProp.hasValue()) {
        const colorProp = new Property(this.document, "color", color);
        return colorProp.addOpacity(parentOpacityProp).getColor();
      }
      return color;
    }
    constructor(document2, node, captureTextNodes) {
      super(document2, node, captureTextNodes);
      this.attributesToInherit = [
        "gradientUnits"
      ];
      this.stops = [];
      const { stops, children } = this;
      children.forEach((child) => {
        if (child.type === "stop") {
          stops.push(child);
        }
      });
    }
  };
  var LinearGradientElement = class extends GradientElement {
    getGradient(ctx, element) {
      const isBoundingBoxUnits = this.getGradientUnits() === "objectBoundingBox";
      const boundingBox = isBoundingBoxUnits ? element.getBoundingBox(ctx) : null;
      if (isBoundingBoxUnits && !boundingBox) {
        return null;
      }
      if (!this.getAttribute("x1").hasValue() && !this.getAttribute("y1").hasValue() && !this.getAttribute("x2").hasValue() && !this.getAttribute("y2").hasValue()) {
        this.getAttribute("x1", true).setValue(0);
        this.getAttribute("y1", true).setValue(0);
        this.getAttribute("x2", true).setValue(1);
        this.getAttribute("y2", true).setValue(0);
      }
      const x1 = isBoundingBoxUnits ? boundingBox.x + boundingBox.width * this.getAttribute("x1").getNumber() : this.getAttribute("x1").getPixels("x");
      const y1 = isBoundingBoxUnits ? boundingBox.y + boundingBox.height * this.getAttribute("y1").getNumber() : this.getAttribute("y1").getPixels("y");
      const x2 = isBoundingBoxUnits ? boundingBox.x + boundingBox.width * this.getAttribute("x2").getNumber() : this.getAttribute("x2").getPixels("x");
      const y2 = isBoundingBoxUnits ? boundingBox.y + boundingBox.height * this.getAttribute("y2").getNumber() : this.getAttribute("y2").getPixels("y");
      if (x1 === x2 && y1 === y2) {
        return null;
      }
      return ctx.createLinearGradient(x1, y1, x2, y2);
    }
    constructor(document2, node, captureTextNodes) {
      super(document2, node, captureTextNodes);
      this.type = "linearGradient";
      this.attributesToInherit.push("x1", "y1", "x2", "y2");
    }
  };
  var RadialGradientElement = class extends GradientElement {
    getGradient(ctx, element) {
      const isBoundingBoxUnits = this.getGradientUnits() === "objectBoundingBox";
      const boundingBox = element.getBoundingBox(ctx);
      if (isBoundingBoxUnits && !boundingBox) {
        return null;
      }
      if (!this.getAttribute("cx").hasValue()) {
        this.getAttribute("cx", true).setValue("50%");
      }
      if (!this.getAttribute("cy").hasValue()) {
        this.getAttribute("cy", true).setValue("50%");
      }
      if (!this.getAttribute("r").hasValue()) {
        this.getAttribute("r", true).setValue("50%");
      }
      const cx = isBoundingBoxUnits ? boundingBox.x + boundingBox.width * this.getAttribute("cx").getNumber() : this.getAttribute("cx").getPixels("x");
      const cy = isBoundingBoxUnits ? boundingBox.y + boundingBox.height * this.getAttribute("cy").getNumber() : this.getAttribute("cy").getPixels("y");
      let fx2 = cx;
      let fy = cy;
      if (this.getAttribute("fx").hasValue()) {
        fx2 = isBoundingBoxUnits ? boundingBox.x + boundingBox.width * this.getAttribute("fx").getNumber() : this.getAttribute("fx").getPixels("x");
      }
      if (this.getAttribute("fy").hasValue()) {
        fy = isBoundingBoxUnits ? boundingBox.y + boundingBox.height * this.getAttribute("fy").getNumber() : this.getAttribute("fy").getPixels("y");
      }
      const r3 = isBoundingBoxUnits ? (boundingBox.width + boundingBox.height) / 2 * this.getAttribute("r").getNumber() : this.getAttribute("r").getPixels();
      const fr = this.getAttribute("fr").getPixels();
      return ctx.createRadialGradient(fx2, fy, fr, cx, cy, r3);
    }
    constructor(document2, node, captureTextNodes) {
      super(document2, node, captureTextNodes);
      this.type = "radialGradient";
      this.attributesToInherit.push("cx", "cy", "r", "fx", "fy", "fr");
    }
  };
  var StopElement = class extends Element {
    constructor(document2, node, captureTextNodes) {
      super(document2, node, captureTextNodes);
      this.type = "stop";
      const offset = Math.max(0, Math.min(1, this.getAttribute("offset").getNumber()));
      const stopOpacity = this.getStyle("stop-opacity");
      let stopColor = this.getStyle("stop-color", true);
      if (stopColor.getString() === "") {
        stopColor.setValue("#000");
      }
      if (stopOpacity.hasValue()) {
        stopColor = stopColor.addOpacity(stopOpacity);
      }
      this.offset = offset;
      this.color = stopColor.getColor();
    }
  };
  var AnimateElement = class extends Element {
    getProperty() {
      const attributeType = this.getAttribute("attributeType").getString();
      const attributeName = this.getAttribute("attributeName").getString();
      if (attributeType === "CSS") {
        return this.parent.getStyle(attributeName, true);
      }
      return this.parent.getAttribute(attributeName, true);
    }
    calcValue() {
      const { initialUnits } = this;
      const { progress, from, to } = this.getProgress();
      let newValue = from.getNumber() + (to.getNumber() - from.getNumber()) * progress;
      if (initialUnits === "%") {
        newValue *= 100;
      }
      return "".concat(newValue).concat(initialUnits);
    }
    update(delta) {
      const { parent } = this;
      const prop = this.getProperty();
      if (!this.initialValue) {
        this.initialValue = prop.getString();
        this.initialUnits = prop.getUnits();
      }
      if (this.duration > this.maxDuration) {
        const fill = this.getAttribute("fill").getString("remove");
        if (this.getAttribute("repeatCount").getString() === "indefinite" || this.getAttribute("repeatDur").getString() === "indefinite") {
          this.duration = 0;
        } else if (fill === "freeze" && !this.frozen) {
          this.frozen = true;
          if (parent && prop) {
            parent.animationFrozen = true;
            parent.animationFrozenValue = prop.getString();
          }
        } else if (fill === "remove" && !this.removed) {
          this.removed = true;
          if (parent && prop) {
            prop.setValue(parent.animationFrozen ? parent.animationFrozenValue : this.initialValue);
          }
          return true;
        }
        return false;
      }
      this.duration += delta;
      let updated = false;
      if (this.begin < this.duration) {
        let newValue = this.calcValue();
        const typeAttr = this.getAttribute("type");
        if (typeAttr.hasValue()) {
          const type = typeAttr.getString();
          newValue = "".concat(type, "(").concat(newValue, ")");
        }
        prop.setValue(newValue);
        updated = true;
      }
      return updated;
    }
    getProgress() {
      const { document: document2, values } = this;
      let progress = (this.duration - this.begin) / (this.maxDuration - this.begin);
      let from;
      let to;
      if (values.hasValue()) {
        const p3 = progress * (values.getValue().length - 1);
        const lb = Math.floor(p3);
        const ub = Math.ceil(p3);
        let value;
        value = values.getValue()[lb];
        from = new Property(document2, "from", value ? parseFloat(value) : 0);
        value = values.getValue()[ub];
        to = new Property(document2, "to", value ? parseFloat(value) : 0);
        progress = (p3 - lb) / (ub - lb);
      } else {
        from = this.from;
        to = this.to;
      }
      return {
        progress,
        from,
        to
      };
    }
    constructor(document2, node, captureTextNodes) {
      super(document2, node, captureTextNodes);
      this.type = "animate";
      this.duration = 0;
      this.initialUnits = "";
      this.removed = false;
      this.frozen = false;
      document2.screen.animations.push(this);
      this.begin = this.getAttribute("begin").getMilliseconds();
      this.maxDuration = this.begin + this.getAttribute("dur").getMilliseconds();
      this.from = this.getAttribute("from");
      this.to = this.getAttribute("to");
      this.values = new Property(document2, "values", null);
      const valuesAttr = this.getAttribute("values");
      if (valuesAttr.hasValue()) {
        this.values.setValue(valuesAttr.getString().split(";"));
      }
    }
  };
  var AnimateColorElement = class extends AnimateElement {
    calcValue() {
      const { progress, from, to } = this.getProgress();
      const colorFrom = new import_rgbcolor.default(from.getColor());
      const colorTo = new import_rgbcolor.default(to.getColor());
      if (colorFrom.ok && colorTo.ok) {
        const r3 = colorFrom.r + (colorTo.r - colorFrom.r) * progress;
        const g2 = colorFrom.g + (colorTo.g - colorFrom.g) * progress;
        const b2 = colorFrom.b + (colorTo.b - colorFrom.b) * progress;
        return "rgb(".concat(Math.floor(r3), ", ").concat(Math.floor(g2), ", ").concat(Math.floor(b2), ")");
      }
      return this.getAttribute("from").getColor();
    }
    constructor(...args) {
      super(...args);
      this.type = "animateColor";
    }
  };
  var AnimateTransformElement = class extends AnimateElement {
    calcValue() {
      const { progress, from: from1, to: to1 } = this.getProgress();
      const transformFrom = toNumbers(from1.getString());
      const transformTo = toNumbers(to1.getString());
      const newValue = transformFrom.map((from, i3) => {
        const to = transformTo[i3];
        return from + (to - from) * progress;
      }).join(" ");
      return newValue;
    }
    constructor(...args) {
      super(...args);
      this.type = "animateTransform";
    }
  };
  var FontFaceElement = class extends Element {
    constructor(document2, node, captureTextNodes) {
      super(document2, node, captureTextNodes);
      this.type = "font-face";
      this.ascent = this.getAttribute("ascent").getNumber();
      this.descent = this.getAttribute("descent").getNumber();
      this.unitsPerEm = this.getAttribute("units-per-em").getNumber();
    }
  };
  var GlyphElement = class extends PathElement {
    constructor(document2, node, captureTextNodes) {
      super(document2, node, captureTextNodes);
      this.type = "glyph";
      this.horizAdvX = this.getAttribute("horiz-adv-x").getNumber();
      this.unicode = this.getAttribute("unicode").getString();
      this.arabicForm = this.getAttribute("arabic-form").getString();
    }
  };
  var MissingGlyphElement = class extends GlyphElement {
    constructor(...args) {
      super(...args);
      this.type = "missing-glyph";
      this.horizAdvX = 0;
    }
  };
  var FontElement = class extends Element {
    render() {
    }
    constructor(document2, node, captureTextNodes) {
      super(document2, node, captureTextNodes);
      this.type = "font";
      this.isArabic = false;
      this.glyphs = {};
      this.arabicGlyphs = {};
      this.isRTL = false;
      this.horizAdvX = this.getAttribute("horiz-adv-x").getNumber();
      const { definitions } = document2;
      const { children } = this;
      for (const child of children) {
        if (child instanceof FontFaceElement) {
          this.fontFace = child;
          const fontFamilyStyle = child.getStyle("font-family");
          if (fontFamilyStyle.hasValue()) {
            definitions[fontFamilyStyle.getString()] = this;
          }
        } else if (child instanceof MissingGlyphElement) {
          this.missingGlyph = child;
        } else if (child instanceof GlyphElement) {
          if (child.arabicForm) {
            this.isRTL = true;
            this.isArabic = true;
            const arabicGlyph = this.arabicGlyphs[child.unicode];
            if (typeof arabicGlyph === "undefined") {
              this.arabicGlyphs[child.unicode] = {
                [child.arabicForm]: child
              };
            } else {
              arabicGlyph[child.arabicForm] = child;
            }
          } else {
            this.glyphs[child.unicode] = child;
          }
        }
      }
    }
  };
  var TRefElement = class extends TextElement {
    getText() {
      const element = this.getHrefAttribute().getDefinition();
      if (element) {
        const firstChild = element.children[0];
        if (firstChild) {
          return firstChild.getText();
        }
      }
      return "";
    }
    constructor(...args) {
      super(...args);
      this.type = "tref";
    }
  };
  var AElement = class extends TextElement {
    getText() {
      return this.text;
    }
    renderChildren(ctx) {
      if (this.hasText) {
        super.renderChildren(ctx);
        const { document: document2, x, y: y2 } = this;
        const { mouse } = document2.screen;
        const fontSize = new Property(document2, "fontSize", Font.parse(document2.ctx.font).fontSize);
        if (mouse.isWorking()) {
          mouse.checkBoundingBox(this, new BoundingBox(x, y2 - fontSize.getPixels("y"), x + this.measureText(ctx), y2));
        }
      } else if (this.children.length > 0) {
        const g2 = new GElement(this.document);
        g2.children = this.children;
        g2.parent = this;
        g2.render(ctx);
      }
    }
    onClick() {
      const { window: window2 } = this.document;
      if (window2) {
        window2.open(this.getHrefAttribute().getString());
      }
    }
    onMouseMove() {
      const ctx = this.document.ctx;
      ctx.canvas.style.cursor = "pointer";
    }
    constructor(document2, node1, captureTextNodes) {
      super(document2, node1, captureTextNodes);
      this.type = "a";
      const { childNodes } = node1;
      const firstChild = childNodes[0];
      const hasText = childNodes.length > 0 && Array.from(childNodes).every(
        (node) => node.nodeType === 3
      );
      this.hasText = hasText;
      this.text = hasText ? this.getTextFromNode(firstChild) : "";
    }
  };
  var TextPathElement = class extends TextElement {
    getText() {
      return this.text;
    }
    path(ctx) {
      const { dataArray } = this;
      if (ctx) {
        ctx.beginPath();
      }
      dataArray.forEach((param) => {
        let { type, points } = param;
        switch (type) {
          case PathParser.LINE_TO:
            if (ctx) {
              ctx.lineTo(points[0], points[1]);
            }
            break;
          case PathParser.MOVE_TO:
            if (ctx) {
              ctx.moveTo(points[0], points[1]);
            }
            break;
          case PathParser.CURVE_TO:
            if (ctx) {
              ctx.bezierCurveTo(points[0], points[1], points[2], points[3], points[4], points[5]);
            }
            break;
          case PathParser.QUAD_TO:
            if (ctx) {
              ctx.quadraticCurveTo(points[0], points[1], points[2], points[3]);
            }
            break;
          case PathParser.ARC: {
            const [cx, cy, rx, ry, theta, dTheta, psi, fs] = points;
            const r3 = rx > ry ? rx : ry;
            const scaleX = rx > ry ? 1 : rx / ry;
            const scaleY = rx > ry ? ry / rx : 1;
            if (ctx) {
              ctx.translate(cx, cy);
              ctx.rotate(psi);
              ctx.scale(scaleX, scaleY);
              ctx.arc(0, 0, r3, theta, theta + dTheta, Boolean(1 - fs));
              ctx.scale(1 / scaleX, 1 / scaleY);
              ctx.rotate(-psi);
              ctx.translate(-cx, -cy);
            }
            break;
          }
          case PathParser.CLOSE_PATH:
            if (ctx) {
              ctx.closePath();
            }
            break;
        }
      });
    }
    renderChildren(ctx) {
      this.setTextData(ctx);
      ctx.save();
      const textDecoration = this.parent.getStyle("text-decoration").getString();
      const fontSize = this.getFontSize();
      const { glyphInfo } = this;
      const fill = ctx.fillStyle;
      if (textDecoration === "underline") {
        ctx.beginPath();
      }
      glyphInfo.forEach((glyph, i3) => {
        const { p0, p1, rotation, text: partialText } = glyph;
        ctx.save();
        ctx.translate(p0.x, p0.y);
        ctx.rotate(rotation);
        if (ctx.fillStyle) {
          ctx.fillText(partialText, 0, 0);
        }
        if (ctx.strokeStyle) {
          ctx.strokeText(partialText, 0, 0);
        }
        ctx.restore();
        if (textDecoration === "underline") {
          if (i3 === 0) {
            ctx.moveTo(p0.x, p0.y + fontSize / 8);
          }
          ctx.lineTo(p1.x, p1.y + fontSize / 5);
        }
      });
      if (textDecoration === "underline") {
        ctx.lineWidth = fontSize / 20;
        ctx.strokeStyle = fill;
        ctx.stroke();
        ctx.closePath();
      }
      ctx.restore();
    }
    getLetterSpacingAt() {
      let idx = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
      return this.letterSpacingCache[idx] || 0;
    }
    findSegmentToFitChar(ctx, anchor, textFullWidth, fullPathWidth, spacesNumber, inputOffset, dy, c4, charI) {
      let offset = inputOffset;
      let glyphWidth = this.measureText(ctx, c4);
      if (c4 === " " && anchor === "justify" && textFullWidth < fullPathWidth) {
        glyphWidth += (fullPathWidth - textFullWidth) / spacesNumber;
      }
      if (charI > -1) {
        offset += this.getLetterSpacingAt(charI);
      }
      const splineStep = this.textHeight / 20;
      const p0 = this.getEquidistantPointOnPath(offset, splineStep, 0);
      const p1 = this.getEquidistantPointOnPath(offset + glyphWidth, splineStep, 0);
      const segment = {
        p0,
        p1
      };
      const rotation = p0 && p1 ? Math.atan2(p1.y - p0.y, p1.x - p0.x) : 0;
      if (dy) {
        const dyX = Math.cos(Math.PI / 2 + rotation) * dy;
        const dyY = Math.cos(-rotation) * dy;
        segment.p0 = {
          ...p0,
          x: p0.x + dyX,
          y: p0.y + dyY
        };
        segment.p1 = {
          ...p1,
          x: p1.x + dyX,
          y: p1.y + dyY
        };
      }
      offset += glyphWidth;
      return {
        offset,
        segment,
        rotation
      };
    }
    measureText(ctx, text) {
      const { measuresCache } = this;
      const targetText = text || this.getText();
      if (measuresCache.has(targetText)) {
        return measuresCache.get(targetText);
      }
      const measure = this.measureTargetText(ctx, targetText);
      measuresCache.set(targetText, measure);
      return measure;
    }
    setTextData(ctx) {
      if (this.glyphInfo) {
        return;
      }
      const renderText = this.getText();
      const chars = renderText.split("");
      const spacesNumber = renderText.split(" ").length - 1;
      const dx = this.parent.getAttribute("dx").split().map(
        (_3) => _3.getPixels("x")
      );
      const dy = this.parent.getAttribute("dy").getPixels("y");
      const anchor = this.parent.getStyle("text-anchor").getString("start");
      const thisSpacing = this.getStyle("letter-spacing");
      const parentSpacing = this.parent.getStyle("letter-spacing");
      let letterSpacing = 0;
      if (!thisSpacing.hasValue() || thisSpacing.getValue() === "inherit") {
        letterSpacing = parentSpacing.getPixels();
      } else if (thisSpacing.hasValue()) {
        if (thisSpacing.getValue() !== "initial" && thisSpacing.getValue() !== "unset") {
          letterSpacing = thisSpacing.getPixels();
        }
      }
      const letterSpacingCache = [];
      const textLen = renderText.length;
      this.letterSpacingCache = letterSpacingCache;
      for (let i1 = 0; i1 < textLen; i1++) {
        letterSpacingCache.push(typeof dx[i1] !== "undefined" ? dx[i1] : letterSpacing);
      }
      const dxSum = letterSpacingCache.reduce(
        (acc, cur, i3) => i3 === 0 ? 0 : acc + cur || 0,
        0
      );
      const textWidth = this.measureText(ctx);
      const textFullWidth = Math.max(textWidth + dxSum, 0);
      this.textWidth = textWidth;
      this.textHeight = this.getFontSize();
      this.glyphInfo = [];
      const fullPathWidth = this.getPathLength();
      const startOffset = this.getStyle("startOffset").getNumber(0) * fullPathWidth;
      let offset = 0;
      if (anchor === "middle" || anchor === "center") {
        offset = -textFullWidth / 2;
      }
      if (anchor === "end" || anchor === "right") {
        offset = -textFullWidth;
      }
      offset += startOffset;
      chars.forEach((char, i3) => {
        const { offset: nextOffset, segment, rotation } = this.findSegmentToFitChar(ctx, anchor, textFullWidth, fullPathWidth, spacesNumber, offset, dy, char, i3);
        offset = nextOffset;
        if (!segment.p0 || !segment.p1) {
          return;
        }
        this.glyphInfo.push({
          text: chars[i3],
          p0: segment.p0,
          p1: segment.p1,
          rotation
        });
      });
    }
    parsePathData(path) {
      this.pathLength = -1;
      if (!path) {
        return [];
      }
      const pathCommands = [];
      const { pathParser } = path;
      pathParser.reset();
      while (!pathParser.isEnd()) {
        const { current } = pathParser;
        const startX = current ? current.x : 0;
        const startY = current ? current.y : 0;
        const command = pathParser.next();
        let nextCommandType = command.type;
        let points = [];
        switch (command.type) {
          case PathParser.MOVE_TO:
            this.pathM(pathParser, points);
            break;
          case PathParser.LINE_TO:
            nextCommandType = this.pathL(pathParser, points);
            break;
          case PathParser.HORIZ_LINE_TO:
            nextCommandType = this.pathH(pathParser, points);
            break;
          case PathParser.VERT_LINE_TO:
            nextCommandType = this.pathV(pathParser, points);
            break;
          case PathParser.CURVE_TO:
            this.pathC(pathParser, points);
            break;
          case PathParser.SMOOTH_CURVE_TO:
            nextCommandType = this.pathS(pathParser, points);
            break;
          case PathParser.QUAD_TO:
            this.pathQ(pathParser, points);
            break;
          case PathParser.SMOOTH_QUAD_TO:
            nextCommandType = this.pathT(pathParser, points);
            break;
          case PathParser.ARC:
            points = this.pathA(pathParser);
            break;
          case PathParser.CLOSE_PATH:
            PathElement.pathZ(pathParser);
            break;
        }
        if (command.type !== PathParser.CLOSE_PATH) {
          pathCommands.push({
            type: nextCommandType,
            points,
            start: {
              x: startX,
              y: startY
            },
            pathLength: this.calcLength(startX, startY, nextCommandType, points)
          });
        } else {
          pathCommands.push({
            type: PathParser.CLOSE_PATH,
            points: [],
            pathLength: 0
          });
        }
      }
      return pathCommands;
    }
    pathM(pathParser, points) {
      const { x, y: y2 } = PathElement.pathM(pathParser).point;
      points.push(x, y2);
    }
    pathL(pathParser, points) {
      const { x, y: y2 } = PathElement.pathL(pathParser).point;
      points.push(x, y2);
      return PathParser.LINE_TO;
    }
    pathH(pathParser, points) {
      const { x, y: y2 } = PathElement.pathH(pathParser).point;
      points.push(x, y2);
      return PathParser.LINE_TO;
    }
    pathV(pathParser, points) {
      const { x, y: y2 } = PathElement.pathV(pathParser).point;
      points.push(x, y2);
      return PathParser.LINE_TO;
    }
    pathC(pathParser, points) {
      const { point, controlPoint, currentPoint } = PathElement.pathC(pathParser);
      points.push(point.x, point.y, controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
    }
    pathS(pathParser, points) {
      const { point, controlPoint, currentPoint } = PathElement.pathS(pathParser);
      points.push(point.x, point.y, controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
      return PathParser.CURVE_TO;
    }
    pathQ(pathParser, points) {
      const { controlPoint, currentPoint } = PathElement.pathQ(pathParser);
      points.push(controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
    }
    pathT(pathParser, points) {
      const { controlPoint, currentPoint } = PathElement.pathT(pathParser);
      points.push(controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
      return PathParser.QUAD_TO;
    }
    pathA(pathParser) {
      let { rX, rY, sweepFlag, xAxisRotation, centp, a1, ad } = PathElement.pathA(pathParser);
      if (sweepFlag === 0 && ad > 0) {
        ad -= 2 * Math.PI;
      }
      if (sweepFlag === 1 && ad < 0) {
        ad += 2 * Math.PI;
      }
      return [
        centp.x,
        centp.y,
        rX,
        rY,
        a1,
        ad,
        xAxisRotation,
        sweepFlag
      ];
    }
    calcLength(x, y2, commandType, points) {
      let len = 0;
      let p1 = null;
      let p22 = null;
      let t3 = 0;
      switch (commandType) {
        case PathParser.LINE_TO:
          return this.getLineLength(x, y2, points[0], points[1]);
        case PathParser.CURVE_TO:
          len = 0;
          p1 = this.getPointOnCubicBezier(0, x, y2, points[0], points[1], points[2], points[3], points[4], points[5]);
          for (t3 = 0.01; t3 <= 1; t3 += 0.01) {
            p22 = this.getPointOnCubicBezier(t3, x, y2, points[0], points[1], points[2], points[3], points[4], points[5]);
            len += this.getLineLength(p1.x, p1.y, p22.x, p22.y);
            p1 = p22;
          }
          return len;
        case PathParser.QUAD_TO:
          len = 0;
          p1 = this.getPointOnQuadraticBezier(0, x, y2, points[0], points[1], points[2], points[3]);
          for (t3 = 0.01; t3 <= 1; t3 += 0.01) {
            p22 = this.getPointOnQuadraticBezier(t3, x, y2, points[0], points[1], points[2], points[3]);
            len += this.getLineLength(p1.x, p1.y, p22.x, p22.y);
            p1 = p22;
          }
          return len;
        case PathParser.ARC: {
          len = 0;
          const start = points[4];
          const dTheta = points[5];
          const end = points[4] + dTheta;
          let inc = Math.PI / 180;
          if (Math.abs(start - end) < inc) {
            inc = Math.abs(start - end);
          }
          p1 = this.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], start, 0);
          if (dTheta < 0) {
            for (t3 = start - inc; t3 > end; t3 -= inc) {
              p22 = this.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t3, 0);
              len += this.getLineLength(p1.x, p1.y, p22.x, p22.y);
              p1 = p22;
            }
          } else {
            for (t3 = start + inc; t3 < end; t3 += inc) {
              p22 = this.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t3, 0);
              len += this.getLineLength(p1.x, p1.y, p22.x, p22.y);
              p1 = p22;
            }
          }
          p22 = this.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], end, 0);
          len += this.getLineLength(p1.x, p1.y, p22.x, p22.y);
          return len;
        }
      }
      return 0;
    }
    getPointOnLine(dist, p1x, p1y, p2x, p2y) {
      let fromX = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : p1x, fromY = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : p1y;
      const m4 = (p2y - p1y) / (p2x - p1x + PSEUDO_ZERO);
      let run = Math.sqrt(dist * dist / (1 + m4 * m4));
      if (p2x < p1x) {
        run *= -1;
      }
      let rise = m4 * run;
      let pt = null;
      if (p2x === p1x) {
        pt = {
          x: fromX,
          y: fromY + rise
        };
      } else if ((fromY - p1y) / (fromX - p1x + PSEUDO_ZERO) === m4) {
        pt = {
          x: fromX + run,
          y: fromY + rise
        };
      } else {
        let ix = 0;
        let iy = 0;
        const len = this.getLineLength(p1x, p1y, p2x, p2y);
        if (len < PSEUDO_ZERO) {
          return null;
        }
        let u3 = (fromX - p1x) * (p2x - p1x) + (fromY - p1y) * (p2y - p1y);
        u3 /= len * len;
        ix = p1x + u3 * (p2x - p1x);
        iy = p1y + u3 * (p2y - p1y);
        const pRise = this.getLineLength(fromX, fromY, ix, iy);
        const pRun = Math.sqrt(dist * dist - pRise * pRise);
        run = Math.sqrt(pRun * pRun / (1 + m4 * m4));
        if (p2x < p1x) {
          run *= -1;
        }
        rise = m4 * run;
        pt = {
          x: ix + run,
          y: iy + rise
        };
      }
      return pt;
    }
    getPointOnPath(distance) {
      const fullLen = this.getPathLength();
      let cumulativePathLength = 0;
      let p3 = null;
      if (distance < -5e-5 || distance - 5e-5 > fullLen) {
        return null;
      }
      const { dataArray } = this;
      for (const command of dataArray) {
        if (command && (command.pathLength < 5e-5 || cumulativePathLength + command.pathLength + 5e-5 < distance)) {
          cumulativePathLength += command.pathLength;
          continue;
        }
        const delta = distance - cumulativePathLength;
        let currentT = 0;
        switch (command.type) {
          case PathParser.LINE_TO:
            p3 = this.getPointOnLine(delta, command.start.x, command.start.y, command.points[0], command.points[1], command.start.x, command.start.y);
            break;
          case PathParser.ARC: {
            const start = command.points[4];
            const dTheta = command.points[5];
            const end = command.points[4] + dTheta;
            currentT = start + delta / command.pathLength * dTheta;
            if (dTheta < 0 && currentT < end || dTheta >= 0 && currentT > end) {
              break;
            }
            p3 = this.getPointOnEllipticalArc(command.points[0], command.points[1], command.points[2], command.points[3], currentT, command.points[6]);
            break;
          }
          case PathParser.CURVE_TO:
            currentT = delta / command.pathLength;
            if (currentT > 1) {
              currentT = 1;
            }
            p3 = this.getPointOnCubicBezier(currentT, command.start.x, command.start.y, command.points[0], command.points[1], command.points[2], command.points[3], command.points[4], command.points[5]);
            break;
          case PathParser.QUAD_TO:
            currentT = delta / command.pathLength;
            if (currentT > 1) {
              currentT = 1;
            }
            p3 = this.getPointOnQuadraticBezier(currentT, command.start.x, command.start.y, command.points[0], command.points[1], command.points[2], command.points[3]);
            break;
        }
        if (p3) {
          return p3;
        }
        break;
      }
      return null;
    }
    getLineLength(x1, y1, x2, y2) {
      return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }
    getPathLength() {
      if (this.pathLength === -1) {
        this.pathLength = this.dataArray.reduce(
          (length, command) => command.pathLength > 0 ? length + command.pathLength : length,
          0
        );
      }
      return this.pathLength;
    }
    getPointOnCubicBezier(pct, p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y) {
      const x = p4x * CB1(pct) + p3x * CB2(pct) + p2x * CB3(pct) + p1x * CB4(pct);
      const y2 = p4y * CB1(pct) + p3y * CB2(pct) + p2y * CB3(pct) + p1y * CB4(pct);
      return {
        x,
        y: y2
      };
    }
    getPointOnQuadraticBezier(pct, p1x, p1y, p2x, p2y, p3x, p3y) {
      const x = p3x * QB1(pct) + p2x * QB2(pct) + p1x * QB3(pct);
      const y2 = p3y * QB1(pct) + p2y * QB2(pct) + p1y * QB3(pct);
      return {
        x,
        y: y2
      };
    }
    getPointOnEllipticalArc(cx, cy, rx, ry, theta, psi) {
      const cosPsi = Math.cos(psi);
      const sinPsi = Math.sin(psi);
      const pt = {
        x: rx * Math.cos(theta),
        y: ry * Math.sin(theta)
      };
      return {
        x: cx + (pt.x * cosPsi - pt.y * sinPsi),
        y: cy + (pt.x * sinPsi + pt.y * cosPsi)
      };
    }
    buildEquidistantCache(inputStep, inputPrecision) {
      const fullLen = this.getPathLength();
      const precision = inputPrecision || 0.25;
      const step = inputStep || fullLen / 100;
      if (!this.equidistantCache || this.equidistantCache.step !== step || this.equidistantCache.precision !== precision) {
        this.equidistantCache = {
          step,
          precision,
          points: []
        };
        let s3 = 0;
        for (let l3 = 0; l3 <= fullLen; l3 += precision) {
          const p0 = this.getPointOnPath(l3);
          const p1 = this.getPointOnPath(l3 + precision);
          if (!p0 || !p1) {
            continue;
          }
          s3 += this.getLineLength(p0.x, p0.y, p1.x, p1.y);
          if (s3 >= step) {
            this.equidistantCache.points.push({
              x: p0.x,
              y: p0.y,
              distance: l3
            });
            s3 -= step;
          }
        }
      }
    }
    getEquidistantPointOnPath(targetDistance, step, precision) {
      this.buildEquidistantCache(step, precision);
      if (targetDistance < 0 || targetDistance - this.getPathLength() > 5e-5) {
        return null;
      }
      const idx = Math.round(targetDistance / this.getPathLength() * (this.equidistantCache.points.length - 1));
      return this.equidistantCache.points[idx] || null;
    }
    constructor(document2, node, captureTextNodes) {
      super(document2, node, captureTextNodes);
      this.type = "textPath";
      this.textWidth = 0;
      this.textHeight = 0;
      this.pathLength = -1;
      this.glyphInfo = null;
      this.letterSpacingCache = [];
      this.measuresCache = /* @__PURE__ */ new Map([
        [
          "",
          0
        ]
      ]);
      const pathElement = this.getHrefAttribute().getDefinition();
      this.text = this.getTextFromNode();
      this.dataArray = this.parsePathData(pathElement);
    }
  };
  var dataUriRegex = /^\s*data:(([^/,;]+\/[^/,;]+)(?:;([^,;=]+=[^,;=]+))?)?(?:;(base64))?,(.*)$/i;
  var ImageElement = class extends RenderedElement {
    async loadImage(href) {
      try {
        const image = await this.document.createImage(href);
        this.image = image;
      } catch (err) {
        console.error('Error while loading image "'.concat(href, '":'), err);
      }
      this.loaded = true;
    }
    async loadSvg(href) {
      const match = dataUriRegex.exec(href);
      if (match) {
        const data = match[5];
        if (data) {
          if (match[4] === "base64") {
            this.image = atob(data);
          } else {
            this.image = decodeURIComponent(data);
          }
        }
      } else {
        try {
          const response = await this.document.fetch(href);
          const svg = await response.text();
          this.image = svg;
        } catch (err) {
          console.error('Error while loading image "'.concat(href, '":'), err);
        }
      }
      this.loaded = true;
    }
    renderChildren(ctx) {
      const { document: document2, image, loaded } = this;
      const x = this.getAttribute("x").getPixels("x");
      const y2 = this.getAttribute("y").getPixels("y");
      const width = this.getStyle("width").getPixels("x");
      const height = this.getStyle("height").getPixels("y");
      if (!loaded || !image || !width || !height) {
        return;
      }
      ctx.save();
      ctx.translate(x, y2);
      if (typeof image === "string") {
        const subDocument = document2.canvg.forkString(ctx, image, {
          ignoreMouse: true,
          ignoreAnimation: true,
          ignoreDimensions: true,
          ignoreClear: true,
          offsetX: 0,
          offsetY: 0,
          scaleWidth: width,
          scaleHeight: height
        });
        const { documentElement } = subDocument.document;
        if (documentElement) {
          documentElement.parent = this;
        }
        void subDocument.render();
      } else {
        document2.setViewBox({
          ctx,
          aspectRatio: this.getAttribute("preserveAspectRatio").getString(),
          width,
          desiredWidth: image.width,
          height,
          desiredHeight: image.height
        });
        if (this.loaded) {
          if (!("complete" in image) || image.complete) {
            ctx.drawImage(image, 0, 0);
          }
        }
      }
      ctx.restore();
    }
    getBoundingBox() {
      const x = this.getAttribute("x").getPixels("x");
      const y2 = this.getAttribute("y").getPixels("y");
      const width = this.getStyle("width").getPixels("x");
      const height = this.getStyle("height").getPixels("y");
      return new BoundingBox(x, y2, x + width, y2 + height);
    }
    constructor(document2, node, captureTextNodes) {
      super(document2, node, captureTextNodes);
      this.type = "image";
      this.loaded = false;
      const href = this.getHrefAttribute().getString();
      if (!href) {
        return;
      }
      const isSvg = href.endsWith(".svg") || /^\s*data:image\/svg\+xml/i.test(href);
      document2.images.push(this);
      if (!isSvg) {
        void this.loadImage(href);
      } else {
        void this.loadSvg(href);
      }
    }
  };
  var SymbolElement = class extends RenderedElement {
    render(_3) {
    }
    constructor(...args) {
      super(...args);
      this.type = "symbol";
    }
  };
  var SVGFontLoader = class {
    async load(fontFamily, url) {
      try {
        const { document: document2 } = this;
        const svgDocument = await document2.canvg.parser.load(url);
        const fonts = svgDocument.getElementsByTagName("font");
        Array.from(fonts).forEach((fontNode) => {
          const font = document2.createElement(fontNode);
          document2.definitions[fontFamily] = font;
        });
      } catch (err) {
        console.error('Error while loading font "'.concat(url, '":'), err);
      }
      this.loaded = true;
    }
    constructor(document2) {
      this.document = document2;
      this.loaded = false;
      document2.fonts.push(this);
    }
  };
  var StyleElement = class extends Element {
    constructor(document2, node, captureTextNodes) {
      super(document2, node, captureTextNodes);
      this.type = "style";
      const css = compressSpaces(
        Array.from(node.childNodes).map(
          (_3) => _3.textContent
        ).join("").replace(/(\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/)|(^[\s]*\/\/.*)/gm, "").replace(/@import.*;/g, "")
      );
      const cssDefs = css.split("}");
      cssDefs.forEach((_1) => {
        const def = _1.trim();
        if (!def) {
          return;
        }
        const cssParts = def.split("{");
        const cssClasses = cssParts[0].split(",");
        const cssProps = cssParts[1].split(";");
        cssClasses.forEach((_3) => {
          const cssClass = _3.trim();
          if (!cssClass) {
            return;
          }
          const props = document2.styles[cssClass] || {};
          cssProps.forEach((cssProp) => {
            const prop = cssProp.indexOf(":");
            const name = cssProp.substr(0, prop).trim();
            const value = cssProp.substr(prop + 1, cssProp.length - prop).trim();
            if (name && value) {
              props[name] = new Property(document2, name, value);
            }
          });
          document2.styles[cssClass] = props;
          document2.stylesSpecificity[cssClass] = getSelectorSpecificity(cssClass);
          if (cssClass === "@font-face") {
            const fontFamily = props["font-family"].getString().replace(/"|'/g, "");
            const srcs = props.src.getString().split(",");
            srcs.forEach((src) => {
              if (src.indexOf('format("svg")') > 0) {
                const url = parseExternalUrl(src);
                if (url) {
                  void new SVGFontLoader(document2).load(fontFamily, url);
                }
              }
            });
          }
        });
      });
    }
  };
  StyleElement.parseExternalUrl = parseExternalUrl;
  var UseElement = class extends RenderedElement {
    setContext(ctx) {
      super.setContext(ctx);
      const xAttr = this.getAttribute("x");
      const yAttr = this.getAttribute("y");
      if (xAttr.hasValue()) {
        ctx.translate(xAttr.getPixels("x"), 0);
      }
      if (yAttr.hasValue()) {
        ctx.translate(0, yAttr.getPixels("y"));
      }
    }
    path(ctx) {
      const { element } = this;
      if (element) {
        element.path(ctx);
      }
    }
    renderChildren(ctx) {
      const { document: document2, element } = this;
      if (element) {
        let tempSvg = element;
        if (element.type === "symbol") {
          tempSvg = new SVGElement(document2);
          tempSvg.attributes.viewBox = new Property(document2, "viewBox", element.getAttribute("viewBox").getString());
          tempSvg.attributes.preserveAspectRatio = new Property(document2, "preserveAspectRatio", element.getAttribute("preserveAspectRatio").getString());
          tempSvg.attributes.overflow = new Property(document2, "overflow", element.getAttribute("overflow").getString());
          tempSvg.children = element.children;
          element.styles.opacity = new Property(document2, "opacity", this.calculateOpacity());
        }
        if (tempSvg.type === "svg") {
          const widthStyle = this.getStyle("width", false, true);
          const heightStyle = this.getStyle("height", false, true);
          if (widthStyle.hasValue()) {
            tempSvg.attributes.width = new Property(document2, "width", widthStyle.getString());
          }
          if (heightStyle.hasValue()) {
            tempSvg.attributes.height = new Property(document2, "height", heightStyle.getString());
          }
        }
        const oldParent = tempSvg.parent;
        tempSvg.parent = this;
        tempSvg.render(ctx);
        tempSvg.parent = oldParent;
      }
    }
    getBoundingBox(ctx) {
      const { element } = this;
      if (element) {
        return element.getBoundingBox(ctx);
      }
      return null;
    }
    elementTransform() {
      const { document: document2, element } = this;
      if (!element) {
        return null;
      }
      return Transform.fromElement(document2, element);
    }
    get element() {
      if (!this.cachedElement) {
        this.cachedElement = this.getHrefAttribute().getDefinition();
      }
      return this.cachedElement;
    }
    constructor(...args) {
      super(...args);
      this.type = "use";
    }
  };
  function imGet(img, x, y2, width, _height, rgba) {
    return img[y2 * width * 4 + x * 4 + rgba];
  }
  function imSet(img, x, y2, width, _height, rgba, val) {
    img[y2 * width * 4 + x * 4 + rgba] = val;
  }
  function m3(matrix, i3, v3) {
    const mi = matrix[i3];
    return mi * v3;
  }
  function c3(a3, m1, m22, m32) {
    return m1 + Math.cos(a3) * m22 + Math.sin(a3) * m32;
  }
  var FeColorMatrixElement = class extends Element {
    apply(ctx, _x, _y, width, height) {
      const { includeOpacity, matrix } = this;
      const srcData = ctx.getImageData(0, 0, width, height);
      for (let y2 = 0; y2 < height; y2++) {
        for (let x = 0; x < width; x++) {
          const r3 = imGet(srcData.data, x, y2, width, height, 0);
          const g2 = imGet(srcData.data, x, y2, width, height, 1);
          const b2 = imGet(srcData.data, x, y2, width, height, 2);
          const a3 = imGet(srcData.data, x, y2, width, height, 3);
          let nr = m3(matrix, 0, r3) + m3(matrix, 1, g2) + m3(matrix, 2, b2) + m3(matrix, 3, a3) + m3(matrix, 4, 1);
          let ng = m3(matrix, 5, r3) + m3(matrix, 6, g2) + m3(matrix, 7, b2) + m3(matrix, 8, a3) + m3(matrix, 9, 1);
          let nb = m3(matrix, 10, r3) + m3(matrix, 11, g2) + m3(matrix, 12, b2) + m3(matrix, 13, a3) + m3(matrix, 14, 1);
          let na = m3(matrix, 15, r3) + m3(matrix, 16, g2) + m3(matrix, 17, b2) + m3(matrix, 18, a3) + m3(matrix, 19, 1);
          if (includeOpacity) {
            nr = 0;
            ng = 0;
            nb = 0;
            na *= a3 / 255;
          }
          imSet(srcData.data, x, y2, width, height, 0, nr);
          imSet(srcData.data, x, y2, width, height, 1, ng);
          imSet(srcData.data, x, y2, width, height, 2, nb);
          imSet(srcData.data, x, y2, width, height, 3, na);
        }
      }
      ctx.clearRect(0, 0, width, height);
      ctx.putImageData(srcData, 0, 0);
    }
    constructor(document2, node, captureTextNodes) {
      super(document2, node, captureTextNodes);
      this.type = "feColorMatrix";
      let matrix = toNumbers(this.getAttribute("values").getString());
      switch (this.getAttribute("type").getString("matrix")) {
        case "saturate": {
          const s3 = matrix[0];
          matrix = [
            0.213 + 0.787 * s3,
            0.715 - 0.715 * s3,
            0.072 - 0.072 * s3,
            0,
            0,
            0.213 - 0.213 * s3,
            0.715 + 0.285 * s3,
            0.072 - 0.072 * s3,
            0,
            0,
            0.213 - 0.213 * s3,
            0.715 - 0.715 * s3,
            0.072 + 0.928 * s3,
            0,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            0,
            1
          ];
          break;
        }
        case "hueRotate": {
          const a3 = matrix[0] * Math.PI / 180;
          matrix = [
            c3(a3, 0.213, 0.787, -0.213),
            c3(a3, 0.715, -0.715, -0.715),
            c3(a3, 0.072, -0.072, 0.928),
            0,
            0,
            c3(a3, 0.213, -0.213, 0.143),
            c3(a3, 0.715, 0.285, 0.14),
            c3(a3, 0.072, -0.072, -0.283),
            0,
            0,
            c3(a3, 0.213, -0.213, -0.787),
            c3(a3, 0.715, -0.715, 0.715),
            c3(a3, 0.072, 0.928, 0.072),
            0,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            0,
            1
          ];
          break;
        }
        case "luminanceToAlpha":
          matrix = [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0.2125,
            0.7154,
            0.0721,
            0,
            0,
            0,
            0,
            0,
            0,
            1
          ];
          break;
      }
      this.matrix = matrix;
      this.includeOpacity = this.getAttribute("includeOpacity").hasValue();
    }
  };
  var MaskElement = class extends Element {
    apply(ctx, element) {
      const { document: document2 } = this;
      let x = this.getAttribute("x").getPixels("x");
      let y2 = this.getAttribute("y").getPixels("y");
      let width = this.getStyle("width").getPixels("x");
      let height = this.getStyle("height").getPixels("y");
      if (!width && !height) {
        const boundingBox = new BoundingBox();
        this.children.forEach((child) => {
          boundingBox.addBoundingBox(child.getBoundingBox(ctx));
        });
        x = Math.floor(boundingBox.x1);
        y2 = Math.floor(boundingBox.y1);
        width = Math.floor(boundingBox.width);
        height = Math.floor(boundingBox.height);
      }
      const ignoredStyles = this.removeStyles(element, MaskElement.ignoreStyles);
      const maskCanvas = document2.createCanvas(x + width, y2 + height);
      const maskCtx = maskCanvas.getContext("2d");
      document2.screen.setDefaults(maskCtx);
      this.renderChildren(maskCtx);
      new FeColorMatrixElement(document2, {
        nodeType: 1,
        childNodes: [],
        attributes: [
          {
            nodeName: "type",
            value: "luminanceToAlpha"
          },
          {
            nodeName: "includeOpacity",
            value: "true"
          }
        ]
      }).apply(maskCtx, 0, 0, x + width, y2 + height);
      const tmpCanvas = document2.createCanvas(x + width, y2 + height);
      const tmpCtx = tmpCanvas.getContext("2d");
      document2.screen.setDefaults(tmpCtx);
      element.render(tmpCtx);
      tmpCtx.globalCompositeOperation = "destination-in";
      tmpCtx.fillStyle = maskCtx.createPattern(maskCanvas, "no-repeat");
      tmpCtx.fillRect(0, 0, x + width, y2 + height);
      ctx.fillStyle = tmpCtx.createPattern(tmpCanvas, "no-repeat");
      ctx.fillRect(0, 0, x + width, y2 + height);
      this.restoreStyles(element, ignoredStyles);
    }
    render(_3) {
    }
    constructor(...args) {
      super(...args);
      this.type = "mask";
    }
  };
  MaskElement.ignoreStyles = [
    "mask",
    "transform",
    "clip-path"
  ];
  var noop = () => {
  };
  var ClipPathElement = class extends Element {
    apply(ctx) {
      const { document: document2 } = this;
      const contextProto = Reflect.getPrototypeOf(ctx);
      const { beginPath, closePath } = ctx;
      if (contextProto) {
        contextProto.beginPath = noop;
        contextProto.closePath = noop;
      }
      Reflect.apply(beginPath, ctx, []);
      this.children.forEach((child) => {
        if (!("path" in child)) {
          return;
        }
        let transform = "elementTransform" in child ? child.elementTransform() : null;
        if (!transform) {
          transform = Transform.fromElement(document2, child);
        }
        if (transform) {
          transform.apply(ctx);
        }
        child.path(ctx);
        if (contextProto) {
          contextProto.closePath = closePath;
        }
        if (transform) {
          transform.unapply(ctx);
        }
      });
      Reflect.apply(closePath, ctx, []);
      ctx.clip();
      if (contextProto) {
        contextProto.beginPath = beginPath;
        contextProto.closePath = closePath;
      }
    }
    render(_3) {
    }
    constructor(...args) {
      super(...args);
      this.type = "clipPath";
    }
  };
  var FilterElement = class extends Element {
    apply(ctx, element) {
      const { document: document2, children } = this;
      const boundingBox = "getBoundingBox" in element ? element.getBoundingBox(ctx) : null;
      if (!boundingBox) {
        return;
      }
      let px = 0;
      let py = 0;
      children.forEach((child) => {
        const efd = child.extraFilterDistance || 0;
        px = Math.max(px, efd);
        py = Math.max(py, efd);
      });
      const width = Math.floor(boundingBox.width);
      const height = Math.floor(boundingBox.height);
      const tmpCanvasWidth = width + 2 * px;
      const tmpCanvasHeight = height + 2 * py;
      if (tmpCanvasWidth < 1 || tmpCanvasHeight < 1) {
        return;
      }
      const x = Math.floor(boundingBox.x);
      const y2 = Math.floor(boundingBox.y);
      const ignoredStyles = this.removeStyles(element, FilterElement.ignoreStyles);
      const tmpCanvas = document2.createCanvas(tmpCanvasWidth, tmpCanvasHeight);
      const tmpCtx = tmpCanvas.getContext("2d");
      document2.screen.setDefaults(tmpCtx);
      tmpCtx.translate(-x + px, -y2 + py);
      element.render(tmpCtx);
      children.forEach((child) => {
        if (typeof child.apply === "function") {
          child.apply(tmpCtx, 0, 0, tmpCanvasWidth, tmpCanvasHeight);
        }
      });
      ctx.drawImage(tmpCanvas, 0, 0, tmpCanvasWidth, tmpCanvasHeight, x - px, y2 - py, tmpCanvasWidth, tmpCanvasHeight);
      this.restoreStyles(element, ignoredStyles);
    }
    render(_3) {
    }
    constructor(...args) {
      super(...args);
      this.type = "filter";
    }
  };
  FilterElement.ignoreStyles = [
    "filter",
    "transform",
    "clip-path"
  ];
  var FeDropShadowElement = class extends Element {
    apply(_3, _x, _y, _width, _height) {
    }
    constructor(document2, node, captureTextNodes) {
      super(document2, node, captureTextNodes);
      this.type = "feDropShadow";
      this.addStylesFromStyleDefinition();
    }
  };
  var FeMorphologyElement = class extends Element {
    apply(_3, _x, _y, _width, _height) {
    }
    constructor(...args) {
      super(...args);
      this.type = "feMorphology";
    }
  };
  var FeCompositeElement = class extends Element {
    apply(_3, _x, _y, _width, _height) {
    }
    constructor(...args) {
      super(...args);
      this.type = "feComposite";
    }
  };
  var FeGaussianBlurElement = class extends Element {
    apply(ctx, x, y2, width, height) {
      const { document: document2, blurRadius } = this;
      const body = document2.window ? document2.window.document.body : null;
      const canvas = ctx.canvas;
      canvas.id = document2.getUniqueId();
      if (body) {
        canvas.style.display = "none";
        body.appendChild(canvas);
      }
      processCanvasRGBA(canvas, x, y2, width, height, blurRadius);
      if (body) {
        body.removeChild(canvas);
      }
    }
    constructor(document2, node, captureTextNodes) {
      super(document2, node, captureTextNodes);
      this.type = "feGaussianBlur";
      this.blurRadius = Math.floor(this.getAttribute("stdDeviation").getNumber());
      this.extraFilterDistance = this.blurRadius;
    }
  };
  var TitleElement = class extends Element {
    constructor(...args) {
      super(...args);
      this.type = "title";
    }
  };
  var DescElement = class extends Element {
    constructor(...args) {
      super(...args);
      this.type = "desc";
    }
  };
  var elements = {
    "svg": SVGElement,
    "rect": RectElement,
    "circle": CircleElement,
    "ellipse": EllipseElement,
    "line": LineElement,
    "polyline": PolylineElement,
    "polygon": PolygonElement,
    "path": PathElement,
    "pattern": PatternElement,
    "marker": MarkerElement,
    "defs": DefsElement,
    "linearGradient": LinearGradientElement,
    "radialGradient": RadialGradientElement,
    "stop": StopElement,
    "animate": AnimateElement,
    "animateColor": AnimateColorElement,
    "animateTransform": AnimateTransformElement,
    "font": FontElement,
    "font-face": FontFaceElement,
    "missing-glyph": MissingGlyphElement,
    "glyph": GlyphElement,
    "text": TextElement,
    "tspan": TSpanElement,
    "tref": TRefElement,
    "a": AElement,
    "textPath": TextPathElement,
    "image": ImageElement,
    "g": GElement,
    "symbol": SymbolElement,
    "style": StyleElement,
    "use": UseElement,
    "mask": MaskElement,
    "clipPath": ClipPathElement,
    "filter": FilterElement,
    "feDropShadow": FeDropShadowElement,
    "feMorphology": FeMorphologyElement,
    "feComposite": FeCompositeElement,
    "feColorMatrix": FeColorMatrixElement,
    "feGaussianBlur": FeGaussianBlurElement,
    "title": TitleElement,
    "desc": DescElement
  };
  function createCanvas(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }
  async function createImage(src) {
    let anonymousCrossOrigin = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    const image = document.createElement("img");
    if (anonymousCrossOrigin) {
      image.crossOrigin = "Anonymous";
    }
    return new Promise((resolve, reject) => {
      image.onload = () => {
        resolve(image);
      };
      image.onerror = (_event, _source, _lineno, _colno, error) => {
        reject(error);
      };
      image.src = src;
    });
  }
  var DEFAULT_EM_SIZE = 12;
  var Document = class {
    bindCreateImage(createImage1, anonymousCrossOrigin) {
      if (typeof anonymousCrossOrigin === "boolean") {
        return (source, forceAnonymousCrossOrigin) => createImage1(source, typeof forceAnonymousCrossOrigin === "boolean" ? forceAnonymousCrossOrigin : anonymousCrossOrigin);
      }
      return createImage1;
    }
    get window() {
      return this.screen.window;
    }
    get fetch() {
      return this.screen.fetch;
    }
    get ctx() {
      return this.screen.ctx;
    }
    get emSize() {
      const { emSizeStack } = this;
      return emSizeStack[emSizeStack.length - 1] || DEFAULT_EM_SIZE;
    }
    set emSize(value) {
      const { emSizeStack } = this;
      emSizeStack.push(value);
    }
    popEmSize() {
      const { emSizeStack } = this;
      emSizeStack.pop();
    }
    getUniqueId() {
      return "canvg".concat(++this.uniqueId);
    }
    isImagesLoaded() {
      return this.images.every(
        (_3) => _3.loaded
      );
    }
    isFontsLoaded() {
      return this.fonts.every(
        (_3) => _3.loaded
      );
    }
    createDocumentElement(document2) {
      const documentElement = this.createElement(document2.documentElement);
      documentElement.root = true;
      documentElement.addStylesFromStyleDefinition();
      this.documentElement = documentElement;
      return documentElement;
    }
    createElement(node) {
      const elementType = node.nodeName.replace(/^[^:]+:/, "");
      const ElementType = Document.elementTypes[elementType];
      if (ElementType) {
        return new ElementType(this, node);
      }
      return new UnknownElement(this, node);
    }
    createTextNode(node) {
      return new TextNode(this, node);
    }
    setViewBox(config) {
      this.screen.setViewBox({
        document: this,
        ...config
      });
    }
    constructor(canvg, { rootEmSize = DEFAULT_EM_SIZE, emSize = DEFAULT_EM_SIZE, createCanvas: createCanvas1 = Document.createCanvas, createImage: createImage2 = Document.createImage, anonymousCrossOrigin } = {}) {
      this.canvg = canvg;
      this.definitions = {};
      this.styles = {};
      this.stylesSpecificity = {};
      this.images = [];
      this.fonts = [];
      this.emSizeStack = [];
      this.uniqueId = 0;
      this.screen = canvg.screen;
      this.rootEmSize = rootEmSize;
      this.emSize = emSize;
      this.createCanvas = createCanvas1;
      this.createImage = this.bindCreateImage(createImage2, anonymousCrossOrigin);
      this.screen.wait(
        () => this.isImagesLoaded()
      );
      this.screen.wait(
        () => this.isFontsLoaded()
      );
    }
  };
  Document.createCanvas = createCanvas;
  Document.createImage = createImage;
  Document.elementTypes = elements;
  var Canvg = class {
    static async from(ctx, svg) {
      let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      const parser = new Parser(options);
      const svgDocument = await parser.parse(svg);
      return new Canvg(ctx, svgDocument, options);
    }
    static fromString(ctx, svg) {
      let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      const parser = new Parser(options);
      const svgDocument = parser.parseFromString(svg);
      return new Canvg(ctx, svgDocument, options);
    }
    fork(ctx, svg) {
      let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return Canvg.from(ctx, svg, {
        ...this.options,
        ...options
      });
    }
    forkString(ctx, svg) {
      let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return Canvg.fromString(ctx, svg, {
        ...this.options,
        ...options
      });
    }
    ready() {
      return this.screen.ready();
    }
    isReady() {
      return this.screen.isReady();
    }
    async render() {
      let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      this.start({
        enableRedraw: true,
        ignoreAnimation: true,
        ignoreMouse: true,
        ...options
      });
      await this.ready();
      this.stop();
    }
    start() {
      let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      const { documentElement, screen, options: baseOptions } = this;
      screen.start(documentElement, {
        enableRedraw: true,
        ...baseOptions,
        ...options
      });
    }
    stop() {
      this.screen.stop();
    }
    resize(width) {
      let height = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : width, preserveAspectRatio = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
      this.documentElement.resize(width, height, preserveAspectRatio);
    }
    constructor(ctx, svg, options = {}) {
      this.parser = new Parser(options);
      this.screen = new Screen(ctx, options);
      this.options = options;
      const document2 = new Document(this, options);
      const documentElement = document2.createDocumentElement(svg);
      this.document = document2;
      this.documentElement = documentElement;
    }
  };

  // js/script.jsx
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
    const mouseStart = (e3) => {
      const canvas = e3.target;
      e3.stopPropagation();
      e3.preventDefault();
      const ctx = canvas.getContext("2d");
      rect = canvas.getBoundingClientRect();
      let x = e3.x - rect.x;
      let y2 = e3.y - rect.y;
      drawCircle(ctx, {
        x,
        y: y2,
        radius: currRadius,
        color: currColor
      });
      lastCoords = [x, y2];
      isDrawing = true;
    };
    const mouseMove = (e3) => {
      if (!isDrawing) {
        return;
      }
      e3.stopPropagation();
      e3.preventDefault();
      let x = null;
      let y2 = null;
      if (e3 instanceof TouchEvent) {
        const touch = e3.targetTouches[0];
        x = touch.clientX - rect.x;
        y2 = touch.clientY - rect.y;
      } else {
        x = e3.x - rect.x;
        y2 = e3.y - rect.y;
      }
      const canvas = e3.target;
      const ctx = canvas.getContext("2d");
      if (lastCoords !== null) {
        ctx.beginPath();
        ctx.moveTo(lastCoords[0], lastCoords[1]);
        ctx.lineTo(x, y2);
        ctx.lineWidth = currRadius * 2;
        ctx.strokeStyle = currColor;
        ctx.stroke();
      }
      drawCircle(ctx, {
        x,
        y: y2,
        radius: currRadius,
        color: currColor
      });
      lastCoords = [x, y2];
    };
    const mouseEnd = (e3) => {
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
  async function renderSvgToCanvas(url) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    let vr = await Canvg.from(ctx, url);
    vr.start();
    return canvas;
  }
  async function compareFlags(name, drawnFlagCanvas, svgUrl) {
    const expectedCanvas = await renderSvgToCanvas(svgUrl);
    let result = await (0, import_compareImages.default)(
      expectedCanvas.toDataURL(),
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
    var hash = 0, i3, chr;
    if (str.length === 0)
      return hash;
    for (i3 = 0; i3 < str.length; i3++) {
      chr = str.charCodeAt(i3);
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
    data = data.sort((a3, b2) => b2.similarityPercent - a3.similarityPercent);
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
  async function checkSubmission(data, country, countryData) {
    let countries = Object.keys(data);
    const name = document.querySelector("#country-name").value;
    const capital = document.querySelector("#country-capital").value;
    if (countryData.name !== name) {
      alert("wrong name");
    } else if (capital != countryData.capital) {
      alert("wrong capital");
    } else {
      let flagMatches = await rankFlags(countries);
      console.log(flagMatches);
      console.log(flagMatches.slice(0, 10).map((x) => x.name));
      console.log(flagMatches.slice(0, 10).map((x) => x.name));
      let isInTopN = flagMatches.slice(0, 4).map((x) => x.name).includes(country);
      let countryFlagToShow = isInTopN ? country : flagMatches[0].name;
      if (flagMatches.slice(0, 4).map((x) => x.name).includes(country)) {
        alert("great job!");
      } else {
        alert("wrong flag");
      }
      P(
        /* @__PURE__ */ h("img", {
          src: `/data/${countryFlagToShow}/flag.svg`
        }),
        document.querySelector("#flag-target")
      );
    }
  }
  async function main() {
    let cr = await fetch("/data/countries.json");
    let countries = await cr.json();
    let r3 = await fetch("/colors.json");
    let content = await r3.json();
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
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
//# sourceMappingURL=script.dist.js.map
