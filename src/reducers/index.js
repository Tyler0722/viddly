import { combineReducers } from "redux";

import modals from "./modals";

const getReducers = () => combineReducers({
	modals
});

export default getReducers;
