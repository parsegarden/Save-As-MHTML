var INDEX = -1;
var ATAGARRAY = [];
var TABID = -1;
var TITLE = "NoTitle";
var ZIPFLAG = false;
var SAMEDOMAIN = false;
var CLINKS = [];
var LAYER = -1;
var LAYERINDEX = 0;
var HTMLOBJ = {};

function resetOptions(){
    TITLE = "NoTitle";
    TABID = -1;
    INDEX = -1;    
    ZIPFLAG = false;
    ATAGARRAY = [];
    SAMEDOMAIN = false;
    CLINKS = [];
    LAYER = -1;
    LAYERINDEX = 0;
    HTMLOBJ = {};
}
chrome.contextMenus.removeAll(function(){
    var prntmid = chrome.contextMenus.create({
    	"id": "container",
        "contexts": ["all"],
        "title": "Save As MHTML",
        "type": "normal",     
    });
    chrome.contextMenus.create({
    	"id": "MHTML",
        "contexts": ["all"],
        "title": "Single Page",
        "type": "normal", 
        "parentId":prntmid
    });
 
    var m1 = chrome.contextMenus.create({
    	"id": "l1",
        "contexts": ["all"],
        "title": "Depth of 1",
        "type": "normal", 
        "parentId":prntmid
    });
    chrome.contextMenus.create({
    	"id": "MHTMLwithLinkssame",
        "contexts": ["all"],
        "title": "Page with Links (Same Domain)",
        "type": "normal",   
        "parentId":m1
    });
    chrome.contextMenus.create({
    	"id": "MHTMLwithLinks",
        "contexts": ["all"],
        "title": "Page with Links",
        "type": "normal",   
        "parentId":m1
    });
    chrome.contextMenus.create({
        "id": "LinkssametoZip",
        "contexts": ["all"],
        "title": "Links (Same Domain) to Zip",
        "type": "normal",   
        "parentId":m1
    });
    chrome.contextMenus.create({
        "id": "LinkstoZip",
        "contexts": ["all"],
        "title": "Links to Zip",
        "type": "normal",   
        "parentId":m1
    });
    
    var m2 = chrome.contextMenus.create({
    	"id": "l2",
        "contexts": ["all"],
        "title": "Depth of 2",
        "type": "normal", 
        "parentId":prntmid
    });
    chrome.contextMenus.create({
    	"id": "l2MHTMLwithLinkssame",
        "contexts": ["all"],
        "title": "Page with Links (Same Domain)",
        "type": "normal",   
        "parentId":m2
    });
    chrome.contextMenus.create({
    	"id": "l2MHTMLwithLinks",
        "contexts": ["all"],
        "title": "Page with Links",
        "type": "normal",   
        "parentId":m2
    });
    chrome.contextMenus.create({
        "id": "l2LinkssametoZip",
        "contexts": ["all"],
        "title": "Links (Same Domain) to Zip",
        "type": "normal",   
        "parentId":m2
    });
    chrome.contextMenus.create({
        "id": "l2LinkstoZip",
        "contexts": ["all"],
        "title": "Links to Zip",
        "type": "normal",   
        "parentId":m2
    });
});
chrome.contextMenus.onClicked.addListener(function (info,tab){
    resetOptions();
    if(info.menuItemId === "MHTML"){
        chrome.tabs.query({active:true,currentWindow:true},function(tabs){
        	var title = tabs[0].title.substring(0,12);
            chrome.pageCapture.saveAsMHTML({tabId:tabs[0].id},function(mhtml){
                var url = window.URL.createObjectURL(mhtml);
                chrome.downloads.download({saveAs:false,url:url,filename:title+".mhtml"});
            });
        });
    }else if(info.menuItemId === "MHTMLwithLinks"){
        chrome.tabs.query({active:true,currentWindow:true},function(tabs){
            SAMEDOMAIN = false;
            LAYER = -1;
        	chrome.tabs.sendMessage(tabs[0].id,{msg:"getlink",same:false});
        });
    }else if(info.menuItemId === "MHTMLwithLinkssame"){
        chrome.tabs.query({active:true,currentWindow:true},function(tabs){
            SAMEDOMAIN = true;
            LAYER = -1;
        	chrome.tabs.sendMessage(tabs[0].id,{msg:"getlink",same:true});
        });
    }else if(info.menuItemId === "LinkstoZip"){
        chrome.tabs.query({active:true,currentWindow:true},function(tabs){
            SAMEDOMAIN = false;
            LAYER = -1;
            chrome.tabs.sendMessage(tabs[0].id,{msg:"getlinkzip",same:false});
        });
    }else if(info.menuItemId === "LinkssametoZip"){
        chrome.tabs.query({active:true,currentWindow:true},function(tabs){
            SAMEDOMAIN = true;
            LAYER = -1;
            chrome.tabs.sendMessage(tabs[0].id,{msg:"getlinkzip",same:true});
        });
    }else if(info.menuItemId === "l2MHTMLwithLinks"){
        chrome.tabs.query({active:true,currentWindow:true},function(tabs){
            SAMEDOMAIN = false;
            LAYER = 0;
        	chrome.tabs.sendMessage(tabs[0].id,{msg:"getlink",same:false});
        });
    }else if(info.menuItemId === "l2MHTMLwithLinkssame"){
        chrome.tabs.query({active:true,currentWindow:true},function(tabs){
            SAMEDOMAIN = true;
            LAYER = 0;
        	chrome.tabs.sendMessage(tabs[0].id,{msg:"getlink",same:true});
        });
    }else if(info.menuItemId === "l2LinkstoZip"){
        chrome.tabs.query({active:true,currentWindow:true},function(tabs){
            SAMEDOMAIN = false;
            LAYER = 0;
            chrome.tabs.sendMessage(tabs[0].id,{msg:"getlinkzip",same:false});
        });
    }else if(info.menuItemId === "l2LinkssametoZip"){
        chrome.tabs.query({active:true,currentWindow:true},function(tabs){
            SAMEDOMAIN = true;
            LAYER = 0;
            chrome.tabs.sendMessage(tabs[0].id,{msg:"getlinkzip",same:true});
        });
    }
});
chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        var sndid = port.sender.tab.id;
        if(msg.msg == "sendimg"){
            ZIPFLAG = false;
            INDEX = 0;
            ATAGARRAY = msg.ary;
            TITLE = msg.title;
            createIndexHTML(ATAGARRAY);
        }else if(msg.msg == "sendimgzip"){
            ZIPFLAG = true;
            INDEX = 0;
            ATAGARRAY = msg.ary;
            TITLE = msg.title;
            createIndexHTML(ATAGARRAY,true);
        }
    });
    port.onDisconnect.addListener(function(msg) {
        resetOptions();
    });
});
chrome.webNavigation.onCompleted.addListener(function (details){
    if(details.tabId === TABID&&details.frameId === 0){
        getMHTML();
    }
});
function createIndexHTML(ATAGARRAY,zipflg){
    if(LAYER === -1){
    	var html = "";
    	html += "<!DOCTYPE html>";
    	html += "<html>";
    	html += '<head><meta charset="UTF-8"><title>INDEX</title></head>';
    	html += "<body>";
    	for (var i = 0; i < ATAGARRAY.length; i++) {
    		var item = ATAGARRAY[i];
    		html += "<a href='mhtml/"+i+".mhtml' target='_blank'>"+item.title+"</a><br>";
    	};
    	html += "</body></html>";
        var obj = new Blob([html]);
        var url = window.URL.createObjectURL(obj);
        if(zipflg){
            ZIPFLAG = new JSZip();
            ZIPFLAG.folder(TITLE);
            ZIPFLAG.folder(TITLE).file("index.html", html);
            ZIPFLAG.folder(TITLE).folder("mhtml");
            chrome.tabs.create({url:ATAGARRAY[INDEX].url},function(tab){
                TABID = tab.id;
            });
        }else{
            chrome.downloads.download({saveAs:false,conflictAction:"overwrite",url:url,filename:TITLE+"/"+"index.html"},function(){
        	    chrome.tabs.create({url:ATAGARRAY[INDEX].url},function(tab){
        	        TABID = tab.id;
        	    });
            });
        }
    }else{
        if(zipflg){
            ZIPFLAG = new JSZip();
            ZIPFLAG.folder(TITLE);
            ZIPFLAG.folder(TITLE).folder("mhtml");
        }
	    chrome.tabs.create({url:ATAGARRAY[INDEX].url},function(tab){
	        TABID = tab.id;
	    });
    }
}
function getMHTML(){
    chrome.tabs.sendMessage(TABID,{msg:"getclink",same:SAMEDOMAIN},function(resp){
        if(LAYER === 0)CLINKS[INDEX] = resp.obj;
        chrome.pageCapture.saveAsMHTML({tabId:TABID},function(mhtml){
            var url = window.URL.createObjectURL(mhtml);
            if(LAYER === -1){
                var fname = TITLE+"/mhtml/"+INDEX+".mhtml";
            }else if(LAYER === 0){
                if(INDEX === 0){
                    var fname = TITLE+"/mhtml/"+INDEX+".mhtml";
                    var obj = {};
                    obj.fname = fname;
                    obj.title = ATAGARRAY[INDEX].title;
                    obj.url = ATAGARRAY[INDEX].url;
                    HTMLOBJ[INDEX] = obj;
                }else{
                    var fname = TITLE+"/mhtml/0/"+INDEX+".mhtml";
                    var obj = {};
                    obj.fname = fname;
                    obj.title = ATAGARRAY[INDEX].title;
                    obj.url = ATAGARRAY[INDEX].url;
                    HTMLOBJ[INDEX] = obj;
                }
            }else if(LAYER === 1){
                if(!HTMLOBJ[LAYERINDEX].children)HTMLOBJ[LAYERINDEX].children = {};
                var fname = TITLE+"/mhtml/0/"+LAYERINDEX+"/"+INDEX+".mhtml";
                var obj = {};
                obj.fname = fname;
                obj.title = ATAGARRAY[INDEX].title;
                obj.url = ATAGARRAY[INDEX].url;
                HTMLOBJ[LAYERINDEX].children[INDEX] = obj;
            }
            
            if(ZIPFLAG){
                var fileReader = new FileReader();
                fileReader.onload = function() {
                    if(LAYER === -1){
                        ZIPFLAG.folder(TITLE).folder("mhtml").file(INDEX+".mhtml", this.result);
                    }else if(LAYER === 0){
                        if(INDEX === 0){
                            ZIPFLAG.folder(TITLE).folder("mhtml").file(INDEX+".mhtml", this.result);
                        }else{
                            ZIPFLAG.folder(TITLE).folder("mhtml").folder("0").file(INDEX+".mhtml", this.result);
                        }
                    }else if(LAYER === 1){
                        ZIPFLAG.folder(TITLE).folder("mhtml").folder("0").folder(LAYERINDEX).file(INDEX+".mhtml", this.result);
                    }
                    nextItem();
                };
                fileReader.readAsArrayBuffer(mhtml);
                return;
            }else{
                chrome.downloads.download({saveAs:false,url:url,conflictAction:"overwrite",filename:fname},function(){
                    nextItem();
                });
            }
        });
    });
}
function nextItem(){
    INDEX++
    if(!ATAGARRAY[INDEX]){
        LAYERINDEX++;
        if(LAYER === 0)LAYER++;
        if(LAYER === 1&&CLINKS[LAYERINDEX]&&CLINKS[LAYERINDEX].ary&&CLINKS[LAYERINDEX].ary.length > 0){
            var update = function(){
            	if(!CLINKS[LAYERINDEX]){
            		nextItem();
            	}else if(CLINKS[LAYERINDEX].ary.length > 1){
		            ATAGARRAY = CLINKS[LAYERINDEX].ary;
		            INDEX = 1;
		            chrome.tabs.update(TABID,{url:ATAGARRAY[INDEX].url});
            	}else{
			        LAYERINDEX++;
		            update();
            	}
            };
            update();
        }else{
            if(LAYER > 0){
                var html = createMainHTML(HTMLOBJ);
                if(ZIPFLAG){
                    ZIPFLAG.folder(TITLE).file("index.html",html);
                }else{
				    var obj = new Blob([html]);
                    var url = window.URL.createObjectURL(obj);
                    chrome.downloads.download({saveAs:false,url:url,filename:TITLE+"/index.html"});
                }
            }
            if(ZIPFLAG){
                var content = ZIPFLAG.generate({type:"blob"});
                var url = window.URL.createObjectURL(content);
                chrome.downloads.download({saveAs:true,url:url,conflictAction:"overwrite",filename:TITLE+".zip"});
            }
            resetOptions();
        }
        return;
    }
    chrome.tabs.update(TABID,{url:ATAGARRAY[INDEX].url});
}
function createMainHTML(HTMLOBJ){
	var html = "";
	html += "<!DOCTYPE html>";
	html += "<html>";
	html += '<head><meta charset="UTF-8"><title>INDEX</title></head>';
	html += "<body>";
	var keys = Object.keys(HTMLOBJ);
	for (var i = 0; i < keys.length; i++) {
		var item = HTMLOBJ[keys[i]];
		var fnames = item.fname.split("/");
		fnames.shift();
		fname = fnames.join("/");
		if(i === 0){
    		html += "<a href='"+fname+"' target='_blank'>"+item.title+"</a><br>";
    		html += "<ul>";
		}else{
    		html += "<li><a href='"+fname+"' target='_blank'>"+item.title+"</a>";
    		if(item.children){
        		html += "<ul>";
            	var keys2 = Object.keys(item.children);
            	for (var ii = 0; ii < keys2.length; ii++) {
            		var item2 = item.children[keys2[ii]];
            		var fnames2 = item2.fname.split("/");
            		fnames2.shift();
            		fname2 = fnames2.join("/");
            		html += "<li><a href='"+fname2+"' target='_blank'>"+item2.title+"</a></li>";
            	}
                html += "</ul>"
    		}
    		html += "</li><br>";
		}
	};
    html += "</ul>"
	html += "</body></html>";
    return html;
}
