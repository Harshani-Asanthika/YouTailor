import React, { useState, useEffect } from "react";
import {Layout,Menu,Table,Card,Row,Col,Avatar,Form,Input,Button,Upload,message, Modal,Dropdown,Descriptions,Tag,Select,InputNumber
} from "antd";
import {ShoppingCartOutlined,UserOutlined,PlusCircleOutlined,DashboardOutlined,UploadOutlined,LogoutOutlined,PlusOutlined,MenuOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { Inertia } from '@inertiajs/inertia';
import axios from "axios";

const { Header, Sider, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;

const ClientPanel = ({ client, orders: initialOrders = [], errors: propErrors = {} }) => {
  const [activeKey, setActiveKey] = useState("dashboard");
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [fileList, setFileList] = useState([]);
  const [ordersData, setOrdersData] = useState(initialOrders);
  const [errors, setErrors] = useState(propErrors);

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize form with client data
  useEffect(() => {
    form.setFieldsValue({
      mobile: client.mobile || '',
      address: client.address || ''
    });
  }, [client, form]);

  // Fetch orders when orders tab is active
  useEffect(() => {
    if (activeKey === 'orders' && ordersData.length === 0) {
      fetchOrders();
    }
  }, [activeKey]);

  const fetchOrders = async () => {
    try {
      // await Inertia.get('client/orders', {}, {
      //   onSuccess: (page) => {
      //     console.log("Fetched orders:", page.props.orders); // Debugging
      //     console.log("Orders Data:", ordersData);
      //     setOrdersData(page.props.orders || []);
      //   },
      //   onError: (errors) => {
      //     console.error("Fetch orders error:", errors); // Debugging
      //     setErrors(errors);
      //     message.error("Failed to load orders. Please try again.");
      //   }
      // });

      const response = await axios.get('/client/orders');
      console.log("Fetched orders:", response); // Debugging
      setOrdersData(response.data.data || []);
    } catch (error) {
      console.error("Fetch orders request failed:", error);
      message.error("Failed to load orders. Please try again.");
    }
};

  const onFinish = async (values) => {
    setLoading(true);
    setErrors({});
    
    const formData = new FormData();
    Object.keys(values).forEach(key => {
      if (key !== 'designImage') {
        formData.append(key, values[key]);
      }
    });
    
    if (fileList.length > 0) {
      formData.append('designImage', fileList[0].originFileObj);
    }
  
    try {
      const response = await axios.post('/client/orders', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.data.success) {
        message.success(response.data.message || "Order placed successfully!");
        form.resetFields();
        setFileList([]);
        fetchOrders();
        
        // Show additional success alert
        Modal.success({
          title: 'Order Placed Successfully',
          content: 'Your order has been received and is being processed. You can track its status in the "My Orders" section.',
          okText: 'View Orders',
          onOk: () => setActiveKey('orders')
        });
      } else {
        message.error(response.data.message || "Failed to place order");
        setErrors(response.data.errors || {});
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to place order. Please try again.";
      message.error(errorMessage);
      
      // Show detailed error modal if needed
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        Modal.error({
          title: 'Order Submission Error',
          content: (
            <ul style={{ paddingLeft: 20 }}>
              {Object.values(error.response.data.errors).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleLogout = () => {
    Inertia.post('/client/logout');
  };

  // Order status colors
  const statusColors = {
    'Pending': 'orange',
    'Approved': 'blue',
    'Processing': 'cyan',
    'Ready for Delivery': 'geekblue',
    'Completed': 'green',
    'Cancelled': 'red'
  };

  // Columns for orders table
  const orderColumns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      responsive: ["md"],
    },
    {
      title: "Item",
      dataIndex: "cloth_name",
      key: "clothName",
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      responsive: ["md"],
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      responsive: ["md"],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status] || 'default'}>
          {status}
        </Tag>
      )
    },
    {
      title: "Order Date",
      dataIndex: "createdAt",
      key: "createdAt",
      responsive: ["md"],
      render: (text) => moment(text).format("YYYY-MM-DD HH:mm")
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => viewOrderDetails(record)}>
          Details
        </Button>
      ),
    },
  ];

  const viewOrderDetails = (order) => {
    // Get the correct image path (handle both design_image and designImage cases)
    const designImage = order.design_image || order.designImage;
    
    // Construct proper URL if it's a storage path
    const getImageUrl = (path) => {
      if (!path) return null;
      // If it's already a full URL, return as-is
      if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
      }
      // If it's a storage path, prepend with /storage
      return `/storage/${path.replace('public/', '').replace('storage/', '')}`;
    };
  
    const imageUrl = getImageUrl(designImage);
  
    Modal.info({
      title: `Order Details - #OID00 ${order.id}`,
      width: 800,
      content: (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Item Name">{order.cloth_name}</Descriptions.Item>
          <Descriptions.Item label="Size">{order.size}</Descriptions.Item>
          <Descriptions.Item label="Quantity">{order.quantity}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={statusColors[order.status] || 'default'}>{order.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Order Date">
            {moment(order.createdAt).format("MMMM Do YYYY, h:mm a")}
          </Descriptions.Item>
          {imageUrl && (
            <Descriptions.Item label="Design Image">
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img 
                  src={imageUrl} 
                  alt="Design Preview" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100px',
                    objectFit: 'contain',
                    border: '1px solid #f0f0f0',
                    borderRadius: '4px'
                  }} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/image-placeholder.png';
                    e.target.alt = 'Failed to load design image';
                  }}
                />
              </div>
            </Descriptions.Item>
          )}
        </Descriptions>
      ),
    });
  };

  // Mobile menu items
  const mobileMenu = (
    <Menu onClick={(e) => setActiveKey(e.key)}>
      <Menu.Item key="dashboard" icon={<DashboardOutlined />}>Dashboard</Menu.Item>
      <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>My Orders</Menu.Item>
      <Menu.Item key="placeOrder" icon={<PlusCircleOutlined />}>Place Order</Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={() => setIsLogoutModalVisible(true)}>
        Logout
      </Menu.Item>
    </Menu>
  );

  if (!client) {
    return <div>Loading...</div>;
  }

  return (
    <Layout style={{ minHeight: "100vh", background: "#f4f4f9" }}>
      {/* Mobile Header */}
      <Header style={{
        background: "#ff6b00",
        color: "#fff",
        padding: "0 15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 1,
      }}>
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>Welcome, {client.firstName || client.name.split(' ')[0]}</div>
        <Dropdown overlay={mobileMenu} trigger={["click"]}>
          <Button type="text" icon={<MenuOutlined style={{ color: "#fff", fontSize: "20px" }} />} />
        </Dropdown>
      </Header>

      <Layout>
        {/* Desktop Sider - hidden on mobile */}
        <Sider 
          width={250} 
          style={{ 
            background: "#1e1e2d", 
            paddingTop: "20px",
            display: windowWidth < 992 ? "none" : "block"
          }} 
          collapsedWidth={80} 
          breakpoint="lg"
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Avatar 
              size={collapsed ? 40 : 64} 
              icon={<UserOutlined />} 
              src={client.avatar}
            />
            {!collapsed && (
              <>
                <h2 style={{ color: "#fff", fontSize: "18px", marginTop: "10px" }}>{client.name}</h2>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "14px" }}>{client.email}</p>
              </>
            )}
          </div>
          <Menu 
            theme="dark" 
            mode="inline" 
            selectedKeys={[activeKey]} 
            onClick={(e) => setActiveKey(e.key)}
          >
            <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
              {!collapsed && "Dashboard"}
            </Menu.Item>
            <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>
              {!collapsed && "My Orders"}
            </Menu.Item>
            <Menu.Item key="placeOrder" icon={<PlusCircleOutlined />}>
              {!collapsed && "Place Order"}
            </Menu.Item>
            <Menu.Item 
              key="logout" 
              icon={<LogoutOutlined />} 
              onClick={() => setIsLogoutModalVisible(true)}
            >
              {!collapsed && "Logout"}
            </Menu.Item>
          </Menu>
        </Sider>

        <Content style={{ padding: windowWidth < 768 ? "15px" : "24px" }}>
          {/* Dashboard Content */}
          {activeKey === "dashboard" && (
            <Row gutter={[16, 16]}>
              {Object.keys(statusColors).map((status, index) => (
                <Col xs={24} sm={12} md={8} lg={8} xl={6} key={index}>
                  <Card 
                    title={`${status} Orders`} 
                    style={{ 
                      textAlign: "center", 
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                    }}
                  >
                    <p style={{ fontSize: "24px", fontWeight: "bold" }}>
                      {ordersData.filter(order => order.status === status).length}
                    </p>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {/* Orders Content */}
          {activeKey === "orders" && (
            <Card 
              title="My Orders" 
              style={{ 
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}
            >
              <Table
                columns={orderColumns}
              
                dataSource={ordersData.map(order => ({ ...order, key: order.id }))}
                pagination={{ pageSize: 5 }}
                size={windowWidth < 768 ? "small" : "middle"}
              />
            </Card>
          )}

          {/* Place Order Content */}
          {activeKey === "placeOrder" && (
            <Card 
              title="Place a New Order" 
              style={{ 
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}
            >
              <Form 
                form={form}
                layout="vertical" 
                onFinish={onFinish}
              >
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item 
                      label="Cloth Name" 
                      name="clothName" 
                      rules={[{ required: true, message: 'Please input the cloth name!' }]}
                      validateStatus={errors?.clothName ? 'error' : ''}
                      help={errors?.clothName}
                    >
                      <Input placeholder="e.g., T-Shirt, Jeans, Dress" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item 
                      label="Size" 
                      name="size" 
                      rules={[{ required: true, message: 'Please select a size!' }]}
                      validateStatus={errors?.size ? 'error' : ''}
                      help={errors?.size}
                    >
                      <Select placeholder="Select size">
                        <Option value="S">Small (S)</Option>
                        <Option value="M">Medium (M)</Option>
                        <Option value="L">Large (L)</Option>
                        <Option value="XL">Extra Large (XL)</Option>
                        <Option value="XXL">Double Extra Large (XXL)</Option>
                        <Option value="3XL">Triple Extra Large (3XL)</Option>
                        <Option value="Custom">Custom Size</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item 
                      label="Quantity" 
                      name="quantity" 
                      rules={[{ required: true, message: 'Please input quantity!' }]}
                      initialValue={1}
                      validateStatus={errors?.quantity ? 'error' : ''}
                      help={errors?.quantity}
                    >
                      <InputNumber min={1} max={100} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item 
                      label="Mobile Number" 
                      name="mobile" 
                      rules={[
                        { required: true, message: 'Please input your mobile number!' },
                        { pattern: /^[0-9]{10,15}$/, message: 'Please enter a valid mobile number!' }
                      ]}
                      validateStatus={errors?.mobile ? 'error' : ''}
                      help={errors?.mobile}
                    >
                      <Input placeholder="Your mobile number" />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item 
                      label="Delivery Address" 
                      name="address" 
                      rules={[{ required: true, message: 'Please input your address!' }]}
                      validateStatus={errors?.address ? 'error' : ''}
                      help={errors?.address}
                    >
                      <TextArea rows={3} placeholder="Full delivery address" />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item 
                      label="Special Instructions" 
                      name="instructions"
                      validateStatus={errors?.instructions ? 'error' : ''}
                      help={errors?.instructions}
                    >
                      <TextArea rows={2} placeholder="Any special instructions for your order" />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Form.Item 
                  label="Design Image" 
                  name="designImage"
                  extra="Upload an image of your design (optional)"
                  validateStatus={errors?.designImage ? 'error' : ''}
                  help={errors?.designImage}
                >
                  <Upload 
                    accept="image/*"
                    listType={windowWidth < 576 ? "picture" : "picture-card"}
                    fileList={fileList}
                    onChange={handleUpload}
                    beforeUpload={() => false}
                  >
                    {fileList.length >= 1 ? null : (
                      windowWidth < 576 ? (
                        <Button icon={<UploadOutlined />}>Upload Design</Button>
                      ) : (
                        <div>
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                      )
                    )}
                  </Upload>
                </Form.Item>
                
                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loading}
                    icon={<PlusCircleOutlined />}
                    style={{ width: '100%' }}
                    size="large"
                  >
                    Place Order
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          )}
        </Content>
      </Layout>

      {/* Logout Confirmation Modal */}
      <Modal
        title="Confirm Logout"
        visible={isLogoutModalVisible}
        onOk={handleLogout}
        onCancel={() => setIsLogoutModalVisible(false)}
        okText="Logout"
        cancelText="Cancel"
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </Layout>
  );
};

export default ClientPanel;