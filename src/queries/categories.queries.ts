"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  AddMerchCategoryPayload,
  EditMerchCategoryPayload,
} from "../types/merchCategories.types";
import axios from "axios";
import { MerchandiseCategory } from "../lib/prisma/generated/client";

const STALE_TIME = 1000 * 60 * 5;

export const getCategoriesQuery = () => {
  return useQuery<MerchandiseCategory[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get("/api/merchandise/categories");
      return response.data.data;
    },
    staleTime: STALE_TIME,
  });
};

export const getCategoryQuery = (categoryId?: number) => {
  return useQuery<MerchandiseCategory>({
    queryKey: ["categories", categoryId],
    queryFn: async () => {
      const response = await axios.get(
        `/api/merchandise/categories/${categoryId}`,
      );
      return response.data;
    },
    staleTime: STALE_TIME,
    enabled: !!categoryId,
  });
};

export const useAddCategoriesQuery = () => {
  const queryClient = useQueryClient();
  return useMutation<
    MerchandiseCategory,
    Error,
    AddMerchCategoryPayload,
    { prevCategories?: MerchandiseCategory[] }
  >({
    mutationFn: async (data) => {
      const response = await axios.post("/api/merchandise/categories", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err, g, context: any) => {
      if (context?.prevCategories) {
        queryClient.setQueryData(["categories"], context.prevCategories);
      }
    },
  });
};

export const useEditCategoriesQuery = () => {
  const queryClient = useQueryClient();
  return useMutation<
    MerchandiseCategory,
    Error,
    EditMerchCategoryPayload & { id: number }
  >({
    mutationFn: async (catData) => {
      const { id, ...rest } = catData;
      const { data } = await axios.put(`/api/merchandise/categories/${id}`, rest);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err, g, context: any) => {
      if (context?.prevCategories) {
        queryClient.setQueryData(["categories"], context.prevCategories);
      }
    },
  });
};

export const useDeleteCategoriesQuery = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: number }>({
    mutationFn: async ({ id }) => {
      await axios.delete(`/api/merchandise/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err, g, context: any) => {
      if (context?.prevCategories) {
        queryClient.setQueryData(["categories"], context.prevCategories);
      }
    },
  });
};