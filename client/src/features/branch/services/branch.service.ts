import { useQuery } from "@tanstack/react-query";
import axios from "@/utils/axios";
import APIs from "@/utils/apis";
import useAppMutation from "@/react-query-config/hooks/useAppMutation";
import type { Branch, Restaurant } from "@/types";

interface ApiBranch {
  id: string;
  restaurantId: string;
  name: string;
  address?: string;
  phone?: string;
  status?: "ACTIVE" | "INACTIVE";
}

const mapBranch = (b: ApiBranch): Branch => ({
  id: b.id,
  restaurantId: b.restaurantId,
  name: b.name,
  address: b.address ?? "",
  phone: b.phone,
  status: b.status,
  isActive: b.status !== "INACTIVE",
});

interface CreateBranchPayload {
  name: string;
  address?: string;
  phone?: string;
}

export const useGetBranches = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: [APIs.BRANCH.GET],
    queryFn: async () => {
      const { data } = await axios.get(APIs.BRANCH.GET);
      return (data.data as ApiBranch[]).map(mapBranch);
    },
    enabled: options?.enabled,
  });
};

export const useCreateBranch = () =>
  useAppMutation<Branch, CreateBranchPayload>({
    mutationFn: async (payload) => {
      const { data: restaurantData } = await axios.get(APIs.RESTAURANT.GET);
      const restaurants = restaurantData.data as Restaurant[];
      const restaurantId = restaurants[0]?.id;

      if (!restaurantId) {
        throw new Error("No restaurant found. Create a restaurant before adding a branch.");
      }

      const { data } = await axios.post(APIs.BRANCH.CREATE, { ...payload, restaurantId });
      return mapBranch(data.data as ApiBranch);
    },
    successMsg: "Branch created",
    invalidateQueryKeys: [APIs.BRANCH.GET],
  });

export const useUpdateBranch = () =>
  useAppMutation<Branch, { id: string; payload: Partial<Branch> }>({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axios.patch(`${APIs.BRANCH.UPDATE__id}${id}`, payload);
      return mapBranch(data.data as ApiBranch);
    },
    successMsg: "Branch updated",
    invalidateQueryKeys: [APIs.BRANCH.GET],
  });

export const useDeleteBranch = () =>
  useAppMutation<{ id: string }, string>({
    mutationFn: async (id) => {
      const { data } = await axios.delete(`${APIs.BRANCH.DELETE__id}${id}`);
      return data.data;
    },
    successMsg: "Branch deleted",
    invalidateQueryKeys: [APIs.BRANCH.GET],
  });
