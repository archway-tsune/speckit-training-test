/**
 * UI コンポーネントスタブテンプレート
 *
 * このファイルは新規ドメインの UI スキャフォールディング時に AI エージェントが参照する
 * 構造テンプレートです。ビジネスロジックは含みません。
 *
 * 使い方:
 * 1. contracts/spec からコンポーネント名と re-export 元パスを導出する
 * 2. このテンプレートの構造パターンに従ってスタブファイルを生成する
 * 3. プレースホルダコメントを contracts から導出した具体的な定義に置換する
 *
 * 📋 ページコンポーネントとの props 結合ガイダンス:
 *
 * ❌ 禁止: props なしレンダリング（ランタイムクラッシュの原因）
 *   // ページコンポーネント内で:
 *   <ProductDetail />  // ← 必須 props が渡されていない → ランタイムクラッシュ
 *
 * ✅ 正しい: ページスタブから props を受け渡す
 *   // ページコンポーネント（page.tsx）内で:
 *   const product = await getProduct(params.id);
 *   <ProductDetail product={product} />  // ← props を明示的に渡す
 *
 * コンポーネントスタブを作成する際は、必ずページコンポーネント（page.tsx）から
 * どのように props が渡されるかを確認し、必須 props の型定義を contracts から導出すること。
 */

// --- バレルエクスポート (index.ts) ---
// TODO: contracts から導出 — コンポーネント名、re-export 元パス
// 各コンポーネントは @/templates/ からの re-export パターンに準拠する
//
// export { ComponentName, type ComponentNameProps } from "./ComponentFile";
// export { AnotherComponent, type AnotherComponentProps } from "./AnotherFile";

// --- プレースホルダコンポーネント例 ---
// TODO: contracts から導出 — コンポーネント名、Props 型

interface PlaceholderProps {
  // TODO: contracts から導出 — Props のフィールド定義
}

export function Placeholder(_props: PlaceholderProps) {
  return <div>未実装</div>;
}
