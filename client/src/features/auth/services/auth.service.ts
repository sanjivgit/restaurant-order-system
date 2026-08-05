import axios from "@/utils/axios";
import APIs from "@/utils/apis";
import useAppMutation from "@/react-query-config/hooks/useAppMutation";
import { useAppDispatch } from "@/redux/hooks";
import { loginSuccess, type AuthUser } from "@/redux/authSlice";

interface LoginPayload {
  email: string;
  password: string;
  role: "EMPLOYEE" | "ADMIN";
}

export const useLogin = () => {
  const dispatch = useAppDispatch();

  return useAppMutation<AuthUser, LoginPayload>({
    mutationFn: async (payload) => {
      const { data } = await axios.post(APIs.AUTH.LOGIN, payload);
      return data.data;
    },
    successMsg: "Welcome back",
    onSuccess: (user) => {
      dispatch(loginSuccess(user));
    },
  });
};
