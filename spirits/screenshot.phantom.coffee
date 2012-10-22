
exports.invoke = ( page, next )->
  console.log "SPIRITSDATA:#{page.renderBase64()}"
  next()
