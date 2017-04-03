    moment = require 'moment'
    seem = require 'seem'

    post = (result) ->
      for own k, v of result

- number of egress calls

        v.egress_count = v.egress?.count ? 0

- total (billable) duration of egress calls

        v.egress_total = v.egress?.sum ? 0

- average egress call duration

        if v.egress_count? and v.egress_count > 0
          v.egress_average = v.egress_total / v.egress_count

- number of answered calls

        v.answered_count = v['ingress-answered']?.count ? 0
        v.answered_total = v['ingress-answered']?.sum ? 0

        if v.answered_count? and v.answered_count > 0
          v.answered_average = v.answered_total / v.answered_count

- number of unanswered calls

        v.unanswered_count = v['ingress-unanswered']?.count ? 0
        v.unanswered_total = v['ingress-unanswered']?.sum ? 0

- number of received calls

        v.ingress_count = v.answered_count + v.unanswered_count

- total duration on ingress calls

        v.ingress_total = v.answered_total + v.unanswered_total

- average ingress call duration

        if v.ingress_count? and v.ingress_count > 0
          v.ingress_average = v.ingress_total / v.ingress_count

      result

### Extended CDRs (client-side)

    class WanderingCountryReference

      constructor: (@ref_db) ->

For a given endpoint and a date-range, returns dates, and for each date:

      endpoint: (endpoint, start_date, end_date) ->
        @_query 'endpoint', endpoint, start_date, end_date

      _query: seem (type,type_value,start_date,end_date) ->

        start_key = moment start_date, 'YYYY-MM-DD'
          .subtract 1, 'days'

        end_key = moment end_date, 'YYYY-MM-DD'
          .add 1, 'days'

        start_month = start_key.clone()
          .startOf 'month'

        result = {}

        while start_month.isBefore end_key
          yield do seem =>
            db = @ref_db start_month.format 'YYYY-MM'
            return unless db?
            {rows} = yield db.query 'grumpy-actor/tags',
              startkey: [
                type
                type_value
                start_key.format 'YYYY-MM-DD'
              ]
              endkey: [
                type
                type_value
                end_key.format 'YYYY-MM-DD'
              ]
              group: true
            yield db.close()
            db = null

            for row in rows
              do ({key:[_0,_1,date,tag],value} = row) ->
                result[date] ?= {}
                result[date][tag] = value

          start_month.add 1, 'months'
          null

        post result

    PouchDB = require 'shimaore-pouchdb'

    location = (name) ->
      [window.location.protocol,'//',window.location.host,'/',name].join ''

    browser = (month) ->
      name = ['reference',month].join '-'
      new PouchDB location name

    module.exports = {WanderingCountryReference,browser}
