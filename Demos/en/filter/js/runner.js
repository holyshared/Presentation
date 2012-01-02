(function(win){

this.addEventListener('load', function(){

	var p = new Presentation('presentation', {
		onStart: function(){
			var height = 0;
			if (win.innerHeight) {
				height = win.innerHeight;
			} else if (doc.documentElement.clientHeight) {
				height = doc.documentElement.clientHeight;
			} else if (doc.body.clientHeight) {
				height = doc.body.clientHeight;
			}
			
			for (var i = 0; l = p.getLength(), i < l; i++){
				var content = p.getContent(i).toElement();
				content.setStyle('height', height);
			}

			var container = p.getContainerElement();
			container.setStyle('height', height);
		}
	});

	p.addHelper(new Presentation.Helper.Controller())
		.addHelper(new Presentation.Helper.Keyboard())
		.addHelper(new Presentation.Helper.Page());

	p.addFilter(filters.MarkdownFilter)
		.addFilter(filters.ProcessingFilter)
		.addFilter(filters.SyntaxHighlighterFilter);

	p.start();

});

}.call(this, this));