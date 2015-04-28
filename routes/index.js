var testApi = planorequire('modules/test-api');
var glob = require('glob');
var moment = require('moment');
var logger = planorequire('modules/logger');

module.exports = function(app) {
  app.get('/', function(req, res, next) {

    var test1 = testApi.create({
      type: 'product',
      form: {
        markets:['BX'],
        from:'2015-03-10T00:00:00.000Z',
        to:'2015-03-17T00:00:00.000Z'
      }
    });

    test1.run(function(err) {
      if (err) return next(err);

      var filesName = glob.sync('**BX_**');
      var result = '';
      var re = /^BX_(\w*_\w*)_{1,2}(\d{14})_(\d{14})$/;

      var tmp = '';

      filesName.forEach(function(fileName) {

        logger.warn(fileName);
        var reg = re.exec(fileName);

        if (reg[1] !== tmp) {
          tmp = reg[1];
          result += reg[1] + ';;\n';
        }

        result += ';' +  moment(reg[2], 'YYYYMMDDHHmmss').format("DD-MM-YYYY HH:mm") + ';'+ moment(reg[3], 'YYYYMMDDHHmmss').format("DD-MM-YYYY  HH:mm")+ '\n';

      });

      return res.respond({ message : result });
    });
  });
};