window.onload = function(){
	var music = document.getElementById('music');
	var audio = document.getElementsByTagName('audio')[0];
	var page1 = document.getElementById('page1');
	var page2 = document.getElementById('page2');
	var page3 = document.getElementById('page3');

	// 当音乐播放完毕，停止CD转动动画
	audio.addEventListener('ended', function(e){
		music.setAttribute('class', '');
	}, false)


	// 点击CD图标，控制音乐播放

	// music.onclick = function(){
	// 	if(audio.paused){
	// 		audio.play();
	// 		// this.setAttribute('class', 'play');//效果不好
	// 		this.style.animationPlayState = 'running';//兼容性不好
	// 		this.style.webkitAnimationPlayState = 'running';
	// 	}else{
	// 		audio.pause();
	// 		// this.setAttribute('class', '');//效果不好
	// 		this.style.animationPlayState = 'paused';//兼容性不好
	// 		this.stylewebkitAanimationPlayState = 'paused';
	// 	}
	// }

	// 手机事件
	music.addEventListener('touchstart', function(e){
		if(audio.paused){
			audio.play();
			// this.setAttribute('class', 'play');//效果不好
			this.style.animationPlayState = 'running';//兼容性不好
			this.style.webkitAnimationPlayState = 'running';
		}else{
			audio.pause();
			// this.setAttribute('class', '');//效果不好
			this.style.animationPlayState = 'paused';//兼容性不好
			this.stylewebkitAanimationPlayState = 'paused';
		}
	}, false);

	// 翻页
	page1.addEventListener('touchstart', function(e){
		page1.style.display = 'none';
		page2.style.display = 'block';
		page3.style.display = 'block';
		page3.style.top = '100%';

		setTimeout(function(){
			page2.setAttribute('class', 'page fadeOut');
			page3.setAttribute('class', 'page fadeIn');
		}, 5500)
	}, false);
}