Main = require 'react/main'

# The application object.
module.exports = class Application
  @init: ->
    app = Davis()

    app.configure () ->
      this.generateRequestOnPageLoad = true

    React.renderComponent Main(app: app), $('body').get(0)
