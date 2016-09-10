function loadDescriptions() {
	var pagelet = document.getElementById('pagelet_trending_tags_and_topics');
	if (pagelet) {
		var lists = pagelet.getElementsByTagName('ul');
		for (var l=0; l<lists.length; l++) {
			var list = lists[l];
			for (var i=0; i<list.childNodes.length; i++) {
				var item = list.childNodes[i];
				var topicId = item.getAttribute('data-topicid');
				if (topicId) {
					item.firstChild.setAttribute('style', 'max-height: 75px;');
					var link = item.getElementsByTagName('a')[0];
					if (link) {
						if (!link.getAttribute('descLoaded')) {
							var hovercard = link.getAttribute('data-hovercard');
							if (hovercard) {
								var request = new XMLHttpRequest();
								request.open('GET', 'https://www.facebook.com' + hovercard + '&endpoint=a&__a=1', true);

								request.onload = (function(request, link) {
									return function() {
									  if (request.status >= 200 && request.status < 400) {
											var resp = request.responseText;
											if (resp) {
												resp = resp.replace('for (;;);', '');
												var json = JSON.parse(resp);
												try {
													var html = json.jsmods.markup["0"][1].__html;
													var parser = new DOMParser()
													var doc = parser.parseFromString(html, "text/xml");

													var anchors = doc.getElementsByTagName('a');
													if (anchors[0]) {
														var text = anchors[0].firstChild.childNodes[0].firstChild.innerHTML;
														var text2 = anchors[0].firstChild.childNodes[1].firstChild.innerHTML;

														link.setAttribute('descLoaded', 'true');
														link.firstChild.childNodes[1].innerHTML = text + '. ' + text2; // + ' <br/>' + link.firstChild.childNodes[1].innerHTML;
													}
												} catch (err) {

												}
											}
										}
									}
								})(request, link); 

								request.send();
							}
						}
					}
				}
			}
		}
	}
}

loadDescriptions();

setInterval(function() {
	loadDescriptions();	
}, 1000);

document.body.addEventListener('click', function() {
	setTimeout(function() {
		loadDescriptions();
	}, 250);
}, true); 