(function(yournamesapce){

	var yournamesapce = this.yournamesapce = yournamesapce;

	yournamesapce.KeywordFilter = {

		keywords: ['ipsum', 'sapien', 'lobortis', 'leo'],
	
		//The contents are indicated by highlight.
		activate: function(content){
			var html = '',
				element = null,
				replaceKeywords = '',
				replaceContent = '',
				replaceTarget = null,
				replaceValue = '',
				isHighlight = false;
	
			//It changes into an element from a content object. 
			element = $(content);
	
			//Status is acquired from data store, and already case highlighted, it skips.
			isHighlight = element.retrieve('content:highlight');
	
			if (isHighlight === true){
				return;
			}

			html = element.get('html');

			//The keyword in contents is emphasized with a strong element.
			replaceKeywords = this.keywords.join('|');
	
			replaceTarget = new RegExp('(' + replaceKeywords + ')', 'g');
			replaceValue = '<strong class="highlight">$1</strong>';

			replaceContent = html.replace(replaceTarget, replaceValue);
	
			element.set('html', replaceContent)
				.store('content:html', html)		//The contents before a highlight are backed up. 
				.store('content:highlight', true);	//It uses ending with a highlight.
		},

		//It restores to a front state from the state where it has highlighted.
		deactivate: function(content){
	
			var element = null,
				beforeContent = '',
				isHighlight = false;
	
			//It changes into an element from a content object. 
			element = $(content);
	
			isHighlight = element.retrieve('content:highlight');
			if (isHighlight !== true){
				return;
			}
	
			beforeContent = element.retrieve('content:html');
	
			element.set('html', beforeContent)
				.store('content:highlight', false);	//It cancels ending with a highlight.
	
		}

	}

}.call(this, this.yournamesapce || {}));