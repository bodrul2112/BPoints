define(["thirdparty/jquery"], function(jQuery) {

    var LoaderInternal = function( oParentFolder )
    {
    	Events.subscribe("load_folder", this._load_folder.bind(this));
    	Events.subscribe("load_text", this._load_text.bind(this));
    	Events.subscribe("load_opened", this._load_opened.bind(this));
    	
    	this.path_prefix = "http://localhost:6678/bpoints/folder/?path=";
    	this.text_path_prefix = "http://localhost:6678/bpoints/text_list/?path=";
    	this.load_opened_path = "http://localhost:6678/bpoints/load_opened/";
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
    
    LoaderInternal.prototype._load_opened = function( eventName, data ) 
    {
    	var url = this.load_opened_path+"?id="+data.id;
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