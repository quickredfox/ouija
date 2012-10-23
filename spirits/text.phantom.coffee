
exports.invoke = ( page, next )->
  data = page.evaluate ->
    return document.body.parentElement.innerText
  next( null, data )
