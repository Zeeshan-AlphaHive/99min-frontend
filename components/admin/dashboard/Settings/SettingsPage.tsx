'use client';

import React, { useEffect, useState } from 'react';
import SettingsSection from './SettingsSection';
import SettingsField from './Settingsfield';
// import SettingsToggle from './SettingsToggle';
import { getAdminSettings, updateAdminSettings } from '@/utils/api/admin.settings.api';

// const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Italian', 'Chinese', 'Portuguese'];

export default function SettingsPage() {
  const [isEditing, setIsEditing] = useState(false);

  // General Settings (draft)
  const [defaultDuration, setDefaultDuration] = useState('90');
  const [maxDurationPro, setMaxDurationPro] = useState('1440');
  const [dailyTaskLimit, setDailyTaskLimit] = useState('3');
  const [reportAutoFlagCount, setReportAutoFlagCount] = useState('3');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');

  // Language Settings
//   const [defaultLanguage] = useState('English (US)');
//   const [enabledLanguages, setEnabledLanguages] = useState<string[]>(['English']);

//   const toggleLanguage = (lang: string) => {
//     setEnabledLanguages((prev) =>
//       prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
//     );
//   };

  // Platform Controls
//   const [maintenanceMode, setMaintenanceMode] = useState(true);

  // Pinned Example Task (draft)
  const [taskTitle, setTaskTitle] = useState('');
  const [taskLocation, setTaskLocation] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskBudget, setTaskBudget] = useState('0');

  // Last saved snapshot (for view mode + cancel)
  const [saved, setSaved] = useState({
    defaultDuration: '90',
    maxDurationPro: '1440',
    dailyTaskLimit: '3',
    reportAutoFlagCount: '3',
    taskTitle: '',
    taskLocation: '',
    taskDescription: '',
    taskBudget: '0',
  });

  const syncDraftFromSaved = (s = saved) => {
    setDefaultDuration(s.defaultDuration);
    setMaxDurationPro(s.maxDurationPro);
    setDailyTaskLimit(s.dailyTaskLimit);
    setReportAutoFlagCount(s.reportAutoFlagCount);
    setTaskTitle(s.taskTitle);
    setTaskLocation(s.taskLocation);
    setTaskDescription(s.taskDescription);
    setTaskBudget(s.taskBudget);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await getAdminSettings();
        if (cancelled) return;

        setDefaultDuration(String(res.data.defaultTaskDuration ?? 90));
        setMaxDurationPro(String(res.data.maxDurationPro ?? 1440));
        setDailyTaskLimit(String(res.data.dailyTaskLimitFree ?? 3));
        setReportAutoFlagCount(String(res.data.reportAutoFlagCount ?? 3));

        setTaskTitle(res.data.pinnedExampleTask?.title ?? '');
        setTaskLocation(res.data.pinnedExampleTask?.location ?? '');
        setTaskDescription(res.data.pinnedExampleTask?.description ?? '');
        setTaskBudget(String(res.data.pinnedExampleTask?.budget ?? 0));

        const snapshot = {
          defaultDuration: String(res.data.defaultTaskDuration ?? 90),
          maxDurationPro: String(res.data.maxDurationPro ?? 1440),
          dailyTaskLimit: String(res.data.dailyTaskLimitFree ?? 3),
          reportAutoFlagCount: String(res.data.reportAutoFlagCount ?? 3),
          taskTitle: res.data.pinnedExampleTask?.title ?? '',
          taskLocation: res.data.pinnedExampleTask?.location ?? '',
          taskDescription: res.data.pinnedExampleTask?.description ?? '',
          taskBudget: String(res.data.pinnedExampleTask?.budget ?? 0),
        };
        setSaved(snapshot);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = () => {
    setError('');
    (async () => {
      try {
        setSaving(true);
        await updateAdminSettings({
          defaultTaskDuration: Number(defaultDuration),
          maxDurationPro: Number(maxDurationPro),
          dailyTaskLimitFree: Number(dailyTaskLimit),
          reportAutoFlagCount: Number(reportAutoFlagCount),
          pinnedExampleTask: {
            title: taskTitle,
            location: taskLocation,
            description: taskDescription,
            budget: Number(taskBudget),
          },
        });
        const snapshot = {
          defaultDuration,
          maxDurationPro,
          dailyTaskLimit,
          reportAutoFlagCount,
          taskTitle,
          taskLocation,
          taskDescription,
          taskBudget,
        };
        setSaved(snapshot);
        setIsEditing(false);
        alert('Settings saved!');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to save settings');
      } finally {
        setSaving(false);
      }
    })();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
  {/* Header */}
  <div className="flex items-center justify-between mb-4 sm:mb-6">
    <h1 className="text-2xl font-semibold text-textBlack mb-1">Settings</h1>
    <div className="flex items-center gap-2">
      {!isEditing ? (
        <button
          type="button"
          onClick={() => {
            setError('');
            syncDraftFromSaved();
            setIsEditing(true);
          }}
          disabled={loading}
          className="px-3 sm:px-5 py-2 bg-orange hover:bg-orangeHover text-white text-xs sm:text-sm font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Edit
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={() => {
              setError('');
              syncDraftFromSaved();
              setIsEditing(false);
            }}
            disabled={loading || saving}
            className="px-3 sm:px-5 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-textBlack text-xs sm:text-sm font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || saving}
            className="px-3 sm:px-5 py-2 bg-orange hover:bg-orangeHover text-white text-xs sm:text-sm font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </>
      )}
    </div>
  </div>

  {error && (
    <p className="text-red-500 text-sm text-center mb-4">{error}</p>
  )}

      <div className="space-y-4">

        {/* ── General Settings ── */}
        <SettingsSection title="General Settings">
          {!isEditing ? (
            <div className="space-y-3">
              <Row label="Default Task Duration (min)" value={saved.defaultDuration} />
              <Row label="Max Task Duration - Pro (min)" value={saved.maxDurationPro} />
              <Row label="Daily Task Limit (Free Users)" value={saved.dailyTaskLimit} />
              <Row label="Auto-Flag Count (Reports)" value={saved.reportAutoFlagCount} />
            </div>
          ) : (
            <>
              <SettingsField
                label="Default Task Duration (min)"
                value={defaultDuration}
                onChange={setDefaultDuration}
                type="number"
              />
              <SettingsField
                label="Max Task Duration - Pro (min)"
                value={maxDurationPro}
                onChange={setMaxDurationPro}
                type="number"
              />
              <SettingsField
                label="Daily Task Limit (Free Users)"
                value={dailyTaskLimit}
                onChange={setDailyTaskLimit}
                type="number"
              />
              <SettingsField
                label="Auto-Flag Count (Reports)"
                value={reportAutoFlagCount}
                onChange={setReportAutoFlagCount}
                type="number"
              />
            </>
          )}
        </SettingsSection>

        {/* ── Language Settings ── */}
        {/* <SettingsSection title="Language Settings">
          <div className="mb-4">
            <label className="block text-sm text-textGray mb-1.5">Default Language</label>
            <input
              type="text"
              value={defaultLanguage}
              readOnly
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-textBlack bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-textGray mb-3">Enabled Languages</label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => {
                const active = enabledLanguages.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLanguage(lang)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                      active
                        ? 'bg-orange text-white border-orange'
                        : 'bg-white text-textGray border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>
        </SettingsSection> */}

        {/* ── Platform Controls ── */}
        {/* <SettingsSection title="Platform Controls">
          <SettingsToggle
            label="Maintenance Mode"
            description="Temporarily disable platform access for all users"
            enabled={maintenanceMode}
            onChange={setMaintenanceMode}
          />
        </SettingsSection> */}

        {/* ── Pinned Example Task ── */}
        <SettingsSection title="Pinned Example Task">
          {!isEditing ? (
            <div className="space-y-3">
              <Row label="Task Title" value={saved.taskTitle || "—"} />
              <Row label="Location" value={saved.taskLocation || "—"} />
              <Row
                label="Description"
                value={saved.taskDescription || "—"}
                multiline
              />
              <Row label="Budget ($)" value={saved.taskBudget} />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-textGray mb-1.5">Task Title</label>
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-textBlack bg-white focus:outline-none focus:ring-2 focus:ring-orange/30 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm text-textGray mb-1.5">Location</label>
                  <input
                    type="text"
                    value={taskLocation}
                    onChange={(e) => setTaskLocation(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-textBlack bg-white focus:outline-none focus:ring-2 focus:ring-orange/30 transition"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-textGray mb-1.5">Description</label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-textBlack bg-white focus:outline-none focus:ring-2 focus:ring-orange/30 transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-textGray mb-1.5">Budget ($)</label>
                <input
                  type="number"
                  value={taskBudget}
                  onChange={(e) => setTaskBudget(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-textBlack bg-white focus:outline-none focus:ring-2 focus:ring-orange/30 transition"
                />
              </div>
            </>
          )}
        </SettingsSection>

      </div>
    </div>
  );
}

function Row({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-6">
      <div className="text-sm text-textGray">{label}</div>
      <div
        className={`text-sm text-textBlack sm:text-right ${
          multiline ? "whitespace-pre-wrap sm:max-w-[70%]" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}