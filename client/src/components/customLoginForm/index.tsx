import React from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface CustomLoginFormProps {
  onSignUp: () => void;
}

const CustomLoginForm: React.FC<CustomLoginFormProps> = ({ onSignUp }) => {
  const { signIn } = useAuthenticator();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    try {
      await signIn({ username: email, password });
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Hi there!</h2>
            <p className="mt-2 text-sm text-gray-600">
              Welcome to Haze. Community Dashboard
            </p>
          </div>

          <div className="mt-8">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit}>
                  {/* ... (rest of the form remains the same) ... */}
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Button
                    variant="link"
                    className="font-medium text-blue-600 hover:text-blue-500"
                    onClick={onSignUp}
                  >
                    Sign up
                  </Button>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="/space-image.jpg"
          alt="Space"
        />
      </div>
    </div>
  );
};

export default CustomLoginForm;