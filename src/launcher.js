import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom';

function requireEntry () {
	let Entry = require('__entry__'); // eslint-disable-line import/no-unresolved

	return Entry.default || Entry;
}

let root = document.getElementById('root');

function renderEntry () {
	let CurrentEntry = requireEntry();
	let element = React.createElement(
		AppContainer, null,
		React.createElement(CurrentEntry, null)
	);

	render(element, root);
}

if (module.hot) {
	require('webpack/hot/log').setLogLevel('none');
	module.hot.accept('__entry__', function () {
		console.clear(); // eslint-disable-line no-console
		renderEntry();
	});
	module.hot.accept();
	module.hot.dispose(function () {});
}

renderEntry();