import { useState, useEffect } from "react";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

export default function useHistory() {
	const [location, setLocation] = useState(history.location);
	useEffect(() => history.listen(location => setLocation(location)));
	return [location, history.push];
}
