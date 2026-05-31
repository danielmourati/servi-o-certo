import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  initialCategories, initialServices, initialProviders, initialRequests,
  type Category, type Service, type Provider, type ServiceRequest,
} from "./mock-data";

type Store = {
  categories: Category[];
  services: Service[];
  providers: Provider[];
  requests: ServiceRequest[];
  setCategories: (v: Category[] | ((p: Category[]) => Category[])) => void;
  setServices: (v: Service[] | ((p: Service[]) => Service[])) => void;
  setProviders: (v: Provider[] | ((p: Provider[]) => Provider[])) => void;
  setRequests: (v: ServiceRequest[] | ((p: ServiceRequest[]) => ServiceRequest[])) => void;
};

const StoreCtx = createContext<Store | null>(null);

const KEY = "servicospro-state-v1";

function load() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const initial = typeof window !== "undefined" ? load() : null;
  const [categories, setCategories] = useState<Category[]>(initial?.categories ?? initialCategories);
  const [services, setServices] = useState<Service[]>(initial?.services ?? initialServices);
  const [providers, setProviders] = useState<Provider[]>(initial?.providers ?? initialProviders);
  const [requests, setRequests] = useState<ServiceRequest[]>(initial?.requests ?? initialRequests);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEY, JSON.stringify({ categories, services, providers, requests }));
  }, [categories, services, providers, requests]);

  const value = useMemo(() => ({
    categories, services, providers, requests,
    setCategories, setServices, setProviders, setRequests,
  }), [categories, services, providers, requests]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
