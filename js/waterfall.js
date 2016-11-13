console.log(imageAssemble);
var option = {
	columns: 4,
	margin: "4 4", //默认px为单位
	padding: "",
	root: ".imageContainer",
	customizableHeight: 40
};

var recordMaxHeightForEveryColumn = new Array(option.columns);
for (var i = 0; i < recordMaxHeightForEveryColumn.length; i++) {
	recordMaxHeightForEveryColumn[i] = 0;
}

function initConstructPositionFunction() {
	return function(ratio) {
		// if(iscomplete){
		// 	return recordMaxHeightForEveryColumn;
		// }
		var min = recordMaxHeightForEveryColumn[0];
		var currentColumn = 0;
		for (var i = recordMaxHeightForEveryColumn.length - 1; i > -1; i--) {
			if (recordMaxHeightForEveryColumn[i] <= min) {
				min = recordMaxHeightForEveryColumn[i];
				currentColumn = i;
			}
		}
		var margin = analyseMargin();
		var marginLeft = margin.left;
		var marginTop = margin.top;
		var marginBottom = margin.bottom;
		var columnWidth = (document.getElementsByClassName('imageContainer')[0].offsetWidth - option.columns * marginLeft * 2) / option.columns;
		var obj = {
			top: min + marginTop,
			left: currentColumn * (columnWidth + 2 * marginLeft) + marginLeft,
			containerHeight: columnWidth * ratio + option.customizableHeight,
			containerWidth: columnWidth,
			imgHeight: columnWidth * ratio
		};
		// debugger
		recordMaxHeightForEveryColumn[currentColumn] += marginTop + columnWidth * ratio + marginBottom + option.customizableHeight;
		return obj;
	};
}

function analyseMargin() {
	var margin = (option.margin || "").split(' ');
	switch (margin.length) {
		case 0:
			return {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0
			};
		case 1:
			return {
				top: parseInt(margin[0]),
				right: parseInt(margin[0]),
				bottom: parseInt(margin[0]),
				left: parseInt(margin[0])
			};
		case 2:
			return {
				top: parseInt(margin[0]),
				right: parseInt(margin[1]),
				bottom: parseInt(margin[0]),
				left: parseInt(margin[1])
			};
		case 3:
			return {
				top: parseInt(margin[0]),
				right: parseInt(margin[1]),
				bottom: parseInt(margin[2]),
				left: parseInt(margin[1])
			};
		case 4:
			return {
				top: parseInt(margin[0]),
				right: parseInt(margin[1]),
				bottom: parseInt(margin[2]),
				left: parseInt(margin[3])
			};
		default:
			console.error("margin参数异常");
	}
}

function translateUnit(value) {
	if (/em/.test(value)) {
		value = parseInt(value.replace("em", "")) * parseInt(document.getElementsByClassName("imageContainer").style.fontSize.replace(/\D/, ""));
	}
	if (/rem/.test(value)) {
		value = parseInt(value.replace("rem", "")) * parseInt(document.documentElement.style.fontSize.replace(/\D/, ""));
	}
	// if(/px/.test(value)){}
	return value;
}

function readerDom() {
	var getPosition = initConstructPositionFunction();
	var div, img, url, ratio, position, customization;
	var assetArr=[];
	return function(asset) {
		asset=$.extend(true, [] ,asset);
		for (var i = 0; i < asset.length; i++) {
			url = asset[i].url;
			ratio = asset[i].ratio;
			position = getPosition(ratio);
			// 创建元素并渲染DOM
			div = document.createElement("div");
			asset[i].el=div;
			div.style.position = "absolute";
			div.style.left = position.left + "px";
			div.style.top = position.top + "px";
			div.style.width = position.containerWidth + "px";
			div.style.height = position.containerHeight + "px";
			img = document.createElement("img");
			img.src = url;
			img.style.height = position.imgHeight + "px";
			customization = document.createElement("div");
			customization.style.height = option.customizableHeight + "px";
			div.appendChild(img);
			div.appendChild(customization);
			document.getElementsByClassName("imageContainer")[0].appendChild(div);
		}
		assetArr=assetArr.concat(asset);
		return assetArr;
	};
}
var readerDonBy = readerDom();
readerDonBy(imageAssemble);
readerDonBy(imageAssemble);
readerDonBy(imageAssemble);
readerDonBy(imageAssemble);
readerDonBy(imageAssemble);
readerDonBy(imageAssemble);
readerDonBy(imageAssemble);
readerDonBy(imageAssemble);
readerDonBy(imageAssemble);
var assetArr=readerDonBy(imageAssemble);
var max = recordMaxHeightForEveryColumn[0];
for (var i = 0; i < recordMaxHeightForEveryColumn.length; i++) {
	if (recordMaxHeightForEveryColumn[i] >= max) {
		max = recordMaxHeightForEveryColumn[i];
	}
}
document.getElementsByClassName('imageContainer')[0].style.height = max + "px";
var timer;
window.onresize = function() {
	clearTimeout(timer);
	timer = setTimeout(function() {
		if(document.documentElement.offsetWidth<700)
			option.columns = 3;
		else
			option.columns = 4;
		recordMaxHeightForEveryColumn = new Array(option.columns);
		for (var i = 0; i < recordMaxHeightForEveryColumn.length; i++) {
			recordMaxHeightForEveryColumn[i] = 0;
		}
		modifyPosition(assetArr);
		var max = recordMaxHeightForEveryColumn[0];
		for (var i = 0; i < recordMaxHeightForEveryColumn.length; i++) {
			if (recordMaxHeightForEveryColumn[i] >= max) {
				max = recordMaxHeightForEveryColumn[i];
			}
		}
		document.getElementsByClassName('imageContainer')[0].style.height = max + "px";
	}, 500);
};
function modifyPosition(assetArr){
	var getPosition = initConstructPositionFunction();
	var el,ratio,position;
	for(var i=0;i<assetArr.length;i++){
		el=assetArr[i].el;
		ratio = assetArr[i].ratio;
		position = getPosition(ratio);
		el.style.left=position.left+"px";
		el.style.top=position.top+"px";
		el.style.height=position.containerHeight+"px";
		el.style.width=position.containerWidth+"px";
		el.childNodes[0].style.height=position.imgHeight+"px";
	}
}