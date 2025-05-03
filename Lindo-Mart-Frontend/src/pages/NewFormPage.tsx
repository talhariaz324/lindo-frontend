import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  FormType,
  formTypeLabels,
  getValidationSchema,
} from "@/utils/formValidation";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { api } from "@/services/api";
import { useForms } from "@/context/FormsContext";
import RecipientSelector from "@/components/RecipientSelector";

const NewFormPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const { addForm } = useForms();
  const [formType, setFormType] = useState<FormType>("none");

  const initialValues = {
    formType: "none" as FormType,
    employeeSubmitting: user?.username || "",
    forDate: new Date().toISOString().substring(0, 10),
    recipient: user?._id || "",
    actionNeeded: "",
    issueDescription: "",
    // Slow Moving Item fields
    itemName: "",
    itemQuantity: "",
    itemLocation: "",
    // Essentials Alert fields
    itemCategory: "",
    stockLevel: "",
    restockNeeded: "",
    // Equipment/Facility fields
    issueClass: "",
    // Reminder/Follow-up fields
    reminderDescription: "",
    followUpAction: "",
    // Handover Note fields
    taskDescription: "",
    handoverNotes: "",
    // Customer Feedback fields
    feedbackCategory: "",
    customerFeedback: "",
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      if (values.formType === "none") {
        toast.error("Please select a form type");
        return;
      }

      // Create a subset of data based on the form type
      let formDataToSubmit: any = {
        formType: values.formType,
        formData: {
          "Employee Submitting": values.employeeSubmitting,
          "For Date": values.forDate,
        },
        recipient: values.recipient,
      };

      // Add form-specific fields
      switch (values.formType) {
        case "slow-moving-item":
          formDataToSubmit.formData = {
            ...formDataToSubmit.formData,
            "Item Name": values.itemName,
            "Item Quantity": values.itemQuantity,
            "Item Location": values.itemLocation,
            "Action Needed": values.actionNeeded,
          };
          break;
        case "essentials-alert":
          formDataToSubmit.formData = {
            ...formDataToSubmit.formData,
            "Item Category": values.itemCategory,
            "Stock Level": values.stockLevel,
            "Restock Needed": values.restockNeeded,
            "Action Needed": values.actionNeeded,
          };
          break;
        case "equipment-facility":
          formDataToSubmit.formData = {
            ...formDataToSubmit.formData,
            "Issue Class": values.issueClass,
            "Issue Description": values.issueDescription,
            "Action Needed": values.actionNeeded,
          };
          break;
        case "reminder-followup":
          formDataToSubmit.formData = {
            ...formDataToSubmit.formData,
            "Reminder Description": values.reminderDescription,
            "Follow-Up Action": values.followUpAction,
          };
          break;
        case "handover-note":
          formDataToSubmit.formData = {
            ...formDataToSubmit.formData,
            "Task Description": values.taskDescription,
            "Handover Notes": values.handoverNotes,
            "Action Needed": values.actionNeeded,
          };
          break;
        case "customer-feedback":
          formDataToSubmit.formData = {
            ...formDataToSubmit.formData,
            "Feedback Category": values.feedbackCategory,
            "Customer Feedback": values.customerFeedback,
          };
          break;
        case "health-safety":
          formDataToSubmit.formData = {
            ...formDataToSubmit.formData,
            "Issue Class": values.issueClass,
            "Issue Description": values.issueDescription,
            "Action Needed": values.actionNeeded,
          };
          break;
      }

      const response = await api.post("/forms/submit", formDataToSubmit);
      addForm(response.data);
      toast.success("Form submitted successfully");
      addNotification(
        `New ${formTypeLabels[values.formType]} form submitted`,
        "success"
      );
      navigate(`/forms/${response.data._id}`);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to submit form";
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper function to render form-specific fields
  const renderFormFields = (formType: FormType, errors: any, touched: any) => {
    const getFieldError = (fieldName: string) => {
      return touched[fieldName] && errors[fieldName] ? (
        <div className="text-red-500 text-sm mt-1">{errors[fieldName]}</div>
      ) : null;
    };

    switch (formType) {
      case "slow-moving-item":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="itemName" className="text-sm font-medium">
                  Item Name
                </label>
                <Field
                  as={Input}
                  id="itemName"
                  name="itemName"
                  placeholder="Enter item name"
                />
                {getFieldError("itemName")}
              </div>
              <div className="space-y-2">
                <label htmlFor="itemQuantity" className="text-sm font-medium">
                  Quantity
                </label>
                <Field
                  as={Input}
                  id="itemQuantity"
                  name="itemQuantity"
                  type="number"
                />
                {getFieldError("itemQuantity")}
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="itemLocation" className="text-sm font-medium">
                Item Location
              </label>
              <Field
                as={Input}
                id="itemLocation"
                name="itemLocation"
                placeholder="Enter item location"
              />
              {getFieldError("itemLocation")}
            </div>
            <div className="space-y-2">
              <label htmlFor="actionNeeded" className="text-sm font-medium">
                Action Needed
              </label>
              <Field
                as={Textarea}
                id="actionNeeded"
                name="actionNeeded"
                rows={3}
              />
              {getFieldError("actionNeeded")}
            </div>
          </div>
        );

      case "essentials-alert":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="itemCategory" className="text-sm font-medium">
                  Item Category
                </label>
                <Field
                  as={Input}
                  id="itemCategory"
                  name="itemCategory"
                  placeholder="Enter item category"
                />
                {getFieldError("itemCategory")}
              </div>
              <div className="space-y-2">
                <label htmlFor="stockLevel" className="text-sm font-medium">
                  Stock Level
                </label>
                <Field as={Input} id="stockLevel" name="stockLevel" />
                {getFieldError("stockLevel")}
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="restockNeeded" className="text-sm font-medium">
                Restock Needed
              </label>
              <Field
                as={Textarea}
                id="restockNeeded"
                name="restockNeeded"
                rows={3}
              />
              {getFieldError("restockNeeded")}
            </div>
            <div className="space-y-2">
              <label htmlFor="actionNeeded" className="text-sm font-medium">
                Action Needed
              </label>
              <Field
                as={Textarea}
                id="actionNeeded"
                name="actionNeeded"
                rows={3}
              />
              {getFieldError("actionNeeded")}
            </div>
          </div>
        );

      case "equipment-facility":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="issueClass" className="text-sm font-medium">
                Issue Class
              </label>
              <Field
                as={Input}
                id="issueClass"
                name="issueClass"
                placeholder="e.g., Equipment Failure, Maintenance Required"
              />
              {getFieldError("issueClass")}
            </div>
            <div className="space-y-2">
              <label htmlFor="issueDescription" className="text-sm font-medium">
                Issue Description
              </label>
              <Field
                as={Textarea}
                id="issueDescription"
                name="issueDescription"
                rows={3}
              />
              {getFieldError("issueDescription")}
            </div>
            <div className="space-y-2">
              <label htmlFor="actionNeeded" className="text-sm font-medium">
                Action Needed
              </label>
              <Field
                as={Textarea}
                id="actionNeeded"
                name="actionNeeded"
                rows={3}
              />
              {getFieldError("actionNeeded")}
            </div>
          </div>
        );

      case "reminder-followup":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="reminderDescription"
                className="text-sm font-medium"
              >
                Reminder Description
              </label>
              <Field
                as={Textarea}
                id="reminderDescription"
                name="reminderDescription"
                rows={3}
              />
              {getFieldError("reminderDescription")}
            </div>
            <div className="space-y-2">
              <label htmlFor="followUpAction" className="text-sm font-medium">
                Follow-Up Action
              </label>
              <Field
                as={Textarea}
                id="followUpAction"
                name="followUpAction"
                rows={3}
              />
              {getFieldError("followUpAction")}
            </div>
          </div>
        );

      case "handover-note":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="taskDescription" className="text-sm font-medium">
                Task Description
              </label>
              <Field
                as={Textarea}
                id="taskDescription"
                name="taskDescription"
                rows={3}
              />
              {getFieldError("taskDescription")}
            </div>
            <div className="space-y-2">
              <label htmlFor="handoverNotes" className="text-sm font-medium">
                Handover Notes
              </label>
              <Field
                as={Textarea}
                id="handoverNotes"
                name="handoverNotes"
                rows={3}
              />
              {getFieldError("handoverNotes")}
            </div>
            <div className="space-y-2">
              <label htmlFor="actionNeeded" className="text-sm font-medium">
                Action Needed
              </label>
              <Field
                as={Textarea}
                id="actionNeeded"
                name="actionNeeded"
                rows={3}
              />
              {getFieldError("actionNeeded")}
            </div>
          </div>
        );

      case "customer-feedback":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="feedbackCategory" className="text-sm font-medium">
                Feedback Category
              </label>
              <Field
                as={Input}
                id="feedbackCategory"
                name="feedbackCategory"
                placeholder="e.g., Quality, Price, Customer Service"
              />
              {getFieldError("feedbackCategory")}
            </div>
            <div className="space-y-2">
              <label htmlFor="customerFeedback" className="text-sm font-medium">
                Customer Feedback
              </label>
              <Field
                as={Textarea}
                id="customerFeedback"
                name="customerFeedback"
                rows={3}
              />
              {getFieldError("customerFeedback")}
            </div>
          </div>
        );

      case "health-safety":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="issueClass" className="text-sm font-medium">
                Issue Class
              </label>
              <Field
                as={Input}
                id="issueClass"
                name="issueClass"
                placeholder="e.g., Hazardous Material, Unsafe Practice"
              />
              {getFieldError("issueClass")}
            </div>
            <div className="space-y-2">
              <label htmlFor="issueDescription" className="text-sm font-medium">
                Issue Description
              </label>
              <Field
                as={Textarea}
                id="issueDescription"
                name="issueDescription"
                rows={3}
              />
              {getFieldError("issueDescription")}
            </div>
            <div className="space-y-2">
              <label htmlFor="actionNeeded" className="text-sm font-medium">
                Action Needed
              </label>
              <Field
                as={Textarea}
                id="actionNeeded"
                name="actionNeeded"
                rows={3}
              />
              {getFieldError("actionNeeded")}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Form</h1>
            <p className="mt-1 text-sm text-gray-500">
              Create and submit a new form
            </p>
          </div>
        </div>

        <div className="mt-8 max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Create Form</CardTitle>
              <CardDescription>
                Fill out the form details and submit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Formik
                initialValues={initialValues}
                validationSchema={getValidationSchema(formType)}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ isSubmitting, setFieldValue, errors, touched, values }) => (
                  <Form className="space-y-6">
                    {/* Form Type Selection */}
                    <div className="space-y-2">
                      <label htmlFor="formType" className="text-sm font-medium">
                        Form Type
                      </label>
                      <Select
                        value={values.formType}
                        onValueChange={(value) => {
                          setFormType(value as FormType);
                          setFieldValue("formType", value);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select form type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none" disabled>
                            Select form type
                          </SelectItem>
                          {Object.entries(formTypeLabels).map(
                            ([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      {touched.formType && errors.formType && (
                        <div className="text-red-500 text-sm mt-1">
                          {String(errors.formType)}
                        </div>
                      )}
                    </div>

                    {/* Common Fields */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label
                          htmlFor="employeeSubmitting"
                          className="text-sm font-medium"
                        >
                          Employee Submitting
                        </label>
                        <Field
                          as={Input}
                          id="employeeSubmitting"
                          name="employeeSubmitting"
                        />
                        {touched.employeeSubmitting &&
                          errors.employeeSubmitting && (
                            <div className="text-red-500 text-sm mt-1">
                              {String(errors.employeeSubmitting)}
                            </div>
                          )}
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="forDate"
                          className="text-sm font-medium"
                        >
                          For Date
                        </label>
                        <Field
                          as={Input}
                          id="forDate"
                          name="forDate"
                          type="date"
                        />
                        {touched.forDate && errors.forDate && (
                          <div className="text-red-500 text-sm mt-1">
                            {String(errors.forDate)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recipient Selection */}
                    <div className="space-y-2">
                      <label
                        htmlFor="recipient"
                        className="text-sm font-medium"
                      >
                        Recipient
                      </label>
                      <Field name="recipient">
                        {({ field, form }: any) => (
                          <RecipientSelector
                            value={field.value}
                            onChange={(value) =>
                              form.setFieldValue("recipient", value)
                            }
                          />
                        )}
                      </Field>
                      {touched.recipient && errors.recipient && (
                        <div className="text-red-500 text-sm mt-1">
                          {String(errors.recipient)}
                        </div>
                      )}
                    </div>

                    {/* Form Specific Fields */}
                    {values.formType !== "none" &&
                      renderFormFields(values.formType, errors, touched)}

                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        onClick={() => navigate("/forms")}
                        className="bg-transparent hover:bg-gray-50 border border-gray-300 text-gray-900"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Form"}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default NewFormPage;
