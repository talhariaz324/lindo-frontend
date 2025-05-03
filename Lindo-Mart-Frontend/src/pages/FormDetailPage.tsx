import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNotifications } from "@/context/NotificationContext";
import { useForms } from "@/context/FormsContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import FormDetailsView from "@/components/FormDetailsView";

const FormDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const { getFormById, formDetails } = useForms();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadForm = async () => {
      if (!id) return;

      // If we already have the form in cache, don't fetch again
      if (formDetails[id]) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        await getFormById(id);
      } catch (error) {
        console.error("Error loading form:", error);
        toast.error("Failed to load form details");
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [id, getFormById, formDetails]);

  const form = id ? formDetails[id] : undefined;

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <h1 className="text-2xl font-bold text-gray-900">
              Loading form details...
            </h1>
          </div>
        </div>
      </Layout>
    );
  }

  if (!form) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-2xl font-bold text-gray-900">Form not found</h1>
            <p className="mt-2 text-gray-500">
              The form you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/forms")}>Back to Forms</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const isAdmin = user?.role === "admin";
  const canUpdateStatus = isAdmin || user?.username === form.recipient;

  const handleStatusUpdate = async (newStatus: string, comment: string) => {
    try {
      // TODO: Implement updateFormStatus in formService
      // await updateFormStatus(form._id, newStatus);
      toast.success(`Form status updated to ${newStatus}`);
      addNotification(
        `Form ${form._id} status changed to ${newStatus}`,
        "info"
      );

      // Refresh the form data
      await getFormById(form._id);
    } catch (error) {
      toast.error("Failed to update form status");
      console.error(error);
    }
  };

  return (
    <Layout>
      <FormDetailsView
        form={form}
        canUpdateStatus={canUpdateStatus}
        onStatusUpdate={handleStatusUpdate}
        showBackButton={true}
      />
    </Layout>
  );
};

export default FormDetailPage;
