exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://user:user@ds155315.mlab.com:55315/formdb';
exports.PORT = process.env.PORT || 8080;

//have all collections for every schema in one database