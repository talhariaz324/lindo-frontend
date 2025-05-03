import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNotifications } from "@/context/NotificationContext";
import { useForms } from "@/context/FormsContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import FormDetailsView from "@/components/FormDetailsView";

const FormDetailPageAdmin = () => {
  const { formId } = useParams<{ formId: string }>(); // Changed from id to formId to match route param
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const { getFormById, formDetails } = useForms();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadForm = async () => {
      if (!formId) return;

      try {
        setLoading(true);
        await getFormById(formId);
      } catch (error) {
        console.error("Error loading form:", error);
        toast.error("Failed to load form details");
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [formId, getFormById]);

  const form = formId ? formDetails[formId] : undefined;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <h1 className="text-2xl font-bold text-gray-900">
            Loading form details...
          </h1>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900">Form not found</h1>
          <p className="mt-2 text-gray-500">
            The form you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/admin/received-forms")}>
            Back to Received Forms
          </Button>
        </div>
      </div>
    );
  }

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
    <FormDetailsView
      form={form}
      canUpdateStatus={true}
      showBackButton={true}
      backUrl="/admin/received-forms"
    />
  );
};

export default FormDetailPageAdmin;
