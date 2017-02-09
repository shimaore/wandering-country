    describe 'Modules', ->
      it 'index should load', -> require '../index'
      it 'sleep should load', -> require '../sleep'
      it 'client-db should load', -> require '../client-db'
      it 'server-db should load', -> require '../server-db'
