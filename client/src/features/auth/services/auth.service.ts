import axios from "@/utils/axios";
import APIs from "@/utils/apis";
import { Storage } from "@/utils/storage";
import useAppMutation from "@/react-query-config/hooks/useAppMutation";
import { useAppDispatch } from "@/redux/hooks";
import { loginSuccess, type AuthUser } from "@/redux/authSlice";

interface LoginPayload {
  email: string;
  password: string;
  role: "EMPLOYEE" | "ADMIN";
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  role: "ADMIN" | "EMPLOYEE";
  branchId?: string | null;
}

interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
  branchId?: string | null;
}

export const useLogin = () => {
  const dispatch = useAppDispatch();

  return useAppMutation<AuthUser, LoginPayload>({
    mutationFn: async (payload) => {
      const { data } = await axios.post(APIs.AUTH.LOGIN, {
        email: payload.email,
        password: payload.password,
      });
      const auth = data.data as AuthTokens;

      await Storage.set("auth_user", {
        token: auth.accessToken,
        refreshToken: auth.refreshToken,
      } as AuthUser);

      const { data: profileData } = await axios.get(APIs.EMPLOYEE.ME);
      const employee = profileData.data as EmployeeProfile;

      return {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        role: employee.role === "ADMIN" ? "ADMIN" : "EMPLOYEE",
        token: auth.accessToken,
        refreshToken: auth.refreshToken,
        branchId: auth.branchId ?? employee.branchId ?? undefined,
      } as AuthUser;
    },
    successMsg: "Welcome back",
    onSuccess: (user) => {
      dispatch(loginSuccess(user));
    },
  });
};
