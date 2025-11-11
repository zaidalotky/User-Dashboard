"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useUsers() {
  const { data, error, mutate } = useSWR<string[]>("/api/users", fetcher, {
    revalidateOnFocus: true,
  });

  const addOnlineUser = (user: string) => {
    mutate(
      (current) => {
        if (!current) return [user];
        if (!current.includes(user)) return [...current, user];
        return current;
      },
      { revalidate: false }
    );
  };

  const removeOnlineUser = (user: string) => {
    mutate(
      (current) => (current ? current.filter((u) => u !== user) : []),
      { revalidate: false }
    );
  };

  return {
    users: data || [],
    addOnlineUser,
    removeOnlineUser,
    isLoading: !error && !data,
    isError: error,
  };
}
