var debug = require('debug')('message-engine');

/**
 * @param {Socket.io} socket
 * @param {Object} messages array of message objects to handle
 */
var MessageEngine = function ( socket, messages ) {

    this.socket = socket;
    this.messages = messages;

    this.createMessageHandlers();
};

MessageEngine.prototype = {

    createMessageHandler: function ( messageName ) {

        this.socket.on( messageName, function () {

            this.socket.emit.apply( this.socket, messageName, arguments );

        }.bind( this ) );
    },

    createMessageHandlers: function () {

        this.messages.forEach( function ( message ) {

            if ( typeof message.handleArguments == 'function' ) {

            } else {

                this.createMessageHandler( message.name );
            }

        }.bind( this ) );
    }
};

module.exports = MessageEngine;