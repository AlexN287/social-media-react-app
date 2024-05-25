import React, { useState } from 'react';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import InputField from '../Auth/InputField';
import '../../Styles/Components/Posts/ReportPostModal.css';

const REPORT_REASONS = [
    'Spam',
    'Harassment',
    'Hate Speech',
    'Violence',
    'Misinformation',
    'Other'
  ];

const ReportPostModal = ({ isOpen, onClose, onSubmit }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const handleReasonChange = (event) => {
    setSelectedReason(event.target.value);
  };

  const handleCustomReasonChange = (event) => {
    setCustomReason(event.target.value);
  };

  const handleSubmit = () => {
    if (selectedReason) {
      const reason = selectedReason === 'Other' ? customReason : selectedReason;
      onSubmit(reason);
      onClose();
    } else {
      alert('Please select a reason.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} header="Report Post">
      <div>
        <select id="report-reason" value={selectedReason} onChange={handleReasonChange} className="report-styled-select">
          <option value="">--Select a reason--</option>
          {REPORT_REASONS.map((reason, index) => (
            <option key={index} value={reason}>
              {reason}
            </option>
          ))}
        </select>
        {selectedReason === 'Other' && (
          <InputField type="text" name="report-input" placeholder="Please specify" value={customReason} onChange={handleCustomReasonChange}/>
        )}
      </div>
      <Button color="green" onClick={handleSubmit}>Submit</Button>
    </Modal>
  );
};

export default ReportPostModal;
