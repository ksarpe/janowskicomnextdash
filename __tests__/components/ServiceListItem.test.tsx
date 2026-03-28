import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ServiceListItem } from "@/app/(dashboard)/services/ServiceListItem";

describe("ServiceListItem", () => {
  const mockService = {
    id: "1",
    clientId: "client-1",
    name: "My Awesome Service",
    description: "This is a great description.",
    duration: 45,
    price: "150",
    iconName: "Wrench",
    isActive: true,
  };

  const mockOnToggle = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  it("renders the service details correctly", () => {
    render(
      <ServiceListItem
        service={mockService}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isPending={false}
      />
    );

    // Verify name
    expect(screen.getByText("My Awesome Service")).toBeInTheDocument();
    
    // Verify description
    expect(screen.getByText("This is a great description.")).toBeInTheDocument();

    // Verify counters
    expect(screen.getByText("45 min")).toBeInTheDocument();
    expect(screen.getByText("150 PLN")).toBeInTheDocument();
  });

  it("calls onEdit when the edit button is clicked", () => {
    render(
      <ServiceListItem
        service={mockService}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isPending={false}
      />
    );

    const editBtn = screen.getByTitle("Edytuj");
    fireEvent.click(editBtn);

    expect(mockOnEdit).toHaveBeenCalledWith(mockService);
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it("displays inactive tag if the service is disabled", () => {
    render(
      <ServiceListItem
        service={{ ...mockService, isActive: false }}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isPending={false}
      />
    );

    expect(screen.getByText("Wyłączona")).toBeInTheDocument();
  });
});
