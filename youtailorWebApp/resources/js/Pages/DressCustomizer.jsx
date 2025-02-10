import React, { useState, useEffect } from "react";
import { ShoppingOutlined } from '@ant-design/icons';
import { Layout, Menu, Tabs, Table, Tag, Modal, Button, Card, Row, Col, theme } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState("dashboard");
  const [ordersData, setOrdersData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // Sample data for orders
  const sampleOrdersData = [
    {
      key: "1",
      orderId: "ORD001",
      customer: "John Doe",
      address: "123 Main Street, New York",
      orderTime: "2025-01-01 10:30 AM",
      status: "Pending",
    },
    {
      key: "2",
      orderId: "ORD002",
      customer: "Jane Smith",
      address: "456 Elm Street, Los Angeles",
      orderTime: "2025-01-02 2:00 PM",
      status: "Accepted",
    },
    {
      key: "3",
      orderId: "ORD003",
      customer: "Alice Johnson",
      address: "789 Oak Avenue, Chicago",
      orderTime: "2025-01-03 11:15 AM",
      status: "Payment Completed",
    },
    {
      key: "4",
      orderId: "ORD004",
      customer: "Mark Brown",
      address: "321 Pine Lane, Houston",
      orderTime: "2025-01-04 4:45 PM",
      status: "Cancelled",
    },
    {
      key: "5",
      orderId: "ORD005",
      customer: "Lily Adams",
      address: "555 Birch Road, Boston",
      orderTime: "2025-01-05 9:30 AM",
      status: "Pending",
    },
    {
      key: "6",
      orderId: "ORD006",
      customer: "George Miller",
      address: "666 Cedar Road, Miami",
      orderTime: "2025-01-06 3:15 PM",
      status: "Order Completed",
    },
  ];

  useEffect(() => {
    // In a real application, fetch the data from an API
    setOrdersData(sampleOrdersData);
  }, []);

  // Helper function to get orders count based on status
  const getOrderCount = (status) => {
    const today = new Date().toISOString().slice(0, 10); // Get today's date in 'YYYY-MM-DD' format
    return ordersData.filter(
      (order) =>
        order.status === status &&
        order.orderTime.slice(0, 10) === today
    ).length;
  };

  // Define table columns
  const ordersColumns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Customer Name",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Order Time",
      dataIndex: "orderTime",
      key: "orderTime",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color;
        switch (status) {
          case "Pending":
            color = "orange";
            break;
          case "Accepted":
            color = "blue";
            break;
          case "Payment Completed":
            color = "green";
            break;
          case "Order Completed":
            color = "gold";
            break;
          case "Cancelled":
            color = "red";
            break;
          default:
            color = "default";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  // Handle row click for modal
  const handleRowClick = (record) => {
    setSelectedOrder(record);
    setIsModalOpen(true);
  };

  // Close modal
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          style={{
            height: 64,
            background: "rgba(255, 255, 255, 0.3)",
            margin: 16,
          }}
        >
          <h2
            style={{
              color: "#fff",
              fontSize: collapsed ? 16 : 20,
              textAlign: "center",
              padding: 10,
            }}
          >
            Admin Panel
          </h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeKey]}
          onClick={(e) => setActiveKey(e.key)}
        >
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="orders" icon={<ShoppingOutlined />}>
  Orders
</Menu.Item>
          <Menu.Item key="settings" icon={<SettingOutlined />}>
            Settings
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main Content */}
      <Layout className="site-layout">
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            textAlign: "center",
          }}
        >
          <h1>Welcome to Tailor Panel</h1>
        </Header>
        <Content style={{ margin: "16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            {/* Dashboard Content with Order Counts */}
            {activeKey === "dashboard" && (
              <>
                <h2>Dashboard Overview</h2>
                <Row gutter={16}>
  <Col span={8}>
    <Card
      title={
        <div style={{ backgroundColor: '#007BFF', color: '#FFF', padding: '5px 10px', borderRadius: '4px' }}>
          Total Orders Today
        </div>
      }
      bordered={false}
      style={{ backgroundColor: '#E3F2FD', marginBottom: '16px', textAlign: 'center' }}
    >
      <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{getOrderCount("All")}</p>
    </Card>
  </Col>
  <Col span={8}>
    <Card
      title={
        <div style={{ backgroundColor: '#FFC107', color: '#000', padding: '5px 10px', borderRadius: '4px' }}>
          Pending Orders Today
        </div>
      }
      bordered={false}
      style={{ backgroundColor: '#FFF8E1', marginBottom: '16px', textAlign: 'center' }}
    >
      <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{getOrderCount("Pending")}</p>
    </Card>
  </Col>
  <Col span={8}>
    <Card
      title={
        <div style={{ backgroundColor: '#28A745', color: '#FFF', padding: '5px 10px', borderRadius: '4px' }}>
          Accepted Orders Today
        </div>
      }
      bordered={false}
      style={{ backgroundColor: '#E8F5E9', marginBottom: '16px', textAlign: 'center' }}
    >
      <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{getOrderCount("Accepted")}</p>
    </Card>
  </Col>
</Row>
<Row gutter={16}>
  <Col span={8}>
    <Card
      title={
        <div style={{ backgroundColor: '#17A2B8', color: '#FFF', padding: '5px 10px', borderRadius: '4px' }}>
          Payment Completed Orders Today
        </div>
      }
      bordered={false}
      style={{ backgroundColor: '#E0F7FA', marginBottom: '16px', textAlign: 'center' }}
    >
      <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{getOrderCount("Payment Completed")}</p>
    </Card>
  </Col>
  <Col span={8}>
    <Card
      title={
        <div style={{ backgroundColor: '#6C757D', color: '#FFF', padding: '5px 10px', borderRadius: '4px' }}>
          Completed Orders Today
        </div>
      }
      bordered={false}
      style={{ backgroundColor: '#F8F9FA', marginBottom: '16px', textAlign: 'center' }}
    >
      <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{getOrderCount("Order Completed")}</p>
    </Card>
  </Col>
  <Col span={8}>
    <Card
      title={
        <div style={{ backgroundColor: '#DC3545', color: '#FFF', padding: '5px 10px', borderRadius: '4px' }}>
          Cancelled Orders Today
        </div>
      }
      bordered={false}
      style={{ backgroundColor: '#FDECEA', marginBottom: '16px', textAlign: 'center' }}
    >
      <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{getOrderCount("Cancelled")}</p>
    </Card>
  </Col>
</Row>


             </>
            )}

            {/* Orders Tab Content */}
            {activeKey === "orders" && (
              <>
                <h2>Orders Overview</h2>
                <Tabs defaultActiveKey="All" centered>
                  <Tabs.TabPane tab="All Orders" key="All">
                    <Table
                      columns={ordersColumns}
                      dataSource={ordersData}
                      pagination={{ pageSize: 5 }}
                      onRow={(record) => ({
                        onClick: () => handleRowClick(record),
                      })}
                    />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Pending Orders" key="Pending">
                    <Table
                      columns={ordersColumns}
                      dataSource={ordersData.filter(
                        (order) => order.status === "Pending"
                      )}
                      pagination={{ pageSize: 5 }}
                      onRow={(record) => ({
                        onClick: () => handleRowClick(record),
                      })}
                    />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Accepted Orders" key="Accepted">
                    <Table
                      columns={ordersColumns}
                      dataSource={ordersData.filter(
                        (order) => order.status === "Accepted"
                      )}
                      pagination={{ pageSize: 5 }}
                      onRow={(record) => ({
                        onClick: () => handleRowClick(record),
                      })}
                    />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Payment Completed Orders" key="Payment Completed">
                    <Table
                      columns={ordersColumns}
                      dataSource={ordersData.filter(
                        (order) => order.status === "Payment Completed"
                      )}
                      pagination={{ pageSize: 5 }}
                      onRow={(record) => ({
                        onClick: () => handleRowClick(record),
                      })}
                    />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Order Completed Orders" key="Order Completed">
                    <Table
                      columns={ordersColumns}
                      dataSource={ordersData.filter(
                        (order) => order.status === "Order Completed"
                      )}
                      pagination={{ pageSize: 5 }}
                      onRow={(record) => ({
                        onClick: () => handleRowClick(record),
                      })}
                    />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Cancelled Orders" key="Cancelled">
                    <Table
                      columns={ordersColumns}
                      dataSource={ordersData.filter(
                        (order) => order.status === "Cancelled"
                      )}
                      pagination={{ pageSize: 5 }}
                      onRow={(record) => ({
                        onClick: () => handleRowClick(record),
                      })}
                    />
                  </Tabs.TabPane>
                </Tabs>
              </>
            )}

            {/* Modal for Order Details */}
            <Modal
              title="Order Details"
              open={isModalOpen}
              onCancel={handleModalClose}
              footer={[
                <Button key="close" onClick={handleModalClose}>
                  Close
                </Button>,
              ]}
            >
              {selectedOrder && (
                <div>
                  <p>
                    <strong>Order ID:</strong> {selectedOrder.orderId}
                  </p>
                  <p>
                    <strong>Customer Name:</strong> {selectedOrder.customer}
                  </p>
                  <p>
                    <strong>Address:</strong> {selectedOrder.address}
                  </p>
                  <p>
                    <strong>Order Time:</strong> {selectedOrder.orderTime}
                  </p>
                </div>
              )}
            </Modal>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
