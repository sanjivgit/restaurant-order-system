import { useQuery } from "@tanstack/react-query";
import axios from "@/utils/axios";
import APIs from "@/utils/apis";
import useAppMutation from "@/react-query-config/hooks/useAppMutation";
import type { MenuCategory, MenuItem } from "@/types";

// ---------- Categories ----------

export const useGetCategories = (branchId?: string) => {
  return useQuery({
    queryKey: [APIs.MENU.CATEGORIES__GET, branchId],
    queryFn: async () => {
      const { data } = await axios.get(APIs.MENU.CATEGORIES__GET, { params: { branchId } });
      return data.data as MenuCategory[];
    },
    enabled: Boolean(branchId),
  });
};

export const useCreateCategory = () =>
  useAppMutation<MenuCategory, Partial<MenuCategory>>({
    mutationFn: async (payload) => {
      const { data } = await axios.post(APIs.MENU.CATEGORIES__CREATE, payload);
      return data.data;
    },
    successMsg: "Category created",
    invalidateQueryKeys: [APIs.MENU.CATEGORIES__GET],
  });

export const useUpdateCategory = () =>
  useAppMutation<MenuCategory, { id: string; payload: Partial<MenuCategory> }>({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axios.post(`${APIs.MENU.CATEGORIES__UPDATE__id}${id}`, payload);
      return data.data;
    },
    successMsg: "Category updated",
    invalidateQueryKeys: [APIs.MENU.CATEGORIES__GET],
  });

export const useDeleteCategory = () =>
  useAppMutation<{ id: string }, string>({
    mutationFn: async (id) => {
      const { data } = await axios.post(`${APIs.MENU.CATEGORIES__DELETE__id}${id}`);
      return data.data;
    },
    successMsg: "Category deleted",
    invalidateQueryKeys: [APIs.MENU.CATEGORIES__GET, APIs.MENU.ITEMS__GET],
  });

// ---------- Items ----------

interface GetItemsParams {
  branchId?: string;
  categoryId?: string;
  search?: string;
}

export const useGetItems = (params: GetItemsParams) => {
  return useQuery({
    queryKey: [APIs.MENU.ITEMS__GET, params],
    queryFn: async () => {
      const { data } = await axios.get(APIs.MENU.ITEMS__GET, { params });
      return data.data as MenuItem[];
    },
    enabled: Boolean(params.branchId),
  });
};

export const useCreateItem = () =>
  useAppMutation<MenuItem, Partial<MenuItem>>({
    mutationFn: async (payload) => {
      const { data } = await axios.post(APIs.MENU.ITEMS__CREATE, payload);
      return data.data;
    },
    successMsg: "Menu item created",
    invalidateQueryKeys: [APIs.MENU.ITEMS__GET],
  });

export const useUpdateItem = () =>
  useAppMutation<MenuItem, { id: string; payload: Partial<MenuItem> }>({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axios.post(`${APIs.MENU.ITEMS__UPDATE__id}${id}`, payload);
      return data.data;
    },
    successMsg: "Menu item updated",
    invalidateQueryKeys: [APIs.MENU.ITEMS__GET],
  });

export const useDeleteItem = () =>
  useAppMutation<{ id: string }, string>({
    mutationFn: async (id) => {
      const { data } = await axios.post(`${APIs.MENU.ITEMS__DELETE__id}${id}`);
      return data.data;
    },
    successMsg: "Menu item deleted",
    invalidateQueryKeys: [APIs.MENU.ITEMS__GET],
  });

export const useToggleItemAvailability = () =>
  useAppMutation<MenuItem, { id: string; isAvailable: boolean }>({
    mutationFn: async ({ id, isAvailable }) => {
      const { data } = await axios.post(`${APIs.MENU.ITEMS__AVAILABILITY__id}${id}`, { isAvailable });
      return data.data;
    },
    successMsg: "Availability updated",
    invalidateQueryKeys: [APIs.MENU.ITEMS__GET],
    succssMsgVisibility: false,
  });
