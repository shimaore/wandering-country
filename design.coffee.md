    app = 'wandering-country'
    app_version = '1.1'

    {p_fun} = require 'coffeescript-helpers'

    couchapp = ({normalize_account}) ->
      extra = "var normalize_account = #{normalize_account};"

      _id: "_design/#{app}"
      version: app_version
      language: 'javascript'
      views:

DEPRECATED, use `local_numbers` or `global_numbers` with `["number_domain",key]`

        numbers_by_domain:
          map: p_fun (doc) ->
            return unless doc.type? and doc.type is 'number'
            return unless m = doc._id.match /^number:[^@]+@(.+)$/
            emit m[1]
            return
          reduce: '_count'

DEPRECATED, use `endpoints` with `["domain",key]`

        endpoints_by_domain:
          map: p_fun (doc) ->
            return unless doc.type? and doc.type is 'endpoint'
            return unless m = doc._id.match /^endpoint:[^@]+@(.+)$/
            emit m[1]
            return

Current views
-------------

        devices:
          map: p_fun extra, (doc) ->
            return unless doc.type? and doc.type is 'device'
            return if doc.disabled

            if doc.account?
              account = normalize_account doc.account
              emit ['account',account], doc.device

            return

        number_domains:
          map: p_fun extra, (doc) ->
            return unless doc.type? and doc.type is 'number_domain'
            return if doc.disabled

            if doc.account?
              account = normalize_account doc.account
              emit ['account',account], doc.number_domain

            return

        endpoints:
          map: p_fun extra, (doc) ->
            return unless doc.type? and doc.type is 'endpoint'
            return if doc.disabled

            if doc.account?
              account = normalize_account doc.account
              emit ['account',account], doc.endpoint

            m = doc._id.match /^endpoint:[^@]+@(.+)$/
            if m?[1]?
              emit ['domain',m[1]], doc.endpoint

            if doc.number_domain?
              emit ['number_domain',doc.number_domain], doc.endpoint

            return

        local_numbers:
          map: p_fun extra, (doc) ->
            return unless doc.type? and doc.type is 'number'
            return unless m = doc._id.match /^number:[^@]+@(.+)$/
            return if doc.disabled

            if doc.account?
              account = normalize_account doc.account
              emit ['account',account], doc.number

            if m[1]?
              emit ['number_domain',m[1]], doc.number

            if doc.endpoint?
              emit ['endpoint',doc.endpoint], doc.number

            return

View for (admin) routing of global numbers.
The view lists all global numbers for a given account.
The view lists the global number(s) routing to a given local-number.

        global_numbers:
          map: p_fun extra, (doc) ->
            return unless doc.type? and doc.type is 'number'
            return if m = doc._id.match /^number:[^@]+@(.+)$/
            return if doc.disabled

            if doc.account?
              account = normalize_account doc.account
              emit ['account',account]

            if doc.local_number?
              emit ['local_number',doc.local_number]

            return

    module.exports = {app,couchapp}
