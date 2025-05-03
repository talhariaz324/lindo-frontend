import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useForms } from "@/context/FormsContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormType, formTypeLabels } from "@/utils/formValidation";

const FormsListPage = () => {
  const { forms, loading, error } = useForms();
  const [selectedFormType, setSelectedFormType] = useState<FormType | "all">(
    "all"
  );

  // Filter forms based on selected form type
  const filteredForms = useMemo(() => {
    if (selectedFormType === "all") {
      return forms;
    }
    return forms.filter((form) => form.formType === selectedFormType);
  }, [forms, selectedFormType]);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">Error: {error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Forms</h1>

          <div className="flex items-center gap-4">
            <div className="w-[200px]">
              <Select
                value={selectedFormType}
                onValueChange={(value) =>
                  setSelectedFormType(value as FormType | "all")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Forms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Forms</SelectItem>
                  {Object.entries(formTypeLabels).map(
                    ([value, label]) =>
                      value !== "none" && (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      )
                  )}
                </SelectContent>
              </Select>
            </div>

            <Button asChild>
              <Link to="/forms/new">Create New Form</Link>
            </Button>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <p className="text-sm text-gray-500">
            Showing {filteredForms.length} form
            {filteredForms.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="mt-4 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Form Type
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Submitted By
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">View</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredForms.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          No forms found for the selected type.
                        </td>
                      </tr>
                    ) : (
                      filteredForms.map((form) => (
                        <tr key={form._id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {formTypeLabels[form.formType as FormType] ||
                              form.formType}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {form.formData["Employee Submitting"]}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(form.createdAt).toLocaleDateString()}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <Badge
                              className={`
                              ${
                                form.status.toLowerCase() === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : ""
                              }
                              ${
                                form.status.toLowerCase() === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : ""
                              }
                              ${
                                form.status.toLowerCase() === "pending"
                                  ? "bg-blue-100 text-blue-800"
                                  : ""
                              }
                              ${
                                form.status.toLowerCase() === "in-progress"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : ""
                              }
                              ${
                                form.status.toLowerCase() === "draft"
                                  ? "bg-gray-100 text-gray-800"
                                  : ""
                              }
                            `}
                            >
                              {form.status}
                            </Badge>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <Link
                              to={`/forms/${form._id}`}
                              className="text-brand-blue hover:text-brand-teal"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FormsListPage;
