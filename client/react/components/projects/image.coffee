module.exports = React.createClass
  displayName: "ImageProject"

  render: ->
    React.DOM.div {className: "image"},
      React.DOM.img {src: "images/#{@props.src}", alt: @props.name}