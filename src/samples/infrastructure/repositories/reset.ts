/**
 * リポジトリ状態リセット
 * テスト用：全てのインメモリストアをクリア
 */
import { resetCartStore } from './cart';
import { resetOrderStore } from './order';

/** 全てのインメモリストアをリセット */
export function resetAllStores(): void {
  resetCartStore();
  resetOrderStore();
}

/** 指定ワーカーの buyer/admin ユーザーデータのみリセット（E2E 並列実行用） */
export function resetStoresForWorker(buyerUserId: string, adminUserId: string): void {
  const cartStore = globalThis.__sample_cartStore;
  if (cartStore) {
    cartStore.delete(buyerUserId);
    cartStore.delete(adminUserId);
  }

  const orderStore = globalThis.__sample_orderStore;
  if (orderStore) {
    for (const [id, order] of orderStore) {
      if (order.userId === buyerUserId || order.userId === adminUserId) {
        orderStore.delete(id);
      }
    }
  }
}
