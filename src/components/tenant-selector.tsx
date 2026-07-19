"use client";

import { useRouter } from "next/navigation";

type Membership = {
  tenant_id: string;
  tenant_name: string;
  tenant_code: string;
};

type TenantSelectorProps = {
  memberships: Membership[];
  currentTenantId?: string;
};

export function TenantSelector({
  memberships,
  currentTenantId,
}: TenantSelectorProps) {
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTenantId = event.target.value;

    document.cookie = `nexus_active_tenant=${newTenantId}; path=/; max-age=31536000; samesite=lax`;

    router.refresh();
  };

  if (memberships.length <= 1) {
    return null;
  }

  const activeValue =
    currentTenantId || memberships[0]?.tenant_id || "";

  return (
    <div className="flex items-center space-x-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
      <label
        htmlFor="tenant-select"
        className="text-sm font-medium text-slate-300"
      >
        Espacio de trabajo:
      </label>

      <select
        id="tenant-select"
        value={activeValue}
        onChange={handleChange}
        className="block w-48 cursor-pointer appearance-none rounded-md border border-white/10 bg-slate-900 py-1 pl-3 pr-8 text-sm font-medium text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
      >
        {memberships.map((membership) => (
          <option
            key={membership.tenant_id}
            value={membership.tenant_id}
          >
            {membership.tenant_name}
          </option>
        ))}
      </select>
    </div>
  );
}