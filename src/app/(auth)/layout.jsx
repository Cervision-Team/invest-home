// import ProtectedLayout from "@/components/router/ProtectedLayout";
import { GoogleOAuthProvider } from "@react-oauth/google";

const layout = ({ children }) => {
  return (
    // <ProtectedLayout>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        {children}
      </GoogleOAuthProvider>
    // </ProtectedLayout>
  );
};

export default layout;
