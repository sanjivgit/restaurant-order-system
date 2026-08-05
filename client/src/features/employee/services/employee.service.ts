import { useQuery } from "@tanstack/react-query";
import axios from "@/utils/axios";
import APIs from "@/utils/apis";
import useAppMutation from "@/react-query-config/hooks/useAppMutation";
import type { Employee } from "@/types";

interface ApiEmployee {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  phone?: string;
  role: "ADMIN" | "EMPLOYEE";
  branchId?: string | null;
  status?: "ACTIVE" | "INACTIVE";
}

const mapEmployee = (e: ApiEmployee): Employee => ({
  id: e.id,
  employeeCode: e.employeeCode,
  name: e.name,
  email: e.email,
  phone: e.phone ?? "",
  role: e.role,
  status: e.status,
  branchId: e.branchId ?? "",
  isActive: e.status !== "INACTIVE",
});

export const useGetEmployees = (branchId?: string) => {
  return useQuery({
    queryKey: [APIs.EMPLOYEE.GET, branchId],
    queryFn: async () => {
      const { data } = await axios.get(APIs.EMPLOYEE.GET, { params: { branchId, limit: 100 } });
      return (data.data?.items ?? data.data ?? []).map(mapEmployee) as Employee[];
    },
  });
};

export const useCreateEmployee = () =>
  useAppMutation<Employee, Partial<Employee> & { password: string }>({
    mutationFn: async (payload) => {
      const { data } = await axios.post(APIs.EMPLOYEE.CREATE, payload);
      return mapEmployee(data.data as ApiEmployee);
    },
    successMsg: "Employee added",
    invalidateQueryKeys: [APIs.EMPLOYEE.GET],
  });

export const useUpdateEmployee = () =>
  useAppMutation<Employee, { id: string; payload: Partial<Employee> }>({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axios.patch(`${APIs.EMPLOYEE.UPDATE__id}${id}`, payload);
      return mapEmployee(data.data as ApiEmployee);
    },
    successMsg: "Employee updated",
    invalidateQueryKeys: [APIs.EMPLOYEE.GET],
  });

export const useDeleteEmployee = () =>
  useAppMutation<{ id: string }, string>({
    mutationFn: async (id) => {
      const { data } = await axios.delete(`${APIs.EMPLOYEE.DELETE__id}${id}`);
      return data.data;
    },
    successMsg: "Employee removed",
    invalidateQueryKeys: [APIs.EMPLOYEE.GET],
  });
