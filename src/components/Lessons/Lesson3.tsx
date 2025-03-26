import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Avatar, Typography, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TablePaginationConfig } from 'antd/es/table'
import type { FilterValue, SorterResult } from 'antd/es/table/interface'
import { faker } from '@faker-js/faker'

interface UserData {
  key: string
  id: number
  firstName: string
  lastName: string
  age: number
  address: string
  birthday: string
  sex: string
  jobArea: string
  phone: string
  subscriptionTier: string
  avatar: string
}

interface TableParams {
  pagination?: TablePaginationConfig
  sortField?: string
  sortOrder?: 'ascend' | 'descend' | undefined
  filters?: Record<string, FilterValue | null>
}

const generateMockData = (): UserData[] => {
  return Array.from({ length: 100 }, (_, index) => ({
    key: index.toString(),
    id: index + 1,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: faker.number.int({ min: 20, max: 40 }),
    address: faker.location.streetAddress(),
    birthday: faker.date.past({ years: 30 }).toLocaleDateString('en-GB'),
    sex: faker.helpers.arrayElement(['male', 'female']),
    jobArea: faker.person.jobArea(),
    phone: faker.phone.number(),
    subscriptionTier: faker.helpers.arrayElement(['free', 'basic', 'business', 'tester', 'design']),
    avatar: faker.image.avatar()
  }))
}

const Lesson3: React.FC = () => {
  const [userData] = useState<UserData[]>(generateMockData())
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: ['5', '10', '20', '50'],
      showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
    },
  })

  useEffect(() => {
    // Giả lập thời gian tải dữ liệu
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [])

  const handleDelete = (id: number) => {
    console.log(`Deleted user with ID: ${id}`)
  }

  const handleInvite = (lastName: string) => {
    console.log(`Invited ${lastName}`)
  }

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<UserData> | SorterResult<UserData>[]
  ) => {
    setIsLoading(true)
    
    const sorterResult = Array.isArray(sorter) ? sorter[0] : sorter
    
    // Giả lập thời gian tải khi chuyển trang hoặc sắp xếp
    setTimeout(() => {
      setTableParams({
        pagination,
        filters,
        sortField: sorterResult.field as string,
        sortOrder: sorterResult.order as 'ascend' | 'descend' | undefined,
      })
      setIsLoading(false)
    }, 500)
  }

  const columns: ColumnsType<UserData> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Birthday',
      dataIndex: 'birthday',
      key: 'birthday',
    },
    {
      title: 'Sex',
      dataIndex: 'sex',
      key: 'sex',
      filters: [
        { text: 'Male', value: 'male' },
        { text: 'Female', value: 'female' },
      ],
      onFilter: (value, record) => record.sex === value,
      render: (sex) => (
        <span>{sex === 'male' ? 'male' : 'female'}</span>
      ),
    },
    {
      title: 'Job Area',
      dataIndex: 'jobArea',
      key: 'jobArea',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'SubscriptionTier',
      dataIndex: 'subscriptionTier',
      key: 'subscriptionTier',
      filters: [
        { text: 'Free', value: 'free' },
        { text: 'Basic', value: 'basic' },
        { text: 'Business', value: 'business' },
        { text: 'Tester', value: 'tester' },
        { text: 'Design', value: 'design' },
      ],
      onFilter: (value, record) => record.subscriptionTier === value,
      render: (tier) => (
        <Tag color={
          tier === 'free' ? 'blue' : 
          tier === 'basic' ? 'orange' : 
          tier === 'business' ? 'green' :
          tier === 'tester' ? 'purple' : 'magenta'
        }>
          {tier}
        </Tag>
      ),
    },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar) => <Avatar src={avatar} />,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleInvite(record.lastName)}>
            Invite {record.lastName}
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="p-6">
      <Typography.Title level={4} className='pb-5'>
        Thực hành mockup data
      </Typography.Title>
      <div>
          {tableParams.sortField && tableParams.sortOrder && (
            <div className="text-sm text-gray-600 p-3 bg-gray-100 rounded mb-5">
              Đang sắp xếp theo: <span className="font-bold">{tableParams.sortField}</span> 
              <span className="ml-1">({tableParams.sortOrder === 'ascend' ? '🔼 tăng dần' : '🔽 giảm dần'})</span>
            </div>
          )}
        </div>
      <Table 
        columns={columns} 
        dataSource={userData}
        pagination={tableParams.pagination}
        scroll={{ x: 1500 }}
        onChange={handleTableChange}
        loading={isLoading}
      />
    </div>
  )
}

export default Lesson3
