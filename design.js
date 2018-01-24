// Generated by CoffeeScript 1.12.7
(function() {
  var app, app_version, couchapp, p_fun;

  app = 'wandering-country';

  app_version = '1.2';

  p_fun = require('coffeescript-helpers').p_fun;

  couchapp = function(arg) {
    var extra, normalize_account;
    normalize_account = arg.normalize_account;
    extra = "var normalize_account = " + normalize_account + ";";
    return {
      _id: "_design/" + app,
      version: app_version,
      language: 'javascript',
      views: {
        numbers_by_domain: {
          map: p_fun(function(doc) {
            var m;
            if (!((doc.type != null) && doc.type === 'number')) {
              return;
            }
            if (!(m = doc._id.match(/^number:[^@]+@(.+)$/))) {
              return;
            }
            emit(m[1]);
          }),
          reduce: '_count'
        },
        endpoints_by_domain: {
          map: p_fun(function(doc) {
            var m;
            if (!((doc.type != null) && doc.type === 'endpoint')) {
              return;
            }
            if (!(m = doc._id.match(/^endpoint:[^@]+@(.+)$/))) {
              return;
            }
            emit(m[1]);
          })
        },
        devices: {
          map: p_fun(extra, function(doc) {
            var account, ref;
            if (!((doc.type != null) && doc.type === 'device')) {
              return;
            }
            if (doc.disabled) {
              return;
            }
            account = doc.account != null ? normalize_account(doc.account) : null;
            emit(['account', account], doc.device);
            if ((ref = doc.lines) != null) {
              ref.forEach(function(arg1) {
                var domain, e, endpoint, name, ref1;
                endpoint = arg1.endpoint;
                if (endpoint == null) {
                  return;
                }
                emit(['endpoint', endpoint], doc.device);
                e = endpoint.match(/^([^@]+)@(.+)$/);
                if (e != null) {
                  ref1 = [e[1], e[2]], name = ref1[0], domain = ref1[1];
                  return emit(['domain', domain, name], doc.device);
                }
              });
            }
          })
        },
        number_domains: {
          map: p_fun(extra, function(doc) {
            var account;
            if (!((doc.type != null) && doc.type === 'number_domain')) {
              return;
            }
            if (doc.disabled) {
              return;
            }
            account = doc.account != null ? normalize_account(doc.account) : null;
            emit(['account', account], doc.number_domain);
          })
        },
        endpoints: {
          map: p_fun(extra, function(doc) {
            var account, domain, e, name, ref;
            if (!((doc.type != null) && doc.type === 'endpoint')) {
              return;
            }
            if (doc.disabled) {
              return;
            }
            account = doc.account != null ? normalize_account(doc.account) : null;
            emit(['account', account], doc.endpoint);
            if (doc.sub_account != null) {
              emit(['sub_account', account, doc.sub_account], doc.endpoint);
            }
            e = doc._id.match(/^endpoint:([^@]+)@(.+)$/);
            if (e != null) {
              ref = [e[1], e[2]], name = ref[0], domain = ref[1];
              emit(['domain', domain], doc.endpoint);
            }
            if (doc.number_domain != null) {
              emit(['number_domain', doc.number_domain], doc.endpoint);
            }
            if (doc.location != null) {
              emit(['location', doc.location], doc.endpoint);
            }
          })
        },
        local_numbers: {
          map: p_fun(extra, function(doc) {
            var account, domain, e, m, name, ref, ref1, ref2, ref3, ref4, ref5;
            if (!((doc.type != null) && doc.type === 'number')) {
              return;
            }
            if (!(m = doc._id.match(/^number:([^@]+)@(.+)$/))) {
              return;
            }
            if (doc.disabled) {
              return;
            }
            account = doc.account != null ? normalize_account(doc.account) : null;
            emit(['account', account], doc.number);
            if (doc.endpoint != null) {
              emit(['endpoint', doc.endpoint], doc.number);
              e = doc.endpoint.match(/^([^@]+)@(.+)$/);
              if (e != null) {
                ref = [e[1], e[2]], name = ref[0], domain = ref[1];
                emit(['domain', domain, name], doc.number);
              }
            }
            if (doc.user_database != null) {
              emit(['user_database', doc.user_database], doc.number);
            }
            ref1 = [m[1], m[2]], name = ref1[0], domain = ref1[1];
            emit(['number_domain', domain, name], doc.number);
            if ((ref2 = doc.groups) != null) {
              ref2.forEach(function(group) {
                return emit(['group', domain, group], doc.number);
              });
            }
            if ((ref3 = doc.allowed_groups) != null) {
              ref3.forEach(function(group) {
                return emit(['allowed_group', domain, group], doc.number);
              });
            }
            if ((ref4 = doc.queues) != null) {
              ref4.forEach(function(queue) {
                return emit(['queue', domain, queue], doc.number);
              });
            }
            if ((ref5 = doc.skills) != null) {
              ref5.forEach(function(skill) {
                return emit(['skill', domain, skill], doc.number);
              });
            }
          })
        },
        global_numbers: {
          map: p_fun(extra, function(doc) {
            var account, domain, m, n, name, ref;
            if (!((doc.type != null) && doc.type === 'number')) {
              return;
            }
            if (!(m = doc._id.match(/^number:([^@]+)$/))) {
              return;
            }
            if (doc.disabled) {
              return;
            }
            account = doc.account != null ? normalize_account(doc.account) : null;
            emit(['account', account], doc.number);
            if (doc.local_number != null) {
              emit(['local_number', doc.local_number], doc.number);
              if (n = doc.local_number.match(/^([^@]+)@(.+)$/)) {
                ref = [n[1], n[2]], name = ref[0], domain = ref[1];
                emit(['number_domain', domain, name], doc.number);
              }
            }
          })
        }
      }
    };
  };

  module.exports = {
    app: app,
    couchapp: couchapp
  };

}).call(this);
