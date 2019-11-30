import React from "react";

import * as Styled from "./style";

const Avatar = (props) => {
  const { user, size = 40, style } = props;

  const source = ["https://images.unsplash.com/photo-1543424449-1601e35ecc4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"];

  return <Styled.Avatar size={size} src={source} style={style}></Styled.Avatar>;
};

export default Avatar;
