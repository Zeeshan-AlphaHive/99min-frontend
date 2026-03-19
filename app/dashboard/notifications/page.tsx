"use client";

import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import NotificationCard from "@/components/dashboard/NotificationCard";
import { Bell, CheckCheck, RefreshCw } from "lucide-react";
import { useNotifications } from "@/hooks/UseNotification";
import { ApiNotification } from "@/utils/api/notification.api";
import { useI18n } from "@/contexts/i18n-context";

const NotificationsPage: React.FC = () => {
  const { tr } = useI18n();
  const {
    notifications,
    unreadCount,
    loading,
    error,
    hasMore,
    handleMarkAsRead,
    handleMarkAllAsRead,
    loadMore,
    refresh,
  } = useNotifications(20);

  const handleNotificationClick = (notification: ApiNotification) => {
    // Mark as read on click if unread
    if (!notification.read) {
      handleMarkAsRead(notification._id);
    }

    // Navigate based on deep-link data
    if (notification.data?.url) {
      window.location.href = notification.data.url;
    }
    // Add other navigation logic here (e.g. router.push to task/response pages)
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-inputBg">
        <div className="max-w-4xl bg-white mx-auto py-8">
          {/* Header */}
          <div className="mb-6 border-b px-8 border-lightGrey pb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-textBlack">{tr("Notifications")}</h1>
                {unreadCount > 0 && (
                  <span className="bg-orange text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <p className="text-textGray text-base mt-1">
                {tr("Stay updated on your tasks")}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-1">
              <button
               onClick={() => refresh()} 
                className="p-2 text-textGray hover:text-textBlack transition-colors"
                aria-label={tr("Refresh")}
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              {unreadCount > 0 && (
                <button
             onClick={() => handleMarkAllAsRead()}
                  className="flex items-center gap-1.5 text-sm text-orange font-semibold hover:opacity-80 transition-opacity"
                >
                  <CheckCheck className="w-4 h-4" />
                  {tr("Mark all read")}
                </button>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mx-8 mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
              {error}{" "}
              <button onClick={() => refresh()} className="underline font-semibold">
                {tr("Retry")}
              </button>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && notifications.length === 0 && (
            <div className="space-y-3 px-0">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-4 flex items-start gap-4 animate-pulse">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Notifications list */}
          {!loading || notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification._id}
                  notification={notification}
                  onClick={handleNotificationClick}
                />
              ))}
            </div>
          ) : null}

          {/* Load more */}
          {hasMore && (
            <div className="px-8 mt-4">
              <button
            onClick={() => loadMore()}
                disabled={loading}
                className="w-full py-3 text-sm text-textGray font-semibold border border-lightGrey rounded-xl hover:bg-inputBg transition-colors disabled:opacity-50"
              >
                {loading ? tr("Loading...") : tr("Load more")}
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && notifications.length === 0 && !error && (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-textGray mx-auto mb-4 opacity-50" />
              <p className="text-textGray text-lg">{tr("No notifications yet")}</p>
              <p className="text-textGray text-sm mt-2">
                {tr("You'll see updates here when they arrive")}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;