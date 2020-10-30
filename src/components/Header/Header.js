import React from 'react';
import { Layout, Avatar, Row, Col, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { ReactComponent as Logo } from '../../assets/logo.svg';

const { Header } = Layout;
const { Text } = Typography;


const HeaderComponent = () => {
  return (
    <>
      <Header className="site-layout-background" style={{ padding: 0, boxShadow: '0 2px 4px 0px rgba(0, 0, 0, 0.23)', zIndex: 999 }}>
        <Row>
          <Col span={24} style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <div style={{ position: 'absolute', left: 20, marginTop: 10 }}>
              <Logo width={32} height={32}/>
            </div>
            <div style={{ position: 'absolute', left: 50 }}>
              <Text style={{ marginLeft: 10, fontSize: 25 }}>
                PlanPod
              </Text>
            </div>
            <div>
              <Avatar icon={<UserOutlined />} style={{ marginRight: '15px' }} />
              <Text style={{ textAlign: 'right', marginRight: '20px' }}>Sam Smith</Text>
            </div>
          </Col>
        </Row>
      </Header>
    </>
  )
};

export default HeaderComponent;

