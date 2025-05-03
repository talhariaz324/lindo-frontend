import * as Yup from "yup";

export type FormType =
  | "slow-moving-item"
  | "essentials-alert"
  | "equipment-facility"
  | "reminder-followup"
  | "handover-note"
  | "customer-feedback"
  | "health-safety"
  | "none";

export const formTypeLabels: Record<FormType, string> = {
  "slow-moving-item": "Slow Moving Item",
  "essentials-alert": "Essentials Alert",
  "equipment-facility": "Equipment/Facility Issue",
  "reminder-followup": "Reminder/Follow-up",
  "handover-note": "Handover Note",
  "customer-feedback": "Customer Feedback",
  "health-safety": "Health & Safety",
  none: "Select form type",
};

export interface FormData {
  formType: FormType;
  employeeSubmitting: string;
  forDate: string;
  // Common fields for all form types
  actionNeeded?: string;
  issueDescription?: string;
  // Slow Moving Item fields
  itemName?: string;
  itemQuantity?: number;
  itemLocation?: string;
  // Essentials Alert fields
  itemCategory?: string;
  stockLevel?: string;
  restockNeeded?: string;
  // Equipment/Facility fields
  issueClass?: string;
  // Reminder/Follow-up fields
  reminderDescription?: string;
  followUpAction?: string;
  // Handover Note fields
  taskDescription?: string;
  handoverNotes?: string;
  // Customer Feedback fields
  feedbackCategory?: string;
  customerFeedback?: string;
}

// Base validation schema for common fields
const baseSchema = {
  employeeSubmitting: Yup.string().required("Employee name is required"),
  forDate: Yup.string().required("Date is required"),
};

// Form-specific validation schemas
const formSchemas = {
  "slow-moving-item": Yup.object().shape({
    ...baseSchema,
    itemName: Yup.string().required("Item name is required"),
    itemQuantity: Yup.number()
      .required("Quantity is required")
      .min(0, "Quantity must be 0 or greater"),
    itemLocation: Yup.string().required("Item location is required"),
    actionNeeded: Yup.string().required("Action needed is required"),
  }),

  "essentials-alert": Yup.object().shape({
    ...baseSchema,
    itemCategory: Yup.string().required("Item category is required"),
    stockLevel: Yup.string().required("Stock level is required"),
    restockNeeded: Yup.string().required(
      "Restock needed information is required"
    ),
    actionNeeded: Yup.string().required("Action needed is required"),
  }),

  "equipment-facility": Yup.object().shape({
    ...baseSchema,
    issueClass: Yup.string().required("Issue class is required"),
    issueDescription: Yup.string().required("Issue description is required"),
    actionNeeded: Yup.string().required("Action needed is required"),
  }),

  "reminder-followup": Yup.object().shape({
    ...baseSchema,
    reminderDescription: Yup.string().required(
      "Reminder description is required"
    ),
    followUpAction: Yup.string().required("Follow-up action is required"),
  }),

  "handover-note": Yup.object().shape({
    ...baseSchema,
    taskDescription: Yup.string().required("Task description is required"),
    handoverNotes: Yup.string().required("Handover notes are required"),
    actionNeeded: Yup.string().required("Action needed is required"),
  }),

  "customer-feedback": Yup.object().shape({
    ...baseSchema,
    feedbackCategory: Yup.string().required("Feedback category is required"),
    customerFeedback: Yup.string().required("Customer feedback is required"),
  }),

  "health-safety": Yup.object().shape({
    ...baseSchema,
    issueClass: Yup.string().required("Issue class is required"),
    issueDescription: Yup.string().required("Issue description is required"),
    actionNeeded: Yup.string().required("Action needed is required"),
  }),

  none: Yup.object().shape({
    ...baseSchema,
  }),
};

export const getValidationSchema = (formType: FormType) => {
  return formSchemas[formType] || formSchemas.none;
};
