import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  images: string[]
}

interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

interface ProductsParams {
  limit?: number
  skip?: number
  select?: string
  sortField?: string
  sortOrder?: 'ascend' | 'descend' | undefined
}

export interface AddProductRequest {
  title: string
  description: string
  price: number
  brand: string
  category: string
  stock: number
  rating?: number
  thumbnail?: string
}

export interface UpdateProductRequest extends Partial<AddProductRequest> {
  id: number
}

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com/' }),
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, ProductsParams>({
      query: (params) => {
        const { limit = 10, skip = 0, select, sortField, sortOrder } = params
        let url = `products?limit=${limit}&skip=${skip}`
        
        if (select) {
          url += `&select=${select}`
        }
        
        if (sortField && sortOrder) {
          const orderParam = sortOrder === 'descend' ? 'desc' : 'asc'
          url += `&sortBy=${sortField}&order=${orderParam}`
        }
        
        return url
      },
      providesTags: ['Products']
    }),

    addProduct: builder.mutation<Product, AddProductRequest>({
      query: (product) => ({
        url: 'products/add',
        method: 'POST',
        body: product
      }),
      invalidatesTags: ['Products']
    }),

    updateProduct: builder.mutation<Product, UpdateProductRequest>({
      query: ({ id, ...patch }) => ({
        url: `products/${id}`,
        method: 'PUT',
        body: patch
      }),
      invalidatesTags: ['Products']
    }),

    deleteProduct: builder.mutation<{ id: number; isDeleted: boolean; deletedOn: string }, number>({
      query: (id) => ({
        url: `products/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Products']
    })
  }),
})

export const { 
  useGetProductsQuery, 
  useAddProductMutation, 
  useUpdateProductMutation, 
  useDeleteProductMutation 
} = productApi 

