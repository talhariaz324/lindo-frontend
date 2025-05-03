import api, { handleApiError } from "./api";
import { Form } from "@/context/FormsContext";

class FormService {
  private readonly baseUrl = "/forms";

  // Get user forms
  async getUserForms(): Promise<Form[]> {
    try {
      const { data } = await api.get(`${this.baseUrl}/user-forms`);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get form by ID
  async getFormById(formId: string): Promise<Form> {
    try {
      const response = await api.get(`/forms/user-form/${formId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // // Create a new form
  // async createForm(formData: {
  //   formType: string;
  //   formData: Record<string, string>;
  //   recipient: string;
  // }): Promise<Form> {
  //   try {
  //     const { data } = await api.post(this.baseUrl, formData);
  //     return data;
  //   } catch (error) {
  //     throw handleApiError(error);
  //   }
  // }

  // // Update form status
  // async updateFormStatus(
  //   formId: string,
  //   status: string,
  //   toUserId?: string
  // ): Promise<Form> {
  //   try {
  //     const { data } = await api.patch(`${this.baseUrl}/${formId}/status`, {
  //       status,
  //       toUserId,
  //     });
  //     return data;
  //   } catch (error) {
  //     throw handleApiError(error);
  //   }
  // }

  // // Delete form
  // async deleteForm(id: string): Promise<void> {
  //   try {
  //     await api.delete(`${this.baseUrl}/${id}`);
  //   } catch (error) {
  //     throw handleApiError(error);
  //   }
  // }

  private handleError(error: any): Error {
    console.error("API Error:", error);
    return error instanceof Error
      ? error
      : new Error("An error occurred while fetching the form");
  }
}

export const formService = new FormService();
export default formService;
