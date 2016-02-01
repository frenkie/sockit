# sockit
When you want clients to communicate with each other through messages
with optionally handled arguments, use sockit. It saves you the hassle of
copy pasting all that socket.io juice.

It even provides you with an admin page to quickly pass on every 
available message, with arguments.

## install & run
Copy `config.example.json` to `config.json` and adjust the messages
to your needs.

Run `npm start` and your set! Any socket.io client can now make
use of this easy configured server.

### admin
You automagically get an admin page to fake a client and tinker with
the arguments and their values, just visit [localhost:8080/admin](http://localhost:8080/admin)

## message configuration
Message configuration is done in `config.json` through a JSON object with the following
properties:

```javascript

{
    "messages": {
        
        // message-name will be the name you can listen for on the socket
        "message-name": {
            
            // optional array of arguments, will generate input fields on the admin page:
            "arguments" : [                
                {
                  "name": "argument1",
                  "type": "string"
                },
                {
                  "name": "argument2",
                  "type": "number"
                },
                {
                  "name": "argument3",
                  "type": "range",
                  "min": 0,
                  "max": 100,
                  "step": 1,
                  "default": 50
                },
                {
                  "name": "argument4",
                  "type": "select",
                  "options": ["one", "two", "three", "four"],
                  "default": "two"
                }
            ],
            
            // optional function to handle the above arguments serverside 
            // before broadcasting them. Function should return the
            // resulting data to send, which can be different from the input
            "handleArguments": "(function handle () { return Array.prototype.join.apply( arguments || [], [':'] ); })"            
        }
    }
}

```


## developing & debugging
You can also run a debug version of the server with debug output and
live reloading of the server when file contents change.

Just do `npm run debug` and tada!