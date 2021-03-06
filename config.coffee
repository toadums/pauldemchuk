exports.config =
  paths:
    watched: ["client", "vendor"]

  files:
    javascripts:
      defaultExtension: "coffee"
      joinTo:
        'application.js': /^(client)/
        'vendor.js': /^(bower_components|vendor)/

    stylesheets:
      defaultExtension: 'sass'
      joinTo:
        'app.css': /^client\/styles\/app.sass/
        'vendor.css': /^(bower_components|vendor)/

  # Activate the brunch plugins
  plugins:
    sass:
      debug: 'comments'

  modules:
    nameCleaner: (path) ->
      path
        # Strip the client/ prefix from module names
        .replace(/^client\//, '')