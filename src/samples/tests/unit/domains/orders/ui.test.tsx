/** Orders ドメイン - UI単体テスト */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OrderList } from '@/samples/domains/orders/ui/OrderList';
import { OrderDetail } from '@/samples/domains/orders/ui/OrderDetail';
import { createMockOrder } from '@/samples/tests/helpers';

describe('OrderList', () => {
  describe('Given: loading状態', () => {
    describe('When: 注文一覧を表示する', () => {
      it('Then: ローディング表示を出す', () => {
        render(<OrderList orders={[]} isLoading={true} pagination={null} />);
        expect(screen.getByRole('status', { name: /読み込み中/i })).toBeInTheDocument();
      });
    });
  });

  describe('Given: error状態', () => {
    describe('When: 注文一覧を表示する', () => {
      it('Then: エラー表示を出す', () => {
        render(<OrderList orders={[]} isLoading={false} error="注文履歴の取得に失敗しました" pagination={null} />);
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText('注文履歴の取得に失敗しました')).toBeInTheDocument();
      });
    });
  });

  describe('Given: empty状態', () => {
    describe('When: 注文がない', () => {
      it('Then: 空状態表示を出す', () => {
        render(<OrderList orders={[]} isLoading={false} pagination={null} />);
        expect(screen.getByText(/注文履歴がありません/i)).toBeInTheDocument();
      });
    });
  });

  describe('Given: 注文データあり', () => {
    describe('When: 一覧を表示する', () => {
      it('Then: 注文一覧を表示する', () => {
        const orders = [
          createMockOrder({ status: 'pending', totalAmount: 2000 }),
          createMockOrder({ id: '550e8400-e29b-41d4-a716-446655440099', status: 'delivered', totalAmount: 5000 }),
        ];
        render(<OrderList orders={orders} isLoading={false} pagination={{ page: 1, limit: 20, total: 2, totalPages: 1 }} />);
        expect(screen.getByText('処理待ち')).toBeInTheDocument();
        expect(screen.getByText('配達完了')).toBeInTheDocument();
        expect(screen.getByText('¥2,000')).toBeInTheDocument();
        expect(screen.getByText('¥5,000')).toBeInTheDocument();
      });

      it('Then: 注文詳細へのリンクを持つ', () => {
        const orders = [createMockOrder()];
        render(<OrderList orders={orders} isLoading={false} pagination={{ page: 1, limit: 20, total: 1, totalPages: 1 }} />);
        const links = screen.getAllByRole('link');
        expect(links[0]).toHaveAttribute('href', `/orders/${orders[0].id}`);
      });
    });

    describe('When: ページネーションがある', () => {
      it('Then: 次ページボタンが動作する', async () => {
        const user = userEvent.setup();
        const onPageChange = vi.fn();
        render(<OrderList orders={[createMockOrder()]} isLoading={false} pagination={{ page: 1, limit: 20, total: 100, totalPages: 5 }} onPageChange={onPageChange} />);
        await user.click(screen.getByRole('button', { name: /次へ/i }));
        expect(onPageChange).toHaveBeenCalledWith(2);
      });
    });
  });
});

describe('OrderDetail', () => {
  describe('Given: loading状態', () => {
    describe('When: 詳細を表示する', () => {
      it('Then: ローディング表示を出す', () => {
        render(<OrderDetail order={null} isLoading={true} />);
        expect(screen.getByRole('status', { name: /読み込み中/i })).toBeInTheDocument();
      });
    });
  });

  describe('Given: error状態', () => {
    describe('When: 詳細を表示する', () => {
      it('Then: エラー表示を出す', () => {
        render(<OrderDetail order={null} isLoading={false} error="注文が見つかりません" />);
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText('注文が見つかりません')).toBeInTheDocument();
      });
    });
  });

  describe('Given: 注文データあり', () => {
    describe('When: 詳細を表示する', () => {
      it('Then: 注文情報を全て表示する', () => {
        const order = createMockOrder({
          items: [
            { productId: '550e8400-e29b-41d4-a716-446655440010', productName: '商品A', price: 1000, quantity: 2 },
            { productId: '550e8400-e29b-41d4-a716-446655440011', productName: '商品B', price: 500, quantity: 1 },
          ],
          totalAmount: 2500, status: 'confirmed',
        });
        render(<OrderDetail order={order} isLoading={false} />);
        expect(screen.getByRole('heading', { name: '注文詳細' })).toBeInTheDocument();
        expect(screen.getByText('確定済み')).toBeInTheDocument();
        expect(screen.getByText('商品A')).toBeInTheDocument();
        expect(screen.getByText('商品B')).toBeInTheDocument();
        expect(screen.getByText('¥2,500')).toBeInTheDocument();
      });
    });

    describe('When: 戻るボタンをクリックする', () => {
      it('Then: onBackコールバックを呼ぶ', async () => {
        const user = userEvent.setup();
        const onBack = vi.fn();
        render(<OrderDetail order={createMockOrder()} isLoading={false} onBack={onBack} />);
        await user.click(screen.getByRole('button', { name: /注文一覧に戻る/i }));
        expect(onBack).toHaveBeenCalled();
      });
    });
  });
});
