/*
---
name: ScrapSlide.Delegtor

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Behavior/Delegator

provides: [ScrapSlide.Delegtor]

...
*/

(function(){

	Delegator.register('click', 'prev', function(event, element, api){
		event.preventDefault();
		var controller = element.getBehaviorResult('NavigaterController');
		controller.prev();
	});

	Delegator.register('click', 'next', function(event, element, api){
		event.preventDefault();
		var controller = element.getBehaviorResult('NavigaterController');
		controller.next();
	});

	Delegator.register('click', 'first', function(event, element, api){
		event.preventDefault();
		var controller = element.getBehaviorResult('NavigaterController');
		controller.first();
	});

	Delegator.register('click', 'last', function(event, element, api){
		event.preventDefault();
		var controller = element.getBehaviorResult('NavigaterController');
		controller.last();
	});

}());
