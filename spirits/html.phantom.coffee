
exports.invoke = ( page, next )->
  data = page.evaluate ->
    return document.body.parentElement.innerHTML
  console.log "SPIRITSDATA:<html>#{data}</html>"
  next()