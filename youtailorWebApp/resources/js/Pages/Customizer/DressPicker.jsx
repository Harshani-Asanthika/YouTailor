import React from 'react';
import styled from 'styled-components';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

// Styled Components
const DressPickerContainer = styled.div`
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 40px;
  font-weight: 600;
`;

const CardsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: white;
  border-radius: 15px;
  padding: 20px;
  width: 300px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 200px;
  background: #e0e0e0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;

  img {
    max-width: 100%;
    max-height: 100%;
    border-radius: 10px;
  }
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
  font-weight: 600;
`;

const CardDescription = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 20px;
`;

const DesignButton = styled.button`
  background: rgb(255, 208, 0);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: rgb(0, 0, 0);
  }
`;

// DressPicker Component
function DressPicker() {
  return (
    <>
      <Navbar />
      <DressPickerContainer>
        <Title>Design Your Outfit</Title>
        <CardsContainer>
          {/* T-Shirt Design Card */}
          <Card>
            <CardImage>
              <img src="/Images/T-pick.png" alt="T-shirt" />
            </CardImage>
            <CardTitle>Design a T-Shirt</CardTitle>
            <CardDescription>
              Customize your T-Shirt with unique designs and colors.
            </CardDescription>
            <DesignButton onClick={() => (window.location.href = "/design")}>
              Design Now
            </DesignButton>
          </Card>

          {/* Trouser Design Card */}
          <Card>
            <CardImage>
              <img src="/Images/Trouser-pick.png" alt="Trouser" />
            </CardImage>
            <CardTitle>Design a Trouser</CardTitle>
            <CardDescription>
              Create your perfect pair of trousers with custom fits and styles.
            </CardDescription>
            <DesignButton onClick={() => (window.location.href = "/design/trouser")}>
              Design Now
            </DesignButton>
          </Card>

          {/* Gown Design Card */}
          <Card>
            <CardImage>
              <img src="/Images/Gown-pick.png" alt="Gown" />
            </CardImage>
            <CardTitle>Design a Gown</CardTitle>
            <CardDescription>
              Design an elegant gown tailored to your preferences.
            </CardDescription>
            <DesignButton onClick={() => (window.location.href = "/design/gown")}>
              Design Now
            </DesignButton>
          </Card>
        </CardsContainer>
      </DressPickerContainer>
      <Footer />
    </>
  );
}

export default DressPicker;
