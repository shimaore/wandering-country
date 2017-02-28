    describe 'Modules', ->
      it 'index should load', -> require '../index'
      it 'sleep should load', -> require '../sleep'
      it 'client-db should load', -> require '../client-db'
      it 'server-db should load', -> require '../server-db'
      it 'index should install_handlers', ->
        {WanderingCountry} = require '../index'
        observable = require 'riot-observable'
        PouchDB = (require 'pouchdb')
          .plugin require 'pouchdb-adapter-memory'
          .defaults adapter:'memory'
        b = new WanderingCountry (new PouchDB 'hello'), null, new observable()
        b.install_handlers()

