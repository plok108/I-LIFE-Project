import React from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Skeleton } from './ui/skeleton';

interface LoginSkeletonProps {
  className?: string;
}

export function LoginSkeleton({ className = "" }: LoginSkeletonProps) {
  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader className="text-center">
        {/* Icon skeleton */}
        <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
        
        {/* Title skeleton */}
        <Skeleton className="h-6 w-48 mx-auto mb-2" />
        
        {/* Description skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-64 mx-auto" />
          <Skeleton className="h-4 w-40 mx-auto" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Email input skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-3 w-56" />
          </div>

          {/* Terms checkboxes skeleton */}
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Skeleton className="w-4 h-4 rounded mt-0.5" />
                <Skeleton className="h-4 w-32" />
              </div>
              
              <div className="flex items-start space-x-3">
                <Skeleton className="w-4 h-4 rounded mt-0.5" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </div>

          {/* Login button skeleton */}
          <Skeleton className="h-12 w-full rounded-lg" />

          {/* Additional info skeleton */}
          <div className="text-center">
            <Skeleton className="h-3 w-52 mx-auto" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}