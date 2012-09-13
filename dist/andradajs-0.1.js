
Kinetic.Sprite.extend("Andrada.Core.Graphics.Tile" ,
{

},
{
	
});
Kinetic.Group.extend("Andrada.Core.Graphics.Zone" ,
{

},
{
	
});
Kinetic.Sprite.extend("Andrada.Core.Graphics.Particle" ,
{

},
{
	
});
gamecore.Base.extend("Andrada.Core.Graphics.ParticleEmmiter" ,
{

},
{
	
});
Kinetic.Sprite.extend("Andrada.Core.Graphics.Item" ,
{

},
{
	
});
Kinetic.Sprite.extend("Andrada.Core.Graphics.Mobile" ,
{

},
{
	
});

gamecore.Base.extend("Andrada.Core.Networking.Packet",
	{

	},
	{
		
	}
);
gamecore.Base.extend("Andrada.Core.Networking.PacketHandler", 
	{
		register: function(packetId, callback) {
			
		}
	},
	{
		init: function() {

		}
	}
);

Andrada.Core.Networking.Exceptions = 
{
	NOT_A_PACKET_EXCEPTION : 'Andrada: [Security Exception] Attempted to send something else than a packet',
}
gamecore.Base.extend("Andrada.Core.Networking.PacketReader", 
	{

	},
	{
		init: function() {

		}
	}
);

gamecore.Base.extend("Andrada.Core.Networking.PacketWriter", 
	{

	},
	{
		init: function() {

		}
	}
);

gamecore.Base.extend("Andrada.Core.Networking.MessagePump", 
	{

	},
	{
		init: function() {

		}
	}
);

gamecore.Base.extend("Andrada.Core.Networking.SendQueue", 
	{

	},
	{
		init: function() {

		}
	}
);

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
			this.websocket.onopen = this.callback("_transportonopen");
			this.websocket.onclose = this.callback("_transportonclose");
			this.websocket.onmessage = this.callback("_transportonmessage");
			this.websocket.onerror = this.callback("_transportonclose");
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
			this.heartbeat = setInterval(function(){this.onheartbeat();}, Andrada.Core.Networking.NetState.HEARTBEAT_DELAY);
			if (this.readyState != Andrada.Core.Networking.NetState.OPEN) {
				this.readyState = Andrada.Core.Networking.NetState.OPEN;
				this.onopen();
			}
		},
		_transportonclose: function() {
			clearInterval(this.heartbeat);
			this.readyState = Andrada.Core.Networking.NetState.CLOSED;
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
gamecore.Base.extend("Andrada.Core.Asset", 
	{

	},
	{

	}
);

gamecore.Base.extend("Andrada.Core.AssetBundle", 
	{

	},
	{
		init: function (params) {
	        this.assets = [];
	        this.events = new pulse.EventManager;
	        this._private = {};
	        this._private.numberLoaded = 0;
	        this.percentLoaded = 0
	    },
	    addAsset: function (asset) {
	        if (asset.isA("Andrada.Core.Asset")) {
	            var _self = this;
	            asset.events.bind("complete", function (evt) {
	                _self._private.numberLoaded++;
	                _self.updatePercent();
	                _self.events.raiseEvent("assetLoaded", {
	                    asset: asset.name
	                })
	            });
	            this.assets.push(asset)
	        }
	    },
	    removeAsset: function (asset) {
	        var assetName = asset;
	        if (asset.isA("Andrada.Core.Asset")) {
	            assetName = asset.name
	        }
	        for (var a in this.assets) {
	            if (this.assets[a].name === assetName) {
	                this.assets.splice(a, 1)
	            }
	        }
	        this.updatePercent()
	    },
	    getAsset: function (name) {
	        for (var a = 0; a < this.assets.length; a++) {
	            if (this.assets[a].name === name) {
	                return this.assets[a]
	            }
	        }
	        return null
	    },
	    load: function () {
	        for (var a = 0; a < this.assets.length; a++) {
	            this.assets[a].load()
	        }
	    },
	    updatePercent: function () {
	        if (this.assets.length === 0) {
	            this.percentLoaded = 100
	        } else {
	            this.percentLoaded = this._private.numberLoaded / this.assets.length * 100;
	            this.percentLoaded = parseFloat(this.percentLoaded.toFixed(2))
	        }
	        this.events.raiseEvent("progressChanged", {});
	        if (this.percentLoaded === 100) {
	            this.events.raiseEvent("complete", {})
	        }
	    }		
	}
);

Andrada.Core.Asset.extend("Andrada.Core.Sound", 
	{

	},
	{
		init: function() {

		}
	}
);

gamecore.Base.extend("Andrada.Core.AssetManager", 
	{

	},
	{
		init: function() {

		}
	}
);

Andrada.Core.AssetManager.extend("Andrada.Core.SoundManager", 
	{

	},
	{
		init: function() {

		}
	}
);

gamecore.Base.extend("Andrada.Core.InputManager", 
	{

	},
	{
		init: function() {

		}
	}
);

Andrada.Core.Graphics.Item.extend("Andrada.Game.Container", 
	{

	},
	{

	}
);
Andrada.Core.Graphics.Mobile.extend("Andrada.Game.Creature", 
	{

	},
	{

	}
);
Andrada.Game.Creature.extend("Andrada.Game.Monster", 
	{

	},
	{

	}
);
Andrada.Core.Graphics.Mobile.extend("Andrada.Game.Player", 
	{

	},
	{

	}
);
Andrada.Core.Graphics.Mobile.extend("Andrada.Game.NPC", 
	{

	},
	{

	}
);
Kinetic.Stage.extend("Andrada.Game.Stage", 
	{

	},
	{

	}
);
gamecore.Base.extend("Andrada.Game.StageManaer",
	{

	},
	{

	}
);
gamecore.Base.extend("Andrada.Game.Engine", 
	{

	},
	{
		
	}
);
