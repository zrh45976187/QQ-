$(function(){
	var $go = $('#go');
	var a = 1;
	var b =1 ;
	// ajax----------------------------------------------------
	var songCount =10;
	
	//开始截取歌曲位置
	var songLimit =0;
	
	//初始化
	var aaa = null;
	
		//发起ajax请求
		$.ajax({
			type: 'POST',
			url: 'https://api.hibai.cn/api/index/index',
			//对于post请求, 参数传递保存在data属性中
			data: {
				TransCode:'020111',
				OpenId: 'Test',
				Body: {SongListId:"141998290"}
			},
	
			success: function (data) {
	
				console.log('data ==> ', data);
				aaa = data.Body.songs
	
				//缓存
				localStorage.songData = JSON.stringify(data);
	
				generateSong(data);
				var jieliu;
				window.onscroll = function() {
					clearTimeout(jieliu)
					jieliu = setTimeout(function() {
						if(songCount > data.Body.songs.length) {
							return;
						}
						if(scrollY+600 > Math.abs($('.clearfix').last().offset().top)) {
							  songLimit +=10;
							songCount += 10
							for(var i = songLimit; i < songLimit +1; i++) {
								
								generateSong(data);
								}
						 
						}
					 ;
						
					}, 200)
				
				}
			
	
			},
	
			error: function (err) {
				console.log('请求失败');
				console.log('err ==> ', err);
			}
		})
		
		
		
		
		
	
		function generateSong(data) {
	
		var d = data.Body.songs.slice(songLimit, songCount);
	
		console.log(d);
		var fragment = document.createDocumentFragment();
	
		$.each(d, function (i, v) {
			var $li = $(`<li class="clearfix" id="${v.id}" class="clearfix" data-title="${v.title}" data-author="${v.author}" data-url="${v.url}" data-lrc="${v.lrc}" data-isplay="false" data-pic="${v.pic}">
							<div class="fl singer-img" style="background: url('${v.pic}') no-repeat center center; background-size: cover;"></div>
							<div class="fl singer-info">
								<div class="name">${v.title}</div>
								<div class="song">${v.author}</div>
							</div>
							<div class="fr play-icon">
								<i class="fa fa-play-circle-o"></i>
							</div>
						</li>`);
	
			$(fragment).append($li);
	
	
		})
	
		$('#songList').append($(fragment));
	
		  playMusic();
	}
	$('#nav').on('click',function(){
		$('#bot').slideUp(500);
	})
	
	
	
	
	$('#musicimg').on('click', function () {
	   $('#nav').slideUp(500);
		$('#layerSong').slideDown(500);
		 console.log($(this).data('lrc'));
		//获取播放状态
		var isplay = $('#get').data('isplay');
		
		var $singerAvatar = $('#layerSong').find('#singerAvatar')
	
		if (Boolean(isplay)) {
			$singerAvatar.css({
				animationPlayState: 'running'
			})
		} else {
			$singerAvatar.css({
				animationPlayState: 'paused'
			})
		}
		
		$('#name1').text($(this).data('title'));
		$('#name2').text($(this).data('author'));
		
		$singerAvatar.css({
	
			background: 'url("' + $(this).data('pic') + '") no-repeat center center',
				
			backgroundSize: 'cover'
		});
		
	
	})
	//歌词------------------------------------------------------------
		var gecid;
		var gdgeci
		function geci(data) {

			$.ajax({
				type: "post",
				url: data,
				async: true,
				data: {
					TransCode: "020111",
					OpenId: "Test",
					Body: {
						SongListId: "141998290"
					}
				},
				success: function(data) {
				
					$('#gechi>p').remove();
					$('#gechi').append($('<p></p>'));
					clearInterval(gecid);
					clearInterval(gdgeci);
					var arr1 = [];
					var arr2 = [];
					var arr3 = [];
					var arr4 = [];
					var arr5 = [];
					var arr6 = [];
					var a = data.split(/\n/);
					var reg = /[|\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\d]/;
					
					for(let i = 0; i < a.length; i++) {
						if(a[i].length>11){
							arr5.push(a[i])
						}else{
							arr6.push(a[i])
						}			
						
					}
						for(let j = 0 ; j<arr5.length;j++){
							var test = arr5[j].split(reg).filter(d => d);
						if(test.length > 0){
							arr1.push(test);
						}else{
							arr4.push(test)
						}
						
							arr2.push(arr5[j].slice(1, 6));
							parseInt(arr2[j].slice(0, 2) * 60);
							parseInt(arr2[j].slice(3, 6));
							arr3.push(parseInt(arr2[j].slice(0, 2) * 60) + parseInt(arr2[j].slice(3, 6)));
						}
					
//					console.log(arr5)					
//					console.log(arr1)
//					console.log(arr2)
//					console.log(arr3)
		
					
					gecid = setInterval(function() {
						
						
						for(var i = 0; i < arr1.length; i++) {
								
								
							if(arr3[i] <= Math.round($('audio')[0].currentTime)&&Math.round($('audio')[0].currentTime)<arr3[i+1]) {
								
								$('#gechi>p').text(arr1[i]);
							}
						}
					}, 500);
					
	
					var gd = 0;
					arr1.push([])
					var alltime = arr3[arr3.length-1] + 50;
					
					arr3.push(alltime)
				}
			});
		}
	
	
	
	
	
	
	//————————————————————————————————————————————————————————————————————————
	
	$('#close').on('click', function () {
		$('#layerSong').slideUp(500);
		$('#nav').slideDown(500);
	})
	
//绑定li click事件--------------------------------------------------------------
		function playMusic() {
		$('#songList>li').on('click', function () {
			$('#bot').slideDown(500);
			var data =$(this).data('lrc');
			console.log(data);
			geci(data);
			
			var $audio = $('#audio');
	
			if (!$(this).hasClass('active-audio')) {
	
				//设置之前激活的li data-isplay = false, 并且修改图标
				var $audioActive = $('.active-audio');
	
				if ($audioActive[0]) {
					$audioActive.data('isplay', false).find('i').removeClass('fa-pause-circle-o').addClass('fa-play-circle-o');
				}
				
				var url = $(this).data('url');
				
				$audio.attr('src', url);
				$(this).addClass('active-audio').siblings().removeClass('active-audio');
	
				//修改歌手头像
				$('#musicimg').css({
					background: 'url("' + $(this).data('pic') + '") no-repeat center center',
					backgroundSize: 'cover',
				}).data('pic', $(this).data('pic'));
				$('#musicimg').data('author', $(this).data('author'));
				$('#musicimg').data('title', $(this).data('title'));
				
	
	
				//激活歌曲进度条
 				$('#layer').show();
 				
	
			}
			
	
			if (Boolean($(this).data('isplay'))) {
				console.log(Boolean($(this).data('isplay')));
				//停止音频
				$audio[0].pause();
	
				$(this).data('isplay', false).find('i').removeClass('fa-pause-circle-o').addClass('fa-play-circle-o');
	
				$('#get').data('isplay', false).find('i').removeClass('fa-pause-circle-o').addClass('fa-play-circle-o');
	
			} else {
	
				//播放音频
				$audio[0].play();
	
				$(this).data('isplay', true).find('i').removeClass('fa-play-circle-o').addClass('fa-pause-circle-o');
	
				$('#get').data('isplay', true).find('i').removeClass('fa-play-circle-o').addClass('fa-pause-circle-o');
	
			}
	
		})
	}
	
	
	
	
		//左右切换音频
	function toggleMiusc() {
	
		$('.prev').on('click', function () {
	
			//获取data-num
			var num = $(this).data('num'); //只有列表循环才效果
			console.log(num);
			//获取播放模式
			var mode = $('#ran').data('mode');
	
			toggleMuiscForMode(mode, num);
	
	
	
		})
	
	}
	toggleMiusc();
	
	
	//根据模式切换音频
	function toggleMuiscForMode(mode, num) {
		//mode: 模式
		//1: 列表循环
		//2: 随机播放
		//3: 单曲循环
	
		var $lis = $('#songList>li');
	
		var $audio = $('#audio');
	
		var url = '', pic = '';
	
		//获取激活li
		var $activeAudio = $('.active-audio');
	
		if (mode == 1) {
			//列表循环
	
			if ($activeAudio[0]) {
				//有激活的li
	
				//获取当前激活li的下标
				var index = $activeAudio.index();
	
				//获取列表歌曲数量
				var count = $lis.length;
	
				index += num;
	
				//保存播放上一首或者下一首的li下标
				index = index >= count ? 0 : index <= -1 ? count - 1 : index;
	
	
				//修改之前激活里的状态
				$activeAudio.data('isplay', false).removeClass('active-audio').find('i').removeClass('fa-pause-circle-o').addClass('fa-play-circle-o');
	
				//修改当前li状态
				var $cLi = $lis.eq(index);
				$cLi.data('isplay', true).addClass('active-audio').find('i').removeClass('fa-play-circle-o').addClass('fa-pause-circle-o');
	
				url = $cLi.data('url');
	
				pic = $cLi.data('pic');
			}
		}
	}
	
	
	
	
	
	
	//保存音频总时长
	
	function formatTime(second) {
		
		var m = Math.floor(second / 60 % 60);
		m = m >= 10 ? m : '0' + m;

		var s = Math.floor(second % 60);
		s = s >= 10 ? s : '0' + s;

		return m + ':' + s;

	}
	
	
	
	$('#audio').on('canplay',function () {
	
				var alltime=this.duration;
				
				$('#time2').text(formatTime(alltime));
				
	})
	
	
	
	// 暂停播放---------------------------------------------------------------
// 	$('#get').on('click',function(){
// 				
// 		
// 		if(a === 1){
// 			$('#audio')[0].play();
// 			$('#go').removeClass('fa-play-circle-o').addClass('fa-pause-circle-o');
// 			
// 			a=0;
// 		}else if(a === 0){
// 			$('#audio')[0].pause();
// 			$('#go').removeClass('fa-pause-circle-o').addClass('fa-play-circle-o');
// 			a=1;
// 			
// 		}
// 	
// 		
// 	})
// 	
	
		//暂停和播放音频
	$('#get').on('click', function () {
	
		//获取激活的li
		var $audioActive = $('.active-audio');
		if ($audioActive[0]) {
	
			console.log($(this).data('isplay'));
	
			if ($(this).data('isplay')) {
				//暂停
				$(this).data('isplay', false).find('i').removeClass('fa-pause-circle-o').addClass('fa-play-circle-o');
	
				$audioActive.data('isplay', false).find('i').removeClass('fa-pause-circle-o').addClass('fa-play-circle-o');
				
				$('#singerAvatar').css({
					animationPlayState: 'paused'
				})
				
				
				$('#audio')[0].pause();
	
			} else {
				//播放
				$(this).data('isplay', true).find('i').removeClass('fa-play-circle-o').addClass('fa-pause-circle-o');
	
				$audioActive.data('isplay', true).find('i').removeClass('fa-play-circle-o').addClass('fa-pause-circle-o');
	
				$('#audio')[0].play();
				$('#singerAvatar').css({
					animationPlayState: 'running'
				})
			}
	
		} else {
			//如果没有激活的li, 根据播放模式播放音频
	
	
		}
	
		
	
	})
	
	
	
	var modeIcons = ['random','refresh','exchange'];
	
	$('#ran').on('click',function(){
		
		var mode = $(this).data('mode');
		
		var $i = $(this).find('i');
		
		$i.removeClass('fa-' + modeIcons[mode - 1]);
		
		mode = mode >= 3 ? 1 : ++mode;
		
		$i.addClass('fa-' + modeIcons[mode - 1]);
		
		$(this).data('mode', mode);
	})
	
	// 进度条-------------------------------------------------
		function songProgress() {
	
		var $progressLayer = $('#layer');
	
		$progressLayer.on('touchstart', function (e) {
	
		 	moveProgressMask(e, $(this));
	
		})
	
	
		$progressLayer.on('touchmove', function (e) {
			moveProgressMask(e, $(this));
		})
	
	}
	
	//移动歌曲进度条滑块
	function moveProgressMask(e, t) {
		var x = e.touches[0].pageX;
	
		var offsetX = t.offset().left;
			
		 var $progressMask = $('#mask');
	
		 var w = $progressMask.width();
	
		 var minX = - w / 2;
	
		 var maxX = t.width() - w / 2;
	
		 var left = x - offsetX - w / 2;
	
		 left = left <= minX ? minX : left >= maxX ? maxX : left;
	
		 console.log('left ==> ', left);
	
		 $progressMask.css({
		 	left: left + 'px'
		 })
	
		 var percent = (x - offsetX) / t.width();
	
		 //设置激活激活进度条的宽度
		 $('#activeProgress').width(percent * t.width());
		 
		 
		 
		 $('#audio')[0].currentTime = duration * percent;
		  
	}
	
	//开启歌曲进度条
	songProgress();
		$('#audio').on('timeupdate',function () {
				
				var alltime =this.currentTime;
				
				$('#time1').text(formatTime(alltime));
				
				var percent = alltime / this.duration;
				
				var w = $('#layer').width();
				
				var $progressMask = $('#mask');
				
				var mw =  $('#mask').width();
				
				 $('#mask').css({
					left: w * percent - mw / 2 + 'px'
				})
				
				$('#activeProgress').css({
					width: percent * w
				})
				
				//设置激活激活进度条的宽度
				
	})
	var duration = 0;
	
		$('#audio').on('canplay', function () {
		//获取音频总时长
		duration = this.duration;
		
		//获取音频音量
		volume = this.volume;
	
// 		var w = $('#volumeLayer').width();
// 	
// 		var $volumeMask = $('#volumeMask');
// 		var vm = $volumeMask.width();
// 	
// 		$('#activeVolumeProgress').width(w * volume);
// 	
// 		$volumeMask.css({
// 			left: w * volume - vm / 2 + 'px'
// 		})
// 	
	})
	
	
	
		$('#audio').on('ended', function () {
	
		$('.active-audio').find('i').removeClass('fa-pause-circle-o').addClass('fa-play-circle-o').end().data('isplay', false);
	
		$('#get').find('i').removeClass('fa-pause-circle-o').addClass('fa-play-circle-o');
	
		//设置当前音频播放时间为0
		this.currentTime = 0;
	
		//重置进度条滑块的位置
		var $progressMask = $('#mask');
		$progressMask.css({
			left: -$progressMask.width() / 2 + 'px'
		})
	
		//停止转盘
		
	
	})
})