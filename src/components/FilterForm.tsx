"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { FilterIcon, SearchIcon } from "lucide-react";
import { ROUTES } from "@/lib/router";

interface Category {
  id: string;
  name: string;
}

interface FilterFormProps {
  initialValues: {
    search: string;
    status: string;
    categoryId: string;
    featured: string;
    limit: string;
  };
  categories: Category[];
}

export default function FilterForm({
  initialValues,
  categories,
}: FilterFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [values, setValues] = useState(initialValues);

  // Update form values from URL on component mount
  useEffect(() => {
    const search = searchParams.get("search") || initialValues.search;
    const status = searchParams.get("status") || initialValues.status;
    const categoryId =
      searchParams.get("categoryId") || initialValues.categoryId;
    const featured = searchParams.get("featured") || initialValues.featured;
    const limit = searchParams.get("limit") || initialValues.limit;

    console.log("URL params:", { search, status, categoryId, featured, limit });
    console.log("Initial values:", initialValues);

    setValues({
      search,
      status,
      categoryId,
      featured,
      limit,
    });
  }, [searchParams, initialValues]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Build query params
    const params = new URLSearchParams();

    // Only add non-empty values
    if (values.search) params.append("search", values.search);
    if (values.status) params.append("status", values.status);
    if (values.categoryId) params.append("categoryId", values.categoryId);
    if (values.featured) params.append("featured", values.featured);

    // Always include page and limit
    params.append("page", "1");
    params.append("limit", values.limit);

    const url = `${ROUTES.NEWS}?${params.toString()}`;
    console.log("Navigating to:", url);

    // Navigate to the URL with query params
    router.push(url);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-md shadow mb-6"
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              name="search"
              placeholder="Search news..."
              value={values.search}
              onChange={(e) => setValues({ ...values, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            />
            <SearchIcon
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <select
            name="status"
            value={values.status}
            onChange={(e) => setValues({ ...values, status: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>

          <select
            name="categoryId"
            value={values.categoryId}
            onChange={(e) =>
              setValues({ ...values, categoryId: e.target.value })
            }
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <FilterIcon size={16} />
            Apply Filters
          </button>
        </div>
      </div>
    </form>
  );
}
