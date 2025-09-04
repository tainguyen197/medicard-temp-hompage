import { useState, useEffect, useCallback } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { ROUTES } from "@/lib/router";
import { cleanContentForSubmission } from "@/lib/content-utils";
import { newsFormSchema } from "@/utils/news";
import { authFetch } from "@/lib/auth-fetch";

// Define the Category interface
export interface Category {
  id: string;
  name: string;
  slug: string;
  language: string;
}


export type NewsFormValues = z.infer<typeof newsFormSchema>;

export function useNewsForm(initialData?: Partial<NewsFormValues>) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isImageEnUploading, setIsImageEnUploading] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  // Category states
  const [categoriesVi, setCategoriesVi] = useState<Category[]>([]);
  const [categoriesEn, setCategoriesEn] = useState<Category[]>([]);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [showNewCategoryEnInput, setShowNewCategoryEnInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryNameEn, setNewCategoryNameEn] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isCreatingCategoryEn, setIsCreatingCategoryEn] = useState(false);

  // Initialize form with React Hook Form
  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: {
      title: "",
      titleEn: "",
      status: "DRAFT",
      showOnHomepage: false,
      pin: false,
      description: "",
      descriptionEn: "",
      shortDescription: "",
      shortDescriptionEn: "",
      slug: "",
      categoryId: "",
      categoryEnId: "",
      featuredImage: "",
      featureImageId: "",
      featuredImageEn: "",
      featureImageEnId: "",
      metaTitle: "",
      metaTitleEn: "",
      metaDescription: "",
      metaDescriptionEn: "",
      metaKeywords: "",
      metaKeywordsEn: "",
      ...initialData,
    },
  });

  // Fetch categories for both languages
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch Vietnamese categories
        const responseVi = await authFetch("/api/categories?language=vi");
        if (responseVi.ok) {
          const dataVi = await responseVi.json();
          setCategoriesVi(dataVi.categories || []);
        }

        // Fetch English categories
        const responseEn = await authFetch("/api/categories?language=en");
        if (responseEn.ok) {
          const dataEn = await responseEn.json();
          setCategoriesEn(dataEn.categories || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  // Generate slug from text
  const generateSlug = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/&/g, "-and-") // Replace & with 'and'
      .replace(/[^\w\-]+/g, "") // Remove all non-word characters
      .replace(/\-\-+/g, "-"); // Replace multiple - with single -
  };

  // Handle title change and auto-generate slug
  const handleTitleChange = (value: string) => {
    form.setValue("title", value);

    // Only auto-generate slug if it hasn't been manually edited
    if (!isSlugManuallyEdited) {
      form.setValue("slug", generateSlug(value));
    }
  };

  // Handle slug change
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("slug", e.target.value);
    setIsSlugManuallyEdited(true);
  };

  // Handle new Vietnamese category creation
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setIsCreatingCategory(true);
    try {
      const response = await authFetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newCategoryName.trim(),
          slug: generateSlug(newCategoryName.trim()),
          language: "vi",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create category");
      }

      const newCategory = await response.json();
      setCategoriesVi([...categoriesVi, newCategory]);
      form.setValue("categoryId", newCategory.id);
      setNewCategoryName("");
      setShowNewCategoryInput(false);
      toast.success("Vietnamese category created successfully!");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create category"
      );
    } finally {
      setIsCreatingCategory(false);
    }
  };

  // Handle new English category creation
  const handleCreateCategoryEn = async () => {
    if (!newCategoryNameEn.trim()) {
      toast.error("Please enter an English category name");
      return;
    }

    setIsCreatingCategoryEn(true);
    try {
      const response = await authFetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newCategoryNameEn.trim(),
          slug: generateSlug(newCategoryNameEn.trim()),
          language: "en",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create English category");
      }

      const newCategory = await response.json();
      setCategoriesEn([...categoriesEn, newCategory]);
      form.setValue("categoryEnId", newCategory.id);
      setNewCategoryNameEn("");
      setShowNewCategoryEnInput(false);
      toast.success("English category created successfully!");
    } catch (error) {
      console.error("Error creating English category:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create English category"
      );
    } finally {
      setIsCreatingCategoryEn(false);
    }
  };

  // Handle form submission
  const onSubmit = async (data: NewsFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await authFetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          titleEn: data.titleEn || undefined,
          description: cleanContentForSubmission(data.description),
          descriptionEn: cleanContentForSubmission(data.descriptionEn),
          shortDescriptionEn: data.shortDescriptionEn || undefined,
          categoryId: data.categoryId || undefined,
          categoryEnId: data.categoryEnId || undefined,
          metaTitle: data.metaTitle || undefined,
          metaTitleEn: data.metaTitleEn || undefined,
          metaDescription: data.metaDescription || undefined,
          metaDescriptionEn: data.metaDescriptionEn || undefined,
          metaKeywords: data.metaKeywords || undefined,
          metaKeywordsEn: data.metaKeywordsEn || undefined,
        }),
      });

      if (!response.ok) {
        setIsSubmitting(false);
        const error = await response.json();
        const isArray = Array.isArray(error.error);
        if (isArray) {
          throw new Error(error.error[0].message || "Failed to create news article");
        }
        throw new Error(error.error || "Failed to create news article");
      }

      toast.success("News article created successfully!");
      router.push(ROUTES.ADMIN_NEWS);
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error creating news article:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create news article"
      );
    } finally {
     setTimeout(() => {
      setIsSubmitting(false);
     }, 1000);
    }
  };

  // Save draft to local storage
  const saveDraft = useCallback(() => {
    const formData = form.getValues();
    localStorage.setItem("news-draft", JSON.stringify(formData));
    toast.success("Draft saved");
  }, [form]);

  // Load draft from local storage
  const loadDraft = useCallback(() => {
    const savedDraft = localStorage.getItem("news-draft");
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        Object.entries(draftData).forEach(([key, value]) => {
          form.setValue(key as any, value as any);
        });
        toast.success("Draft loaded");
      } catch (error) {
        toast.error("Failed to load draft");
      }
    } else {
      toast.error("No draft found");
    }
  }, [form]);

  return {
    form,
    isSubmitting,
    isImageUploading,
    setIsImageUploading,
    isImageEnUploading,
    setIsImageEnUploading,
    handleTitleChange,
    handleSlugChange,
    isSlugManuallyEdited,
    categoriesVi,
    categoriesEn,
    showNewCategoryInput,
    setShowNewCategoryInput,
    showNewCategoryEnInput,
    setShowNewCategoryEnInput,
    newCategoryName,
    setNewCategoryName,
    newCategoryNameEn,
    setNewCategoryNameEn,
    isCreatingCategory,
    isCreatingCategoryEn,
    handleCreateCategory,
    handleCreateCategoryEn,
    onSubmit: form.handleSubmit(onSubmit),
    saveDraft,
    loadDraft,
  };
}
