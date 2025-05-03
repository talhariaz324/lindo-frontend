
export interface FormBase {
  id: string;
  employeeSubmitting: string;
  forDate: string;
  dateSubmitted: string;
  status: 'draft' | 'submitted' | 'in-review' | 'approved' | 'rejected';
  assignedTo?: string;
  comments?: string[];
}

export interface SlowMovingItemForm extends FormBase {
  formType: 'slow-moving-item';
  itemName: string;
  itemDescription: string;
  size: string;
  quantity: number;
  batchInvoice: string;
  dateReceived: string;
  unitsSoldToDate: number;
}

export interface EssentialsAlertForm extends FormBase {
  formType: 'essentials-alert';
  itemName: string;
  itemDescription: string;
  actionNeeded: string;
  alertCategory: 'critical-quality' | 'non-critical-quality' | 'price' | 'damaged' | 'customer-service';
}

export interface EquipmentFacilityAlertForm extends FormBase {
  formType: 'equipment-facility';
  issueClass: string;
  issueDescription: string;
  actionNeeded: string;
}

export interface ReminderFollowUpForm extends FormBase {
  formType: 'reminder-followup';
  reminderDescription: string;
  followUpAction: string;
}

export interface HandoverNoteForm extends FormBase {
  formType: 'handover-note';
  taskDescription: string;
  handoverNotes: string;
  actionNeeded: string;
}

export interface CustomerFeedbackForm extends FormBase {
  formType: 'customer-feedback';
  customerFeedback: string;
  feedbackCategory: string;
}

export interface HealthSafetyForm extends FormBase {
  formType: 'health-safety';
  issueClass: string;
  issueDescription: string;
  actionNeeded: string;
}

export type FormType = 
  | 'slow-moving-item'
  | 'essentials-alert'
  | 'equipment-facility'
  | 'reminder-followup'
  | 'handover-note'
  | 'customer-feedback'
  | 'health-safety';

export type FormData = 
  | SlowMovingItemForm
  | EssentialsAlertForm
  | EquipmentFacilityAlertForm
  | ReminderFollowUpForm
  | HandoverNoteForm
  | CustomerFeedbackForm
  | HealthSafetyForm;

export const formTypeLabels: Record<FormType, string> = {
  'slow-moving-item': 'Slow Moving Item Alert',
  'essentials-alert': 'Essentials Alert',
  'equipment-facility': 'Equipment/Facility Alert',
  'reminder-followup': 'Reminder/Follow Up',
  'handover-note': 'Handover Note',
  'customer-feedback': 'Customer Feedback',
  'health-safety': 'Health & Safety'
};
