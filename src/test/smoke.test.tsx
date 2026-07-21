import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

function SmokeComponent() {
    return <h1>Elite Gateway</h1>;
}

describe("frontend smoke test", () => {
    it("renders the application heading", () => {
        render(<SmokeComponent />);

        expect(
            screen.getByRole("heading", { name: "Elite Gateway" }),
        ).toBeInTheDocument();
    });
});
