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

export const getProductsQuery = () => {
  return useQuery<MerchandiseProduct[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get("/api/products");
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
