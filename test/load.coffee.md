    describe 'Modules', ->
      it 'index should load', -> require '../index'
      it 'design should load', -> require '../design'
      it 'index should install_handlers', ->
        {WanderingCountry} = require '../index'
        observable = require 'riot-observable'
        PouchDB = require 'pouchdb-core'
          .plugin require 'pouchdb-adapter-memory'
          .defaults adapter:'memory'
        b = new WanderingCountry (new PouchDB 'hello'), null, new observable()
        b.install_handlers()

