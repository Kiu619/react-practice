import React, { useEffect, useState } from 'react'
import { Form, Input, Select, Button, Radio, Space, Tag } from 'antd'
import { DeleteOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'

// Định nghĩa các types
type Operator = 'AND' | 'OR'
type Condition = 'IS' | 'IS_NOT' | 'CONTAINS' | 'NOT_CONTAINS' | 'GREATER_THAN' | 'LESS_THAN'

interface FilterCondition {
  field: string
  condition: Condition
  value: string
}

interface FilterData {
  filterListId: string
  filterWithConditions: FilterCondition[]
  operatorsOrder: Operator[]
  freeText: string
  tags: string[]
  lockedTags: string[]
}

const Lesson6: React.FC = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const location = useLocation()
  const [conditions, setConditions] = useState<FilterCondition[]>([])
  const [operators, setOperators] = useState<Operator[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [lockedTags, setLockedTags] = useState<string[]>([])

  // Danh sách tags có sẵn
  const tagOptions = [
    { label: 'Tag 1', value: 'TAG_1' },
    { label: 'Tag 2', value: 'TAG_2' },
    { label: 'Tag 3', value: 'TAG_3' },
    { label: 'Tag 4', value: 'TAG_4' },
    { label: 'Tag 5', value: 'TAG_5' },
  ]

  // Fields có thể chọn trong form
  const fields = [
    { label: 'First Name', value: 'FIRST_NAME' },
    { label: 'Last Name', value: 'LAST_NAME' },
    { label: 'Business Area', value: 'BUSINESS_AREA' },
    { label: 'Personal Number', value: 'PERSONAL_NUMBER' },
    { label: 'Email', value: 'EMAIL' }
  ]

  // Conditions có thể chọn
  const conditionOptions = [
    { label: 'Is', value: 'IS' },
    { label: 'Is Not', value: 'IS_NOT' },
    { label: 'Contains', value: 'CONTAINS' },
    { label: 'Not Contains', value: 'NOT_CONTAINS' },
    { label: 'Greater Than', value: 'GREATER_THAN' },
    { label: 'Less Than', value: 'LESS_THAN' }
  ]

  // Parse URL params khi load trang
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const filterData = searchParams.get('filter')
    if (filterData) {
      try {
        const parsedData: FilterData = JSON.parse(decodeURIComponent(filterData))
        setConditions(parsedData.filterWithConditions || [])
        setOperators(parsedData.operatorsOrder || [])
        setSelectedTags(parsedData.tags || [])
        setLockedTags(parsedData.lockedTags || [])

        // Set form values
        const formValues: any = {
          freeText: parsedData.freeText,
          tags: parsedData.tags || []
        }

        // Set values cho từng condition
        parsedData.filterWithConditions?.forEach((condition, index) => {
          formValues[`field_${index}`] = condition.field
          formValues[`condition_${index}`] = condition.condition
          formValues[`value_${index}`] = condition.value
        })

        // Set values cho operators
        if (parsedData.operatorsOrder?.length) {
          formValues.operators = parsedData.operatorsOrder
        }

        form.setFieldsValue(formValues)
      } catch (error) {
        console.error('Error parsing filter data:', error)
      }
    }
  }, [location.search, form])

  // Thêm điều kiện mới
  const addCondition = () => {
    const newIndex = conditions.length
    setConditions([
      ...conditions,
      { field: '', condition: 'IS', value: '' }
    ])
    if (conditions.length > 0) {
      setOperators([...operators, 'AND'])
    }

    // Reset giá trị cho filter mới
    const currentValues = form.getFieldsValue()
    form.setFieldsValue({
      ...currentValues,
      [`field_${newIndex}`]: undefined,
      [`condition_${newIndex}`]: undefined,
      [`value_${newIndex}`]: undefined
    })
  }

  // Xóa điều kiện
  const removeCondition = (index: number) => {
    // Xóa condition tại index
    const newConditions = [...conditions]
    newConditions.splice(index, 1)
    setConditions(newConditions)

    // Xóa operator tương ứng
    const newOperators = [...operators]
    if (index > 0) {
      newOperators.splice(index - 1, 1)
    }
    setOperators(newOperators)

    // Lấy tất cả giá trị hiện tại của form
    const currentValues = form.getFieldsValue()
    
    // Tạo object chứa giá trị mới
    const newValues: any = {
      freeText: currentValues.freeText,
      tags: currentValues.tags,
      operators: newOperators
    }

    // Cập nhật lại các field và value cho các condition còn lại
    newConditions.forEach((_, i) => {
      const oldIndex = i >= index ? i + 1 : i
      newValues[`field_${i}`] = currentValues[`field_${oldIndex}`]
      newValues[`condition_${i}`] = currentValues[`condition_${oldIndex}`]
      newValues[`value_${i}`] = currentValues[`value_${oldIndex}`]
    })

    // Xóa các field của filter cuối cùng
    const lastIndex = conditions.length - 1
    form.setFields([
      { name: `field_${lastIndex}`, value: undefined },
      { name: `condition_${lastIndex}`, value: undefined },
      { name: `value_${lastIndex}`, value: undefined }
    ])

    // Set lại giá trị cho form
    form.setFieldsValue(newValues)
  }

  // Handle tag selection
  const handleTagChange = (newTags: string[]) => {
    setSelectedTags(newTags)
    form.setFieldsValue({ tags: newTags })
  }

  // Toggle khóa/mở khóa tag
  const toggleTagLock = (tag: string) => {
    if (lockedTags.includes(tag)) {
      // Mở khóa tag
      setLockedTags(lockedTags.filter(t => t !== tag))
    } else {
      // Chỉ thêm vào lockedTags, không xóa khỏi selectedTags
      setLockedTags([...lockedTags, tag])
    }
  }

  // Submit form
  const onFinish = (values: any) => {
    // Chỉ lấy tags từ form values, không tự động thêm lockedTags
    const formTags = values.tags || []

    const filterData: FilterData = {
      filterListId: '0',
      filterWithConditions: conditions.map((_, index) => ({
        field: values[`field_${index}`],
        condition: values[`condition_${index}`],
        value: values[`value_${index}`]
      })),
      operatorsOrder: values.operators || [],
      freeText: values.freeText || '',
      tags: formTags,
      lockedTags: lockedTags
    }

    // Update URL với filter data
    const searchParams = new URLSearchParams()
    searchParams.set('filter', encodeURIComponent(JSON.stringify(filterData)))
    navigate({ search: searchParams.toString() })

    // Hiển thị data đã format
    console.log('Filter Data:', JSON.stringify(filterData, null, 2))
  }

  // Reset form
  const handleReset = () => {
    form.resetFields()
    setConditions([])
    setOperators([])
    setSelectedTags([])
    setLockedTags([])
    navigate({ search: '' })
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">Thực hành extend form</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
        >
          <div className="grid grid-cols-1 mb-6">
            {/* Search input */}
            <Form.Item name="freeText" label="Search">
              <Input placeholder="Enter search text" />
            </Form.Item>

            {/* Tags */}
            <Form.Item name="tags" label="Tag">
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Select tags"
                options={tagOptions}
                onChange={handleTagChange}
                allowClear
                value={selectedTags}
              />
            </Form.Item>

            {/* Hiển thị tất cả tag đã chọn và tag bị khóa */}
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set([...selectedTags])).map(tagValue => {
                const tag = tagOptions.find(t => t.value === tagValue)
                const isLocked = lockedTags.includes(tagValue)
                return (
                  <div key={tagValue} className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {tag?.label}
                      <Button
                        type="text"
                        className="flex items-center p-0 ml-1"
                        onClick={() => toggleTagLock(tagValue)}
                        icon={isLocked ? <LockOutlined /> : <UnlockOutlined />}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Filter conditions */}
          <div className="mb-4">
            <div className="font-medium mb-2">Show Only Records With</div>
            {conditions.map((_, index) => (
              <div key={index} className="mb-4">
                <Space align="baseline" className="w-full flex-wrap">
                  {/* Field selection */}
                  <Form.Item
                    name={`field_${index}`}
                    rules={[{ required: true, message: 'Please select field' }]}
                  >
                    <Select style={{ width: 200 }} placeholder="Select field">
                      {fields.map(field => (
                        <Select.Option key={field.value} value={field.value}>
                          {field.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <span>That</span>

                  {/* Condition selection */}
                  <Form.Item
                    name={`condition_${index}`}
                    rules={[{ required: true, message: 'Please select condition' }]}
                  >
                    <Select style={{ width: 150 }} placeholder="Select condition">
                      {conditionOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {/* Value input */}
                  <Form.Item
                    name={`value_${index}`}
                    rules={[{ required: true, message: 'Please enter value' }]}
                  >
                    <Input style={{ width: 200 }} placeholder="Enter value" />
                  </Form.Item>

                  {/* Delete button */}
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => removeCondition(index)}
                    danger
                  />
                </Space>

                {/* Operator selection */}
                {index < conditions.length - 1 && (
                  <Form.Item
                    name={['operators', index]}
                    initialValue="AND"
                    className="ml-4"
                  >
                    <Radio.Group>
                      <Radio value="AND">And</Radio>
                      <Radio value="OR">Or</Radio>
                    </Radio.Group>
                  </Form.Item>
                )}
              </div>
            ))}
          </div>

          {/* Add condition button */}
          <Button type="dashed" onClick={addCondition} className="mb-4">
            + More Filter
          </Button>

          {/* Submit and Clear buttons */}
          <div className="flex gap-4">
            <Button type="primary" htmlType="submit">
              Filter
            </Button>
            <Button onClick={handleReset}>
              Clear
            </Button>
          </div>
        </Form>

        {/* Display formatted filter data */}
        {location.search && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Filter</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(JSON.parse(decodeURIComponent(new URLSearchParams(location.search).get('filter') || '{}')), null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default Lesson6
