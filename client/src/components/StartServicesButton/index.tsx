import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const StartServicesButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const handleStartServices = async () => {
    setIsLoading(true);
    setMessage('');
    setIsSuccess(false);
    setIsError(false);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_AWS_API_GATEWAY_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setMessage('Services are starting up!');
        setIsSuccess(true);
      } else {
        setMessage('Failed to start services. Please try again.');
        setIsError(true);
      }
    } catch (error:any) {
        console.log("error.message", error.message)
      setMessage('An error occurred. Please try again.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Button onClick={handleStartServices} disabled={isLoading}>
        {isLoading ? 'Starting Services...' : 'Start Services'}
      </Button>
      {isSuccess && (
        <Alert className="mt-4">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{message || 'Services started successfully'}</AlertDescription>
        </Alert>
      )}
      {isError && (
        <Alert className="mt-4" variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{message || 'Failed to start services'}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default StartServicesButton;
