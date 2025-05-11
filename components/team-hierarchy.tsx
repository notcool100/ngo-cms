"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Twitter, Linkedin, Instagram, ChevronDown, ChevronUp } from "lucide-react"
import { TeamMember } from "@/lib/interfaces/about.interface"

// Extended interface to include hierarchy information
interface HierarchicalTeamMember extends TeamMember {
  parentId?: number | null
  children?: HierarchicalTeamMember[]
  level?: number
  expanded?: boolean
}

export function TeamHierarchy({ teamMembers }: { teamMembers: TeamMember[] }) {
  const [hierarchyData, setHierarchyData] = useState<HierarchicalTeamMember[]>([])
  const [expandedNodes, setExpandedNodes] = useState<Record<number, boolean>>({})

  useEffect(() => {
    if (teamMembers && teamMembers.length > 0) {
      // Convert flat array to hierarchical structure
      const hierarchical = buildHierarchy(teamMembers)
      setHierarchyData(hierarchical)
      
      // Initialize all top-level nodes as expanded
      const initialExpanded: Record<number, boolean> = {}
      hierarchical.forEach(member => {
        initialExpanded[member.id] = true
      })
      setExpandedNodes(initialExpanded)
    }
  }, [teamMembers])

  // Function to build hierarchy from flat array using parentId
  const buildHierarchy = (members: TeamMember[]): HierarchicalTeamMember[] => {
    // First, convert all members to hierarchical format
    const hierarchicalMembers: HierarchicalTeamMember[] = members.map(member => ({
      ...member,
      children: [],
      expanded: true
    }))
    
    // Create a map for quick lookup
    const memberMap: Record<number, HierarchicalTeamMember> = {}
    hierarchicalMembers.forEach(member => {
      memberMap[member.id] = member
    })
    
    // Build the tree structure
    const rootNodes: HierarchicalTeamMember[] = []
    
    // Assign children to their parents
    hierarchicalMembers.forEach(member => {
      if (member.parentId && memberMap[member.parentId]) {
        // This member has a parent, add it to the parent's children
        memberMap[member.parentId].children.push(member)
      } else {
        // This is a root node
        rootNodes.push(member)
      }
    })
    
    // Sort root nodes by order
    rootNodes.sort((a, b) => a.order - b.order)
    
    // Sort children by order for each member
    hierarchicalMembers.forEach(member => {
      if (member.children.length > 0) {
        member.children.sort((a, b) => a.order - b.order)
      }
    })
    
    return rootNodes
  }

  const toggleExpand = (id: number) => {
    setExpandedNodes(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const renderTeamMember = (member: HierarchicalTeamMember, isRoot = false) => {
    const hasChildren = member.children && member.children.length > 0
    const isExpanded = expandedNodes[member.id] || false

    return (
      <div key={member.id} className={`relative ${isRoot ? 'mb-8' : 'ml-8 mt-4'}`}>
        {/* Connecting lines */}
        {!isRoot && (
          <div className="absolute left-0 top-0 h-full w-8 pointer-events-none">
            <div className="absolute left-0 top-0 h-1/2 w-8 border-b border-l border-gray-300 rounded-bl-xl"></div>
          </div>
        )}
        
        <div className="relative z-10">
          <motion.div
            className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row items-center p-4">
              <div className="relative h-20 w-20 md:h-24 md:w-24 flex-shrink-0 overflow-hidden rounded-full border-4 border-white shadow-md mb-4 md:mb-0">
                <Image
                  src={member.image || `/placeholder.svg?height=96&width=96&text=${member.name}`}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="md:ml-6 text-center md:text-left flex-grow">
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-primary font-medium">{member.position}</p>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{member.bio}</p>
                
                {member.socialLinks && (
                  <div className="flex mt-2 space-x-3 justify-center md:justify-start">
                    {member.socialLinks.twitter && (
                      <a
                        href={member.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-primary transition-colors"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    )}
                    {member.socialLinks.linkedin && (
                      <a
                        href={member.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-primary transition-colors"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {member.socialLinks.instagram && (
                      <a
                        href={member.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-primary transition-colors"
                      >
                        <Instagram className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>
              
              {hasChildren && (
                <button
                  onClick={() => toggleExpand(member.id)}
                  className="ml-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-600" />
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* Children */}
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="relative pl-8 mt-4"
          >
            {/* Vertical connecting line */}
            <div className="absolute left-4 top-0 h-full w-0 border-l border-gray-300"></div>
            
            <div className="space-y-4">
              {member.children.map(child => renderTeamMember(child))}
            </div>
          </motion.div>
        )}
      </div>
    )
  }

  if (!hierarchyData || hierarchyData.length === 0) {
    return <div className="text-center py-12">Loading team hierarchy...</div>
  }

  return (
    <div className="w-full">
      <div className="space-y-8">
        {hierarchyData.map(member => renderTeamMember(member, true))}
      </div>
    </div>
  )
}