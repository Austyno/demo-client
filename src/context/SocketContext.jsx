import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { API_URL } from '../config';
import toast from 'react-hot-toast';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (user && user.id) {
            const newSocket = io(API_URL);
            setSocket(newSocket);

            newSocket.emit('join', user.id);

            newSocket.on('newMessage', (message) => {
                setUnreadCount(prev => prev + 1);
                toast.success(
                    <div onClick={() => window.dispatchEvent(new CustomEvent('openChat', { detail: message }))} style={{ cursor: 'pointer' }}>
                        <strong>{message.sender.username}</strong>: {message.title}
                    </div>,
                    { duration: 5000, position: 'top-right' }
                );
            });

            // Fetch initial unread count
            const fetchUnread = async () => {
                const token = localStorage.getItem('token');
                try {
                    const response = await fetch(`${API_URL}/api/messages/unread`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setUnreadCount(data.count);
                    } else if (response.status === 401 || response.status === 403) {
                        // Handled by Axios interceptor globally if using axios, 
                        // but here we use fetch. Let's logout manually if needed or just log.
                        console.error('Auth error fetching unread count');
                    }
                } catch (error) {
                    console.error('Error fetching unread count', error);
                }
            };
            fetchUnread();

            return () => newSocket.close();
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [user]);

    const decrementUnread = () => setUnreadCount(prev => Math.max(0, prev - 1));

    return (
        <SocketContext.Provider value={{ socket, unreadCount, decrementUnread, setUnreadCount }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
