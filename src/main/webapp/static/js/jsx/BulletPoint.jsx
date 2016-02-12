define(['react'], function(React) {
	
  var BulletPoint = React.createClass({
    getInitialState: function() {
      return {
    	  event_id: Events.getUID(),
    	  isListDisplayed:false,
    	  isOpenedOnce:false,
    	  name: this.props.data.name,
    	  bulletTexts: [],
    	  subBulletPoints: []
      };
    },
    
    onClick_expand: function()
    {
    	
    	this.state.isListDisplayed = !this.state.isListDisplayed;
    	Events.subscribe(this.state.event_id, this.onClick_get_text_callback.bind(this));
    	var data = {
    		id: this.state.event_id,
    		path: this.props.data.path,
    		opened_state: this.state.isListDisplayed
    	}
    	Events.publish("load_text", data);
    },
    
    onClick_get_text_callback: function( eventName, data)
    {
    	if(data.new_path)
    	{
    		/*
    		this.state.subBulletPoints = [];
        	this.setState({subBulletPoints: []});
    		
        	for(var key in data.folder_list)
        	{
        		var mData = data.folder_list[key];
        		this.state.subBulletPoints.push(<BulletPoint data={mData} />);
        	}
        	*/
    		
    		var newData = {
    			name: data.new_folder,
    			path: data.new_path
    		}
    		this.state.subBulletPoints.push(<BulletPoint data={newData} />)
    	}
    	else if(data.new_texts)
    	{
    		// do nothing
    	}
    	else if(!this.state.isOpenedOnce)
    	{
    		// default is to render add the sub points
        	for(var key in data.folder_list)
        	{
        		var mData = data.folder_list[key];
        		this.state.subBulletPoints.push(<BulletPoint data={mData} />);
        	}
        	
    	}
    	
    	this.setState({isListDisplayed: this.state.isListDisplayed,
			   bulletTexts: data.text_list || [],
			   subBulletPoints: this.state.subBulletPoints,
			   isOpenedOnce: true});
    },
    
    onClick_addText: function()
    {
    	console.log("adding a new text point")
    	Events.subscribe(this.state.event_id, this.onClick_get_text_callback.bind(this));
    	
    	
    	var new_text_input_val = this.refs.new_text_input.value || "";
    	if(new_text_input_val != "")
    	{
    		this.state.bulletTexts.push(new_text_input_val);
    		var data = {
    				id: this.state.event_id,
    				path: this.props.data.path,
    				new_texts: this.state.bulletTexts
    		}
    	}
    	
    	Events.publish("save_text", data);
    },
    
    onClick_addFolder: function()
    {
    	console.log("adding a new expandable bullet point")
    	Events.subscribe(this.state.event_id, this.onClick_get_text_callback.bind(this));

    	var input_val = this.refs.name_input.value || "";
    	if(input_val != "")
    	{
    		var data = {
    				id: this.state.event_id,
    				path: this.props.data.path,
    				new_folder: input_val
    		}
    	}
    	
    	Events.publish("save_folder", data);
    },

    componentDidMount: function() {
    },

    render: function() {
      	
      var list_items = [];
      var new_folder_input = <li className={['hide_it']}/>;
      if(this.state.isListDisplayed)
      {
          this.state.subBulletPoints.forEach(function(item){
        	  list_items.push(item)
          }.bind(this));
          
          this.state.bulletTexts.forEach(function(item){
        	  list_items.push(<li className={['list_item list_text']}><div>{item}</div></li>)
          }.bind(this));
          
          var new_text_input = <li><div className={['input_wrapper']}>
          		<input className={['add_text add_text_input_box']} ref='new_text_input' />
          		<div className={['add_text add_text_btn']} onClick={this.onClick_addText}>{' ++ '}</div>
          </div></li>;
          
          list_items.push(new_text_input);
          
          new_folder_input = <li><div className={['input_wrapper']}>
        	  	<input className={['expand_point expand_input_box']} ref='name_input' />
				<div className={['expand_point expand_point_btn']} onClick={this.onClick_addFolder}>{' ++ '}</div>
			</div></li>;
      }	
    	
      return <li className={['list_item']}>
		     	<div className={['list_expand_point_wrapper']}>
		     		<div className={['expand_point expand_point_name']} onClick={this.onClick_expand}>{this.state.name}</div>
					{}
				</div>
      			<ul>{[new_folder_input,list_items]}</ul>
      		</li>;
    }
  });

  return BulletPoint;
});
