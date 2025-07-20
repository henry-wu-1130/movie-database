import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VideoPlayer } from '../VideoPlayer';
import { renderWithClient } from '@/test/utils';

describe('VideoPlayer', () => {
  it('renders video player with correct source', () => {
    renderWithClient(
      <VideoPlayer videoId="test-video-key" title="test-title" />
    );

    const iframe = screen.getByTitle('test-title');
    expect(iframe).toBeDefined();

    expect(iframe.getAttribute('src')).toBe(
      'https://www.youtube.com/embed/test-video-key'
    );
  });

  it('renders with correct aspect ratio', () => {
    renderWithClient(
      <VideoPlayer videoId="test-video-key" title="test-title" />
    );

    const container = screen.getByTitle('test-title').parentElement;
    expect(container?.className).toContain('aspect-[16/9]');
  });

  it('renders with allow fullscreen attribute', () => {
    renderWithClient(
      <VideoPlayer videoId="test-video-key" title="test-title" />
    );

    const iframe = screen.getByTitle('test-title');
    expect(iframe.getAttribute('allowFullScreen')).not.toBeNull();
  });
});
