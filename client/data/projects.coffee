class Project
  constructor: (data) ->
    for key, value of data
      @[key] = value


rabbitwrath = new Project
  name: "Rabbit Wrath"
  type: "image"
  src: "rw.png"
  summary: "Game made for a class (Technology of the Future)"
  href: "/rabbitwrath"

module.exports = [
  rabbitwrath
]