import request from "@/utils/request";  

const API = {
    LOGIN_URL: '/user/login',
    LOGOUT_URL: '/user/logout',
    REGISTER_URL: '/user/register',
    SEND_VERIFICATION_CODE_URL: '/user/send-verification-code',
    RESET_PASSWORD_URL: '/user/reset-password',
    UPDATE_USERNAME_URL: '/user/update-username',
    UPDATE_AVATAR_URL: '/user/avatar',
} as const;

export const reqLogin = (data: { email: string; password: string }) => {
    return request.post<any>(API.LOGIN_URL, data);
}

export const reqLogout = () => {
    return request.post<any>(API.LOGOUT_URL);
}

export const reqRegister = (data: { username: string; password: string; email: string; code: string  }) => {
    return request.post<any>(API.REGISTER_URL, data);
}

export const reqSendVerificationCode = (data: { email: string ; type: string}) => {
    return request.post<any>(API.SEND_VERIFICATION_CODE_URL, data);
}

export const reqResetPassword = (data: { 
  email: string; 
  code: string; 
  newPassword: string 
}) => {
    return request.post<any>(API.RESET_PASSWORD_URL, data);
}

export const reqUpdateUsername = (data: { 
  username: string; 
}) => {
    return request.put<any>(API.UPDATE_USERNAME_URL, data);
}

export const reqUpdateAvatar = (data: { 
  email: string,
  formData: FormData; 
}) => {
    return request.put<{ avatarUrl: string }>(API.UPDATE_AVATAR_URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}