Projects = require '/react/components/projects'
ProjectsData = require '/data/projects'

module.exports = React.createClass
  displayName: "projects"

  renderProjects: ->
    React.DOM.ul {className: "projects"},
      for project, i in ProjectsData
        React.DOM.li {className: "project", key: i},
          React.DOM.a {href: "#{window.location.origin}#{project.href}", target: '_blank'},
            if project.type is 'image'
              Projects.image src: project.src, alt: project.name

            React.DOM.div className: "info",
              React.DOM.p {className: "name"}, project.name
              React.DOM.p {className: "sub"}, project.summary

  render: ->
    React.DOM.section {className: "page projects"},
      React.DOM.h1 null, "Projects"
      @renderProjects()



