import React, {useRef, useState} from 'react';
import { Layout, Menu } from 'antd';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { HomeOutlined } from '@ant-design/icons';
import { Home } from '../Home';
import { Header } from '../../components/Header';
import { InnerHeader } from '../../components/InnerHeader';

const { Content, Footer, Sider } = Layout;

const DefaultLayout = () => {
  const isError = useRef(false)
  const validateRef = useRef(false)

  const toggleError = data => {
    isError.current = data;
  }

  const setValidateRef = func => {
    validateRef.current = func
  };

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" icon={<HomeOutlined />}>
              Dashboard
              <Link to="/" />
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header />
          <InnerHeader isError={isError} validateRef={validateRef} />
          <Content style={{ margin: '0 16px' }}>
            <div style={{ minHeight: 360 }}>
              <Route exact path="/" component={props => <Home {...props} toggleError={toggleError}  setValidateRef={setValidateRef} />} />
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Company PL Inc ©2020</Footer>
        </Layout>
      </Layout>
    </Router>
  );
}

export default DefaultLayout;
