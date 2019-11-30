const initialState = {
  modalType: null,
  modalProps: {},
  isOpen: false
};

const modalReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SHOW_MODAL":
      const { modalType, modalProps } = payload;
      return {
        modalType,
        modalProps,
        isOpen: true
      };
		case "HIDE_MODAL":
			return initialState;
    default:
      return state;
  }
};

export default modalReducer;
