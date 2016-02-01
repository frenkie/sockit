var debug = require('debug')('message-engine');

/**
 * @param {Socket.io} socket
 * @param {Object} messages Hash of message name/object pairs to handle
 */
var MessageEngine = function ( socket, messages ) {

    this.socket = socket;
    this.messages = messages;

    this.prepareArgumentHandlers();
    this.bindSocketHandlers();
};

MessageEngine.prototype = {

    bindSocketHandlers: function () {

        var engine = this;

        this.socket.on('connection', function ( client ) {

            for ( message in engine.messages ) {
                if ( engine.messages.hasOwnProperty( message ) ) {
                    (function ( messageName ) {
                        client.on( messageName, function ( data ) {
                            engine.handleMessage( client, messageName, data );
                        } );
                    })( message );
                }
            }
        });
    },

    handleMessage: function ( client, name, args ) {

        var messageObject = this.messages[ name ];

        args = args || [];

        if ( messageObject ) {

            if ( messageObject.handleArguments && typeof messageObject.handleArguments === 'function' ) {
                debug('handling arguments of '+ name, args );
                args = messageObject.handleArguments.apply( messageObject.handleArguments, args );
            }

            debug('sending '+ name, args );
            this.socket.emit( name, args );
        }
    },

    /**
     * Evals the message's function definitions to real functions
     */
    prepareArgumentHandlers: function () {

        for ( message in this.messages ) {
            if ( this.messages.hasOwnProperty( message ) ) {

                var message = this.messages[ message ];
                if ( message.handleArguments ) {
                    message.handleArguments = eval( message.handleArguments );
                }
            }
        }
    }
};

module.exports = MessageEngine;