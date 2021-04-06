import React, { useState, useEffect } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import LanguageIcon from "@material-ui/icons/Language";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";
import socketIOClient from "socket.io-client";

import { UseGetConversations } from "../Services/chatService";
import { authenticationService } from "../Services/authenticationService";
import commonUtilites from "../Utilities/common";
import {  useDispatch, useSelector } from "react-redux";
import { connect, connectSocket } from "../Services/socket";

const useStyles = makeStyles((theme) => ({
  subheader: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  globe: {
    backgroundColor: theme.palette.primary.dark,
  },
  subheaderText: {
    color: theme.palette.primary.dark,
  },
  list: {
    maxHeight: "calc(100vh - 112px)",
    overflowY: "auto",
  },
}));

const Conversations = (props) => {
  const classes = useStyles();
  const [conversations, setConversations] = useState([]);
  const [newConversation, setNewConversation] = useState(null);
  const getConversations = UseGetConversations();
const dispatch = useDispatch()

  // Returns the recipient name that does not
  // belong to the current user.

  useEffect(() => {
    
    return () => {
      
    }
  }, [])

  const handleRecipient = (recipients) => {
    for (let i = 0; i < recipients.length; i++) {
      if (
        recipients[i].username !==
        authenticationService.currentUserValue.username
      ) {
        return recipients[i];
      }
    }
    return null;
  };

  const Chat = useSelector(state => state.Chat)
  const {conversation}=Chat
  useEffect(() => {
    dispatch(UseGetConversations())
  }, []);

  useEffect(() => {
    setConversations(conversation)

    return () => {
     // socket.removeListener("messages");
    };
  }, [conversation,conversations]);

  return (
    <List className={classes.list}>
      <ListItem
        classes={{ root: classes.subheader }}
        onClick={() => {
          props.setScope("Global Chat");
        }}
      >
        <ListItemAvatar>
          <Avatar className={classes.globe}>
            <LanguageIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText className={classes.subheaderText} primary="Global Chat" />
      </ListItem>
      <Divider />

      {conversations && (
        <React.Fragment>
          {conversations.map((c) => (
            <ListItem
              className={classes.listItem}
              key={c._id}
              button
              onClick={() => {
                props.setUser(handleRecipient(c.recipients));
                props.setScope(handleRecipient(c.recipients).name);
                props.setConversation(c._id)
              }}
            >
              <ListItemAvatar>
                <Avatar>
                  {commonUtilites.getInitialsFromName(
                    handleRecipient(c.recipients).name
                  )}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={handleRecipient(c.recipients).name}
                secondary={<React.Fragment>{c.lastMessage}</React.Fragment>}
              />
            </ListItem>
          ))}
        </React.Fragment>
      )}
    </List>
  );
};

export default Conversations;
