// Generated by CoffeeScript 1.12.3
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LWRiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2xpZW50LWRiLmNvZmZlZS5tZCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUk7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxLQUFBLEdBQVEsQ0FBQyxPQUFBLENBQVEsT0FBUixDQUFELENBQUEsQ0FBa0IsNkJBQWxCOztFQUtSLE9BQUEsR0FBVSxPQUFBLENBQVEsa0JBQVI7O0VBR1YsTUFBTSxDQUFDLE9BQVAsR0FBaUIsYUFBQSxHQUFnQixJQUFBLENBQUssVUFBQyxFQUFEO0FBQ3BDLFFBQUE7SUFBQSxLQUFBLENBQU0sVUFBTjtJQUVBLFFBQUEsR0FBVyxTQUFDLElBQUQ7YUFDVCxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBakIsRUFBMEIsSUFBMUIsRUFBK0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUEvQyxFQUFvRCxHQUFwRCxFQUF3RCxJQUF4RCxDQUE2RCxDQUFDLElBQTlELENBQW1FLEVBQW5FO0lBRFM7SUFHWCxFQUFBLEdBQUs7SUFPTCxJQUFHLG1CQUFIO01BQ0UsS0FBQSxDQUFNLGdCQUFOLEVBQXdCLElBQUMsQ0FBQSxHQUFHLENBQUMsRUFBN0I7TUFDQSxFQUFBLEdBQVMsSUFBQSxPQUFBLENBQVEsSUFBQyxDQUFBLEdBQUcsQ0FBQyxFQUFiO01BQ1QsT0FBQSxHQUFVLFNBQUMsSUFBRDtlQUNKLElBQUEsT0FBQSxDQUFRLElBQVI7TUFESTtNQUdWLEVBQUUsQ0FBQyxHQUFILENBQU8sV0FBUCxFQUFvQixTQUFDLElBQUQ7UUFDbEIsS0FBQSxDQUFNLHVCQUFOO2VBQ0EsRUFBRSxDQUFDLE9BQUgsQ0FBVyxlQUFYLEVBQTRCLE1BQTVCO01BRmtCLENBQXBCLEVBTkY7S0FBQSxNQUFBO01BaUJFLEtBQUEsQ0FBTSx3QkFBTjtNQUNBLElBQUEsR0FBTyxDQUFBLE1BQVUsSUFBQSxPQUFBLENBQVEsU0FBQyxPQUFEO1FBQ3ZCLEVBQUUsQ0FBQyxHQUFILENBQU8sV0FBUCxFQUFvQixTQUFDLElBQUQ7aUJBQ2xCLE9BQUEsQ0FBUSxJQUFSO1FBRGtCLENBQXBCO2VBRUEsRUFBRSxDQUFDLE9BQUgsQ0FBVyxlQUFYO01BSHVCLENBQVIsQ0FBVjtNQUtQLE9BQUEsR0FBVSxTQUFDLElBQUQ7ZUFDSixJQUFBLE9BQUEsQ0FBUSxRQUFBLENBQVMsSUFBVCxDQUFSO01BREk7TUFHVixJQUFHLElBQUksQ0FBQyxLQUFSO1FBQ0UsT0FBQSxHQUFVLGVBRFo7T0FBQSxNQUFBO1FBR0UsS0FBQSxDQUFNLDZCQUFOO1FBQ0EsT0FBQSxHQUFVLENBQUEsTUFBVSxJQUFBLE9BQUEsQ0FBUSxTQUFDLE9BQUQ7VUFDMUIsRUFBRSxDQUFDLEdBQUgsQ0FBTyxnQkFBUCxFQUF5QixTQUFDLEVBQUQ7bUJBQ3ZCLE9BQUEsQ0FBUSxFQUFSO1VBRHVCLENBQXpCO2lCQUVBLEVBQUUsQ0FBQyxPQUFILENBQVcsbUJBQVg7UUFIMEIsQ0FBUixDQUFWLEVBSlo7O01BU0EsS0FBQSxDQUFNLGFBQU4sRUFBcUIsT0FBckI7TUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVI7TUFDTCxFQUFFLENBQUMsT0FBSCxDQUFXLGVBQVgsRUFBNEIsT0FBNUIsRUFyQ0Y7O1dBdUNBO01BQUMsSUFBQSxFQUFEO01BQUksU0FBQSxPQUFKOztFQXBEb0MsQ0FBTDtBQVRqQyIsInNvdXJjZXNDb250ZW50IjpbIiAgICBzZWVtID0gcmVxdWlyZSAnc2VlbSdcbiAgICBkZWJ1ZyA9IChyZXF1aXJlICdkZWJ1ZycpICd3YW5kZXJpbmctY291bnRyeTpjbGllbnQtZGInXG5cblBvdWNoREIgU3RvcmVcbj09PT09PT09PT09PT1cblxuICAgIFBvdWNoREIgPSByZXF1aXJlICdzaGltYW9yZS1wb3VjaGRiJ1xuICAgICMgUG91Y2hEQi5wbHVnaW4gcmVxdWlyZSAncG91Y2hkYi1maW5kJyAjIGluIENvdWNoREIgMi4wXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGdldF9jbGllbnRfZGIgPSBzZWVtIChldikgLT5cbiAgICAgIGRlYnVnICdMb2FkaW5n4oCmJ1xuXG4gICAgICBsb2NhdGlvbiA9IChuYW1lKSAtPlxuICAgICAgICBbd2luZG93LmxvY2F0aW9uLnByb3RvY29sLCcvLycsd2luZG93LmxvY2F0aW9uLmhvc3QsJy8nLG5hbWVdLmpvaW4gJydcblxuICAgICAgZGIgPSBudWxsXG5cblRlc3RzXG4tLS0tLVxuXG5Vc2UgbG9jYWwgKGluLWJyb3dzZXIpIFBvdWNoREIgZm9yIHRlc3RzLlxuXG4gICAgICBpZiBAY2ZnLmRiP1xuICAgICAgICBkZWJ1ZyAnVXNpbmcgZGF0YWJhc2UnLCBAY2ZnLmRiXG4gICAgICAgIGRiID0gbmV3IFBvdWNoREIgQGNmZy5kYlxuICAgICAgICB1c2VyX2RiID0gKG5hbWUpIC0+XG4gICAgICAgICAgbmV3IFBvdWNoREIgbmFtZVxuXG4gICAgICAgIGV2Lm9uZSAndXNlci1kYXRhJywgKGRhdGEpIC0+XG4gICAgICAgICAgZGVidWcgJ3RyaWdnZXIgZGF0YWJhc2UtbmFtZSdcbiAgICAgICAgICBldi50cmlnZ2VyICdkYXRhYmFzZS1uYW1lJywgJ3Rlc3QnXG5cbk5vcm1hbCB1c2FnZSAvIHByb2R1Y3Rpb25cbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZWxzZVxuXG5Nb2R1bGUgYHNwaWN5LWFjdGlvbi11c2VyYCBkZWZpbmVzIGBnZXQtdXNlci1kYXRhYCBhbmQgaXRzIHJlc3BvbnNlLCBgdXNlci1kYXRhYC5cblxuICAgICAgICBkZWJ1ZyAnV2FpdGluZyBmb3IgdXNlci1kYXRh4oCmJ1xuICAgICAgICB1c2VyID0geWllbGQgbmV3IFByb21pc2UgKHJlc29sdmUpIC0+XG4gICAgICAgICAgZXYub25lICd1c2VyLWRhdGEnLCAoZGF0YSkgLT5cbiAgICAgICAgICAgIHJlc29sdmUgZGF0YVxuICAgICAgICAgIGV2LnRyaWdnZXIgJ2dldC11c2VyLWRhdGEnXG5cbiAgICAgICAgdXNlcl9kYiA9IChuYW1lKSAtPlxuICAgICAgICAgIG5ldyBQb3VjaERCIGxvY2F0aW9uIG5hbWVcblxuICAgICAgICBpZiB1c2VyLmFkbWluXG4gICAgICAgICAgZGJfbmFtZSA9ICdwcm92aXNpb25pbmcnXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBkZWJ1ZyAnV2FpdGluZyBmb3IgZGF0YWJhc2UtcmVhZHnigKYnXG4gICAgICAgICAgZGJfbmFtZSA9IHlpZWxkIG5ldyBQcm9taXNlIChyZXNvbHZlKSAtPlxuICAgICAgICAgICAgZXYub25lICdkYXRhYmFzZS1yZWFkeScsIChkYikgLT5cbiAgICAgICAgICAgICAgcmVzb2x2ZSBkYlxuICAgICAgICAgICAgZXYudHJpZ2dlciAndXNlci1wcm92aXNpb25pbmcnXG5cbiAgICAgICAgZGVidWcgJ0RhdGFiYXNlIGlzJywgZGJfbmFtZVxuICAgICAgICBkYiA9IHVzZXJfZGIgZGJfbmFtZVxuICAgICAgICBldi50cmlnZ2VyICdkYXRhYmFzZS1uYW1lJywgZGJfbmFtZVxuXG4gICAgICB7ZGIsdXNlcl9kYn1cbiJdfQ==
//# sourceURL=/srv/home/stephane/Artisan/Managed/Telecoms/wandering-country/client-db.coffee.md