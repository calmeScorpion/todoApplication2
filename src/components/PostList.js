import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import {
  setPosts,
  showForm,
  addPost,
  getPost,
  cancelForm,
  editPost,
  deletePost,
} from '../actions';
import moment from 'moment/moment';
import Form from './Form';
Modal.setAppElement('#root');

const PostList = ({
  signin,
  posts,
  setPosts,
  addPost,
  getPost,
  cancelForm,
  editPost,
  deletePost,
  ...rest
}) => {
  console.log(signin.auth.signin);
  const columns = [
    {
      name: 'Name',
      selector: (row) => row.id,
    },
    {
      name: 'Title',
      selector: (row) => row.title,
    },
    {
      name: 'Description',
      selector: (row) => row.body,
      sortable: true,
    },
    {
      name: 'caretedDated',
      selector: (row) => moment(row.createdAt).format('YYYY-MM-DD'),
    },

    {
      name: signin.auth.signin ? 'Acion' : null,
      selector: (row) => (
        <div>
          {signin.auth.signin ? (
            <Link className="btn btn-warning" to={`/edit/${row.id}`}>
              Edit
            </Link>
          ) : null}
          {signin.auth.signin ? (
            <button
              className="btn btn-danger"
              onClick={() => onDeleteModal(row)}
            >
              Delete{' '}
            </button>
          ) : null}
        </div>
      ),
      sortable: true,
    },
  ];

  const [deleteModalConfig, setDeleteModalConfig] = useState({
    showModal: false,
    deleteId: null,
  });
  const onDeleteModal = (row) => {
    setDeleteModalConfig({
      showModal: true,
      deleteId: row.id,
    });
  };
  const onCloseModal = () => {
    setDeleteModalConfig({
      showModal: false,
      deleteId: null,
    });
  };

  const onDeleteConfirm = (row) => {
    deletePost(deleteModalConfig.deleteId);
  };
  useEffect(() => {
    setPosts();
  }, []);

  useEffect(() => {
    if (!posts.onDeleteLoading) {
      setDeleteModalConfig({
        showModal: false,
        deleteId: null,
      });
    }
  }, [posts.onDeleteLoading]);
  const onFormSubmit = (data) => {
    if (posts.selectedPostId) {
      editPost(posts.selectedPostId, {
        title: data.title,
        body: data.description,
        updatedAt: new Date().getTime(),
      });
    } else {
      addPost({
        title: data.title,
        body: data.description,
        createdAt: new Date().getTime(),
      });
    }
  };
  return (
    <div>
      <div className="header d-flex justify-content-between align -item-center">
        <h1>POSTS</h1>
        <Modal
          isOpen={deleteModalConfig.showModal}
          contentLabel="Minimal Modal Example"
        >
          <button onClick={() => onCloseModal()}>Close Modal</button>

          <button className="btn btn-warning" onClick={() => onDeleteConfirm()}>
            Confirm{' '}
            {posts.onDeleteLoading ? (
              <i className="bi bi-ubuntu">loading</i>
            ) : null}
          </button>
        </Modal>

        <Link className="btn btn-primary" to={'/add'}>
          Add Post
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={posts.data}
        pagination
        progressPending={posts.loadingData}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return { posts: state.posts, signin: state };
};

export default connect(mapStateToProps, {
  setPosts,
  showForm,
  addPost,
  getPost,
  cancelForm,
  editPost,
  deletePost,
})(PostList);
