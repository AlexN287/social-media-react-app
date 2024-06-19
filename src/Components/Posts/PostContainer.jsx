import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext.js';
import { getAllPostsByUser } from '../../Services/Posts/PostService.js';
import PostItem from './PostItem.jsx';
import MessageBanner from '../Common/MessageBanner.jsx';
import LoadingComponent from '../Common/LoadingComponent.jsx';
import { getLoggedUser, fetchUserDetails } from '../../Services/User/UserService.js';
import { useParams, useLocation } from 'react-router-dom';
import { fetchFriendsPosts } from '../../Services/Posts/PostService.js';

import '../../Styles/Components/Posts/PostContainer.css';

const PostContainer = () => {
    const { userId } = useParams();
    // const { user, loading: authLoading} = useAuth();
    const[user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //const { token } = useAuth();
    const token = localStorage.getItem('token');
    const location = useLocation();

    useEffect(() => {
        const fetchUserAndPosts = async () => {
            setLoading(true);
            try {
                if (userId) {
                    // Fetch posts for the user profile being viewed
                    const fetchedUser = await fetchUserDetails(userId, token);  
                    setUser(fetchedUser);
                    const postsData = await getAllPostsByUser(userId, token);
                    setPosts(postsData);
                } else {
                    // Fetch the logged in user's details
                    const fetchedUser = await getLoggedUser(token);
                    setUser(fetchedUser);

                    if (location.pathname === '/myprofile') {
                        // Fetch posts for the logged-in user's profile
                        const postsData = await getAllPostsByUser(fetchedUser.id, token);
                        setPosts(postsData);
                    } else if (location.pathname === '/home') {
                        // Fetch posts for the user's friends
                        const postsData = await fetchFriendsPosts(token);
                        setPosts(postsData);
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error('Failed to initialize data:', error);
                setError('Failed to initialize data');
                setLoading(false);
            }
        };

        fetchUserAndPosts();
    }, [userId, token, location.pathname]);

    const handlePostDelete = (postId) => {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    };

    const handleUpdatePost = (updatedPost, updatedMediaUrl) => {
        setPosts(currentPosts => currentPosts.map(post => {
            return post.id === updatedPost.id ? updatedPost : post;
        }));
    };    
    
    //if (authLoading || loading) return <div>Loading...</div>;
    if (error) return <MessageBanner message={error} type="error" />;
 
    return (
        <div className='post-container'>
            <h2 className='post-container-header'>{location.pathname === '/myprofile' ? 'My Posts' : 'Friends’ Posts'}</h2>
            {posts.length > 0 ? (
                posts.map(post => <PostItem key={post.id} post={post} onDelete={handlePostDelete} onUpdate={handleUpdatePost}/>)
            ) : (
                <p>No posts to display.</p> // Display a message when no posts are available
            )}
        </div>
    );
}; 

export default PostContainer;

