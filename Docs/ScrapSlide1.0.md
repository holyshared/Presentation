ScrapSlide1.0 API Document
===============================================

* ScrapSlide.Slide
* ScrapSlide.SlidePanel
* ScrapSlide.Navigator

* ScrapSlide.Controller
* ScrapSlide.SlideController
* ScrapSlide.Navigator

* ScrapSlide.Behavior
* ScrapSlide.Delegtor


### ScrapSlide.Slide

* addSlide (object) - 
* addSlides (object) - 
* removeSlide (object) - 
* removeSlides (object) -
* set (object) - 
* setAt (number) - 
* getCurrentSlide - 
* getCurrentIndex - 
* getLength - 
* hasSlide (object) - 
* prev -
* next -
* first -
* last -


### ScrapSlide.SlidePanel

#### Methods

* getIndex
* setSlide
* getSlide
* isChild
* isCurrent
* show
* hide
* prev
* next





### ScrapSlide.Loader

### ScrapSlide.StandardLoader

	var loader = new ScrapSlide.StandardLoader({
		onLoadStart: function(){
		},
		onLoadEnd: function(panels){
		}
	});
	loader.load();

	var loader = new ScrapSlide.StandardLoader();
	var slide = new Slide.Slide(loader, {});
	slide.start();


### ScrapSlide.RequestLoader

	var loader = new ScrapSlide.RequestLoader({
		onLoadStart: function(){
		},
		onLoadEnd: function(panels){
		}
	});
	loader.load();


	var slide = new Slide.Slide({});

	var loader = new ScrapSlide.RequestLoader({
		onComplete: function(panels){
			slide.addPanels(panels);
		}
	});
	loader.load();

#### Methods

* load (string)



### ScrapSlide.Navigator

* setSlide
* getSlide
* prev
* next
* first
* last

### ScrapSlide.Controller

### ScrapSlide.SlideController
### ScrapSlide.NavigaterController

### ScrapSlide.Delegtor


### ScrapSlide.Behavior
