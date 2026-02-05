/**
 * MyHostelRules.jsx - Student View for Hostel Rules
 * * Features:
 * - Automatically detects student's assigned hostel
 * - Fetches rules specific to that hostel
 * - Clean, readable list with Lucide icons
 * - Responsive design with dark mode support
 * - "No Hostel Assigned" empty state
 */

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  ShieldCheck,
  ClipboardList,
  Loader2,
  Building2,
  Home,
  AlertCircle,
  Info,
  ChevronRight,
} from "lucide-react";

// ============================================================================
// CONSTANTS & UTILS
// ============================================================================

const API_BASE_URL = process.env.REACT_APP_API_URL;
const getToken = () => localStorage.getItem("token");

const MyHostelRules = () => {
  const navigate = useNavigate();

  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================

  const [state, setState] = useState({
    currentHostel: null,
    rules: [],
    loading: true,
    error: null,
  });

  // ==========================================================================
  // DATA FETCHING
  // ==========================================================================

  /**
   * Main initialization function
   * 1. Check hostel assignment
   * 2. Fetch rules for that hostel
   */
  const fetchHostelDataAndRules = useCallback(async () => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      // Step 1: Get student's current hostel assignment
      const assignmentRes = await axios.get(
        `${API_BASE_URL}/api/students/my-requests`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const { currentHostel } = assignmentRes.data;

      if (currentHostel) {
        // Step 2: Fetch detailed hostel info and rules
        const [hostelDetailRes, rulesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/hostels/${currentHostel}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/api/rules/hostel/${currentHostel}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const hostelData = hostelDetailRes.data.data || hostelDetailRes.data;

        // Note: In the owner page, rules are filtered by hostelId.
        // We do the same here to ensure the student only sees rules for their current building.
        const allRules = rulesRes.data.rules || [];
        const filteredRules = allRules.filter(
          (rule) => rule.hostelId === currentHostel,
        );

        setState({
          currentHostel: hostelData,
          rules: filteredRules,
          loading: false,
          error: null,
        });
      } else {
        setState({
          currentHostel: null,
          rules: [],
          loading: false,
          error: null,
        });
      }
    } catch (err) {
      console.error("❌ Error loading rules:", err);
      setState({
        currentHostel: null,
        rules: [],
        loading: false,
        error: "Failed to load hostel rules. Please try again later.",
      });
      toast.error("Could not fetch hostel information.");
    }
  }, [navigate]);

  useEffect(() => {
    fetchHostelDataAndRules();
  }, [fetchHostelDataAndRules]);

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Loading rules & regulations...
          </p>
        </div>
      </div>
    );
  }

  if (!state.currentHostel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 text-center border border-gray-100 dark:border-gray-700">
          <Building2 className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
            No Hostel Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You are not currently assigned to any hostel. Please book a hostel
            to view its regulations.
          </p>
          <button
            onClick={() => navigate("/student/hostels")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 w-full shadow-lg shadow-blue-200 dark:shadow-none"
          >
            <Home size={18} />
            Browse Hostels
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              <ShieldCheck className="text-green-500 w-8 h-8" />
              Rules & Regulations
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
              Official guidelines for{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {state.currentHostel.name}
              </span>
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <span className="text-xs uppercase tracking-wider font-bold text-gray-400">
              Total Rules
            </span>
            <p className="text-xl font-black text-blue-600">
              {state.rules.length}
            </p>
          </div>
        </div>

        {/* Info Alert */}
        <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-xl flex gap-3">
          <Info
            className="text-blue-600 dark:text-blue-400 shrink-0"
            size={20}
          />
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Strict adherence to these rules ensures a safe and comfortable
            environment for everyone. Violations may lead to disciplinary action
            by the management.
          </p>
        </div>

        {/* Rules List */}
        <div className="space-y-3">
          {state.rules.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
              <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                No Specific Rules Listed
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                The owner hasn't uploaded specific rules for this hostel yet.
              </p>
            </div>
          ) : (
            state.rules.map((rule, index) => (
              <div
                key={rule._id}
                className="group bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-start gap-4 hover:border-blue-300 dark:hover:border-blue-500 transition-all hover:shadow-md"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-grow">
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                    {rule.text}
                  </p>
                </div>
                <ChevronRight
                  className="text-gray-300 dark:text-gray-600 group-hover:text-blue-400 transition-colors"
                  size={18}
                />
              </div>
            ))
          )}
        </div>

        {/* Footer Support */}
        <div className="mt-10 p-6 bg-gray-100 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 text-center">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
            <AlertCircle size={18} className="text-orange-500" />
            Have a question about the rules?
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            If you need clarification or want to report a violation, please use
            the complaints section.
          </p>
          <button
            onClick={() => navigate("/student/raise-complaint")}
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
          >
            Go to Raise Complaint →
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyHostelRules;
