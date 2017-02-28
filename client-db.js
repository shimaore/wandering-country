// Generated by CoffeeScript 1.12.4
(function() {
  var PouchDB, debug, get_client_db, seem;

  seem = require('seem');

  debug = (require('debug'))('wandering-country:client-db');

  PouchDB = require('shimaore-pouchdb');

  module.exports = get_client_db = seem(function*(ev) {
    var db, db_name, location, user, user_db;
    debug('Loading…');
    location = function(name) {
      return [window.location.protocol, '//', window.location.host, '/', name].join('');
    };
    db = null;
    if (this.cfg.db != null) {
      debug('Using database', this.cfg.db);
      db = new PouchDB(this.cfg.db);
      user_db = function(name) {
        return new PouchDB(name);
      };
      ev.one('user-data', function(data) {
        debug('trigger database-name');
        return ev.trigger('database-name', 'test');
      });
    } else {
      debug('Waiting for user-data…');
      user = (yield new Promise(function(resolve) {
        ev.one('user-data', function(data) {
          return resolve(data);
        });
        return ev.trigger('get-user-data');
      }));
      user_db = function(name) {
        return new PouchDB(location(name));
      };
      if (user.admin) {
        db_name = 'provisioning';
      } else {
        debug('Waiting for database-ready…');
        db_name = (yield new Promise(function(resolve) {
          ev.one('database-ready', function(db) {
            return resolve(db);
          });
          return ev.trigger('user-provisioning');
        }));
      }
      debug('Database is', db_name);
      db = user_db(db_name);
      ev.trigger('database-name', db_name);
    }
    return {
      db: db,
      user_db: user_db
    };
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LWRiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2xpZW50LWRiLmNvZmZlZS5tZCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUk7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxLQUFBLEdBQVEsQ0FBQyxPQUFBLENBQVEsT0FBUixDQUFELENBQUEsQ0FBa0IsNkJBQWxCOztFQUtSLE9BQUEsR0FBVSxPQUFBLENBQVEsa0JBQVI7O0VBR1YsTUFBTSxDQUFDLE9BQVAsR0FBaUIsYUFBQSxHQUFnQixJQUFBLENBQUssVUFBQyxFQUFEO0FBQ3BDLFFBQUE7SUFBQSxLQUFBLENBQU0sVUFBTjtJQUVBLFFBQUEsR0FBVyxTQUFDLElBQUQ7YUFDVCxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBakIsRUFBMEIsSUFBMUIsRUFBK0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUEvQyxFQUFvRCxHQUFwRCxFQUF3RCxJQUF4RCxDQUE2RCxDQUFDLElBQTlELENBQW1FLEVBQW5FO0lBRFM7SUFHWCxFQUFBLEdBQUs7SUFPTCxJQUFHLG1CQUFIO01BQ0UsS0FBQSxDQUFNLGdCQUFOLEVBQXdCLElBQUMsQ0FBQSxHQUFHLENBQUMsRUFBN0I7TUFDQSxFQUFBLEdBQUssSUFBSSxPQUFKLENBQVksSUFBQyxDQUFBLEdBQUcsQ0FBQyxFQUFqQjtNQUNMLE9BQUEsR0FBVSxTQUFDLElBQUQ7ZUFDUixJQUFJLE9BQUosQ0FBWSxJQUFaO01BRFE7TUFHVixFQUFFLENBQUMsR0FBSCxDQUFPLFdBQVAsRUFBb0IsU0FBQyxJQUFEO1FBQ2xCLEtBQUEsQ0FBTSx1QkFBTjtlQUNBLEVBQUUsQ0FBQyxPQUFILENBQVcsZUFBWCxFQUE0QixNQUE1QjtNQUZrQixDQUFwQixFQU5GO0tBQUEsTUFBQTtNQWlCRSxLQUFBLENBQU0sd0JBQU47TUFDQSxJQUFBLEdBQU8sQ0FBQSxNQUFNLElBQUksT0FBSixDQUFZLFNBQUMsT0FBRDtRQUN2QixFQUFFLENBQUMsR0FBSCxDQUFPLFdBQVAsRUFBb0IsU0FBQyxJQUFEO2lCQUNsQixPQUFBLENBQVEsSUFBUjtRQURrQixDQUFwQjtlQUVBLEVBQUUsQ0FBQyxPQUFILENBQVcsZUFBWDtNQUh1QixDQUFaLENBQU47TUFLUCxPQUFBLEdBQVUsU0FBQyxJQUFEO2VBQ1IsSUFBSSxPQUFKLENBQVksUUFBQSxDQUFTLElBQVQsQ0FBWjtNQURRO01BR1YsSUFBRyxJQUFJLENBQUMsS0FBUjtRQUNFLE9BQUEsR0FBVSxlQURaO09BQUEsTUFBQTtRQUdFLEtBQUEsQ0FBTSw2QkFBTjtRQUNBLE9BQUEsR0FBVSxDQUFBLE1BQU0sSUFBSSxPQUFKLENBQVksU0FBQyxPQUFEO1VBQzFCLEVBQUUsQ0FBQyxHQUFILENBQU8sZ0JBQVAsRUFBeUIsU0FBQyxFQUFEO21CQUN2QixPQUFBLENBQVEsRUFBUjtVQUR1QixDQUF6QjtpQkFFQSxFQUFFLENBQUMsT0FBSCxDQUFXLG1CQUFYO1FBSDBCLENBQVosQ0FBTixFQUpaOztNQVNBLEtBQUEsQ0FBTSxhQUFOLEVBQXFCLE9BQXJCO01BQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSO01BQ0wsRUFBRSxDQUFDLE9BQUgsQ0FBVyxlQUFYLEVBQTRCLE9BQTVCLEVBckNGOztXQXVDQTtNQUFDLElBQUEsRUFBRDtNQUFJLFNBQUEsT0FBSjs7RUFwRG9DLENBQUw7QUFUakMiLCJzb3VyY2VzQ29udGVudCI6WyIgICAgc2VlbSA9IHJlcXVpcmUgJ3NlZW0nXG4gICAgZGVidWcgPSAocmVxdWlyZSAnZGVidWcnKSAnd2FuZGVyaW5nLWNvdW50cnk6Y2xpZW50LWRiJ1xuXG5Qb3VjaERCIFN0b3JlXG49PT09PT09PT09PT09XG5cbiAgICBQb3VjaERCID0gcmVxdWlyZSAnc2hpbWFvcmUtcG91Y2hkYidcbiAgICAjIFBvdWNoREIucGx1Z2luIHJlcXVpcmUgJ3BvdWNoZGItZmluZCcgIyBpbiBDb3VjaERCIDIuMFxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBnZXRfY2xpZW50X2RiID0gc2VlbSAoZXYpIC0+XG4gICAgICBkZWJ1ZyAnTG9hZGluZ+KApidcblxuICAgICAgbG9jYXRpb24gPSAobmFtZSkgLT5cbiAgICAgICAgW3dpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCwnLy8nLHdpbmRvdy5sb2NhdGlvbi5ob3N0LCcvJyxuYW1lXS5qb2luICcnXG5cbiAgICAgIGRiID0gbnVsbFxuXG5UZXN0c1xuLS0tLS1cblxuVXNlIGxvY2FsIChpbi1icm93c2VyKSBQb3VjaERCIGZvciB0ZXN0cy5cblxuICAgICAgaWYgQGNmZy5kYj9cbiAgICAgICAgZGVidWcgJ1VzaW5nIGRhdGFiYXNlJywgQGNmZy5kYlxuICAgICAgICBkYiA9IG5ldyBQb3VjaERCIEBjZmcuZGJcbiAgICAgICAgdXNlcl9kYiA9IChuYW1lKSAtPlxuICAgICAgICAgIG5ldyBQb3VjaERCIG5hbWVcblxuICAgICAgICBldi5vbmUgJ3VzZXItZGF0YScsIChkYXRhKSAtPlxuICAgICAgICAgIGRlYnVnICd0cmlnZ2VyIGRhdGFiYXNlLW5hbWUnXG4gICAgICAgICAgZXYudHJpZ2dlciAnZGF0YWJhc2UtbmFtZScsICd0ZXN0J1xuXG5Ob3JtYWwgdXNhZ2UgLyBwcm9kdWN0aW9uXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGVsc2VcblxuTW9kdWxlIGBzcGljeS1hY3Rpb24tdXNlcmAgZGVmaW5lcyBgZ2V0LXVzZXItZGF0YWAgYW5kIGl0cyByZXNwb25zZSwgYHVzZXItZGF0YWAuXG5cbiAgICAgICAgZGVidWcgJ1dhaXRpbmcgZm9yIHVzZXItZGF0YeKApidcbiAgICAgICAgdXNlciA9IHlpZWxkIG5ldyBQcm9taXNlIChyZXNvbHZlKSAtPlxuICAgICAgICAgIGV2Lm9uZSAndXNlci1kYXRhJywgKGRhdGEpIC0+XG4gICAgICAgICAgICByZXNvbHZlIGRhdGFcbiAgICAgICAgICBldi50cmlnZ2VyICdnZXQtdXNlci1kYXRhJ1xuXG4gICAgICAgIHVzZXJfZGIgPSAobmFtZSkgLT5cbiAgICAgICAgICBuZXcgUG91Y2hEQiBsb2NhdGlvbiBuYW1lXG5cbiAgICAgICAgaWYgdXNlci5hZG1pblxuICAgICAgICAgIGRiX25hbWUgPSAncHJvdmlzaW9uaW5nJ1xuICAgICAgICBlbHNlXG4gICAgICAgICAgZGVidWcgJ1dhaXRpbmcgZm9yIGRhdGFiYXNlLXJlYWR54oCmJ1xuICAgICAgICAgIGRiX25hbWUgPSB5aWVsZCBuZXcgUHJvbWlzZSAocmVzb2x2ZSkgLT5cbiAgICAgICAgICAgIGV2Lm9uZSAnZGF0YWJhc2UtcmVhZHknLCAoZGIpIC0+XG4gICAgICAgICAgICAgIHJlc29sdmUgZGJcbiAgICAgICAgICAgIGV2LnRyaWdnZXIgJ3VzZXItcHJvdmlzaW9uaW5nJ1xuXG4gICAgICAgIGRlYnVnICdEYXRhYmFzZSBpcycsIGRiX25hbWVcbiAgICAgICAgZGIgPSB1c2VyX2RiIGRiX25hbWVcbiAgICAgICAgZXYudHJpZ2dlciAnZGF0YWJhc2UtbmFtZScsIGRiX25hbWVcblxuICAgICAge2RiLHVzZXJfZGJ9XG4iXX0=
//# sourceURL=/srv/home/stephane/Artisan/Managed/Telecoms/wandering-country/client-db.coffee.md