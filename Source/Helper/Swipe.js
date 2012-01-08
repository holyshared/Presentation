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

function SwipeHelper() {
	var options = {
		methods: {
			left: 'next',
			right: 'prev'
		}
	};
	var helper = new Helper.Swipe(options);

	return helper;
}

HelperNamespace.Swipe = SwipeHelper;

}(Presentation, Presentation.Helper));
