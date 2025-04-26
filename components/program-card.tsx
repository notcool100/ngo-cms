"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface ProgramCardProps {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  image?: string;
  isFeatured?: boolean;
}

export function ProgramCard({
  id,
  title,
  slug,
  description,
  content = "",
  image = "/placeholder.svg?height=400&width=600",
  isFeatured = false,
}: ProgramCardProps) {
  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-muted/20 h-full flex flex-col"
      whileHover={{
        y: -5,
        boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)",
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative h-52 overflow-hidden">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        >
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {isFeatured && (
          <div className="absolute bottom-0 left-0 p-4">
            <Badge className="bg-white/90 text-primary hover:bg-white">
              Featured
            </Badge>
          </div>
        )}
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold mb-2 text-black">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        
        {content && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-6">
            {content}
          </p>
        )}

        <div className="mt-auto">
          <Link
            href={`/programs/${slug}`}
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
          >
            Learn more
            <motion.span
              className="inline-block ml-1"
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
            >
              <ArrowRight className="h-4 w-4 inline group-hover:translate-x-1 transition-transform" />
            </motion.span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}