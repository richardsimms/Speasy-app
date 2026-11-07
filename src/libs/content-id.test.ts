import { describe, expect, it } from 'vitest';
import { isContentId } from './content-id';

describe('isContentId', () => {
  it.each([
    '550e8400-e29b-41d4-a716-446655440000',
    '550E8400-E29B-41D4-A716-446655440000',
  ])('accepts a canonical UUID: %s', (id) => {
    expect(isContentId(id)).toBe(true);
  });

  it.each([
    '2700.jpg',
    'ibe0kpng290h1.png',
    '550e8400e29b41d4a716446655440000',
    '550e8400-e29b-41d4-a716-44665544000',
    ' 550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440000.jpg',
    '',
  ])('rejects an invalid content ID: %s', (id) => {
    expect(isContentId(id)).toBe(false);
  });
});
