module.exports = React.createClass
  displayName: 'Content'

  renderPage: ->
    page = require "./pages/#{@props.mode}"

    page()

  render: ->
    React.DOM.div {id: 'content'},
      @renderPage()
