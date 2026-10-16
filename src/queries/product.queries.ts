"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { AddMerchProductPayload, EditMerchProductPayload } from "../types/merchProducts.types";
import axios from "axios";
import { MerchandiseProduct } from "../lib/prisma/generated/client";
import { GetProductsParams } from "../services/product.service";

const STALE_TIME = 1000 * 60 * 5;
const PRODUCTS_URL = "/api/merchandise/products";


interface EditProductVariables {
  id: number;
  data: EditMerchProductPayload;
}

interface ProductsMutationContext {
  prevProducts?: MerchandiseProduct[];
}

export const useGetProductsQuery = (params?: GetProductsParams) => {
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
      if(params?.page) queryParams.append("page", params.page.toString());
      if(params?.pageSize) queryParams.append("pageSize", params.pageSize.toString());

      const url = `${PRODUCTS_URL}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const response = await axios.get(url);
      return response.data.data;
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
    ProductsMutationContext
  >({
    mutationFn: async (data) => {
      const response = await axios.post(PRODUCTS_URL, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err, g, context) => {
      if (context?.prevProducts) {
        queryClient.setQueryData(["products"], context.prevProducts);
      }
    },
  });
};

export const useEditProductsQuery = () => {
  const queryClient = useQueryClient();
  return useMutation<
    MerchandiseProduct,
    Error,
    EditProductVariables,
    ProductsMutationContext
  >({
    mutationFn: async ({ id, data }) => {
      const response = await axios.put(`${PRODUCTS_URL}/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err, g, context) => {
      if (context?.prevProducts) {
        queryClient.setQueryData(["products"], context.prevProducts);
      }
    },
  });
};

export const useDeleteProductsQuery = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number, ProductsMutationContext>({
    mutationFn: async (id) => {
      await axios.delete(`${PRODUCTS_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err, g, context) => {
      if (context?.prevProducts) {
        queryClient.setQueryData(["products"], context.prevProducts);
      }
    },
  });
};