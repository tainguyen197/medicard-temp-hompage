import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { ROUTES } from "@/lib/router";
import { newsFormSchema, NewsFormValues, Category } from "./useNewsForm";
import { cleanContentForSubmission } from "@/lib/content-utils";

export function useNewsEditForm(newsId: string) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
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
    },
  });

  // Fetch categories for both languages
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch Vietnamese categories
        const responseVi = await fetch("/api/categories?language=vi");
        if (responseVi.ok) {
          const dataVi = await responseVi.json();
          setCategoriesVi(dataVi.categories || []);
        }

        // Fetch English categories
        const responseEn = await fetch("/api/categories?language=en");
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

  // Fetch news data
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`/api/news/${newsId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch news article");
        }

        const news = await response.json();

        // Set form fields with news data
        form.reset({
          title: news.title || "",
          titleEn: news.titleEn || "",
          status: news.status || "DRAFT",
          showOnHomepage: news.showOnHomepage || false,
          pin: news.pin || false,
          slug: news.slug || "",
          description: news.description || "",
          descriptionEn: news.descriptionEn || "",
          shortDescription: news.shortDescription || "",
          shortDescriptionEn: news.shortDescriptionEn || "",
          categoryId: news.categoryId || "",
          categoryEnId: news.categoryEnId || "",
          metaTitle: news.metaTitle || "",
          metaTitleEn: news.metaTitleEn || "",
          metaDescription: news.metaDescription || "",
          metaDescriptionEn: news.metaDescriptionEn || "",
          metaKeywords: news.metaKeywords || "",
          metaKeywordsEn: news.metaKeywordsEn || "",
          featuredImage: news.featureImage?.url || "",
          featureImageId: news.featureImageId || "",
          featuredImageEn: news.featureImageEn?.url || "",
          featureImageEnId: news.featureImageEnId || "",
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        toast.error("Failed to load news article");
        router.push(ROUTES.ADMIN_NEWS);
      }
    };

    fetchNews();
  }, [newsId, router, form]);

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
      const response = await fetch("/api/categories", {
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
      const response = await fetch("/api/categories", {
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
    if (data.description === "<p><br></p>") {
      toast.error("Please add content to your news article");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/news/${newsId}`, {
        method: "PUT",
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
        const error = await response.json();
        // Check if error is array and get the first error
        if (Array.isArray(error?.error)) {
          throw new Error(
            error.error[0].message || "Failed to update news article"
          );
        }
        throw new Error(error.error || "Failed to update news article");
      }

      toast.success("News article updated successfully!");
      router.push(ROUTES.ADMIN_NEWS);
      router.refresh();
    } catch (error) {
      console.error("Error updating news:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update news article"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isLoading,
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
  };
}
