
import { signupUser, loginUser } from "../service/user-service.js";

// Signup API
export const signup = async function (req, res) {
    return signupUser(req, res);
};

// Login API
export const login = async function (req, res) {
    return loginUser(req, res);
};
