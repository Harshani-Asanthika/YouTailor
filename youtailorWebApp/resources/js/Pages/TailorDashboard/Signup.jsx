import React, { useState, useEffect } from 'react';
import { message, Form, Input, Button, Row, Col, Card } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';

function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: ''
  });

  const [alert, setAlert] = useState('');

  // Fetch CSRF token from the document head
  useEffect(() => {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (token) {
      axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
    }
  }, []);

  const handleSubmit = async (values) => {
    const { firstName, lastName, username, email, password } = values;
    console.log(values);
    try {
      const response = await axios.post('/tailor-panel/signup/process', values);

      if (response.data.success) {
        message.success(response.data.message);
        // Optionally, redirect after successful sign-up
      } else {
        message.error(response.data.message);
      }
    } catch (error) {


      message.error('An error occurred! Please try again.');

    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div style={{ padding: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Row justify="center" style={{ width: '100%' }}>
        <Col xs={24} sm={16} md={12} lg={8}>
          <Card title="Tailor Sign Up" bordered={false} style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)' }}>
            {alert && (
              <div style={{ marginBottom: '20px', color: alert.includes('success') ? '#52c41a' : '#f5222d', fontWeight: 'bold' }}>
                {alert}
              </div>
            )}

            <Form onFinish={handleSubmit} layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'Please enter your first name!' }]}>
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: 'Please enter your last name!' }]}>
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </Form.Item>
                </Col>
              </Row>



              <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter your email!' }, { type: 'email', message: 'The input is not a valid E-mail!' }]}>
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Item>

              <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter your password!' }]}>
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Form.Item>

              <Form.Item label="Password" name="confirmPassword" rules={[{ required: true, message: 'Please enter password again!' }]}>
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter your password again"

                  onChange={handleChange}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Sign Up
                </Button>
              </Form.Item>
            </Form>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              Already have an account? <a href="/tailor-panel/signin">Sign In</a>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Signup;
