import { jwtDecode } from "jwt-decode";

const jwtDecoder = (jwt) => {
	const decoded = jwtDecode(jwt);
	return decoded;
};

export default jwtDecoder;
