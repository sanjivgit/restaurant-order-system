import { useQuery } from "@tanstack/react-query";
import axios from "@/utils/axios";
import APIs from "@/utils/apis";
import useAppMutation from "@/react-query-config/hooks/useAppMutation";
import type { Table } from "@/types";

interface ApiTable {
  id: string;
  branchId: string;
  tableNumber: string;
  qrCodeUrl?: string;
  isActive: boolean;
}

const mapTable = (t: ApiTable): Table => ({
  id: t.id,
  branchId: t.branchId,
  tableNumber: t.tableNumber,
  qrCodeUrl: t.qrCodeUrl,
  isActive: t.isActive,
});

export const useGetTables = (branchId?: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: [APIs.TABLE.GET, branchId],
    queryFn: async () => {
      const { data } = await axios.get(APIs.TABLE.GET, { params: { branchId } });
      return (data.data ?? []).map(mapTable) as Table[];
    },
    enabled: Boolean(branchId) && options?.enabled !== false,
  });
};

interface CreateTablePayload {
  branchId: string;
  tableNumber: string;
  isActive?: boolean;
}

export const useCreateTable = () =>
  useAppMutation<Table, CreateTablePayload>({
    mutationFn: async (payload) => {
      const { data } = await axios.post(APIs.TABLE.CREATE, payload);
      return mapTable(data.data as ApiTable);
    },
    successMsg: "Table created",
    invalidateQueryKeys: [APIs.TABLE.GET],
  });

export const useUpdateTable = () =>
  useAppMutation<Table, { id: string; payload: Partial<Table> }>({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axios.patch(`${APIs.TABLE.UPDATE__id}${id}`, payload);
      return mapTable(data.data as ApiTable);
    },
    successMsg: "Table updated",
    invalidateQueryKeys: [APIs.TABLE.GET],
  });

export const useDeleteTable = () =>
  useAppMutation<{ id: string }, string>({
    mutationFn: async (id) => {
      const { data } = await axios.delete(`${APIs.TABLE.DELETE__id}${id}`);
      return data.data;
    },
    successMsg: "Table deleted",
    invalidateQueryKeys: [APIs.TABLE.GET],
  });
