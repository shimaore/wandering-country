// Generated by CoffeeScript 1.12.4
(function() {
  var partial,
    slice = [].slice;

  module.exports = partial = function() {
    var args, fun;
    fun = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    return function() {
      var args2;
      args2 = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return fun.apply(this, args.concat(args2));
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFydGlhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBhcnRpYWwuY29mZmVlLm1kIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBSTtBQUFBLE1BQUEsT0FBQTtJQUFBOztFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE9BQUEsR0FBVSxTQUFBO0FBQ3pCLFFBQUE7SUFEMEIsb0JBQUk7V0FDOUIsU0FBQTtBQUNFLFVBQUE7TUFERDthQUNDLEdBQUcsQ0FBQyxLQUFKLENBQVUsSUFBVixFQUFnQixJQUFJLENBQUMsTUFBTCxDQUFZLEtBQVosQ0FBaEI7SUFERjtFQUR5QjtBQUEzQiIsInNvdXJjZXNDb250ZW50IjpbIiAgICBtb2R1bGUuZXhwb3J0cyA9IHBhcnRpYWwgPSAoZnVuLGFyZ3MuLi4pIC0+XG4gICAgICAoYXJnczIuLi4pIC0+XG4gICAgICAgIGZ1bi5hcHBseSB0aGlzLCBhcmdzLmNvbmNhdCBhcmdzMlxuIl19
//# sourceURL=/srv/home/stephane/Artisan/Managed/Telecoms/wandering-country/partial.coffee.md