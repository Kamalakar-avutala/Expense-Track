import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import SideNav from './SideNav';
import menuOptions from '../../menuoptions';

describe('SideNav Component', () => {
  test('renders all menu items from menuOptions', () => {
    render(
      <BrowserRouter>
        <SideNav />
      </BrowserRouter>
    );

    menuOptions.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
      const icon = screen.getByText(item.label).previousSibling;
      expect(icon).toHaveClass(item.icon);
    });
  });

  test('applies active class to current route', () => {
    const testPath = menuOptions[0].path;

    render(
      <MemoryRouter initialEntries={[testPath]}>
        <SideNav />
      </MemoryRouter>
    );

    const activeItem = screen.getByText(menuOptions[0].label).closest('.list-group-item');
    expect(activeItem).toHaveClass('active');
    expect(activeItem).toHaveClass('shadow');
  });

  test('renders correct number of navigation links', () => {
    render(
      <BrowserRouter>
        <SideNav />
      </BrowserRouter>
    );

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(menuOptions.length);
  });

  test('links have correct href attributes', () => {
    render(
      <BrowserRouter>
        <SideNav />
      </BrowserRouter>
    );

    menuOptions.forEach((item) => {
      const link = screen.getByText(item.label).closest('a');
      expect(link).toHaveAttribute('href', item.path);
    });
  });
});