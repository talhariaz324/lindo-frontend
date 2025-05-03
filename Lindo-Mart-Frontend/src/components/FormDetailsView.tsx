import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formTypeLabels } from "@/lib/form-schemas";
import { CalendarDays, User, FileText } from "lucide-react";
import { useUsers } from "@/context/UsersContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FormData {
  [key: string]: string;
}

interface Form {
  _id: string;
  formType: string;
  status: string;
  createdAt: string;
  formData: FormData;
}

interface FormDetailsViewProps {
  form: Form;
  canUpdateStatus: boolean;
  showBackButton?: boolean;
  backUrl?: string;
}

const FormDetailsView: React.FC<FormDetailsViewProps> = ({
  form,
  canUpdateStatus,
  showBackButton = true,
  backUrl = "/forms",
}) => {
  const queryClient = useQueryClient();
  const { users } = useUsers();
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);

  // Update form status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      const response = await api.patch(`/forms/${form._id}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["received-forms"] });
      toast.success("Form status updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update form status"
      );
    },
  });

  // Move form mutation
  const moveFormMutation = useMutation({
    mutationFn: async (newRecipient: string) => {
      const response = await api.post("/dashboard/move-form", {
        formId: form._id,
        newRecipient,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["received-forms"] });
      setMoveDialogOpen(false);
      toast.success("Form moved successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to move form");
    },
  });

  const renderFormFields = () => {
    const formData = form.formData;
    return Object.entries(formData).map(([key, value]) => (
      <div key={key} className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-600">{key}</h3>
        <p className="mt-2 text-gray-900">{value || "—"}</p>
      </div>
    ));
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "in-progress":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "pending":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {formTypeLabels[form.formType] || form.formType}
              </h1>
              <Badge
                className={`px-3 py-1 border ${getStatusColor(form.status)}`}
              >
                {form.status}
              </Badge>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>ID: {form._id}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>By: {form.formData["Employee Submitting"]}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarDays className="h-4 w-4" />
                <span>
                  Created: {new Date(form.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            {showBackButton && (
              <Button
                asChild
                className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
              >
                <Link to={backUrl}>Back to Forms</Link>
              </Button>
            )}
            {canUpdateStatus && (
              <Dialog open={moveDialogOpen} onOpenChange={setMoveDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700">
                    Move
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Move Form</DialogTitle>
                    <DialogDescription>
                      Select a new recipient for this form
                    </DialogDescription>
                  </DialogHeader>
                  <Select
                    onValueChange={(value) => moveFormMutation.mutate(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      {users?.map((user: any) => (
                        <SelectItem key={user._id} value={user._id}>
                          {user.username} ({user.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Form Details</CardTitle>
              <CardDescription>
                Complete information submitted in this form
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderFormFields()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Update Section */}
        {canUpdateStatus && (
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Update Status</CardTitle>
                <CardDescription>
                  Change the current status of this form
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      New Status
                    </label>
                    <Select
                      value={form.status}
                      onValueChange={(value) =>
                        updateStatusMutation.mutate(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue>
                          <Badge className={getStatusColor(form.status)}>
                            {form.status}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormDetailsView;
