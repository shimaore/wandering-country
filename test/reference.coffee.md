    seem = require 'seem'
    {p_fun} = require 'coffeescript-helpers'
    PouchDB = (require 'pouchdb')
      .plugin require 'pouchdb-adapter-memory'
      .defaults adapter:'memory'

    chai = require 'chai'
    chai.should()

    describe 'The `reference` code', ->
      {WanderingCountryReference} = require '../reference'
      prepare = seem ->
        db = new PouchDB 'reference-2017-03'
        yield db.put
           _id: "2017-04-00098401-f0a8-4ceb-acc7-46c5ba2da4ea",
           tags: [
            "client-side",
            'endpoint:34@example.net'
            "ingress",
            'answered'
           ],
        yield db.put
          _id: '2017-03-blablabla'
          calls: [
            {
              start_time: "2017-04-01T12:22:33.591Z",
              end_time: "2017-04-01T12:23:54.177Z",
              report: {
                direction: "egress",
                emergency: null,
                onnet: null,
                duration: "80580",
                billable: "52940",
                progress: "2840",
                answer: "27640",
                wait: "27640",
                progress_media: "27640",
                flow_bill: "80580"
              }
            }
            {
              start_time: "2017-04-02T15:15:22.386Z",
              end_time: "2017-04-02T15:15:41.842Z",
              report: {
                 "direction": "ingress",
                 "emergency": null,
                 "onnet": null,
                 "duration": "19420",
                 "billable": "4200",
                 "progress": "1440",
                 "answer": "0",
                 "wait": "0",
                 "progress_media": "1440",
                 "flow_bill": "0"
              }
            }
          ]
          tags: [
            'client-side'
            'ingress'
            'endpoint:34@example.net'
            'answered'
          ]

        yield db.put
          _id: '_design/grumpy-actor'
          views:
            tags:
              reduce: '_stats'
              map: p_fun 'var sum = (acc,val) => acc+val; ', (require 'grumpy-actor/reference').tags

        db

      e = null

      it 'should create an object', ->
        db = yield prepare()
        e = new WanderingCountryReference (month) -> db

      it 'should query', seem ->
        db = yield prepare()
        e = new WanderingCountryReference (month) ->
          switch month
            when '2017-03'
              db
            else
              null
        result = yield e.endpoint '34@example.net', '2017-02-04', '2017-04-01'
        result.should.have.property '2017-04-01'
        result['2017-04-01'].should.have.property 'ingress_count', 1
        result['2017-04-01'].should.have.property 'ingress_total', 57.14
