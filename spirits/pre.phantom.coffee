# internal usae only
exports.invoke = ( page, next )->
  page.evaluate ->
    unwanted = document.querySelectorAll 'script, style, link, iframe, embed, object'
    for node in unwanted
      parent = node.parentNode
      if parent then parent.removeChild node
    nostyl = document.querySelectorAll '[style]'
    for node in nostyl
      node.removeAttribute 'style' 
    nleft = document.querySelectorAll '*'    
  setTimeout ()->  
    next(null, null)
  , 10