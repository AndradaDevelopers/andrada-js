/*
* Basic websocket wrapper
* Andrada.Core.Networking.NetState
*/

gamecore.Base.extend("Andrada.Core.Networking.NetState",
	{
		CONNECTING: 0,
		OPEN: 0,
		CLOSING: 2,
		CLOSED: 3,
		HEARTBEAT_DELAY: 20000,	
	},
	{
		websocket: null,
		isClosed: true,
		readyState: 3,
		hearbeat: null,
		delay: 80,
		delayMax: 10000,

		init: function(url){
			this.isClosed = false;
			this.readyState = Andrada.Core.Networking.NetState.CONNECTING;
			this.websocket = new (this._getUnderlyingSocket())(url);

			if (!this.websocket) {
				this.ondisconnect();
				return false;
			}
			this.websocket.onopen = this._transportonopen;
			this.websocket.onclose = this._transportonclose;
			this.websocket.onmessage = this._transportonmessage;
			this.websocket.onerror = this._transportonclose;
			this.websocket.wrapper = this;
		},
		_getUnderlyingSocket: function() {
			if (window.WebSocket) {
				return window.WebSocket;
			}
			return false;
		},
		send: function(packet) {
			if (this.websocket) {
				if (!packet.isA('Packet')) {
					throw new Error(Andrada.Core.Networking.Exceptions.NOT_A_PACKET_EXCEPTION);
				}
				return this.websocket.send(packet);
			}
			return false;
		},
		close: function() {
			if (this.websocket) {
				this.readyState = Andrada.Core.Networking.NetState.CLOSING;
				this.websocket.close();
			}
		},

		_transportonopen: function() {
			//Initialize heartbeat to keep socket alive
			this.wrapper.heartbeat = setInterval(function(){this.wrapper.onheartbeat();}, Andrada.Core.Networking.NetState.HEARTBEAT_DELAY);
			if (this.wrapper.readyState != Andrada.Core.Networking.NetState.OPEN) {
				this.wrapper.readyState = Andrada.Core.Networking.NetState.OPEN;
				this.wrapper.onopen();
			}
		},
		_transportonclose: function() {
			clearInterval(this.wrapper.heartbeat);
			this.wrapper.readyState = Andrada.Core.Networking.NetState.CLOSED;
			this.wrapper.onclose();
		},
		_transportonmessage: function(packet) {
			this.wrapper.onmessage(packet);
		},

		//Default signatures
		onopen: function(){},
		onclose: function(){},
		ondisconnect: function(){},
		onmessage: function(){},
		onheartbeat: function(){}
	}

);