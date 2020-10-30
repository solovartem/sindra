
import styled from 'styled-components';

export const LoginMain = styled.div`
  background-image: url('http://sgp18.siteground.asia/~whistle4/images/green_bg.png');
  height: 100vh;
  background-repeat: no-repeat;
  background-position: center 80%;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  &:after {
    content: '';
    width: 100%;
    height: 100vh;
    position: absolute;
    top: 0px;
    left: 0px;
    background: rgba(54, 46, 69, 0.3);
  }
`;

export const ErrorMsg = styled.span`
  color: red;
`;