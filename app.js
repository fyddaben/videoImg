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
var rectWid = imgWid;
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
        //frameArr = frameArr.concat(arr);
        frameArr[i] = arr;
        console.log('raw data done ', parseInt((i+1) / frameLength * 100) + '%');
      }

      var bigArr = LoopCompareImg(frameArr);

      console.log('compare donw');

      redrawByOrder(bigArr);

      //fs.writeFile('./frame.json', JSON.stringify(frameArr), function(err){
      //  if(err) throw err;
      //  console.log('write success');
      //});
    });
  });
}
// 循环对比每个图片的坐标位置的
function LoopCompareImg(frameArr) {
  var cpArr = _.clone(frameArr);
  var _frameLength = cpArr.length;

  //组装所有坐标的容器
  var bigArr = [];

  var loopMakeGroup = function() {
    var unitTwoArr = [];
    // 两两进行比较，得到的数组
    for (var i = 0;i < _frameLength; i = i + 2) {

      if (i == (_frameLength - 1)) {
        unitTwoArr.push(cpArr[i]);
      } else {
        var newarr = compareTwoImg(cpArr, i);
        unitTwoArr.push(newarr);
      }
    }
    cpArr = unitTwoArr;
    _frameLength = cpArr.length;
    console.log('compare ' + _frameLength + 'done');
    if (_frameLength == 1) {
      bigArr = cpArr[0];
    } else {
      loopMakeGroup();
    }
  }
  return bigArr;
}

// 对比两个图片的所有坐标，像素是否相同，并返回合并后的数组
//var testi = 0;
function compareTwoImg(frameArr, i) {
  var leftObj = _.clone(frameArr[i]);
  var rightObj = _.clone(frameArr[i + 1]);
  var newArr = [];
  var testi = 0;
  leftObj.forEach(function(e, j) {
    var newE = {
      x:e.x,
      y:e.y,
      w:e.w,
      h:e.h
    };
    var leftFrameIndex = e.frameindex;
    var lastIndex = _.findLastIndex(rightObj, newE);

    newE.frameindex = [];

    // 如果两张图片，存在同一个坐标,并且截取面积也相同
    if (lastIndex != -1) {
      var rightFrameIndex = rightObj[lastIndex].frameindex;
      rightObj.splice(lastIndex, 1);
      var leftImg = imgCache[leftFrameIndex[0] - 1];
      var rightImg = imgCache[rightFrameIndex[0] - 1];

      // 再进行像素级对比
      ctx.clearRect(0, 0, imgWid, imgHei);
      ctx.drawImage(leftImg, 0, 0, imgWid, imgHei);
      var leftImgData = ctx.getImageData(e.x, e.y, e.w, e.h);
      ctx.clearRect(0, 0, imgWid, imgHei);
      ctx.drawImage(rightImg, 0, 0, imgWid, imgHei);
      var rightImgData = ctx.getImageData(e.x, e.y, e.w, e.h);

      var cp_e = _.clone(newE);
      if (_.isEqual(leftImgData.data, rightImgData.data)) {

        cp_e.frameindex = cp_e.frameindex.concat(leftFrameIndex);
        cp_e.frameindex = cp_e.frameindex.concat(rightFrameIndex);
        newArr.push(cp_e);
      } else {
        var cp_ea = _.clone(newE);
        var cp_eb = _.clone(newE);

        cp_ea.frameindex = cp_ea.frameindex.concat(leftFrameIndex);
        cp_eb.frameindex = cp_eb.frameindex.concat(rightFrameIndex);
        newArr.push(cp_ea);
        newArr.push(cp_eb);
      }
    } else {
      var cp_ea = _.clone(newE);
      cp_ea.frameindex = cp_ea.frameindex.concat(leftFrameIndex);
      newArr.push(cp_ea);
    }
  });
  if (rightObj.length > 0) {
    rightObj.forEach(function(e) {
      var cp_ea = _.clone(e);
      newArr.push(cp_ea);
    });
  }
  console.log('compare ' + i + ' done');
  return newArr;
}


// 对数组进行排序,按照截取宽度,并且进行绘图重组
function redrawByOrder(frameArr) {
  var orderFrame = {};
  frameArr.forEach(function(e) {
    if (!orderFrame[e.w]) {
      orderFrame[e.w] = [];
    }
    orderFrame[e.w].push(e);
  });
  var orderFrameArray = [];
  for(var i in orderFrame) {
    var newObj = {
      w: i,
      arr: orderFrame[i]
    }
    orderFrameArray.push(newObj);
  }
  orderFrameArray.sort(function(a, b) {
    return b.w - a.w;
  });

  // 获的截图面积从大到小的排序的数组

  var lineWid = 0;
  var leftWid = rectWid;
  // 记录当前坐标轴x的位置
  var curX = 0;
  var curY = 0;

  // 一共要画多少行
  var lineAmount = 0;

  // 每个页面有几行
  var unitLine = rectWid / 8;

  // 判断当前第几个图片
  var curImgIndex = 0;

  // 所有对象的数量
  function loopCheckNext() {
    var bigestNum = _.findIndex(orderFrameArray, function(e) {
      var arr = e.arr;
      var flag = false;
      arr.forEach(function(unit) {
        if (!unit.hasCheck) {
          flag = true;
        }
      });
      return e.w <= leftWid && flag;
    });
    if (bigestNum == -1) {
      startDrawMergePic(orderFrameArray);
      return false;
    }
    // 包含最大数的集合
    var bigestObj = orderFrameArray[bigestNum];

    // 填满这行，需要几个最大的数
    var num_a = parseInt(leftWid / bigestObj.w);
    var num_b = 0;
    bigestObj.arr.forEach(function(unit) {
      if (!unit.hasCheck) {
        num_b++;
      }
    });

    var num_x = _.min([num_a, num_b]);

    // 把已知用过的这几个，全部重置为，已检查
    var hasCheckedNum = 0;
    var hasOver = false;
    for (var i in bigestObj.arr) {
      var curBig = bigestObj.arr[i];
      if (!curBig.hasCheck && !hasOver) {
        curBig.hasCheck = true;

        // 记录重组后的值，从0,0 开始.
        curBig.tarx = curX;
        curBig.tary = curY;
        curBig.curImgIndex = curImgIndex;

        curX+= parseInt(curBig.w);

        hasCheckedNum++;
        if (hasCheckedNum == num_x) {
          hasOver = true;
        }
      }
    }
    var cutLeftWid = leftWid - num_x * bigestObj.w
    for (var i = 0;i < num_x;i ++) {
    }
    if (cutLeftWid > 0) {
      leftWid = cutLeftWid;
      loopCheckNext();
    } else {
      lineAmount++;
      curY+= 8;
      curX = 0;
      leftWid = rectWid;
      if (lineAmount > unitLine * (curImgIndex + 1)) {
        curY = 0;
        curImgIndex++;
      }
      loopCheckNext();
    }
  }
  loopCheckNext();

}

// 开始生成组合图片
function startDrawMergePic(orderFrameArray) {

  // 先判断要画几个图片
  var picAmount = 0;
  // 每个页面有几行
  var unitLine = rectWid / 8;
  var orderframe = [];
  orderFrameArray.forEach(function(e) {
    e.arr.forEach(function(unit) {
      var curPageNum = unit.curImgIndex;

      if (!orderframe[curPageNum]) {
        orderframe[curPageNum] = [];
      }
      orderframe[curPageNum].push(unit);
    });
  });
  orderframe.forEach(function(e, index) {
    var canvas = new Canvas(rectWid, rectWid);
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, rectWid, rectWid);
    ctx.fillStyle = 'rgba(' + backColor + ')';
    ctx.fillRect(0, 0, rectWid, rectWid);
    e.forEach(function(unit) {
      var curImg = imgCache[unit.frameindex[0] - 1];
      ctx.drawImage(curImg, unit.x, unit.y, unit.w, unit.h, unit.tarx, unit.tary, unit.w, unit.h);
    });
    canvas.createJPEGStream({
      quality: 60
    }).pipe(fs.createWriteStream(path.join(__dirname, 'dist/flow_'+ index +'.jpg')));
    console.log('draw ' + index + ' done');
  });


}

// 读取每个图片，并且获取这个图片中所有的方格的坐标。
function readFileAndGetAxis(squid, frameindex) {
  //var canvas = new Canvas(imgWid, imgHei);
  //var ctx = canvas.getContext('2d');
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
  //console.log(axisArry[0]);

  // 合并附近坐标连续的方格
  var mergeAxisArray = [];
  axisArry.forEach(function(e,i) {
    var x = e.x;
    var y = e.y;
    var w = e.w;
    var h = e.h;
    ctx.drawImage(img, e.x, e.y, e.w, e.h);
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
    var frindexArr = [];
    frindexArr.push(frameindex);
    mergeAxisArray.push({
      x: x,
      y: y,
      w: w,
      h: h,
      frameindex:frindexArr
    });
  });
  //mergeAxisArray.forEach(function(e) {
  //  ctx.drawImage(img, e.x, e.y, e.w, e.h, e.x, e.y, e.w, e.h);
  //});
  //canvas.createPNGStream().pipe(fs.createWriteStream(path.join(__dirname, 'dist/lw_'+frameindex+'.png')));
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






