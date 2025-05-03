import React, { createContext, useContext, useEffect, useState } from "react";
import { formService } from "@/services/formService";

// Types
interface FormHistory {
  status: string;
  timestamp: string;
  userId: string;
  fromUserId: string | null;
  toUserId: string | null;
  _id: string;
}

export interface Form {
  _id: string;
  userId: string;
  formType: string;
  formData: Record<string, string>;
  status: string;
  recipient: string;
  createdAt: string;
  history: FormHistory[];
  alertId?: string;
}

interface FormStats {
  totalForms: number;
  pendingForms: number;
  approvedForms: number;
  formTypeCount: Record<string, number>;
}

interface FormsContextType {
  forms: Form[];
  recentForms: Form[];
  stats: FormStats;
  loading: boolean;
  error: string | null;
  addForm: (form: Form) => void;
  getFormById: (id: string) => Promise<Form | undefined>;
  formDetails: Record<string, Form>;
}

// Create context
const FormsContext = createContext<FormsContextType | undefined>(undefined);

// Provider component
export function FormsProvider({ children }: { children: React.ReactNode }) {
  const [forms, setForms] = useState<Form[]>([]);
  const [formDetails, setFormDetails] = useState<Record<string, Form>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add new form
  const addForm = (form: Form) => {
    setForms((prevForms) => [form, ...prevForms]);
  };

  // Get form by ID with caching
  const getFormById = async (id: string): Promise<Form | undefined> => {
    try {
      // Check if we already have the form details cached
      if (formDetails[id]) {
        // Return cached data immediately
        return Promise.resolve(formDetails[id]);
      }

      // If not cached, fetch from API
      const form = await formService.getFormById(id);

      // Cache the form details
      setFormDetails((prev) => ({
        ...prev,
        [id]: form,
      }));

      return form;
    } catch (error) {
      console.error("Error fetching form details:", error);
      return undefined;
    }
  };

  // Calculate stats from forms
  const calculateStats = (forms: Form[]): FormStats => {
    return {
      totalForms: forms.length,
      pendingForms: forms.filter(
        (form) => form.status.toLowerCase() === "pending"
      ).length,
      approvedForms: forms.filter(
        (form) => form.status.toLowerCase() === "approved"
      ).length,
      formTypeCount: forms.reduce((acc, form) => {
        acc[form.formType] = (acc[form.formType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  };

  // Get recent forms (last 3)
  const getRecentForms = (forms: Form[]): Form[] => {
    return [...forms]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 3);
  };

  // Fetch forms on mount
  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true);
        const data = await formService.getUserForms();
        setForms(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch forms");
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const value = {
    forms,
    formDetails,
    recentForms: getRecentForms(forms),
    stats: calculateStats(forms),
    loading,
    error,
    addForm,
    getFormById,
  };

  return (
    <FormsContext.Provider value={value}>{children}</FormsContext.Provider>
  );
}

// Custom hook to use forms context
export function useForms() {
  const context = useContext(FormsContext);
  if (context === undefined) {
    throw new Error("useForms must be used within a FormsProvider");
  }
  return context;
}
