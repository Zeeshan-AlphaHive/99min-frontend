'use client';

import React, { useEffect, useState } from 'react';
import SettingsSection from './SettingsSection';
import SettingsField from './Settingsfield';
// import SettingsToggle from './SettingsToggle';
import { getAdminSettings, updateAdminSettings } from '@/utils/api/admin.settings.api';

// const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Italian', 'Chinese', 'Portuguese'];

export default function SettingsPage() {
  // General Settings
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

  // Pinned Example Task
  const [taskTitle, setTaskTitle] = useState('');
  const [taskLocation, setTaskLocation] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskBudget, setTaskBudget] = useState('0');

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
    <button
      type="button"
      onClick={handleSave}
      disabled={loading || saving}
      className="px-3 sm:px-5 py-2 bg-orange hover:bg-orangeHover text-white text-xs sm:text-sm font-medium rounded-lg transition-colors shadow-sm"
    >
      {saving ? 'Saving…' : 'Save Changes'}
    </button>
  </div>

  {error && (
    <p className="text-red-500 text-sm text-center mb-4">{error}</p>
  )}

      <div className="space-y-4">

        {/* ── General Settings ── */}
        <SettingsSection title="General Settings">
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
        </SettingsSection>

      </div>
    </div>
  );
}