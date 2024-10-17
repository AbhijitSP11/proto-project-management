import React from 'react'
import { Authenticator, ThemeProvider, View, useTheme } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import "@aws-amplify/ui-react/styles.css";
import { motion } from 'framer-motion';
import StartServicesButton from '@/components/StartServicesButton';

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID ?? "Unknown user pool Id", 
            userPoolClientId: process.env.NEXT_PUBLIC_CLIENT_USER_POOL_ID ?? "Unknown client Id" 
        }
    }
});

const formFields = {
    signUp: {
      username: {
        order: 1,
        placeholder: 'Enter your username',
        label: 'Username',
        inputProps: { required: true },
      },
      email: {
        order: 2,
        placeholder: 'Enter your email',
        label: 'Email',
        inputProps: { required: true, type: 'email' },
      },
      password: {
        order: 3,
        placeholder: 'Password',
        label: 'Password',
        inputProps: { required: true, type: 'password' },
      },
      confirm_password: {
        order: 4,
        placeholder: 'Confirm Password',
        label: 'Confirm Password',
        inputProps: { required: true, type: 'password' },
      },
    },
    signIn: {
      username: {
        order: 1,
        placeholder: 'Username or email',
        label: 'Username',
        inputProps: { required: true },
      },
      password: {
        order: 2,
        placeholder: 'Password',
        label: 'Password',
        inputProps: { required: true, type: 'password' },
      },
    },
  };


  const theme = {
    name: 'modern-form-theme',
    tokens: {
      components: {
        button: {
          fontSize: { value: '1rem' },
          borderRadius: { value: '8px' },
          paddingBlock: { value: '12px' },
          paddingInline: { value: '24px' },
          primary: {
            backgroundColor: { value: '#2563EB' },
            color: { value: '#fff' },
            _hover: {
              backgroundColor: { value: '#1D4ED8' },
            },
          },
        },
        input: {
          borderColor: { value: '#CBD5E1' },
          _focus: {
            borderColor: { value: '#2563EB' },
          },
          padding: { value: '12px' },
          borderRadius: { value: '8px' },
        },
      },
    },
  };
  
  const AuthProvider = ({ children }: any) => {
    return (
      <ThemeProvider theme={theme}>
        <Authenticator formFields={formFields}>
          {({ user }) => (
            <div>
                {!user && <h1 className="text-4xl font-semibold mb-6">Log in to your Account</h1>}
                {user ? (
                <div className="w-full flex flex-col">{children} <StartServicesButton/></div>
                ) : (
                <motion.div
                    className="flex flex-col gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    {/* Amplify form fields will be rendered here */}
                </motion.div>
                )}
            </div>
          )}
        </Authenticator>
      </ThemeProvider>
    );
  };
  
export default AuthProvider