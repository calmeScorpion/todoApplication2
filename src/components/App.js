import React from 'react';
import { connect } from 'react-redux';
import { Router, Route } from 'react-router-dom';
import PostList from './PostList';
import PostCreate from './PostCreate';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import history from '../history';
import PostEdit from './PostEdit';
import Header from './Header';
import PublicRoute from './Public';
import PrivateRoute from './private';
import _ from 'lodash';
import Loader from './Loader';
import './index.css';

const App = ({ auth }) => {
  const { signin } = auth;
  return (
    <div className='container'>
      <ToastContainer />
      <Header />
      {_.isNull(signin) ? (
        <Loader />
      ) : (
        <Router history={history}>
          {/* <PublicRoute path="/" component={PostList} exact /> */}
          <PublicRoute
            path="/"
            exact
            isAuthenticated={signin}
            component={PostList}
          ></PublicRoute>
          <PrivateRoute path="/add" isAuthenticated={signin}>
            <PostCreate />
          </PrivateRoute>
          <PrivateRoute path="/edit/:id" isAuthenticated={signin}>
            <PostEdit />
          </PrivateRoute>
        </Router>
      )}
    </div>
  );
};
const mapStateToProps = (state) => {
  return { posts: state.posts, auth: state.auth };
};
export default connect(mapStateToProps)(App);
