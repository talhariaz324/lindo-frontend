import * as Yup from "yup";

// Common fields validation schema
const commonFieldsSchema = {
  employeeSubmitting: Yup.string()
    .required("Employee name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),
  forDate: Yup.date()
    .required("Date is required")
    .max(new Date(), "Date cannot be in the future"),
};

// Slow Moving Item Form Schema
export const slowMovingItemSchema = Yup.object().shape({
  ...commonFieldsSchema,
  itemName: Yup.string()
    .required("Item name is required")
    .min(2, "Item name must be at least 2 characters")
    .max(100, "Item name must not exceed 100 characters"),
  itemDescription: Yup.string()
    .required("Item description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
  size: Yup.string().required("Size is required"),
  quantity: Yup.number()
    .required("Quantity is required")
    .min(0, "Quantity cannot be negative")
    .integer("Quantity must be a whole number"),
  batchInvoice: Yup.string().required("Batch/Invoice number is required"),
  dateReceived: Yup.date()
    .required("Date received is required")
    .max(new Date(), "Date received cannot be in the future"),
  unitsSoldToDate: Yup.number()
    .required("Units sold is required")
    .min(0, "Units sold cannot be negative")
    .integer("Units sold must be a whole number"),
});

// Essentials Alert Form Schema
export const essentialsAlertSchema = Yup.object().shape({
  ...commonFieldsSchema,
  itemName: Yup.string()
    .required("Item name is required")
    .min(2, "Item name must be at least 2 characters")
    .max(100, "Item name must not exceed 100 characters"),
  itemDescription: Yup.string()
    .required("Item description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
  actionNeeded: Yup.string()
    .required("Action needed is required")
    .min(10, "Action needed must be at least 10 characters")
    .max(500, "Action needed must not exceed 500 characters"),
  alertCategory: Yup.string()
    .required("Alert category is required")
    .oneOf(
      [
        "critical-quality",
        "non-critical-quality",
        "price",
        "damaged",
        "customer-service",
      ],
      "Invalid alert category"
    ),
});

// Equipment/Facility Form Schema
export const equipmentFacilitySchema = Yup.object().shape({
  ...commonFieldsSchema,
  issueClass: Yup.string()
    .required("Issue class is required")
    .min(2, "Issue class must be at least 2 characters")
    .max(100, "Issue class must not exceed 100 characters"),
  issueDescription: Yup.string()
    .required("Issue description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
  actionNeeded: Yup.string()
    .required("Action needed is required")
    .min(10, "Action needed must be at least 10 characters")
    .max(500, "Action needed must not exceed 500 characters"),
});

// Reminder/Follow Up Form Schema
export const reminderFollowUpSchema = Yup.object().shape({
  ...commonFieldsSchema,
  reminderDescription: Yup.string()
    .required("Reminder description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
  followUpAction: Yup.string()
    .required("Follow-up action is required")
    .min(10, "Follow-up action must be at least 10 characters")
    .max(500, "Follow-up action must not exceed 500 characters"),
});

// Handover Note Form Schema
export const handoverNoteSchema = Yup.object().shape({
  ...commonFieldsSchema,
  taskDescription: Yup.string()
    .required("Task description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
  handoverNotes: Yup.string()
    .required("Handover notes are required")
    .min(10, "Notes must be at least 10 characters")
    .max(500, "Notes must not exceed 500 characters"),
  actionNeeded: Yup.string()
    .required("Action needed is required")
    .min(10, "Action needed must be at least 10 characters")
    .max(500, "Action needed must not exceed 500 characters"),
});

// Customer Feedback Form Schema
export const customerFeedbackSchema = Yup.object().shape({
  ...commonFieldsSchema,
  customerFeedback: Yup.string()
    .required("Customer feedback is required")
    .min(10, "Feedback must be at least 10 characters")
    .max(1000, "Feedback must not exceed 1000 characters"),
  feedbackCategory: Yup.string()
    .required("Feedback category is required")
    .min(2, "Category must be at least 2 characters")
    .max(50, "Category must not exceed 50 characters"),
});

// Health & Safety Form Schema
export const healthSafetySchema = Yup.object().shape({
  ...commonFieldsSchema,
  issueClass: Yup.string()
    .required("Issue class is required")
    .min(2, "Issue class must be at least 2 characters")
    .max(100, "Issue class must not exceed 100 characters"),
  issueDescription: Yup.string()
    .required("Issue description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
  actionNeeded: Yup.string()
    .required("Action needed is required")
    .min(10, "Action needed must be at least 10 characters")
    .max(500, "Action needed must not exceed 500 characters"),
});

// Map form types to their respective schemas
export const formSchemas: Record<string, Yup.ObjectSchema<any>> = {
  "slow-moving-item": slowMovingItemSchema,
  "essentials-alert": essentialsAlertSchema,
  "equipment-facility": equipmentFacilitySchema,
  "reminder-followup": reminderFollowUpSchema,
  "handover-note": handoverNoteSchema,
  "customer-feedback": customerFeedbackSchema,
  "health-safety": healthSafetySchema,
};
