var _ = require('lodash'),
    fs = require('fs'),
    glob = require("glob");

var Utils = function() {

    "use strict";

    var self = this;

    self.loadResource = loadResource;
    self.getFilePathFromRequestURL = getFilePathFromRequestURL;
    self.getFilePath = getFilePath;   

    function loadResource(filePath) {
        var filecontent = null;
        
        console.log({ "filePath" : filePath });
        console.log({ "filePathExists" : fs.existsSync(filePath) });
        
        if(fs.existsSync(filePath)) {
            filecontent = fs.readFileSync(filePath, 'utf8');
            console.log({ "method": "loadResource", "response" : filecontent});
        } else {
            console.error('ERROR: Resource ' + filePath + ' does not exists');
        }
        
        return filecontent;
    }

    function getFilePathFromRequestURL(request) {
        var fileName = getFileNameFromRequest(request),
            resource = request.route.path,
            httpVerb = request.route.method;

        if(httpVerb !== 'get') {
            fileName = 'default';
        } else {
            if(fileName.length === 0) {
                fileName = 'all';
            }
        }    
            
        return getFilePath(resource, httpVerb, fileName);
    }

    function getFilePath(resource, method, fileName) {
        
        var mockRoot = __base + 'mocks',
            mockFilePattern = '.json',
            pathSeparator = '/',
            filePath = '';

        // mocks/{resource}/(get|post|put|delete)/{urlParam}|all|default}.json
        filePath += mockRoot;
        filePath += resource;
        filePath += pathSeparator;
        filePath += method;
        filePath += pathSeparator;
        filePath += fileName;
        filePath += mockFilePattern;

        console.log('File Path %s obtained from %s %s', filePath, method, resource);

        return filePath;
    }

    function getFileNameFromRequest(request) {
        var fileName = '',
            pathOperator = '_',
            pathParams = request.params,
            pathParamsArray = Object.keys(pathParams),
            queryOperator = '=',
            queryConcatenation = '&',
            queryParams = request.query,
            queryParamsArray = Object.keys(queryParams);
        
        pathParamsArray.forEach(function(pathParam){
            fileName += pathParams[pathParam];
            fileName += pathOperator;
        });

        // Remove the last pathOperator in case queryParam are empty
        if(queryParamsArray.length === 0) {
            fileName = removeLastChar(fileName);   
        }

        queryParamsArray.forEach(function(queryParam) {
            fileName += queryParam;
            fileName += queryOperator;
            fileName += queryParams[queryParam];
            fileName += queryConcatenation;        
        });

        // Remove the last queryConcatenation in case queryParam are empty
        if(queryParamsArray.length === 1) {
            fileName = removeLastChar(fileName);   
        }
        
        console.log('File name: %s', fileName);
        return fileName;
    }

    function removeLastChar(str) {
        return str.substr(0, str.length - 1);   
    }
}

module.exports = Utils;