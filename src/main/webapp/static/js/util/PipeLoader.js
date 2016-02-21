define(["thirdparty/jquery",'util/Events'], function(jQuery, E) {

    var PipeLoaderInternal = function( )
    {
    	this.id = "PipeLoaderInternal";
    	
    	this.staged = [];
    	this.stagePosition;
    	this.stageListPosition;
    	this.stageList;
    	
    	Events.subscribe("pipe_load", this._pipeLoad.bind(this));
    	
    	this.piping = false;
    	this.root;
    	this.current;
    }
    
    PipeLoaderInternal.prototype.isPiping = function() 
    {
    	return this.piping;
    }
    
    PipeLoaderInternal.prototype.setRoot = function( rootObject ) 
    {
    	this.root = rootObject;
    }
    
    PipeLoaderInternal.prototype.setCurrent = function( currentObject ) 
    {
    	this.current = currentObject;
    	this._pipeNext();
    }
    
    PipeLoaderInternal.prototype._pipeLoad = function( eventName, data) 
    {
    	this.piping = true;
    	
    	this.stageList = [];
    	for(var key in data.opened)
    	{
    		this.stageList.push(key);
    	}
    	
    	this.stageList.reverse();
    	
    	this.stagePosition;
    	this.stageListPosition = 0;
    	
    	this.current = this.root;
    	
    	this.setStaged();
    	
    	console.log("pipe load please", this.stageList);
    }
    
    PipeLoaderInternal.prototype.setStaged = function()
    {
    	this.staged = []; 
    	this.stagePosition = -1;
    	
    	var path = this.stageList[this.stageListPosition];
    	var names = path.split(this.root.state.name)[1];
    	if(names.trim() != "")
    	{
    		var namesParts = names.split("\\");
    		for(var key in namesParts)
    		{
    			var name = namesParts[key];
    			if(name.trim() != "")
    			{
    				this.staged.push(name);
    			}
    		}
    		
    		if(this.staged.length > 0 )
    		{
    			console.log("sucessfully staged this shit", this.staged);
    			Events.publish(this.root.state.path, {autoexpand: true});
    		}
    		else
    		{
    			this._moveStage();
    		}
    	}
    	else
    	{
    		this._moveStage();
    	}
    }
    
    // move from stage list to stage
    PipeLoaderInternal.prototype._moveStage = function() 
    {
    	this.current = this.root;
		this.stageListPosition++;
		if(this.stageListPosition < this.stageList.length)
		{
			this.setStaged();
		}
		else
		{
			this.piping = false;
		}
    }
    
    PipeLoaderInternal.prototype._pipeNext = function() 
    {
    	this.stagePosition++;
    	if(this.stagePosition < this.staged.length)
    	{
    		var name = this.staged[this.stagePosition];
    		
    		var points = this.current.state.subBulletPoints;
    		for(var key in points)
    		{
    			var point = points[key];
    			if(point.props.data.name == name)
    			{
    				Events.publish(point.props.data.path, {autoexpand: true});
    			}
    		}
    	}
    	else
    	{
    		console.log("moving to another tree");
    		this._moveStage();
    	}
    	
    }
    
    if(!window.PipeLoader)
    {
    	window.PipeLoader = new PipeLoaderInternal();
    }
    
    return window.PipeLoader;
});