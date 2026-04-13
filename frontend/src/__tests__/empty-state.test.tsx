import { render, screen } from '@testing-library/react';
import EmptyState from '@/components/ui/EmptyState';

describe('EmptyState', () => {
  it('should render title', () => {
    render(<EmptyState title="No posts yet" />);

    expect(screen.getByText('No posts yet')).toBeInTheDocument();
  });

  it('should render description when provided', () => {
    render(<EmptyState title="No posts yet" description="Create your first post" />);

    expect(screen.getByText('No posts yet')).toBeInTheDocument();
    expect(screen.getByText('Create your first post')).toBeInTheDocument();
  });

  it('should not render description when not provided', () => {
    render(<EmptyState title="No posts yet" />);

    const description = screen.queryByText('Create your first post');
    expect(description).not.toBeInTheDocument();
  });
});
