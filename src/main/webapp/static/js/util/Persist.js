define(["thirdparty/jquery"], function(jQuery) {

    var PersistInternal = function( oParentFolder )
    {
    	Events.subscribe("save_folder", this._save_folder.bind(this));
    	Events.subscribe("save_text", this._save_text.bind(this));
    	Events.subscribe("save_opened", this._save_opened.bind(this));
    	
    	this.save_path_prefix = "http://localhost:6678/bpoints/save_folder";
    	this.save_text_prefix = "http://localhost:6678/bpoints/save_text";
    	this.save_opened_prefix = "http://localhost:6678/bpoints/save_opened";
    }
    
    PersistInternal.prototype._save_folder = function( eventName, postData ) 
    {
    	$.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: this.save_path_prefix,
            data: JSON.stringify(postData),
            dataType: "text"
        }).done(function(mData) {
        	var parsedData = JSON.parse(mData);
    		Events.publish(parsedData.id, parsedData);
        }.bind(this))
        .fail(function(xhr, textStatus, thrownError) { alert("error " + textStatus); console.log(xhr, textStatus, thrownError);})
    }
    
    PersistInternal.prototype._save_text = function( eventName, postData ) 
    {
    	$.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: this.save_text_prefix,
            data: JSON.stringify(postData),
            dataType: "text"
        }).done(function(mData) {
        	var parsedData = JSON.parse(mData);
    		Events.publish(parsedData.id, parsedData);
        }.bind(this))
        .fail(function(xhr, textStatus, thrownError) { alert("error " + textStatus); console.log(xhr, textStatus, thrownError);})
    }

    PersistInternal.prototype._save_opened = function( eventName, postData ) 
    {
    	$.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: this.save_opened_prefix,
            data: JSON.stringify(postData),
            dataType: "text"
        }).done(function(mData) {
        	console.log("saved opened state");
        }.bind(this))
        .fail(function(xhr, textStatus, thrownError) { alert("error " + textStatus); console.log(xhr, textStatus, thrownError);})
    }
    
    
    if(!window.Persist)
    {
    	window.Persist = new PersistInternal();
    }
    
    return window.Persist;
});