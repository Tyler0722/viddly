import React from "react";
import { connect } from "react-redux";

import RateUserModal from "./RateUserModal";
import IncomingCallModal from "./IncomingCallModal";

const MODAL_COMPONENTS = {
  RATE_USER: RateUserModal,
  INCOMING_CALL: IncomingCallModal
};

const ModalRoot = ({ modalType, modalProps }) => {
  if (!modalType) {
    return null;
  }
  const SpecificModal = MODAL_COMPONENTS[modalType];
  return <SpecificModal {...modalProps} />;
};

const mapStateToProps = (state) => ({
  modalType: state.modals.modalType,
  modalProps: state.modals.modalProps
});

export default connect(mapStateToProps)(ModalRoot);
