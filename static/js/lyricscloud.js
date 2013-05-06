$(function(){
	var w = 960;
	var h = 600;

	var g;

	var fill = d3.scale.category20();
	var fontSize = d3.scale.log().range([10, 100]);

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
			}
			if(this.album){
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

		draw: function(words){
			g.selectAll("text")
					.data(words)
				.enter().append("text")
					.style("font-size", function(d) { return d.size + "px"; })
					.style("font-family", "Impact")
					.style("fill", function(d, i) { return fill(i); })
					.attr("text-anchor", "middle")
					.attr("transform", function(d) {
						return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
					})
					.text(function(d) { return d.text; });
		},

		initialize: function(){
			this.collection.bind('change', this.render, this);
			this.collection.bind('add', this.render, this);
			this.collection.bind('remove', this.render, this);
			this.collection.bind('reset', this.render, this);
			g = d3.select("body").append("svg").attr("width", w).attr("height", h).append("g").attr("transform", "translate(" + [w >> 1, h >> 1] + ")");

			this.cloudVis = d3.layout.cloud()
				.size([w,h])
				.rotate(function() { return ~~(Math.random() * 2) * 90; })
				.font("Impact")
				.fontSize(function(d) { return d.size; })
				.on("end", this.draw);
		},

		render: function(eventName){
			var rawWords = [];

			for( var i = 0; i < this.collection.total; i++ ){
				var lyrics = this.collection.models[i].get('lyrics').replace('\n', ' ').replace('\r', ' ');
				rawWords = rawWords.concat(lyrics.split(' '));
			}

			if( rawWords.length == 0 ){
				return;
			}

			words = []
			for(var i = 0; i < rawWords.length; i++){
				var word = $.trim(rawWords[i]).toLowerCase();
				word = word.replace("?", " ").replace("!", " ").replace(".", " ").replace(",", " ");
				words.push(word);
			}

			var wordCounts = {};
			var wordKeys = [];
			var mostCount = 1;
			for(var i = 0; i < words.length; i++){
				var word = words[i];
				if(word in wordCounts){
					wordCounts[word] += 1;
					if(wordCounts[word] > mostCount){
						mostCount = wordCounts[word];
					}
				} else {
					wordCounts[word] = 1;
					wordKeys.push(word);
				}
			}

			fontSize.domain([1, mostCount]);

			this.cloudVis.words(wordKeys.map(function(d) {
				return {text: d, size: fontSize(wordCounts[d])};
			}));
			this.cloudVis.start();

			return this;
		}
	});

	var Router = Backbone.Router.extend({

		routes:{
			"":"all",
			":band":"displayBand",
			":band/:album":"displayAlbum"
		},

		initialize: function(){
			this.songList = new SongList(null, {});
			this.lyricCloud = new LyricCloud({collection:this.songList});
		},
	
		all:function () {
			this.songList.band = false;
			this.songList.album = false;
			this.songList.fetch();
		},

		displayBand: function(band){
			this.songList.band = band;
			this.songList.album = false;
			this.songList.fetch();
		},

		displayAlbum: function(band, album){
			this.songList.band = band;
			this.songList.album = album;
			this.songList.fetch();
		}
	});
	
	var app = new Router();
	Backbone.history.start();
});