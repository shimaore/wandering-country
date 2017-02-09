    seem = require 'seem'
    debug = (require 'debug') 'wandering-country:client-db'

    PouchDB = require 'shimaore-pouchdb'
    # PouchDB.plugin require 'pouchdb-find' # in CouchDB 2.0

    module.exports = get_client_db = seem (ev) ->

`nimble-direction` convention

      db = @cfg.prov

`well-groomed-earth`/`huge-play` conventions

      user_db = (name) =>
        new PouchDB @cfg.userdb_base_uri + '/' + name

      {db,user_db}
