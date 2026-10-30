"use client";

import React from "react";
import { WhatsAppConciergeDrawer } from "./whatsapp-concierge-drawer";
import type { BusinessSettings } from "@/types/settings";

interface WhatsAppFloatingButtonProps {
  settings?: Partial<BusinessSettings>;
}

export function WhatsAppFloatingButton({ settings }: WhatsAppFloatingButtonProps = {}) {
  void settings;
  return <WhatsAppConciergeDrawer />;
}

export default WhatsAppFloatingButton;
