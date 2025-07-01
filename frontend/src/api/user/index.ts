import request from "@/utils/request";  

const API = {
    LOGIN_URL: '/user/login',
    USER_INFO_URL: '/user/info',
    LOGOUT_URL: '/user/logout',
    REGISTER_URL: '/user/register',
} as const;

export const reqLogin = (data: { username: string; password: string }) => {
    return request.post<any>(API.LOGIN_URL, data);
}

export const reqUserInfo = () => {
    return request.get<any>(API.USER_INFO_URL);
}

export const reqLogout = () => {
    return request.post<any>(API.LOGOUT_URL);
}

export const reqRegister = (data: { username: string; password: string; email: string }) => {
    return request.post<any>(API.REGISTER_URL, data);
}