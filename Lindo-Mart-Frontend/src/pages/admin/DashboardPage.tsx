import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function DashboardPage() {
  // Fetch received forms
  const {
    data: receivedForms,
    isLoading: receivedLoading,
    refetch: refetchReceived,
  } = useQuery({
    queryKey: ["dashboard-user-forms"],
    queryFn: async () => {
      const response = await api.get("/dashboard/user-forms");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  // Fetch moved forms
  const {
    data: movedForms,
    isLoading: movedLoading,
    refetch: refetchMoved,
  } = useQuery({
    queryKey: ["dashboard-moved-forms"],
    queryFn: async () => {
      const response = await api.get("/dashboard/moved-forms");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  // Refetch data on mount
  useEffect(() => {
    refetchReceived();
    refetchMoved();
  }, []);

  if (receivedLoading || movedLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  console.log(receivedForms);

  const pendingForms =
    receivedForms?.filter((form: any) => form.status === "Pending")?.length ||
    0;
  const inProgressForms =
    receivedForms?.filter((form: any) => form.status === "in-progress")
      ?.length || 0;
  const completedForms =
    receivedForms?.filter((form: any) => form.status === "completed")?.length ||
    0;
  const totalMovedForms = movedForms?.length || 0;

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Forms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingForms}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressForms}</div>
            <p className="text-xs text-muted-foreground">Being processed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedForms}</div>
            <p className="text-xs text-muted-foreground">Forms completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moved Forms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMovedForms}</div>
            <p className="text-xs text-muted-foreground">Forms moved</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Received Forms</CardTitle>
            <CardDescription>Latest forms assigned to you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {receivedForms?.slice(0, 5).map((form: any) => (
                <div
                  key={form._id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">{form.formType}</p>
                    <p className="text-xs text-muted-foreground">
                      {form.formData["Employee Submitting"]} -{" "}
                      {new Date(form.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    className="h-8 px-3 text-sm bg-transparent hover:bg-gray-50 text-gray-900 border border-gray-300"
                    asChild
                  >
                    <Link to={`/admin/received-forms/${form._id}`}>View</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Moved Forms</CardTitle>
            <CardDescription>Latest forms you've moved</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {movedForms?.slice(0, 5).map((form: any) => (
                <div
                  key={form.formId}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {form.formData.formType}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {form.formData.formData["Employee Submitting"]} -{" "}
                      {new Date(form.formData.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    className="h-8 px-3 text-sm bg-transparent hover:bg-gray-50 text-gray-900 border border-gray-300"
                    asChild
                  >
                    <Link to={`/admin/received-forms/${form.formId}`}>View</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
