import React, { useState } from "react";
import { Layout, Menu, Tabs, Table, Tag, Modal, Button, Card, Row, Col, Avatar, Form, Input, Upload, message } from "antd";
import { DashboardOutlined, ShoppingOutlined, UserOutlined, UploadOutlined, EditOutlined } from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState("dashboard");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [user, setUser] = useState({
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+123 456 7890",
    address: "123 Main Street, New York",
  });

  const ordersData = [
    { key: "1", orderId: "ORD001", customer: "John Doe", address: "New York", orderTime: "2025-01-01 10:30 AM", status: "Pending" },
    { key: "2", orderId: "ORD002", customer: "Jane Smith", address: "Los Angeles", orderTime: "2025-01-02 2:00 PM", status: "Accepted" },
    { key: "3", orderId: "ORD003", customer: "Alice Johnson", address: "Chicago", orderTime: "2025-01-03 11:15 AM", status: "Payment Completed" },
    { key: "4", orderId: "ORD004", customer: "Bob White", address: "Miami", orderTime: "2025-01-04 12:00 PM", status: "Order Completed" },
    { key: "5", orderId: "ORD005", customer: "Charlie Brown", address: "Dallas", orderTime: "2025-01-05 3:30 PM", status: "Cancelled" },
  ];

  const getOrderCount = (status) => ordersData.filter(order => status === "All" || order.status === status).length;

  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue(user);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      setUser(values);
      setIsEditing(false);
      message.success("Profile updated successfully!");
    });
  };

  const handleOrderClick = (record) => {
    setSelectedOrder(record);
    setIsModalOpen(true);
  };

  const getStatusTagColor = (status) => {
    switch (status) {
      case "Pending":
        return "yellow";
      case "Accepted":
        return "blue";
      case "Payment Completed":
        return "green";
      case "Order Completed":
        return "purple";
      case "Cancelled":
        return "red";
      default:
        return "default";
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{ textAlign: "center", padding: "16px" }}>
          <Avatar src={user.avatar} size={64} />
          <h2 style={{ color: "#fff", fontSize: collapsed ? 16 : 20 }}>YouTailor</h2>
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[activeKey]} onClick={(e) => setActiveKey(e.key)}>
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>Dashboard</Menu.Item>
          <Menu.Item key="orders" icon={<ShoppingOutlined />}>Orders</Menu.Item>
          <Menu.Item key="profile" icon={<UserOutlined />}>Profile</Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header style={{ textAlign: "center", background: "#fff", fontSize: "20px", fontWeight: "bold" }}>Admin Panel</Header>
        <Content style={{ padding: "24px", background: "#fff" }}>
          {activeKey === "dashboard" && (
            <>
            <h5>Tailor Panel / Dashboard</h5>
            <Row gutter={[16, 16]}>
              {["All", "Pending", "Accepted", "Payment Completed", "Order Completed", "Cancelled"].map((status) => (
                <Col span={8} key={status}>
                  <Card title={`${status} Orders`} style={{ textAlign: "center" }}>
                    <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{getOrderCount(status)}</p>
                  </Card>
                </Col>
              ))}
            </Row>
            </>
          )}

          {activeKey === "orders" && (
            <>
             <h5>Tailor Panel / Orders</h5>
            
            <Tabs>
              {["All", "Pending", "Accepted", "Payment Completed", "Order Completed", "Cancelled"].map((status) => (
                <Tabs.TabPane tab={`${status} Orders`} key={status}>
                  <Table
                    columns={[
                      { title: "Order ID", dataIndex: "orderId", key: "orderId" },
                      { title: "Customer", dataIndex: "customer", key: "customer" },
                      { title: "Status", dataIndex: "status", key: "status", render: (status) => <Tag color={getStatusTagColor(status)}>{status}</Tag> }
                    ]}
                    dataSource={ordersData.filter(order => status === "All" || order.status === status)}
                    pagination={{ pageSize: 5 }}
                    onRow={(record) => ({ onClick: () => handleOrderClick(record) })}
                  />
                </Tabs.TabPane>
              ))}
            </Tabs>
            </>
          )}

{activeKey === "profile" && (
  <>
    <h5>Tailor Panel / Profile</h5>
    <Card>
      <Avatar src={user.avatar} size={80} />
      {isEditing ? (
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Name" name="name">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Email" name="email">
                <Input />
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
            <Col span={12}>
              <Form.Item label="Upload Avatar" name="avatar">
                <Upload beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Button type="primary" onClick={handleSave}>Save</Button>
        </Form>
      ) : (
        <div>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Address:</strong> {user.address}</p>
          <Button icon={<EditOutlined />} onClick={handleEdit}>Edit</Button>
        </div>
      )}
    </Card>
  </>
)}



          <Modal title="Order Details" visible={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
            {selectedOrder && (
              <div>
                <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
                <p><strong>Customer:</strong> {selectedOrder.customer}</p>
                <p><strong>Address:</strong> {selectedOrder.address}</p>
                <p><strong>Order Time:</strong> {selectedOrder.orderTime}</p>
                <p><strong>Status:</strong> <Tag color={getStatusTagColor(selectedOrder.status)}>{selectedOrder.status}</Tag></p>
              </div>
            )}
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
