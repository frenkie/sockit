/**
 * @param socket
 * @param container
 * @param elementTemplate
 * @constructor
 */
var MessageForm = function ( socket, container, elementTemplate ) {

    this._socket = socket;
    this._container = container;
    this._elementTemplate = elementTemplate;
};

MessageForm.prototype = {

    _bindSendHandlers : function () {

        var socket = this._socket;

        Array.prototype.forEach.call( this._container.querySelectorAll('button'), function ( button ) {
            button.addEventListener('click', function () {

                if ( /has-arguments/.test( button.className ) ) {
                    
                    
                } else {
                    socket.emit( button.id );
                }

            });
        });
    },

    _createFormElement : function ( message, messageDetails ) {

        var parent = document.createElement('div');
        var viewModel = {
            name: message
        };

        if ( messageDetails.arguments ) {

        }

        parent.innerHTML = this._elementTemplate( viewModel );

        for ( var i = 0, il = parent.childNodes.length; i < il; i++ ) {

            this._container.appendChild( parent.childNodes[ i ].cloneNode(true) );
        }
    },

    parse: function ( messages ) {

        for ( var message in messages ) {
            this._createFormElement( message, messages[ message ] );
        }

        this._bindSendHandlers();
    }
};