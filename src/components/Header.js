import React, { useState, useEffect } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { gapi } from 'gapi-script';
import { connect } from 'react-redux';
import { signin } from '../actions';

function Header({ posts, signin }) {
  console.log(posts.auth);
  const [profile, setProfile] = useState([]);
  const clientId =
    '1091196006174-27spvg8d6ktqsc6o1ilqlvttbuo2o3f2.apps.googleusercontent.com';
  useEffect(() => {
    // debugger;
    const initClient = () => {
      gapi.client
        .init({
          clientId: clientId,
          scope: '',
        })
        .then(() => {
          setTimeout(() => {
            if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
              // debugger;
              signin(false, null, null);
              setProfile(null);
            }
          }, 1000);
          gapi.auth2.getAuthInstance();
          // console.log(
          //   'gapi.auth2.getAuthInstance().isSignedIn.get()',
          //   gapi.auth2.getAuthInstance().isSignedIn.get()
          // );
          //if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
          // signin(false, null, null);
          // setProfile(null);
          // } else {
          // debugger;
          // }
        });
    };
    gapi.load('client:auth2', initClient);
  }, []);

  const onSuccess = (res) => {
    debugger;
    signin(true, res.profileObj.googleId, res.profileObj.email);
    setProfile(res.profileObj);
  };

  const onFailure = (err) => {
    debugger;
    console.log('failed', err);
  };

  const logOut = () => {
    // debugger;
    debugger;
    signin(false, null, null);
    setProfile(null);
  };

  return (
    <div>
      <h2>React Google Login</h2>
      <br />
      <br />
      {profile && posts.auth.signin === true ? (
        <div>
          <h3>User Logged in</h3>

          <GoogleLogout
            clientId={clientId}
            buttonText="Log out"
            onLogoutSuccess={logOut}
          />
        </div>
      ) : (
        <GoogleLogin
          clientId={clientId}
          buttonText="Sign in with Google"
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy={'single_host_origin'}
          isSignedIn={true}
        />
      )}
    </div>
  );
}
const mapStateToProps = (state) => {
  return { posts: state };
};

export default connect(mapStateToProps, { signin })(Header);
