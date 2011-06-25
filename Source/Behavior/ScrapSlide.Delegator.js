/*
---
name: ScrapSlide.Delegator

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Behavior/Delegator

provides: [Delegator]

...
*/

(function(){

	Delegator.register('click', 'first', {
		handler: function(event, element, api){
			event.preventDefault();
			var behavior = this.getBehavior();
			behavior.fireEvent('firstSlide');
		}
	});

	Delegator.register('click', 'prev', {
		handler: function(event, element, api){
			event.preventDefault();
			var behavior = this.getBehavior();
			behavior.fireEvent('prevSlide');
		}
	});

	Delegator.register('click', 'next', {
		handler: function(event, element, api){
			event.preventDefault();
			var behavior = this.getBehavior();
			behavior.fireEvent('nextSlide');
		}
	});

	Delegator.register('click', 'last', {
		handler: function(event, element, api){
			event.preventDefault();
			var behavior = this.getBehavior();
			behavior.fireEvent('lastSlide');
		}
	});

}());
