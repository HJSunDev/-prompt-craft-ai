import { defineExtensionMessaging } from '@webext-core/messaging';

// 存储消息的数据类型
interface StorageGetMessage {
  key: string;
}

interface StorageSetMessage<T = unknown> {
  key: string;
  value: T;
}

// 定义消息协议
interface ProtocolMap {
  // 原有的消息类型
  getStringLength(data: string): number;
  // 存储相关的消息类型
  storageGet(data: StorageGetMessage): Promise<unknown>;
  storageSet(data: StorageSetMessage): Promise<void>;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();
