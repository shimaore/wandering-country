    module.exports = partial = (fun,args...) ->
      (args2...) ->
        fun.apply this, args.concat args2
