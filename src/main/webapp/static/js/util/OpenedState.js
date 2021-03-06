define(["thirdparty/jquery",'util/Events'], function(jQuery, E) {

    var OpenedStateInternal = function( )
    {
    	this.id = "OpenedStateInternal";
    	
    	this.loaded_folders = {};
    	
    	Events.subscribe("load_text", this._recordOpen.bind(this));
    	Events.subscribe(this.id, this._setLoadedFolders.bind(this));
    }
    
    OpenedStateInternal.prototype.loadState = function() 
    {
    	var data = {
    		id: this.id
    	}
    	Events.publish("load_opened", data);
    }
    
    OpenedStateInternal.prototype._setLoadedFolders = function( eventName, data ) 
    {
    	if(data.opened)
    	{
    		this.loaded_folders = data.opened;
    		console.log(this.loaded_folders);
    		Events.publish("pipe_load", data);
    	}
    }
    
    OpenedStateInternal.prototype.getOpened = function( eventName, data ) 
    {
    	return this.loaded_folders;
    }
    
    OpenedStateInternal.prototype._recordOpen = function( eventName, data ) 
    {
    	if(!PipeLoader.isPiping())
    	{
        	if(data.opened_state)
        	{
        		this.loaded_folders[data.path]=true;
        	}
        	else
        	{
        		delete this.loaded_folders[data.path];
        	}
        	
        	Events.publish("save_opened", this.loaded_folders);
    	}
    }
    
    if(!window.OpenedState)
    {
    	window.OpenedState = new OpenedStateInternal();
    }
    
    return window.OpenedState;
});