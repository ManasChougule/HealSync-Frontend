import { jwtDecode } from "jwt-decode";
export function checkTokenValidity(logoutCallback) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.token) {
    logoutCallback();
    return;
  }
  try {
    const decoded = jwtDecode(user.token);
    const now = Date.now() / 1000;
    // console.log("now",now)
    if (decoded.exp && decoded.exp < now) {
      alert("Session expired, please login again.");
      localStorage.removeItem("user");
      logoutCallback();
    }
  } catch (e) {
    console.error("Invalid token:", e);
    localStorage.removeItem("user");
    logoutCallback();
  }
}
