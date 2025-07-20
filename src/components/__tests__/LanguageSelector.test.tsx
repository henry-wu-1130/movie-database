import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithClient } from '@/test/utils';
import { LanguageSelector } from '../LanguageSelector';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => '/en',
  useParams: () => ({ lng: 'en' }),
}));

describe('LanguageSelector', () => {
  it('renders language selector button', () => {
    renderWithClient(<LanguageSelector />);

    const languageButton = screen.getByRole('button', { name: 'EN' });
    expect(languageButton).toBeDefined();
  });

  it('opens dropdown when button is clicked', async () => {
    renderWithClient(<LanguageSelector />);

    const languageButton = screen.getByRole('button', { name: 'EN' });
    fireEvent.click(languageButton);

    const englishOption = await screen.findAllByText('English');
    const chineseOption = await screen.findAllByText('繁體中文');

    expect(englishOption).toHaveLength(2);
    expect(chineseOption).toHaveLength(2);
  });
});
