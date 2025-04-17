/**
 * Sophie Image Classifier Page
 * 
 * This page provides an AI-powered image classification tool using Flowise AI.
 * It allows users to upload images and get classifications through a chat interface.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BubbleChat } from 'flowise-embed-react';
import SizibleNavigation from '../../../components/common/SizibleNavigation';
import SizibleButton from '../../../components/common/SizibleButton';

// Styled components
const PageContainer = styled.div`
  padding: ${props => props.theme.spacing.large};
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.large};
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${props => props.theme.spacing.medium};
  }
`;

const ToolDescription = styled.div`
  margin-bottom: ${props => props.theme.spacing.large};
  
  p {
    margin-bottom: ${props => props.theme.spacing.medium};
  }
`;

const ChatContainer = styled.div`
  height: 600px;
  border-radius: ${props => props.theme.borderRadius.medium};
  overflow: hidden;
  margin-top: ${props => props.theme.spacing.large};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

/**
 * Sophie Image Classifier Page Component
 * 
 * @returns {JSX.Element} The Sophie Image Classifier page component
 */
const SophieImageClassifierPage = () => {
  const navigate = useNavigate();
  
  // Check if admin is authenticated
  React.useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [navigate]);
  
  const handleBack = () => {
    navigate('/admin/tools');
  };

  return (
    <>
      <SizibleNavigation />
      <PageContainer>
        <PageHeader>
          <h1>Sophie - Image Classifier</h1>
          <SizibleButton variant="secondary" onClick={handleBack}>
            Back to Tools
          </SizibleButton>
        </PageHeader>
        
        <ToolDescription>
          <h2>AI-Powered Image Classification</h2>
          <p>
            Sophie is an advanced AI tool that can analyze and classify fashion images. 
            Upload an image through the chat interface below, and Sophie will identify 
            the garment type, style, color, and other relevant attributes.
          </p>
          <p>
            This tool helps streamline product categorization and can be used to ensure 
            consistent tagging across your product catalog.
          </p>
        </ToolDescription>
        
        <h3>How to use:</h3>
        <ol>
          <li>Click on the chat bubble in the bottom-right corner</li>
          <li>Upload an image of a fashion item</li>
          <li>Ask Sophie to analyze or classify the image</li>
          <li>Review the AI-generated classification results</li>
        </ol>
        
        <ChatContainer>
          <BubbleChat
            chatflowid="56dfa1fa-3d47-4fa8-a864-e0008cc5d705"
            apiHost="https://flowise-x5lp.onrender.com"
            theme={{
              chatWindow: {
                welcomeMessage: "Hello! I'm Sophie, your fashion image classifier. Upload an image and I'll analyze it for you.",
                backgroundColor: "#ffffff",
                height: 600,
                width: "100%",
                fontSize: 16,
                poweredByTextColor: "#303235",
                botMessage: {
                  backgroundColor: "#f7f8ff",
                  textColor: "#303235",
                  showAvatar: true,
                  avatarSrc: "https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/parroticon.png",
                },
                userMessage: {
                  backgroundColor: "#ff69b4",
                  textColor: "#ffffff",
                  showAvatar: true,
                  avatarSrc: "https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/usericon.png",
                },
                textInput: {
                  placeholder: "Upload an image or ask a question...",
                  backgroundColor: "#ffffff",
                  textColor: "#303235",
                  sendButtonColor: "#ff69b4",
                }
              }
            }}
          />
        </ChatContainer>
      </PageContainer>
    </>
  );
};

export default SophieImageClassifierPage;
