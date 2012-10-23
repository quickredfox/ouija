
exports.invoke = ( page, next )->
  next null, page.renderBase64()
