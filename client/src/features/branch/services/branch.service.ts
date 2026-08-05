import { useQuery } from "@tanstack/react-query";
import axios from "@/utils/axios";
import APIs from "@/utils/apis";
import useAppMutation from "@/react-query-config/hooks/useAppMutation";
import type { Branch } from "@/types";

export const useGetBranches = () => {
  return useQuery({
    queryKey: [APIs.BRANCH.GET],
    queryFn: async () => {
      const { data } = await axios.get(APIs.BRANCH.GET);
      return data.data as Branch[];
    },
  });
};

export const useCreateBranch = () =>
  useAppMutation<Branch, Partial<Branch>>({
    mutationFn: async (payload) => {
      const { data } = await axios.post(APIs.BRANCH.CREATE, payload);
      return data.data;
    },
    successMsg: "Branch created",
    invalidateQueryKeys: [APIs.BRANCH.GET],
  });

export const useUpdateBranch = () =>
  useAppMutation<Branch, { id: string; payload: Partial<Branch> }>({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axios.post(`${APIs.BRANCH.UPDATE__id}${id}`, payload);
      return data.data;
    },
    successMsg: "Branch updated",
    invalidateQueryKeys: [APIs.BRANCH.GET],
  });

export const useDeleteBranch = () =>
  useAppMutation<{ id: string }, string>({
    mutationFn: async (id) => {
      const { data } = await axios.post(`${APIs.BRANCH.DELETE__id}${id}`);
      return data.data;
    },
    successMsg: "Branch deleted",
    invalidateQueryKeys: [APIs.BRANCH.GET],
  });
