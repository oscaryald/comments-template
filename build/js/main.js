$(document).ready(function(){

	function Post(param){

		this.countComments = param.countComments;

		this.loadMoreComments = param.loadMoreComments;

		this.items = [];

		this.that = this

		
	}

	Post.prototype = {

		constructor: Post,

		init : function(){


			this.getPost();

			this.addEventHandler()

		},

		sortPost: function(arr, num){

			$(arr).addClass(hidden)

		},

		loadMore: function(arr, num, pos){

			this.countComments = arr.length;

			if(this.countComments + this.loadMoreComments > this.countComments){
				this.countComments += this.loadMoreComments
			}

			this.getPost({
				pos: arr.length
			})
			
			return 
		},

		addEventHandler: function(){

			var that = this;

			console.log(this.items.length)

			$('.load-more').on('click', function(){
				that.loadMore(that.items);

				return false
			})
		},

		getPost : function(param){

			var that = this;

			for(var i in param ){
				var pos = param.pos
			}

			function dateReviver(key, value) {
			    var ms = Date.parse(value),
				    date = new Date(ms),
				    year = date.getFullYear(),
				    month = date.getMonth(),
				    day = date.getDate(),
				    minutes = ( date.getMinutes()<=9 ) ? '0' + date.getMinutes() : date.getMinutes();
				    hours = date.getHours();
				value = year + '-' + month + '-' + day + ' at ' + hours + ':' + minutes;
			    return value;
			};

			function createTemplate(arr, key){

				arr.push( "<li class='comment'>" + 
				      	'<img src="'+this.author.avatar+'" alt="" />'+
				      	'<h3>'+this.author.name+'</h3><span>'+dateReviver(key, this.author.created_at)+'</span>'+
				      	'<p>'+this.content+'</p>'+
				      	
				      	'<ul>'+createChildrenTemplate.apply(this)+'</ul>'+
				      	
				      	createButtons()+
				      	"</li>" );
			}

			function createChildrenTemplate(){

				if(this.children.length == 0) return '';

				var arrChildren = [];

				this.children.forEach(function(el, key){
					arrChildren.push( 
				      	'<li><img src="'+el.author.avatar+'" alt="" />'+
				      	'<h3>'+el.author.name+'</h3><span>'+dateReviver(key, el.author.created_at)+'</span>'+
				      	'<p>'+el.content+'</p>'+'</li>'
				      	 );
				});
				arrChildren = arrChildren.join('')
				return arrChildren
			}

			function createButtons(){
				var btnHtml = '<div class="btn-block">'+
				'<a href="#" class="edit">Edit</a> '+
				'<a href="#" class="delete">Delete</a> '+	
				'<a href="#" class="reply">Reply</a> '+		
				'</div>'
				return btnHtml
			}

			

			function load(){

				$('.comments-content').html('');
				that.items = []

				$.ajax({
				    url: 'http://frontend-test.pingbull.com/pages/oscaryld@gmail.com/comments/',
				    type: 'GET',
				    dateType: 'json',
				    success: function(data){

				    	console.log(data)
					
					    $.each( data, function( key, val ) {

					    	if (key < that.countComments) {
						          createTemplate.apply(val, [that.items, key]);
						    }  

					    });


					    $( "<ul/>", {
					      "class": "comments-list",
					      html: that.items.join( "" )
					    }).appendTo( ".comments-content" );

				    }
				})	

			};

			return load()
		},




	}


	var post = new Post({
		countComments:2,
		loadMoreComments: 2
	});


	post.init()

});
