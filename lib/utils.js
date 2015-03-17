var _ = require('lodash'),
    fs = require('fs'),
    glob = require("glob");

var Utils = function() {
    'use strict';

    var self = this;

    self.loadResource = loadResource;
    self.getFilePathFromRequestURL = getFilePathFromRequestURL;
    self.getFilePathFromMapping = getFilePathFromMapping;
    self.getFilePath = getFilePath;   

    function loadResource(filePath) {
        var filecontent = null;
        
        console.log({ 'filePath' : filePath });
        console.log({ 'filePathExists' : fs.existsSync(filePath) });
        
        if(fs.existsSync(filePath)) {
            filecontent = fs.readFileSync(filePath, 'utf8');
            console.log({ 'method': 'loadResource', 'response' : filecontent});
        } else {
            console.error('ERROR: Resource ' + filePath + ' does not exists');
        }
        
        return filecontent;
    }

    function getFilePathFromRequestURL(request) {
        var fileName = getFileNameFromRequest(request),
            resourceUrl = request.route.path,
            httpVerb = request.route.method,
            resources = [],
            params = Object.keys(request.params);

        console.info('Request Params %s:', params);
        
        params.forEach(function(param) {
            console.log('Param %s', param);
            resourceUrl = resourceUrl.replace('/:' + param, '');
        }); 
        
        resourceUrl = resourceUrl.replace('/', '');
        resources = resourceUrl.split('/');
        resourceUrl = resources.splice(0, 1);

        console.log('Resource URL %s', resourceUrl);            
        console.info('SubResources %s', resources);
            
        return getFilePath(resourceUrl, resources, httpVerb, fileName);
    }

    function getFilePathFromMapping(request, mapping) {
        var fileName = getFileNameFromRequest(request),
        resourceUrl = request.route.path,
        httpVerb = request.route.method,
        resources = [];

        resourceUrl = resourceUrl.replace('/', '');
        resources = resourceUrl.split('/');
        resourceUrl = resources.splice(0, 1);

        console.log('Resource URL %s', resourceUrl);            
        console.info('SubResources %s', resources);

        return getFilePath(resourceUrl, resources, httpVerb, mapping[fileName]);
    }

    function getFilePath(resource, subresources, method, fileName) {
        
        var mockRoot = __base + 'mocks',
            mockFilePattern = '.json',
            pathSeparator = '/',
            filePath = '';

        // mocks/{resource}/(get|post|put|delete)/{subresource}/{fileName}|all}.json
        filePath += mockRoot;
        filePath += pathSeparator;
        filePath += resource;
        filePath += pathSeparator;
        filePath += method;
        filePath += pathSeparator;

        subresources.forEach(function(subresource){
            filePath += subresource;
            filePath += pathSeparator;
        });

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
            httpVerb = request.route.method,
            queryParamsArray = Object.keys(queryParams),
            innerQueryParamArray = [],
            innerQueryInitParamOperator = '[',
            innerQueryEndParamOperator = ']';
        
        pathParamsArray.forEach(function(pathParam){
            fileName += pathParams[pathParam];
            fileName += pathOperator;
        });

        // Remove the last pathOperator in case queryParam are empty
        if(queryParamsArray.length === 0) {
            fileName = removeLastChar(fileName);   
        }

        queryParamsArray.forEach(function(queryParam) {
            if(typeof queryParams[queryParam] === 'object') {
                innerQueryParamArray = Object.keys(queryParams[queryParam]);
                innerQueryParamArray.forEach(function(innerQueryParam) {
                    fileName += queryParam;
                    fileName += innerQueryInitParamOperator;
                    fileName += innerQueryParam;
                    fileName += innerQueryEndParamOperator;
                    fileName += queryOperator;
                    fileName += queryParams[queryParam][innerQueryParam];
                    fileName += queryConcatenation;            
                });
            } else {
                fileName += queryParam;
                fileName += queryOperator;
                fileName += queryParams[queryParam];
                fileName += queryConcatenation;            
            }
        });

        // Remove the last queryConcatenation in case queryParam are empty
        if(queryParamsArray.length > 0) {
            fileName = removeLastChar(fileName);   
        }
        
        // Check for HTTP Mthod
        if('get'.indexOf(httpVerb) !== -1 
            && fileName.length === 0) {
            fileName = 'all';
        }   

        console.log('File name: %s', fileName);
        return fileName;
    }

    function removeLastChar(str) {
        return str.substr(0, str.length - 1);   
    }
}

module.exports = Utils;