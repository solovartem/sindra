import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { submitFeedback } from '../../axios/login';
import GrinningEmoticon from '../../assets/grinning-emoticon.svg';
import InLoveEmoticon from '../../assets/in-love-emoticon.svg';
import MadEmoticon from '../../assets/mad-emoticon.svg';
import SadEmoticon from '../../assets/sad-emoticon.svg';
import NeutralEmoticon from '../../assets/neutral-emoticon.svg';

const { TextArea } = Input;

const Feedback = ({ showFeedbackModal, feedbackEmail }) => {
  const [showModal, toggleModal] = useState(showFeedbackModal);
  const [ratingValue, changeRatingValue] = useState(0);
  const [ratingText, changeRatingText] = useState('');

  const onSubmitFeedback = () => {
    const payload = { ratingValue, ratingText };
    submitFeedback(payload).then(response => {
      toggleModal(false);
    }).catch(err => {
      toggleModal(false);
    });
  };

  return (
    <>
      <Modal centered visible={showModal} footer={null} onCancel={() => toggleModal(false)} width={650}>
        <div className="modal-data">
          <div className="text-center">
            <CheckCircleFilled style={{ fontSize: '82px', color: '#52c41a' }} />
          </div>
          <h1>Submission Success</h1>
          <p>
            Help us improve the experience. Drop your feedback below. We've sent a copy to your email address <b>{feedbackEmail}</b>
          </p>
          <div className={`feedback-icon-wrapper ${!!ratingValue ? 'opacity' : ''}`}>
            <div
              className={`feedback-icon ${ratingValue === 1 ? 'selected' : ''}`}
              onClick={() => changeRatingValue(1)}
            >
              <img src={MadEmoticon} alt="" />
              <span>Hate</span>
            </div>
            <div
              className={`feedback-icon ${ratingValue === 2 ? 'selected' : ''}`}
              onClick={() => changeRatingValue(2)}
            >
              <img src={SadEmoticon} alt="" />
              <span>Dislike</span>
            </div>
            <div
              className={`feedback-icon ${ratingValue === 3 ? 'selected' : ''}`}
              onClick={() => changeRatingValue(3)}
            >
              <img src={NeutralEmoticon} alt="" />
              <span>Neutral</span>
            </div>
            <div
              className={`feedback-icon ${ratingValue === 4 ? 'selected' : ''}`}
              onClick={() => changeRatingValue(4)}
            >
              <img src={GrinningEmoticon} alt="" />
              <span>Like</span>
            </div>
            <div
              className={`feedback-icon ${ratingValue === 5 ? 'selected' : ''}`}
              onClick={() => changeRatingValue(5)}
            >
              <img src={InLoveEmoticon} alt="" />
              <span>Love</span>
            </div>
          </div>
          <TextArea
            rows={3}
            style={{ resize: 'none' }}
            placeholder="Tell us about your experience"
            onChange={e => changeRatingText(e.target.value)}
            value={ratingText}
          />
        </div>
        <div className="modal-footer">
          <Button type="primary" size="large" onClick={onSubmitFeedback}>Done</Button>
        </div>
      </Modal>
    </>
  )
};

export default Feedback;
