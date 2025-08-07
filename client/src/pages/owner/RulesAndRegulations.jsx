import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

// The authentication token is retrieved from local storage, as in other components
const getToken = () => localStorage.getItem("token");

const RulesAndRegulations = () => {
  const navigate = useNavigate();
  const [rules, setRules] = useState([]);
  const [newRuleText, setNewRuleText] = useState("");
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [editingRuleText, setEditingRuleText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for hostel filtering
  const [hostels, setHostels] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState(null);

  // Fetch hostels from the backend
  useEffect(() => {
    const fetchHostels = async () => {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const hostelsRes = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/owner/my-hostels`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const hostelOptions = hostelsRes.data.hostels.map((hostel) => ({
          value: hostel._id,
          label: hostel.name,
        }));
        setHostels(hostelOptions);
        setSelectedHostel({ value: "all", label: "All Hostels" });
      } catch (err) {
        console.error("Error fetching hostels:", err);
        toast.error("Failed to fetch hostels for filtering.");
        setError("Failed to fetch hostels for filtering.");
      }
    };
    fetchHostels();
  }, [navigate]);

  // Fetch and listen for real-time changes to rules from the backend
  const fetchRules = async () => {
    setLoading(true);
    setError(null);
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/owner/rules/mine`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRules(response.data.rules);
    } catch (err) {
      console.error("Error fetching rules:", err);
      toast.error("Failed to fetch rules.");
      setError("Failed to fetch rules. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  // ✅ NEW: Function to add a rule to a single hostel
  const addRule = async () => {
    if (!newRuleText.trim()) {
      toast.error("Rule text cannot be empty.");
      return;
    }
    if (!selectedHostel || selectedHostel.value === "all") {
      toast.error("Please select a specific hostel to add a rule.");
      return;
    }

    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/owner/rules`,
        { text: newRuleText.trim(), hostelId: selectedHostel.value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewRuleText("");
      toast.success("Rule added successfully!");
      fetchRules(); // Re-fetch to update the list
    } catch (err) {
      console.error("Error adding rule:", err);
      toast.error("Failed to add rule.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Function to add a rule to all hostels
  const bulkAddRule = async () => {
    if (!newRuleText.trim()) {
      toast.error("Rule text cannot be empty.");
      return;
    }

    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      // We will create a new endpoint to handle this bulk operation
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/owner/rules/bulk`,
        { text: newRuleText.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewRuleText("");
      toast.success("Rule added to all hostels successfully!");
      fetchRules(); // Re-fetch to update the list
    } catch (err) {
      console.error("Error adding rule:", err);
      toast.error("Failed to add rule to all hostels.");
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (rule) => {
    setEditingRuleId(rule._id); // Use MongoDB _id
    setEditingRuleText(rule.text);
  };

  const saveEditedRule = async () => {
    if (!editingRuleText.trim()) {
      toast.error("Rule text cannot be empty.");
      return;
    }

    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/owner/rules/${editingRuleId}`,
        { text: editingRuleText.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingRuleId(null);
      setEditingRuleText("");
      toast.success("Rule updated successfully!");
      fetchRules(); // Re-fetch to update the list
    } catch (err) {
      console.error("Error updating rule:", err);
      toast.error("Failed to update rule.");
    } finally {
      setLoading(false);
    }
  };

  const cancelEditing = () => {
    setEditingRuleId(null);
    setEditingRuleText("");
  };

  const deleteRule = async (id) => {
    if (!window.confirm("Are you sure you want to delete this rule?")) {
      return;
    }

    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/owner/rules/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Rule deleted successfully!");
      fetchRules(); // Re-fetch to update the list
    } catch (err) {
      console.error("Error deleting rule:", err);
      toast.error("Failed to delete rule.");
    } finally {
      setLoading(false);
    }
  };

  const hostelOptions = [{ value: "all", label: "All Hostels" }, ...hostels];

  const filteredRules =
    selectedHostel && selectedHostel.value !== "all"
      ? rules.filter((rule) => rule.hostelId === selectedHostel.value)
      : rules;

  if (loading && rules.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">Loading rules...</p>
      </div>
    );
  }

  if (error && rules.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-red-600 dark:text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700 dark:text-white">
            Hostel Rules & Regulations
          </h1>
          {hostels.length > 0 && (
            <div className="w-1/3">
              <Select
                options={hostelOptions}
                value={selectedHostel}
                onChange={setSelectedHostel}
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: "white",
                    color: "black",
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: "white",
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? "#dbeafe" : "white",
                    color: "black",
                  }),
                }}
              />
            </div>
          )}
        </div>

        {/* Add New Rule Section */}
        <div className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            Add New Rule
          </h2>
          {/* ✅ UPDATED LOGIC HERE */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder={
                selectedHostel && selectedHostel.value === "all"
                  ? "Enter a rule for all hostels..."
                  : "Enter new rule..."
              }
              value={newRuleText}
              onChange={(e) => setNewRuleText(e.target.value)}
              className="flex-grow px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={loading}
            />
            <button
              onClick={
                selectedHostel && selectedHostel.value === "all"
                  ? bulkAddRule
                  : addRule
              }
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 ease-in-out font-semibold flex-shrink-0"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : selectedHostel.value === "all" ? (
                "Add to All"
              ) : (
                "Add Rule"
              )}
            </button>
          </div>
        </div>

        {/* Rules List Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            Existing Rules
          </h2>
          {filteredRules.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400">
              No rules added yet.
            </p>
          ) : (
            <ul className="space-y-4">
              {filteredRules.map((rule) => (
                <li
                  key={rule._id} // Use MongoDB _id
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                >
                  {editingRuleId === rule._id ? (
                    <input
                      type="text"
                      value={editingRuleText}
                      onChange={(e) => setEditingRuleText(e.target.value)}
                      className="flex-grow px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-600 dark:text-white border border-gray-300 dark:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      disabled={loading}
                    />
                  ) : (
                    <span className="text-gray-800 dark:text-gray-200 flex-grow">
                      {rule.text}
                    </span>
                  )}
                  <div className="flex gap-2 flex-shrink-0">
                    {editingRuleId === rule._id ? (
                      <>
                        <button
                          onClick={saveEditedRule}
                          className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors duration-200 ease-in-out font-semibold"
                          disabled={loading}
                        >
                          {loading ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="bg-gray-400 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-500 transition-colors duration-200 ease-in-out font-semibold"
                          disabled={loading}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(rule)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-600 transition-colors duration-200 ease-in-out font-semibold"
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteRule(rule._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors duration-200 ease-in-out font-semibold"
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default RulesAndRegulations;
