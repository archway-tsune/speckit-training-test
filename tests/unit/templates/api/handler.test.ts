/**
 * APIハンドラテンプレート 単体テスト
 * 既存実装へのテスト追加（ソースコード変更なし）
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createApiHandler } from '@/templates/api/handler';
import { ErrorCode } from '@/foundation/errors/handler';
import { AuditAction } from '@/foundation/logging/audit';

// モック: 依存モジュール
vi.mock('@/foundation/auth/session', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/foundation/errors/handler', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/foundation/errors/handler')>();
  return {
    ...actual,
    handleError: vi.fn().mockReturnValue({
      code: 'INTERNAL_ERROR',
      message: 'システムエラーが発生しました',
      httpStatus: 500,
    }),
    maskErrorForClient: vi.fn().mockReturnValue({
      code: 'INTERNAL_ERROR',
      message: 'システムエラーが発生しました',
    }),
  };
});

vi.mock('@/foundation/logging/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

vi.mock('@/foundation/logging/audit', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/foundation/logging/audit')>();
  return {
    ...actual,
    recordAudit: vi.fn(),
  };
});

import { getSession } from '@/foundation/auth/session';
import { handleError, maskErrorForClient } from '@/foundation/errors/handler';
import { logger } from '@/foundation/logging/logger';
import { recordAudit } from '@/foundation/logging/audit';

// ヘルパー: NextRequest 生成
function createRequest(
  url: string,
  options?: { method?: string; body?: unknown; cookies?: Record<string, string> }
): NextRequest {
  const { method = 'GET', body, cookies } = options ?? {};
  const init: { method: string; body?: string; headers?: Record<string, string> } = { method };
  if (body) {
    init.body = JSON.stringify(body);
    init.headers = { 'Content-Type': 'application/json' };
  }
  const req = new NextRequest(new URL(url, 'http://localhost:3000'), init);
  if (cookies) {
    for (const [key, value] of Object.entries(cookies)) {
      req.cookies.set(key, value);
    }
  }
  return req;
}

describe('APIハンドラテンプレート', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('認証', () => {
    it('Given requireAuthデフォルト + セッションなし, When ハンドラ実行, Then 401が返される', async () => {
      // Arrange
      const handler = createApiHandler({}, async () => ({ ok: true }));
      const req = createRequest('http://localhost:3000/api/test');

      // Act
      const res = await handler(req);
      const json = await res.json();

      // Assert
      expect(res.status).toBe(401);
      expect(json.code).toBe(ErrorCode.UNAUTHORIZED);
    });

    it('Given requireAuthデフォルト + sessionIdクッキーあり + セッション無効, When ハンドラ実行, Then 401が返される', async () => {
      // Arrange
      vi.mocked(getSession).mockResolvedValue(null);
      const handler = createApiHandler({}, async () => ({ ok: true }));
      const req = createRequest('http://localhost:3000/api/test', {
        cookies: { sessionId: 'invalid-id' },
      });

      // Act
      const res = await handler(req);
      const json = await res.json();

      // Assert
      expect(res.status).toBe(401);
      expect(json.code).toBe(ErrorCode.UNAUTHORIZED);
    });

    it('Given requireAuth=false, When セッションなしでハンドラ実行, Then 認証スキップで200が返される', async () => {
      // Arrange
      const handler = createApiHandler(
        { requireAuth: false },
        async () => ({ ok: true })
      );
      const req = createRequest('http://localhost:3000/api/test');

      // Act
      const res = await handler(req);
      const json = await res.json();

      // Assert
      expect(res.status).toBe(200);
      expect(json.ok).toBe(true);
    });

    it('Given 有効セッション, When ハンドラ実行, Then 200が返される', async () => {
      // Arrange
      vi.mocked(getSession).mockResolvedValue({ userId: 'user-1', role: 'buyer' });
      const handler = createApiHandler({}, async () => ({ data: 'result' }));
      const req = createRequest('http://localhost:3000/api/test', {
        cookies: { sessionId: 'valid-session' },
      });

      // Act
      const res = await handler(req);
      const json = await res.json();

      // Assert
      expect(res.status).toBe(200);
      expect(json.data).toBe('result');
    });
  });

  describe('ボディパース', () => {
    const bodySchema = z.object({
      name: z.string().min(1),
      price: z.number().positive(),
    });

    it('Given GETリクエスト + bodySchema定義, When ハンドラ実行, Then ボディパースはスキップされる', async () => {
      // Arrange
      vi.mocked(getSession).mockResolvedValue({ userId: 'user-1', role: 'buyer' });
      const handlerFn = vi.fn().mockResolvedValue({ ok: true });
      const handler = createApiHandler(
        { bodySchema },
        handlerFn
      );
      const req = createRequest('http://localhost:3000/api/test', {
        method: 'GET',
        cookies: { sessionId: 'valid' },
      });

      // Act
      const res = await handler(req);

      // Assert
      expect(res.status).toBe(200);
      expect(handlerFn).toHaveBeenCalledWith(
        expect.objectContaining({ body: {} })
      );
    });

    it('Given POSTリクエスト + 有効な入力, When ハンドラ実行, Then パースされたボディがハンドラに渡される', async () => {
      // Arrange
      vi.mocked(getSession).mockResolvedValue({ userId: 'user-1', role: 'buyer' });
      const handlerFn = vi.fn().mockResolvedValue({ created: true });
      const handler = createApiHandler(
        { bodySchema },
        handlerFn
      );
      const req = createRequest('http://localhost:3000/api/test', {
        method: 'POST',
        body: { name: 'テスト商品', price: 1000 },
        cookies: { sessionId: 'valid' },
      });

      // Act
      const res = await handler(req);

      // Assert
      expect(res.status).toBe(200);
      expect(handlerFn).toHaveBeenCalledWith(
        expect.objectContaining({
          body: { name: 'テスト商品', price: 1000 },
        })
      );
    });

    it('Given POSTリクエスト + バリデーションエラー, When ハンドラ実行, Then 400が返される', async () => {
      // Arrange
      vi.mocked(getSession).mockResolvedValue({ userId: 'user-1', role: 'buyer' });
      const handler = createApiHandler(
        { bodySchema },
        async () => ({ ok: true })
      );
      const req = createRequest('http://localhost:3000/api/test', {
        method: 'POST',
        body: { name: '', price: -1 },
        cookies: { sessionId: 'valid' },
      });

      // Act
      const res = await handler(req);
      const json = await res.json();

      // Assert
      expect(res.status).toBe(400);
      expect(json.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(logger.warn).toHaveBeenCalled();
    });
  });

  describe('ハンドラ実行', () => {
    it('Given 正常なハンドラ, When 実行成功, Then 200とレスポンスが返される', async () => {
      // Arrange
      vi.mocked(getSession).mockResolvedValue({ userId: 'user-1', role: 'buyer' });
      const handler = createApiHandler(
        {},
        async (ctx) => ({ userId: ctx.session?.userId })
      );
      const req = createRequest('http://localhost:3000/api/test', {
        cookies: { sessionId: 'valid' },
      });

      // Act
      const res = await handler(req);
      const json = await res.json();

      // Assert
      expect(res.status).toBe(200);
      expect(json.userId).toBe('user-1');
    });

    it('Given ハンドラが例外をスロー, When エラー発生, Then エラーマスク+適切なHTTPステータスが返される', async () => {
      // Arrange
      vi.mocked(getSession).mockResolvedValue({ userId: 'user-1', role: 'buyer' });
      vi.mocked(handleError).mockReturnValue({
        code: ErrorCode.INTERNAL_ERROR,
        message: 'システムエラーが発生しました',
        httpStatus: 500,
      });
      vi.mocked(maskErrorForClient).mockReturnValue({
        code: ErrorCode.INTERNAL_ERROR,
        message: 'システムエラーが発生しました',
      });

      const handler = createApiHandler(
        {},
        async () => { throw new Error('unexpected error'); }
      );
      const req = createRequest('http://localhost:3000/api/test', {
        cookies: { sessionId: 'valid' },
      });

      // Act
      const res = await handler(req);
      const json = await res.json();

      // Assert
      expect(res.status).toBe(500);
      expect(json.code).toBe(ErrorCode.INTERNAL_ERROR);
      expect(logger.error).toHaveBeenCalledWith('API handler error', expect.any(Error));
      expect(maskErrorForClient).toHaveBeenCalled();
      expect(handleError).toHaveBeenCalled();
    });
  });

  describe('監査ログ', () => {
    it('Given audit設定あり + セッション存在, When ハンドラ成功, Then recordAuditが呼ばれる', async () => {
      // Arrange
      vi.mocked(getSession).mockResolvedValue({ userId: 'admin-1', role: 'admin' });
      const handler = createApiHandler(
        {
          audit: {
            action: AuditAction.CREATE,
            targetType: 'product',
          },
        },
        async () => ({ id: 'new-product' })
      );
      const req = createRequest('http://localhost:3000/api/products', {
        cookies: { sessionId: 'valid' },
      });

      // Act
      await handler(req, { params: { id: 'prod-1' } });

      // Assert
      expect(recordAudit).toHaveBeenCalledWith({
        action: AuditAction.CREATE,
        actorId: 'admin-1',
        targetType: 'product',
        targetId: 'prod-1',
      });
    });

    it('Given audit設定あり + セッションなし(requireAuth=false), When ハンドラ成功, Then recordAuditは呼ばれない', async () => {
      // Arrange
      const handler = createApiHandler(
        {
          requireAuth: false,
          audit: {
            action: AuditAction.UPDATE,
            targetType: 'config',
          },
        },
        async () => ({ ok: true })
      );
      const req = createRequest('http://localhost:3000/api/config');

      // Act
      await handler(req);

      // Assert
      expect(recordAudit).not.toHaveBeenCalled();
    });

    it('Given audit設定あり + params.idなし, When ハンドラ成功, Then targetIdがunknownになる', async () => {
      // Arrange
      vi.mocked(getSession).mockResolvedValue({ userId: 'admin-1', role: 'admin' });
      const handler = createApiHandler(
        {
          audit: {
            action: AuditAction.DELETE,
            targetType: 'batch',
          },
        },
        async () => ({ deleted: true })
      );
      const req = createRequest('http://localhost:3000/api/batch', {
        cookies: { sessionId: 'valid' },
      });

      // Act
      await handler(req, { params: {} });

      // Assert
      expect(recordAudit).toHaveBeenCalledWith(
        expect.objectContaining({ targetId: 'unknown' })
      );
    });
  });
});
