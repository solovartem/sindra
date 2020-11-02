import React from "react";
import {
  SpinnerWrapper,
  SubText,
  LoadingWrapper,
  SubTextBlack,
} from "./styled";

const Loading = props => {
  const { subtext, color } = props;
  return (
    <LoadingWrapper>
      <SpinnerWrapper>
        <div className="main-circle" />
      </SpinnerWrapper>
      {subtext && color === "black" ? (
        <SubTextBlack>{subtext}</SubTextBlack>
      ) : (
        <SubText>{subtext}</SubText>
      )}
    </LoadingWrapper>
  );
};

export default Loading;
