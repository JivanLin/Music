//全局变量设置
var player = document.getElementById("player"); //播放器
var singerimg = document.querySelector("#singer>img"); //图片专辑
var time_bar = document.querySelector("#time_bar"); //进度条
var songlist = document.querySelector("#songlist>select"); //歌曲清单

var status = 0; //歌曲播放状态  0：停止；1：播放
var num = 0; //时间进度当前数值
var bfms_val = 0; //播放模式初始值为0，1: 循环播放; 2：随机播放; 3：单曲循环

//存储歌曲路径数组
var songlistarr = ["audio/金南玲-逆流成河.mp3", "audio/薛之谦-丑八怪.mp3", "audio/薛之谦-演员.mp3", "audio/薛之谦-意外.mp3"];
var singerimgarr = ["images/金南玲-逆流成河.jpeg", "images/薛之谦-丑八怪.jpg", "images/薛之谦-演员.jpg", "images/薛之谦-意外.jpg"];

var timer = null; //接收定时器的时间变化

//select选择更换歌曲
function listchange(obj) {
	// console.log(obj.value);
	player.src = songlistarr[obj.value];
	singerimg.src = singerimgarr[obj.value];
	document.getElementById("play").src = "images/icon01.png";
	status = 1;
	lrcshowbar();
}
//播放状态切换及图片变换
function play() {
	if (status == 0) {
		//如果已停止则播放音频并更换图标
		player.play();
		document.getElementById("play").src = "images/icon02.png";
		status = 1;
		showtime();
		timer = setInterval(showtime, 1000);
	} else {
		//如果已停止重新加载音频并关闭音频和更换图标
		player.pause();
		document.getElementById("play").src = "images/icon01.png";
		status = 0;
		clearInterval(timer);
	}
}
//切换上一首
function prev() {
	if (songlist.value > 0) {
		var listnum = songlist.value;
		listnum--;
		songlist.value = listnum;
	} else {
		// songlist.value = 3;
		songlist.lastElementChild.selected = true;
	}

	listchange(songlist);
	lrcshowbar();

	player.play();
	document.getElementById("play").src = "images/icon02.png";
	status = 1;
	showtime();
	timer = setInterval(showtime, 1000);

}
//切换下一首
function next() {
	if (bfms_val == 2) { //播放模式为随机播放时,下一首也为随机
		var listnum = Math.round(Math.random() * 3);
		console.log(listnum);
		songlist.value = listnum;
	} else {
		if (songlist.lastElementChild.selected) {
			songlist.firstElementChild.selected = true;
		} else {
			var listnum = songlist.value;
			listnum++;
			songlist.value = listnum;
		}
	}

	listchange(songlist);
	lrcshowbar();

	player.play();
	document.getElementById("play").src = "images/icon02.png";
	status = 1;
	showtime();
	timer = setInterval(showtime, 1000);
}
//使用键盘控制音量的大小,播放的进度  键盘事件onkeydown,onkeyup,onkeypress
document.onkeydown = function(event) {
	console.log(event.keyCode);
	if (event.keyCode == 38 && player.volume < 1) { //按下的是 上 键，音量变大
		player.volume = player.volume + 0.01;
	} else if (event.keyCode == 40 && player.volume > 0) { //按下的是 下 键，音量变小
		if (player.volume < 0.01) {
			player.volume = 0;
		} else {
			player.volume = player.volume - 0.01;
		}
	} else if (event.keyCode == 37) { //按下的是 左 键，进度回退
		num--; //进度条当前数值
		player.currentTime = num / time_bar.offsetWidth * player.duration;
		showtime();
	} else if (event.keyCode == 39) { //按下的是 右 键，进度前进
		num = num + 3; //进度条当前数值
		player.currentTime = num / time_bar.offsetWidth * player.duration;
		showtime();
	} else if (event.keyCode == 32) { //按下空格键，实现暂停及播放
		play();
	}
}

//显示播放时间，当前和总时长，以秒为单位;及进度条(time_bar)显示
function showtime() {
	//播放时间
	var cut = parseInt(player.currentTime) //当前时间
	var dur = parseInt(player.duration) //总时长
	var cutmin = parseInt(cut / 60); //当前时长的分钟数
	var cutsed = cut % 60; //当前时长的秒钟数
	var durmin = parseInt(dur / 60);
	var dursed = dur % 60;
	if (cutsed < 10) {
		document.getElementById("time_show").firstElementChild.innerHTML = "0" + cutmin + ":0" + cutsed;
	} else {
		document.getElementById("time_show").firstElementChild.innerHTML = "0" + cutmin + ":" + cutsed;
	}
	if (dursed < 10) {
		document.getElementById("time_show").lastElementChild.innerHTML = "0" + durmin + ":0" + dursed;
	} else {
		document.getElementById("time_show").lastElementChild.innerHTML = "0" + durmin + ":" + dursed;
	}
	//进度条
	num = cut / dur * time_bar.offsetWidth;
	//console.log(num);
	time_bar.firstElementChild.style.width = num + "px";
}
player.oncanplay = showtime; //播放前加载动态时间
//进度条控制播放快进、快退
function nowtime(event) {
	//console.log(event.offsetX);//获取鼠标点击的位置
	time_bar.firstElementChild.style.width = event.offsetX + "px";
	player.currentTime = event.offsetX / time_bar.offsetWidth * player.duration;
	//console.log(player.currentTime);
	showtime();
}

//歌词显示
function lrcshowbar() {
	removeAllChild(); //移除原本p标签所有内容
	document.getElementById("lrcshow").innerHTML = '<p class="show"></p>';

	//获取歌词时间
	var gctime = document.getElementsByTagName("textarea")[songlist.value].innerHTML;
	gctime = gctime.split("\n"); //切割字符串,返回数组

	//map遍历数组元素，每元素进行操作；ES5
	gctime = gctime.map(function(item) {
		//indexOf() 查找[在字符串中的的位置，返回下标值 
		return item.slice(item.indexOf("[") + 1, item.indexOf("]")); //切割字符串，返回字符串。开始位置、结束位置
	});
	//再遍历数组，将分秒变成秒
	gctime = gctime.map(item => {
		return item.split(":")[0] * 60 + Number(item.split(":")[1]);
	});
	//console.log(gctime);
	//获取每句歌词,链式
	var gcarr = document.getElementsByTagName("textarea")[songlist.value].innerHTML.split("\n").map(function(item) {
		return item.slice(item.indexOf("]") + 1);
	});
	//console.log(gcarr);

	document.querySelector(".songName>p").innerText = gcarr[0]; //歌曲名称获取歌词首行

	//动态加载歌词 for 遍历
	for (var phtml of gcarr) {
		var p = document.createElement("p"); //创建p元素
		p.innerHTML = phtml; //将每行句子遍历到p标签中
		document.getElementById("lrcshow").appendChild(p); //将p元素放到lrcshow标签中作为子元素
	}
	//歌词滚动效果
	player.ontimeupdate = function() {
		var i = 0;
		while (this.currentTime > gctime[i]) {
			i++;
		}
		//console.log(i);
		//将之前显示的歌词样式清除，加载现在显示歌词样式
		document.querySelector("#lrcshow>p.show").className = "";
		//显示i+1句歌词
		document.querySelector("#lrcshow>p:nth-child(" + (i + 1) + ")").className = "show";
		//歌词滚动，让lrcshow元素向上移动
		document.getElementById("lrcshow").style.top = (40 - 40 * i) + "px";
	}
}
lrcshowbar();
// 清空lrcshow元素：删除一个元素的所有子元素，因为上面lrcshowbar()加载歌词后存留在p标签里，这里直接清除 #lrcshow 下所有元素
function removeAllChild() {
	var lrcshow = document.getElementById("lrcshow");
	while (lrcshow.hasChildNodes()) { //当div下还存在子节点时 循环继续
		lrcshow.removeChild(lrcshow.firstChild);
	}
}
// 播放模式选择
function bfms() {
	bfms_val++; //当前播放模式对应数值
	if (bfms_val == 4) {
		bfms_val = 1;
	}
	var icon = document.getElementById("bfms");
	if (bfms_val == 1) {
		icon.src = "images/icon07.png"; //循环播放
	} else if (bfms_val == 2) {
		icon.src = "images/icon08.png"; //随机播放
	} else {
		icon.src = "images/icon09.png"; //单曲循环
	}
	// console.log(bfms_val);
}
bfms();
//播放结束运行播放模式
player.onended = function() {
	// console.log(bfms_val+"播放模式")
	if (bfms_val == 1) { //循环播放，下一首
		next();
	} else if (bfms_val == 2) { //随机播放
		songlist.value = parseInt(Math.random() * 4); //随机数0~4，确定随机数，及歌单歌曲数
		listchange(songlist);
	}
	player.play();
	document.getElementById("play").src = "images/icon02.png";
	status = 1;
	showtime();
	timer = setInterval(showtime, 1000);
}
// 收藏喜欢
var love = 0;

function like() {
	var like = document.getElementById("like");
	if (love == 0) {
		like.src = "images/icon11.png";
		love = 1;
	} else {
		like.src = "images/icon10.png";
		love = 0;
	}
}