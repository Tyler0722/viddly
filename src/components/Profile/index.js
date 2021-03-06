import React from "react";

const Profile = (props) => {
  const { profile } = props;
  if (profile === undefined) {
    return null;
  }
  return (
    <div>
      <img src={profile.profile_pic} />
      <div>{profile.username}</div>
    </div>
  );
};

export default Profile;
