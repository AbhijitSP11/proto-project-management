"use client";

import { useSearchQuery } from "@/state/api";
import React, { useEffect, useState } from "react";
import { debounce } from "lodash";
import Header from "@/components/Header";
import TaskTable from "@/components/TaskTable";
import ProjectCard from "@/components/ProjectCard";
import UserCard from "@/components/UserCard";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const {
    data: searchResults,
    isError,
    isLoading,
  } = useSearchQuery(searchTerm, {
    skip: searchTerm.length < 2,
  });

  console.log("searchResults:", searchResults)

  const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, 300);

  useEffect(() => {
    return handleSearch.cancel;
  }, [handleSearch.cancel]);

  return (
    <div className="p-8">
      <Header name="Search" />
      <div>
        <input
          type="search"
          placeholder="Search..."
          className="w-1/2 rounded border p-3 shadow"
          onChange={handleSearch}
        />
      </div>
      <div className="p-5">
        {isLoading && <p>Laoding...</p>}
        {isError && <p>Error occured while fetching search results.</p>}
        {!isLoading && !isError && searchResults && (
          <div>
            {searchResults.tasks && searchResults.tasks.length > 0 && (
              <h2>Tasks</h2>
            )}

            {searchResults.tasks && <TaskTable tasks={searchResults.tasks} />}
            
            {searchResults.projects && searchResults.projects.length > 0 && (
              <h2>Projects</h2>
            )}
            {searchResults.projects?.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
            
            {searchResults.users && searchResults.users.length > 0 && (
              <h2>Users</h2>
            )}
            {searchResults.users?.map((user) => (
                <UserCard key={user.userId} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
