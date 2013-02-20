/**
 * @fileoverview Nap JS源码
 * @desc Nap JS是一款代码简易而功能强大的Javascript框架
 * @author Napster<809270105@qq.com>
 * @date 2013-01-12
 * @version 1.0
 */
(function(){
	var Nap = window.nap = function(selector,context){
		//1.通过选择器进行查找
		var r = _find(selector,context);
		//2.挂载nap属性

		if(r.length){

			Nap.Object.extend(r,_nap_prototype);

			return r;
		}
		//3.返回对应结果

		return [];
	};

	/*
	 * 方法总控制器  共48个API
	 */
	var _nap_prototype = {
		//获取是否为Nap对象
		nap : true,

		//获取选择的Dom集合的数量
		size : function(){
			return this.length;
		},

		//获取选择的Dom集合的第几个，返回Dom Element对象
		get : function(which){
			if(Nap.Array.isNumber(which)){
				return this[which]? Nap(this[which]) : null ;
			}else{
				Nap.error('You Put Is Not A Number!');
			}
		},

		//循环Dom集合并执行
		each : function(callback){
			for (var i = 0; i <this.length; i++) {
					callback(Nap(this[i]));
			};
		},

		//返回指定Dom在选择Dom集合里面的位置，参数支持原生Dom和nap对象
		index : function(el){
			if(!el) return -1;
			
			if(el.nap){
				el = el[0];
			}

			return Nap.Array.index(this,el);
		},

		//获取或设置对象的attribute属性值
		attr : function(name,value){
			if(typeof(value) == 'undefined'){
				var el = this[0];
				switch(name){
					case 'class':
						return el.className;
					case 'style':
						return el.style.cssText;
					default:
						return el.getAttribute(name);
				}
			}else{
				this.each(function(el){
					el = el[0];
					switch(name){
						case 'class':
							el.className = value;
							break;
						case 'style':
							el.style.cssText = value;
							break;
						default:
							el.setAttribute(name,value);
							break;					
					}
				});
			}
			return this;
		},

		//获取或设置对象的prototype属性值
		prop : function(name,value){
			if(typeof(value) == 'undefined'){
				return this[0][name]; //默认返回第一个节点文本
			}else{
				this.each(function(el){
					el[0][name] =  value;
				});
			}

			return this;
		},

		//在Document中移除此对象
		remove : function(){
			this.each(function(el) {
				el[0].parentNode.removeChild(el[0]);
			});

			return this;
		},

		//获取或设置对象的css样式值 
		css : function(name,value){
			function hyphenate(name){
				return name.replace(/([A-Z])/g,'-$1').toLowerCase();
			}
			if(typeof(value) == 'undefined'){
				var el = this[0];
				if(el.style[name]){
					return el.style[name];
				}else if(el.currentStyle){  //for IE
					return el.currentStyle[name];
				}else if(window.getComputedStyle){
					window.getComputedStyle(el,null).getPropertyValue(hyphenate(name));
				}else if(window.defaultView  && window.defaultView.getComputedStyle){
					var computed = document.defaultView.getComputedStyle(el,null);
					return computed.getPropertyValue(hyphenate(name));
				}
			}else{
				this.each(function(el){
					el = el[0];
					if(typeof value == 'number') value +=  'px';
					el.style[name] = value;
				});
			}

			return this;
		},

		//获取或设置对象的文本值
		text : function(value){
			return this.prop(typeof(this[0].innerText) != 'undefined' ? 'innerText' : 'textContent', value);  //区别IE和FF
		},

		//获取或设置对象的HTML值
		html : function(value){
			return this.prop('innerHTML',value);
		},

		//获取或设置表单对象的值
		val : function(value){
			if(typeof(value) == 'undefined'){
				var el = this[0];
				if(el.tagName.toLowerCase() == 'input'){
					switch(el.type){
						case 'checkbox':
							return el.checked?true:false;
							break;
						case 'radio':
							return el.checked?true:false;
							break;
					}
				}
				return el['value'];
			}else{
				return this.prop('value',value);
			}
		},

		//主动将对象本身插入到某个容器
		inject : function(el){
			if(!el.nap){
				el = Nap(el);
			}
			if(el) el.append(this);

			return this;
		},

		//在对象的最后一个子节点插入
		append : function(){
			var args = arguments;
			this.each(function(el){
				for(var i =0; i<args.length; i++){
					Nap.insert(el[0],args[i],1);
				}
			});

			return this;
		},

		//在对象的第一个子节点插入
		prepend : function(){
			var args = arguments;
			this.each(function(el){
				for(var i =0; i<args.length; i++){
					Nap.insert(el[0],args[i],2);
				}
			});

			return this;
		},

		//在对象的当前插入
		before : function(){
			var args = arguments;
			this.each(function(el){
				for(var i =0; i<args.length; i++){
					Nap.insert(el[0],args[i],3);
				}
			});

			return this;	
		},

		//在对象的后插入
		after : function(){
			var args = arguments;
			this.each(function(el){
				for(var i =0; i<args.length; i++){
					Nap.insert(el[0],args[i],4);
				}
			});

			return this;	
		},

		//向下查找，查找所有子节点
		down : function(el){
			return Nap(el,this);
		},

		//向上查找，查找所有父节点@el 所找的元素 @parent某处开始查找
		up : function(el,parent){

		},

		//向上查找，查找所有包括自己的父节点
		upWithMe : function(){

		},

		//给对象绑定事件
		on : function(){

		},

		//给对象解除事件
		un : function(){

		},

		//绑定对象范围之外触发的事件
		out : function(){

		},

		//解除对象范围之外触发的事件
		unout : function(){

		},


		//模拟触发对象上的某个事件
		simulate : function(){

		},

		//获取对象的横坐标
		left : function(){

		},

		//获取对象的纵坐标
		top : function(){

		},

		//获取对象的坐标，返回格式{left: 500, top: 500}
		pos : function(){

		},

		//获取或设置对象的高度
		height : function(){

		},

		//获取或设置对象的宽度
		width : function(){

		},

		//显示对象
		show : function(){

		},

		//隐藏对象
		hide : function(){

		},

		//更改对象可见样式，之前可见改隐藏，之前隐藏改可见
		toggle : function(){

		},

		//表单对象获取焦点
		focus : function(){

		},

		//获取该节点前面的第n(索引)个节点， Param: number；为0表示前面第一个，为1表示前面第2个；
		prev : function(){

		},

		//获取该节点前面的所有节点
		prevAll : function(){

		},

		//获取该节点后面的第n(索引)节点， Param: number；为0表示后面第一个，为1表示后面第2个；
		next : function(){

		},

		//获取该节点后面的所有节点
		nextAll : function(){

		},

		//获取第一个子节点
		first : function(){

		},

		//获取最后一个子节点
		last : function(){

		},

		//获取所有子节点， [Param: number, 表示获取第n(索引)个字节点]
		children : function(){

		},

		//获取父节点， [Param: number, 表示获取向上第n(索引)代父节点，如parent(0)表示父节点， parent(1)表示父节点的父节点]
		parent : function(){

		},

		//检查对象是否含有某个className
		hasClass : function(){

		},

		//添加某个className
		addClass : function(){

		},

		//删除某个className
		removeClass : function(){

		},

		//删除某个属性
		removeAttr : function(){

		},

		//删除某个style下的样式属性, 参数为空时，则删除所有style样式
		removeCSS : function(){

		},

		//对象执行动画，相当于nap.anim($("#test"))，可参考Anim
		anim : function(){

		}

	};

	Nap.Object = {

		extend : function(n,o) {
			for(var i in o){
				n[i] = o[i];
			}
			return n;
		}


	};

	//将继承挂载到
	Nap.extend = function(options){
		Nap.Object.extend(Nap,options);
	}

	Nap.extend({
		insert : function(cNode,tNode,which){
			
			function _insert(cNode,children,which,isObject){
					var len = children.length;
					
					switch(which){
						//1.把目标节点添加到当前节点下的最后一个子节点 append
						case 1:
							if(!isObject){
								for(var i=0; i<len; i++){
									cNode.appendChild(children[0]);
								}
							}else{
								cNode.appendChild(children);
							}
							break;
						//2.把目标节点添加到当前节点下的第一个子节点  prepend
						case 2:
							if(!isObject){
								for(var i=0; i<len; i++){
									cNode.insertBefore(children[0],cNode.firstChild);
								}
							}else{
								cNode.insertBefore(children,cNode.firstChild);
							}
							break;
						//3.把目标节点添加到当前节点的并列上一个节点 before
						case 3:
							if(!isObject){
								for(var i=0; i<len; i++){
									cNode.parentNode.insertBefore(children[0],cNode);
								}
							}else{
								cNode.parentNode.insertBefore(children,cNode);
							}
							break;
						//4.把目标节点添加到当前节点的并列下一个节点 after
						case 4:
							if(!isObject){
								for(var i=0; i<len; i++){
									cNode.parentNode.insertBefore(children[0],cNode.nextSibling);
								}
							}else{
								cNode.parentNode.insertBefore(children,cNode.nextSibling);
							}
							break;
						default:
							Nap.log('Invalid Parameter!');
							break;
					}
			
			}

			var children,isObject=true;
			which = which || 1;
			if(cNode && cNode.nodeType  == 1){

				if(typeof tNode == 'string'){
					var container = document.createElement('div');
					container.innerHTML = tNode;
					children = container.childNodes;
					isObject = false;
				}else{
					if(tNode.nap)	tNode = tNode[0];
					children = tNode;
				}

				_insert(cNode,children,which,isObject);
			}
			


		}
	});

	//工具类库
	Nap.Util = {
		log : function(str) {
			if(!str) return;
			if(typeof console !== "undefined" && console.log){
				console.log(str);
			}	
		},
		
		error : function(eMsg) {
			if(!eMsg) return;
			if(typeof console !== "undefined" && console.error){
				console.error(eMsg);
			}
		}
	}

	/*
	 * 对Array类的扩展 , 共7个API
	 */	
	Nap.Array = {
		//返回某个值在数组的位置
		index : function(scope,el){
			for(var i=0; i<scope.length; i++){
				alert(i)
				if(scope[i] == el) return i;
			}
			return -1;
		},
		//循环数组并执行
		each : function(){

		},
		//循环数组，并执行后返回新的数组
		collect : function(){

		},
		//检查数组是否包含某个值
		include : function(scope,el){
			return this.index(scope,el) != -1;
		},
		//删除数组中的某个值，参数支持值和数组位置
		remove : function(){

		},
		//随机取数组中的任意一项
		random : function(){

		},
		//删除数组中的重复项
		unique : function(){

		},
		//判断是否是整数
		isNumber : function(num){
			var r = /^\+?[0-9][0-9]*$/;//整数 
            return r.test(num);
		}

	}

	var _find = function(selector,context){
		
		if(context && context.nap){
			context = context[0];
		}else{
			context = document;	
		}
				
		if(selector){
			if(typeof selector ===  'object'){
				if(selector instanceof Array &&  selector.nap){
					return selector;	
				}else{
					return [selector];
				}

			}else if(typeof selector === 'string' && context.querySelectorAll){
				return convertToArray(context.querySelectorAll(selector));
			}
		}
		
		return [];
	}

	var convertToArray = function(nodeList){
		var realArr =[],len;
		if(nodeList && (len = nodeList.length)){
			try{
				realArr = Array.prototype.slice.call(nodeList);
			}catch(e){
				for(var i=0; i<len; i++){
					realArr.push(nodeList.item(i));
				}
			}
		}
		
		return realArr;
	};

	Nap.extend(Nap.Util);

	window.Nap = Nap;
})();

