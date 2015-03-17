var utils = require(__base + '/lib/utils'),
	HTTPError = require('node-http-error');

var MockHTTP = function() {
	'use strict';

	var self = this,
		fileUtils = new utils();

	self.doGet = doGet;
	self.doPost = doPost;
	self.doPut = doPut;
	self.doDelete = doDelete;

	function doGet(req, res, mapping) {
    	var paramsSize = Object.keys(req.params).length,
    		response = getResponse(req, mapping);

		if(response) {
	        res.status(response['code']);
	        res.send(response['content']);
	    } else {
        	res.status(204);
            res.send();        
	    }	
	};

	function doPost(req, res) {
		var response = getResponse(req);
		
		if(response) {
			res.status(response['code']);
    		res.send(response['content']);		
		} else {
			res.status(200);
			res.send();
		}
	}

	function doPut(req, res) {  
		var response = getResponse(req);

		if(response) {
			res.status(response['code']);
    		res.send(response['content']);		
		} else {
			res.status(204);
			res.send();	
		}
	}

	function doDelete(req, res) {
		var response = getResponse(req);

		if(response) {
			res.status(response['code']);
    		res.send(response['content']);		
    	} else {
    		res.status(204);        
			res.send();	
    	}
	}

	function getResponse(req, mapping) {
		var filePath = undefined,
			response = undefined;
	    
	    if(mapping) {
			filePath = fileUtils.getFilePathFromMapping(req, mapping);
	    } else {
	    	filePath = fileUtils.getFilePathFromRequestURL(req)
	    }

	    response = JSON.parse(fileUtils.loadResource(filePath));

		if(!response && 'GET'.indexOf(req.method) !== -1) {
	    	throw new HTTPError(404, 'Content ' + filePath + ' Not Found.');
	    }

	    console.info('Parsed response: ', response);
	    console.info('HTTP method: %s', typeof req.method);

	    return response;
	}    
}

module.exports = MockHTTP; 