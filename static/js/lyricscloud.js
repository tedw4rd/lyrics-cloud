$(function(){

	window.SongModel = Backbone.Model.extend({
		urlRoot: '/api/v1/song/'
	});

	window.SongList = Backbone.Collection.extend({
		model: SongModel,
		initialize: function(data, options){
			this.band = options.band || false;
			this.album = options.album || false;
		},
		url: function() {
			params = "format=json"
			if(this.band){
				params += "&album__band__name=" + this.band;
			} else if(this.album){
				params += "&album__name=" + this.album;
			}
			return '/api/v1/song/?' + params;
		},

		parse: function(resp) {
				this.total = resp.meta.total_count;
				this.offset = resp.meta.offset + this.limit;
				this.hasMore = this.total > this.models.length;
				return resp.objects;
		}
	});

	window.LyricCloud = Backbone.View.extend({
		initialize: function(){
			this.collection.bind('change', this.render, this);
			this.collection.bind('add', this.render, this);
			this.collection.bind('remove', this.render, this);
			this.collection.bind('reset', this.render, this);
		},

		render: function(eventName){
			var words = [];
			for( var i = 0; i < this.collection.total; i++ ){
				var lyrics = this.collection.models[i].get('lyrics').replace('\n', ' ').replace('\r', ' ');
				words = words.concat(lyrics.split(' '));
			}

			alert(words);

			return this;
		}
	});

	window.Router = Backbone.Router.extend({

		routes:{
			"":"all",
		},
	
		all:function () {
			this.songList = new SongList(null, {});
			this.lyricCloud = new LyricCloud({collection:this.songList});
			this.songList.fetch();
			this.lyricCloud.render();
		}
	});
	
	var app = new Router();
	Backbone.history.start();
});