define(['react'], function (React) {

  var BulletPoint = React.createClass({
    getInitialState: function () {
      return {
        event_id: Events.getUID(),
        isRoot: this.props.data.is_root,
        isListDisplayed: false,
        isOpenedOnce: false,
        name: this.props.data.name,
        path: this.props.data.path,
        bulletTexts: [],
        subBulletPoints: [],
        addTextClickedInto: false,
        addPointClickedInto: false
      };
    },

    componentDidMount: function () {

      if (this.state.isRoot) {
        console.log("herp", this.state);
        PipeLoader.setRoot(this);
        OpenedState.loadState();
      }

      Events.subscribe(this.state.path, this.autoExpand.bind(this));
      Events.subscribe(this.state.event_id, this.onClick_get_text_callback.bind(this));
    },

    autoExpand: function (sEventName, data) {
      if (data.autoexpand) {
        if (!this.state.isOpenedOnce) {
          this.onClick_expand();
        } else {
          PipeLoader.setCurrent(this);
        }
      }
    },

    onClick_expand: function () {

      this.state.isListDisplayed = !this.state.isListDisplayed;

      var data = {
        id: this.state.event_id,
        path: this.props.data.path,
        opened_state: this.state.isListDisplayed
      };
      Events.publish("load_text", data);
    },

    onClick_get_text_callback: function (eventName, data) {
      // this entire method is a giant hack
      // dont judge me...

      if (data.new_path) {
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
        };
        this.state.subBulletPoints.push(React.createElement(BulletPoint, { data: newData }));
      } else if (data.new_texts) {
        // do nothing
      } else if (!this.state.isOpenedOnce) {
          // default is to render add the sub points
          for (var key in data.folder_list) {
            var mData = data.folder_list[key];
            this.state.subBulletPoints.push(React.createElement(BulletPoint, { data: mData }));
          }
        }

      this.setState({ isListDisplayed: this.state.isListDisplayed,
        bulletTexts: data.text_list || [],
        subBulletPoints: this.state.subBulletPoints,
        isOpenedOnce: true,
        addTextClickedInto: this.state.addTextClickedInto,
        addPointClickedInto: this.state.addPointClickedInto });

      if (PipeLoader.isPiping()) {
        PipeLoader.setCurrent(this);
      }
    },

    onClick_addText: function () {
      this.state.addTextClickedInto = false;
      console.log("adding a new text point");

      var new_text_input_val = this.refs.new_text_input.value || "";
      if (new_text_input_val != "") {
        this.state.bulletTexts.push(new_text_input_val);
        var data = {
          id: this.state.event_id,
          path: this.props.data.path,
          new_texts: this.state.bulletTexts
        };
      }

      Events.publish("save_text", data);
    },

    onClick_addFolder: function () {
      this.state.addPointClickedInto = false;
      console.log("adding a new expandable bullet point");

      var input_val = this.refs.name_input.value || "";
      if (input_val != "") {
        var data = {
          id: this.state.event_id,
          path: this.props.data.path,
          new_folder: input_val
        };
      }
      this.refs.name_input.value = "";
      Events.publish("save_folder", data);
    },

    // START: sad...sad code
    onClick_intoAddPoint: function () {
      this.setState({ addPointClickedInto: !this.state.addPointClickedInto });
    },

    onClick_intoAddText: function () {
      this.setState({ addTextClickedInto: !this.state.addTextClickedInto });
    },

    // END: sad...sad code
    render: function () {

      var list_items = [];
      var new_folder_input = React.createElement("li", { className: ['hide_it'] });
      if (this.state.isListDisplayed) {
        this.state.subBulletPoints.forEach(function (item) {
          list_items.push(item);
        }.bind(this));

        this.state.bulletTexts.forEach(function (item) {
          list_items.push(React.createElement(
            "li",
            { className: ['list_item list_text'] },
            React.createElement(
              "div",
              null,
              item
            )
          ));
        }.bind(this));
        var additionalTextClassName = this.state.addTextClickedInto ? 'add_text_clicked' : 'derp';
        var new_text_input = React.createElement(
          "li",
          null,
          React.createElement(
            "div",
            { className: ['input_wrapper ' + additionalTextClassName] },
            React.createElement("input", { className: ['add_text add_text_input_box'], ref: "new_text_input", onClick: this.onClick_intoAddText }),
            React.createElement(
              "div",
              { className: ['add_text add_text_btn'], onClick: this.onClick_addText },
              ' ++ '
            )
          )
        );

        list_items.push(new_text_input);

        var additionalPointClassName = this.state.addPointClickedInto ? 'add_point_clicked' : 'derp';
        new_folder_input = React.createElement(
          "li",
          null,
          React.createElement(
            "div",
            { className: ['input_wrapper ' + additionalPointClassName] },
            React.createElement("input", { className: ['expand_point expand_input_box'], ref: "name_input", onClick: this.onClick_intoAddPoint }),
            React.createElement(
              "div",
              { className: ['expand_point expand_point_btn'], onClick: this.onClick_addFolder },
              ' ++ '
            )
          )
        );
      }

      return React.createElement(
        "li",
        { className: ['list_item'] },
        React.createElement(
          "div",
          { className: ['list_expand_point_wrapper'] },
          React.createElement(
            "div",
            { className: ['expand_point expand_point_name'], onClick: this.onClick_expand },
            this.state.name
          )
        ),
        React.createElement(
          "ul",
          null,
          [new_folder_input, list_items]
        )
      );
    }
  });

  return BulletPoint;
});