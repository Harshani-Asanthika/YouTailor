import React, { useState } from "react";
import { Layout, Menu, Table, Card, Row, Col, Avatar, Form, Input, Button, Upload, Tabs, message } from "antd";
import { ShoppingCartOutlined, UserOutlined, PlusCircleOutlined, DashboardOutlined, UploadOutlined, EditOutlined, LogoutOutlined } from "@ant-design/icons";
import moment from "moment"; // Import moment for formatting time
import { Link } from "@inertiajs/react";

const { Header, Sider, Content } = Layout;

const ClientPanel = () => {
  const [activeKey, setActiveKey] = useState("dashboard");
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [user, setUser] = useState({
    avatar: "https://randomuser.me/api/portraits/women/50.jpg",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "+123 456 7890",
    address: "123 Main Street, New York",
  });

  // Add orderTime to each order
  const ordersData = [
    { key: "1", orderId: "ORD001", item: "Custom Suit", status: "Pending", orderTime: "2025-02-01 12:00" },
    { key: "2", orderId: "ORD002", item: "Shirt", status: "Approved", orderTime: "2025-02-02 10:30" },
    { key: "3", orderId: "ORD003", item: "Dress", status: "Payment Completed", orderTime: "2025-02-01 14:45" },
    { key: "4", orderId: "ORD004", item: "Jacket", status: "Order Completed", orderTime: "2025-02-01 16:20" },
    { key: "5", orderId: "ORD005", item: "Trousers", status: "Cancelled", orderTime: "2025-02-02 09:15" },
  ];

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
          <Menu.Item key="logout" icon={<LogoutOutlined />}>
          <Link href="/client-panel/logout">
          Logout
          </Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header style={{ background: "#ff6b00", color: "#fff", textAlign: "center", fontSize: "22px", fontWeight: "bold", padding: "15px", borderRadius: "0 0 10px 10px" }}>Welcome, {user.name}</Header>
        <Content style={{ padding: "30px" }}>
          {activeKey === "dashboard" && (
            <Row gutter={[16, 16]}>
              {["All", "Pending", "Approved", "Payment Completed", "Order Completed", "Cancelled"].map((status, index) => (
                <Col span={8} key={index}>
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
                        { title: "Order Time", dataIndex: "orderTime", key: "orderTime", render: (text) => moment(text).format("YYYY-MM-DD HH:mm") }, // Format order time
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
              <Form layout="vertical">
                <Form.Item label="Item Name" name="item"><Input placeholder="Enter item name" /></Form.Item>
                <Button type="primary" style={{ background: "#ff6b00", borderColor: "#ff6b00", width: "100%", borderRadius: "5px" }}>Place Order</Button>
              </Form>
            </Card>
          )}

{activeKey === "profile" && (
  <Card
    title="Profile"
    style={{
      border: "none",
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
      borderRadius: "10px",
    }}
  >
    {isEditing ? (
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item label="Name" name="name">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Email" name="email">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Phone" name="phone">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Address" name="address">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Button
          type="primary"
          onClick={() => {
            setIsEditing(false);
            // Here, you can handle saving the updated profile data
            message.success("Profile updated successfully!");
          }}
        >
          Save Changes
        </Button>
      </Form>
    ) : (
      <div>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <div style={{ fontWeight: "bold" }}>Name:</div>
            <div>{user.name}</div>
          </Col>
          <Col span={12}>
            <div style={{ fontWeight: "bold" }}>Email:</div>
            <div>{user.email}</div>
          </Col>
          <Col span={12}>
            <div style={{ fontWeight: "bold" }}>Phone:</div>
            <div>{user.phone}</div>
          </Col>
          <Col span={12}>
            <div style={{ fontWeight: "bold" }}>Address:</div>
            <div>{user.address}</div>
          </Col>
        </Row>
        <Button
          type="primary"
          style={{ marginTop: "20px" }}
          onClick={() => setIsEditing(true)}
        >
          Edit Profile
        </Button>
      </div>
    )}
  </Card>
)}

        </Content>
      </Layout>
    </Layout>
  );
};

export default ClientPanel;
