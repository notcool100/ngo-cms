"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";

interface EventCardProps {
  id: string;
  title: string;
  slug: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
}

export function EventCard({
  id,
  title,
  slug,
  description,
  startDate,
  endDate,
  location,
}: EventCardProps) {
  // Format date for display
  const formattedDate = new Date(startDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-muted/20"
      whileHover={{
        y: -5,
        boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)",
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/10 rounded-full p-2">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm font-medium text-primary">
            {formattedDate}
          </p>
        </div>

        <h3 className="text-xl font-bold mb-2">{title}</h3>

        {location && (
          <div className="flex items-center gap-2 mb-4 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{location}</span>
          </div>
        )}

        <p className="text-sm text-muted-foreground line-clamp-3 mb-6">
          {description}
        </p>

        <Link href={`/events/${slug}`}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="default" 
              className="rounded-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
            >
              Register Now
            </Button>
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
}