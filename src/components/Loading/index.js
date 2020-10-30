import React from 'react';
import { SpinnerWrapper, SubText, LoadingWrapper } from './styled';

const Loading = (props) => {
  const { subtext } = props;
  return (
    <LoadingWrapper>
      <SpinnerWrapper>
        <div className="main-circle" />
      </SpinnerWrapper>
      {subtext && <SubText>{subtext}</SubText>}
    </LoadingWrapper>
  );
};

export default Loading;