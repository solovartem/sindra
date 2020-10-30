import React from 'react';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const TabsComponent = ({
  defaultActiveKey,
  onChange,
  tabs = [],
    activeKey,
  ...otherProps
}) => {
  return (
    <div className={`${activeKey !== 'Recommended Strategies' ? 'site-layout-background' : ''}`}>
      <Tabs defaultActiveKey={defaultActiveKey} onChange={onChange} {...otherProps}>
        { tabs.map(({ title, component, tab }) => (
          <TabPane forceRender tab={tab} key={title} className={`${activeKey !== 'Recommended Strategies' ? 'padding-24' : 'margin-top-16'}`}>
            {component}
          </TabPane>
        ))}
      </Tabs>
    </div>
  )
};

export default TabsComponent;
