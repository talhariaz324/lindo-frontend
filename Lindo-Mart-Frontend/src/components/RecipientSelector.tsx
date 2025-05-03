import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUsers } from "@/context/UsersContext";

interface RecipientSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const RecipientSelector: React.FC<RecipientSelectorProps> = ({
  value,
  onChange,
}) => {
  const { users, loading } = useUsers();
  const [selectionType, setSelectionType] = useState<"user" | "role">("user");

  const roles = [ "Supervisor", "Management", "Super-Admin"];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Select Recipient Type</Label>
        <RadioGroup
          value={selectionType}
          onValueChange={(value) => setSelectionType(value as "user" | "role")}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="user" id="user" />
            <Label htmlFor="user">Select User</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="role" id="role" />
            <Label htmlFor="role">Select Role</Label>
          </div>
        </RadioGroup>
      </div>

      {selectionType === "user" ? (
        <div className="space-y-2">
          <Label>Select User</Label>
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a user" />
            </SelectTrigger>
            <SelectContent>
              {loading ? (
                <SelectItem value="loading" disabled>
                  Loading users...
                </SelectItem>
              ) : (
                users.map((user) => (
                  <SelectItem key={user._id} value={user._id}>
                    {user.username} ({user.role})
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="space-y-2">
          <Label>Select Role</Label>
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default RecipientSelector;
