import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommonButton from './CommonButton';

export default function BrandModal({ isOpen, onClose, onSelectBrand }) {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('음식점');
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [selectedBrandName, setSelectedBrandName] = useState('');
  const [modalRightBrands, setModalRightBrands] = useState([]);
  const [modalRightLoading, setModalRightLoading] = useState(false);

  const categoryToBiz = {
    '음식점': 'FOOD_RESTAURANT',
    '카페': 'CAFE',
    '매장관리·판매(편의점/피시방)': 'RETAIL_STORE',
    '서비스': 'SERVICE',
    '운전·배달': 'DELIVERY_DRIVER',
    '물류/상하차': 'MANUAL_LABOR',
  };

  useEffect(() => {
    if (!isOpen) return;
    setSelectedBrandId(null);
    setSelectedBrandName('');
  }, [isOpen, selectedCategory]);

  useEffect(() => {
    if (!isOpen) return;
    const biz = categoryToBiz[selectedCategory];
    if (!biz) {
      setModalRightBrands([]);
      return;
    }
    setModalRightLoading(true);
    let mounted = true;
    fetch(`/api/brand/modal/right?businessType=${encodeURIComponent(biz)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data)) setModalRightBrands(data);
        else setModalRightBrands([]);
      })
      .catch((err) => {
        console.error('failed to fetch modal right brands', err);
        if (mounted) setModalRightBrands([]);
      })
      .finally(() => { if (mounted) setModalRightLoading(false); });
    return () => { mounted = false; };
  }, [isOpen, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 relative h-[70vh] overflow-hidden">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          aria-label="Close modal"
          onClick={onClose}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="p-6 h-full flex flex-col min-h-0">
          <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
            <div className="w-full md:w-1/2 border-r md:pr-6 h-full overflow-auto min-h-0">
              <h3 className="text-lg font-bold mb-4">업직종</h3>
              <ul className="space-y-3">
                {[
                  '음식점',
                  '카페',
                  '매장관리·판매(편의점/피시방)',
                  '서비스',
                  '운전·배달',
                  '물류/상하차',
                ].map((cat) => {
                  const active = selectedCategory === cat;
                  return (
                    <li key={cat}>
                      <button
                        type="button"
                        aria-pressed={active}
                        onClick={() => setSelectedCategory(cat)}
                        className={'w-full text-left px-4 py-2 rounded-lg transition-colors ' + (active ? 'bg-primary text-white' : 'hover:bg-gray-100')}
                      >
                        {cat}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="w-full md:w-1/2 md:pl-6 flex flex-col min-h-0">
              <h3 className="text-lg font-bold mb-4">브랜드</h3>
              <div className="flex-1 flex flex-col gap-3 items-start justify-start text-on-surface-variant border rounded-lg p-4 pb-6 overflow-auto min-h-0">
                {modalRightLoading ? (
                  <div className="w-full text-center py-6">로딩 중...</div>
                ) : modalRightBrands.length ? (
                  modalRightBrands.map((r) => {
                    const active = selectedBrandId === r.brandId;
                    return (
                      <button
                        key={r.brandId}
                        type="button"
                        onClick={() => {
                          setSelectedBrandId(r.brandId);
                          setSelectedBrandName(r.brandName || '');
                        }}
                        aria-pressed={active}
                        className={'w-full flex items-center justify-between text-left px-4 py-3 rounded-lg transition-colors ' + (active ? 'bg-primary text-white' : 'hover:bg-gray-50')}
                      >
                        <span className="font-medium">{r.brandName}</span>
                        <div className="flex items-center gap-4">
                          <span className={"text-sm font-bold " + (active ? 'text-white' : 'text-primary')}>급구 {r.urgentCount}</span>
                          <span className={"text-sm " + (active ? 'text-white/90' : 'text-on-surface-variant')}>일반 {r.normalCount}</span>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="w-full text-center py-6">선택한 카테고리 '{selectedCategory}'에 대한 브랜드 정보가 없습니다.</div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-center">
            <CommonButton
              size="md"
              onClick={() => {
                if (!selectedBrandId) return;
                if (typeof onSelectBrand === 'function') {
                  onSelectBrand({ brandId: selectedBrandId, brandName: selectedBrandName });
                  onClose();
                  return;
                }
                navigate(`/brand/recruits?brandId=${encodeURIComponent(selectedBrandId)}`);
                onClose();
              }}
              disabled={!selectedBrandId}
              className={selectedBrandId ? '' : 'opacity-50 cursor-not-allowed'}
            >
              이동
            </CommonButton>
          </div>
        </div>
      </div>
    </div>
  );
}

