import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom';
import Entry from '__entry__'; // eslint-disable-line import/no-unresolved

function renderEntry () {
	console.clear(); // eslint-disable-line no-console
	render(
		React.createElement(
			AppContainer, null,
			React.createElement(Entry, null)
		),
		document.getElementById('root')
	);
}

if (module.hot) {
	require('webpack/hot/log').setLogLevel('none');
	module.hot.accept('__entry__', renderEntry);
	module.hot.accept();
}

renderEntry();