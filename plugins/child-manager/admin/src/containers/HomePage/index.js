/*
 *
 * HomePage
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import ChildDisplay from '../../components/ChildDisplay';

const HomePage = () => {

  //let child = await strapi.query('child').find({limit:1});
  // console.log("hello");

  return (
    <ChildDisplay />
  );
};

export default memo(HomePage);
