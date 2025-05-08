import React, { useEffect, useState } from "react";
import axios from "axios";
import UserForm from "@/components/user/userform";
import AddressForm from "@/components/user/addressform";
import { useAuth } from "@/context/auth/useAuth";
import { api_get_active_user } from "@/services/api";
import { FetchedUser } from "@/services/types";

const Profile: React.FC = () => {
  const [user, setUser] = useState<FetchedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { accessToken } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await api_get_active_user(accessToken);
        setUser(user);
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
        <UserForm
          user={user}
          onUserUpdate={setUser as (u: FetchedUser) => void}
          accessToken={accessToken}
        />
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
