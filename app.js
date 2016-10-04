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
var readMultipleFiles = require('read-multiple-files');

// 存储所有图像buffer image对象的缓存
var imgCache = [];

getAllFiles();

function getAllFiles() {
  glob('./img/*.jpg', function(er, files) {
    if (er) {
      console.log(er);
    }

    // 声明每个帧的数组
    var frameArr = [];
    var frameLength = 0;
    readMultipleFiles(files, function(err, bufs){
      if (err) {
        throw err;
      }

      frameLength = bufs.length;

      for (var i = 0;i < bufs.length; i++) {
        var arr = readFileAndGetAxis(bufs[i], i + 1);
        frameArr.push(arr);
        console.log('done', parseInt((i+1) / frameLength * 100) + '%');
      }

      //LoopCompareImg(frameArr);
      //fs.writeFile('./frame.json', JSON.stringify(frameArr), function(err){
      //  if(err) throw err;
      //  console.log('write success');
      //});
    });
  });
}

// 循环对比每个图片的坐标位置的
//function LoopCompareImg(frameArr) {
//  var cpArr = _.clone(frameArr);
//  var _frameLength = cpArr.length;
//
//  //组装所有坐标的容器
//  var bigArr = [];
//
//  //while(_frameLength > 1) {
//
//    var unitTwoArr = [];
//    // 两两进行比较，得到的数组
//    for (var i = 0;i < _frameLength; i = i + 2) {
//
//      if (i == (_frameLength - 1)) {
//        unitTwoArr.push(cpArr[i]);
//      } else {
//        var newarr = compareTwoImg(cpArr, i);
//        unitTwoArr.push(newarr);
//
//      }
//    }
//    cpArr = unitTwoArr;
//    _frameLength = cpArr.length;
//    if (_frameLength == 1) {
//      bigArr = cpArr[0];
//    }
//  //}
//  console.log(bigArr.length, 'unit length');
//}

// 对比两个图片的所有坐标，像素是否相同，并返回合并后的数组
//var testi = 0;
//function compareTwoImg(frameArr, i) {
//  var leftObj = _.clone(frameArr[i]);
//  var rightObj = _.clone(frameArr[i + 1]);
//  console.log(leftObj.length, rightObj.length);
//  var newArr = [];
//  leftObj.forEach(function(e, j) {
//    var newE = {
//      x:e.x,
//      y:e.y,
//      w:e.w,
//      h:e.h
//    };
//    var leftFrameIndex = e.frameindex;
//    var lastIndex = _.findLastIndex(rightObj, newE);
//
//    newE.frameindex = [];
//
//    // 如果两张图片，存在同一个坐标,并且截取面积也相同
//    if (lastIndex != -1) {
//      var rightFrameIndex = rightObj[lastIndex].frameindex;
//      rightObj.splice(lastIndex, 1);
//      var leftImg = imgCache[leftFrameIndex[0] - 1];
//      var rightImg = imgCache[rightFrameIndex[0] - 1];
//
//      // 再进行像素级对比
//      ctx.clearRect(0, 0, imgWid, imgHei);
//      ctx.drawImage(leftImg, 0, 0, imgWid, imgHei);
//      var leftImgData = ctx.getImageData(e.x, e.y, e.w, e.h);
//      ctx.clearRect(0, 0, imgWid, imgHei);
//      ctx.drawImage(rightImg, 0, 0, imgWid, imgHei);
//      var rightImgData = ctx.getImageData(e.x, e.y, e.w, e.h);
//      if (e.w == 8) {
//        testi++;
//        if (testi == 1) {
//          console.log(e, leftImgData, rightImgData);
//        }
//      }
//      var cp_e = _.clone(newE);
//      if (_.isEqual(leftImgData, rightImgData)) {
//        cp_e.frameindex = cp_e.frameindex.concat(leftFrameIndex);
//        cp_e.frameindex = cp_e.frameindex.concat(rightFrameIndex);
//        newArr.push(cp_e);
//      } else {
//        var cp_ea = _.clone(newE);
//        var cp_eb = _.clone(newE);
//
//        cp_ea.frameindex = cp_ea.frameindex.concat(leftFrameIndex);
//        cp_eb.frameindex = cp_eb.frameindex.concat(rightFrameIndex);
//        newArr.push(cp_ea);
//        newArr.push(cp_eb);
//      }
//    } else {
//      var cp_ea = _.clone(newE);
//      cp_ea.frameindex = cp_ea.frameindex.concat(leftFrameIndex);
//      newArr.push(cp_ea);
//    }
//  });
//  if (rightObj.length > 0) {
//    rightObj.forEach(function(e) {
//      var cp_ea = _.clone(e);
//      newArr.push(cp_ea);
//    });
//  }
//  return newArr;
//}

// 读取每个图片，并且获取这个图片中所有的方格的坐标。
function readFileAndGetAxis(squid, frameindex) {
  var img = new Image;
  img.src = squid;
  imgCache.push(img);
  ctx.clearRect(0, 0, imgWid, imgHei);
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
  //ctx.fillRect(0, 0, imgWid, imgHei);

  // 合并附近坐标连续的方格
  var mergeAxisArray = [];
  axisArry.forEach(function(e,i) {
    var x = e.x;
    var y = e.y;
    var w = e.w;
    var h = e.h;
    if (i != 0) {
      var _length = mergeAxisArray.length;
      var before = mergeAxisArray[_length-1];
      var beforeX = before.x;
      var beforeY = before.y;
      var beforeW = before.w;

      if ((x - beforeX) == beforeW && y == beforeY) {
        mergeAxisArray.splice(_length-1, 1);
        x = beforeX;
        w = beforeW + w;
      }
    }
    var frameindexArr = [];
    frameindexArr.push(frameindex);
    mergeAxisArray.push({
      x: x,
      y: y,
      w: w,
      h: h,
      frameindex:frameindexArr
    });
  });
  return mergeAxisArray;
}


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






