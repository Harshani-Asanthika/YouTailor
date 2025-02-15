import React, { useState } from 'react';
import { message, Form, Input, Button, Row, Col, Card } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';

function Signin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [alert, setAlert] = useState('');

  const handleSubmit = async (values) => {
   

    console.log(values);

    try{


      const response = await axios.post('/tailor-panel/signin/process',values);
      if(response.status == 200){


        if(response.data.success){

          message.success(response.data.message);

          window.location.href = "/tailor-panel"; 


        }else{

          message.error(response.data.message);
        }


      }else{

        message.error("Network error");
      }


    }catch(error){
message.error("Network error");

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
          <Card title="Tailor Sign In" bordered={false} style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)' }}>
            {/* Error or Success Alert */}
            {alert && (
              <div style={{ marginBottom: '20px', color: alert.includes('success') ? '#52c41a' : '#f5222d', fontWeight: 'bold' }}>
                {alert}
              </div>
            )}

            <Form onFinish={handleSubmit} layout="vertical">
              <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please enter your username!' }]}>
                <Input 
                  prefix={<MailOutlined />} 
                  placeholder="Enter your Username" 
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

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Sign In
                </Button>
              </Form.Item>
            </Form>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              Don't have an account? <a href="/tailor-panel/signup">Sign Up</a>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Signin;
