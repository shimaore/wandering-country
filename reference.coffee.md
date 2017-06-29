    moment = require 'moment'
    seem = require 'seem'

### Extended CDRs (client-side)

    class WanderingCountryReference

      constructor: (@ref_db) ->

      _for: seem (start_date,end_date,cb) ->

        start_key = moment start_date, 'YYYY-MM-DD'
          .subtract 1, 'days'

        end_key = moment end_date, 'YYYY-MM-DD'
          .add 1, 'days'

        start_month = start_key.clone()
          .startOf 'month'

        while start_month.isBefore end_key
          yield do seem =>
            db = @ref_db start_month.format 'YYYY-MM'
            start_month.add 1, 'months'
            return unless db?

            yield cb db, start_key, end_key
            yield db.close()
            db = null

        null

Gather all documents linked to a set of references.

      references: seem (references,start_date,end_date) ->

        result = {}

        yield @_for start_date, end_date, seem (db) =>

          {rows} = yield db.query 'grumpy-actor/tags',
            keys: references
            group: no
            reduce: no
            include_docs: yes

          rows.forEach (row) ->
            (result[row.key] ?= []).push row.doc

        result

Query documents based on type/value, and return a set of references or the documents, grouped by date.

      query: seem (type,type_value,start_date,end_date,include_docs = false) ->

        result = {}

        yield @_for start_date, end_date, seem (db,start_key,end_key) =>

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
            group: not include_docs
            reduce: not include_docs
            include_docs: include_docs

          rows.forEach ({key:[t,tv,date,r],doc}) ->
            result[date] ?= []
            if include_docs
              result[date].push doc
            else
              result[date].push r

        result

    module.exports = {WanderingCountryReference}
