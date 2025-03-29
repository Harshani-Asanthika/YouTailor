import React, { useState, useEffect } from "react";
import { 
  Layout, Menu, Table, Tag, Modal, Button, Card, Row, Col, Avatar, 
  Form, Input, Upload, message, Dropdown, Badge, Select, Descriptions, 
  Space, Typography 
} from "antd";
import { 
  DashboardOutlined, ShoppingOutlined, UserOutlined, UploadOutlined, 
  EditOutlined, LogoutOutlined, MenuOutlined, InfoCircleOutlined 
} from "@ant-design/icons";
import { Link, usePage } from "@inertiajs/react";
import moment from "moment";

const { Header, Sider, Content } = Layout;
const { Option } = Select;
const { Text } = Typography;

const AdminDashboard = ({ orders: initialOrders = [], user: authUser }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState("dashboard");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [ordersData, setOrdersData] = useState(initialOrders);
  const [fileList, setFileList] = useState([]);
  const { errors } = usePage().props;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const statusOptions = [
    'Pending',
    'Approved',
    'Processing',
    'Ready for Delivery',
    'Completed',
    'Cancelled'
  ];

  const statusColors = {
    'Pending': 'orange',
    'Approved': 'blue',
    'Processing': 'cyan',
    'Ready for Delivery': 'geekblue',
    'Completed': 'green',
    'Cancelled': 'red'
  };

  const getOrderCount = (status) => 
    status === "All" 
      ? ordersData.length 
      : ordersData.filter(order => order.status === status).length;

  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue(authUser);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      Inertia.post('/tailor/profile', values, {
        onSuccess: () => {
          setIsEditing(false);
          message.success("Profile updated successfully!");
        },
        onError: () => {
          message.error("Failed to update profile");
        }
      });
    });
  };

  const handleOrderClick = (record) => {
    setSelectedOrder(record);
    setIsModalOpen(true);
  };

  const handleStatusChange = (orderId, newStatus) => {
    Inertia.post(`/tailor/orders/${orderId}/status`, { status: newStatus }, {
      onSuccess: () => {
        setOrdersData(ordersData.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        message.success("Order status updated successfully");
      },
      onError: () => {
        message.error("Failed to update order status");
      }
    });
  };

  // Mobile menu items
  const mobileMenu = (
    <Menu onClick={(e) => setActiveKey(e.key)}>
      <Menu.Item key="dashboard" icon={<DashboardOutlined />}>Dashboard</Menu.Item>
      <Menu.Item key="orders" icon={<ShoppingOutlined />}>Orders</Menu.Item>
      <Menu.Item key="profile" icon={<UserOutlined />}>Profile</Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        <Link href="/tailor-panel/logout">Logout</Link>
      </Menu.Item>
    </Menu>
  );

  // Columns for orders table
  const desktopOrderColumns = [
    { 
      title: "Order ID", 
      dataIndex: "id", 
      key: "id",
      render: (id) => (
        <Text strong>ORD-{id.toString().padStart(6, '0')}</Text>
      ),
      sorter: (a, b) => a.id - b.id
    },
    { 
      title: "Item", 
      dataIndex: "cloth_name", 
      key: "cloth_name",
      render: (text) => <Text>{text}</Text>
    },
    { 
      title: "Customer", 
      dataIndex: "cloth_name", 
      key: "customer",
      render: (_, record) => (
        <div>
          <Text strong>{record.client?.name}</Text>
          <br />
          <Text type="secondary">{record.client?.mobile}</Text>
        </div>
      )
    },
    { 
      title: "Status", 
      dataIndex: "status", 
      key: "status", 
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 180 }}
          onChange={(value) => handleStatusChange(record.id, value)}
          dropdownMatchSelectWidth={false}
        >
          {statusOptions.map(option => (
            <Option key={option} value={option}>
              <Tag color={statusColors[option]}>{option}</Tag>
            </Option>
          ))}
        </Select>
      ),
      filters: statusOptions.map(status => ({
        text: status,
        value: status,
      })),
      onFilter: (value, record) => record.status === value,
    },
    { 
      title: "Order Date", 
      dataIndex: "created_at", 
      key: "created_at",
      render: date => moment(date).format('MMM D, YYYY h:mm A'),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at)
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<InfoCircleOutlined />} 
          onClick={() => handleOrderClick(record)}
        >
          Details
        </Button>
      ),
    }
  ];

  const mobileOrderColumns = [
    {
      title: "Order Summary",
      key: "mobileView",
      render: (_, record) => (
        <Card 
          size="small" 
          style={{ marginBottom: 8 }}
          actions={[
            <Button 
              type="link" 
              onClick={() => handleOrderClick(record)}
              icon={<InfoCircleOutlined />}
            >
              View Details
            </Button>
          ]}
        >
          <div>
            <Text strong>ORD-{record.id.toString().padStart(6, '0')}</Text>
          </div>
          <div>
            <Text type="secondary">{record.cloth_name}</Text>
          </div>
          <div style={{ marginTop: 8 }}>
            <Tag color={statusColors[record.status]}>{record.status}</Tag>
          </div>
          <div style={{ marginTop: 8 }}>
            <Text>{record.client?.name}</Text>
            <br />
            <Text type="secondary">{moment(record.created_at).format('MMM D, YYYY')}</Text>
          </div>
        </Card>
      ),
    }
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Mobile Header */}
      <Header style={{
        background: "#fff",
        padding: "0 15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 1,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>Tailor Panel</div>
        <Dropdown overlay={mobileMenu} trigger={["click"]}>
          <Button type="text" icon={<MenuOutlined style={{ fontSize: "20px" }} />} />
        </Dropdown>
      </Header>

      <Layout>
        {/* Desktop Sider */}
        <Sider 
          collapsible 
          collapsed={collapsed} 
          onCollapse={(value) => setCollapsed(value)}
          breakpoint="lg"
          collapsedWidth={windowWidth < 992 ? 0 : 80}
          width={250}
          style={{ 
            display: windowWidth < 992 ? "none" : "block",
            background: "#001529"
          }}
        >
          <div style={{ textAlign: "center", padding: "16px" }}>
            <Avatar 
              src={authUser?.avatar || `https://ui-avatars.com/api/?name=${authUser?.name}&background=random`} 
              size={collapsed ? 40 : 64} 
            />
            {!collapsed && (
              <h2 style={{ color: "#fff", fontSize: "20px", marginTop: "10px" }}>
                {authUser?.name || 'Tailor'}
              </h2>
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
            <Menu.Item key="orders" icon={<ShoppingOutlined />}>
              {!collapsed && "Orders"}
              {!collapsed && (
                <Badge 
                  count={getOrderCount('Pending')} 
                  style={{ backgroundColor: '#faad14', marginLeft: '10px' }} 
                />
              )}
            </Menu.Item>
            <Menu.Item key="profile" icon={<UserOutlined />}>
              {!collapsed && "Profile"}
            </Menu.Item>
            <Menu.Item key="logout" icon={<LogoutOutlined />}>
              {!collapsed && (
                <Link href="/tailor-panel/logout">Logout</Link>
              )}
            </Menu.Item>
          </Menu>
        </Sider>

        <Content style={{ padding: windowWidth < 768 ? "15px" : "24px", background: "#fff" }}>
          {activeKey === "dashboard" && (
            <>
              <h5 style={{ marginBottom: "20px" }}>Tailor Panel / Dashboard</h5>
              <Row gutter={[16, 16]}>
                {['All', ...statusOptions].map((status) => (
                  <Col xs={24} sm={12} md={8} lg={8} xl={6} key={status}>
                    <Card 
                      title={`${status} Orders`} 
                      style={{ 
                        textAlign: "center",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                      }}
                      headStyle={{ 
                        padding: "0 10px", 
                        minHeight: "auto",
                        fontSize: windowWidth < 768 ? "14px" : "16px"
                      }}
                      bodyStyle={{ padding: "10px" }}
                    >
                      <p style={{ 
                        fontSize: windowWidth < 768 ? '20px' : '24px', 
                        fontWeight: 'bold',
                        margin: 0
                      }}>
                        {getOrderCount(status)}
                      </p>
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          )}

          {activeKey === "orders" && (
            <>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 20 
              }}>
                <h5 style={{ margin: 0 }}>Tailor Panel / Orders</h5>
                <Text type="secondary">
                  Showing {ordersData.length} orders
                </Text>
              </div>
              <Table
                columns={windowWidth < 768 ? mobileOrderColumns : desktopOrderColumns}
                dataSource={ordersData}
                pagination={{ 
                  pageSize: 10,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '25', '50', '100'],
                  responsive: true
                }}
                size={windowWidth < 768 ? "small" : "middle"}
                style={{ width: "100%" }}
                rowKey="id"
                scroll={{ x: true }}
              />
            </>
          )}

          {/* Profile section remains the same */}

          {/* Enhanced Order Details Modal */}
          <Modal 
            title={`Order Details - ORD-${selectedOrder?.id?.toString().padStart(6, '0')}`} 
            visible={isModalOpen} 
            onCancel={() => setIsModalOpen(false)} 
            footer={[
              <Button key="back" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>,
              <Button 
                key="status"
                type="primary" 
                onClick={() => {
                  if (selectedOrder) {
                    const newStatus = 
                      selectedOrder.status === 'Completed' 
                        ? 'Processing' 
                        : 'Completed';
                    handleStatusChange(selectedOrder.id, newStatus);
                    setIsModalOpen(false);
                  }
                }}
              >
                {selectedOrder?.status === 'Completed' 
                  ? 'Mark as Processing' 
                  : 'Mark as Completed'}
              </Button>
            ]}
            width={windowWidth < 768 ? "90%" : "60%"}
          >
            {selectedOrder && (
              <div>
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Customer Information">
                    <div>
                      <Text strong>{selectedOrder.client?.first_name}</Text>
                      <br />
                      <Text>Phone: {selectedOrder.client?.mobile}</Text>
                      <br />
                      <Text>Email: {selectedOrder.client?.username || 'N/A'}</Text>
                    </div>
                  </Descriptions.Item>
                  
                  <Descriptions.Item label="Order Information">
                    <Space direction="vertical">
                      <div>
                        <Text strong>Item: </Text>
                        <Text>{selectedOrder.cloth_name}</Text>
                      </div>
                      <div>
                        <Text strong>Size: </Text>
                        <Text>{selectedOrder.size}</Text>
                      </div>
                      <div>
                        <Text strong>Quantity: </Text>
                        <Text>{selectedOrder.quantity}</Text>
                      </div>
                      <div>
                        <Text strong>Status: </Text>
                        <Tag color={statusColors[selectedOrder.status]}>
                          {selectedOrder.status}
                        </Tag>
                      </div>
                      <div>
                        <Text strong>Order Date: </Text>
                        <Text>
                          {moment(selectedOrder.created_at).format('MMMM Do YYYY, h:mm A')}
                        </Text>
                      </div>
                    </Space>
                  </Descriptions.Item>
                  
                  <Descriptions.Item label="Delivery Address">
                    {selectedOrder.address}
                  </Descriptions.Item>
                  
                  {selectedOrder.instructions && (
                    <Descriptions.Item label="Special Instructions">
                      <Text>{selectedOrder.instructions}</Text>
                    </Descriptions.Item>
                  )}
                  
                  {selectedOrder.design_image && (
                    <Descriptions.Item label="Design Image">
                      <div style={{ textAlign: 'center' }}>
                        <img 
                          src={selectedOrder.design_image.startsWith('http') 
                            ? selectedOrder.design_image 
                            : `/storage/${selectedOrder.design_image}`
                          } 
                          alt="Design" 
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: '300px',
                            objectFit: 'contain',
                            border: '1px solid #f0f0f0',
                            borderRadius: 4
                          }} 
                        />
                        <div style={{ marginTop: 8 }}>
                          <Button 
                            type="link" 
                            href={
                              selectedOrder.design_image.startsWith('http') 
                                ? selectedOrder.design_image 
                                : `/storage/${selectedOrder.design_image}`
                            }
                            target="_blank"
                          >
                            View Full Image
                          </Button>
                        </div>
                      </div>
                    </Descriptions.Item>
                  )}
                </Descriptions>
                
                <div style={{ marginTop: 24 }}>
                  <Text strong>Status History:</Text>
                  <div style={{ marginTop: 8 }}>
                    {/* You would typically map through status history here */}
                    <Tag color="blue" style={{ marginRight: 8 }}>
                      Created on {moment(selectedOrder.created_at).format('MMM D')}
                    </Tag>
                    <Tag color="green" style={{ marginRight: 8 }}>
                      Updated on {moment(selectedOrder.updated_at).format('MMM D')}
                    </Tag>
                  </div>
                </div>
              </div>
            )}
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;