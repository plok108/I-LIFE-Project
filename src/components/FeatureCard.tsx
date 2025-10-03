import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
  ctaText: string;
  ctaAction: () => void;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  features,
  image,
  imageAlt,
  ctaText,
  ctaAction,
  className = ""
}: FeatureCardProps) {
  return (
    <Card className={`h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${className}`}>
      <CardContent className="p-6 h-full flex flex-col">
        {/* Icon and Title */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">{title}</h3>
          </div>
        </div>

        {/* Image */}
        <div className="relative mb-4 rounded-lg overflow-hidden bg-accent">
          <img
            src={image}
            alt={imageAlt}
            className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
          {description}
        </p>

        {/* Features List */}
        <ul className="space-y-2 mb-6 flex-1">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Button 
          onClick={ctaAction}
          className="w-full focus:ring-2 focus:ring-primary focus:ring-offset-2"
          size="lg"
        >
          {ctaText}
        </Button>
      </CardContent>
    </Card>
  );
}