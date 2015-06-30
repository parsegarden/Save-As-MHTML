var check = function(same){
	var idx = 0,atagobj = {},urls = [],ary = [];
	var hostname = location.hostname;
	var atags = document.querySelectorAll("a");
	var title = document.getElementsByTagName('title')[0].textContent.substring(0,10);
	if(!title)title = hostname;
	ary.push(pushItem(location.href,title))
	for (var i = 0; i < atags.length; i++) {
		var item = atags[i];
		var url = item.href.split("#")[0];
		if(urls.indexOf(url) === -1){
			urls.push(url);
			if(same){
				var domain = url.split("/")[2];
				if(!domain || domain !== hostname)continue;
			}
			ary.push(pushItem(url,item.textContent));
			idx++;
			atagobj[url] = idx+".mhtml";
		}
	};
	var obj = {
	    ary:ary,
	    title:title
	};
	return obj;
	function pushItem(href,title){
    	var obj = {};
    	obj.url = href;
    	obj.title = title;
		if(!obj.title)obj.title = href;
    	return obj;
	}
};
function getLink(same,zipflg){
    var obj = check(same);
	if(zipflg){
		chrome.runtime.connect().postMessage({msg: "sendimgzip", ary: obj.ary,title:obj.title});
	}else{
		chrome.runtime.connect().postMessage({msg: "sendimg", ary: obj.ary,title:obj.title});
	}
}
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	if(msg.msg === "getlink"){
		getLink(msg.same);
		sendResponse({})
	}else if(msg.msg === "getlinkzip"){
		getLink(msg.same,true);
		sendResponse({})
	}else if(msg.msg === "getclink"){
		sendResponse({obj:check(msg.same)})
	}
});
// function overrideJS(){
//     var script = document.createElement("script");
// 	script.type = "text/javascript";
//     script.textContent = '';
//     document.body.appendChild(script);
// }
