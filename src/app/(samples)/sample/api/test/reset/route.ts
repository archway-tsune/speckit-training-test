/**
 * テスト用リセットAPI
 * E2Eテスト実行時に状態をリセットするためのエンドポイント
 * workerIndex 付きリクエストで並列実行時のワーカー単位リセットに対応
 */
import { NextRequest, NextResponse } from 'next/server';
import { resetAllStores, resetStoresForWorker } from '@/samples/infrastructure/repositories/reset';
import { getWorkerUserIds } from '@/samples/infrastructure/auth';

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 });
  }

  try {
    let workerIndex: number | undefined;
    try {
      const body = await request.json();
      workerIndex = body.workerIndex;
    } catch {
      // empty body → global reset (backward compatible)
    }

    if (typeof workerIndex === 'number' && workerIndex >= 0) {
      const { buyerUserId, adminUserId } = getWorkerUserIds(workerIndex);
      resetStoresForWorker(buyerUserId, adminUserId);
    } else {
      resetAllStores();
    }

    return NextResponse.json({ success: true, message: 'Stores reset' });
  } catch (err) {
    console.error('Test reset error:', err);
    return NextResponse.json({ error: 'Reset failed' }, { status: 500 });
  }
}
