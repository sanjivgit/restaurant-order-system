import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface AppMutationShape<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  successMsg?: string;
  errorMsg?: string;
  invalidateQueryKeys?: string[];
  succssMsgVisibility?: boolean;
  errorMsgVisibility?: boolean;
  onSuccess?: (data: TData, variables: TVariables) => void;
}

const useAppMutation = <TData, TVariables>({
  mutationFn,
  successMsg,
  errorMsg,
  invalidateQueryKeys = [],
  succssMsgVisibility = true,
  errorMsgVisibility = true,
  onSuccess,
}: AppMutationShape<TData, TVariables>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      if (succssMsgVisibility && successMsg) {
        toast.success(successMsg);
      }

      invalidateQueryKeys.forEach((key) => {
        const queryKeys: string[] = Array.isArray(key) ? [...key] : [key];
        queryClient.invalidateQueries({ queryKey: queryKeys });
      });

      onSuccess?.(data, variables);
    },
    onError: (error: any) => {
      if (errorMsgVisibility) {
        let message = errorMsg;
        const status = error?.response?.status;

        if (status >= 500 && status < 600) {
          message = "Something went wrong. Please try again later.";
        } else {
          message = error?.response?.data?.message || error?.message || errorMsg;
        }

        toast.error(message || "Something went wrong");
      }
    },
  });
};

export default useAppMutation;
