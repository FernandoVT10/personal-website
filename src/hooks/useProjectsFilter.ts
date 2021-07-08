import React, { useState, useEffect } from "react";

import { useRouter } from "next/router";

export interface IVariables {
  page: number
  search: string
  technology: string
}

const getVariables = (): IVariables => {
  const query = new URLSearchParams(window.location.search);

  const page = query.get("page") ? parseInt(query.get("page")) || 0 : 0;
  const search = query.get("search") ?? "";
  const technology = query.get("technology") ?? "";

  return { page, search, technology }
}

const useProjectsFilter = (
  toTheChangeOfVariables: (newVariables: IVariables) => void
) => {
  const [search, setSearch] = useState("");
  const [selectedTechnology, setSelectedTechnology] = useState("");

  const router = useRouter();

  useEffect(() => {
    const variables = getVariables();

    toTheChangeOfVariables(variables);

    setSearch(variables.search);
    setSelectedTechnology(variables.technology);
  }, [router.query]);

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const query: { [key: string]: string } = {}

    if(search) query.search = search;
    if(selectedTechnology) query.technology = selectedTechnology;

    router.push({
      pathname: router.pathname,
      query
    });
  }

  return {
    search,
    setSearch,
    selectedTechnology,
    setSelectedTechnology,
    handleOnSubmit
  }
}

export default useProjectsFilter;
