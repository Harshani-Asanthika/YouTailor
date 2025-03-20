import React, { useState } from "react";
import {
  Layout,
  Menu,
  Table,
  Card,
  Row,
  Col,
  Avatar,
  Form,
  Input,
  Button,
  Upload,
  Tabs,
  message,
  Modal,
} from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  PlusCircleOutlined,
  DashboardOutlined,
  UploadOutlined,
  EditOutlined,
  LogoutOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import moment from "moment"; // For formatting time
import { Link } from "@inertiajs/react";

const { Header, Sider, Content } = Layout;

const ClientPanel = ({ client }) => {
  const [activeKey, setActiveKey] = useState("dashboard");
  const [isEditing, setIsEditing] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Use the client data passed from the backend
  const [user, setUser] = useState({
    avatar: client.avatar || "https://randomuser.me/api/portraits/women/50.jpg",
    name: client.name || "Jane Doe",
    email: client.email || "jane.doe@example.com",
    phone: client.phone || "+123 456 7890",
    address: client.address || "123 Main Street, New York",
  });

  // Sample orders data
  const ordersData = [
    { key: "1", orderId: "ORD001", item: "Custom Suit", status: "Pending", orderTime: "2025-02-01 12:00" },
    { key: "2", orderId: "ORD002", item: "Shirt", status: "Approved", orderTime: "2025-02-02 10:30" },
    { key: "3", orderId: "ORD003", item: "Dress", status: "Payment Completed", orderTime: "2025-02-01 14:45" },
    { key: "4", orderId: "ORD004", item: "Jacket", status: "Order Completed", orderTime: "2025-02-01 16:20" },
    { key: "5", orderId: "ORD005", item: "Trousers", status: "Cancelled", orderTime: "2025-02-02 09:15" },
  ];

  // Handle form submission for "Place Order"
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Form values:", values);
      message.success("Order placed successfully!");
    } catch (error) {
      message.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload for design image
  const handleUpload = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Add logout logic here
    message.success("Logged out successfully!");
    setIsLogoutModalVisible(false);
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f4f4f9" }}>
      <Sider width={250} style={{ background: "#1e1e2d", paddingTop: "20px" }} collapsedWidth={80} breakpoint="lg">
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Avatar src={user.avatar} size={80} style={{ border: "3px solid #fff" }} />
          <h2 style={{ color: "#fff", fontSize: "18px", marginTop: "10px" }}>Client Panel</h2>
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[activeKey]} onClick={(e) => setActiveKey(e.key)}>
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>Dashboard</Menu.Item>
          <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>My Orders</Menu.Item>
          <Menu.Item key="placeOrder" icon={<PlusCircleOutlined />}>Place Order</Menu.Item>
          <Menu.Item key="profile" icon={<UserOutlined />}>Profile</Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={() => setIsLogoutModalVisible(true)}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header style={{ background: "#ff6b00", color: "#fff", textAlign: "center", fontSize: "22px", fontWeight: "bold", padding: "15px", borderRadius: "0 0 10px 10px" }}>Welcome, {user.name}</Header>
        <Content style={{ padding: "30px" }}>
          {activeKey === "dashboard" && (
            <Row gutter={[16, 16]}>
              {["All", "Pending", "Approved", "Payment Completed", "Order Completed", "Cancelled"].map((status, index) => (
                <Col xs={24} sm={12} md={8} lg={6} key={index}>
                  <Card title={`${status} Orders`} style={{ textAlign: "center", borderRadius: "10px", boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)" }}>
                    <p style={{ fontSize: "24px", fontWeight: "bold" }}>{ordersData.filter(order => status === "All" || order.status === status).length}</p>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {activeKey === "orders" && (
            <Card title="My Orders" style={{ border: "none", boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)", borderRadius: "10px" }}>
              <Tabs defaultActiveKey="All">
                {["All", "Pending", "Approved", "Payment Completed", "Order Completed", "Cancelled"].map((status) => (
                  <Tabs.TabPane tab={`${status} Orders`} key={status}>
                    <Table
                      columns={[
                        { title: "Order ID", dataIndex: "orderId", key: "orderId" },
                        { title: "Item", dataIndex: "item", key: "item" },
                        { title: "Status", dataIndex: "status", key: "status" },
                        { title: "Order Time", dataIndex: "orderTime", key: "orderTime", render: (text) => moment(text).format("YYYY-MM-DD HH:mm") },
                        {
                          title: "Action",
                          key: "action",
                          render: (_, record) => (
                            <Button type="link" onClick={() => console.log("View order:", record)}>
                              View Details
                            </Button>
                          ),
                        },
                      ]}
                      dataSource={ordersData.filter(order => status === "All" || order.status === status)}
                      pagination={{ pageSize: 5 }}
                    />
                  </Tabs.TabPane>
                ))}
              </Tabs>
            </Card>
          )}

          {activeKey === "placeOrder" && (
            <Card title="Place a New Order" style={{ border: "none", boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)", borderRadius: "10px" }}>
              <Form layout="vertical" onFinish={onFinish}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={24} md={12} lg={6}>
                    <Form.Item label="Full Name" name="fullName" rules={[{ required: true, message: "Please enter your full name" }]}>
                      <Input placeholder="Enter your full name" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={6}>
                    <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter your email" }]}>
                      <Input placeholder="Enter your email" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={6}>
                    <Form.Item label="Address" name="address" rules={[{ required: true, message: "Please enter your address" }]}>
                      <Input placeholder="Enter your address" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={6}>
                    <Form.Item label="Mobile" name="mobile" rules={[{ required: true, message: "Please enter your mobile number" }]}>
                      <Input placeholder="Enter your mobile number" />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label="Design Image" name="designImage">
                  <Upload accept="image/*" beforeUpload={() => false} listType="picture-card" onChange={handleUpload}>
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload Design</div>
                    </div>
                  </Upload>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading} style={{ background: "#ff6b00", borderColor: "#ff6b00", width: "100%", borderRadius: "5px" }}>
                    Place Order
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          )}

          {activeKey === "profile" && (
            <Card title="Profile" style={{ border: "none", boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)", borderRadius: "10px" }}>
              {isEditing ? (
                <Form form={form} layout="vertical" initialValues={user}>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={12} lg={6}>
                      <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter your name" }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={6}>
                      <Form.Item label="Email" name="email">
                        <Input disabled />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={6}>
                      <Form.Item label="Phone" name="phone" rules={[{ required: true, message: "Please enter your phone number" }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={6}>
                      <Form.Item label="Address" name="address" rules={[{ required: true, message: "Please enter your address" }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Button type="primary" onClick={() => setIsEditing(false)}>
                    Save Changes
                  </Button>
                </Form>
              ) : (
                <div>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={12} lg={6}>
                      <div style={{ fontWeight: "bold" }}>Name:</div>
                      <div>{user.name}</div>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={6}>
                      <div style={{ fontWeight: "bold" }}>Email:</div>
                      <div>{user.email}</div>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={6}>
                      <div style={{ fontWeight: "bold" }}>Phone:</div>
                      <div>{user.phone}</div>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={6}>
                      <div style={{ fontWeight: "bold" }}>Address:</div>
                      <div>{user.address}</div>
                    </Col>
                  </Row>
                  <Button type="primary" style={{ marginTop: "20px" }} onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                </div>
              )}
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