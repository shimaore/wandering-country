    seem = require 'seem'
    debug = (require 'debug') 'wandering-country:client-db'

PouchDB Store
=============

    PouchDB = require 'shimaore-pouchdb'
    # PouchDB.plugin require 'pouchdb-find' # in CouchDB 2.0

    module.exports = get_client_db = seem (ev) ->
      debug 'Loading…'

      location = (name) ->
        [window.location.protocol,'//',window.location.host,'/',name].join ''

      db = null

Tests
-----

Use local (in-browser) PouchDB for tests.

      if @cfg.db?
        debug 'Using database', @cfg.db
        db = new PouchDB @cfg.db
        user_db = (name) ->
          new PouchDB name

        ev.one 'user-data', (data) ->
          debug 'trigger database-name'
          ev.trigger 'database-name', 'test'

Normal usage / production
-------------------------

      else

Module `spicy-action-user` defines `get-user-data` and its response, `user-data`.

        debug 'Waiting for user-data…'
        user = yield new Promise (resolve) ->
          ev.one 'user-data', (data) ->
            resolve data
          ev.trigger 'get-user-data'

        user_db = (name) ->
          new PouchDB location name

        if user.admin
          db_name = 'provisioning'
        else
          debug 'Waiting for database-ready…'
          db_name = yield new Promise (resolve) ->
            ev.one 'database-ready', (db) ->
              resolve db
            ev.trigger 'user-provisioning'

        debug 'Database is', db_name
        db = user_db db_name
        ev.trigger 'database-name', db_name

      {db,user_db}
