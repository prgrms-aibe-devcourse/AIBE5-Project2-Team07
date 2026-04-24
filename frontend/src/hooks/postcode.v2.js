import { useCallback, useEffect, useState } from 'react';

const POSTCODE_SCRIPT_SRC = 'https://t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

let postcodeScriptPromise = null;

function getPostcodeConstructor() {
  return window.daum?.Postcode ?? window.kakao?.Postcode ?? null;
}

function loadPostcodeScript() {
  const Postcode = getPostcodeConstructor();
  if (Postcode) {
    return Promise.resolve(Postcode);
  }

  if (!postcodeScriptPromise) {
    postcodeScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${POSTCODE_SCRIPT_SRC}"]`);

      const handleLoad = () => {
        const LoadedPostcode = getPostcodeConstructor();
        if (LoadedPostcode) {
          resolve(LoadedPostcode);
          return;
        }

        reject(new Error('카카오 우편번호 API를 사용할 수 없습니다.'));
      };

      const handleError = () => {
        reject(new Error('카카오 우편번호 스크립트를 불러오지 못했습니다.'));
      };

      if (existingScript) {
        existingScript.addEventListener('load', handleLoad, { once: true });
        existingScript.addEventListener('error', handleError, { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = POSTCODE_SCRIPT_SRC;
      script.async = true;
      script.onload = handleLoad;
      script.onerror = handleError;
      document.body.appendChild(script);
    }).catch((error) => {
      postcodeScriptPromise = null;
      throw error;
    });
  }

  return postcodeScriptPromise;
}

export default function useDaumPostcode() {
  const [isReady, setIsReady] = useState(Boolean(getPostcodeConstructor()));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isReady) {
      return;
    }

    loadPostcodeScript()
      .then(() => setIsReady(true))
      .catch((scriptError) => setError(scriptError));
  }, [isReady]);

  const ensurePostcode = useCallback(async () => {
    const Postcode = await loadPostcodeScript();
    setIsReady(true);
    return Postcode;
  }, []);

  return {
    isReady,
    error,
    ensurePostcode,
  };
}
