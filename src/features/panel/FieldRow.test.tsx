import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FieldRow } from './FieldRow';

describe('FieldRow', () => {
  const baseProps = {
    fieldLabel: 'email',
    fieldType: 'string',
    onOpenPicker: vi.fn(),
    onClear: vi.fn(),
  };

  it('shows a "+ Prefill" button when there is no mapping', () => {
    render(<FieldRow {...baseProps} onOpenPicker={vi.fn()} onClear={vi.fn()} />);
    expect(screen.getByRole('button', { name: /\+ Prefill/i })).toBeInTheDocument();
  });

  it('opens the picker when "+ Prefill" is clicked', () => {
    const onOpenPicker = vi.fn();
    render(<FieldRow {...baseProps} onOpenPicker={onOpenPicker} onClear={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /\+ Prefill/i }));
    expect(onOpenPicker).toHaveBeenCalledOnce();
  });

  it('renders the chip with mappingLabel when a mapping exists', () => {
    render(
      <FieldRow
        {...baseProps}
        mapping={{
          targetNodeId: 'D',
          targetFieldKey: 'email',
          sourceId: 'upstream_forms',
          sourcePath: 'A.email',
          label: 'fallback',
        }}
        mappingLabel="Form A.email"
        onOpenPicker={vi.fn()}
        onClear={vi.fn()}
      />
    );
    expect(screen.getByText('Form A.email')).toBeInTheDocument();
  });

  it('calls onClear when × is clicked', () => {
    const onClear = vi.fn();
    render(
      <FieldRow
        {...baseProps}
        mapping={{
          targetNodeId: 'D',
          targetFieldKey: 'email',
          sourceId: 'upstream_forms',
          sourcePath: 'A.email',
          label: 'Form A.email',
        }}
        onOpenPicker={vi.fn()}
        onClear={onClear}
      />
    );
    fireEvent.click(screen.getByLabelText(/Clear prefill mapping for email/i));
    expect(onClear).toHaveBeenCalledOnce();
  });
});
