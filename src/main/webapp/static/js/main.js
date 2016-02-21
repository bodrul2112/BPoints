/*

 require.config({
 baseUrl: "js/",

 paths: {
 "react": "react-with-addons",
 "JSXTransformer": "JSXTransformer"
 },

 jsx: {
 fileExtension: '.jsx',
 harmony: true,
 stripTypes: true
 }
 });
 */

/*
 require.config({

 paths: {
 es6: "node_modules/requirejs-babel/es6",
 babel: "node_modules/requirejs-babel/babel-5.8.22.min"
 },

 });
 */

// ^ loading the singletons Events/Loader/BPFactory
require([ 'react', 'components/BulletPoint', 'components/BulletPoint',
		'util/Events', 'util/Loader', 'util/Persist', 'util/BPFactory', 'util/OpenedState', 'util/PipeLoader' ], function(React,
		BulletPoint, E, L, P, B, O, PL) {

	var initial_load = function(eventName, mData) {
		console.log(mData);

		BulletPoint = React.createFactory(BulletPoint);
		// Mount the JSX component in the app container
		React.render(BulletPoint({
			data : mData
		}), document.getElementById('js-app-container'));
		
	}

	Events.subscribe('initial_load', initial_load);

	var data = {
		id : 'initial_load',
		path : '___the_top_folder_please_dont_use_this_id',
	}

	Events.publish("load_folder", data);

});
