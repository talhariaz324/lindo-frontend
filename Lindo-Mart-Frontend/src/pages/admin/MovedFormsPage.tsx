import React from "react";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const MovedFormsPage = () => {
  const queryClient = useQueryClient();

  // Fetch moved forms
  const { data: forms, isLoading } = useQuery({
    queryKey: ["moved-forms"],
    queryFn: async () => {
      const response = await api.get("/dashboard/moved-forms");
      return response.data;
    },
  });

  // Trigger follow-up mutation
  const triggerFollowUpMutation = useMutation({
    mutationFn: async ({
      formId,
      recipientId,
    }: {
      formId: string;
      recipientId: string;
    }) => {
      const response = await api.post("/dashboard/trigger-followup", {
        formId,
        recipientId,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Follow-up alert sent successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to send follow-up alert"
      );
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
        <h1 className="text-2xl font-bold">Moved Forms</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Moved Forms</CardTitle>
          <CardDescription>
            Track and follow up on forms you've moved
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Form Type</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Current Status</TableHead>
                <TableHead>Current Recipient</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forms?.map((form: any) => (
                <TableRow key={form.formId}>
                  <TableCell>{form.formData.formType}</TableCell>
                  <TableCell>
                    {form.formData.formData["Employee Submitting"]}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`
                        ${
                          form.formData.status === "in-progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : ""
                        }
                        ${
                          form.formData.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : ""
                        }
                        ${
                          form.formData.status === "pending"
                            ? "bg-blue-100 text-blue-800"
                            : ""
                        }
                      `}
                    >
                      {form.formData.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{form.formData.recipient}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        className="bg-transparent hover:bg-gray-50 text-gray-900 border border-gray-300"
                        asChild
                      >
                        <Link to={`/admin/received-forms/${form.formId}`}>
                          View
                        </Link>
                      </Button>
                      <Button
                        className="bg-transparent hover:bg-gray-50 text-gray-900 border border-gray-300"
                        onClick={() =>
                          triggerFollowUpMutation.mutate({
                            formId: form.formId,
                            recipientId: form.formData.recipient,
                          })
                        }
                      >
                        Follow Up
                      </Button>
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

export default MovedFormsPage;
