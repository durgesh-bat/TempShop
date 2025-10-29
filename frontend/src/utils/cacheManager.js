const CACHE_KEYS = {
  PRODUCTS: 'tempshop_products',
  CATEGORIES: 'tempshop_categories',
  PRODUCT_DETAIL: 'tempshop_product_',
};

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export const cacheManager = {
  set(key, data) {
    const cacheData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  },

  get(key) {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  },

  clear(key) {
    if (key) {
      localStorage.removeItem(key);
    } else {
      Object.values(CACHE_KEYS).forEach(k => {
        if (k.endsWith('_')) {
          Object.keys(localStorage).forEach(storageKey => {
            if (storageKey.startsWith(k)) localStorage.removeItem(storageKey);
          });
        } else {
          localStorage.removeItem(k);
        }
      });
    }
  },
};

export { CACHE_KEYS };
