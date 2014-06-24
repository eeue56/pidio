'''
Search Factory
--------------
Exposes search methods
'''

module.exports = () ->
  validate: (query) ->
    | query.length < 1 => 'Too short, bitch'
    | query.length > 50 => 'Too long, you muppet'
  query: (term) ->
    # do something with the api
    ...
