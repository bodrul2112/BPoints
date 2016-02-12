define([],

    function() {

        var EventsInternal = function( )
        {
        	this.eventNameToCallback = {};
        	this.static_counter = 0;
        }
        
        EventsInternal.prototype.subscribe = function( eventName, callback ) 
        {
        	if(!this.eventNameToCallback[eventName])
        	{
        		this.eventNameToCallback[eventName] = [];
        	}
        	
        	var callbacks = this.eventNameToCallback[eventName];
        	
        	/*
        	if(callbacks[callback] != callback)
        	{
        		callbacks[callback]=callback;
        	}
        	*/
        	callbacks.push(callback);
        }
        
        EventsInternal.prototype.publish = function( eventName, data ) 
        {
        	var callbacks = this.eventNameToCallback[eventName];
        	
        	for(var key in callbacks)
        	{
        		try{
        			callbacks[key](eventName, data);
        		}
        		catch(err)
        		{
        			console.log(err)
        		}
        		
        	}
        }

        EventsInternal.prototype.getUID = function() 
        {
        	this.static_counter++;
        	return (new Date()).getTime() + "" + this.static_counter;
        }
        
        if(!window.Events)
        {
        	window.Events = new EventsInternal();
        }
        return window.Events;
});