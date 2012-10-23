args    = require( 'system').args.slice( 1 )
page    = require('webpage').create()
spiritscripts = {
   pre:    require './spirits/pre.phantom.coffee'
   html:   require './spirits/html.phantom.coffee'
   text:   require './spirits/text.phantom.coffee'
   screen: require './spirits/screenshot.phantom.coffee'
}

url     = args.shift()
spirits = [ 'pre' ].concat args
  
fail = ( message )->
  if message then console.error message 
  page.close()
  phantom.exit( 1 )

done = ( log  )->
  if log then console.log log
  page.close()
  phantom.exit( 0 )

page.viewportSize = width: 480, height: 800 

# Fail on anything suspicious...
page.open url, ( status )->
  if status isnt 'success' then return fail "Unable to load url"
  invokeSpirits = ( index=0 )->
    spirit = spirits[index]
    if !spirit then return done()
    try
      script = spiritscripts[ spirit ]
      script.invoke page, ( error, data )->
        if error then return fail error 
        else if data then console.log( data )
        invokeSpirits index+1
    catch error then return fail error
  return setTimeout invokeSpirits, 200
  
