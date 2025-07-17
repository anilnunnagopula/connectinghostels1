import React, { useState, useEffect } from "react";

const RulesAndRegulations = () => {
  // State for rules management (now local to the component)
  const [rules, setRules] = useState([]); // Rules will be stored here, not in Firestore
  const [newRuleText, setNewRuleText] = useState("");
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [editingRuleText, setEditingRuleText] = useState("");
  const [loading, setLoading] = useState(false); // No longer loading from external source
  const [error, setError] = useState(null); // Error state for local validation/logic

  // Simulate initial loading (optional, can be removed if not needed)
  useEffect(() => {
    setLoading(true);
    // In a real app without a backend, you might load from localStorage here
    // For this example, we start with no rules or a mock set
    const mockRules = [
      // { id: '1', text: 'Quiet hours from 10 PM to 7 AM' },
      // { id: '2', text: 'No smoking indoors' },
    ];
    setRules(mockRules);
    setLoading(false);
  }, []);

  // Add a new rule to local state
  const addRule = () => {
    if (!newRuleText.trim()) {
      alert("Rule text cannot be empty.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const newRule = {
        id: Date.now().toString(), // Simple unique ID for local state
        text: newRuleText.trim(),
      };
      setRules((prevRules) => [...prevRules, newRule]);
      setNewRuleText("");
      alert("Rule added successfully!");
    } catch (err) {
      console.error("Error adding rule:", err);
      alert("Failed to add rule. Please try again.");
      setError("Failed to add rule.");
    } finally {
      setLoading(false);
    }
  };

  // Start editing an existing rule
  const startEditing = (rule) => {
    setEditingRuleId(rule.id);
    setEditingRuleText(rule.text);
  };

  // Save changes to an existing rule in local state
  const saveEditedRule = () => {
    if (!editingRuleText.trim()) {
      alert("Rule text cannot be empty.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      setRules((prevRules) =>
        prevRules.map((rule) =>
          rule.id === editingRuleId
            ? { ...rule, text: editingRuleText.trim() }
            : rule
        )
      );
      setEditingRuleId(null);
      setEditingRuleText("");
      alert("Rule updated successfully!");
    } catch (err) {
      console.error("Error updating rule:", err);
      alert("Failed to update rule. Please try again.");
      setError("Failed to update rule.");
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingRuleId(null);
    setEditingRuleText("");
  };

  // Delete a rule from local state
  const deleteRule = (id) => {
    if (!window.confirm("Are you sure you want to delete this rule?")) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      setRules((prevRules) => prevRules.filter((rule) => rule.id !== id));
      alert("Rule deleted successfully!");
    } catch (err) {
      console.error("Error deleting rule:", err);
      alert("Failed to delete rule. Please try again.");
      setError("Failed to delete rule.");
    } finally {
      setLoading(false);
    }
  };

  // No longer need isAuthReady checks as there's no external authentication
  // No longer need userId display as it's not relevant without Firebase auth

  if (error && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-red-600 dark:text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-700 dark:text-white">
          Hostel Rules & Regulations
        </h1>

        {/* Removed User ID display as it's not applicable without Firebase Auth */}
        {/*
        {userId && (
          <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-4">
            Your User ID: <span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{userId}</span>
          </p>
        )}
        */}

        {/* Add New Rule Section */}
        <div className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            Add New Rule
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter new rule..."
              value={newRuleText}
              onChange={(e) => setNewRuleText(e.target.value)}
              className="flex-grow px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={loading}
            />
            <button
              onClick={addRule}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 ease-in-out font-semibold flex-shrink-0"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Rule"}
            </button>
          </div>
        </div>

        {/* Rules List Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            Existing Rules
          </h2>
          {loading && rules.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400">
              Loading rules...
            </p>
          ) : rules.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400">
              No rules added yet.
            </p>
          ) : (
            <ul className="space-y-4">
              {rules.map((rule) => (
                <li
                  key={rule.id}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                >
                  {editingRuleId === rule.id ? (
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
                    {editingRuleId === rule.id ? (
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
                          onClick={() => deleteRule(rule.id)}
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
