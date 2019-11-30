import React from "react";
import styled from "styled-components";

import { Avatar, Button } from "components";

const HOBBIES = ["programming", "biking", "drawing", "filming", "skating"];

const colors = {
  programming: {
    color: "#f8d64a",
    borderColor: "#fbe58c",
    backgroundColor: "#fefbee"
  },
  biking: {
    color: "#f96a10",
    borderColor: "#fcb487",
    backgroundColor: "#fef4ed"
  },
  drawing: {
    color: "#02e079",
    borderColor: "#81f0bc",
    backgroundColor: "#ebfdf5"
  },
  filming: {
    color: "#4FD2E0",
    borderColor: "#A7E9F0",
    backgroundColor: "#F2FCFD"
  },
  skating: {
    color: "#22B7FF",
    borderColor: "#8CDAFF",
    backgroundColor: "#EEF9FF"
  }
};

export const StyledProfileCard = styled.div`
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  max-width: 38rem;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .Avatar {
    width: 100%;
    /* height: 38rem; */
    height: 0;
    padding-top: 100%;
    margin-right: 1.6rem;
  }
`;

export const StyledHobby = styled.li`
  display: inline-block;
  padding: 0.4rem 1.4rem;
  margin-right: 0.8rem;
  margin-bottom: 0.8rem;
  border: 2px solid ${(props) => props.borderColor || "#e3e8eb"};
  background-color: ${(props) => props.backgroundColor || "#ffffff"};
  color: ${(props) => props.color || "#373339"};
  border-radius: 4px;
  text-transform: uppercase;
  font-size: 1.2rem;
  font-weight: 500;
`;

const ProfileCard = (props) => {
  const { profile: user, onRequest } = props;
  return (
    <StyledProfileCard>
      <Avatar className="avatar" size={60} user={user} />
      <div>
        <h5>
          {user.first_name} {user.last_name}
        </h5>
        <span>{user.username}</span>
        <ul>
          {HOBBIES.map((hobby, index) => {
            const color = colors[hobby];
            return <StyledHobby {...color} key={index}>{hobby}</StyledHobby>;
          })}
        </ul>
        <Button onClick={() => onRequest(user)}>Request</Button>
      </div>
    </StyledProfileCard>
  );
};

export default ProfileCard;
