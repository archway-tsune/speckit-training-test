/**
 * API Route スタブテンプレート
 *
 * このファイルは Phase 2b（基盤スキャフォールディング）で AI エージェントが参照する
 * Route Handler の構造テンプレートです。ビジネスロジックは含みません。
 *
 * 使い方:
 * 1. contracts/spec から API エンドポイント一覧（パス・HTTP メソッド・対応ユースケース関数）を導出する
 * 2. このテンプレートの構造パターンに従って Route Handler スタブを生成する
 * 3. TODO コメントを contracts から導出した具体的な定義に置換する
 *
 * ファイル配置:
 * - 一覧・作成: src/app/api/{domain}/{resource}/route.ts（GET + POST）
 * - 詳細・更新・削除: src/app/api/{domain}/{resource}/[id]/route.ts（GET + PUT + DELETE）
 *
 * エラーハンドリング:
 * - ドメインスタブが throw する NotImplementedError は handleError() で捕捉される
 * - handleError() がエラーを HTTP レスポンスに変換するため、統合テストは 404 ではなく
 *   エラーレスポンスを受け取る（RED テストの失敗原因が NotImplementedError に統一される）
 */

import { NextRequest, NextResponse } from "next/server";
// TODO: contracts から導出 — ドメインユースケース関数のインポート
// import { listItems, createItem } from "@/domains/{domain}/api";
// TODO: contracts から導出 — リポジトリのインポート
// import { domainRepository } from "@/infrastructure/repositories";
import { getServerSession, createGuestSession } from "@/infrastructure/auth";
import { success, error } from "@/foundation/errors/response";
import { handleError, ErrorCode } from "@/foundation/errors/handler";
import { logger } from "@/foundation/logging/logger";

// --- 一覧・作成パターン（route.ts） ---

// TODO: contracts から導出 — 公開 API か認証必須かを判定
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    const { searchParams } = new URL(request.url);
    // TODO: contracts から導出 — クエリパラメータの抽出
    const input = {
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "20",
    };

    // TODO: contracts から導出 — ユースケース関数名・リポジトリ名
    // const result = await listItems(input, {
    //   session: session || createGuestSession(),
    //   repository: domainRepository,
    // });

    // return NextResponse.json(success(result));
    throw new Error("TODO: Replace with domain function call");
  } catch (err) {
    const result = handleError(err);
    // TODO: contracts から導出 — エンドポイントパス
    logger.error(
      "GET /api/{domain}/{resource} error:",
      err instanceof Error ? err : undefined,
    );
    return NextResponse.json(
      error(result.code, result.message, result.fieldErrors),
      { status: result.httpStatus },
    );
  }
}

// TODO: contracts から導出 — 作成操作が必要な場合のみ POST を定義
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        error(ErrorCode.UNAUTHORIZED, "ログインが必要です"),
        { status: 401 },
      );
    }

    const body = await request.json();
    // TODO: contracts から導出 — ユースケース関数名・リポジトリ名
    // const result = await createItem(body, {
    //   session,
    //   repository: domainRepository,
    // });

    // return NextResponse.json(success(result), { status: 201 });
    throw new Error("TODO: Replace with domain function call");
  } catch (err) {
    const result = handleError(err);
    logger.error(
      "POST /api/{domain}/{resource} error:",
      err instanceof Error ? err : undefined,
    );
    return NextResponse.json(
      error(result.code, result.message, result.fieldErrors),
      { status: result.httpStatus },
    );
  }
}

// --- 詳細・更新・削除パターン（[id]/route.ts） ---

// TODO: contracts から導出 — ルートパラメータ名（既存パラメータに合わせる）
// type Params = { params: Promise<{ id: string }> };

// TODO: contracts から導出 — 詳細取得（公開 API か認証必須かを判定）
// export async function GET(request: NextRequest, { params }: Params) {
//   try {
//     const session = await getServerSession();
//     const { id } = await params;
//     const result = await getItemById({ id }, {
//       session: session || createGuestSession(),
//       repository: domainRepository,
//     });
//     return NextResponse.json(success(result));
//   } catch (err) {
//     const result = handleError(err);
//     logger.error('GET /api/{domain}/{resource}/[id] error:', err instanceof Error ? err : undefined);
//     return NextResponse.json(
//       error(result.code, result.message, result.fieldErrors),
//       { status: result.httpStatus }
//     );
//   }
// }

// TODO: contracts から導出 — 更新操作が必要な場合のみ PUT を定義
// export async function PUT(request: NextRequest, { params }: Params) { ... }

// TODO: contracts から導出 — 削除操作が必要な場合のみ DELETE を定義
// export async function DELETE(request: NextRequest, { params }: Params) { ... }
