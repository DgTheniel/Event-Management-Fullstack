import React from "react";
import { FrappeProvider } from "frappe-react-sdk";

type Props = { children?: React.ReactNode };

export default function FrappeWrapper({ children }: Props) {
  const url = import.meta.env.VITE_FRAPPE_BASE_URL || "http://localhost:8000";
  const token = import.meta.env.VITE_FRAPPE_API_TOKEN; // format: key:secret

  // Use customHeaders for Authorization header
  const customHeaders = token ? { Authorization: `token ${token}` } : undefined;

  return (
    <FrappeProvider url={url} customHeaders={customHeaders} enableSocket={false}>
      {children}
    </FrappeProvider>
  );
}
