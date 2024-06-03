import React, { useState } from 'react';
import ReportedPostsComponent from '../../Components/ModeratorPage/ReportedPosts';
import Menu from '../../Components/MainPage/Menu';
import ReportsListComponent from '../../Components/ModeratorPage/ReportsListComponent';
import { deletePost } from '../../Services/Posts/PostService';
import { deleteReport } from '../../Services/Report/ReportService';
import useSwipe from '../../Hooks/Common/useSwipe';

import '../../Styles/Pages/Roles/ModeratorPage.css';

const ModeratorPage = () => {
    const [reportedPosts, setReportedPosts] = useState([]);
    const [reports, setReports] = useState(null);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [showReports, setShowReports] = useState(false);
    const token = localStorage.getItem('token');

    const handleViewReports = (post) => {
        setReports(post.reports);
        setSelectedPostId(post.id);
        setShowReports(true);
    };

    const handleCloseReports = () => {
        setReports(null);
        setShowReports(false);
    };

    const handleDeletePost = async (postId) => {
        try {
            await deletePost(postId, token);
            setReportedPosts(reportedPosts.filter(post => post.id !== postId));
            setReports(null);
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    const handleDeleteReport = async (reportId) => {
        try {
            await deleteReport(reportId, token);
            const updatedReports = reports.filter(report => report.id !== reportId);
            setReports(updatedReports);

            setReportedPosts(reportedPosts.map(post => {
                if (post.id === selectedPostId) {
                    return { ...post, reports: updatedReports };
                }
                return post;
            }));
            if (updatedReports.length === 0) {
                setReports(null);
                setReportedPosts(reportedPosts.filter(post => post.id !== selectedPostId));
                setSelectedPostId(null);
                setShowReports(false);
            }
        } catch (error) {
            console.error('Failed to delete report:', error);
        }
    };

    const handleSwipeLeft = () => {
        setShowReports(true); // Swipe left action
    };

    const handleSwipeRight = () => {
        setShowReports(false); // Swipe right action
    };

    useSwipe(handleSwipeLeft, handleSwipeRight);

    return (
        <div className='moderator-page-container'>
            <Menu />
            <div className='moderator-page-content'>
                <div className={`reported-posts-container ${showReports ? 'hide' : ''}`}>
                    <ReportedPostsComponent 
                        reportedPosts={reportedPosts} 
                        setReportedPosts={setReportedPosts} 
                        onViewReports={handleViewReports} 
                        onDeletePost={handleDeletePost}  
                    />
                </div>
                <div className={`reports-container ${showReports ? 'show' : ''}`}>
                    <ReportsListComponent 
                        reports={reports} 
                        onDeleteReport={handleDeleteReport}
                        onCloseReports={handleCloseReports}
                    />
                </div>
            </div>
        </div>
    );
};

export default ModeratorPage;