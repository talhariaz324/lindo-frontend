import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useUsers } from "@/context/UsersContext";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ReceivedFormsPage = () => {
  const queryClient = useQueryClient();
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const { users, loading: usersLoading } = useUsers();
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);

  // Fetch received forms
  const { data: forms, isLoading } = useQuery({
    queryKey: ["received-forms"],
    queryFn: async () => {
      const response = await api.get("/dashboard/user-forms");
      return response.data;
    },
  });

  // Update form status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      formId,
      status,
    }: {
      formId: string;
      status: string;
    }) => {
      const response = await api.patch(`/forms/${formId}/status`, { status });
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
    mutationFn: async ({
      formId,
      newRecipient,
    }: {
      formId: string;
      newRecipient: string;
    }) => {
      const response = await api.post("/dashboard/move-form", {
        formId,
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

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Received Forms</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Forms</CardTitle>
          <CardDescription>Manage forms assigned to you</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Form Type</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forms?.map((form: any) => (
                <TableRow key={form._id}>
                  <TableCell>{form.formType}</TableCell>
                  <TableCell>{form.formData["Employee Submitting"]}</TableCell>
                  <TableCell>
                    {new Date(form.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={form.status}
                      onValueChange={(value) =>
                        updateStatusMutation.mutate({
                          formId: form._id,
                          status: value,
                        })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue>
                          <Badge
                            className={`
                              ${
                                form.status === "in-progress"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : ""
                              }
                              ${
                                form.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : ""
                              }
                              ${
                                form.status === "pending"
                                  ? "bg-blue-100 text-blue-800"
                                  : ""
                              }
                            `}
                          >
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
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        className="bg-transparent hover:bg-gray-50 text-gray-900 border border-gray-300"
                        asChild
                      >
                        <Link to={`/admin/received-forms/${form._id}`}>
                          View
                        </Link>
                      </Button>
                      <Dialog
                        open={moveDialogOpen && selectedForm?._id === form._id}
                        onOpenChange={(open) => {
                          setMoveDialogOpen(open);
                          if (!open) setSelectedForm(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            className="bg-transparent hover:bg-gray-50 text-gray-900 border border-gray-300"
                            onClick={() => setSelectedForm(form)}
                          >
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
                            onValueChange={(value) =>
                              moveFormMutation.mutate({
                                formId: selectedForm?._id,
                                newRecipient: value,
                              })
                            }
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
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReceivedFormsPage;
