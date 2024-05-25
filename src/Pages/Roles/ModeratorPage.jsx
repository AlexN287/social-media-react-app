import React, { useState } from 'react';
import ReportedPostsComponent from '../../Components/ModeratorPage/ReportedPosts';
import Menu from '../../Components/MainPage/Menu';
import ReportsListComponent from '../../Components/ModeratorPage/ReportsListComponent';
import { deletePost } from '../../Services/Posts/PostService';
import { deleteReport } from '../../Services/Report/ReportService';

import '../../Styles/Pages/Roles/ModeratorPage.css';

const ModeratorPage = () => {
    const [reportedPosts, setReportedPosts] = useState([]);
    const [reports, setReports] = useState(null);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const token = localStorage.getItem('token');

    const handleViewReports = (post) => {
        setReports(post.reports);
        setSelectedPostId(post.id);
    };

    const handleCloseReports = () => {
        setReports(null);
    };

    
    const handleDeletePost = async (postId) => {
        try {
            await deletePost(postId, token);
            // Update the reported posts state
            setReportedPosts(reportedPosts.filter(post => post.id !== postId));
            // Clear reports if the deleted post was being viewed
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
                setReportedPosts(reportedPosts.filter(post => post.id !== selectedPostId))
                setSelectedPostId(null);
            }
        } catch (error) {
            console.error('Failed to delete report:', error);
        }
    };

    return (
        <div className='moderator-page-container'>
            <Menu />
            <div className='moderator-page-content'>
                <ReportedPostsComponent reportedPosts={reportedPosts} 
                    setReportedPosts={setReportedPosts} 
                    onViewReports={handleViewReports} 
                    onDeletePost={handleDeletePost}  />
                <ReportsListComponent reports={reports} onDeleteReport={handleDeleteReport}/>
            </div>
        </div>
    );
};

export default ModeratorPage;