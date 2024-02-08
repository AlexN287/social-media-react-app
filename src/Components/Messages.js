import React, { useEffect } from 'react';

const Messages = ({ setIsCompact }) => {
  useEffect(() => {
    setIsCompact(true);
    return () => setIsCompact(false); // Reset to false when component unmounts
  }, [setIsCompact]);

  return (
    <div>
      {/* Messages content */}
    </div>
  );
};

export default Messages;
