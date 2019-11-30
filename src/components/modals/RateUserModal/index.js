import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import { Avatar, Button } from "components";

import { api } from "helpers/api";

import * as modalActions from "../../../actions/modals";

const Overlay = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Box = styled.div`
  background-color: #ffffff;
  width: 100%;
  max-width: 40rem;
  border-radius: 12px;
  text-align: center;
  position: relative;

  .Avatar {
    margin: 0 auto;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -5.8rem;
    border: 8px solid #ffffff;
    box-sizing: content-box;
  }

  p {
    font-size: 2.4rem;
    color: #262626;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  p + div {
    color: #a4a6b2;
    font-size: 1.6rem;
    font-weight: 500;
    padding: 0 3rem;
  }
`;

const Content = styled.div`
  padding: 5.8rem 4rem 4rem;
`;

const Buttons = styled.div`
  padding: 3rem 0 0;
`;

const RateUserModal = (props) => {
  const { user } = props;

  const handleAnswer = (like) => {
    const uid = "668096359988";
    api.post(`/users/${uid}/${like}`).then((response) => {
			props.closeModal(); 
    });
  };

  return (
    <Overlay>
      <Box>
        <Avatar size={100} user={user} />
        <Content>
          <p>Did you enjoying talking to {user.first_name}?</p>
          <div>Making friends allow you to stay connected.</div>
          <Buttons>
            <Button onClick={() => handleAnswer("like")}>Yes</Button>
            <Button type="dark" onClick={() => handleAnswer("dislike")}>
              No
            </Button>
          </Buttons>
        </Content>
      </Box>
    </Overlay>
  );
};

const mapDispatchToProps = (dispatch) => ({
	closeModal: () => dispatch(modalActions.closeModal())
});

export default connect(null, mapDispatchToProps)(RateUserModal);
