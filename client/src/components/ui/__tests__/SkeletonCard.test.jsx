import { render, screen } from "@testing-library/react";
import { SkeletonHostelCard, SkeletonStatCard, SkeletonListItem } from "../SkeletonCard";

describe("Skeleton components", () => {
  it("SkeletonHostelCard renders with data-testid", () => {
    render(<SkeletonHostelCard />);
    expect(screen.getByTestId("skeleton-hostel-card")).toBeInTheDocument();
  });

  it("SkeletonStatCard renders without crashing", () => {
    const { container } = render(<SkeletonStatCard />);
    expect(container.firstChild).toBeTruthy();
  });

  it("SkeletonListItem renders without crashing", () => {
    const { container } = render(<SkeletonListItem />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders 8 SkeletonHostelCards correctly", () => {
    render(
      <div>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonHostelCard key={i} />
        ))}
      </div>,
    );
    expect(screen.getAllByTestId("skeleton-hostel-card")).toHaveLength(8);
  });
});
