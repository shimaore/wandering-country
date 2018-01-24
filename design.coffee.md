    app = 'wandering-country'
    app_version = '1.2'

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

            account = if doc.account? then normalize_account doc.account else null
            emit ['account',account], doc.device

            doc.lines?.forEach ({endpoint}) ->
              return unless endpoint?
              emit ['endpoint',endpoint], doc.device
              e = endpoint.match /^([^@]+)@(.+)$/
              if e?
                [name,domain] = [e[1],e[2]]
                emit ['domain',domain,name], doc.device

            return

        number_domains:
          map: p_fun extra, (doc) ->
            return unless doc.type? and doc.type is 'number_domain'
            return if doc.disabled

            account = if doc.account? then normalize_account doc.account else null
            emit ['account',account], doc.number_domain

            return

        endpoints:
          map: p_fun extra, (doc) ->
            return unless doc.type? and doc.type is 'endpoint'
            return if doc.disabled

            account = if doc.account? then normalize_account doc.account else null
            emit ['account',account], doc.endpoint

            if doc.sub_account?
              emit ['sub_account',account,doc.sub_account], doc.endpoint

Not all endpoints have domains; some only have an IP address.

            e = doc._id.match /^endpoint:([^@]+)@(.+)$/
            if e?
              [name,domain] = [e[1],e[2]]
              emit ['domain',domain,name], doc.endpoint

            if doc.number_domain?
              emit ['number_domain',doc.number_domain], doc.endpoint

            if doc.location?
              emit ['location',doc.location], doc.endpoint

            return

        local_numbers:
          map: p_fun extra, (doc) ->
            return unless doc.type? and doc.type is 'number'
            return unless m = doc._id.match /^number:([^@]+)@(.+)$/
            return if doc.disabled

            account = if doc.account? then normalize_account doc.account else null
            emit ['account',account], doc.number

            if doc.endpoint?
              emit ['endpoint',doc.endpoint], doc.number
              e = doc.endpoint.match /^([^@]+)@(.+)$/
              if e?
                [name,domain] = [e[1],e[2]]
                emit ['domain',domain,name], doc.number

            if doc.user_database?
              emit ['user_database',doc.user_database], doc.number

            [name,domain] = [m[1],m[2]]
            emit ['number_domain',domain,name], doc.number

            doc.groups?.forEach (group) ->
              emit ['group',domain,group], doc.number

            doc.allowed_groups?.forEach (group) ->
              emit ['allowed_group',domain,group], doc.number

            doc.queues?.forEach (queue) ->
              emit ['queue',domain,queue], doc.number

            doc.skills?.forEach (skill) ->
              emit ['skill',domain,skill], doc.number

            return

View for (admin) routing of global numbers.
The view lists all global numbers for a given account.
The view lists the global number(s) routing to a given local-number.

        global_numbers:
          map: p_fun extra, (doc) ->
            return unless doc.type? and doc.type is 'number'
            return unless m = doc._id.match /^number:([^@]+)$/
            return if doc.disabled

            account = if doc.account? then normalize_account doc.account else null
            emit ['account',account], doc.number

            if doc.local_number?
              emit ['local_number',doc.local_number], doc.number
              if n = doc.local_number.match /^([^@]+)@(.+)$/
                [name,domain] = [n[1],n[2]]
                emit ['number_domain',domain,name], doc.number

            return

    module.exports = {app,couchapp}
