// queue-mngmt/page.jsx
import React from 'react';
import QueueList from './QueueList';
import QueueForm from './QueueForm';

const QueuePage = () => {
  return (
    <div>
      <h1>Queue Management</h1>
      <QueueForm />
      <QueueList />
    </div>
  );
};

export default QueuePage;
