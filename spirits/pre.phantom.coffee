# internal usae only
exports.invoke = ( page, next )->
  page.evaluate ->
    unwanted = document.querySelectorAll 'script, style, link, iframe, embed, object'
    for node in unwanted
      parent = node.parentNode
    if parent then parent.removeChild node
  next()