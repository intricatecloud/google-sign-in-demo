/* global gapi */
import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

function NotSignedIn() {
  return (
    <div>
      <p>You are not signed in. Click here to sign in.</p>
      <button id="loginButton">Login with Google</button>
    </div>
  )
}

function Members() {
  return (
    <p>hello user, you're signed in </p>
  )
}


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSignedIn: false,
    }
  }

  componentDidMount() {
    window.gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '260896681708-o8bddcaipuisksuvb5u805vokq0fg2hc.apps.googleusercontent.com',
      })

      this.auth2.attachClickHandler(document.querySelector('#loginButton'), {}, this.onLoginSuccessful.bind(this))

      this.auth2.then(() => {
        console.log('on init');
        this.setState({
          isSignedIn: this.auth2.isSignedIn.get(),
        });
      });
    });    
  }

  onLoginSuccessful() {
    this.setState({
      isSignedIn: true,
      err: null
    })
  }

  onLoginFailed(err) {
    this.setState({
      isSignedIn: false,
      error: err,
    })
  }

  getContent() {
    if (this.state.isSignedIn) {
      return Members
    } else {
      return NotSignedIn
    }
    
  }

  requiresLogin(props, Component) {
    const promise = new Promise((resolve, reject) => {
      window.gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '260896681708-o8bddcaipuisksuvb5u805vokq0fg2hc.apps.googleusercontent.com',
        })
  
        this.auth2.then(() => {
          return resolve(this.auth2.isSignedIn.get() ? <Component {...props}/> : <div>Need to login</div>)

        })
      })
    }).then(component => {
      return component
    })    
  }
  
  render() {
    return (      
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Sample App.</h2>

          <Router>
            <Switch>
              <Route path="/members" render={this.requiresLogin.bind(this, Members)}/>
              <Route path="/" component={NotSignedIn}/>
            </Switch>
          </Router>
        </header>
      </div>
    );
  }
}

export default App;
