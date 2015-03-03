var utils = require(__base + '/lib/utils');

var MockHTTP = function() {
	"use strict";

	var self = this,
		fileUtils = new utils(),
		httpResponses = {
    		"200" : { "code" : 200 },
    		"204" : { "code" : 204, "content": "" },
    		"400" : { "code" : 400 },
    		"404" : { "code" : 404, "content": "Resource not found." }
		};

	self.doGet = doGet;
	self.doPost = doPost;
	self.doPut = doPut;
	self.doDelete = doDelete;

	function doGet(req, res) {
    	var filePath = fileUtils.getFilePathFromRequestURL(req),
	    	content = fileUtils.loadResource(filePath);  

	    if(content) {
	        res.status(httpResponses['200']['code']);
	        res.send(content);
	    } else {
	        if(req.params.length > 0) {
	            res.status(httpResponses['404']['code']);    
	            res.send(httpResponses['404']['content']);
	        } else {
	            res.status(httpResponses['204']['code']);        
	            res.send(httpResponses['204']['content'])
	        }
	    }	
	};

	function doPost(req, res) {
		var filePath = fileUtils.getFilePathFromRequestURL(req),
	    	content = fileUtils.loadResource(filePath);  
		
		console.log(content);
		res.status(httpResponses['200']['code']);
	    res.send(content);
	}

	function doPut(req, res) {  
		res.status(httpResponses['204']['code']);        
	    res.send(httpResponses['204']['content']);
	}

	function doDelete(req, res) {
		res.status(httpResponses['204']['code']);        
	    res.send(httpResponses['204']['content']);
	}    
}

module.exports = MockHTTP; 