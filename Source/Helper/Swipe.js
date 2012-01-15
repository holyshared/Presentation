/*
---
name: Presentation.Swipe

description: The helper who enables swipe operation

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation/Presentation
  - Presentation/Helper
  - Helper/Helper.Swipe

provides:
  - Helper.Swipe
...
*/

(function(Presentation, HelperNamespace){

function SwipeHelper(options) {

	var defaults = null,
		helper = null;

	defaults = {
		methods: {
			left: 'next',
			right: 'prev'
		}
	};

	options = Object.merge(defaults, options);

	return new Helper.Swipe(options);
}

HelperNamespace.Swipe = SwipeHelper;

}(Presentation, Presentation.Helper));
