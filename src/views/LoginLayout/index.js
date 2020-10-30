import React from 'react';
import { Layout } from 'antd';

class MainLayout extends React.PureComponent {
  render() {
    const { children } = this.props;

    return (
      <Layout>
        <Layout>
          <Layout.Content>{children}</Layout.Content>
        </Layout>
      </Layout>
    );
  }
}

export default MainLayout;