import React from 'react';
import {render} from 'react-dom';
import './index.css';
import App from './App';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core'
import * as serviceWorker from './serviceWorker';
import teal from '@material-ui/core/colors/teal'
import yellow from '@material-ui/core/colors/amber'



const theme = createMuiTheme({
  overrides: {
    MuiBackdrop: {
      root: {
        
      }
    }
  },
  palette: {
    type: 'dark',
    primary: teal,
    secondary: yellow
  },
});

render(
	<MuiThemeProvider theme={theme}>
    	<App />
    </MuiThemeProvider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
