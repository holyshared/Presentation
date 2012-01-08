(function(markdown){

var markdown = this.markdown = markdown;

markdown.handlers = {

	isLoadedShowDown: function(presentation, configuration){
		if (!Showdown){
			this.failure();
		}
		this.success();
	},

	isLoadedParser: function(presentation, configuration){
		if (!markdown.MarkdownParser){
			this.failure();
		}
		this.success();
	},

	loadContent: function(presentation, configuration){

		var bootstrapper = this,
			container = null,
			sections = [],
			request = null,
			parser = new markdown.MarkdownParser();

		container = presentation.getContainerElement();

		request = new Request({
			url: configuration,
			onSuccess: function(text, xml){
				try {
					sections = parser.parse(text).toSections();
				} catch(exception){
					bootstrapper.failure();
					throw exception;
				}
	
				sections.each(function(section){
					section.inject(container);
					presentation.addContent(new Presentation.Content(section));
				});
	
				bootstrapper.success();
			}
		});
		request.get();

	}

};

}(this.markdown || {}));