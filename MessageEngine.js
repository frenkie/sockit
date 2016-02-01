var debug = require('debug')('message-engine');

/**
 * @param {Socket.io} socket
 * @param {Object} messages Hash of message name/object pairs to handle
 */
var MessageEngine = function ( socket, messages ) {

    this.socket = socket;
    this.messages = messages;

    this.bindSocketHandlers();
};

MessageEngine.prototype = {

    bindSocketHandlers: function () {

        var engine = this;

        this.socket.on('connection', function ( client ) {

            for ( message in engine.messages ) {

                (function ( messageName ) {
                    client.on( messageName, function ( data ) {
                        engine.handleMessage( client, messageName, data );
                    } );
                })( message );
            }
        });
    },

    /**
     * @param {Array} args
     * @param {String} functionDefinition Should handle the function's arguments
     *
     * @return {Object} return what the message's real argument(s) should be
     */
    handleArguments: function ( args, functionDefinition ) {

        var handleFunction = eval( functionDefinition );

        return handleFunction.apply( handleFunction, args );
    },

    handleMessage: function ( client, name, args ) {

        var messageObject = this.messages[ name ];

        args = args || [];

        if ( messageObject ) {

            if ( messageObject.handleArguments ) {
                debug('handling arguments of '+ name, args );
                args = this.handleArguments( args, messageObject.handleArguments );
            }

            debug('sending '+ name, ', arguments: ', args );
            this.socket.emit( name, args );
        }
    }
};

module.exports = MessageEngine;