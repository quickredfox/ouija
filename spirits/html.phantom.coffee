
exports.invoke = ( page, next )->
  data = page.evaluate ->
    return document.body.parentElement.innerHTML
  next( null, "<html>#{data}</html>")