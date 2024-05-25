import React from 'react';
import UserProfileImage from '../Common/ProfileImage'; // Adjust the path as needed
import '../../Styles/Components/ModeratorPage/ReportList.css';
import { formatDateOrTime } from '../../Helper/Util';
import Button from '../Common/Button';
import { deleteReport } from '../../Services/Report/ReportService';

const ReportsListComponent = ({ reports, onDeleteReport}) => {
    const token = localStorage.getItem('token');
    
    return (
        <div className='reports-list-container'>
            <h1>Reports</h1>
            {reports ? (
                <div className="report-details">
                    <ul>
                        {reports.map(report => (
                            <li key={report.id}>
                                <p>Reported by: {report.user.username}</p>
                                <p>Reason: {report.reason}</p>
                                <p>Time: {formatDateOrTime(report.reportTime)}</p>
                                <Button color={'red'} onClick={() => onDeleteReport(report.id)}>Delete Report</Button>
                            </li>
                        ))}

                    </ul>
                </div>
            ) : (
                <div className="no-reports-message">
                    <p>Please select a post to view its reports.</p>
                </div>
            )}
        </div>
    );
};

export default ReportsListComponent;

