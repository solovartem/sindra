import React from "react";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import Icon from "@ant-design/icons";
import FileIcon from "../../components/Icons/FileIcon";
import EditIcon from "../../components/Icons/EditIcon";
import { Header } from "../../components/Header";
import { useState } from "react";
import { useEffect } from "react";

const { Footer, Sider } = Layout;

const DefaultLayout = ({ children }) => {
  const [selectedKey, setSelectedKey] = useState("landing");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/soa")) {
      setSelectedKey("soa-request");
    }
  }, [location.pathname]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <div className="logo" />
        <Menu
          theme="dark"
          selectedKeys={[selectedKey]}
          // defaultSelectedKeys={["landing"]}
          mode="inline"
        >
          <Menu.Item
            onClick={() => setSelectedKey("landing")}
            key="landing"
            icon={<Icon component={FileIcon} />}
          >
            <Link to="/" />
            Soa Application
          </Menu.Item>
          <Menu.Item
            onClick={() => setSelectedKey("soa-request")}
            key="soa-request"
            icon={<Icon component={EditIcon} />}
          >
            <Link to="/soa/new-request" />
            New Request
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header />
        {children}
        <Footer style={{ textAlign: "center" }}>Company PL Inc ©2020</Footer>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
