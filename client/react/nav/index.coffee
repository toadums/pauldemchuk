utils = require 'utils'

module.exports = React.createClass
  displayName: "Nav"

  render: ->
    React.DOM.nav {id: "menu"},
      React.DOM.ul null,
        React.DOM.li {className: "home #{'active' if @props.mode is 'home'}"},
          React.DOM.a {href: "/home"}, "paul.demchuk"

        for mode in utils.modes
          if mode is 'home' then continue
          React.DOM.li {className: "#{'active' if @props.mode is mode}", key: mode},
            React.DOM.a {href: "/#{mode}"}, mode