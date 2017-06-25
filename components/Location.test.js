import React from 'react';
import LocationComponent from './LocationComponent';

import renderer from 'react-test-renderer';

it('renders without crashing', () => {
    const rendered = renderer.create(<App />).toJSON();
    expect(rendered).toBeTruthy();
});
