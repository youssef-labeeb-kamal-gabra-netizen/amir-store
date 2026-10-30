import React from "react";
import { getCustomSettings } from "@/lib/settings-store";
import { SettingsManager } from "@/components/admin/settings-manager";

export default function AdminSettingsPage() {
  const settings = getCustomSettings();
  return <SettingsManager initialSettings={settings} />;
}
