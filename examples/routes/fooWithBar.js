var mock_http = require(__base + '/lib/mock_http');

module.exports = {
	path: '/foo/:foo_id/bar/:bar_id',

	init: function(app) {

	},

	GET: function(req, resp) {
		var mock = new mock_http();
		mock.doGet(req, resp);
	}, 

	PUT: function(req, resp) {
		var mock = new mock_http();
		mock.doPut(req, resp);
	},

	DELETE: function(req, resp)	{
		var mock = new mock_http();
		mock.doDelete(req, resp)
	}
}