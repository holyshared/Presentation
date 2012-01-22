(function(yournamespace){

	var yournamespace = this.yournamespace = yournamespace;

	yournamespace.Controller = new Class({

		Extends: Helper.Delegator,

		options: {
			prev: 'prevButton',
			next: 'nextButton',
			disabled: 'disabled'
		},

		_name: 'yournamesapce.Controller',
		_methods: {
			prevContent: 'prev',
			nextContent: 'next'
		},

		setup: function(){
			var layout = this.getTarget().getLayoutElement(),
				prevButton = null,
				nextButton = null,
				options = this.options;

			prevButton = layout.getElement('.' + options.prev);
			if (!prevButton){
				throw new Error('The prev button is not found.');
			}

			nextButton = layout.getElement('.' + options.next);
			if (!nextButton){
				throw new Error('The next button is not found.');
			}

			this._prevButton = prevButton;
			this._nextButton = nextButton;

			this._prevHandler = this._prevButtonClick.bind(this);
			this._nextHandler = this._nextButtonClick.bind(this);

			this._contentChangeHandler = this._onContentChange.bind(this);
		},

		enable: function(){
			this.getTarget().addEvent('change', this._contentChangeHandler);
			this._prevButton.addEvent('click', this._prevHandler);
			this._nextButton.addEvent('click', this._nextHandler);
		},

		disable: function(){
			this.getTarget().removeEvent('change', this._contentChangeHandler);
			this._prevButton.removeEvent('click', this._prevHandler);
			this._nextButton.removeEvent('click', this._nextHandler);
		},

		destroy: function(){
			delete this._contentChangeHandler;
			delete this._prevButton;
			delete this._nextButton;
			delete this._nextHandler;
			delete this._prevHandler;
		},

		_onContentChange: function(current, total, content){
			var currentNumber = current + 1,
				disabled = this.options.disabled;

			if (currentNumber <= 1){
				this._prevButton.addClass(disabled);
				this._nextButton.removeClass(disabled);
			} else if (currentNumber >= total) {
				this._prevButton.removeClass(disabled);
				this._nextButton.addClass(disabled);
			} else {
				this._prevButton.removeClass(disabled);
				this._nextButton.removeClass(disabled);
			}
		},

		_prevButtonClick: function(evt){
			this.delegate('prevContent');
		},

		_nextButtonClick: function(evt){
			this.delegate('nextContent');
		}

	});

}.call(this, this.yournamespace || {}));
