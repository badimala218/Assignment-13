import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(<App/>);
  root.unmount();
  // ReactDOM.render(<App />, div);
  // ReactDOM.unmountComponentAtNode(div);
});
