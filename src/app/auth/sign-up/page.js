const SignUpPage = () => {
    const router = useRouter();
  
    const handleSignUp = async (credentials) => {
      try {
        await signUp(credentials);
        router.push('/login');
      } catch (error) {
        console.error('Sign up failed:', error);
        // Handle error (e.g., show error message)
      }
    };
  
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-8">Sign Up</h1>
        <AuthForm onSubmit={handleSignUp} isLogin={false} />
      </div>
    );
  };
  
  export default SignUpPage;