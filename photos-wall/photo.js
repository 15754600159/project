var data = data;
	window.onload = function(){

	//3.通用函数
	function g(selector){
		var method = selector.substr(0, 1) == '.' ? 'getElementsByClassName' : 'getElementById';
		return document[method](selector.substr(1));
	}

	//根据取值范围生成随机数   random([min, max])
	function random(range){
		var max = Math.max(range[0], range[1]);
		var min = Math.min(range[0], range[1]);
		var diff = max - min;
		var numble = Math.ceil((Math.random()*diff + min));
		return numble;
	}

	//4.输出所有海报	
	// console.log(data)
	function addPhotos(){
		// console.log(g('#wrap'))
		var template = g('#wrap').innerHTML;
		// console.log(template)
		var html = [];
		var nav = [];

		for(var s in data){
			var _html = template.replace('{{index}}', s)
								.replace('{{img}}', data[s].img)
								.replace('{{caption}}', data[s].caption)
								.replace('{{desc}}', data[s].desc);
			html.push(_html);

			nav.push('<span id="nav_' + s + '" class="i">&nbsp;</span>');
		};

		html.push('<div class="nav"> '+ nav.join('') + '</div>')
		// console.log(html)
		g('#wrap').innerHTML = html.join('');

		rsort(random([0, data.length - 1]));
	}
	addPhotos();


	//6.计算左右分区的范围
	function range(){
		var range = { left: { x: [], y: [] }, right: { x: [], y: [] } };

		var wrap = {
			w: g('#wrap').clientWidth,
			h: g('#wrap').clientHeight,
		};
		var photo = {
			w: g('.photo')[0].clientWidth,
			h: g('.photo')[0].clientHeight,
		};

		range.wrap = wrap;
		range.photo = photo;

		range.left.x = [0 - photo.w, wrap.w/2 - photo.w/2];
		range.left.y = [0 - photo.h, wrap.h];

		range.right.x = [wrap.w/2 + photo.w/2, wrap.w + photo.w];
		range.right.y = range.left.y;

		return range;
	}


	//5.排序海报
	function rsort(n){
		var _photo = g('.photo');
		// console.log(_photo)
		//_photo只是一个类数组对象， 没有数组的全部方法
		var photos = [];

		// 样式初始化
		for(var s = 0; s < _photo.length; s++){
			_photo[s].className = _photo[s].className.replace(/\s*photo-center\s*/, '');
			// _photo[s].className = _photo[s].className.replace(/\s*photo-front\s*/, '');
			_photo[s].className = _photo[s].className.replace(/\s*photo-back\s*/, ' photo-front ');
			_photo[s].style.left = '';
			_photo[s].style.top = '';
			_photo[s].style['transform'] = _photo[s].style['-webkit-transform'] = 'rotateY(360deg) ';

			// _photo[s].onclick = null;

			photos.push(_photo[s]);
		}

		var photo_center = g('#photo_' + n);
		photo_center.className += ' photo-center ';
		photo_center.style['transform'] = photo_center.style['-webkit-transform'] = 'scale(1.2)';
		// photo_center.className += ' photo-front ';
		photo_center = photos.splice(n, 1)[0];

		//把海报分为左右两部分
		var photo_left = photos.splice(0, Math.ceil(photos.length/2));
		var photo_right = photos;
		// console.log(photo_left)

		var ranges = range();
		// console.log(ranges);
		for(var s in photo_left){
			var photo = photo_left[s];

			photo.style.left = random(ranges.left.x) + 'px';
			photo.style.top = random(ranges.left.y) + 'px';

			photo.style['transform'] = photo.style['-webkit-transform'] = 'rotate(' + random([-150, 150]) + 'deg) scale(0.9)';
		}
		for(var s in photo_right){
			var photo = photo_right[s];

			photo.style.left = random(ranges.right.x) + 'px';
			photo.style.top = random(ranges.right.y) + 'px';

			photo.style['transform'] = photo.style['-webkit-transform'] = 'rotate(' + random([-150, 150]) + 'deg) scale(0.9)';
		}

		//控制按钮局处理
		var navs = g('.i');
		for(var s = 0; s < navs.length; s++){
			navs[s].className = navs[s].className.replace(/\s*i-current\s*/, '');
			navs[s].className = navs[s].className.replace(/\s*i-back\s*/, '');

			// nav[s].onclick = null;
		}
		g('#nav_' + n).className += ' i-current ';

		bindClick();
	}



	//为图片和按钮绑定事件
	// .onclick 后面的函数会覆盖前面的函数
	function bindClick(){
		// 1.翻转控制
		// 点击图片翻转
		var images = document.getElementsByClassName('photo');
		var handler1 = function(){
			//this获取当前元素
			var index = this.id.split('_')[1];
			var target = this;
			var className = target.className;
			// console.log(className)

			if(/photo-front/.test(className)){
				className = className.replace(/photo-front/, 'photo-back');
				g('#nav_' + index).className += ' i-back ';
				// console.log('111')
			}else{
				className = className.replace(/photo-back/, 'photo-front');
				g('#nav_' + index).className = g('#nav_' + index).className.replace(/\s*i-back\s*/, '');
				// console.log('222')
			};
			target.className = className;
		}
		var handler2 = function(){
			//this获取当前元素
			var index = this.id.split('_')[1];
			// console.log(index)
			rsort(index);
		}
		for(var s = 0; s < images.length; s++){
			var image = images[s];
			if(/photo-center/.test(image.className)){
				// console.log(image)
				
				image.onclick = handler1;
			}else{
				
				image.onclick = handler2;
			}
		}
		

		// 点击小圆点翻转
		var icons = g('.i');
		var handler3 = function(){
			//this获取当前元素
			var index = this.id.split('_')[1];
			var target = g('#photo_' + index);
			var className = target.className;

			if(/photo-front/.test(className)){
				className = className.replace(/photo-front/, 'photo-back');
				g('#nav_' + index).className += ' i-back ';
			}else{
				className = className.replace(/photo-back/, 'photo-front');
				g('#nav_' + index).className = g('#nav_' + index).className.replace(/\s*i-back\s*/, '');
			};
			target.className = className;
		};

		for(var s = 0; s < icons.length; s++){
			var icon = icons[s];
			if(/i-current/.test(icon.className)){
				icon.onclick = handler3;
			}else{
				icon.onclick = handler2;
			}
		}


	}


	
}
