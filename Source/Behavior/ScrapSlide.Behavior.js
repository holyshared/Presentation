/*
---
name: ScrapSlide.Behavior

description: 

license: MIT-style

authors:
- Noritaka Horio

provides: [ScrapSlide.Behavior]

...
*/

(function(slide){

slide.addGlobalFilter('SlideController', {

	setup: function(element, api){
		var slide = new slide.SlideController();
		return slide;
	}

});

slide.addGlobalFilter('NavigaterController', {

	requireAs: {
		connectTo: String
	},

	setup: function(element, api){

		var slideId = api.get('connectTo');
		var target = $(slideId);
		if (!target){
			throw new Error('Slide is not found');
		}

		var slide = target.getBehaviorResult('SlideController');

		var navigation = new slide.NavigaterController();
		navigation.setSlide(slide);

		return navigation;
	}

});

}(ScrapSlide));
