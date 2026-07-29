/* ===== 数据存储管理器 ===== */

const StorageManager = {
  prefix: 'wzb_',

  get(key) {
    try {
      const raw = localStorage.getItem(this.prefix + key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error('读取数据失败:', key, e);
      return null;
    }
  },

  set(key, data) {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('保存数据失败:', key, e);
      return false;
    }
  },

  remove(key) {
    localStorage.removeItem(this.prefix + key);
  },

  genId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  },

  todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },

  add(key, record) {
    const records = this.get(key) || [];
    record.id = this.genId();
    record.createdAt = new Date().toISOString();
    records.push(record);
    this.set(key, records);
    return record;
  },

  update(key, id, updates) {
    const records = this.get(key) || [];
    const idx = records.findIndex(r => r.id === id);
    if (idx > -1) {
      records[idx] = { ...records[idx], ...updates };
      this.set(key, records);
      return records[idx];
    }
    return null;
  },

  remove(key, id) {
    const records = this.get(key) || [];
    this.set(key, records.filter(r => r.id !== id));
  },

  getByDateRange(key, startDate, endDate) {
    const records = this.get(key) || [];
    return records.filter(r => {
      const d = r.date || (r.createdAt ? r.createdAt.slice(0, 10) : '');
      return d >= startDate && d <= endDate;
    });
  },

  getByMonth(key, year, month) {
    const m = String(month).padStart(2, '0');
    const start = `${year}-${m}-01`;
    const end = `${year}-${m}-31`;
    return this.getByDateRange(key, start, end);
  },

  initIfEmpty(key, defaultData) {
    if (this.get(key) === null) {
      this.set(key, defaultData);
    }
  },

  clearAll() {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
};
