import React, { useState, useEffect, useRef, useCallback } from 'react';
import { formatDateOrTime } from '../../Helper/Util';
import '../../Styles/Components/ConversationPage/MessageList.css';

import { getLoggedUser } from '../../Services/User/UserService';
import { fetchMessages } from '../../Services/Message/MessageService';

const MessagesList = ({ conversationId, token, size, newMessage }) => {
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const observer = useRef();
  
    const loadMessages = useCallback(async (conversationId, page, size) => {
      if (conversationId && page < totalPages) {
        setLoading(true);
        try {
          const response = await fetchMessages(conversationId, token, page, size);
          setMessages(prevMessages => [...prevMessages, ...response.messages]);
          setTotalPages(response.totalPages);
          setLoading(false);
        } catch (err) {
          console.error(err);
          setLoading(false);
        }
      }
    }, [token, totalPages]);
  
    useEffect(() => {
      if (conversationId) {
        setPage(0);
        setMessages([]);
        loadMessages(conversationId, 0, size);
      }
    }, [conversationId, loadMessages, size]);
  
    useEffect(() => {
      const fetchLoggedUser = async () => {
        try {
          const user = await getLoggedUser(token);
          setLoggedInUser(user);
        } catch (error) {
          console.error('Error fetching logged user:', error);
        }
      };
  
      if (token) {
        fetchLoggedUser();
      }
    }, [token]);
  
    useEffect(() => {
      if (newMessage) {
        setMessages(prevMessages => [...prevMessages, newMessage]);
      }
    }, [newMessage]);
  
    const lastMessageRef = useCallback(node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && page < totalPages - 1) {
          setPage(prevPage => {
            const nextPage = prevPage + 1;
            loadMessages(conversationId, nextPage, size);
            return nextPage;
          });
        }
      });
      if (node) observer.current.observe(node);
    }, [loading, page, totalPages, loadMessages, conversationId, size]);
  
    return (
      <div className="messages-list">
        {messages.map((message, index) => {
          if (index === messages.length - 1) {
            return (
              <div ref={lastMessageRef} key={index} className="message-block">
                <div className='message-timestamp'>
                  {formatDateOrTime(message.timestamp)}
                </div>
                <div className={`message ${message.senderId === loggedInUser?.id ? 'you' : 'them'}`}>
                  <span>{message.content}</span>
                </div>
              </div>
            );
          } else {
            return (
              <div key={index} className="message-block">
                <div className='message-timestamp'>
                  {formatDateOrTime(message.timestamp)}
                </div>
                <div className={`message ${message.senderId === loggedInUser?.id ? 'you' : 'them'}`}>
                  <span>{message.content}</span>
                </div>
              </div>
            );
          }
        })}
      </div>
    );
  };
  
  export default MessagesList;