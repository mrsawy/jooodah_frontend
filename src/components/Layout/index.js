import React, { Fragment } from "react";
import PropTypes from "prop-types";

import Header from "../Header";

const Layout = ({ children, isQuizStarted, isQuizCompleted, isQuite }) => {
  return (
    <Fragment>
      <Header isQuizStarted={isQuizStarted}  isQuizCompleted={isQuizCompleted} isQuite={isQuite} />
      <main>{children}</main>
    </Fragment>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
