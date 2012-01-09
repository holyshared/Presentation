(function(doc){

	window.addEventListener('load', function(){

		this.Controller = function Controller(container){
			this.container = container;
			this.index = 0;
			this.total = 10;
		};

		Controller.implement({
			prev: function(){
				if (!this.isValid(this.index - 1)) {
					return;
				}
				this.index--;
				this.notify();
				alert('prev');
			},
			next: function(){
				if (!this.isValid(this.index + 1)) {
					return;
				}
				this.index++;
				this.notify();
				alert('next');
			},
			first: function(){
				this.index = 0;
				this.notify();
				alert('first');
			},
			last: function(){
				this.index = this.total - 1;
				this.notify();
				alert('last');
			},

			isValid: function(index){
				return (index >= 0 &&  this.total >= index) ? true : false;
			},

			notify: function(){
				var args = [
					this.index,
					this.total,
					null
				];
				this.fireEvent('change', args);
			},

			getLayoutElement: function(){
				return this.container;
			},

			start: function(){
				this.notify();
			}
		});
		Controller.implement(new Helper());
		Controller.implement(new Events());

	}, false);

}(document));