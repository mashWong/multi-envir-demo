import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import './App.css';
import {Login} from './containers/login/login';
import Main from './containers/main/main';
import './service/AxiosInterceptor';

class App extends Component {

    render() {
        return (
            <BrowserRouter basename="/">
                <div className="App-header">
                    <Switch>
                        <Route path="/login" component={Login}/>
                        <Route component={Main}/>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
