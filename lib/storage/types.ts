/**
 * 存储模块配置的类型定义
 */
export interface StorageConfig<T> {
  /** 存储键名 */
  key: string;
  /** 默认值 */
  defaultValue: T;
  /** JSON Schema 定义 */
  schema: Record<string, any>;
  /** 存储描述 */
  description?: string;
}

/**
 * 存储模块实例的类型定义
 */
export interface Storage<T> {
  /** 获取值 */
  get(): Promise<T>;
  /** 设置值 */
  set(value: T): Promise<void>;
  /** 监听值变化 */
  watch(callback: (value: T) => void): () => void;
  /** 获取带默认值的值 */
  getWithDefault(): Promise<T>;
  /** 重置为默认值 */
  reset(): Promise<void>;
  /** 删除值 */
  remove(): Promise<void>;
  /** 获取存储配置 */
  getConfig(): StorageConfig<T>;
} 