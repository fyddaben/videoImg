var fs = require('fs');
var path = require('path');
var Canvas = require('canvas')
  , Image = Canvas.Image;
var _ = require('lodash');
var glob = require('glob');

var backColorArr = [];
var backColor = "245,245,245,255";
for (var i = 0; i< 64; i++) {
  backColorArr.push(backColor);
}
var imgWid = 1400;
var imgHei = 1080;
var canvas = new Canvas(imgWid, imgHei);
var ctx = canvas.getContext('2d');
var stream = canvas.jpegStream();

function getAllFiles() {
  glob('./img/*.jpg', function(er, files) {
    if (er) {
      console.log(er);
    }
    //console.log(files);
  });
}
getAllFiles();



fs.readFile(__dirname + '/img/flow_001.jpg', function(err, squid){
  if (err) throw err;

  img = new Image;
  img.src = squid;
  ctx.drawImage(img, 0, 0, imgWid, imgHei);
  var widAmount = imgWid / 8;
  var HeiAmount = imgHei / 8;
  var axisArry = [];
  for (var k = 0; k< HeiAmount; k++ ) {
    for (var l = 0; l < widAmount; l++) {
      var imgData = ctx.getImageData(l * 8, k * 8, 8, 8);
      var pxIsexist = checkImg(imgData.data);
      if (pxIsexist) {
        axisArry.push({
          x: l * 8,
          y: k * 8,
          w: 8,
          h: 8
        });
      }
    }
  }
  //ctx.clearRect(0, 0, imgWid, imgHei);
  //ctx.fillStyle = 'rgba(245, 245, 245, 255)';
  //ctx.fillStyle = 'red';
  //ctx.fillRect(0, 0, imgWid, imgHei);

  // 合并附近坐标连续的方格
  var mergeAxisArray = [];
  axisArry.forEach(function(e,i) {
    var x = e.x;
    var y = e.y;
    var w = e.w;
    var h = e.h;
    if (i != 0) {
      var before = axisArry[i-1];
      var beforeX = before.x;
      var beforeY = before.y;
      var beforeW = before.w;

      if ((x - beforeX) == beforeW && y == beforeY) {
        var _length = mergeAxisArray.length;
        mergeAxisArray.splice(_length-1, 1);
        x = beforeX;
        w = beforeW + w;
      }
    }
    mergeAxisArray.push({
      x: x,
      y: y,
      w: w,
      h: h
    });
  });
  console.log(mergeAxisArray);
  //canvas.createPNGStream().pipe(fs.createWriteStream(path.join(__dirname, 'srcdemo3.png')));
});
function checkImg(imgData) {
  var pxArr = [];
  for (var j = 0; j < 256;j = j + 4) {
    var str = imgData[j] + ","
      + imgData[j + 1] + ","
      + imgData[j + 2] + ","
      + imgData[j + 3];
    pxArr.push(str);
  }
  if (_.isEqual(backColorArr, pxArr)) {
    return false;
  } else {
    return true;
  }
}






