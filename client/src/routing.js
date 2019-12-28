import { useState, useEffect } from "react";
import { createBrowserHistory } from "history";

export const history = createBrowserHistory();

export function useLocation() {
    const [location, setLocation] = useState(history.location);
    useEffect(() => history.listen(location => setLocation(location)));
    return location;
}
