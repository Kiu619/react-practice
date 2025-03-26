import { DeleteOutlined, DownOutlined, EditOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons'
import { Button, Dropdown, Form, Input, InputNumber, Menu, Modal, Popconfirm, Select, Space, Switch, Table, notification } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import type { FilterValue, SorterResult } from 'antd/es/table/interface'
import React, { useState, useEffect } from 'react'
import { 
  useGetProductsQuery, 
  useAddProductMutation, 
  useUpdateProductMutation, 
  useDeleteProductMutation,
  AddProductRequest,
  UpdateProductRequest
} from '../../store/api/productApi'

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

interface ProductFormValues {
  title: string
  description: string
  price: number
  brand: string
  category: string
  stock: number
  rating?: number
  thumbnail?: string
}

interface TableParams {
  pagination?: TablePaginationConfig
  sortField?: string
  sortOrder?: 'ascend' | 'descend' | undefined
  filters?: Record<string, FilterValue | null>
}

const Lesson5: React.FC = () => {
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 100
    },
  })

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    id: true,
    title: true,
    description: true,
    price: true,
    brand: true,
    rating: true,
    thumbnail: true,
    category: true,
    stock: true,
  })

  // State cho modal thêm/sửa sản phẩm
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [form] = Form.useForm<ProductFormValues>()

  // RTK Query hooks
  const { data, error, isFetching, isError, refetch } = useGetProductsQuery({
    limit: tableParams.pagination?.pageSize || 10,
    skip: ((tableParams.pagination?.current || 1) - 1) * (tableParams.pagination?.pageSize || 10),
    select: Object.keys(visibleColumns).filter(key => visibleColumns[key]).join(','),
    sortField: tableParams.sortField,
    sortOrder: tableParams.sortOrder
  })

  // Mutations for CRUD operations
  const [addProduct, { isLoading: isAdding }] = useAddProductMutation()
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation()
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation()

  useEffect(() => {
    if (isError && error) {
      if ('status' in error) {
        notification.error({
          message: 'Lỗi kết nối API',
          description: `Mã lỗi: ${error.status}. Vui lòng thử lại sau.`,
          duration: 5,
        })
      } else {
        notification.error({
          message: 'Lỗi kết nối API',
          description: 'Có lỗi xảy ra khi tải dữ liệu sản phẩm. Vui lòng thử lại sau.',
          duration: 5,
        })
      }
    }
  }, [isError, error])

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<Product> | SorterResult<Product>[]
  ) => {
    const sorterResult = Array.isArray(sorter) ? sorter[0] : sorter
    
    console.log('Sorter:', sorterResult)
    
    // Kiểm tra nếu có trường sắp xếp và thứ tự sắp xếp
    if (sorterResult.field && sorterResult.order) {
      notification.info({
        message: 'Thay đổi thứ tự sắp xếp',
        description: `Sắp xếp theo ${sorterResult.field} theo thứ tự ${sorterResult.order === 'ascend' ? 'tăng dần' : 'giảm dần'}`,
        duration: 3,
      })
    }
    
    setTableParams({
      pagination,
      filters,
      sortField: sorterResult.field as string,
      sortOrder: sorterResult.order === 'ascend' || sorterResult.order === 'descend' 
        ? sorterResult.order 
        : undefined,
    })
  }

  const toggleColumnVisibility = (columnKey: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }))
  }

  // Hàm mở modal thêm sản phẩm mới
  const showAddModal = () => {
    setIsEditing(false)
    setCurrentProduct(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  // Hàm mở modal sửa sản phẩm
  const showEditModal = (product: Product) => {
    setIsEditing(true)
    setCurrentProduct(product)
    form.setFieldsValue({
      title: product.title,
      description: product.description,
      price: product.price,
      brand: product.brand,
      category: product.category,
      stock: product.stock,
      rating: product.rating,
      thumbnail: product.thumbnail
    })
    setIsModalOpen(true)
  }

  // Đóng modal
  const handleCancel = () => {
    setIsModalOpen(false)
    form.resetFields()
  }

  // Xử lý khi submit form
  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      
      if (isEditing && currentProduct) {
        // Gọi API cập nhật sản phẩm
        const updateData: UpdateProductRequest = {
          id: currentProduct.id,
          ...values
        }
        
        await updateProduct(updateData).unwrap()
          .then((response) => {
            notification.success({
              message: 'Cập nhật thành công',
              description: `Sản phẩm "${values.title}" đã được cập nhật.`,
              duration: 3,
            })
          })
          .catch((error) => {
            notification.error({
              message: 'Cập nhật thất bại',
              description: error.message || 'Không thể cập nhật sản phẩm. Vui lòng thử lại sau.',
              duration: 3,
            })
          })
      } else {
        // Gọi API thêm sản phẩm mới
        const addData: AddProductRequest = values
        
        await addProduct(addData).unwrap()
          .then((response) => {
            notification.success({
              message: 'Thêm thành công',
              description: `Sản phẩm "${values.title}" đã được thêm mới.`,
              duration: 3,
            })
          })
          .catch((error) => {
            notification.error({
              message: 'Thêm thất bại',
              description: error.message || 'Không thể thêm sản phẩm. Vui lòng thử lại sau.',
              duration: 3,
            })
          })
      }
      
      setIsModalOpen(false)
      form.resetFields()
    } catch (error) {
      console.error('Validate Failed:', error)
    }
  }

  // Xử lý khi xóa sản phẩm
  const handleDelete = (id: number) => {
    // Gọi API xóa sản phẩm
    deleteProduct(id).unwrap()
      .then((response) => {
        notification.success({
          message: 'Xóa thành công',
          description: `Sản phẩm đã được xóa.`,
          duration: 3,
        })
      })
      .catch((error) => {
        notification.error({
          message: 'Xóa thất bại',
          description: error.message || 'Không thể xóa sản phẩm. Vui lòng thử lại sau.',
          duration: 3,
        })
      })
  }

  const columns: ColumnsType<Product> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      width: 70,
      hidden: !visibleColumns.id
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
      hidden: !visibleColumns.title
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      hidden: !visibleColumns.description
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: true,
      render: (price: number) => `$${price}`,
      hidden: !visibleColumns.price
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
      sorter: true,
      hidden: !visibleColumns.brand
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      sorter: true,
      hidden: !visibleColumns.rating
    },
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (thumbnail: string) => (
        <img src={thumbnail} alt="Product" style={{ width: 50, height: 50, objectFit: 'contain' }} />
      ),
      hidden: !visibleColumns.thumbnail
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      sorter: true,
      hidden: !visibleColumns.category
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      sorter: true,
      hidden: !visibleColumns.stock
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Product) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => showEditModal(record)}
            loading={isUpdating && currentProduct?.id === record.id}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button 
              danger 
              icon={<DeleteOutlined />}
              loading={isDeleting}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ].filter(column => !column.hidden)

  const columnsMenu = (
    <Menu>
      {[
        { key: 'id', label: 'ID' },
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description' },
        { key: 'price', label: 'Price' },
        { key: 'brand', label: 'Brand' },
        { key: 'rating', label: 'Rating' },
        { key: 'thumbnail', label: 'Thumbnail' },
        { key: 'category', label: 'Category' },
        { key: 'stock', label: 'Stock' }
      ].map(item => (
        <Menu.Item key={item.key}>
          <Space>
            <Switch 
              checked={visibleColumns[item.key]} 
              onChange={() => toggleColumnVisibility(item.key)}
              size="small"
            />
            <span>{item.label}</span>
          </Space>
        </Menu.Item>
      ))}
    </Menu>
  )

  // Các loại sản phẩm mẫu cho select
  const categories = ['smartphones', 'laptops', 'fragrances', 'skincare', 'groceries', 'home-decoration']
  
  // Các thương hiệu mẫu cho select
  const brands = ['Apple', 'Samsung', 'OPPO', 'Huawei', 'Microsoft Surface', 'HP Pavilion', 'Infinix', 'Impression of Acqua Di Gio']

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Products Table with RTK Query</h1>
      
      <div className="mb-4 flex justify-between items-center">
        <div>
          {tableParams.sortField && tableParams.sortOrder && (
            <div className="text-sm text-gray-600 p-2 bg-gray-100 rounded">
              Đang sắp xếp theo: <span className="font-bold">{tableParams.sortField}</span> 
              <span className="ml-1">({tableParams.sortOrder === 'ascend' ? '🔼 tăng dần' : '🔽 giảm dần'})</span>
            </div>
          )}
        </div>
        <div>
          <Button 
            type="primary"
            icon={<PlusOutlined />}
            onClick={showAddModal}
            className="mr-2"
            loading={isAdding}
          >
            Thêm Sản Phẩm
          </Button>
          <Button 
            onClick={() => refetch()} 
            className="mr-2"
            loading={isFetching}
          >
            Tải lại
          </Button>
          <Dropdown overlay={columnsMenu} trigger={['click']}>
            <Button icon={<SettingOutlined />}>
              Cài đặt cột <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={data?.products}
        rowKey="id"
        pagination={{
          ...tableParams.pagination,
          total: data?.total,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '50'],
          // showTotal: (total) => `Tổng cộng ${total} sản phẩm`
        }}
        loading={isFetching}
        onChange={handleTableChange}
        scroll={{ x: 'max-content' }}
      />

      {isError && (
        <div className="text-red-500 mt-4 p-4 bg-red-50 rounded">
          <h3 className="font-bold">Lỗi kết nối API!</h3>
          <p>Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau hoặc kiểm tra kết nối mạng.</p>
          <Button onClick={() => refetch()} type="primary" danger className="mt-2">
            Thử lại
          </Button>
        </div>
      )}

      {/* Modal Thêm/Sửa Sản Phẩm */}
      <Modal
        title={isEditing ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
        okText={isEditing ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
        confirmLoading={isAdding || isUpdating}
      >
        <Form
          form={form}
          layout="vertical"
          name="productForm"
          initialValues={{ rating: 0, stock: 0, price: 0 }}
        >
          <Form.Item
            name="title"
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm!' }]}
          >
            <Input.TextArea 
              placeholder="Nhập mô tả sản phẩm" 
              autoSize={{ minRows: 3, maxRows: 6 }} 
            />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="price"
              label="Giá"
              rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm!' }]}
            >
              <InputNumber 
                prefix="$" 
                min={0} 
                step={0.01} 
                precision={2} 
                style={{ width: '100%' }} 
                placeholder="Nhập giá sản phẩm"
              />
            </Form.Item>

            <Form.Item
              name="stock"
              label="Số lượng tồn kho"
              rules={[{ required: true, message: 'Vui lòng nhập số lượng tồn kho!' }]}
            >
              <InputNumber 
                min={0} 
                style={{ width: '100%' }} 
                placeholder="Nhập số lượng tồn kho"
              />
            </Form.Item>

            <Form.Item
              name="brand"
              label="Thương hiệu"
              rules={[{ required: true, message: 'Vui lòng chọn thương hiệu!' }]}
            >
              <Select placeholder="Chọn thương hiệu">
                {brands.map(brand => (
                  <Select.Option key={brand} value={brand}>{brand}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="category"
              label="Loại sản phẩm"
              rules={[{ required: true, message: 'Vui lòng chọn loại sản phẩm!' }]}
            >
              <Select placeholder="Chọn loại sản phẩm">
                {categories.map(category => (
                  <Select.Option key={category} value={category}>{category}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="rating"
              label="Đánh giá"
            >
              <InputNumber 
                min={0} 
                max={5} 
                step={0.1} 
                precision={1} 
                style={{ width: '100%' }} 
                placeholder="Nhập đánh giá (0-5)"
              />
            </Form.Item>

            <Form.Item
              name="thumbnail"
              label="URL hình ảnh"
            >
              <Input placeholder="Nhập URL hình ảnh" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default Lesson5
