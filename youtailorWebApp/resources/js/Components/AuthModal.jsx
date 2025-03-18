import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Tabs, Form, Input, Button, Row, Col, notification } from 'antd';
import '../../css/AuthModal.css';

const { TabPane } = Tabs;

const AuthModal = ({ show, onHide }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");

  useEffect(() => {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (token) {
      axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
    }
  }, []);

  const openNotification = (type, message) => {
    notification[type]({
      message: type === 'success' ? 'Success' : 'Error',
      description: message,
    });
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);

    try {
      const url = activeTab === "signin" ? "/client-panel/signin/process" : "/client-panel/signup/process";
      const response = await axios.post(url, values);

      if (response.data.success) {
        notification.success({ message: 'Success', description: response.data.message });

        if (activeTab === "signup") {
          setActiveTab("signin"); // Switch to login form
          form.resetFields();
        } else {
          setTimeout(() => {
            onHide(); // Close modal after successful login
            window.location.href = response.data.redirect; // Redirect to /client-panel
        }, 2000); // Redirect after 2 seconds
          
        }
      } else {
        notification.error({ message: 'Error', description: response.data.message });
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        Object.keys(error.response.data.errors).forEach((key) => {
          openNotification('error', error.response.data.errors[key][0]);
        });
      } else {
        openNotification('error', 'An unexpected error occurred! Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={show} onCancel={onHide} centered footer={null}>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {/* Sign In Tab */}
        <TabPane tab="Sign In" key="signin">
          <Form
            name="signin"
            onFinish={handleSubmit}
            layout="vertical"
            initialValues={{ username: "", password: "" }}
          >
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: 'Please enter your username!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter your password!' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Form.Item>
          </Form>
        </TabPane>

        {/* Sign Up Tab */}
        <TabPane tab="Sign Up" key="signup">
          <Form
            form={form}
            name="signup"
            onFinish={handleSubmit}
            layout="vertical"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="firstName"
                  label="First Name"
                  rules={[{ required: true, message: 'Please enter your first name!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="lastName"
                  label="Last Name"
                  rules={[{ required: true, message: 'Please enter your last name!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="mobile"
                  label="Mobile"
                  rules={[{ required: true, message: 'Please enter your mobile number!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true, message: 'Please enter your email!' }, { type: 'email', message: 'Invalid email format!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: 'Please enter your address!' }]}
            >
              <Input.TextArea rows={2} />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true, message: 'Please enter your password!' }]}
                >
                  <Input.Password />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="confirmPassword"
                  label="Confirm Password"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Please confirm your password!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Passwords do not match!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={isLoading}>
                {isLoading ? 'Signing Up...' : 'Sign Up'}
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default AuthModal;
