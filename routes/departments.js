var mock_http = require(__base + '/lib/mock_http');

module.exports = {
    path: '/departments',
    
    //this function gets passed the express object one time for any extra setup
    init: function(app) {
        
    },

    GET: function(req, resp) {
        var departmentMock = new mock_http();
        departmentMock.doGet(req, resp);
    },

    POST: function(req, resp) {
        var departmentMock = new mock_http();
        departmentMock.doPost(req, resp);
    },

    PUT: function(req, resp) {
        var departmentMock = new mock_http();
        departmentMock.doPut(req, resp);
    },

    DELETE: function(req, resp) {
        var departmentMock = new mock_http();
        departmentMock.doDelete(req, resp);
    }
};