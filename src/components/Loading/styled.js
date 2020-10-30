import styled, { keyframes } from 'styled-components';

export const Spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const SpinnerWrapper = styled.div`
  height: 30px;
  .main-circle {
    background-color: rgba(0, 0, 0, 0);
    border: 2px solid #f3f3f3;
    opacity: 0.9;
    border-top: 2px solid black;
    border-left: 2px solid black;
    border-radius: 50px;
    width: 30px;
    height: 30px;
    animation: ${Spin} 800ms infinite linear;
  }
`;

export const SubText = styled.span`
  color: white;
  margin-top: 10px;
`;