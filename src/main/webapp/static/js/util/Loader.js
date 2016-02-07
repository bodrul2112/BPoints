define(["thirdparty/jquery"], function(jQuery) {

    var LoaderInternal = function( oParentFolder )
    {
    	Events.subscribe("load_folder", this._load_folder.bind(this));
    	Events.subscribe("load_text", this._load_text.bind(this));
    	
    	this.path_prefix = "http://localhost:6677/bpoints/folder/?path=";
    	this.text_path_prefix = "http://localhost:6677/bpoints/text_list/?path=";
    }
    
    LoaderInternal.prototype._load_folder = function( eventName, data ) 
    {
    	var url = this.path_prefix+data.path+"&id="+data.id; 
    	$.getJSON(url, function( mData ) {
    		Events.publish(data.id, mData);
    	});
    }
    
    LoaderInternal.prototype._load_text = function( eventName, data ) 
    {
    	var url = this.text_path_prefix+data.path+"&id="+data.id; 
    	$.getJSON(url, function( mData ) {
    		Events.publish(data.id, mData);
    	});
    }
    
    if(!window.Loader)
    {
    	window.Loader = new LoaderInternal();
    }
    
    return window.Loader;
});