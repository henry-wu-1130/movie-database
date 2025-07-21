'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  useSortStore,
  type SortOption,
  type SortField,
  type SortDirection,
} from '@/stores/sortStore';
import { FiChevronDown, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { useT } from '@/app/i18n/client';

interface SortSelectProps {
  className?: string;
  // 排序模式：'search' 用於搜尋頁，'watchlist' 用於待看清單頁
  mode?: 'search' | 'watchlist';
  // 是否在 URL 中更新排序參數
  updateUrl?: boolean;
}

type SortOptionDisplay = {
  field: SortField;
  defaultDirection: SortDirection;
};

export default function SortSelect({ 
  className = '', 
  mode = 'watchlist', // 默認為待看清單模式
  updateUrl = false // 默認不更新 URL
}: SortSelectProps) {
  const { t } = useT('sort', {});
  
  // Define sort options with translation keys
  const sortOptions: SortOptionDisplay[] = [
    { field: 'popularity', defaultDirection: 'desc' },
    { field: 'vote_average', defaultDirection: 'desc' },
    { field: 'release_date', defaultDirection: 'desc' },
    { field: 'original_title', defaultDirection: 'asc' },
  ];
  const { searchSort, setSearchSort, watchlistSort, setWatchlistSort } = useSortStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 根據模式選擇使用的排序選項和設置函數
  const currentSort = mode === 'search' ? searchSort : watchlistSort;
  const setSort = mode === 'search' ? setSearchSort : setWatchlistSort;

  // 解析當前排序選項
  const [currentField, currentDirection] = currentSort.split('.') as [
    SortField,
    SortDirection
  ];

  // 點擊外部關閉下拉菜單
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 獲取當前排序選項
  const currentSortOption =
    sortOptions.find((option) => option.field === currentField) ||
    sortOptions[0];
    
  // Get label for the current sort option
  const getOptionLabel = (field: SortField) => {
    return t(`sort.${field}`);
  };

  // 處理排序變更 - 如果點擊相同字段，切換方向
  const handleSortChange = (option: SortOptionDisplay) => {
    let newDirection: SortDirection;

    // 如果點擊相同字段，切換方向
    if (option.field === currentField) {
      newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // 如果點擊不同字段，使用其默認方向
      newDirection = option.defaultDirection;
    }

    const newSort = `${option.field}.${newDirection}` as SortOption;
    setSort(newSort);
    setIsOpen(false);

    // 如果需要更新 URL
    if (updateUrl) {
      // 更新 URL 參數
      const params = new URLSearchParams(searchParams.toString());
      params.set('sort', newSort);

      // 使用 replace 而不是 push 來避免在歷史記錄中創建多個條目
      router.replace(`${pathname}?${params.toString()}`);
    }
    
    // 滾動回頁面頂部，提供更好的用戶體驗
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get direction icon for a sort option
  const getDirectionIcon = (field: SortField, direction: SortDirection) => {
    if (field === currentField) {
      return direction === 'asc' ? (
        <FiArrowUp className="w-4 h-4 ml-1" />
      ) : (
        <FiArrowDown className="w-4 h-4 ml-1" />
      );
    }
    return null;
  };

  // Desktop version
  const renderDesktopSort = () => (
    <div className="hidden md:flex items-center space-x-4">
      <span className="text-gray-600 dark:text-gray-300">{t('sort.label')}</span>
      <div className="flex space-x-2">
        {sortOptions.map((option) => {
          const isActive = currentField === option.field;
          const direction = isActive
            ? currentDirection
            : option.defaultDirection;

          return (
            <button
              key={option.field}
              onClick={() => handleSortChange(option)}
              className={`px-3 py-1 rounded-full text-sm flex items-center ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span>{getOptionLabel(option.field)}</span>
              {isActive && getDirectionIcon(option.field, direction)}
            </button>
          );
        })}
      </div>
    </div>
  );

  // Mobile version (dropdown)
  const renderMobileSort = () => {
    // Get current sort label
    const currentLabel = getOptionLabel(currentSortOption.field);

    return (
      <div className="relative md:hidden" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
        >
          <div className="flex items-center">
            <span>{currentLabel}</span>
            {getDirectionIcon(currentField, currentDirection)}
          </div>
          <FiChevronDown className="w-5 h-5 ml-2" />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
            {sortOptions.map((option) => {
              const isActive = currentField === option.field;
              const direction = isActive
                ? currentDirection
                : option.defaultDirection;

              return (
                <button
                  key={option.field}
                  onClick={() => handleSortChange(option)}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span>{getOptionLabel(option.field)}</span>
                  {isActive && getDirectionIcon(option.field, direction)}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={className}>
      {renderDesktopSort()}
      {renderMobileSort()}
    </div>
  );
}
