(function(global, filters){

var filters = global.filters = filters;

filters.ProcessingFilter = {

	activate: function(content){

		var element = $(content),
			filter = element.get('data-presentation-filter'),
			isApply = element.retrieve('processing'),
			script = null,
			code = null,
			target = null;

		if (!Processing || filter !== 'processing' || isApply === true){
			return;
		}

		script = element.getElement('script[type="text/application"]');

		if (script === null){
			return;
		}

		code = script.get('html');
		target = script.get('data-processing-draw-target');

		this.processing = new Processing(target, code);

		element.store('processing', true);
	},

	deactivate: function(content){

		var element = $(content),
			filter = element.get('data-presentation-filter'),
			isApply = element.retrieve('processing');

		if (filter !== 'processing' || isApply === false){
			return;
		}

		this.processing.exit();

		delete this.processing;

		element.store('processing', false);
	}

};

}(this, this.filters || {}));
