define(["thirdparty/jquery"], function(jQuery) {

    var BPFactoryInternal = function( )
    {
    }
    
    BPFactoryInternal.prototype.createBullet = function( data ) 
    {
    	
    }
    
    if(!window.BPFactory)
    {
    	window.BPFactory = new BPFactoryInternal();
    }
    
    return window.BPFactory;
});