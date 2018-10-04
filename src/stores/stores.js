import { store } from "rfx-core";

import AppState from "./AppState";
import BillingState from "./BillingState";

export default store.setup({
	appState: AppState,
	billingState: BillingState,
});
