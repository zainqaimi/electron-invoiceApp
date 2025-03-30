import { useState } from "react";

export function useCompany() {
  const [loading, setLoading] = useState(false);

  const createCompany = async (companyData: any) => {
    setLoading(true);
    try {
      return await window.electronAPI.createCompany(companyData);
    } finally {
      setLoading(false);
    }
  };

  const getCompanies = async () => {
    setLoading(true);
    try {
      return await window.electronAPI.getCompanies();
    } finally {
      setLoading(false);
    }
  };

  const updateCompany = async (companyData: any) => {
    setLoading(true);
    try {
      return await window.electronAPI.updateCompany(companyData);
    } finally {
      setLoading(false);
    }
  };

  const deleteCompany = async (id: number) => {
    setLoading(true);
    try {
      return await window.electronAPI.deleteCompany(id);
    } finally {
      setLoading(false);
    }
  };

  return { createCompany, getCompanies, updateCompany, deleteCompany, loading };
}
