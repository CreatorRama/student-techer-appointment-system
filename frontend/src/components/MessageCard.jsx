import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box, TextField } from '@mui/material';
import { styled } from '@mui/system';

const StyledMessageCard = styled(Card)({
  marginBottom: '10px',
  backgroundColor: '#e3f2fd',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  padding: '10px',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const MessageCard = ({ message, onSendReply }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleReplyClick = () => {
    setShowReplyForm(!showReplyForm);
  };

  const handleReplyChange = (event) => {
    setReplyContent(event.target.value);
  };

  const handleSendReply = () => {
    onSendReply(message.studentName, replyContent);
    setReplyContent('');
    setShowReplyForm(false);
  };

  return (
   <>
   <span className='px-3 text-red-400'>{message.sendAt}</span>
   <span className='text-blue-400'>{message.time}</span>
    <StyledMessageCard>
      <CardContent>
        <Typography variant="body1">{message.content}</Typography>
        <Button onClick={handleReplyClick} variant="contained" color="primary" style={{ marginTop: '10px' }}>
          Reply
        </Button>
        {showReplyForm && (
          <Box mt={2}>
            <TextField
              label="Your Reply"
              multiline
              rows={4}
              value={replyContent}
              onChange={handleReplyChange}
              fullWidth
            />
            <Button
              onClick={handleSendReply}
              variant="contained"
              color="primary"
              style={{ marginTop: '10px' }}
            >
              Send
            </Button>
          </Box>
        )}
      </CardContent>
    </StyledMessageCard>
   </>
  );
};

export default MessageCard;
