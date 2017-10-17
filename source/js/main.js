$(document).ready(function(){

	function Post(param){
		this.countComments = param.countComments || 1;
		this.loadMoreComments = param.loadMoreComments || 1;
		this.items = [];
	}

	Post.prototype = {

		constructor: Post,

		init : function(){


			this.getPost();

			this.addEventHandler();

			this.filterComment()

		},


		loadMore: function(arr){

			// this.countComments = arr.length;

			if(this.countComments + this.loadMoreComments > this.countComments){
				this.countComments += this.loadMoreComments
			}

			this.getPost()
			
			return 
		},

		addCommentsTemplate : function(comment){
			var that = this;
			var commentsTemplate = $('#comments-template').html()
			comment.created_at = that.dateReviver(comment.created_at)
			for(var i = 0; i < comment.children.length; i++){
				comment.children[i].created_at = that.dateReviver(comment.children[i].created_at)
			}
			$( ".comments-list" ).append(Mustache.render(commentsTemplate, comment));
		},

		addEventHandler: function(){

			var that = this;
			var valTextarea
			var commentId

			// var valTextarea = $(this).parents('li').find('.comment-content').val();

			// var commentId = $(this).parents('li').attr('id')

			$('.load-more').on('click', function(){
				that.loadMore(that.items);
				return false
			});

			$('.comments-content').on('click','.edit', function(){
				valTextarea = $(this).parents('li').find('.comment-content').val();
				commentId = $(this).parents('li').attr('id');
				if(valTextarea == ''){
					$(this).parents('li').find('.comment-content').addClass('error');
					return false
				}else{
					$(this).parents('li').find('.comment-content').removeClass('error');
				} 
				that.editComment.apply($(this), [valTextarea, commentId]);
				$(this).parents('li').find('.comment-content').val('')
				return false
			});

			$('.comments-content').on('click','.delete', function(){
				commentId = $(this).parents('li').attr('id');
				that.deleteComment.apply($(this), [commentId]);
				return false
			})


			$('.comments-content').on('click','.reply', function(){
				valTextarea = $(this).parents('li').find('.comment-content').val();
				that.replayComment.apply($(this), [valTextarea]);
				return false
			})

			$('.comments-block').on('click','.add', function(){
				valTextarea = $(this).parents('.message-field').find('.comment-content').val();
				console.log(valTextarea)
				if(valTextarea == ''){
					$(this).parents('.message-field').find('.comment-content').addClass('error');
					return false
				}else{
					$(this).parents('.message-field').find('.comment-content').removeClass('error');
				} 
				that.addNewComment.apply($(this), [valTextarea]);
				$(this).parents('.message-field').find('.comment-content').val('')
				return false
			});

			$('.comments-block').on('click','.cancel', function(){
				$(this).parents('.message-field__textarea').addClass('hidden');
				return false
			})


		},

		dateReviver : function(value){
			var ms = Date.parse(value),
				    date = new Date(ms),
				    year = date.getFullYear(),
				    month = date.getMonth()+1,
				    day = date.getDate(),
				    minutes = ( date.getMinutes()<=9 ) ? '0' + date.getMinutes() : date.getMinutes(),
				    hours = date.getHours();
				value = year + '-' + month + '-' + day + ' at ' + hours + ':' + minutes;
			    return value;
		},

		getPost : function(param){

			var that = this;

			function load(){

				$('.comments-list').html('');
				that.items = [];

				$.ajax({
				    url: 'http://frontend-test.pingbull.com/pages/oscaryld@gmail.com/comments/',
				    type: 'GET',
				    dateType: 'json',
				    success: function(data){

				    	console.log(data)
					
					    $.each( data, function( key, val ) {

						    if (key < that.countComments) {
						    	that.addCommentsTemplate(val);
							}

					    });
						
				    }
				})	

			};

			load()

		},

		addNewComment : function(newComment){

			var id = $(this).parents('li').attr('id');
			var targetComment = $(this);
			var comment = {
				content : newComment,
				id: id || null
			}

			$.ajax({
				type: "POST",
				url : 'http://frontend-test.pingbull.com/pages/oscaryld@gmail.com/comments/',
				data:comment,
				success: function(data){
					var commentsTemplate = $('#comments-template').html();
					data.created_at = Post.prototype.dateReviver.apply(Post, [data.created_at])
					$( ".comments-list" ).prepend(Mustache.render(commentsTemplate, data));
					console.log(data.content)
				}

			})

			return false

		},

		replayComment : function(newComment){
			var id = $(this).parents('li').attr('id');
			var targetComment = $(this);


			var url = 'http://frontend-test.pingbull.com/pages/oscaryld@gmail.com/comments/';

			var comment = {

				children : [{content : newComment}]
				// 	{
				// 		content : newComment,
				// 		// id: id
				// 	}
				// ]
			}

			console.log(comment)

			$.ajax({
				type: "PATCH",
				url : url + id,
				data:comment,
				success: function(data){

					var commentsTemplate = $('#comments-template').html();
					data.created_at = Post.prototype.dateReviver.apply(Post, [data.created_at])
					$( ".comments-list" ).prepend(Mustache.render(commentsTemplate, data));
					console.log(data.content)

				}

			})

			return false

		},

		deleteComment : function(id){

				var elementId = $('#'+id) 

				var url = 'http://frontend-test.pingbull.com/pages/oscaryld@gmail.com/comments/';

			    $.ajax({
			         type: "DELETE",
			         url: url + id,
			         dataType: "json",
			         success: function (data, status, jqXHR) {
			            elementId.remove()
			         },
			     
			         error: function (jqXHR, status) {
			             // error handler
			         }
			     });

			    return false

		},

		editComment : function(newComment, id){

				var elementId = $('#'+id);

				var comment = {
					content : newComment
				} 

				var url = 'http://frontend-test.pingbull.com/pages/oscaryld@gmail.com/comments/';

			    $.ajax({
			         type: "PUT",
			         url: url + id,
			         dataType: "json",
			         data:comment,
			         success: function (data, status, jqXHR) {
			         	elementId.find('p').html(newComment)
			         },
			     
			         error: function (jqXHR, status) {
			             // error handler
			         }
			     });

			    return false
		},

		filterComment : function(id){

				var id = '1';
				var url = 'http://frontend-test.pingbull.com/pages/oscaryld@gmail.com/comments?filter[{"author":"id"}]';

			    $.ajax({
			         type: "GET",
			         url: url,
			         dataType: "json",
			         success: function (data, status, jqXHR) {
			         	console.log(url)
			         	console.log(data)
			         },
			     
			         error: function (jqXHR, status) {
			             // error handler
			         }
			     });

			    return false
		}




	}


	var post = new Post({
		countComments:4,
		loadMoreComments: 2
	});


	post.init()


});
