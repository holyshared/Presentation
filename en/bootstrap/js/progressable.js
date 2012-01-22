(function(global){

var View = new Class({

	initialize: function(){
		this._view = new Element('div.progress', {
			style: { display: 'none' }
		}),
		this._value = new Element('span.value');
		this._bar = new Element('span.bar');
		this._view.adopt([
			this._value,
			this._bar
		]);
	},

	update: function(value){
		//update progress bar;
		this._value.set('text', value.toString() + '% completed');
		this._bar.setStyle('width', this._width * (value / 100));

		return this;
	},

	show: function(){
		this._view.inject(document.body);
		this._width = this._bar.getWidth();
		this._view.setStyles({
			'margin-top': -(this._bar.getHeight() / 2),
			'display': ''
		});
	},

	hide: function(){
		this._view.setStyle('display', 'none')
			.destroy();
	},

	toElement: function(){
		return this._view;
	}

});

var Visualizable = function(){
	this.view = new View();
};

var Progressable = this.Progressable = function(){
	this.progresser = new Progresser();
}

var Progresser = this.Progresser = new Class({

	Implements: [Visualizable],

	_total: 0,
	_current: 0,

	initialize: function(step){
		this.setTotal(step);
	},

	setTotal: function(value){
		this._total = value;
		return this;
	},

	getTotal: function(){
		return this._total;
	},

	setCurrent: function(value){
		this._current = value;
		return this;
	},

	getCurrent: function(){
		return this._current;
	},

	show: function(){
		this.view.show();
	},

	hide: function(){
		this.view.hide();
	},

	next: function(){
		var value = 0,
			delta = 0;

		this._current++;
		if (this.getCurrent() > this.getTotal()){
			return false;
		}

		delta = this.getCurrent() / this.getTotal();
		value = Math.round(delta * 100);

		this.view.update(value);
		return this;
	}

});

}(this));
