import React from 'react';
import { Router, Route } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import { SnackbarProvider } from 'notistack';

import history from './Utilities/history';
import PrivateRoute from './Utilities/private-route';
import Home from './Home/Home';
import Chat from './Chat/Chat';
import { Provider}  from 'react-redux';
import store from './store';
//import Personalc from './Chat/Personalc';

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#58a5f0',
            main: '#0277bd',
            dark: '#004c8c',
        },
        secondary: {
            light: '#ffd95a',
            main: '#f9a825',
            dark: '#c17900',
            contrastText: '#212121',
        },
        background: {
            default: '#f0f0f0',
        },
    },
    typography: {
        useNextVariants: true,
    },
});

function App() {
    return (
        <Provider store={store}>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
                <Router history={history}>
                    <Route path="/" exact component={Home} />
               
                    <PrivateRoute path="/chat" component={Chat} />
                </Router>
            </SnackbarProvider>
        </ThemeProvider>
        </Provider>

    );
}

export default App;
