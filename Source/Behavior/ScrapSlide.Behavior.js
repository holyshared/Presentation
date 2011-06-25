/*
---
name: ScrapSlide.Behavior

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Behavior/Behavior
  - ScrapSlide/ScrapSlide

provides: [Behavior]

...
*/

(function(behavior, slide){

behavior.addGlobalFilter('SlideController', {

	setup: function(element, api){
		var controller = new slide.SlideController(element);
		return controller;
	}

});

behavior.addGlobalFilter('NavigaterController', {

	requireAs: {
		connectTo: String
	},

	setup: function(element, api){

		var slideId = api.get('connectTo');
		var target = $(slideId);
		if (!target){
			throw new Error('Slide is not found');
		}

		var slideController = target.getBehaviorResult('SlideController');

		var navigation = new slide.NavigaterController();
		navigation.setSlide(slideController);

		var eventListener = function(eventType){
			return function(){
				navigation[eventType]();
			}
		};

		var listeners = {
			firstSlide: 'first',
			prevSlide: 'prev',
			nextSlide: 'next',
			lastSlide: 'last'
		};
		for (var key in listeners){
			var callMethod = listeners[key];
			api.addEvent(key, eventListener(callMethod));
		}

		api.onCleanup(function(){
			api.removeEvents('firstSlide', 'prevSlide', 'nextSlide', 'lastSlide');
		});

		return navigation;
	}

});

}(Behavior, ScrapSlide));
