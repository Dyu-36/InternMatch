'use client';

import { ReactNode, useMemo, useState } from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { useLocale, useT } from '@/context/LocaleContext';
import { Button } from '@/components/shadcn/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/shadcn/command';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover';
import { cn } from '@/lib/utils';
import { useVnProvinces, useVnWards, type VnDivisionOption } from '@/lib/use-vn-divisions';
import type { VnLocation, VnLocationField } from '@/lib/vn-divisions-types';

const TRIGGER_CLASS = 'h-11 w-full justify-between bg-white font-normal text-slate-950 hover:bg-white hover:text-slate-950 focus-visible:bg-white aria-expanded:bg-white aria-expanded:text-slate-950';

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase();
}

interface VnDivisionComboboxProps {
  id: string;
  label: string;
  labelledBy?: string;
  value: string;
  options: VnDivisionOption[];
  onChange: (code: string) => void;
  placeholder: string;
  searchPlaceholder: string;
  emptyText: string;
  loading?: boolean;
  failed?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  clearLabel?: string;
  icon?: ReactNode;
  className?: string;
  triggerClassName?: string;
}

export function VnDivisionCombobox({ id, label, labelledBy, value, options, onChange, placeholder, searchPlaceholder, emptyText, loading, failed, disabled, invalid, clearLabel, icon, className, triggerClassName }: VnDivisionComboboxProps) {
  const t = useT();
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const name = (option: VnDivisionOption) => (locale === 'en' ? option.nameEn : 'fullName' in option ? option.fullName : option.name);
  const selected = useMemo(() => options.find((option) => option.code === value), [options, value]);
  const visible = useMemo(() => {
    const term = normalize(search.trim());
    if (!term) return options;
    return options.filter((option) => normalize(`${option.name} ${option.nameEn}`).includes(term));
  }, [options, search]);

  return <div className={className}>
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button id={id} type="button" variant="outline" role="combobox" aria-label={labelledBy ? undefined : label} aria-labelledby={labelledBy} aria-expanded={open} aria-invalid={invalid} disabled={disabled} className={triggerClassName ?? TRIGGER_CLASS}>
          <span className={cn('flex min-w-0 flex-1 items-center gap-2 truncate text-left', !selected && 'text-slate-500')}>
            {icon}
            <span className="truncate">{selected ? name(selected) : placeholder}</span>
          </span>
          {loading ? <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden="true" /> : <ChevronsUpDown className="size-4 shrink-0 opacity-50" aria-hidden="true" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" collisionPadding={8} className="w-[var(--radix-popover-trigger-width)] overflow-hidden bg-white p-0 text-slate-950" style={{ maxHeight: 'var(--radix-popover-content-available-height)' }}>
        <Command shouldFilter={false} className="h-auto bg-white text-slate-950" style={{ maxHeight: 'calc(var(--radix-popover-content-available-height) - 2px)' }}>
          <CommandInput aria-label={searchPlaceholder} placeholder={searchPlaceholder} value={search} onValueChange={setSearch} />
          <CommandList className="min-h-0 max-h-72 flex-1 [scrollbar-gutter:stable]" aria-busy={loading}>
            <CommandEmpty className="text-slate-700">{loading ? t("Đang tải danh sách...") : failed ? t("Không tải được danh sách. Vui lòng thử lại.") : search.trim() ? t("Không tìm thấy phù hợp.") : emptyText}</CommandEmpty>
            {clearLabel && value ? <CommandGroup><CommandItem value="__clear__" onSelect={() => { onChange(''); setOpen(false); }}>{t(clearLabel)}</CommandItem></CommandGroup> : null}
            {visible.length > 0 ? <CommandGroup>{visible.map((option) => <CommandItem key={option.code} value={`${option.code}-${name(option)}`} onSelect={() => { onChange(option.code); setOpen(false); setSearch(''); }}>
              <Check className={cn('size-4', value === option.code ? 'opacity-100' : 'opacity-0')} aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate">{name(option)}</span>
            </CommandItem>)}</CommandGroup> : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  </div>;
}

interface VnLocationFilterProps {
  idPrefix: string;
  provinceCode: string;
  wardCode: string;
  onProvinceChange: (code: string) => void;
  onWardChange: (code: string) => void;
  className?: string;
  cellClassName?: string;
  triggerClassName?: string;
  provinceIcon?: ReactNode;
  wardIcon?: ReactNode;
}

// Two-step picker for the job search bar: a province first, then its wards.
export function VnLocationFilter({ idPrefix, provinceCode, wardCode, onProvinceChange, onWardChange, className, cellClassName, triggerClassName, provinceIcon, wardIcon }: VnLocationFilterProps) {
  const t = useT();
  const provinces = useVnProvinces();
  const wards = useVnWards(provinceCode);

  return <div className={cn('flex min-w-0 flex-col gap-3 sm:flex-row', className)}>
    <VnDivisionCombobox
      id={`${idPrefix}-province`}
      label={t("Lọc theo tỉnh / thành phố")}
      value={provinceCode}
      options={provinces.options}
      onChange={(code) => { onProvinceChange(code); onWardChange(''); }}
      placeholder={t("Tất cả tỉnh / thành phố")}
      searchPlaceholder={t("Gõ tên tỉnh / thành phố...")}
      emptyText={t("Chưa có dữ liệu tỉnh / thành phố.")}
      loading={provinces.loading}
      failed={provinces.failed}
      clearLabel="Tất cả tỉnh / thành phố"
      icon={provinceIcon}
      className={cellClassName}
      triggerClassName={triggerClassName}
    />
    <VnDivisionCombobox
      id={`${idPrefix}-ward`}
      label={t("Lọc theo xã / phường")}
      value={wardCode}
      options={wards.options}
      onChange={onWardChange}
      placeholder={t("Tất cả xã / phường")}
      searchPlaceholder={t("Gõ tên xã / phường...")}
      emptyText={t("Hãy chọn tỉnh / thành phố trước.")}
      loading={wards.loading}
      failed={wards.failed}
      disabled={!provinceCode}
      clearLabel="Tất cả xã / phường"
      icon={wardIcon}
      className={cellClassName}
      triggerClassName={triggerClassName}
    />
  </div>;
}

interface VnAddressFieldsProps {
  idPrefix: string;
  location: VnLocation;
  onChange: (next: VnLocation) => void;
  errors?: Partial<Record<VnLocationField, string>>;
}

// Province -> ward -> street: the address chain used wherever an address is written.
export function VnAddressFields({ idPrefix, location, onChange, errors }: VnAddressFieldsProps) {
  const t = useT();
  const provinces = useVnProvinces();
  const wards = useVnWards(location.provinceCode);
  const provinceLabelId = `${idPrefix}-province-label`;
  const wardLabelId = `${idPrefix}-ward-label`;

  return <>
    <div className="grid gap-2">
      <Label id={provinceLabelId} htmlFor={`${idPrefix}-province`}>{t("Tỉnh / Thành phố")}</Label>
      <VnDivisionCombobox
        id={`${idPrefix}-province`}
        label={t("Tỉnh / Thành phố")}
        labelledBy={provinceLabelId}
        value={location.provinceCode}
        options={provinces.options}
        onChange={(provinceCode) => onChange({ ...location, provinceCode, wardCode: '' })}
        placeholder={t("Chọn tỉnh / thành phố")}
        searchPlaceholder={t("Gõ tên tỉnh / thành phố...")}
        emptyText={t("Chưa có dữ liệu tỉnh / thành phố.")}
        loading={provinces.loading}
        failed={provinces.failed}
        invalid={Boolean(errors?.provinceCode)}
      />
      {errors?.provinceCode ? <p className="text-sm text-destructive" role="alert">{t(errors.provinceCode)}</p> : null}
    </div>
    <div className="grid gap-2">
      <Label id={wardLabelId} htmlFor={`${idPrefix}-ward`}>{t("Xã / Phường")}</Label>
      <VnDivisionCombobox
        id={`${idPrefix}-ward`}
        label={t("Xã / Phường")}
        labelledBy={wardLabelId}
        value={location.wardCode}
        options={wards.options}
        onChange={(wardCode) => onChange({ ...location, wardCode })}
        placeholder={t("Chọn xã / phường")}
        searchPlaceholder={t("Gõ tên xã / phường...")}
        emptyText={t("Hãy chọn tỉnh / thành phố trước.")}
        loading={wards.loading}
        failed={wards.failed}
        disabled={!location.provinceCode}
        invalid={Boolean(errors?.wardCode)}
      />
      {errors?.wardCode ? <p className="text-sm text-destructive" role="alert">{t(errors.wardCode)}</p> : null}
    </div>
    <div className="grid gap-2">
      <Label htmlFor={`${idPrefix}-address-detail`}>{t("Địa chỉ cụ thể")}</Label>
      <Input
        id={`${idPrefix}-address-detail`}
        required
        value={location.addressDetail}
        onChange={(event) => onChange({ ...location, addressDetail: event.target.value })}
        placeholder={t("Số nhà, ngõ, đường, tòa nhà...")}
        aria-invalid={Boolean(errors?.addressDetail)}
      />
      {errors?.addressDetail ? <p className="text-sm text-destructive" role="alert">{t(errors.addressDetail)}</p> : null}
    </div>
  </>;
}
