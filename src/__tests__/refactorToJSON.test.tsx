import { describe, it, expect } from 'vitest';
import refactorToJSON from '@/components/refactorToJSON/refactorToJSON';

describe('refactorToJSON', () => {
  it('should trim whitespace from both ends', () => {
    const input = '   {key=value}   ';
    const output = '{"key": "value"}';
    expect(refactorToJSON(input)).toBe(output);
  });

  it('should add missing curly braces', () => {
    const input = 'key=value';
    const output = '{"key": "value"}';
    expect(refactorToJSON(input)).toBe(output);
  });

  it('should replace equals sign with a colon', () => {
    const input = '{key=value}';
    const output = '{"key": "value"}';
    expect(refactorToJSON(input)).toBe(output);
  });

  it('should add double quotes around keys', () => {
    const input = '{key: value}';
    const output = '{"key": "value"}';
    expect(refactorToJSON(input)).toBe(output);
  });

  it('should add double quotes around unquoted string values', () => {
    const input = '{key: value}';
    const output = '{"key": "value"}';
    expect(refactorToJSON(input)).toBe(output);
  });
});
