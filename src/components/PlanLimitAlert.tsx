"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";

type Props = {
  type: "search" | "store" | "feature";
  message: string;
  currentPlan: string;
  suggestedPlan?: string;
  onDismiss?: () => void;
};

export default function PlanLimitAlert({
  type,
  message,
  suggestedPlan = "Pro",
  onDismiss,
}: Props) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const getIcon = () => {
    switch (type) {
      case "search":
        return "🔍";
      case "store":
        return "🏪";
      case "feature":
        return "⭐";
      default:
        return "⚠️";
    }
  };

  const getTitle = () => {
    switch (type) {
      case "search":
        return "Daily Search Limit Reached";
      case "store":
        return "Store Limit Reached";
      case "feature":
        return "Feature Not Available";
      default:
        return "Plan Limit Reached";
    }
  };

  return (
    <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20 p-4 mb-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{getIcon()}</span>
          <div>
            <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-1">{getTitle()}</h3>
            <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">{message}</p>
            <div className="flex flex-wrap gap-2">
              <ButtonLink href="/pricing" variant="default" size="sm">
                Upgrade to {suggestedPlan}
              </ButtonLink>
              <Button variant="secondary" size="sm" onClick={handleDismiss}>Dismiss</Button>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleDismiss} className="self-start">
          ✕
        </Button>
      </div>
    </Card>
  );
}
