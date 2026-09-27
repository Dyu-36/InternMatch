'use client';

import { ReactNode, useMemo, useState } from 'react';
import { ArrowLeft, Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { useLocale, useT } from '@/context/LocaleContext';
import { Button } from '@/components/shadcn/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/shadcn/command';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover';
import { cn } from '@/lib/utils';
import { useVnProvinces, useVnWards, type VnDivisionOption, type VnWardOption } from '@/lib/use-vn-divisions';
import { VN_WARD_LEVELS, type VnLocation, type VnLocationField, type VnWardLevel } from '@/lib/vn-divisions-types';

const TRIGGER_CLASS = 'h-11 w-full justify-between bg-white font-normal text-slate-950 hover:bg-white hover:text-slate-950 focus-visible:bg-white aria-expanded:bg-white aria-expanded:text-slate-950';
const POPOVER_CLASS = 'w-[var(--radix-popover-trigger-width)] min-w-72 overflow-hidden bg-white p-0 text-slate-950';
const POPOVER_STYLE = { maxHeight: 'var(--radix-popover-content-available-height)' };
const COMMAND_STYLE = { maxHeight: 'calc(var(--radix-popover-content-available-height) - 2px)' };

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase();
}

function isWard(option: VnDivisionOption): option is VnWardOption {
  return 'level' in option;
}

// A grouped list drops the level prefix from its items because the heading
// already names it; the flat province list keeps the full name, where the
// "Tỉnh"/"Thành phố" prefix is the only type marker.
function itemText(option: VnDivisionOption, grouped: boolean, locale: 'vi' | 'en') {
  if (locale === 'en') return option.nameEn;
  return grouped ? option.name : option.fullName;
}

function triggerText(option: VnDivisionOption, locale: 'vi' | 'en') {
  if (locale === 'en') return option.nameEn;
  return option.fullName;
}

interface DivisionItemsProps {
  options: VnDivisionOption[];
  value: string;
  onSelect: (code: string) => void;
}

// Ward lists are grouped by "Cấp" (Phường / Xã / Đặc khu) straight from the
// official dataset; provinces are not, so they stay in a single group.
function DivisionItems({ options, value, onSelect }: DivisionItemsProps) {
  const t = useT();
  const { locale } = useLocale();
  const grouped = options.some(isWard);
  const groups = grouped
    ? VN_WARD_LEVELS.map((level) => ({ level, items: options.filter((option): option is VnWardOption => isWard(option) && option.level === level) })).filter((group) => group.items.length > 0)
    : [{ level: null as VnWardLevel | null, items: options }];

  return <>{groups.map((group) => <CommandGroup key={group.level ?? 'all'} heading={group.level ? `${t(group.level)} (${group.items.length})` : undefined}>
    {group.items.map((option) => <CommandItem key={option.code} value={`${option.code}-${itemText(option, grouped, locale)}`} onSelect={() => onSelect(option.code)}>
      <Check className={cn('size-4', value === option.code ? 'opacity-100' : 'opacity-0')} aria-hidden="true" />
      <span className="min-w-0 flex-1 truncate">{itemText(option, grouped, locale)}</span>
      {'wardCount' in option ? <span className="shrink-0 text-xs text-muted-foreground">{option.wardCount}</span> : null}
    </CommandItem>)}
  </CommandGroup>)}</>;
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

  const selected = useMemo(() => options.find((option) => option.code === value), [options, value]);
  // fullName is searchable so "thành phố hà nội" and "đặc khu côn đảo" both find
  // their option, while the level prefix never hides the plain name.
  const visible = useMemo(() => {
    const term = normalize(search.trim());
    if (!term) return options;
    return options.filter((option) => normalize(`${option.name} ${option.nameEn} ${option.fullName}`).includes(term));
  }, [options, search]);

  return <div className={className}>
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button id={id} type="button" variant="outline" role="combobox" title={selected ? triggerText(selected, locale) : placeholder} aria-label={labelledBy ? undefined : label} aria-labelledby={labelledBy} aria-expanded={open} aria-invalid={invalid} disabled={disabled} className={triggerClassName ?? TRIGGER_CLASS}>
          <span className={cn('flex min-w-0 flex-1 items-center gap-2 truncate text-left', !selected && 'text-slate-500')}>
            {icon}
            <span className="truncate">{selected ? triggerText(selected, locale) : placeholder}</span>
          </span>
          {loading ? <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden="true" /> : <ChevronsUpDown className="size-4 shrink-0 opacity-50" aria-hidden="true" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" collisionPadding={8} className={POPOVER_CLASS} style={POPOVER_STYLE}>
        <Command shouldFilter={false} className="h-auto bg-white text-slate-950" style={COMMAND_STYLE}>
          <CommandInput aria-label={searchPlaceholder} placeholder={searchPlaceholder} value={search} onValueChange={setSearch} />
          <CommandList className="min-h-0 max-h-72 flex-1 [scrollbar-gutter:stable]" aria-busy={loading}>
            <CommandEmpty className="text-slate-700">{loading ? t("Đang tải danh sách...") : failed ? t("Không tải được danh sách. Vui lòng thử lại.") : search.trim() ? t("Không tìm thấy phù hợp.") : emptyText}</CommandEmpty>
            {clearLabel && value ? <CommandGroup><CommandItem value="__clear__" onSelect={() => { onChange(''); setOpen(false); }}>{t(clearLabel)}</CommandItem></CommandGroup> : null}
            {visible.length > 0 ? <DivisionItems options={visible} value={value} onSelect={(code) => { onChange(code); setOpen(false); setSearch(''); }} /> : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  </div>;
}

interface VnLocationPickerProps {
  id: string;
  label: string;
  provinceCode: string;
  wardCode: string;
  onProvinceChange: (code: string) => void;
  onWardChange: (code: string) => void;
  placeholder: string;
  provinceSearchPlaceholder: string;
  wardSearchPlaceholder: string;
  provinceEmptyText: string;
  wardEmptyText: string;
  clearLabel: string;
  clearWardLabel: string;
  backLabel: string;
  unitsLabel: string;
  icon?: ReactNode;
  className?: string;
  triggerClassName?: string;
}

// One field, two levels: the hero search row keeps a single location cell while
// the popover walks province -> ward, so a visitor never has to learn a second
// control before narrowing a search to a ward.
export function VnLocationPicker({ id, label, provinceCode, wardCode, onProvinceChange, onWardChange, placeholder, provinceSearchPlaceholder, wardSearchPlaceholder, provinceEmptyText, wardEmptyText, clearLabel, clearWardLabel, backLabel, unitsLabel, icon, className, triggerClassName }: VnLocationPickerProps) {
  const t = useT();
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'province' | 'ward'>('province');
  const [search, setSearch] = useState('');
  const provinces = useVnProvinces();
  const wards = useVnWards(provinceCode);

  const province = provinces.options.find((option) => option.code === provinceCode);
  const ward = wards.options.find((option) => option.code === wardCode);
  const onWardStep = step === 'ward';
  const options = onWardStep ? wards.options : provinces.options;
  const loading = onWardStep ? wards.loading : provinces.loading;
  const failed = onWardStep ? wards.failed : provinces.failed;
  const value = onWardStep ? wardCode : provinceCode;
  const clearItem = onWardStep ? (wardCode ? clearWardLabel : undefined) : provinceCode ? clearLabel : undefined;

  const visible = useMemo(() => {
    const term = normalize(search.trim());
    if (!term) return options;
    return options.filter((option) => normalize(`${option.name} ${option.nameEn} ${option.fullName}`).includes(term));
  }, [options, search]);

  // The pill is narrow: a chosen ward keeps its type prefix, the province is
  // shortened, and a province on its own still shows "Tỉnh"/"Thành phố".
  const provinceLabel = province ? (locale === 'en' ? province.nameEn : province.name) : '';
  const selectedText = ward ? `${triggerText(ward, locale)} · ${provinceLabel}` : province ? triggerText(province, locale) : placeholder;
  const clear = () => {
    if (onWardStep) onWardChange('');
    else {
      onProvinceChange('');
      onWardChange('');
    }
    setOpen(false);
    setSearch('');
  };

  return <div className={className}>
    <Popover open={open} onOpenChange={(next) => {
      setOpen(next);
      if (next) {
        setStep(provinceCode ? 'ward' : 'province');
        setSearch('');
      }
    }}>
      <PopoverTrigger asChild>
        <Button id={id} type="button" variant="outline" role="combobox" title={selectedText} aria-label={label} aria-expanded={open} className={triggerClassName ?? TRIGGER_CLASS}>
          <span className={cn('flex min-w-0 flex-1 items-center gap-2 truncate text-left', !(province || ward) && 'text-slate-500')}>
            {icon}
            <span className="truncate">{selectedText}</span>
          </span>
          {provinces.loading || wards.loading ? <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden="true" /> : <ChevronsUpDown className="size-4 shrink-0 opacity-50" aria-hidden="true" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" collisionPadding={8} className={POPOVER_CLASS} style={POPOVER_STYLE}>
        {onWardStep ? <div className="flex items-center gap-1 border-b border-border bg-white px-2 py-1.5">
          <Button type="button" variant="ghost" size="sm" className="h-7 shrink-0 gap-1 px-2 text-xs" onClick={() => { setStep('province'); setSearch(''); }}>
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            {t(backLabel)}
          </Button>
          <span className="min-w-0 flex-1 truncate text-right text-xs text-muted-foreground">
            {province ? triggerText(province, locale) : ''} · {wards.options.length} {t(unitsLabel)}
          </span>
        </div> : null}
        <Command shouldFilter={false} className="h-auto bg-white text-slate-950" style={COMMAND_STYLE}>
          <CommandInput aria-label={onWardStep ? wardSearchPlaceholder : provinceSearchPlaceholder} placeholder={onWardStep ? wardSearchPlaceholder : provinceSearchPlaceholder} value={search} onValueChange={setSearch} />
          <CommandList className="min-h-0 max-h-72 flex-1 [scrollbar-gutter:stable]" aria-busy={loading}>
            <CommandEmpty className="text-slate-700">{loading ? t("Đang tải danh sách...") : failed ? t("Không tải được danh sách. Vui lòng thử lại.") : search.trim() ? t("Không tìm thấy phù hợp.") : onWardStep ? wardEmptyText : provinceEmptyText}</CommandEmpty>
            {clearItem ? <CommandGroup><CommandItem value="__clear__" onSelect={clear}>{t(clearItem)}</CommandItem></CommandGroup> : null}
            {visible.length > 0 ? <DivisionItems options={visible} value={value} onSelect={(code) => {
              setSearch('');
              if (onWardStep) {
                onWardChange(code);
                setOpen(false);
                return;
              }
              // Picking a province drills into its wards in place; only the ward
              // choice ends the interaction.
              onProvinceChange(code);
              onWardChange('');
              setStep('ward');
            }} /> : null}
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
      label={t("Lọc theo xã / phường / đặc khu")}
      value={wardCode}
      options={wards.options}
      onChange={onWardChange}
      placeholder={t("Tất cả xã / phường / đặc khu")}
      searchPlaceholder={t("Gõ tên xã / phường / đặc khu...")}
      emptyText={t("Hãy chọn tỉnh / thành phố trước.")}
      loading={wards.loading}
      failed={wards.failed}
      disabled={!provinceCode}
      clearLabel="Tất cả xã / phường / đặc khu"
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
      <Label id={wardLabelId} htmlFor={`${idPrefix}-ward`}>{t("Xã / Phường / Đặc khu")}</Label>
      <VnDivisionCombobox
        id={`${idPrefix}-ward`}
        label={t("Xã / Phường / Đặc khu")}
        labelledBy={wardLabelId}
        value={location.wardCode}
        options={wards.options}
        onChange={(wardCode) => onChange({ ...location, wardCode })}
        placeholder={t("Chọn xã / phường / đặc khu")}
        searchPlaceholder={t("Gõ tên xã / phường / đặc khu...")}
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
