var debug = require('debug')('message-engine');

/**
 * @param {Socket.io} socket
 * @param {Object} messages Hash of message names and objects to handle
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

    handleMessage: function ( client, name, args ) {

        var messageObject = this.messages[ name ];

        args = args || [];

        if ( messageObject ) {

            if ( messageObject.handleArguments ) {
                debug('handling arguments of '+ name );
                args = messageObject.handleArguments( args );
            }

            debug('sending '+ name );
            this.socket.emit( name, args );
        }
    }
};

module.exports = MessageEngine;