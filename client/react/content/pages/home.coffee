module.exports = React.createClass
  displayName: "home"

  render: ->
    React.DOM.section {className: "page home"},
      React.DOM.h1 null, "About"
      React.DOM.p null, "My name is Paul Demchuk. I am a developer born and raised in Victoria, British Columbia.
        I graduated from the University Of Victoria in the Spring of 2014 with Honours in Computer Science with Distinction."

      React.DOM.h2 null, "Programming"
      React.DOM.p null, "I absolutely love web development. This passion is fueled by the simplicity and elegance of CoffeeScript, the power of Node.js,
        and the endless libraries that make my life easier (Brunch, Express, React)"

      React.DOM.h2 null, "Hobbies"


