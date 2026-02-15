'use client';
/**
 * ProductCard コンポーネント
 * 商品データをカード形式で表示する。商品名・価格・画像（またはプレースホルダー）を表示し、
 * 商品詳細ページへのリンクを提供する。
 *
 * 使用例:
 * - 商品一覧のカード表示
 * - おすすめ商品の表示
 * - 検索結果の商品表示
 */

import React from 'react';
import Link from 'next/link';
import type { Product } from '@/contracts/catalog';
import { formatPrice } from '@/templates/ui/utils/format';

// ─────────────────────────────────────────────────────────────────
// 型定義
// ─────────────────────────────────────────────────────────────────

export interface ProductCardProps {
  /** 表示する商品データ */
  product: Product;
  /** リンクのベースパス（デフォルト: ''） */
  basePath?: string;
  /** カート追加コールバック（未指定時ボタン非表示） */
  onAddToCart?: (productId: string) => void;
}

// ─────────────────────────────────────────────────────────────────
// コンポーネント
// ─────────────────────────────────────────────────────────────────

/**
 * 商品カードコンポーネント
 */
export function ProductCard({ product, basePath = '', onAddToCart }: ProductCardProps) {
  return (
    <div className="rounded-lg border border-base-900/10 bg-white p-4 shadow-sm">
      <Link href={`${basePath}/catalog/${product.id}`} data-testid="product-card" className="block">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="mb-4 aspect-square w-full rounded-md object-cover" />
        ) : (
          <div data-testid="product-image-placeholder" className="mb-4 flex aspect-square w-full items-center justify-center rounded-md bg-base-100">
            <svg className="h-12 w-12 text-base-900/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <h3 className="text-lg font-semibold text-base-900">{product.name}</h3>
        <p className="mt-2 text-xl font-bold text-base-900">{formatPrice(product.price)}</p>
      </Link>
      {onAddToCart && (
        <button type="button" onClick={() => onAddToCart(product.id)} className="mt-4 w-full rounded-md bg-base-900 px-4 py-2 text-sm font-medium text-base-50 hover:bg-base-900/90 focus:outline-none focus:ring-2 focus:ring-base-900 focus:ring-offset-2">
          カートに追加
        </button>
      )}
    </div>
  );
}
