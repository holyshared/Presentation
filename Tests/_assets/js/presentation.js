(function(){

this.addEventListener('load', function(){

var p = new Presentation('presentation', {

	onStart: function(){
		log('onStart');
	},

	onChange: function(index, length, content){
		log('index');
		log('length');
		log('onChange');
	},

	onTransitionStart: function(content){
		log('onTransitionStart');
	},

	onTransitionEnd: function(content){
		log('onTransitionEnd');
	}

});

p.addHelper(new Presentation.Helper.Controller())
	.addHelper(new Presentation.Helper.Keyboard())
	.addHelper(new Presentation.Helper.Page())
	.addHelper(new Presentation.Helper.Swipe());

p.start();

});

}.call(this));
