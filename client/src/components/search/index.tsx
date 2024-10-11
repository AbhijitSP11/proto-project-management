"use client";

import { useSearchQuery } from "@/state/api";
import React, { useEffect, useState } from "react";
import { debounce } from "lodash";
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Globe, Users, CheckSquare, AlertCircle, FolderKanban } from 'lucide-react';
import TaskTable from "@/components/TaskTable";
import ProjectCard from "@/components/ProjectCard";
import UserCard from "@/components/UserCard";

type SearchCategory = 'All' | 'Project' | 'Team' | 'User' | 'Task' | 'Priority';

const categories: { id: SearchCategory; icon: React.ReactNode; label: string }[] = [
  { id: 'All', icon: <Globe className="h-5 w-5" />, label: 'All' },
  { id: 'Project', icon: <FolderKanban className="h-5 w-5" />, label: 'Project' },
  { id: 'Team', icon: <Users className="h-5 w-5" />, label: 'Team' },
  { id: 'User', icon: <Users className="h-5 w-5" />, label: 'User' },
  { id: 'Task', icon: <CheckSquare className="h-5 w-5" />, label: 'Task' },
  { id: 'Priority', icon: <AlertCircle className="h-5 w-5" />, label: 'Priority' }
];

const Search = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('All');
  
  const {
    data: searchResults,
    isError,
    isLoading,
  } = useSearchQuery(searchTerm, {
    skip: searchTerm.length < 2,
  });

  const handleSearch = debounce((value: string) => {
    setSearchTerm(value);
  }, 300);

  useEffect(() => {
    return handleSearch.cancel;
  }, [handleSearch]);

  const filteredResults = {
    tasks: searchResults?.tasks?.filter(() => 
      activeCategory === 'All' || activeCategory === 'Task'
    ),
    projects: searchResults?.projects?.filter(() => 
      activeCategory === 'All' || activeCategory === 'Project'
    ),
    users: searchResults?.users?.filter(() => 
      activeCategory === 'All' || activeCategory === 'User'
    ),
  };

  return (
    <div className="w-full p-4">
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full mx-auto px-4 py-2 text-left text-gray-500 border rounded-lg shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        Global search...
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[90vw] max-w-3xl p-0 gap-0">
          <div className="space-y-4 p-4 md:p-6">
            <Input 
              placeholder="Global search..." 
              className="w-full text-lg focus:outline-none focus:border-none"
              onChange={(e) => handleSearch(e.target.value)}
            />
            
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-1 rounded-md px-3 py-1.5 text-sm transition-colors ${
                    activeCategory === category.id 
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.icon}
                  <span>{category.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {isLoading && (
                <div className="flex justify-center py-8">
                  <p className="text-gray-500">Loading results...</p>
                </div>
              )}
              
              {isError && (
                <div className="flex justify-center py-8">
                  <p className="text-red-500">Error occurred while fetching search results.</p>
                </div>
              )}
              
              {!isLoading && !isError && searchResults && (
                <div className="space-y-6">
                  {filteredResults.tasks && filteredResults.tasks.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-3">Tasks</h3>
                      <div className="rounded-lg border border-gray-200 overflow-hidden">
                        <TaskTable tasks={filteredResults.tasks} />
                      </div>
                    </div>
                  )}
                  
                  {filteredResults.projects && filteredResults.projects.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-3">Projects</h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {filteredResults.projects.map((project) => (
                          <ProjectCard key={project.id} project={project} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {filteredResults.users && filteredResults.users.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-3">Users</h3>
                      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {filteredResults.users.map((user) => (
                          <UserCard key={user.userId} user={user} />
                        ))}
                      </div>
                    </div>
                  )}

                  {(!filteredResults.tasks?.length && 
                    !filteredResults.projects?.length && 
                    !filteredResults.users?.length) && (
                    <div className="flex flex-col items-center justify-center py-12">
                      <p className="text-gray-500 text-center">No results found.</p>
                      <p className="text-gray-400 text-sm mt-1">Try adjusting your search or category.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Search;