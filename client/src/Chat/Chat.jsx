import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Header from '../Layout/Header';
import ChatBox from './ChatBox';
import Conversations from './Conversations';
import Users from './Users';
import { useDispatch, useSelector } from 'react-redux';
import { connectSocket } from '../Services/socket';



const Chat = (props) => {
    const [scope, setScope] = useState('Global Chat');
    const [tab, setTab] = useState(0);
    const [user, setUser] = useState(null);
    const classes = useStyles();
  const [messages, setMessages] = useState([]);

  const [conversations, setConversations] = useState()
    const handleChange = (e, newVal) => {
        setTab(newVal);
    };

    const dispatch = useDispatch()
    useEffect(() => {
      //  dispatch(connectSocket(user._id))
      dispatch(connectSocket())
 
    }, [dispatch])
  

 
    return (
        <React.Fragment>
            <Header />
            <Grid container>
                <Grid item md={4} className={classes.sidebar}>
                    <Paper className={classes.paper} square elevation={5}>
                        <Paper square>
                            <Tabs
                                onChange={handleChange}
                                variant="fullWidth"
                                value={tab}
                                indicatorColor="primary"
                                textColor="primary"
                            >
                                <Tab label="Chats" />
                                <Tab label="Users" />
                            </Tabs>
                        </Paper>
                        {tab === 0 && (
                            <Conversations
                                setUser={setUser}
                                setScope={setScope}
                                setConversation={setConversations}
                            />
                        )}
                        {tab === 1 && (
                            <Users setUser={setUser} setScope={setScope} />
                        )}
                    </Paper>
                </Grid>
                <Grid item md={8}>
                    <ChatBox scope={scope} user={user} messages={messages} />
                </Grid>
            </Grid>
        </React.Fragment>
    );
};


const useStyles = makeStyles(theme => ({
    paper: {
        minHeight: 'calc(100vh - 64px)',
        borderRadius: 0,
    },
    sidebar: {
        zIndex: 8,
    },
    subheader: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
    },
    globe: {
        backgroundColor: theme.palette.primary.dark,
    },
    subheaderText: {
        color: theme.palette.primary.dark,
    },
}));


export default Chat;
