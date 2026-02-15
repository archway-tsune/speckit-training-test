/**
 * ユースケーススタブテンプレート
 *
 * このファイルは新規ドメインのスキャフォールディング時に AI エージェントが参照する
 * 構造テンプレートです。ビジネスロジックは含みません。
 *
 * 使い方:
 * 1. contracts/spec の入出力仕様からユースケース名・引数・戻り値型を導出する
 * 2. このテンプレートの構造パターンに従ってスタブファイルを生成する
 * 3. プレースホルダコメントを contracts から導出した具体的な定義に置換する
 */

// TODO: contracts から導出 — ドメイン固有の型インポートパス
import type { Session } from "@/foundation/auth/session";
import { authorize } from "@/foundation/auth/authorize";
import { validate } from "@/foundation/validation/runtime";
// import { DomainInputSchema, type DomainOutput } from "@/contracts/{domain}";

// TODO: contracts から導出 — リポジトリインターフェース名とメソッド一覧
// import type { DomainRepository } from "@/contracts/{domain}";

// --- Context インターフェース ---

// TODO: contracts から導出 — リポジトリインターフェース名
interface DomainContext {
  session: Session;
  // repository: DomainRepository;
}

// --- エラーメッセージ定数 ---
// TODO: contracts/既存エラークラスから導出 — ドメイン固有のエラーメッセージ定数
// テストとスタブで同じメッセージを参照するために定数として定義する。
// 独自メッセージのハードコードは禁止。既存エラークラスのデフォルトメッセージまたは
// contracts で定義されたメッセージを使用すること。
//
// export const DOMAIN_ERROR_MESSAGES = {
//   NOT_FOUND: "指定された商品が見つかりません",     // ← NotFoundError のデフォルトメッセージと整合させる
//   FORBIDDEN: "この操作を行う権限がありません",     // ← ForbiddenError のデフォルトメッセージと整合させる
//   VALIDATION: "入力内容に誤りがあります",           // ← ValidationError のデフォルトメッセージと整合させる
// } as const;
//
// テスト側での参照方法:
// import { DOMAIN_ERROR_MESSAGES } from "@/domains/{domain}/api";
// expect(result.message).toBe(DOMAIN_ERROR_MESSAGES.NOT_FOUND);

// --- 未実装エラー ---
// NOTE: `@/foundation/errors/domain-errors` に NotImplementedError が存在する場合はそちらを import する。
// 存在しない場合のみ以下のインライン定義を使用する。

class NotImplementedError extends Error {
  constructor(operation: string) {
    super(`${operation} is not implemented`);
    this.name = "NotImplementedError";
  }
}

// --- ユースケース関数 ---

// TODO: contracts から導出 — ユースケース名、入力スキーマ名、出力型、認可ロール
// パターン: async function usecaseName(rawInput: unknown, context: DomainContext): Promise<OutputType>

export async function listItems(
  rawInput: unknown,
  context: DomainContext,
): Promise<unknown> {
  // TODO: contracts から導出 — 入力スキーマ名
  // const input = validate(ListInputSchema, rawInput);
  // authorize(context.session, "required-role");
  throw new NotImplementedError("listItems");
}

export async function getItemById(
  rawInput: unknown,
  context: DomainContext,
): Promise<unknown> {
  throw new NotImplementedError("getItemById");
}

export async function createItem(
  rawInput: unknown,
  context: DomainContext,
): Promise<unknown> {
  // TODO: contracts から導出 — 認可ロール（作成操作に必要な権限）
  // authorize(context.session, "admin");
  throw new NotImplementedError("createItem");
}

// TODO: contracts から導出 — 追加のユースケース関数（updateItem, deleteItem 等）

// --- エクスポート ---

// TODO: contracts から導出 — リポジトリ型の re-export
// export type { DomainRepository } from "@/contracts/{domain}";
export type { DomainContext };
