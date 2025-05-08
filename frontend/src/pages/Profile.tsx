import React, { useEffect, useState } from "react";
import axios from "axios";
import UserForm from "@/components/user/userform";
import PaymentMethodManager from "@/components/user/paymentmethodmanager";
import AddressForm from "@/components/user/addressform";
import { useAuth } from "@/context/auth/useAuth";

interface User {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  role?: string;
  password: string;
  address_id: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { accessToken } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get<User>(
          "http://localhost:5001/api/auth/active_user",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        setUser(res.data);
      } catch (err) {
        setError("Failed to load user information.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [accessToken]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>No user data found.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-10">
      {/* Welcome Header */}
      <div className="rounded-xl border p-6 shadow-sm bg-white dark:bg-muted">
        <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
          👤 Profile
        </h2>
        <p className="text-muted-foreground">
          Welcome back,{" "}
          <span className="font-medium text-foreground">{user.first_name}</span>
          !
        </p>
      </div>

      {/* User Info Form */}
      <div className="rounded-xl border p-6 shadow-sm bg-white dark:bg-muted">
        <h3 className="text-xl font-semibold mb-4">📝 Update General Info</h3>
        <UserForm user={user} onUserUpdate={setUser as (u: User) => void} />
      </div>

      {/* Payment Methods */}
      <div className="rounded-xl border p-6 shadow-sm bg-white dark:bg-muted">
        <h3 className="text-xl font-semibold mb-4">💳 Manage Payments</h3>
        <PaymentMethodManager />
      </div>

      {/* Address Management */}
      <div className="rounded-xl border p-6 shadow-sm bg-white dark:bg-muted">
        <h3 className="text-xl font-semibold mb-4">🏠 Manage Addresses</h3>
        <AddressForm />
      </div>
    </div>
  );
};

export default Profile;
