import { useNavigate } from "react-router-dom";
import { ErrorLayout } from "../../../../components/layout/ErrorLayout";

export function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <ErrorLayout
      code="403"
      title="Access Restricted"
      message="You don't have permission to access this area. Please contact your administrator if you believe this is an error."
      action={{
        label: "Return to Dashboard",
        onClick: () => navigate("/dashboard", { replace: true })
      }}
    />
  );
}
