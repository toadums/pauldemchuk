Nav = require './nav'
Content = require './content'
utils = require 'utils'

module.exports = React.createClass
  displayName: "Main"

  getInitialState: ->
    mode: 'home'

  componentDidMount: ->
    app = @props.app
    for mode in utils.modes
      do (mode) =>
        app.get "/#{mode}", (req) =>
          @setState mode: mode

  renderContent: ->
    if _.contains utils.modes, @state.mode
      Content mode: @state.mode
    else
      React.DOM.div null, "ass"

  render: ->
    React.DOM.div {id: 'container'},
      @renderContent()
      Nav mode: @state.mode
