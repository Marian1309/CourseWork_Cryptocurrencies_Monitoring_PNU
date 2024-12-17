import { render, screen } from '@testing-library/react';

import Example from './example';

describe('Example', () => {
  it('should render', () => {
    render(<Example />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
