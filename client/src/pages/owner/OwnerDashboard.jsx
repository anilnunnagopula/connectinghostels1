import React, { useState, useEffect } from "react";
import {
  Building,
  BedDouble,
  Users,
  PlusCircle,
  MailCheckIcon,
  CreditCard,
  Settings,
  Send,
  ScrollText,
  GitPullRequest,
  UserPlus,
  Loader2,
} from "lucide-react";
import { FaRestroom } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Import new reusable components
import StatCard from "../../components/dashboard/StatCard";
import ActionCard from "../../components/dashboard/ActionCard";
import EmptyState from "../../components/dashboard/EmptyState";

const getToken = () => localStorage.getItem("token");

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalHostels: 0,
    roomsFilled: 0,
    totalStudents: 0,
    complaints: 0,
    availableRooms: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user name for welcome message
    const ownerData = localStorage.getItem("user");
    if (ownerData) {
      setUser(JSON.parse(ownerData));
    }

    const fetchDashboardStats = async () => {
      setLoading(true);
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/owner/dashboard/metrics`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        console.log("📊 Owner Dashboard Metrics:", res.data);

        setStats({
          totalHostels: res.data.totalHostels,
          roomsFilled: res.data.roomsFilled,
          totalStudents: res.data.studentsCount,
          complaints: res.data.complaintsCount,
          availableRooms: res.data.availableRooms,
        });
      } catch (err) {
        console.error("Dashboard stats fetch failed ❌", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [navigate]);

  // KPI Stats Configuration
  const statCards = [
    {
      icon: <Building />,
      iconColor: "text-indigo-500",
      title: "Total Hostels",
      description: "Properties you manage",
      value: stats.totalHostels,
      route: "/owner/my-hostels",
    },
    {
      icon: <BedDouble />,
      iconColor: "text-green-500",
      title: "Rooms Filled",
      description: "Currently occupied",
      value: stats.roomsFilled,
      route: "/owner/filled-rooms",
    },
    {
      icon: <Users />,
      iconColor: "text-purple-500",
      title: "Total Students",
      description: "Across all properties",
      value: stats.totalStudents,
      route: "/owner/my-students",
    },
    {
      icon: <MailCheckIcon />,
      iconColor: "text-red-500",
      title: "Pending Complaints",
      description: "Needs your attention",
      value: stats.complaints,
      route: "/owner/view-complaints",
      badge: stats.complaints,
    },
    {
      icon: <FaRestroom />,
      iconColor: "text-blue-500",
      title: "Available Rooms",
      description: "Ready for booking",
      value: stats.availableRooms,
      route: "/owner/available-rooms",
    },
    {
      icon: <BedDouble />,
      iconColor: "text-orange-500",
      title: "Manage Rooms",
      description: "Edit, toggle, and view rooms",
      value: stats.roomsFilled + stats.availableRooms,
      route: "/owner/manage-rooms",
    },
  ];

  // Quick Actions Configuration (Grouped)
  const quickActions = {
    management: [
      {
        icon: <PlusCircle />,
        title: "Add New Hostel",
        description: "Register a property",
        route: "/owner/add-hostel",
        variant: "primary",
      },
      {
        icon: <BedDouble />,
        title: "Manage Rooms",
        description: "Edit availability",
        route: "/owner/manage-rooms",
        variant: "primary",
      },
      {
        icon: <UserPlus />,
        title: "Add Student",
        description: "Onboard new student",
        route: "/owner/add-student",
        variant: "success",
      },
    ],
    operations: [
      {
        icon: <GitPullRequest />,
        title: "View Requests",
        description: "Booking & stay requests",
        route: "/owner/view-requests",
        variant: "primary",
        badge: 0, // Can be made dynamic later
      },
      {
        icon: <MailCheckIcon />,
        title: "Complaints",
        description: "View & resolve issues",
        route: "/owner/view-complaints",
        variant: "warning",
        badge: stats.complaints,
      },
    ],
    communication: [
      {
        icon: <Send />,
        title: "Send Alerts",
        description: "Message students",
        route: "/owner/send-alerts",
        variant: "primary",
      },
    ],
    settings: [
      {
        icon: <ScrollText />,
        title: "Rules & Regulations",
        description: "Manage hostel policies",
        route: "/owner/rules-and-regulations",
        variant: "primary",
      },
      {
        icon: <CreditCard />,
        title: "Payment Methods",
        description: "Configure payments",
        route: "/owner/payment-settings",
        variant: "primary",
      },
      {
        icon: <Settings />,
        title: "Profile Settings",
        description: "Account preferences",
        route: "/owner/profile-settings",
        variant: "primary",
      },
    ],
  };

  // Check if owner has any data
  const hasNoData =
    stats.totalHostels === 0 &&
    stats.roomsFilled === 0 &&
    stats.totalStudents === 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-2">
          Welcome, {user?.name || "Owner"}! 👋
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Here's what's happening with your properties today
        </p>
      </div>

      {/* Empty State - Show if no hostels */}
      {hasNoData && (
        <div className="mb-8">
          <EmptyState
            icon={<Building className="w-16 h-16 text-slate-400" />}
            title="No hostels yet"
            message="Get started by adding your first hostel property. You can manage rooms, students, and bookings all in one place."
            actionLabel="Add Your First Hostel"
            onAction={() => navigate("/owner/add-hostel")}
            secondaryLabel="Learn More"
            onSecondary={() => {}}
          />
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
          Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {statCards.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              iconColor={stat.iconColor}
              title={stat.title}
              description={stat.description}
              value={stat.value}
              onClick={() => navigate(stat.route)}
            />
          ))}
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="space-y-8">
        {/* Management Actions */}
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            Property Management
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.management.map((action, index) => (
              <ActionCard
                key={index}
                icon={action.icon}
                title={action.title}
                description={action.description}
                variant={action.variant}
                onClick={() => navigate(action.route)}
              />
            ))}
          </div>
        </div>

        {/* Operations */}
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            Operations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.operations.map((action, index) => (
              <ActionCard
                key={index}
                icon={action.icon}
                title={action.title}
                description={action.description}
                variant={action.variant}
                badge={action.badge}
                onClick={() => navigate(action.route)}
              />
            ))}
          </div>
        </div>

        {/* Communication */}
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            Communication
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.communication.map((action, index) => (
              <ActionCard
                key={index}
                icon={action.icon}
                title={action.title}
                description={action.description}
                variant={action.variant}
                onClick={() => navigate(action.route)}
              />
            ))}
          </div>
        </div>

        {/* Settings */}
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            Settings & Configuration
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.settings.map((action, index) => (
              <ActionCard
                key={index}
                icon={action.icon}
                title={action.title}
                description={action.description}
                variant={action.variant}
                onClick={() => navigate(action.route)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
