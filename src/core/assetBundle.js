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
