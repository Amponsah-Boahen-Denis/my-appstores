"use client";

import { useState } from "react";
import { Place } from "@/services/openstreet";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Radio } from "@/components/ui/radio";

type FilterOptions = {
  hasWebsite: boolean | null;
  hasEmail: boolean | null;
  hasPhone: boolean | null;
  sortBy: "relevance" | "name" | "distance";
  maxResults: number;
};

type Props = {
  results: Place[];
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  hasResults: boolean;
};

export default function SearchFilters({ results, onFiltersChange, onClearFilters, hasResults }: Props) {
  const [filters, setFilters] = useState<FilterOptions>({
    hasWebsite: null,
    hasEmail: null,
    hasPhone: null,
    sortBy: "relevance",
    maxResults: 20,
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => {
    const newFilters = { ...filters, [key]: value } as FilterOptions;
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const defaultFilters: FilterOptions = {
      hasWebsite: null,
      hasEmail: null,
      hasPhone: null,
      sortBy: "relevance",
      maxResults: 20,
    };
    setFilters(defaultFilters);
    onClearFilters();
  };

  const getContactStats = () => {
    const total = results.length;
    const withWebsite = results.filter((r) => r.website).length;
    const withEmail = results.filter((r) => r.email).length;
    const withPhone = results.filter((r) => r.phone).length;

    return { total, withWebsite, withEmail, withPhone };
  };

  const stats = getContactStats();

  if (!hasResults) return null;

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">Filters</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? "Hide" : "Show"} Filters
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={handleClearFilters}>
            Clear All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-4">
        <Badge className="justify-center">Total {stats.total}</Badge>
        <Badge variant="success" className="justify-center">Website {stats.withWebsite}</Badge>
        <Badge variant="default" className="justify-center">Email {stats.withEmail}</Badge>
        <Badge variant="secondary" className="justify-center">Phone {stats.withPhone}</Badge>
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div>
            <h4 className="font-medium mb-2">Contact Information</h4>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm font-medium mb-2">Website</p>
                <div className="space-y-1">
                  <label className="flex items-center gap-2">
                    <Radio
                      name="websiteFilter"
                      checked={filters.hasWebsite === null}
                      onChange={() => handleFilterChange("hasWebsite", null)}
                    />
                    <span className="text-sm">All</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <Radio
                      name="websiteFilter"
                      checked={filters.hasWebsite === true}
                      onChange={() => handleFilterChange("hasWebsite", true)}
                    />
                    <span className="text-sm">Has Website</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <Radio
                      name="websiteFilter"
                      checked={filters.hasWebsite === false}
                      onChange={() => handleFilterChange("hasWebsite", false)}
                    />
                    <span className="text-sm">No Website</span>
                  </label>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Email</p>
                <div className="space-y-1">
                  <label className="flex items-center gap-2">
                    <Radio
                      name="emailFilter"
                      checked={filters.hasEmail === null}
                      onChange={() => handleFilterChange("hasEmail", null)}
                    />
                    <span className="text-sm">All</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <Radio
                      name="emailFilter"
                      checked={filters.hasEmail === true}
                      onChange={() => handleFilterChange("hasEmail", true)}
                    />
                    <span className="text-sm">Has Email</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <Radio
                      name="emailFilter"
                      checked={filters.hasEmail === false}
                      onChange={() => handleFilterChange("hasEmail", false)}
                    />
                    <span className="text-sm">No Email</span>
                  </label>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Phone</p>
                <div className="space-y-1">
                  <label className="flex items-center gap-2">
                    <Radio
                      name="phoneFilter"
                      checked={filters.hasPhone === null}
                      onChange={() => handleFilterChange("hasPhone", null)}
                    />
                    <span className="text-sm">All</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <Radio
                      name="phoneFilter"
                      checked={filters.hasPhone === true}
                      onChange={() => handleFilterChange("hasPhone", true)}
                    />
                    <span className="text-sm">Has Phone</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <Radio
                      name="phoneFilter"
                      checked={filters.hasPhone === false}
                      onChange={() => handleFilterChange("hasPhone", false)}
                    />
                    <span className="text-sm">No Phone</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Sort By</h4>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="flex items-center gap-2">
                <Radio
                  name="sortBy"
                  value="relevance"
                  checked={filters.sortBy === "relevance"}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value as "relevance" | "name" | "distance")}
                />
                <span className="text-sm">Relevance</span>
              </label>
              <label className="flex items-center gap-2">
                <Radio
                  name="sortBy"
                  value="name"
                  checked={filters.sortBy === "name"}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value as "relevance" | "name" | "distance")}
                />
                <span className="text-sm">Name (A-Z)</span>
              </label>
              <label className="flex items-center gap-2">
                <Radio
                  name="sortBy"
                  value="distance"
                  checked={filters.sortBy === "distance"}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value as "relevance" | "name" | "distance")}
                />
                <span className="text-sm">Distance</span>
              </label>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Show Results</h4>
            <Label htmlFor="filter-max-results">Results per page</Label>
            <Select
              id="filter-max-results"
              value={filters.maxResults.toString()}
              onChange={(e) => handleFilterChange("maxResults", parseInt(e.target.value))}
              options={[
                { label: "10 results", value: "10" },
                { label: "20 results", value: "20" },
                { label: "50 results", value: "50" },
                { label: "100 results", value: "100" },
              ]}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
