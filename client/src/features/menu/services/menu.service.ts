import { useQuery } from "@tanstack/react-query";
import axios from "@/utils/axios";
import APIs from "@/utils/apis";
import useAppMutation from "@/react-query-config/hooks/useAppMutation";
import type { MenuCategory, MenuItem } from "@/types";

// ---------- Categories ----------

export const useGetCategories = (branchId?: string) => {
  return useQuery({
    queryKey: [APIs.CATEGORY.GET, branchId],
    queryFn: async () => {
      const { data } = await axios.get(APIs.CATEGORY.GET, { params: { branchId } });
      return data.data as MenuCategory[];
    },
    enabled: Boolean(branchId),
  });
};

export const useCreateCategory = () =>
  useAppMutation<MenuCategory, Partial<MenuCategory> & { branchId: string }>({
    mutationFn: async (payload) => {
      const { data } = await axios.post(APIs.CATEGORY.CREATE, payload);
      return data.data;
    },
    successMsg: "Category created",
    invalidateQueryKeys: [APIs.CATEGORY.GET],
  });

export const useUpdateCategory = () =>
  useAppMutation<MenuCategory, { id: string; payload: Partial<MenuCategory> }>({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axios.patch(`${APIs.CATEGORY.UPDATE__id}${id}`, payload);
      return data.data;
    },
    successMsg: "Category updated",
    invalidateQueryKeys: [APIs.CATEGORY.GET],
  });

export const useDeleteCategory = () =>
  useAppMutation<{ id: string }, string>({
    mutationFn: async (id) => {
      const { data } = await axios.delete(`${APIs.CATEGORY.DELETE__id}${id}`);
      return data.data;
    },
    successMsg: "Category deleted",
    invalidateQueryKeys: [APIs.CATEGORY.GET, APIs.MENU.GET],
  });

// ---------- Items ----------

interface ApiMenuItem {
  id: string;
  categoryId: string;
  branchId: string;
  name: string;
  description?: string;
  image?: string;
  price: number | string;
  isVeg: boolean;
  isAvailable: boolean;
}

const mapMenuItem = (i: ApiMenuItem): MenuItem => ({
  id: i.id,
  categoryId: i.categoryId,
  branchId: i.branchId,
  name: i.name,
  description: i.description ?? "",
  image: i.image ?? "",
  price: Number(i.price),
  isVeg: i.isVeg,
  isAvailable: i.isAvailable,
});

interface GetItemsParams {
  branchId?: string;
  categoryId?: string;
  search?: string;
}

export const useGetItems = (params: GetItemsParams) => {
  return useQuery({
    queryKey: [APIs.MENU.GET, params],
    queryFn: async () => {
      const { data } = await axios.get(APIs.MENU.GET, { params: { ...params, limit: 100 } });
      return (data.data?.items ?? data.data ?? []).map(mapMenuItem) as MenuItem[];
    },
    enabled: Boolean(params.branchId),
  });
};

export const useCreateItem = () =>
  useAppMutation<MenuItem, Partial<MenuItem> & { branchId: string }>({
    mutationFn: async (payload) => {
      const { data } = await axios.post(APIs.MENU.CREATE, payload);
      return mapMenuItem(data.data as ApiMenuItem);
    },
    successMsg: "Menu item created",
    invalidateQueryKeys: [APIs.MENU.GET],
  });

export const useUpdateItem = () =>
  useAppMutation<MenuItem, { id: string; payload: Partial<MenuItem> }>({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axios.patch(`${APIs.MENU.UPDATE__id}${id}`, payload);
      return mapMenuItem(data.data as ApiMenuItem);
    },
    successMsg: "Menu item updated",
    invalidateQueryKeys: [APIs.MENU.GET],
  });

export const useDeleteItem = () =>
  useAppMutation<{ id: string }, string>({
    mutationFn: async (id) => {
      const { data } = await axios.delete(`${APIs.MENU.DELETE__id}${id}`);
      return data.data;
    },
    successMsg: "Menu item deleted",
    invalidateQueryKeys: [APIs.MENU.GET],
  });

export const useToggleItemAvailability = () =>
  useAppMutation<MenuItem, { id: string; isAvailable: boolean }>({
    mutationFn: async ({ id, isAvailable }) => {
      const { data } = await axios.patch(`${APIs.MENU.UPDATE__id}${id}`, { isAvailable });
      return mapMenuItem(data.data as ApiMenuItem);
    },
    successMsg: "Availability updated",
    invalidateQueryKeys: [APIs.MENU.GET],
    succssMsgVisibility: false,
  });
