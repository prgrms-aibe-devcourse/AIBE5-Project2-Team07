import React, { useRef, useState } from 'react';
import useDaumPostcode from '../hooks/postcode.v2';

function buildAddress(data) {
  const baseAddress = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;

  if (data.userSelectedType !== 'R') {
    return baseAddress;
  }

  let extraAddress = '';

  if (data.bname && /[동로가]$/u.test(data.bname)) {
    extraAddress += data.bname;
  }

  if (data.buildingName && data.apartment === 'Y') {
    extraAddress += extraAddress ? `, ${data.buildingName}` : data.buildingName;
  }

  return extraAddress ? `${baseAddress} (${extraAddress})` : baseAddress;
}

export default function AddressSearchField({
  label,
  addressName,
  detailName,
  addressValue,
  detailValue,
  onChange,
  onAddressSelect,
  required = false,
  addressPlaceholder = '주소 검색 버튼을 눌러주세요',
  detailPlaceholder = '상세 주소를 입력하세요',
  className = '',
}) {
  const { ensurePostcode, error } = useDaumPostcode();
  const wrapRef = useRef(null);
  const detailInputRef = useRef(null);
  const scrollRef = useRef(0);
  const [isOpen, setIsOpen] = useState(false);

  const foldPostcode = () => {
    if (wrapRef.current) {
      wrapRef.current.style.display = 'none';
    }
    setIsOpen(false);
    window.scrollTo({ top: scrollRef.current });
  };

  const handleSearch = async () => {
    try {
      scrollRef.current = Math.max(
        document.body.scrollTop,
        document.documentElement.scrollTop,
        window.pageYOffset || 0,
      );

      const Postcode = await ensurePostcode();

      if (!wrapRef.current) {
        return;
      }

      new Postcode({
        oncomplete: (data) => {
          onAddressSelect({
            zonecode: data.zonecode,
            address: buildAddress(data),
          });
          foldPostcode();
          setTimeout(() => detailInputRef.current?.focus(), 0);
        },
        onresize: (size) => {
          if (wrapRef.current) {
            wrapRef.current.style.height = `${size.height}px`;
          }
        },
        width: '100%',
        height: '100%',
      }).embed(wrapRef.current);

      wrapRef.current.style.display = 'block';
      wrapRef.current.style.height = '460px';
      setIsOpen(true);
    } catch (postcodeError) {
      window.alert(postcodeError.message);
    }
  };

  return (
    <div className={className}>
      <label className="block">
        <span className="text-xs font-bold text-on-surface-variant mb-2 flex items-center gap-1">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            name={addressName}
            value={addressValue}
            onChange={onChange}
            placeholder={addressPlaceholder}
            readOnly
            className="flex-1 rounded-xl border border-outline bg-background px-4 py-3.5 text-base placeholder:text-on-surface-variant/40 focus:bg-white transition-colors outline-none"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="bg-on-surface text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-black transition-colors whitespace-nowrap"
          >
            주소 검색
          </button>
        </div>
      </label>

      <label className="block mt-3">
        <span className="sr-only">상세주소</span>
        <input
          ref={detailInputRef}
          name={detailName}
          value={detailValue}
          onChange={onChange}
          placeholder={detailPlaceholder}
          className="w-full rounded-xl border border-outline bg-background px-4 py-3.5 text-base placeholder:text-on-surface-variant/40 focus:bg-white transition-colors outline-none"
        />
      </label>

      {error && (
        <p className="mt-2 text-xs text-red-500">우편번호 서비스를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</p>
      )}

      <div
        className={`mt-3 border border-outline rounded-xl bg-white overflow-hidden relative ${isOpen ? 'block' : 'hidden'}`}
      >
        <button
          type="button"
          onClick={foldPostcode}
          className="absolute right-3 top-3 z-10 w-8 h-8 rounded-full bg-white border border-outline flex items-center justify-center text-on-surface-variant hover:bg-gray-50"
          aria-label="주소 검색 닫기"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
        <div ref={wrapRef} className="w-full h-[460px]" />
      </div>
    </div>
  );
}

