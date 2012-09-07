







/*
* Basic websocket wrapper
* Andrada.Core.Networking.Socket
*/

gamecore.Base.extend("Andrada.Core.Networking.Socket",
	{
		
	},
	{
		CONNECTING: 0,
		OPEN: 0,
		CLOSING: 2,
		CLOSED: 3,
		HEARTBEAT_DELAY: 20000,
		websocket: null,
		isClosed: true,
		readyState: 3,
		hearbeat: null,
		delay: 80,
		delayMax: 10000,

		init: function(url){
			isClosed = false;
			readyState = CONNECTING;
			websocket = _getUnderlyingSocket();
			if (!websocket) {
				this.ondisconnect();
				return false;
			}
			websocket.onopen = _transportonopen;
			websocket.onclose = _transportonclose;
			websocket.onmessage = _transportonmessage;
			websocket.onerror = _transportonclose;
		},
		_getUnderlyingSocket: function() {
			if (window.WebSocket) {
				return window.WebSocket;
			}
			return false;
		},
		send: function(data) {
			if (websocket) {
				if (!packet.isA('Packet')) {
					throw new Error(Andrada.Core.Networking.Exceptions.NOT_A_PACKET_EXCEPTION);
				}
				return websocket.send(data);
			}
			return false;
		},
		close: function() {
			if (websocket) {
				readyState = CLOSING;
				websocket.close();
			}
		},

		_transportonopen: function() {
			//Initialize heartbeat to keep socket alive
			this.heartbeat = setInterval(function(){this.onheartbeat();}, HEARTBEAT_DELAY);
			if (readyState != OPEN) {
				readyState = OPEN;
				this.onopen();
			}
		},
		_transportonclose: function() {
			clearInterval(this.heartbeat);
			readyState = CLOSED;
			this.onclose();
		},
		_transportonmessage: function(packet) {
			this.onmessage(packet);
		},

		//Default signatures
		onopen: function(){},
		onclose: function(){},
		ondisconnect: function(){},
		onmessage: function(){},
		onheartbeat: function(){}
	}

);
gamecore.Base.extend("Andrada.Core.Networking.Packet",
	{},
	{
		
	}

);



