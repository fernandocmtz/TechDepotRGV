import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api_patch_active_user } from "@/services/api";

interface User {
  user_id: number;
  username: string;
  email: string;
  phone_number?: string;
  role?: string;
}

interface Props {
  user: User;
  onUserUpdate: (updatedUser: User) => void;
  accessToken: string;
}

const UserForm: React.FC<Props> = ({ user, onUserUpdate, accessToken }) => {
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phone_number || "");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const patchUserData = {
        email,
        phone_number: phoneNumber,
      };
      const user = await api_patch_active_user(patchUserData, accessToken);

      onUserUpdate(user);
      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.error("Failed to update profile.");
    }
  };

  return (
    <form className="space-y-6 max-w-md" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>

      <Button type="submit">Update Profile</Button>
    </form>
  );
};

export default UserForm;
