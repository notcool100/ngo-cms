'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BlogSettings {
  id: string;
  postsPerPage: number;
  allowComments: boolean;
  moderateComments: boolean;
  featuredPostsCount: number;
  showRelatedPosts: boolean;
  showAuthorInfo: boolean;
  defaultCategory?: string;
  seoTitle: string;
  seoDescription: string;
}

interface Category {
  id: string;
  name: string;
}

export default function BlogSettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<BlogSettings>({
    id: '',
    postsPerPage: 10,
    allowComments: true,
    moderateComments: true,
    featuredPostsCount: 3,
    showRelatedPosts: true,
    showAuthorInfo: true,
    defaultCategory: '',
    seoTitle: 'Blog | INWOLAG',
    seoDescription: 'Latest news, stories, and updates from INWOLAG',
  });

  useEffect(() => {
    fetchSettings();
    fetchCategories();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/blog/settings');
      if (!res.ok) throw new Error('Failed to fetch blog settings');
      const data = await res.json();
      setSettings(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load blog settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/blog/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/blog/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update blog settings');
      }

      toast({
        title: 'Success',
        description: 'Blog settings updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update blog settings',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Settings</h1>
        <Button variant="outline" onClick={() => router.push('/admin/blog')}>
          Back to Blog
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="postsPerPage">Posts Per Page</Label>
                  <Input
                    id="postsPerPage"
                    name="postsPerPage"
                    type="number"
                    min="1"
                    max="50"
                    value={settings.postsPerPage}
                    onChange={handleNumberChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="featuredPostsCount">Featured Posts Count</Label>
                  <Input
                    id="featuredPostsCount"
                    name="featuredPostsCount"
                    type="number"
                    min="0"
                    max="10"
                    value={settings.featuredPostsCount}
                    onChange={handleNumberChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="defaultCategory">Default Category</Label>
                  <Select
                    value={settings.defaultCategory || ''}
                    onValueChange={(value) => handleSelectChange('defaultCategory', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a default category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="showRelatedPosts">Show Related Posts</Label>
                  <Switch
                    id="showRelatedPosts"
                    checked={settings.showRelatedPosts}
                    onCheckedChange={(checked) => handleSwitchChange('showRelatedPosts', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="showAuthorInfo">Show Author Information</Label>
                  <Switch
                    id="showAuthorInfo"
                    checked={settings.showAuthorInfo}
                    onCheckedChange={(checked) => handleSwitchChange('showAuthorInfo', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comments Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="allowComments">Allow Comments</Label>
                  <Switch
                    id="allowComments"
                    checked={settings.allowComments}
                    onCheckedChange={(checked) => handleSwitchChange('allowComments', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="moderateComments">Moderate Comments</Label>
                  <Switch
                    id="moderateComments"
                    checked={settings.moderateComments}
                    onCheckedChange={(checked) => handleSwitchChange('moderateComments', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    name="seoTitle"
                    value={settings.seoTitle}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <Input
                    id="seoDescription"
                    name="seoDescription"
                    value={settings.seoDescription}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}