import React, { useEffect } from 'react';
// import ReactGA, { FieldsObject } from 'react-ga';
// import { RouteComponentProps } from 'react-router';

export const withTracker = (
  WrappedComponent,
  options,
) => {
  const trackPage = (page) => {
    // ReactGA.set({ page, ...options });
    // ReactGA.pageview(page);
  };

  return (props) => {
    useEffect(() => {
      trackPage(props.location.pathname);
    }, [props.location.pathname]);

    return <WrappedComponent {...props} />;
  };
};