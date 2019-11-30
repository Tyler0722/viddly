export const openModal = (modalType, modalProps) => ({
  type: "SHOW_MODAL",
  payload: {
    modalType,
    modalProps: modalProps || {}
  }
});

export const closeModal = () => ({
	type: "HIDE_MODAL"
});
