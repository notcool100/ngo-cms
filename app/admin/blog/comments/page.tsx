'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Check, X, Eye, Trash2, AlertTriangle } from 'lucide-react';
import { DataTable } from '@/components/admin/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Comment {
  id: string;
  content: string;
  name: string;
  email: string;
  website?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SPAM';
  createdAt: string;
  postId: string;
  post: {
    id: string;
    title: string;
    slug: string;
  };
}

export default function CommentsAdmin() {
  const router = useRouter();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/blog/comments');
      if (!res.ok) throw new Error('Failed to fetch comments');
      const data = await res.json();
      setComments(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load comments',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewComment = (comment: Comment) => {
    setSelectedComment(comment);
    setDialogOpen(true);
  };

  const handleStatusChange = async (id: string, status: 'APPROVED' | 'REJECTED' | 'SPAM') => {
    try {
      const res = await fetch('/api/blog/comments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update comment status');
      }

      toast({
        title: 'Success',
        description: `Comment ${status.toLowerCase()} successfully`,
      });

      fetchComments();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update comment status',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      const res = await fetch(`/api/blog/comments?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete comment');
      }
      
      toast({
        title: 'Success',
        description: 'Comment deleted successfully',
      });
      
      fetchComments();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete comment',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Approved</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Rejected</Badge>;
      case 'SPAM':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-300">Spam</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
    }
  };

  const columns: ColumnDef<Comment>[] = [
    {
      accessorKey: 'name',
      header: 'Author',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-sm text-gray-500">{row.original.email}</div>
        </div>
      ),
    },
    {
      accessorKey: 'content',
      header: 'Comment',
      cell: ({ row }) => (
        <div className="max-w-xs truncate">{row.original.content}</div>
      ),
    },
    {
      accessorKey: 'post.title',
      header: 'Post',
      cell: ({ row }) => (
        <div className="max-w-xs truncate">
          <a 
            href={`/blog/${row.original.post.slug}`} 
            target="_blank" 
            className="text-blue-600 hover:underline"
          >
            {row.original.post.title}
          </a>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => (
        <div>{new Date(row.original.createdAt).toLocaleDateString()}</div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleViewComment(row.original)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          {row.original.status === 'PENDING' && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleStatusChange(row.original.id, 'APPROVED')}
              >
                <Check className="h-4 w-4 text-green-500" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleStatusChange(row.original.id, 'REJECTED')}
              >
                <X className="h-4 w-4 text-red-500" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleStatusChange(row.original.id, 'SPAM')}
              >
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </Button>
            </>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Comments</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={comments}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {selectedComment && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Comment Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Author</h3>
                  <p className="mt-1">{selectedComment.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1">{selectedComment.email}</p>
                </div>
                {selectedComment.website && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Website</h3>
                    <p className="mt-1">
                      <a 
                        href={selectedComment.website} 
                        target="_blank" 
                        className="text-blue-600 hover:underline"
                      >
                        {selectedComment.website}
                      </a>
                    </p>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date</h3>
                  <p className="mt-1">{new Date(selectedComment.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <div className="mt-1">{getStatusBadge(selectedComment.status)}</div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Post</h3>
                  <p className="mt-1">
                    <a 
                      href={`/blog/${selectedComment.post.slug}`} 
                      target="_blank" 
                      className="text-blue-600 hover:underline"
                    >
                      {selectedComment.post.title}
                    </a>
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Comment</h3>
                <div className="mt-2 p-4 bg-gray-50 rounded-md">
                  {selectedComment.content}
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                {selectedComment.status === 'PENDING' && (
                  <>
                    <Button 
                      onClick={() => {
                        handleStatusChange(selectedComment.id, 'APPROVED');
                        setDialogOpen(false);
                      }}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        handleStatusChange(selectedComment.id, 'REJECTED');
                        setDialogOpen(false);
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        handleStatusChange(selectedComment.id, 'SPAM');
                        setDialogOpen(false);
                      }}
                    >
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Mark as Spam
                    </Button>
                  </>
                )}
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    handleDelete(selectedComment.id);
                    setDialogOpen(false);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}