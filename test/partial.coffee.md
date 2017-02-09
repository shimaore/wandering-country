    chai = require 'chai'
    chai.should()

    describe 'partial', ->
      partial = require '../partial'
      it 'should work with no arguments', ->
        correct = false
        g = -> correct = true
        f = partial g
        f()
        correct.should.be.true

      it 'should work with one arg', ->
        correct = false
        g = (a) -> correct = a is 42
        f = partial g
        f 42
        correct.should.be.true

      it 'should work with one arg', ->
        correct = false
        g = (a) -> correct = a is 42
        f = partial g, 42
        f()
        correct.should.be.true

      it 'should work with two args', ->
        correct = false
        g = (a,b) -> correct = a is 42 and b is 54
        f = partial g
        f 42, 54
        correct.should.be.true

      it 'should work with two args', ->
        correct = false
        g = (a,b) -> correct = a is 42 and b is 54
        f = partial g, 42
        f 54
        correct.should.be.true

      it 'should work with two args', ->
        correct = false
        g = (a,b) -> correct = a is 42 and b is 54
        f = partial g, 42, 54
        f()
        correct.should.be.true

      it 'should work with this', ->
        correct = false
        g = (a,b) -> correct = a is 42 and b is 54 and @me is 'me'
        f = partial g, 42
        f.call {me:'me'}, 54
        correct.should.be.true

      it 'should work with this', ->
        correct = false
        @me = 'me'
        g = (a,b) => correct = a is 42 and b is 54 and @me is 'me'
        f = partial g, 42
        f.call {}, 54
        correct.should.be.true
