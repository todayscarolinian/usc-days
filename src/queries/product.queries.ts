"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  AddMerchProductPayload,
  DeleteMerchProductPayload,
  EditMerchProductPayload,
} from "../types/merchProducts.types";
import axios from "axios";
import { MerchandiseProduct } from "../lib/prisma/generated/client";

const STALE_TIME = 1000 * 60 * 5;

interface GetProductsParams {
  categoryId?: number;
  isAvailable?: boolean;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  search?: string;
}

export const getProductsQuery = (params?: GetProductsParams) => {
  return useQuery<MerchandiseProduct[]>({
    queryKey: ["products", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.categoryId)
        queryParams.append("categoryId", params.categoryId.toString());
      if (params?.isAvailable !== undefined)
        queryParams.append("isAvailable", params.isAvailable.toString());
      if (params?.minPrice)
        queryParams.append("minPrice", params.minPrice.toString());
      if (params?.maxPrice)
        queryParams.append("maxPrice", params.maxPrice.toString());
      if (params?.size) queryParams.append("size", params.size);
      if (params?.search) queryParams.append("search", params.search);

      const url = `/api/products${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const response = await axios.get(url);
      return response.data.products;
    },
    staleTime: STALE_TIME,
  });
};

export const useAddProductsQuery = () => {
  const queryClient = useQueryClient();
  return useMutation<
    MerchandiseProduct,
    Error,
    AddMerchProductPayload,
    { prevProducts?: any[] }
  >({
    mutationFn: async (data) => {
      const response = await axios.post("/api/products", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err, g, context: any) => {
      if (context?.prevProducts) {
        queryClient.setQueryData(["products"], context.prevProducts);
      }
    },
  });
};

export const useEditProductsQuery = () => {
  const queryClient = useQueryClient();
  return useMutation<MerchandiseProduct, Error, EditMerchProductPayload>({
    mutationFn: async (prodData) => {
      const { id, ...rest } = prodData;
      const { data } = await axios.put("/api/products", { id, ...rest });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err, g, context: any) => {
      if (context?.prevProducts) {
        queryClient.setQueryData(["products"], context.prevProducts);
      }
    },
  });
};

export const useDeleteProductsQuery = () => {
  const queryClient = useQueryClient();
  return useMutation<MerchandiseProduct, Error, DeleteMerchProductPayload>({
    mutationFn: async (prodData) => {
      const { data } = await axios.delete("/api/products", {
        data: prodData,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err, g, context: any) => {
      if (context?.prevProducts) {
        queryClient.setQueryData(["products"], context.prevProducts);
      }
    },
  });
};
