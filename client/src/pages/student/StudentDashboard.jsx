import React, { useState, useEffect } from "react";
import {
  Building,
  BedDouble,
  IndianRupee,
  Heart,
  User,
  CreditCard,
  Bell,
  AlertTriangle,
  HelpCircle,
  BookOpen,
  ScrollText,
  Eye,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStudentMetrics } from "../../hooks/useQueries";
import { SkeletonStatCard } from "../../components/ui/SkeletonCard";

import StatCard from "../../components/dashboard/StatCard";
import ActionCard from "../../components/dashboard/ActionCard";
import EmptyState from "../../components/dashboard/EmptyState";

const getUserData = () => {
  const userData = localStorage.getItem("user");
  return userData ? JSON.parse(userData) : null;
};

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const { data: metricsData, isLoading: metricsLoading } = useStudentMetrics();

  const stats = {
    hostelName: metricsData?.hostelName || "N/A",
    roomNumber: metricsData?.roomNumber != null ? String(metricsData.roomNumber) : "N/A",
    pendingFees: metricsData?.pendingDuesAmount || 0,
    pendingDuesCount: metricsData?.pendingDuesCount || 0,
    status: metricsData?.status || "Searching",
  };

  useEffect(() => {
    setUser(getUserData());
  }, []);

  const statCards = [
    {
      icon: <Building />,
      iconColor: "text-indigo-500",
      title: "Your Hostel",
      description: "Property assigned to you",
      value: stats.hostelName,
      route: "/student/my-hostel",
    },
    {
      icon: <BedDouble />,
      iconColor: "text-green-500",
      title: "Your Room",
      description: "Your assigned room",
      value: stats.roomNumber,
      route: "/student/my-room",
    },
    {
      icon: <IndianRupee />,
      iconColor: "text-yellow-500",
      title: "Pending Fees",
      description: "Amount due",
      value: `₹${stats.pendingFees.toLocaleString("en-IN")}`,
      route: "/student/payments",
    },
  ];

  const quickActions = {
    accommodation: [
      {
        icon: <Building />,
        title: "Browse Hostels",
        description: "Explore available properties",
        route: "/student/hostels",
        variant: "primary",
      },
      {
        icon: <Heart />,
        title: "Interested List",
        description: "Saved hostels",
        route: "/student/interested",
        variant: "primary",
      },
      {
        icon: <Eye />,
        title: "Recently Viewed",
        description: "Your browsing history",
        route: "/student/recently-viewed",
        variant: "primary",
      },
    ],
    bookings: [
      {
        icon: <BookOpen />,
        title: "My Bookings",
        description: "Current & past hostels",
        route: "/student/my-bookings",
        variant: "primary",
      },
      {
        icon: <FileText />,
        title: "Request Status",
        description: "Track your applications",
        route: "/student/my-requests",
        variant: "primary",
      },
    ],
    financial: [
      {
        icon: <CreditCard />,
        title: "Payment History",
        description: "View transactions",
        route: "/student/payments",
        variant: "success",
      },
      {
        icon: <IndianRupee />,
        title: "Make Payment",
        description: "Pay pending fees",
        route: "/student/payments",
        variant: "success",
      },
    ],
    support: [
      {
        icon: <AlertTriangle />,
        title: "Raise Complaint",
        description: "Report issues",
        route: "/student/raise-complaint",
        variant: "warning",
      },
      {
        icon: <Bell />,
        title: "Notifications",
        description: "Updates & alerts",
        route: "/student/notifications",
        variant: "primary",
      },
      {
        icon: <HelpCircle />,
        title: "Contact Support",
        description: "Get help",
        route: "/contact",
        variant: "primary",
      },
    ],
    settings: [
      {
        icon: <ScrollText />,
        title: "Hostel Rules",
        description: "View regulations",
        route: "/student/rules-and-regulations",
        variant: "primary",
      },
      {
        icon: <User />,
        title: "Profile Settings",
        description: "Update your info",
        route: "/student/profile-settings",
        variant: "primary",
      },
    ],
  };

  const hasNoHostel = stats.hostelName === "N/A" || stats.status === "Searching";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-2">
          Welcome, {user?.name || "Student"}!
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Here's your hostel dashboard overview
        </p>
      </div>

      {/* Empty State */}
      {!metricsLoading && hasNoHostel && (
        <div className="mb-8">
          <EmptyState
            icon={<Building className="w-16 h-16 text-slate-400" />}
            title="No hostel assigned yet"
            message="Start exploring available hostels and submit booking requests. You'll see your hostel details here once approved."
            actionLabel="Browse Hostels"
            onAction={() => navigate("/student/hostels")}
            secondaryLabel="View Requests"
            onSecondary={() => navigate("/student/my-requests")}
          />
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {metricsLoading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonStatCard key={i} />)
            : statCards.map((stat, index) => (
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

      {/* Quick Actions */}
      <div className="space-y-8">
        <ActionGroup
          title="Find Your Home"
          actions={quickActions.accommodation}
          navigate={navigate}
        />
        <ActionGroup
          title="Bookings & Requests"
          actions={quickActions.bookings}
          navigate={navigate}
        />
        <ActionGroup
          title="Payments"
          actions={quickActions.financial}
          navigate={navigate}
        />
        <ActionGroup
          title="Support & Help"
          actions={quickActions.support}
          navigate={navigate}
        />
        <ActionGroup
          title="Settings"
          actions={quickActions.settings}
          navigate={navigate}
        />
      </div>
    </div>
  );
};

const ActionGroup = ({ title, actions, navigate }) => (
  <div>
    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">{title}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {actions.map((action, index) => (
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
);

export default StudentDashboard;
