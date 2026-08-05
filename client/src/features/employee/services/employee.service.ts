import { useQuery } from "@tanstack/react-query";
import axios from "@/utils/axios";
import APIs from "@/utils/apis";
import useAppMutation from "@/react-query-config/hooks/useAppMutation";
import type { Employee } from "@/types";

export const useGetEmployees = (branchId?: string) => {
  return useQuery({
    queryKey: [APIs.EMPLOYEE.GET, branchId],
    queryFn: async () => {
      const { data } = await axios.get(APIs.EMPLOYEE.GET, { params: { branchId } });
      return data.data as Employee[];
    },
  });
};

export const useCreateEmployee = () =>
  useAppMutation<Employee, Partial<Employee>>({
    mutationFn: async (payload) => {
      const { data } = await axios.post(APIs.EMPLOYEE.CREATE, payload);
      return data.data;
    },
    successMsg: "Employee added",
    invalidateQueryKeys: [APIs.EMPLOYEE.GET],
  });

export const useUpdateEmployee = () =>
  useAppMutation<Employee, { id: string; payload: Partial<Employee> }>({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axios.post(`${APIs.EMPLOYEE.UPDATE__id}${id}`, payload);
      return data.data;
    },
    successMsg: "Employee updated",
    invalidateQueryKeys: [APIs.EMPLOYEE.GET],
  });

export const useDeleteEmployee = () =>
  useAppMutation<{ id: string }, string>({
    mutationFn: async (id) => {
      const { data } = await axios.post(`${APIs.EMPLOYEE.DELETE__id}${id}`);
      return data.data;
    },
    successMsg: "Employee removed",
    invalidateQueryKeys: [APIs.EMPLOYEE.GET],
  });
