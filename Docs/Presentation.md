Presentation
=====================================================





Presentation
-----------------------------------------------------

	var presen = new Presentation(options);
	presen.setCurrentIndex(0);
	
	var presen = new Presentation(options);
	presen.setCurrentIndex(content);


### Events

* onChanged


### Methods

* addContent
* addContents
* removeContent
* removeContents
* getCurrentIndex
* getCurrentContent
* setCurrentIndex
* setCurrentContent
* getLength
* first
* prev
* next
* last








Presentation.Container
-----------------------------------------------------

var container = new Presentation.Container(element);

var last = container.getLastContent();
var lastBefore = container.getBeforeContents();
lastBefore.forward();
last.center();

var first = container.getFirstContent();
var firstAfter = container.getAfterContents();
firstAfter.backward();
first.center();


### Methods

* addContent
* addContents
* removeContent
* removeContents
* setCurrentIndex
* getCurrentIndex
* getCurrentContent
* getFirstContent
* getPrevContent
* getNextContent
* getLastContent
* getBeforeContents
* getAfterContents
* getContent
* getLength
* isValid
* hasPrevContent
* hasNextContent

Presentation.Content
-----------------------------------------------------

	var content = new Presentation.Content(element);
	content.toForward();

### Methods

* forward
* backward
* center
* toElement

Presentation.Filter
-----------------------------------------------------

	var presen = new Presentation(options);
	presen.addBeforeFilter(function(content){
		//do something
	});
	presen.addAfterFilter(function(content){
		//do something
	});


### Methods

* addFilter
* addFilters
* removeFilter
* removeFilters
* hasFilter
* hasBeforeFilter
* hasAfterFilter
* addBeforeFilter
* addBeforeFilters
* removeBeforeFilter
* removeBeforeFilters
* addAfterFilter
* addAfterFilters
* removeAfterFilter
* removeAfterFilters
