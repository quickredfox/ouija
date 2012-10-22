
exports.invoke = ( page, next )->
  data = page.evaluate ->
    return document.body.parentElement.innerText
  console.log "SPIRITSDATA:#{data}"
  next()
