import React, { useState, useEffect } from 'react';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import FileInputField from '../Common/FileInputField';
import AutoResizingTextarea from '../Posts/AutoResizingInput';
import { updatePostContent } from '../../Services/Posts/PostService';

const EditPostModal = ({ isOpen, onClose, post, onUpdate, mediaUrl }) => {
    const [content, setContent] = useState(post.content.textContent);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(mediaUrl); // Initially set to mediaUrl
    const token = localStorage.getItem('token');

    useEffect(() => {
        // Update the previewUrl whenever the mediaUrl changes
        setPreviewUrl(mediaUrl);
    }, [mediaUrl]); // Depend on mediaUrl

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            const fileUrl = URL.createObjectURL(file);
            setPreviewUrl(fileUrl); // Update the preview URL to the new file
        }
    };

    const handleSubmit = async () => {
        try {
            const updatedPost = await updatePostContent(post.id, content, file, token);
            const newMediaUrl = file ? URL.createObjectURL(file) : mediaUrl;
            onUpdate(updatedPost, newMediaUrl); // Pass the updated post and new media URL to the update handler
            onClose();
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} header="Edit Post">
            <AutoResizingTextarea text={content} onChange={handleContentChange}/>
            {previewUrl && (
                <img src={previewUrl} alt="Post" style={{ maxWidth: '100%' }} />
            )}
            <FileInputField onChange={handleFileChange}/>
            <Button onClick={handleSubmit} color="green">Save Changes</Button>
        </Modal>
    );
};

export default EditPostModal;

