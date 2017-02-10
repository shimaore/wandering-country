    debug = (require 'debug') 'wandering-country'

    seem = require 'seem'
    sleep = require './sleep'

Generic load/create/update
--------------------------

These define the base semantics for the entire suite.

### load

    load = seem (db,id) ->
      debug 'load', {id}
      doc = yield db
        .get id
        .catch -> _id: id

### create

    create = seem (db,doc) ->
      debug 'create', doc
      {rev} = yield db
        .put doc
        .catch (error) ->
          debug "create: #{error} #{error.stack}"
          Promise.reject error

      debug 'create OK', {rev}
      doc._rev = rev
      doc

### update

    update = seem (db,data,retry = 1) ->
      debug 'update', data
      doc = yield db
        .get data._id
        .catch -> data

      debug 'update: get', doc
      for k,v of data when k[0] isnt '_'
        doc[k] = v

      doc._deleted = data._deleted if data._deleted

      debug 'update: put', doc
      {rev} = yield db
        .put doc
        .catch seem (error) ->
          debug "#{error} #{error.stack}"
          if retry > 0
            yield sleep 500
            yield update db, data, retry-1
          else
            Promise.reject error

      doc._rev = rev
      doc

Base class
----------

Parameters: `db` is a PouchDB instance of a provisioning database.

    class WanderingCountryBase
      constructor: (@db) ->

      load: (id) ->
        load @db, id

      update: (data) ->
        update @db, data

      create: (data) ->
        create @db, data

CCNQ operations
---------------

These rely either on the couchapp, or are standard database access.

    class WanderingCountryWithCCNQ extends WanderingCountryBase

Coffee-script representation of a module which exports a function that rewrites an account into a canonical form.

      normalize_account: '''
        function(account) { return account }
      '''

### Load-via-query

      generic_load = (name) ->
        seem (key) ->
          debug "generic_load #{name}", key
          {rows} = yield @db
            .query "#{app}/#{name}",
              reduce: false
              include_docs: true
              key: key
            .catch (error) ->
              debug "generic_load #{name} Failed: #{error} #{error.stack}"
              Promise.reject error
          debug "generic_load #{name} OK", key, rows
          docs = rows.map (row) -> row.doc

      devices_for: generic_load 'devices'
      endpoints_for: generic_load 'endpoints'
      global_numbers_for: generic_load 'global_numbers'
      local_numbers_for: generic_load 'local_numbers'
      number_domains_for: generic_load 'number_domains'

      load_devices_for_account: (account) -> @devices_for ['account',account]
      load_endpoints_for_account: (account) -> @endpoints_for ['account',account]
      load_endpoints_for_domain: (domain) -> @endpoints_for ['domain',domain]
      load_global_numbers_for_account: (account) -> @global_numbers_for ['account',account]
      load_global_numbers_for_local_number: (local_number) -> @global_numbers_for ['local_number',local_number]
      load_local_numbers_for_account: (account) -> @local_numbers_for ['account',account]
      load_local_numbers_for_number_domain: (number_domain) -> @local_numbers_for ['number_domain',number_domain]
      load_number_domains_for_account: (account) -> @number_domains_for ['account',account]

### Create

      create_domain: (doc) =>
        doc.type = 'domain'
        @create doc

      create_device: (doc) =>
        doc.type = 'device'
        @create doc

### Build list of `list:` items for a given number

      load_list_entries: seem (number) ->
        debug 'load_list_entries', number
        {rows} = yield @db
          .allDocs
            startkey: "list:#{number}@"
            endkey: "list:#{number}@\uffff"
            include_docs:true
          .catch (error) ->
            debug "load_list_entries: #{error} #{error.stack}"
            Promise.reject error
        docs = rows.map (row) -> row.doc

### Add a new `list:` item

      add_list_entry: seem (doc) ->
        debug 'add_list_entry', doc
        unless doc.blacklist is true or doc.whitelist is true
          return null
        doc._id = "list:#{doc.number}@#{doc.calling_number}"
        doc.type = 'list'
        debug 'add_list_entry', doc
        {rev} = yield @db
          .put doc
          .catch (error) ->
            debug "add_list_entry #{error} #{error.stack}"
            Promise.reject error
        rev

### Load a single number domain

      load_domain: seem (name) ->

Load the number-domain

        debug 'load_domain', name
        number_domain = yield @db
          .get "number_domain:#{name}"
          .catch -> null

        unless number_domain?
          debug 'no number_domain', name
          return

        unless number_domain.dialplan is 'centrex'
          debug 'number_domain is not centrex', name, number_domain
          return

Load the associated DNS domain

        domain = yield @db
          .get "domain:#{name}"
          .catch -> null

        unless domain?
          debug 'no domain', name
          return

Load the numbers in the domain (including the disabled ones)

        {rows} = yield @db
          .query "#{app}/numbers_by_domain",
            reduce: false
            include_docs: true
            key: name
          .catch ->
            rows:null

        unless rows?
          debug 'no numbers_by_domain', name
          return

        numbers = rows.map (row) -> row.doc

Load the endpoints in the domain (including the disabled ones)

        {rows} = yield @db
          .query "#{app}/endpoints_by_domain",
            reduce: false
            include_docs: true
            key: name
          .catch ->
            rows:null

        unless rows?
          debug 'no endpoints_by_domain', name
          return

        endpoints = rows.map (row) -> row.doc

Send the result

        result = {domain,number_domain,numbers,endpoints}
        debug 'load_domain', result
        result

### Build number domains list

      load_number_domains: seem ->
        debug 'load_number_domains'

        {rows} = yield @db
          .allDocs
            startkey: 'number_domain:'
            endkey: 'number_domain:\uffff'
          .catch (error) ->
            debug "load_number_domains: #{error.stack ? error}"
            Promise.reject error

        debug 'load_number_domains', rows

        rows.map (row) ->
          m = row.id.match /^number_domain:(.+)$/
          name: m[1], label: m[1]

### Install the Couch App on the server

      push_couchapp: ->
        doc = couchapp {@normalize_account}
        debug 'couchapp', doc
        @update doc
        .catch -> false

### Build generic load/update/remove for various types

      prefix_handlers = (prefix) ->

        "load_#{prefix}": (id) ->
          @load "#{prefix}:#{id}", "load_#{prefix}"

        "update_#{prefix}": (data) ->
          @update data, "update_#{prefix}"

        "remove_#{prefix}": (data) ->
          data._deleted = true
          @update data, "remove_#{prefix}"

      register = (handlers) =>
        for own name, handler of handlers
          this::[name] = handler

      register prefix_handlers 'list'
      register prefix_handlers 'number'
      register prefix_handlers 'endpoint'
      register prefix_handlers 'number_domain'
      register prefix_handlers 'device'

### Save audio/music

      update_prov_audio_blob: seem (id, file, base, opts) ->
        debug 'update_prov_audio_blob', id, base, opts
        orig = base
        switch file.type
          when 'audio/mpeg'
            base += '.mp3'
          when 'audio/mp3'
            base += '.mp3'
          when 'audio/wav'
            base += '.wav'
          when 'audio/x-wav'
            base += '.wav'
          else
            return Promise.reject new Error "update_prov_audio_blob invalid_type #{file.type}"

        doc = yield @db.get id
        a = {rev} = yield @db
          .putAttachment doc._id, base, doc._rev, file, file.type
          .catch (error) ->
            debug "update_prov_audio_blob #{error} #{error.stack}"
            Promise.reject error
        orig

### DNS Records

      create_dns_for_domain: seem (domain) ->
        debug 'create_dns_for_domain', domain
        cfg = yield @dns_for_domain domain
        debug 'create_dns_for_domain, cfg', cfg

        unless cfg.soa? and cfg.admin? and cfg.records?
          return Promise.reject new Error 'invalid configuration'

        doc =
          _id: "domain:#{domain}"
          domain: domain
          type: 'domain'
          soa: cfg.soa
          admin: cfg.admin
          records: cfg.records

        yield @update doc

Extend with User-Databases
--------------------------

Parameters: `user_db` converts a user database name into a PouchDB object.

    class WanderingCountryWithUserDatabase extends WanderingCountryWithCCNQ

      constructor: (db,@user_db) ->
        super db

### Load/update a user database's voicemail-settings

      load_voicemail_settings: seem (name) ->
        debug 'load_voicemail_settings', {name}
        udb = @user_db name
        doc = yield load udb, 'voicemail_settings'
        udb.close()
        doc

      update_voicemail_settings: seem (name,data) ->
        debug 'update_voicemail_settings', {name,data}
        udb = @user_db name
        doc = yield update udb, data
        udb.close()
        doc

### Load a user's messages

      load_messages = (cat) ->
        "load_#{cat}_messages": seem (name) ->
          udb = @user_db name
          {rows} = yield udb
            .query "voicemail/#{cat}_messages",
              include_docs: true
            .catch -> rows:null
          result = rows?.map (row) -> row.doc
          udb.close()
          result

      register = (handlers) =>
        for own name, handler of handlers
          this::[name] = handler

      register load_messages 'new'
      register load_messages 'saved'

### Save music

      update_audio_blob: seem (name, file, base) ->
        debug 'update_audio_blob', name, file, base
        orig = base
        switch file.type
          when 'audio/mpeg'
            base += '.mp3'
          when 'audio/mp3'
            base += '.mp3'
          when 'audio/wav'
            base += '.wav'
          else
            return Promise.reject new Error "#{name} invalid_type #{file.type}"

        udb = @user_db name
        doc = yield udb.get 'voicemail_settings'
        {rev} = yield udb
          .putAttachment doc._id, base, doc._rev, file, file.type
          .catch -> rev:null

        udb.close()
        rev

Wrap with events
----------------

    class WanderingCountry extends WanderingCountryWithUserDatabase

### Extend with monitoring

      start_monitoring: (this_db) ->
        debug 'start_monitoring', this_db.name
        changes = this_db.changes
          live: true
          since: 'now'
          include_docs: true

        changes.on 'change', (change) =>
          debug 'monitor: change', change
          @ev.trigger 'change', change.doc

        changes.on 'error', (error) =>
          debug "monitor: error", this_db.name, error
          setTimeout (=> @start_monitoring this_db), 10*1000
          return

        changes

      monitor_voicemail: (name) ->
        if @monitor.voicemail?
          @monitor.voicemail.cancel()
          @monitor.voicemail = null
          @monitor.voicemail_db.close()
          @monitor.voicemail_db = null

        @monitor.voicemail_db = @user_db name
        @monitor.voicemail = @start_monitoring monitor.voicemail_db

        return

      constructor: (db,user_db,@ev) ->
        super db, user_db

        @monitor = {}

        @monitor.provisioning = @start_monitoring db

        @ev.one 'shutdown', =>
          @monitor.provisioning.cancel()
          @monitor.provisioning = null
          @db.close()
          @db = null

          if @monitor.voicemail?
            @monitor.voicemail.cancel()
            @monitor.voicemail = null
            @monitor.voicemail_db.close()
            @monitor.voicemail_db = null

### Events

      trigger: (event,data) ->
        @ev.trigger event, data

      on: (event,handler) ->
        @ev.on event, handler

      one: (event,handler) ->
        @ev.one event, handler

      _wrap_on: (event,fun) ->
        handler = (args...) =>
          on_resolve = (data) =>
            debug "#{event}:done", data
            @trigger "#{event}:done", data
            data
          on_reject = (error) =>
            debug "#{event}:error"
            @trigger "#{event}:error", error
            Promise.reject error
          try
            fun
              .apply this, args
              .then on_resolve, on_reject
          catch error
            @trigger "#{event}:error", error
            Promise.reject error
        @on event, handler
        handler

      _wrap_one: (event,fun) ->
        handler = (args...) =>
          debug "event"
          on_resolve = (data) =>
            debug "#{event}:done", data
            @trigger "#{event}:done", data
            data
          on_reject = (error) =>
            debug "#{event}:error"
            @trigger "#{event}:error", error
            Promise.reject error
          try
            fun
              .apply this, args
              .then on_resolve, on_reject
          catch error
            @trigger "#{event}:error", error
            Promise.reject error
        @one event, handler
        handler

      install_handlers: ->
        events = [
          'load_devices_for_account'
          'load_endpoints_for_account'
          'load_endpoints_for_domain'
          'load_global_numbers_for_account'
          'load_global_numbers_for_local_number'
          'load_local_numbers_for_account'
          'load_local_numbers_for_number_domain'
          'load_number_domains_for_account'
          'create_domain'
          'create_device'
          'load_list_entries'
          'add_list_entry'
          'load_domain'
          'load_number_domains'
          'load_voicemail_settings'
          'update_voicemail_settings'
          'load_new_messages'
          'load_saved_messages'
          'update_audio_blob'
          'update_prov_audio_blob'
          'create_dns_for_domain'
          'load_list'
          'update_list'
          'remove_list'
          'load_number'
          'update_number'
          'remove_number'
          'load_endpoint'
          'update_endpoint'
          'remove_endpoint'
          'load_number_domain'
          'update_number_domain'
          'remove_number_domain'
          'load_device'
          'update_device'
          'remove_device'
          'monitor_voicemail'
        ]

        for event in events
          do (event) =>
            event = event.replace /-/g, '_'
            @_wrap_on event, this[event]

        events = [
          'push_couchapp'
        ]

        for event in events
          do (event) =>
            event = event.replace /-/g, '_'
            @_wrap_one event, this[event]

    app = 'wandering-country'

    module.exports = {
      WanderingCountryWithUserDatabase
      WanderingCountryWithCCNQ
      WanderingCountry
    }

    {p_fun} = require 'coffeescript-helpers'

    couchapp = ({normalize_account}) ->
      extra = "var normalize_account = #{normalize_account};"

      _id: "_design/#{app}"
      language: 'javascript'
      views:
        numbers_by_domain:
          map: p_fun (doc) ->
            return unless doc.type? and doc.type is 'number'
            return unless m = doc._id.match /^number:[^@]+@(.+)$/
            emit m[1]
          reduce: '_count'

        endpoints_by_domain:
          map: p_fun (doc) ->
            return unless doc.type? and doc.type is 'endpoint'
            return unless m = doc._id.match /^endpoint:[^@]+@(.+)$/
            emit m[1]

        devices:
          map: p_fun extra, (doc) ->
            return unless doc.type? and doc.type is 'device'
            return if doc.disabled

            if doc.account?
              account = normalize_account doc.account
              emit ['account',account]

        number_domains:
          map: p_fun extra, (doc) ->
            return unless doc.type? and doc.type is 'number_domain'
            return if doc.disabled

            if doc.account?
              account = normalize_account doc.account
              emit ['account',account]

        endpoints:
          map: p_fun extra, (doc) ->
            return unless doc.type? and doc.type is 'endpoint'
            return if doc.disabled

            if doc.account?
              account = normalize_account doc.account
              emit ['account',account]

            m = doc._id.match /^endpoint:[^@]+@(.+)$/
            if m?[1]?
              emit ['domain',m[1]]

        local_numbers:
          map: p_fun extra, (doc) ->
            return unless doc.type? and doc.type is 'number'
            return unless m = doc._id.match /^number:[^@]+@(.+)$/
            return if doc.disabled

            if doc.account?
              account = normalize_account doc.account
              emit ['account',account]

            if m[1]?
              emit ['number_domain',m[1]]

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
