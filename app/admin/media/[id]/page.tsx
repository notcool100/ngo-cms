"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/image-upload";

const mediaFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  slug: z.string().min(3, {
    message: "Slug must be at least 3 characters.",
  }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug must contain only lowercase letters, numbers, and hyphens.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  mediaUrl: z.string().min(1, {
    message: "Please upload a file or enter a valid URL.",
  }),
  mediaType: z.enum(["IMAGE", "VIDEO"], {
    required_error: "Please select a media type.",
  }),
  thumbnail: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  categoryId: z.string().optional().nullable(),
});

type MediaFormValues = z.infer<typeof mediaFormSchema>;

interface Category {
  id: string;
  name: string;
}

export default function MediaEditPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const isNew = id === "new";
  const [loading, setLoading] = useState(!isNew);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<MediaFormValues>({
    resolver: zodResolver(mediaFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      mediaUrl: "",
      mediaType: "VIDEO",
      thumbnail: "",
      featured: false,
      published: false,
      categoryId: null,
    },
  });

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error",
          description: "Failed to load categories. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();

    // If editing, fetch the media data
    if (!isNew) {
      const fetchMedia = async () => {
        try {
          const response = await fetch(`/api/media/${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch media");
          }
          const data = await response.json();
          
          // Set form values
          form.reset({
            title: data.title,
            slug: data.slug,
            description: data.description,
            mediaUrl: data.mediaUrl,
            mediaType: data.mediaType === "VIDEO" || data.mediaType === "IMAGE" 
              ? data.mediaType 
              : "VIDEO", // Default to VIDEO if old type
            thumbnail: data.thumbnail || "",
            featured: data.featured,
            published: data.published,
            categoryId: data.categoryId || null,
          });
        } catch (error) {
          console.error("Error fetching media:", error);
          toast({
            title: "Error",
            description: "Failed to load media. Please try again.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };

      fetchMedia();
    }
  }, [id, isNew, form, toast]);

  const onSubmit = async (values: MediaFormValues) => {
    try {
      const method = isNew ? "POST" : "PUT";
      const url = isNew ? "/api/media" : `/api/media/${id}`;
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isNew ? "create" : "update"} media`);
      }

      toast({
        title: "Success",
        description: `Media ${isNew ? "created" : "updated"} successfully`,
      });

      router.push("/admin/media");
    } catch (error) {
      console.error(`Error ${isNew ? "creating" : "updating"} media:`, error);
      toast({
        title: "Error",
        description: `Failed to ${isNew ? "create" : "update"} media. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const generateSlug = () => {
    const title = form.getValues("title");
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      form.setValue("slug", slug, { shouldValidate: true });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">
        {isNew ? "Add New Media" : "Edit Media"}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>{isNew ? "Create a new media item" : "Update media item"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter media title"
                          {...field}
                          onBlur={(e) => {
                            field.onBlur();
                            if (!form.getValues("slug") && form.getValues("title")) {
                              generateSlug();
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        The title of your media item.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder="enter-slug-here"
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={generateSlug}
                        >
                          Generate
                        </Button>
                      </div>
                      <FormDescription>
                        The URL-friendly version of the title.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a description for this media"
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a detailed description of the media content.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="mediaType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select media type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="IMAGE">Image</SelectItem>
                          <SelectItem value="VIDEO">Video</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The type of media content.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {loadingCategories ? (
                            <SelectItem value="loading" disabled>
                              Loading categories...
                            </SelectItem>
                          ) : categories.length === 0 ? (
                            <SelectItem value="none" disabled>
                              No categories available
                            </SelectItem>
                          ) : (
                            categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Assign this media to a category (optional).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="mediaUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media File</FormLabel>
                      <FormDescription>
                        Upload a file or enter a URL for your {form.getValues("mediaType")?.toLowerCase() || "media"}.
                      </FormDescription>
                      <div className="grid grid-cols-1 gap-4">
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                        />
                        <div className="flex items-center gap-2">
                          <div className="w-full">
                            <FormControl>
                              <Input
                                placeholder={`Enter ${form.getValues("mediaType")?.toLowerCase() || "media"} URL`}
                                {...field}
                              />
                            </FormControl>
                          </div>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail</FormLabel>
                      <FormDescription>
                        Upload a thumbnail image (optional).
                      </FormDescription>
                      <ImageUpload
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Featured</FormLabel>
                        <FormDescription>
                          Display this media prominently on the site.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Published</FormLabel>
                        <FormDescription>
                          Make this media visible to the public.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/media")}
                >
                  Cancel
                </Button>
                <Button type="submit">{isNew ? "Create" : "Update"} Media</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}