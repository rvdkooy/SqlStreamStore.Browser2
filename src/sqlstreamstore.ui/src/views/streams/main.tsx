import React, { useState, useEffect } from 'react';
import Searchbar from '../../components/Searchbar/searchbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import StreamsTable from './table';
import streamsApi, { StreamResponse } from '../../services/streamsApi';

const useStyles = makeStyles({
  root: {
    padding: 10,
  },
  searchContainer: {
    padding: '10px 0',
  },
  progressContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 40,
  }
});

const StreamsView = () => {
  const classes = useStyles();
  const [streams, updateStreams] = useState<Array<StreamResponse>>([]);
  const [status, updateStatus] = useState('error');
  const [streamId, updateStreamId] = useState<string | undefined>();

  useEffect(() => {
    async function retrieveStreams(streamId?: string) {
      try {
        updateStatus('loading');
        const streamResponse = await streamsApi.getStreams(streamId);
        updateStreams(streamResponse);
        updateStatus('done');
      } catch (err) {
        console.error(err);
        updateStatus('error');
      }
    }
    
    retrieveStreams(streamId);
  }, [streamId]);

  return (
    <div className={classes.root}>
      <div className={classes.searchContainer}>
        <Searchbar
          onSearchStreamId={(streamId) => updateStreamId(streamId)}
        />
      </div>
      {
        (status === 'loading') ?
          <div className={classes.progressContainer}>
            <CircularProgress></CircularProgress>
          </div> : null
      }
      {
        (status === 'error') ?
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            An error occured while retrieving streams
          </Alert> : null
      }
      {
        (status === 'done') ? <StreamsTable streams={streams} /> : null
      }
    </div>
  );
};

export default StreamsView;