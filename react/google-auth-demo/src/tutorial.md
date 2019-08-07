# adding google sign-in to your webapp - pt3 a react example

Up until now, we've seen 2 different hello world examples of how to add google sign-in on the front-end - using plain HTML and vanilla JS. It's been all nice and dandy for a hello world, but one thing thats been missing while I was figuring out google sign-in is what a working implementation looks like - especially in React. 

In this next part of the series, I'll be walking you through an implementation of google sign-in with a simple react app and a bonus react-router example.

*There is a [react-google-login component](https://github.com/anthonyjgrove/react-google-login) that configures all of google sign-in behind a `<GoogleLogin>` tag. It's quite useful and I've used it in a few instances - the only downside is that you can't get at the return value of the `gapi.auth2.init()` method. This post will show whats going on under the covers.

## creating a new react app with google sign-in

First - create the app `create-react-app google-auth-demo`. The files we'll mainly be working with are App.js and index.html.

Add the google sign-in script tag to your `public/index.html`

```
<head>
  ...
  <script src="https://apis.google.com/js/api.js" async defer></script>
  ...
</head>
```

## add the login button

In App.js - add some state to keep track of when the user has signed in

```
contructor(props) {
    super(props)
    this.state = {
        isSignedIn: false,
    }
}
```

Add the button to the component

```
render() {
  return (
    <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
    
          <p>You are not signed in. Click here to sign in.</p>
          <button id="loginButton">Login with Google</button>
        </header>
      </div>
  )
}

```

Wait, how do I avoid showing this if the user is signed in? We can use the state to conditionally show it.

```
getContent() {
  if (this.state.isSignedIn) {
    return <p>hello user, you're signed in </p>
  } else {
    return (
      <div>
        <p>You are not signed in. Click here to sign in.</p>
        <button id="loginButton">Login with Google</button>
      </div>
    )
  }
  
}

render() {
  return (      
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Sample App.</h2>

        {this.getContent()}           
      </header>
    </div>
  );
}
```
* Since conditionals are a little hard to write with inline JSX, I've pulled out the conditional block to another method to provide the component that we want.

At this point, you'll have a button that does nothing (the best type of button) and you'll see the "You are not signed in" message

## add sign-in 

To finish setting up google sign-in, you'll want to initialize the library using `gapi.auth2.init()`. A good place to do that is inside of `componentDidMount()` callback. 

```
componentDidMount() {
  window.gapi.load('auth2', () => {
    this.auth2 = gapi.auth2.init({
      client_id: '260896681708-o8bddcaipuisksuvb5u805vokq0fg2hc.apps.googleusercontent.com',
    })
  })
}
```

To use the default styling, use the `gapi.signin2.render` method when initializing your component.

```
onSuccess() {
  this.setState({
    isSignedIn: true
  })
}

componentDidMount() {
  window.gapi.load('auth2', () => {
    this.auth2 = gapi.auth2.init({
      client_id: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
    })

    window.gapi.load('signin2', function() {
      // render a sign in button
      // using this method will show Signed In if the user is already signed in
      var opts = {
        width: 200,
        height: 50,
        onSuccess: this.onSuccess.bind(this),
      }
      gapi.signin2.render('loginButton', opts)
    })
  })
}
```

When using this method, the button will automatically show whether you're signed in, but the `onSuccess` callback won't actually run unless the user clicks it when it says "Sign In". Otherwise, you are logged in automatically. One way to hook into the end of that auto sign in process is by adding a callback to the promise returned by `gapi.auth2.init`:

```
window.gapi.load('auth2', () => {
  this.auth2 = gapi.auth2.init({
    client_id: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
  })

  this.auth2.then(() => {
    this.setState({
      isSignedIn: this.auth2.isSignedIn.get(),
    });
  });
})
```

## making a "protected" route

If you're using react-router and you want to add a "protected" route to your React app, you can hijack the `render` prop of a `<Route>`. You can do something like this:

```
authCheck(props, Component) {
  return this.auth2.isSignedIn.get() ? <Component {...props} /> : <UnauthorizedPage/>

}

render() {
  ...
  <Route path="/home" render={this.authCheck.bind(this, HomePage)}/>
  ...
}
```

By hooking into the render property on `<Route>`, you can dynamically define what component will load when you try to access that Route. 

This is the strategy employed by the [react-private-route project](https://www.npmjs.com/package/react-private-route) library to make it a little bit easier to write, definitely worth checking out.

# Conclusion

If you're implementing google sign-in in a React app - check out my github repo if you're looking for an example of a working setup.

Tutorials like this can be hard to follow. Sometimes its helpful to see the process to fully understand whats going on. I'll be putting together a video of this tutorial available on 8/20

