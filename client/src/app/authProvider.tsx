import React, { ReactNode } from 'react'
import {Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from 'aws-amplify';
import "@aws-amplify/ui-react/styles.css";
import { signUp } from 'aws-amplify/auth';

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID ?? "Unknown user pool Id", 
            userPoolClientId: process.env.NEXT_PUBLIC_CLIENT_USER_POOL_ID ?? "Unknown client Id" 
        }
    }
});

const formFields = {
    signUp:{
        username: {
            order: 1, 
            placeholder: "Choose a number", 
            label: "Username", 
            inputProps: {required: true}
        }, 
        email: {
            order: 2, 
            placeholder: "Enter your email", 
            label: "Email", 
            inputProps: {type: "email", required: true}
        },
        password: {
            order: 3, 
            placeholder: "Password", 
            label: "Password", 
            inputProps: {type: "password", required: true}
        },
        confirm_password: {
            order: 4, 
            placeholder: "Confirm Password", 
            label: "Confirm Password", 
            inputProps: {type: "password", required: true}
        },
    }
}

const AuthProvider = ({children}: any) => {
  return (
    <div className="mt-5">
        <Authenticator formFields={formFields}>
            {({user}: any) => user ? (
                <div>
                    {children}
                </div>
            ) : (
                <div>
                    <h1>Please sing in</h1>
                </div>
            ) 
        }
        </Authenticator>
    </div>
  )
}

export default AuthProvider